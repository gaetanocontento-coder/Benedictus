import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "wouter";
import {
  ArrowLeft, Save, CheckCircle, BookOpen, Flame, ChevronRight,
  Sparkles, StopCircle, Loader2, Send, MessageCircle,
} from "lucide-react";
import {
  useBSavePratica,
  useBGetPraticheByDate,
  getBGetPraticheByDateQueryKey,
  useBGetLiturgiaGiorno,
  getBGetLiturgiaGiornoQueryKey,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/lib/auth";
import { useGuidaSpirituale } from "@/lib/useGuidaSpirituale";
import { useGuidaIgnaziana, type Messaggio } from "@/lib/useGuidaIgnaziana";

function todayISO() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

const LECTIO_STEPS = [
  {
    id: "lectio" as const,
    label: "Lectio",
    subtitolo: "Leggo",
    guida: "Leggi lentamente il brano più volte. Quale parola o frase ti colpisce? Scrivila qui, senza ancora spiegarla — lascia che risuoni.",
    placeholder: "La parola o frase che mi ha colpito è…",
    icona: "I",
    guidaLabel: "Chiedi al padre spirituale di accompagnarti",
  },
  {
    id: "meditatio" as const,
    label: "Meditatio",
    subtitolo: "Rifletto",
    guida: "Cosa dice il testo a te, oggi, in questa stagione della tua vita? Lascia che la Parola scenda dal testo alla tua realtà concreta.",
    placeholder: "Il testo mi dice che… Nella mia vita questo significa…",
    icona: "II",
    guidaLabel: "Ricevi un accompagnamento sulla tua riflessione",
  },
  {
    id: "oratio" as const,
    label: "Oratio",
    subtitolo: "Prego",
    guida: "Rispondi a Dio con le tue parole. Non c'è preghiera giusta o sbagliata — è un dialogo.",
    placeholder: "Signore, ti dico che… ti chiedo che… ti offro…",
    icona: "III",
    guidaLabel: "Ricevi l'accompagnamento del padre spirituale",
  },
  {
    id: "contemplatio" as const,
    label: "Contemplatio",
    subtitolo: "Contemplo",
    guida: "Deponi le parole. Stai in silenzio con Dio. Dopo, scrivi ciò che resta — un'intenzione, un'immagine, una pace.",
    placeholder: "Ciò che rimane dopo il silenzio è…",
    icona: "IV",
    guidaLabel: "Ricevi la benedizione finale",
  },
];

const IGNAZIANA_STEPS = [
  {
    id: "composizioneLuogo" as const,
    label: "Composizione di Luogo",
    subtitolo: "Immagino",
    guida: "Usa l'immaginazione per entrare nella scena del Vangelo. Dove sei? Cosa vedi, senti, odori? Chi è presente?",
    placeholder: "Mi trovo in… Vedo… Sento… Noto che…",
    icona: "①",
  },
  {
    id: "colloquio" as const,
    label: "Colloquio",
    subtitolo: "Dialogo",
    guida: "Parla con Gesù come con un amico. Cosa vuoi dirgli? Cosa senti che ti risponde?",
    placeholder: "Gli dico… Sento che mi risponde… Tra noi è come se…",
    icona: "②",
  },
  {
    id: "esameConscienza" as const,
    label: "Esame di Coscienza",
    subtitolo: "Esamino",
    guida: "Ripercorri la giornata o la settimana: per cosa ringrazi? Dove hai mancato? Cosa vuoi cambiare?",
    placeholder: "Ringrazio per… Riconosco di aver… Mi propongo di…",
    icona: "③",
  },
  {
    id: "frutti" as const,
    label: "Frutti",
    subtitolo: "Raccolgo",
    guida: "Qual è il frutto di questa preghiera? Un'intuizione, un proposito, una consolazione?",
    placeholder: "Il frutto di questo momento è…",
    icona: "④",
  },
];

type LectioFields = { lectio: string; meditatio: string; oratio: string; contemplatio: string };
type IgnazianaFields = { composizioneLuogo: string; colloquio: string; esameConscienza: string; frutti: string };

// ── Ignaziana conversation panel ──────────────────────────────────────────────

function GuidaPanelIgnaziana({
  guida,
  stepId,
  letture,
  testoUtente,
}: {
  guida: ReturnType<typeof useGuidaIgnaziana>;
  stepId: string;
  letture: { tipo: string; riferimento: string; testo: string }[];
  testoUtente: string;
}) {
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [guida.conversazione, guida.streamingTesto]);

  function inviaRisposta() {
    const msg = input.trim();
    if (!msg || guida.loading) return;
    setInput("");
    guida.invia({ messaggioCorrente: msg, stepId, letture });
  }

  function chiediSulTesto() {
    if (!testoUtente.trim() || guida.loading) return;
    guida.invia({
      messaggioCorrente: `Ho scritto questo nel mio diario spirituale: "${testoUtente.trim()}". Cosa ne pensi?`,
      stepId,
      letture,
    });
  }

  const haConversazione = guida.conversazione.length > 0 || guida.streamingTesto || guida.loading;

  return (
    <div className="border border-primary/25 bg-card flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-border/60">
        <div className="flex items-center gap-2">
          <MessageCircle className="w-3.5 h-3.5 text-primary/60" />
          <span className="text-[10px] uppercase tracking-widest text-primary/70">
            Padre Benedetto · Guida Ignaziana
          </span>
        </div>
        {guida.loading && (
          <button
            onClick={guida.annulla}
            className="flex items-center gap-1 text-[10px] uppercase tracking-widest text-muted-foreground hover:text-foreground"
          >
            <StopCircle className="w-3 h-3" /> Interrompi
          </button>
        )}
      </div>

      {/* Conversation area */}
      <div
        ref={scrollRef}
        className={`px-5 py-4 overflow-y-auto space-y-4 ${haConversazione ? "min-h-[140px] max-h-[320px]" : "min-h-[80px]"}`}
      >
        {!haConversazione && (
          <div className="flex items-center gap-2 py-2">
            <Loader2 className="w-3.5 h-3.5 text-primary/40 animate-spin" />
            <span className="text-muted-foreground text-xs italic">
              Il padre sta meditando sul brano…
            </span>
          </div>
        )}

        {guida.conversazione.map((msg, i) => (
          <MsgBubble key={i} msg={msg} />
        ))}

        {/* Current streaming response */}
        {guida.streamingTesto && (
          <div className="text-foreground/85 font-serif text-sm leading-relaxed">
            {guida.streamingTesto}
            <span className="inline-block w-0.5 h-4 bg-primary/50 animate-pulse ml-0.5 align-middle" />
          </div>
        )}

        {/* Loading indicator (no text yet) */}
        {guida.loading && !guida.streamingTesto && (
          <div className="flex items-center gap-2">
            <Loader2 className="w-3.5 h-3.5 text-primary/40 animate-spin" />
            <span className="text-muted-foreground text-xs italic">Il padre sta meditando…</span>
          </div>
        )}

        {guida.errore && (
          <p className="text-muted-foreground text-xs">{guida.errore}</p>
        )}
      </div>

      {/* Action bar */}
      <div className="border-t border-border/60 px-4 py-3 space-y-2">
        {/* Ask about written text */}
        {testoUtente.trim().length > 10 && (
          <button
            onClick={chiediSulTesto}
            disabled={guida.loading}
            className="w-full text-left text-xs text-primary/70 hover:text-primary border border-primary/15 hover:border-primary/40 px-4 py-2 transition-all flex items-center gap-2 disabled:opacity-50"
          >
            <Sparkles className="w-3 h-3 flex-shrink-0" />
            <span>Chiedi un commento su ciò che ho scritto</span>
          </button>
        )}

        {/* Free-form reply input */}
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); inviaRisposta(); } }}
            placeholder="Scrivi al padre spirituale…"
            disabled={guida.loading}
            className="flex-1 bg-background border border-border px-4 py-2 text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary/50 disabled:opacity-50"
          />
          <button
            onClick={inviaRisposta}
            disabled={!input.trim() || guida.loading}
            className="px-4 py-2 border border-primary/30 text-primary hover:bg-primary/5 transition-colors disabled:opacity-30"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

