import { useState, useCallback, useRef } from "react";

interface Lettura {
  tipo: string;
  riferimento: string;
  testo: string;
}

interface GuidaParams {
  tipo: "lectio" | "ignaziana" | "analisi";
  stepId: string;
  testoUtente?: string;
  letture?: Lettura[];
  titoloLiturgico?: string;
}

export function useGuidaSpirituale() {
  const [testo, setTesto]       = useState("");
  const [loading, setLoading]   = useState(false);
  const [errore, setErrore]     = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const richiedi = useCallback(async (params: GuidaParams) => {
    if (abortRef.current) abortRef.current.abort();
    const ctrl = new AbortController();
    abortRef.current = ctrl;

    setTesto("");
    setErrore(null);
    setLoading(true);

    try {
      const base = import.meta.env.BASE_URL.replace(/\/$/, "");
      const resp = await fetch(`${base}/api/b/guida-spirituale`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params),
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
            if (json.content) setTesto((t) => t + json.content);
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
    }
  }, []);

  const annulla = useCallback(() => {
    abortRef.current?.abort();
    setLoading(false);
  }, []);

  return { testo, loading, errore, richiedi, annulla, reset: () => setTesto("") };
}
