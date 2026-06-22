import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { Link } from "wouter";
import { useQueryClient } from "@tanstack/react-query";
import {
  useBGetEsameDomande,
  useBSalvaLibroCuore,
  useBGetLibroCuore,
  getBGetLibroCuoreQueryKey,
  getBGetOblatoProfiloQueryKey,
} from "@workspace/api-client-react";

export default function EsamePage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [risposte, setRisposte] = useState<string[]>(["", "", ""]);
  const [salvato, setSalvato] = useState(false);
  const [salvando, setSalvando] = useState(false);

  const { data: esame, isLoading } = useBGetEsameDomande();
  const { data: entriesLibro } = useBGetLibroCuore();
  const salvaMutation = useBSalvaLibroCuore();

  const today = new Date().toISOString().slice(0, 10);

  const giaFatto = (entriesLibro ?? []).some(
    (e) => e.tipo === "esame" && e.giorno === today
  );

  const handleSalva = async () => {
    if (!esame || salvando) return;
    const testoComposto = (esame.domande as string[])
      .map((d, i) => `D: ${d}\nR: ${risposte[i] ?? ""}`)
      .join("\n\n");

    setSalvando(true);
    try {
      await salvaMutation.mutateAsync({
        data: {
          tipo: "esame",
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

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Accedi per fare l'Esame di Coscienza.</p>
          <Link href="/login" className="border border-primary px-6 py-2 text-sm uppercase tracking-widest hover:bg-primary/10 transition-colors">
            Accedi
          </Link>
        </div>
      </div>
    );
  }

  if (isLoading || !esame) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground text-sm animate-pulse">Preparazione dell'esame…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-20">
      <div className="container mx-auto px-6 lg:px-12 max-w-2xl">

        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-[10px] uppercase tracking-[0.4em] text-primary mb-3">
            Examen Conscientiae
          </p>
          <h1 className="font-serif text-4xl lg:text-5xl mb-6">
            Esame di Coscienza
          </h1>
          <p className="text-muted-foreground font-light max-w-md mx-auto text-sm leading-relaxed">
            Tre domande, cambiate ogni giorno. Non un processo — una raccolta. 
            Guarda la giornata con occhi misericordiosi. Scrivi la prima cosa che senti.
          </p>
          <p className="text-muted-foreground/50 text-xs mt-3">
            {new Date().toLocaleDateString("it-IT", {
              weekday: "long",
              day: "numeric",
              month: "long",
            })}
          </p>
        </div>

        {/* Versetto serale */}
        <div className="border-l-2 border-primary/30 pl-6 mb-12">
          <p className="text-sm italic text-muted-foreground font-light leading-relaxed">
            «Omni hora vitae nostrae huiusmodi emendatio debet esse praesens, 
            quia dies vitae nostrae ad hoc a Domino nobis sunt dati.»
          </p>
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground/40 mt-2">
            Regola di San Benedetto, Cap. 4
          </p>
        </div>

        {giaFatto || salvato ? (
          <div className="border border-primary/30 bg-primary/5 p-10 text-center">
            <p className="text-4xl mb-4">☾</p>
            <p className="font-serif text-2xl text-primary mb-3">
              Esame completato
            </p>
            <p className="text-muted-foreground font-light text-sm leading-relaxed mb-6 max-w-sm mx-auto">
              Hai completato l'esame di coscienza di oggi. 
              Lascia andare la giornata. Il Grande Silenzio inizia.
            </p>
            <blockquote className="text-xs text-muted-foreground/50 italic">
              «Post Completorium nulla loquacitati detur licentia.»
            </blockquote>
            <Link
              href="/libro-cuore"
              className="inline-block mt-6 text-[10px] uppercase tracking-widest text-primary hover:text-primary/70 transition-colors"
            >
              Leggi il tuo Libro del Cuore →
            </Link>
          </div>
        ) : (
          <div className="space-y-10">
            {(esame.domande as string[]).map((domanda, i) => (
              <div key={i}>
                <div className="flex items-start gap-4 mb-4">
                  <span className="text-primary/40 font-serif text-lg flex-none mt-0.5">
                    {["I", "II", "III"][i]}.
                  </span>
                  <p className="text-foreground/80 font-light leading-relaxed italic">
                    {domanda}
                  </p>
                </div>
                <textarea
                  rows={3}
                  value={risposte[i]}
                  onChange={(e) => {
                    const next = [...risposte];
                    next[i] = e.target.value;
                    setRisposte(next);
                  }}
                  placeholder="Scrivi liberamente…"
                  className="w-full bg-transparent border border-border/40 focus:border-primary/40 outline-none px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/30 resize-none transition-colors font-light leading-relaxed"
                />
              </div>
            ))}

            <div className="text-center pt-4">
              <button
                onClick={handleSalva}
                disabled={salvando || risposte.every((r) => !r.trim())}
                className="border border-primary px-8 py-3 text-sm uppercase tracking-widest hover:bg-primary/10 transition-all disabled:opacity-40"
              >
                {salvando ? "Affidando al Libro del Cuore…" : "Completa l'esame · +5 XP"}
              </button>
              <p className="text-[10px] text-muted-foreground/50 mt-3">
                Anche una risposta sola è preziosa. Non serve la perfezione.
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
