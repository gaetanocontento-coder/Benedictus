import { useState, useEffect, useRef } from "react";
import { Music, X, Play, Pause, SkipBack, SkipForward } from "lucide-react";

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
        nextVideo: () => void;
        previousVideo: () => void;
      };
      PlayerState: { PLAYING: number; ENDED: number };
    };
    onYouTubeIframeAPIReady: () => void;
  }
}

const PLAYLIST = [
  {
    id: "HFZImNz4BrE",
    title: "Credo",
    info: "Monaci Benedettini · 1 ora",
  },
  {
    id: "qi3eMo88oT4",
    title: "Sanctus",
    info: "Monaci Benedettini · 1 ora",
  },
  {
    id: "Cd0DniJLwDw",
    title: "Canti dal Monastero",
    info: "Canti Cattolici per la Preghiera · 1 ora",
  },
  {
    id: "Ed90FUyE4rM",
    title: "Messa in Canto Gregoriano",
    info: "Sacra Musica Corale · 1 ora",
  },
  {
    id: "eGw5O62N2dE",
    title: "Antologia Gregoriana",
    info: "Coro Monastico Latino · 2 ore",
  },
  {
    id: "D_jRfYPWNT0",
    title: "Alleluia di Pasqua",
    info: "Canti di Pasqua e Risurrezione · 90 min",
  },
];

const bars = [10, 16, 8, 20, 12, 18, 10, 15, 9];

export function AudioPlayer() {
  const [open, setOpen] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [ready, setReady] = useState(false);
  const [trackIndex, setTrackIndex] = useState(0);
  const divRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<InstanceType<typeof window.YT.Player> | null>(null);

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
            if (e.data === window.YT.PlayerState.ENDED) {
              advanceTrack(1);
            }
          },
          onError: () => advanceTrack(1),
        },
      });
    };

    if (window.YT?.Player) {
      init();
    } else {
      window.onYouTubeIframeAPIReady = init;
      if (!document.querySelector('script[src*="youtube.com/iframe_api"]')) {
        const s = document.createElement("script");
        s.src = "https://www.youtube.com/iframe_api";
        document.head.appendChild(s);
      }
    }
  }, []);

  const advanceTrack = (dir: 1 | -1) => {
    setTrackIndex((prev) => {
      const next = (prev + dir + PLAYLIST.length) % PLAYLIST.length;
      playerRef.current?.loadVideoById(PLAYLIST[next].id);
      return next;
    });
  };

  const toggle = () => {
    if (!ready || !playerRef.current) return;
    if (playing) playerRef.current.pauseVideo();
    else playerRef.current.playVideo();
  };

  const track = PLAYLIST[trackIndex];

  return (
    <div className="fixed bottom-7 right-7 z-50 flex flex-col items-end gap-3">
      <div ref={divRef} className="sr-only" />

      {open && (
        <div className="bg-card border border-primary/20 shadow-2xl w-72 animate-in slide-in-from-bottom-3 fade-in duration-200">
          {/* Header */}
          <div className="px-5 pt-4 pb-3 flex items-center justify-between border-b border-border/40">
            <div className="flex items-center gap-2">
              <Music className="w-3 h-3 text-primary/60" />
              <p className="text-[9px] uppercase tracking-[0.25em] text-muted-foreground">
                Canti Gregoriani
              </p>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Track info */}
          <div className="px-5 pt-4 pb-2">
            <p className="font-serif text-foreground text-base leading-tight">
              {track.title}
            </p>
            <p className="text-xs text-muted-foreground font-light mt-0.5">
              {track.info}
            </p>

            {/* Visualizer */}
            <div className="h-5 mt-3">
              {playing ? (
                <div className="flex items-end gap-0.5">
                  {bars.map((h, i) => (
                    <div
                      key={i}
                      className="w-1 bg-primary/40 rounded-full"
                      style={{
                        height: `${h}px`,
                        animation: `barDance ${0.55 + i * 0.08}s ease-in-out infinite alternate`,
                      }}
                    />
                  ))}
                </div>
              ) : (
                <div className="flex items-end gap-0.5">
                  {bars.map((h, i) => (
                    <div
                      key={i}
                      className="w-1 bg-border rounded-full"
                      style={{ height: `${Math.round(h * 0.4)}px` }}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Track counter */}
          <div className="px-5 pb-1">
            <p className="text-[9px] text-muted-foreground/50 tracking-widest uppercase">
              {trackIndex + 1} / {PLAYLIST.length}
            </p>
          </div>

          {/* Controls */}
          <div className="px-5 pb-5 flex items-center gap-2 mt-1">
            <button
              onClick={() => advanceTrack(-1)}
              disabled={!ready}
              className="flex-none w-9 h-9 flex items-center justify-center border border-border text-muted-foreground hover:border-primary/40 hover:text-primary transition-colors disabled:opacity-30"
            >
              <SkipBack className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={toggle}
              disabled={!ready}
              className={`flex-1 h-9 flex items-center justify-center gap-2 text-[10px] uppercase tracking-widest transition-all duration-300 border ${
                playing
                  ? "border-primary/40 text-primary hover:bg-primary/10"
                  : "border-border text-muted-foreground hover:border-primary/40 hover:text-primary"
              } disabled:opacity-30`}
            >
              {playing ? (
                <><Pause className="w-3.5 h-3.5" /> Pausa</>
              ) : (
                <><Play className="w-3.5 h-3.5" /> {ready ? "Ascolta" : "…"}</>
              )}
            </button>

            <button
              onClick={() => advanceTrack(1)}
              disabled={!ready}
              className="flex-none w-9 h-9 flex items-center justify-center border border-border text-muted-foreground hover:border-primary/40 hover:text-primary transition-colors disabled:opacity-30"
            >
              <SkipForward className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* FAB */}
      <button
        onClick={() => setOpen(!open)}
        title="Canti Gregoriani"
        className={`group relative w-11 h-11 rounded-full flex items-center justify-center border transition-all duration-500 ${
          playing
            ? "border-primary/60 bg-primary/5 shadow-[0_0_24px_rgba(245,230,200,0.12)]"
            : "border-border/60 bg-card/80 hover:border-primary/40"
        }`}
      >
        <Music
          className={`w-4 h-4 transition-colors duration-300 ${
            playing ? "text-primary" : "text-muted-foreground group-hover:text-primary"
          }`}
        />
        {playing && (
          <span className="absolute inset-0 rounded-full border border-primary/20 animate-ping opacity-30" />
        )}
      </button>
    </div>
  );
}
