import { useState, useEffect, useRef, useCallback } from "react";
import { Music, X, Play, Pause, SkipBack, SkipForward, List } from "lucide-react";

// ── Playlist ──────────────────────────────────────────────────────────────────
// All audio sourced from Internet Archive (archive.org) — public domain
// recordings from real monasteries. URLs verified via archive.org metadata API.

type Categoria = "Gregoriano" | "Lodi" | "Meditazione";

interface Track {
  url:      string;
  titolo:   string;
  autore:   string;
  categoria: Categoria;
}

const DL = "https://archive.org/download";

// Abbreviations for the archive.org item identifiers
const SA  = "BenedictimosdeSanAnselmo-CantosGregorianosMisaAngelis";
const KG  = "gregorianchantkergonan";
const LM_CC = "lost-in-meditation2/Classical Chamber Music - Meditative Gregorian Chants";
const LM_BM = "lost-in-meditation2/Benedictine Monks Of St. Michael Of Lourdes - The Best Of The Benedictine Monks Of St. Michael%27s";
const SR  = "78_salve-regina-tantum-ergo_benedictine-monks_gbia0455052b";

function u(item: string, file: string) {
  return `${DL}/${item}/${encodeURIComponent(file)}`;
}

const PLAYLIST: Track[] = [
  // ── Ordinario della Messa ──────────────────────────────────────────────────
  { url: u(SA, "Kyrie.mp3"),                          titolo: "Kyrie",                      autore: "Benedettini di San Anselmo",  categoria: "Gregoriano"  },
  { url: u(SA, "Gloria.mp3"),                         titolo: "Gloria in Excelsis Deo",     autore: "Benedettini di San Anselmo",  categoria: "Gregoriano"  },
  { url: u(SA, "Credo.mp3"),                          titolo: "Credo",                      autore: "Benedettini di San Anselmo",  categoria: "Gregoriano"  },
  { url: u(SA, "Sanctus.mp3"),                        titolo: "Sanctus",                    autore: "Benedettini di San Anselmo",  categoria: "Gregoriano"  },
  { url: u(SA, "Agnus Dei.mp3"),                      titolo: "Agnus Dei",                  autore: "Benedettini di San Anselmo",  categoria: "Gregoriano"  },
  // ── Mariani ────────────────────────────────────────────────────────────────
  { url: u(SR,  '"SALVE REGINA"; "TANTUM ERGO" - BENEDICTINE MONKS.mp3'), titolo: "Salve Regina & Tantum Ergo", autore: "Monaci Benedettini (78 rpm)", categoria: "Gregoriano" },
  { url: u(SA, "Regina coeli.mp3"),                   titolo: "Regina Coeli",               autore: "Benedettini di San Anselmo",  categoria: "Gregoriano"  },
  { url: u(SA, "Ave Maris Stella.mp3"),               titolo: "Ave Maris Stella",           autore: "Benedettini di San Anselmo",  categoria: "Gregoriano"  },
  { url: u(SA, "Ave Verum.mp3"),                      titolo: "Ave Verum",                  autore: "Benedettini di San Anselmo",  categoria: "Gregoriano"  },
  { url: u(LM_CC, "15 Anon- Ave Maria.mp3"),          titolo: "Ave Maria",                  autore: "Canto Gregoriano Monastico",  categoria: "Lodi"        },
  // ── Ore canoniche & Inni ───────────────────────────────────────────────────
  { url: u(SA, "Magnificat.mp3"),                     titolo: "Magnificat",                 autore: "Benedettini di San Anselmo",  categoria: "Lodi"        },
  { url: u(SA, "Paternoster.mp3"),                    titolo: "Pater Noster",               autore: "Benedettini di San Anselmo",  categoria: "Lodi"        },
  { url: u(SA, "Te Deum.mp3"),                        titolo: "Te Deum",                    autore: "Benedettini di San Anselmo",  categoria: "Lodi"        },
  { url: u(SA, "Veni Creator.mp3"),                   titolo: "Veni Creator Spiritus",      autore: "Benedettini di San Anselmo",  categoria: "Gregoriano"  },
  { url: u(KG,  "19 Hymn - Ave maris stella (Mode 1).mp3"), titolo: "Ave Maris Stella — Inno", autore: "Monaci di Kergonan",     categoria: "Lodi"        },
  { url: u(LM_BM, "07 Anon- Te Lucis Ante Terminum.mp3"), titolo: "Te Lucis Ante Terminum", autore: "Monaci di San Michele",    categoria: "Lodi"        },
  // ── Eucaristia & adorazione ────────────────────────────────────────────────
  { url: u(SA, "Tantum ergo.mp3"),                    titolo: "Tantum Ergo",                autore: "Benedettini di San Anselmo",  categoria: "Gregoriano"  },
  { url: u(SA, "O salutaris Hostia.mp3"),             titolo: "O Salutaris Hostia",         autore: "Benedettini di San Anselmo",  categoria: "Gregoriano"  },
  { url: u(SA, "Adoro Te devote.mp3"),                titolo: "Adoro Te Devote",            autore: "Benedettini di San Anselmo",  categoria: "Gregoriano"  },
  // ── Alleluia & offici ──────────────────────────────────────────────────────
  { url: u(SA, "Aleluia.mp3"),                        titolo: "Alleluia",                   autore: "Benedettini di San Anselmo",  categoria: "Gregoriano"  },
  { url: u(KG,  "05 Alleluia - Te martyrum (Mode 5).mp3"), titolo: "Alleluia — Te Martyrum", autore: "Monaci di Kergonan",      categoria: "Gregoriano"  },
  { url: u(KG,  "01 Introit - Salus autem (Mode 1).mp3"), titolo: "Introito — Salus Autem", autore: "Monaci di Kergonan",       categoria: "Gregoriano"  },
  // ── Meditazione ────────────────────────────────────────────────────────────
  { url: u(LM_CC, "02 Anon- Miserere.mp3"),           titolo: "Miserere",                   autore: "Canto Gregoriano Monastico",  categoria: "Meditazione" },
  { url: u(LM_CC, "06 Anon- Pange Lingua.mp3"),       titolo: "Pange Lingua",               autore: "Canto Gregoriano Monastico",  categoria: "Meditazione" },
  { url: u(LM_BM, "15 Anon- Veni Sancte Spiritus.mp3"), titolo: "Veni Sancte Spiritus",     autore: "Monaci di San Michele",       categoria: "Meditazione" },
  { url: u(LM_CC, "14 Anon- Tota Pulchra Es.mp3"),    titolo: "Tota Pulchra Es",            autore: "Canto Gregoriano Monastico",  categoria: "Meditazione" },
  { url: u(LM_BM, "03 Anon- In Paradisum Angeli.mp3"), titolo: "In Paradisum",              autore: "Monaci di San Michele",       categoria: "Meditazione" },
];

