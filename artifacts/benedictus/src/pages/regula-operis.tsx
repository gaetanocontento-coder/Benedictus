import { useEffect, useState } from "react";
import { Link } from "wouter";
import { CheckCircle, Circle, ArrowRight } from "lucide-react";

const B = import.meta.env.BASE_URL;

export const MODULI_RO = [
  {
    id: 1,
    settimana: "Settimana I",
    titolo: "Lectio Operis",
    sottotitolo: "Leggere l'organizzazione con occhi contemplativi.",
    descrizione:
      "Prima di riformare, bisogna leggere. Non le slide o i KPI — il testo vivo dell'organizzazione: la sua storia, le sue tensioni, la parola non detta nelle riunioni. Benedetto inizia con «Ausculta»: ascolta. Folador ci ricorda che ogni organizzazione ha un'anima che può essere letta.",
    versetto: {
      testo: "Ausculta, o fili, praecepta magistri.",
      traduzione: "Ascolta, o figlio, i precetti del maestro.",
      fonte: "Regula Benedicti — Prologus",
    },
    folador: "L'organizzazione ha un «testo» — una storia che racconta a sé stessa. Il leader apprende a leggerlo con la stessa attenzione con cui il monaco legge la Scrittura.",
    pratica: {
      titolo: "Lectio Divina della Mission",
      descrizione:
        "Prendi il documento fondativo della tua organizzazione — la mission, i valori, o anche una email significativa ricevuta di recente. Leggilo tre volte: la prima per capire, la seconda per trovare la parola che ti colpisce, la terza in silenzio. Scrivi cosa emerge.",
    },
    riflessioni: [
      "Quale parola della mission della tua organizzazione non riesci a spiegare a un estraneo? Perché?",
      "Se la tua organizzazione fosse un testo sacro, quale capitolo è il più trascurato?",
      "Cosa non riesci mai a dire in riunione che è invece vero?",
    ],
  },
  {
    id: 2,
    settimana: "Settimana II",
    titolo: "Il Capitolo",
    sottotitolo: "Ogni comunità ha bisogno di uno spazio per fare verità insieme.",
    descrizione:
      "Nel monastero benedettino, ogni giorno i monaci si riuniscono nel Capitolo: si legge un verso della Regola e lo si applica alla vita concreta della comunità. Non è una riunione strategica, né una retrospettiva agile. È uno spazio per fare verità. Folador vede nel Capitolo il prototipo della governance sana: partecipata, radicata in principi, ciclica.",
    versetto: {
      testo: "Quoties aliqua praecipua agenda sunt in monasterio, convocet Abbas omnem congregationem.",
      traduzione: "Ogniqualvolta nell'abbazia si trattano affari importanti, l'Abate convochi tutta la comunità.",
      fonte: "Regula Benedicti — Cap. III",
    },
    folador: "Il Capitolo è l'antidoto all'illusione del leader onnisciente. Benedetto vuole che persino i più giovani siano ascoltati, «perché spesso il Signore rivela ai più giovani la soluzione migliore».",
    pratica: {
      titolo: "Il Capitolo dei Cinque Minuti",
      descrizione:
        "Per una settimana, inizia ogni mattina con cinque minuti di Capitolo personale: leggi un verso della Regola di Benedetto (anche uno solo), poi scrivi una domanda che ti pone rispetto alla tua organizzazione oggi. Non una risposta. Solo la domanda giusta.",
    },
    riflessioni: [
      "Chi nella tua organizzazione non viene mai ascoltato nelle decisioni importanti? Perché?",
      "Quante delle tue decisioni strategiche sono state condivise con la comunità prima di essere prese?",
      "Quale «novizio» della tua organizzazione potrebbe avere la risposta che stai cercando?",
    ],
  },
  {
    id: 3,
    settimana: "Settimana III",
    titolo: "Ars Abbatis",
    sottotitolo: "L'abate non è il più bravo: è il più disponibile all'ascolto.",
    descrizione:
      "Folador dedica il cuore del suo lavoro alla figura dell'abate come modello di leadership contemporanea. L'abate benedettino non è il più competente tecnicamente: è colui che sa leggere le anime, che porta il peso della comunità, che decide dopo aver ascoltato. Una leadership che serve, non che si serve.",
    versetto: {
      testo: "Abbas qui praeesse dignus est monasterio semper meminisse debet quod dicitur et nomen maioris factis implere.",
      traduzione: "L'Abate che è degno di presiedere un monastero deve sempre ricordarsi del nome che porta e adempierlo con le opere.",
      fonte: "Regula Benedicti — Cap. II",
    },
    folador: "La Regola chiede all'abate di «adattarsi e accomodarsi a tutti secondo la natura e l'intelligenza di ciascuno». La leadership benedettina è radicalmente personalizzata: non c'è un unico stile, ma tante relazioni.",
    pratica: {
      titolo: "L'Ascolto dell'Abate",
      descrizione:
        "Questa settimana, in ogni colloquio 1:1 o riunione di team, poni come obiettivo personale di ascoltare il 70% del tempo. Niente agenda da imporre, niente soluzione da proporre. Solo ricevere. Al termine di ogni giornata, scrivi: cosa hai ascoltato oggi che non avresti ascoltato ieri?",
    },
    riflessioni: [
      "Quando entri in una riunione, stai portando un'apertura o già una conclusione?",
      "Chi nella tua organizzazione sente di non essere visto? Come lo sai — o come non lo sai?",
      "Se dovessi descrivere il tuo stile di leadership con un verso della Regola, quale sceglieresti? E quale vorresti scegliere?",
    ],
  },
  {
    id: 4,
    settimana: "Settimana IV",
    titolo: "Stabilitas",
    sottotitolo: "Cosa rende la tua organizzazione un luogo cui vale la pena appartenere?",
    descrizione:
      "Il voto di stabilità è il più insolito dei tre voti benedettini. Non castità, non povertà: stabilità. Il monaco promette di restare in quel monastero, con quella comunità, per tutta la vita. Folador traduce questo nel contesto aziendale: la stabilitas è l'antidoto alla cultura dell'abbandono permanente, del pivot continuo, della ricerca frenetica del «prossimo livello».",
    versetto: {
      testo: "De stabilitate sua et conversatione morum suorum et oboedientia promittit.",
      traduzione: "Promette la stabilità, la conversione dei costumi e l'obbedienza.",
      fonte: "Regula Benedicti — Cap. LVIII",
    },
    folador: "La stabilitas non è immobilismo: è radicamento. Come un albero che cresce proprio perché le radici tengono, l'organizzazione che ha stabilità può rischiare, innovare, attraversare la crisi — senza perdere sé stessa.",
    pratica: {
      titolo: "Il Voto dell'Imprenditore",
      descrizione:
        "Scrivi la «professione di stabilità» della tua organizzazione: tre impegni che prendi come leader, indipendentemente dalle condizioni di mercato. Non obiettivi. Impegni. Cosa resterà invariato anche quando tutto cambierà? Firma con la data di oggi.",
    },
    riflessioni: [
      "Se i tuoi collaboratori migliori ti chiedessero perché restare, cosa risponderesti — onestamente?",
      "Qual è l'ultimo cambiamento che hai introdotto non perché necessario, ma perché avevi paura del senso di colpa da inazione?",
      "C'è qualcosa nella tua organizzazione che è stato abbandonato troppo presto? Cosa?",
    ],
  },
  {
    id: 5,
    settimana: "Settimana V",
    titolo: "Ora et Labora",
    sottotitolo: "Senza contemplazione, l'azione diventa agitazione.",
    descrizione:
      "«Prega e lavora» è il principio più noto di Benedetto — ma è anche il più frainteso. Non significa alternare momenti devozionali a ore produttive. Significa che il lavoro senza riflessione è idolatria del fare; e la riflessione senza lavoro è fuga dalla realtà. Folador vede nell'Ora et Labora il DNA dell'organizzazione sana: ritmo, non velocità.",
    versetto: {
      testo: "Otiositas inimica est animae; et ideo certis temporibus occupari debent fratres in labore manuum.",
      traduzione: "L'ozio è nemico dell'anima; perciò i fratelli devono essere occupati in certi orari nel lavoro delle mani.",
      fonte: "Regula Benedicti — Cap. XLVIII",
    },
    folador: "Folador propone il «bilancio contemplativo»: ogni settimana, misurare il rapporto tra ore di pensiero profondo (ora) e ore di esecuzione (labora). Non per colpevolizzarsi, ma per vedere la realtà.",
    pratica: {
      titolo: "Il Bilancio della Settimana",
      descrizione:
        "Per sette giorni, tieni un registro semplice: ogni sera segna le ore spese in «Ora» (lettura profonda, silenzio, riflessione, nessuno schermo) e in «Labora» (riunioni, email, decisioni operative, produzione). Alla fine della settimana: qual è il rapporto? Quale vorresti che fosse?",
    },
    riflessioni: [
      "Quando hai letto un libro intero, senza interromperti, per l'ultima volta? Come ti sei sentito dopo?",
      "Qual è la decisione più importante che hai preso quest'anno senza averci dormito sopra?",
      "Se potessi ricavare un'ora di «Ora» ogni giorno, da dove la toglieresti? E cosa ti impedisce di farlo?",
    ],
  },
  {
    id: 6,
    settimana: "Settimana VI",
    titolo: "Hospitalitas",
    sottotitolo: "\"Tutti gli ospiti che arrivano siano accolti come Cristo.\"",
    descrizione:
      "Il capitolo 53 della Regola è tra i più straordinari della letteratura organizzativa: «Omnes supervenientes hospites ut Christus suscipiantur». Tutti gli ospiti — non solo i graditi, non solo i clienti premium — come Cristo. Folador ne fa il fondamento di una cultura organizzativa radicalmente diversa: l'ospitalità come postura, non come servizio.",
    versetto: {
      testo: "Omnes supervenientes hospites ut Christus suscipiantur, quia ipse dicturus est: Hospes fui et suscepistis me.",
      traduzione: "Tutti gli ospiti che arrivano siano ricevuti come Cristo, poiché Egli stesso dirà: «Ero forestiero e mi avete ospitato».",
      fonte: "Regula Benedicti — Cap. LIII",
    },
    folador: "L'hospitalitas benedettina non è customer service: è un'ontologia. Chi entra nella tua organizzazione — cliente, fornitore, nuovo assunto, concorrente — porta con sé qualcosa che non puoi prevedere. Accoglierlo come Cristo significa restare aperti a quella sorpresa.",
    pratica: {
      titolo: "L'Audito dell'Ospitalità",
      descrizione:
        "Scegli tre «ospiti» della tua organizzazione questo mese: un cliente, un nuovo assunto, un fornitore. Per ciascuno, scrivi: come è stato accolto? Cosa ha vissuto entrando in contatto con te o con il tuo team? Cosa significa per te accoglierlo «come Cristo» — anche se non sei credente?",
    },
    riflessioni: [
      "Chi è l'«ospite» più scomodo della tua organizzazione in questo momento? Come lo stai trattando?",
      "La tua organizzazione ha un «volto» che accoglie? Come lo riconoscerebbe un estraneo?",
      "Cosa cambierebbe nel tuo modo di gestire i reclami, le difficoltà, i conflitti, se li accogliessi come opportunità di ospitalità?",
    ],
  },
];

