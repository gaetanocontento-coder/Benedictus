import { Router, type IRouter, type Request, type Response } from "express";
import { db, bModuleProgressTable } from "@workspace/db";
import { eq, and } from "drizzle-orm";
import { getBAuthUser } from "./auth";

const router: IRouter = Router();

function parseModuleId(raw: string): number | null {
  const n = parseInt(raw, 10);
  if (isNaN(n) || n < 1 || n > 6) return null;
  return n;
}

router.get("/percorso/progress", async (req: Request, res: Response): Promise<void> => {
  const user = await getBAuthUser(req);
  if (!user) {
    res.status(401).json({ error: "Accesso richiesto" });
    return;
  }

  const rows = await db
    .select()
    .from(bModuleProgressTable)
    .where(eq(bModuleProgressTable.userId, user.id));

  res.json(
    rows.map((p) => ({
      moduleId: p.moduleId,
      startedAt: p.startedAt,
      completedAt: p.completedAt ?? null,
    }))
  );
});

router.post("/percorso/modules/:id/inizia", async (req: Request, res: Response): Promise<void> => {
  const user = await getBAuthUser(req);
  if (!user) {
    res.status(401).json({ error: "Accesso richiesto" });
    return;
  }

  const moduleId = parseModuleId(String(req.params.id));
  if (!moduleId) {
    res.status(400).json({ error: "Modulo non valido (1-6)" });
    return;
  }

  const [existing] = await db
    .select()
    .from(bModuleProgressTable)
    .where(
      and(
        eq(bModuleProgressTable.userId, user.id),
        eq(bModuleProgressTable.moduleId, moduleId)
      )
    );

  if (!existing) {
    await db.insert(bModuleProgressTable).values({ userId: user.id, moduleId });
  }

  res.json({ success: true });
});

router.post("/percorso/modules/:id/completa", async (req: Request, res: Response): Promise<void> => {
  const user = await getBAuthUser(req);
  if (!user) {
    res.status(401).json({ error: "Accesso richiesto" });
    return;
  }

  const moduleId = parseModuleId(String(req.params.id));
  if (!moduleId) {
    res.status(400).json({ error: "Modulo non valido (1-6)" });
    return;
  }

  const [existing] = await db
    .select()
    .from(bModuleProgressTable)
    .where(
      and(
        eq(bModuleProgressTable.userId, user.id),
        eq(bModuleProgressTable.moduleId, moduleId)
      )
    );

  if (existing) {
    await db
      .update(bModuleProgressTable)
      .set({ completedAt: new Date() })
      .where(
        and(
          eq(bModuleProgressTable.userId, user.id),
          eq(bModuleProgressTable.moduleId, moduleId)
        )
      );
  } else {
    await db
      .insert(bModuleProgressTable)
      .values({ userId: user.id, moduleId, completedAt: new Date() });
  }

  res.json({ success: true });
});

export default router;
