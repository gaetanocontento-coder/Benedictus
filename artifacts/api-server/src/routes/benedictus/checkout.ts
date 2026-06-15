import { Router, type IRouter, type Request, type Response } from "express";
import { db, bUsersTable } from "@workspace/db";
import { eq, sql } from "drizzle-orm";
import { BCreateCheckoutBody } from "@workspace/api-zod";
import { getUncachableStripeClient } from "../../stripeClient";
import { getBAuthUser } from "./auth";

const router: IRouter = Router();

router.get("/subscription", async (req: Request, res: Response): Promise<void> => {
  const user = await getBAuthUser(req);
  if (!user) {
    res.json({ tier: "pellegrino", status: "none", currentPeriodEnd: null, cancelAtPeriodEnd: false });
    return;
  }

  if (!user.stripeSubscriptionId) {
    res.json({
      tier: user.tier,
      status: user.tier === "pellegrino" ? "active" : "none",
      currentPeriodEnd: null,
      cancelAtPeriodEnd: false,
    });
    return;
  }

  try {
    const result = await db.execute(
      sql`SELECT status, current_period_end, cancel_at_period_end FROM stripe.subscriptions WHERE id = ${user.stripeSubscriptionId}`
    );
    const sub = result.rows[0] as Record<string, unknown> | undefined;
    res.json({
      tier: user.tier,
      status: sub?.status ?? "unknown",
      currentPeriodEnd: sub?.current_period_end
        ? new Date(sub.current_period_end as string).toISOString()
        : null,
      cancelAtPeriodEnd: sub?.cancel_at_period_end ?? false,
    });
  } catch {
    res.json({ tier: user.tier, status: "active", currentPeriodEnd: null, cancelAtPeriodEnd: false });
  }
});

router.post("/checkout", async (req: Request, res: Response): Promise<void> => {
  const user = await getBAuthUser(req);
  if (!user) {
    res.status(401).json({ error: "Accesso richiesto" });
    return;
  }

  const parsed = BCreateCheckoutBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { priceId } = parsed.data;
  const stripe = await getUncachableStripeClient();

  let customerId = user.stripeCustomerId;
  if (!customerId) {
    const customer = await stripe.customers.create({
      email: user.email,
      name: user.name,
      metadata: { userId: String(user.id) },
    });
    customerId = customer.id;
    await db
      .update(bUsersTable)
      .set({ stripeCustomerId: customerId })
      .where(eq(bUsersTable.id, user.id));
  }

  const baseUrl =
    process.env.REPLIT_DOMAINS
      ? `https://${process.env.REPLIT_DOMAINS.split(",")[0]}`
      : "http://localhost:80";

  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    payment_method_types: ["card"],
    line_items: [{ price: priceId, quantity: 1 }],
    mode: "subscription",
    success_url: `${baseUrl}/benedictus/checkout/success`,
    cancel_url: `${baseUrl}/benedictus/checkout/cancel`,
    metadata: { userId: String(user.id) },
  });

  req.log.info({ userId: user.id }, "Stripe checkout session created");
  res.json({ url: session.url });
});

router.post("/checkout/portal", async (req: Request, res: Response): Promise<void> => {
  const user = await getBAuthUser(req);
  if (!user) {
    res.status(401).json({ error: "Accesso richiesto" });
    return;
  }

  if (!user.stripeCustomerId) {
    res.status(400).json({ error: "Nessun abbonamento attivo" });
    return;
  }

  const stripe = await getUncachableStripeClient();
  const baseUrl =
    process.env.REPLIT_DOMAINS
      ? `https://${process.env.REPLIT_DOMAINS.split(",")[0]}`
      : "http://localhost:80";

  const session = await stripe.billingPortal.sessions.create({
    customer: user.stripeCustomerId,
    return_url: `${baseUrl}/benedictus/piani`,
  });

  res.json({ url: session.url });
});

export default router;
