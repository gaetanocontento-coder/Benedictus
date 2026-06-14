import { Router } from "express";
import { db } from "@workspace/db";
import { clientiTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router = Router();

function parseCliente(row: typeof clientiTable.$inferSelect) {
  return {
    ...row,
    materialiInteresse: JSON.parse(row.materialiInteresse || "[]"),
    createdAt: row.createdAt.toISOString(),
  };
}

router.get("/", async (_req, res) => {
  const rows = await db.select().from(clientiTable);
  res.json(rows.map(parseCliente));
});

router.post("/", async (req, res) => {
  const body = req.body;
  const [row] = await db.insert(clientiTable).values({
    nomeAzienda: body.nomeAzienda,
    referente: body.referente,
    email: body.email,
    telefono: body.telefono,
    settore: body.settore,
    indirizzo: body.indirizzo || null,
    materialiInteresse: JSON.stringify(body.materialiInteresse || []),
    priorita: body.priorita || "media",
    prossimAzione: body.prossimAzione || null,
    note: body.note || null,
  }).returning();
  res.status(201).json(parseCliente(row));
});

router.get("/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const [row] = await db.select().from(clientiTable).where(eq(clientiTable.id, id));
  if (!row) { res.status(404).json({ error: "Not found" }); return; }
  res.json(parseCliente(row));
});

router.patch("/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const body = req.body;
  const update: Record<string, unknown> = {};
  if (body.nomeAzienda !== undefined) update.nomeAzienda = body.nomeAzienda;
  if (body.referente !== undefined) update.referente = body.referente;
  if (body.email !== undefined) update.email = body.email;
  if (body.telefono !== undefined) update.telefono = body.telefono;
  if (body.settore !== undefined) update.settore = body.settore;
  if (body.indirizzo !== undefined) update.indirizzo = body.indirizzo;
  if (body.materialiInteresse !== undefined) update.materialiInteresse = JSON.stringify(body.materialiInteresse);
  if (body.priorita !== undefined) update.priorita = body.priorita;
  if (body.prossimAzione !== undefined) update.prossimAzione = body.prossimAzione;
  if (body.note !== undefined) update.note = body.note;
  const [row] = await db.update(clientiTable).set(update).where(eq(clientiTable.id, id)).returning();
  if (!row) { res.status(404).json({ error: "Not found" }); return; }
  res.json(parseCliente(row));
});

export default router;
