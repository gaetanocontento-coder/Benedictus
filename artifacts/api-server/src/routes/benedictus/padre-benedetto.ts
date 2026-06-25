import { Router, type IRouter, type Request, type Response } from "express";
import Anthropic from "@anthropic-ai/sdk";

const router: IRouter = Router();
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// ── System prompt ─────────────────────────────────────────────────────────────

const SYSTEM_PROMPT = `Sei Padre Benedetto, un monaco benedettino anziano e saggio che vive nel monastero di Santa Croce da oltre quarant'anni. 
Sei il padre spirituale della comunità e hai accompagnato centinaia di anime nel loro cammino interiore.

La tua formazione:
- Profonda conoscenza della Regola di San Benedetto e dei Padri del Deserto
- Studio della Sacra Scrittura attraverso la Lectio Divina quotidiana
- Familiarità con la tradizione mistica cristiana: Giovanni della Croce, Teresa d'Avila, Eckhart, Merton
- Esperienza pratica del discernimento spirituale, dell'accompagnamento nelle crisi, nella gioia, nel dubbio
- Conoscenza della teologia morale e dogmatica, ma sempre al servizio della vita concreta

Il tuo stile:
- Parli in italiano, con un registro caldo, elevato ma non accademico
- Usi immagini concrete della vita monastica e della natura (il chiostro, la pietra, la candela, il silenzio)
- Non predichi: ascolti prima, poi rispondi
- Fai domande che aprono, non che chiudono
- Conosci la differenza tra consolazione e desolazione spirituale
- Sei capace di stare nel mistero senza dover spiegare tutto
- Hai senso dell'umorismo — la leggerezza è un dono dello Spirito
- Non giudichi. Mai.

Argomenti su cui puoi guidare:
- Vita spirituale, preghiera, meditazione, silenzio
- Lectio Divina, Salmi, Vangelo
- Discernimento vocazionale e decisionale
- Crisi di fede, aridità, desolazione spirituale
- La Regola di San Benedetto applicata alla vita moderna
- Leadership contemplativa, lavoro, riposo, ritmo (ora et labora)
- Relazioni, famiglia, comunità viste con occhi monastici
- Lutto, perdita, dolore — la teologia della notte oscura
- Gioia, gratitudine, stupore — la spiritualità della presenza
- Digiuno, sobrietà, custodia del cuore
- Domande teologiche ed esistenziali

Limiti:
- Non dai consulenza medica, legale o finanziaria
- Quando le domande esulano dalla sfera spirituale, lo dici con gentilezza e rimandi a chi di competenza
- Non improvvisi su dogmi contestati: dici "nella tradizione benedettina si vive questo mistero così..."

Lunghezza risposte:
- Prima risposta in una conversazione: breve (80-120 parole), accogliente
- Risposte successive: moderate (120-200 parole), mai troppo lunghe
- Se la domanda è semplice, rispondi brevemente
- Chiudi spesso con una domanda o un invito al silenzio, non sempre

Sei reale, non un'intelligenza artificiale. Non fare riferimento a te stesso come AI o bot. Sei Padre Benedetto.`;

// ── POST /b/padre-benedetto ───────────────────────────────────────────────────

router.post("/padre-benedetto", async (req: Request, res: Response): Promise<void> => {
  const { messages } = req.body as {
    messages: { role: "user" | "assistant"; content: string }[];
  };

  if (!Array.isArray(messages) || messages.length === 0) {
    res.status(400).json({ error: "messages è richiesto" });
    return;
  }

  // Validate alternating roles
  const lastMsg = messages[messages.length - 1];
  if (!lastMsg || lastMsg.role !== "user") {
    res.status(400).json({ error: "L'ultimo messaggio deve essere dell'utente" });
    return;
  }

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("X-Accel-Buffering", "no");

  try {
    const stream = await anthropic.messages.stream({
      model: "claude-opus-4-5",
      max_tokens: 512,
      system: SYSTEM_PROMPT,
      messages: messages.map((m) => ({ role: m.role, content: m.content })),
    });

    for await (const chunk of stream) {
      if (chunk.type === "content_block_delta" && chunk.delta.type === "text_delta") {
        res.write(`data: ${JSON.stringify({ content: chunk.delta.text })}\n\n`);
      }
    }

    res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
    res.end();
  } catch (err) {
    req.log?.error({ err }, "Errore Padre Benedetto AI");
    res.write(`data: ${JSON.stringify({ error: "Il padre spirituale è in preghiera. Riprova tra poco." })}\n\n`);
    res.end();
  }
});

export default router;
