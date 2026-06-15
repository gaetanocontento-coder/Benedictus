import { Router, type IRouter, type Request, type Response } from "express";
import { db, bLectioTable } from "@workspace/db";
import { BListLectioQueryParams, BGetLectioParams } from "@workspace/api-zod";
import { eq, desc, and } from "drizzle-orm";
import { getBAuthUser } from "./auth";

const router: IRouter = Router();

const TIER_LEVEL: Record<string, number> = {
  pellegrino: 0,
  monaco: 1,
  abbas: 2,
};

function formatLectio(
  article: typeof bLectioTable.$inferSelect,
  userTier: string,
  includeBody: boolean
) {
  const requiredLevel = TIER_LEVEL[article.requiredTier] ?? 0;
  const userLevel = TIER_LEVEL[userTier] ?? 0;
  const hasAccess = userLevel >= requiredLevel;

  return {
    id: article.id,
    title: article.title,
    excerpt: article.excerpt,
    body: hasAccess && includeBody ? article.body : null,
    category: article.category,
    publishedAt: article.publishedAt.toISOString(),
    requiredTier: article.requiredTier,
    readingMinutes: article.readingMinutes,
  };
}

router.get("/lectio/recenti", async (req: Request, res: Response): Promise<void> => {
  const user = await getBAuthUser(req);
  const userTier = user?.tier ?? "pellegrino";

  const articles = await db
    .select()
    .from(bLectioTable)
    .where(eq(bLectioTable.requiredTier, "pellegrino"))
    .orderBy(desc(bLectioTable.publishedAt))
    .limit(3);

  res.json(articles.map((a) => formatLectio(a, userTier, false)));
});

router.get("/lectio", async (req: Request, res: Response): Promise<void> => {
  const parsed = BListLectioQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const user = await getBAuthUser(req);
  const userTier = user?.tier ?? "pellegrino";

  const { category, page = 1, limit: lim = 12 } = parsed.data;
  const offset = ((page as number) - 1) * (lim as number);

  const conditions = category
    ? [eq(bLectioTable.category, category as string)]
    : [];

  const articles = await db
    .select()
    .from(bLectioTable)
    .where(conditions.length ? and(...conditions) : undefined)
    .orderBy(desc(bLectioTable.publishedAt))
    .limit(lim as number)
    .offset(offset);

  res.json(articles.map((a) => formatLectio(a, userTier, false)));
});

router.get("/lectio/:id", async (req: Request, res: Response): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = BGetLectioParams.safeParse({ id: parseInt(raw, 10) });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [article] = await db
    .select()
    .from(bLectioTable)
    .where(eq(bLectioTable.id, params.data.id));

  if (!article) {
    res.status(404).json({ error: "Articolo non trovato" });
    return;
  }

  const user = await getBAuthUser(req);
  const userTier = user?.tier ?? "pellegrino";
  const requiredLevel = TIER_LEVEL[article.requiredTier] ?? 0;
  const userLevel = TIER_LEVEL[userTier] ?? 0;

  if (userLevel < requiredLevel) {
    res.status(403).json({ error: "Livello di abbonamento insufficiente" });
    return;
  }

  res.json(formatLectio(article, userTier, true));
});

export default router;
