import { useState, useRef } from "react";
import { Play, X, Clock, MapPin } from "lucide-react";

type Categoria = "vita monastica" | "canto gregoriano" | "eremi" | "testimonianze";

type Video = {
  id: string;
  titolo: string;
  sottotitolo: string;
  categoria: Categoria;
  descrizione: string;
  durata: string;
  luogo: string;
};

const CATEGORIE: { id: string; label: string }[] = [
  { id: "tutte",            label: "Tutte"              },
  { id: "vita monastica",   label: "Vita Monastica"     },
  { id: "canto gregoriano", label: "Canto Gregoriano"   },
  { id: "eremi",            label: "Eremi & Silenzio"   },
  { id: "testimonianze",    label: "Testimonianze"      },
];

const VIDEO: Video[] = [
  {
    id: "CBt2pP99Kfo",
    titolo: "I Passi del Silenzio",
    sottotitolo: "Abbazia di Piona, Lecco",
    categoria: "vita monastica",
    descrizione:
      "Un viaggio nella vita quotidiana dell'Abbazia di Piona sul Lago di Como. I monaci cistercensi mostrano come il silenzio e la bellezza del paesaggio si intreccino con la Regola benedettina.",
    durata: "Documentario",
    luogo: "Abbazia di Piona, Colico (Lecco)",
  },
  {
    id: "0lAS449Fpcg",
    titolo: "Quaerere Deum",
    sottotitolo: "I Monaci di Norcia",
    categoria: "vita monastica",
    descrizione:
      "Il documentario ufficiale sulla comunità benedettina di Norcia, fondata da monaci americani sul luogo natale di san Benedetto. Ora et Labora, birra Nursia e la fedeltà alla Regola nel cuore dell'Umbria.",
    durata: "Documentario",
    luogo: "Monastero di San Benedetto, Norcia",
  },
  {
    id: "0cj3gzcld3E",
    titolo: "Sentinelle nella Notte",
    sottotitolo: "Monaci Benedettini dell'Abbazia du Barroux",
    categoria: "vita monastica",
    descrizione:
      "La vita notturna dei monaci dell'Abbazia du Barroux in Provenza, fedeli alla forma straordinaria del rito romano. Le Vigilie, il Grande Silenzio, la luce delle candele nell'oscurità.",
    durata: "Documentario",
    luogo: "Abbazia Sainte-Madeleine du Barroux, Provenza",
  },
  {
    id: "04U-VegfRWA",
    titolo: "One Thing",
    sottotitolo: "La Vita a New Melleray Abbey",
    categoria: "vita monastica",
    descrizione:
      "Un ritratto intimo della comunità cistercense trappista di New Melleray Abbey, Iowa. Monaci americani che vivono di lavoro manuale, preghiera e silenzio, secondo la Regola di Benedetto.",
    durata: "Documentario",
    luogo: "New Melleray Abbey, Iowa (USA)",
  },
  {
    id: "7_pM2fqFM0A",
    titolo: "Canti Gregoriani",
    sottotitolo: "Abbazia di Sant'Ottilien",
    categoria: "canto gregoriano",
    descrizione:
      "La schola cantorum benedettina dell'Abbazia di Sant'Ottilien in Baviera esegue canti gregoriani nella basilica conventuale. Una delle tradizioni corali più antiche del monachesimo tedesco.",
    durata: "51 min",
    luogo: "Erzabtei St. Ottilien, Baviera",
  },
  {
    id: "WM_Sncv7xvM",
    titolo: "Canto Gregoriano a Chiaravalle",
    sottotitolo: "Visita al Chiostro dell'Abbazia",
    categoria: "canto gregoriano",
    descrizione:
      "Giovanni Vianini guida attraverso il chiostro medievale dell'Abbazia di Chiaravalle a Milano, accompagnato dal canto gregoriano dei monaci cistercensi. Arte, architettura e preghiera cantata.",
    durata: "25 min",
    luogo: "Abbazia di Chiaravalle, Milano",
  },
  {
    id: "8t_0Cl9Ju_0",
    titolo: "Il Canto della Pace",
    sottotitolo: "Monaci Benedettini in Cattedrale",
    categoria: "canto gregoriano",
    descrizione:
      "Una comunità di monaci benedettini canta il canto gregoriano nella maestosità di una cattedrale medievale. La voce umana come strumento di preghiera, elevata verso il silenzio di Dio.",
    durata: "60 min",
    luogo: "Abbazia Benedettina",
  },
  {
    id: "c79SszUBZUE",
    titolo: "Canto Gregoriano dei Monaci",
    sottotitolo: "Musica Spirituale per la Meditazione",
    categoria: "canto gregoriano",
    descrizione:
      "Una selezione di canti gregoriani eseguiti da monaci benedettini, dalla Messa de Angelis alle antifone mariane. La tradizione corale che ha forgiato la civiltà musicale dell'Occidente.",
    durata: "3 ore",
    luogo: "Tradizione Benedettina",
  },
  {
    id: "8M0QMjLJrCw",
    titolo: "Il Falegname di Camaldoli",
    sottotitolo: "Dentro un Eremo Millenario",
    categoria: "eremi",
    descrizione:
      "Un accesso esclusivo all'Eremo di Camaldoli sull'Appennino tosco-romagnolo, normalmente chiuso al pubblico. Un monaco falegname racconta la vita eremitica nel bosco sacro fondato da san Romualdo nel 1012.",
    durata: "15 min",
    luogo: "Eremo di Camaldoli, Casentino",
  },
  {
    id: "NbWdD6fz9aE",
    titolo: "Monaci Eremiti e Pellegrini",
    sottotitolo: "Il Medioevo — Episodio VI",
    categoria: "eremi",
    descrizione:
      "Il professor Alessandro Barbero racconta la storia dei monaci eremiti nel Medioevo: le origini nel deserto egiziano, la diffusione in Europa, i grandi fondatori di ordini eremitici.",
    durata: "50 min",
    luogo: "Storia del Monachesimo",
  },
  {
    id: "NPbGbr5eP6A",
    titolo: "Sentinelle nella Notte",
    sottotitolo: "Documentario sulla Vita Monastica",
    categoria: "testimonianze",
    descrizione:
      "Un documentario emozionante che segue una comunità monastica nell'arco di un anno liturgico. Le stagioni, le feste, le crisi e i momenti di grazia che scandiscono la vita consacrata.",
    durata: "52 min",
    luogo: "Abbazia Benedettina",
  },
  {
    id: "GwSRmc2QA44",
    titolo: "Monaci e Monasteri nel Medioevo",
    sottotitolo: "Alessandro Barbero",
    categoria: "testimonianze",
    descrizione:
      "La conferenza del professor Alessandro Barbero sulla storia del monachesimo benedettino: come i monasteri medievali abbiano conservato la cultura, plasmato l'Europa e inventato l'università.",
    durata: "67 min",
    luogo: "Lezione Magistrale",
  },
  {
    id: "GQ_9cbrO2Hk",
    titolo: "Il Nome della Rosa — Scena Iniziale",
    sottotitolo: "Jean-Jacques Annaud, 1986",
    categoria: "testimonianze",
    descrizione:
      "L'apertura del capolavoro cinematografico tratto dal romanzo di Umberto Eco: Guglielmo da Baskerville e Adso da Melk arrivano all'abbazia benedettina tra le montagne dell'Abruzzo. Le pietre di Rocca Calascio diventano il monastero del mistero.",
    durata: "Estratto",
    luogo: "Campo Imperatore & Rocca Calascio, Abruzzo",
  },
  {
    id: "5-4Pzc8ozM4",
    titolo: "Il Nome della Rosa — Colonna Sonora",
    sottotitolo: "James Horner · Suite Completa",
    categoria: "canto gregoriano",
    descrizione:
      "La colonna sonora ufficiale del film di Annaud composta da James Horner: temi gregoriani, cori medievali e orchestrazioni cupe che evocano l'atmosfera dell'abbazia benedettina, il peso dei manoscritti e il terrore dell'ignoto.",
    durata: "Suite",
    luogo: "Colonna Sonora Originale, 1986",
  },
  {
    id: "aClOJzUFIvs",
    titolo: "Il Grande Silenzio",
    sottotitolo: "Philip Gröning, 2005 — Trailer",
    categoria: "eremi",
    descrizione:
      "Trailer del documentario capolavoro di Philip Gröning girato nell'arco di sei mesi dentro la Grande Chartreuse, monastero dei Certosini sulle Alpi francesi. Nessuna musica aggiunta, nessun commento: solo il silenzio, la luce e la preghiera dei monaci.",
    durata: "Trailer",
    luogo: "Grande Chartreuse, Alpi Francesi",
  },
  {
    id: "eT3SoRkzabY",
    titolo: "Il Grande Silenzio — I Monaci sulla Neve",
    sottotitolo: "Certosini alla Grande Chartreuse, 2005",
    categoria: "eremi",
    descrizione:
      "Sequenza autentica del documentario di Gröning: i monaci certosini della Grande Chartreuse scendono scivolando sulla neve tra le Alpi francesi. Uno dei momenti più insoliti e toccanti del film — la gioia silenziosa di chi vive fuori dal mondo.",
    durata: "Estratto",
    luogo: "Grande Chartreuse, Alpi Francesi",
  },
];

