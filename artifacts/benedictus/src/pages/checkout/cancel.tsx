export default function CheckoutCancel() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center py-24 bg-background">
      <div className="text-center max-w-2xl px-6">
        <p className="text-primary tracking-[0.3em] text-sm uppercase mb-6 animate-in fade-in">
          Interrotto
        </p>
        <h1 className="text-4xl font-serif text-foreground mb-8">
          Il cammino <span className="italic text-primary">attende.</span>
        </h1>
        <p className="text-muted-foreground font-light mb-12">
          Il processo di iscrizione non è stato completato. Puoi riprenderlo in qualsiasi momento.
        </p>
        <a href="/piani" className="inline-block border border-primary text-primary px-10 py-4 hover:bg-primary hover:text-primary-foreground transition-all duration-300 tracking-widest uppercase text-sm">
          Vedi i piani
        </a>
      </div>
    </div>
  );
}
