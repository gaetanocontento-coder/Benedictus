import { useAuth } from "@/lib/auth";
import { Link } from "wouter";
import {
  useBGetOblatoProfilo,
  useBGetSigilli,
  useBGetOfficiumOggi,
} from "@workspace/api-client-react";
import { ORE_CANONICHE, getOraCorrente } from "@/lib/liturgia";

// ── Data ────────────────────────────────────────────────────────────────────

const GRADI = [
  { grado: 1, nome: "Curioso",    latino: "Curiosus",   xpMin: 0,    xpMax: 99,       descrizione: "Hai bussato alla porta del monastero. Il cammino inizia." },
  { grado: 2, nome: "Postulante", latino: "Postulans",  xpMin: 100,  xpMax: 299,      descrizione: "Sei in prova. I fratelli ti osservano, Dio ti conosce già." },
  { grado: 3, nome: "Novizio",    latino: "Novicius",   xpMin: 300,  xpMax: 699,      descrizione: "Hai iniziato il cammino. La Regola diventa la tua guida." },
  { grado: 4, nome: "Monaco",     latino: "Monachus",   xpMin: 700,  xpMax: 1499,     descrizione: "Hai fatto professione. Il monastero è casa tua." },
  { grado: 5, nome: "Professo",   latino: "Professus",  xpMin: 1500, xpMax: 2999,     descrizione: "La stabilitas si è consolidata. Sei testimone del cammino." },
  { grado: 6, nome: "Anziano",    latino: "Senior",     xpMin: 3000, xpMax: 5999,     descrizione: "Guidi altri con la tua presenza più che con le parole." },
  { grado: 7, nome: "Abate",      latino: "Abbas",      xpMin: 6000, xpMax: Infinity, descrizione: "Custode della comunità. Tutto è affidato a te e a Dio." },
];

const GRADI_UMILTA = [
  { icona: "🕯️", nome: "Il Timore di Dio",       soglia: "Completa il primo check-in" },
  { icona: "🌿", nome: "Mortificazione del volere", soglia: "3 giorni di streak" },
  { icona: "📜", nome: "L'Obbedienza",             soglia: "3 Lectio + 1 Capitolo" },
  { icona: "⌛", nome: "La Pazienza",              soglia: "7 giorni di streak" },
  { icona: "✍️", nome: "La Confessione",           soglia: "5 voci nel Libro del Cuore" },
  { icona: "🙏", nome: "Il Contentarsi del poco",  soglia: "30 check-in totali" },
  { icona: "🌑", nome: "L'Infimo tra tutti",        soglia: "14 giorni di streak" },
  { icona: "📖", nome: "La Regola comune",         soglia: "4 capitoli meditati" },
  { icona: "🤫", nome: "Il Silenzio",              soglia: "100 check-in totali" },
  { icona: "🏛️", nome: "La Custodia del riso",    soglia: "10 Lectio completate" },
  { icona: "🗝️", nome: "La Parola misurata",      soglia: "20 voci nel Libro del Cuore" },
  { icona: "✝️", nome: "Il Cuore umile",          soglia: "30 giorni di streak" },
];

const VIRTU = [
  { key: "xpPreghiera",  nome: "Preghiera",  angolo: 90  },
  { key: "xpLavoro",     nome: "Lavoro",     angolo: 30  },
  { key: "xpSilenzio",   nome: "Silenzio",   angolo: 330 },
  { key: "xpUmilta",     nome: "Umiltà",     angolo: 270 },
  { key: "xpOspitalita", nome: "Ospitalità", angolo: 210 },
  { key: "xpStabilitas", nome: "Stabilitas", angolo: 150 },
];

// ── Sub-components ───────────────────────────────────────────────────────────

