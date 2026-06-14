import { Router } from "express";
import { db } from "@workspace/db";
import { proposteTable, clientiTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router = Router();

function parseProposta(row: typeof proposteTable.$inferSelect) {
  return {
    ...row,
    items: JSON.parse(row.items || "[]"),
    totale: parseFloat(row.totale as unknown as string),
    createdAt: row.createdAt.toISOString(),
  };
}

router.get("/", async (_req, res) => {
  const rows = await db.select().from(proposteTable);
  res.json(rows.map(parseProposta));
});

router.post("/", async (req, res) => {
  const body = req.body;
  const items = body.items || [];
  const totale = items.reduce((sum: number, item: { quantita: number; prezzoUnitario: number }) => {
    return sum + (item.quantita * item.prezzoUnitario);
  }, 0);

  let clienteNome = "";
  if (body.clienteId) {
    const [cliente] = await db.select().from(clientiTable).where(eq(clientiTable.id, body.clienteId));
    if (cliente) clienteNome = cliente.nomeAzienda;
  }

  const [row] = await db.insert(proposteTable).values({
    clienteId: body.clienteId,
    clienteNome,
    items: JSON.stringify(items),
    totale: totale.toFixed(2),
    stato: body.stato || "bozza",
    note: body.note || null,
  }).returning();
  res.status(201).json(parseProposta(row));
});

router.get("/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const [row] = await db.select().from(proposteTable).where(eq(proposteTable.id, id));
  if (!row) { res.status(404).json({ error: "Not found" }); return; }
  res.json(parseProposta(row));
});

router.patch("/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const body = req.body;
  const update: Record<string, unknown> = {};
  if (body.items !== undefined) {
    update.items = JSON.stringify(body.items);
    const totale = (body.items as { quantita: number; prezzoUnitario: number }[]).reduce((sum, item) => {
      return sum + (item.quantita * item.prezzoUnitario);
    }, 0);
    update.totale = totale.toFixed(2);
  }
  if (body.stato !== undefined) update.stato = body.stato;
  if (body.note !== undefined) update.note = body.note;
  const [row] = await db.update(proposteTable).set(update).where(eq(proposteTable.id, id)).returning();
  if (!row) { res.status(404).json({ error: "Not found" }); return; }
  res.json(parseProposta(row));
});

export default router;
