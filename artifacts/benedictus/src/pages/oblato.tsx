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
  {
    grado: 1,
    nome: "Curioso",
    latino: "Curiosus",
    xpMin: 0,
    xpMax: 99,
    descrizione: "Hai bussato alla porta del monastero. Il cammino inizia.",
  },
  {
    grado: 2,
    nome: "Postulante",
    latino: "Postulans",
    xpMin: 100,
    xpMax: 299,
    descrizione: "Sei in prova. I fratelli ti osservano, Dio ti conosce già.",
  },
  {
    grado: 3,
    nome: "Novizio",
    latino: "Novicius",
    xpMin: 300,
    xpMax: 699,
    descrizione: "Hai iniziato il cammino. La Regola diventa la tua guida.",
  },
  {
    grado: 4,
    nome: "Monaco",
    latino: "Monachus",
    xpMin: 700,
    xpMax: 1499,
    descrizione: "Hai fatto professione. Il monastero è casa tua.",
  },
  {
    grado: 5,
    nome: "Professo",
    latino: "Professus",
    xpMin: 1500,
    xpMax: 2999,
    descrizione: "La stabilitas si è consolidata. Sei testimone del cammino.",
  },
  {
    grado: 6,
    nome: "Anziano",
    latino: "Senior",
    xpMin: 3000,
    xpMax: 5999,
    descrizione: "Guidi altri con la tua presenza più che con le parole.",
  },
  {
    grado: 7,
    nome: "Abate",
    latino: "Abbas",
    xpMin: 6000,
    xpMax: Infinity,
    descrizione: "Custode della comunità. Tutto è affidato a te e a Dio.",
  },
];

const GRADI_UMILTA_META = [
  { icona: "🕯️", nome: "Il Timore", soglia: "Primo check-in" },
  { icona: "🌿", nome: "Il Volere", soglia: "3 giorni di streak" },
  { icona: "📜", nome: "L'Obbedienza", soglia: "3 Lectio + 1 Capitolo" },
  { icona: "⌛", nome: "La Pazienza", soglia: "7 giorni di streak" },
  { icona: "✍️", nome: "La Confessione", soglia: "5 voci nel Libro" },
  { icona: "🙏", nome: "Il Contentarsi", soglia: "30 check-in totali" },
  { icona: "🌑", nome: "L'Infimo", soglia: "14 giorni di streak" },
  { icona: "📖", nome: "La Regula", soglia: "4 capitoli letti" },
  { icona: "🤫", nome: "Il Silenzio", soglia: "100 check-in totali" },
  { icona: "🏛️", nome: "La Custodia", soglia: "10 Lectio lette" },
  { icona: "🗝️", nome: "La Parola", soglia: "20 voci nel Libro" },
  { icona: "✝️", nome: "Il Cuore", soglia: "30 giorni di streak" },
];

const VIRTU = [
  { key: "xpPreghiera", nome: "Preghiera", angolo: 90 },
  { key: "xpLavoro", nome: "Lavoro", angolo: 30 },
  { key: "xpSilenzio", nome: "Silenzio", angolo: 330 },
  { key: "xpUmilta", nome: "Umiltà", angolo: 270 },
  { key: "xpOspitalita", nome: "Ospitalità", angolo: 210 },
  { key: "xpStabilitas", nome: "Stabilitas", angolo: 150 },
];

// ── Sub-components ───────────────────────────────────────────────────────────