function MsgBubble({ msg }: { msg: Messaggio }) {
  if (msg.role === "assistant") {
    return (
      <div className="text-foreground/85 font-serif text-sm leading-relaxed">
        {msg.content}
      </div>
    );
  }
  // User message — show only if it's not the automated intro invocation
  const isAutoIntro = msg.content.startsWith("Sono pronto a iniziare") ||
    msg.content.startsWith("Ho terminato") ||
    msg.content.startsWith("Entriamo nell") ||
    msg.content.startsWith("Siamo all'ultima");
  if (isAutoIntro) return null;

  return (
    <div className="flex justify-end">
      <div className="bg-primary/5 border border-primary/15 px-4 py-2 max-w-[85%] text-sm text-foreground/80 leading-relaxed">
        {msg.content.startsWith("Ho scritto questo nel mio diario spirituale: \"")
          ? msg.content.replace(/^Ho scritto questo nel mio diario spirituale: "/, "").replace(/".*$/, " ✦")
          : msg.content}
      </div>
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────

export default function PraticaSpirituale() {
  const [location] = useLocation();
  const { user } = useAuth();
  const qc = useQueryClient();
  const guida = useGuidaSpirituale();
  const guidaIgn = useGuidaIgnaziana();

  const params     = new URLSearchParams(window.location.search);
  const data       = params.get("data") ?? todayISO();
  const tipoQP     = params.get("tipo") === "ignaziana" ? "ignaziana" : "lectio";
  const refQP      = params.get("ref") ?? "";

  const [tipo, setTipo]       = useState<"lectio" | "ignaziana">(tipoQP);
  const [currentStep, setCurrentStep] = useState(0);
  const [savedOk, setSavedOk] = useState(false);
  const [passaggioRef, setPassaggioRef] = useState(refQP);
  const [guidaAperta, setGuidaAperta] = useState(false);

  const [lectioFields, setLectioFields] = useState<LectioFields>({
    lectio: "", meditatio: "", oratio: "", contemplatio: "",
  });
  const [ignFields, setIgnFields] = useState<IgnazianaFields>({
    composizioneLuogo: "", colloquio: "", esameConscienza: "", frutti: "",
  });

  const { data: liturgia } = useBGetLiturgiaGiorno(
    { data },
    { query: { queryKey: getBGetLiturgiaGiornoQueryKey({ data }) } }
  );

  const letture = liturgia?.letture?.map((l) => ({
    tipo: l.tipo,
    riferimento: l.riferimento,
    testo: l.testo.slice(0, 500),
  })) ?? [];

  const { data: existingPratiche = [] } = useBGetPraticheByDate(data, {
    query: { enabled: !!user, queryKey: getBGetPraticheByDateQueryKey(data) },
  });

  useEffect(() => {
    const existing = existingPratiche.find((p) => p.tipo === tipo);
    if (!existing) return;
    if (tipo === "lectio") {
      setLectioFields({
        lectio:       existing.lectio       ?? "",
        meditatio:    existing.meditatio    ?? "",
        oratio:       existing.oratio       ?? "",
        contemplatio: existing.contemplatio ?? "",
      });
    } else {
      setIgnFields({
        composizioneLuogo: existing.composizioneLuogo ?? "",
        colloquio:         existing.colloquio         ?? "",
        esameConscienza:   existing.esameConscienza   ?? "",
        frutti:            existing.frutti            ?? "",
      });
    }
    if (existing.passaggioRef) setPassaggioRef(existing.passaggioRef);
  }, [existingPratiche, tipo]);

  // Reset lectio guide when step/tipo changes
  useEffect(() => {
    guida.reset();
    setGuidaAperta(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStep, tipo]);

  // Auto-trigger ignaziana guide intro when entering a step (no auth needed)
  useEffect(() => {
    if (tipo !== "ignaziana") return;
    guidaIgn.resetStep();
    // Delay slightly so the reset clears first
    const t = setTimeout(() => {
      const stepId = IGNAZIANA_STEPS[currentStep]!.id;
      guidaIgn.invia({ stepId, letture });
    }, 150);
    return () => clearTimeout(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStep, tipo, user]);

  const { mutate: savePratica, isPending: saving } = useBSavePratica({
    mutation: {
      onSuccess: () => {
        qc.invalidateQueries({ queryKey: getBGetPraticheByDateQueryKey(data) });
        setSavedOk(true);
        setTimeout(() => setSavedOk(false), 3000);
      },
    },
  });

  function handleSave() {
    if (!user) return;
    const base = { data, tipo, passaggioRef: passaggioRef || undefined };
    if (tipo === "lectio") savePratica({ data: { ...base, ...lectioFields } });
    else savePratica({ data: { ...base, ...ignFields } });
  }

  function richiediGuidaLectio() {
    const step = steps[currentStep]!;
    const currentValue = lectioFields[step.id as keyof LectioFields];
    guida.richiedi({
      tipo,
      stepId: step.id,
      testoUtente: currentValue,
      letture: liturgia?.letture?.map((l) => ({
        tipo: l.tipo,
        riferimento: l.riferimento,
        testo: l.testo.slice(0, 600),
      })) ?? [],
    });
    setGuidaAperta(true);
  }

  const steps = tipo === "lectio" ? LECTIO_STEPS : IGNAZIANA_STEPS;
  const step  = steps[currentStep]!;
  const currentValue =
    tipo === "lectio"
      ? lectioFields[step.id as keyof LectioFields]
      : ignFields[step.id as keyof IgnazianaFields];

  function setCurrentValue(v: string) {
    if (tipo === "lectio") setLectioFields((f) => ({ ...f, [step.id]: v }));
    else setIgnFields((f) => ({ ...f, [step.id]: v }));
  }

  const filledSteps = steps.filter((s) => {
    const val = tipo === "lectio"
      ? lectioFields[s.id as keyof LectioFields]
      : ignFields[s.id as keyof IgnazianaFields];
    return val?.trim().length > 0;
  }).length;

  return (
    <div className="w-full min-h-screen">

      {/* ── HEADER ── */}
      <section className="bg-background border-b border-border py-8">
        <div className="container mx-auto px-6 max-w-3xl">
          <Link
            href={`/liturgia?data=${data}`}
            className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors mb-6"
          >
            <ArrowLeft className="w-3 h-3" /> Letture del giorno
          </Link>

          <div className="flex gap-2 mb-6">
            <button
              onClick={() => { setTipo("lectio"); setCurrentStep(0); guida.reset(); setGuidaAperta(false); }}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs uppercase tracking-widest border transition-colors ${tipo === "lectio" ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"}`}
            >
              <BookOpen className="w-3.5 h-3.5" /> Lectio Divina
            </button>
            <button
              onClick={() => { setTipo("ignaziana"); setCurrentStep(0); guida.reset(); setGuidaAperta(false); }}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs uppercase tracking-widest border transition-colors ${tipo === "ignaziana" ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"}`}
            >
              <Flame className="w-3.5 h-3.5" /> Esercizi Ignaziani
            </button>
          </div>

          <div>
            <label className="text-[10px] uppercase tracking-widest text-muted-foreground block mb-1">Brano di riferimento</label>
            <input
              type="text"
              value={passaggioRef}
              onChange={(e) => setPassaggioRef(e.target.value)}
              placeholder={liturgia?.letture?.find((l) => l.tipo === "vangelo")?.riferimento ?? "es. Lc 10, 38-42"}
              className="bg-card border border-border px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 w-full md:w-auto min-w-[220px] focus:outline-none focus:border-primary/60"
            />
          </div>
        </div>
      </section>

      {/* ── STEP INDICATOR ── */}
      <section className="bg-card border-b border-border py-4">
        <div className="container mx-auto px-6 max-w-3xl">
          <div className="flex gap-2 overflow-x-auto pb-1">
            {steps.map((s, idx) => {
              const filled = tipo === "lectio"
                ? !!lectioFields[s.id as keyof LectioFields]?.trim()
                : !!ignFields[s.id as keyof IgnazianaFields]?.trim();
              const isCurrent = currentStep === idx;

              return (
                <button
                  key={s.id}
                  onClick={() => setCurrentStep(idx)}
                  className={`flex-none flex items-center gap-2 px-4 py-2 text-xs uppercase tracking-widest border transition-all ${isCurrent ? "border-primary text-primary bg-primary/5" : filled ? "border-primary/25 text-foreground/70 bg-background" : "border-border text-muted-foreground bg-background"}`}
                >
                  <span className={`font-serif text-sm ${isCurrent ? "text-primary" : "text-muted-foreground"}`}>{s.icona}</span>
                  {s.label}
                  {filled && !isCurrent && <CheckCircle className="w-3 h-3 text-primary/50" />}
                </button>
              );
            })}
          </div>
          <div className="mt-3 h-px bg-border relative">
            <div
              className="absolute top-0 left-0 h-px bg-primary transition-all duration-500"
              style={{ width: `${(filledSteps / steps.length) * 100}%` }}
            />
          </div>
        </div>
      </section>

      {/* ── PRATICA AREA ── */}
      <section className="py-12 bg-background">
        <div className="container mx-auto px-6 max-w-3xl">
          <div className="mb-8">
            <div className="flex items-baseline gap-3 mb-2">
              <span className="font-serif text-4xl text-primary/20">{step.icona}</span>
              <div>
                <p className="text-primary tracking-[0.3em] text-xs uppercase mb-0.5">{step.subtitolo}</p>
                <h2 className="font-serif text-2xl text-foreground">{step.label}</h2>
              </div>
            </div>
            <p className="text-muted-foreground font-light text-sm leading-relaxed max-w-xl mt-4 bg-card border border-border px-5 py-4">
              {step.guida}
            </p>
          </div>

          {/* ── GUIDA: Ignaziana (conversational, sempre visibile) ── */}
          {tipo === "ignaziana" && (
            <div className="mb-6">
              <GuidaPanelIgnaziana
                guida={guidaIgn}
                stepId={step.id}
                letture={letture}
                testoUtente={currentValue}
              />
            </div>
          )}

          {/* ── AREA DI SCRITTURA ── */}
          <textarea
            value={currentValue}
            onChange={(e) => setCurrentValue(e.target.value)}
            placeholder={step.placeholder}
            rows={7}
            className="w-full bg-background border border-border px-6 py-5 text-foreground font-serif text-base leading-relaxed placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary/60 resize-none"
          />

          {/* ── GUIDA: Lectio (one-shot, sempre visibile) ── */}
          {tipo === "lectio" && (
            <div className="mt-4">
              {!guidaAperta ? (
                <button
                  onClick={richiediGuidaLectio}
                  className="flex items-center gap-2 text-xs uppercase tracking-widest text-primary/70 hover:text-primary border border-primary/20 hover:border-primary/50 px-5 py-2.5 transition-all"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  {(step as typeof LECTIO_STEPS[0]).guidaLabel}
                </button>
              ) : (
                <div className="border border-primary/20 bg-card">
                  <div className="flex items-center justify-between px-5 py-3 border-b border-border">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-3.5 h-3.5 text-primary/60" />
                      <span className="text-[10px] uppercase tracking-widest text-primary/60">
                        Padre Spirituale Benedettino
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      {guida.loading && (
                        <button onClick={guida.annulla} className="flex items-center gap-1 text-[10px] uppercase tracking-widest text-muted-foreground hover:text-foreground">
                          <StopCircle className="w-3 h-3" /> Interrompi
                        </button>
                      )}
                      {!guida.loading && (
                        <button
                          onClick={richiediGuidaLectio}
                          className="text-[10px] uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors"
                        >
                          ↺ Rigenera
                        </button>
                      )}
                      <button
                        onClick={() => { setGuidaAperta(false); guida.reset(); }}
                        className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                  <div className="px-6 py-5 min-h-[80px]">
                    {guida.loading && !guida.testo && (
                      <div className="flex items-center gap-3">
                        <Loader2 className="w-4 h-4 text-primary/40 animate-spin" />
                        <span className="text-muted-foreground text-xs uppercase tracking-widest">
                          Il padre sta meditando…
                        </span>
                      </div>
                    )}
                    {guida.testo && (
                      <div className="font-serif text-sm md:text-base text-foreground/85 leading-loose">
                        {guida.testo}
                        {guida.loading && (
                          <span className="inline-block w-0.5 h-4 bg-primary/50 animate-pulse ml-0.5 align-middle" />
                        )}
                      </div>
                    )}
                    {guida.errore && (
                      <p className="text-muted-foreground text-sm">{guida.errore}</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── NAVIGATION + SAVE ── */}
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex gap-3">
              <button
                onClick={() => setCurrentStep((s) => Math.max(0, s - 1))}
                disabled={currentStep === 0}
                className="px-5 py-2.5 border border-border text-muted-foreground text-xs uppercase tracking-widest hover:border-primary/40 hover:text-foreground transition-colors disabled:opacity-30"
              >
                ← Indietro
              </button>
              {currentStep < steps.length - 1 && (
                <button
                  onClick={() => setCurrentStep((s) => s + 1)}
                  className="flex items-center gap-2 px-5 py-2.5 border border-primary/40 text-primary text-xs uppercase tracking-widest hover:bg-primary/5 transition-colors"
                >
                  Avanti <ChevronRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {user ? (
              <button
                onClick={handleSave}
                disabled={saving}
                className={`flex items-center gap-2 px-7 py-3 text-xs uppercase tracking-widest transition-all ${savedOk ? "bg-green-700 text-white border border-green-700" : "bg-primary text-primary-foreground hover:bg-primary/85"}`}
              >
                {savedOk ? <><CheckCircle className="w-4 h-4" /> Salvata · +15 XP</> : saving ? "Salvataggio…" : <><Save className="w-4 h-4" /> Salva la Pratica</>}
              </button>
            ) : (
              <Link
                href="/login"
                className="text-xs uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors border-b border-muted-foreground/20 hover:border-primary/40 pb-0.5"
              >
                Accedi per salvare la pratica →
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* ── GUIDA SINTETICA ── */}
      <section className="py-12 bg-card border-t border-border">
        <div className="container mx-auto px-6 max-w-3xl">
          <p className="text-primary/50 tracking-[0.35em] text-[10px] uppercase mb-6">
            {tipo === "lectio" ? "Il metodo benedettino" : "Il metodo ignaziano"}
          </p>
          <div className="grid sm:grid-cols-2 gap-6">
            {steps.map((s, idx) => (
              <button
                key={s.id}
                onClick={() => setCurrentStep(idx)}
                className={`text-left border p-4 transition-all hover:border-primary/40 ${currentStep === idx ? "border-primary/40 bg-primary/3" : "border-border"}`}
              >
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="font-serif text-lg text-primary/30">{s.icona}</span>
                  <span className="text-xs uppercase tracking-widest text-muted-foreground">{s.subtitolo}</span>
                </div>
                <h4 className="font-serif text-base text-foreground">{s.label}</h4>
                <p className="text-muted-foreground text-xs mt-1 leading-relaxed font-light">{s.guida}</p>
              </button>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
