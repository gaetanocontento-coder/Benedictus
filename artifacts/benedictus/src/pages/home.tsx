import { Link } from "wouter";

const B = import.meta.env.BASE_URL;

export default function Home() {
  return (
    <div className="w-full">

      {/* ── HERO ─────────────────────────────────────────────────────── */}
      <section className="container mx-auto px-6 lg:px-12 pt-12 pb-0">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center min-h-[calc(100vh-4rem)] lg:min-h-[auto] lg:h-[82vh]">

          {/* LEFT — copy */}
          <div className="lg:col-span-5 flex flex-col justify-center order-2 lg:order-1 pb-12 lg:pb-0">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 border border-border rounded-full px-4 py-1.5 text-[11px] tracking-widest uppercase text-foreground/60 mb-8 self-start">
              <span className="w-1.5 h-1.5 rounded-full bg-accent/70 flex-shrink-0" />
              Regula Humanitatis · Est. MCM
            </div>

            {/* Headline */}
            <h1 className="font-serif text-5xl md:text-6xl lg:text-[62px] xl:text-[72px] text-foreground leading-[1.06] mb-6">
              Un rifugio per il<br />
              <em className="not-italic" style={{ color: "hsl(var(--accent))" }}>custode</em>{" "}
              moderno.
            </h1>

            {/* Subtitle */}
            <p className="text-[15px] text-muted-foreground font-light leading-relaxed max-w-[440px] mb-8">
              1500 anni di saggezza monastica tradotti in un cammino di
              leadership contemplativa e rigenerazione interiore. Inizia
              in silenzio.
            </p>

            {/* CTAs */}
            <div className="flex items-center gap-5 mb-8">
              <Link
                href="/la-chiamata"
                className="bg-primary text-primary-foreground text-[11px] uppercase tracking-[0.18em] font-medium px-7 py-3.5 rounded-full hover:bg-primary/85 transition-colors"
              >
                Ascolta la Chiamata
              </Link>
              <Link
                href="/piani"
                className="text-[13px] text-foreground/60 hover:text-foreground transition-colors"
              >
                Vedi i Piani →
              </Link>
            </div>

            {/* Social proof */}
            <div className="flex items-center gap-2.5">
              <div className="flex items-center gap-0.5">
                {[0,1,2,3,4].map((i) => (
                  <svg key={i} viewBox="0 0 16 16" className="w-4 h-4 text-accent" fill="currentColor">
                    <path d="M8 1l1.8 3.6L14 5.3l-3 2.9.7 4.1L8 10.5l-3.7 1.8.7-4.1-3-2.9 4.2-.7z" />
                  </svg>
                ))}
              </div>
              <p className="text-[12px] text-muted-foreground">
                <strong className="text-foreground font-medium">Oltre 2.100</strong>{" "}
                custodi hanno iniziato il cammino questa stagione.
              </p>
            </div>
          </div>

          {/* RIGHT — monk photo + floating cards */}
          <div className="lg:col-span-7 relative order-1 lg:order-2 flex justify-center lg:justify-end">
            <div className="relative w-full max-w-[560px] lg:max-w-none">
              {/* Main photo */}
              <div className="rounded-3xl overflow-hidden aspect-[4/5] lg:aspect-[3/4] w-full max-h-[68vh]">
                <img
                  src={`${B}benedictine-monk.jpg`}
                  alt="Monaco benedettino in preghiera"
                  className="w-full h-full object-cover object-center"
                  style={{
                    filter: "brightness(0.92) contrast(1.06) saturate(0.72) sepia(0.28)",
                  }}
                />
              </div>

              {/* Floating card — top left — LAUDS */}
              <div
                className="absolute -left-4 md:-left-10 top-8 bg-white rounded-2xl shadow-lg shadow-black/10 px-4 py-3 min-w-[160px]"
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="w-6 h-6 rounded-full bg-background border border-border/60 flex items-center justify-center flex-shrink-0">
                    <svg viewBox="0 0 22 22" fill="none" className="w-3 h-3 text-foreground/50">
                      <path d="M11 19V11M11 11C11 11 7.5 8 7 4.5C6.6 2.2 8.5 1 11 1C13.5 1 15.4 2.2 15 4.5C14.5 8 11 11 11 11Z" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                    </svg>
                  </div>
                  <span className="text-[9px] uppercase tracking-[0.2em] text-muted-foreground font-medium">Lauds · 6 min</span>
                </div>
                <p className="font-serif text-[15px] text-foreground italic mb-2">Silentium</p>
                <div className="h-1 bg-border rounded-full overflow-hidden">
                  <div className="h-full w-2/5 bg-accent/60 rounded-full" />
                </div>
              </div>

              {/* Floating card — bottom right — LECTIO DIVINA */}
              <div
                className="absolute -right-4 md:-right-8 bottom-10 bg-white rounded-2xl shadow-lg shadow-black/10 px-4 py-4 max-w-[220px]"
              >
                <p className="text-[9px] uppercase tracking-[0.22em] text-muted-foreground mb-2">· Lectio Divina ·</p>
                <blockquote className="font-serif text-[14px] italic text-foreground leading-snug mb-2">
                  «Ausculta, o fili, præcepta magistri.»
                </blockquote>
                <p className="text-[10px] text-muted-foreground">San Benedetto · 530 d.C.</p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ── STATS STRIP ──────────────────────────────────────────────── */}
      <section className="container mx-auto px-6 lg:px-12 pb-16">
        <div className="bg-card rounded-2xl border border-border/60 shadow-sm">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-border/50 divide-y md:divide-y-0">
            {[
              { n: "1.500", label: "anni di tradizione viva" },
              { n: "73",    label: "capitoli della Regola" },
              { n: "4.8/5", label: "valutazione dei custodi" },
              { n: "12",    label: "lingue e tradizioni" },
            ].map((s) => (
              <div key={s.label} className="py-8 px-8">
                <p className="font-serif text-4xl lg:text-5xl text-foreground mb-1">{s.n}</p>
                <p className="text-[11px] text-muted-foreground">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── OPENING VERSE ────────────────────────────────────────────── */}
      <section className="py-28 bg-background relative overflow-hidden border-t border-border/40">
        <div className="container mx-auto px-6 max-w-3xl text-center relative">
          <p className="text-muted-foreground/70 tracking-[0.4em] text-[10px] uppercase mb-10">
            · Prologo · Regula Sancti Benedicti ·
          </p>
          <blockquote className="font-serif text-3xl md:text-4xl lg:text-5xl text-foreground leading-tight mb-8 italic">
            «Ausculta, o fili,
            <br />
            <span style={{ color: "hsl(var(--accent))" }}>præcepta magistri,</span>
            <br />
            et inclina aurem
            <br />
            cordis tui.»
          </blockquote>
          <p className="text-muted-foreground font-light text-sm tracking-widest uppercase">
            San Benedetto da Norcia · ca. 530 d.C.
          </p>
          <div className="mt-10 flex items-center justify-center gap-4">
            <div className="h-px w-16 bg-border" />
            <div className="w-1.5 h-1.5 bg-border rotate-45" />
            <div className="h-px w-16 bg-border" />
          </div>
        </div>
      </section>

      {/* ── IL CAMMINO — 3 sfide ─────────────────────────────────────── */}
      <section className="py-0 border-t border-border/40 overflow-hidden">
        <div className="flex flex-col lg:flex-row min-h-[580px]">

          {/* Photo column */}
          <div className="lg:w-5/12 relative min-h-[300px] lg:min-h-full overflow-hidden">
            <img
              src={`${B}monk-manuscript.png`}
              alt="Monaco che scrive un manoscritto"
              className="absolute inset-0 w-full h-full object-cover"
              style={{ filter: "brightness(0.72) contrast(1.12) saturate(0.62) sepia(0.18)" }}
            />
            <div className="absolute inset-0 pointer-events-none" style={{ background: "rgba(130, 75, 15, 0.10)" }} />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-background lg:block hidden" />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background lg:hidden" />
          </div>

          {/* Content column */}
          <div className="lg:w-7/12 bg-background px-8 md:px-16 py-20 flex flex-col justify-center">
            <p className="text-accent tracking-[0.3em] text-xs uppercase mb-10 font-medium">
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
                  <span className="text-2xl font-serif text-border flex-shrink-0 w-8 pt-0.5">
                    {item.n}
                  </span>
                  <div>
                    <h3 className="font-serif text-lg text-foreground mb-2 group-hover:text-accent transition-colors">
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
              className="mt-12 self-start text-xs uppercase tracking-widest text-foreground/50 hover:text-foreground transition-colors border-b border-border hover:border-foreground/40 pb-0.5"
            >
              La nostra storia →
            </Link>
          </div>
        </div>
      </section>

      {/* ── STONE CORRIDOR FULL-BLEED ────────────────────────────────── */}
      <section className="relative min-h-[520px] flex items-center justify-center overflow-hidden border-t border-border/40">
        <div className="absolute inset-0">
          <img
            src={`${B}stone-corridor.png`}
            alt="Corridoio in pietra"
            className="w-full h-full object-cover"
            style={{ filter: "brightness(0.38) contrast(1.15) saturate(0.48) sepia(0.22)" }}
          />
          <div className="absolute inset-0 pointer-events-none" style={{ background: "rgba(80, 40, 8, 0.20)" }} />
          <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at 50% 50%, transparent 28%, rgba(5,3,1,0.68) 100%)" }} />
        </div>
        <div className="relative z-10 text-center px-6 max-w-2xl mx-auto">
          <p className="text-amber-200/50 tracking-[0.4em] text-xs uppercase mb-6">
            La Regola
          </p>
          <h2 className="text-3xl md:text-5xl font-serif text-amber-50 mb-6 leading-tight">
            Non è un corso.<br />
            <span className="italic text-amber-200/90">È un cammino.</span>
          </h2>
          <p className="text-amber-100/55 font-light mb-10 leading-relaxed">
            Unisciti a una comunità di pellegrini e custodi che hanno scelto
            di guidare partendo dal silenzio.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
            <Link
              href="/percorso"
              className="border border-amber-200/50 text-amber-100 px-10 py-4 hover:bg-amber-200/10 hover:border-amber-200 transition-all duration-300 tracking-widest uppercase text-xs rounded-full"
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

      {/* ── ANCIENT LIBRARY ──────────────────────────────────────────── */}
      <section className="relative min-h-[420px] flex items-center overflow-hidden border-t border-border/40">
        <div className="absolute inset-0">
          <img
            src={`${B}ancient-library.png`}
            alt="Biblioteca antica"
            className="w-full h-full object-cover object-top"
            style={{ filter: "brightness(0.40) contrast(1.14) saturate(0.46) sepia(0.24)" }}
          />
          <div className="absolute inset-0 pointer-events-none" style={{ background: "rgba(90, 50, 10, 0.16)" }} />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/10 to-transparent" />
        </div>
        <div className="relative z-10 container mx-auto px-8 md:px-16 max-w-5xl">
          <div className="max-w-sm">
            <p className="text-amber-200/50 tracking-[0.3em] text-xs uppercase mb-4">
              Scriptorium
            </p>
            <h2 className="text-3xl md:text-4xl font-serif text-amber-50 mb-4 leading-tight">
              I testi del<br />
              <span className="italic text-amber-200/90">cammino.</span>
            </h2>
            <p className="text-amber-100/50 font-light text-sm leading-relaxed mb-7">
              14 fonti certificate — dalla Regola di San Benedetto a Thomas Merton.
              Ogni autore è reale. Ogni testo è verificato.
            </p>
            <Link
              href="/scriptorium"
              className="text-xs uppercase tracking-widest text-amber-200/70 hover:text-amber-100 transition-colors border-b border-amber-200/25 hover:border-amber-100/50 pb-0.5"
            >
              Entra nello Scriptorium →
            </Link>
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ────────────────────────────────────────────────── */}
      <section className="py-28 bg-background border-t border-border/40 text-center">
        <div className="container mx-auto px-6 max-w-2xl">
          <div className="flex items-center justify-center gap-4 mb-10">
            <div className="h-px flex-1 bg-border/60" />
            <div className="w-2 h-2 bg-border rotate-45" />
            <div className="h-px flex-1 bg-border/60" />
          </div>
          <p className="text-muted-foreground/70 tracking-[0.4em] text-xs uppercase mb-6">
            Ora et Labora
          </p>
          <h2 className="text-3xl md:text-5xl font-serif text-foreground mb-6 leading-tight">
            Il silenzio è il punto<br />
            <em className="not-italic" style={{ color: "hsl(var(--accent))" }}>di partenza.</em>
          </h2>
          <p className="text-muted-foreground font-light mb-10 leading-relaxed">
            Inizia gratuitamente. Nessuna carta di credito richiesta.
          </p>
          <Link
            href="/registrazione"
            className="inline-block bg-primary text-primary-foreground px-12 py-4 rounded-full hover:bg-primary/85 transition-all duration-300 tracking-[0.14em] uppercase text-[12px]"
          >
            Inizia il Cammino
          </Link>
        </div>
      </section>

    </div>
  );
}
