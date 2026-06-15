import { Router, type IRouter, type Request, type Response } from "express";
import { db, bNewsletterSubscribersTable, bUsersTable, bLectioTable, bEpisodesTable } from "@workspace/db";
import { eq, count } from "drizzle-orm";
import { sql } from "drizzle-orm";

const router: IRouter = Router();

router.get("/stats", async (_req: Request, res: Response): Promise<void> => {
  const [subscriberCount] = await db
    .select({ count: count() })
    .from(bNewsletterSubscribersTable);

  const [monaciCount] = await db
    .select({ count: count() })
    .from(bUsersTable)
    .where(eq(bUsersTable.tier, "monaco"));

  const [abbatiCount] = await db
    .select({ count: count() })
    .from(bUsersTable)
    .where(eq(bUsersTable.tier, "abbas"));

  const [lectioCount] = await db
    .select({ count: count() })
    .from(bLectioTable);

  const [episodeCount] = await db
    .select({ count: count() })
    .from(bEpisodesTable);

  res.json({
    subscribers: Number(subscriberCount?.count ?? 0),
    monaciMembers: Number(monaciCount?.count ?? 0),
    abbatiMembers: Number(abbatiCount?.count ?? 0),
    lectioCount: Number(lectioCount?.count ?? 0),
    episodeCount: Number(episodeCount?.count ?? 0),
  });
});

export default router;