function EsagrammaVirtu({ profilo }: { profilo: Record<string, number> }) {
  const maxXp = Math.max(...VIRTU.map((v) => profilo[v.key] ?? 0), 50);
  const cx = 130;
  const cy = 130;
  const r  = 90;

  const points = VIRTU.map((v) => {
    const val   = profilo[v.key] ?? 0;
    const ratio = Math.min(val / maxXp, 1);
    const rad   = ((v.angolo - 90) * Math.PI) / 180;
    return {
      x:      cx + r * ratio * Math.cos(rad),
      y:      cy + r * ratio * Math.sin(rad),
      labelX: cx + (r + 26) * Math.cos(rad),
      labelY: cy + (r + 26) * Math.sin(rad),
      nome:   v.nome,
      val,
    };
  });

  const polyStr = points.map((p) => `${p.x},${p.y}`).join(" ");

  return (
    <svg viewBox="0 0 260 260" className="w-full max-w-[260px] mx-auto">
      {[0.25, 0.5, 0.75, 1].map((frac) => (
        <polygon
          key={frac}
          points={VIRTU.map((v) => {
            const rad = ((v.angolo - 90) * Math.PI) / 180;
            return `${cx + r * frac * Math.cos(rad)},${cy + r * frac * Math.sin(rad)}`;
          }).join(" ")}
          fill="none"
          stroke="currentColor"
          strokeWidth="0.5"
          className="text-border/40"
        />
      ))}
      {VIRTU.map((v) => {
        const rad = ((v.angolo - 90) * Math.PI) / 180;
        return (
          <line
            key={v.key}
            x1={cx} y1={cy}
            x2={cx + r * Math.cos(rad)}
            y2={cy + r * Math.sin(rad)}
            stroke="currentColor"
            strokeWidth="0.5"
            className="text-border/30"
          />
        );
      })}
      <polygon
        points={polyStr}
        fill="hsl(var(--primary) / 0.12)"
        stroke="hsl(var(--primary) / 0.6)"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      {points.map((p) => (
        <circle key={p.nome} cx={p.x} cy={p.y} r="3.5" fill="hsl(var(--primary))" />
      ))}
      {points.map((p) => (
        <text
          key={p.nome + "_l"}
          x={p.labelX}
          y={p.labelY}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize="7.5"
          fill="hsl(var(--muted-foreground))"
          fontFamily="sans-serif"
        >
          {p.nome}
        </text>
      ))}
    </svg>
  );
}

// ── Main page ────────────────────────────────────────────────────────────────

