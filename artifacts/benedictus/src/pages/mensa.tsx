import { useState } from "react";
import { ChevronDown, ChevronUp, BookOpen, UtensilsCrossed, Clock, Leaf, Coffee, Droplets } from "lucide-react";
import {
  getMenuGiorno,
  getStagione,
  getNomeStagione,
  getColore,
  getIndicazioneStagionale,
  formatDataLiturgica,
  type Piatto,
  type Pasto,
} from "@/lib/mensa";

const COLORE_CLASSE: Record<string, string> = {
  verde: "bg-emerald-700/20 text-emerald-300/80 border-emerald-700/30",
  viola: "bg-purple-800/20 text-purple-300/80 border-purple-800/30",
  bianco: "bg-amber-100/10 text-amber-100/80 border-amber-100/20",
  rosso: "bg-red-800/20 text-red-300/80 border-red-800/30",
};

function BevandeBadges({ bevande }: { bevande: string[] }) {
  if (!bevande || bevande.length === 0) return null;
  return (
    <div className="flex flex-wrap items-center gap-2 mt-3">
      <Droplets className="w-3 h-3 text-primary/40 flex-none" />
      {bevande.map((b, i) => (
        <span
          key={i}
          className="text-[9px] uppercase tracking-[0.2em] text-primary/55 border border-primary/20 px-2 py-0.5"
        >
          {b}
        </span>
      ))}
    </div>
  );
}

