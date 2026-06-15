import { useParams } from "wouter";

export default function LectioDetail() {
  const { id } = useParams();

  return (
    <div className="w-full">
      <section className="py-24 bg-background border-b border-border">
        <div className="container mx-auto px-6 max-w-4xl text-center">
          <p className="text-primary tracking-[0.3em] text-sm uppercase mb-6 animate-in fade-in">
            Lectio {id}
          </p>
          <h1 className="text-4xl md:text-6xl font-serif text-foreground mb-8">
            L'ascolto come atto creativo.
          </h1>
        </div>
      </section>

      <section className="py-24 bg-card">
        <div className="container mx-auto px-6 max-w-3xl">
          <div className="prose prose-invert prose-stone mx-auto">
            <p className="lead text-xl text-muted-foreground font-light">
              Creare spazio perché l'altro possa esistere. Questo è il primo compito del leader.
            </p>
            <div className="p-8 border border-primary/20 bg-background/50 text-center my-12">
              <h3 className="text-xl font-serif text-foreground mb-4">Riservato ai Monaci</h3>
              <p className="text-muted-foreground font-light mb-6">Fai l'upgrade del tuo piano per leggere questa lectio completa.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