export default function OblatoDashboard() {
  const { user }                              = useAuth();
  const { data: profilo, isLoading }          = useBGetOblatoProfilo();
  const { data: sigilli }                     = useBGetSigilli();
  const { data: checkInsOggi }                = useBGetOfficiumOggi();

  // ── Login gate
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="text-center">
          <p className="font-serif text-2xl mb-3">Il cammino oblato ti aspetta</p>
          <p className="text-muted-foreground font-light mb-8 max-w-xs">
            Accedi per vedere il tuo profilo, i tuoi gradi e il tuo progresso nella Regola.
          </p>
          <Link href="/login" className="border border-primary px-6 py-2 text-sm uppercase tracking-widest hover:bg-primary/10 transition-colors">
            Accedi
          </Link>
        </div>
      </div>
    );
  }

  // ── Loading
  if (isLoading || !profilo) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground text-sm animate-pulse">Caricamento del cammino…</p>
      </div>
    );
  }

  // ── Derived state
  const grado        = GRADI.find((g) => g.grado === profilo.grado) ?? GRADI[0];
  const gradoProssimo = GRADI.find((g) => g.grado === profilo.grado + 1);
  const xpPercentage = gradoProssimo
    ? Math.min(100, Math.round(((profilo.xpTotale - grado.xpMin) / (gradoProssimo.xpMin - grado.xpMin)) * 100))
    : 100;

  const checkInIds           = new Set((checkInsOggi ?? []).map((c) => c.oraId));
  const orePregate            = checkInIds.size;
  const gradiSbloccati        = Array.from({ length: 12 }, (_, i) => (profilo.gradiUmiltaSbloccati & (1 << i)) !== 0);
  const gradiSbloccatiCount   = gradiSbloccati.filter(Boolean).length;
  const profiloMap            = profilo as unknown as Record<string, number>;
  const { ora: oraCorrente }  = getOraCorrente();

  const dataFmt = new Date().toLocaleDateString("it-IT", { weekday: "long", day: "numeric", month: "long" });

  return (
    <div className="min-h-screen bg-background py-20">
      <div className="container mx-auto px-6 lg:px-12 max-w-5xl">

        {/* ── IDENTITÀ ─────────────────────────────────────────────── */}
        <div className="text-center mb-16">
          <p className="text-[10px] uppercase tracking-[0.4em] text-primary mb-3">
            Cursus Oblati — {dataFmt}
          </p>
          <h1 className="font-serif text-5xl lg:text-6xl mb-4">{user.name}</h1>
          <div className="inline-flex items-center gap-3 border border-primary/30 px-6 py-2 mb-4">
            <span className="text-primary font-serif text-xl">{grado.nome}</span>
            <span className="text-muted-foreground">·</span>
            <span className="text-muted-foreground italic text-sm">{grado.latino}</span>
            <span className="text-muted-foreground">·</span>
            <span className="text-muted-foreground text-sm">{profilo.xpTotale} XP</span>
          </div>
          <p className="text-muted-foreground font-light">{grado.descrizione}</p>
        </div>

        {/* ── PROGRESSIONE GRADO ───────────────────────────────────── */}
        <div className="border border-border/60 p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <p className="text-[9px] uppercase tracking-[0.3em] text-muted-foreground">Grado attuale</p>
            {gradoProssimo && (
              <p className="text-[9px] text-muted-foreground">
                {profilo.xpAlProssimoGrado} XP al prossimo: <span className="text-primary">{gradoProssimo.nome}</span>
              </p>
            )}
          </div>

          {/* Barra */}
          <div className="h-1.5 bg-border/30 w-full mb-3">
            <div className="h-full bg-primary transition-all duration-700" style={{ width: `${xpPercentage}%` }} />
          </div>

          {/* Nodi gradi */}
          <div className="flex justify-between">
            {GRADI.map((g) => (
              <div key={g.grado} className="flex flex-col items-center gap-1">
                <div className={`w-2 h-2 rounded-full ${
                  g.grado < profilo.grado  ? "bg-primary/50" :
                  g.grado === profilo.grado ? "bg-primary ring-2 ring-primary/20 ring-offset-1 ring-offset-background" :
                  "bg-border/40"
                }`} />
                <span className={`text-[7px] uppercase tracking-wide hidden sm:block ${
                  g.grado === profilo.grado ? "text-primary" : "text-muted-foreground"
                }`}>
                  {g.nome.slice(0, 3)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ── GRIGLIA PRINCIPALE ───────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">

          {/* Esagramma virtù */}
          <div className="border border-border/60 p-6 flex flex-col items-center">
            <p className="text-[9px] uppercase tracking-[0.3em] text-muted-foreground mb-4">Le sei virtù</p>
            <EsagrammaVirtu profilo={profiloMap} />
            <div className="w-full mt-4 space-y-2">
              {VIRTU.map((v) => {
                const val    = profiloMap[v.key] ?? 0;
                const maxVal = Math.max(...VIRTU.map((x) => profiloMap[x.key] ?? 0), 1);
                const pct    = Math.min(100, Math.round((val / maxVal) * 100));
                return (
                  <div key={v.key}>
                    <div className="flex justify-between mb-0.5">
                      <span className="text-[10px] text-muted-foreground">{v.nome}</span>
                      <span className="text-[10px] text-primary font-serif">{val}</span>
                    </div>
                    <div className="h-px bg-border/30">
                      <div className="h-full bg-primary/60 transition-all duration-500" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Destra: Officium + Streak */}
          <div className="lg:col-span-2 space-y-6">

            {/* Officium oggi */}
            <div className="border border-border/60 p-6">
              <div className="flex items-center justify-between mb-4">
                <p className="text-[9px] uppercase tracking-[0.3em] text-muted-foreground">Officium di oggi</p>
                <Link href="/officium" className="text-[10px] uppercase tracking-widest text-primary hover:text-primary/70 transition-colors">
                  Vai all'Officium →
                </Link>
              </div>
              <div className="space-y-2">
                {ORE_CANONICHE.map((ora) => {
                  const checked    = checkInIds.has(ora.id);
                  const isCurrent  = ora.id === oraCorrente.id;
                  const nowMin     = new Date().getHours() * 60 + new Date().getMinutes();
                  const startMin   = ora.oraInizio * 60 + ora.minutoInizio;
                  const isFuture   = startMin > nowMin && !isCurrent;

                  return (
                    <div
                      key={ora.id}
                      className={`flex items-center gap-3 transition-opacity ${isFuture ? "opacity-40" : "opacity-100"}`}
                    >
                      <div className="flex-none w-4 flex justify-center">
                        {checked ? (
                          <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                        ) : isCurrent ? (
                          <div className="w-2.5 h-2.5 rounded-full border-2 border-primary animate-pulse" />
                        ) : (
                          <div className="w-2 h-2 rounded-full border border-border/50" />
                        )}
                      </div>
                      <span className="font-mono text-[10px] text-muted-foreground flex-none w-10">
                        {String(ora.oraInizio).padStart(2, "0")}:{String(ora.minutoInizio).padStart(2, "0")}
                      </span>
                      <span className="text-sm flex-none">{ora.icona}</span>
                      <span className={`text-sm flex-1 ${
                        isCurrent ? "text-primary font-medium" :
                        checked   ? "text-muted-foreground line-through" :
                        "text-foreground"
                      }`}>
                        {ora.nome}
                      </span>
                      {checked && <span className="text-[9px] text-primary flex-none">✓</span>}
                    </div>
                  );
                })}
              </div>
              <p className={`text-xs mt-4 text-center ${
                orePregate === 8 ? "text-primary font-serif" : "text-muted-foreground"
              }`}>
                {orePregate === 8 ? "✦ Officium completo — Laus Deo ✦" : `${orePregate} di 8 ore pregate oggi`}
              </p>
            </div>

            {/* Streak + Cursus */}
            <div className="grid grid-cols-2 gap-4">
              <div className="border border-border/60 p-5">
                <p className="text-[9px] uppercase tracking-[0.3em] text-muted-foreground mb-4">Stabilitas</p>
                <div className="flex items-baseline gap-2 mb-3">
                  <span className="font-serif text-4xl text-primary">{profilo.streakCorrente}</span>
                  <span className="text-muted-foreground text-sm">
                    {profilo.streakCorrente === 1 ? "giorno" : "giorni"}
                  </span>
                </div>
                {/* 21-day dots */}
                <div className="flex gap-1 flex-wrap mb-2">
                  {Array.from({ length: 21 }, (_, i) => (
                    <div
                      key={i}
                      className={`w-2.5 h-2.5 rounded-sm ${
                        20 - i < profilo.streakCorrente ? "bg-primary/70" : "bg-border/40"
                      }`}
                    />
                  ))}
                </div>
                <p className="text-[9px] text-muted-foreground">Record: {profilo.streakMassimo} giorni</p>
              </div>

              <div className="border border-border/60 p-5">
                <p className="text-[9px] uppercase tracking-[0.3em] text-muted-foreground mb-4">Cursus</p>
                <div className="space-y-2">
                  {[
                    { label: "Check-in",  val: profilo.checkInTotali },
                    { label: "Lectio",    val: profilo.lectioCompletate },
                    { label: "Capitoli",  val: profilo.capitoliLetti },
                    { label: "Esami",     val: profilo.esamiCompletati },
                  ].map((s) => (
                    <div key={s.label} className="flex justify-between items-baseline">
                      <span className="text-sm text-muted-foreground">{s.label}</span>
                      <span className="font-serif text-foreground">{s.val}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* ── XII GRADI DELL'UMILTÀ ─────────────────────────────────── */}
        <div className="border border-border/60 p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <p className="text-[9px] uppercase tracking-[0.3em] text-muted-foreground">
              XII Gradi dell'Umiltà — Regola Cap. 7
            </p>
            <p className="text-sm font-serif text-primary">{gradiSbloccatiCount} / 12</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {GRADI_UMILTA.map((g, i) => {
              const sbloccato = gradiSbloccati[i];
              const numerali  = ["I","II","III","IV","V","VI","VII","VIII","IX","X","XI","XII"];
              return (
                <div
                  key={i}
                  className={`border p-4 transition-colors ${
                    sbloccato ? "border-primary/30 bg-primary/5" : "border-border/30"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className={`font-serif text-xs ${sbloccato ? "text-primary/60" : "text-muted-foreground"}`}>
                      {numerali[i]}
                    </span>
                    <span className={sbloccato ? "" : "grayscale opacity-40"}>{g.icona}</span>
                  </div>
                  <p className={`text-xs leading-tight mb-1 ${sbloccato ? "text-foreground" : "text-muted-foreground"}`}>
                    {g.nome}
                  </p>
                  <p className={`text-[9px] leading-tight ${sbloccato ? "text-primary" : "text-muted-foreground"}`}>
                    {sbloccato ? "✓ Sbloccato" : g.soglia}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── SIGILLI ───────────────────────────────────────────────── */}
        {sigilli && sigilli.length > 0 && (
          <div className="border border-border/60 p-6 mb-8">
            <p className="text-[9px] uppercase tracking-[0.3em] text-muted-foreground mb-4">Sigilli guadagnati</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {sigilli.map((s) => (
                <div key={s.id} className="flex items-start gap-3 border border-primary/20 bg-primary/5 p-4">
                  <span className="text-2xl flex-none">{s.icona}</span>
                  <div>
                    <p className="text-sm font-serif text-primary mb-0.5">{s.nome}</p>
                    <p className="text-[10px] text-muted-foreground leading-relaxed">{s.descrizione}</p>
                    <div className="flex gap-2 mt-1.5">
                      <span className="text-[9px] text-primary">+{s.xpValore} XP</span>
                      <span className="text-muted-foreground text-[9px]">·</span>
                      <span className="text-[9px] text-muted-foreground">
                        {new Date(s.sbloccatoIl).toLocaleDateString("it-IT", { day: "numeric", month: "short" })}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── AZIONI RAPIDE ─────────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
          {[
            { href: "/officium", icona: "🔔", titolo: "Officium",         sub: "Check-in ore canoniche" },
            { href: "/capitolo", icona: "📖", titolo: "Capitolo",          sub: "Lettura settimanale" },
            { href: "/esame",    icona: "✍️", titolo: "Esame di coscienza", sub: "3 domande serali" },
          ].map((a) => (
            <Link
              key={a.href}
              href={a.href}
              className="border border-border/60 hover:border-primary/40 p-5 text-center group transition-all"
            >
              <p className="text-2xl mb-2">{a.icona}</p>
              <p className="text-xs uppercase tracking-widest text-muted-foreground group-hover:text-primary transition-colors mb-1">
                {a.titolo}
              </p>
              <p className="text-[10px] text-muted-foreground/70">{a.sub}</p>
            </Link>
          ))}
        </div>

        {/* ── CITAZIONE ─────────────────────────────────────────────── */}
        <div className="text-center">
          <p className="text-muted-foreground italic font-light">
            «Nihil amori Christi praeponatur.»
          </p>
          <p className="text-[9px] uppercase tracking-widest text-muted-foreground mt-1">
            Regola di San Benedetto, Cap. 72
          </p>
        </div>

      </div>
    </div>
  );
}
