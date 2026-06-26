const D = "https://cab0d778-6425-4a99-ac55-dd2f35aef268-00-1t61zyqaqdg8q.janeway.replit.dev/benedictus";

/* ─────────────────────────────────────────────────────────────────────────────
   VARIANTE A — CALDO
   Struttura UX copiata da anapana.it:
   • Testo SEMPRE su sfondo chiaro — zero testo su foto scura
   • Foto monastica come elemento VISIVO sotto/accanto al testo
   • Sfondo bianco dominante, sezioni crema e marrone scuro in alternanza
   • Nav trasparente → bianco, CTA a pillola
───────────────────────────────────────────────────────────────────────────── */
export function Caldo() {
  return (
    <div style={{ fontFamily: "'Inter', sans-serif", background: "#fff", color: "#1A0D05", minHeight: "100vh", overflowX: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400;1,600&family=Cinzel:wght@400;500;600;700&family=Inter:wght@300;400;500&display=swap');
        .ca-serif  { font-family: 'Cormorant Garamond', serif; }
        .ca-display{ font-family: 'Cinzel', serif; }
        .ca-hover:hover { opacity: 0.78; }
      `}</style>

      {/* ══ NAV ══════════════════════════════════════════════════════════════ */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 100,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 52px", height: "64px",
        background: "rgba(255,255,255,0.95)",
        backdropFilter: "blur(16px)",
        borderBottom: "1px solid rgba(139,100,60,0.10)"
      }}>
        {/* LOGO — con croce ornamentale e Cinzel 700 */}
        <div style={{ display: "flex", alignItems: "center", gap: "44px" }}>
          <a href="#" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "10px" }}>
            <svg width="13" height="19" viewBox="0 0 13 19" fill="none">
              <rect x="5.5" y="0" width="2" height="19" fill="#C4954A"/>
              <rect x="0"   y="6" width="13" height="2" fill="#C4954A"/>
            </svg>
            <span className="ca-display" style={{
              fontSize: "16px", fontWeight: 700,
              letterSpacing: "0.26em", color: "#1A0D05",
              userSelect: "none", lineHeight: 1
            }}>BENEDICTVS</span>
          </a>
          <div style={{ display: "flex", gap: "32px" }}>
            {["Perché Benedictus?", "Corsi", "Liturgia", "Piani"].map(v => (
              <a key={v} href="#" style={{ fontSize: "13px", fontWeight: 400, color: "#6B4F35", textDecoration: "none", lineHeight: 1, letterSpacing: "0.01em" }}>{v}</a>
            ))}
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <a href="#" style={{ fontSize: "13px", fontWeight: 400, color: "#6B4F35", textDecoration: "none" }}>Login</a>
          <a href="#" style={{
            background: "#1A0D05", color: "#fff",
            padding: "11px 22px", borderRadius: "100px",
            fontSize: "13px", fontWeight: 500, textDecoration: "none", lineHeight: 1, letterSpacing: "0.02em"
          }}>
            Scopri l'offerta
          </a>
        </div>
      </nav>

      {/* ══ HERO — TESTO CENTRATO SU SFONDO CHIARO + FOTO SOTTO ══════════════ */}
      {/* ↑ Stessa logica di anapana: headline centrata su fondo chiaro, foto come elemento visivo sotto */}
      <section style={{
        background: "linear-gradient(180deg, #FDFAF4 0%, #F5EDD8 60%, #E8D9B8 100%)",
        padding: "72px 52px 0",
        textAlign: "center",
        position: "relative", overflow: "hidden"
      }}>
        {/* Background cloister — desat + molto chiaro, solo come texture */}
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: `url(${D}/hero-cloister.png)`,
          backgroundSize: "cover", backgroundPosition: "center 45%",
          opacity: 0.07, filter: "saturate(0) contrast(1.2)"
        }} />

        <div style={{ position: "relative", zIndex: 2 }}>
          <p className="ca-display" style={{
            fontSize: "10px", letterSpacing: "0.55em", color: "#9A7248",
            marginBottom: "28px", textTransform: "uppercase"
          }}>
            Regula Humanitatis · Est. MCM
          </p>

          <h1 className="ca-serif" style={{
            fontSize: "clamp(56px, 8.5vw, 116px)",
            fontWeight: 400, lineHeight: 1.06,
            color: "#1A0D05",
            maxWidth: "900px", margin: "0 auto 28px"
          }}>
            <em style={{ fontStyle: "italic", fontWeight: 400, color: "#8B5A1E" }}>Custodisci</em> la tua vita<br />
            con la saggezza monastica.
          </h1>

          <p style={{
            fontSize: "18px", lineHeight: 1.75, color: "#4A2E12",
            maxWidth: "540px", margin: "0 auto 40px", fontWeight: 400
          }}>
            1500 anni di Regola benedettina tradotti in un cammino quotidiano di leadership contemplativa e rigenerazione interiore.
          </p>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "12px", marginBottom: "64px" }}>
            <a href="#" style={{
              background: "#1A0D05", color: "#fff",
              padding: "16px 36px", borderRadius: "100px",
              fontSize: "15px", textDecoration: "none", fontWeight: 400
            }}>Inizia il cammino</a>
            <a href="#" style={{
              background: "transparent", color: "#1A0D05",
              padding: "16px 36px", borderRadius: "100px",
              fontSize: "15px", textDecoration: "none", fontWeight: 400,
              border: "1.5px solid rgba(26,13,5,0.25)"
            }}>Vedi i piani</a>
          </div>

          {/* FOTO MONASTICA — come i mockup dei telefoni in anapana */}
          <div style={{
            maxWidth: "980px", margin: "0 auto",
            borderRadius: "12px 12px 0 0", overflow: "hidden",
            boxShadow: "0 -4px 48px rgba(26,13,5,0.18)"
          }}>
            <img
              src={`${D}/hero-cloister.png`}
              alt="Chiostro benedettino"
              style={{ width: "100%", display: "block", height: "420px", objectFit: "cover", objectPosition: "center 40%" }}
            />
          </div>
        </div>
      </section>

      {/* ══ NUMERI — bianco ═════════════════════════════════════════════════ */}
      <section style={{ background: "#fff", padding: "72px 52px", borderBottom: "1px solid rgba(139,100,60,0.1)" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px" }}>
          {[
            { n: "1500", u: "anni", l: "di saggezza monastica" },
            { n: "7",    u: "pilastri", l: "della vita ordinata" },
            { n: "3",    u: "livelli", l: "di pratica guidata" },
          ].map(({ n, u, l }) => (
            <div key={n} style={{ textAlign: "center", padding: "32px 24px" }}>
              <div className="ca-serif" style={{ fontSize: "64px", fontWeight: 400, color: "#1A0D05", lineHeight: 1 }}>{n}</div>
              <div className="ca-display" style={{ fontSize: "9px", letterSpacing: "0.4em", color: "#C4954A", margin: "8px 0 6px" }}>{u.toUpperCase()}</div>
              <div style={{ fontSize: "14px", color: "#5C3D1E", fontWeight: 400 }}>{l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ══ CITAZIONE — crema chiara ═════════════════════════════════════════ */}
      <section style={{ background: "#FBF6ED", padding: "80px 52px", textAlign: "center" }}>
        <p className="ca-display" style={{ fontSize: "10px", letterSpacing: "0.5em", color: "#9A7248", marginBottom: "24px" }}>
          REGULA BENEDICTI · PROLOGO
        </p>
        <blockquote className="ca-serif" style={{
          fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 400, fontStyle: "italic",
          color: "#1A0D05", maxWidth: "680px", margin: "0 auto 24px", lineHeight: 1.5
        }}>
          "Ascolta, figlio, i precetti del maestro<br />e piega l'orecchio del tuo cuore."
        </blockquote>
        <div style={{ width: "40px", height: "2px", background: "#C4954A", margin: "0 auto" }} />
      </section>

      {/* ══ CORSI — sezione scura, card con foto sopra ═══════════════════════ */}
      {/* ↑ Copiato direttamente dalla sezione "Corsi" di anapana: bg scuro + card foto */}
      <section style={{ background: "#1A0D05", padding: "72px 52px" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <p className="ca-display" style={{ fontSize: "10px", letterSpacing: "0.45em", color: "#C4954A", marginBottom: "12px" }}>
            IL CAMMINO
          </p>
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: "40px" }}>
            <h2 className="ca-serif" style={{ fontSize: "clamp(32px, 4vw, 52px)", fontWeight: 400, color: "#EDE0C8" }}>
              Le pratiche quotidiane
            </h2>
            <a href="#" style={{ fontSize: "14px", color: "#9A7248", textDecoration: "none" }}>Vedi tutto →</a>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }}>
            {[
              { img: `${D}/stone-corridor.png`,  tag: "ORA ET LABORA",  title: "Preghiera e lavoro",  min: "15 min · ogni giorno" },
              { img: `${D}/monk-manuscript.png`, tag: "LECTIO DIVINA",  title: "Lettura contemplativa", min: "20 min · ogni mattino" },
              { img: `${D}/ancient-library.png`, tag: "SILENZIO",        title: "L'ascolto interiore",  min: "10 min · ogni sera" },
            ].map(({ img, tag, title, min }) => (
              <div key={tag} style={{ background: "#2A1508", borderRadius: "8px", overflow: "hidden", cursor: "pointer" }}>
                {/* Foto in cima — nessun testo sopra */}
                <div style={{ height: "220px", overflow: "hidden" }}>
                  <img src={img} alt={title} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                </div>
                {/* Testo sotto la foto su sfondo scuro — leggibile */}
                <div style={{ padding: "20px 20px 24px" }}>
                  <span style={{
                    display: "inline-block",
                    background: "rgba(196,149,74,0.15)", color: "#C4954A",
                    padding: "3px 10px", borderRadius: "100px",
                    fontSize: "10px", letterSpacing: "0.08em", marginBottom: "10px"
                  }}>{tag}</span>
                  <h3 className="ca-serif" style={{ fontSize: "22px", fontWeight: 400, color: "#EDE0C8", marginBottom: "8px" }}>{title}</h3>
                  <p style={{ fontSize: "13px", color: "#C4A87A", fontWeight: 400 }}>{min}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ SPLIT — foto sx, testo su crema dx ═══════════════════════════════ */}
      <section style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
        <div style={{ overflow: "hidden", minHeight: "480px" }}>
          <img src={`${D}/monk-manuscript.png`} alt="Monaco con manoscritto" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
        </div>
        <div style={{ padding: "72px 60px", background: "#FBF6ED", display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <p className="ca-display" style={{ fontSize: "10px", letterSpacing: "0.45em", color: "#9A7248", marginBottom: "24px" }}>
            PADRE BENEDETTO AI
          </p>
          <h3 className="ca-serif" style={{ fontSize: "clamp(28px, 3.5vw, 44px)", fontWeight: 400, color: "#1A0D05", marginBottom: "20px", lineHeight: 1.35 }}>
            Una guida spirituale<br /><em style={{ color: "#8B5A1E" }}>sempre presente.</em>
          </h3>
          <p style={{ fontSize: "16px", lineHeight: 1.78, color: "#5C3D1E", fontWeight: 400, marginBottom: "36px" }}>
            Padre Benedetto risponde alle tue domande, ti accompagna nella meditazione quotidiana e custodisce il tuo cammino spirituale — 24 ore su 24.
          </p>
          <a href="#" style={{
            display: "inline-flex", alignSelf: "flex-start",
            background: "#1A0D05", color: "#fff",
            padding: "14px 30px", borderRadius: "100px",
            fontSize: "14px", textDecoration: "none"
          }}>
            Incontra il Padre →
          </a>
        </div>
      </section>

      {/* ══ PIANI — bianco ═══════════════════════════════════════════════════ */}
      <section style={{ background: "#fff", padding: "80px 52px" }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
          <p className="ca-display" style={{ fontSize: "10px", letterSpacing: "0.45em", color: "#9A7248", textAlign: "center", marginBottom: "12px" }}>I PIANI</p>
          <h2 className="ca-serif" style={{ fontSize: "clamp(32px, 4vw, 52px)", fontWeight: 400, textAlign: "center", marginBottom: "52px", color: "#1A0D05" }}>
            Scegli il tuo cammino
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }}>
            {[
              { name: "Oblato",  price: "9",  desc: "Liturgia del giorno, Lectio Divina, meditazioni quotidiane.", features: ["Liturgia giornaliera", "Lectio Divina", "Preghiera guidata"], dark: false },
              { name: "Monaco",  price: "29", desc: "Tutto Oblato + Padre Benedetto AI, percorso guidato, esercizi ignaziani.", features: ["Tutto Oblato", "Padre Benedetto AI", "Esercizi ignaziani", "Percorso a 40 settimane"], dark: true },
              { name: "Priore",  price: "89", desc: "Tutto Monaco + sessioni mensili con un padre spirituale reale.", features: ["Tutto Monaco", "2 sessioni/mese con un padre", "Accesso prioritario"], dark: false },
            ].map(({ name, price, desc, features, dark }) => (
              <div key={name} style={{
                border: dark ? "none" : "1.5px solid rgba(139,100,60,0.15)",
                borderRadius: "12px",
                padding: "36px 28px",
                background: dark ? "#1A0D05" : "#fff",
              }}>
                <p className="ca-display" style={{ fontSize: "9px", letterSpacing: "0.4em", color: dark ? "#C4954A" : "#9A7248", marginBottom: "20px" }}>{name.toUpperCase()}</p>
                <div style={{ display: "flex", alignItems: "baseline", gap: "4px", marginBottom: "4px" }}>
                  <span className="ca-serif" style={{ fontSize: "52px", fontWeight: 400, color: dark ? "#EDE0C8" : "#1A0D05", lineHeight: 1 }}>€{price}</span>
                </div>
                <p style={{ fontSize: "12px", color: dark ? "#9A7A5A" : "#9A7248", marginBottom: "16px" }}>/mese · fatturato annualmente</p>
                <p style={{ fontSize: "14px", lineHeight: 1.65, color: dark ? "#D8C4A0" : "#4A2E12", fontWeight: 400, marginBottom: "24px" }}>{desc}</p>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "28px" }}>
                  {features.map(f => (
                    <div key={f} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <div style={{ width: "5px", height: "5px", borderRadius: "50%", background: dark ? "#C4954A" : "#9A7248", flexShrink: 0 }} />
                      <span style={{ fontSize: "13px", color: dark ? "#D8C4A0" : "#4A2E12", fontWeight: 400 }}>{f}</span>
                    </div>
                  ))}
                </div>
                <a href="#" style={{
                  display: "block", textAlign: "center",
                  background: dark ? "#fff" : "#1A0D05",
                  color: dark ? "#1A0D05" : "#fff",
                  padding: "13px 0", borderRadius: "100px",
                  fontSize: "14px", textDecoration: "none"
                }}>
                  Inizia con {name}
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ CTA — foto come sfondo CON overlay pesante ════════════════════════ */}
      {/* ↑ Qui la foto scura è ok perché è una sezione-banner con overlay 70%+ */}
      <section style={{ position: "relative", overflow: "hidden" }}>
        <img src={`${D}/ancient-library.png`} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", filter: "saturate(0.4) brightness(0.35)" }} />
        <div style={{ position: "absolute", inset: 0, background: "rgba(10,5,2,0.65)" }} />
        <div style={{ position: "relative", zIndex: 2, padding: "88px 52px", textAlign: "center" }}>
          <p className="ca-display" style={{ fontSize: "10px", letterSpacing: "0.5em", color: "#C4954A", marginBottom: "24px" }}>INIZIA OGGI</p>
          <h2 className="ca-serif" style={{ fontSize: "clamp(36px, 5vw, 64px)", fontWeight: 400, color: "#fff", marginBottom: "20px" }}>
            Il monastero è dove<br /><em style={{ color: "#C4954A" }}>decidi di costruirlo.</em>
          </h2>
          <p style={{ fontSize: "16px", color: "rgba(255,255,255,0.88)", marginBottom: "40px", fontWeight: 400 }}>30 giorni di pratica guidata per cominciare.</p>
          <a href="#" style={{
            display: "inline-block", background: "#fff", color: "#1A0D05",
            padding: "18px 48px", borderRadius: "100px", fontSize: "15px", textDecoration: "none"
          }}>Scopri i piani</a>
        </div>
      </section>

      {/* ══ FOOTER ════════════════════════════════════════════════════════════ */}
      <footer style={{ background: "#fff", padding: "40px 52px", borderTop: "1px solid rgba(139,100,60,0.1)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span className="ca-display" style={{ fontSize: "12px", letterSpacing: "0.2em", color: "#1A0D05" }}>BENEDICTVS</span>
        <div style={{ display: "flex", gap: "32px" }}>
          {["Privacy", "Termini", "Contatti"].map(v => <a key={v} href="#" style={{ fontSize: "13px", color: "#9A7248", textDecoration: "none" }}>{v}</a>)}
        </div>
        <span style={{ fontSize: "13px", color: "#C4A875" }}>Regula Humanitatis · Est. MCM</span>
      </footer>
    </div>
  );
}
