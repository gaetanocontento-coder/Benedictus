export default function IlManifesto() {
  return (
    <div className="w-full">
      <section className="py-24 bg-background border-b border-border">
        <div className="container mx-auto px-6 max-w-4xl text-center">
          <p className="text-primary tracking-[0.3em] text-sm uppercase mb-6 animate-in fade-in">
            Il Manifesto
          </p>
          <h1 className="text-4xl md:text-6xl font-serif text-foreground mb-8">
            Ricostruire le <span className="italic text-primary">comunità.</span>
          </h1>
        </div>
      </section>

      <section className="py-24 bg-card">
        <div className="container mx-auto px-6 max-w-3xl">
          <div className="prose prose-invert prose-stone mx-auto">
            <p className="lead text-xl text-muted-foreground font-light">
              Il mondo moderno ha scambiato l'efficienza con la fecondità. Creiamo sistemi perfetti, ma le anime si inaridiscono.
            </p>
            <p>
              Non è la tecnologia a svuotarci, ma l'assenza di un fine superiore. Le aziende sono diventate macchine per l'estrazione di valore, perdendo la loro vocazione originaria: essere comunità di scopo al servizio del bene comune.
            </p>
            <blockquote className="border-l-primary text-primary italic font-serif text-2xl my-12">
              "L'autorità non si fonda sul potere di disporre, ma sulla capacità di far crescere."
            </blockquote>
            <p>
              Abbiamo bisogno di nuovi monasteri. Non luoghi fisici cinti da mura, ma spazi di concentrazione e silenzio in mezzo al clamore del mercato. Luoghi dove l'uomo torni ad essere il fine, non il mezzo.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
