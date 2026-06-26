export function SacroChiaro() {
  return (
    <div style={{ fontFamily: "'Inter', sans-serif", background: "#EDE4D2", color: "#1C1008", minHeight: "100vh", overflowX: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400;1,500&family=Cinzel:wght@400;500;600&family=Inter:wght@300;400;500&display=swap');
        .sc-body { font-family: 'Inter', sans-serif; }
        .sc-serif { font-family: 'Cormorant Garamond', serif; }
        .sc-display { font-family: 'Cinzel', serif; }
      `}</style>

      {/* NAV */}
      <nav className="sc-body" style={{
        position: "sticky", top: 0, zIndex: 50,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 48px", height: "60px",
        background: "rgba(237,228,210,0.95)",
        backdropFilter: "blur(10px)",
        borderBottom: "1px solid rgba(100,70,40,0.14)"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "48px" }}>
          <span className="sc-display" style={{ fontSize: "13px", letterSpacing: "0.22em", color: "#1C1008" }}>BENEDICTVS</span>
          {["La Regola", "Liturgia", "Percorso", "Piani"].map(item => (
            <span key={item} className="sc-body" style={{ fontSize: "11px", color: "#6B4F35", letterSpacing: "0.12em", textTransform: "uppercase", cursor: "pointer" }}>{item}</span>
          ))}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <span className="sc-body" style={{ fontSize: "11px", color: "#6B4F35", letterSpacing: "0.1em", textTransform: "uppercase", cursor: "pointer" }}>Accedi</span>
          <div className="sc-display" style={{
            background: "#1C1008", color: "#EDE4D2", padding: "10px 24px",
            fontSize: "10px", letterSpacing: "0.18em", cursor: "pointer"
          }}>
            INIZIA
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ position: "relative", minHeight: "90vh", display: "flex", alignItems: "center", overflow: "hidden" }}>
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "url('https://images.unsplash.com/photo-1608503396790-26a0c3ee3f1c?w=1400&auto=format&fit=crop&q=60')",
          backgroundSize: "cover", backgroundPosition: "center 30%",
          filter: "saturate(0.5) sepia(0.3) brightness(0.9)"
        }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, rgba(237,228,210,0.88) 0%, rgba(237,228,210,0.5) 55%, rgba(237,228,210,0.1) 100%)" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, #EDE4D2 0%, transparent 40%)" }} />

        <div style={{ position: "relative", zIndex: 10, maxWidth: "1100px", margin: "0 auto", padding: "0 48px" }}>
          <p className="sc-display" style={{ fontSize: "9px", letterSpacing: "0.55em", color: "#9A7248", marginBottom: "24px", textTransform: "uppercase" }}>
            Regula Humanitatis
          </p>
          <h1 className="sc-serif" style={{ fontSize: "clamp(56px, 7.5vw, 100px)", fontWeight: 300, lineHeight: 1.08, marginBottom: "32px", color: "#1C1008" }}>
            Un rifugio per<br />
            il{" "}
            <span style={{
              display: "inline-block",
              borderBottom: "2px solid #C4954A",
              paddingBottom: "2px",
              color: "#7A4E1A"
            }}>custode</span>
            <br />moderno.
          </h1>
          <p className="sc-body" style={{ fontSize: "17px", lineHeight: 1.75, color: "#5A3E22", maxWidth: "440px", marginBottom: "44px", fontWeight: 300 }}>
            1500 anni di saggezza monastica tradotti in un cammino
            di leadership contemplativa e rigenerazione interiore.
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
            <div className="sc-display" style={{
              background: "#1C1008", color: "#EDE4D2",
              padding: "16px 40px",
              fontSize: "10px", letterSpacing: "0.22em", cursor: "pointer",
              textTransform: "uppercase"
            }}>
              Ascolta la Chiamata
            </div>
            <span className="sc-body" style={{ fontSize: "12px", color: "#9A7248", cursor: "pointer", letterSpacing: "0.08em", borderBottom: "1px solid rgba(154,114,72,0.4)", paddingBottom: "2px" }}>
              Vedi i piani →
            </span>
          </div>
        </div>
      </section>

      {/* VERSE BAND */}
      <section style={{
        padding: "64px 48px", background: "#1C1008",
        display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center"
      }}>
        <div style={{ width: "1px", height: "40px", background: "rgba(196,149,74,0.4)", marginBottom: "28px" }} />
        <p className="sc-display" style={{ fontSize: "9px", letterSpacing: "0.5em", color: "#C4954A", marginBottom: "20px", textTransform: "uppercase" }}>
          Regula Benedicti · Prologo
        </p>
        <blockquote className="sc-serif" style={{ fontSize: "clamp(26px, 3.5vw, 40px)", fontWeight: 300, fontStyle: "italic", color: "#EDE4D2", maxWidth: "640px", lineHeight: 1.55 }}>
          "Ascolta, figlio, i precetti del maestro<br />e piega l'orecchio del tuo cuore."
        </blockquote>
        <div style={{ width: "1px", height: "40px", background: "rgba(196,149,74,0.4)", marginTop: "28px" }} />
      </section>

      {/* PILLARS */}
      <section style={{ padding: "80px 48px", background: "#EDE4D2", maxWidth: "1100px", margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: "20px", marginBottom: "56px" }}>
          <h2 className="sc-serif" style={{ fontSize: "clamp(36px, 5vw, 52px)", fontWeight: 300, color: "#1C1008" }}>
            Il cammino
          </h2>
          <p className="sc-display" style={{ fontSize: "9px", letterSpacing: "0.4em", color: "#9A7248", textTransform: "uppercase" }}>
            Sette pilastri
          </p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1px", background: "rgba(100,70,40,0.15)" }}>
          {[
            { n: "I", t: "Ora et Labora", d: "Preghiera e lavoro come ritmo sacro della giornata" },
            { n: "II", t: "Lectio Divina", d: "La lettura contemplativa della Scrittura come nutrimento" },
            { n: "III", t: "Silenzio", d: "Lo spazio interiore dove la sapienza trova voce" },
            { n: "IV", t: "Stabilitas", d: "Il radicamento che rende possibile la crescita" },
            { n: "V", t: "Conversatio", d: "La trasformazione continua come impegno di vita" },
            { n: "VI", t: "Oboedientia", d: "L'ascolto profondo come via alla libertà interiore" },
          ].map(({ n, t, d }) => (
            <div key={n} style={{
              background: "#EDE4D2", padding: "40px 32px",
            }}>
              <div className="sc-display" style={{ fontSize: "9px", letterSpacing: "0.4em", color: "#C4954A", marginBottom: "14px" }}>{n}</div>
              <h3 className="sc-serif" style={{ fontSize: "26px", fontWeight: 400, marginBottom: "10px", color: "#1C1008" }}>{t}</h3>
              <p className="sc-body" style={{ fontSize: "13px", lineHeight: 1.7, color: "#6B4F35", fontWeight: 300 }}>{d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: "80px 48px", background: "#D4C4A8", textAlign: "center" }}>
        <div style={{ width: "40px", height: "1px", background: "#C4954A", margin: "0 auto 28px" }} />
        <p className="sc-display" style={{ fontSize: "9px", letterSpacing: "0.5em", color: "#9A7248", marginBottom: "20px", textTransform: "uppercase" }}>
          Inizia oggi
        </p>
        <h2 className="sc-serif" style={{ fontSize: "clamp(32px, 4.5vw, 54px)", fontWeight: 300, color: "#1C1008", marginBottom: "16px" }}>
          Il monastero è dove<br /><em style={{ fontStyle: "italic", color: "#7A4E1A" }}>decidi di costruirlo.</em>
        </h2>
        <p className="sc-body" style={{ fontSize: "15px", color: "#6B4F35", marginBottom: "40px", fontWeight: 300 }}>
          30 giorni di pratica guidata per iniziare.
        </p>
        <div className="sc-display" style={{
          display: "inline-block", background: "#1C1008", color: "#EDE4D2",
          padding: "16px 44px",
          fontSize: "10px", letterSpacing: "0.22em", cursor: "pointer",
          textTransform: "uppercase"
        }}>
          Scopri i piani
        </div>
      </section>
    </div>
  );
}
