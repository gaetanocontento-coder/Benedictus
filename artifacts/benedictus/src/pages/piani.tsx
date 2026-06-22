import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Check, ChevronDown, ChevronUp } from "lucide-react";
import { useAuth } from "@/lib/auth";
import {
  useBListPlans,
  useBGetSubscription,
  getBGetSubscriptionQueryKey,
  useBCreateCheckout,
  useBCreatePortal,
} from "@workspace/api-client-react";
import type { BPlan } from "@workspace/api-client-react";

const PLAN_ORDER: Record<string, number> = { pellegrino: 0, monaco: 1, abbas: 2 };

const ANNUAL_SAVINGS: Record<string, string> = {
  monaco: "Risparmia 2 mesi",
  abbas: "Risparmia 2 mesi",
};

const FAQ = [
  {
    q: "Posso cancellare in qualsiasi momento?",
    a: "Sì. Puoi cancellare l'abbonamento dal portale in qualsiasi momento. L'accesso rimane attivo fino alla fine del periodo pagato.",
  },
  {
    q: "Come funziona il piano annuale?",
    a: "Il piano annuale viene fatturato in un'unica soluzione all'inizio di ogni anno. L'importo equivale a 10 mesi invece di 12 — due mesi in omaggio.",
  },
  {
    q: "Posso passare da Monaco ad Abbas?",
    a: "Sì, puoi passare a un piano superiore in qualsiasi momento. Il costo viene ricalcolato proporzionalmente al periodo rimanente.",
  },
  {
    q: "I contenuti sono in italiano?",
    a: "Sì, tutti i contenuti — Lectio, podcast, masterclass e materiali del percorso — sono in italiano.",
  },
  {
    q: "Posso accedere da mobile?",
    a: "Sì. La piattaforma è completamente responsiva e funziona su qualsiasi dispositivo.",
  },
  {
    q: "Il coaching individuale del piano Abbas è con chi?",
    a: "Le sessioni trimestrali sono con i facilitatori certificati della comunità Benedictus, formati nel metodo della Regola applicata alla leadership.",
  },
];

