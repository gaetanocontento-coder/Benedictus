import { Router, type IRouter, type Request, type Response } from "express";
import { db, bLiturgiaGiornoTable, bPraticaSpiritualeTable, bOblatoProfileTable } from "@workspace/db";
import { eq, and, desc } from "drizzle-orm";
import { getBAuthUser } from "./auth";

const router: IRouter = Router();

// ── helpers ──────────────────────────────────────────────────────────────────

function todayDate(): string {
  return new Date().toISOString().slice(0, 10);
}

interface Lettura {
  tipo: string;       // "prima_lettura" | "salmo" | "seconda_lettura" | "vangelo"
  label: string;
  riferimento: string;
  intro: string;
  testo: string;
}

interface LiturgiaFetched {
  titoloLiturgico: string;
  colore: string;
  letture: Lettura[];
}

// ── ChiesaCattolica.it parser (CEI — fonte autorevole) ────────────────────────

function stripHtmlToText(html: string): string {
  return html
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n")
    .replace(/<\/div>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&agrave;/g, "à")
    .replace(/&egrave;/g, "è")
    .replace(/&eacute;/g, "é")
    .replace(/&igrave;/g, "ì")
    .replace(/&ograve;/g, "ò")
    .replace(/&ugrave;/g, "ù")
    .replace(/&Agrave;/g, "À")
    .replace(/&Egrave;/g, "È")
    .replace(/&#(\d+);/g, (_, n: string) => String.fromCharCode(Number(n)))
    .replace(/[ \t]+/g, " ")
    .replace(/\n[ \t]+/g, "\n")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

const CCI_SEZIONI = ["Prima Lettura", "Seconda Lettura", "Salmo Responsoriale", "Vangelo"] as const;
type CciSezione = (typeof CCI_SEZIONI)[number];

const CCI_META: Record<CciSezione, { tipo: string; label: string; ordine: number }> = {
  "Prima Lettura":       { tipo: "prima_lettura",   label: "Prima Lettura",       ordine: 1 },
  "Salmo Responsoriale": { tipo: "salmo",            label: "Salmo Responsoriale", ordine: 2 },
  "Seconda Lettura":     { tipo: "seconda_lettura",  label: "Seconda Lettura",     ordine: 3 },
  "Vangelo":             { tipo: "vangelo",          label: "Vangelo",             ordine: 4 },
};

async function fetchCCI(data: string): Promise<LiturgiaFetched | null> {
  try {
    const dateStr = data.replace(/-/g, ""); // YYYY-MM-DD → YYYYMMDD
    const url = `https://www.chiesacattolica.it/liturgia-del-giorno/?data-liturgia=${dateStr}`;
    const resp = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; BenedictusSpirituale/1.0)",
        "Accept": "text/html,application/xhtml+xml",
        "Accept-Language": "it-IT,it;q=0.9",
      },
      signal: AbortSignal.timeout(12000),
    });
    if (!resp.ok) return null;
    const html = await resp.text();

    // Verify the page has liturgical content
    if (!html.includes("cci-liturgia-giorno-section-title")) return null;

    // Liturgical title (active h3, not commented one)
    const titleMatch = html.match(/<h3[^>]*cci_content_single_title[^>]*>\s*([\s\S]*?)\s*<\/h3>/);
    const titoloLiturgico = titleMatch
      ? stripHtmlToText(titleMatch[1])
      : `Liturgia del ${data}`;

    // Liturgical color (text-capitalize span)
    const colorMatch = html.match(/Colore Liturgico[^<]*<span[^>]*text-capitalize[^>]*>\s*(\w+)\s*<\/span>/);
    const coloreRaw = colorMatch ? colorMatch[1].toLowerCase().trim() : "verde";
    const colore = ["verde", "rosso", "viola", "bianco"].includes(coloreRaw) ? coloreRaw : "verde";

    // Split into section blocks
    const chunks = html.split('<div class="cci-liturgia-giorno-dettagli-content cci-fontsize-dynamic">');

    const letture: Lettura[] = [];

    for (const chunk of chunks.slice(1)) {
      // Section title
      const secTitleMatch = chunk.match(/<h2[^>]*cci-liturgia-giorno-section-title[^>]*>\s*([^<]+)\s*<\/h2>/);
      if (!secTitleMatch) continue;
      const sectionTitle = secTitleMatch[1].trim() as CciSezione;
      if (!CCI_SEZIONI.includes(sectionTitle)) continue;
      const meta = CCI_META[sectionTitle];

      // Reference
      let riferimento = "";
      if (sectionTitle === "Salmo Responsoriale") {
        const vMatch = chunk.match(/<p[^>]*cci-liturgia-giorno-section-versetto[^>]*>\s*([^<]+)\s*<\/p>/);
        riferimento = vMatch ? vMatch[1].trim().replace(/^Dal\s+/, "") : "";
      } else {
        // BibbiaEdu anchor text is the canonical reference
        const refMatch = chunk.match(/<a[^>]*title="Leggi ([^"]+) su BibbiaEdu"[^>]*>([\s\S]*?)<\/a>/);
        if (refMatch) {
          // Strip any inner spans from anchor text
          riferimento = stripHtmlToText(refMatch[2]).trim();
        }
      }

      // Intro / subtitle
      const subtitleMatch = chunk.match(/<h3[^>]*cci-liturgia-giorno-section-subtitle[^>]*>\s*([^<]+)\s*<\/h3>/);
      const intro = subtitleMatch ? subtitleMatch[1].trim() : "";

      // Content: extract everything inside the content div
      const contentMatch = chunk.match(/<div[^>]*cci-liturgia-giorno-section-content[^>]*>([\s\S]*?)<\/div>/);
      let testo = "";
      if (contentMatch) {
        let contentHtml = contentMatch[1];

        // Strip the reference-header paragraph (contains book intro + BibbiaEdu link)
        // It is always the first paragraph containing "bibbiaedu-linked"
        contentHtml = contentHtml.replace(/<p[^>]*>(?:(?!<\/p>)[\s\S])*?bibbiaedu-linked(?:(?!<\/p>)[\s\S])*?<\/p>/i, "");

        testo = stripHtmlToText(contentHtml);

        // Also strip any leading "Dal [libro]" line that remains
        if (riferimento) {
          const escaped = riferimento.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
          testo = testo.replace(new RegExp(`(?:Dal [^\\n]*\\n)?${escaped}\\n?`, ""), "").trim();
        }
      }

      letture.push({ tipo: meta.tipo, label: meta.label, riferimento, intro, testo });
    }

    letture.sort((a, b) => (CCI_META[a.label as CciSezione]?.ordine ?? 9) - (CCI_META[b.label as CciSezione]?.ordine ?? 9));

    if (letture.length === 0) return null;
    return { titoloLiturgico, colore, letture };
  } catch {
    return null;
  }
}

