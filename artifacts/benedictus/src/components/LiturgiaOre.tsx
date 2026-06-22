import { useState, useEffect, useRef, useCallback } from "react";
import { Bell, BellOff, X } from "lucide-react";
import {
  ORE_CANONICHE,
  getOraCorrente,
  formatMinuti,
  suonaCampana,
  suonaCampanaOrologio,
  suonaMezzoOra,
  isOraCanonica,
  type OraCanonica,
} from "@/lib/liturgia";

// ── Helpers ───────────────────────────────────────────────────────────────────

function prossimaCampanaOrologio(): { label: string; minuti: number } {
  const now = new Date();
  const h = now.getHours();
  const m = now.getMinutes();

  // Next :00 or :30
  let nextH = h;
  let nextM: number;

  if (m < 30) {
    nextM = 30;
  } else {
    nextM = 0;
    nextH = (h + 1) % 24;
  }

  const minuti = (nextH * 60 + nextM) - (h * 60 + m);
  const colpi = nextM === 0 ? (nextH % 12 || 12) : 1;
  const tipo = nextM === 0
    ? `${String(nextH).padStart(2, "0")}:00 · ${colpi} ${colpi === 1 ? "rintocco" : "rintocchi"}`
    : `${String(nextH).padStart(2, "0")}:30 · 1 rintocco`;

  return { label: tipo, minuti };
}

// ── Notification modal ────────────────────────────────────────────────────────

