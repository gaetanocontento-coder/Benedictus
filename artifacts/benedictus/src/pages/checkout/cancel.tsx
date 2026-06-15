import { Link } from "wouter";

export default function CheckoutCancel() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center py-24 bg-background min-h-[60vh]">
      <div className="text-center max-w-2xl px-6">
        <p className="text-primary tracking-[0.3em] text-sm uppercase mb-6 animate-in fade-in">
          Interrotto
        </p>
        <h1 className="text-4xl font-serif text-foreground mb-6">
          Il cammino{" "}
          <span className="italic text-primary">attende.</span>
        </h1>
        <p className="text-muted-foreground font-light mb-4 text-lg">
          Il processo di iscrizione non è stato completato.
        </p>
        <p className="text-muted-foreground font-light text-sm mb-12">
          Puoi riprendere in qualsiasi momento, senza perdere il tuo posto.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/piani"
            className="inline-block border border-primary text-primary px-10 py-4 hover:bg-primary hover:text-primary-foreground transition-all duration-300 tracking-widest uppercase text-sm"
          >
            Torna ai piani
          </Link>
          <Link
            href="/"
            className="inline-block border border-border text-muted-foreground px-10 py-4 hover:border-primary hover:text-primary transition-all duration-300 tracking-widest uppercase text-sm"
          >
            Torna al chiostro
          </Link>
        </div>
      </div>
    </div>
  );
}