// ── Evangelizo fallback ───────────────────────────────────────────────────────

interface EvangelizoReading {
  type?: string;
  reference?: string;
  reference_displayed?: string;
  book?: { code?: string; short_title?: string; full_title?: string };
  title?: string;
  before_reading?: string;
  intro?: string;
  text?: string;
  content?: string;
}

interface EvangelizoResponse {
  data?: {
    liturgic_title?: string;
    color?: string;
    readings?: EvangelizoReading[];
    gospel?: EvangelizoReading;
    first_reading?: EvangelizoReading;
    second_reading?: EvangelizoReading;
    psalm?: EvangelizoReading;
  };
}

const STATIC_TYPE_MAP: Record<string, { tipo: string; label: string; ordine: number }> = {
  first_reading:  { tipo: "prima_lettura",   label: "Prima Lettura",       ordine: 1 },
  psalm:          { tipo: "salmo",           label: "Salmo Responsoriale", ordine: 2 },
  second_reading: { tipo: "seconda_lettura", label: "Seconda Lettura",     ordine: 3 },
  epistle:        { tipo: "seconda_lettura", label: "Seconda Lettura",     ordine: 3 },
  gospel:         { tipo: "vangelo",         label: "Vangelo",             ordine: 4 },
};

const COLOR_MAP: Record<string, string> = {
  green:  "verde",
  violet: "viola",
  purple: "viola",
  red:    "rosso",
  white:  "bianco",
  rose:   "rosso",
  gold:   "bianco",
};

