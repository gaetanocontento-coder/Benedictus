import { ArrowRight } from "lucide-react";
import { Link } from "wouter";

export default function ChiSiamo() {
  return (
    <div className="w-full">
      <section className="py-24 bg-background border-b border-border">
        <div className="container mx-auto px-6 max-w-4xl text-center">
          <p className="text-primary tracking-[0.3em] text-sm uppercase mb-6 animate-in fade-in">
            L'Identità
          </p>
          <h1 className="text-4xl md:text-6xl font-serif text-foreground mb-8">
            Non leader, ma <span className="italic text-primary">custodi.</span>
          </h1>
          <p className="text-xl text-muted-foreground font-light leading-relaxed max-w-2xl mx-auto">
            Siamo una comunità di professionisti, imprenditori e ricercatori che hanno scelto di rifiutare la narrazione dell'efficienza vuota per abbracciare quella del rinnovamento.
          </p>
        </div>
      </section>

      <section className="py-24 bg-card relative">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="grid md:grid-cols-2 gap-24 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl font-serif text-foreground">Il Cammino della Trasformazione</h2>
              <p className="text-muted-foreground font-light leading-relaxed">
                Il percorso del custode non è una tecnica, è un ritmo interiore. Per guidare gli altri nella complessità moderna, occorre prima aver riordinato il proprio mondo interiore secondo quattro passi antichi.
              </p>
            </div>
            <div className="space-y-12">
              <div className="relative pl-8 border-l border-primary/20">
                <div className="absolute w-2 h-2 bg-primary rounded-full -left-[4.5px] top-2"></div>
                <h3 className="text-xl font-serif text-foreground mb-2">1. Disarmare</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">Deporre le difese, le maschere di invulnerabilità e l'ossessione per il controllo. La vera autorevolezza nasce dall'umiltà consapevole.</p>
              </div>
              <div className="relative pl-8 border-l border-primary/20">
                <div className="absolute w-2 h-2 bg-primary rounded-full -left-[4.5px] top-2"></div>
                <h3 className="text-xl font-serif text-foreground mb-2">2. Ascoltare</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">"Obsculta". L'ascolto profondo non è solo sentire, ma fare spazio. Ascoltare la propria vocazione, il proprio team, il tempo presente.</p>
              </div>
              <div className="relative pl-8 border-l border-primary/20">
                <div className="absolute w-2 h-2 bg-primary rounded-full -left-[4.5px] top-2"></div>
                <h3 className="text-xl font-serif text-foreground mb-2">3. Custodire</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">Non si possiede il talento o l'azienda, li si custodisce. Il leader dominatore sfrutta, il leader custode coltiva e fa crescere.</p>
              </div>
              <div className="relative pl-8 border-l border-primary/20 border-b-0 pb-0">
                <div className="absolute w-2 h-2 bg-primary rounded-full -left-[4.5px] top-2"></div>
                <h3 className="text-xl font-serif text-foreground mb-2">4. Rigenerare</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">Creare ambienti in cui l'errore sia redimibile e il riposo sacro. Dove c'è ritmo, c'è vita. Dove c'è solo performance, c'è esaurimento.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-background">
        <div className="container mx-auto px-6 max-w-4xl text-center">
          <Link href="/percorso" className="inline-flex items-center gap-3 border border-primary text-primary px-8 py-4 hover:bg-primary hover:text-primary-foreground transition-all duration-300 tracking-widest uppercase text-sm">
            Scopri il percorso <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
