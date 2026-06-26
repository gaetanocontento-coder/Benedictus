export function Caldo() {
  return (
    <div style={{ fontFamily: "'Georgia', serif", background: "#F4EDE0", color: "#1A0D05", minHeight: "100vh", overflowX: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400;1,500&family=Cinzel:wght@400;500&family=Inter:wght@300;400;500&display=swap');
        .caldo-body { font-family: 'Inter', sans-serif; }
        .caldo-serif { font-family: 'Cormorant Garamond', serif; }
        .caldo-display { font-family: 'Cinzel', serif; }
      `}</style>

      {/* NAV */}
      <nav className="caldo-body" style={{
        position: "sticky", top: 0, zIndex: 50,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "18px 48px",
        background: "rgba(244, 237, 224, 0.92)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(139,100,60,0.12)"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "40px" }}>
          <span className="caldo-display" style={{ fontSize: "14px", letterSpacing: "0.15em", color: "#1A0D05" }}>BENEDICTVS</span>
          {["La Regola", "Liturgia", "Percorso", "Piani"].map(item => (
            <span key={item} style={{ fontSize: "13px", color: "#6B4F35", letterSpacing: "0.02em", cursor: "pointer" }}>{item}</span>
          ))}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <span style={{ fontSize: "13px", color: "#6B4F35", cursor: "pointer" }}>Accedi</span>
          <div style={{
            background: "#2D1A08", color: "#F4EDE0", padding: "10px 22px",
            borderRadius: "100px", fontSize: "13px", cursor: "pointer"
          }}>
            Inizia il cammino
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ position: "relative", minHeight: "92vh", display: "flex", alignItems: "center", overflow: "hidden" }}>
        {/* Warm sandy background with gradient */}
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(135deg, #D4A96A 0%, #C18B45 30%, #A0714F 60%, #7B5035 100%)",
          opacity: 0.22
        }} />
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "url('https://images.unsplash.com/photo-1504610926078-a1611febcad3?w=1400&auto=format&fit=crop&q=60')",
          backgroundSize: "cover", backgroundPosition: "center",
          opacity: 0.35
        }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, rgba(244,237,224,0.6) 0%, rgba(244,237,224,0.1) 60%)" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, #F4EDE0 0%, transparent 35%)" }} />

        <div style={{ position: "relative", zIndex: 10, maxWidth: "1100px", margin: "0 auto", padding: "0 48px" }}>
          <p className="caldo-display" style={{ fontSize: "10px", letterSpacing: "0.45em", color: "#8B6240", marginBottom: "20px", textTransform: "uppercase" }}>
            Regula Humanitatis · Est. MCM
          </p>
          <h1 className="caldo-serif" style={{ fontSize: "clamp(60px, 8vw, 110px)", fontWeight: 300, lineHeight: 1.05, marginBottom: "28px", color: "#1A0D05" }}>
            Un rifugio per<br />
            il <em style={{ fontStyle: "italic", color: "#8B5E2E" }}>custode</em><br />
            moderno.
          </h1>
          <p className="caldo-body" style={{ fontSize: "18px", lineHeight: 1.7, color: "#5A3E28", maxWidth: "480px", marginBottom: "40px", fontWeight: 300 }}>
            1500 anni di saggezza monastica tradotti in un cammino
            di leadership contemplativa e rigenerazione interiore.
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
            <div style={{
              background: "#2D1A08", color: "#F4EDE0",
              padding: "16px 36px", borderRadius: "100px",
              fontSize: "13px", letterSpacing: "0.08em", cursor: "pointer"
            }}>
              Ascolta la Chiamata
            </div>
            <span className="caldo-body" style={{ fontSize: "13px", color: "#8B6240", cursor: "pointer", letterSpacing: "0.05em" }}>
              Vedi i piani →
            </span>
          </div>
        </div>
      </section>

      {/* VERSE */}
      <section style={{ padding: "80px 48px", background: "#EDE0C8", textAlign: "center" }}>
        <p className="caldo-display" style={{ fontSize: "10px", letterSpacing: "0.4em", color: "#8B6240", marginBottom: "20px", textTransform: "uppercase" }}>
          Dalla Regola di San Benedetto
        </p>
        <blockquote className="caldo-serif" style={{ fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 300, fontStyle: "italic", color: "#2D1A08", maxWidth: "700px", margin: "0 auto", lineHeight: 1.5 }}>
          "Ascolta, figlio, i precetti del maestro<br />e piega l'orecchio del tuo cuore."
        </blockquote>
      </section>

      {/* FEATURES GRID */}
      <section style={{ padding: "80px 48px", background: "#F4EDE0", maxWidth: "1100px", margin: "0 auto" }}>
        <p className="caldo-display" style={{ fontSize: "10px", letterSpacing: "0.4em", color: "#8B6240", marginBottom: "12px", textTransform: "uppercase", textAlign: "center" }}>
          Il cammino
        </p>
        <h2 className="caldo-serif" style={{ fontSize: "clamp(36px, 5vw, 56px)", fontWeight: 300, textAlign: "center", marginBottom: "56px", color: "#1A0D05" }}>
          Sette pilastri della<br /><em style={{ fontStyle: "italic", color: "#8B5E2E" }}>vita ordinata</em>
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px" }}>
          {[
            { n: "I", t: "Ora et Labora", d: "Preghiera e lavoro come ritmo sacro della giornata" },
            { n: "II", t: "Lectio Divina", d: "La lettura contemplativa della Scrittura come nutrimento" },
            { n: "III", t: "Silenzio", d: "Lo spazio interiore dove la sapienza trova voce" },
            { n: "IV", t: "Stabilitas", d: "Il radicamento che rende possibile la crescita" },
            { n: "V", t: "Conversatio", d: "La trasformazione continua come impegno di vita" },
            { n: "VI", t: "Oboedientia", d: "L'ascolto profondo come via alla libertà interiore" },
          ].map(({ n, t, d }) => (
            <div key={n} style={{
              background: "#2D1A08", color: "#EDE0C8",
              padding: "36px 28px", borderRadius: "4px"
            }}>
              <div className="caldo-display" style={{ fontSize: "10px", letterSpacing: "0.35em", color: "#C4954A", marginBottom: "12px" }}>{n}</div>
              <h3 className="caldo-serif" style={{ fontSize: "24px", fontWeight: 400, marginBottom: "10px", color: "#EDE0C8" }}>{t}</h3>
              <p className="caldo-body" style={{ fontSize: "13px", lineHeight: 1.65, color: "#B09070", fontWeight: 300 }}>{d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: "80px 48px", background: "#2D1A08", textAlign: "center" }}>
        <p className="caldo-display" style={{ fontSize: "10px", letterSpacing: "0.4em", color: "#C4954A", marginBottom: "20px", textTransform: "uppercase" }}>
          Inizia oggi
        </p>
        <h2 className="caldo-serif" style={{ fontSize: "clamp(36px, 5vw, 60px)", fontWeight: 300, color: "#EDE0C8", marginBottom: "16px" }}>
          Il monastero è dove<br /><em style={{ fontStyle: "italic", color: "#C4954A" }}>decidi di costruirlo.</em>
        </h2>
        <p className="caldo-body" style={{ fontSize: "16px", color: "#9A7A5A", marginBottom: "40px", fontWeight: 300 }}>
          30 giorni di pratica guidata per iniziare.
        </p>
        <div style={{
          display: "inline-block", background: "#F4EDE0", color: "#1A0D05",
          padding: "18px 48px", borderRadius: "100px",
          fontSize: "13px", letterSpacing: "0.08em", cursor: "pointer"
        }}>
          Scopri i piani
        </div>
      </section>
    </div>
  );
}