function RicettaCard({ piatto }: { piatto: Piatto }) {
  const [aperta, setAperta] = useState(false);

  return (
    <div className="border border-border/40 bg-card/50">
      <button
        onClick={() => setAperta((v) => !v)}
        className="w-full flex items-start justify-between gap-4 px-5 py-4 text-left group hover:bg-primary/4 transition-colors"
      >
        <div className="flex-1">
          <p className="text-[9px] uppercase tracking-[0.25em] text-primary/50 mb-0.5">
            {piatto.portata}
          </p>
          <p className="font-serif text-base text-foreground group-hover:text-primary transition-colors leading-snug">
            {piatto.nome}
          </p>
          <div className="flex items-center gap-3 mt-1">
            <span className="flex items-center gap-1 text-[10px] text-muted-foreground/50">
              <Clock className="w-2.5 h-2.5" />
              {piatto.tempo}
            </span>
          </div>
        </div>
        <span className="text-muted-foreground/40 mt-1 flex-none">
          {aperta ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </span>
      </button>

      {aperta && (
        <div className="px-5 pb-5 border-t border-border/30 animate-in slide-in-from-top-1 duration-200">
          <div className="mt-4 mb-5">
            <p className="text-[9px] uppercase tracking-[0.3em] text-primary/40 mb-3 flex items-center gap-2">
              <Leaf className="w-2.5 h-2.5" /> Ingredienti
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
              {piatto.ingredienti.map((ing, i) => (
                <div key={i} className="flex items-baseline gap-2">
                  <span className="text-primary/60 font-mono text-[10px] min-w-[52px] text-right shrink-0">
                    {ing.q}
                  </span>
                  <span className="text-foreground/75 text-[11px]">{ing.nome}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <p className="text-[9px] uppercase tracking-[0.3em] text-primary/40 mb-3 flex items-center gap-2">
              <UtensilsCrossed className="w-2.5 h-2.5" /> Preparazione
            </p>
            <ol className="space-y-2.5">
              {piatto.preparazione.map((passo, i) => (
                <li key={i} className="flex gap-3">
                  <span className="font-serif text-primary/40 text-sm flex-none w-4 pt-px">
                    {i + 1}.
                  </span>
                  <p className="text-foreground/70 text-sm font-light leading-relaxed">
                    {passo}
                  </p>
                </li>
              ))}
            </ol>
          </div>

          {piatto.nota && (
            <div className="mt-4 border-l-2 border-primary/20 pl-4 py-1">
              <p className="text-xs text-muted-foreground/60 font-light italic leading-relaxed">
                {piatto.nota}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function LetturaCard({ lettura }: { lettura: Pasto["lettura"] }) {
  return (
    <div className="bg-primary/5 border border-primary/15 px-6 py-5">
      <div className="flex items-start gap-3 mb-4">
        <BookOpen className="w-3.5 h-3.5 text-primary/50 flex-none mt-0.5" />
        <div>
          <p className="text-[9px] uppercase tracking-[0.3em] text-primary/50 mb-0.5">
            Lectio Mensalis
          </p>
          <p className="text-xs text-muted-foreground/70 italic">{lettura.rito}</p>
        </div>
      </div>
      <blockquote className="font-serif text-sm md:text-base text-foreground/85 leading-relaxed italic mb-4 border-l-2 border-primary/30 pl-4 whitespace-pre-line">
        {lettura.testo}
      </blockquote>
      <div>
        <p className="text-[10px] uppercase tracking-widest text-primary/50 mb-0.5">
          {lettura.titolo}
        </p>
        <p className="text-[10px] text-muted-foreground/40">{lettura.fonte}</p>
      </div>
    </div>
  );
}

function PastoSection({ pasto }: { pasto: Pasto }) {
  return (
    <div className="flex flex-col gap-6">
      {/* Ora + titolo + bevande */}
      <div>
        <div className="flex items-center gap-4">
          <div className="text-center">
            <p className="font-mono text-2xl text-primary tabular-nums">{pasto.ora}</p>
            <p className="text-[9px] uppercase tracking-[0.25em] text-muted-foreground/50">
              {pasto.oraLatina}
            </p>
          </div>
          <div className="h-px flex-1 bg-border/40" />
          <p className="text-[10px] uppercase tracking-[0.35em] text-foreground/50 font-display">
            {pasto.titolo}
          </p>
        </div>
        <BevandeBadges bevande={pasto.bevande} />
      </div>

      {/* Introduzione */}
      <p className="text-sm text-muted-foreground font-light leading-relaxed border-l border-border/50 pl-4">
        {pasto.introduzione}
      </p>

      {/* Lectio mensalis */}
      <LetturaCard lettura={pasto.lettura} />

      {/* Ricette */}
      <div>
        <p className="text-[9px] uppercase tracking-[0.35em] text-muted-foreground/40 mb-3">
          Menu del giorno
        </p>
        <div className="flex flex-col gap-2">
          {pasto.piatti.map((piatto, i) => (
            <RicettaCard key={i} piatto={piatto} />
          ))}
        </div>
      </div>
    </div>
  );
}

function ColazioneSection({ pasto }: { pasto: Pasto }) {
  return (
    <div className="flex flex-col gap-5">
      {/* Ora + titolo */}
      <div>
        <div className="flex items-center gap-4">
          <div className="text-center">
            <p className="font-mono text-xl text-primary/80 tabular-nums">{pasto.ora}</p>
            <p className="text-[9px] uppercase tracking-[0.25em] text-muted-foreground/50">
              {pasto.oraLatina}
            </p>
          </div>
          <div className="h-px flex-1 bg-border/30" />
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.35em] text-foreground/40 font-display">
            <Coffee className="w-3 h-3" />
            {pasto.titolo}
          </div>
        </div>
        <BevandeBadges bevande={pasto.bevande} />
      </div>

      {/* Introduzione */}
      <p className="text-sm text-muted-foreground/70 font-light leading-relaxed border-l border-border/30 pl-4 italic">
        {pasto.introduzione}
      </p>

      {/* Lettura breve */}
      <div className="bg-card/30 border border-border/30 px-5 py-4">
        <div className="flex items-center gap-2 mb-3">
          <BookOpen className="w-3 h-3 text-primary/40" />
          <p className="text-[9px] uppercase tracking-[0.3em] text-primary/40">Prima della colazione</p>
        </div>
        <p className="text-xs text-muted-foreground/60 italic mb-1">{pasto.lettura.rito}</p>
        <blockquote className="font-serif text-sm text-foreground/75 leading-relaxed italic border-l-2 border-primary/20 pl-3 mb-3 whitespace-pre-line">
          {pasto.lettura.testo}
        </blockquote>
        <p className="text-[9px] uppercase tracking-widest text-primary/40">{pasto.lettura.titolo}</p>
        <p className="text-[9px] text-muted-foreground/30">{pasto.lettura.fonte}</p>
      </div>

      {/* Cibi */}
      <div>
        <p className="text-[9px] uppercase tracking-[0.35em] text-muted-foreground/30 mb-2">
          Tavola mattutina
        </p>
        <div className="flex flex-col gap-2">
          {pasto.piatti.map((piatto, i) => (
            <RicettaCard key={i} piatto={piatto} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function MensaPage() {
  const stagione = getStagione();
  const colore = getColore(stagione);
  const dataFormatata = formatDataLiturgica();
  const [giornoSelezionato, setGiornoSelezionato] = useState(new Date().getDay());

  const giornoVisualizzato = getMenuGiorno(giornoSelezionato);

  const giorni = [
    { idx: 0, breve: "Dom" },
    { idx: 1, breve: "Lun" },
    { idx: 2, breve: "Mar" },
    { idx: 3, breve: "Mer" },
    { idx: 4, breve: "Gio" },
    { idx: 5, breve: "Ven" },
    { idx: 6, breve: "Sab" },
  ];

  return (
    <div className="w-full min-h-screen">

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="relative bg-background border-b border-border overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23c89b3c' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
        <div className="relative container mx-auto px-6 max-w-4xl py-20 text-center">
          <p className="text-[9px] uppercase tracking-[0.4em] text-muted-foreground/50 mb-5">
            Refettorio · Benedictus
          </p>
          <h1 className="font-serif text-4xl md:text-5xl text-foreground mb-4 leading-tight">
            La Tavola del Custode
          </h1>
          <p className="text-foreground/55 font-light text-base leading-relaxed max-w-xl mx-auto mb-7">
            Menu giornalieri, ricette e lectio mensalis secondo le tradizioni dell'Abbazia della Scala di Noci.
            Come nei monasteri, ogni pasto è preceduto da una lettura spirituale.
          </p>
          <div className="flex items-center justify-center gap-3 mb-3">
            <span className={`inline-flex items-center gap-2 px-3 py-1.5 text-[10px] uppercase tracking-widest border ${COLORE_CLASSE[colore]}`}>
              <span className="w-1.5 h-1.5 rounded-full bg-current" />
              {getNomeStagione(stagione)}
            </span>
          </div>
          <p className="text-[10px] text-muted-foreground/40 tracking-widest uppercase">
            {dataFormatata}
          </p>
        </div>
      </section>

      {/* ── INDICAZIONE STAGIONALE ───────────────────────────────────────── */}
      <section className="bg-card border-b border-border">
        <div className="container mx-auto px-6 max-w-3xl py-8 text-center">
          <p className="text-sm text-muted-foreground font-light leading-relaxed italic">
            {getIndicazioneStagionale(stagione)}
          </p>
        </div>
      </section>

      {/* ── SELETTORE GIORNO ─────────────────────────────────────────────── */}
      <section className="bg-card/50 border-b border-border sticky top-0 z-10">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="flex items-center justify-center gap-1 py-3 overflow-x-auto scrollbar-none">
            {giorni.map(({ idx, breve }) => {
              const isOggi = idx === new Date().getDay();
              const isSelezionato = idx === giornoSelezionato;
              return (
                <button
                  key={idx}
                  onClick={() => setGiornoSelezionato(idx)}
                  className={`flex-none px-4 py-2 text-[10px] uppercase tracking-widest transition-colors border whitespace-nowrap ${
                    isSelezionato
                      ? "bg-primary text-primary-foreground border-primary"
                      : isOggi
                      ? "border-primary/40 text-primary"
                      : "border-border/40 text-muted-foreground hover:text-foreground hover:border-primary/30"
                  }`}
                >
                  {breve}
                  {isOggi && !isSelezionato && (
                    <span className="ml-1.5 w-1 h-1 rounded-full bg-primary/60 inline-block align-middle" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── INTESTAZIONE GIORNO ──────────────────────────────────────────── */}
      <section className="bg-background border-b border-border/50 py-8">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="flex items-baseline gap-4">
            <h2 className="font-serif text-3xl text-foreground">
              {giornoVisualizzato.nomeBreve}
            </h2>
            <span className="text-muted-foreground/40 text-sm font-light italic">
              {giornoVisualizzato.nomeLiturgico}
            </span>
          </div>
          <p className="text-sm text-muted-foreground font-light leading-relaxed mt-2 max-w-2xl border-l-2 border-primary/20 pl-4">
            {giornoVisualizzato.indicazioneGiorno}
          </p>
        </div>
      </section>

      {/* ── COLAZIONE ────────────────────────────────────────────────────── */}
      <section className="py-10 bg-card/30 border-b border-border/50">
        <div className="container mx-auto px-6 max-w-4xl">
          <ColazioneSection pasto={giornoVisualizzato.colazione} />
        </div>
      </section>

      {/* ── PRANZO E CENA ────────────────────────────────────────────────── */}
      <section className="py-12 bg-background">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">

            {/* PRANZO */}
            <div>
              <PastoSection pasto={giornoVisualizzato.pranzo} />
            </div>

            {/* Divisore verticale — solo desktop */}
            <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-px bg-border/30 pointer-events-none" />

            {/* CENA */}
            <div className="border-t border-border/40 pt-10 lg:border-t-0 lg:pt-0">
              <PastoSection pasto={giornoVisualizzato.cena} />
            </div>

          </div>
        </div>
      </section>

      {/* ── NORMA REGOLA ─────────────────────────────────────────────────── */}
      <section className="py-16 bg-card border-t border-border">
        <div className="container mx-auto px-6 max-w-2xl text-center">
          <p className="text-[9px] uppercase tracking-[0.4em] text-primary/40 mb-6">
            · Regula Benedicti · Cap. XXXVIII ·
          </p>
          <blockquote className="font-serif text-xl md:text-2xl text-foreground/70 italic leading-relaxed mb-5">
            «Durante i pasti dei fratelli non deve mancare la lettura.
            E non chiunque per caso prende il libro e si mette a leggere,
            ma chi legge per tutta la settimana comincerà la domenica.»
          </blockquote>
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground/30">
            Regola di San Benedetto, Cap. XXXVIII · Abbazia della Scala, Noci · Puglia
          </p>
        </div>
      </section>

    </div>
  );
}
