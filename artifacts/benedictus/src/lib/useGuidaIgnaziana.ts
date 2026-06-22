import { useState, useCallback, useRef } from "react";

export interface Messaggio {
  role: "user" | "assistant";
  content: string;
}

interface InviaParams {
  messaggioCorrente?: string;
  stepId: string;
  letture?: { tipo: string; riferimento: string; testo: string }[];
}

export function useGuidaIgnaziana() {
  const [conversazione, setConversazione] = useState<Messaggio[]>([]);
  const [streamingTesto, setStreamingTesto] = useState("");
  const [loading, setLoading] = useState(false);
  const [errore, setErrore] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const convRef = useRef<Messaggio[]>([]);
  convRef.current = conversazione;

  const invia = useCallback(
    async ({ messaggioCorrente, stepId, letture = [] }: InviaParams) => {
      if (abortRef.current) abortRef.current.abort();
      const ctrl = new AbortController();
      abortRef.current = ctrl;

      // Add user message to conversation (skip for step intro)
      const isIntro = !messaggioCorrente;
      if (!isIntro && messaggioCorrente) {
        setConversazione((prev) => [...prev, { role: "user", content: messaggioCorrente }]);
      }

      setStreamingTesto("");
      setErrore(null);
      setLoading(true);

      let accumulated = "";

      try {
        const resp = await fetch("/api/b/guida-spirituale", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            tipo: "ignaziana",
            stepId,
            letture: letture.slice(0, 3).map((l) => ({
              tipo: l.tipo,
              riferimento: l.riferimento,
              testo: l.testo.slice(0, 500),
            })),
            messagesHistory: convRef.current,
            messaggioCorrente: messaggioCorrente ?? null,
          }),
          signal: ctrl.signal,
        });

        if (!resp.ok || !resp.body) {
          setErrore("Guida non disponibile in questo momento.");
          setLoading(false);
          return;
        }

        const reader = resp.body.getReader();
        const decoder = new TextDecoder();
        let buf = "";

        while (true) {
          const { value, done } = await reader.read();
          if (done) break;
          buf += decoder.decode(value, { stream: true });
          const lines = buf.split("\n");
          buf = lines.pop() ?? "";
          for (const line of lines) {
            if (!line.startsWith("data: ")) continue;
            try {
              const json = JSON.parse(line.slice(6));
              if (json.content) {
                accumulated += json.content;
                setStreamingTesto(accumulated);
              }
              if (json.done || json.error) {
                if (json.error) setErrore(json.error);
                setLoading(false);
              }
            } catch {
              // skip malformed chunk
            }
          }
        }
      } catch (e) {
        if ((e as Error).name !== "AbortError") {
          setErrore("Guida non disponibile in questo momento.");
        }
      } finally {
        setLoading(false);
        if (accumulated) {
          setConversazione((prev) => [
            ...prev,
            { role: "assistant", content: accumulated },
          ]);
          setStreamingTesto("");
        }
      }
    },
    []
  );

  const resetStep = useCallback(() => {
    abortRef.current?.abort();
    setConversazione([]);
    setStreamingTesto("");
    setErrore(null);
    setLoading(false);
  }, []);

  const annulla = useCallback(() => {
    abortRef.current?.abort();
    setLoading(false);
  }, []);

  return {
    conversazione,
    streamingTesto,
    loading,
    errore,
    invia,
    resetStep,
    annulla,
  };
}
