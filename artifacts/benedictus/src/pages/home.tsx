import { Link } from "wouter";
import { ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative h-screen min-h-[800px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="/hero-cloister.png" 
            alt="Monastic Cloister" 
            className="w-full h-full object-cover opacity-30 mix-blend-overlay"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/90 to-background" />
        </div>

        <div className="relative z-10 container mx-auto px-6 text-center max-w-4xl">
          <p className="text-primary tracking-[0.3em] text-sm uppercase mb-6 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            Regula Humanitatis
          </p>
          <h1 className="text-5xl md:text-7xl font-serif text-foreground mb-8 leading-tight animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-150">
            Un rifugio per il<br/>
            <span className="italic text-primary">custode moderno.</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-2xl mx-auto font-light leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
            1500 anni di saggezza monastica tradotti in un cammino di leadership contemplativa e rigenerazione interiore.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-500">
            <Link href="/la-chiamata" className="bg-primary text-primary-foreground px-8 py-4 rounded-sm font-medium tracking-wide hover:bg-primary/90 transition-colors flex items-center gap-3">
              Ascolta la Chiamata <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/chi-siamo" className="text-foreground hover:text-primary transition-colors tracking-widest text-sm uppercase">
              Scopri il Cammino
            </Link>
          </div>
        </div>
      </section>

      {/* Rhetorical Questions */}
      <section className="py-32 bg-background border-t border-border">
        <div className="container mx-auto px-6 max-w-4xl text-center">
          <h2 className="text-3xl md:text-5xl font-serif mb-16 text-primary">Il rumore ha coperto la voce essenziale?</h2>
          
          <div className="grid md:grid-cols-3 gap-12 text-left">
            <div className="space-y-4">
              <p className="text-4xl font-serif text-muted-foreground/30">I.</p>
              <h3 className="text-xl font-serif text-foreground">Disconnessione</h3>
              <p className="text-muted-foreground font-light leading-relaxed">Le organizzazioni crescono, ma il senso di appartenenza svanisce. Il leader moderno è spesso un custode solitario.</p>
            </div>
            <div className="space-y-4">
              <p className="text-4xl font-serif text-muted-foreground/30">II.</p>
              <h3 className="text-xl font-serif text-foreground">Esaurimento</h3>
              <p className="text-muted-foreground font-light leading-relaxed">Il ritmo della performance senza il ritmo del riposo porta al vuoto. L'azione senza contemplazione è cieca.</p>
            </div>
            <div className="space-y-4">
              <p className="text-4xl font-serif text-muted-foreground/30">III.</p>
              <h3 className="text-xl font-serif text-foreground">Frammentazione</h3>
              <p className="text-muted-foreground font-light leading-relaxed">Informazioni ovunque, saggezza rara. Manca uno spazio dove ricostruire l'unità della persona.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="/stone-corridor.png" 
            alt="Stone Corridor" 
            className="w-full h-full object-cover opacity-20 mix-blend-overlay"
          />
          <div className="absolute inset-0 bg-background/90" />
        </div>
        
        <div className="relative z-10 container mx-auto px-6 text-center max-w-3xl">
          <h2 className="text-4xl font-serif mb-8">Non è un corso. È un cammino.</h2>
          <p className="text-lg text-muted-foreground mb-12 font-light">Unisciti a una comunità di pellegrini e custodi che hanno scelto di guidare partendo dal silenzio.</p>
          <Link href="/piani" className="inline-block border border-primary text-primary px-10 py-4 hover:bg-primary hover:text-primary-foreground transition-all duration-300 tracking-widest uppercase text-sm">
            Vedi i Piani
          </Link>
        </div>
      </section>
    </div>
  );
}
