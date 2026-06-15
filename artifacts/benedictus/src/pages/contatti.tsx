import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useBSubscribeNewsletter } from "@workspace/api-client-react";

export default function Contatti() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({ name: "", email: "", whyHere: "" });

  const { mutate: subscribe, isPending } = useBSubscribeNewsletter({
    mutation: {
      onSuccess: () => {
        setFormData({ name: "", email: "", whyHere: "" });
        toast({
          title: "Iscrizione confermata",
          description:
            "Benvenuto nel cammino. Riceverai presto nostre notizie.",
        });
      },
      onError: () => {
        toast({
          title: "Errore",
          description: "Qualcosa non ha funzionato. Riprova.",
          variant: "destructive",
        });
      },
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    subscribe({ data: { ...formData, whyHere: formData.whyHere || undefined } });
  };

  return (
    <div className="w-full flex-1 flex flex-col">
      <section className="py-24 bg-background border-b border-border">
        <div className="container mx-auto px-6 max-w-4xl text-center">
          <p className="text-primary tracking-[0.3em] text-sm uppercase mb-6 animate-in fade-in">
            Contatti
          </p>
          <h1 className="text-4xl md:text-6xl font-serif text-foreground mb-8">
            Bussa e ti sarà <span className="italic text-primary">aperto.</span>
          </h1>
        </div>
      </section>

      <section className="flex-1 bg-card py-24">
        <div className="container mx-auto px-6 max-w-2xl">
          <div className="bg-background border border-border p-8 md:p-12">
            <h2 className="text-2xl font-serif text-primary mb-8 text-center">
              La Newsletter del Custode
            </h2>
            <p className="text-muted-foreground text-center font-light mb-12">
              Unisciti a noi per ricevere riflessioni mensili sulla leadership
              contemplativa. Nessuno spam, solo silenzio in forma di parole.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label
                  htmlFor="name"
                  className="text-xs uppercase tracking-widest text-muted-foreground"
                >
                  Nome
                </label>
                <input
                  id="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full bg-transparent border-b border-border py-2 focus:outline-none focus:border-primary transition-colors text-foreground font-light placeholder:text-muted-foreground/30"
                  placeholder="Il tuo nome"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="text-xs uppercase tracking-widest text-muted-foreground"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full bg-transparent border-b border-border py-2 focus:outline-none focus:border-primary transition-colors text-foreground font-light placeholder:text-muted-foreground/30"
                  placeholder="La tua email"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="whyHere"
                  className="text-xs uppercase tracking-widest text-muted-foreground"
                >
                  Perché sei qui?
                </label>
                <textarea
                  id="whyHere"
                  value={formData.whyHere}
                  onChange={(e) =>
                    setFormData({ ...formData, whyHere: e.target.value })
                  }
                  className="w-full bg-transparent border-b border-border py-2 min-h-[100px] resize-none focus:outline-none focus:border-primary transition-colors text-foreground font-light placeholder:text-muted-foreground/30"
                  placeholder="Cosa stai cercando?"
                />
              </div>

              <button
                type="submit"
                disabled={isPending}
                className="w-full bg-primary text-primary-foreground py-4 hover:bg-primary/90 transition-colors uppercase tracking-widest text-sm mt-8 disabled:opacity-50"
              >
                {isPending ? "Invio in corso..." : "Iscriviti"}
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
