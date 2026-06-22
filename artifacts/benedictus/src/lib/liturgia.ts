export interface OraCanonica {
  id: string;
  nome: string;
  latino: string;
  oraInizio: number;
  minutoInizio: number;
  campane: number;
  icona: string;
  monaci: string;
  invito: string;
  citazione: string;
  citazioneFonte: string;
  notte: boolean;
}

export const ORE_CANONICHE: OraCanonica[] = [
  {
    id: "silenzio",
    nome: "Silenzio Notturno",
    latino: "Silentium Noctis",
    oraInizio: 0,
    minutoInizio: 0,
    campane: 1,
    icona: "✦",
    monaci:
      "Il monastero riposa nel silenzio profondo. Il custode della notte veglia. Ogni respiro è preghiera inconsapevole.",
    invito:
      "Anche il tuo riposo è sacro. Affida la notte alla custodia di Colui che non dorme. Lascia andare.",
    citazione: "Nihil amori Christi praeponatur.",
    citazioneFonte: "Regola, Cap. 72",
    notte: true,
  },
  {
    id: "mattutino",
    nome: "Mattutino",
    latino: "Matutinum",
    oraInizio: 3,
    minutoInizio: 30,
    campane: 3,
    icona: "☽",
    monaci:
      "Nel buio ancora profondo, la campana chiama. I monaci si alzano, si avvolgono nel saio e raggiungono il coro per cantare i salmi della notte. L'ufficio delle Veglie — Mattutino — è il cuore segreto della vita benedettina.",
    invito:
      "Da qualche parte nel mondo, nel buio, qualcuno canta per te. Porta questa consapevolezza nel tuo primo pensiero del mattino.",
    citazione:
      "In primis mane, cum surgetur ad opus Dei, invicem se exhortentur fratres.",
    citazioneFonte: "Regola, Cap. 22",
    notte: true,
  },
  {
    id: "lodi",
    nome: "Lodi",
    latino: "Laudes",
    oraInizio: 6,
    minutoInizio: 0,
    campane: 3,
    icona: "◎",
    monaci:
      "L'alba tocca i vetri del coro. I monaci cantano le Lodi — la preghiera del sorgere del sole. Ringraziano per la notte trascorsa, accolgono la luce che torna. Prima del lavoro, prima del pane, la lode.",
    invito:
      "Prima di guardare il telefono, prenditi trenta secondi. Guarda la luce. Nomina tre cose per cui sei grato stamattina.",
    citazione:
      "Ergo hoc est quod oportet nos scire, quia ad imaginem et similitudinem Dei sumus facti.",
    citazioneFonte: "Regola, Prologo",
    notte: false,
  },
  {
    id: "terza",
    nome: "Terza",
    latino: "Hora Tertia",
    oraInizio: 9,
    minutoInizio: 0,
    campane: 3,
    icona: "△",
    monaci:
      "Il lavoro mattutino è nel pieno. I monaci dello scriptorium copiano, quelli dei campi arano, quelli della cucina preparano. Alle nove suona la campana: breve pausa, tre versetti, un amen. Poi di nuovo al lavoro.",
    invito:
      "Fermati un momento. Tre respiri profondi. Cosa stai custodendo in questo lavoro? A chi serve ciò che stai facendo?",
    citazione:
      "Otiositas inimica est animae, et ideo certis temporibus occupari debent fratres in labore manuum.",
    citazioneFonte: "Regola, Cap. 48",
    notte: false,
  },
  {
    id: "sesta",
    nome: "Sesta",
    latino: "Hora Sexta",
    oraInizio: 12,
    minutoInizio: 0,
    campane: 6,
    icona: "☀",
    monaci:
      "Mezzogiorno. Il sole è alto. I monaci si raccolgono per la Sesta — breve, essenziale. Poi il refettorio: il pasto in silenzio mentre un fratello legge ad alta voce. Il cibo e la parola insieme, nutrimento del corpo e dello spirito.",
    invito:
      "Mangia con attenzione oggi. Niente schermo, niente notifiche. Solo il sapore, la fame che si placa, la gratitudine per chi ha coltivato ciò che è nel tuo piatto.",
    citazione:
      "Mensae legenti non deesse, nec casus legentem corripiat — semper lectio mensae non desit.",
    citazioneFonte: "Regola, Cap. 38",
    notte: false,
  },
  {
    id: "nona",
    nome: "Nona",
    latino: "Hora Nona",
    oraInizio: 15,
    minutoInizio: 0,
    campane: 9,
    icona: "◇",
    monaci:
      "Il pomeriggio è lungo e caldo. I monaci riprendono il lavoro dopo il riposo meridiano. La Nona — le tre del pomeriggio — è l'ora della memoria della Passione. Breve, intensa, poi di nuovo la fatica quotidiana.",
    invito:
      "Nel mezzo del pomeriggio, quando l'energia cala, non fuggire nella distrazione. Resta con la stanchezza un momento. Cosa ti insegna?",
    citazione:
      "Omni hora vitae nostrae huiusmodi emendatio debet esse praesens.",
    citazioneFonte: "Regola, Cap. 4",
    notte: false,
  },
  {
    id: "vespri",
    nome: "Vespri",
    latino: "Vesperae",
    oraInizio: 18,
    minutoInizio: 0,
    campane: 3,
    icona: "◐",
    monaci:
      "Il sole scende. I monaci lasciano i campi, gli scriptorium, le officine. La campana chiama al coro per i Vespri — la grande preghiera della sera. Il giorno si raccoglie in lode. Canticolo di Maria. Silenzio.",
    invito:
      "Fai un bilancio della giornata — non un processo, una raccolta. Cosa è andato bene? Chi hai incontrato davvero? Dove hai mancato? Posalo.",
    citazione:
      "Vespere autem surgant ad Vesperas, et decantent hymnos ac psalmos.",
    citazioneFonte: "Regola, Cap. 18",
    notte: false,
  },
  {
    id: "compieta",
    nome: "Compieta",
    latino: "Completorium",
    oraInizio: 21,
    minutoInizio: 0,
    campane: 3,
    icona: "☾",
    monaci:
      "L'ultima preghiera del giorno. Dopo la Compieta scende il Grande Silenzio — nessuna parola fino al mattino seguente. I monaci si recano alle celle. Il monastero spegne le luci una a una. Rimane accesa solo la lampada del coro.",
    invito:
      "Il Grande Silenzio inizia. Lascia che le parole si posino. Prima di dormire, un pensiero solo: cosa è stato il dono di oggi?",
    citazione:
      "Post Completorium nulla loquacitati detur licentia — silentium cum omni diligentia custodiatur.",
    citazioneFonte: "Regola, Cap. 42",
    notte: true,
  },
];

