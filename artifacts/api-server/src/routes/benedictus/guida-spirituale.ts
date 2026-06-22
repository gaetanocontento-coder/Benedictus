import { Router, type IRouter, type Request, type Response } from "express";
import Anthropic from "@anthropic-ai/sdk";

const router: IRouter = Router();
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// ── Prompt builders ───────────────────────────────────────────────────────────

function buildAnalisiPrompt(
  letture: { tipo: string; riferimento: string; testo: string }[],
  titoloLiturgico: string
): string {
  const testiBrani = letture
    .map((l) => `### ${l.riferimento} (${l.tipo})\n${l.testo}`)
    .join("\n\n");

  return `Sei un padre spirituale benedettino, studioso di Scrittura e di tradizione monastica. 
Parli in italiano con un registro elevato ma caldo, mistico ma concreto.

Oggi è: ${titoloLiturgico}

Ecco le letture liturgiche del giorno:
${testiBrani}

Scrivi una meditazione unitaria di circa 300 parole che:
1. Individua il filo rosso che unisce tutte le letture del giorno (un tema, un'immagine, una tensione spirituale)
2. Porta questo tema nella vita quotidiana concreta di un uomo o una donna di oggi
3. Chiude con una domanda contemplativa aperta — non retorica — che inviti al silenzio

Tono: come una conversazione dopo Compieta, nel chiostro, alla luce di una candela. 
Non usare sottotitoli. Scrivi in paragrafi fluenti.`;
}

function buildLectioPrompt(stepId: string, testoUtente: string, letture: { tipo: string; riferimento: string; testo: string }[]): string {
  const vangelo = letture.find((l) => l.tipo === "vangelo") ?? letture[letture.length - 1];
  const riferimento = vangelo?.riferimento ?? "il brano";
  const testoSacro = vangelo?.testo?.slice(0, 800) ?? "";

  const guide: Record<string, string> = {
    lectio: `L'esercitante ha appena letto il brano di ${riferimento} e ha scritto la parola o frase che lo ha colpito: "${testoUtente}".

Come guida spirituale nella tradizione benedettina, rispondi in modo breve (80-120 parole):
- Accoglie ciò che l'esercitante ha notato, senza giudicare
- Aiuta a capire perché proprio quella parola può essere un'invocazione dello Spirito
- Suggerisce di tornare al testo e lasciarla risuonare in silenzio per un momento
- Chiude con una sola domanda: "Cosa ti dice questa parola sulla tua vita oggi?"

Non ripetere il testo sacro. Parla in seconda persona singolare, con calore paterno.`,

    meditatio: `L'esercitante sta meditando su ${riferimento} e ha scritto questa riflessione: "${testoUtente}".

Come guida spirituale benedettina, rispondi in 100-130 parole:
- Rispecchia ciò che l'esercitante ha condiviso, mostrando che lo hai davvero ascoltato
- Aiuta ad approfondire: dove sta il punto vivo, la tensione, la consolazione?
- Se la riflessione è superficiale o generica, invitalo gentilmente a scendere più in profondità — senza giudicarlo
- Chiudi con una provocazione concreta: "Dove nella tua settimana hai vissuto esattamente questo?"

Parla in seconda persona singolare. Tono: guida che cammina accanto, non che predica.`,

    oratio: `L'esercitante ha scritto la sua preghiera su ${riferimento}: "${testoUtente}".

Come padre spirituale benedettino, rispondi in 80-100 parole:
- Accogli la preghiera con rispetto — è sacra, anche se imperfetta
- Rispecchia il movimento interiore che intravedi (ringraziamento, domanda, offerta, pentimento...)
- Conferma che Dio già risponde — anche nel silenzio o nell'attesa
- Chiudi con un breve invito alla quiete: "Resta in questo silenzio un momento prima di continuare"

Non correggere la preghiera. Non aggiungere la tua. Accogli e accompagna.`,

    contemplatio: `L'esercitante ha scritto il frutto della sua contemplatio su ${riferimento}: "${testoUtente}".

Come guida spirituale benedettina, rispondi in 70-90 parole:
- Celebra questo momento — la contemplazione è un dono, non una conquista
- Aiuta a custodire il frutto: come portarlo nel resto della giornata?
- Suggerisci un gesto concreto piccolissimo con cui incarnare questo frutto oggi
- Chiudi con una benedizione semplice, non rituale

Tono: conclusivo, luminoso, che rimanda alla vita.`,
  };

  const systemPrompt = `Sei un padre spirituale benedettino che accompagna un esercitante nella Lectio Divina. 
Il testo liturgico di oggi è: ${testoSacro ? `"${testoSacro.slice(0, 300)}…"` : riferimento}
Parli sempre in italiano, in seconda persona singolare, con calore e profondità spirituale.`;

  return `${systemPrompt}\n\n${guide[stepId] ?? guide.lectio}`;
}