// ── LocalStorage helpers ──────────────────────────────────────────────────────

const LS_KEY = "regula-operis-progress";

interface ModuleProgress {
  moduleId: number;
  status: "idle" | "started" | "completed";
  startedAt?: string;
  completedAt?: string;
}

function loadProgress(): ModuleProgress[] {
  try {
    return JSON.parse(localStorage.getItem(LS_KEY) || "[]");
  } catch {
    return [];
  }
}

// ── Pillar row component ──────────────────────────────────────────────────────

function Pillar({ lat, it }: { lat: string; it: string }) {
  return (
    <div className="flex items-start gap-3 border-b border-border/30 pb-3 last:border-0 last:pb-0">
      <span className="text-primary/50 mt-0.5 text-xs flex-none">✦</span>
      <div className="min-w-0">
        <span className="text-primary font-serif italic text-sm">{lat}</span>
        <span className="text-muted-foreground/50 text-xs ml-2 leading-relaxed">— {it}</span>
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function RegulaOperis() {
  const [progress, setProgress] = useState<ModuleProgress[]>([]);

  useEffect(() => {
    setProgress(loadProgress());
  }, []);

  const getStatus = (id: number) =>
    progress.find((p) => p.moduleId === id)?.status ?? "idle";

  const completedCount = progress.filter((p) => p.status === "completed").length;
  const startedCount   = progress.filter((p) => p.status !== "idle").length;

  return (
    <div className="w-full">

      {/* ── Hero con immagine ─────────────────────────────────────────── */}
      <section className="relative h-[380px] md:h-[460px] flex items-end overflow-hidden border-b border-border">
        <div className="absolute inset-0">
          <img
            src={`${B}rule-book.png`}
            alt="Regula Operis"
            className="w-full h-full object-cover object-center"
            style={{ filter: "brightness(0.48) contrast(1.14) saturate(0.55) sepia(0.18)" }}
          />
          <div className="absolute inset-0 pointer-events-none" style={{ background: "rgba(110, 60, 10, 0.15)" }} />
          <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at 50% 42%, transparent 30%, rgba(4,2,0,0.62) 100%)" }} />
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-background/97" />
        </div>

        <div className="relative z-10 container mx-auto px-5 md:px-6 max-w-4xl pb-10 md:pb-14">
          <p className="text-amber-200/55 tracking-[0.35em] text-[10px] uppercase mb-3">
            Regula Operis
          </p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif text-foreground leading-tight mb-2">
            L'organizzazione{" "}
            <span className="italic text-primary block sm:inline">come vocazione.</span>
          </h1>
          <p className="text-sm md:text-base text-muted-foreground/75 font-light max-w-lg leading-relaxed hidden sm:block">
            Sei settimane per applicare la Regola di Benedetto alla guida della tua organizzazione.
          </p>
        </div>
      </section>

      {/* ── Intro + Pilastri ──────────────────────────────────────────── */}
      <section className="py-12 md:py-16 bg-card border-b border-border">
        <div className="container mx-auto px-5 md:px-6 max-w-4xl">

          {/* Mobile: stacked. Desktop: side-by-side */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-start">
            <div>
              <p className="text-[10px] uppercase tracking-[0.3em] text-primary/70 mb-4">
                Il metodo
              </p>
              <p className="text-muted-foreground font-light leading-relaxed text-sm md:text-base mb-4">
                Massimo Folador ha scoperto nella Regola di Benedetto — scritta attorno al 530 d.C. — il più antico manuale di management occidentale. Non una metafora spirituale: un metodo concreto per governare comunità complesse.
              </p>
              <p className="text-muted-foreground font-light leading-relaxed text-sm md:text-base">
                Ogni modulo traduce uno dei pilastri benedettini in una pratica settimanale incarnata. Non letture, non teorie: esercizi che cambiano il modo di guidare.
              </p>
            </div>

            <div className="space-y-3">
              <Pillar lat="Ausculta"    it="Ascolta prima di decidere" />
              <Pillar lat="Stabilitas"  it="Rimani radicato quando tutto accelera" />
              <Pillar lat="Hospitalitas" it="Accogli ogni ospite come Cristo" />
              <Pillar lat="Ora et Labora" it="Alterna contemplazione e azione" />
              <Pillar lat="Communitas"  it="Guida al servizio, non al comando" />
            </div>
          </div>
        </div>
      </section>

      {/* ── Barra progresso ───────────────────────────────────────────── */}
      {startedCount > 0 && (
        <section className="py-6 bg-background border-b border-border">
          <div className="container mx-auto px-5 md:px-6 max-w-4xl">
            <div className="flex justify-between text-[10px] uppercase tracking-widest text-muted-foreground mb-3">
              <span>Il tuo cammino</span>
              <span>{completedCount} / 6 completati</span>
            </div>
            <div className="h-px bg-border relative">
              <div
                className="absolute top-0 left-0 h-px bg-primary transition-all duration-700"
                style={{ width: `${(completedCount / 6) * 100}%` }}
              />
            </div>
          </div>
        </section>
      )}

      {/* ── Lista moduli ──────────────────────────────────────────────── */}
      <section className="py-8 md:py-12 bg-background">
        <div className="container mx-auto px-5 md:px-6 max-w-4xl">
          <div className="border-t border-border">
            {MODULI_RO.map((modulo) => {
              const status      = getStatus(modulo.id);
              const isCompleted = status === "completed";
              const isStarted   = status === "started";

              return (
                <Link key={modulo.id} href={`/regula-operis/${modulo.id}`} className="group block">
                  <div className="flex gap-4 md:gap-7 py-6 md:py-9 border-b border-border hover:bg-card/50 active:bg-card/70 transition-colors">

                    {/* Status icon + connector */}
                    <div className="flex flex-col items-center flex-shrink-0 mt-0.5">
                      {isCompleted ? (
                        <CheckCircle className="w-5 h-5 text-primary" />
                      ) : isStarted ? (
                        <div className="w-5 h-5 rounded-full border-2 border-primary flex items-center justify-center">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                        </div>
                      ) : (
                        <Circle className="w-5 h-5 text-border" />
                      )}
                      {modulo.id < 6 && (
                        <div className="w-px flex-1 bg-border/60 mt-2 min-h-[1.5rem]" />
                      )}
                    </div>

                    {/* Testo */}
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground/45 mb-1.5">
                        {modulo.settimana}
                      </p>
                      <h2 className="text-xl md:text-2xl font-serif text-foreground group-hover:text-primary transition-colors leading-snug mb-1">
                        {modulo.titolo}
                      </h2>
                      <p className="text-xs md:text-sm text-muted-foreground/60 italic font-light mb-2">
                        {modulo.sottotitolo}
                      </p>
                      {/* Descrizione visibile solo su schermi md+ */}
                      <p className="hidden md:block text-muted-foreground font-light text-sm leading-relaxed line-clamp-2">
                        {modulo.descrizione}
                      </p>

                      {/* Versetto — sempre visibile */}
                      <div className="mt-2 md:mt-3 flex items-start gap-1.5">
                        <span className="text-primary/35 text-[10px] flex-none mt-0.5">✦</span>
                        <p className="text-[11px] text-muted-foreground/35 italic font-serif leading-snug">
                          «{modulo.versetto.testo.slice(0, 55)}…»
                        </p>
                      </div>
                    </div>

                    {/* Freccia */}
                    <div className="flex-none flex items-center pl-1">
                      <ArrowRight className="w-4 h-4 text-muted-foreground/25 group-hover:text-primary transition-colors" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Folador quote ─────────────────────────────────────────────── */}
      <section className="py-14 md:py-20 bg-card border-t border-border">
        <div className="container mx-auto px-5 md:px-6 max-w-2xl text-center">
          <p className="text-[10px] uppercase tracking-[0.3em] text-primary/50 mb-6">
            Fonte
          </p>
          <blockquote className="text-muted-foreground font-serif text-base md:text-lg italic leading-relaxed mb-5">
            "Benedetto non ha scritto un trattato di management.
            Ha scritto una Regola per vivere. Che sia diventata
            anche un manuale per guidare dice qualcosa di profondo
            sulla natura del lavoro umano."
          </blockquote>
          <p className="text-[10px] text-muted-foreground/35 uppercase tracking-widest">
            Ispirato a Massimo Folador — L'Organizzazione Perfetta
          </p>
        </div>
      </section>

    </div>
  );
}
