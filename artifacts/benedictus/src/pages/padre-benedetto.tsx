import { useState, useRef, useEffect, useCallback } from "react";
import { Send, RotateCcw, ChevronDown } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
  streaming?: boolean;
}

const SALUTO_INIZIALE: Message = {
  role: "assistant",
  content: "Pax et Bonum.\n\nSono Padre Benedetto. Siedi, figlio. Cosa porta il tuo cuore oggi?",
};

const SUGGERIMENTI = [
  "Come posso trovare pace nel caos quotidiano?",
  "Cosa dice la Regola sul riposo e il lavoro?",
  "Sto attraversando un periodo di aridità spirituale.",
  "Come discernere una decisione importante?",
  "Cos'è la Lectio Divina e come iniziare?",
  "Come pregare quando non ne ho voglia?",
];

const MSG_HEIGHT = 420; // px for the scrollable message area

export default function PadreBenedetto() {
  const [messages, setMessages]     = useState<Message[]>([SALUTO_INIZIALE]);
  const [input, setInput]           = useState("");
  const [loading, setLoading]       = useState(false);
  const [showScroll, setShowScroll] = useState(false);
  const bottomRef                   = useRef<HTMLDivElement>(null);
  const chatRef                     = useRef<HTMLDivElement>(null);
  const textareaRef                 = useRef<HTMLTextAreaElement>(null);
  const abortRef                    = useRef<AbortController | null>(null);

  const isFirstRender = useRef(true);

  const scrollToBottom = useCallback(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    // Don't scroll on the initial render — let the page show from the top
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    scrollToBottom();
  }, [messages, scrollToBottom]);

  useEffect(() => {
    const el = chatRef.current;
    if (!el) return;
    const onScroll = () => setShowScroll(el.scrollHeight - el.scrollTop - el.clientHeight > 80);
    el.addEventListener("scroll", onScroll);
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = `${Math.min(ta.scrollHeight, 140)}px`;
  }, [input]);

  const sendMessage = useCallback(async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    const userMsg: Message = { role: "user", content: trimmed };
    const history = [...messages, userMsg];
    setMessages(history);
    setInput("");
    setLoading(true);

    const assistantIdx = history.length;
    setMessages((prev) => [...prev, { role: "assistant", content: "", streaming: true }]);
    abortRef.current = new AbortController();

    try {
      const apiMessages = history
        .filter((m) => !m.streaming)
        .map((m) => ({ role: m.role, content: m.content }));

      const res = await fetch(`/api/b/padre-benedetto`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: apiMessages }),
        signal: abortRef.current.signal,
      });

      if (!res.ok || !res.body) throw new Error("Risposta non valida");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let accumulated = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        for (const line of chunk.split("\n")) {
          if (!line.startsWith("data: ")) continue;
          try {
            const data = JSON.parse(line.slice(6));
            if (data.done) break;
            if (data.error)        accumulated = data.error;
            else if (data.content) accumulated += data.content;
            setMessages((prev) => {
              const updated = [...prev];
              updated[assistantIdx] = { role: "assistant", content: accumulated, streaming: true };
              return updated;
            });
          } catch {}
        }
      }

      setMessages((prev) => {
        const updated = [...prev];
        updated[assistantIdx] = { role: "assistant", content: accumulated, streaming: false };
        return updated;
      });
    } catch (err: unknown) {
      if (err instanceof Error && err.name === "AbortError") return;
      setMessages((prev) => {
        const updated = [...prev];
        updated[assistantIdx] = {
          role: "assistant",
          content: "Il padre spirituale è in preghiera. Riprova tra poco.",
          streaming: false,
        };
        return updated;
      });
    } finally {
      setLoading(false);
      abortRef.current = null;
    }
  }, [messages, loading]);

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(input); }
  };

  const reset = () => {
    abortRef.current?.abort();
    setMessages([SALUTO_INIZIALE]);
    setInput("");
    setLoading(false);
  };

  return (
    <div className="w-full">
      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="py-14 bg-background border-b border-border text-center">
        <p className="text-primary tracking-[0.35em] text-[10px] uppercase mb-4">
          Colloquium Spiritus
        </p>
        <h1 className="text-4xl md:text-5xl font-serif text-foreground mb-4">
          Padre <span className="italic text-primary">Benedetto</span>
        </h1>
        <p className="text-muted-foreground text-sm max-w-lg mx-auto font-light leading-relaxed">
          Un padre spirituale benedettino ti accompagna nel cammino interiore.
          Portagli le tue domande, i tuoi dubbi, la tua ricerca.
        </p>
        <div className="mt-6 w-12 h-px bg-primary/30 mx-auto" />
      </section>

      {/* ── Chat ─────────────────────────────────────────────────────── */}
      <section className="py-8 px-4 bg-background">
        <div className="max-w-3xl mx-auto relative">

          {/* Messages scroll area */}
          <div
            ref={chatRef}
            className="overflow-y-auto overscroll-contain space-y-5 pr-1"
            style={{ height: `${MSG_HEIGHT}px` }}
          >
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                {msg.role === "assistant" && (
                  <div className="w-7 h-7 rounded-full border border-primary/30 flex-none mr-3 mt-0.5 flex items-center justify-center text-primary/50 text-[11px] font-serif shrink-0">
                    ✝
                  </div>
                )}
                <div
                  className={`max-w-[82%] px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap font-light ${
                    msg.role === "user"
                      ? "bg-primary/10 border border-primary/20 text-foreground"
                      : "bg-card border border-border text-foreground/90"
                  }`}
                >
                  {msg.content}
                  {msg.streaming && msg.content === "" && (
                    <span className="inline-flex gap-1 items-end h-4">
                      <span className="w-1 h-1 rounded-full bg-primary/50 animate-bounce [animation-delay:0ms]" />
                      <span className="w-1 h-1 rounded-full bg-primary/50 animate-bounce [animation-delay:150ms]" />
                      <span className="w-1 h-1 rounded-full bg-primary/50 animate-bounce [animation-delay:300ms]" />
                    </span>
                  )}
                  {msg.streaming && msg.content !== "" && (
                    <span className="inline-block w-0.5 h-3.5 bg-primary/60 animate-pulse ml-0.5 align-text-bottom" />
                  )}
                </div>
              </div>
            ))}

            {/* Suggerimenti */}
            {messages.length === 1 && (
              <div className="pt-3">
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground/50 mb-3 text-center">
                  Puoi chiedergli…
                </p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {SUGGERIMENTI.map((s) => (
                    <button
                      key={s}
                      onClick={() => sendMessage(s)}
                      className="text-[11px] text-foreground/55 border border-border/60 px-3 py-1.5 hover:border-primary/40 hover:text-primary transition-colors"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Scroll-to-bottom button */}
          {showScroll && (
            <button
              onClick={scrollToBottom}
              className="absolute right-2 bottom-24 w-8 h-8 bg-card border border-border shadow-md flex items-center justify-center text-muted-foreground hover:text-primary transition-colors"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
          )}

          {/* Separator */}
          <div className="mt-4 border-t border-border/50" />

          {/* Input bar */}
          <div className="mt-4">
            <div className="border border-border bg-card flex items-end gap-2 p-2">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder="Scrivi al Padre Benedetto…"
                disabled={loading}
                rows={1}
                className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground/40 resize-none outline-none px-2 py-1.5 leading-relaxed font-light disabled:opacity-50"
                style={{ maxHeight: "140px" }}
              />
              <div className="flex-none flex items-center gap-1 pb-0.5">
                {messages.length > 1 && (
                  <button
                    onClick={reset}
                    title="Nuova conversazione"
                    className="w-8 h-8 flex items-center justify-center text-muted-foreground/50 hover:text-primary transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                )}
                <button
                  onClick={() => sendMessage(input)}
                  disabled={!input.trim() || loading}
                  className={`w-9 h-9 flex items-center justify-center border transition-colors ${
                    input.trim() && !loading
                      ? "border-primary/50 text-primary hover:bg-primary/10"
                      : "border-border text-muted-foreground/30 cursor-not-allowed"
                  }`}
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
            <p className="text-center text-[9px] text-muted-foreground/25 mt-2 tracking-wider">
              Ora et Labora · Le conversazioni non vengono salvate
            </p>
          </div>
        </div>
      </section>

      {/* ── Nota spirituale ──────────────────────────────────────────── */}
      <section className="py-16 bg-card border-t border-border">
        <div className="container mx-auto px-6 max-w-2xl text-center">
          <p className="text-[10px] uppercase tracking-[0.3em] text-primary/60 mb-6">
            Sulla natura di questo colloquio
          </p>
          <blockquote className="text-muted-foreground font-serif text-lg italic leading-relaxed mb-6">
            "Ascolta, o figlio, i precetti del maestro e piega l'orecchio del tuo cuore."
          </blockquote>
          <p className="text-[10px] text-muted-foreground/40 uppercase tracking-widest">
            Regula Sancti Benedicti — Prologus
          </p>
        </div>
      </section>
    </div>
  );
}
