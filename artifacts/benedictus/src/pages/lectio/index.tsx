import { useState } from "react";
import { Link } from "wouter";
import { ArrowRight, BookOpen, ChevronDown, ChevronUp } from "lucide-react";
import { useBListLectio, useBGetRegolaGiorno } from "@workspace/api-client-react";

const CATEGORIES = [
  { value: "", label: "Tutto" },
  { value: "ascolto", label: "Ascolto" },
  { value: "comunita", label: "Comunità" },
  { value: "ritmo", label: "Ritmo" },
  { value: "umilta", label: "Umiltà" },
  { value: "custodia", label: "Custodia" },
];

function todayISO() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function RegolaGiorno() {
  const [expanded, setExpanded] = useState(false);
  const { data, isLoading, isError } = useBGetRegolaGiorno({ data: todayISO() });

  if (isLoading) {
    return (
      <div className="border border-border p-8 bg-card/50 text-center">
        <p className="text-xs uppercase tracking-widest text-muted-foreground animate-pulse">
          Caricamento Regola...
        </p>
      </div>
    );
  }

  if (isError || !data) return null;

  const paragrafi = data.testo
    ? data.testo.split(/\n{2,}/).filter(Boolean)
    : [];

  const preview = paragrafi.slice(0, 2);
  const rest = paragrafi.slice(2);

  return (
    <div className="border border-primary/20 bg-card">
      {/* Header */}
      <div className="border-b border-border/50 px-8 py-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <BookOpen className="w-4 h-4 text-primary flex-shrink-0" />
          <p className="text-xs uppercase tracking-[0.25em] text-primary">
            Regola di San Benedetto — Oggi
          </p>
        </div>
        <span className="text-xs text-muted-foreground font-mono border border-border px-2 py-0.5">
          {data.etichetta}
        </span>
      </div>

      {/* Body */}
      <div className="px-8 py-6">
        <h3 className="text-xl font-serif text-foreground mb-1">
          {data.capitolo === 0 ? "Prologo" : `Capitolo ${data.capitolo}`}
        </h3>
        <p className="text-sm text-muted-foreground mb-5 italic">
          {data.titoloCapitolo}
        </p>

        {data.versoInizio && (
          <p className="text-xs text-primary/70 uppercase tracking-widest mb-4">
            Lettura dal verso {data.versoInizio}
          </p>
        )}

        {paragrafi.length > 0 ? (
          <div className="space-y-3 text-muted-foreground font-light leading-relaxed text-sm">
            {preview.map((p, i) => (
              <p key={i}>{p}</p>
            ))}

            {rest.length > 0 && (
              <>
                {expanded && rest.map((p, i) => (
                  <p key={i + 100}>{p}</p>
                ))}
                <button
                  onClick={() => setExpanded(!expanded)}
                  className="flex items-center gap-1.5 text-xs uppercase tracking-widest text-primary hover:text-foreground transition-colors pt-1"
                >
                  {expanded ? (
                    <><ChevronUp className="w-3 h-3" /> Comprimi</>
                  ) : (
                    <><ChevronDown className="w-3 h-3" /> Leggi tutto</>
                  )}
                </button>
              </>
            )}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground italic">
            Testo non disponibile. Consulta il{" "}
            <a
              href="https://www.ora-et-labora.net/RSB_it.html"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline underline-offset-2"
            >
              testo integrale online
            </a>
            .
          </p>
        )}
      </div>
    </div>
  );
}

export default function LectioIndex() {
  const [selectedCategory, setSelectedCategory] = useState("");
  const { data: lectios = [], isLoading } = useBListLectio({
    category: selectedCategory || undefined,
    limit: 20,
  });

  return (
    <div className="w-full">
      <section className="py-24 bg-background border-b border-border">
        <div className="container mx-auto px-6 max-w-4xl text-center">
          <p className="text-primary tracking-[0.3em] text-sm uppercase mb-6 animate-in fade-in">
            L'Archivio
          </p>
          <h1 className="text-4xl md:text-6xl font-serif text-foreground mb-8">
            Lectio <span className="italic text-primary">Divina.</span>
          </h1>
          <p className="text-xl text-muted-foreground font-light max-w-2xl mx-auto">
            Scritti, riflessioni e pratiche per nutrire il custode. Lettura lenta come atto spirituale.
          </p>
        </div>
      </section>

      {/* RSB Daily Reading */}
      <section className="py-10 bg-background border-b border-border">
        <div className="container mx-auto px-6 max-w-3xl">
          <RegolaGiorno />
        </div>
      </section>

      {/* ── HABITARE SECUM ── */}
      <section className="bg-card border-b border-border/60 py-0">
        <div className="container mx-auto px-6 max-w-3xl">
          <Link href="/habitare-secum" className="group flex items-stretch gap-0 py-10">
            <div className="w-px bg-gradient-to-b from-transparent via-primary/30 to-transparent mr-8 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-[9px] uppercase tracking-[0.45em] text-muted-foreground/60 mb-3">
                Approfondimento · Spiritualità Benedettina
              </p>
              <h2 className="font-serif text-2xl md:text-3xl text-foreground italic mb-3 group-hover:text-primary transition-colors">
                Habitare Secum
              </h2>
              <p className="text-muted-foreground font-light text-sm leading-relaxed max-w-xl mb-5">
                Abitare con se stessi. Il principio fondante della tradizione monastica, dalla
                custodia cordis dei Padri del Deserto alla cella interiore di Benedetto — con le
                otto voci dei maestri e le quattro soglie della pratica quotidiana.
              </p>
              <span className="inline-flex items-center gap-2 text-[10px] uppercase tracking-widest text-muted-foreground/50 group-hover:text-primary transition-colors">
                Entra nella meditazione <ArrowRight className="w-3 h-3" />
              </span>
            </div>
          </Link>
        </div>
      </section>

      <section className="bg-card border-b border-border py-6">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="flex flex-wrap gap-4 justify-center">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setSelectedCategory(cat.value)}
                className={`text-xs uppercase tracking-widest px-4 py-2 transition-colors border ${
                  selectedCategory === cat.value
                    ? "border-primary text-primary bg-primary/5"
                    : "border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-card">
        <div className="container mx-auto px-6 max-w-5xl">
          {isLoading ? (
            <div className="text-center py-24">
              <p className="text-muted-foreground tracking-widest uppercase text-xs animate-pulse">
                Raccogliendo la saggezza...
              </p>
            </div>
          ) : lectios.length === 0 ? (
            <div className="text-center py-24">
              <p className="text-muted-foreground font-serif text-xl">
                Nessuna lectio in questa categoria.
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-8">
              {lectios.map((lectio) => (
                <div
                  key={lectio.id}
                  className="border border-border p-8 bg-background/50 hover:border-primary/50 transition-colors"
                >
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-xs uppercase tracking-widest text-muted-foreground">
                      {lectio.category}
                    </span>
                    <span className="text-xs uppercase tracking-widest text-primary border border-primary/20 px-2 py-1">
                      {lectio.requiredTier}
                    </span>
                  </div>
                  <h2 className="text-2xl font-serif text-foreground mb-4">
                    {lectio.title}
                  </h2>
                  <p className="text-muted-foreground font-light mb-6">
                    {lectio.excerpt}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-muted-foreground">
                      {lectio.readingMinutes} min
                    </span>
                    <Link href={`/lectio/${lectio.id}`} className="text-primary hover:text-foreground transition-colors uppercase tracking-widest text-xs flex items-center gap-2">
                      Leggi <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
