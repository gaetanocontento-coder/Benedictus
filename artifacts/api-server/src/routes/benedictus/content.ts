import { Router, type IRouter, type Request, type Response } from "express";
import { db, bTestimonialsTable, bGraduatesTable } from "@workspace/db";
import { desc } from "drizzle-orm";

const router: IRouter = Router();

router.get("/testimonials", async (_req: Request, res: Response): Promise<void> => {
  const testimonials = await db
    .select()
    .from(bTestimonialsTable)
    .orderBy(desc(bTestimonialsTable.createdAt));

  res.json(
    testimonials.map((t) => ({
      id: t.id,
      quote: t.quote,
      authorName: t.authorName,
      authorRole: t.authorRole,
      photo: t.photo ?? null,
    }))
  );
});

router.get("/graduates", async (_req: Request, res: Response): Promise<void> => {
  const graduates = await db
    .select()
    .from(bGraduatesTable)
    .orderBy(desc(bGraduatesTable.votoDate));

  res.json(
    graduates.map((g) => ({
      id: g.id,
      name: g.name,
      votoDate: g.votoDate,
      message: g.message ?? null,
    }))
  );
});

export default router;