/** Returns the current canonical hour and minutes until the next */
export function getOraCorrente(now: Date = new Date()): {
  ora: OraCanonica;
  prossima: OraCanonica;
  minutiAlProssimo: number;
  progressPercent: number;
} {
  const totalMinutes = now.getHours() * 60 + now.getMinutes();

  const withMinutes = ORE_CANONICHE.map((o) => ({
    ...o,
    startMin: o.oraInizio * 60 + o.minutoInizio,
  }));

  // Find current — last one whose startMin <= totalMinutes
  let currentIdx = 0;
  for (let i = 0; i < withMinutes.length; i++) {
    if (withMinutes[i].startMin <= totalMinutes) currentIdx = i;
  }

  const nextIdx = (currentIdx + 1) % withMinutes.length;
  const current = withMinutes[currentIdx];
  const next = withMinutes[nextIdx];

  const currentStart = current.startMin;
  const nextStart =
    next.startMin > currentStart
      ? next.startMin
      : next.startMin + 24 * 60;

  const durataMinuti = nextStart - currentStart;
  const trascorsiMinuti = totalMinutes - currentStart;
  const minutiAlProssimo = nextStart - totalMinutes;
  const progressPercent = Math.min(
    100,
    Math.round((trascorsiMinuti / durataMinuti) * 100)
  );

  return {
    ora: ORE_CANONICHE[currentIdx],
    prossima: ORE_CANONICHE[nextIdx],
    minutiAlProssimo,
    progressPercent,
  };
}

