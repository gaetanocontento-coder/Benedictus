import { Router } from "express";
import { db } from "@workspace/db";
import { campioniTable, materialiTable } from "@workspace/db";
import { eq, sql } from "drizzle-orm";

const router = Router();

function parseCampione(row: typeof campioniTable.$inferSelect) {
  return { ...row, createdAt: row.createdAt.toISOString() };
}

router.get("/", async (req, res) => {
  const { stato } = req.query as Record<string, string>;
  let rows = await db.select().from(campioniTable);
  if (stato) rows = rows.filter(r => r.statoSpedizione === stato);
  res.json(rows.map(parseCampione));
});

router.post("/", async (req, res) => {
  const body = req.body;
  const [row] = await db.insert(campioniTable).values({
    clienteId: body.clienteId,
    clienteNome: body.clienteNome,
    materialeId: body.materialeId,
    materialeNome: body.materialeNome,
    dataRichiesta: body.dataRichiesta,
    statoSpedizione: body.statoSpedizione || "in_attesa",
    note: body.note || null,
  }).returning();

  // increment richieste on the material
  await db.update(materialiTable)
    .set({ richieste: sql`${materialiTable.richieste} + 1` })
    .where(eq(materialiTable.id, body.materialeId));

  res.status(201).json(parseCampione(row));
});

router.patch("/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const body = req.body;
  const update: Record<string, unknown> = {};
  if (body.statoSpedizione !== undefined) update.statoSpedizione = body.statoSpedizione;
  if (body.note !== undefined) update.note = body.note;
  const [row] = await db.update(campioniTable).set(update).where(eq(campioniTable.id, id)).returning();
  if (!row) { res.status(404).json({ error: "Not found" }); return; }
  res.json(parseCampione(row));
});

export default router;
