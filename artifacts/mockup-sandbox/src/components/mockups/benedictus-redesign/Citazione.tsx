const D = "https://cab0d778-6425-4a99-ac55-dd2f35aef268-00-1t61zyqaqdg8q.janeway.replit.dev/benedictus";

/* Sezione 2 — Manoscritto circolare + citazione Ausculta + intro Tre Soglie */
export function Citazione() {
  return (
    <div style={{ fontFamily: "'Inter', sans-serif", background: "#F7EFE2", color: "#1C0B03", minHeight: "100vh" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400;1,600&family=Inter:wght@300;400;500&display=swap');
        .ci-serif { font-family: 'Cormorant Garamond', serif; }
      `}</style>

      {/* ── MANUSCRIPT + QUOTE ── */}
      <section style={{ padding: "80px 64px", maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }}>

          {/* Left — circular manuscript */}
          <div style={{ position: "relative", display: "flex", justifyContent: "center" }}>
            <div style={{ position: "relative" }}>
              <div style={{ width: 360, height: 360, borderRadius: "50%", overflow: "hidden" }}>
                <img
                  src={`${D}/manuscript-hours.jpg`}
                  alt="Manoscritto illuminato"
                  style={{ width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.9) contrast(1.08) saturate(0.78) sepia(0.22)" }}
                />
              </div>
              {/* Floating card */}
              <div style={{
                position: "absolute", bottom: -16, right: -16,
                background: "#fff", borderRadius: 16, padding: "12px 20px",
                boxShadow: "0 4px 24px rgba(0,0,0,0.09)",
              }}>
                <p style={{ fontSize: 9, letterSpacing: "0.2em", textTransform: "uppercase", color: "#7A6050", marginBottom: 4 }}>· Prologo ·</p>
                <p className="ci-serif" style={{ fontSize: 14, color: "#1C0B03" }}>Regula Sancti Benedicti</p>
              </div>
            </div>
          </div>

          {/* Right — quote */}
          <div>
            <p style={{ fontSize: 10, letterSpacing: "0.28em", textTransform: "uppercase", color: "#7A6050", marginBottom: 24 }}>
              Capitulum Primum
            </p>
            <blockquote className="ci-serif" style={{
              fontSize: 42, fontStyle: "italic", lineHeight: 1.18,
              color: "#1C0B03", marginBottom: 28,
            }}>
              «Ascolta, o figlio, i precetti del maestro, e inclina l'orecchio del tuo cuore.»
            </blockquote>
            <p style={{ fontSize: 11, letterSpacing: "0.22em", textTransform: "uppercase", color: "#7A6050" }}>
              — San Benedetto da Norcia · ca. 530 d.C.
            </p>
          </div>
        </div>
      </section>

      {/* ── INTRO TRE SOGLIE ── */}
      <section style={{ padding: "60px 64px 80px", maxWidth: 1100, margin: "0 auto", textAlign: "center" }}>
        <p style={{ fontSize: 10, letterSpacing: "0.28em", textTransform: "uppercase", color: "#7A6050", marginBottom: 20 }}>
          · Il Cammino ·
        </p>
        <h2 className="ci-serif" style={{ fontSize: 64, lineHeight: 1.1, color: "#1C0B03", marginBottom: 16 }}>
          Tre soglie da <em style={{ fontStyle: "italic", color: "#A8591C" }}>attraversare</em>.
        </h2>
        <p style={{ fontSize: 16, color: "#7A6050", fontWeight: 300, lineHeight: 1.65, maxWidth: 520, margin: "0 auto" }}>
          Prima della Regola, riconosciamo dove abita la fatica del custode contemporaneo.
        </p>
      </section>
    </div>
  );
}

export default Citazione;
