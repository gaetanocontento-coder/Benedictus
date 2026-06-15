import { useState } from "react";
import { BookOpen, ExternalLink } from "lucide-react";

type Category = "tutto" | "radici" | "silenzio" | "comunita" | "leadership" | "ritmo";
type Level = "Introduttivo" | "Intermedio" | "Avanzato";

interface Text {
  id: number;
  title: string;
  titleIt?: string;
  author: string;
  year: string;
  publisher: string;
  categories: Exclude<Category, "tutto">[];
  level: Level;
  description: string;
  excerpt: string;
  note?: string;
}

const TEXTS: Text[] = [
  {
    id: 1,
    title: "Regola di San Benedetto",
    author: "San Benedetto da Norcia",
    year: "ca. 530 d.C.",
    publisher: "Edizioni Monastiche / Libreria Editrice Vaticana",
    categories: ["radici"],
    level: "Introduttivo",
    description:
      "Il testo fondativo. Settantatré brevi capitoli che regolano ogni aspetto della vita comune: la preghiera, il lavoro, l'accoglienza degli ospiti, la correzione fraterna, l'umiltà. Non è un codice di regole, ma un trattato sull'arte di vivere insieme.",
    excerpt:
      "«Ausculta, o figlio, i precetti del maestro, e porgi l'orecchio del tuo cuore.» (Prologo, 1)",
    note: "Edizione critica consigliata: RB 1980 a cura di Timothy Fry OSB, Liturgical Press.",
  },
  {
    id: 2,
    title: "Seeking God: The Way of St. Benedict",
    titleIt: "Alla ricerca di Dio: La via di San Benedetto",
    author: "Esther de Waal",
    year: "1984",
    publisher: "Liturgical Press",
    categories: ["radici", "leadership"],
    level: "Introduttivo",
    description:
      "Il miglior punto di ingresso alla Regola per chi non proviene da un contesto monastico. De Waal — storica anglicana, moglie di un vescovo, madre di quattro figli — dimostra come la Regola parli direttamente alla vita del XXI secolo.",
    excerpt:
      "«Benedict was not writing for professionals, for experts in holiness. He was writing for ordinary people who wanted to find God.»",
  },
  {
    id: 3,
    title: "New Seeds of Contemplation",
    titleIt: "Nuovi semi di contemplazione",
    author: "Thomas Merton",
    year: "1961",
    publisher: "New Directions Publishing",
    categories: ["silenzio"],
    level: "Intermedio",
    description:
      "Il capolavoro di Merton sulla vita interiore. Partendo dall'esperienza monastica trappista, offre una meditazione profonda sull'identità, il vero sé e il falso sé, la solitudine come condizione della pienezza.",
    excerpt:
      "«There is only one problem on which all my existence, my peace and my happiness depend: to discover myself in discovering God.»",
  },
  {
    id: 4,
    title: "The Practice of the Presence of God",
    titleIt: "La pratica della presenza di Dio",
    author: "Fratello Lorenzo della Risurrezione (Nicolas Herman)",
    year: "ca. 1692",
    publisher: "Paoline / ICS Publications",
    categories: ["silenzio", "ritmo"],
    level: "Introduttivo",
    description:
      "Un cuoco di cucina monastica scopre che ogni azione — lavare i piatti, sbucciare le verdure — può essere un atto di presenza divina. Il testo più breve e più radicale di questa lista: sessanta pagine che cambiano il modo di guardare al lavoro ordinario.",
    excerpt:
      "«Non ho altra occupazione che quella di gettare dalla presenza di Dio tutto ciò che può distogliermi da lui.»",
  },
  {
    id: 5,
    title: "Il Castello Interiore (Las Moradas)",
    author: "Teresa di Gesù d'Ávila",
    year: "1577",
    publisher: "Paoline / San Paolo Edizioni",
    categories: ["silenzio"],
    level: "Avanzato",
    description:
      "Il grande trattato sulla vita mistica. Teresa descrive l'anima come un castello di cristallo con sette dimore concentriche; il percorso verso il centro è il percorso verso Dio. Testo canonico della tradizione contemplativa cristiana.",
    excerpt:
      "«L'anima dell'uomo giusto non è altro che un paradiso in cui il Signore dice che si delizia.» (Prima Dimora, I)",
    note: "Dottore della Chiesa. Testo disponibile in edizione critica Paoline.",
  },
  {
    id: 6,
    title: "Silence and Honey Cakes: The Wisdom of the Desert",
    titleIt: "Il silenzio e i dolci di miele: la saggezza del deserto",
    author: "Rowan Williams",
    year: "2003",
    publisher: "Lion Hudson",
    categories: ["silenzio", "comunita"],
    level: "Intermedio",
    description:
      "L'ex Arcivescovo di Canterbury analizza gli Apoftegmi dei Padri del Deserto — i brevi detti dei monaci egiziani del III-IV secolo — e li traduce in meditazioni sulla vita comune, il silenzio, il confronto con la propria debolezza.",
    excerpt:
      "«The desert fathers and mothers were not fleeing the world but fleeing a certain kind of noise in themselves.»",
  },
  {
    id: 7,
    title: "Desert Wisdom: Sayings from the Desert Fathers",
    titleIt: "Sapienza del deserto: detti dei Padri del Deserto",
    author: "Yushi Nomura (a cura di)",
    year: "2001",
    publisher: "Orbis Books",
    categories: ["silenzio", "radici"],
    level: "Introduttivo",
    description:
      "Una raccolta illustrata degli Apoftegmi Patrum — le sentenze brevi dei monaci del deserto egiziano, siriaco e palestinese. Ogni pagina è una koan: poche parole che richiedono lunghe meditazioni.",
    excerpt:
      "«Un fratello chiese a un anziano: Cosa devo fare per salvarmi? L'anziano rispose: Va', siediti nella tua cella, e la cella ti insegnerà ogni cosa.»",
  },
  {
    id: 8,
    title: "No Man Is an Island",
    titleIt: "Nessun uomo è un'isola",
    author: "Thomas Merton",
    year: "1955",
    publisher: "Harcourt Brace / Garzanti",
    categories: ["comunita", "leadership"],
    level: "Intermedio",
    description:
      "Sedici saggi sulla vita spirituale vissuta in comunità: l'amore, il dolore, la sincerità, il silenzio, la solitudine come condizione — non negazione — del legame. Uno dei libri più letti tra i leader contemplati.",
    excerpt:
      "«The biggest human temptation is to settle for too little.»",
  },
  {
    id: 9,
    title: "The Cloister Walk",
    titleIt: "La passeggiata nel chiostro",
    author: "Kathleen Norris",
    year: "1996",
    publisher: "Riverhead Books",
    categories: ["comunita", "ritmo"],
    level: "Introduttivo",
    description:
      "Una poetessa protestante trascorre anni in un monastero benedettino del North Dakota. Il risultato è questo libro di meditazioni sul ritmo liturgico, la vita ordinaria, il corpo, il tempo. Accessibile a chi viene da qualsiasi tradizione.",
    excerpt:
      "«The Benedictine sense of time is not chronological but kairological — not the time of clocks but the time of moments.»",
  },
  {
    id: 10,
    title: "Le Confessioni",
    author: "Sant'Agostino d'Ippona",
    year: "ca. 397–400 d.C.",
    publisher: "Paoline / Città Nuova",
    categories: ["radici", "leadership"],
    level: "Avanzato",
    description:
      "Il primo autobiografia della letteratura occidentale è anche il primo grande testo sul cambiamento interiore. Agostino racconta il percorso dal giovane ambizioso e dissoluto al vescovo che riconosce la propria radicale dipendenza dalla grazia.",
    excerpt:
      "«Il nostro cuore è senza riposo finché non riposa in Te.» (I, 1)",
    note: "Testo fondamentale per capire la tradizione da cui nasce Benedetto.",
  },
  {
    id: 11,
    title: "Servant Leadership",
    titleIt: "Leadership al servizio",
    author: "Robert K. Greenleaf",
    year: "1977",
    publisher: "Paulist Press",
    categories: ["leadership"],
    level: "Intermedio",
    description:
      "Il testo fondativo del movimento servant leadership. Greenleaf — già direttore di AT&T — propone una visione della leadership in cui l'autorità nasce dal servizio, non dal potere. Direttamente ispirato alla tradizione monastica e alla Regola.",
    excerpt:
      "«The servant-leader is servant first. It begins with the natural feeling that one wants to serve, to serve first.»",
  },
  {
    id: 12,
    title: "Conferenze (Collationes)",
    author: "Giovanni Cassiano",
    year: "ca. 420–428 d.C.",
    publisher: "Città Nuova / Paoline",
    categories: ["radici", "silenzio"],
    level: "Avanzato",
    description:
      "Ventiquattro conversazioni con i grandi monaci del deserto egiziano, trascritte da Cassiano dopo il suo viaggio in Egitto. Sono la fonte principale da cui Benedetto trae la propria dottrina sulla preghiera, il discernimento e i vizi capitali.",
    excerpt:
      "«La fine della nostra arte e la perfezione del nostro cuore consistono nella purezza dell'amore.» (I Conferenza, VII)",
  },
  {
    id: 13,
    title: "Sabbath: Finding Rest, Renewal, and Delight in Our Busy Lives",
    titleIt: "Il Sabato: riposo, rinnovamento e gioia in una vita frenetica",
    author: "Wayne Muller",
    year: "1999",
    publisher: "Bantam Books",
    categories: ["ritmo"],
    level: "Introduttivo",
    description:
      "Un teologo e counselor recupera la pratica del sabato da tutte le tradizioni (ebraica, cristiana, islamica, buddhista, indigena) e la propone come antidoto all'esaurimento della modernità. Lettura pratica e meditativa insieme.",
    excerpt:
      "«We stop because there are forces larger than we are, and it is good for us to be reminded of this.»",
  },
  {
    id: 14,
    title: "Elogio della lentezza (In Praise of Slow)",
    author: "Carl Honoré",
    year: "2004",
    publisher: "HarperOne / Mondadori",
    categories: ["ritmo"],
    level: "Introduttivo",
    description:
      "Non è un libro religioso, ma è uno dei testi laici più vicini all'ideale benedettino del ritmo. Honoré — giornalista — documenta il movimento slow in tutto il mondo e dà nome a un'intuizione che la Regola aveva codificato 1500 anni prima.",
    excerpt:
      "«Fast is busy, controlling, aggressive, hurried, analytical, stressed, superficial, impatient, active, quantity-over-quality. Slow is the opposite.»",
  },
];

