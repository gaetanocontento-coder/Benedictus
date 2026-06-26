import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { BookOpen, Flame, ChevronLeft, ChevronRight, Loader2, AlertCircle, Sparkles, StopCircle, TriangleAlert, ExternalLink, Send, MessageCircle } from "lucide-react";
import {
  useBGetLiturgiaGiorno,
  getBGetLiturgiaGiornoQueryKey,
  useBGetPraticheByDate,
  getBGetPraticheByDateQueryKey,
} from "@workspace/api-client-react";
import { useAuth } from "@/lib/auth";
import { useGuidaSpirituale } from "@/lib/useGuidaSpirituale";
import { useChatPadreBenedetto } from "@/lib/useChatPadreBenedetto";

const COLORE_MAP: Record<string, { bg: string; label: string }> = {
  verde:  { bg: "#2d6a2d", label: "Tempo Ordinario" },
  viola:  { bg: "#5c2d82", label: "Avvento / Quaresima" },
  rosso:  { bg: "#8b1a1a", label: "Martiri / Spirito Santo" },
  bianco: { bg: "#5a4a2a", label: "Solennità / Feste" },
};

function formatDateIT(iso: string) {
  const [y, m, d] = iso.split("-");
  const dt = new Date(Number(y), Number(m) - 1, Number(d));
  return dt.toLocaleDateString("it-IT", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
}

function todayISO() {
  const dt = new Date();
  return `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, "0")}-${String(dt.getDate()).padStart(2, "0")}`;
}

function addDays(iso: string, delta: number): string {
  const [y, m, d] = iso.split("-").map(Number);
  const dt = new Date(y, m - 1, d + delta);
  return `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, "0")}-${String(dt.getDate()).padStart(2, "0")}`;
}

const TIPO_ICONA: Record<string, string> = {
  prima_lettura:   "I",
  salmo:           "℣",
  seconda_lettura: "II",
  vangelo:         "✠",
};

export default function LiturgiaIndex() {
  const [, navigate] = useLocation();
  const { user } = useAuth();
  const [selectedData, setSelectedData] = useState(todayISO());
  const [expandedLettura, setExpandedLettura] = useState<string | null>("vangelo");
  const guida = useGuidaSpirituale();
  const chat = useChatPadreBenedetto();
  const [chatInput, setChatInput] = useState("");
  const chatBottomRef = useRef<HTMLDivElement>(null);

  const { data: liturgia, isLoading, isError } = useBGetLiturgiaGiorno(
    { data: selectedData },
    { query: { queryKey: getBGetLiturgiaGiornoQueryKey({ data: selectedData }) } }
  );

  // Rilevamento sfasamento: controlla se ieri era una solennità/festa
  // Le feste hanno una seconda_lettura (epistola) oltre alla prima_lettura + vangelo
  const dataIeri = addDays(selectedData, -1);
  const { data: liturgiaIeri } = useBGetLiturgiaGiorno(
    { data: dataIeri },
    { query: { queryKey: getBGetLiturgiaGiornoQueryKey({ data: dataIeri }), staleTime: 1000 * 60 * 60 * 24 } }
  );
  const ieriEraFesta = liturgiaIeri
    ? liturgiaIeri.letture.some((l: { tipo: string }) => l.tipo === "seconda_lettura")
    : false;
  const possibileSfasamento = ieriEraFesta;

  const { data: pratiche = [] } = useBGetPraticheByDate(selectedData, {
    query: { enabled: !!user, queryKey: getBGetPraticheByDateQueryKey(selectedData) },
  });

  const haLectio    = pratiche.some((p) => p.tipo === "lectio");
  const haIgnaziana = pratiche.some((p) => p.tipo === "ignaziana");
  const colore = liturgia ? (COLORE_MAP[liturgia.colore] ?? COLORE_MAP.verde) : COLORE_MAP.verde;
  const isToday = selectedData === todayISO();

  // Auto-scroll to the bottom of the chat when new messages arrive
  useEffect(() => {
    if (chat.messages.length > 0 || chat.streamingContent) {
      chatBottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [chat.messages, chat.streamingContent]);

  function avviaAnalisi() {
    if (!liturgia) return;
    chat.reset();
    guida.richiedi({
      tipo: "analisi",
      stepId: "analisi",
      titoloLiturgico: liturgia.titoloLiturgico,
      letture: liturgia.letture.map((l) => ({
        tipo: l.tipo,
        riferimento: l.riferimento,
        testo: l.testo,
      })),
    });
  }

  function inviaAlPadre() {
    if (!liturgia || !guida.testo || !chatInput.trim()) return;
    const domanda = chatInput.trim();
    setChatInput("");
    chat.invia(domanda, {
      letture: liturgia.letture.map((l) => ({ tipo: l.tipo, riferimento: l.riferimento, testo: l.testo })),
      titoloLiturgico: liturgia.titoloLiturgico,
      meditazioneIniziale: guida.testo,
    });
  }

  return (
    <div className="w-full">

      {/* ── HERO ── */}
      <section className="bg-background border-b border-border py-16">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={() => { setSelectedData(addDays(selectedData, -1)); guida.reset(); chat.reset(); setChatInput(""); }}
              className="flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors text-xs uppercase tracking-widest"
            >
              <ChevronLeft className="w-4 h-4" /> Ieri
            </button>
            <div className="text-center">
              <p className="text-primary tracking-[0.35em] text-[10px] uppercase mb-1">Liturgia del Giorno</p>
              <h1 className="font-serif text-2xl md:text-3xl text-foreground capitalize">
                {formatDateIT(selectedData)}
              </h1>
              {!isToday && (
                <button
                  onClick={() => { setSelectedData(todayISO()); guida.reset(); chat.reset(); setChatInput(""); }}
                  className="mt-2 text-[10px] uppercase tracking-widest text-primary hover:text-foreground transition-colors"
                >
                  ← Torna ad oggi
                </button>
              )}
            </div>
            <button
              onClick={() => { if (!isToday) { setSelectedData(addDays(selectedData, 1)); guida.reset(); chat.reset(); setChatInput(""); } }}
              disabled={isToday}
              className="flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors text-xs uppercase tracking-widest disabled:opacity-30"
            >
              Domani <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {liturgia && (
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: colore.bg }} />
              <span className="text-muted-foreground text-xs uppercase tracking-widest">{colore.label}</span>
              <span className="text-border">·</span>
              <span className="text-muted-foreground text-xs capitalize font-light">{liturgia.titoloLiturgico}</span>
            </div>
          )}

          {/* Banner sfasamento solennità */}
          {possibileSfasamento && liturgia && (
            <div className="border border-amber-700/40 bg-amber-950/30 px-5 py-4 flex gap-3 items-start mt-2">
              <TriangleAlert className="w-4 h-4 text-amber-500/80 flex-none mt-0.5" />
              <div className="min-w-0">
                <p className="text-amber-200/80 text-xs leading-relaxed">
                  <span className="font-medium">Attenzione:</span> ieri era una solennità o festa liturgica.
                  La fonte esterna (Evangelizo) potrebbe non allinearsi al lezionario CEI per i giorni successivi a feste che sostituiscono le letture feriali.
                  Prima lettura e salmo potrebbero risultare sfasati di un giorno.
                </p>
                <a
                  href="https://www.lachiesa.it/calendario/liturgico/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-amber-400/80 text-xs hover:text-amber-300 transition-colors mt-1.5 underline underline-offset-2"
                >
                  Verifica le letture ufficiali CEI <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ── LETTURE ── */}
      <section className="py-12 bg-card">
        <div className="container mx-auto px-6 max-w-4xl">

          {isLoading && (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
              <Loader2 className="w-6 h-6 text-primary/50 animate-spin" />
              <p className="text-muted-foreground text-xs uppercase tracking-widest">Convocando le letture…</p>
            </div>
          )}

          {isError && (
            <div className="flex flex-col items-center py-20 gap-4 text-center max-w-sm mx-auto">
              <AlertCircle className="w-8 h-8 text-primary/40" />
              <p className="font-serif text-xl text-foreground">Letture non disponibili</p>
              <p className="text-muted-foreground text-sm font-light leading-relaxed">
                Il servizio di letture liturgiche non è raggiungibile in questo momento.
              </p>
              <Link
                href={`/liturgia/pratica?data=${selectedData}`}
                className="mt-2 bg-primary text-primary-foreground px-6 py-3 text-xs uppercase tracking-widest hover:bg-primary/85 transition-colors"
              >
                Apri la Pratica
              </Link>
            </div>
          )}

          {liturgia && !isLoading && (
            <div className="space-y-4">
              {liturgia.letture.map((lettura) => {
                const isOpen = expandedLettura === lettura.tipo;
                const icona = TIPO_ICONA[lettura.tipo] ?? "·";
                const isVangelo = lettura.tipo === "vangelo";

                return (
                  <div
                    key={lettura.tipo}
                    className={`border transition-all duration-300 ${isVangelo ? "border-primary/30 bg-background" : "border-border bg-background/70"}`}
                  >
                    <button
                      className="w-full flex items-center gap-4 px-6 py-5 text-left group"
                      onClick={() => setExpandedLettura(isOpen ? null : lettura.tipo)}
                    >
                      <span className={`font-serif text-sm flex-none w-7 text-center ${isVangelo ? "text-primary" : "text-muted-foreground"}`}>
                        {icona}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className={`text-[10px] uppercase tracking-widest mb-0.5 ${isVangelo ? "text-primary" : "text-muted-foreground"}`}>
                          {lettura.label}
                        </p>
                        <p className={`font-serif text-base ${isVangelo ? "text-foreground" : "text-foreground/80"}`}>
                          {lettura.riferimento}
                        </p>
                      </div>
                      <ChevronRight
                        className={`w-4 h-4 text-muted-foreground flex-none transition-transform duration-200 ${isOpen ? "rotate-90" : ""}`}
                      />
                    </button>

                    {isOpen && (
                      <div className="px-6 pb-8 animate-in fade-in slide-in-from-top-2 duration-300">
                        {lettura.intro && (
                          <p className="text-xs uppercase tracking-widest text-muted-foreground mb-5 italic">{lettura.intro}</p>
                        )}
                        <div className="font-serif text-base md:text-lg text-foreground/90 leading-loose whitespace-pre-wrap border-l-2 border-primary/20 pl-5">
                          {lettura.testo}
                        </div>
                        <div className="mt-8 pt-6 border-t border-border flex flex-col sm:flex-row gap-3">
                          <button
                            onClick={() => navigate(`/liturgia/pratica?data=${selectedData}&tipo=lectio&ref=${encodeURIComponent(lettura.riferimento)}`)}
                            className="flex items-center gap-2 border border-primary text-primary px-5 py-2.5 text-xs uppercase tracking-widest hover:bg-primary hover:text-primary-foreground transition-all"
                          >
                            <BookOpen className="w-3.5 h-3.5" />
                            Lectio Divina su questo brano
                          </button>
                          <button
                            onClick={() => navigate(`/liturgia/pratica?data=${selectedData}&tipo=ignaziana&ref=${encodeURIComponent(lettura.riferimento)}`)}
                            className="flex items-center gap-2 border border-border text-muted-foreground px-5 py-2.5 text-xs uppercase tracking-widest hover:border-primary/40 hover:text-foreground transition-all"
                          >
                            <Flame className="w-3.5 h-3.5" />
                            Esercizi Ignaziani
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* ── MEDITAZIONE AI ── */}
      {liturgia && !isLoading && !isError && (
        <section className="py-14 bg-background border-t border-border">
          <div className="container mx-auto px-6 max-w-4xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-px flex-1 bg-border" />
              <p className="text-primary/50 tracking-[0.35em] text-[10px] uppercase">Meditazione delle Letture</p>
              <div className="h-px flex-1 bg-border" />
            </div>

            {!guida.testo && !guida.loading && (
              <div className="text-center">
                <p className="text-muted-foreground text-sm font-light leading-relaxed max-w-lg mx-auto mb-8">
                  Un padre spirituale benedettino traccia il filo comune che unisce tutte le letture di oggi,
                  portandole nella tua vita concreta.
                </p>
                <button
                  onClick={avviaAnalisi}
                  className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-3.5 text-xs uppercase tracking-widest hover:bg-primary/85 transition-colors"
                >
                  <Sparkles className="w-4 h-4" />
                  Ricevi la meditazione del giorno
                </button>
              </div>
            )}

            {guida.loading && !guida.testo && (
              <div className="flex flex-col items-center gap-3 py-8">
                <Loader2 className="w-5 h-5 text-primary/50 animate-spin" />
                <p className="text-muted-foreground text-xs uppercase tracking-widest">Il padre sta meditando…</p>
              </div>
            )}

            {(guida.testo || guida.loading) && (
              <div className="max-w-2xl mx-auto">
                <div className="bg-card border border-primary/15 px-8 py-8">
                  <div className="flex items-start gap-3 mb-6">
                    <span className="font-serif text-2xl text-primary/25 leading-none">❝</span>
                    <p className="text-[10px] uppercase tracking-widest text-primary/60 mt-1">Padre spirituale benedettino</p>
                  </div>
                  <div className="font-serif text-base md:text-lg text-foreground/90 leading-loose whitespace-pre-wrap">
                    {guida.testo}
                    {guida.loading && (
                      <span className="inline-block w-0.5 h-4 bg-primary/50 animate-pulse ml-0.5 align-middle" />
                    )}
                  </div>
                  {guida.loading && (
                    <button
                      onClick={guida.annulla}
                      className="mt-6 flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <StopCircle className="w-3.5 h-3.5" /> Interrompi
                    </button>
                  )}
                  {!guida.loading && guida.testo && (
                    <button
                      onClick={() => { guida.reset(); chat.reset(); setChatInput(""); }}
                      className="mt-6 text-xs uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors"
                    >
                      ↺ Rigenera
                    </button>
                  )}
                </div>
                <div className="flex items-center justify-center gap-4 mt-6">
                  <button
                    onClick={() => navigate(`/liturgia/pratica?data=${selectedData}&tipo=lectio`)}
                    className="flex items-center gap-2 border border-primary text-primary px-5 py-2.5 text-xs uppercase tracking-widest hover:bg-primary hover:text-primary-foreground transition-all"
                  >
                    <BookOpen className="w-3.5 h-3.5" /> Apri Lectio Divina
                  </button>
                  <button
                    onClick={() => navigate(`/liturgia/pratica?data=${selectedData}&tipo=ignaziana`)}
                    className="flex items-center gap-2 border border-border text-muted-foreground px-5 py-2.5 text-xs uppercase tracking-widest hover:border-primary/40 hover:text-foreground transition-all"
                  >
                    <Flame className="w-3.5 h-3.5" /> Esercizi Ignaziani
                  </button>
                </div>

                {/* ── DIALOGO DI APPROFONDIMENTO ── */}
                {!guida.loading && guida.testo && (
                  <div className="mt-10">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="h-px flex-1 bg-border/50" />
                      <div className="flex items-center gap-2 text-primary/40">
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span className="text-[10px] uppercase tracking-widest">Dialogo con il Padre</span>
                      </div>
                      <div className="h-px flex-1 bg-border/50" />
                    </div>

                    {/* Cronologia messaggi */}
                    {(chat.messages.length > 0 || chat.streamingContent) && (
                      <div className="space-y-4 mb-6">
                        {chat.messages.map((msg, i) => (
                          <div
                            key={i}
                            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                          >
                            {msg.role === "assistant" && (
                              <div className="flex-none w-5 h-5 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mr-2 mt-1 flex-shrink-0">
                                <span className="font-serif text-[9px] text-primary/50">P</span>
                              </div>
                            )}
                            <div
                              className={`max-w-[85%] px-4 py-3 text-sm leading-relaxed font-light ${
                                msg.role === "user"
                                  ? "bg-background border border-primary/20 text-foreground/80 font-sans"
                                  : "bg-card border border-border font-serif text-foreground/90"
                              }`}
                            >
                              {msg.content}
                            </div>
                          </div>
                        ))}

                        {/* Risposta in streaming */}
                        {chat.streamingContent && (
                          <div className="flex justify-start">
                            <div className="flex-none w-5 h-5 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mr-2 mt-1 flex-shrink-0">
                              <span className="font-serif text-[9px] text-primary/50">P</span>
                            </div>
                            <div className="max-w-[85%] px-4 py-3 bg-card border border-border font-serif text-sm text-foreground/90 leading-relaxed">
                              {chat.streamingContent}
                              <span className="inline-block w-0.5 h-3.5 bg-primary/50 animate-pulse ml-0.5 align-middle" />
                            </div>
                          </div>
                        )}

                        {/* Caricamento iniziale (prima parola) */}
                        {chat.loading && !chat.streamingContent && (
                          <div className="flex justify-start items-center gap-2 pl-7">
                            <Loader2 className="w-3.5 h-3.5 text-primary/40 animate-spin" />
                            <span className="text-muted-foreground text-xs">Il padre riflette…</span>
                          </div>
                        )}

                        <div ref={chatBottomRef} />
                      </div>
                    )}

                    {/* Input domanda */}
                    <div className="flex gap-2">
                      <textarea
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey && !chat.loading) {
                            e.preventDefault();
                            inviaAlPadre();
                          }
                        }}
                        placeholder={
                          chat.messages.length === 0
                            ? "Chiedi al padre di approfondire la meditazione…"
                            : "Continua il dialogo…"
                        }
                        rows={2}
                        disabled={chat.loading}
                        className="flex-1 bg-background border border-border text-foreground/80 text-sm font-light placeholder:text-muted-foreground/40 px-4 py-3 resize-none focus:outline-none focus:border-primary/40 transition-colors disabled:opacity-50"
                      />
                      <button
                        onClick={inviaAlPadre}
                        disabled={!chatInput.trim() || chat.loading}
                        className="flex-none flex items-center justify-center w-12 bg-primary text-primary-foreground hover:bg-primary/85 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                        aria-label="Invia domanda"
                      >
                        {chat.loading
                          ? <Loader2 className="w-4 h-4 animate-spin" />
                          : <Send className="w-4 h-4" />
                        }
                      </button>
                    </div>

                    {chat.errore && (
                      <p className="text-muted-foreground text-xs mt-2">{chat.errore}</p>
                    )}

                    <p className="text-muted-foreground/30 text-[10px] mt-3 text-center">
                      Invio con ⏎ · nuova riga con ⇧⏎
                    </p>
                  </div>
                )}
              </div>
            )}

            {guida.errore && (
              <p className="text-center text-muted-foreground text-sm">{guida.errore}</p>
            )}
          </div>
        </section>
      )}

      {/* ── CTA PRATICA ── */}
      {!isLoading && !isError && liturgia && (
        <section className="py-14 bg-card border-t border-border">
          <div className="container mx-auto px-6 max-w-4xl">
            <p className="text-primary/50 tracking-[0.4em] text-[10px] uppercase mb-6 text-center">La tua pratica quotidiana</p>
            <div className="grid sm:grid-cols-2 gap-5 max-w-2xl mx-auto">
              <button
                onClick={() => navigate(`/liturgia/pratica?data=${selectedData}&tipo=lectio`)}
                className={`relative group flex flex-col gap-3 p-6 border text-left transition-all hover:border-primary/60 ${haLectio ? "border-primary/40 bg-primary/3" : "border-border"}`}
              >
                {haLectio && (
                  <div className="absolute top-3 right-3 text-[9px] uppercase tracking-widest text-primary border border-primary/30 px-2 py-0.5">
                    Completata ✓
                  </div>
                )}
                <BookOpen className="w-5 h-5 text-primary/60" />
                <div>
                  <h3 className="font-serif text-lg text-foreground mb-1 group-hover:text-primary transition-colors">Lectio Divina</h3>
                  <p className="text-muted-foreground text-xs leading-relaxed font-light">
                    Quattro passi monastici: Lectio, Meditatio, Oratio, Contemplatio. Con guida spirituale AI per ogni passo.
                  </p>
                </div>
              </button>
              <button
                onClick={() => navigate(`/liturgia/pratica?data=${selectedData}&tipo=ignaziana`)}
                className={`relative group flex flex-col gap-3 p-6 border text-left transition-all hover:border-primary/60 ${haIgnaziana ? "border-primary/40 bg-primary/3" : "border-border"}`}
              >
                {haIgnaziana && (
                  <div className="absolute top-3 right-3 text-[9px] uppercase tracking-widest text-primary border border-primary/30 px-2 py-0.5">
                    Completati ✓
                  </div>
                )}
                <Flame className="w-5 h-5 text-primary/60" />
                <div>
                  <h3 className="font-serif text-lg text-foreground mb-1 group-hover:text-primary transition-colors">Esercizi Ignaziani</h3>
                  <p className="text-muted-foreground text-xs leading-relaxed font-light">
                    Il metodo di Ignazio di Loyola con accompagnamento AI che risponde alla tua riflessione in tempo reale.
                  </p>
                </div>
              </button>
            </div>
            {!user && (
              <p className="text-center text-muted-foreground text-xs font-light mt-8">
                <Link href="/login" className="text-primary hover:underline">Accedi</Link>{" "}
                per salvare la tua pratica quotidiana e guadagnare XP.
              </p>
            )}
          </div>
        </section>
      )}

      {/* ── NOTA FONTE ── */}
      <section className="py-10 bg-background border-t border-border">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <p className="text-muted-foreground/50 text-xs leading-relaxed max-w-md">
              Letture dal Lezionario CEI (Rito Romano) via{" "}
              <a
                href="https://evangelizo.org"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground/70 hover:text-primary transition-colors underline underline-offset-2"
              >
                Evangelizo.ws
              </a>
              . In caso di discordanza, la fonte autorevole è la{" "}
              <a
                href="https://www.lachiesa.it/calendario/liturgico/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground/70 hover:text-primary transition-colors underline underline-offset-2"
              >
                Conferenza Episcopale Italiana
              </a>
              .
            </p>
            <a
              href="https://www.lachiesa.it/calendario/liturgico/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-none inline-flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-muted-foreground/40 hover:text-primary transition-colors border border-border/50 hover:border-primary/40 px-3 py-2"
            >
              Letture ufficiali CEI <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </section>

    </div>
  );
}
