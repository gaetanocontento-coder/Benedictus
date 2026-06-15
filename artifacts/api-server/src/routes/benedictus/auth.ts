import { Router, type IRouter, type Request, type Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { eq } from "drizzle-orm";
import { db, bUsersTable } from "@workspace/db";
import { BRegisterBody, BLoginBody } from "@workspace/api-zod";
import { logger } from "../../lib/logger";

const router: IRouter = Router();

const JWT_SECRET = process.env.JWT_SECRET ?? "benedictus-secret-key-change-in-production";

function signToken(userId: number): string {
  return jwt.sign({ sub: userId }, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyToken(token: string): { sub: number } | null {
  try {
    const payload = jwt.verify(token, JWT_SECRET) as unknown as { sub: number };
    return payload;
  } catch {
    return null;
  }
}

export async function getBAuthUser(req: Request): Promise<typeof bUsersTable.$inferSelect | null> {
  const auth = req.headers.authorization;
  if (!auth?.startsWith("Bearer ")) return null;
  const token = auth.slice(7);
  const payload = verifyToken(token);
  if (!payload) return null;
  const [user] = await db.select().from(bUsersTable).where(eq(bUsersTable.id, payload.sub));
  return user ?? null;
}

function formatUser(user: typeof bUsersTable.$inferSelect, token?: string) {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    tier: user.tier,
    stripeCustomerId: user.stripeCustomerId ?? null,
    stripeSubscriptionId: user.stripeSubscriptionId ?? null,
    createdAt: user.createdAt.toISOString(),
    ...(token ? { token } : {}),
  };
}

router.post("/register", async (req: Request, res: Response): Promise<void> => {
  const parsed = BRegisterBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { email, name, password } = parsed.data;

  const [existing] = await db.select().from(bUsersTable).where(eq(bUsersTable.email, email));
  if (existing) {
    res.status(409).json({ error: "Email già in uso" });
    return;
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const [user] = await db.insert(bUsersTable).values({
    email,
    name,
    passwordHash,
    tier: "pellegrino",
    isAdmin: false,
  }).returning();

  const token = signToken(user.id);
  req.log.info({ userId: user.id }, "New Benedictus user registered");
  res.status(201).json(formatUser(user, token));
});

router.post("/login", async (req: Request, res: Response): Promise<void> => {
  const parsed = BLoginBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { email, password } = parsed.data;

  const [user] = await db.select().from(bUsersTable).where(eq(bUsersTable.email, email));
  if (!user) {
    res.status(401).json({ error: "Credenziali non valide" });
    return;
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    res.status(401).json({ error: "Credenziali non valide" });
    return;
  }

  const token = signToken(user.id);
  req.log.info({ userId: user.id }, "Benedictus user logged in");
  res.json(formatUser(user, token));
});

router.get("/me", async (req: Request, res: Response): Promise<void> => {
  const user = await getBAuthUser(req);
  if (!user) {
    res.status(401).json({ error: "Non autenticato" });
    return;
  }
  res.json(formatUser(user));
});

router.post("/logout", async (_req: Request, res: Response): Promise<void> => {
  res.json({ success: true });
});

// ── Password reset (in-memory tokens, no email required in dev) ──────────
const resetTokens = new Map<string, { userId: number; expiresAt: number }>();

function generateToken(): string {
  return Array.from({ length: 32 }, () =>
    Math.floor(Math.random() * 36).toString(36)
  ).join("");
}

router.post("/forgot-password", async (req: Request, res: Response): Promise<void> => {
  const { email } = req.body as { email?: string };
  if (!email) {
    res.status(400).json({ error: "Email richiesta" });
    return;
  }

  const [user] = await db
    .select({ id: bUsersTable.id, email: bUsersTable.email })
    .from(bUsersTable)
    .where(eq(bUsersTable.email, email.toLowerCase().trim()))
    .limit(1);

  // Always respond 200 to avoid email enumeration
  if (!user) {
    res.json({ message: "Se l'email è registrata, riceverai le istruzioni." });
    return;
  }

  const token = generateToken();
  resetTokens.set(token, { userId: user.id, expiresAt: Date.now() + 60 * 60 * 1000 });

  // Cleanup expired tokens
  for (const [t, data] of resetTokens.entries()) {
    if (data.expiresAt < Date.now()) resetTokens.delete(t);
  }

  res.json({
    message: "Token generato.",
    resetToken: token,
    note: "In produzione questo token verrebbe inviato via email. In sviluppo è visibile qui.",
  });
});

router.post("/reset-password", async (req: Request, res: Response): Promise<void> => {
  const { token, newPassword } = req.body as { token?: string; newPassword?: string };

  if (!token || !newPassword) {
    res.status(400).json({ error: "Token e nuova password richiesti" });
    return;
  }
  if (newPassword.length < 8) {
    res.status(400).json({ error: "La password deve essere di almeno 8 caratteri" });
    return;
  }

  const entry = resetTokens.get(token);
  if (!entry || entry.expiresAt < Date.now()) {
    res.status(400).json({ error: "Token non valido o scaduto" });
    return;
  }

  const passwordHash = await bcrypt.hash(newPassword, 12);
  await db
    .update(bUsersTable)
    .set({ passwordHash })
    .where(eq(bUsersTable.id, entry.userId));

  resetTokens.delete(token);
  res.json({ message: "Password aggiornata con successo." });
});

export default router;
