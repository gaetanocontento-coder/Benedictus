const D = "https://cab0d778-6425-4a99-ac55-dd2f35aef268-00-1t61zyqaqdg8q.janeway.replit.dev/benedictus";

/* Sezione 4+5 — Scriptorium (foto + floating card autori) + CTA gradiente pesca */
export function ScriptoriumCta() {
  return (
    <div style={{ fontFamily: "'Inter', sans-serif", background: "#F7EFE2", color: "#1C0B03", minHeight: "100vh" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400;1,600&family=Inter:wght@300;400;500&display=swap');
        .sc-serif { font-family: 'Cormorant Garamond', serif; }
      `}</style>

      {/* ── SCRIPTORIUM ── */}
      <section style={{ padding: "80px 64px 60px", maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }}>

          {/* Left — text */}
          <div>
            <p style={{ fontSize: 10, letterSpacing: "0.28em", textTransform: "uppercase", color: "#7A6050", marginBottom: 24 }}>
              · Scriptorium ·
            </p>
            <h2 className="sc-serif" style={{ fontSize: 52, lineHeight: 1.1, color: "#1C0B03", marginBottom: 20 }}>
              I testi del <em style={{ fontStyle: "italic", color: "#A8591C" }}>cammino</em>.
            </h2>
            <p style={{ fontSize: 15, color: "#7A6050", fontWeight: 300, lineHeight: 1.7, maxWidth: 360, marginBottom: 28 }}>
              14 fonti certificate, dalla Regola di San Benedetto a Thomas Merton. Ogni autore è reale. Ogni testo è verificato.
            </p>
            <a href="#" style={{
              fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase",
              color: "#7A6050", borderBottom: "1px solid rgba(0,0,0,0.2)",
              paddingBottom: 2, textDecoration: "none",
            }}>
              Entra nello Scriptorium →
            </a>
          </div>

          {/* Right — cloister image + floating author card */}
          <div style={{ position: "relative" }}>
            <div style={{ borderRadius: 20, overflow: "hidden", aspectRatio: "4/3" }}>
              <img
                src={`${D}/ancient-library.png`}
                alt="Chiostro Scriptorium"
                style={{ width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.85) contrast(1.08) saturate(0.78) sepia(0.16)" }}
              />
            </div>
            {/* Floating author card */}
            <div style={{
              position: "absolute", bottom: -20, left: 16,
              background: "#fff", borderRadius: 16, padding: "12px 18px",
              boxShadow: "0 4px 24px rgba(0,0,0,0.09)",
              display: "flex", alignItems: "center", gap: 16,
            }}>
              <div>
                <p style={{ fontSize: 9, letterSpacing: "0.2em", textTransform: "uppercase", color: "#7A6050", marginBottom: 3 }}>XIV Testi</p>
                <p className="sc-serif" style={{ fontSize: 14, fontStyle: "italic", color: "#1C0B03" }}>Voci verificate</p>
              </div>
              <div style={{ display: "flex", alignItems: "center" }}>
                {["B", "M", "G", "T"].map((l, i) => (
                  <div key={l} style={{
                    width: 32, height: 32, borderRadius: "50%",
                    background: "#1C0B03", color: "#F7EFE2",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 11, fontWeight: 500,
                    border: "2px solid #F7EFE2",
                    marginLeft: i === 0 ? 0 : -8,
                    position: "relative", zIndex: 4 - i,
                  }}>{l}</div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section style={{ padding: "40px 64px 80px", maxWidth: 1100, margin: "0 auto" }}>
        <div style={{
          borderRadius: 28, padding: "80px 48px", textAlign: "center",
          background: "linear-gradient(135deg, hsl(25, 60%, 88%) 0%, hsl(33, 70%, 82%) 50%, hsl(20, 50%, 78%) 100%)",
        }}>
          <p style={{ fontSize: 10, letterSpacing: "0.28em", textTransform: "uppercase", color: "rgba(28,11,3,0.55)", marginBottom: 20 }}>
            · Ora et Labora ·
          </p>
          <h2 className="sc-serif" style={{ fontSize: 60, lineHeight: 1.1, color: "#1C0B03", marginBottom: 16 }}>
            Il silenzio è il punto<br />di <em style={{ fontStyle: "italic", color: "#A8591C" }}>partenza</em>.
          </h2>
          <p style={{ fontSize: 15, color: "rgba(28,11,3,0.60)", fontWeight: 300, marginBottom: 36 }}>
            Inizia gratuitamente. Nessuna carta di credito richiesta.
          </p>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 24 }}>
            <a href="#" style={{
              background: "#1C0B03", color: "#F7EFE2",
              fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase",
              padding: "14px 36px", borderRadius: 999, textDecoration: "none",
              fontWeight: 500,
            }}>
              Inizia il Cammino
            </a>
            <a href="#" style={{ fontSize: 13, color: "rgba(28,11,3,0.60)", textDecoration: "none" }}>
              Parla con un mentore →
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

export default ScriptoriumCta;