/** Format minutes as "Xh Ym" or "Ym" */
export function formatMinuti(min: number): string {
  if (min >= 60) {
    const h = Math.floor(min / 60);
    const m = min % 60;
    return m > 0 ? `${h}h ${m}m` : `${h}h`;
  }
  return `${min}m`;
}

/** Synthesise a bell strike using Web Audio API — rich monastery bell tone (D4) */
export function suonaCampana(volte: number = 1, volume = 0.4): void {
  try {
    const ctx = new AudioContext();
    const partials = [1, 2.756, 3.5, 5.5, 7.0];
    const partialGains = [1.0, 0.4, 0.3, 0.15, 0.08];
    const baseFreq = 293.7; // D4 — deep monastery bell

    for (let colpo = 0; colpo < volte; colpo++) {
      const startTime = ctx.currentTime + colpo * 1.6;

      partials.forEach((ratio, j) => {
        const osc = ctx.createOscillator();
        const gainNode = ctx.createGain();
        osc.connect(gainNode);
        gainNode.connect(ctx.destination);

        osc.type = "sine";
        osc.frequency.value = baseFreq * ratio;

        const peak = volume * partialGains[j];
        gainNode.gain.setValueAtTime(0, startTime);
        gainNode.gain.linearRampToValueAtTime(peak, startTime + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + 5);

        osc.start(startTime);
        osc.stop(startTime + 5.1);
      });
    }
  } catch {
    // AudioContext not supported or blocked
  }
}

/**
 * Ring the clock bell at the hour — N strikes in 12h format (E4, slightly
 * brighter and shorter than the canonical bell).
 * E.g. 13:00 → 1 strike, 12:00 → 12 strikes.
 */
export function suonaCampanaOrologio(ora: number, volume = 0.3): void {
  try {
    const colpi = ora % 12 || 12; // 0 h → 12, 13 h → 1, etc.
    const ctx = new AudioContext();
    const partials = [1, 2.756, 3.5, 5.5];
    const partialGains = [1.0, 0.38, 0.25, 0.1];
    const baseFreq = 329.6; // E4 — slightly brighter than D4

    for (let colpo = 0; colpo < colpi; colpo++) {
      const startTime = ctx.currentTime + colpo * 1.5;

      partials.forEach((ratio, j) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.type = "sine";
        osc.frequency.value = baseFreq * ratio;

        const peak = volume * partialGains[j];
        gain.gain.setValueAtTime(0, startTime);
        gain.gain.linearRampToValueAtTime(peak, startTime + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 4);

        osc.start(startTime);
        osc.stop(startTime + 4.1);
      });
    }
  } catch {
    // AudioContext not supported or blocked
  }
}

/**
 * Ring a single soft half-hour bell — G4, shorter decay, lighter character.
 * Signals the half-hour without the full weight of the hourly stroke.
 */
export function suonaMezzoOra(volume = 0.22): void {
  try {
    const ctx = new AudioContext();
    const partials = [1, 2.756, 3.5];
    const partialGains = [1.0, 0.32, 0.18];
    const baseFreq = 392.0; // G4 — lighter, shorter

    const startTime = ctx.currentTime;
    partials.forEach((ratio, j) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.type = "sine";
      osc.frequency.value = baseFreq * ratio;

      const peak = volume * partialGains[j];
      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(peak, startTime + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 2.8);

      osc.start(startTime);
      osc.stop(startTime + 2.9);
    });
  } catch {
    // AudioContext not supported or blocked
  }
}

/** Returns true if the given hour:minute exactly matches a canonical hour start */
export function isOraCanonica(h: number, m: number): boolean {
  return ORE_CANONICHE.some((o) => o.oraInizio === h && o.minutoInizio === m);
}
