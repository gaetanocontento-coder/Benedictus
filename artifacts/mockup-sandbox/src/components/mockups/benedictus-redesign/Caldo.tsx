const D = "https://cab0d778-6425-4a99-ac55-dd2f35aef268-00-1t61zyqaqdg8q.janeway.replit.dev/benedictus";

export function Caldo() {
  return (
    <div style={{ fontFamily: "'Inter', sans-serif", background: "#fff", color: "#1A0D05", minHeight: "100vh", overflowX: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400;1,500&family=Cinzel:wght@400;500&family=Inter:wght@300;400;500&display=swap');
        .ca-serif { font-family: 'Cormorant Garamond', serif; }
        .ca-display { font-family: 'Cinzel', serif; }
      `}</style>

      {/* ── NAV — bianco vetro ── */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 50,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 56px", height: "64px",
        background: "rgba(255,255,255,0.94)",
        backdropFilter: "blur(14px)",
        borderBottom: "1px solid rgba(139,100,60,0.1)"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "44px" }}>
          <span className="ca-display" style={{ fontSize: "13px", letterSpacing: "0.2em", color: "#1A0D05" }}>BENEDICTVS</span>
          {["La Regola", "Liturgia", "Percorso", "Piani"].map(item => (
            <span key={item} style={{ fontSize: "13px", color: "#7A5C3A", cursor: "pointer" }}>{item}</span>
          ))}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <span style={{ fontSize: "13px", color: "#7A5C3A", cursor: "pointer" }}>Accedi</span>
          <div style={{ background: "#1A0D05", color: "#fff", padding: "11px 26px", borderRadius: "100px", fontSize: "13px", cursor: "pointer" }}>
            Inizia il cammino
          </div>
        </div>
      </nav>

      {/* ── HERO — chiostro full-bleed ── */}
      <section style={{ position: "relative", height: "92vh", overflow: "hidden" }}>
        <img
          src={`${D}/hero-cloister.png`}
          alt="Chiostro monastico"
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 35%", filter: "brightness(1.05) contrast(1.02) saturate(0.85)" }}
        />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(105deg, rgba(255,255,255,0.80) 0%, rgba(255,255,255,0.30) 50%, rgba(0,0,0,0.10) 100%)" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(255,255,255,0.95) 0%, transparent 32%)" }} />

        <div style={{ position: "relative", zIndex: 10, height: "100%", display: "flex", alignItems: "center", padding: "0 56px", maxWidth: "1140px", margin: "0 auto" }}>
          <div>
            <p className="ca-display" style={{ fontSize: "9px", letterSpacing: "0.55em", color: "#9A7248", marginBottom: "22px" }}>
              REGULA HUMANITATIS · EST. MCM
            </p>
            <h1 className="ca-serif" style={{ fontSize: "clamp(58px, 7.5vw, 108px)", fontWeight: 300, lineHeight: 1.06, marginBottom: "28px", color: "#1A0D05" }}>
              Un rifugio per<br />
              il <em style={{ fontStyle: "italic", color: "#8B5A1E" }}>custode</em><br />
              moderno.
            </h1>
            <p style={{ fontSize: "17px", lineHeight: 1.75, color: "#5C3D1E", maxWidth: "430px", marginBottom: "40px", fontWeight: 300 }}>
              1500 anni di saggezza monastica tradotti in un cammino di leadership contemplativa e rigenerazione interiore.
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
              <div style={{ background: "#1A0D05", color: "#fff", padding: "16px 38px", borderRadius: "100px", fontSize: "13px", cursor: "pointer" }}>
                Ascolta la Chiamata
              </div>
              <span style={{ fontSize: "13px", color: "#8B6240", cursor: "pointer" }}>Scopri i piani →</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── VERSE — bianco puro ── */}
      <section style={{ padding: "88px 56px", background: "#fff", textAlign: "center" }}>
        <p className="ca-display" style={{ fontSize: "9px", letterSpacing: "0.5em", color: "#9A7248", marginBottom: "20px" }}>
          REGULA BENEDICTI · PROLOGO
        </p>
        <blockquote className="ca-serif" style={{ fontSize: "clamp(28px, 4vw, 46px)", fontWeight: 300, fontStyle: "italic", color: "#1A0D05", maxWidth: "680px", margin: "0 auto", lineHeight: 1.5 }}>
          "Ascolta, figlio, i precetti del maestro<br />e piega l'orecchio del tuo cuore."
        </blockquote>
        <div style={{ width: "40px", height: "2px", background: "#C4954A", margin: "32px auto 0" }} />
      </section>

      {/* ── PHOTO CARDS — tre pilastri monastici ── */}
      <section style={{ padding: "0 56px 80px", background: "#fff", maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px" }}>
          {[
            { img: `${D}/stone-corridor.png`,   label: "ORA ET LABORA",  title: "Preghiera e lavoro", desc: "Il ritmo sacro che tiene unita la vita interiore e quella operosa." },
            { img: `${D}/monk-manuscript.png`,  label: "LECTIO DIVINA",  title: "La parola viva",     desc: "Ogni mattino, un passo nella Scrittura come lampada ai piedi." },
            { img: `${D}/ancient-library.png`,  label: "SILENZIO",        title: "L'ascolto profondo", desc: "Lo spazio interiore dove la sapienza smette di essere parola." },
          ].map(({ img, label, title, desc }) => (
            <div key={label} style={{ borderRadius: "3px", overflow: "hidden" }}>
              <div style={{ position: "relative", height: "280px" }}>
                <img src={img} alt={title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(10,5,2,0.88) 0%, transparent 55%)" }} />
                <div style={{ position: "absolute", bottom: "22px", left: "22px" }}>
                  <p className="ca-display" style={{ fontSize: "8px", letterSpacing: "0.4em", color: "#C4954A", marginBottom: "6px" }}>{label}</p>
                  <h3 className="ca-serif" style={{ fontSize: "26px", fontWeight: 300, color: "#fff" }}>{title}</h3>
                </div>
              </div>
              <div style={{ padding: "22px 22px 28px", background: "#1A0D05" }}>
                <p style={{ fontSize: "13px", lineHeight: 1.7, color: "#B09070", fontWeight: 300 }}>{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── STONE CORRIDOR — CTA full-bleed ── */}
      <section style={{ position: "relative", height: "460px", overflow: "hidden" }}>
        <img src={`${D}/stone-corridor.png`} alt="Corridoio monastico" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.55) saturate(0.7)" }} />
        <div style={{ position: "absolute", inset: 0, background: "rgba(10,5,2,0.45)" }} />
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "40px" }}>
          <p className="ca-display" style={{ fontSize: "9px", letterSpacing: "0.5em", color: "#C4954A", marginBottom: "20px" }}>INIZIA OGGI</p>
          <h2 className="ca-serif" style={{ fontSize: "clamp(34px, 5vw, 62px)", fontWeight: 300, color: "#fff", marginBottom: "20px" }}>
            Il monastero è dove<br /><em style={{ fontStyle: "italic", color: "#C4954A" }}>decidi di costruirlo.</em>
          </h2>
          <p style={{ fontSize: "15px", color: "rgba(255,255,255,0.65)", marginBottom: "36px", fontWeight: 300 }}>30 giorni di pratica guidata per iniziare.</p>
          <div style={{ background: "#fff", color: "#1A0D05", padding: "16px 44px", borderRadius: "100px", fontSize: "13px", cursor: "pointer" }}>
            Scopri i piani
          </div>
        </div>
      </section>

      {/* ── PIANI — bianco ── */}
      <section style={{ padding: "88px 56px", background: "#fff" }}>
        <p className="ca-display" style={{ fontSize: "9px", letterSpacing: "0.5em", color: "#9A7248", textAlign: "center", marginBottom: "12px" }}>I PIANI</p>
        <h2 className="ca-serif" style={{ fontSize: "clamp(32px, 4vw, 50px)", fontWeight: 300, textAlign: "center", marginBottom: "52px", color: "#1A0D05" }}>
          Scegli il tuo cammino
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px", maxWidth: "980px", margin: "0 auto" }}>
          {[
            { name: "Oblato",  price: "9",  desc: "Liturgia del giorno, lectio divina, meditazioni quotidiane" },
            { name: "Monaco",  price: "29", desc: "Tutto Oblato + esercizi ignaziani, percorso guidato, Padre Benedetto AI", accent: true },
            { name: "Priore",  price: "89", desc: "Tutto Monaco + sessioni mensili con un padre spirituale reale" },
          ].map(({ name, price, desc, accent }) => (
            <div key={name} style={{
              border: accent ? "2px solid #1A0D05" : "1px solid rgba(139,100,60,0.18)",
              padding: "36px 28px", background: accent ? "#1A0D05" : "#fff",
              color: accent ? "#EDE0C8" : "#1A0D05"
            }}>
              <p className="ca-display" style={{ fontSize: "9px", letterSpacing: "0.4em", color: accent ? "#C4954A" : "#9A7248", marginBottom: "16px" }}>{name.toUpperCase()}</p>
              <div className="ca-serif" style={{ fontSize: "48px", fontWeight: 300, marginBottom: "4px" }}>€{price}</div>
              <p style={{ fontSize: "11px", color: accent ? "#B09070" : "#9A7248", marginBottom: "20px" }}>/mese</p>
              <p style={{ fontSize: "13px", lineHeight: 1.7, color: accent ? "#C8B090" : "#6B4F35", fontWeight: 300 }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── MONK MANUSCRIPT — citazione bianco ── */}
      <section style={{ padding: "0", background: "#fff" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
          <div style={{ position: "relative", minHeight: "440px", overflow: "hidden" }}>
            <img src={`${D}/monk-manuscript.png`} alt="Monaco con manoscritto" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
          </div>
          <div style={{ padding: "72px 56px", display: "flex", flexDirection: "column", justifyContent: "center", background: "#F9F5EE" }}>
            <p className="ca-display" style={{ fontSize: "9px", letterSpacing: "0.45em", color: "#9A7248", marginBottom: "24px" }}>PADRE BENEDETTO AI</p>
            <h3 className="ca-serif" style={{ fontSize: "clamp(28px, 3.5vw, 42px)", fontWeight: 300, color: "#1A0D05", marginBottom: "20px", lineHeight: 1.35 }}>
              Una guida spirituale<br /><em style={{ color: "#8B5A1E" }}>sempre disponibile.</em>
            </h3>
            <p style={{ fontSize: "15px", lineHeight: 1.75, color: "#5C3D1E", fontWeight: 300 }}>
              Padre Benedetto risponde alle tue domande sulla Scrittura, ti accompagna nella meditazione e custodisce il tuo cammino spirituale quotidiano.
            </p>
            <div style={{ marginTop: "32px", display: "inline-flex" }}>
              <div style={{ background: "#1A0D05", color: "#fff", padding: "14px 32px", borderRadius: "100px", fontSize: "13px", cursor: "pointer" }}>
                Incontra il Padre
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER — bianco ── */}
      <footer style={{ padding: "48px 56px", background: "#fff", borderTop: "1px solid rgba(139,100,60,0.12)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span className="ca-display" style={{ fontSize: "12px", letterSpacing: "0.2em", color: "#1A0D05" }}>BENEDICTVS</span>
        <span style={{ fontSize: "12px", color: "#9A7248" }}>Regula Humanitatis · Est. MCM</span>
      </footer>
    </div>
  );
}
