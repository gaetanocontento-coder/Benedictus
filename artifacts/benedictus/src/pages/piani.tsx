import { useAuth } from "@/lib/auth";
import { useBListPlans, useBCreateCheckout } from "@workspace/api-client-react";
import type { BPlan } from "@workspace/api-client-react";

export default function Piani() {
  const { user } = useAuth();
  const { data: plans = [], isLoading } = useBListPlans();
  const { mutate: createCheckout, isPending: checkoutPending } = useBCreateCheckout({
    mutation: {
      onSuccess: (data) => {
        const anyData = data as Record<string, unknown>;
        if (anyData.url) {
          window.location.href = anyData.url as string;
        }
      },
    },
  });

  const handleChoosePlan = (plan: BPlan) => {
    if (plan.tier === "pellegrino") return;
    if (!user) {
      window.location.href = "/benedictus/registrazione";
      return;
    }
    const priceId = plan.monthlyPriceId;
    if (!priceId) {
      alert("Piani non ancora attivi. Contattaci direttamente.");
      return;
    }
    createCheckout({ data: { priceId } });
  };

  if (isLoading) {
    return (
      <div className="w-full flex items-center justify-center py-48">
        <p className="text-muted-foreground tracking-widest uppercase text-xs animate-pulse">
          Preparazione del cammino...
        </p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <section className="py-24 bg-background border-b border-border">
        <div className="container mx-auto px-6 max-w-4xl text-center">
          <p className="text-primary tracking-[0.3em] text-sm uppercase mb-6 animate-in fade-in">
            I Piani
          </p>
          <h1 className="text-4xl md:text-6xl font-serif text-foreground mb-8">
            Scegli il tuo <span className="italic text-primary">cammino.</span>
          </h1>
          <p className="text-xl text-muted-foreground font-light max-w-2xl mx-auto">
            L'ingresso nel sanctuarium. Trova la regola adatta al tuo momento.
          </p>
        </div>
      </section>

      <section className="py-24 bg-card">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="grid md:grid-cols-3 gap-8">
            {plans.map((plan) => {
              const isCurrentTier = user?.tier === plan.tier;
              const priceDisplay =
                plan.monthlyPrice != null
                  ? `€${(plan.monthlyPrice / 100).toFixed(0)}`
                  : "Gratuito";

              return (
                <div
                  key={plan.id}
                  className={`border p-8 bg-background flex flex-col transition-colors ${
                    isCurrentTier
                      ? "border-primary"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  {isCurrentTier && (
                    <div className="text-[10px] uppercase tracking-widest text-primary border border-primary/30 px-2 py-1 self-start mb-4">
                      Piano Attuale
                    </div>
                  )}
                  <h2 className="text-2xl font-serif text-foreground mb-2">
                    {plan.name}
                  </h2>
                  <div className="mb-6">
                    <span className="text-3xl font-serif text-primary">
                      {priceDisplay}
                    </span>
                    {plan.monthlyPrice != null && (
                      <span className="text-muted-foreground">/mese</span>
                    )}
                  </div>
                  <p className="text-muted-foreground font-light mb-8 flex-shrink-0">
                    {plan.description}
                  </p>
                  <div className="flex-1">
                    <ul className="space-y-4 mb-8">
                      {plan.features?.map((feature, idx) => (
                        <li
                          key={idx}
                          className="flex items-start gap-3 text-sm text-foreground/80"
                        >
                          <span className="text-primary mt-1">•</span>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <button
                    onClick={() => handleChoosePlan(plan)}
                    disabled={isCurrentTier || checkoutPending || plan.tier === "pellegrino"}
                    className="w-full border border-primary text-primary py-3 hover:bg-primary hover:text-primary-foreground transition-all duration-300 tracking-widest uppercase text-sm disabled:opacity-50 disabled:cursor-default"
                  >
                    {isCurrentTier
                      ? "Sei qui"
                      : plan.tier === "pellegrino"
                      ? "Gratuito"
                      : `Scegli ${plan.name}`}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-16 bg-background border-t border-border">
        <div className="container mx-auto px-6 max-w-2xl text-center">
          <p className="text-muted-foreground font-light text-sm leading-relaxed">
            Tutti i piani si rinnovano automaticamente. Puoi cancellare in qualsiasi momento
            dal tuo portale. Per domande: contatti@benedictus.it
          </p>
        </div>
      </section>
    </div>
  );
}
