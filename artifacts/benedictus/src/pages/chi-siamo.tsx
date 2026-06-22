import { ArrowRight } from "lucide-react";
import { Link } from "wouter";

const B = import.meta.env.BASE_URL;

export default function ChiSiamo() {
  return (
    <div className="w-full">

      {/* ── HERO FOTO ─────────────────────────────────────────────────── */}
      <section className="relative h-[420px] flex items-end overflow-hidden border-b border-border">
        <div className="absolute inset-0">
          <img
            src={`${B}stone-corridor.png`}
            alt="Corridoio monastico"
            className="w-full h-full object-cover"
            style={{ filter: "brightness(0.48) contrast(1.12) saturate(0.62) sepia(0.20)" }}
          />
          {/* Warm amber cast */}
          <div className="absolute inset-0 pointer-events-none" style={{ background: "rgba(120, 70, 15, 0.14)" }} />
          {/* Radial vignette */}
          <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at 50% 40%, transparent 40%, rgba(4,2,0,0.58) 100%)" }} />
          <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-transparent to-background/95" />
          <div className="absolute inset-0 bg-gradient-to-r from-background/15 to-transparent" />
        </div>

        <div className="relative z-10 container mx-auto px-6 max-w-4xl pb-12">
          <p className="text-amber-200/60 tracking-[0.4em] text-xs uppercase mb-3">
            L'Identità
          </p>
          <h1 className="text-4xl md:text-6xl font-serif text-foreground leading-tight">
            Non leader, ma{" "}
            <span className="italic text-primary">custodi.</span>
          </h1>
        </div>
      </section>

      {/* ── INTRO ─────────────────────────────────────────────────────── */}
      <section className="py-16 bg-background border-b border-border">
        <div className="container mx-auto px-6 max-w-4xl">
          <p className="text-xl text-muted-foreground font-light leading-relaxed max-w-2xl">
            Siamo una comunità di professionisti, imprenditori e ricercatori che hanno scelto
            di rifiutare la narrazione dell'efficienza vuota per abbracciare quella del rinnovamento.
          </p>
        </div>
      </section>

      {/* ── QUATTRO PASSI ─────────────────────────────────────────────── */}
      <section className="py-24 bg-card border-b border-border">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="grid md:grid-cols-2 gap-20 items-start">
            <div className="space-y-5 md:sticky md:top-24">
              <p className="text-primary tracking-[0.3em] text-xs uppercase">Il Metodo</p>
              <h2 className="text-3xl md:text-4xl font-serif text-foreground leading-snug">
                Il Cammino della<br />Trasformazione
              </h2>
              <p className="text-muted-foreground font-light leading-relaxed">
                Il percorso del custode non è una tecnica, è un ritmo interiore. Per guidare
                gli altri nella complessità moderna, occorre prima aver riordinato il proprio
                mondo interiore secondo quattro passi antichi.
              </p>
              <div className="pt-4">
                <Link
                  href="/percorso"
                  className="inline-flex items-center gap-2 text-primary text-sm uppercase tracking-widest border-b border-primary/40 hover:border-primary pb-0.5 transition-colors"
                >
                  Scopri il Percorso <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            <div className="space-y-10">
              {[
                {
                  n: "01",
                  title: "Disarmare",
                  body: "Deporre le difese, le maschere di invulnerabilità e l'ossessione per il controllo. La vera autorevolezza nasce dall'umiltà consapevole.",
                },
                {
                  n: "02",
                  title: "Ascoltare",
                  body: "«Obsculta». L'ascolto profondo non è solo sentire, ma fare spazio. Ascoltare la propria vocazione, il proprio team, il tempo presente.",
                },
                {
                  n: "03",
                  title: "Custodire",
                  body: "Non si possiede il talento o l'azienda, li si custodisce. Il leader dominatore sfrutta, il leader custode coltiva e fa crescere.",
                },
                {
                  n: "04",
                  title: "Rigenerare",
                  body: "Creare ambienti in cui l'errore sia redimibile e il riposo sacro. Dove c'è ritmo, c'è vita. Dove c'è solo performance, c'è esaurimento.",
                },
              ].map((item) => (
                <div key={item.n} className="flex gap-6 group">
                  <div className="flex-none">
                    <span className="font-serif text-3xl text-primary/20 leading-none">{item.n}</span>
                  </div>
                  <div className="flex-1 border-t border-border pt-4">
                    <h3 className="text-lg font-serif text-foreground mb-2 group-hover:text-primary transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed font-light">
                      {item.body}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── FOTO MONACO + CITAZIONE ───────────────────────────────────── */}
      <section className="relative min-h-[380px] flex items-center overflow-hidden border-b border-border">
        <div className="absolute inset-0">
          <img
            src={`${B}monk-manuscript.png`}
            alt="Monaco in preghiera"
            className="w-full h-full object-cover object-center"
            style={{ filter: "brightness(0.38) contrast(1.15) saturate(0.45) sepia(0.24)" }}
          />
          {/* Warm amber cast */}
          <div className="absolute inset-0 pointer-events-none" style={{ background: "rgba(105, 58, 10, 0.20)" }} />
          {/* Radial vignette */}
          <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at 38% 50%, transparent 28%, rgba(5,2,0,0.68) 100%)" }} />
          <div className="absolute inset-0 bg-gradient-to-r from-black/45 via-black/5 to-transparent" />
        </div>
        <div className="relative z-10 container mx-auto px-8 md:px-16 max-w-4xl">
          <blockquote className="max-w-sm">
            <p className="font-serif text-2xl md:text-3xl text-amber-50 italic leading-relaxed mb-4">
              «Nessuno cerchi il proprio vantaggio, ma quello dell'altro.»
            </p>
            <footer className="text-amber-200/60 text-xs uppercase tracking-widest">
              Regola di San Benedetto, Cap. 72
            </footer>
          </blockquote>
        </div>
      </section>

      {/* ── VALORI ────────────────────────────────────────────────────── */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-6 max-w-5xl">
          <p className="text-primary tracking-[0.3em] text-xs uppercase mb-14 text-center">I Valori Fondativi</p>
          <div className="grid sm:grid-cols-3 gap-10">
            {[
              {
                titolo: "Stabilitas",
                corpo: "Non il cambiamento fine a se stesso, ma la fedeltà a un luogo, una comunità, una vocazione. La radice che permette al ramo di piegarsi senza spezzarsi.",
              },
              {
                titolo: "Conversatio",
                corpo: "Il continuo rinnovarsi del cuore, non come cambio di identità ma come approfondimento di essa. Crescere senza tradire ciò che si è.",
              },
              {
                titolo: "Oboedientia",
                corpo: "L'obbedienza non è sottomissione, ma ascolto attivo: essere capaci di rispondere (ob-audire) alla realtà senza filtrarla con il proprio ego.",
              },
            ].map((v) => (
              <div key={v.titolo} className="border-t border-primary/20 pt-6">
                <h3 className="font-serif text-xl text-primary mb-3">{v.titolo}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed font-light">{v.corpo}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