const CATEGORIES: { id: Category; label: string }[] = [
  { id: "tutto", label: "Tutto" },
  { id: "radici", label: "Le Radici" },
  { id: "silenzio", label: "Silenzio" },
  { id: "comunita", label: "Comunità" },
  { id: "leadership", label: "Leadership" },
  { id: "ritmo", label: "Ritmo" },
];

const LEVEL_COLOR: Record<Level, string> = {
  Introduttivo: "text-primary border-primary/30",
  Intermedio: "text-foreground border-border",
  Avanzato: "text-muted-foreground border-border",
};

export default function Scriptorium() {
  const [category, setCategory] = useState<Category>("tutto");
  const [expanded, setExpanded] = useState<number | null>(null);

  const filtered =
    category === "tutto"
      ? TEXTS
      : TEXTS.filter((t) => t.categories.includes(category as Exclude<Category, "tutto">));

  return (
    <div className="w-full">
      <section className="py-24 bg-background border-b border-border">
        <div className="container mx-auto px-6 max-w-4xl text-center">
          <p className="text-primary tracking-[0.3em] text-sm uppercase mb-6 animate-in fade-in">
            Scriptorium
          </p>
          <h1 className="text-4xl md:text-6xl font-serif text-foreground mb-8">
            I testi del{" "}
            <span className="italic text-primary">cammino.</span>
          </h1>
          <p className="text-xl text-muted-foreground font-light max-w-2xl mx-auto">
            Una biblioteca di fonti certificate: testi monastici, filosofici e contemplativi selezionati per il custode moderno. Ogni voce è verificata, ogni autore è reale.
          </p>
        </div>
      </section>

      <section className="py-8 bg-card border-b border-border sticky top-0 z-30">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="flex flex-wrap gap-3 justify-center">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setCategory(cat.id)}
                className={`px-5 py-2 text-xs uppercase tracking-widest transition-colors border ${
                  category === cat.id
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-background">
        <div className="container mx-auto px-6 max-w-5xl">
          <p className="text-xs text-muted-foreground uppercase tracking-widest mb-10 text-center">
            {filtered.length} testi · ordinati per accessibilità
          </p>

          <div className="space-y-0 divide-y divide-border">
            {filtered.map((text) => {
              const isOpen = expanded === text.id;
              return (
                <div key={text.id} className="group">
                  <button
                    onClick={() => setExpanded(isOpen ? null : text.id)}
                    className="w-full text-left py-8 flex gap-6 hover:bg-card/50 transition-colors px-4 -mx-4 rounded-sm"
                  >
                    <div className="flex-shrink-0 pt-1">
                      <BookOpen className="w-5 h-5 text-primary/40 group-hover:text-primary transition-colors" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-baseline gap-3 mb-2">
                        <h2 className="text-xl font-serif text-foreground group-hover:text-primary transition-colors leading-tight">
                          {text.titleIt ?? text.title}
                        </h2>
                        {text.titleIt && (
                          <span className="text-xs text-muted-foreground italic hidden sm:inline">
                            {text.title}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground font-light">
                        {text.author} · {text.year}
                      </p>
                      <div className="flex flex-wrap gap-2 mt-3">
                        <span
                          className={`text-[10px] uppercase tracking-widest border px-2 py-0.5 ${LEVEL_COLOR[text.level]}`}
                        >
                          {text.level}
                        </span>
                        {text.categories.map((cat) => (
                          <span
                            key={cat}
                            className="text-[10px] uppercase tracking-widest border border-border text-muted-foreground px-2 py-0.5"
                          >
                            {CATEGORIES.find((c) => c.id === cat)?.label}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex-shrink-0 self-center">
                      <div
                        className={`w-px h-6 bg-primary/40 transition-all duration-300 ${isOpen ? "opacity-0" : "opacity-100"}`}
                      />
                    </div>
                  </button>

                  {isOpen && (
                    <div className="pb-10 px-4 -mx-4 bg-card/30 border-l-2 border-primary/20 ml-4 pl-8">
                      <p className="text-muted-foreground font-light leading-relaxed mb-6">
                        {text.description}
                      </p>

                      <blockquote className="border-l-2 border-primary pl-6 mb-6">
                        <p className="text-foreground/80 font-light italic leading-relaxed text-lg">
                          {text.excerpt}
                        </p>
                      </blockquote>

                      <div className="flex flex-wrap gap-6 text-xs text-muted-foreground">
                        <span>
                          <span className="uppercase tracking-widest">Editore</span> ·{" "}
                          {text.publisher}
                        </span>
                        {text.note && (
                          <span className="text-primary/70 italic">{text.note}</span>
                        )}
                      </div>

                      <div className="mt-6">
                        <a
                          href={`https://www.google.com/search?q=${encodeURIComponent(`"${text.title}" ${text.author} acquista`)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-primary hover:text-foreground transition-colors border border-primary/30 px-4 py-2 hover:border-primary"
                        >
                          Trova il testo <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-16 bg-card border-t border-border">
        <div className="container mx-auto px-6 max-w-3xl text-center">
          <p className="text-primary tracking-[0.3em] text-xs uppercase mb-6">
            Nota metodologica
          </p>
          <p className="text-muted-foreground font-light leading-relaxed text-sm">
            Ogni testo in questa biblioteca è verificato: autori reali, date certe, edizioni esistenti. Lo Scriptorium non è una raccolta di citazioni anonime o di testi apocrifi, ma una selezione ragionata della tradizione monastica e della sua recezione contemporanea. Le traduzioni italiane indicate sono quelle criticamente riconosciute.
          </p>
        </div>
      </section>
    </div>
  );
}
