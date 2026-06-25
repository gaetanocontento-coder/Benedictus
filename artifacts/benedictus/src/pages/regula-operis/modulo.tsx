import { useState, useEffect } from "react";
import { useParams, Link } from "wouter";
import { ArrowLeft, ArrowRight, CheckCircle, Save, MessageSquare } from "lucide-react";
import { MODULI_RO } from "@/pages/regula-operis";

// ── LocalStorage helpers ──────────────────────────────────────────────────────

const LS_KEY   = "regula-operis-progress";
const LS_NOTES = "regula-operis-notes";

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
  const params   = useParams<{ id: string }>();
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
    if (noteText) handleSaveNotes();
  };

  return (
    <div className="w-full">

      {/* ── Breadcrumb + Titolo ───────────────────────────────────────── */}
      <section className="pt-8 pb-10 md:pt-12 md:pb-14 bg-background border-b border-border">
        <div className="container mx-auto px-5 md:px-6 max-w-3xl">

          {/* Breadcrumb — compatto su mobile */}
          <div className="flex items-center gap-2 mb-6 flex-wrap">
            <Link
              href="/regula-operis"
              className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground/45 hover:text-primary transition-colors flex items-center gap-1"
            >
              <ArrowLeft className="w-3 h-3" />
              <span className="hidden sm:inline">Regula Operis</span>
              <span className="sm:hidden">Indice</span>
            </Link>
            <span className="text-border text-xs">·</span>
            <span className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground/40">
              {modulo.settimana}
            </span>
            {isCompleted && (
              <>
                <span className="text-border text-xs">·</span>
                <span className="text-[10px] uppercase tracking-[0.25em] text-primary/65 flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" />
                  <span>Completato</span>
                </span>
              </>
            )}
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif text-foreground mb-2 leading-tight">
            {modulo.titolo}
          </h1>
          <p className="text-muted-foreground/65 italic font-light text-base md:text-lg leading-relaxed">
            {modulo.sottotitolo}
          </p>
        </div>
      </section>

      {/* ── Versetto ─────────────────────────────────────────────────── */}
      <section className="py-10 md:py-12 bg-card border-b border-border">
        <div className="container mx-auto px-5 md:px-6 max-w-3xl">
          <div className="border-l-2 border-primary/40 pl-5 md:pl-6">
            <p className="font-serif text-lg md:text-xl text-foreground italic leading-relaxed mb-3">
              «{modulo.versetto.testo}»
            </p>
            <p className="text-muted-foreground/55 font-light text-sm mb-1">
              {modulo.versetto.traduzione}
            </p>
            <p className="text-[10px] uppercase tracking-widest text-primary/45">
              {modulo.versetto.fonte}
            </p>
          </div>
        </div>
      </section>

      {/* ── Corpo ────────────────────────────────────────────────────── */}
      <section className="py-12 md:py-16 bg-background border-b border-border">
        <div className="container mx-auto px-5 md:px-6 max-w-3xl space-y-6">
          <p className="text-muted-foreground font-light leading-relaxed text-base md:text-lg">
            {modulo.descrizione}
          </p>

          {/* Folador box */}
          <div className="bg-card border border-border p-5 md:p-6">
            <p className="text-[10px] uppercase tracking-[0.3em] text-primary/55 mb-3">
              Folador — L'Organizzazione Perfetta
            </p>
            <p className="text-muted-foreground/80 font-serif italic text-sm leading-relaxed">
              "{modulo.folador}"
            </p>
          </div>
        </div>
      </section>

      {/* ── Pratica ──────────────────────────────────────────────────── */}
      <section className="py-12 md:py-16 bg-card border-b border-border">
        <div className="container mx-auto px-5 md:px-6 max-w-3xl">
          <p className="text-[10px] uppercase tracking-[0.3em] text-primary mb-5">
            Pratica Settimanale
          </p>
          <h2 className="text-xl md:text-2xl font-serif text-foreground mb-4 leading-snug">
            {modulo.pratica.titolo}
          </h2>
          <p className="text-muted-foreground font-light leading-relaxed text-sm md:text-base">
            {modulo.pratica.descrizione}
          </p>
        </div>
      </section>

      {/* ── Domande ──────────────────────────────────────────────────── */}
      <section className="py-12 md:py-16 bg-background border-b border-border">
        <div className="container mx-auto px-5 md:px-6 max-w-3xl">
          <p className="text-[10px] uppercase tracking-[0.3em] text-primary mb-7">
            Domande di Esame
          </p>
          <div className="space-y-7">
            {modulo.riflessioni.map((domanda, i) => (
              <div key={i} className="flex gap-4">
                <span className="text-primary/35 font-serif text-lg md:text-xl leading-tight mt-0.5 flex-none">
                  {i + 1}.
                </span>
                <p className="text-muted-foreground font-light leading-relaxed italic text-sm md:text-base">
                  "{domanda}"
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Scriptorium ──────────────────────────────────────────────── */}
      <section className="py-12 md:py-16 bg-card border-b border-border">
        <div className="container mx-auto px-5 md:px-6 max-w-3xl">
          <p className="text-[10px] uppercase tracking-[0.3em] text-primary mb-2">
            Il tuo Scriptorium
          </p>
          <p className="text-muted-foreground/50 text-xs font-light mb-4 leading-relaxed">
            Scrivi le tue riflessioni o i frutti della pratica.
            Salvate in locale, visibili solo a te.
          </p>
          <textarea
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            placeholder="Scrivi qui le tue riflessioni su questo modulo…"
            rows={6}
            className="w-full bg-background border border-border text-foreground/90 text-sm font-light leading-relaxed placeholder:text-muted-foreground/25 p-4 resize-none outline-none focus:border-primary/40 transition-colors rounded-none"
          />
          {/* Azioni — stack su mobile, row su sm+ */}
          <div className="mt-3 flex flex-col sm:flex-row gap-2 sm:gap-3">
            <button
              onClick={handleSaveNotes}
              className="flex items-center justify-center gap-2 text-[11px] uppercase tracking-widest border border-border text-muted-foreground/60 hover:border-primary/40 hover:text-primary active:bg-card transition-colors px-4 py-3 sm:py-2 min-h-[44px] sm:min-h-0"
            >
              <Save className="w-3.5 h-3.5" />
              {noteSaved ? "Salvato ✓" : "Salva"}
            </button>
            <Link
              href="/padre-benedetto"
              className="flex items-center justify-center gap-2 text-[11px] uppercase tracking-widest border border-border text-muted-foreground/60 hover:border-primary/40 hover:text-primary active:bg-card transition-colors px-4 py-3 sm:py-2 min-h-[44px] sm:min-h-0"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              Chiedi a Padre Benedetto
            </Link>
          </div>
        </div>
      </section>

      {/* ── CTA Completa ─────────────────────────────────────────────── */}
      {!isCompleted && (
        <section className="py-12 bg-background border-b border-border">
          <div className="container mx-auto px-5 md:px-6 max-w-3xl text-center">
            <p className="text-muted-foreground font-light text-sm mb-6 max-w-md mx-auto">
              Hai praticato e riflettuto. Quando sei pronto, segna questo modulo come completato.
            </p>
            <button
              onClick={handleComplete}
              className="w-full sm:w-auto border border-primary text-primary hover:bg-primary hover:text-primary-foreground active:bg-primary/90 transition-all px-10 py-4 uppercase tracking-widest text-sm min-h-[52px]"
            >
              Segna come completato
            </button>
          </div>
        </section>
      )}

      {/* ── Completato → prossimo ─────────────────────────────────────── */}
      {isCompleted && nextModule && (
        <section className="py-12 bg-background border-b border-border">
          <div className="container mx-auto px-5 md:px-6 max-w-3xl text-center">
            <p className="text-[10px] uppercase tracking-widest text-primary/55 mb-3">
              ✦ Modulo completato
            </p>
            <p className="text-muted-foreground font-light text-sm mb-6">
              Porta con te la pratica di questa settimana. Quando sei pronto, prosegui.
            </p>
            <Link
              href={`/regula-operis/${nextModule}`}
              className="inline-flex items-center justify-center gap-2 w-full sm:w-auto bg-primary text-primary-foreground px-8 py-4 hover:bg-primary/85 active:bg-primary/75 transition-all uppercase tracking-widest text-sm min-h-[52px]"
            >
              Settimana {nextModule} <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      )}

      {/* ── Fine percorso ─────────────────────────────────────────────── */}
      {isCompleted && !nextModule && (
        <section className="py-14 bg-card border-b border-border text-center">
          <div className="container mx-auto px-5 md:px-6 max-w-2xl">
            <p className="text-[10px] uppercase tracking-widest text-primary/55 mb-4">
              ✦ Regula Operis completata
            </p>
            <h2 className="text-xl md:text-2xl font-serif text-foreground mb-4 italic">
              "Ora et semper, in nomine Domini."
            </h2>
            <p className="text-muted-foreground font-light text-sm mb-6 max-w-md mx-auto">
              Hai percorso le sei settimane. Ora la Regola non è più un testo da studiare: è una postura da incarnare.
            </p>
            <Link
              href="/regula-operis"
              className="text-primary hover:underline text-xs uppercase tracking-widest"
            >
              Torna all'indice
            </Link>
          </div>
        </section>
      )}

      {/* ── Navigazione moduli ───────────────────────────────────────── */}
      <section className="py-8 md:py-10 border-t border-border bg-card">
        <div className="container mx-auto px-5 md:px-6 max-w-3xl flex justify-between items-center gap-4">

          {/* Prev */}
          {prevModule ? (
            <Link
              href={`/regula-operis/${prevModule}`}
              className="flex items-center gap-2 text-[11px] uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors min-h-[44px]"
            >
              <ArrowLeft className="w-4 h-4 flex-none" />
              <span className="hidden sm:inline">Settimana {prevModule}</span>
              <span className="sm:hidden">{prevModule}</span>
            </Link>
          ) : <div />}

          {/* Index */}
          <Link
            href="/regula-operis"
            className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground/40 hover:text-primary transition-colors flex-none min-h-[44px] flex items-center"
          >
            <span className="hidden sm:inline">Regula Operis</span>
            <span className="sm:hidden">Indice</span>
          </Link>

          {/* Next */}
          {nextModule ? (
            <Link
              href={`/regula-operis/${nextModule}`}
              className="flex items-center gap-2 text-[11px] uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors min-h-[44px]"
            >
              <span className="hidden sm:inline">Settimana {nextModule}</span>
              <span className="sm:hidden">{nextModule}</span>
              <ArrowRight className="w-4 h-4 flex-none" />
            </Link>
          ) : <div />}
        </div>
      </section>

    </div>
  );
}
