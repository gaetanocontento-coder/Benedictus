import { Router, type IRouter, type Request, type Response } from "express";
import {
  db,
  bNewsletterSubscribersTable,
  bLectioTable,
  bEpisodesTable,
  bTestimonialsTable,
} from "@workspace/db";
import {
  BCreateLectioBody,
  BUpdateLectioBody,
  BUpdateLectioParams,
  BDeleteLectioParams,
  BCreateEpisodeBody,
  BCreateTestimonialBody,
  BDeleteTestimonialParams,
} from "@workspace/api-zod";
import { eq, desc } from "drizzle-orm";
import { getBAuthUser } from "./auth";

const router: IRouter = Router();

async function requireAdmin(req: Request, res: Response): Promise<boolean> {
  const user = await getBAuthUser(req);
  if (!user || !user.isAdmin) {
    res.status(403).json({ error: "Accesso admin richiesto" });
    return false;
  }
  return true;
}

// Subscribers
router.get("/admin/subscribers", async (req: Request, res: Response): Promise<void> => {
  if (!(await requireAdmin(req, res))) return;
  const subscribers = await db
    .select()
    .from(bNewsletterSubscribersTable)
    .orderBy(desc(bNewsletterSubscribersTable.createdAt));
  res.json(
    subscribers.map((s) => ({
      id: s.id,
      email: s.email,
      name: s.name,
      whyHere: s.whyHere ?? null,
      createdAt: s.createdAt.toISOString(),
    }))
  );
});

// Lectio CRUD
router.post("/admin/lectio", async (req: Request, res: Response): Promise<void> => {
  if (!(await requireAdmin(req, res))) return;
  const parsed = BCreateLectioBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [article] = await db
    .insert(bLectioTable)
    .values({
      ...parsed.data,
      publishedAt: new Date(),
    })
    .returning();
  res.status(201).json({
    id: article.id,
    title: article.title,
    excerpt: article.excerpt,
    body: article.body,
    category: article.category,
    publishedAt: article.publishedAt.toISOString(),
    requiredTier: article.requiredTier,
    readingMinutes: article.readingMinutes,
  });
});

router.patch("/admin/lectio/:id", async (req: Request, res: Response): Promise<void> => {
  if (!(await requireAdmin(req, res))) return;
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = BUpdateLectioParams.safeParse({ id: parseInt(raw, 10) });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const parsed = BUpdateLectioBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [article] = await db
    .update(bLectioTable)
    .set(parsed.data)
    .where(eq(bLectioTable.id, params.data.id))
    .returning();
  if (!article) {
    res.status(404).json({ error: "Articolo non trovato" });
    return;
  }
  res.json({
    id: article.id,
    title: article.title,
    excerpt: article.excerpt,
    body: article.body,
    category: article.category,
    publishedAt: article.publishedAt.toISOString(),
    requiredTier: article.requiredTier,
    readingMinutes: article.readingMinutes,
  });
});

router.delete("/admin/lectio/:id", async (req: Request, res: Response): Promise<void> => {
  if (!(await requireAdmin(req, res))) return;
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = BDeleteLectioParams.safeParse({ id: parseInt(raw, 10) });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  await db.delete(bLectioTable).where(eq(bLectioTable.id, params.data.id));
  res.sendStatus(204);
});

// Episodes
router.post("/admin/episodes", async (req: Request, res: Response): Promise<void> => {
  if (!(await requireAdmin(req, res))) return;
  const parsed = BCreateEpisodeBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [ep] = await db
    .insert(bEpisodesTable)
    .values({ ...parsed.data, publishedAt: new Date() })
    .returning();
  res.status(201).json({
    id: ep.id,
    title: ep.title,
    description: ep.description,
    embedUrl: ep.embedUrl,
    publishedAt: ep.publishedAt.toISOString(),
    durationMinutes: ep.durationMinutes,
  });
});

// Testimonials
router.post("/admin/testimonials", async (req: Request, res: Response): Promise<void> => {
  if (!(await requireAdmin(req, res))) return;
  const parsed = BCreateTestimonialBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [t] = await db.insert(bTestimonialsTable).values(parsed.data).returning();
  res.status(201).json({
    id: t.id,
    quote: t.quote,
    authorName: t.authorName,
    authorRole: t.authorRole,
    photo: t.photo ?? null,
  });
});

router.delete("/admin/testimonials/:id", async (req: Request, res: Response): Promise<void> => {
  if (!(await requireAdmin(req, res))) return;
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = BDeleteTestimonialParams.safeParse({ id: parseInt(raw, 10) });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  await db
    .delete(bTestimonialsTable)
    .where(eq(bTestimonialsTable.id, params.data.id));
  res.sendStatus(204);
});

export default router;
