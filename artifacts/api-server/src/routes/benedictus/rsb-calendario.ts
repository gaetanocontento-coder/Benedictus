// Calendario di lettura della Regola di San Benedetto
// Fonte: https://www.ora-et-labora.net/RSB_calendario.html
// La Regola viene letta integralmente tre volte l'anno.
// Formato valore: "Prol" = Prologo, "N" = capitolo N, "N, V" = capitolo N dal verso V

// Gestione anno bisestile: 24 Feb (bisestile) = Prol + 18,20; 24 Feb (non bisestile) = 19
// Nel file usiamo "02-24" come chiave leap, gestito dinamicamente nel lookup

const CALENDARIO_BASE: Record<string, string> = {
  // ── Gennaio / Maggio (dal 2) / Settembre ──
  "01-01": "Prol",     "05-02": "Prol",     "09-01": "Prol",
  "01-02": "Prol 8",   "05-03": "Prol 8",   "09-02": "Prol 8",
  "01-03": "Prol 14",  "05-04": "Prol 14",  "09-03": "Prol 14",
  "01-04": "Prol 21",  "05-05": "Prol 21",  "09-04": "Prol 21",
  "01-05": "Prol 33",  "05-06": "Prol 33",  "09-05": "Prol 33",
  "01-06": "Prol 39",  "05-07": "Prol 39",  "09-06": "Prol 39",
  "01-07": "Prol 45",  "05-08": "Prol 45",  "09-07": "Prol 45",
  "01-08": "1",        "05-09": "1",        "09-08": "1",
  "01-09": "1, 6",     "05-10": "1, 6",     "09-09": "1, 6",
  "01-10": "2",        "05-11": "2",        "09-10": "2",
  "01-11": "2, 11",    "05-12": "2, 11",    "09-11": "2, 11",
  "01-12": "2, 16",    "05-13": "2, 16",    "09-12": "2, 16",
  "01-13": "2, 23",    "05-14": "2, 23",    "09-13": "2, 23",
  "01-14": "2, 30",    "05-15": "2, 30",    "09-14": "2, 30",
  "01-15": "2, 33",    "05-16": "2, 33",    "09-15": "2, 33",
  "01-16": "3",        "05-17": "3",        "09-16": "3",
  "01-17": "3, 7",     "05-18": "3, 7",     "09-17": "3, 7",
  "01-18": "4",        "05-19": "4",        "09-18": "4",
  "01-19": "4, 22",    "05-20": "4, 22",    "09-19": "4, 22",
  "01-20": "4, 44",    "05-21": "4, 44",    "09-20": "4, 44",
  "01-21": "4, 63",    "05-22": "4, 63",    "09-21": "4, 63",
  "01-22": "5",        "05-23": "5",        "09-22": "5",
  "01-23": "5, 14",    "05-24": "5, 14",    "09-23": "5, 14",
  "01-24": "6",        "05-25": "6",        "09-24": "6",
  "01-25": "7",        "05-26": "7",        "09-25": "7",
  "01-26": "7, 5",     "05-27": "7, 5",     "09-26": "7, 5",
  "01-27": "7, 10",    "05-28": "7, 10",    "09-27": "7, 10",
  "01-28": "7, 19",    "05-29": "7, 19",    "09-28": "7, 19",
  "01-29": "7, 24",    "05-30": "7, 24",    "09-29": "7, 24",
  "01-30": "7, 31",    "05-31": "7, 31",    "09-30": "7, 31",
  "01-31": "7, 34",    "06-01": "7, 34",    "10-01": "7, 34",
  // ── Febbraio / Giugno / Ottobre ──
  "02-01": "7, 35",    "06-02": "7, 35",    "10-02": "7, 35",
  "02-02": "7, 44",    "06-03": "7, 44",    "10-03": "7, 44",
  "02-03": "7, 49",    "06-04": "7, 49",    "10-04": "7, 49",
  "02-04": "7, 51",    "06-05": "7, 51",    "10-05": "7, 51",
  "02-05": "7, 55",    "06-06": "7, 55",    "10-06": "7, 55",
  "02-06": "7, 56",    "06-07": "7, 56",    "10-07": "7, 56",
  "02-07": "7, 59",    "06-08": "7, 59",    "10-08": "7, 59",
  "02-08": "7, 60",    "06-09": "7, 60",    "10-09": "7, 60",
  "02-09": "7, 62",    "06-10": "7, 62",    "10-10": "7, 62",
  "02-10": "8",        "06-11": "8",        "10-11": "8",
  "02-11": "9",        "06-12": "9",        "10-12": "9",
  "02-12": "10",       "06-13": "10",       "10-13": "10",
  "02-13": "11",       "06-14": "11",       "10-14": "11",
  "02-14": "12",       "06-15": "12",       "10-15": "12",
  "02-15": "13",       "06-16": "13",       "10-16": "13",
  "02-16": "13, 12",   "06-17": "13, 12",   "10-17": "13, 12",
  "02-17": "14",       "06-18": "14",       "10-18": "14",
  "02-18": "15",       "06-19": "15",       "10-19": "15",
  "02-19": "16",       "06-20": "16",       "10-20": "16",
  "02-20": "17",       "06-21": "17",       "10-21": "17",
  "02-21": "18",       "06-22": "18",       "10-22": "18",
  "02-22": "18, 7",    "06-23": "18, 7",    "10-23": "18, 7",
  "02-23": "18, 12",   "06-24": "18, 12",   "10-24": "18, 12",
  // Feb 24-28 in anni NON bisestili:
  "02-24": "19",       "06-25": "18, 20",   "10-25": "18, 20",
  "02-25": "20",       "06-26": "19",       "10-26": "19",
  "02-26": "21",       "06-27": "20",       "10-27": "20",
  "02-27": "22",       "06-28": "21",       "10-28": "21",
  "02-28": "23",       "06-29": "22",       "10-29": "22",
                       "06-30": "23",       "10-30": "23",
  // ── Marzo (1) / Luglio (1) / Ottobre (31) ──
  "03-01": "24",       "07-01": "24",       "10-31": "24",
  // ── Marzo (2-31) / Luglio (2-31) / Novembre ──
  "03-02": "25",       "07-02": "25",       "11-01": "25",
  "03-03": "26",       "07-03": "26",       "11-02": "26",
  "03-04": "27",       "07-04": "27",       "11-03": "27",
  "03-05": "28",       "07-05": "28",       "11-04": "28",
  "03-06": "29",       "07-06": "29",       "11-05": "29",
  "03-07": "30",       "07-07": "30",       "11-06": "30",
  "03-08": "31",       "07-08": "31",       "11-07": "31",
  "03-09": "31, 13",   "07-09": "31, 13",   "11-08": "31, 13",
  "03-10": "32",       "07-10": "32",       "11-09": "32",
  "03-11": "33",       "07-11": "33",       "11-10": "33",
  "03-12": "34",       "07-12": "34",       "11-11": "34",
  "03-13": "35",       "07-13": "35",       "11-12": "35",
  "03-14": "35, 12",   "07-14": "35, 12",   "11-13": "35, 12",
  "03-15": "36",       "07-15": "36",       "11-14": "36",
  "03-16": "37",       "07-16": "37",       "11-15": "37",
  "03-17": "38",       "07-17": "38",       "11-16": "38",
  "03-18": "39",       "07-18": "39",       "11-17": "39",
  "03-19": "40",       "07-19": "40",       "11-18": "40",
  "03-20": "41",       "07-20": "41",       "11-19": "41",
  "03-21": "42",       "07-21": "42",       "11-20": "42",
  "03-22": "43",       "07-22": "43",       "11-21": "43",
  "03-23": "43, 13",   "07-23": "43, 13",   "11-22": "43, 13",
  "03-24": "44",       "07-24": "44",       "11-23": "44",
  "03-25": "45",       "07-25": "45",       "11-24": "45",
  "03-26": "46",       "07-26": "46",       "11-25": "46",
  "03-27": "47",       "07-27": "47",       "11-26": "47",
  "03-28": "48",       "07-28": "48",       "11-27": "48",
  "03-29": "48, 10",   "07-29": "48, 10",   "11-28": "48, 10",
  "03-30": "48, 22",   "07-30": "48, 22",   "11-29": "48, 22",
  "03-31": "49",       "07-31": "49",       "11-30": "49",
  // ── Aprile / Agosto / Dicembre ──
  "04-01": "50",       "08-01": "50",       "12-01": "50",
  "04-02": "51",       "08-02": "51",       "12-02": "51",
  "04-03": "52",       "08-03": "52",       "12-03": "52",
  "04-04": "53",       "08-04": "53",       "12-04": "53",
  "04-05": "53, 16",   "08-05": "53, 16",   "12-05": "53, 16",
  "04-06": "54",       "08-06": "54",       "12-06": "54",
  "04-07": "55",       "08-07": "55",       "12-07": "55",
  "04-08": "55, 15",   "08-08": "55, 15",   "12-08": "55, 15",
  "04-09": "56",       "08-09": "56",       "12-09": "56",
  "04-10": "57",       "08-10": "57",       "12-10": "57",
  "04-11": "58",       "08-11": "58",       "12-11": "58",
  "04-12": "58, 17",   "08-12": "58, 17",   "12-12": "58, 17",
  "04-13": "59",       "08-13": "59",       "12-13": "59",
  "04-14": "60",       "08-14": "60",       "12-14": "60",
  "04-15": "61",       "08-15": "61",       "12-15": "61",
  "04-16": "61, 6",    "08-16": "61, 6",    "12-16": "61, 6",
  "04-17": "62",       "08-17": "62",       "12-17": "62",
  "04-18": "63",       "08-18": "63",       "12-18": "63",
  "04-19": "63, 10",   "08-19": "63, 10",   "12-19": "63, 10",
  "04-20": "64",       "08-20": "64",       "12-20": "64",
  "04-21": "64, 7",    "08-21": "64, 7",    "12-21": "64, 7",
  "04-22": "65",       "08-22": "65",       "12-22": "65",
  "04-23": "65, 11",   "08-23": "65, 11",   "12-23": "65, 11",
  "04-24": "66",       "08-24": "66",       "12-24": "66",
  "04-25": "67",       "08-25": "67",       "12-25": "67",
  "04-26": "68",       "08-26": "68",       "12-26": "68",
  "04-27": "69",       "08-27": "69",       "12-27": "69",
  "04-28": "70",       "08-28": "70",       "12-28": "70",
  "04-29": "71",       "08-29": "71",       "12-29": "71",
  "04-30": "72",       "08-30": "72",       "12-30": "72",
  "05-01": "73",       "08-31": "73",       "12-31": "73",
};

