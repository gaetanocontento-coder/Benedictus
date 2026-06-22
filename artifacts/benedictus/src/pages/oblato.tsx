import { useAuth } from "@/lib/auth";
import { Link } from "wouter";
import {
  useBGetOblatoProfilo,
  useBGetSigilli,
  useBGetOfficiumOggi,
} from "@workspace/api-client-react";
import { ORE_CANONICHE } from "@/lib/liturgia";

const GRADI = [
  { grado: 1, nome: "Curioso", xpMin: 0, xpMax: 99, colore: "#8B7355" },
  { grado: 2, nome: "Postulante", xpMin: 100, xpMax: 299, colore: "#7A6A4F" },
  { grado: 3, nome: "Novizio", xpMin: 300, xpMax: 699, colore: "#6B5E48" },
  { grado: 4, nome: "Monaco", xpMin: 700, xpMax: 1499, colore: "#5C5040" },
  { grado: 5, nome: "Professo", xpMin: 1500, xpMax: 2999, colore: "#C4A882" },
  { grado: 6, nome: "Anziano", xpMin: 3000, xpMax: 5999, colore: "#D4B896" },
  { grado: 7, nome: "Abate", xpMin: 6000, xpMax: Infinity, colore: "#E8D5B0" },
];

const VIRTU = [
  { key: "xpPreghiera", nome: "Preghiera", icona: "🙏", angolo: 90 },
  { key: "xpLavoro", nome: "Lavoro", icona: "⚒️", angolo: 30 },
  { key: "xpSilenzio", nome: "Silenzio", icona: "🤫", angolo: 330 },
  { key: "xpUmilta", nome: "Umiltà", icona: "🌿", angolo: 270 },
  { key: "xpOspitalita", nome: "Ospitalità", icona: "🏛️", angolo: 210 },
  { key: "xpStabilitas", nome: "Stabilitas", icona: "⚓", angolo: 150 },
];

function EsagrammaVirtu({ profilo }: { profilo: Record<string, number> }) {
  const maxXp = Math.max(
    ...VIRTU.map((v) => profilo[v.key] ?? 0),
    100
  );
  const cx = 120;
  const cy = 120;
  const r = 90;

  const points = VIRTU.map((v) => {
    const val = profilo[v.key] ?? 0;
    const ratio = Math.min(val / maxXp, 1);
    const rad = ((v.angolo - 90) * Math.PI) / 180;
    return {
      x: cx + r * ratio * Math.cos(rad),
      y: cy + r * ratio * Math.sin(rad),
      label: { x: cx + (r + 24) * Math.cos(rad), y: cy + (r + 24) * Math.sin(rad) },
      icona: { x: cx + (r + 38) * Math.cos(rad), y: cy + (r + 38) * Math.sin(rad) },
      nome: v.nome,
      icona_char: v.icona,
      val,
    };
  });

  const polyStr = points.map((p) => `${p.x},${p.y}`).join(" ");

  // Background hexagon (max)
  const bgPoints = VIRTU.map((v) => {
    const rad = ((v.angolo - 90) * Math.PI) / 180;
    return `${cx + r * Math.cos(rad)},${cy + r * Math.sin(rad)}`;
  }).join(" ");

  return (
    <svg viewBox="0 0 240 240" className="w-full max-w-[240px] mx-auto">
      {/* Grid lines */}
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
      {/* Axis lines */}
      {VIRTU.map((v) => {
        const rad = ((v.angolo - 90) * Math.PI) / 180;
        return (
          <line
            key={v.key}
            x1={cx}
            y1={cy}
            x2={cx + r * Math.cos(rad)}
            y2={cy + r * Math.sin(rad)}
            stroke="currentColor"
            strokeWidth="0.5"
            className="text-border/30"
          />
        );
      })}
      {/* Filled area */}
      <polygon
        points={polyStr}
        fill="hsl(var(--primary) / 0.15)"
        stroke="hsl(var(--primary) / 0.6)"
        strokeWidth="1.5"
      />
      {/* Points */}
      {points.map((p) => (
        <circle key={p.nome} cx={p.x} cy={p.y} r="3" fill="hsl(var(--primary))" />
      ))}
      {/* Labels */}
      {points.map((p) => (
        <text
          key={p.nome + "_label"}
          x={p.label.x}
          y={p.label.y}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize="7"
          className="fill-muted-foreground font-sans"
        >
          {p.nome}
        </text>
      ))}
      {/* Icons */}
      {points.map((p) => (
        <text
          key={p.nome + "_icon"}
          x={p.icona.x}
          y={p.icona.y}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize="11"
        >
          {p.icona_char}
        </text>
      ))}
    </svg>
  );
}

function StreakFire({ streak }: { streak: number }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-3xl">🔥</span>
      <div>
        <p className="text-2xl font-serif text-primary">{streak}</p>
        <p className="text-[10px] uppercase tracking-widest text-muted-foreground">
          {streak === 1 ? "giorno" : "giorni"}
        </p>
      </div>
    </div>
  );
}

