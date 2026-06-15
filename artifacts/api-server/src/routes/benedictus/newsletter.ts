import { Router, type IRouter, type Request, type Response } from "express";
import { db, bNewsletterSubscribersTable } from "@workspace/db";
import { BSubscribeNewsletterBody } from "@workspace/api-zod";
import { eq } from "drizzle-orm";

const router: IRouter = Router();

router.post("/newsletter", async (req: Request, res: Response): Promise<void> => {
  const parsed = BSubscribeNewsletterBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { email, name, whyHere } = parsed.data;

  const [existing] = await db
    .select()
    .from(bNewsletterSubscribersTable)
    .where(eq(bNewsletterSubscribersTable.email, email));

  if (existing) {
    res.status(201).json({ success: true });
    return;
  }

  await db.insert(bNewsletterSubscribersTable).values({
    email,
    name,
    whyHere: whyHere ?? null,
  });

  req.log.info({ email }, "New newsletter subscriber");
  res.status(201).json({ success: true });
});

export default router;
