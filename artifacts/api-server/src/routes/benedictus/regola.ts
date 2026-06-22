import { Router, type IRouter, type Request, type Response } from "express";
import { getRsbRiferimento, parseRiferimento } from "./rsb-calendario.js";

const router: IRouter = Router();

// ── In-memory cache for RSB chapter texts ─────────────────────────────────────
interface Capitolo { titolo: string; testo: string }
let rsbCache: Map<number, Capitolo> | null = null;
let rsbCacheTs = 0;
const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24h

function romanToInt(r: string): number {
  const map: Record<string, number> = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 };
  let n = 0, prev = 0;
  for (const c of [...r].reverse()) {
    const v = map[c] ?? 0;
    n += v < prev ? -v : v;
    prev = v;
  }
  return n;
}

function decodeHtmlEntities(s: string): string {
  return s
    .replace(/&nbsp;/g, " ")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&agrave;/g, "à").replace(/&egrave;/g, "è").replace(/&igrave;/g, "ì")
    .replace(/&ograve;/g, "ò").replace(/&ugrave;/g, "ù").replace(/&eacute;/g, "é")
    .replace(/&aacute;/g, "á").replace(/&iacute;/g, "í").replace(/&oacute;/g, "ó")
    .replace(/&Agrave;/g, "À").replace(/&Egrave;/g, "È").replace(/&Igrave;/g, "Ì")
    .replace(/&Ograve;/g, "Ò").replace(/&Ugrave;/g, "Ù")
    .replace(/&#8217;/g, "'").replace(/&#8216;/g, "'")
    .replace(/&#8220;/g, "«").replace(/&#8221;/g, "»")
    .replace(/&#[0-9]+;/g, "")
    .replace(/&[a-zA-Z]+;/g, "");
}

function htmlToText(html: string): string {
  return decodeHtmlEntities(
    html
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<\/p>/gi, "\n\n")
      .replace(/<\/div>/gi, "\n")
      .replace(/<\/tr>/gi, "\n")
      .replace(/<\/td>/gi, " ")
      .replace(/<[^>]+>/g, "")
  )
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

async function loadRsbChapters(): Promise<Map<number, Capitolo>> {
  if (rsbCache && Date.now() - rsbCacheTs < CACHE_TTL_MS) return rsbCache;

  const resp = await fetch("https://www.ora-et-labora.net/RSB_it.html", {
    headers: { "User-Agent": "Mozilla/5.0", "Accept-Charset": "windows-1252" },
    signal: AbortSignal.timeout(15000),
  });
  if (!resp.ok) throw new Error(`RSB fetch failed: ${resp.status}`);

  // Page uses Windows-1252 encoding
  const buf = await resp.arrayBuffer();
  const html = new TextDecoder("windows-1252").decode(buf);

  // Find the text body (after the chapter index)
  const textStart = html.indexOf("Regola dei monaci", html.indexOf("Fine dell"));
  if (textStart < 0) throw new Error("RSB text marker not found");
  const rawHtml = html.slice(textStart);
  const text = htmlToText(rawHtml).replace(/\r\n/g, "\n").replace(/\r/g, "\n");

  const chapters = new Map<number, Capitolo>();

  // Find "Prologo" section (immediately after "Regola dei monaci")
  const prologoMatch = /Prologo\n+([\s\S]+?)(?=\nCapitolo I\b|\nCapitolo 1\b)/.exec(text);
  if (prologoMatch) {
    chapters.set(0, { titolo: "Prologo", testo: prologoMatch[1].trim() });
  }

  // Find all chapters by "Capitolo [ROMAN] - Title"
  // The HTML sometimes wraps the title across two lines, so capture an optional continuation line
  const chapRegex = /Capitolo ([IVXLC]+) - ([^\n]+)\n+([\s\S]+?)(?=\nCapitolo [IVXLC]+ - |\n*$)/g;
  let m: RegExpExecArray | null;
  while ((m = chapRegex.exec(text)) !== null) {
    const num = romanToInt(m[1]);
    let body = m[3].trim();

    // Strip repeated title at top of body (sometimes duplicated in HTML)
    body = body.replace(new RegExp(`^${m[2].trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\s*`), "");

    // Strip title-continuation lines: short lines (< 80 chars) with no sentence-ending
    // punctuation that appear before the first real paragraph break
    const firstNL = body.indexOf("\n\n");
    const candidate = firstNL >= 0 ? body.slice(0, firstNL) : "";
    if (candidate && candidate.length < 80 && !/[.!?:;»]/.test(candidate)) {
      body = body.slice(firstNL + 2).trim();
    }

    if (num > 0 && num <= 73) {
      chapters.set(num, { titolo: `Capitolo ${m[1]} — ${m[2].trim()}`, testo: body });
    }
  }

  rsbCache = chapters;
  rsbCacheTs = Date.now();
  return chapters;
}

// ── GET /b/regola/giorno ───────────────────────────────────────────────────────

router.get("/regola/giorno", async (req: Request, res: Response): Promise<void> => {
  const dataRaw = typeof req.query.data === "string" ? req.query.data : null;
  const data = dataRaw ?? (() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  })();

  if (!/^\d{4}-\d{2}-\d{2}$/.test(data)) {
    res.status(400).json({ error: "Formato data non valido (YYYY-MM-DD)" });
    return;
  }

  const raw = getRsbRiferimento(data);
  if (!raw) {
    res.status(404).json({ error: "Data fuori dal calendario RSB" });
    return;
  }

  const rif = parseRiferimento(raw);

  try {
    const chapters = await loadRsbChapters();
    const cap = chapters.get(rif.capitolo);

    res.json({
      data,
      riferimento: raw,
      capitolo: rif.capitolo,
      titoloCapitolo: rif.titoloCapitolo,
      versoInizio: rif.versoInizio,
      etichetta: rif.etichetta,
      testo: cap?.testo ?? null,
    });
  } catch (err) {
    req.log.error({ err }, "Errore caricamento testo RSB");
    // Return metadata without text if fetch fails
    res.json({
      data,
      riferimento: raw,
      capitolo: rif.capitolo,
      titoloCapitolo: rif.titoloCapitolo,
      versoInizio: rif.versoInizio,
      etichetta: rif.etichetta,
      testo: null,
    });
  }
});

export default router;
