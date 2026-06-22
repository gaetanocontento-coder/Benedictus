import { useAuth } from "@/lib/auth";
import { Link } from "wouter";
import { useBGetLibroCuore } from "@workspace/api-client-react";

function TipoLabel({ tipo }: { tipo: string }) {
  if (tipo === "capitolo") {
    return (
      <span className="text-[8px] uppercase tracking-[0.2em] border border-primary/30 text-primary px-2 py-0.5">
        Capitolo
      </span>
    );
  }
  return (
    <span className="text-[8px] uppercase tracking-[0.2em] border border-border/40 text-muted-foreground/60 px-2 py-0.5">
      Esame
    </span>
  );
}

export default function LibroCuorePage() {
  const { user } = useAuth();
  const { data: entries, isLoading } = useBGetLibroCuore();

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Accedi per leggere il tuo Libro del Cuore.</p>
          <Link href="/login" className="border border-primary px-6 py-2 text-sm uppercase tracking-widest hover:bg-primary/10 transition-colors">
            Accedi
          </Link>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground text-sm animate-pulse">Apertura del Libro…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-20">
      <div className="container mx-auto px-6 lg:px-12 max-w-3xl">

        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-[10px] uppercase tracking-[0.4em] text-primary mb-3">
            Liber Cordis
          </p>
          <h1 className="font-serif text-5xl lg:text-6xl mb-6">
            Il Libro del Cuore
          </h1>
          <p className="text-muted-foreground font-light max-w-md mx-auto text-sm leading-relaxed">
            Le tue meditazioni sui Capitoli della Regola e i tuoi Esami di Coscienza. 
            Un diario interiore — privato, tuo.
          </p>
        </div>

        {!entries || entries.length === 0 ? (
          <div className="text-center border border-dashed border-border/40 p-16">
            <p className="text-4xl mb-4">📖</p>
            <p className="font-serif text-xl text-muted-foreground mb-2">
              Il Libro è ancora vuoto
            </p>
            <p className="text-muted-foreground/60 text-sm mb-6">
              Completa il tuo primo Esame di Coscienza o medita sul Capitolo della settimana.
            </p>
            <div className="flex justify-center gap-4">
              <Link href="/esame" className="border border-primary/40 px-4 py-2 text-xs uppercase tracking-widest hover:bg-primary/10 transition-colors text-primary">
                Esame di Coscienza
              </Link>
              <Link href="/capitolo" className="border border-border/40 px-4 py-2 text-xs uppercase tracking-widest hover:border-border/60 transition-colors text-muted-foreground">
                Capitolo della Regola
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {entries.map((entry) => {
              const data = new Date(entry.createdAt);
              const dataFmt = data.toLocaleDateString("it-IT", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              });

              // Parse testo — split D:/R: blocks
              const blocchi = entry.testo
                .split(/\n\n+/)
                .filter(Boolean)
                .map((b) => {
                  const lines = b.split("\n");
                  const domanda = lines
                    .find((l) => l.startsWith("D: "))
                    ?.replace("D: ", "");
                  const risposta = lines
                    .find((l) => l.startsWith("R: "))
                    ?.replace("R: ", "");
                  return { domanda, risposta };
                })
                .filter((b) => b.domanda || b.risposta);

              return (
                <div key={entry.id} className="border border-border/40 p-6">
                  {/* Meta */}
                  <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-3">
                      <TipoLabel tipo={entry.tipo} />
                      <span className="text-[10px] text-muted-foreground/50">{dataFmt}</span>
                    </div>
                  </div>

                  {/* Contenuto */}
                  {blocchi.length > 0 ? (
                    <div className="space-y-4">
                      {blocchi.map((b, i) => (
                        <div key={i}>
                          {b.domanda && (
                            <p className="text-xs text-muted-foreground/60 italic mb-1">
                              {b.domanda}
                            </p>
                          )}
                          {b.risposta && b.risposta.trim() && (
                            <p className="text-sm text-foreground font-light leading-relaxed">
                              {b.risposta}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-foreground font-light leading-relaxed whitespace-pre-line">
                      {entry.testo}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        )}

        <div className="text-center mt-12 flex justify-center gap-6">
          <Link href="/esame" className="text-[10px] uppercase tracking-widest text-primary hover:text-primary/70 transition-colors">
            Nuovo Esame
          </Link>
          <span className="text-muted-foreground/20">·</span>
          <Link href="/capitolo" className="text-[10px] uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors">
            Capitolo della settimana
          </Link>
          <span className="text-muted-foreground/20">·</span>
          <Link href="/oblato" className="text-[10px] uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors">
            Profilo oblato
          </Link>
        </div>

      </div>
    </div>
  );
}
