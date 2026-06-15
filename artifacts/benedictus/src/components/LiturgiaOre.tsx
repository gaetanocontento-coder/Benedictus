import { useState, useEffect, useRef, useCallback } from "react";
import { Bell, X, ChevronDown, ChevronUp } from "lucide-react";
import {
  ORE_CANONICHE,
  getOraCorrente,
  formatMinuti,
  suonaCampana,
  type OraCanonica,
} from "@/lib/liturgia";

/* ── Notification modal shown at hora transition ── */
function NotificaOra({
  ora,
  onClose,
}: {
  ora: OraCanonica;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-6">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-md bg-card border border-primary/30 shadow-2xl animate-in zoom-in-95 fade-in duration-500">
        {/* Bell pulse header */}
        <div className="bg-primary/5 border-b border-primary/20 px-8 py-6 text-center">
          <div className="relative inline-flex items-center justify-center mb-4">
            <div className="w-14 h-14 rounded-full border border-primary/40 flex items-center justify-center">
              <span className="text-2xl">{ora.icona}</span>
            </div>
            <span className="absolute inset-0 rounded-full border border-primary/20 animate-ping opacity-40" />
          </div>
          <p className="text-[10px] uppercase tracking-[0.3em] text-primary mb-1">
            È l'ora di
          </p>
          <h2 className="text-3xl font-serif text-foreground">{ora.nome}</h2>
          <p className="text-sm text-muted-foreground font-light italic mt-1">
            {ora.latino}
          </p>
        </div>

        {/* Content */}
        <div className="px-8 py-6 space-y-5">
          <p className="text-muted-foreground font-light leading-relaxed text-sm">
            {ora.monaci}
          </p>

          <div className="border-l-2 border-primary/30 pl-4 py-1">
            <p className="text-foreground font-light leading-relaxed text-sm italic">
              {ora.invito}
            </p>
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

/* ── Full schedule panel ── */
function SchedulePanel({
  corrente,
  onClose,
}: {
  corrente: OraCanonica;
  onClose: () => void;
}) {
  const now = new Date();
  const nowMin = now.getHours() * 60 + now.getMinutes();

  return (
    <div className="bg-card border border-primary/20 shadow-2xl w-80 max-h-[70vh] overflow-y-auto animate-in slide-in-from-bottom-3 fade-in duration-200">
      <div className="px-5 pt-4 pb-3 flex items-center justify-between border-b border-border/40 sticky top-0 bg-card z-10">
        <div>
          <p className="text-[9px] uppercase tracking-[0.25em] text-muted-foreground">
            Liturgia delle Ore
          </p>
          <p className="text-xs text-primary font-serif italic mt-0.5">
            Regula Benedicti
          </p>
        </div>
        <button
          onClick={onClose}
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="py-3">
        {ORE_CANONICHE.map((ora, i) => {
          const startMin = ora.oraInizio * 60 + ora.minutoInizio;
          const nextOra = ORE_CANONICHE[(i + 1) % ORE_CANONICHE.length];
          const nextMin =
            nextOra.oraInizio * 60 + nextOra.minutoInizio;
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
              {/* Time + icon */}
              <div className="flex-none text-right w-14">
                <p className="text-[10px] text-muted-foreground font-mono">
                  {String(ora.oraInizio).padStart(2, "0")}:
                  {String(ora.minutoInizio).padStart(2, "0")}
                </p>
                <p className="text-base mt-0.5">{ora.icona}</p>
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p
                  className={`text-sm font-serif ${
                    active ? "text-primary" : "text-foreground"
                  }`}
                >
                  {ora.nome}
                </p>
                <p className="text-[10px] text-muted-foreground/60 italic">
                  {ora.latino}
                </p>
                {active && (
                  <p className="text-[10px] text-muted-foreground mt-1 leading-relaxed line-clamp-2">
                    {ora.monaci.slice(0, 100)}…
                  </p>
                )}
              </div>

              {/* Campane */}
              <div className="flex-none">
                {Array.from({ length: Math.min(ora.campane, 3) }).map(
                  (_, k) => (
                    <span
                      key={k}
                      className={`text-[8px] ${
                        active ? "text-primary" : "text-muted-foreground/30"
                      }`}
                    >
                      ◆
                    </span>
                  )
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Current ora detail */}
      <div className="px-5 pb-5 border-t border-border/40 pt-4 mx-1">
        <p className="text-[9px] uppercase tracking-widest text-primary mb-2">
          In questo momento
        </p>
        <p className="text-xs text-muted-foreground font-light leading-relaxed">
          {corrente.invito}
        </p>
      </div>
    </div>
  );
}

/* ── Main floating widget ── */
export function LiturgiaOre() {
  const [open, setOpen] = useState(false);
  const [notifica, setNotifica] = useState<OraCanonica | null>(null);
  const lastOraId = useRef<string>("");
  const [stato, setStato] = useState(() => getOraCorrente());

  // Refresh every 30 seconds
  useEffect(() => {
    const tick = () => setStato(getOraCorrente());
    tick();
    const iv = setInterval(tick, 30_000);
    return () => clearInterval(iv);
  }, []);

  // Detect hora transition
  useEffect(() => {
    const oraId = stato.ora.id;
    if (lastOraId.current && lastOraId.current !== oraId) {
      // New hora — ring the bell and show notification
      suonaCampana(Math.min(stato.ora.campane, 3));
      setNotifica(stato.ora);
    }
    lastOraId.current = oraId;
  }, [stato.ora.id]);

  // Check transitions every 10 seconds for precision
  useEffect(() => {
    const iv = setInterval(() => {
      const fresh = getOraCorrente();
      const oraId = fresh.ora.id;
      if (lastOraId.current && lastOraId.current !== oraId) {
        suonaCampana(Math.min(fresh.ora.campane, 3));
        setNotifica(fresh.ora);
        lastOraId.current = oraId;
        setStato(fresh);
      }
    }, 10_000);
    return () => clearInterval(iv);
  }, []);

  const handleBellClick = useCallback(() => {
    if (open) {
      setOpen(false);
    } else {
      // Play 1 quiet bell tap on open
      suonaCampana(1, 0.15);
      setOpen(true);
    }
  }, [open]);

  const { ora, prossima, minutiAlProssimo, progressPercent } = stato;

  return (
    <>
      {/* Transition notification modal */}
      {notifica && (
        <NotificaOra ora={notifica} onClose={() => setNotifica(null)} />
      )}

      {/* Floating widget — bottom left */}
      <div className="fixed bottom-7 left-7 z-50 flex flex-col items-start gap-3">
        {open && (
          <SchedulePanel corrente={ora} onClose={() => setOpen(false)} />
        )}

        {/* FAB */}
        <button
          onClick={handleBellClick}
          title="Liturgia delle Ore"
          className={`group relative flex items-center gap-2.5 px-3 h-11 border transition-all duration-500 ${
            ora.notte
              ? "border-border/40 bg-card/70 hover:border-primary/30"
              : "border-border/60 bg-card/80 hover:border-primary/40"
          }`}
        >
          {/* Bell icon */}
          <Bell
            className={`w-3.5 h-3.5 flex-none transition-colors duration-300 ${
              notifica ? "text-primary" : "text-muted-foreground group-hover:text-primary"
            }`}
          />

          {/* Current ora */}
          <div className="flex flex-col items-start leading-none">
            <span className="text-[9px] uppercase tracking-[0.2em] text-muted-foreground">
              {ora.latino}
            </span>
            <span className="text-[10px] text-foreground font-serif">
              {ora.nome}
            </span>
          </div>

          {/* Progress dot */}
          <span
            className={`w-1.5 h-1.5 rounded-full flex-none ${
              ora.notte ? "bg-muted-foreground/20" : "bg-primary/40"
            }`}
          />
        </button>
      </div>
    </>
  );
}
