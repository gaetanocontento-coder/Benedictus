import { Link } from "wouter";

export default function Percorso() {
  return (
    <div className="w-full">
      <section className="py-24 bg-background border-b border-border">
        <div className="container mx-auto px-6 max-w-4xl text-center">
          <p className="text-primary tracking-[0.3em] text-sm uppercase mb-6 animate-in fade-in">
            Il Percorso
          </p>
          <h1 className="text-4xl md:text-6xl font-serif text-foreground mb-8">
            Dall'efficienza alla <span className="italic text-primary">fecondità.</span>
          </h1>
          <p className="text-xl text-muted-foreground font-light max-w-2xl mx-auto">
            Un cammino in sei moduli e tre ritiri residenziali per trasformare il tuo approccio alla leadership e alla vita.
          </p>
        </div>
      </section>

      <section className="py-24 bg-card">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="space-y-16">
            <div className="border-l border-primary/20 pl-8 relative">
              <div className="absolute w-3 h-3 bg-background border border-primary rounded-full -left-[6.5px] top-2"></div>
              <h3 className="text-sm tracking-widest text-primary uppercase mb-2">Mese 1</h3>
              <h2 className="text-2xl font-serif text-foreground mb-4">La Desolazione dell'Ego</h2>
              <p className="text-muted-foreground font-light">Affrontare le illusioni del controllo e dell'onnipotenza. Il primo passo per costruire è demolire le sovrastrutture che ci separano dalla realtà.</p>
            </div>
            <div className="border-l border-primary/20 pl-8 relative">
              <div className="absolute w-3 h-3 bg-background border border-primary rounded-full -left-[6.5px] top-2"></div>
              <h3 className="text-sm tracking-widest text-primary uppercase mb-2">Mese 2</h3>
              <h2 className="text-2xl font-serif text-foreground mb-4">L'Arte dell'Ascolto</h2>
              <p className="text-muted-foreground font-light">Sviluppare "l'orecchio del cuore". Imparare ad ascoltare i collaboratori, il mercato e se stessi senza giudizio o fretta di rispondere.</p>
            </div>
            <div className="border-l border-primary/20 pl-8 relative">
              <div className="absolute w-3 h-3 bg-background border border-primary rounded-full -left-[6.5px] top-2"></div>
              <h3 className="text-sm tracking-widest text-primary uppercase mb-2">Mese 3</h3>
              <h2 className="text-2xl font-serif text-foreground mb-4">Ritmo e Riposo</h2>
              <p className="text-muted-foreground font-light">Reintrodurre la sacralità del tempo. Comprendere che il riposo non è assenza di lavoro, ma il fondamento che rende il lavoro sostenibile.</p>
            </div>
            <div className="border-l border-primary/20 pl-8 relative">
              <div className="absolute w-3 h-3 bg-background border border-primary rounded-full -left-[6.5px] top-2"></div>
              <h3 className="text-sm tracking-widest text-primary uppercase mb-2">Mese 4</h3>
              <h2 className="text-2xl font-serif text-foreground mb-4">La Comunità Intenzionale</h2>
              <p className="text-muted-foreground font-light">Passare da un "team performante" a una comunità di scopo. Creare legami basati sulla fiducia reciproca e sulla responsabilità condivisa.</p>
            </div>
            <div className="border-l border-primary/20 pl-8 relative">
              <div className="absolute w-3 h-3 bg-background border border-primary rounded-full -left-[6.5px] top-2"></div>
              <h3 className="text-sm tracking-widest text-primary uppercase mb-2">Mese 5</h3>
              <h2 className="text-2xl font-serif text-foreground mb-4">Stabilità nel Caos</h2>
              <p className="text-muted-foreground font-light">Mantenere il centro quando tutto intorno accelera. Radicarsi in principi immutabili per poter navigare l'incertezza senza farsi travolgere.</p>
            </div>
            <div className="border-l border-primary/20 pl-8 relative">
              <div className="absolute w-3 h-3 bg-primary rounded-full -left-[6.5px] top-2 shadow-[0_0_10px_rgba(245,230,200,0.5)]"></div>
              <h3 className="text-sm tracking-widest text-primary uppercase mb-2">Mese 6</h3>
              <h2 className="text-2xl font-serif text-foreground mb-4">Il Voto del Custode</h2>
              <p className="text-muted-foreground font-light">La consacrazione del cammino. Assumersi la responsabilità di custodire le persone e i progetti affidati, inaugurando una nuova stagione di fecondità.</p>
            </div>
          </div>
          
          <div className="mt-24 text-center">
            <Link href="/piani" className="inline-block border border-primary text-primary px-10 py-4 hover:bg-primary hover:text-primary-foreground transition-all duration-300 tracking-widest uppercase text-sm">
              Inizia il Cammino
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
