import { useState, useCallback } from "react";
import { useAuth } from "@/lib/auth";
import { Link } from "wouter";
import { useQueryClient } from "@tanstack/react-query";
import {
  useBOfficiumCheckIn,
  useBGetOfficiumOggi,
  getBGetOfficiumOggiQueryKey,
  getBGetOblatoProfiloQueryKey,
} from "@workspace/api-client-react";
import {
  ORE_CANONICHE,
  getOraCorrente,
  formatMinuti,
  suonaCampana,
} from "@/lib/liturgia";

function GradoToast({
  sigilli,
  gradoNuovo,
  xpGuadagnato,
  onClose,
}: {
  sigilli: Array<{ nome: string; icona: string; xpValore: number }>;
  gradoNuovo: boolean;
  xpGuadagnato: number;
  onClose: () => void;
}) {
  return (
    <div className="fixed top-6 right-6 z-[70] bg-card border border-primary/40 shadow-2xl p-5 max-w-xs animate-in slide-in-from-right-3 fade-in duration-300">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <p className="text-xs uppercase tracking-widest text-primary mb-2">
            {gradoNuovo ? "Nuovo grado raggiunto! 🎊" : "Ora pregata ✓"}
          </p>
          <p className="text-2xl font-serif text-foreground">+{xpGuadagnato} XP</p>
          {sigilli.length > 0 && (
            <div className="mt-3 space-y-1">
              {sigilli.map((s) => (
                <div key={s.nome} className="flex items-center gap-2">
                  <span>{s.icona}</span>
                  <p className="text-xs text-primary">{s.nome}</p>
                </div>
              ))}
            </div>
          )}
        </div>
        <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
          ×
        </button>
      </div>
    </div>
  );
}

