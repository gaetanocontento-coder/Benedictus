import { useState, useEffect, useRef } from "react";
import { Music, X, Play, Pause, SkipBack, SkipForward, List, ChevronDown } from "lucide-react";

declare global {
  interface Window {
    YT: {
      Player: new (
        el: HTMLDivElement,
        opts: {
          videoId: string;
          playerVars?: Record<string, number | string>;
          events?: {
            onReady?: () => void;
            onStateChange?: (e: { data: number }) => void;
            onError?: () => void;
          };
        }
      ) => {
        playVideo: () => void;
        pauseVideo: () => void;
        loadVideoById: (videoId: string) => void;
      };
      PlayerState: { PLAYING: number; ENDED: number };
    };
    onYouTubeIframeAPIReady: () => void;
  }
}

// ── Playlist ─────────────────────────────────────────────────────────────────

type Categoria = "Gregoriano" | "Polifonia" | "Meditazione" | "Lodi";

interface Track {
  id: string;
  titolo: string;
  autore: string;
  durata: string;
  categoria: Categoria;
}

const PLAYLIST: Track[] = [
  { id: "HFZImNz4BrE", titolo: "Credo",                       autore: "Monaci Benedettini",              durata: "1 h",    categoria: "Gregoriano"  },
  { id: "qi3eMo88oT4", titolo: "Sanctus",                     autore: "Monaci Benedettini",              durata: "1 h",    categoria: "Gregoriano"  },
  { id: "eGw5O62N2dE", titolo: "Antologia Gregoriana",        autore: "Coro Monastico Latino",           durata: "2 h",    categoria: "Gregoriano"  },
  { id: "Ed90FUyE4rM", titolo: "Messa in Canto Gregoriano",   autore: "Sacra Musica Corale",             durata: "1 h",    categoria: "Gregoriano"  },
  { id: "Cd0DniJLwDw", titolo: "Canti dal Monastero",         autore: "Canti Cattolici per la Preghiera", durata: "1 h",   categoria: "Gregoriano"  },
  { id: "D_jRfYPWNT0", titolo: "Alleluia di Pasqua",          autore: "Canti di Risurrezione",           durata: "90 min", categoria: "Lodi"        },
  { id: "s0rXNmu4jrg", titolo: "Kyrie Eleison",               autore: "Schola Gregoriana",               durata: "1 h",    categoria: "Gregoriano"  },
  { id: "Ic0fXJ_QvE0", titolo: "Ave Maria Gregoriana",        autore: "Coro Monastico",                  durata: "45 min", categoria: "Lodi"        },
  { id: "3Ls3_V5RtdU", titolo: "Vespri Monastici",            autore: "Benedettini di Solesmes",         durata: "1 h",    categoria: "Lodi"        },
  { id: "YPiTTB_H6Yk", titolo: "Hildegard von Bingen — Canti", autore: "Hildegard von Bingen",          durata: "1 h",    categoria: "Meditazione" },
  { id: "gW_d5b6f3RE", titolo: "Missa Papae Marcelli",        autore: "Palestrina",                      durata: "50 min", categoria: "Polifonia"   },
  { id: "wVIf0pEe52c", titolo: "Spem in Alium",               autore: "Thomas Tallis",                   durata: "12 min", categoria: "Polifonia"   },
  { id: "7xjZ2_yLmfA", titolo: "Lamentazioni di Geremia",     autore: "Charpentier",                     durata: "1 h",    categoria: "Meditazione" },
  { id: "5sAX9-4ZHb4", titolo: "Tabula Rasa",                 autore: "Arvo Pärt",                       durata: "55 min", categoria: "Meditazione" },
  { id: "4iOG3qQ8jzg", titolo: "Salve Regina",                autore: "Schola Cantorum",                 durata: "30 min", categoria: "Lodi"        },
  { id: "U75OV8lHFw4", titolo: "Completa — Notte Monastica",  autore: "Monaci di Norcia",                durata: "40 min", categoria: "Lodi"        },
  { id: "EG9hhk8JYEM", titolo: "Stabat Mater",                autore: "Pergolesi",                       durata: "35 min", categoria: "Polifonia"   },
  { id: "8gNrVHGF3sA", titolo: "Requiem",                     autore: "Tomás Luis de Victoria",          durata: "45 min", categoria: "Polifonia"   },
  { id: "i0EWm0GObXk", titolo: "Dies Irae",                   autore: "Canto Medievale",                 durata: "1 h",    categoria: "Meditazione" },
  { id: "3D5cIBiAiys", titolo: "Komm, süsser Tod",            autore: "J. S. Bach",                      durata: "30 min", categoria: "Meditazione" },
];

const CATEGORIA_COLORE: Record<Categoria, string> = {
  Gregoriano:  "text-amber-300/80",
  Polifonia:   "text-rose-300/80",
  Meditazione: "text-sky-300/80",
  Lodi:        "text-emerald-300/80",
};

const BARS = [8, 14, 6, 18, 10, 16, 8, 13, 7, 15, 9, 17];

// ── Component ────────────────────────────────────────────────────────────────

