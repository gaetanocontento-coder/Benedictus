import { Router } from "express";
import { db } from "@workspace/db";
import { leadsTable, materialiTable, campioniTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";

const router = Router();

router.get("/", async (_req, res) => {
  const [allLeads, allCampioni] = await Promise.all([
    db.select().from(leadsTable),
    db.select().from(campioniTable),
  ]);

  const leadDaSeguire = allLeads
    .filter(l => l.stato === "nuovo" || l.stato === "contattato" || l.stato === "campione_inviato")
    .slice(0, 5)
    .map(l => {
      const daysDiff = Math.floor((Date.now() - l.createdAt.getTime()) / (1000 * 60 * 60 * 24));
      let urgenza: "alta" | "media" | "bassa" = "bassa";
      let motivo = "Lead attivo da seguire";
      if (l.stato === "nuovo" && daysDiff > 3) { urgenza = "alta"; motivo = `Lead nuovo da ${daysDiff} giorni senza risposta`; }
      else if (l.stato === "campione_inviato") { urgenza = "media"; motivo = "Campione inviato, attendere feedback"; }
      else if (l.stato === "contattato") { urgenza = "media"; motivo = `Contattato ${daysDiff} giorni fa, aggiornare stato`; }
      return { leadId: l.id, nomeAzienda: l.nomeAzienda, motivo, urgenza };
    });

  const topMateriali = await db
    .select({ id: materialiTable.id, nome: materialiTable.nome, categoria: materialiTable.categoria, richieste: materialiTable.richieste })
    .from(materialiTable)
    .orderBy(desc(materialiTable.richieste))
    .limit(5);

  const fonteMap: Record<string, number> = {};
  allLeads.forEach(l => { fonteMap[l.fonte] = (fonteMap[l.fonte] || 0) + 1; });
  const total = allLeads.length || 1;
  const fontiPerformanti = Object.entries(fonteMap)
    .sort(([, a], [, b]) => b - a)
    .map(([fonte, count]) => ({ fonte, count, percentuale: Math.round((count / total) * 100 * 10) / 10 }));

  // campioni spediti da > 7 giorni senza feedback (ancora in stato "spedito")
  const campioniDaFollowUp = allCampioni
    .filter(c => {
      if (c.statoSpedizione !== "spedito") return false;
      const dataRichiesta = new Date(c.dataRichiesta);
      const giorniAttesa = Math.floor((Date.now() - dataRichiesta.getTime()) / (1000 * 60 * 60 * 24));
      return giorniAttesa >= 7;
    })
    .map(c => {
      const giorniAttesa = Math.floor((Date.now() - new Date(c.dataRichiesta).getTime()) / (1000 * 60 * 60 * 24));
      return {
        id: c.id,
        clienteNome: c.clienteNome,
        materialeNome: c.materialeNome,
        dataRichiesta: c.dataRichiesta,
        giorniAttesa,
      };
    })
    .sort((a, b) => b.giorniAttesa - a.giorniAttesa);

  res.json({ leadDaSeguire, materialiPiuRichiesti: topMateriali, fontiPerformanti, campioniDaFollowUp });
});

export default router;
