import { Link } from "wouter";
import { CheckCircle, Circle, ArrowRight } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { useBGetPercorsoProgress, getBGetPercorsoProgressQueryKey } from "@workspace/api-client-react";

const B = import.meta.env.BASE_URL;

const MODULES = [
  { id: 1, month: "Mese 1", title: "La Desolazione dell'Ego",    description: "Affrontare le illusioni del controllo e dell'onnipotenza. Il primo passo per costruire è demolire le sovrastrutture che ci separano dalla realtà." },
  { id: 2, month: "Mese 2", title: "L'Arte dell'Ascolto",         description: "Sviluppare «l'orecchio del cuore». Imparare ad ascoltare collaboratori, mercato e se stessi senza giudizio o fretta di rispondere." },
  { id: 3, month: "Mese 3", title: "Ritmo e Riposo",              description: "Reintrodurre la sacralità del tempo. Il riposo non è assenza di lavoro, ma il fondamento che rende il lavoro sostenibile." },
  { id: 4, month: "Mese 4", title: "La Comunità Intenzionale",    description: "Passare da un «team performante» a una comunità di scopo, con legami fondati sulla fiducia reciproca e la responsabilità condivisa." },
  { id: 5, month: "Mese 5", title: "Stabilità nel Caos",          description: "Mantenere il centro quando tutto intorno accelera. Radicarsi in principi immutabili per navigare l'incertezza senza farsi travolgere." },
  { id: 6, month: "Mese 6", title: "Il Voto del Custode",         description: "La consacrazione del cammino. Assumersi la responsabilità di custodire le persone e i progetti affidati.", isLast: true },
];

