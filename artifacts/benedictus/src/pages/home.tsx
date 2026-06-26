import { Link } from "wouter";

const B = import.meta.env.BASE_URL;

export default function Home() {
  return (
    <div className="w-full">

      {/* ── HERO ─────────────────────────────────────────────────────── */}
      <section className="container mx-auto px-6 lg:px-12 pt-12 pb-0">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center lg:h-[82vh] min-h-[640px]">

          {/* LEFT — copy */}
          <div className="lg:col-span-5 flex flex-col justify-center order-2 lg:order-1 pb-12 lg:pb-0">
            <div className="inline-flex items-center gap-2 border border-border rounded-full px-4 py-1.5 text-[11px] tracking-widest uppercase text-foreground/55 mb-8 self-start">
              <span className="w-1.5 h-1.5 rounded-full bg-accent/70 flex-shrink-0" />
              Regula Humanitatis · Est. MCM
            </div>
            <h1 className="font-serif text-5xl md:text-6xl lg:text-[64px] xl:text-[72px] text-foreground leading-[1.06] mb-6">
              Un rifugio per il<br />
              <em className="not-italic" style={{ color: "hsl(var(--accent))" }}>custode</em>{" "}
              moderno.
            </h1>
            <p className="text-[15px] text-muted-foreground font-light leading-relaxed max-w-[440px] mb-8">
              1500 anni di saggezza monastica tradotti in un cammino di
              leadership contemplativa e rigenerazione interiore. Inizia
              in silenzio.
            </p>
            <div className="flex items-center gap-5 mb-8">
              <Link
                href="/la-chiamata"
                className="bg-primary text-primary-foreground text-[11px] uppercase tracking-[0.18em] font-medium px-7 py-3.5 rounded-full hover:bg-primary/85 transition-colors"
              >
                Ascolta la Chiamata
              </Link>
              <Link href="/piani" className="text-[13px] text-foreground/60 hover:text-foreground transition-colors">
                Vedi i Piani →
              </Link>
            </div>
            <div className="flex items-center gap-2.5">
              <div className="flex items-center gap-0.5">
                {[0,1,2,3,4].map((i) => (
                  <svg key={i} viewBox="0 0 16 16" className="w-4 h-4" style={{ color: "hsl(var(--accent))" }} fill="currentColor">
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
              <div className="rounded-3xl overflow-hidden aspect-[4/5] lg:aspect-[3/4] w-full max-h-[68vh]">
                <img
                  src={`${B}benedictine-monk.jpg`}
                  alt="Monaco benedettino in preghiera"
                  className="w-full h-full object-cover object-center"
                  style={{ filter: "brightness(0.92) contrast(1.06) saturate(0.72) sepia(0.28)" }}
                />
              </div>
              {/* LAUDS card — top left */}
              <div className="absolute -left-4 md:-left-10 top-8 bg-white rounded-2xl shadow-lg shadow-black/8 px-4 py-3 min-w-[160px]">
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="w-6 h-6 rounded-full bg-background border border-border/60 flex items-center justify-center flex-shrink-0">
                    <svg viewBox="0 0 22 22" fill="none" className="w-3 h-3 text-foreground/40">
                      <path d="M11 19V11M11 11C11 11 7.5 8 7 4.5C6.6 2.2 8.5 1 11 1C13.5 1 15.4 2.2 15 4.5C14.5 8 11 11 11 11Z" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                    </svg>
                  </div>
                  <span className="text-[9px] uppercase tracking-[0.2em] text-muted-foreground font-medium">Lauds · 6 min</span>
                </div>
                <p className="font-serif text-[15px] text-foreground italic mb-2">Silentium</p>
                <div className="h-1 bg-border rounded-full overflow-hidden">
                  <div className="h-full w-2/5 rounded-full" style={{ background: "hsl(var(--accent) / 0.5)" }} />
                </div>
              </div>
              {/* LECTIO DIVINA card — bottom right */}
              <div className="absolute -right-4 md:-right-8 bottom-10 bg-white rounded-2xl shadow-lg shadow-black/8 px-4 py-4 max-w-[220px]">
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
      <section className="container mx-auto px-6 lg:px-12 pb-20">
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

      {/* ── MANUSCRIPT + QUOTE ───────────────────────────────────────── */}
      <section className="container mx-auto px-6 lg:px-12 py-20">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* Left — circular manuscript photo + floating card */}
          <div className="relative flex justify-center">
            <div className="relative">
              <div className="w-72 h-72 md:w-96 md:h-96 rounded-full overflow-hidden">
                <img
                  src={`${B}manuscript-hours.jpg`}
                  alt="Manoscritto illuminato"
                  className="w-full h-full object-cover"
                  style={{ filter: "brightness(0.9) contrast(1.08) saturate(0.80) sepia(0.22)" }}
                />
              </div>
              {/* Floating label card */}
              <div className="absolute -bottom-4 right-4 md:right-0 bg-white rounded-2xl shadow-md shadow-black/8 px-5 py-3">
                <p className="text-[9px] uppercase tracking-[0.2em] text-muted-foreground mb-0.5">· Prologo ·</p>
                <p className="font-serif text-[14px] text-foreground">Regula Sancti Benedicti</p>
              </div>
            </div>
          </div>

          {/* Right — quote */}
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-6">
              Capitulum Primum
            </p>
            <blockquote className="font-serif text-3xl md:text-4xl lg:text-[44px] text-foreground italic leading-tight mb-8">
              «Ascolta, o figlio, i precetti del maestro, e inclina l'orecchio del tuo cuore.»
            </blockquote>
            <p className="text-[11px] uppercase tracking-[0.25em] text-muted-foreground/70">
              — San Benedetto da Norcia · ca. 530 d.C.
            </p>
          </div>
        </div>
      </section>

      {/* ── TRE SOGLIE ───────────────────────────────────────────────── */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-6">
              · Il Cammino ·
            </p>
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-foreground leading-tight mb-5">
              Tre soglie da <em className="not-italic" style={{ color: "hsl(var(--accent))" }}>attraversare</em>.
            </h2>
            <p className="text-[15px] text-muted-foreground font-light max-w-xl mx-auto">
              Prima della Regola, riconosciamo dove abita la fatica del custode contemporaneo.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {[
              {
                num: "I",
                title: "Disconnessione",
                body: "Le organizzazioni crescono, ma il senso di appartenenza svanisce. Il leader moderno è spesso un custode solitario.",
              },
              {
                num: "II",
                title: "Esaurimento",
                body: "Il ritmo della performance senza il ritmo del riposo porta al vuoto. L'azione senza contemplazione è cieca.",
              },
              {
                num: "III",
                title: "Frammentazione",
                body: "Informazioni ovunque, saggezza rara. Manca uno spazio dove ricostruire l'unità della persona.",
              },
            ].map((item) => (
              <div key={item.num} className="bg-card border border-border/50 rounded-2xl p-7 shadow-sm">
                <div className="flex items-start justify-between mb-5">
                  <span className="font-serif text-4xl italic text-foreground/30">{item.num}</span>
                  <span className="text-[9px] uppercase tracking-[0.2em] text-muted-foreground border border-border/60 rounded-full px-3 py-1">
                    Capitulum
                  </span>
                </div>
                <h3 className="font-serif text-xl text-foreground mb-3">{item.title}</h3>
                <p className="text-[13px] text-muted-foreground font-light leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── LA REGOLA — Non è un corso ───────────────────────────────── */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">

            {/* Left — text + checklist */}
            <div>
              <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-6">
                · La Regola ·
              </p>
              <h2 className="font-serif text-4xl md:text-5xl text-foreground leading-tight mb-6">
                Non è un corso.<br />
                È un{" "}
                <em className="not-italic" style={{ color: "hsl(var(--accent))" }}>cammino</em>.
              </h2>
              <p className="text-[15px] text-muted-foreground font-light leading-relaxed mb-10 max-w-[420px]">
                Unisciti a una comunità di pellegrini e custodi che hanno
                scelto di guidare partendo dal silenzio.
              </p>
              <div className="space-y-5">
                {[
                  { title: "Liturgia delle ore", body: "Sette momenti al giorno per ritornare al respiro." },
                  { title: "Lectio personale",   body: "Un testo sacro alla settimana. Lentamente." },
                  { title: "Capitolo comunitario", body: "Una volta al mese con gli altri custodi del percorso." },
                ].map((item) => (
                  <div key={item.title} className="flex gap-4">
                    <div className="w-5 h-5 rounded-full border border-border/60 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg viewBox="0 0 12 12" className="w-3 h-3" style={{ color: "hsl(var(--accent))" }} fill="none">
                        <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-[14px] font-medium text-foreground mb-0.5">{item.title}</p>
                      <p className="text-[13px] text-muted-foreground font-light">{item.body}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — circular monks photo */}
            <div className="flex justify-center lg:justify-end">
              <div className="w-80 h-80 md:w-[420px] md:h-[420px] rounded-full overflow-hidden">
                <img
                  src={`${B}hero-cloister.png`}
                  alt="Monaci in cammino"
                  className="w-full h-full object-cover"
                  style={{ filter: "brightness(0.88) contrast(1.08) saturate(0.78) sepia(0.20)" }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SCRIPTORIUM ──────────────────────────────────────────────── */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">

            {/* Left — text */}
            <div>
              <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-6">
                · Scriptorium ·
              </p>
              <h2 className="font-serif text-4xl md:text-5xl text-foreground leading-tight mb-6">
                I testi del{" "}
                <em className="not-italic" style={{ color: "hsl(var(--accent))" }}>cammino</em>.
              </h2>
              <p className="text-[15px] text-muted-foreground font-light leading-relaxed mb-8 max-w-[380px]">
                14 fonti certificate, dalla Regola di San Benedetto a Thomas
                Merton. Ogni autore è reale. Ogni testo è verificato.
              </p>
              <Link
                href="/scriptorium"
                className="text-[11px] uppercase tracking-widest text-foreground/60 hover:text-foreground transition-colors border-b border-border hover:border-foreground/40 pb-0.5"
              >
                Entra nello Scriptorium →
              </Link>
            </div>

            {/* Right — cloister image + floating card */}
            <div className="relative flex justify-center lg:justify-end">
              <div className="relative max-w-[440px] w-full">
                <div className="rounded-2xl overflow-hidden aspect-[4/3]">
                  <img
                    src={`${B}ancient-library.png`}
                    alt="Chiostro dello Scriptorium"
                    className="w-full h-full object-cover object-center"
                    style={{ filter: "brightness(0.85) contrast(1.08) saturate(0.80) sepia(0.16)" }}
                  />
                </div>
                {/* Floating author card */}
                <div className="absolute -bottom-5 left-4 bg-white rounded-2xl shadow-lg shadow-black/8 px-5 py-3.5 flex items-center gap-4">
                  <div>
                    <p className="text-[9px] uppercase tracking-[0.2em] text-muted-foreground mb-0.5">XIV Testi</p>
                    <p className="font-serif text-[14px] text-foreground italic">Voci verificate</p>
                  </div>
                  <div className="flex items-center">
                    {["B", "M", "G", "T"].map((l, i) => (
                      <div
                        key={l}
                        className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-medium text-primary-foreground border-2 border-white"
                        style={{
                          background: "hsl(var(--primary))",
                          marginLeft: i === 0 ? 0 : -8,
                          zIndex: 4 - i,
                          position: "relative",
                        }}
                      >
                        {l}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── MASSIMO FOLADOR ──────────────────────────────────────────── */}
      <section className="py-24 bg-card border-y border-border/60">
        <div className="container mx-auto px-6 lg:px-12 max-w-5xl">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">

            {/* Left — quote */}
            <div>
              <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-6">
                · Il Metodo ·
              </p>
              <blockquote className="font-serif text-2xl md:text-3xl text-foreground italic leading-snug mb-8">
                "Benedetto non ha scritto un trattato di management.
                Ha scritto una Regola per vivere. Che sia diventata
                anche un manuale per guidare dice qualcosa di profondo
                sulla natura del lavoro umano."
              </blockquote>
              <p className="text-[11px] uppercase tracking-[0.25em] text-muted-foreground/50 mb-10">
                — Massimo Folador · L'Organizzazione Perfetta
              </p>
              <Link
                href="/regula-operis"
                className="text-[11px] uppercase tracking-widest text-foreground/60 hover:text-foreground transition-colors border-b border-border hover:border-foreground/40 pb-0.5"
              >
                Scopri la Regula Operis →
              </Link>
            </div>

            {/* Right — bio card */}
            <div className="bg-background rounded-3xl border border-border/60 shadow-sm p-8 md:p-10">
              <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-5">
                Chi è Massimo Folador
              </p>
              <p className="text-[15px] text-muted-foreground font-light leading-relaxed mb-6">
                Massimo Folador ha scoperto nella Regola di Benedetto — scritta
                attorno al 530 d.C. — il più antico manuale di management
                occidentale. Non una metafora spirituale: un metodo concreto
                per governare comunità complesse.
              </p>
              <p className="text-[15px] text-muted-foreground font-light leading-relaxed mb-8">
                Ogni modulo traduce uno dei pilastri benedettini in una pratica
                settimanale incarnata. Non letture, non teorie: esercizi che
                cambiano il modo di guidare.
              </p>
              <div className="space-y-2.5">
                {[
                  { lat: "Ausculta",      it: "Ascolta prima di decidere"           },
                  { lat: "Stabilitas",    it: "Rimani radicato quando tutto accelera" },
                  { lat: "Hospitalitas",  it: "Accogli ogni ospite come Cristo"      },
                  { lat: "Ora et Labora", it: "Alterna contemplazione e azione"      },
                  { lat: "Communitas",    it: "Guida al servizio, non al comando"    },
                ].map(({ lat, it }) => (
                  <div key={lat} className="flex items-baseline gap-3">
                    <span className="font-serif text-[13px] italic text-foreground/70 min-w-[110px]">{lat}</span>
                    <span className="text-[12px] text-muted-foreground font-light">{it}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ────────────────────────────────────────────────── */}
      <section className="py-12 px-6 lg:px-12 pb-24">
        <div className="container mx-auto max-w-5xl">
          <div
            className="rounded-3xl px-8 py-20 text-center"
            style={{
              background: "linear-gradient(135deg, hsl(25 60% 88%) 0%, hsl(33 70% 82%) 50%, hsl(20 50% 78%) 100%)",
            }}
          >
            <p className="text-[10px] uppercase tracking-[0.3em] text-foreground/55 mb-6">
              · Ora et Labora ·
            </p>
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-foreground leading-tight mb-6">
              Il silenzio è il punto<br />
              di{" "}
              <em className="not-italic" style={{ color: "hsl(var(--accent))" }}>partenza</em>.
            </h2>
            <p className="text-[15px] text-foreground/60 font-light mb-10">
              Inizia gratuitamente. Nessuna carta di credito richiesta.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
              <Link
                href="/registrazione"
                className="bg-primary text-primary-foreground text-[11px] uppercase tracking-[0.18em] font-medium px-9 py-4 rounded-full hover:bg-primary/85 transition-colors"
              >
                Inizia il Cammino
              </Link>
              <Link href="/contatti" className="text-[13px] text-foreground/60 hover:text-foreground transition-colors">
                Parla con un mentore →
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
