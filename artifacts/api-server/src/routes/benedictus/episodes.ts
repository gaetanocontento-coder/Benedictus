import { Router, type IRouter, type Request, type Response } from "express";
import { db, bEpisodesTable } from "@workspace/db";
import { BGetEpisodeParams } from "@workspace/api-zod";
import { eq, desc } from "drizzle-orm";

const router: IRouter = Router();

function formatEpisode(ep: typeof bEpisodesTable.$inferSelect) {
  return {
    id: ep.id,
    title: ep.title,
    description: ep.description,
    embedUrl: ep.embedUrl,
    publishedAt: ep.publishedAt.toISOString(),
    durationMinutes: ep.durationMinutes,
  };
}

router.get("/episodes/featured", async (_req: Request, res: Response): Promise<void> => {
  const [ep] = await db
    .select()
    .from(bEpisodesTable)
    .where(eq(bEpisodesTable.isFeatured, true))
    .orderBy(desc(bEpisodesTable.publishedAt))
    .limit(1);

  if (!ep) {
    const [latest] = await db
      .select()
      .from(bEpisodesTable)
      .orderBy(desc(bEpisodesTable.publishedAt))
      .limit(1);

    if (!latest) {
      res.status(404).json({ error: "Nessun episodio trovato" });
      return;
    }
    res.json(formatEpisode(latest));
    return;
  }

  res.json(formatEpisode(ep));
});

router.get("/episodes", async (_req: Request, res: Response): Promise<void> => {
  const episodes = await db
    .select()
    .from(bEpisodesTable)
    .orderBy(desc(bEpisodesTable.publishedAt));

  res.json(episodes.map(formatEpisode));
});

router.get("/episodes/:id", async (req: Request, res: Response): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = BGetEpisodeParams.safeParse({ id: parseInt(raw, 10) });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [ep] = await db
    .select()
    .from(bEpisodesTable)
    .where(eq(bEpisodesTable.id, params.data.id));

  if (!ep) {
    res.status(404).json({ error: "Episodio non trovato" });
    return;
  }

  res.json(formatEpisode(ep));
});

export default router;