function getThumbnail(id: string) {
  return `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
}
function getFallbackThumbnail(id: string) {
  return `https://img.youtube.com/vi/${id}/mqdefault.jpg`;
}

function VideoCard({ video, onClick }: { video: Video; onClick: () => void }) {
  const [imgSrc, setImgSrc] = useState(getThumbnail(video.id));
  const [hovered, setHovered] = useState(false);
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleMouseEnter = () => {
    hoverTimer.current = setTimeout(() => setHovered(true), 400);
  };

  const handleMouseLeave = () => {
    if (hoverTimer.current) clearTimeout(hoverTimer.current);
    setHovered(false);
    setIframeLoaded(false);
  };

  return (
    <button
      onClick={onClick}
      className="group text-left w-full block"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="relative overflow-hidden aspect-video bg-stone-900 mb-4">
        {/* Static thumbnail — always rendered, hidden when iframe is ready */}
        <img
          src={imgSrc}
          alt={video.titolo}
          onError={() => {
            if (imgSrc !== getFallbackThumbnail(video.id)) {
              setImgSrc(getFallbackThumbnail(video.id));
            }
          }}
          className={`w-full h-full object-cover transition-all duration-500 ${
            iframeLoaded ? "opacity-0" : "opacity-100 group-hover:brightness-75"
          }`}
        />

        {/* YouTube iframe preview — muted autoplay on hover */}
        {hovered && (
          <iframe
            className={`absolute inset-0 w-full h-full transition-opacity duration-500 ${
              iframeLoaded ? "opacity-100" : "opacity-0"
            }`}
            src={`https://www.youtube-nocookie.com/embed/${video.id}?autoplay=1&mute=1&controls=0&rel=0&modestbranding=1&showinfo=0&loop=1&playlist=${video.id}&iv_load_policy=3`}
            allow="autoplay; encrypted-media"
            title={video.titolo}
            onLoad={() => setIframeLoaded(true)}
          />
        )}

        <div className={`absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent transition-opacity duration-300 ${iframeLoaded ? "opacity-0" : "opacity-100"}`} />

        {/* Play button — visible on hover before iframe loads */}
        <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${hovered && iframeLoaded ? "opacity-0" : "opacity-0 group-hover:opacity-100"}`}>
          <div className="w-14 h-14 rounded-full border border-white/60 flex items-center justify-center bg-black/30 backdrop-blur-sm">
            <Play className="w-5 h-5 text-white fill-white ml-0.5" />
          </div>
        </div>

        <div className={`absolute bottom-3 left-3 right-3 flex items-end justify-between gap-2 transition-opacity duration-300 ${iframeLoaded ? "opacity-0" : "opacity-100"}`}>
          <span className="text-[9px] uppercase tracking-widest text-white/80 bg-black/50 px-2 py-1 backdrop-blur-sm">
            {video.categoria}
          </span>
          <span className="text-[9px] uppercase tracking-widest text-white/60 flex items-center gap-1 shrink-0">
            <Clock className="w-2.5 h-2.5" /> {video.durata}
          </span>
        </div>
      </div>

      <div>
        <p className="text-[9px] uppercase tracking-[0.25em] text-primary/50 mb-0.5 flex items-center gap-1.5">
          <MapPin className="w-2.5 h-2.5" /> {video.luogo}
        </p>
        <h3 className="font-serif text-lg text-foreground group-hover:text-primary transition-colors leading-snug mb-0.5">
          {video.titolo}
        </h3>
        <p className="text-[10px] uppercase tracking-widest text-muted-foreground/70 mb-2">
          {video.sottotitolo}
        </p>
        <p className="text-muted-foreground text-xs leading-relaxed font-light line-clamp-2">
          {video.descrizione}
        </p>
      </div>
    </button>
  );
}

function VideoModal({ video, onClose }: { video: Video; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-4xl bg-background shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between px-6 py-4 border-b border-border gap-4">
          <div>
            <span className="text-[9px] uppercase tracking-widest text-primary/50 block mb-1 flex items-center gap-1.5">
              <MapPin className="w-2.5 h-2.5" /> {video.luogo}
            </span>
            <h2 className="font-serif text-2xl text-foreground leading-snug">
              {video.titolo}
            </h2>
            <p className="text-xs uppercase tracking-widest text-muted-foreground/60 mt-0.5">
              {video.sottotitolo}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors p-1 mt-1 shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="aspect-video bg-black">
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${video.id}?autoplay=1&rel=0&modestbranding=1`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full"
            title={video.titolo}
          />
        </div>

        <div className="px-6 py-5 border-t border-border bg-card/50">
          <p className="text-foreground/75 font-light text-sm leading-relaxed max-w-2xl">
            {video.descrizione}
          </p>
          <div className="mt-3 flex items-center gap-5">
            <span className="text-[9px] uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
              <Clock className="w-3 h-3" /> {video.durata}
            </span>
            <span className="text-[9px] uppercase tracking-widest text-primary/40">
              {video.categoria}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function VideoPage() {
  const [categoriaAttiva, setCategoriaAttiva] = useState<string>("tutte");
  const [videoAperto, setVideoAperto] = useState<Video | null>(null);

  const videoFiltrati =
    categoriaAttiva === "tutte"
      ? VIDEO
      : VIDEO.filter((v) => v.categoria === categoriaAttiva);

  const conteggi: Record<string, number> = {
    tutte: VIDEO.length,
    ...Object.fromEntries(
      CATEGORIE.filter((c) => c.id !== "tutte").map((c) => [
        c.id,
        VIDEO.filter((v) => v.categoria === c.id).length,
      ])
    ),
  };

  return (
    <div className="w-full min-h-screen">

      {/* ── HERO ── */}
      <section className="relative bg-background py-24 overflow-hidden">
        <div
          className="absolute inset-0 opacity-25"
          style={{
            backgroundImage: `url("${getThumbnail("0lAS449Fpcg")}")`,
            backgroundSize: "cover",
            backgroundPosition: "center 40%",
            filter: "sepia(0.4) brightness(0.6)",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-background/30 to-background" />
        <div className="relative container mx-auto px-6 max-w-3xl text-center">
          <p className="text-[9px] uppercase tracking-[0.25em] md:tracking-[0.4em] text-muted-foreground mb-4">
            Biblioteca Visiva · Benedictus
          </p>
          <h1 className="font-serif text-4xl md:text-5xl text-foreground mb-5">
            Visioni dal Monastero
          </h1>
          <p className="text-foreground/70 font-light text-base leading-relaxed max-w-xl mx-auto">
            Documentari, canti liturgici e testimonianze filmati nelle abbazie e
            negli eremi d'Europa. La vita monastica benedettina e il silenzio
            contemplativo nella loro forma più autentica.
          </p>
        </div>
      </section>

      {/* ── FILTRI CATEGORIA ── */}
      <section className="bg-card border-b border-border sticky top-0 z-10">
        <div className="relative">
          <div className="container mx-auto px-6 max-w-6xl">
          <div className="flex items-center gap-1.5 overflow-x-auto py-4 scrollbar-none" style={{ WebkitOverflowScrolling: "touch" }}>
            {CATEGORIE.map((c) => (
              <button
                key={c.id}
                onClick={() => setCategoriaAttiva(c.id)}
                className={`flex-none flex items-center gap-2 px-4 py-2 text-[10px] uppercase tracking-widest transition-colors whitespace-nowrap border ${
                  categoriaAttiva === c.id
                    ? "bg-primary text-primary-foreground border-primary"
                    : "border-border text-muted-foreground hover:text-foreground hover:border-primary/30"
                }`}
              >
                {c.label}
                <span
                  className={`text-[9px] ${
                    categoriaAttiva === c.id
                      ? "text-primary-foreground/60"
                      : "text-muted-foreground/40"
                  }`}
                >
                  {conteggi[c.id]}
                </span>
              </button>
            ))}
          </div>
          </div>
        </div>
      </section>

      {/* ── GRIGLIA VIDEO ── */}
      <section className="py-14 bg-background">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
            {videoFiltrati.map((video) => (
              <VideoCard
                key={video.id}
                video={video}
                onClick={() => setVideoAperto(video)}
              />
            ))}
          </div>

          {videoFiltrati.length === 0 && (
            <div className="text-center py-20">
              <p className="font-serif text-xl text-muted-foreground/50">
                Nessun video in questa categoria
              </p>
            </div>
          )}
        </div>
      </section>

      {/* ── CITAZIONE FINALE ── */}
      <section className="py-16 bg-card border-t border-border">
        <div className="container mx-auto px-6 max-w-2xl text-center">
          <p className="font-serif text-2xl md:text-3xl text-foreground/75 italic leading-relaxed mb-5">
            "Il silenzio è il primo linguaggio di Dio,
            tutto il resto è cattiva traduzione."
          </p>
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground/40">
            Thomas Keating · Trappista
          </p>
        </div>
      </section>

      {/* ── MODAL PLAYER ── */}
      {videoAperto && (
        <VideoModal video={videoAperto} onClose={() => setVideoAperto(null)} />
      )}
    </div>
  );
}
