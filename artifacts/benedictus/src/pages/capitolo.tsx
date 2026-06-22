import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { Link } from "wouter";
import { useQueryClient } from "@tanstack/react-query";
import {
  useBGetCapitoloCorrente,
  useBSalvaLibroCuore,
  useBGetLibroCuore,
  getBGetLibroCuoreQueryKey,
  getBGetOblatoProfiloQueryKey,
} from "@workspace/api-client-react";

export default function CapitoloPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [risposte, setRisposte] = useState<Record<string, string>>({});
  const [salvato, setSalvato] = useState(false);
  const [salvando, setSalvando] = useState(false);

  const { data: capitolo, isLoading } = useBGetCapitoloCorrente();
  const { data: entriesLibro } = useBGetLibroCuore();
  const salvaMutation = useBSalvaLibroCuore();

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Accedi per leggere il Capitolo della settimana.</p>
          <Link href="/login" className="border border-primary px-6 py-2 text-sm uppercase tracking-widest hover:bg-primary/10 transition-colors">
            Accedi
          </Link>
        </div>
      </div>
    );
  }

  const today = new Date().toISOString().slice(0, 10);

  // Check if already responded this week
  const giaRisposto = (entriesLibro ?? []).some(
    (e) => e.tipo === "capitolo" && e.riferimentoId === String(capitolo?.id)
  );

  const handleSalva = async () => {
    if (!capitolo || salvando) return;
    const testoComposto = (capitolo.domande as string[])
      .map((d: string, i: number) => `D: ${d}\nR: ${risposte[String(i)] ?? ""}`)
      .join("\n\n");

    if (!testoComposto.trim()) return;
    setSalvando(true);
    try {
      await salvaMutation.mutateAsync({
        data: {
          tipo: "capitolo",
          riferimentoId: String(capitolo.id),
          testo: testoComposto,
          giorno: today,
        },
      });
      setSalvato(true);
      queryClient.invalidateQueries({ queryKey: getBGetLibroCuoreQueryKey() });
      queryClient.invalidateQueries({ queryKey: getBGetOblatoProfiloQueryKey() });
    } finally {
      setSalvando(false);
    }
  };

  if (isLoading || !capitolo) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground text-sm animate-pulse">Apertura del Capitolo…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-20">
      <div className="container mx-auto px-6 lg:px-12 max-w-3xl">

        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-[10px] uppercase tracking-[0.4em] text-primary mb-3">
            Capitolo della settimana
          </p>
          <p className="text-muted-foreground/60 text-xs uppercase tracking-widest mb-4">
            Settimana del {capitolo.settimana}
          </p>
          <h1 className="font-serif text-4xl lg:text-5xl mb-3">
            Capitolo {capitolo.numero}
          </h1>
          <h2 className="font-serif text-2xl text-primary italic">
            {capitolo.titolo}
          </h2>
        </div>

        {/* Testo della Regola */}
        <div
          className="prose prose-sm prose-invert max-w-none mb-12 text-muted-foreground leading-relaxed font-light [&>p]:mb-4 [&>p>em]:text-foreground/80 [&>p>em]:not-italic"
          dangerouslySetInnerHTML={{ __html: capitolo.testo }}
        />

        {/* Divisore */}
        <div className="flex items-center gap-4 mb-10">
          <div className="flex-1 h-px bg-border/40" />
          <span className="text-muted-foreground/40 text-xs uppercase tracking-widest">
            Lectio Divina
          </span>
          <div className="flex-1 h-px bg-border/40" />
        </div>

        {/* Domande */}
        {giaRisposto || salvato ? (
          <div className="border border-primary/30 bg-primary/5 p-8 text-center">
            <p className="text-2xl mb-3">✦</p>
            <p className="font-serif text-xl text-primary mb-2">Capitolo meditato</p>
            <p className="text-muted-foreground text-sm">
              Hai già risposto a questo Capitolo questa settimana. Le tue riflessioni sono nel Libro del Cuore.
            </p>
            <Link
              href="/libro-cuore"
              className="inline-block mt-4 text-[10px] uppercase tracking-widest text-primary hover:text-primary/70 transition-colors"
            >
              Vai al Libro del Cuore →
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            <p className="text-[9px] uppercase tracking-[0.3em] text-muted-foreground mb-2">
              Domande per la meditazione — scrivi la prima cosa che senti
            </p>

            {(capitolo.domande as string[]).map((domanda: string, i: number) => (
              <div key={i}>
                <label className="block text-sm text-foreground/80 leading-relaxed mb-3 font-light italic">
                  {domanda}
                </label>
                <textarea
                  rows={4}
                  value={risposte[String(i)] ?? ""}
                  onChange={(e) =>
                    setRisposte((prev) => ({ ...prev, [String(i)]: e.target.value }))
                  }
                  placeholder="La tua riflessione…"
                  className="w-full bg-transparent border border-border/40 focus:border-primary/40 outline-none px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/30 resize-none transition-colors font-light leading-relaxed"
                />
              </div>
            ))}

            <div className="text-center pt-4">
              <button
                onClick={handleSalva}
                disabled={salvando || Object.values(risposte).every((v) => !v.trim())}
                className="border border-primary px-8 py-3 text-sm uppercase tracking-widest hover:bg-primary/10 transition-all disabled:opacity-40"
              >
                {salvando ? "Salvando nel Libro del Cuore…" : "Salva la meditazione · +20 XP"}
              </button>
              <p className="text-[10px] text-muted-foreground/50 mt-3">
                Anche una sola risposta è sufficiente. L'importante è la presenza.
              </p>
            </div>
          </div>
        )}

        <div className="text-center mt-12">
          <Link href="/oblato" className="text-[10px] uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors">
            ← Torna al profilo oblato
          </Link>
        </div>

      </div>
    </div>
  );
}