// Anno bisestile: Feb 24 = 18,20; Feb 25 = 19; ...
const CALENDARIO_BISESTILE: Record<string, string> = {
  "02-24": "18, 20",
  "02-25": "19",
  "02-26": "20",
  "02-27": "21",
  "02-28": "22",
  "02-29": "23",
};

function isLeapYear(y: number): boolean {
  return (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0;
}

export function getRsbRiferimento(data: string): string | null {
  const [yStr, mm, dd] = data.split("-");
  const key = `${mm}-${dd}`;
  const year = parseInt(yStr, 10);
  if (mm === "02" && isLeapYear(year)) {
    return CALENDARIO_BISESTILE[key] ?? CALENDARIO_BASE[key] ?? null;
  }
  return CALENDARIO_BASE[key] ?? null;
}

export interface RsbRif {
  raw: string;
  capitolo: number;
  titoloCapitolo: string;
  versoInizio: number | null;
  etichetta: string;
}

const TITOLI_CAPITOLI: Record<number, string> = {
  0: "Prologo",
  1: "Le varie categorie di monaci",
  2: "L'Abate",
  3: "La consultazione della comunità",
  4: "Gli strumenti delle buone opere",
  5: "L'obbedienza",
  6: "L'amore del silenzio",
  7: "L'umiltà",
  8: "L'Ufficio divino nella notte",
  9: "I salmi dell'Ufficio notturno",
  10: "L'Ufficio notturno dell'estate",
  11: "L'Ufficio notturno nelle Domeniche",
  12: "Le lodi",
  13: "Le lodi nei giorni feriali",
  14: "L'Ufficio vigilare nelle feste dei Santi",
  15: "Quando si deve dire l'alleluia",
  16: "La celebrazione delle ore del giorno",
  17: "Salmi delle ore del giorno",
  18: "L'ordine dei salmi nelle ore del giorno",
  19: "La partecipazione interiore all'Ufficio divino",
  20: "La riverenza nella preghiera",
  21: "I decani del monastero",
  22: "Il dormitorio dei monaci",
  23: "La scomunica per le colpe",
  24: "La misura della scomunica",
  25: "Le colpe più gravi",
  26: "Rapporti dei confratelli con gli scomunicati",
  27: "La sollecitudine dell'abate per gli scomunicati",
  28: "La procedura nei confronti degli ostinati",
  29: "La riammissione dei fratelli che hanno lasciato il monastero",
  30: "La correzione dei ragazzi",
  31: "Il cellerario del monastero",
  32: "Gli arnesi e gli oggetti del monastero",
  33: "Il «vizio» della proprietà",
  34: "La distribuzione del necessario",
  35: "Il servizio della cucina",
  36: "I fratelli infermi",
  37: "I vecchi e i ragazzi",
  38: "La lettura in refettorio",
  39: "La misura del cibo",
  40: "La misura del vino",
  41: "L'orario dei pasti",
  42: "Il silenzio dopo compieta",
  43: "La puntualità nell'Ufficio divino e in refettorio",
  44: "La riparazione degli scomunicati",
  45: "La riparazione per gli errori commessi in coro",
  46: "La riparazione per le altre mancanze",
  47: "Il segnale per l'Ufficio divino",
  48: "Il lavoro quotidiano",
  49: "La Quaresima dei monaci",
  50: "I monaci che lavorano lontano o sono in viaggio",
  51: "I monaci che si recano nelle vicinanze",
  52: "La chiesa del monastero",
  53: "L'accoglienza degli ospiti",
  54: "Le lettere e i regali destinati ai singoli monaci",
  55: "Gli abiti e le calzature dei monaci",
  56: "La mensa dell'abate",
  57: "I monaci che praticano un'arte o un mestiere",
  58: "Norme per l'accettazione dei fratelli",
  59: "I piccoli oblati",
  60: "I sacerdoti aspiranti alla vita monastica",
  61: "L'accoglienza dei monaci forestieri",
  62: "I sacerdoti del monastero",
  63: "L'ordine della comunità",
  64: "L'elezione dell'abate",
  65: "Il priore del monastero",
  66: "I portinai del monastero",
  67: "I monaci mandati in viaggio",
  68: "Le obbedienze impossibili",
  69: "Divieto di arrogarsi le difese dei confratelli",
  70: "Divieto di arrogarsi la riprensione dei confratelli",
  71: "L'obbedienza fraterna",
  72: "Il buon zelo dei monaci",
  73: "La modesta portata di questa regola",
};

export function parseRiferimento(raw: string): RsbRif {
  const isProl = raw.startsWith("Prol");
  if (isProl) {
    const parts = raw.replace("Prol", "").trim().split(/\s*,\s*/);
    const verso = parts[0] ? parseInt(parts[0], 10) : null;
    return {
      raw,
      capitolo: 0,
      titoloCapitolo: "Prologo",
      versoInizio: verso && !isNaN(verso) ? verso : null,
      etichetta: verso ? `Prologo, v. ${verso}` : "Prologo",
    };
  }
  const parts = raw.split(/\s*,\s*/);
  const capitolo = parseInt(parts[0], 10);
  const verso = parts[1] ? parseInt(parts[1], 10) : null;
  const titolo = TITOLI_CAPITOLI[capitolo] ?? `Capitolo ${capitolo}`;
  return {
    raw,
    capitolo,
    titoloCapitolo: titolo,
    versoInizio: verso && !isNaN(verso) ? verso : null,
    etichetta: verso
      ? `Cap. ${capitolo} — ${titolo} (v. ${verso})`
      : `Cap. ${capitolo} — ${titolo}`,
  };
}
