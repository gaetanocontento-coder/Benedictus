import { useEffect } from "react";
import { Link, useLocation } from "wouter";

export default function CheckoutSuccess() {
  const [, navigate] = useLocation();

  useEffect(() => {
    const timer = setTimeout(() => navigate("/percorso"), 6000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="flex-1 flex flex-col items-center justify-center py-24 bg-background min-h-[60vh]">
      <div className="text-center max-w-2xl px-6">
        <div className="w-16 h-16 border border-primary rounded-full flex items-center justify-center mx-auto mb-8">
          <svg
            className="w-6 h-6 text-primary"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        <p className="text-primary tracking-[0.3em] text-sm uppercase mb-6 animate-in fade-in">
          Compiuto
        </p>
        <h1 className="text-4xl md:text-6xl font-serif text-foreground mb-6">
          Benvenuto nel{" "}
          <span className="italic text-primary">Sanctuarium.</span>
        </h1>
        <p className="text-xl text-muted-foreground font-light mb-4">
          La tua iscrizione è stata confermata. Sei ora parte della comunità.
        </p>
        <p className="text-sm text-muted-foreground font-light mb-12">
          Verrai reindirizzato al percorso tra pochi secondi…
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/percorso"
            className="inline-block bg-primary text-primary-foreground px-10 py-4 hover:bg-primary/90 transition-all duration-300 tracking-widest uppercase text-sm"
          >
            Inizia il Percorso
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
