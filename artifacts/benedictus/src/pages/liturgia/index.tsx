import { useState } from "react";
import { Link, useLocation } from "wouter";
import { BookOpen, Flame, ChevronLeft, ChevronRight, Loader2, AlertCircle } from "lucide-react";
import {
  useBGetLiturgiaGiorno,
  getBGetLiturgiaGiornoQueryKey,
  useBGetPraticheByDate,
  getBGetPraticheByDateQueryKey,
} from "@workspace/api-client-react";
import { useAuth } from "@/lib/auth";

const COLORE_MAP: Record<string, { bg: string; label: string }> = {
  verde:  { bg: "#2d6a2d", label: "Tempo Ordinario" },
  viola:  { bg: "#5c2d82", label: "Avvento / Quaresima" },
  rosso:  { bg: "#8b1a1a", label: "Martiri / Spirito Santo" },
  bianco: { bg: "#5a4a2a", label: "Solennità / Feste" },
};

function formatDateIT(iso: string) {
  const [y, m, d] = iso.split("-");
  const dt = new Date(Number(y), Number(m) - 1, Number(d));
  return dt.toLocaleDateString("it-IT", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function addDays(iso: string, delta: number): string {
  const [y, m, d] = iso.split("-").map(Number);
  const dt = new Date(y, m - 1, d + delta);
  return dt.toISOString().slice(0, 10);
}

const TIPO_ICONA: Record<string, string> = {
  prima_lettura:   "I",
  salmo:           "℣",
  seconda_lettura: "II",
  vangelo:         "✠",
};

export default function LiturgiaIndex() {
  const [, navigate] = useLocation();
  const { user } = useAuth();
  const [selectedData, setSelectedData] = useState(todayISO());
  const [expandedLettura, setExpandedLettura] = useState<string | null>("vangelo");

  const { data: liturgia, isLoading, isError } = useBGetLiturgiaGiorno(
    { data: selectedData },
    { query: { queryKey: getBGetLiturgiaGiornoQueryKey({ data: selectedData }) } }
  );

  const { data: pratiche = [] } = useBGetPraticheByDate(selectedData, {
    query: {
      enabled: !!user,
      queryKey: getBGetPraticheByDateQueryKey(selectedData),
    },
  });

  const haLectio    = pratiche.some((p) => p.tipo === "lectio");
  const haIgnaziana = pratiche.some((p) => p.tipo === "ignaziana");

  const colore = liturgia ? (COLORE_MAP[liturgia.colore] ?? COLORE_MAP.verde) : COLORE_MAP.verde;
  const isToday = selectedData === todayISO();

  return (
    <div className="w-full">

      {/* ── HERO ────────────────────────────────────────────────────── */}
      <section className="bg-background border-b border-border py-16">
        <div className="container mx-auto px-6 max-w-4xl">
          {/* Navigazione date */}
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={() => setSelectedData(addDays(selectedData, -1))}
              className="flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors text-xs uppercase tracking-widest"
            >
              <ChevronLeft className="w-4 h-4" /> Ieri
            </button>

            <div className="text-center">
              <p className="text-primary tracking-[0.35em] text-[10px] uppercase mb-1">Liturgia del Giorno</p>
              <h1 className="font-serif text-2xl md:text-3xl text-foreground capitalize">
                {formatDateIT(selectedData)}
              </h1>
              {!isToday && (
                <button
                  onClick={() => setSelectedData(todayISO())}
                  className="mt-2 text-[10px] uppercase tracking-widest text-primary hover:text-foreground transition-colors"
                >
                  ← Torna ad oggi
                </button>
              )}
            </div>

            <button
              onClick={() => {
                const next = addDays(selectedData, 1);
                if (next <= todayISO()) setSelectedData(next);
              }}
              disabled={isToday}
              className="flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors text-xs uppercase tracking-widest disabled:opacity-30"
            >
              Domani <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Colore liturgico */}
          {liturgia && (
            <div className="flex items-center justify-center gap-3 mb-10">
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: colore.bg }}
              />
              <span className="text-muted-foreground text-xs uppercase tracking-widest">
                {colore.label}
              </span>
              <span className="text-border">·</span>
              <span className="text-muted-foreground text-xs capitalize font-light">
                {liturgia.titoloLiturgico}
              </span>
            </div>
          )}
        </div>
      </section>

      {/* ── LETTURE ─────────────────────────────────────────────────── */}
      <section className="py-12 bg-card">
        <div className="container mx-auto px-6 max-w-4xl">

          {isLoading && (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
              <Loader2 className="w-6 h-6 text-primary/50 animate-spin" />
              <p className="text-muted-foreground text-xs uppercase tracking-widest">
                Convocando le letture…
              </p>
            </div>
          )}

          {isError && (
            <div className="flex flex-col items-center py-20 gap-4 text-center max-w-sm mx-auto">
              <AlertCircle className="w-8 h-8 text-primary/40" />
              <p className="font-serif text-xl text-foreground">Letture non disponibili</p>
              <p className="text-muted-foreground text-sm font-light leading-relaxed">
                Il servizio di letture liturgiche non è raggiungibile in questo momento.
                Puoi comunque aprire la tua pratica e inserire il brano manualmente.
              </p>
              <Link
                href={`/liturgia/pratica?data=${selectedData}`}
                className="mt-2 bg-primary text-primary-foreground px-6 py-3 text-xs uppercase tracking-widest hover:bg-primary/85 transition-colors"
              >
                Apri la Pratica
              </Link>
            </div>
          )}

          {liturgia && !isLoading && (
            <div className="space-y-4">
              {liturgia.letture.map((lettura) => {
                const isOpen = expandedLettura === lettura.tipo;
                const icona = TIPO_ICONA[lettura.tipo] ?? "·";
                const isVangelo = lettura.tipo === "vangelo";

                return (
                  <div
                    key={lettura.tipo}
                    className={`border transition-all duration-300 ${
                      isVangelo
                        ? "border-primary/30 bg-background"
                        : "border-border bg-background/70"
                    }`}
                  >
                    <button
                      className="w-full flex items-center gap-4 px-6 py-5 text-left group"
                      onClick={() => setExpandedLettura(isOpen ? null : lettura.tipo)}
                    >
                      <span
                        className={`font-serif text-sm flex-none w-7 text-center ${
                          isVangelo ? "text-primary" : "text-muted-foreground"
                        }`}
                      >
                        {icona}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className={`text-[10px] uppercase tracking-widest mb-0.5 ${
                          isVangelo ? "text-primary" : "text-muted-foreground"
                        }`}>
                          {lettura.label}
                        </p>
                        <p className={`font-serif text-base ${
                          isVangelo ? "text-foreground" : "text-foreground/80"
                        }`}>
                          {lettura.riferimento}
                        </p>
                      </div>
                      <ChevronRight
                        className={`w-4 h-4 text-muted-foreground flex-none transition-transform duration-200 ${
                          isOpen ? "rotate-90" : ""
                        }`}
                      />
                    </button>

                    {isOpen && (
                      <div className="px-6 pb-8 animate-in fade-in slide-in-from-top-2 duration-300">
                        {lettura.intro && (
                          <p className="text-xs uppercase tracking-widest text-muted-foreground mb-5 italic">
                            {lettura.intro}
                          </p>
                        )}
                        <div className="font-serif text-base md:text-lg text-foreground/90 leading-loose whitespace-pre-wrap border-l-2 border-primary/20 pl-5">
                          {lettura.testo}
                        </div>

                        {/* Quick-start practice from this reading */}
                        <div className="mt-8 pt-6 border-t border-border flex flex-col sm:flex-row gap-3">
                          <button
                            onClick={() => navigate(`/liturgia/pratica?data=${selectedData}&tipo=lectio&ref=${encodeURIComponent(lettura.riferimento)}`)}
                            className="flex items-center gap-2 border border-primary text-primary px-5 py-2.5 text-xs uppercase tracking-widest hover:bg-primary hover:text-primary-foreground transition-all"
                          >
                            <BookOpen className="w-3.5 h-3.5" />
                            Lectio Divina su questo brano
                          </button>
                          <button
                            onClick={() => navigate(`/liturgia/pratica?data=${selectedData}&tipo=ignaziana&ref=${encodeURIComponent(lettura.riferimento)}`)}
                            className="flex items-center gap-2 border border-border text-muted-foreground px-5 py-2.5 text-xs uppercase tracking-widest hover:border-primary/40 hover:text-foreground transition-all"
                          >
                            <Flame className="w-3.5 h-3.5" />
                            Esercizi Ignaziani
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* ── CTA PRATICA ─────────────────────────────────────────────── */}
      {!isLoading && !isError && liturgia && (
        <section className="py-14 bg-background border-t border-border">
          <div className="container mx-auto px-6 max-w-4xl">
            <p className="text-primary/50 tracking-[0.4em] text-[10px] uppercase mb-6 text-center">
              La tua pratica quotidiana
            </p>
            <div className="grid sm:grid-cols-2 gap-5 max-w-2xl mx-auto">

              {/* Lectio Divina */}
              <button
                onClick={() => navigate(`/liturgia/pratica?data=${selectedData}&tipo=lectio`)}
                className={`relative group flex flex-col gap-3 p-6 border text-left transition-all hover:border-primary/60 ${
                  haLectio ? "border-primary/40 bg-primary/3" : "border-border"
                }`}
              >
                {haLectio && (
                  <div className="absolute top-3 right-3 text-[9px] uppercase tracking-widest text-primary border border-primary/30 px-2 py-0.5">
                    Completata ✓
                  </div>
                )}
                <BookOpen className="w-5 h-5 text-primary/60" />
                <div>
                  <h3 className="font-serif text-lg text-foreground mb-1 group-hover:text-primary transition-colors">
                    Lectio Divina
                  </h3>
                  <p className="text-muted-foreground text-xs leading-relaxed font-light">
                    Quattro passi monastici: Lectio, Meditatio, Oratio, Contemplatio. La tradizione benedettina per nutrirsi della Parola.
                  </p>
                </div>
              </button>

              {/* Esercizi Ignaziani */}
              <button
                onClick={() => navigate(`/liturgia/pratica?data=${selectedData}&tipo=ignaziana`)}
                className={`relative group flex flex-col gap-3 p-6 border text-left transition-all hover:border-primary/60 ${
                  haIgnaziana ? "border-primary/40 bg-primary/3" : "border-border"
                }`}
              >
                {haIgnaziana && (
                  <div className="absolute top-3 right-3 text-[9px] uppercase tracking-widest text-primary border border-primary/30 px-2 py-0.5">
                    Completati ✓
                  </div>
                )}
                <Flame className="w-5 h-5 text-primary/60" />
                <div>
                  <h3 className="font-serif text-lg text-foreground mb-1 group-hover:text-primary transition-colors">
                    Esercizi Ignaziani
                  </h3>
                  <p className="text-muted-foreground text-xs leading-relaxed font-light">
                    Il metodo di Ignazio di Loyola: Composizione di luogo, Colloquio e Esame di coscienza. Per trovare Dio in tutte le cose.
                  </p>
                </div>
              </button>
            </div>

            {!user && (
              <p className="text-center text-muted-foreground text-xs font-light mt-8">
                <Link href="/login" className="text-primary hover:underline">Accedi</Link>
                {" "}per salvare la tua pratica quotidiana e guadagnare XP.
              </p>
            )}
          </div>
        </section>
      )}

      {/* ── NOTE SPIRITUALI ─────────────────────────────────────────── */}
      <section className="py-14 bg-card border-t border-border">
        <div className="container mx-auto px-6 max-w-4xl text-center">
          <p className="text-primary/40 tracking-[0.3em] text-[10px] uppercase mb-6">Nota bene</p>
          <p className="text-muted-foreground font-light text-sm leading-relaxed max-w-xl mx-auto">
            Le letture seguono il Lezionario CEI conforme al Rito Romano.
            La fonte è Evangelizo.org — un servizio gratuito per la comunità cattolica mondiale.
          </p>
          <div className="flex items-center justify-center gap-4 mt-8">
            <div className="h-px w-12 bg-primary/15" />
            <div className="w-1.5 h-1.5 bg-primary/20 rotate-45" />
            <div className="h-px w-12 bg-primary/15" />
          </div>
        </div>
      </section>

    </div>
  );
}