export function AudioPlayer() {
  const [open, setOpen]               = useState(false);
  const [showPlaylist, setShowPlaylist] = useState(false);
  const [playing, setPlaying]         = useState(false);
  const [ready, setReady]             = useState(false);
  const [trackIndex, setTrackIndex]   = useState(0);
  const divRef                        = useRef<HTMLDivElement>(null);
  const playerRef                     = useRef<InstanceType<typeof window.YT.Player> | null>(null);
  const playlistRef                   = useRef<HTMLDivElement>(null);

  // ── YouTube API init
  useEffect(() => {
    const init = () => {
      if (!divRef.current) return;
      playerRef.current = new window.YT.Player(divRef.current, {
        videoId: PLAYLIST[0].id,
        playerVars: { autoplay: 0, controls: 0, rel: 0 },
        events: {
          onReady: () => setReady(true),
          onStateChange: (e) => {
            setPlaying(e.data === window.YT.PlayerState.PLAYING);
            if (e.data === window.YT.PlayerState.ENDED) goTo(trackIndex + 1);
          },
          onError: () => goTo(trackIndex + 1),
        },
      });
    };

    if (window.YT?.Player) {
      init();
    } else {
      window.onYouTubeIframeAPIReady = init;
      if (!document.querySelector('script[src*="youtube.com/iframe_api"]')) {
        const s   = document.createElement("script");
        s.src     = "https://www.youtube.com/iframe_api";
        document.head.appendChild(s);
      }
    }
  }, []);

  const goTo = (idx: number) => {
    const next = ((idx % PLAYLIST.length) + PLAYLIST.length) % PLAYLIST.length;
    setTrackIndex(next);
    playerRef.current?.loadVideoById(PLAYLIST[next].id);
    // scroll active track into view
    setTimeout(() => {
      const el = playlistRef.current?.querySelector(`[data-idx="${next}"]`);
      el?.scrollIntoView({ block: "nearest", behavior: "smooth" });
    }, 50);
  };

  const toggle = () => {
    if (!ready || !playerRef.current) return;
    if (playing) playerRef.current.pauseVideo();
    else         playerRef.current.playVideo();
  };

  const track = PLAYLIST[trackIndex];

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {/* Hidden YT div */}
      <div ref={divRef} className="sr-only" />

      {/* ── Panel ───────────────────────────────────────────────────── */}
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
              {track.autore} · {track.durata}
            </p>

            {/* Waveform visualizer */}
            <div className="flex items-end gap-[3px] h-6 mb-4">
              {BARS.map((h, i) => (
                <div
                  key={i}
                  className={`flex-1 rounded-full transition-colors ${
                    playing ? "bg-amber-300/50" : "bg-[#3a2e1a]"
                  }`}
                  style={{
                    height: playing
                      ? `${h}px`
                      : `${Math.round(h * 0.35)}px`,
                    animation: playing
                      ? `barDance ${0.5 + i * 0.07}s ease-in-out infinite alternate`
                      : "none",
                  }}
                />
              ))}
            </div>

            {/* Controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => goTo(trackIndex - 1)}
                disabled={!ready}
                className="w-9 h-9 flex items-center justify-center border border-[#3a2e1a] text-amber-100/50 hover:border-amber-300/30 hover:text-amber-100 transition-colors disabled:opacity-30"
              >
                <SkipBack className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={toggle}
                disabled={!ready}
                className={`flex-1 h-9 flex items-center justify-center gap-2 text-[10px] uppercase tracking-widest transition-all border disabled:opacity-30 ${
                  playing
                    ? "border-amber-300/40 bg-amber-300/8 text-amber-300 hover:bg-amber-300/12"
                    : "border-[#3a2e1a] text-amber-100/60 hover:border-amber-300/30 hover:text-amber-100"
                }`}
              >
                {playing ? (
                  <><Pause className="w-3.5 h-3.5" /> Pausa</>
                ) : (
                  <><Play  className="w-3.5 h-3.5" /> {ready ? "Ascolta" : "…"}</>
                )}
              </button>

              <button
                onClick={() => goTo(trackIndex + 1)}
                disabled={!ready}
                className="w-9 h-9 flex items-center justify-center border border-[#3a2e1a] text-amber-100/50 hover:border-amber-300/30 hover:text-amber-100 transition-colors disabled:opacity-30"
              >
                <SkipForward className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* ── Playlist panel ────────────────────────────────────── */}
          {showPlaylist && (
            <div className="border-t border-[#2e2410]">
              <div
                ref={playlistRef}
                className="max-h-64 overflow-y-auto overscroll-contain"
              >
                {PLAYLIST.map((t, i) => (
                  <button
                    key={t.id}
                    data-idx={i}
                    onClick={() => goTo(i)}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors border-b border-[#251d0e] last:border-0 ${
                      i === trackIndex
                        ? "bg-amber-300/8"
                        : "hover:bg-[#251d0e]"
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

                    {/* Category + duration */}
                    <div className="flex-none text-right">
                      <p className={`text-[8px] ${CATEGORIA_COLORE[t.categoria]}`}>{t.categoria}</p>
                      <p className="text-[8px] text-amber-100/25">{t.durata}</p>
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

      {/* ── FAB ─────────────────────────────────────────────────────── */}
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
          playing ? "text-amber-300" : "text-amber-100/50 group-hover:text-amber-100"
        }`} />
        {playing && (
          <span className="absolute inset-0 rounded-full border border-amber-300/20 animate-ping opacity-40" />
        )}
      </button>
    </div>
  );
}
