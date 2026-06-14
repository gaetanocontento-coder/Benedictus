import { Router } from "express";
import { db } from "@workspace/db";
import { leadsTable, clientiTable, campioniTable, proposteTable } from "@workspace/db";
import { eq, count, sql } from "drizzle-orm";

const router = Router();

router.get("/stats", async (req, res) => {
  const [leadsCount] = await db.select({ count: count() }).from(leadsTable);
  const [leadsDaLavorare] = await db.select({ count: count() }).from(leadsTable).where(
    sql`${leadsTable.stato} IN ('nuovo', 'contattato')`
  );
  const [preventiviInviati] = await db.select({ count: count() }).from(leadsTable).where(
    eq(leadsTable.stato, "preventivo_inviato")
  );
  const [clientiCount] = await db.select({ count: count() }).from(clientiTable);
  const [campioniCount] = await db.select({ count: count() }).from(campioniTable);

  const [chiusi] = await db.select({ count: count() }).from(leadsTable).where(eq(leadsTable.stato, "chiuso"));
  const tasso = leadsCount.count > 0 ? Math.round((Number(chiusi.count) / Number(leadsCount.count)) * 100 * 10) / 10 : 0;

  res.json({
    totaleLead: Number(leadsCount.count),
    leadDaLavorare: Number(leadsDaLavorare.count),
    preventiviInviati: Number(preventiviInviati.count),
    clientiAttivi: Number(clientiCount.count),
    richiesteCampioni: Number(campioniCount.count),
    tassoConversione: tasso,
  });
});

router.get("/andamento", async (_req, res) => {
  const mesi = ["Gen", "Feb", "Mar", "Apr", "Mag", "Giu", "Lug", "Ago", "Set", "Ott", "Nov", "Dic"];
  const data = mesi.map((mese, i) => ({
    mese,
    lead: Math.floor(12 + Math.sin(i * 0.7) * 5 + Math.random() * 8),
    preventivi: Math.floor(6 + Math.cos(i * 0.5) * 3 + Math.random() * 4),
    clienti: Math.floor(2 + Math.sin(i * 0.9) * 1.5 + Math.random() * 2),
  }));
  res.json(data);
});

export default router;
