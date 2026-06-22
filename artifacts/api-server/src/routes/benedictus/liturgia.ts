import { Router, type IRouter, type Request, type Response } from "express";
import { db, bLiturgiaGiornoTable, bPraticaSpiritualeTable, bOblatoProfileTable } from "@workspace/db";
import { eq, and, desc } from "drizzle-orm";
import { getBAuthUser } from "./auth";

const router: IRouter = Router();

// ── helpers ──────────────────────────────────────────────────────────────────

function todayDate(): string {
  return new Date().toISOString().slice(0, 10);
}

interface EvangelizoReading {
  type?: string;
  // Evangelizo uses reference_displayed + book, not reference
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

interface Lettura {
  tipo: string;       // "prima_lettura" | "salmo" | "seconda_lettura" | "vangelo"
  label: string;      // "Prima Lettura" etc.
  riferimento: string;
  intro: string;
  testo: string;
}

// Static map for unambiguous types
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

async function fetchEvangelizo(data: string): Promise<{ titoloLiturgico: string; colore: string; letture: Lettura[] } | null> {
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

    // Build readings array from different possible response shapes
    const rawReadings: EvangelizoReading[] = [];
    if (Array.isArray(d.readings) && d.readings.length > 0) {
      rawReadings.push(...d.readings);
    } else {
      // Some versions return individual fields
      if (d.first_reading)  rawReadings.push({ ...d.first_reading, type: "first_reading" });
      if (d.psalm)          rawReadings.push({ ...d.psalm,         type: "psalm" });
      if (d.second_reading) rawReadings.push({ ...d.second_reading, type: "second_reading" });
      if (d.gospel)         rawReadings.push({ ...d.gospel,        type: "gospel" });
    }

    // Assign meta dynamically: Evangelizo uses type="reading" for both
    // Prima Lettura and Seconda Lettura. The first occurrence is Prima, the second is Seconda.
    let readingCount = 0;
    const letture: Lettura[] = rawReadings
      .filter((r) => !!r.type)
      .flatMap((r): Lettura[] => {
        let meta: { tipo: string; label: string; ordine: number } | undefined;

        if (r.type === "reading") {
          readingCount++;
          if (readingCount === 1) {
            meta = { tipo: "prima_lettura", label: "Prima Lettura", ordine: 1 };
          } else if (readingCount === 2) {
            meta = { tipo: "seconda_lettura", label: "Seconda Lettura", ordine: 3 };
          }
          // 3+ readings: ignore (shouldn't happen in standard Roman Rite)
        } else {
          meta = STATIC_TYPE_MAP[r.type!];
        }

        if (!meta) return [];

        // Build reference: prefer book.short_title + reference_displayed, fall back to reference
        const ref = r.reference_displayed
          ? [r.book?.short_title ?? r.book?.full_title, r.reference_displayed].filter(Boolean).join(" ")
          : (r.reference ?? "");

        return [{
          tipo: meta.tipo,
          label: meta.label,
          ordine: meta.ordine,
          riferimento: ref,
          intro: r.before_reading ?? r.intro ?? "",
          testo: (r.text ?? r.content ?? "").replace(/\[\[.*?\]\]/g, "").trim(),
        }];
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

  // Serve from cache if available (and fresh enough — same day)
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

  // Fetch from external source
  const fetched = await fetchEvangelizo(data);
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

// ── POST /b/pratiche  ─────────────────────────────────────────────────────────
// Salva (upsert) una pratica spirituale per data+tipo
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

  // Award XP if practice appears complete for the first time today
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

// ── GET /b/pratiche  ──────────────────────────────────────────────────────────
// Lista delle pratiche dell'utente (ultime 30)
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
// Pratiche dell'utente per una data specifica (entrambi i tipi)
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
