import { useState, useEffect } from "react";
import { useParams, Link } from "wouter";
import { ArrowLeft, ArrowRight, CheckCircle, Save, MessageSquare } from "lucide-react";
import { MODULI_RO } from "@/pages/regula-operis";

// ── LocalStorage helpers ──────────────────────────────────────────────────────

const LS_KEY     = "regula-operis-progress";
const LS_NOTES   = "regula-operis-notes";

interface ModuleProgress {
  moduleId: number;
  status: "idle" | "started" | "completed";
  startedAt?: string;
  completedAt?: string;
}

function loadProgress(): ModuleProgress[] {
  try { return JSON.parse(localStorage.getItem(LS_KEY) || "[]"); }
  catch { return []; }
}

function saveProgress(data: ModuleProgress[]) {
  localStorage.setItem(LS_KEY, JSON.stringify(data));
}

function loadNotes(): Record<number, string> {
  try { return JSON.parse(localStorage.getItem(LS_NOTES) || "{}"); }
  catch { return {}; }
}

function saveNotes(data: Record<number, string>) {
  localStorage.setItem(LS_NOTES, JSON.stringify(data));
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function RegulaOperisModulo() {
  const params = useParams<{ id: string }>();
  const moduleId = Number(params.id);

  const modulo     = MODULI_RO.find((m) => m.id === moduleId);
  const prevModule = moduleId > 1 ? moduleId - 1 : null;
  const nextModule = moduleId < MODULI_RO.length ? moduleId + 1 : null;

  const [progress, setProgress]   = useState<ModuleProgress[]>([]);
  const [notes, setNotes]         = useState<Record<number, string>>({});
  const [noteText, setNoteText]   = useState("");
  const [noteSaved, setNoteSaved] = useState(false);

  useEffect(() => {
    const p = loadProgress();
    const n = loadNotes();
    setProgress(p);
    setNotes(n);
    setNoteText(n[moduleId] ?? "");

    // Auto-start module on first visit
    const existing = p.find((x) => x.moduleId === moduleId);
    if (!existing) {
      const updated = [...p, { moduleId, status: "started" as const, startedAt: new Date().toISOString() }];
      saveProgress(updated);
      setProgress(updated);
    }
  }, [moduleId]);

  if (!modulo) {
    return (
      <div className="py-32 text-center">
        <p className="text-muted-foreground">Modulo non trovato.</p>
        <Link href="/regula-operis" className="text-primary hover:underline mt-4 inline-block">
          Torna a Regula Operis
        </Link>
      </div>
    );
  }

  const currentStatus = progress.find((p) => p.moduleId === moduleId)?.status ?? "idle";
  const isCompleted   = currentStatus === "completed";

  const handleSaveNotes = () => {
    const updated = { ...notes, [moduleId]: noteText };
    saveNotes(updated);
    setNotes(updated);
    setNoteSaved(true);
    setTimeout(() => setNoteSaved(false), 2000);
  };

  const handleComplete = () => {
    const updated = progress.map((p) =>
      p.moduleId === moduleId
        ? { ...p, status: "completed" as const, completedAt: new Date().toISOString() }
        : p
    );
    saveProgress(updated);
    setProgress(updated);
    // Also save any notes
    if (noteText) handleSaveNotes();
  };

  return (
    <div className="w-full">

      {/* ── Header ───────────────────────────────────────────────────── */}
      <section className="py-16 bg-background border-b border-border">
        <div className="container mx-auto px-6 max-w-3xl">
          <div className="flex items-center gap-3 mb-8">
            <Link
              href="/regula-operis"
              className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground/50 hover:text-primary transition-colors flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3 h-3" />
              Regula Operis
            </Link>
            <span className="text-border">·</span>
            <span className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground/50">
              {modulo.settimana}
            </span>
            {isCompleted && (
              <>
                <span className="text-border">·</span>
                <span className="text-[10px] uppercase tracking-[0.3em] text-primary/70 flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" />
                  Completato
                </span>
              </>
            )}
          </div>

          <h1 className="text-4xl md:text-5xl font-serif text-foreground mb-3">
            {modulo.titolo}
          </h1>
          <p className="text-muted-foreground/70 italic font-light text-lg">
            {modulo.sottotitolo}
          </p>
        </div>
      </section>

      {/* ── Versetto ─────────────────────────────────────────────────── */}
      <section className="py-12 bg-card border-b border-border">
        <div className="container mx-auto px-6 max-w-3xl">
          <div className="border-l-2 border-primary/40 pl-6">
            <p className="font-serif text-xl text-foreground italic leading-relaxed mb-3">
              «{modulo.versetto.testo}»
            </p>
            <p className="text-muted-foreground/60 font-light text-sm mb-1">
              {modulo.versetto.traduzione}
            </p>
            <p className="text-[10px] uppercase tracking-widest text-primary/50">
              {modulo.versetto.fonte}
            </p>
          </div>
        </div>
      </section>

      {/* ── Corpo ────────────────────────────────────────────────────── */}
      <section className="py-16 bg-background border-b border-border">
        <div className="container mx-auto px-6 max-w-3xl">
          <p className="text-muted-foreground font-light leading-relaxed text-lg mb-8">
            {modulo.descrizione}
          </p>

          {/* Folador insight */}
          <div className="bg-card border border-border p-6">
            <p className="text-[10px] uppercase tracking-[0.3em] text-primary/60 mb-3">
              Folador — L'Organizzazione Perfetta
            </p>
            <p className="text-muted-foreground/80 font-serif italic text-sm leading-relaxed">
              "{modulo.folador}"
            </p>
          </div>
        </div>
      </section>

      {/* ── Pratica ──────────────────────────────────────────────────── */}
      <section className="py-16 bg-card border-b border-border">
        <div className="container mx-auto px-6 max-w-3xl">
          <p className="text-[10px] uppercase tracking-[0.3em] text-primary mb-6">
            Pratica Settimanale
          </p>
          <h2 className="text-2xl font-serif text-foreground mb-4">
            {modulo.pratica.titolo}
          </h2>
          <p className="text-muted-foreground font-light leading-relaxed text-base">
            {modulo.pratica.descrizione}
          </p>
        </div>
      </section>

      {/* ── Riflessioni ──────────────────────────────────────────────── */}
      <section className="py-16 bg-background border-b border-border">
        <div className="container mx-auto px-6 max-w-3xl">
          <p className="text-[10px] uppercase tracking-[0.3em] text-primary mb-8">
            Domande di Esame
          </p>
          <div className="space-y-8">
            {modulo.riflessioni.map((domanda, i) => (
              <div key={i} className="flex gap-5">
                <span className="text-primary/40 font-serif text-xl leading-tight mt-0.5 flex-none">
                  {i + 1}.
                </span>
                <p className="text-muted-foreground font-light leading-relaxed italic text-base">
                  "{domanda}"
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Note personali ───────────────────────────────────────────── */}
      <section className="py-16 bg-card border-b border-border">
        <div className="container mx-auto px-6 max-w-3xl">
          <p className="text-[10px] uppercase tracking-[0.3em] text-primary mb-6">
            Il tuo Scriptorium
          </p>
          <p className="text-muted-foreground/60 text-sm font-light mb-4">
            Scrivi le tue riflessioni, le risposte alle domande, i frutti della pratica. 
            Salvate in locale, visibili solo a te.
          </p>
          <textarea
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            placeholder="Scrivi qui le tue riflessioni su questo modulo…"
            className="w-full h-40 bg-background border border-border text-foreground/90 text-sm font-light leading-relaxed placeholder:text-muted-foreground/30 p-4 resize-none outline-none focus:border-primary/40 transition-colors"
          />
          <div className="mt-3 flex items-center gap-3">
            <button
              onClick={handleSaveNotes}
              className="flex items-center gap-2 text-[11px] uppercase tracking-widest border border-border text-muted-foreground/60 hover:border-primary/40 hover:text-primary transition-colors px-4 py-2"
            >
              <Save className="w-3 h-3" />
              {noteSaved ? "Salvato" : "Salva"}
            </button>
            <Link
              href="/padre-benedetto"
              className="flex items-center gap-2 text-[11px] uppercase tracking-widest border border-border text-muted-foreground/60 hover:border-primary/40 hover:text-primary transition-colors px-4 py-2"
            >
              <MessageSquare className="w-3 h-3" />
              Chiedi a Padre Benedetto
            </Link>
          </div>
        </div>
      </section>

      {/* ── Completa / Navigazione ───────────────────────────────────── */}
      {!isCompleted && (
        <section className="py-14 bg-background border-b border-border text-center">
          <div className="container mx-auto px-6 max-w-3xl">
            <p className="text-muted-foreground font-light text-sm mb-6">
              Hai praticato e riflettuto su questo modulo. Quando sei pronto, segnalo come completato.
            </p>
            <button
              onClick={handleComplete}
              className="border border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all px-10 py-4 uppercase tracking-widest text-sm"
            >
              Segna come completato
            </button>
          </div>
        </section>
      )}

      {isCompleted && nextModule && (
        <section className="py-14 bg-background border-b border-border text-center">
          <div className="container mx-auto px-6 max-w-3xl">
            <p className="text-[10px] uppercase tracking-widest text-primary/60 mb-4">
              ✦ Modulo completato
            </p>
            <p className="text-muted-foreground font-light text-sm mb-6">
              Porta con te la pratica di questa settimana. Quando sei pronto, prosegui.
            </p>
            <Link
              href={`/regula-operis/${nextModule}`}
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-3 hover:bg-primary/85 transition-all uppercase tracking-widest text-sm"
            >
              Settimana {nextModule} <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      )}

      {isCompleted && !nextModule && (
        <section className="py-14 bg-card border-b border-border text-center">
          <div className="container mx-auto px-6 max-w-2xl">
            <p className="text-[10px] uppercase tracking-widest text-primary/60 mb-4">
              ✦ Regula Operis completata
            </p>
            <h2 className="text-2xl font-serif text-foreground mb-4 italic">
              "Ora et semper, in nomine Domini."
            </h2>
            <p className="text-muted-foreground font-light text-sm mb-6">
              Hai percorso le sei settimane. Ora la Regola non è più un testo da studiare: è una postura da incarnare.
            </p>
            <Link
              href="/regula-operis"
              className="text-primary hover:underline text-sm uppercase tracking-widest"
            >
              Torna all'indice
            </Link>
          </div>
        </section>
      )}

      {/* ── Navigazione moduli ───────────────────────────────────────── */}
      <section className="py-12 border-t border-border bg-card">
        <div className="container mx-auto px-6 max-w-3xl flex justify-between items-center">
          {prevModule ? (
            <Link
              href={`/regula-operis/${prevModule}`}
              className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Settimana {prevModule}
            </Link>
          ) : <div />}

          <Link
            href="/regula-operis"
            className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground/50 hover:text-primary transition-colors"
          >
            Regula Operis
          </Link>

          {nextModule ? (
            <Link
              href={`/regula-operis/${nextModule}`}
              className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors"
            >
              Settimana {nextModule}
              <ArrowRight className="w-4 h-4" />
            </Link>
          ) : <div />}
        </div>
      </section>

    </div>
  );
}
