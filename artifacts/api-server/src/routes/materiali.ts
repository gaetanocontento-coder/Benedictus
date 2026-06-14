import { Router } from "express";
import { db } from "@workspace/db";
import { materialiTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";

const router = Router();

function parseMateriale(row: typeof materialiTable.$inferSelect) {
  return {
    ...row,
    tecnologie: JSON.parse(row.tecnologie || "[]"),
    certificazioni: JSON.parse(row.certificazioni || "[]"),
    createdAt: row.createdAt.toISOString(),
  };
}

router.get("/stats/top-richiesti", async (_req, res) => {
  const rows = await db
    .select({ id: materialiTable.id, nome: materialiTable.nome, categoria: materialiTable.categoria, richieste: materialiTable.richieste })
    .from(materialiTable)
    .orderBy(desc(materialiTable.richieste))
    .limit(5);
  res.json(rows);
});

router.get("/", async (req, res) => {
  const { categoria, disponibile } = req.query as Record<string, string>;
  let rows = await db.select().from(materialiTable);
  if (categoria) rows = rows.filter(r => r.categoria === categoria);
  if (disponibile !== undefined) rows = rows.filter(r => r.disponibile === (disponibile === "true"));
  res.json(rows.map(parseMateriale));
});

router.post("/", async (req, res) => {
  const body = req.body;
  const [row] = await db.insert(materialiTable).values({
    nome: body.nome,
    categoria: body.categoria,
    colore: body.colore,
    utilizzoConsigliato: body.utilizzoConsigliato,
    fasciaPrezzo: body.fasciaPrezzo,
    disponibile: body.disponibile ?? true,
    descrizione: body.descrizione || null,
    richieste: 0,
    tecnologie: JSON.stringify(body.tecnologie || []),
    certificazioni: JSON.stringify(body.certificazioni || []),
    stagione: body.stagione || null,
    collezione: body.collezione || null,
  }).returning();
  res.status(201).json(parseMateriale(row));
});

router.get("/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const [row] = await db.select().from(materialiTable).where(eq(materialiTable.id, id));
  if (!row) { res.status(404).json({ error: "Not found" }); return; }
  res.json(parseMateriale(row));
});

router.patch("/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const body = req.body;
  const update: Record<string, unknown> = {};
  if (body.nome !== undefined) update.nome = body.nome;
  if (body.categoria !== undefined) update.categoria = body.categoria;
  if (body.colore !== undefined) update.colore = body.colore;
  if (body.utilizzoConsigliato !== undefined) update.utilizzoConsigliato = body.utilizzoConsigliato;
  if (body.fasciaPrezzo !== undefined) update.fasciaPrezzo = body.fasciaPrezzo;
  if (body.disponibile !== undefined) update.disponibile = body.disponibile;
  if (body.descrizione !== undefined) update.descrizione = body.descrizione;
  if (body.tecnologie !== undefined) update.tecnologie = JSON.stringify(body.tecnologie);
  if (body.certificazioni !== undefined) update.certificazioni = JSON.stringify(body.certificazioni);
  if (body.stagione !== undefined) update.stagione = body.stagione;
  if (body.collezione !== undefined) update.collezione = body.collezione;
  const [row] = await db.update(materialiTable).set(update).where(eq(materialiTable.id, id)).returning();
  if (!row) { res.status(404).json({ error: "Not found" }); return; }
  res.json(parseMateriale(row));
});

export default router;
