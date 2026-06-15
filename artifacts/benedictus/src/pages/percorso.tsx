import { Link } from "wouter";
import { CheckCircle, Circle, ArrowRight } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { useBGetPercorsoProgress, getBGetPercorsoProgressQueryKey } from "@workspace/api-client-react";

const MODULES = [
  { id: 1, month: "Mese 1", title: "La Desolazione dell'Ego", description: "Affrontare le illusioni del controllo e dell'onnipotenza. Il primo passo per costruire è demolire le sovrastrutture che ci separano dalla realtà." },
  { id: 2, month: "Mese 2", title: "L'Arte dell'Ascolto", description: "Sviluppare «l'orecchio del cuore». Imparare ad ascoltare collaboratori, mercato e se stessi senza giudizio o fretta di rispondere." },
  { id: 3, month: "Mese 3", title: "Ritmo e Riposo", description: "Reintrodurre la sacralità del tempo. Il riposo non è assenza di lavoro, ma il fondamento che rende il lavoro sostenibile." },
  { id: 4, month: "Mese 4", title: "La Comunità Intenzionale", description: "Passare da un «team performante» a una comunità di scopo, con legami fondati sulla fiducia reciproca e la responsabilità condivisa." },
  { id: 5, month: "Mese 5", title: "Stabilità nel Caos", description: "Mantenere il centro quando tutto intorno accelera. Radicarsi in principi immutabili per navigare l'incertezza senza farsi travolgere." },
  { id: 6, month: "Mese 6", title: "Il Voto del Custode", description: "La consacrazione del cammino. Assumersi la responsabilità di custodire le persone e i progetti affidati, inaugurando una stagione di fecondità.", isLast: true },
];

export default function Percorso() {
  const { user } = useAuth();

  const { data: progress = [] } = useBGetPercorsoProgress({
    query: { enabled: !!user, queryKey: getBGetPercorsoProgressQueryKey() },
  });

  const completedCount = progress.filter((p) => p.completedAt).length;
  const startedCount = progress.length;

  const getModuleStatus = (id: number) => {
    const p = progress.find((x) => x.moduleId === id);
    if (!p) return "idle";
    if (p.completedAt) return "completed";
    return "started";
  };

  return (
    <div className="w-full">
      <section className="py-24 bg-background border-b border-border">
        <div className="container mx-auto px-6 max-w-4xl text-center">
          <p className="text-primary tracking-[0.3em] text-sm uppercase mb-6 animate-in fade-in">
            Il Percorso
          </p>
          <h1 className="text-4xl md:text-6xl font-serif text-foreground mb-8">
            Dall'efficienza alla{" "}
            <span className="italic text-primary">fecondità.</span>
          </h1>
          <p className="text-xl text-muted-foreground font-light max-w-2xl mx-auto">
            Un cammino in sei moduli per trasformare il tuo approccio alla leadership e alla vita. Ogni mese una pratica, ogni pratica una soglia.
          </p>

          {user && startedCount > 0 && (
            <div className="mt-12 max-w-sm mx-auto">
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
                className="inline-flex items-center gap-2 border border-primary text-primary px-8 py-3 hover:bg-primary hover:text-primary-foreground transition-all duration-300 tracking-widest uppercase text-sm"
              >
                Inizia il Cammino <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>
      </section>

      <section className="py-24 bg-card">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="space-y-0">
            {MODULES.map((modulo, idx) => {
              const status = user ? getModuleStatus(modulo.id) : "idle";
              const isCompleted = status === "completed";
              const isStarted = status === "started";

              return (
                <Link
                  key={modulo.id}
                  href={`/percorso/${modulo.id}`}
                  className="group block"
                >
                  <div className="flex gap-8 py-10 border-b border-border hover:bg-background/50 transition-colors px-4 -mx-4 rounded-sm">
                    <div className="flex flex-col items-center flex-shrink-0">
                      <div className="relative">
                        {isCompleted ? (
                          <CheckCircle className="w-6 h-6 text-primary" />
                        ) : isStarted ? (
                          <div className="w-6 h-6 rounded-full border-2 border-primary flex items-center justify-center">
                            <div className="w-2 h-2 rounded-full bg-primary" />
                          </div>
                        ) : (
                          <Circle className="w-6 h-6 text-border" />
                        )}
                      </div>
                      {idx < MODULES.length - 1 && (
                        <div className="w-px flex-1 mt-3 min-h-[40px] bg-border" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0 pb-2">
                      <p className="text-primary tracking-widest text-xs uppercase mb-2">
                        {modulo.month}
                        {isCompleted && (
                          <span className="ml-3 text-primary/60">· Completato</span>
                        )}
                        {isStarted && (
                          <span className="ml-3 text-primary/60">· In corso</span>
                        )}
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
            <div className="mt-20 text-center">
              <Link
                href="/piani"
                className="inline-block border border-primary text-primary px-10 py-4 hover:bg-primary hover:text-primary-foreground transition-all duration-300 tracking-widest uppercase text-sm"
              >
                Inizia il Cammino
              </Link>
            </div>
          )}
        </div>
      </section>

      <section className="py-20 bg-background border-t border-border">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="grid md:grid-cols-3 gap-12 text-center">
            <div>
              <p className="text-4xl font-serif text-primary mb-3">6</p>
              <p className="text-xs uppercase tracking-widest text-muted-foreground">Moduli mensili</p>
            </div>
            <div>
              <p className="text-4xl font-serif text-primary mb-3">3</p>
              <p className="text-xs uppercase tracking-widest text-muted-foreground">Ritiri residenziali</p>
            </div>
            <div>
              <p className="text-4xl font-serif text-primary mb-3">∞</p>
              <p className="text-xs uppercase tracking-widest text-muted-foreground">Anni di saggezza</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