function EsagrammaVirtu({ profilo }: { profilo: Record<string, number> }) {
  const maxXp = Math.max(...VIRTU.map((v) => profilo[v.key] ?? 0), 50);
  const cx = 160;
  const cy = 160;
  const r = 110;

  const points = VIRTU.map((v) => {
    const val = profilo[v.key] ?? 0;
    const ratio = Math.min(val / maxXp, 1);
    const rad = ((v.angolo - 90) * Math.PI) / 180;
    return {
      x: cx + r * ratio * Math.cos(rad),
      y: cy + r * ratio * Math.sin(rad),
      labelX: cx + (r + 30) * Math.cos(rad),
      labelY: cy + (r + 30) * Math.sin(rad),
      nome: v.nome,
      val,
    };
  });

  const polyStr = points.map((p) => `${p.x},${p.y}`).join(" ");

  return (
    <svg viewBox="0 0 320 320" className="w-full max-w-xs mx-auto">
      {/* Concentric grid hexagons */}
      {[0.25, 0.5, 0.75, 1].map((frac, fi) => (
        <polygon
          key={frac}
          points={VIRTU.map((v) => {
            const rad = ((v.angolo - 90) * Math.PI) / 180;
            return `${cx + r * frac * Math.cos(rad)},${cy + r * frac * Math.sin(rad)}`;
          }).join(" ")}
          fill="none"
          stroke={fi === 3 ? "rgba(180,150,100,0.2)" : "rgba(180,150,100,0.1)"}
          strokeWidth={fi === 3 ? "1" : "0.5"}
        />
      ))}
      {/* Axis spokes */}
      {VIRTU.map((v) => {
        const rad = ((v.angolo - 90) * Math.PI) / 180;
        return (
          <line
            key={v.key}
            x1={cx} y1={cy}
            x2={cx + r * Math.cos(rad)}
            y2={cy + r * Math.sin(rad)}
            stroke="rgba(180,150,100,0.15)"
            strokeWidth="0.75"
          />
        );
      })}
      {/* Fill polygon */}
      <polygon
        points={polyStr}
        fill="rgba(180,150,100,0.12)"
        stroke="rgba(180,150,100,0.7)"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      {/* Data points */}
      {points.map((p) => (
        <circle key={p.nome} cx={p.x} cy={p.y} r="4" fill="hsl(var(--primary))" />
      ))}
      {/* Labels */}
      {points.map((p) => (
        <text
          key={p.nome + "_l"}
          x={p.labelX}
          y={p.labelY}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize="8.5"
          fill="rgba(180,150,100,0.7)"
          fontFamily="sans-serif"
          letterSpacing="1"
        >
          {p.nome.toUpperCase()}
        </text>
      ))}
    </svg>
  );
}

function StreakCalendar({ streak, massimo }: { streak: number; massimo: number }) {
  // Last 21 days visual
  const days = Array.from({ length: 21 }, (_, i) => {
    const daysAgo = 20 - i;
    return daysAgo < streak;
  });

  return (
    <div>
      <div className="flex items-baseline gap-3 mb-4">
        <span className="font-serif text-5xl text-primary">{streak}</span>
        <div>
          <p className="text-[9px] uppercase tracking-[0.2em] text-muted-foreground">
            {streak === 1 ? "giorno" : "giorni"}
          </p>
          <p className="text-[9px] text-muted-foreground/50">
            record: {massimo}
          </p>
        </div>
      </div>
      {/* 21-day dot grid */}
      <div className="flex gap-1 flex-wrap">
        {days.map((active, i) => (
          <div
            key={i}
            className={`w-2.5 h-2.5 rounded-sm transition-colors ${
              active ? "bg-primary/80" : "bg-border/25"
            }`}
          />
        ))}
      </div>
      <p className="text-[9px] text-muted-foreground/40 mt-2">ultimi 21 giorni</p>
    </div>
  );
}