export default function Piani() {
  const [billing, setBilling] = useState<"monthly" | "annual">("monthly");
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [stripeNotice, setStripeNotice] = useState<string | null>(null);
  const [, navigate] = useLocation();
  const { user } = useAuth();

  const { data: plans = [], isLoading: plansLoading } = useBListPlans();

  const { data: sub } = useBGetSubscription({
    query: {
      enabled: !!user,
      queryKey: getBGetSubscriptionQueryKey(),
    },
  });

  const { mutate: createCheckout, isPending: checkoutPending } = useBCreateCheckout({
    mutation: {
      onSuccess: (data) => {
        const anyData = data as Record<string, unknown>;
        if (anyData.url) window.location.href = anyData.url as string;
      },
    },
  });

  const { mutate: openPortal, isPending: portalPending } = useBCreatePortal({
    mutation: {
      onSuccess: (data) => {
        const anyData = data as Record<string, unknown>;
        if (anyData.url) window.location.href = anyData.url as string;
      },
    },
  });

  const isLoading = plansLoading;

  const getPrice = (plan: BPlan) => {
    if (plan.monthlyPrice == null) return null;
    if (billing === "annual" && plan.annualPrice != null) {
      return Math.round(plan.annualPrice / 12 / 100);
    }
    return Math.round(plan.monthlyPrice / 100);
  };

  const getBilledAs = (plan: BPlan) => {
    if (plan.annualPrice == null) return null;
    if (billing === "annual") {
      return `€${Math.round(plan.annualPrice / 100)} fatturati annualmente`;
    }
    return null;
  };

  const handleCTA = (plan: BPlan) => {
    if (plan.tier === "pellegrino") {
      if (!user) navigate("/registrazione");
      return;
    }
    if (!user) {
      navigate("/registrazione");
      return;
    }
    const priceId =
      billing === "annual" ? plan.annualPriceId : plan.monthlyPriceId;
    if (!priceId) {
      setStripeNotice(plan.name);
      setTimeout(() => setStripeNotice(null), 5000);
      return;
    }
    createCheckout({ data: { priceId } });
  };

  const getCTALabel = (plan: BPlan) => {
    const isCurrentTier = user?.tier === plan.tier;
    if (isCurrentTier) return "Sei qui";
    if (plan.tier === "pellegrino") return user ? "Piano di base" : "Inizia Gratis";
    if (!user) return "Inizia il Cammino";
    const priceId =
      billing === "annual" ? plan.annualPriceId : plan.monthlyPriceId;
    if (!priceId) return "Unisciti alla lista d'attesa";
    const userLevel = PLAN_ORDER[user.tier ?? "pellegrino"] ?? 0;
    const planLevel = PLAN_ORDER[plan.tier] ?? 0;
    if (planLevel > userLevel) return `Scegli ${plan.name}`;
    return `Passa a ${plan.name}`;
  };

  const isCTADisabled = (plan: BPlan) => {
    if (user?.tier === plan.tier) return true;
    if (plan.tier === "pellegrino" && !!user) return true;
    if (checkoutPending) return true;
    return false;
  };

  const isRecommended = (plan: BPlan) => plan.tier === "monaco";

  const sortedPlans = [...plans].sort(
    (a, b) => (PLAN_ORDER[a.tier] ?? 0) - (PLAN_ORDER[b.tier] ?? 0)
  );

  const hasActivePaidSub =
    user &&
    sub &&
    sub.tier !== "pellegrino" &&
    (sub.status === "active" || sub.status === "trialing");

  if (isLoading) {
    return (
      <div className="w-full flex items-center justify-center py-48">
        <p className="text-muted-foreground tracking-widest uppercase text-xs animate-pulse">
          Preparazione del sanctuarium...
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
          <h1 className="text-4xl md:text-6xl font-serif text-foreground mb-6">
            Scegli il tuo{" "}
            <span className="italic text-primary">cammino.</span>
          </h1>
          <p className="text-xl text-muted-foreground font-light max-w-2xl mx-auto mb-12">
            L'ingresso nel sanctuarium. Ogni piano ti porta più a fondo nella Regola.
          </p>

          <div className="inline-flex items-center border border-border rounded-sm overflow-hidden">
            <button
              onClick={() => setBilling("monthly")}
              className={`px-6 py-3 text-sm uppercase tracking-widest transition-colors ${
                billing === "monthly"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Mensile
            </button>
            <div className="relative">
              <button
                onClick={() => setBilling("annual")}
                className={`px-6 py-3 text-sm uppercase tracking-widest transition-colors ${
                  billing === "annual"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Annuale
              </button>
              <span
                className={`absolute -top-3 -right-3 z-10 text-[9px] uppercase tracking-wide px-1.5 py-0.5 rounded-sm font-medium pointer-events-none ${
                  billing === "annual"
                    ? "bg-foreground text-background"
                    : "bg-primary text-primary-foreground"
                }`}
              >
                −2 mesi
              </span>
            </div>
          </div>
        </div>
      </section>

      {stripeNotice && (
        <section className="bg-amber-900/20 border-b border-amber-700/30 py-4 animate-in fade-in">
          <div className="container mx-auto px-6 max-w-6xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-amber-200/80 font-light">
              Il piano <span className="font-medium text-amber-200">{stripeNotice}</span> sarà disponibile a breve. Stripe non è ancora configurato in questo ambiente.
              Per testare la piattaforma, l'amministratore può assegnarti manualmente il tier dal{" "}
              <Link href="/admin" className="underline hover:text-amber-100">
                Sanctuarium
              </Link>.
            </p>
          </div>
        </section>
      )}

      {hasActivePaidSub && sub && (
        <section className="bg-primary/5 border-b border-primary/20 py-4">
          <div className="container mx-auto px-6 max-w-6xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm text-foreground/80 font-light">
              Piano attivo:{" "}
              <span className="text-primary font-medium capitalize">{sub.tier}</span>
              {sub.currentPeriodEnd && (
                <span className="text-muted-foreground ml-2">
                  · Rinnovo il{" "}
                  {new Date(sub.currentPeriodEnd).toLocaleDateString("it-IT", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                  {sub.cancelAtPeriodEnd && " (in cancellazione)"}
                </span>
              )}
            </div>
            <button
              onClick={() => openPortal()}
              disabled={portalPending}
              className="text-xs uppercase tracking-widest border border-primary/40 text-primary px-4 py-2 hover:bg-primary hover:text-primary-foreground transition-colors disabled:opacity-50"
            >
              {portalPending ? "Apertura portale…" : "Gestisci abbonamento"}
            </button>
          </div>
        </section>
      )}

      <section className="py-20 bg-card">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="grid md:grid-cols-3 gap-6">
            {sortedPlans.map((plan) => {
              const price = getPrice(plan);
              const billedAs = getBilledAs(plan);
              const isCurrentTier = user?.tier === plan.tier;
              const recommended = isRecommended(plan);
              const ctaLabel = getCTALabel(plan);
              const ctaDisabled = isCTADisabled(plan);

              return (
                <div
                  key={plan.id}
                  className={`relative flex flex-col border bg-background transition-all ${
                    recommended
                      ? "border-primary shadow-[0_0_30px_rgba(245,230,200,0.08)]"
                      : isCurrentTier
                      ? "border-primary/50"
                      : "border-border hover:border-primary/30"
                  }`}
                >
                  {recommended && (
                    <div className="absolute -top-px left-0 right-0 h-px bg-primary" />
                  )}
                  {recommended && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-[9px] uppercase tracking-[0.2em] px-3 py-1 whitespace-nowrap">
                      Più scelto
                    </div>
                  )}

                  <div className="p-8 border-b border-border">
                    {isCurrentTier && (
                      <div className="text-[9px] uppercase tracking-widest text-primary border border-primary/30 px-2 py-1 self-start inline-block mb-3">
                        Piano attuale
                      </div>
                    )}
                    <h2 className="text-2xl font-serif text-foreground mb-1">
                      {plan.name}
                    </h2>
                    <p className="text-muted-foreground font-light text-sm leading-relaxed">
                      {plan.description}
                    </p>
                  </div>

                  <div className="p-8 border-b border-border">
                    {price == null ? (
                      <div>
                        <span className="text-4xl font-serif text-foreground">
                          Gratuito
                        </span>
                        <p className="text-xs text-muted-foreground mt-2 uppercase tracking-widest">
                          Per sempre
                        </p>
                      </div>
                    ) : (
                      <div>
                        <div className="flex items-end gap-1">
                          <span className="text-4xl font-serif text-foreground">
                            €{price}
                          </span>
                          <span className="text-muted-foreground mb-1.5 text-sm">
                            /mese
                          </span>
                        </div>
                        {billedAs ? (
                          <p className="text-xs text-muted-foreground mt-2">
                            {billedAs}
                          </p>
                        ) : (
                          <p className="text-xs text-muted-foreground mt-2 uppercase tracking-widest">
                            Fatturato mensilmente
                          </p>
                        )}
                        {billing === "annual" && ANNUAL_SAVINGS[plan.tier] && (
                          <p className="text-xs text-primary mt-1.5">
                            ✦ {ANNUAL_SAVINGS[plan.tier]}
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="p-8 flex-1">
                    <ul className="space-y-3.5">
                      {plan.features?.map((feature, idx) => (
                        <li
                          key={idx}
                          className="flex items-start gap-3 text-sm text-foreground/80"
                        >
                          <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                          <span className="font-light leading-snug">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-8 pt-0">
                    <button
                      onClick={() => handleCTA(plan)}
                      disabled={ctaDisabled}
                      className={`w-full py-3.5 tracking-widest uppercase text-sm transition-all duration-300 ${
                        ctaDisabled
                          ? "border border-border text-muted-foreground cursor-default opacity-60"
                          : recommended
                          ? "bg-primary text-primary-foreground hover:bg-primary/90"
                          : "border border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                      }`}
                    >
                      {ctaLabel}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {!user && (
            <p className="text-center text-muted-foreground text-xs font-light mt-8 tracking-wide">
              Nessuna carta richiesta per il piano Pellegrino. Nessun obbligo.
            </p>
          )}
        </div>
      </section>

      <section className="py-20 bg-background border-t border-border">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="grid md:grid-cols-3 gap-12 text-center">
            <div>
              <p className="text-4xl font-serif text-primary mb-3">1.500</p>
              <p className="text-xs uppercase tracking-widest text-muted-foreground">
                Anni di saggezza monastica
              </p>
            </div>
            <div>
              <p className="text-4xl font-serif text-primary mb-3">6</p>
              <p className="text-xs uppercase tracking-widest text-muted-foreground">
                Moduli del percorso formativo
              </p>
            </div>
            <div>
              <p className="text-4xl font-serif text-primary mb-3">∞</p>
              <p className="text-xs uppercase tracking-widest text-muted-foreground">
                Accesso all'archivio
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-card border-t border-border">
        <div className="container mx-auto px-6 max-w-3xl">
          <p className="text-primary tracking-[0.3em] text-xs uppercase mb-10 text-center">
            Domande frequenti
          </p>
          <div className="divide-y divide-border">
            {FAQ.map((item, idx) => (
              <div key={idx} className="py-6">
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full flex justify-between items-start gap-6 text-left group"
                >
                  <span className="font-light text-foreground group-hover:text-primary transition-colors leading-snug">
                    {item.q}
                  </span>
                  {openFaq === idx ? (
                    <ChevronUp className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                  )}
                </button>
                {openFaq === idx && (
                  <p className="text-muted-foreground font-light text-sm leading-relaxed mt-4 pr-8">
                    {item.a}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-background border-t border-border">
        <div className="container mx-auto px-6 max-w-2xl text-center">
          <p className="text-muted-foreground font-light text-sm leading-relaxed mb-6">
            Tutti i piani si rinnovano automaticamente. Puoi cancellare in qualsiasi momento
            dal portale di gestione. Nessuna penale, nessun vincolo.
          </p>
          <p className="text-muted-foreground text-xs">
            Domande?{" "}
            <Link href="/contatti" className="text-primary hover:underline">
              Scrivici
            </Link>{" "}
            — rispondiamo entro 24 ore.
          </p>
        </div>
      </section>
    </div>
  );
}
