import { useAuth } from "@/lib/auth";
import { Link, useLocation } from "wouter";
import {
  useBGetStats,
  useBListLectio,
  useBListSubscribers,
  useBCreateLectio,
  useBDeleteLectio,
} from "@workspace/api-client-react";
import { useState } from "react";

export default function AdminDashboard() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();

  const { data: stats } = useBGetStats();
  const { data: lectios = [], refetch: refetchLectio } = useBListLectio({});
  const { data: subscribers = [] } = useBListSubscribers();

  const [newLectio, setNewLectio] = useState({
    title: "",
    excerpt: "",
    body: "",
    category: "ascolto",
    requiredTier: "pellegrino",
    readingMinutes: 5,
  });
  const [showNewForm, setShowNewForm] = useState(false);

  const { mutate: createLectio, isPending: creating } = useBCreateLectio({
    mutation: {
      onSuccess: () => {
        refetchLectio();
        setShowNewForm(false);
        setNewLectio({
          title: "",
          excerpt: "",
          body: "",
          category: "ascolto",
          requiredTier: "pellegrino",
          readingMinutes: 5,
        });
      },
    },
  });

  const { mutate: deleteLectio } = useBDeleteLectio({
    mutation: { onSuccess: () => refetchLectio() },
  });

  if (!user) {
    return (
      <div className="flex-1 flex items-center justify-center py-48">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Accesso richiesto</p>
          <Link href="/login" className="text-primary hover:underline">
            Accedi
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex-1 flex flex-col bg-card">
      <section className="py-12 bg-background border-b border-border">
        <div className="container mx-auto px-6">
          <p className="text-primary tracking-[0.3em] text-xs uppercase mb-4">
            Sanctuarium
          </p>
          <h1 className="text-4xl font-serif text-foreground">
            La Stanza del <span className="italic text-primary">Priore.</span>
          </h1>
          <p className="text-muted-foreground font-light mt-2">
            Benvenuto, {user.name}
          </p>
        </div>
      </section>

      <section className="py-12 flex-1">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="col-span-1 border border-border p-6 bg-background">
              <h2 className="text-lg font-serif text-primary mb-6">Gestione</h2>
              <nav className="space-y-4">
                <a
                  href="#lectio"
                  className="block text-foreground hover:text-primary uppercase tracking-widest text-xs transition-colors"
                >
                  Lectio Divina
                </a>
                <a
                  href="#subscribers"
                  className="block text-muted-foreground hover:text-primary uppercase tracking-widest text-xs transition-colors"
                >
                  Newsletter
                </a>
              </nav>
            </div>

            <div className="col-span-2 space-y-8">
              <div className="border border-border p-6 bg-background">
                <h2 className="text-2xl font-serif text-foreground mb-8">
                  Sommario della Comunità
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-4 bg-card border border-border text-center">
                    <p className="text-3xl font-serif text-primary mb-1">
                      {stats?.monaciMembers ?? 0}
                    </p>
                    <p className="text-[10px] uppercase tracking-widest text-muted-foreground">
                      Monaci
                    </p>
                  </div>
                  <div className="p-4 bg-card border border-border text-center">
                    <p className="text-3xl font-serif text-primary mb-1">
                      {stats?.abbatiMembers ?? 0}
                    </p>
                    <p className="text-[10px] uppercase tracking-widest text-muted-foreground">
                      Abbati
                    </p>
                  </div>
                  <div className="p-4 bg-card border border-border text-center">
                    <p className="text-3xl font-serif text-primary mb-1">
                      {stats?.subscribers ?? 0}
                    </p>
                    <p className="text-[10px] uppercase tracking-widest text-muted-foreground">
                      Newsletter
                    </p>
                  </div>
                  <div className="p-4 bg-card border border-border text-center">
                    <p className="text-3xl font-serif text-primary mb-1">
                      {stats?.lectioCount ?? 0}
                    </p>
                    <p className="text-[10px] uppercase tracking-widest text-muted-foreground">
                      Lectio
                    </p>
                  </div>
                </div>
              </div>

              <div id="lectio" className="border border-border p-6 bg-background">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-serif text-foreground">
                    Lectio Divina
                  </h3>
                  <button
                    onClick={() => setShowNewForm(!showNewForm)}
                    className="text-xs uppercase tracking-widest text-primary border border-primary/20 px-4 py-2 hover:bg-primary/10 transition-colors"
                  >
                    + Nuova Lectio
                  </button>
                </div>

                {showNewForm && (
                  <div className="border border-border p-6 mb-6 space-y-4 bg-card">
                    <h4 className="font-serif text-foreground">Nuova Lectio</h4>
                    <input
                      placeholder="Titolo"
                      value={newLectio.title}
                      onChange={(e) =>
                        setNewLectio({ ...newLectio, title: e.target.value })
                      }
                      className="w-full bg-background border border-border p-2 text-sm text-foreground"
                    />
                    <input
                      placeholder="Estratto"
                      value={newLectio.excerpt}
                      onChange={(e) =>
                        setNewLectio({ ...newLectio, excerpt: e.target.value })
                      }
                      className="w-full bg-background border border-border p-2 text-sm text-foreground"
                    />
                    <textarea
                      placeholder="Corpo del testo"
                      rows={6}
                      value={newLectio.body}
                      onChange={(e) =>
                        setNewLectio({ ...newLectio, body: e.target.value })
                      }
                      className="w-full bg-background border border-border p-2 text-sm text-foreground resize-none"
                    />
                    <div className="grid grid-cols-3 gap-4">
                      <select
                        value={newLectio.category}
                        onChange={(e) =>
                          setNewLectio({ ...newLectio, category: e.target.value })
                        }
                        className="bg-background border border-border p-2 text-sm text-foreground"
                      >
                        <option value="ascolto">Ascolto</option>
                        <option value="comunita">Comunità</option>
                        <option value="ritmo">Ritmo</option>
                        <option value="umilta">Umiltà</option>
                        <option value="custodia">Custodia</option>
                      </select>
                      <select
                        value={newLectio.requiredTier}
                        onChange={(e) =>
                          setNewLectio({
                            ...newLectio,
                            requiredTier: e.target.value,
                          })
                        }
                        className="bg-background border border-border p-2 text-sm text-foreground"
                      >
                        <option value="pellegrino">Pellegrino</option>
                        <option value="monaco">Monaco</option>
                        <option value="abbas">Abbas</option>
                      </select>
                      <input
                        type="number"
                        placeholder="Minuti"
                        value={newLectio.readingMinutes}
                        onChange={(e) =>
                          setNewLectio({
                            ...newLectio,
                            readingMinutes: parseInt(e.target.value),
                          })
                        }
                        className="bg-background border border-border p-2 text-sm text-foreground"
                      />
                    </div>
                    <div className="flex gap-4">
                      <button
                        onClick={() => createLectio({ data: newLectio })}
                        disabled={creating || !newLectio.title}
                        className="text-xs uppercase tracking-widest bg-primary text-primary-foreground px-6 py-2 disabled:opacity-50"
                      >
                        {creating ? "Salvataggio..." : "Pubblica"}
                      </button>
                      <button
                        onClick={() => setShowNewForm(false)}
                        className="text-xs uppercase tracking-widest text-muted-foreground px-6 py-2 border border-border"
                      >
                        Annulla
                      </button>
                    </div>
                  </div>
                )}

                <div className="space-y-4">
                  {lectios.slice(0, 10).map((l) => (
                    <div
                      key={l.id}
                      className="p-4 border border-border flex justify-between items-center"
                    >
                      <div>
                        <p className="font-serif text-foreground text-sm">
                          {l.title}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {l.category} · {l.requiredTier} · {l.readingMinutes} min
                        </p>
                      </div>
                      <button
                        onClick={() =>
                          confirm("Eliminare questa lectio?") &&
                          deleteLectio({ id: l.id })
                        }
                        className="text-xs uppercase tracking-widest text-muted-foreground hover:text-destructive transition-colors"
                      >
                        Elimina
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div id="subscribers" className="border border-border p-6 bg-background">
                <h3 className="text-lg font-serif text-foreground mb-6">
                  Iscritti Newsletter ({subscribers.length})
                </h3>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {subscribers.map((s) => (
                    <div
                      key={s.id}
                      className="p-3 border border-border text-sm flex justify-between"
                    >
                      <span className="text-foreground">{s.name}</span>
                      <span className="text-muted-foreground">{s.email}</span>
                    </div>
                  ))}
                  {subscribers.length === 0 && (
                    <p className="text-muted-foreground text-sm font-light">
                      Nessun iscritto ancora.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