export default function OfficiumPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [toast, setToast] = useState<{
    xpGuadagnato: number;
    sigilliNuovi: Array<{ nome: string; icona: string; xpValore: number }>;
    gradoNuovo: boolean;
  } | null>(null);
  const [errore, setErrore] = useState<string>("");

  const { data: checkInsOggi, isLoading } = useBGetOfficiumOggi();
  const checkInMutation = useBOfficiumCheckIn();

  const { ora: oraCorrente, prossima, minutiAlProssimo } = getOraCorrente();

  const checkInIds = new Set((checkInsOggi ?? []).map((c) => c.oraId));

  const handleCheckIn = useCallback(
    async (oraId: string) => {
      if (checkInIds.has(oraId)) return;
      setErrore("");
      try {
        const result = await checkInMutation.mutateAsync({ data: { oraId } });
        suonaCampana(2, 0.25);
        setToast({
          xpGuadagnato: result.xpGuadagnato,
          sigilliNuovi: result.sigilliNuovi,
          gradoNuovo: result.gradoNuovo ?? false,
        });
        setTimeout(() => setToast(null), 5000);
        queryClient.invalidateQueries({ queryKey: getBGetOfficiumOggiQueryKey() });
        queryClient.invalidateQueries({ queryKey: getBGetOblatoProfiloQueryKey() });
      } catch (e: any) {
        if (e?.status === 409) {
          setErrore("Hai già pregato quest'ora oggi. Torna alla prossima.");
        } else {
          setErrore("Qualcosa è andato storto. Riprova.");
        }
        setTimeout(() => setErrore(""), 4000);
      }
    },
    [checkInIds, checkInMutation, queryClient]
  );

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">
            Accedi per partecipare all'Officium.
          </p>
          <Link href="/login" className="border border-primary px-6 py-2 text-sm uppercase tracking-widest hover:bg-primary/10 transition-colors">
            Accedi
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      {toast && (
        <GradoToast
          sigilli={toast.sigilliNuovi}
          gradoNuovo={toast.gradoNuovo}
          xpGuadagnato={toast.xpGuadagnato}
          onClose={() => setToast(null)}
        />
      )}

      <div className="min-h-screen bg-background py-20">
        <div className="container mx-auto px-6 lg:px-12 max-w-4xl">

          {/* Header */}
          <div className="text-center mb-16">
            <p className="text-[10px] uppercase tracking-[0.4em] text-primary mb-3">
              Officium Divinum
            </p>
            <h1 className="font-serif text-5xl lg:text-6xl mb-6">
              Liturgia delle Ore
            </h1>
            <p className="text-muted-foreground font-light max-w-lg mx-auto">
              Sette volte al giorno ti lodo, Signore. Segui il ritmo del monastero: 
              tocca l'ora canonica nel momento giusto per guadagnare XP e mantenere la <em>stabilitas</em>.
            </p>
          </div>

          {/* Ora corrente — grande */}
          <div className="border border-primary/30 bg-primary/5 p-8 mb-10 text-center">
            <p className="text-[10px] uppercase tracking-[0.4em] text-primary mb-2">
              In questo momento
            </p>
            <div className="text-5xl mb-3">{oraCorrente.icona}</div>
            <h2 className="font-serif text-4xl text-foreground mb-1">{oraCorrente.nome}</h2>
            <p className="text-muted-foreground italic text-lg mb-4">{oraCorrente.latino}</p>
            <p className="text-muted-foreground font-light max-w-md mx-auto text-sm leading-relaxed mb-6">
              {oraCorrente.monaci}
            </p>
            <div className="border-l-2 border-primary/40 pl-4 text-left max-w-sm mx-auto mb-6">
              <p className="text-sm italic text-foreground/80">{oraCorrente.invito}</p>
            </div>
            <p className="text-xs text-muted-foreground/60 mb-6">
              Prossima ora: <span className="text-primary">{prossima.nome}</span> tra {formatMinuti(minutiAlProssimo)}
            </p>

            {checkInIds.has(oraCorrente.id) ? (
              <div className="inline-flex items-center gap-2 border border-primary/40 bg-primary/10 px-6 py-3 text-primary text-sm">
                ✓ Quest'ora è stata pregata oggi
              </div>
            ) : (
              <button
                onClick={() => handleCheckIn(oraCorrente.id)}
                disabled={checkInMutation.isPending}
                className="border border-primary px-8 py-3 text-sm uppercase tracking-widest hover:bg-primary/10 transition-all disabled:opacity-50"
              >
                {checkInMutation.isPending ? "Preghiera in corso…" : "Prega quest'ora · +XP"}
              </button>
            )}

            {errore && (
              <p className="text-sm text-muted-foreground mt-3">{errore}</p>
            )}
          </div>

          {/* Tutte le ore */}
          <div className="mb-10">
            <p className="text-[9px] uppercase tracking-[0.3em] text-muted-foreground mb-4">
              Le otto ore canoniche
            </p>
            <div className="space-y-3">
              {ORE_CANONICHE.map((ora) => {
                const checked = checkInIds.has(ora.id);
                const isActive = ora.id === oraCorrente.id;

                return (
                  <div
                    key={ora.id}
                    className={`flex items-center gap-4 border p-4 transition-all ${
                      isActive
                        ? "border-primary/40 bg-primary/5"
                        : checked
                        ? "border-border/40 opacity-70"
                        : "border-border/30 hover:border-border/60"
                    }`}
                  >
                    {/* Time */}
                    <div className="flex-none w-16 text-right">
                      <p className="font-mono text-sm text-muted-foreground">
                        {String(ora.oraInizio).padStart(2, "0")}:
                        {String(ora.minutoInizio).padStart(2, "0")}
                      </p>
                    </div>

                    {/* Icon */}
                    <div className="text-xl flex-none w-8 text-center">{ora.icona}</div>

                    {/* Info */}
                    <div className="flex-1">
                      <p className={`font-serif ${isActive ? "text-primary" : "text-foreground"}`}>
                        {ora.nome}
                      </p>
                      <p className="text-[10px] text-muted-foreground/60 italic">{ora.latino}</p>
                    </div>

                    {/* Campane */}
                    <div className="flex-none text-muted-foreground/30 text-xs">
                      {"◆".repeat(Math.min(ora.campane, 3))}
                    </div>

                    {/* Status / Check-in */}
                    <div className="flex-none">
                      {checked ? (
                        <span className="text-primary text-sm">✓</span>
                      ) : isActive ? (
                        <button
                          onClick={() => handleCheckIn(ora.id)}
                          disabled={checkInMutation.isPending}
                          className="border border-primary/60 px-3 py-1.5 text-[10px] uppercase tracking-widest hover:bg-primary/10 transition-colors disabled:opacity-50"
                        >
                          Prega
                        </button>
                      ) : (
                        <span className="text-muted-foreground/20 text-xs">—</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Progress oggi */}
          <div className="border border-border/40 p-5 text-center">
            <p className="text-[9px] uppercase tracking-[0.3em] text-muted-foreground mb-3">
              Ore pregate oggi
            </p>
            <div className="flex justify-center gap-2 mb-3">
              {ORE_CANONICHE.map((ora) => (
                <div
                  key={ora.id}
                  className={`w-4 h-4 border ${
                    checkInIds.has(ora.id)
                      ? "bg-primary border-primary"
                      : "border-border/30"
                  }`}
                  title={ora.nome}
                />
              ))}
            </div>
            <p className="text-sm text-muted-foreground">
              {checkInIds.size} di 8 ore
            </p>
            {checkInIds.size === 8 && (
              <p className="text-primary text-sm mt-2 font-serif">
                ✦ Officium completo — Laus Deo ✦
              </p>
            )}
          </div>

          <div className="text-center mt-8">
            <Link href="/oblato" className="text-[10px] uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors">
              ← Torna al tuo profilo oblato
            </Link>
          </div>

        </div>
      </div>
    </>
  );
}
