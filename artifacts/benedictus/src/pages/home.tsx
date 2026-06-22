import { Link } from "wouter";
import { ArrowDown } from "lucide-react";

const B = import.meta.env.BASE_URL;

export default function Home() {
  return (
    <div className="w-full">

      {/* ── HERO ──────────────────────────────────────────────────────── */}
      <section className="relative h-screen min-h-[700px] flex items-end overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={`${B}hero-cloister.png`}
            alt="Chiostro monastico"
            className="w-full h-full object-cover"
            style={{ filter: "brightness(0.56) contrast(1.12) saturate(0.72) sepia(0.18)" }}
          />
          {/* Warm amber split-tone */}
          <div className="absolute inset-0 pointer-events-none" style={{ background: "rgba(140, 85, 20, 0.14)" }} />
          {/* Radial vignette — darkens corners, not centre */}
          <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at 50% 45%, transparent 38%, rgba(0,0,0,0.52) 100%)" }} />
          {/* Top fade — keeps nav readable */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-transparent" />
          {/* Bottom fade — transitions to parchment background */}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/55 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-background/35 via-transparent to-transparent" />
        </div>

        {/* Hero text — hardcoded dark sepia (sits on the parchment gradient at the bottom) */}
        <div className="relative z-10 container mx-auto px-8 lg:px-16 pb-24 max-w-5xl">
          <p
            className="text-primary/70 tracking-[0.4em] text-xs uppercase mb-5 animate-in fade-in duration-1000"
            style={{ animationDelay: "300ms" }}
          >
            Regula Humanitatis · Est. MCM
          </p>
          <h1
            className="text-5xl md:text-7xl lg:text-8xl font-serif text-foreground leading-[1.05] mb-8 animate-in fade-in slide-in-from-bottom-6 duration-1000"
            style={{ animationDelay: "500ms" }}
          >
            Un rifugio per<br />
            il <em className="text-primary not-italic">custode</em><br />
            moderno.
          </h1>
          <p
            className="text-lg md:text-xl text-foreground/60 font-light leading-relaxed max-w-lg mb-10 animate-in fade-in duration-1000"
            style={{ animationDelay: "800ms" }}
          >
            1500 anni di saggezza monastica tradotti in un cammino
            di leadership contemplativa e rigenerazione interiore.
          </p>
          <div
            className="flex flex-col sm:flex-row items-start sm:items-center gap-6 animate-in fade-in duration-1000"
            style={{ animationDelay: "1100ms" }}
          >
            <Link
              href="/la-chiamata"
              className="bg-primary text-primary-foreground px-9 py-4 tracking-widest uppercase text-sm hover:bg-primary/85 transition-all duration-300 shadow-lg"
            >
              Ascolta la Chiamata
            </Link>
            <Link
              href="/piani"
              className="text-foreground/60 hover:text-primary transition-colors tracking-widest text-xs uppercase border-b border-foreground/20 hover:border-primary pb-0.5"
            >
              Vedi i Piani →
            </Link>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 animate-in fade-in duration-1000" style={{ animationDelay: "1500ms" }}>
          <div className="w-px h-12 bg-gradient-to-b from-primary/0 to-primary/30" />
          <ArrowDown className="w-3.5 h-3.5 text-primary/40 animate-bounce" />
        </div>
      </section>

      {/* ── OPENING VERSE ─────────────────────────────────────────────── */}
      <section className="py-28 bg-background relative overflow-hidden border-b border-border">
        {/* Very subtle decorative pattern */}
        <div className="absolute inset-0 opacity-[0.025] pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23742c0e' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
        <div className="container mx-auto px-6 max-w-3xl text-center relative">
          <p className="text-primary/50 tracking-[0.5em] text-[10px] uppercase mb-10">
            · Prologo · Regula Sancti Benedicti ·
          </p>
          <blockquote className="font-serif text-3xl md:text-4xl lg:text-5xl text-foreground leading-tight mb-8 italic">
            «Ausculta, o fili,
            <br />
            <span className="text-primary">præcepta magistri,</span>
            <br />
            et inclina aurem
            <br />
            cordis tui.»
          </blockquote>
          <p className="text-muted-foreground font-light text-sm tracking-widest uppercase">
            San Benedetto da Norcia · ca. 530 d.C.
          </p>
          <div className="mt-10 flex items-center justify-center gap-4">
            <div className="h-px w-16 bg-primary/20" />
            <div className="w-1.5 h-1.5 bg-primary/30 rotate-45" />
            <div className="h-px w-16 bg-primary/20" />
          </div>
        </div>
      </section>

      {/* ── MONK + THREE PATHS ────────────────────────────────────────── */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="flex flex-col lg:flex-row min-h-[620px]">

          {/* Photo column */}
          <div className="lg:w-5/12 relative min-h-[300px] lg:min-h-full overflow-hidden">
            <img
              src={`${B}monk-manuscript.png`}
              alt="Monaco che scrive un manoscritto"
              className="absolute inset-0 w-full h-full object-cover"
              style={{ filter: "brightness(0.74) contrast(1.14) saturate(0.62) sepia(0.14)" }}
            />
            {/* Warm amber cast */}
            <div className="absolute inset-0 pointer-events-none" style={{ background: "rgba(130, 75, 15, 0.12)" }} />
            {/* Radial vignette */}
            <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at 42% 50%, transparent 35%, rgba(0,0,0,0.48) 100%)" }} />
            {/* Blend toward the right side where content starts */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-background lg:block hidden" />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background lg:hidden" />
          </div>

          {/* Content column */}
          <div className="lg:w-7/12 bg-background px-8 md:px-16 py-20 flex flex-col justify-center">
            <p className="text-primary tracking-[0.3em] text-xs uppercase mb-10 font-medium">
              Il Cammino
            </p>

            <div className="space-y-10">
              {[
                {
                  n: "I.",
                  title: "Disconnessione",
                  body: "Le organizzazioni crescono, ma il senso di appartenenza svanisce. Il leader moderno è spesso un custode solitario.",
                },
                {
                  n: "II.",
                  title: "Esaurimento",
                  body: "Il ritmo della performance senza il ritmo del riposo porta al vuoto. L'azione senza contemplazione è cieca.",
                },
                {
                  n: "III.",
                  title: "Frammentazione",
                  body: "Informazioni ovunque, saggezza rara. Manca uno spazio dove ricostruire l'unità della persona.",
                },
              ].map((item) => (
                <div key={item.n} className="flex gap-6 group">
                  <span className="text-2xl font-serif text-primary/30 flex-shrink-0 w-8 pt-0.5">
                    {item.n}
                  </span>
                  <div>
                    <h3 className="font-serif text-lg text-foreground mb-2 group-hover:text-primary transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-muted-foreground font-light leading-relaxed text-sm">
                      {item.body}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <Link
              href="/chi-siamo"
              className="mt-12 self-start text-xs uppercase tracking-widest text-primary hover:text-foreground transition-colors border-b border-primary/40 hover:border-foreground/40 pb-0.5"
            >
              La nostra storia →
            </Link>
          </div>
        </div>
      </section>

      {/* ── STONE CORRIDOR FULL BLEED ─────────────────────────────────── */}
      <section className="relative min-h-[520px] flex items-center justify-center overflow-hidden border-b border-border">
        <div className="absolute inset-0">
          <img
            src={`${B}stone-corridor.png`}
            alt="Corridoio in pietra"
            className="w-full h-full object-cover"
            style={{ filter: "brightness(0.42) contrast(1.15) saturate(0.52) sepia(0.24)" }}
          />
          {/* Warm amber split-tone */}
          <div className="absolute inset-0 pointer-events-none" style={{ background: "rgba(100, 55, 10, 0.18)" }} />
          {/* Radial vignette */}
          <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at 50% 50%, transparent 30%, rgba(8,4,1,0.65) 100%)" }} />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/30" />
        </div>

        {/* Text always on very dark photo — use hardcoded light colors */}
        <div className="relative z-10 text-center px-6 max-w-2xl mx-auto">
          <p className="text-amber-200/60 tracking-[0.4em] text-xs uppercase mb-6">
            La Regola
          </p>
          <h2 className="text-3xl md:text-5xl font-serif text-amber-50 mb-6 leading-tight">
            Non è un corso.
            <br />
            <span className="italic text-amber-200">È un cammino.</span>
          </h2>
          <p className="text-amber-100/60 font-light mb-10 leading-relaxed">
            Unisciti a una comunità di pellegrini e custodi che hanno scelto
            di guidare partendo dal silenzio.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
            <Link
              href="/percorso"
              className="border border-amber-200/60 text-amber-100 px-10 py-4 hover:bg-amber-200/10 hover:border-amber-200 transition-all duration-300 tracking-widest uppercase text-xs"
            >
              Il Percorso
            </Link>
            <Link
              href="/piani"
              className="text-amber-200/60 hover:text-amber-100 transition-colors tracking-widest text-xs uppercase"
            >
              I Piani →
            </Link>
          </div>
        </div>
      </section>

      {/* ── NUMBERS ───────────────────────────────────────────────────── */}
      <section className="py-24 bg-card border-b border-border">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="grid md:grid-cols-4 gap-0 divide-x divide-border text-center">
            {[
              { n: "1.500", label: "Anni di tradizione" },
              { n: "73",    label: "Capitoli della Regola" },
              { n: "6",     label: "Moduli del Percorso" },
              { n: "XIV",   label: "Testi nello Scriptorium" },
            ].map((s) => (
              <div key={s.label} className="py-8 px-8">
                <p className="text-4xl lg:text-5xl font-serif text-primary mb-2">
                  {s.n}
                </p>
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ANCIENT LIBRARY ───────────────────────────────────────────── */}
      <section className="relative min-h-[440px] flex items-center overflow-hidden border-b border-border">
        <div className="absolute inset-0">
          <img
            src={`${B}ancient-library.png`}
            alt="Biblioteca antica"
            className="w-full h-full object-cover object-top"
            style={{ filter: "brightness(0.44) contrast(1.14) saturate(0.48) sepia(0.22)" }}
          />
          {/* Warm amber cast */}
          <div className="absolute inset-0 pointer-events-none" style={{ background: "rgba(110, 60, 12, 0.16)" }} />
          {/* Radial vignette — centred left where text lives */}
          <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at 30% 55%, transparent 32%, rgba(6,3,1,0.62) 100%)" }} />
          <div className="absolute inset-0 bg-gradient-to-r from-black/55 via-black/10 to-transparent" />
        </div>

        {/* Hardcoded light text on dark photo */}
        <div className="relative z-10 container mx-auto px-8 md:px-16 max-w-5xl">
          <div className="max-w-sm">
            <p className="text-amber-200/60 tracking-[0.3em] text-xs uppercase mb-4">
              Scriptorium
            </p>
            <h2 className="text-3xl md:text-4xl font-serif text-amber-50 mb-4 leading-tight">
              I testi del<br />
              <span className="italic text-amber-200">cammino.</span>
            </h2>
            <p className="text-amber-100/55 font-light text-sm leading-relaxed mb-7">
              14 fonti certificate dalla Regola di San Benedetto a Thomas Merton.
              Ogni autore è reale. Ogni testo è verificato.
            </p>
            <Link
              href="/scriptorium"
              className="text-xs uppercase tracking-widest text-amber-200/80 hover:text-amber-100 transition-colors border-b border-amber-200/30 hover:border-amber-100/50 pb-0.5"
            >
              Entra nello Scriptorium →
            </Link>
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ─────────────────────────────────────────────────── */}
      <section className="py-28 bg-background text-center">
        <div className="container mx-auto px-6 max-w-2xl">
          <div className="flex items-center justify-center gap-4 mb-10">
            <div className="h-px flex-1 bg-primary/15" />
            <div className="w-2 h-2 bg-primary/30 rotate-45" />
            <div className="h-px flex-1 bg-primary/15" />
          </div>
          <p className="text-primary/60 tracking-[0.4em] text-xs uppercase mb-6">
            Ora et Labora
          </p>
          <h2 className="text-3xl md:text-5xl font-serif text-foreground mb-6 leading-tight">
            Il silenzio è il punto<br />
            <span className="italic text-primary">di partenza.</span>
          </h2>
          <p className="text-muted-foreground font-light mb-10 leading-relaxed">
            Inizia gratuitamente. Nessuna carta di credito richiesta.
          </p>
          <Link
            href="/registrazione"
            className="inline-block bg-primary text-primary-foreground px-12 py-5 hover:bg-primary/85 transition-all duration-300 tracking-widest uppercase text-sm shadow-md"
          >
            Inizia il Cammino
          </Link>
        </div>
      </section>

    </div>
  );
}