export default function Percorso() {
  const { user } = useAuth();

  const { data: progress = [] } = useBGetPercorsoProgress({
    query: { enabled: !!user, queryKey: getBGetPercorsoProgressQueryKey() },
  });

  const completedCount = progress.filter((p) => p.completedAt).length;
  const startedCount   = progress.length;

  const getModuleStatus = (id: number) => {
    const p = progress.find((x) => x.moduleId === id);
    if (!p) return "idle";
    if (p.completedAt) return "completed";
    return "started";
  };

  return (
    <div className="w-full">

      {/* ── HERO CON FOTO ─────────────────────────────────────────────── */}
      <section className="relative h-[400px] flex items-end overflow-hidden border-b border-border">
        <div className="absolute inset-0">
          <img
            src={`${B}monk-manuscript.png`}
            alt="Monaco in cammino"
            className="w-full h-full object-cover object-center"
            style={{ filter: "brightness(0.52) contrast(1.12) saturate(0.62) sepia(0.14)" }}
          />
          {/* Warm amber cast */}
          <div className="absolute inset-0 pointer-events-none" style={{ background: "rgba(125, 72, 14, 0.13)" }} />
          {/* Radial vignette */}
          <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at 50% 42%, transparent 38%, rgba(4,2,0,0.56) 100%)" }} />
          <div className="absolute inset-0 bg-gradient-to-b from-black/22 via-transparent to-background/95" />
          <div className="absolute inset-0 bg-gradient-to-r from-background/8 to-transparent" />
        </div>

        <div className="relative z-10 container mx-auto px-6 max-w-4xl pb-12">
          <p className="text-amber-200/60 tracking-[0.4em] text-xs uppercase mb-3">Il Percorso</p>
          <h1 className="text-4xl md:text-6xl font-serif text-foreground leading-tight">
            Dall'efficienza alla{" "}
            <span className="italic text-primary">fecondità.</span>
          </h1>
        </div>
      </section>

      {/* ── INTRO + PROGRESS ──────────────────────────────────────────── */}
      <section className="py-16 bg-background border-b border-border">
        <div className="container mx-auto px-6 max-w-4xl">
          <p className="text-xl text-muted-foreground font-light max-w-2xl leading-relaxed">
            Un cammino in sei moduli per trasformare il tuo approccio alla leadership e alla vita.
            Ogni mese una pratica, ogni pratica una soglia.
          </p>

          {user && startedCount > 0 && (
            <div className="mt-10 max-w-sm">
              <div className="flex justify-between text-xs uppercase tracking-widest text-muted-foreground mb-3">
                <span>Il tuo cammino</span>
                <span>{completedCount} / 6 completati</span>
              </div>
              <div className="h-px bg-border relative">
                <div
                  className="absolute top-0 left-0 h-px bg-primary transition-all duration-700"
                  style={{ width: `${(completedCount / 6) * 100}%` }}
                />
              </div>
            </div>
          )}

          {!user && (
            <div className="mt-10">
              <Link
                href="/registrazione"
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-3 hover:bg-primary/85 transition-all tracking-widest uppercase text-sm"
              >
                Inizia il Cammino <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* ── MODULI ────────────────────────────────────────────────────── */}
      <section className="py-16 bg-card border-b border-border">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="space-y-0">
            {MODULES.map((modulo, idx) => {
              const status      = user ? getModuleStatus(modulo.id) : "idle";
              const isCompleted = status === "completed";
              const isStarted   = status === "started";

              return (
                <Link
                  key={modulo.id}
                  href={`/percorso/${modulo.id}`}
                  className="group block"
                >
                  <div className="flex gap-8 py-10 border-b border-border hover:bg-background/60 transition-colors px-4 -mx-4">
                    {/* Progress indicator */}
                    <div className="flex flex-col items-center flex-shrink-0">
                      {isCompleted ? (
                        <CheckCircle className="w-6 h-6 text-primary" />
                      ) : isStarted ? (
                        <div className="w-6 h-6 rounded-full border-2 border-primary flex items-center justify-center">
                          <div className="w-2 h-2 rounded-full bg-primary" />
                        </div>
                      ) : (
                        <Circle className="w-6 h-6 text-border" />
                      )}
                      {idx < MODULES.length - 1 && (
                        <div className="w-px flex-1 mt-3 min-h-[40px] bg-border" />
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0 pb-2">
                      <p className="text-primary tracking-widest text-xs uppercase mb-2">
                        {modulo.month}
                        {isCompleted && <span className="ml-3 text-primary/50">· Completato</span>}
                        {isStarted   && <span className="ml-3 text-primary/50">· In corso</span>}
                      </p>
                      <h2 className="text-2xl font-serif text-foreground mb-3 group-hover:text-primary transition-colors">
                        {modulo.title}
                      </h2>
                      <p className="text-muted-foreground font-light text-sm leading-relaxed">
                        {modulo.description}
                      </p>
                    </div>

                    <div className="flex-shrink-0 self-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <ArrowRight className="w-5 h-5 text-primary" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          {!user && (
            <div className="mt-16 text-center">
              <Link
                href="/piani"
                className="inline-block border border-primary text-primary px-10 py-4 hover:bg-primary hover:text-primary-foreground transition-all tracking-widest uppercase text-sm"
              >
                Inizia il Cammino
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* ── CITAZIONE FOTO ────────────────────────────────────────────── */}
      <section className="relative min-h-[320px] flex items-center overflow-hidden border-b border-border">
        <div className="absolute inset-0">
          <img
            src={`${B}stone-corridor.png`}
            alt="Corridoio in pietra"
            className="w-full h-full object-cover"
            style={{ filter: "brightness(0.38) contrast(1.15) saturate(0.48) sepia(0.24)" }}
          />
          {/* Warm amber cast */}
          <div className="absolute inset-0 pointer-events-none" style={{ background: "rgba(100, 55, 10, 0.20)" }} />
          {/* Radial vignette */}
          <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at 40% 50%, transparent 28%, rgba(6,3,0,0.66) 100%)" }} />
          <div className="absolute inset-0 bg-gradient-to-r from-black/45 via-black/5 to-transparent" />
        </div>
        <div className="relative z-10 container mx-auto px-8 md:px-16 max-w-4xl">
          <blockquote className="max-w-md">
            <p className="font-serif text-2xl md:text-3xl text-amber-50 italic leading-relaxed mb-4">
              «Il monastero non è un luogo fisico. È uno stato dell'anima.»
            </p>
            <footer className="text-amber-200/55 text-xs uppercase tracking-widest">
              Thomas Merton — Seeds of Contemplation
            </footer>
          </blockquote>
        </div>
      </section>

      {/* ── NUMERI ────────────────────────────────────────────────────── */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="grid sm:grid-cols-3 gap-0 divide-y sm:divide-y-0 sm:divide-x divide-border text-center">
            {[
              { n: "6",  label: "Moduli mensili" },
              { n: "3",  label: "Ritiri residenziali" },
              { n: "∞",  label: "Anni di saggezza" },
            ].map((s) => (
              <div key={s.label} className="py-8 px-8">
                <p className="text-4xl font-serif text-primary mb-2">{s.n}</p>
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
