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
    <div style={{ fontFamily: "'Inter', sans-serif", background: "#0D0804", color: "#fff", minHeight: "100vh", overflowX: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400;1,600&family=Cinzel:wght@400;500;600;700&family=Inter:wght@300;400;500&display=swap');
        .ca-serif  { font-family: 'Cormorant Garamond', serif; }
        .ca-display{ font-family: 'Cinzel', serif; }
      `}</style>

      {/* ══ HERO FULL-BLEED — foto chiostro + overlay scuro + nav assoluta ══ */}
      <section style={{ position: "relative", height: "100vh", overflow: "hidden" }}>

        {/* Foto monastica full-bleed */}
        <img
          src={`${D}/hero-cloister.png`}
          alt="Chiostro benedettino"
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 40%" }}
        />
        {/* Overlay scuro che mantiene il calore ambra della foto */}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(8,4,2,0.55) 0%, rgba(6,3,1,0.38) 40%, rgba(10,5,2,0.72) 100%)" }} />

        {/* ── NAV TRASPARENTE — posizione assoluta sulla foto ── */}
        <nav style={{
          position: "absolute", top: 0, left: 0, right: 0, zIndex: 10,
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "0 52px", height: "68px"
        }}>
          <a href="#" style={{ textDecoration: "none" }}>
            <span className="ca-display" style={{
              fontSize: "15px", fontWeight: 700,
              letterSpacing: "0.28em", color: "#fff",
              userSelect: "none", lineHeight: 1
            }}>BENEDICTVS</span>
          </a>
          <div style={{ display: "flex", gap: "28px" }}>
            {["Chi siamo", "La Regola", "Liturgia", "Lectio", "Scriptorium", "Percorso", "Piani"].map(v => (
              <a key={v} href="#" style={{ fontSize: "11px", fontWeight: 400, color: "rgba(255,255,255,0.82)", textDecoration: "none", letterSpacing: "0.04em" }}>{v}</a>
            ))}
          </div>
          <a href="#" style={{ fontSize: "12px", fontWeight: 400, color: "rgba(255,255,255,0.82)", textDecoration: "none", letterSpacing: "0.05em" }}>Accedi</a>
        </nav>

        {/* ── TESTO CENTRATO — come il riferimento Lovable ── */}
        <div style={{
          position: "absolute", inset: 0, zIndex: 5,
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
          textAlign: "center", padding: "0 48px"
        }}>
          <p className="ca-display" style={{
            fontSize: "9px", letterSpacing: "0.6em", color: "#C4954A",
            marginBottom: "28px"
          }}>
            REGULA HUMANITATIS &nbsp;/&nbsp; EST. MCM
          </p>

          <h1 className="ca-serif" style={{
            fontSize: "clamp(52px, 7.5vw, 102px)",
            fontWeight: 400, lineHeight: 1.08,
            color: "#fff", marginBottom: "22px",
            textShadow: "0 2px 32px rgba(0,0,0,0.4)"
          }}>
            Un rifugio per<br />
            il <em style={{ fontStyle: "italic", color: "#D4A96A" }}>custode</em> moderno.
          </h1>

          <p style={{
            fontSize: "16px", lineHeight: 1.72, color: "rgba(255,255,255,0.70)",
            maxWidth: "520px", fontWeight: 300
          }}>
            1500 anni di saggezza monastica tradotti in un cammino di leadership contemplativa, silenzio e rigenerazione interiore.
          </p>

          {/* CTA — leggermente sotto il testo */}
          <div style={{ display: "flex", gap: "12px", marginTop: "44px" }}>
            <a href="#" style={{
              background: "#C4954A", color: "#0D0804",
              padding: "15px 36px", borderRadius: "100px",
              fontSize: "13px", fontWeight: 600, textDecoration: "none", letterSpacing: "0.04em"
            }}>Inizia il cammino</a>
            <a href="#" style={{
              background: "transparent", color: "#fff",
              padding: "14px 36px", borderRadius: "100px",
              fontSize: "13px", fontWeight: 400, textDecoration: "none",
              border: "1px solid rgba(255,255,255,0.4)"
            }}>Vedi i piani</a>
          </div>
        </div>

        {/* Scroll indicator — linea verticale in basso al centro */}
        <div style={{ position: "absolute", bottom: "32px", left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: "8px", zIndex: 5 }}>
          <div style={{ width: "1px", height: "40px", background: "rgba(196,149,74,0.6)" }} />
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

      {/* ══ MANOSCRITTO — Book of Hours full-bleed ═══════════════════════════ */}
      {/* Il manoscritto come "finestra" sulla tradizione — nessun testo sopra */}
      <section style={{ position: "relative", overflow: "hidden", height: "380px" }}>
        <img
          src={`${D}/manuscript-hours.jpg`}
          alt="Book of Hours illuminato"
          style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 30%", display: "block" }}
        />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, rgba(255,255,255,0.82) 0%, rgba(255,255,255,0.05) 55%)" }} />
        <div style={{ position: "absolute", top: 0, left: 0, bottom: 0, width: "46%", display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 52px" }}>
          <p className="ca-display" style={{ fontSize: "9px", letterSpacing: "0.5em", color: "#9A7248", marginBottom: "16px" }}>LA TRADIZIONE SCRITTA</p>
          <h3 className="ca-serif" style={{ fontSize: "clamp(26px, 3vw, 40px)", fontWeight: 400, color: "#1A0D05", lineHeight: 1.35, marginBottom: "14px" }}>
            Ogni parola copiata<br />a mano per mille anni.
          </h3>
          <p style={{ fontSize: "15px", color: "#4A2E12", lineHeight: 1.7, fontWeight: 400 }}>
            I monaci amanuensi custodivano il sapere dell'umanità trascrivendo pagina per pagina. Oggi quella stessa cura si traduce nel tuo cammino quotidiano.
          </p>
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
              { img: `${D}/stone-corridor.png`,           tag: "ORA ET LABORA",  title: "Preghiera e lavoro",  min: "15 min · ogni giorno" },
              { img: `${D}/manuscript-monastery-books.jpg`, tag: "LECTIO DIVINA",  title: "Lectio Divina",        min: "20 min · ogni mattino" },
              { img: `${D}/ancient-library.png`,           tag: "SILENZIO",        title: "L'ascolto interiore",  min: "10 min · ogni sera" },
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
        <div style={{ textAlign: "right" }}>
          <span style={{ fontSize: "13px", color: "#C4A875" }}>Regula Humanitatis · Est. MCM</span>
          <div style={{ fontSize: "11px", color: "#C4A875", opacity: 0.6, marginTop: "4px" }}>Made in Never Before Italia</div>
        </div>
      </footer>
    </div>
  );
}
