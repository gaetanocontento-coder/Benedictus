import { useState, useCallback, useRef } from "react";

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface ChatParams {
  letture: { tipo: string; riferimento: string; testo: string }[];
  titoloLiturgico: string;
  meditazioneIniziale: string;
}

export function useChatPadreBenedetto() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [streamingContent, setStreamingContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [errore, setErrore] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const invia = useCallback(async (domanda: string, params: ChatParams) => {
    if (!domanda.trim() || loading) return;

    const userMessage: ChatMessage = { role: "user", content: domanda.trim() };
    const historySnapshot = [...messages, userMessage];
    setMessages(historySnapshot);
    setStreamingContent("");
    setErrore(null);
    setLoading(true);

    if (abortRef.current) abortRef.current.abort();
    const ctrl = new AbortController();
    abortRef.current = ctrl;

    try {
      const resp = await fetch("/api/b/guida-spirituale", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tipo: "dialogo",
          stepId: "dialogo",
          meditazioneIniziale: params.meditazioneIniziale,
          letture: params.letture,
          titoloLiturgico: params.titoloLiturgico,
          messagesHistory: messages,
          messaggioCorrente: domanda.trim(),
        }),
        signal: ctrl.signal,
      });

      if (!resp.ok || !resp.body) {
        setErrore("Padre Benedetto non è raggiungibile in questo momento.");
        setLoading(false);
        return;
      }

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let buf = "";
      let accumulated = "";

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
              setStreamingContent(accumulated);
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

      // Commit the streamed response to messages
      if (accumulated) {
        setMessages((prev) => [...prev, { role: "assistant", content: accumulated }]);
        setStreamingContent("");
      }
    } catch (e) {
      if ((e as Error).name !== "AbortError") {
        setErrore("Padre Benedetto non è raggiungibile in questo momento.");
      }
    } finally {
      setLoading(false);
    }
  }, [messages, loading]);

  const annulla = useCallback(() => {
    abortRef.current?.abort();
    setLoading(false);
  }, []);

  const reset = useCallback(() => {
    abortRef.current?.abort();
    setMessages([]);
    setStreamingContent("");
    setErrore(null);
    setLoading(false);
  }, []);

  return { messages, streamingContent, loading, errore, invia, annulla, reset };
}
