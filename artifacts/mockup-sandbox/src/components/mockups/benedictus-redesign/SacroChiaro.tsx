const D = "https://cab0d778-6425-4a99-ac55-dd2f35aef268-00-1t61zyqaqdg8q.janeway.replit.dev/benedictus";

/* ─────────────────────────────────────────────────────────────────────────────
   VARIANTE B — SACRO CHIARO
   Stessa struttura UX di Caldo ma identità più austera:
   • Cinzel come font display dappertutto (uppercase monastico)
   • Bottoni rettangolari (no pill)
   • Griglia foto asimmetrica (1 grande + 2 piccole)
   • Linee oro come elemento ornamentale invece di badge pill
───────────────────────────────────────────────────────────────────────────── */
export function SacroChiaro() {
  return (
    <div style={{ fontFamily: "'Inter', sans-serif", background: "#0D0804", color: "#fff", minHeight: "100vh", overflowX: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400;1,600&family=Cinzel:wght@400;500;600;700&family=Inter:wght@300;400;500&display=swap');
        .sc-serif  { font-family: 'Cormorant Garamond', serif; }
        .sc-display{ font-family: 'Cinzel', serif; }
      `}</style>

      {/* ══ HERO FULL-BLEED — identico al riferimento Lovable ════════════════ */}
      <section style={{ position: "relative", height: "100vh", overflow: "hidden" }}>

        {/* Foto monastica full-bleed */}
        <img
          src={`${D}/hero-cloister.png`}
          alt="Chiostro benedettino"
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 40%" }}
        />
        {/* Overlay scuro cinematico */}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(8,4,2,0.58) 0%, rgba(6,3,1,0.35) 42%, rgba(10,5,2,0.76) 100%)" }} />

        {/* ── NAV TRASPARENTE ── */}
        <nav style={{
          position: "absolute", top: 0, left: 0, right: 0, zIndex: 10,
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "0 52px", height: "68px"
        }}>
          <a href="#" style={{ textDecoration: "none" }}>
            <span className="sc-display" style={{
              fontSize: "14px", fontWeight: 700,
              letterSpacing: "0.30em", color: "#fff",
              userSelect: "none", lineHeight: 1
            }}>BENEDICTVS</span>
          </a>
          <div style={{ display: "flex", gap: "28px" }}>
            {["Chi siamo", "La Regola", "Liturgia", "Lectio", "Scriptorium", "Percorso", "Piani"].map(v => (
              <a key={v} className="sc-display" href="#" style={{ fontSize: "9px", fontWeight: 500, letterSpacing: "0.15em", color: "rgba(255,255,255,0.78)", textDecoration: "none" }}>{v.toUpperCase()}</a>
            ))}
          </div>
          <a href="#" className="sc-display" style={{ fontSize: "9px", letterSpacing: "0.18em", color: "rgba(255,255,255,0.78)", textDecoration: "none" }}>ACCEDI</a>
        </nav>

        {/* ── TESTO CENTRATO ── */}
        <div style={{
          position: "absolute", inset: 0, zIndex: 5,
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
          textAlign: "center", padding: "0 48px"
        }}>
          {/* Ornamento linea + eyebrow */}
          <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "28px" }}>
            <div style={{ width: "36px", height: "1px", background: "#C4954A" }} />
            <span className="sc-display" style={{ fontSize: "8px", letterSpacing: "0.55em", color: "#C4954A" }}>REGULA HUMANITATIS &nbsp;/&nbsp; EST. MCM</span>
            <div style={{ width: "36px", height: "1px", background: "#C4954A" }} />
          </div>

          <h1 className="sc-serif" style={{
            fontSize: "clamp(52px, 7.5vw, 100px)",
            fontWeight: 400, lineHeight: 1.08,
            color: "#fff", marginBottom: "22px",
            textShadow: "0 2px 32px rgba(0,0,0,0.4)"
          }}>
            Un rifugio per<br />
            il <em style={{ fontStyle: "italic", color: "#D4A96A" }}>custode</em> moderno.
          </h1>

          <p style={{
            fontSize: "16px", lineHeight: 1.72, color: "rgba(255,255,255,0.68)",
            maxWidth: "500px", fontWeight: 300
          }}>
            1500 anni di saggezza monastica tradotti in un cammino di leadership contemplativa, silenzio e rigenerazione interiore.
          </p>

          {/* CTA rettangolari — identità SacroChiaro */}
          <div style={{ display: "flex", gap: "12px", marginTop: "44px" }}>
            <a href="#" className="sc-display" style={{
              background: "#C4954A", color: "#0D0804",
              padding: "15px 36px",
              fontSize: "9px", fontWeight: 700, letterSpacing: "0.2em", textDecoration: "none"
            }}>INIZIA IL CAMMINO</a>
            <a href="#" className="sc-display" style={{
              background: "transparent", color: "#fff",
              padding: "14px 36px",
              fontSize: "9px", fontWeight: 500, letterSpacing: "0.2em", textDecoration: "none",
              border: "1px solid rgba(255,255,255,0.38)"
            }}>VEDI I PIANI</a>
          </div>
        </div>

        {/* Scroll indicator */}
        <div style={{ position: "absolute", bottom: "32px", left: "50%", transform: "translateX(-50%)", zIndex: 5 }}>
          <div style={{ width: "1px", height: "40px", background: "rgba(196,149,74,0.55)" }} />
        </div>
      </section>

      {/* ══ PILLARS NUMERICI ═══════════════════════════════════════════════════ */}
      <section style={{ background: "#fff", padding: "72px 52px", borderBottom: "1px solid rgba(100,70,40,0.1)" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1px 1fr 1px 1fr", gap: "0" }}>
          {[
            { n: "1500", u: "anni", l: "di saggezza monastica" },
            { n: "7",    u: "pilastri", l: "della vita ordinata" },
            { n: "3",    u: "livelli", l: "di pratica guidata" },
          ].map(({ n, u, l }, i) => (
            <>
              <div key={n} style={{ textAlign: "center", padding: "32px 24px" }}>
                <div className="sc-serif" style={{ fontSize: "64px", fontWeight: 400, color: "#1C1008", lineHeight: 1 }}>{n}</div>
                <div className="sc-display" style={{ fontSize: "8px", letterSpacing: "0.45em", color: "#C4954A", margin: "10px 0 6px" }}>{u.toUpperCase()}</div>
                <div style={{ fontSize: "13px", color: "#5C3D1E", fontWeight: 400 }}>{l}</div>
              </div>
              {i < 2 && <div key={`div-${i}`} style={{ background: "rgba(100,70,40,0.12)", width: "1px" }} />}
            </>
          ))}
        </div>
      </section>

      {/* ══ MANOSCRITTO — split Farnese Hours ════════════════════════════════ */}
      {/* Testo a sx su crema, miniatura illuminata a dx — testo sempre leggibile */}
      <section style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
        <div style={{ padding: "72px 60px", background: "#F8F3E8", display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "24px" }}>
            <div style={{ width: "28px", height: "1px", background: "#C4954A" }} />
            <p className="sc-display" style={{ fontSize: "9px", letterSpacing: "0.45em", color: "#9A7248" }}>LA TRADIZIONE SCRITTA</p>
          </div>
          <h3 className="sc-serif" style={{ fontSize: "clamp(28px, 3.5vw, 44px)", fontWeight: 400, color: "#1C1008", marginBottom: "20px", lineHeight: 1.35 }}>
            Ogni parola copiata<br /><em style={{ color: "#7A4E1A" }}>a mano per mille anni.</em>
          </h3>
          <p style={{ fontSize: "16px", lineHeight: 1.78, color: "#4A2E12", fontWeight: 400, marginBottom: "12px" }}>
            I monaci amanuensi custodivano il sapere dell'umanità trascrivendo pagina per pagina le Scritture e i testi dei Padri.
          </p>
          <p style={{ fontSize: "16px", lineHeight: 1.78, color: "#4A2E12", fontWeight: 400 }}>
            Oggi quella stessa cura paziente si traduce nel tuo cammino quotidiano di lectio e meditazione.
          </p>
        </div>
        <div style={{ overflow: "hidden", minHeight: "440px" }}>
          <img
            src={`${D}/manuscript-farnese.jpg`}
            alt="Farnese Hours — miniatura illuminata"
            style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top", display: "block" }}
          />
        </div>
      </section>

      {/* ══ LIBRO APERTO — Book of Hours panoramico ══════════════════════════ */}
      <section style={{ position: "relative", overflow: "hidden", height: "320px" }}>
        <img
          src={`${D}/manuscript-hours.jpg`}
          alt="Book of Hours aperto"
          style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 30%", display: "block" }}
        />
        <div style={{ position: "absolute", inset: 0, background: "rgba(28,16,8,0.52)" }} />
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center" }}>
          <div style={{ width: "1px", height: "32px", background: "rgba(196,149,74,0.7)", marginBottom: "20px" }} />
          <p className="sc-display" style={{ fontSize: "9px", letterSpacing: "0.5em", color: "#C4954A", marginBottom: "16px" }}>REGULA BENEDICTI · CAP. XLVIII</p>
          <blockquote className="sc-serif" style={{ fontSize: "clamp(22px, 3vw, 36px)", fontWeight: 400, fontStyle: "italic", color: "#fff", maxWidth: "680px", lineHeight: 1.5 }}>
            "L'ozio è il nemico dell'anima; perciò i fratelli devono occuparsi a certi momenti nel lavoro delle mani."
          </blockquote>
        </div>
      </section>

      {/* ══ CITAZIONE — crema ══════════════════════════════════════════════════ */}
      <section style={{ background: "#F8F3E8", padding: "80px 52px", textAlign: "center" }}>
        <div style={{ width: "1px", height: "52px", background: "#C4954A", margin: "0 auto 28px" }} />
        <p className="sc-display" style={{ fontSize: "9px", letterSpacing: "0.5em", color: "#9A7248", marginBottom: "24px" }}>
          REGULA BENEDICTI · PROLOGO
        </p>
        <blockquote className="sc-serif" style={{
          fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 400, fontStyle: "italic",
          color: "#1C1008", maxWidth: "680px", margin: "0 auto 24px", lineHeight: 1.5
        }}>
          "Ascolta, figlio, i precetti del maestro<br />e piega l'orecchio del tuo cuore."
        </blockquote>
        <div style={{ width: "1px", height: "52px", background: "#C4954A", margin: "24px auto 0" }} />
      </section>

      {/* ══ GRIGLIA FOTO ASIMMETRICA — sezione scura ══════════════════════════ */}
      <section style={{ background: "#1C1008", padding: "72px 52px" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: "40px" }}>
            <div>
              <p className="sc-display" style={{ fontSize: "9px", letterSpacing: "0.45em", color: "#C4954A", marginBottom: "10px" }}>IL CAMMINO</p>
              <h2 className="sc-serif" style={{ fontSize: "clamp(32px, 4vw, 50px)", fontWeight: 400, color: "#EDE0C8" }}>Le pratiche quotidiane</h2>
            </div>
            <a href="#" className="sc-display" style={{ fontSize: "9px", letterSpacing: "0.15em", color: "#9A7248", textDecoration: "none" }}>VEDI TUTTO →</a>
          </div>

          {/* 1 grande + 2 piccole (asimmetrica come editoriale monastico) */}
          <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr 1fr", gap: "12px" }}>
            {/* Card grande — manoscritto monastico */}
            <div style={{ background: "#2A1508", borderRadius: "4px", overflow: "hidden", gridRow: "1 / 3" }}>
              <div style={{ height: "300px", overflow: "hidden" }}>
                <img src={`${D}/manuscript-monastery-books.jpg`} alt="Libri nel monastero" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
              </div>
              <div style={{ padding: "24px 24px 28px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
                  <div style={{ width: "20px", height: "1px", background: "#C4954A" }} />
                  <span className="sc-display" style={{ fontSize: "8px", letterSpacing: "0.4em", color: "#C4954A" }}>ORA ET LABORA</span>
                </div>
                <h3 className="sc-serif" style={{ fontSize: "26px", fontWeight: 400, color: "#EDE0C8", marginBottom: "10px" }}>Preghiera e lavoro</h3>
                <p style={{ fontSize: "14px", lineHeight: 1.7, color: "#D0B888", fontWeight: 400 }}>
                  Il ritmo sacro che tiene unita la vita interiore e quella operosa. Ogni ora ha il suo nome e la sua preghiera.
                </p>
              </div>
            </div>

            {/* Due card piccole */}
            {[
              { img: `${D}/monk-manuscript.png`, tag: "LECTIO DIVINA", title: "La parola viva",     sub: "20 min · ogni mattino" },
              { img: `${D}/ancient-library.png`, tag: "SILENZIO",      title: "L'ascolto profondo", sub: "10 min · ogni sera"    },
            ].map(({ img, tag, title, sub }) => (
              <div key={tag} style={{ background: "#2A1508", borderRadius: "4px", overflow: "hidden" }}>
                <div style={{ height: "180px", overflow: "hidden" }}>
                  <img src={img} alt={title} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                </div>
                <div style={{ padding: "18px 20px 22px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
                    <div style={{ width: "14px", height: "1px", background: "#C4954A" }} />
                    <span className="sc-display" style={{ fontSize: "7px", letterSpacing: "0.38em", color: "#C4954A" }}>{tag}</span>
                  </div>
                  <h3 className="sc-serif" style={{ fontSize: "22px", fontWeight: 400, color: "#EDE0C8", marginBottom: "6px" }}>{title}</h3>
                  <p style={{ fontSize: "12px", color: "#C4A87A", fontWeight: 400 }}>{sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ SPLIT — monaco / testo ═════════════════════════════════════════════ */}
      <section style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
        <div style={{ overflow: "hidden", minHeight: "480px" }}>
          <img src={`${D}/monk-manuscript.png`} alt="Monaco" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
        </div>
        <div style={{ padding: "72px 60px", background: "#F8F3E8", display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "24px" }}>
            <div style={{ width: "28px", height: "1px", background: "#C4954A" }} />
            <p className="sc-display" style={{ fontSize: "9px", letterSpacing: "0.45em", color: "#9A7248" }}>PADRE BENEDETTO AI</p>
          </div>
          <h3 className="sc-serif" style={{ fontSize: "clamp(28px, 3.5vw, 44px)", fontWeight: 400, color: "#1C1008", marginBottom: "20px", lineHeight: 1.35 }}>
            Una guida spirituale<br /><em style={{ color: "#7A4E1A" }}>sempre presente.</em>
          </h3>
          <p style={{ fontSize: "16px", lineHeight: 1.78, color: "#5C3D1E", fontWeight: 400, marginBottom: "36px" }}>
            Padre Benedetto risponde alle tue domande, ti accompagna nella meditazione quotidiana e custodisce il tuo cammino spirituale — 24 ore su 24.
          </p>
          <a href="#" className="sc-display" style={{
            display: "inline-block", alignSelf: "flex-start",
            background: "#1C1008", color: "#fff",
            padding: "14px 32px", fontSize: "9px", letterSpacing: "0.18em",
            textDecoration: "none"
          }}>INCONTRA IL PADRE →</a>
        </div>
      </section>

      {/* ══ PIANI ══════════════════════════════════════════════════════════════ */}
      <section style={{ background: "#fff", padding: "80px 52px" }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "16px", marginBottom: "12px" }}>
            <div style={{ width: "30px", height: "1px", background: "#C4954A" }} />
            <p className="sc-display" style={{ fontSize: "9px", letterSpacing: "0.5em", color: "#9A7248" }}>I PIANI</p>
            <div style={{ width: "30px", height: "1px", background: "#C4954A" }} />
          </div>
          <h2 className="sc-serif" style={{ fontSize: "clamp(32px, 4vw, 52px)", fontWeight: 400, textAlign: "center", marginBottom: "52px", color: "#1C1008" }}>
            Scegli il tuo cammino
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "2px", background: "rgba(100,70,40,0.1)", borderRadius: "4px", overflow: "hidden" }}>
            {[
              { name: "Oblato",  price: "9",  desc: "Liturgia giornaliera, Lectio Divina, meditazioni quotidiane.", features: ["Liturgia giornaliera", "Lectio Divina", "Preghiera guidata"], dark: false },
              { name: "Monaco",  price: "29", desc: "Tutto Oblato + Padre Benedetto AI, percorso a 40 settimane.", features: ["Tutto Oblato", "Padre Benedetto AI", "Esercizi ignaziani", "Percorso 40 settimane"], dark: true },
              { name: "Priore",  price: "89", desc: "Tutto Monaco + sessioni mensili con un padre spirituale reale.", features: ["Tutto Monaco", "2 sessioni/mese", "Accesso prioritario"], dark: false },
            ].map(({ name, price, desc, features, dark }) => (
              <div key={name} style={{ padding: "40px 32px", background: dark ? "#1C1008" : "#fff" }}>
                <p className="sc-display" style={{ fontSize: "8px", letterSpacing: "0.4em", color: "#C4954A", marginBottom: "20px" }}>{name.toUpperCase()}</p>
                <div className="sc-serif" style={{ fontSize: "52px", fontWeight: 400, color: dark ? "#EDE0C8" : "#1C1008", lineHeight: 1, marginBottom: "4px" }}>€{price}</div>
                <p style={{ fontSize: "11px", color: dark ? "#9A7A5A" : "#9A7248", marginBottom: "18px" }}>/mese · annuale</p>
                <p style={{ fontSize: "13px", lineHeight: 1.65, color: dark ? "#D8C4A0" : "#3A1F08", fontWeight: 400, marginBottom: "24px" }}>{desc}</p>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "28px" }}>
                  {features.map(f => (
                    <div key={f} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <div style={{ width: "14px", height: "1px", background: dark ? "#C4954A" : "#9A7248", flexShrink: 0 }} />
                      <span style={{ fontSize: "12px", color: dark ? "#D8C4A0" : "#3A1F08", fontWeight: 400 }}>{f}</span>
                    </div>
                  ))}
                </div>
                <a href="#" className="sc-display" style={{
                  display: "block", textAlign: "center",
                  background: dark ? "#fff" : "#1C1008",
                  color: dark ? "#1C1008" : "#fff",
                  padding: "13px 0", fontSize: "9px", letterSpacing: "0.18em",
                  textDecoration: "none"
                }}>INIZIA CON {name.toUpperCase()}</a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ CTA FINALE — overlay pesante su foto ════════════════════════════════ */}
      <section style={{ position: "relative", overflow: "hidden" }}>
        <img src={`${D}/ancient-library.png`} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", filter: "saturate(0.35) brightness(0.3)" }} />
        <div style={{ position: "absolute", inset: 0, background: "rgba(10,5,2,0.68)" }} />
        <div style={{ position: "relative", zIndex: 2, padding: "88px 52px", textAlign: "center" }}>
          <div style={{ width: "1px", height: "40px", background: "rgba(196,149,74,0.6)", margin: "0 auto 28px" }} />
          <p className="sc-display" style={{ fontSize: "9px", letterSpacing: "0.55em", color: "#C4954A", marginBottom: "24px" }}>INIZIA OGGI</p>
          <h2 className="sc-serif" style={{ fontSize: "clamp(36px, 5vw, 64px)", fontWeight: 400, color: "#fff", marginBottom: "20px" }}>
            Il monastero è dove<br /><em style={{ color: "#C4954A" }}>decidi di costruirlo.</em>
          </h2>
          <p style={{ fontSize: "16px", color: "rgba(255,255,255,0.88)", marginBottom: "40px", fontWeight: 400 }}>30 giorni di pratica guidata per cominciare.</p>
          <a href="#" className="sc-display" style={{
            display: "inline-block", background: "#fff", color: "#1C1008",
            padding: "17px 48px", fontSize: "9px", letterSpacing: "0.22em", textDecoration: "none"
          }}>SCOPRI I PIANI</a>
        </div>
      </section>

      {/* ══ FOOTER ════════════════════════════════════════════════════════════ */}
      <footer style={{ background: "#fff", padding: "40px 52px", borderTop: "1px solid rgba(100,70,40,0.1)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <svg width="10" height="14" viewBox="0 0 10 14" fill="none">
            <rect x="4" y="0" width="2" height="14" fill="#C4954A" />
            <rect x="0" y="4" width="10" height="2" fill="#C4954A" />
          </svg>
          <span className="sc-display" style={{ fontSize: "11px", letterSpacing: "0.22em", color: "#1C1008" }}>BENEDICTVS</span>
        </div>
        <div style={{ display: "flex", gap: "32px" }}>
          {["Privacy", "Termini", "Contatti"].map(v => <a key={v} href="#" className="sc-display" style={{ fontSize: "9px", letterSpacing: "0.1em", color: "#9A7248", textDecoration: "none" }}>{v.toUpperCase()}</a>)}
        </div>
        <div style={{ textAlign: "right" }}>
          <div className="sc-display" style={{ fontSize: "9px", letterSpacing: "0.15em", color: "#C4A875" }}>REGULA HUMANITATIS · EST. MCM</div>
          <div className="sc-display" style={{ fontSize: "8px", letterSpacing: "0.1em", color: "#C4A875", opacity: 0.6, marginTop: "4px" }}>Made in Never Before Italia</div>
        </div>
      </footer>
    </div>
  );
}
