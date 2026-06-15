import { useParams, Link } from "wouter";
import { CheckCircle, ArrowRight, ArrowLeft, Lock } from "lucide-react";
import { useAuth } from "@/lib/auth";
import {
  useBGetPercorsoProgress,
  useBStartModule,
  useBCompleteModule,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { getBGetPercorsoProgressQueryKey } from "@workspace/api-client-react";

const MODULES = [
  {
    id: 1,
    month: "Mese 1",
    title: "La Desolazione dell'Ego",
    subtitle: "Il punto di partenza è demolire, non costruire.",
    body: [
      "Il punto di partenza di ogni cammino benedettino è paradossale: non costruire, ma demolire. Benedetto inizia la sua Regola con una parola sola: «Ausculta» — ascolta. Prima ancora di agire, di produrre, di guidare, ci viene chiesto di fermarci e ascoltare. Ma cosa ostacola l'ascolto? L'ego — quella struttura difensiva che ci racconta una versione di noi stessi compatibile con il controllo e l'onnipotenza.",
      "Questo primo modulo non è un corso di umiltà, ma un'indagine empirica. Benedetto identifica dodici gradi di umiltà — non come virtù astratta, ma come metodo per svelare la realtà che la maschera professionale nasconde. Prima di guidare gli altri, occorre diventare onesti con sé stessi.",
      "La desolazione dell'ego non è una punizione: è una liberazione. Quando smettiamo di difendere un'immagine, diventiamo finalmente disponibili all'incontro reale.",
    ],
    pratica: {
      titolo: "Il Silenzio dei Dieci Minuti",
      descrizione:
        "Ogni mattina, prima di aprire il telefono o accendere lo schermo, rimani seduto in silenzio per dieci minuti. Niente agenda, niente liste, niente previsioni. Solo la presenza. Se emergono pensieri, osservali passare senza inseguirli.",
    },
    riflessioni: [
      "Qual è la narrazione che faccio di me stesso agli altri? In cosa differisce da quello che penso davvero di me?",
      "Quando mi sento minacciato, cosa difendo esattamente? Una competenza, un ruolo, un'immagine?",
      "Cosa succederebbe se lasciassi cadere quella difesa per un solo giorno?",
    ],
    lectioCorrelata: "Ora et Labora: Ritrovare il Ritmo Perduto",
  },
  {
    id: 2,
    month: "Mese 2",
    title: "L'Arte dell'Ascolto",
    subtitle: "Ascoltare con l'orecchio del cuore.",
    body: [
      "La Regola di Benedetto inizia con «Ausculta» — un ascolto non passivo, ma attivo, direzionato, con l'«orecchio del cuore». Questo tipo di ascolto richiede un prerequisito insolito per il mondo moderno: il silenzio interno.",
      "Il leader contemporaneo è formato per rispondere, non per ascoltare. Risponde alle email, alle crisi, alle opportunità. Ma l'ascolto profondo — quello che coglie ciò che non viene detto, la tensione sotto le parole, il bisogno dietro la richiesta — richiede una capacità radicalmente diversa.",
      "In questo modulo alleniamo quella capacità in modo sistematico, con esercizi tratti dalla tradizione monastica e adattati al contesto professionale. L'ascolto non è una tecnica: è una postura dell'anima.",
    ],
    pratica: {
      titolo: "La Pausa Prima della Risposta",
      descrizione:
        "In ogni riunione questa settimana, scegli almeno un momento in cui avresti risposto immediatamente e invece aspetta. Conta cinque secondi in silenzio prima di parlare. Non per elaborare la risposta migliore, ma per ascoltare più a fondo. Osserva cosa emerge nello spazio.",
    },
    riflessioni: [
      "Chi ti parla regolarmente di cui non hai mai veramente ascoltato i bisogni più profondi?",
      "Quando stai ascoltando qualcuno, sei presente o stai già formulando la risposta?",
      "Il silenzio per te è un vuoto da riempire o uno spazio da abitare?",
    ],
    lectioCorrelata: "L'Umiltà come Strategia: Il Paradosso del Leader Silenzioso",
  },
  {
    id: 3,
    month: "Mese 3",
    title: "Ritmo e Riposo",
    subtitle: "Il riposo non è assenza di lavoro. È il suo fondamento.",
    body: [
      "Il monastero benedettino è organizzato intorno al concetto di ritmo: l'alternanza di preghiera, lavoro e studio scandisce le ore, i giorni, le stagioni. Non c'è frenetica accelerazione, ma un tempo ciclico che ritorna su sé stesso, che lascia spazio alla rigenerazione.",
      "Il mondo contemporaneo ha dimenticato il ritmo. Viviamo in uno stato di emergenza permanente, dove il riposo è percepito come fallimento o debolezza. Il risultato è un'epidemia di esaurimento che colpisce soprattutto i migliori — quelli che si danno di più.",
      "Questo modulo non è un corso sul work-life balance. È un'indagine più profonda: perché abbiamo paura di fermarci? Cosa temiamo di trovare nel silenzio del riposo? E come il ritmo benedettino può restituirci la capacità di essere presenti — davvero presenti — al nostro lavoro e alle nostre relazioni.",
    ],
    pratica: {
      titolo: "Il Sabato del Custode",
      descrizione:
        "Scegli un giorno a settimana (non necessariamente il sabato) come giorno di riposo consapevole. Niente email, niente decisioni lavorative. Non per inerzia, ma per una scelta attiva: questo giorno appartiene alla tua rigenerazione. Annota alla fine del giorno cosa si è aperto in te.",
    },
    riflessioni: [
      "Quando ti fermi davvero? Riesci a ricordare l'ultima volta che hai riposato senza sensi di colpa?",
      "Qual è la convinzione che ti impedisce di rallentare? Da dove viene?",
      "Se il tuo ritmo lavorativo fosse visibile come una linea su un grafico, che forma avrebbe?",
    ],
    lectioCorrelata: "Ora et Labora: Ritrovare il Ritmo Perduto",
  },
  {
    id: 4,
    month: "Mese 4",
    title: "La Comunità Intenzionale",
    subtitle: "Passare dal team alla comunità di scopo.",
    body: [
      "Il monastero non è una famiglia. Non è un'azienda. È qualcosa di terzo: un esperimento di vita comune volontaria, con regole esplicite, un'autorità riconosciuta e uno scopo condiviso che supera l'interesse individuale. Benedetto chiama questa comunità «schola» — scuola del servizio del Signore.",
      "Nel mondo del lavoro parliamo spesso di team building, di cultura aziendale, di valori. Ma raramente creiamo le condizioni per una comunità vera: un gruppo di persone che si conoscono in profondità, che si fidano le une delle altre non perché ci sono i giusti incentivi, ma perché hanno costruito qualcosa insieme.",
      "Questo modulo esplora come creare legami autentici in un contesto professionale — attraverso la vulnerabilità condivisa, la responsabilità reciproca, e la pratica del consiglio (la benedettina «consultatio»).",
    ],
    pratica: {
      titolo: "La Consultatio",
      descrizione:
        "Prima di una decisione importante questa settimana, chiedi consiglio a qualcuno che di solito non consulti. Non per condividere la responsabilità, ma per ascoltare una prospettiva genuinamente diversa. Fallo senza presupporre di conoscere già la risposta.",
    },
    riflessioni: [
      "Nel tuo team, chi conosci davvero — non come professionista, ma come persona?",
      "C'è qualcuno con cui hai un conflitto irrisolto? Cosa ci vorrebbe per affrontarlo?",
      "Cosa distingue un gruppo di lavoro da una comunità? Cosa manca nel tuo contesto?",
    ],
    lectioCorrelata: "Comunità come Metodologia",
  },
  {
    id: 5,
    month: "Mese 5",
    title: "Stabilità nel Caos",
    subtitle: "Radicati nei principi immutabili, navighi l'incertezza.",
    body: [
      "Benedetto chiede ai monaci il voto di «stabilitas» — la stabilità. In un'epoca di fluidità totale, dove tutto può cambiare in un istante, questo voto sembra arcaico. Eppure è forse il più rilevante per il leader contemporaneo.",
      "La stabilità benedettina non è immobilismo: è la capacità di mantenere il centro quando tutto intorno accelera. È avere un'identità sufficientemente radicata da non essere travolta dalle mode, dalle crisi, dalle pressioni esterne. È saper dire di no non per paura, ma per fedeltà a qualcosa di più grande.",
      "In questo modulo esploriamo cosa significa essere «stabili» — come persone, come leader, come organizzazioni. Identifichiamo i principi non negoziabili e costruiamo le pratiche che ci permettono di tornare al centro quando ne siamo stati allontanati.",
    ],
    pratica: {
      titolo: "La Carta dei Principi",
      descrizione:
        "Scrivi su carta — non in digitale — cinque principi non negoziabili che guidano il tuo agire professionale. Non valori astratti, ma criteri concreti per prendere decisioni. Tienila sul tuo tavolo per tutta la settimana. Al termine, chiedi: quante decisioni ho preso in accordo con questi principi?",
    },
    riflessioni: [
      "Qual è stato l'ultimo momento in cui hai ceduto a una pressione esterna tradendo qualcosa in cui credi?",
      "C'è qualcosa di cui hai paura di perdere il controllo? Quella paura è un segnale di cosa?",
      "Cosa rende stabile una persona? L'assenza di cambiamento o qualcosa d'altro?",
    ],
    lectioCorrelata: "Custodia della Terra Comune",
  },
  {
    id: 6,
    month: "Mese 6",
    title: "Il Voto del Custode",
    subtitle: "La consacrazione del cammino. La fecondità come promessa.",
    body: [
      "Il sesto mese è il culmine. Non un arrivo, ma una soglia. Il «Voto del Custode» è il momento in cui ciò che è stato compreso durante il percorso diventa impegno: verso le persone affidate, verso la comunità, verso il progetto che si porta nel mondo.",
      "Benedetto distingue tra chi lavora per il proprio vantaggio e chi lavora per il bene comune. Il custode è colui che ha imparato a tenere insieme entrambe le dimensioni: cura di sé e cura dell'altro, ambizione personale e responsabilità collettiva.",
      "Questo modulo non si chiude con una cerimonia, ma con una domanda: sei pronto a fare del tuo modo di guidare una forma di servizio? Non servitù — servizio. La differenza è la libertà con cui si sceglie.",
    ],
    pratica: {
      titolo: "La Lettera al Futuro",
      descrizione:
        "Scrivi una lettera a chi sarai tra un anno. Descriviti come custode: come ti prendi cura delle persone intorno a te, come tieni insieme il centro e la missione, cosa hai imparato in questi sei mesi. Non scriverla al futuro — scrivila al presente, come se quella versione di te fosse già reale.",
    },
    riflessioni: [
      "Di chi ti senti responsabile, davvero? Chi dipende dal tuo modo di essere leader?",
      "Cosa significa per te «fecondità» — non efficienza, non risultati, ma fecondità?",
      "Sei disposto a fare del tuo modo di guidare un atto d'amore verso il mondo?",
    ],
    lectioCorrelata: "Custodia della Terra Comune",
  },
];

export default function ModuloDetail() {
  const params = useParams<{ id: string }>();
  const moduleId = parseInt(params.id ?? "1", 10);
  const modulo = MODULES.find((m) => m.id === moduleId);

  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: progress = [] } = useBGetPercorsoProgress({
    query: { enabled: !!user, queryKey: getBGetPercorsoProgressQueryKey() },
  });

  const startMutation = useBStartModule({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: getBGetPercorsoProgressQueryKey(),
        });
      },
    },
  });

  const completeMutation = useBCompleteModule({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: getBGetPercorsoProgressQueryKey(),
        });
      },
    },
  });

  if (!modulo) {
    return (
      <div className="flex-1 flex items-center justify-center py-48 text-muted-foreground">
        Modulo non trovato.
      </div>
    );
  }

  const myProgress = progress.find((p) => p.moduleId === moduleId);
  const isStarted = !!myProgress;
  const isCompleted = !!myProgress?.completedAt;

  const prevModule = moduleId > 1 ? moduleId - 1 : null;
  const nextModule = moduleId < 6 ? moduleId + 1 : null;

  return (
    <div className="w-full">
      <section className="py-24 bg-background border-b border-border">
        <div className="container mx-auto px-6 max-w-3xl">
          <Link
            href="/percorso"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors mb-10"
          >
            <ArrowLeft className="w-3 h-3" /> Il Percorso
          </Link>

          <p className="text-primary tracking-[0.3em] text-sm uppercase mb-4">
            {modulo.month}
          </p>
          <h1 className="text-4xl md:text-5xl font-serif text-foreground mb-4">
            {modulo.title}
          </h1>
          <p className="text-lg text-muted-foreground font-light italic">
            {modulo.subtitle}
          </p>

          {user && (
            <div className="mt-8 flex items-center gap-4">
              {isCompleted ? (
                <span className="inline-flex items-center gap-2 text-primary border border-primary/30 px-6 py-2 text-sm uppercase tracking-widest">
                  <CheckCircle className="w-4 h-4" /> Completato
                </span>
              ) : isStarted ? (
                <button
                  onClick={() => completeMutation.mutate({ id: moduleId })}
                  disabled={completeMutation.isPending}
                  className="bg-primary text-primary-foreground hover:bg-primary/90 transition-colors px-8 py-3 uppercase tracking-widest text-sm disabled:opacity-50"
                >
                  {completeMutation.isPending ? "Salvataggio…" : "Segna come completato"}
                </button>
              ) : (
                <button
                  onClick={() => startMutation.mutate({ id: moduleId })}
                  disabled={startMutation.isPending}
                  className="bg-primary text-primary-foreground hover:bg-primary/90 transition-colors px-8 py-3 uppercase tracking-widest text-sm disabled:opacity-50"
                >
                  {startMutation.isPending ? "Avvio…" : "Inizia questo modulo"}
                </button>
              )}
            </div>
          )}

          {!user && (
            <div className="mt-8 flex items-center gap-3 text-sm text-muted-foreground">
              <Lock className="w-4 h-4" />
              <span>
                <Link href="/registrazione" className="text-primary hover:underline">
                  Registrati
                </Link>{" "}
                per tracciare il tuo cammino.
              </span>
            </div>
          )}
        </div>
      </section>

      <section className="py-20 bg-card">
        <div className="container mx-auto px-6 max-w-3xl">
          <div className="space-y-8 text-muted-foreground font-light leading-relaxed text-lg">
            {modulo.body.map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-background border-t border-border">
        <div className="container mx-auto px-6 max-w-3xl">
          <p className="text-primary tracking-[0.3em] text-xs uppercase mb-8">
            Pratica Quotidiana
          </p>
          <h2 className="text-2xl font-serif text-foreground mb-6">
            {modulo.pratica.titolo}
          </h2>
          <p className="text-muted-foreground font-light leading-relaxed">
            {modulo.pratica.descrizione}
          </p>
        </div>
      </section>

      <section className="py-20 bg-card border-t border-border">
        <div className="container mx-auto px-6 max-w-3xl">
          <p className="text-primary tracking-[0.3em] text-xs uppercase mb-8">
            Domande di Riflessione
          </p>
          <div className="space-y-8">
            {modulo.riflessioni.map((domanda, i) => (
              <div key={i} className="flex gap-6">
                <span className="text-primary/40 font-serif text-2xl leading-tight mt-1 flex-shrink-0">
                  {i + 1}.
                </span>
                <p className="text-muted-foreground font-light leading-relaxed italic text-lg">
                  "{domanda}"
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {user && isStarted && !isCompleted && (
        <section className="py-16 bg-background border-t border-border text-center">
          <div className="container mx-auto px-6 max-w-3xl">
            <p className="text-muted-foreground font-light mb-6">
              Hai praticato e riflettuto. Quando ti senti pronto, segna questo modulo come completato.
            </p>
            <button
              onClick={() => completeMutation.mutate({ id: moduleId })}
              disabled={completeMutation.isPending}
              className="border border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all px-10 py-4 uppercase tracking-widest text-sm disabled:opacity-50"
            >
              {completeMutation.isPending ? "Salvataggio…" : "Segna come completato"}
            </button>
          </div>
        </section>
      )}

      <section className="py-16 border-t border-border bg-card">
        <div className="container mx-auto px-6 max-w-3xl flex justify-between items-center">
          {prevModule ? (
            <Link
              href={`/percorso/${prevModule}`}
              className="inline-flex items-center gap-2 text-sm uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Mese {prevModule}
            </Link>
          ) : (
            <div />
          )}

          <Link
            href="/percorso"
            className="text-xs uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors"
          >
            Il Percorso
          </Link>

          {nextModule ? (
            <Link
              href={`/percorso/${nextModule}`}
              className="inline-flex items-center gap-2 text-sm uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors"
            >
              Mese {nextModule}
              <ArrowRight className="w-4 h-4" />
            </Link>
          ) : (
            <div />
          )}
        </div>
      </section>
    </div>
  );
}
