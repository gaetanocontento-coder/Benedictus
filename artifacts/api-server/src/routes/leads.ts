import { Router } from "express";
import { db } from "@workspace/db";
import { leadsTable } from "@workspace/db";
import { eq, sql, count } from "drizzle-orm";

const router = Router();

router.get("/stats/per-stato", async (_req, res) => {
  const rows = await db
    .select({ stato: leadsTable.stato, count: count() })
    .from(leadsTable)
    .groupBy(leadsTable.stato);
  res.json(rows.map(r => ({ stato: r.stato, count: Number(r.count) })));
});

router.get("/", async (req, res) => {
  let query = db.select().from(leadsTable).$dynamic();
  const { stato, fonte, interesse } = req.query as Record<string, string>;
  const conditions = [];
  if (stato) conditions.push(eq(leadsTable.stato, stato));
  if (fonte) conditions.push(eq(leadsTable.fonte, fonte));
  if (interesse) conditions.push(eq(leadsTable.interesse, interesse));
  if (conditions.length === 1) {
    query = query.where(conditions[0]);
  } else if (conditions.length > 1) {
    query = query.where(sql`${conditions[0]} AND ${conditions[1]}`);
  }
  const rows = await query;
  res.json(rows.map(r => ({ ...r, createdAt: r.createdAt.toISOString() })));
});

router.post("/", async (req, res) => {
  const body = req.body;
  const [row] = await db.insert(leadsTable).values({
    nomeAzienda: body.nomeAzienda,
    referente: body.referente,
    email: body.email,
    telefono: body.telefono,
    fonte: body.fonte,
    interesse: body.interesse,
    stato: body.stato || "nuovo",
    commercialeAssegnato: body.commercialeAssegnato,
    note: body.note || null,
  }).returning();
  res.status(201).json({ ...row, createdAt: row.createdAt.toISOString() });
});

router.get("/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const [row] = await db.select().from(leadsTable).where(eq(leadsTable.id, id));
  if (!row) { res.status(404).json({ error: "Not found" }); return; }
  res.json({ ...row, createdAt: row.createdAt.toISOString() });
});

router.patch("/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const body = req.body;
  const update: Record<string, unknown> = {};
  if (body.nomeAzienda !== undefined) update.nomeAzienda = body.nomeAzienda;
  if (body.referente !== undefined) update.referente = body.referente;
  if (body.email !== undefined) update.email = body.email;
  if (body.telefono !== undefined) update.telefono = body.telefono;
  if (body.fonte !== undefined) update.fonte = body.fonte;
  if (body.interesse !== undefined) update.interesse = body.interesse;
  if (body.stato !== undefined) update.stato = body.stato;
  if (body.commercialeAssegnato !== undefined) update.commercialeAssegnato = body.commercialeAssegnato;
  if (body.note !== undefined) update.note = body.note;
  const [row] = await db.update(leadsTable).set(update).where(eq(leadsTable.id, id)).returning();
  if (!row) { res.status(404).json({ error: "Not found" }); return; }
  res.json({ ...row, createdAt: row.createdAt.toISOString() });
});

router.delete("/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  await db.delete(leadsTable).where(eq(leadsTable.id, id));
  res.status(204).send();
});

export default router;