async function fetchEvangelizo(data: string): Promise<LiturgiaFetched | null> {
  try {
    const url = `https://publication.evangelizo.ws/IT/days/${data}`;
    const resp = await fetch(url, {
      headers: { "Accept": "application/json" },
      signal: AbortSignal.timeout(8000),
    });
    if (!resp.ok) return null;

    const json = (await resp.json()) as EvangelizoResponse;
    const d = json?.data;
    if (!d) return null;

    const titoloLiturgico = d.liturgic_title ?? `Liturgia del ${data}`;
    const colore = COLOR_MAP[d.color ?? "green"] ?? "verde";

    const rawReadings: EvangelizoReading[] = [];
    if (Array.isArray(d.readings) && d.readings.length > 0) {
      rawReadings.push(...d.readings);
    } else {
      if (d.first_reading)  rawReadings.push({ ...d.first_reading, type: "first_reading" });
      if (d.psalm)          rawReadings.push({ ...d.psalm,         type: "psalm" });
      if (d.second_reading) rawReadings.push({ ...d.second_reading, type: "second_reading" });
      if (d.gospel)         rawReadings.push({ ...d.gospel,        type: "gospel" });
    }

    let readingCount = 0;
    const letture: Lettura[] = rawReadings
      .filter((r) => !!r.type)
      .flatMap((r): (Lettura & { ordine: number })[] => {
        let meta: { tipo: string; label: string; ordine: number } | undefined;
        if (r.type === "reading") {
          readingCount++;
          if (readingCount === 1) meta = { tipo: "prima_lettura", label: "Prima Lettura", ordine: 1 };
          else if (readingCount === 2) meta = { tipo: "seconda_lettura", label: "Seconda Lettura", ordine: 3 };
        } else {
          meta = STATIC_TYPE_MAP[r.type!];
        }
        if (!meta) return [];
        const ref = r.reference_displayed
          ? [r.book?.short_title ?? r.book?.full_title, r.reference_displayed].filter(Boolean).join(" ")
          : (r.reference ?? "");
        return [{ tipo: meta.tipo, label: meta.label, ordine: meta.ordine, riferimento: ref, intro: r.before_reading ?? r.intro ?? "", testo: (r.text ?? r.content ?? "").replace(/\[\[.*?\]\]/g, "").trim() }];
      })
      .sort((a, b) => a.ordine - b.ordine);

    if (letture.length === 0) return null;
    return { titoloLiturgico, colore, letture };
  } catch {
    return null;
  }
}

// ── GET /b/liturgia  ──────────────────────────────────────────────────────────
// ?data=YYYY-MM-DD (default: oggi)
router.get("/liturgia", async (req: Request, res: Response): Promise<void> => {
  const data = typeof req.query.data === "string" && /^\d{4}-\d{2}-\d{2}$/.test(req.query.data)
    ? req.query.data
    : todayDate();

  // Serve from cache if available
  const [cached] = await db
    .select()
    .from(bLiturgiaGiornoTable)
    .where(eq(bLiturgiaGiornoTable.data, data))
    .limit(1);

  if (cached) {
    res.json({
      data: cached.data,
      titoloLiturgico: cached.titoloLiturgico,
      colore: cached.colore,
      letture: JSON.parse(cached.letture) as Lettura[],
      cached: true,
    });
    return;
  }

  // Try CCI (official CEI source) first, then fall back to Evangelizo
  const fetched = (await fetchCCI(data)) ?? (await fetchEvangelizo(data));

  if (!fetched) {
    res.status(503).json({ error: "Letture non disponibili per questa data. Riprova più tardi." });
    return;
  }

  // Cache in DB
  await db
    .insert(bLiturgiaGiornoTable)
    .values({
      data,
      titoloLiturgico: fetched.titoloLiturgico,
      colore: fetched.colore,
      letture: JSON.stringify(fetched.letture),
    })
    .onConflictDoNothing();

  res.json({
    data,
    titoloLiturgico: fetched.titoloLiturgico,
    colore: fetched.colore,
    letture: fetched.letture,
    cached: false,
  });
});

// ── DELETE /b/liturgia/cache/:data  ─────────────────────────────────────────
// Cancella la cache per una data specifica (admin — richiede autenticazione)
router.delete("/liturgia/cache/:data", async (req: Request, res: Response): Promise<void> => {
  const user = await getBAuthUser(req);
  if (!user) {
    res.status(401).json({ error: "Accesso richiesto" });
    return;
  }

  const data = String(req.params.data ?? "");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(data)) {
    res.status(400).json({ error: "Data non valida (YYYY-MM-DD)" });
    return;
  }

  await db.delete(bLiturgiaGiornoTable).where(eq(bLiturgiaGiornoTable.data, data));
  res.json({ ok: true, message: `Cache eliminata per ${data}. La prossima richiesta recupererà i dati aggiornati da ChiesaCattolica.it.` });
});