function OfficiumTimeline({
  checkInIds,
}: {
  checkInIds: Set<string>;
}) {
  const { ora: oraCorrente } = getOraCorrente();
  const now = new Date();
  const nowMin = now.getHours() * 60 + now.getMinutes();

  return (
    <div className="space-y-2">
      {ORE_CANONICHE.map((ora) => {
        const startMin = ora.oraInizio * 60 + ora.minutoInizio;
        const checked = checkInIds.has(ora.id);
        const isCurrent = ora.id === oraCorrente.id;
        const isPast = startMin < nowMin && !isCurrent;
        const isFuture = startMin > nowMin;

        return (
          <div
            key={ora.id}
            className={`flex items-center gap-3 transition-all ${
              isFuture ? "opacity-35" : ""
            }`}
          >
            {/* Status indicator */}
            <div className="flex-none w-5 flex justify-center">
              {checked ? (
                <div className="w-2.5 h-2.5 rounded-full bg-primary" />
              ) : isCurrent ? (
                <div className="w-2.5 h-2.5 rounded-full border-2 border-primary animate-pulse" />
              ) : (
                <div className="w-2 h-2 rounded-full border border-border/40" />
              )}
            </div>
            {/* Time */}
            <span className="font-mono text-[10px] text-muted-foreground/50 flex-none w-10">
              {String(ora.oraInizio).padStart(2, "0")}:
              {String(ora.minutoInizio).padStart(2, "0")}
            </span>
            {/* Icon + Name */}
            <span className="text-sm flex-none">{ora.icona}</span>
            <span
              className={`text-xs flex-1 ${
                isCurrent
                  ? "text-primary font-medium"
                  : checked
                  ? "text-foreground/60 line-through"
                  : "text-muted-foreground"
              }`}
            >
              {ora.nome}
            </span>
            {/* XP */}
            {checked && (
              <span className="text-[9px] text-primary/60 flex-none">+XP</span>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── Main page ────────────────────────────────────────────────────────────────

export default function OblatoDashboard() {
  const { user } = useAuth();
  const { data: profilo, isLoading } = useBGetOblatoProfilo();
  const { data: sigilli } = useBGetSigilli();
  const { data: checkInsOggi } = useBGetOfficiumOggi();

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="text-center max-w-sm">
          <p className="font-serif text-2xl mb-4 text-muted-foreground">
            Il cammino oblato ti aspetta
          </p>
          <p className="text-muted-foreground/60 text-sm mb-8 font-light leading-relaxed">
            Accedi per vedere il tuo profilo, i tuoi gradi e il tuo progresso nella Regola di San Benedetto.
          </p>
          <Link
            href="/login"
            className="border border-primary px-8 py-3 text-sm uppercase tracking-widest hover:bg-primary/10 transition-colors"
          >
            Accedi
          </Link>
        </div>
      </div>
    );
  }

  if (isLoading || !profilo) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border border-primary/40 border-t-primary rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground text-sm font-light">
            Apertura del cammino…
          </p>
        </div>
      </div>
    );
  }

  const grado = GRADI.find((g) => g.grado === profilo.grado) ?? GRADI[0];
  const gradoProssimo = GRADI.find((g) => g.grado === profilo.grado + 1);
  const xpPercentage = gradoProssimo
    ? Math.min(
        100,
        Math.round(
          ((profilo.xpTotale - grado.xpMin) /
            (gradoProssimo.xpMin - grado.xpMin)) *
            100
        )
      )
    : 100;

  const checkInIds = new Set((checkInsOggi ?? []).map((c) => c.oraId));
  const orePregate = checkInIds.size;

  const gradiSbloccati = Array.from({ length: 12 }, (_, i) =>
    (profilo.gradiUmiltaSbloccati & (1 << i)) !== 0
  );
  const gradiSbloccatiCount = gradiSbloccati.filter(Boolean).length;

  const profiloMap = profilo as unknown as Record<string, number>;

  const now = new Date();
  const dataFmt = now.toLocaleDateString("it-IT", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  return (
    <div className="min-h-screen bg-background">

      {/* ── I. HERO ─────────────────────────────────────────────────── */}
      <section className="border-b border-border/40 py-20 px-6">
        <div className="container mx-auto max-w-5xl">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
            {/* Left: Identity */}
            <div>
              <p className="text-[9px] uppercase tracking-[0.5em] text-muted-foreground/60 mb-4">
                Cursus Oblati — {dataFmt}
              </p>
              <h1 className="font-serif text-4xl lg:text-6xl text-foreground mb-2 leading-none">
                {user.name}
              </h1>
              <div className="flex items-baseline gap-4 mt-4">
                <p className="font-serif text-2xl text-primary">{grado.nome}</p>
                <span className="text-muted-foreground/30">·</span>
                <p className="text-muted-foreground italic text-sm">{grado.latino}</p>
              </div>
              <p className="text-muted-foreground/60 text-sm mt-2 font-light max-w-sm">
                {grado.descrizione}
              </p>
            </div>

            {/* Right: XP + Progress */}
            <div className="lg:text-right lg:min-w-[280px]">
              <div className="flex lg:flex-row-reverse items-baseline gap-3 mb-4">
                <span className="font-serif text-4xl text-foreground">{profilo.xpTotale}</span>
                <span className="text-[9px] uppercase tracking-widest text-muted-foreground">XP totali</span>
              </div>

              {/* Progress bar */}
              <div className="h-px bg-border/30 w-full mb-2">
                <div
                  className="h-full bg-primary transition-all duration-700"
                  style={{ width: `${xpPercentage}%` }}
                />
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[9px] text-primary">{grado.nome}</span>
                {gradoProssimo ? (
                  <span className="text-[9px] text-muted-foreground/50">
                    {profilo.xpAlProssimoGrado} XP → {gradoProssimo.nome}
                  </span>
                ) : (
                  <span className="text-[9px] text-primary">Grado massimo</span>
                )}
              </div>

              {/* Journey nodes */}
              <div className="flex lg:justify-end gap-3 mt-5">
                {GRADI.map((g) => (
                  <div key={g.grado} className="flex flex-col items-center gap-1.5">
                    <div
                      className={`w-1.5 h-1.5 rounded-full transition-all ${
                        g.grado < profilo.grado
                          ? "bg-primary/40"
                          : g.grado === profilo.grado
                          ? "bg-primary ring-2 ring-primary/20 ring-offset-1 ring-offset-background"
                          : "bg-border/30"
                      }`}
                    />
                    <span className={`text-[7px] uppercase tracking-wide hidden sm:block ${
                      g.grado === profilo.grado ? "text-primary" : "text-muted-foreground/25"
                    }`}>
                      {g.nome.slice(0, 3)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── II. OGGI ────────────────────────────────────────────────── */}
      <section className="border-b border-border/40 py-16 px-6">
        <div className="container mx-auto max-w-5xl">
          <p className="text-[9px] uppercase tracking-[0.5em] text-muted-foreground/60 mb-10">
            II — Oggi
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Officium timeline */}
            <div className="lg:col-span-2">
              <div className="flex items-center justify-between mb-5">
                <p className="text-xs text-muted-foreground uppercase tracking-widest">
                  Officium Divinum
                </p>
                <Link
                  href="/officium"
                  className="text-[10px] uppercase tracking-widest text-primary hover:text-primary/70 transition-colors"
                >
                  Vai all'Officium →
                </Link>
              </div>
              <OfficiumTimeline checkInIds={checkInIds} />
              <div className="mt-4 flex items-center gap-3">
                <div className="flex-1 h-px bg-border/20" />
                <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 ${
                  orePregate === 8
                    ? "text-primary border border-primary/30 bg-primary/5"
                    : "text-muted-foreground/40"
                }`}>
                  {orePregate === 8 ? "✦ Laus Deo — Officium completo" : `${orePregate} / 8 ore`}
                </span>
                <div className="flex-1 h-px bg-border/20" />
              </div>
            </div>

            {/* Streak + CTAs */}
            <div className="space-y-6">
              {/* Streak */}
              <div className="border border-border/40 p-5">
                <p className="text-[9px] uppercase tracking-[0.3em] text-muted-foreground mb-4">
                  Stabilitas
                </p>
                <StreakCalendar streak={profilo.streakCorrente} massimo={profilo.streakMassimo} />
              </div>

              {/* Quick actions */}
              <div className="space-y-2">
                <Link
                  href="/capitolo"
                  className="flex items-center gap-3 border border-border/40 hover:border-primary/30 px-4 py-3 transition-all group"
                >
                  <span className="text-lg flex-none">📖</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs uppercase tracking-wider text-muted-foreground group-hover:text-primary transition-colors">
                      Capitolo
                    </p>
                    <p className="text-[9px] text-muted-foreground/40">Lettura settimanale · +20 XP</p>
                  </div>
                  <span className="text-muted-foreground/30 group-hover:text-primary/50 transition-colors text-xs">→</span>
                </Link>
                <Link
                  href="/esame"
                  className="flex items-center gap-3 border border-border/40 hover:border-primary/30 px-4 py-3 transition-all group"
                >
                  <span className="text-lg flex-none">✍️</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs uppercase tracking-wider text-muted-foreground group-hover:text-primary transition-colors">
                      Esame di coscienza
                    </p>
                    <p className="text-[9px] text-muted-foreground/40">3 domande · +5 XP</p>
                  </div>
                  <span className="text-muted-foreground/30 group-hover:text-primary/50 transition-colors text-xs">→</span>
                </Link>
                <Link
                  href="/lectio"
                  className="flex items-center gap-3 border border-border/40 hover:border-primary/30 px-4 py-3 transition-all group"
                >
                  <span className="text-lg flex-none">📜</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs uppercase tracking-wider text-muted-foreground group-hover:text-primary transition-colors">
                      Lectio Divina
                    </p>
                    <p className="text-[9px] text-muted-foreground/40">Lettura guidata</p>
                  </div>
                  <span className="text-muted-foreground/30 group-hover:text-primary/50 transition-colors text-xs">→</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── III. LE SEI VIRTÙ ───────────────────────────────────────── */}
      <section className="border-b border-border/40 py-16 px-6">
        <div className="container mx-auto max-w-5xl">
          <p className="text-[9px] uppercase tracking-[0.5em] text-muted-foreground/60 mb-10">
            III — Le Sei Virtù
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Hexagram */}
            <EsagrammaVirtu profilo={profiloMap} />

            {/* Virtue breakdown */}
            <div className="space-y-4">
              {VIRTU.map((v) => {
                const val = profiloMap[v.key] ?? 0;
                const maxVal = Math.max(...VIRTU.map((x) => profiloMap[x.key] ?? 0), 1);
                const pct = Math.min(100, Math.round((val / maxVal) * 100));
                return (
                  <div key={v.key}>
                    <div className="flex justify-between items-baseline mb-1.5">
                      <span className="text-xs uppercase tracking-widest text-muted-foreground">
                        {v.nome}
                      </span>
                      <span className="font-serif text-primary text-sm">{val}</span>
                    </div>
                    <div className="h-px bg-border/20 w-full">
                      <div
                        className="h-full bg-primary/60 transition-all duration-700"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
              <p className="text-[9px] text-muted-foreground/40 pt-2 font-light italic">
                Le virtù crescono con ogni pratica: preghiera, lavoro, silenzio, 
                umiltà, ospitalità, stabilitas.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── IV. LA SCALA DELL'UMILTÀ ────────────────────────────────── */}
      <section className="border-b border-border/40 py-16 px-6">
        <div className="container mx-auto max-w-5xl">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-[9px] uppercase tracking-[0.5em] text-muted-foreground/60 mb-2">
                IV — La Scala dell'Umiltà
              </p>
              <p className="text-muted-foreground/50 text-xs font-light italic">
                Regola di San Benedetto, Cap. 7
              </p>
            </div>
            <p className="text-sm font-serif text-primary">
              {gradiSbloccatiCount} / 12
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {GRADI_UMILTA_META.map((g, i) => {
              const sbloccato = gradiSbloccati[i];
              const numeri = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII"];

              return (
                <div
                  key={i}
                  className={`relative flex flex-col p-4 border transition-all ${
                    sbloccato
                      ? "border-primary/30 bg-primary/5 hover:bg-primary/8"
                      : "border-border/20"
                  }`}
                >
                  {/* Number */}
                  <span
                    className={`font-serif text-xs mb-3 ${
                      sbloccato ? "text-primary/50" : "text-border/30"
                    }`}
                  >
                    {numeri[i]}
                  </span>

                  {/* Icon */}
                  <span className={`text-2xl mb-2 ${!sbloccato ? "opacity-15 grayscale" : ""}`}>
                    {g.icona}
                  </span>

                  {/* Name */}
                  <p
                    className={`text-xs leading-tight mb-1 ${
                      sbloccato ? "text-foreground/80" : "text-muted-foreground/25"
                    }`}
                  >
                    {g.nome}
                  </p>

                  {/* Soglia (condition) */}
                  <p
                    className={`text-[8px] leading-tight mt-auto pt-2 ${
                      sbloccato ? "text-primary/40" : "text-muted-foreground/20"
                    }`}
                  >
                    {sbloccato ? "✓ Sbloccato" : g.soglia}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── V. CURSUS — Stats ───────────────────────────────────────── */}
      <section className={`border-b border-border/40 py-16 px-6 ${sigilli && sigilli.length > 0 ? "" : ""}`}>
        <div className="container mx-auto max-w-5xl">
          <p className="text-[9px] uppercase tracking-[0.5em] text-muted-foreground/60 mb-10">
            V — Cursus
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-border/20">
            {[
              { label: "Check-in totali", val: profilo.checkInTotali, sub: "Officium" },
              { label: "Lectio lette", val: profilo.lectioCompletate, sub: "Lectio Divina" },
              { label: "Capitoli meditati", val: profilo.capitoliLetti, sub: "Regola" },
              { label: "Esami completati", val: profilo.esamiCompletati, sub: "Coscienza" },
            ].map((stat) => (
              <div key={stat.label} className="bg-background p-6 text-center">
                <p className="font-serif text-4xl text-foreground mb-1">{stat.val}</p>
                <p className="text-[9px] uppercase tracking-widest text-muted-foreground/60">
                  {stat.label}
                </p>
                <p className="text-[8px] text-muted-foreground/30 mt-0.5 italic">{stat.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── VI. SIGILLI ─────────────────────────────────────────────── */}
      {sigilli && sigilli.length > 0 && (
        <section className="border-b border-border/40 py-16 px-6">
          <div className="container mx-auto max-w-5xl">
            <p className="text-[9px] uppercase tracking-[0.5em] text-muted-foreground/60 mb-10">
              VI — Sigilli Guadagnati
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {sigilli.map((s) => (
                <div
                  key={s.id}
                  className="flex gap-4 border border-primary/20 bg-primary/5 p-4 hover:border-primary/40 transition-colors"
                >
                  <span className="text-3xl flex-none mt-0.5">{s.icona}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-serif text-primary mb-1 leading-tight">
                      {s.nome}
                    </p>
                    <p className="text-[10px] text-muted-foreground/60 leading-relaxed">
                      {s.descrizione}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-[9px] text-primary/50">+{s.xpValore} XP</span>
                      <span className="text-muted-foreground/20">·</span>
                      <span className="text-[9px] text-muted-foreground/30">
                        {new Date(s.sbloccatoIl).toLocaleDateString("it-IT", {
                          day: "numeric",
                          month: "short",
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Footer CTA ──────────────────────────────────────────────── */}
      <section className="py-16 px-6">
        <div className="container mx-auto max-w-5xl text-center">
          <p className="text-muted-foreground/40 text-xs font-light italic mb-4">
            «Nihil amori Christi praeponatur.»
          </p>
          <p className="text-[9px] uppercase tracking-[0.4em] text-muted-foreground/30">
            Regola di San Benedetto, Cap. 72
          </p>
        </div>
      </section>

    </div>
  );
}
