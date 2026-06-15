import { useState, useEffect, useRef } from "react";
import { Music, X, Play, Pause } from "lucide-react";

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
          };
        }
      ) => {
        playVideo: () => void;
        pauseVideo: () => void;
      };
      PlayerState: { PLAYING: number };
    };
    onYouTubeIframeAPIReady: () => void;
  }
}

const VIDEO_ID = "s7L2PVdrb_8";

export function AudioPlayer() {
  const [open, setOpen] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [ready, setReady] = useState(false);
  const divRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<InstanceType<typeof window.YT.Player> | null>(null);
  const bars = [12, 18, 10, 16, 8, 20, 14];

  useEffect(() => {
    const init = () => {
      if (!divRef.current) return;
      playerRef.current = new window.YT.Player(divRef.current, {
        videoId: VIDEO_ID,
        playerVars: { autoplay: 0, controls: 0, rel: 0, loop: 1, playlist: VIDEO_ID },
        events: {
          onReady: () => setReady(true),
          onStateChange: (e) => setPlaying(e.data === window.YT.PlayerState.PLAYING),
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

  const toggle = () => {
    if (!ready || !playerRef.current) return;
    if (playing) playerRef.current.pauseVideo();
    else playerRef.current.playVideo();
  };

  return (
    <div className="fixed bottom-7 right-7 z-50 flex flex-col items-end gap-3">
      <div ref={divRef} className="sr-only" />

      {open && (
        <div className="bg-card border border-primary/20 shadow-2xl w-64 animate-in slide-in-from-bottom-3 fade-in duration-200">
          <div className="px-5 pt-4 pb-1 flex items-center justify-between">
            <p className="text-[9px] uppercase tracking-[0.25em] text-muted-foreground">
              Colonna Sonora
            </p>
            <button
              onClick={() => setOpen(false)}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="px-5 pb-4 pt-2">
            <p className="font-serif text-foreground text-base leading-tight">
              Il Nome della Rosa
            </p>
            <p className="text-xs text-muted-foreground font-light mt-0.5">
              James Horner · 1986
            </p>

            {playing && (
              <div className="flex items-end gap-0.5 mt-3 h-5">
                {bars.map((h, i) => (
                  <div
                    key={i}
                    className="w-1 bg-primary/50 rounded-full"
                    style={{
                      height: `${h}px`,
                      animation: `barDance ${0.6 + i * 0.07}s ease-in-out infinite alternate`,
                    }}
                  />
                ))}
              </div>
            )}

            <button
              onClick={toggle}
              disabled={!ready}
              className={`mt-4 w-full flex items-center justify-center gap-2 py-2.5 text-[10px] uppercase tracking-widest transition-all duration-300 border ${
                playing
                  ? "border-primary/40 text-primary hover:bg-primary/10"
                  : "border-border text-muted-foreground hover:border-primary/40 hover:text-primary"
              } disabled:opacity-30`}
            >
              {playing ? (
                <><Pause className="w-3.5 h-3.5" /> Pausa</>
              ) : (
                <><Play className="w-3.5 h-3.5" /> {ready ? "Ascolta" : "Caricamento…"}</>
              )}
            </button>
          </div>
        </div>
      )}

      <button
        onClick={() => setOpen(!open)}
        title="Colonna Sonora"
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