const CATEGORIA_COLORE: Record<Categoria, string> = {
  Gregoriano:  "text-amber-300/80",
  Lodi:        "text-emerald-300/80",
  Meditazione: "text-sky-300/80",
};

const BARS = [8, 14, 6, 18, 10, 16, 8, 13, 7, 15, 9, 17];

// ── Helpers ───────────────────────────────────────────────────────────────────

function fmtTime(sec: number): string {
  if (!isFinite(sec) || sec < 0) return "--:--";
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

// ── Component ─────────────────────────────────────────────────────────────────

export function AudioPlayer() {
  const [open, setOpen]               = useState(false);
  const [showPlaylist, setShowPlaylist] = useState(false);
  const [playing, setPlaying]         = useState(false);
  const [trackIndex, setTrackIndex]   = useState(0);
  const [progress, setProgress]       = useState(0);   // 0–1
  const [duration, setDuration]       = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef                      = useRef<HTMLAudioElement | null>(null);
  const playlistRef                   = useRef<HTMLDivElement>(null);

  // ── Audio element setup ───────────────────────────────────────────────────
  useEffect(() => {
    const audio = new Audio();
    audio.crossOrigin = "anonymous";
    audio.preload = "metadata";
    audio.src = PLAYLIST[0].url;
    audioRef.current = audio;

    const onPlay     = () => setPlaying(true);
    const onPause    = () => setPlaying(false);
    const onEnded    = () => goTo(trackIndex + 1);
    const onError    = () => goTo(trackIndex + 1);
    const onMeta     = () => setDuration(audio.duration);
    const onProgress = () => {
      setCurrentTime(audio.currentTime);
      if (audio.duration > 0) setProgress(audio.currentTime / audio.duration);
    };

    audio.addEventListener("play",        onPlay);
    audio.addEventListener("pause",       onPause);
    audio.addEventListener("ended",       onEnded);
    audio.addEventListener("error",       onError);
    audio.addEventListener("loadedmetadata", onMeta);
    audio.addEventListener("timeupdate",  onProgress);

    return () => {
      audio.pause();
      audio.removeEventListener("play",        onPlay);
      audio.removeEventListener("pause",       onPause);
      audio.removeEventListener("ended",       onEnded);
      audio.removeEventListener("error",       onError);
      audio.removeEventListener("loadedmetadata", onMeta);
      audio.removeEventListener("timeupdate",  onProgress);
      audioRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Rebuild "ended/error" listeners when trackIndex changes (avoid stale closure)
  const trackIndexRef = useRef(0);
  useEffect(() => { trackIndexRef.current = trackIndex; }, [trackIndex]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onEnded = () => goTo(trackIndexRef.current + 1);
    const onError = () => goTo(trackIndexRef.current + 1);
    audio.addEventListener("ended", onEnded);
    audio.addEventListener("error", onError);
    return () => {
      audio.removeEventListener("ended", onEnded);
      audio.removeEventListener("error", onError);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Navigation ────────────────────────────────────────────────────────────
  const goTo = useCallback((idx: number) => {
    const next = ((idx % PLAYLIST.length) + PLAYLIST.length) % PLAYLIST.length;
    setTrackIndex(next);
    trackIndexRef.current = next;
    setProgress(0);
    setCurrentTime(0);
    setDuration(0);
    const audio = audioRef.current;
    if (!audio) return;
    audio.src = PLAYLIST[next].url;
    audio.load();
    audio.play().catch(() => {});
    setTimeout(() => {
      const el = playlistRef.current?.querySelector(`[data-idx="${next}"]`);
      el?.scrollIntoView({ block: "nearest", behavior: "smooth" });
    }, 50);
  }, []);

  const toggle = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
    } else {
      audio.play().catch(() => {});
    }
  }, [playing]);

  const seek = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio || !isFinite(audio.duration)) return;
    const t = Number(e.target.value) * audio.duration;
    audio.currentTime = t;
    setCurrentTime(t);
    setProgress(Number(e.target.value));
  }, []);

  const track = PLAYLIST[trackIndex];

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">

      {/* ── Panel ─────────────────────────────────────────────────────── */}
      {open && (
        <div className="w-80 bg-[#1c1409] border border-[#3a2e1a] shadow-2xl flex flex-col animate-in slide-in-from-bottom-2 fade-in duration-200 overflow-hidden">

          {/* Header */}
          <div className="flex items-center justify-between px-4 pt-4 pb-3 border-b border-[#2e2410]">
            <div className="flex items-center gap-2">
              <Music className="w-3.5 h-3.5 text-amber-300/60" />
              <span className="text-[10px] uppercase tracking-[0.3em] text-amber-100/50">
                Musica Sacra
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowPlaylist(!showPlaylist)}
                title="Mostra playlist"
                className={`transition-colors ${showPlaylist ? "text-amber-300" : "text-amber-100/40 hover:text-amber-100/70"}`}
              >
                <List className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setOpen(false)}
                className="text-amber-100/40 hover:text-amber-100/80 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Now playing */}
          <div className="px-4 pt-4 pb-3">
            {/* Category + counter */}
            <div className="flex items-center justify-between mb-2">
              <span className={`text-[9px] uppercase tracking-wider font-medium ${CATEGORIA_COLORE[track.categoria]}`}>
                {track.categoria}
              </span>
              <span className="text-[9px] text-amber-100/30 tracking-widest">
                {trackIndex + 1} / {PLAYLIST.length}
              </span>
            </div>

            {/* Title + author */}
            <p className="text-amber-100 font-serif text-base leading-tight mb-0.5">
              {track.titolo}
            </p>
            <p className="text-[11px] text-amber-100/50 mb-3">
              {track.autore}
            </p>

            {/* Waveform visualizer */}
            <div className="flex items-end gap-[3px] h-6 mb-3">
              {BARS.map((h, i) => (
                <div
                  key={i}
                  className={`flex-1 rounded-full transition-colors ${
                    playing ? "bg-amber-300/50" : "bg-[#3a2e1a]"
                  }`}
                  style={{
                    height: playing ? `${h}px` : `${Math.round(h * 0.35)}px`,
                    animation: playing
                      ? `barDance ${0.5 + i * 0.07}s ease-in-out infinite alternate`
                      : "none",
                  }}
                />
              ))}
            </div>

            {/* Progress bar */}
            <div className="mb-3">
              <input
                type="range"
                min={0}
                max={1}
                step={0.001}
                value={progress}
                onChange={seek}
                className="w-full h-[2px] appearance-none bg-[#3a2e1a] cursor-pointer
                           [&::-webkit-slider-thumb]:appearance-none
                           [&::-webkit-slider-thumb]:w-2
                           [&::-webkit-slider-thumb]:h-2
                           [&::-webkit-slider-thumb]:rounded-full
                           [&::-webkit-slider-thumb]:bg-amber-300
                           [&::-webkit-slider-thumb]:cursor-pointer
                           accent-amber-300"
                style={{
                  background: `linear-gradient(to right, rgba(217,190,120,0.6) ${progress * 100}%, #3a2e1a ${progress * 100}%)`,
                }}
              />
              <div className="flex justify-between mt-1">
                <span className="text-[9px] text-amber-100/30 font-mono">{fmtTime(currentTime)}</span>
                <span className="text-[9px] text-amber-100/30 font-mono">{fmtTime(duration)}</span>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => goTo(trackIndex - 1)}
                className="w-9 h-9 flex items-center justify-center border border-[#3a2e1a] text-amber-100/50 hover:border-amber-300/30 hover:text-amber-100 transition-colors"
              >
                <SkipBack className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={toggle}
                className={`flex-1 h-9 flex items-center justify-center gap-2 text-[10px] uppercase tracking-widest transition-all border ${
                  playing
                    ? "border-amber-300/40 bg-amber-300/8 text-amber-300 hover:bg-amber-300/12"
                    : "border-[#3a2e1a] text-amber-100/60 hover:border-amber-300/30 hover:text-amber-100"
                }`}
              >
                {playing ? (
                  <><Pause className="w-3.5 h-3.5" /> Pausa</>
                ) : (
                  <><Play className="w-3.5 h-3.5" /> Ascolta</>
                )}
              </button>

              <button
                onClick={() => goTo(trackIndex + 1)}
                className="w-9 h-9 flex items-center justify-center border border-[#3a2e1a] text-amber-100/50 hover:border-amber-300/30 hover:text-amber-100 transition-colors"
              >
                <SkipForward className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* ── Playlist panel ─────────────────────────────────────────── */}
          {showPlaylist && (
            <div className="border-t border-[#2e2410]">
              <div ref={playlistRef} className="max-h-64 overflow-y-auto overscroll-contain">
                {PLAYLIST.map((t, i) => (
                  <button
                    key={i}
                    data-idx={i}
                    onClick={() => goTo(i)}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors border-b border-[#251d0e] last:border-0 ${
                      i === trackIndex ? "bg-amber-300/8" : "hover:bg-[#251d0e]"
                    }`}
                  >
                    {/* Play indicator */}
                    <div className="flex-none w-4 flex justify-center">
                      {i === trackIndex && playing ? (
                        <div className="flex items-end gap-px h-3">
                          {[3, 5, 2, 4].map((h, bi) => (
                            <div
                              key={bi}
                              className="w-px bg-amber-300/70 rounded-full"
                              style={{
                                height: `${h}px`,
                                animation: `barDance ${0.4 + bi * 0.1}s ease-in-out infinite alternate`,
                              }}
                            />
                          ))}
                        </div>
                      ) : i === trackIndex ? (
                        <div className="w-1.5 h-1.5 rounded-full bg-amber-300/70" />
                      ) : (
                        <span className="text-[9px] text-amber-100/25 font-mono">{i + 1}</span>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className={`text-[11px] leading-tight truncate ${
                        i === trackIndex ? "text-amber-100" : "text-amber-100/60"
                      }`}>
                        {t.titolo}
                      </p>
                      <p className="text-[9px] text-amber-100/30 truncate">{t.autore}</p>
                    </div>

                    {/* Category */}
                    <div className="flex-none text-right">
                      <p className={`text-[8px] ${CATEGORIA_COLORE[t.categoria]}`}>{t.categoria}</p>
                    </div>
                  </button>
                ))}
              </div>

              {/* Legend */}
              <div className="px-4 py-2 border-t border-[#2e2410] flex flex-wrap gap-x-3 gap-y-1">
                {(Object.entries(CATEGORIA_COLORE) as [Categoria, string][]).map(([cat, cls]) => (
                  <span key={cat} className={`text-[8px] ${cls} flex items-center gap-1`}>
                    <span className="w-1.5 h-1.5 rounded-full bg-current inline-block" />
                    {cat}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── FAB ──────────────────────────────────────────────────────── */}
      <button
        onClick={() => setOpen(!open)}
        title="Musica Sacra"
        className={`relative w-11 h-11 rounded-full flex items-center justify-center border transition-all duration-500 ${
          playing
            ? "border-amber-300/50 bg-amber-300/8 shadow-[0_0_20px_rgba(217,190,120,0.15)]"
            : "border-[#3a2e1a] bg-[#1c1409]/90 hover:border-amber-300/30"
        }`}
      >
        <Music className={`w-4 h-4 transition-colors duration-300 ${
          playing ? "text-amber-300" : "text-amber-100/50"
        }`} />
        {playing && (
          <span className="absolute inset-0 rounded-full border border-amber-300/20 animate-ping opacity-40" />
        )}
      </button>
    </div>
  );
}
