const D = "https://cab0d778-6425-4a99-ac55-dd2f35aef268-00-1t61zyqaqdg8q.janeway.replit.dev/benedictus";

export function SacroChiaro() {
  return (
    <div style={{ fontFamily: "'Inter', sans-serif", background: "#ffffff", color: "#1C1008", minHeight: "100vh", overflowX: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400;1,500&family=Cinzel:wght@400;500;600&family=Inter:wght@300;400;500&display=swap');
        .sc-serif { font-family: 'Cormorant Garamond', serif; }
        .sc-display { font-family: 'Cinzel', serif; }
      `}</style>

      {/* ── NAV — bianco + croce oro ── */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 50,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 56px", height: "64px",
        background: "rgba(255,255,255,0.96)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(100,70,40,0.1)"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <svg width="14" height="20" viewBox="0 0 14 20" fill="none">
            <rect x="6" y="0" width="2" height="20" fill="#C4954A" />
            <rect x="1" y="6" width="12" height="2" fill="#C4954A" />
          </svg>
          <span className="sc-display" style={{ fontSize: "13px", letterSpacing: "0.22em", color: "#1C1008" }}>BENEDICTVS</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "40px" }}>
          {["La Regola", "Liturgia", "Percorso", "Piani"].map(item => (
            <span key={item} className="sc-display" style={{ fontSize: "9px", letterSpacing: "0.2em", color: "#6B4F35", cursor: "pointer", textTransform: "uppercase" }}>{item}</span>
          ))}
          <div className="sc-display" style={{ background: "#1C1008", color: "#fff", padding: "11px 24px", fontSize: "9px", letterSpacing: "0.18em", cursor: "pointer" }}>
            INIZIA
          </div>
        </div>
      </nav>

      {/* ── HERO — chiostro con testo sovrapposto ── */}
      <section style={{ position: "relative", height: "94vh", overflow: "hidden" }}>
        <img
          src={`${D}/hero-cloister.png`}
          alt="Chiostro benedettino"
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 35%", filter: "saturate(0.78) contrast(1.04)" }}
        />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, rgba(255,255,255,0.82) 0%, rgba(255,255,255,0.38) 52%, rgba(255,255,255,0.04) 100%)" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(255,255,255,0.95) 0%, transparent 28%)" }} />

        <div style={{ position: "relative", zIndex: 10, height: "100%", display: "flex", alignItems: "center", padding: "0 56px", maxWidth: "1160px", margin: "0 auto" }}>
          <div>
            <p className="sc-display" style={{ fontSize: "9px", letterSpacing: "0.6em", color: "#9A7248", marginBottom: "24px" }}>
              REGULA HUMANITATIS
            </p>
            <h1 className="sc-serif" style={{ fontSize: "clamp(56px, 7.5vw, 106px)", fontWeight: 300, lineHeight: 1.06, marginBottom: "30px", color: "#1C1008" }}>
              Un rifugio per<br />
              il{" "}
              <span style={{ borderBottom: "3px solid #C4954A", paddingBottom: "3px", color: "#6B3A10" }}>custode</span>
              <br />moderno.
            </h1>
            <p style={{ fontSize: "17px", lineHeight: 1.78, color: "#5C3D1E", maxWidth: "420px", marginBottom: "44px", fontWeight: 300 }}>
              1500 anni di saggezza monastica tradotti in un cammino di leadership contemplativa e rigenerazione interiore.
            </p>
            <div style={{ display: "flex", gap: "18px", alignItems: "center" }}>
              <div className="sc-display" style={{ background: "#1C1008", color: "#fff", padding: "16px 40px", fontSize: "9px", letterSpacing: "0.2em", cursor: "pointer" }}>
                ASCOLTA LA CHIAMATA
              </div>
              <span style={{ fontSize: "13px", color: "#9A7248", cursor: "pointer", borderBottom: "1px solid rgba(154,114,72,0.4)", paddingBottom: "2px" }}>Vedi i piani →</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── VERSE — bianco con linea oro ── */}
      <section style={{ padding: "80px 56px", background: "#fff" }}>
        <div style={{ maxWidth: "720px", margin: "0 auto", textAlign: "center" }}>
          <div style={{ width: "1px", height: "48px", background: "#C4954A", margin: "0 auto 28px" }} />
          <p className="sc-display" style={{ fontSize: "9px", letterSpacing: "0.5em", color: "#9A7248", marginBottom: "24px" }}>REGULA BENEDICTI · PROLOGO</p>
          <blockquote className="sc-serif" style={{ fontSize: "clamp(26px, 3.5vw, 42px)", fontWeight: 300, fontStyle: "italic", color: "#1C1008", lineHeight: 1.55 }}>
            "Ascolta, figlio, i precetti del maestro<br />e piega l'orecchio del tuo cuore."
          </blockquote>
          <div style={{ width: "1px", height: "48px", background: "#C4954A", margin: "28px auto 0" }} />
        </div>
      </section>

      {/* ── PHOTO GRID ASIMMETRICA ── */}
      <section style={{ background: "#fff", maxWidth: "1200px", margin: "0 auto", padding: "0 56px 88px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1.35fr 1fr 1fr", gap: "4px" }}>
          {/* Grande a sinistra — stone corridor */}
          <div style={{ position: "relative", overflow: "hidden", gridRow: "1 / 3" }}>
            <img
              src={`${D}/stone-corridor.png`}
              alt="Corridoio monastico"
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", minHeight: "500px" }}
            />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(10,5,2,0.86) 0%, transparent 50%)" }} />
            <div style={{ position: "absolute", bottom: "30px", left: "28px", right: "20px" }}>
              <p className="sc-display" style={{ fontSize: "8px", letterSpacing: "0.4em", color: "#C4954A", marginBottom: "10px" }}>ORA ET LABORA</p>
              <h3 className="sc-serif" style={{ fontSize: "30px", fontWeight: 300, color: "#fff", marginBottom: "12px" }}>Preghiera e lavoro</h3>
              <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.65)", lineHeight: 1.65, fontWeight: 300 }}>Il ritmo sacro che tiene unita la vita interiore e quella operosa della giornata benedettina.</p>
            </div>
          </div>

          {/* monk-manuscript */}
          <div style={{ position: "relative", overflow: "hidden", minHeight: "246px" }}>
            <img src={`${D}/monk-manuscript.png`} alt="Monaco con manoscritto" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(10,5,2,0.84) 0%, transparent 55%)" }} />
            <div style={{ position: "absolute", bottom: "20px", left: "20px", right: "12px" }}>
              <p className="sc-display" style={{ fontSize: "7px", letterSpacing: "0.38em", color: "#C4954A", marginBottom: "6px" }}>LECTIO DIVINA</p>
              <h3 className="sc-serif" style={{ fontSize: "22px", fontWeight: 300, color: "#fff" }}>La parola viva</h3>
            </div>
          </div>

          {/* ancient-library */}
          <div style={{ position: "relative", overflow: "hidden", minHeight: "246px" }}>
            <img src={`${D}/ancient-library.png`} alt="Biblioteca antica" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(10,5,2,0.84) 0%, transparent 55%)" }} />
            <div style={{ position: "absolute", bottom: "20px", left: "20px", right: "12px" }}>
              <p className="sc-display" style={{ fontSize: "7px", letterSpacing: "0.38em", color: "#C4954A", marginBottom: "6px" }}>SILENZIO</p>
              <h3 className="sc-serif" style={{ fontSize: "22px", fontWeight: 300, color: "#fff" }}>L'ascolto profondo</h3>
            </div>
          </div>
        </div>
      </section>

      {/* ── SPLIT — HERO CLOISTER + TESTO ── */}
      <section style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
        <div style={{ position: "relative", overflow: "hidden", minHeight: "460px" }}>
          <img src={`${D}/hero-cloister.png`} alt="Chiostro" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", filter: "saturate(0.7)" }} />
        </div>
        <div style={{ padding: "72px 60px", background: "#F8F4ED", display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <p className="sc-display" style={{ fontSize: "9px", letterSpacing: "0.45em", color: "#9A7248", marginBottom: "24px" }}>PADRE BENEDETTO AI</p>
          <h3 className="sc-serif" style={{ fontSize: "clamp(26px, 3.5vw, 42px)", fontWeight: 300, color: "#1C1008", marginBottom: "20px", lineHeight: 1.38 }}>
            Una guida spirituale<br /><em style={{ color: "#7A4E1A" }}>sempre presente.</em>
          </h3>
          <p style={{ fontSize: "15px", lineHeight: 1.78, color: "#5C3D1E", fontWeight: 300 }}>
            Padre Benedetto risponde alle tue domande sulla Scrittura, ti accompagna nella meditazione e custodisce il tuo cammino spirituale quotidiano.
          </p>
          <div className="sc-display" style={{ marginTop: "36px", display: "inline-block", width: "fit-content", background: "#1C1008", color: "#fff", padding: "14px 34px", fontSize: "9px", letterSpacing: "0.18em", cursor: "pointer" }}>
            INCONTRA IL PADRE
          </div>
        </div>
      </section>

      {/* ── CTA — ancient-library ── */}
      <section style={{ position: "relative", height: "420px", overflow: "hidden" }}>
        <img src={`${D}/ancient-library.png`} alt="Biblioteca monastica" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.5) saturate(0.6)" }} />
        <div style={{ position: "absolute", inset: 0, background: "rgba(10,5,2,0.42)" }} />
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center" }}>
          <div style={{ width: "1px", height: "36px", background: "rgba(196,149,74,0.6)", marginBottom: "24px" }} />
          <p className="sc-display" style={{ fontSize: "9px", letterSpacing: "0.55em", color: "#C4954A", marginBottom: "20px" }}>INIZIA OGGI</p>
          <h2 className="sc-serif" style={{ fontSize: "clamp(32px, 4.5vw, 58px)", fontWeight: 300, color: "#fff", marginBottom: "20px" }}>
            Il monastero è dove<br /><em style={{ fontStyle: "italic", color: "#C4954A" }}>decidi di costruirlo.</em>
          </h2>
          <p style={{ fontSize: "15px", color: "rgba(255,255,255,0.6)", marginBottom: "36px", fontWeight: 300 }}>30 giorni di pratica guidata per iniziare.</p>
          <div className="sc-display" style={{ background: "#fff", color: "#1C1008", padding: "15px 44px", fontSize: "9px", letterSpacing: "0.22em", cursor: "pointer" }}>
            SCOPRI I PIANI
          </div>
        </div>
      </section>

      {/* ── PIANI — bianco ── */}
      <section style={{ padding: "88px 56px", background: "#fff" }}>
        <p className="sc-display" style={{ fontSize: "9px", letterSpacing: "0.5em", color: "#9A7248", textAlign: "center", marginBottom: "12px" }}>I PIANI</p>
        <h2 className="sc-serif" style={{ fontSize: "clamp(32px, 4vw, 50px)", fontWeight: 300, textAlign: "center", marginBottom: "52px", color: "#1C1008" }}>Scegli il tuo cammino</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "2px", maxWidth: "960px", margin: "0 auto", background: "rgba(100,70,40,0.12)" }}>
          {[
            { name: "Oblato",  price: "9",  desc: "Liturgia, lectio divina, meditazioni quotidiane", gold: false },
            { name: "Monaco",  price: "29", desc: "Tutto Oblato + esercizi ignaziani e Padre Benedetto AI", gold: true },
            { name: "Priore",  price: "89", desc: "Tutto Monaco + sessioni con un padre spirituale reale", gold: false },
          ].map(({ name, price, desc, gold }) => (
            <div key={name} style={{ padding: "40px 32px", background: gold ? "#1C1008" : "#fff" }}>
              <p className="sc-display" style={{ fontSize: "8px", letterSpacing: "0.4em", color: "#C4954A", marginBottom: "20px" }}>{name.toUpperCase()}</p>
              <div className="sc-serif" style={{ fontSize: "52px", fontWeight: 300, color: gold ? "#EDE0C8" : "#1C1008", marginBottom: "4px" }}>€{price}</div>
              <p style={{ fontSize: "11px", color: gold ? "#9A7A5A" : "#9A7248", marginBottom: "20px" }}>/mese</p>
              <p style={{ fontSize: "13px", lineHeight: 1.72, color: gold ? "#C8B090" : "#6B4F35", fontWeight: 300 }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ padding: "48px 56px", background: "#fff", borderTop: "1px solid rgba(100,70,40,0.12)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <svg width="10" height="14" viewBox="0 0 10 14" fill="none">
            <rect x="4" y="0" width="2" height="14" fill="#C4954A" />
            <rect x="0" y="4" width="10" height="2" fill="#C4954A" />
          </svg>
          <span className="sc-display" style={{ fontSize: "12px", letterSpacing: "0.2em", color: "#1C1008" }}>BENEDICTVS</span>
        </div>
        <span style={{ fontSize: "12px", color: "#9A7248" }}>Regula Humanitatis · Est. MCM</span>
      </footer>
    </div>
  );
}