function buildIgnazianaPrompt(stepId: string, testoUtente: string, letture: { tipo: string; riferimento: string; testo: string }[]): string {
  const vangelo = letture.find((l) => l.tipo === "vangelo") ?? letture[letture.length - 1];
  const riferimento = vangelo?.riferimento ?? "il Vangelo";
  const testoSacro = vangelo?.testo?.slice(0, 600) ?? "";

  const guide: Record<string, string> = {
    composizioneLuogo: `L'esercitante sta facendo la composizione di luogo su ${riferimento} e ha scritto: "${testoUtente}".

Come guida ignaziana, rispondi in 100-130 parole:
- Accogli l'immagine che ha costruito — è la sua, rispettala
- Aiuta ad arricchire la scena: un dettaglio sensoriale che potrebbe non aver notato (un suono, un odore, la luce, la temperatura)
- Chiedi: dove si colloca lui nella scena? È spettatore o partecipante?
- Invitalo a fermarsi ancora un momento nella scena prima di procedere

Tono: guida che aiuta a entrare in profondità nell'immaginazione apostolica.`,

    colloquio: `L'esercitante ha scritto il suo colloquio (dialogo con Gesù/il Padre) su ${riferimento}: "${testoUtente}".

Come guida ignaziana, rispondi in 100-120 parole:
- Rispecchia la qualità del dialogo: c'è intimità, distanza, paura, fiducia?
- Aiuta a riconoscere eventuali consolazioni o desolazioni nel dialogo
- Se il dialogo è monologante (solo richieste o solo ringraziamento), invitalo a stare in ascolto — cosa risponde Gesù?
- Chiudi con: "Cosa senti che ti sta dicendo adesso, in questo silenzio?"

Non inventare risposte di Gesù. Aiuta l'esercitante a trovarle lui.`,

    esameConscienza: `L'esercitante ha completato l'esame di coscienza su ${riferimento} e ha scritto: "${testoUtente}".

Come guida ignaziana, rispondi in 90-110 parole:
- Accogli sia il ringraziamento sia il riconoscimento dei limiti — entrambi sono necessari
- Aiuta a non restare nel senso di colpa: il discernimento è diverso dall'autoaccusa
- Individua un possibile "mozione" (impulso interiore positivo) da seguire
- Invita a ricevere il perdono come dono, non come merito

Tono: misericordioso e pratico. La consolazione viene da Dio, non da sé stessi.`,

    frutti: `L'esercitante ha scritto i frutti dell'orazione ignaziana su ${riferimento}: "${testoUtente}".

Come guida ignaziana, rispondi in 80-100 parole:
- Celebra il frutto — è un segno di consolazione, cioè di movimento verso Dio
- Aiuta a formulare un proposito concreto per le prossime 24 ore (non una risoluzione grandiosa, ma un gesto piccolo e preciso)
- Invita a portare con sé la grazia ricevuta come un seme, non come un programma

Chiudi con una benedizione apostolica semplice.`,
  };

  const systemPrompt = `Sei una guida spirituale ignaziana che accompagna un esercitante negli Esercizi Spirituali di Sant'Ignazio di Loyola.
Il brano meditato oggi è: ${testoSacro ? `"${testoSacro.slice(0, 300)}…" (${riferimento})` : riferimento}
Usi il metodo ignaziano: immaginazione apostolica, discernimento degli spiriti, consolazione e desolazione.
Parli sempre in italiano, in seconda persona singolare, con chiarezza e profondità.`;

  return `${systemPrompt}\n\n${guide[stepId] ?? guide.composizioneLuogo}`;
}

// ── POST /b/guida-spirituale (SSE) ────────────────────────────────────────────

router.post("/guida-spirituale", async (req: Request, res: Response): Promise<void> => {
  const { tipo, stepId, testoUtente = "", letture = [], titoloLiturgico = "" } = req.body as {
    tipo: "lectio" | "ignaziana" | "analisi";
    stepId: string;
    testoUtente?: string;
    letture?: { tipo: string; riferimento: string; testo: string }[];
    titoloLiturgico?: string;
  };

  if (!tipo || !stepId) {
    res.status(400).json({ error: "tipo e stepId sono richiesti" });
    return;
  }

  let prompt: string;
  if (tipo === "analisi") {
    if (!letture.length) {
      res.status(400).json({ error: "letture richieste per l'analisi" });
      return;
    }
    prompt = buildAnalisiPrompt(letture, titoloLiturgico);
  } else if (tipo === "lectio") {
    prompt = buildLectioPrompt(stepId, testoUtente, letture);
  } else {
    prompt = buildIgnazianaPrompt(stepId, testoUtente, letture);
  }

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("X-Accel-Buffering", "no");

  try {
    const stream = await anthropic.messages.stream({
      model: "claude-opus-4-5",
      max_tokens: 1024,
      messages: [{ role: "user", content: prompt }],
    });

    for await (const chunk of stream) {
      if (
        chunk.type === "content_block_delta" &&
        chunk.delta.type === "text_delta"
      ) {
        res.write(`data: ${JSON.stringify({ content: chunk.delta.text })}\n\n`);
      }
    }

    res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
    res.end();
  } catch (err) {
    req.log?.error({ err }, "Errore guida spirituale AI");
    res.write(`data: ${JSON.stringify({ error: "Servizio non disponibile" })}\n\n`);
    res.end();
  }
});

export default router;