function OfficiumBadge({ oraId, checked }: { oraId: string; checked: boolean }) {
  const ora = ORE_CANONICHE.find((o) => o.id === oraId);
  if (!ora) return null;
  return (
    <div
      className={`flex flex-col items-center gap-1 p-2 border transition-all ${
        checked
          ? "border-primary/60 bg-primary/10 text-primary"
          : "border-border/30 text-muted-foreground/40"
      }`}
      title={ora.nome}
    >
      <span className="text-base">{ora.icona}</span>
      <span className="text-[8px] uppercase tracking-wider">
        {String(ora.oraInizio).padStart(2, "0")}:
        {String(ora.minutoInizio).padStart(2, "0")}
      </span>
    </div>
  );
}

export default function OblatoDashboard() {
  const { user } = useAuth();
  const { data: profilo, isLoading } = useBGetOblatoProfilo();
  const { data: sigilli } = useBGetSigilli();
  const { data: checkInsOggi } = useBGetOfficiumOggi();

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Devi accedere per vedere il tuo profilo oblato.</p>
          <Link href="/login" className="border border-primary px-6 py-2 text-sm uppercase tracking-widest hover:bg-primary/10 transition-colors">
            Accedi
          </Link>
        </div>
      </div>
    );
  }

  if (isLoading || !profilo) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground text-sm animate-pulse">Caricamento del cammino…</p>
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

  // XII Gradi bitmask
  const gradiSbloccati = Array.from({ length: 12 }, (_, i) =>
    (profilo.gradiUmiltaSbloccati & (1 << i)) !== 0
  );

  return (
    <div className="min-h-screen bg-background py-20">
      <div className="container mx-auto px-6 lg:px-12 max-w-5xl">

        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-[10px] uppercase tracking-[0.4em] text-primary mb-3">
            Il tuo cammino oblato
          </p>
          <h1 className="font-serif text-5xl lg:text-6xl mb-4">{user.name}</h1>
          <div className="inline-flex items-center gap-3 border border-primary/30 px-6 py-2">
            <span className="text-primary font-serif text-xl">{grado.nome}</span>
            <span className="text-muted-foreground/40">·</span>
            <span className="text-muted-foreground text-sm">{profilo.xpTotale} XP</span>
          </div>
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">

          {/* Esagramma virtù */}
          <div className="lg:col-span-1 border border-border/60 p-6 flex flex-col items-center">
            <p className="text-[9px] uppercase tracking-[0.3em] text-muted-foreground mb-4">
              Le Sei Virtù
            </p>
            <EsagrammaVirtu profilo={profilo as unknown as Record<string, number>} />
            <div className="grid grid-cols-3 gap-2 mt-4 w-full text-center">
              {VIRTU.map((v) => (
                <div key={v.key}>
                  <p className="text-xs font-serif text-primary">
                    {(profilo as unknown as Record<string, number>)[v.key] ?? 0}
                  </p>
                  <p className="text-[8px] text-muted-foreground uppercase tracking-wide">
                    {v.nome}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Centro: Grado + Streak + Stats */}
          <div className="lg:col-span-2 space-y-6">

            {/* Progressione grado */}
            <div className="border border-border/60 p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-[9px] uppercase tracking-[0.3em] text-muted-foreground mb-1">
                    Grado attuale
                  </p>
                  <h2 className="font-serif text-3xl text-primary">{grado.nome}</h2>
                </div>
                <div className="text-right">
                  {gradoProssimo && (
                    <>
                      <p className="text-[9px] uppercase tracking-widest text-muted-foreground">
                        Prossimo grado
                      </p>
                      <p className="font-serif text-lg text-muted-foreground">
                        {gradoProssimo.nome}
                      </p>
                      <p className="text-xs text-muted-foreground/60">
                        {profilo.xpAlProssimoGrado} XP mancanti
                      </p>
                    </>
                  )}
                </div>
              </div>

              {/* Progress bar */}
              <div className="h-1.5 bg-border/30 w-full">
                <div
                  className="h-full bg-primary transition-all duration-700"
                  style={{ width: `${xpPercentage}%` }}
                />
              </div>

              {/* Gradi timeline */}
              <div className="flex justify-between mt-3">
                {GRADI.map((g) => (
                  <div key={g.grado} className="flex flex-col items-center">
                    <div
                      className={`w-2 h-2 rounded-full mb-1 ${
                        g.grado <= profilo.grado
                          ? "bg-primary"
                          : "bg-border/30"
                      }`}
                    />
                    <span
                      className={`text-[7px] uppercase tracking-wide ${
                        g.grado === profilo.grado
                          ? "text-primary"
                          : "text-muted-foreground/40"
                      }`}
                    >
                      {g.nome.slice(0, 3)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Streak + Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="border border-border/60 p-5">
                <p className="text-[9px] uppercase tracking-[0.3em] text-muted-foreground mb-3">
                  Stabilitas
                </p>
                <StreakFire streak={profilo.streakCorrente} />
                <p className="text-xs text-muted-foreground mt-2">
                  Massimo: {profilo.streakMassimo} giorni
                </p>
              </div>

              <div className="border border-border/60 p-5">
                <p className="text-[9px] uppercase tracking-[0.3em] text-muted-foreground mb-3">
                  Cursus
                </p>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Check-in</span>
                    <span className="text-foreground font-serif">{profilo.checkInTotali}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Lectio</span>
                    <span className="text-foreground font-serif">{profilo.lectioCompletate}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Capitoli</span>
                    <span className="text-foreground font-serif">{profilo.capitoliLetti}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Esami</span>
                    <span className="text-foreground font-serif">{profilo.esamiCompletati}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Officium oggi */}
        <div className="border border-border/60 p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <p className="text-[9px] uppercase tracking-[0.3em] text-muted-foreground">
              Officium di oggi
            </p>
            <Link
              href="/officium"
              className="text-[10px] uppercase tracking-widest text-primary hover:text-primary/70 transition-colors"
            >
              Vai all'Officium →
            </Link>
          </div>
          <div className="grid grid-cols-8 gap-2">
            {ORE_CANONICHE.map((ora) => (
              <OfficiumBadge
                key={ora.id}
                oraId={ora.id}
                checked={checkInIds.has(ora.id)}
              />
            ))}
          </div>
          <p className="text-xs text-muted-foreground/50 mt-3 text-center">
            {checkInIds.size} / 8 ore pregate oggi
          </p>
        </div>

        {/* XII Gradi dell'Umiltà */}
        <div className="border border-border/60 p-6 mb-8">
          <p className="text-[9px] uppercase tracking-[0.3em] text-muted-foreground mb-6">
            XII Gradi dell'Umiltà — Regola Cap. 7
          </p>
          <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3">
            {Array.from({ length: 12 }, (_, i) => {
              const sbloccato = gradiSbloccati[i];
              return (
                <div
                  key={i}
                  className={`flex flex-col items-center p-3 border text-center transition-all ${
                    sbloccato
                      ? "border-primary/40 bg-primary/5"
                      : "border-border/20 opacity-40 grayscale"
                  }`}
                  title={sbloccato ? "Sbloccato" : "Da sbloccare"}
                >
                  <span className="text-xl mb-1">
                    {sbloccato ? ["🕯️","🌿","📜","⌛","✍️","🙏","🌑","📖","🤫","🏛️","🗝️","✝️"][i] : "◯"}
                  </span>
                  <span className="text-[8px] text-muted-foreground">
                    {["I","II","III","IV","V","VI","VII","VIII","IX","X","XI","XII"][i]} Grado
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Sigilli recenti */}
        {sigilli && sigilli.length > 0 && (
          <div className="border border-border/60 p-6 mb-8">
            <p className="text-[9px] uppercase tracking-[0.3em] text-muted-foreground mb-4">
              Sigilli guadagnati
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {sigilli.slice(0, 6).map((s) => (
                <div key={s.id} className="flex items-start gap-3 border border-primary/20 p-3 bg-primary/5">
                  <span className="text-2xl flex-none">{s.icona}</span>
                  <div>
                    <p className="text-xs font-serif text-primary leading-tight">{s.nome}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5 leading-tight line-clamp-2">
                      {s.descrizione}
                    </p>
                    <p className="text-[9px] text-primary/60 mt-1">+{s.xpValore} XP</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Azioni rapide */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link
            href="/officium"
            className="border border-border hover:border-primary/40 p-5 text-center group transition-all"
          >
            <p className="text-2xl mb-2">🔔</p>
            <p className="text-xs uppercase tracking-widest text-muted-foreground group-hover:text-primary transition-colors">
              Officium
            </p>
            <p className="text-[10px] text-muted-foreground/60 mt-1">Check-in ore canoniche</p>
          </Link>
          <Link
            href="/capitolo"
            className="border border-border hover:border-primary/40 p-5 text-center group transition-all"
          >
            <p className="text-2xl mb-2">📖</p>
            <p className="text-xs uppercase tracking-widest text-muted-foreground group-hover:text-primary transition-colors">
              Capitolo
            </p>
            <p className="text-[10px] text-muted-foreground/60 mt-1">Lettura settimanale</p>
          </Link>
          <Link
            href="/esame"
            className="border border-border hover:border-primary/40 p-5 text-center group transition-all"
          >
            <p className="text-2xl mb-2">✍️</p>
            <p className="text-xs uppercase tracking-widest text-muted-foreground group-hover:text-primary transition-colors">
              Esame
            </p>
            <p className="text-[10px] text-muted-foreground/60 mt-1">Esame di coscienza</p>
          </Link>
        </div>

      </div>
    </div>
  );
}
