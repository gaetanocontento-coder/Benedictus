import { Link } from "wouter";
import { ArrowRight } from "lucide-react";

const VOCI = [
  {
    testo:
      "Habitavit secum — visse con se stesso. Non abbandonò mai se stesso, non uscì mai da se stesso.",
    fonte: "Gregorio Magno",
    opera: "Dialoghi, Libro II",
    lingua: "lat.",
  },
  {
    testo:
      "Sta' nella tua cella e la cella t'insegnerà tutto.",
    fonte: "Abba Mosè",
    opera: "Apoftegmi dei Padri del Deserto",
    lingua: "gr.",
  },
  {
    testo:
      "Il primo lavoro del monaco è combattere i propri pensieri. Nessun uomo può vedere il proprio viso nell'acqua turbata.",
    fonte: "Evagrio Pontico",
    opera: "Praktikos",
    lingua: "gr.",
  },
  {
    testo:
      "Tu ci hai fatto per te, o Signore, e il nostro cuore è inquieto finché non riposa in te.",
    fonte: "Agostino di Ippona",
    opera: "Confessioni, I, 1",
    lingua: "lat.",
  },
  {
    testo:
      "Ascolta, figlio, i precetti del maestro e tendi l'orecchio del tuo cuore.",
    fonte: "San Benedetto da Norcia",
    opera: "Regola, Prologo",
    lingua: "lat.",
  },
  {
    testo:
      "La solitudine non è dove si trovano pochi uomini, ma dove regna il silenzio delle passioni e della mente.",
    fonte: "Giovanni Climaco",
    opera: "Scala Paradisi, IV",
    lingua: "gr.",
  },
  {
    testo:
      "Nessuno può essere libero esteriormente se non è prima diventato libero interiormente.",
    fonte: "Meister Eckhart",
    opera: "Sermoni Tedeschi",
    lingua: "ted. med.",
  },
  {
    testo:
      "Il più grande viaggio che si possa fare è quello verso il centro di se stessi. Non ha mappa. Richiede coraggio.",
    fonte: "Thomas Merton",
    opera: "Nuovi Semi di Contemplazione",
    lingua: "en.",
  },
];

const SOGLIE = [
  {
    numero: "I",
    titolo: "La Custodia dei Pensieri",
    latino: "Custodia Cordis",
    testo:
      "I Padri del Deserto chiamavano questa pratica nepsis — vigilanza sobria. Non si tratta di svuotare la mente, ma di osservare ogni pensiero come ospite che entra in casa. Chi è? Da dove viene? Lo accogli o lo congedi? L'uomo che abita con se stesso conosce i propri movimenti interiori come il mugnaio conosce il mulino: ogni rumore ha un nome, ogni vibrazione racconta qualcosa.",
    pratica:
      "Al mattino, prima di alzarti, trascorri cinque minuti in silenzio ad osservare i pensieri che emergono. Non li seguire, non li respingere. Guardali come nuvole che attraversano il cielo.",
  },
  {
    numero: "II",
    titolo: "Il Silenzio come Spazio",
    latino: "Silentium Interius",
    testo:
      "Il silenzio benedettino non è assenza di suono: è presenza a se stessi. Benedetto dedica un intero capitolo della Regola al silenzio (cap. 6), non come regola di convivenza, ma come condizione dell'ascolto. Si parla solo quando la parola aggiunge qualcosa al silenzio. Altrimenti, il silenzio è già risposta.",
    pratica:
      "Scegli un'ora al giorno — preferibilmente la stessa ogni giorno — in cui non parli a meno che non sia necessario. Osserva come cambia la qualità della tua presenza agli altri.",
  },
  {
    numero: "III",
    titolo: "Il Ritorno a Se Stessi",
    latino: "Reditus ad Cor",
    testo:
      "Agostino lo chiamava reditus ad cor — tornare al cuore. Non è introversione psicologica né narcisismo spirituale. È riconoscere che ci si è dispersi: nelle cose da fare, nelle opinioni altrui, nel rumore del mondo. E fare il gesto semplice, rivoluzionario, di rientrare. Come il figliol prodigo che «tornò in sé» prima di tornare al padre.",
    pratica:
      "Tre volte al giorno — mattino, mezzogiorno, sera — fermati per un respiro. Solo uno. Conscio. Poi chiedi: «Dove sono adesso? Con chi sono?». Non rispondere con parole. Ascolta.",
  },
  {
    numero: "IV",
    titolo: "La Cella Interiore",
    latino: "Cella Interior",
    testo:
      "Il monaco porta la cella con sé. Anche nel mondo. La cella interiore è quella capacità di raccoglimento che non dipende dal luogo fisico, dal silenzio esterno, dall'assenza di impegni. È la stanza segreta di cui parla il Vangelo: «Entra nella tua camera, chiudi la porta e prega il Padre tuo che è nel segreto». Costruirla richiede anni. Non anni di sforzo, ma anni di fedeltà quotidiana al gesto del ritorno.",
    pratica:
      "Prima di ogni riunione importante, di ogni conversazione difficile, di ogni decisione — trenta secondi di silenzio interiore. Entra nella cella. Poi esci. Poi agisci.",
  },
];

