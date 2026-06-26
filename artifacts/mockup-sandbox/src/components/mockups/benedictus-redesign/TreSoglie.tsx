const D = "https://cab0d778-6425-4a99-ac55-dd2f35aef268-00-1t61zyqaqdg8q.janeway.replit.dev/benedictus";

/* Sezione 3 — 3 card Capitulum + La Regola (Non è un corso) + foto circolare monaci */
export function TreSoglie() {
  return (
    <div style={{ fontFamily: "'Inter', sans-serif", background: "#F7EFE2", color: "#1C0B03", minHeight: "100vh" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400;1,600&family=Inter:wght@300;400;500&display=swap');
        .ts-serif { font-family: 'Cormorant Garamond', serif; }
      `}</style>

      {/* ── 3 CAPITULUM CARDS ── */}
      <section style={{ padding: "80px 64px 60px", maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 20 }}>
          {[
            { num: "I",   title: "Disconnessione", body: "Le organizzazioni crescono, ma il senso di appartenenza svanisce. Il leader moderno è spesso un custode solitario." },
            { num: "II",  title: "Esaurimento",    body: "Il ritmo della performance senza il ritmo del riposo porta al vuoto. L'azione senza contemplazione è cieca." },
            { num: "III", title: "Frammentazione", body: "Informazioni ovunque, saggezza rara. Manca uno spazio dove ricostruire l'unità della persona." },
          ].map((item) => (
            <div key={item.num} style={{
              background: "#fff", borderRadius: 20, padding: 28,
              boxShadow: "0 2px 16px rgba(0,0,0,0.06)",
              border: "1px solid rgba(0,0,0,0.06)",
            }}>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 20 }}>
                <span className="ts-serif" style={{ fontSize: 42, fontStyle: "italic", color: "rgba(28,11,3,0.18)" }}>{item.num}</span>
                <span style={{
                  fontSize: 9, letterSpacing: "0.2em", textTransform: "uppercase",
                  color: "#7A6050", border: "1px solid rgba(0,0,0,0.12)",
                  borderRadius: 999, padding: "4px 12px",
                }}>Capitulum</span>
              </div>
              <h3 className="ts-serif" style={{ fontSize: 22, color: "#1C0B03", marginBottom: 10 }}>{item.title}</h3>
              <p style={{ fontSize: 13, color: "#7A6050", fontWeight: 300, lineHeight: 1.65 }}>{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── LA REGOLA — Non è un corso ── */}
      <section style={{ padding: "60px 64px 80px", maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }}>

          {/* Left */}
          <div>
            <p style={{ fontSize: 10, letterSpacing: "0.28em", textTransform: "uppercase", color: "#7A6050", marginBottom: 24 }}>
              · La Regola ·
            </p>
            <h2 className="ts-serif" style={{ fontSize: 52, lineHeight: 1.1, color: "#1C0B03", marginBottom: 20 }}>
              Non è un corso.<br />
              È un <em style={{ fontStyle: "italic", color: "#A8591C" }}>cammino</em>.
            </h2>
            <p style={{ fontSize: 15, color: "#7A6050", fontWeight: 300, lineHeight: 1.7, maxWidth: 400, marginBottom: 32 }}>
              Unisciti a una comunità di pellegrini e custodi che hanno scelto di guidare partendo dal silenzio.
            </p>
            {[
              { t: "Liturgia delle ore",    b: "Sette momenti al giorno per ritornare al respiro." },
              { t: "Lectio personale",       b: "Un testo sacro alla settimana. Lentamente." },
              { t: "Capitolo comunitario",   b: "Una volta al mese con gli altri custodi del percorso." },
            ].map((item) => (
              <div key={item.t} style={{ display: "flex", gap: 14, marginBottom: 18 }}>
                <div style={{
                  width: 20, height: 20, borderRadius: "50%", border: "1px solid rgba(0,0,0,0.15)",
                  display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2,
                }}>
                  <svg viewBox="0 0 12 12" style={{ width: 11, height: 11, color: "#A8591C" }} fill="none">
                    <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div>
                  <p style={{ fontSize: 14, fontWeight: 500, color: "#1C0B03", marginBottom: 2 }}>{item.t}</p>
                  <p style={{ fontSize: 13, color: "#7A6050", fontWeight: 300 }}>{item.b}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Right — circular cloister photo */}
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <div style={{ width: 380, height: 380, borderRadius: "50%", overflow: "hidden" }}>
              <img
                src={`${D}/hero-cloister.png`}
                alt="Monaci in cammino"
                style={{ width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.88) contrast(1.08) saturate(0.76) sepia(0.20)" }}
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default TreSoglie;
