import { useAuth } from "@/lib/auth";
import { useBListWorkshops, useBRegisterWorkshop } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { getBListWorkshopsQueryKey } from "@workspace/api-client-react";
import { Link } from "wouter";

export default function Officina() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: workshops = [], isLoading } = useBListWorkshops();

  const registerMutation = useBRegisterWorkshop({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getBListWorkshopsQueryKey() });
      },
    },
  });

  return (
    <div className="w-full">
      <section className="py-24 bg-background border-b border-border">
        <div className="container mx-auto px-6 max-w-4xl text-center">
          <p className="text-primary tracking-[0.3em] text-sm uppercase mb-6 animate-in fade-in">
            Officina
          </p>
          <h1 className="text-4xl md:text-6xl font-serif text-foreground mb-8">
            Il lavoro <span className="italic text-primary">condiviso.</span>
          </h1>
          <p className="text-xl text-muted-foreground font-light max-w-2xl mx-auto">
            Ritiri, seminari e incontri in presenza. Perché la comunità ha bisogno di sguardi.
          </p>
        </div>
      </section>

      <section className="py-24 bg-card">
        <div className="container mx-auto px-6 max-w-5xl">
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="border border-border p-8 bg-background animate-pulse">
                  <div className="h-6 bg-border/50 rounded w-1/3 mb-3" />
                  <div className="h-4 bg-border/30 rounded w-2/3" />
                </div>
              ))}
            </div>
          ) : workshops.length === 0 ? (
            <p className="text-center text-muted-foreground py-20 font-light">
              Nessun evento in programma. Torna presto.
            </p>
          ) : (
            <div className="grid gap-8">
              {workshops.map((workshop) => {
                const isFull = workshop.currentParticipants >= workshop.maxParticipants;
                const isRegistered = workshop.isRegistered;

                return (
                  <div
                    key={workshop.id}
                    className="border border-border p-8 bg-background flex flex-col md:flex-row gap-8"
                  >
                    <div className="md:w-1/4 border-b md:border-b-0 md:border-r border-border pb-6 md:pb-0 md:pr-6 flex flex-col justify-center text-center md:text-left">
                      <p className="text-2xl font-serif text-primary">{workshop.date}</p>
                      <p className="text-sm text-muted-foreground uppercase tracking-widest mt-2">
                        {workshop.location}
                      </p>
                    </div>

                    <div className="md:w-2/4 flex flex-col justify-center">
                      <h2 className="text-xl font-serif text-foreground mb-3">
                        {workshop.title}
                      </h2>
                      <p className="text-muted-foreground font-light text-sm">
                        {workshop.description}
                      </p>
                    </div>

                    <div className="md:w-1/4 flex flex-col justify-center items-center md:items-end gap-4">
                      <p className="text-xs uppercase tracking-widest text-muted-foreground">
                        {workshop.currentParticipants}/{workshop.maxParticipants} posti
                      </p>
                      {isRegistered ? (
                        <span className="text-primary border border-primary/20 px-6 py-2 uppercase tracking-widest text-xs">
                          Iscritto
                        </span>
                      ) : isFull ? (
                        <span className="text-muted-foreground border border-border px-6 py-2 uppercase tracking-widest text-xs">
                          Completo
                        </span>
                      ) : !user ? (
                        <Link
                          href="/login"
                          className="bg-primary text-primary-foreground hover:bg-primary/90 transition-colors px-6 py-2 uppercase tracking-widest text-xs"
                        >
                          Accedi per iscriverti
                        </Link>
                      ) : (
                        <button
                          onClick={() => registerMutation.mutate({ id: workshop.id })}
                          disabled={registerMutation.isPending}
                          className="bg-primary text-primary-foreground hover:bg-primary/90 transition-colors px-6 py-2 uppercase tracking-widest text-xs disabled:opacity-50"
                        >
                          {registerMutation.isPending ? "…" : "Registrati"}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