function NotificaOra({ ora, onClose }: { ora: OraCanonica; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-md bg-card border border-primary/30 shadow-2xl animate-in zoom-in-95 fade-in duration-500">
        <div className="bg-primary/5 border-b border-primary/20 px-8 py-6 text-center">
          <div className="relative inline-flex items-center justify-center mb-4">
            <div className="w-14 h-14 rounded-full border border-primary/40 flex items-center justify-center">
              <span className="text-2xl">{ora.icona}</span>
            </div>
            <span className="absolute inset-0 rounded-full border border-primary/20 animate-ping opacity-40" />
          </div>
          <p className="text-[10px] uppercase tracking-[0.3em] text-primary mb-1">È l'ora di</p>
          <h2 className="text-3xl font-serif text-foreground">{ora.nome}</h2>
          <p className="text-sm text-muted-foreground font-light italic mt-1">{ora.latino}</p>
        </div>

        <div className="px-8 py-6 space-y-5">
          <p className="text-muted-foreground font-light leading-relaxed text-sm">{ora.monaci}</p>
          <div className="border-l-2 border-primary/30 pl-4 py-1">
            <p className="text-foreground font-light leading-relaxed text-sm italic">{ora.invito}</p>
          </div>
          <blockquote className="text-center text-xs text-muted-foreground/60 font-light italic pt-2 border-t border-border/40">
            «{ora.citazione}»
            <br />
            <span className="not-italic text-[10px] tracking-widest uppercase text-muted-foreground/40 mt-1 inline-block">
              {ora.citazioneFonte}
            </span>
          </blockquote>
        </div>

        <div className="px-8 pb-6">
          <button
            onClick={onClose}
            className="w-full py-3 border border-border text-muted-foreground hover:border-primary/40 hover:text-primary transition-colors text-xs uppercase tracking-widest"
          >
            Continua il cammino
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Schedule panel ────────────────────────────────────────────────────────────

function SchedulePanel({
  corrente,
  mutato,
  onToggleMute,
  onClose,
}: {
  corrente: OraCanonica;
  mutato: boolean;
  onToggleMute: () => void;
  onClose: () => void;
}) {
  const now = new Date();
  const nowMin = now.getHours() * 60 + now.getMinutes();
  const prossima = prossimaCampanaOrologio();

  return (
    <div className="bg-card border border-primary/20 shadow-2xl w-80 max-h-[80vh] overflow-y-auto animate-in slide-in-from-bottom-3 fade-in duration-200">

      {/* Header */}
      <div className="px-5 pt-4 pb-3 flex items-center justify-between border-b border-border/40 sticky top-0 bg-card z-10">
        <div>
          <p className="text-[9px] uppercase tracking-[0.25em] text-muted-foreground">
            Liturgia delle Ore
          </p>
          <p className="text-xs text-primary font-serif italic mt-0.5">Regula Benedicti</p>
        </div>
        <div className="flex items-center gap-2">
          {/* Mute toggle */}
          <button
            onClick={onToggleMute}
            title={mutato ? "Attiva campane" : "Silenzia campane"}
            className={`flex items-center gap-1.5 px-2 py-1 border text-[9px] uppercase tracking-widest transition-colors ${
              mutato
                ? "border-muted-foreground/20 text-muted-foreground/40 hover:border-primary/30 hover:text-primary/60"
                : "border-primary/30 text-primary/70 hover:border-primary hover:text-primary"
            }`}
          >
            {mutato
              ? <BellOff className="w-3 h-3" />
              : <Bell className="w-3 h-3" />
            }
            <span>{mutato ? "Silenzio" : "Campane"}</span>
          </button>

          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Prossima campana orologio */}
      {!mutato && (
        <div className="px-5 py-3 border-b border-border/30 bg-primary/3">
          <p className="text-[9px] uppercase tracking-widest text-primary/50 mb-1">
            Prossima campana dell'orologio
          </p>
          <p className="text-xs text-foreground/70 font-mono">{prossima.label}</p>
          <p className="text-[9px] text-muted-foreground/50 mt-0.5">
            tra {prossima.minuti} {prossima.minuti === 1 ? "minuto" : "minuti"}
          </p>
        </div>
      )}

      {/* Ore canoniche */}
      <div className="py-3">
        {ORE_CANONICHE.map((ora, i) => {
          const startMin = ora.oraInizio * 60 + ora.minutoInizio;
          const nextOra = ORE_CANONICHE[(i + 1) % ORE_CANONICHE.length];
          const nextMin = nextOra.oraInizio * 60 + nextOra.minutoInizio;
          const endMin = nextMin > startMin ? nextMin : nextMin + 24 * 60;
          const active = ora.id === corrente.id;
          const past = nowMin > startMin && !active;

          return (
            <div
              key={ora.id}
              className={`px-5 py-3 flex gap-4 items-start border-l-2 mx-3 mb-1 transition-colors ${
                active
                  ? "border-primary bg-primary/5"
                  : past
                  ? "border-border/30 opacity-50"
                  : "border-border/0"
              }`}
            >
              <div className="flex-none text-right w-14">
                <p className="text-[10px] text-muted-foreground font-mono">
                  {String(ora.oraInizio).padStart(2, "0")}:
                  {String(ora.minutoInizio).padStart(2, "0")}
                </p>
                <p className="text-base mt-0.5">{ora.icona}</p>
              </div>

              <div className="flex-1 min-w-0">
                <p className={`text-sm font-serif ${active ? "text-primary" : "text-foreground"}`}>
                  {ora.nome}
                </p>
                <p className="text-[10px] text-muted-foreground/60 italic">{ora.latino}</p>
                {active && (
                  <p className="text-[10px] text-muted-foreground mt-1 leading-relaxed line-clamp-2">
                    {ora.monaci.slice(0, 100)}…
                  </p>
                )}
              </div>

              <div className="flex-none">
                {Array.from({ length: Math.min(ora.campane, 3) }).map((_, k) => (
                  <span
                    key={k}
                    className={`text-[8px] ${active ? "text-primary" : "text-muted-foreground/30"}`}
                  >
                    ◆
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Legenda campane */}
      <div className="px-5 pb-4 pt-3 border-t border-border/30">
        <p className="text-[9px] uppercase tracking-widest text-primary/40 mb-2">Campane dell'orologio</p>
        <div className="space-y-1.5">
          <div className="flex items-start gap-2">
            <span className="text-[9px] font-mono text-primary/50 w-8 flex-none">:00</span>
            <p className="text-[9px] text-muted-foreground/60">
              N rintocchi (formato 12h) — campana più piena (E4)
            </p>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-[9px] font-mono text-primary/50 w-8 flex-none">:30</span>
            <p className="text-[9px] text-muted-foreground/60">
              1 rintocco lieve — campana più alta (G4)
            </p>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-[9px] font-mono text-primary/50 w-8 flex-none">Ore</span>
            <p className="text-[9px] text-muted-foreground/60">
              Campana profonda (D4) per le ore canoniche
            </p>
          </div>
        </div>
      </div>

      {/* Current ora detail */}
      <div className="px-5 pb-5 border-t border-border/40 pt-4">
        <p className="text-[9px] uppercase tracking-widest text-primary mb-2">In questo momento</p>
        <p className="text-xs text-muted-foreground font-light leading-relaxed">{corrente.invito}</p>
      </div>
    </div>
  );
}

// ── Main floating widget ──────────────────────────────────────────────────────

export function LiturgiaOre() {
  const [open, setOpen]       = useState(false);
  const [notifica, setNotifica] = useState<OraCanonica | null>(null);
  const [stato, setStato]     = useState(() => getOraCorrente());

  // Mute state — persisted in localStorage
  const [mutato, setMutato] = useState(() => {
    try { return localStorage.getItem("b-campane-mute") === "true"; }
    catch { return false; }
  });
  const muteRef = useRef(mutato);
  muteRef.current = mutato;

  const lastOraId   = useRef<string>("");
  const lastHourKey = useRef<number>(-1);
  const lastHalfKey = useRef<number>(-1);

  const toggleMute = useCallback(() => {
    const next = !muteRef.current;
    setMutato(next);
    muteRef.current = next;
    try { localStorage.setItem("b-campane-mute", String(next)); } catch {}
  }, []);

  // ── State refresh every 30 s
  useEffect(() => {
    const tick = () => setStato(getOraCorrente());
    tick();
    const iv = setInterval(tick, 30_000);
    return () => clearInterval(iv);
  }, []);

  // ── Canonical hour transition detector (every 10 s)
  useEffect(() => {
    const iv = setInterval(() => {
      const fresh = getOraCorrente();
      const oraId = fresh.ora.id;
      if (lastOraId.current && lastOraId.current !== oraId) {
        if (!muteRef.current) suonaCampana(Math.min(fresh.ora.campane, 3));
        setNotifica(fresh.ora);
        lastOraId.current = oraId;
        setStato(fresh);
      }
    }, 10_000);
    return () => clearInterval(iv);
  }, []);

  // Seed lastOraId on first render
  useEffect(() => {
    lastOraId.current = getOraCorrente().ora.id;
  }, []);

  // ── Clock bells — 1-second precision timer
  useEffect(() => {
    const checkClock = () => {
      if (muteRef.current) return;

      const now = new Date();
      const h = now.getHours();
      const m = now.getMinutes();
      const s = now.getSeconds();

      // Only fire within the first 4 seconds of the minute to avoid drift issues
      if (s > 4) return;

      // Hourly bell at :00 — skip if a canonical hour starts here (canonical handles it)
      if (m === 0) {
        const key = h;
        if (key !== lastHourKey.current && !isOraCanonica(h, 0)) {
          lastHourKey.current = key;
          suonaCampanaOrologio(h, 0.28);
        }
      }

      // Half-hour bell at :30 — skip if a canonical hour starts here
      if (m === 30) {
        const key = h * 100 + 30;
        if (key !== lastHalfKey.current && !isOraCanonica(h, 30)) {
          lastHalfKey.current = key;
          suonaMezzoOra(0.22);
        }
      }
    };

    const iv = setInterval(checkClock, 1_000);
    return () => clearInterval(iv);
  }, []);

  // ── Widget open/close
  const handleBellClick = useCallback(() => {
    if (open) {
      setOpen(false);
    } else {
      if (!muteRef.current) suonaCampana(1, 0.15);
      setOpen(true);
    }
  }, [open]);

  const { ora } = stato;

  return (
    <>
      {/* Canonical hour notification modal */}
      {notifica && <NotificaOra ora={notifica} onClose={() => setNotifica(null)} />}

      {/* Floating widget — bottom left */}
      <div className="fixed bottom-7 left-7 z-50 flex flex-col items-start gap-3">
        {open && (
          <SchedulePanel
            corrente={ora}
            mutato={mutato}
            onToggleMute={toggleMute}
            onClose={() => setOpen(false)}
          />
        )}

        {/* FAB */}
        <button
          onClick={handleBellClick}
          title={mutato ? "Campane silenziate — clicca per aprire" : "Liturgia delle Ore"}
          className={`group relative flex items-center gap-2.5 px-3 h-11 border transition-all duration-500 ${
            ora.notte
              ? "border-border/40 bg-card/70 hover:border-primary/30"
              : "border-border/60 bg-card/80 hover:border-primary/40"
          }`}
        >
          {mutato ? (
            <BellOff className="w-3.5 h-3.5 flex-none text-muted-foreground/40" />
          ) : (
            <Bell
              className={`w-3.5 h-3.5 flex-none transition-colors duration-300 ${
                notifica ? "text-primary" : "text-muted-foreground group-hover:text-primary"
              }`}
            />
          )}

          <div className="flex flex-col items-start leading-none">
            <span className="text-[9px] uppercase tracking-[0.2em] text-muted-foreground">
              {ora.latino}
            </span>
            <span className="text-[10px] text-foreground font-serif">{ora.nome}</span>
          </div>

          <span
            className={`w-1.5 h-1.5 rounded-full flex-none ${
              mutato ? "bg-muted-foreground/20" : ora.notte ? "bg-muted-foreground/20" : "bg-primary/40"
            }`}
          />
        </button>
      </div>
    </>
  );
}
