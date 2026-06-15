export default function Testimonianze() {
  const testimonials = [
    {
      id: 1,
      quote: "Non è un corso di leadership, è una scossa sismica. Ho smesso di cercare di essere un leader infallibile e ho iniziato a essere un custode fecondo.",
      authorName: "Marco D.",
      authorRole: "CEO, Tech Company"
    },
    {
      id: 2,
      quote: "La Regula mi ha dato il vocabolario per nominare quel senso di vuoto che provavo nonostante i successi aziendali.",
      authorName: "Elena R.",
      authorRole: "Direttrice HR"
    }
  ];

  const graduates = [
    { id: 1, name: "Giovanni B.", votoDate: "Maggio 2023" },
    { id: 2, name: "Laura P.", votoDate: "Maggio 2023" },
    { id: 3, name: "Andrea S.", votoDate: "Novembre 2023" },
    { id: 4, name: "Chiara V.", votoDate: "Novembre 2023" },
  ];

  return (
    <div className="w-full">
      <section className="py-24 bg-background border-b border-border">
        <div className="container mx-auto px-6 max-w-4xl text-center">
          <p className="text-primary tracking-[0.3em] text-sm uppercase mb-6 animate-in fade-in">
            I Frutti
          </p>
          <h1 className="text-4xl md:text-6xl font-serif text-foreground mb-8">
            Le voci del <span className="italic text-primary">cammino.</span>
          </h1>
        </div>
      </section>

      <section className="py-24 bg-card">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="grid md:grid-cols-2 gap-12 mb-32">
            {testimonials.map((t) => (
              <div key={t.id} className="p-8 border border-primary/10 bg-background/50 relative">
                <span className="absolute -top-6 -left-2 text-6xl font-serif text-primary/20">"</span>
                <p className="text-muted-foreground font-light leading-relaxed mb-6 italic relative z-10">{t.quote}</p>
                <div>
                  <p className="font-serif text-foreground text-lg">{t.authorName}</p>
                  <p className="text-xs uppercase tracking-widest text-primary/70">{t.authorRole}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mb-16">
            <h2 className="text-3xl font-serif text-primary mb-4">Il Muro dei Custodi</h2>
            <p className="text-muted-foreground font-light max-w-xl mx-auto">
              Coloro che hanno completato il percorso Abbas e hanno pronunciato il Voto del Custode.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {graduates.map(g => (
              <div key={g.id} className="border border-border p-6 text-center bg-background hover:border-primary/30 transition-colors">
                <p className="font-serif text-foreground mb-2">{g.name}</p>
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground">{g.votoDate}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