// ── POST /b/pratiche  ─────────────────────────────────────────────────────────
router.post("/pratiche", async (req: Request, res: Response): Promise<void> => {
  const user = await getBAuthUser(req);
  if (!user) {
    res.status(401).json({ error: "Accesso richiesto" });
    return;
  }

  const {
    data,
    tipo,
    passaggioRef,
    passaggioTesto,
    lectio,
    meditatio,
    oratio,
    contemplatio,
    composizioneLuogo,
    colloquio,
    esameConscienza,
    frutti,
  } = req.body as {
    data?: string;
    tipo?: string;
    passaggioRef?: string;
    passaggioTesto?: string;
    lectio?: string;
    meditatio?: string;
    oratio?: string;
    contemplatio?: string;
    composizioneLuogo?: string;
    colloquio?: string;
    esameConscienza?: string;
    frutti?: string;
  };

  if (!data || !/^\d{4}-\d{2}-\d{2}$/.test(data)) {
    res.status(400).json({ error: "Campo 'data' YYYY-MM-DD richiesto" });
    return;
  }
  if (tipo !== "lectio" && tipo !== "ignaziana") {
    res.status(400).json({ error: "Campo 'tipo' deve essere 'lectio' o 'ignaziana'" });
    return;
  }

  const values = {
    userId: user.id,
    data,
    tipo,
    passaggioRef: passaggioRef ?? null,
    passaggioTesto: passaggioTesto ?? null,
    lectio: lectio ?? null,
    meditatio: meditatio ?? null,
    oratio: oratio ?? null,
    contemplatio: contemplatio ?? null,
    composizioneLuogo: composizioneLuogo ?? null,
    colloquio: colloquio ?? null,
    esameConscienza: esameConscienza ?? null,
    frutti: frutti ?? null,
  };

  await db
    .insert(bPraticaSpiritualeTable)
    .values(values)
    .onConflictDoUpdate({
      target: [bPraticaSpiritualeTable.userId, bPraticaSpiritualeTable.data, bPraticaSpiritualeTable.tipo],
      set: {
        passaggioRef:   values.passaggioRef,
        passaggioTesto: values.passaggioTesto,
        lectio:             values.lectio,
        meditatio:          values.meditatio,
        oratio:             values.oratio,
        contemplatio:       values.contemplatio,
        composizioneLuogo:  values.composizioneLuogo,
        colloquio:          values.colloquio,
        esameConscienza:    values.esameConscienza,
        frutti:             values.frutti,
        updatedAt:          new Date(),
      },
    });

  // Award XP (best-effort)
  try {
    const [profilo] = await db
      .select()
      .from(bOblatoProfileTable)
      .where(eq(bOblatoProfileTable.userId, user.id))
      .limit(1);

    if (profilo) {
      await db
        .update(bOblatoProfileTable)
        .set({
          xpPreghiera: profilo.xpPreghiera + 15,
          xpTotale:    profilo.xpTotale + 15,
          lectioCompletate: profilo.lectioCompletate + 1,
        })
        .where(eq(bOblatoProfileTable.userId, user.id));
    }
  } catch {
    // XP award is best-effort; don't fail the request
  }

  const [saved] = await db
    .select()
    .from(bPraticaSpiritualeTable)
    .where(
      and(
        eq(bPraticaSpiritualeTable.userId, user.id),
        eq(bPraticaSpiritualeTable.data, data),
        eq(bPraticaSpiritualeTable.tipo, tipo)
      )
    )
    .limit(1);

  res.json(saved);
});

// ── GET /b/pratiche  ─────────────────────────────────────────────────────────
router.get("/pratiche", async (req: Request, res: Response): Promise<void> => {
  const user = await getBAuthUser(req);
  if (!user) {
    res.status(401).json({ error: "Accesso richiesto" });
    return;
  }

  const rows = await db
    .select()
    .from(bPraticaSpiritualeTable)
    .where(eq(bPraticaSpiritualeTable.userId, user.id))
    .orderBy(desc(bPraticaSpiritualeTable.data))
    .limit(30);

  res.json(rows);
});

// ── GET /b/pratiche/:data  ────────────────────────────────────────────────────
router.get("/pratiche/:data", async (req: Request, res: Response): Promise<void> => {
  const user = await getBAuthUser(req);
  if (!user) {
    res.status(401).json({ error: "Accesso richiesto" });
    return;
  }

  const data = String(req.params.data ?? "");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(data)) {
    res.status(400).json({ error: "Data non valida (YYYY-MM-DD)" });
    return;
  }

  const rows = await db
    .select()
    .from(bPraticaSpiritualeTable)
    .where(
      and(
        eq(bPraticaSpiritualeTable.userId, user.id),
        eq(bPraticaSpiritualeTable.data, data)
      )
    );

  res.json(rows);
});

export default router;