export default function HabitareSecum() {
  return (
    <div className="w-full min-h-screen">

      {/* ── HERO ── */}
      <section className="relative min-h-[560px] flex items-center justify-center overflow-hidden bg-stone-950">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at 50% 60%, rgba(101,78,42,0.18) 0%, transparent 65%)",
          }}
        />
        {/* Decorative vertical line */}
        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-stone-700/40 to-transparent -translate-x-1/2" />

        <div className="relative z-10 container mx-auto px-6 max-w-3xl text-center py-24">
          <p className="text-[9px] uppercase tracking-[0.5em] text-stone-500 mb-8">
            Spiritualità Benedettina · Regula Humanitatis
          </p>

          <h1 className="font-serif text-6xl md:text-8xl text-stone-100 leading-none mb-6 tracking-tight">
            Habitare
            <br />
            <span className="italic text-stone-400/70">Secum</span>
          </h1>

          <div className="w-12 h-px bg-stone-600 mx-auto my-8" />

          <p className="text-stone-300/70 font-light text-lg leading-relaxed max-w-md mx-auto">
            Abitare con se stessi. Il primo atto di ogni leadership autentica.
            La condizione di ogni presenza reale.
          </p>

          <p className="mt-6 text-[10px] uppercase tracking-widest text-stone-600 italic">
            Gregorius Magnus · Dialogi II, 3
          </p>
        </div>
      </section>

      {/* ── APERTURA ── */}
      <section className="py-20 bg-background border-b border-border">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="grid md:grid-cols-5 gap-12 items-start">
            <div className="md:col-span-2">
              <p className="text-[9px] uppercase tracking-[0.35em] text-primary/50 mb-4">
                Il Testo Fondante
              </p>
              <div className="border-l-2 border-primary/20 pl-5">
                <p className="font-serif text-xl text-foreground italic leading-relaxed">
                  "Semper secum — sempre con se stesso."
                </p>
                <p className="text-xs uppercase tracking-widest text-muted-foreground/60 mt-3">
                  Gregorio Magno su Benedetto
                </p>
              </div>
            </div>
            <div className="md:col-span-3 space-y-5">
              <p className="text-foreground/80 font-light leading-loose text-base">
                Gregorio Magno, nel secondo libro dei <em>Dialoghi</em>, descrive Benedetto da Norcia con una formula che non è soltanto biografia: è un programma spirituale.{" "}
                <em>Habitavit secum</em> — visse con se stesso. Non si disperse, non fu travolto,
                non si perse nelle cose che accadevano fuori. Rimase presente a se stesso anche
                mentre agiva nel mondo.
              </p>
              <p className="text-muted-foreground font-light leading-loose text-base">
                Questa capacità — che i monaci chiamavano <em>custodia cordis</em>, custodia del
                cuore — non è una tecnica di rilassamento. È una forma di abitare. L'uomo che
                ha imparato a stare con se stesso non fugge nel lavoro, nel rumore, nell'opinione
                degli altri. Sa dove è la sua casa. E può costruire casa ovunque.
              </p>
              <p className="text-muted-foreground font-light leading-loose text-base">
                Questa sezione è una mappa per imparare quel cammino. Non attraverso l'efficienza,
                ma attraverso la presenza. Non con esercizi tecnici, ma con la fedeltà quotidiana
                a un gesto semplice: rientrare.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── VOCI DAL SILENZIO ── */}
      <section className="py-0 bg-card border-t border-border overflow-hidden">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="py-14 border-b border-border/60">
            <p className="text-[9px] uppercase tracking-[0.4em] text-primary/50 mb-2">
              Voci dal Silenzio
            </p>
            <h2 className="font-serif text-3xl text-foreground">
              Otto voci, una sola direzione
            </h2>
          </div>

          <div className="divide-y divide-border/40">
            {VOCI.map((v, i) => (
              <div
                key={i}
                className="py-12 grid md:grid-cols-12 gap-8 items-start group"
              >
                <div className="md:col-span-1 text-primary/20 font-serif text-4xl select-none leading-none">
                  {String(i + 1).padStart(2, "0")}
                </div>
                <div className="md:col-span-8">
                  <p className="font-serif text-xl md:text-2xl text-foreground italic leading-relaxed">
                    "{v.testo}"
                  </p>
                </div>
                <div className="md:col-span-3 md:text-right">
                  <p className="text-muted-foreground text-sm font-light">{v.fonte}</p>
                  <p className="text-muted-foreground/50 text-xs mt-1 uppercase tracking-widest">
                    {v.opera}
                  </p>
                  <p className="text-muted-foreground/30 text-[9px] mt-1 italic">{v.lingua}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── LE QUATTRO SOGLIE ── */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-6 max-w-4xl">
          <div className="mb-16 text-center">
            <p className="text-[9px] uppercase tracking-[0.4em] text-primary/50 mb-3">
              La Pratica
            </p>
            <h2 className="font-serif text-4xl text-foreground mb-4">
              Le Quattro Soglie
            </h2>
            <p className="text-muted-foreground font-light max-w-xl mx-auto leading-relaxed">
              Non tecniche ma soglie. Ciascuna è un modo di abitare se stessi
              più pienamente — nel lavoro, nella relazione, nella decisione.
            </p>
          </div>

          <div className="space-y-0">
            {SOGLIE.map((s, i) => (
              <div
                key={i}
                className={`grid md:grid-cols-12 gap-0 border border-border ${i > 0 ? "-mt-px" : ""}`}
              >
                {/* Numero & titolo */}
                <div className="md:col-span-4 border-b md:border-b-0 md:border-r border-border p-8 bg-card flex flex-col justify-between">
                  <div>
                    <span className="font-serif text-6xl text-primary/10 block leading-none mb-4">
                      {s.numero}
                    </span>
                    <h3 className="font-serif text-xl text-foreground mb-1">
                      {s.titolo}
                    </h3>
                    <p className="text-[10px] uppercase tracking-widest text-muted-foreground/50 italic">
                      {s.latino}
                    </p>
                  </div>
                </div>

                {/* Testo & pratica */}
                <div className="md:col-span-8 p-8 space-y-6">
                  <p className="text-foreground/75 font-light leading-loose text-sm">
                    {s.testo}
                  </p>
                  <div className="border-l-2 border-primary/20 pl-5 bg-primary/[0.02] py-3 pr-3">
                    <p className="text-[9px] uppercase tracking-widest text-primary/50 mb-2">
                      Pratica quotidiana
                    </p>
                    <p className="text-foreground/80 text-sm font-light leading-relaxed italic">
                      {s.pratica}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── GIORNATA DEL CUSTODE ── */}
      <section className="py-0 bg-card border-t border-border">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="py-14 border-b border-border/60">
            <p className="text-[9px] uppercase tracking-[0.4em] text-primary/50 mb-2">
              Il Ritmo
            </p>
            <h2 className="font-serif text-3xl text-foreground">
              La Giornata di chi abita con se stesso
            </h2>
          </div>

          <div className="grid md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-border/40 py-0">
            {[
              {
                ora: "Alba",
                latino: "Vigiliae",
                azione: "Soglia",
                testo:
                  "Prima di aprire il telefono, il computer, la mail — aprire gli occhi sul silenzio. Tre respiri. La domanda: chi voglio essere oggi?",
              },
              {
                ora: "Mezzogiorno",
                latino: "Meridies",
                azione: "Sosta",
                testo:
                  "Interrompere. Anche solo tre minuti. Rivedere la mattina come si rilegge una pagina difficile. Cosa era importante? Cosa ho dimenticato?",
              },
              {
                ora: "Tramonto",
                latino: "Vespera",
                azione: "Esame",
                testo:
                  "L'Esame di Coscienza ignaziano: non l'autoaccusa, ma lo sguardo lucido. Dove sono stato presente? Dove mi sono disperso? Cosa voglio fare diversamente?",
              },
              {
                ora: "Notte",
                latino: "Completorium",
                azione: "Consegna",
                testo:
                  "Deporre la giornata come si depone un peso. Riconoscere quello che non dipende da te. Dormire come atto di fiducia nel domani.",
              },
            ].map((momento, i) => (
              <div key={i} className="py-12 px-8 flex flex-col gap-4">
                <div>
                  <p className="text-primary/40 text-[9px] uppercase tracking-widest italic mb-0.5">
                    {momento.latino}
                  </p>
                  <p className="text-foreground font-serif text-xl">{momento.ora}</p>
                  <p className="text-muted-foreground/60 text-[10px] uppercase tracking-widest mt-1">
                    {momento.azione}
                  </p>
                </div>
                <p className="text-muted-foreground font-light text-sm leading-relaxed">
                  {momento.testo}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── LECTIO FINALE ── */}
      <section className="py-24 bg-background border-t border-border">
        <div className="container mx-auto px-6 max-w-3xl">
          <div className="text-center mb-14">
            <p className="text-[9px] uppercase tracking-[0.4em] text-primary/50 mb-3">
              Per Continuare
            </p>
            <h2 className="font-serif text-4xl text-foreground mb-5">
              Un testo per cominciare
            </h2>
          </div>

          {/* Brano meditativo */}
          <div className="bg-card border border-border px-8 md:px-12 py-10 mb-10">
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground/40 mb-6">
              Regola di San Benedetto · Prologo, 1–4
            </p>
            <p className="font-serif text-xl md:text-2xl text-foreground italic leading-loose mb-8">
              "Ascolta, figlio, i precetti del maestro, e tendi l'orecchio del tuo cuore.
              Accogli volentieri i consigli di un padre buono e mettili in pratica,
              affinché attraverso la fatica dell'obbedienza tu ritorni a colui
              dal quale ti eri allontanato per l'ignavia della disobbedienza."
            </p>
            <p className="text-muted-foreground font-light text-sm leading-relaxed border-t border-border pt-6">
              <em>Obsculta</em> — ascolta. La prima parola della Regola non è un imperativo morale,
              è un invito posturale: metti l'orecchio nel punto giusto. Non all'esterno soltanto,
              ma al cuore. Il testo che segue non è un codice di leggi ma una scuola di ascolto.
              La Regola insegna a stare fermi abbastanza a lungo da sentire qualcosa che vale la
              pena di sentire.
            </p>
          </div>

          {/* CTA doppio */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/liturgia/pratica"
              className="flex items-center justify-center gap-2 bg-primary text-primary-foreground px-8 py-3.5 text-xs uppercase tracking-widest hover:bg-primary/85 transition-colors"
            >
              Pratica Spirituale Guidata <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link
              href="/lectio"
              className="flex items-center justify-center gap-2 border border-border text-foreground/70 px-8 py-3.5 text-xs uppercase tracking-widest hover:border-primary/40 hover:text-primary transition-colors"
            >
              Lectio Divina del Giorno <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── CHIUSURA ── */}
      <section className="py-16 bg-background border-t border-border">
        <div className="container mx-auto px-6 max-w-xl text-center">
          <p className="font-serif text-3xl md:text-4xl text-foreground/80 italic leading-relaxed mb-6">
            "Non cercare fuori ciò che puoi trovare dentro.
            La casa è già costruita. Impara ad abitarla."
          </p>
          <div className="w-10 h-px bg-primary/30 mx-auto" />
        </div>
      </section>

    </div>
  );
}
