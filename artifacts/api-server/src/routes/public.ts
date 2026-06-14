import { Router } from "express";
import { db } from "@workspace/db";
import { materialiTable, leadsTable } from "@workspace/db";

const router = Router();

function parseMateriale(row: typeof materialiTable.$inferSelect) {
  return {
    ...row,
    tecnologie: JSON.parse(row.tecnologie || "[]"),
    certificazioni: JSON.parse(row.certificazioni || "[]"),
    createdAt: row.createdAt.toISOString(),
  };
}

router.get("/materiali", async (req, res) => {
  const { categoria } = req.query as Record<string, string>;
  let rows = await db.select().from(materialiTable);
  rows = rows.filter((r) => r.disponibile);
  if (categoria) rows = rows.filter((r) => r.categoria === categoria);
  res.json(rows.map(parseMateriale));
});

router.post("/richiesta-campione", async (req, res) => {
  const { nome, azienda, email, telefono, materialeNome, materialeCategoria, indirizzo, messaggio } = req.body;

  if (!nome || !email || !materialeNome) {
    res.status(400).json({ error: "nome, email e materialeNome sono obbligatori" });
    return;
  }

  const noteLines = [
    `Richiesta campione via sito web.`,
    `Materiale: ${materialeNome}`,
    indirizzo ? `Indirizzo spedizione: ${indirizzo}` : null,
    messaggio ? `Messaggio: ${messaggio}` : null,
  ].filter(Boolean);

  const [lead] = await db
    .insert(leadsTable)
    .values({
      nomeAzienda: azienda || "Privato",
      referente: nome,
      email,
      telefono: telefono || "n.d.",
      fonte: "sito_web",
      interesse: materialeCategoria || "custom",
      stato: "nuovo",
      commercialeAssegnato: "da-assegnare",
      note: noteLines.join("\n"),
    })
    .returning();

  res.status(201).json({ success: true, leadId: lead.id });
});

export default router;
