import { Router, type IRouter, type Request, type Response } from "express";
import { db, bWorkshopsTable, bWorkshopRegistrationsTable } from "@workspace/db";
import { BRegisterWorkshopParams } from "@workspace/api-zod";
import { eq, and, asc } from "drizzle-orm";
import { getBAuthUser } from "./auth";

const router: IRouter = Router();

router.get("/workshops", async (req: Request, res: Response): Promise<void> => {
  const user = await getBAuthUser(req);
  const workshops = await db
    .select()
    .from(bWorkshopsTable)
    .orderBy(asc(bWorkshopsTable.date));

  const result = await Promise.all(
    workshops.map(async (w) => {
      let isRegistered = false;
      if (user) {
        const [reg] = await db
          .select()
          .from(bWorkshopRegistrationsTable)
          .where(
            and(
              eq(bWorkshopRegistrationsTable.workshopId, w.id),
              eq(bWorkshopRegistrationsTable.userId, user.id)
            )
          );
        isRegistered = !!reg;
      }
      return {
        id: w.id,
        title: w.title,
        description: w.description,
        date: w.date,
        location: w.location,
        maxParticipants: w.maxParticipants,
        currentParticipants: w.currentParticipants,
        isRegistered,
      };
    })
  );

  res.json(result);
});

router.post("/workshops/:id/iscrivi", async (req: Request, res: Response): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = BRegisterWorkshopParams.safeParse({ id: parseInt(raw, 10) });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const user = await getBAuthUser(req);
  if (!user) {
    res.status(401).json({ error: "Accesso richiesto" });
    return;
  }

  const [workshop] = await db
    .select()
    .from(bWorkshopsTable)
    .where(eq(bWorkshopsTable.id, params.data.id));

  if (!workshop) {
    res.status(404).json({ error: "Workshop non trovato" });
    return;
  }

  if (workshop.currentParticipants >= workshop.maxParticipants) {
    res.status(400).json({ error: "Workshop al completo" });
    return;
  }

  const [existing] = await db
    .select()
    .from(bWorkshopRegistrationsTable)
    .where(
      and(
        eq(bWorkshopRegistrationsTable.workshopId, params.data.id),
        eq(bWorkshopRegistrationsTable.userId, user.id)
      )
    );

  if (!existing) {
    await db.insert(bWorkshopRegistrationsTable).values({
      workshopId: params.data.id,
      userId: user.id,
    });
    await db
      .update(bWorkshopsTable)
      .set({ currentParticipants: workshop.currentParticipants + 1 })
      .where(eq(bWorkshopsTable.id, params.data.id));
  }

  res.json({ success: true });
});

export default router;
