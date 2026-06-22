import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { ArrowLeft, Save, CheckCircle, BookOpen, Flame, ChevronRight } from "lucide-react";
import {
  useBSavePratica,
  useBGetPraticheByDate,
  getBGetPraticheByDateQueryKey,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/lib/auth";

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

// ── Lectio Divina steps ───────────────────────────────────────────────────────
const LECTIO_STEPS = [
  {
    id: "lectio" as const,
    label: "Lectio",
    subtitolo: "Leggo",
    guida: "Leggi lentamente il brano più volte. Quale parola o frase ti colpisce? Scrivila qui, senza ancora spiegarla — lascia che risuoni.",
    placeholder: "La parola o frase che mi ha colpito è…",
    icona: "I",
  },
  {
    id: "meditatio" as const,
    label: "Meditatio",
    subtitolo: "Rifletto",
    guida: "Cosa dice il testo a te, oggi, in questa stagione della tua vita? Lascia che la Parola scenda dal testo alla tua realtà concreta.",
    placeholder: "Il testo mi dice che… Nella mia vita questo significa…",
    icona: "II",
  },
  {
    id: "oratio" as const,
    label: "Oratio",
    subtitolo: "Prego",
    guida: "Rispondi a Dio con le tue parole. Non c'è preghiera giusta o sbagliata — è un dialogo. Ringrazia, chiedi, confessa, offri.",
    placeholder: "Signore, ti dico che… ti chiedo che… ti offro…",
    icona: "III",
  },
  {
    id: "contemplatio" as const,
    label: "Contemplatio",
    subtitolo: "Contemplo",
    guida: "Deponi le parole. Stai in silenzio con Dio. Dopo, scrivi in una frase sola ciò che resta — un'intenzione, un'immagine, una pace.",
    placeholder: "Ciò che rimane dopo il silenzio è…",
    icona: "IV",
  },
];

// ── Esercizi Ignaziani steps ──────────────────────────────────────────────────
const IGNAZIANA_STEPS = [
  {
    id: "composizioneLuogo" as const,
    label: "Composizione di Luogo",
    subtitolo: "Immagino",
    guida: "Usa l'immaginazione per entrare nella scena del Vangelo. Dove sei? Cosa vedi, senti, odori? Chi è presente? Descrivi la scena come se ci fossi.",
    placeholder: "Mi trovo in… Vedo… Sento… Noto che…",
    icona: "①",
  },
  {
    id: "colloquio" as const,
    label: "Colloquio",
    subtitolo: "Dialogo",
    guida: "Parla con Gesù, con il Padre o con la Vergine come si parla con un amico. Cosa vuoi dirgli? Cosa senti che ti risponde? Lascia fluire il dialogo.",
    placeholder: "Gli dico… Sento che mi risponde… Tra noi è come se…",
    icona: "②",
  },
  {
    id: "esameConscienza" as const,
    label: "Esame di Coscienza",
    subtitolo: "Esamino",
    guida: "Ripercorri la giornata o la settimana: per cosa ringrazi? Dove hai mancato? Cosa vuoi cambiare? Accogli la misericordia senza giudizio.",
    placeholder: "Ringrazio per… Riconosco di aver… Mi propongo di…",
    icona: "③",
  },
  {
    id: "frutti" as const,
    label: "Frutti",
    subtitolo: "Raccolgo",
    guida: "Qual è il frutto di questa preghiera? Un'intuizione, un proposito, una consolazione, una parola che porti con te. Cosa ti lasci nella vita?",
    placeholder: "Il frutto di questo momento è…",
    icona: "④",
  },
];

type LectioFields = { lectio: string; meditatio: string; oratio: string; contemplatio: string };
type IgnazianaFields = { composizioneLuogo: string; colloquio: string; esameConscienza: string; frutti: string };

export default function PraticaSpirituale() {
  const [location] = useLocation();
  const { user } = useAuth();
  const qc = useQueryClient();

  // Parse query params
  const params = new URLSearchParams(location.split("?")[1] ?? "");
  const data    = params.get("data")   ?? todayISO();
  const tipoQP  = params.get("tipo")   === "ignaziana" ? "ignaziana" : "lectio";
  const refQP   = params.get("ref")    ?? "";

  const [tipo, setTipo]        = useState<"lectio" | "ignaziana">(tipoQP);
  const [currentStep, setCurrentStep] = useState(0);
  const [savedOk, setSavedOk]  = useState(false);
  const [passaggioRef, setPassaggioRef] = useState(refQP);

  const [lectioFields, setLectioFields] = useState<LectioFields>({
    lectio: "", meditatio: "", oratio: "", contemplatio: "",
  });
  const [ignFields, setIgnFields] = useState<IgnazianaFields>({
    composizioneLuogo: "", colloquio: "", esameConscienza: "", frutti: "",
  });

  // Load existing practice if any
  const { data: existingPratiche = [] } = useBGetPraticheByDate(data, {
    query: {
      enabled: !!user,
      queryKey: getBGetPraticheByDateQueryKey(data),
    },
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
    if (tipo === "lectio") {
      savePratica({ data: { ...base, ...lectioFields } });
    } else {
      savePratica({ data: { ...base, ...ignFields } });
    }
  }

  const steps = tipo === "lectio" ? LECTIO_STEPS : IGNAZIANA_STEPS;
  const step  = steps[currentStep]!;

  const currentValue =
    tipo === "lectio"
      ? lectioFields[step.id as keyof LectioFields]
      : ignFields[step.id as keyof IgnazianaFields];

  function setCurrentValue(v: string) {
    if (tipo === "lectio") {
      setLectioFields((f) => ({ ...f, [step.id]: v }));
    } else {
      setIgnFields((f) => ({ ...f, [step.id]: v }));
    }
  }

  const filledSteps = steps.filter((s) => {
    const val =
      tipo === "lectio"
        ? lectioFields[s.id as keyof LectioFields]
        : ignFields[s.id as keyof IgnazianaFields];
    return val && val.trim().length > 0;
  }).length;

  const isLastStep = currentStep === steps.length - 1;

  return (
    <div className="w-full min-h-screen">

      {/* ── HEADER ──────────────────────────────────────────────────── */}
      <section className="bg-background border-b border-border py-8">
        <div className="container mx-auto px-6 max-w-3xl">
          <Link
            href={`/liturgia?data=${data}`}
            className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors mb-6"
          >
            <ArrowLeft className="w-3 h-3" /> Letture del giorno
          </Link>

          {/* Tipo selector */}
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => { setTipo("lectio"); setCurrentStep(0); }}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs uppercase tracking-widest border transition-colors ${
                tipo === "lectio"
                  ? "bg-primary text-primary-foreground border-primary"
                  : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" /> Lectio Divina
            </button>
            <button
              onClick={() => { setTipo("ignaziana"); setCurrentStep(0); }}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs uppercase tracking-widest border transition-colors ${
                tipo === "ignaziana"
                  ? "bg-primary text-primary-foreground border-primary"
                  : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
              }`}
            >
              <Flame className="w-3.5 h-3.5" /> Esercizi Ignaziani
            </button>
          </div>

          {/* Brano di riferimento */}
          <div>
            <label className="text-[10px] uppercase tracking-widest text-muted-foreground block mb-1">
              Brano di riferimento
            </label>
            <input
              type="text"
              value={passaggioRef}
              onChange={(e) => setPassaggioRef(e.target.value)}
              placeholder="es. Lc 10, 38-42"
              className="bg-card border border-border px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 w-full md:w-auto min-w-[220px] focus:outline-none focus:border-primary/60"
            />
          </div>
        </div>
      </section>

      {/* ── STEP INDICATOR ──────────────────────────────────────────── */}
      <section className="bg-card border-b border-border py-4">
        <div className="container mx-auto px-6 max-w-3xl">
          <div className="flex gap-2 overflow-x-auto pb-1">
            {steps.map((s, idx) => {
              const filled =
                tipo === "lectio"
                  ? !!lectioFields[s.id as keyof LectioFields]?.trim()
                  : !!ignFields[s.id as keyof IgnazianaFields]?.trim();
              const isCurrent = currentStep === idx;

              return (
                <button
                  key={s.id}
                  onClick={() => setCurrentStep(idx)}
                  className={`flex-none flex items-center gap-2 px-4 py-2 text-xs uppercase tracking-widest border transition-all ${
                    isCurrent
                      ? "border-primary text-primary bg-primary/5"
                      : filled
                      ? "border-primary/25 text-foreground/70 bg-background"
                      : "border-border text-muted-foreground bg-background"
                  }`}
                >
                  <span className={`font-serif text-sm ${isCurrent ? "text-primary" : "text-muted-foreground"}`}>
                    {s.icona}
                  </span>
                  {s.label}
                  {filled && !isCurrent && (
                    <CheckCircle className="w-3 h-3 text-primary/50" />
                  )}
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

      {/* ── PRATICA AREA ────────────────────────────────────────────── */}
      <section className="py-12 bg-background">
        <div className="container mx-auto px-6 max-w-3xl">

          {/* Step header */}
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

          {/* Writing area */}
          {!user ? (
            <div className="text-center py-12 border border-border">
              <p className="text-foreground/70 font-serif text-lg mb-3">Accedi per salvare la tua pratica</p>
              <p className="text-muted-foreground text-sm font-light mb-6">
                La riflessione è aperta a tutti, ma solo gli utenti registrati possono salvare il proprio diario spirituale.
              </p>
              <Link
                href="/login"
                className="inline-block bg-primary text-primary-foreground px-8 py-3 text-xs uppercase tracking-widest hover:bg-primary/85 transition-colors"
              >
                Accedi
              </Link>
            </div>
          ) : (
            <textarea
              value={currentValue}
              onChange={(e) => setCurrentValue(e.target.value)}
              placeholder={step.placeholder}
              rows={10}
              className="w-full bg-background border border-border px-6 py-5 text-foreground font-serif text-base leading-relaxed placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary/60 resize-none"
            />
          )}

          {/* Navigation + Save */}
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
                {!isLastStep ? (
                  <button
                    onClick={() => setCurrentStep((s) => Math.min(steps.length - 1, s + 1))}
                    className="flex items-center gap-2 px-5 py-2.5 border border-primary/40 text-primary text-xs uppercase tracking-widest hover:bg-primary/5 transition-colors"
                  >
                    Avanti <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                ) : null}
              </div>

              <button
                onClick={handleSave}
                disabled={saving}
                className={`flex items-center gap-2 px-7 py-3 text-xs uppercase tracking-widest transition-all ${
                  savedOk
                    ? "bg-green-700 text-white border border-green-700"
                    : "bg-primary text-primary-foreground hover:bg-primary/85"
                }`}
              >
                {savedOk ? (
                  <>
                    <CheckCircle className="w-4 h-4" /> Salvata · +15 XP
                  </>
                ) : saving ? (
                  "Salvataggio…"
                ) : (
                  <>
                    <Save className="w-4 h-4" /> Salva la Pratica
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ── GUIDA SINTETICA ─────────────────────────────────────────── */}
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
                className={`text-left border p-4 transition-all hover:border-primary/40 ${
                  currentStep === idx ? "border-primary/40 bg-primary/3" : "border-border"
                }`}
              >
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="font-serif text-lg text-primary/30">{s.icona}</span>
                  <span className="text-xs uppercase tracking-widest text-muted-foreground">{s.subtitolo}</span>
                </div>
                <h4 className="font-serif text-base text-foreground">{s.label}</h4>
              </button>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
