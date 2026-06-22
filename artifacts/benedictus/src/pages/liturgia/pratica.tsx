import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { ArrowLeft, Save, CheckCircle, BookOpen, Flame, ChevronRight, Sparkles, StopCircle, Loader2 } from "lucide-react";
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

function todayISO() { return new Date().toISOString().slice(0, 10); }

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
    guidaLabel: "Lasciati guidare nell'immaginazione apostolica",
  },
  {
    id: "colloquio" as const,
    label: "Colloquio",
    subtitolo: "Dialogo",
    guida: "Parla con Gesù come con un amico. Cosa vuoi dirgli? Cosa senti che ti risponde?",
    placeholder: "Gli dico… Sento che mi risponde… Tra noi è come se…",
    icona: "②",
    guidaLabel: "Ricevi accompagnamento nel tuo dialogo con Gesù",
  },
  {
    id: "esameConscienza" as const,
    label: "Esame di Coscienza",
    subtitolo: "Esamino",
    guida: "Ripercorri la giornata o la settimana: per cosa ringrazi? Dove hai mancato? Cosa vuoi cambiare?",
    placeholder: "Ringrazio per… Riconosco di aver… Mi propongo di…",
    icona: "③",
    guidaLabel: "Ricevi guida nel discernimento ignaziano",
  },
  {
    id: "frutti" as const,
    label: "Frutti",
    subtitolo: "Raccolgo",
    guida: "Qual è il frutto di questa preghiera? Un'intuizione, un proposito, una consolazione?",
    placeholder: "Il frutto di questo momento è…",
    icona: "④",
    guidaLabel: "Ricevi la benedizione apostolica finale",
  },
];

type LectioFields = { lectio: string; meditatio: string; oratio: string; contemplatio: string };
type IgnazianaFields = { composizioneLuogo: string; colloquio: string; esameConscienza: string; frutti: string };

export default function PraticaSpirituale() {
  const [location] = useLocation();
  const { user } = useAuth();
  const qc = useQueryClient();
  const guida = useGuidaSpirituale();

  const params     = new URLSearchParams(location.split("?")[1] ?? "");
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

  // Reset guida when step changes
  useEffect(() => {
    guida.reset();
    setGuidaAperta(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStep, tipo]);

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

  function richiediGuida() {
    const step = steps[currentStep]!;
    const currentValue = tipo === "lectio"
      ? lectioFields[step.id as keyof LectioFields]
      : ignFields[step.id as keyof IgnazianaFields];

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

          {!user ? (
            <div className="text-center py-12 border border-border">
              <p className="text-foreground/70 font-serif text-lg mb-3">Accedi per salvare la tua pratica</p>
              <p className="text-muted-foreground text-sm font-light mb-6">
                La riflessione è aperta a tutti, ma solo gli utenti registrati possono salvare il diario spirituale.
              </p>
              <Link href="/login" className="inline-block bg-primary text-primary-foreground px-8 py-3 text-xs uppercase tracking-widest hover:bg-primary/85 transition-colors">
                Accedi
              </Link>
            </div>
          ) : (
            <>
              <textarea
                value={currentValue}
                onChange={(e) => setCurrentValue(e.target.value)}
                placeholder={step.placeholder}
                rows={8}
                className="w-full bg-background border border-border px-6 py-5 text-foreground font-serif text-base leading-relaxed placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary/60 resize-none"
              />

              {/* ── GUIDA AI ── */}
              <div className="mt-4">
                {!guidaAperta ? (
                  <button
                    onClick={richiediGuida}
                    className="flex items-center gap-2 text-xs uppercase tracking-widest text-primary/70 hover:text-primary border border-primary/20 hover:border-primary/50 px-5 py-2.5 transition-all"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    {step.guidaLabel}
                  </button>
                ) : (
                  <div className="border border-primary/20 bg-card">
                    <div className="flex items-center justify-between px-5 py-3 border-b border-border">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-3.5 h-3.5 text-primary/60" />
                        <span className="text-[10px] uppercase tracking-widest text-primary/60">
                          {tipo === "lectio" ? "Padre Spirituale Benedettino" : "Guida Ignaziana"}
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
                            onClick={richiediGuida}
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
                            {tipo === "lectio" ? "Il padre sta meditando…" : "La guida sta riflettendo…"}
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
            </>
          )}

          {/* ── NAVIGATION + SAVE ── */}
          {user && (
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

              <button
                onClick={handleSave}
                disabled={saving}
                className={`flex items-center gap-2 px-7 py-3 text-xs uppercase tracking-widest transition-all ${savedOk ? "bg-green-700 text-white border border-green-700" : "bg-primary text-primary-foreground hover:bg-primary/85"}`}
              >
                {savedOk ? <><CheckCircle className="w-4 h-4" /> Salvata · +15 XP</> : saving ? "Salvataggio…" : <><Save className="w-4 h-4" /> Salva la Pratica</>}
              </button>
            </div>
          )}
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
