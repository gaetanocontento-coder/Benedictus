export type Stagione = "avvento" | "natale" | "quaresima" | "pasqua" | "estate" | "ordinario";
export type ColtureLiturgiche = "verde" | "viola" | "bianco" | "rosso";

export interface Ingrediente {
  q: string;
  nome: string;
}

export interface Piatto {
  portata: string;
  nome: string;
  tempo: string;
  ingredienti: Ingrediente[];
  preparazione: string[];
  nota?: string;
}

export interface Lettura {
  titolo: string;
  testo: string;
  fonte: string;
  rito: string;
}

export interface Pasto {
  ora: string;
  oraLatina: string;
  titolo: string;
  introduzione: string;
  piatti: Piatto[];
  lettura: Lettura;
}

export interface GiornoMensa {
  nomeBreve: string;
  nomeLiturgico: string;
  indicazioneGiorno: string;
  pranzo: Pasto;
  cena: Pasto;
}

export function getStagione(): Stagione {
  const now = new Date();
  const m = now.getMonth() + 1;
  const d = now.getDate();
  if (m === 12 && d >= 1 && d <= 24) return "avvento";
  if ((m === 12 && d >= 25) || (m === 1 && d <= 6)) return "natale";
  if (m >= 6 && m <= 8) return "estate";
  if (m >= 3 && m <= 5) return "pasqua";
  if (m === 2 || (m === 3 && d <= 15)) return "quaresima";
  return "ordinario";
}

export function getColore(stagione: Stagione): ColtureLiturgiche {
  if (stagione === "avvento" || stagione === "quaresima") return "viola";
  if (stagione === "natale" || stagione === "pasqua") return "bianco";
  return "verde";
}

export function getNomeStagione(stagione: Stagione): string {
  const nomi: Record<Stagione, string> = {
    avvento:   "Tempo di Avvento",
    natale:    "Tempo di Natale",
    quaresima: "Quaresima",
    pasqua:    "Tempo Pasquale",
    estate:    "Tempo Ordinario · Estate",
    ordinario: "Tempo Ordinario",
  };
  return nomi[stagione];
}

export function getIndicazioneStagionale(stagione: Stagione): string {
  const indicazioni: Record<Stagione, string> = {
    avvento:   "In Avvento la tavola è sobria: niente olio in abbondanza, niente dolci. Si beve acqua o tisana calda. Il silenzio si fa più pesante e atteso.",
    natale:    "Nel Tempo di Natale la mensa si allieta: l'olio è generoso, il pane è arricchito, il refettorio risuona della gioia dell'Incarnazione.",
    quaresima: "In Quaresima si pratica l'astinenza: un solo pasto al giorno per le prime settimane, poi due pasti frugali. Niente carne, niente olio nei giorni feriali. Il corpo impara il silenzio.",
    pasqua:    "Nel Tempo Pasquale l'Alleluia ritorna sulla tavola: i cibi sono più abbondanti e gioiosi, il vino torna nei giorni festivi.",
    estate:    "D'estate il lavoro manuale è intenso. La tavola è fresca e stagionale: insalate dell'orto, legumi, frutta abbondante. Il pasto di mezzogiorno è il principale.",
    ordinario: "Nel Tempo Ordinario si osserva la Regola nelle sue proporzioni abituali: pranzo sostanzioso, cena leggera, digiuno il venerdì.",
  };
  return indicazioni[stagione];
}

const MENU: GiornoMensa[] = [
  // ── DOMENICA (0) ─────────────────────────────────────────────────────────
  {
    nomeBreve: "Domenica",
    nomeLiturgico: "Dies Dominica",
    indicazioneGiorno: "La domenica è il giorno del Signore. Il lavoro si ferma, il refettorio si apre con gioia. Il pasto è più abbondante del solito — un anticipo del banchetto eterno.",
    pranzo: {
      ora: "12:30",
      oraLatina: "Hora Sexta",
      titolo: "Pranzo",
      introduzione: "Il pasto domenicale è il più curato della settimana. Si serve vino ai pasti, il pane è morbido e il refettorio risuona della lettura festiva.",
      piatti: [
        {
          portata: "Primo",
          nome: "Gnocchi di patate al pesto di basilico",
          tempo: "50 min",
          ingredienti: [
            { q: "800 g", nome: "patate a pasta gialla" },
            { q: "200 g", nome: "farina 00" },
            { q: "1", nome: "uovo intero" },
            { q: "40 g", nome: "parmigiano grattugiato" },
            { q: "q.b.", nome: "noce moscata e sale" },
            { q: "60 g", nome: "foglie di basilico fresco" },
            { q: "30 g", nome: "pinoli tostati" },
            { q: "50 g", nome: "pecorino grattugiato" },
            { q: "1 spicchio", nome: "aglio" },
            { q: "80 ml", nome: "olio extravergine d'oliva" },
          ],
          preparazione: [
            "Lessare le patate con la buccia in acqua salata fino a completa cottura. Scolarle, sbucciarle ancora calde e schiacciarle con lo schiacciapatate.",
            "Formare una fontana con le patate schiacciate, aggiungere l'uovo, il parmigiano, la noce moscata e la farina. Impastare brevemente fino ad ottenere un composto omogeneo e morbido.",
            "Formare dei rotoli con l'impasto e tagliare gli gnocchi della dimensione di un pollice. Rigare con i rebbi di una forchetta o con l'apposita tavoletta.",
            "Preparare il pesto: frullare il basilico con i pinoli, l'aglio, il pecorino e l'olio. Aggiustare di sale.",
            "Cuocere gli gnocchi in acqua bollente salata: sono pronti quando affiorano in superficie. Scolarli e condirli con il pesto.",
          ],
          nota: "Nei monasteri il pesto si prepara tradizionalmente nel mortaio di pietra: il ritmo pestante diventa quasi una preghiera ritmica.",
        },
        {
          portata: "Contorno",
          nome: "Insalata dell'orto con fiori eduli",
          tempo: "10 min",
          ingredienti: [
            { q: "200 g", nome: "lattuga, rucola e crescione misto" },
            { q: "8", nome: "fiori di nasturzio o borragine" },
            { q: "2 cucchiai", nome: "olio extravergine d'oliva" },
            { q: "1 cucchiaio", nome: "aceto di mele" },
            { q: "q.b.", nome: "sale e miele d'abbazia" },
          ],
          preparazione: [
            "Lavare e asciugare le insalate. Condirle con olio, aceto e un filo di miele.",
            "Disporre i fiori in superficie. Servire immediatamente.",
          ],
          nota: "I monaci coltivano i fiori nell'orto del chiostro non solo per la bellezza ma per arricchire la tavola. Ogni fiore ha la sua stagione.",
        },
        {
          portata: "Frutta",
          nome: "Pere al vino rosso e spezie",
          tempo: "30 min",
          ingredienti: [
            { q: "4", nome: "pere Kaiser mature ma sode" },
            { q: "300 ml", nome: "vino rosso leggero" },
            { q: "2 cucchiai", nome: "miele d'acacia" },
            { q: "1 stecca", nome: "cannella" },
            { q: "3", nome: "chiodi di garofano" },
            { q: "1 scorza", nome: "limone" },
          ],
          preparazione: [
            "Sbucciare le pere lasciando il picciolo. Portare a ebollizione il vino con il miele, la cannella, i chiodi di garofano e la scorza di limone.",
            "Immergervi le pere e cuocere a fuoco basso per 20 minuti, girandole a metà cottura.",
            "Servire tiepide con il loro sciroppo.",
          ],
          nota: "Il vino cucinato — depurato dall'alcool dalla cottura — è il modo monastico di preparare un dessert dignitoso senza cadere nell'indulgenza.",
        },
      ],
      lettura: {
        titolo: "Regola di San Benedetto — Prologo",
        rito: "Il lettore si alza. La comunità inclina il capo in ascolto.",
        testo: "«Ausculta, o fili, præcepta magistri, et inclina aurem cordis tui: et admonitionem pii patris libenter excipe et efficaciter comple. Ascolta, o figlio, i precetti del maestro, e piega l'orecchio del tuo cuore: accogli volentieri il consiglio di un padre amorevole e mettilo in pratica con efficacia.»",
        fonte: "Regola di San Benedetto, Prologo 1 · ca. 530 d.C.",
      },
    },
    cena: {
      ora: "19:00",
      oraLatina: "Hora Vesperarum",
      titolo: "Cena",
      introduzione: "La cena domenicale è leggera: dopo il pasto festivo di mezzogiorno il corpo non chiede molto. Un brodo, un pezzo di formaggio, il pane avanzato.",
      piatti: [
        {
          portata: "Zuppa",
          nome: "Crema di carote e zenzero",
          tempo: "25 min",
          ingredienti: [
            { q: "500 g", nome: "carote" },
            { q: "1", nome: "cipolla bianca" },
            { q: "1 cm", nome: "radice di zenzero fresco" },
            { q: "1 l", nome: "brodo vegetale" },
            { q: "2 cucchiai", nome: "olio extravergine d'oliva" },
            { q: "q.b.", nome: "sale e pepe bianco" },
          ],
          preparazione: [
            "Soffriggere dolcemente la cipolla tritata nell'olio. Aggiungere le carote a rondelle e lo zenzero grattugiato.",
            "Versare il brodo caldo e cuocere per 20 minuti fino a che le carote siano tenere.",
            "Frullare fino ad ottenere una crema liscia. Servire con un giro d'olio crudo.",
          ],
        },
        {
          portata: "Piatto",
          nome: "Formaggi dell'abbazia con miele e noci",
          tempo: "5 min",
          ingredienti: [
            { q: "150 g", nome: "formaggio di pecora semi-stagionato" },
            { q: "50 g", nome: "noci sgusciate" },
            { q: "2 cucchiai", nome: "miele millefiori" },
            { q: "q.b.", nome: "pane integrale tostato" },
          ],
          preparazione: [
            "Disporre il formaggio a fette su un tagliere di legno.",
            "Accompagnare con le noci, un filo di miele e il pane.",
          ],
          nota: "Tradizionalmente i monasteri producono i propri formaggi. L'abbinamento con il miele è antico quanto il monachesimo stesso.",
        },
      ],
      lettura: {
        titolo: "Agostino di Ippona — Confessioni",
        rito: "Silenzio. Il lettore si alza lentamente.",
        testo: "«Ci hai fatti per te, o Signore, e il nostro cuore è inquieto finché non riposa in te. Feci della tua misericordia la mia dimora, e lì trovo pace, non perché non vi sia nessuno che turbi quella quiete, ma perché quella quiete è più forte di ogni turbamento.»",
        fonte: "Confessioni I, 1 · Sant'Agostino · 397 d.C.",
      },
    },
  },

  // ── LUNEDÌ (1) ───────────────────────────────────────────────────────────
  {
    nomeBreve: "Lunedì",
    nomeLiturgico: "Feria Secunda",
    indicazioneGiorno: "Il lunedì si riprende il ritmo ordinario. L'ora di Prima suona ancora nel silenzio. Il corpo, tornato al lavoro, chiede cibo semplice e nutritivo.",
    pranzo: {
      ora: "12:30",
      oraLatina: "Hora Sexta",
      titolo: "Pranzo",
      introduzione: "Pranzo feriale, secondo la Regola: due pietanze cotte, pane, frutta di stagione. La semplicità non è povertà — è purezza.",
      piatti: [
        {
          portata: "Zuppa",
          nome: "Zuppa di lenticchie rosse con curcuma e lauro",
          tempo: "35 min",
          ingredienti: [
            { q: "300 g", nome: "lenticchie rosse decorticate" },
            { q: "1", nome: "cipolla dorata" },
            { q: "2 spicchi", nome: "aglio" },
            { q: "2", nome: "pomodori pelati" },
            { q: "1 cucchiaino", nome: "curcuma" },
            { q: "2 foglie", nome: "alloro" },
            { q: "1,2 l", nome: "acqua o brodo vegetale" },
            { q: "3 cucchiai", nome: "olio extravergine d'oliva" },
            { q: "q.b.", nome: "sale, pepe e succo di limone" },
          ],
          preparazione: [
            "Soffriggere la cipolla tritata nell'olio con l'alloro fino a doratura. Aggiungere l'aglio e la curcuma, mescolare per un minuto.",
            "Sciacquare le lenticchie e aggiungerle al soffritto con i pomodori spezzettati. Coprire con l'acqua o brodo.",
            "Cuocere a fuoco medio per 25 minuti finché le lenticchie siano completamente disfatte e cremose.",
            "Aggiustare di sale. Prima di servire, spremere un filo di succo di limone per illuminare i sapori.",
          ],
          nota: "Le lenticchie sono il legume più antico della Scrittura — Esaù le vendette a Giacobbe per un piatto di esse. Nei monasteri erano cibo dei giorni di penitenza.",
        },
        {
          portata: "Pane",
          nome: "Pane integrale dell'abbazia",
          tempo: "3 h (lievitazione inclusa)",
          ingredienti: [
            { q: "400 g", nome: "farina integrale di grano tenero" },
            { q: "100 g", nome: "farina 0" },
            { q: "300 ml", nome: "acqua tiepida" },
            { q: "7 g", nome: "lievito di birra secco (o 20 g fresco)" },
            { q: "10 g", nome: "sale" },
            { q: "1 cucchiaio", nome: "olio extravergine d'oliva" },
          ],
          preparazione: [
            "Sciogliere il lievito nell'acqua tiepida con un cucchiaino di miele. Lasciare attivare per 10 minuti.",
            "Miscelare le farine con il sale. Versare gradualmente il liquido con il lievito e l'olio, impastando fino ad ottenere un impasto liscio ed elastico.",
            "Coprire con un panno umido e lasciare lievitare per 2 ore in luogo tiepido.",
            "Formare una pagnotta rotonda, incidere la superficie con una croce e infornare a 200°C per 35 minuti.",
          ],
          nota: "Nei monasteri benedettini il pane si prepara ogni mattina dopo l'Ufficio di Prima. L'incisione a croce è un atto di benedizione.",
        },
        {
          portata: "Frutta",
          nome: "Mela renetta con un cucchiaino di miele",
          tempo: "2 min",
          ingredienti: [
            { q: "1", nome: "mela renetta per commensale" },
            { q: "q.b.", nome: "miele d'abbazia" },
          ],
          preparazione: [
            "Lavare e tagliare la mela in spicchi. Servire con un filo di miele.",
          ],
        },
      ],
      lettura: {
        titolo: "Regola di San Benedetto — Cap. XXXIX: La quantità del cibo",
        rito: "Il lettore prende posto. Nessuno mangia prima che inizi la lettura.",
        testo: "«Crediamo sufficiente per il pasto quotidiano — a qualunque ora si mangi, sesta o nona — due pietanze cotte, tenendo conto delle diverse debolezze dei fratelli, affinché chi non può mangiare di una, possa ristorarsi dell'altra. Due pietanze cotte dunque bastino a tutti i fratelli; e se si può avere frutta o legumi freschi, si aggiunga una terza. Basta una libra di pane al giorno.»",
        fonte: "Regola di San Benedetto, Cap. XXXIX · ca. 530 d.C.",
      },
    },
    cena: {
      ora: "19:00",
      oraLatina: "Hora Vesperarum",
      titolo: "Cena",
      introduzione: "La cena è leggera. Dopo il Vespro, il corpo si calma. San Benedetto prescrive per la cena un terzo della razione del pranzo.",
      piatti: [
        {
          portata: "Piatto",
          nome: "Frittata alle erbe dell'orto",
          tempo: "15 min",
          ingredienti: [
            { q: "3", nome: "uova fresche per persona" },
            { q: "2 cucchiai", nome: "erbe aromatiche tritate (prezzemolo, erba cipollina, maggiorana)" },
            { q: "1 cucchiaio", nome: "olio extravergine d'oliva" },
            { q: "q.b.", nome: "sale e pepe" },
          ],
          preparazione: [
            "Sbattere le uova con le erbe tritate, sale e pepe.",
            "Scaldare l'olio in una padella e versare il composto. Cuocere a fuoco basso coperto fino a che la frittata sia soda.",
            "Servire con pane integrale e un'insalata leggera.",
          ],
          nota: "Le uova sono l'alimento monastico per eccellenza nei giorni senza carne. Semplici, nutrienti, veloci — come deve essere la cena dopo un lungo giorno di preghiera e lavoro.",
        },
      ],
      lettura: {
        titolo: "Thomas Merton — Nessun uomo è un'isola",
        rito: "Lettura breve. La sera invita al silenzio più che alle parole.",
        testo: "«Il silenzio non è la negazione del suono, ma la sua pienezza. Nella cella del silenzio l'anima impara a distinguere la propria voce dalla voce di Dio — e questa distinzione è tutta la vita spirituale.»",
        fonte: "Nessun uomo è un'isola · Thomas Merton · 1955",
      },
    },
  },

  // ── MARTEDÌ (2) ──────────────────────────────────────────────────────────
  {
    nomeBreve: "Martedì",
    nomeLiturgico: "Feria Tertia",
    indicazioneGiorno: "Il martedì porta avanti il lavoro della settimana. Il ritmo di preghiera e lavoro si consolida. La tavola rispecchia questa steadiness — sapori familiari, ben eseguiti.",
    pranzo: {
      ora: "12:30",
      oraLatina: "Hora Sexta",
      titolo: "Pranzo",
      introduzione: "Pasta e fagioli: il piatto dei poveri e dei monaci. Nutriente, economico, antico quanto la civiltà mediterranea.",
      piatti: [
        {
          portata: "Piatto unico",
          nome: "Pasta e fagioli borlotti alla maniera dell'abbazia",
          tempo: "40 min (con fagioli in scatola) · 2 h con fagioli secchi",
          ingredienti: [
            { q: "300 g", nome: "fagioli borlotti cotti (o 150 g secchi ammollati)" },
            { q: "180 g", nome: "pasta mista corta (ditalini o tubetti)" },
            { q: "1", nome: "cipolla" },
            { q: "1 gambo", nome: "sedano" },
            { q: "1", nome: "carota" },
            { q: "2 spicchi", nome: "aglio" },
            { q: "200 g", nome: "pomodori pelati" },
            { q: "1 rametto", nome: "rosmarino" },
            { q: "3 cucchiai", nome: "olio extravergine d'oliva" },
            { q: "q.b.", nome: "sale, pepe, parmigiano a piacere" },
          ],
          preparazione: [
            "Soffriggere in olio abbondante il trito di cipolla, sedano e carota (soffritto). Aggiungere l'aglio schiacciato e il rosmarino.",
            "Unire i pomodori pelati e cuocere 10 minuti. Aggiungere metà dei fagioli interi e l'altra metà frullati — questo crea la consistenza cremosa tipica del piatto.",
            "Versare il brodo caldo necessario e portare a ebollizione. Buttare la pasta e cuocerla direttamente nella zuppa.",
            "Servire con un generoso filo d'olio crudo e pepe macinato al momento.",
          ],
          nota: "La pasta e fagioli si mangia 'all'onda': non troppo brodosa né troppo asciutta, si muove leggermente nel piatto. Ogni abbazia ha la sua versione, gelosamente custodita.",
        },
        {
          portata: "Contorno",
          nome: "Radicchio saltato con aceto balsamico",
          tempo: "10 min",
          ingredienti: [
            { q: "2 cespi", nome: "radicchio di Treviso" },
            { q: "2 cucchiai", nome: "olio extravergine d'oliva" },
            { q: "1 cucchiaio", nome: "aceto balsamico" },
            { q: "q.b.", nome: "sale" },
          ],
          preparazione: [
            "Tagliare il radicchio a listarelle. Saltare in padella con olio caldo per 5 minuti.",
            "Sfumare con l'aceto balsamico e cuocere ancora 2 minuti. Servire caldo.",
          ],
        },
      ],
      lettura: {
        titolo: "Thomas à Kempis — Imitazione di Cristo",
        rito: "Il lettore inizia dopo il Benedicite.",
        testo: "«Meglio certamente è un umile contadino che serve Dio, di un filosofo superbo che osserva il corso delle stelle e trascura la conoscenza di se stesso. Chi si conosce bene, si vile stima, né si diletta di lodi umane. Anche se conoscessi tutto il mondo, e non avessi la carità, che cosa ti gioverebbe dinanzi a Dio?»",
        fonte: "Imitazione di Cristo, Libro I, Cap. II · Thomas à Kempis · 1418",
      },
    },
    cena: {
      ora: "19:00",
      oraLatina: "Hora Vesperarum",
      titolo: "Cena",
      introduzione: "Cena leggera di martedì. Le verdure gratinate danno calore al termine della giornata.",
      piatti: [
        {
          portata: "Piatto",
          nome: "Verdure gratinate al forno con pane e rosmarino",
          tempo: "30 min",
          ingredienti: [
            { q: "2", nome: "zucchine" },
            { q: "1", nome: "melanzana piccola" },
            { q: "2", nome: "pomodori ramati" },
            { q: "60 g", nome: "pane grattugiato" },
            { q: "30 g", nome: "parmigiano grattugiato" },
            { q: "1 rametto", nome: "rosmarino fresco tritato" },
            { q: "3 cucchiai", nome: "olio extravergine d'oliva" },
          ],
          preparazione: [
            "Tagliare le verdure a fette spesse un centimetro. Disporle in una teglia oliata.",
            "Mescolare il pane grattugiato con il parmigiano, il rosmarino e l'olio. Distribuire sopra le verdure.",
            "Infornare a 200°C per 25 minuti fino a doratura della crosta.",
          ],
        },
      ],
      lettura: {
        titolo: "Salmo 22 (23) — Il Signore è il mio pastore",
        rito: "Recitato a voce bassa insieme, prima di cena.",
        testo: "«Il Signore è il mio pastore: non manco di nulla. Su pascoli erbosi mi fa riposare, ad acque tranquille mi conduce. Rinfranca l'anima mia, mi guida per il giusto cammino a motivo del suo nome. Egli prepara davanti a me una mensa sotto gli occhi dei miei nemici.»",
        fonte: "Salmo 23 (22), 1-5 · Bibbia CEI",
      },
    },
  },

  // ── MERCOLEDÌ (3) ────────────────────────────────────────────────────────
  {
    nomeBreve: "Mercoledì",
    nomeLiturgico: "Feria Quarta",
    indicazioneGiorno: "Il mercoledì è giorno di penitenza nella tradizione benedettina. Il pasto è più sobrio: meno condimento, meno varietà, più silenzio. Il digiuno è una forma di preghiera corporale.",
    pranzo: {
      ora: "12:30",
      oraLatina: "Hora Sexta",
      titolo: "Pranzo",
      introduzione: "Giorno penitenziale. La tavola è sobria: una sola zuppa e il pane. L'assenza di condimenti abbondanti non è tristezza — è lucidità.",
      piatti: [
        {
          portata: "Zuppa",
          nome: "Minestra di orzo perlato e verdure invernali",
          tempo: "45 min",
          ingredienti: [
            { q: "200 g", nome: "orzo perlato" },
            { q: "2", nome: "carote" },
            { q: "2 gambi", nome: "sedano" },
            { q: "1", nome: "cipolla" },
            { q: "1 mazzo", nome: "spinaci freschi (o cavolo nero)" },
            { q: "1,5 l", nome: "brodo vegetale leggero" },
            { q: "1 cucchiaio", nome: "olio extravergine d'oliva (ridotto per il giorno penitenziale)" },
            { q: "q.b.", nome: "sale e pepe" },
          ],
          preparazione: [
            "Sciacquare l'orzo. In una pentola capiente, soffriggere brevemente le verdure a dadini nell'olio. Non eccedere nel condimento.",
            "Aggiungere l'orzo e il brodo. Cuocere a fuoco medio per 30 minuti.",
            "Aggiungere gli spinaci lavati negli ultimi 5 minuti. Aggiustare di sale.",
            "Servire caldo. Il minimo olio necessario — oggi è giorno di penitenza.",
          ],
          nota: "L'orzo è il cereale del pellegrino e del monaco. Meno nobile del grano, più rustico, più onesto. Nutre senza lusinga.",
        },
        {
          portata: "Pane",
          nome: "Pane di segale con semi di cumino",
          tempo: "3 h",
          ingredienti: [
            { q: "300 g", nome: "farina di segale" },
            { q: "200 g", nome: "farina 0" },
            { q: "320 ml", nome: "acqua tiepida" },
            { q: "7 g", nome: "lievito secco" },
            { q: "10 g", nome: "sale" },
            { q: "1 cucchiaino", nome: "semi di cumino" },
          ],
          preparazione: [
            "Sciogliere il lievito in acqua tiepida. Mescolare le farine con il sale e i semi di cumino.",
            "Impastare fino ad ottenere un composto omogeneo (la segale assorbe diversamente — la pasta sarà più appiccicosa del normale).",
            "Lievitare 2 ore. Formare una pagnotta allungata. Cuocere a 190°C per 40 minuti.",
          ],
        },
      ],
      lettura: {
        titolo: "Regola di San Benedetto — Cap. XLIX: L'osservanza quaresimale",
        rito: "Lettura tenuta in tono sommesso, come si conviene al giorno penitenziale.",
        testo: "«La vita del monaco dovrebbe sempre avere un carattere quaresimale. Tuttavia, poiché pochi posseggono questa virtù, esortiamo tutti in questi giorni santi a conservare la purezza della vita e a lavare, in questo tempo sacro, le negligenze di altri tempi. Ciò si fa degnamente se ci asteniamo da ogni vizio e ci dedichiamo alla preghiera con le lacrime, alla lettura, alla compunzione del cuore e all'astinenza.»",
        fonte: "Regola di San Benedetto, Cap. XLIX · ca. 530 d.C.",
      },
    },
    cena: {
      ora: "19:00",
      oraLatina: "Hora Vesperarum",
      titolo: "Cena",
      introduzione: "Cena semplicissima nel giorno penitenziale. Il corpo ha già ricevuto ciò di cui aveva bisogno a pranzo.",
      piatti: [
        {
          portata: "Piatto",
          nome: "Uova sode con erbe di campo e pane di segale",
          tempo: "12 min",
          ingredienti: [
            { q: "2", nome: "uova fresche per persona" },
            { q: "q.b.", nome: "prezzemolo, erba cipollina, cerfoglio tritati" },
            { q: "q.b.", nome: "sale grosso marino" },
            { q: "q.b.", nome: "pane di segale del pranzo" },
          ],
          preparazione: [
            "Cuocere le uova in acqua bollente per 9 minuti. Raffreddarle sotto acqua corrente e sgusciarle.",
            "Cospargere di erbe tritate e sale. Servire con il pane avanzato dal pranzo.",
          ],
          nota: "Nel giorno penitenziale non si prepara cibo nuovo per la cena. Si usa ciò che rimane. Il risparmio è virtù, non povertà.",
        },
        {
          portata: "Tisana",
          nome: "Tisana di achillea e menta",
          tempo: "5 min",
          ingredienti: [
            { q: "1 cucchiaino", nome: "achillea essiccata" },
            { q: "1 cucchiaino", nome: "menta essiccata" },
            { q: "250 ml", nome: "acqua bollente" },
          ],
          preparazione: [
            "Versare l'acqua bollente sulle erbe. Lasciare in infusione per 5 minuti. Filtrare e bere.",
          ],
          nota: "L'achillea è l'erba della soldatesca — usata per guarire le ferite. I monaci la bevono la sera per la sua azione digestiva e calmante.",
        },
      ],
      lettura: {
        titolo: "Salmo 50 (51) — Miserere",
        rito: "Recitato in silenzio, ognuno nel proprio cuore, prima di cena.",
        testo: "«Pietà di me, o Dio, nel tuo amore; nella tua grande misericordia cancella il mio peccato. Lavami da tutte le mie colpe, mondami dal mio peccato. Crea in me, o Dio, un cuore puro, rinnova in me uno spirito saldo. Non scacciarmi dalla tua presenza e non togliermi il tuo santo spirito.»",
        fonte: "Salmo 51 (50) · Bibbia CEI",
      },
    },
  },

  // ── GIOVEDÌ (4) ──────────────────────────────────────────────────────────
  {
    nomeBreve: "Giovedì",
    nomeLiturgico: "Feria Quinta",
    indicazioneGiorno: "Il giovedì è un giorno ordinario ma dignitoso. Non c'è la sobrietà penitenziale del mercoledì né la festività della domenica — è il ritmo autentico della vita monastica nel suo procedere fedele.",
    pranzo: {
      ora: "12:30",
      oraLatina: "Hora Sexta",
      titolo: "Pranzo",
      introduzione: "Il risotto è il piatto della pazienza: richiede presenza costante, attenzione, il mestolo girato al momento giusto. Una meditazione culinaria.",
      piatti: [
        {
          portata: "Primo",
          nome: "Risotto alle erbe aromatiche dell'orto",
          tempo: "30 min",
          ingredienti: [
            { q: "320 g", nome: "riso Carnaroli o Arborio" },
            { q: "1 l", nome: "brodo vegetale caldo" },
            { q: "1", nome: "scalogno" },
            { q: "50 ml", nome: "vino bianco secco" },
            { q: "3 cucchiai", nome: "olio extravergine d'oliva" },
            { q: "30 g", nome: "burro (per la mantecatura)" },
            { q: "40 g", nome: "parmigiano grattugiato" },
            { q: "2 cucchiai", nome: "erbe miste tritate (salvia, rosmarino, timo, prezzemolo)" },
          ],
          preparazione: [
            "Soffriggere dolcemente lo scalogno tritato nell'olio. Tostare il riso per 2 minuti mescolando continuamente.",
            "Sfumare con il vino bianco e lasciar evaporare. Aggiungere il brodo caldo un mestolo alla volta, aspettando ogni volta che venga assorbito.",
            "Dopo 16-18 minuti il riso è al dente. Togliere dal fuoco. Aggiungere le erbe tritate, il burro e il parmigiano. Mantecare vigorosamente per 2 minuti.",
            "Coprire e attendere 2 minuti prima di servire.",
          ],
          nota: "La mantecatura — quei due minuti di attesa coperti — è il segreto di ogni buon risotto. È il momento del riposo, come ogni buon lavoro benedettino richiede.",
        },
        {
          portata: "Contorno",
          nome: "Fagiolini all'olio con aglio e limone",
          tempo: "15 min",
          ingredienti: [
            { q: "400 g", nome: "fagiolini freschi" },
            { q: "1 spicchio", nome: "aglio" },
            { q: "2 cucchiai", nome: "olio extravergine d'oliva" },
            { q: "1/2", nome: "limone (succo)" },
            { q: "q.b.", nome: "sale" },
          ],
          preparazione: [
            "Lessare i fagiolini in acqua salata bollente per 7 minuti. Scolare e passare sotto acqua fredda.",
            "Condire con olio, aglio affettato finemente e succo di limone. Servire.",
          ],
        },
      ],
      lettura: {
        titolo: "San Benedetto da Norcia — Vita di San Benedetto (Gregorio Magno)",
        rito: "Il lettore proclama. I fratelli ascoltano.",
        testo: "«Benedetto, uomo di Dio, sin dall'infanzia ebbe il cuore di un vecchio. Per età era fanciullo, ma per i costumi aveva già un'anima matura. Lasciato il mondo con i suoi piaceri, cercò di piacere unicamente a Dio. Cercò un luogo dove la sua vita religiosa non fosse disturbata: trovò Subiaco, e là cominciò a costruire la sua anima.»",
        fonte: "Vita di San Benedetto, Libro II · Gregorio Magno · 594 d.C.",
      },
    },
    cena: {
      ora: "19:00",
      oraLatina: "Hora Vesperarum",
      titolo: "Cena",
      introduzione: "Un minestrone caldo chiude la giornata di giovedì. Il calore del brodo è anche il calore della comunità.",
      piatti: [
        {
          portata: "Zuppa",
          nome: "Minestrone di stagione con pasta di farro",
          tempo: "35 min",
          ingredienti: [
            { q: "1", nome: "patata" },
            { q: "1", nome: "zucchina" },
            { q: "1", nome: "pomodoro" },
            { q: "1 gambo", nome: "sedano" },
            { q: "1", nome: "carota" },
            { q: "100 g", nome: "pasta di farro piccola" },
            { q: "1 l", nome: "brodo vegetale" },
            { q: "2 cucchiai", nome: "olio extravergine d'oliva" },
            { q: "q.b.", nome: "basilico fresco e sale" },
          ],
          preparazione: [
            "Tagliare tutte le verdure a dadini piccoli. Soffriggere nell'olio per 5 minuti.",
            "Versare il brodo caldo. Cuocere 20 minuti. Aggiungere la pasta di farro e cuocere secondo indicazioni del pacchetto.",
            "Spegnere, aggiungere le foglie di basilico strappate. Servire con olio crudo.",
          ],
        },
      ],
      lettura: {
        titolo: "Romano Guardini — Lo spirito della liturgia",
        rito: "Lettura meditativa. Nessuna fretta.",
        testo: "«La liturgia non ha uno scopo — essa è fine a se stessa. Non è uno strumento per raggiungere qualcos'altro. Come il gioco del bambino o l'opera dell'artista, esiste in sé e per sé. È la vita dell'anima nella sua forma più alta, ed è per questo che può essere anche la forma più alta del riposo.»",
        fonte: "Lo Spirito della Liturgia · Romano Guardini · 1918",
      },
    },
  },

  // ── VENERDÌ (5) ──────────────────────────────────────────────────────────
  {
    nomeBreve: "Venerdì",
    nomeLiturgico: "Feria Sexta",
    indicazioneGiorno: "Il venerdì è giorno di astinenza dalla carne in memoria della Passione di Cristo. Si mangia pesce o si osserva il digiuno parziale. Il corpo porta il segno della Croce.",
    pranzo: {
      ora: "12:30",
      oraLatina: "Hora Sexta",
      titolo: "Pranzo",
      introduzione: "Giorno di astinenza. Niente carne. Il pesce, il legume o l'uovo prendono il suo posto — cibi umili che ricordano la dignità del creato.",
      piatti: [
        {
          portata: "Primo",
          nome: "Zuppa di merluzzo con pomodoro e capperi",
          tempo: "25 min",
          ingredienti: [
            { q: "400 g", nome: "filetti di merluzzo (o stoccafisso già ammollato)" },
            { q: "400 g", nome: "pomodori pelati" },
            { q: "2 cucchiai", nome: "capperi sotto sale (dissalati)" },
            { q: "2 spicchi", nome: "aglio" },
            { q: "1 mazzo", nome: "prezzemolo fresco" },
            { q: "500 ml", nome: "brodo di verdure" },
            { q: "3 cucchiai", nome: "olio extravergine d'oliva" },
            { q: "q.b.", nome: "peperoncino e sale" },
          ],
          preparazione: [
            "In una casseruola scaldare l'olio con l'aglio e il peperoncino. Aggiungere i pomodori pelati e i capperi. Cuocere 10 minuti.",
            "Versare il brodo caldo e portare a ebollizione. Aggiungere il merluzzo tagliato a pezzi.",
            "Cuocere a fuoco basso per 10 minuti. Il pesce non deve disfarsi completamente.",
            "Servire con abbondante prezzemolo fresco e pane tostato sfregato con aglio.",
          ],
          nota: "Il merluzzo è il pesce dei monaci costieri; lo stoccafisso quello dei monasteri di montagna. Entrambi nutriono con semplicità e durano a lungo — virtù monacale.",
        },
        {
          portata: "Pane",
          nome: "Crostini sfregati all'aglio con olio",
          tempo: "5 min",
          ingredienti: [
            { q: "4 fette", nome: "pane integrale tostato" },
            { q: "1 spicchio", nome: "aglio" },
            { q: "2 cucchiai", nome: "olio extravergine d'oliva" },
          ],
          preparazione: [
            "Tostare il pane. Sfregare immediatamente con l'aglio tagliato. Versare un filo d'olio.",
          ],
        },
      ],
      lettura: {
        titolo: "Via Crucis — Stazione IX: Gesù cade per la terza volta",
        rito: "Il venerdì, in alcuni monasteri, si legge dalla Via Crucis prima del pranzo.",
        testo: "«Eccolo per la terza volta a terra. Non riesce ad alzarsi. Ma non è la fatica del corpo che lo abbatte — è il peso del mondo intero che porta. Il Monaco impara dal suo Maestro: cadere non è la sconfitta. Alzarsi, quel poco che si può, continuare — questo è il cammino.»",
        fonte: "Meditazione della Via Crucis · Tradizione monastica",
      },
    },
    cena: {
      ora: "19:00",
      oraLatina: "Hora Vesperarum",
      titolo: "Cena",
      introduzione: "Il venerdì sera la cena è ridotta al minimo. Il corpo rende onore alla Passione anche con il suo silenzio.",
      piatti: [
        {
          portata: "Piatto",
          nome: "Uova in camicia su letto di spinaci al vapore",
          tempo: "15 min",
          ingredienti: [
            { q: "2", nome: "uova freschissime per persona" },
            { q: "200 g", nome: "spinaci freschi" },
            { q: "1 cucchiaio", nome: "aceto di vino bianco (per la cottura delle uova)" },
            { q: "1 cucchiaio", nome: "olio extravergine d'oliva" },
            { q: "q.b.", nome: "sale, noce moscata, pepe" },
          ],
          preparazione: [
            "Lessare gli spinaci al vapore per 3 minuti. Condirli con olio, sale e noce moscata.",
            "Portare a fremito una pentola di acqua acidulata con l'aceto. Rompere le uova in una ciotolina e scivolarle delicatamente nell'acqua. Cuocere 3 minuti.",
            "Disporre gli spinaci nel piatto e posarvi sopra le uova scolate. Pepe macinato al momento.",
          ],
          nota: "Il bianco dell'uovo rappreso ricorda il sudario. È un piatto che nei monasteri ha qualcosa di simbolico nel giorno del venerdì.",
        },
      ],
      lettura: {
        titolo: "Venerdì Santo — Passione secondo Giovanni",
        rito: "Una sola frase, prima della cena. Poi silenzio.",
        testo: "«Dopo questo, sapendo Gesù che ormai tutto era compiuto, affinché si adempisse la Scrittura, disse: \u201cHo sete.\u201d Vi era lì un vaso pieno di aceto; posero dunque una spugna imbevuta di aceto in cima a un ramo d'issopo e gliela accostarono alla bocca. Dopo aver preso l'aceto, Gesù disse: \u201cÈ compiuto!\u201d E, chinato il capo, consegnò lo spirito.»",
        fonte: "Vangelo di Giovanni 19, 28-30 · Bibbia CEI",
      },
    },
  },

  // ── SABATO (6) ───────────────────────────────────────────────────────────
  {
    nomeBreve: "Sabato",
    nomeLiturgico: "Sabbatum",
    indicazioneGiorno: "Il sabato è dedicato alla Vergine Maria nella tradizione benedettina. Si canta il Salve Regina ai Vespri. La tavola è serena — un po' di attesa della domenica già si respira.",
    pranzo: {
      ora: "12:30",
      oraLatina: "Hora Sexta",
      titolo: "Pranzo",
      introduzione: "Pasta al pomodoro fresco: il piatto più semplice e più perfetto della cucina italiana. Nel monastero si usa il pomodoro dell'orto raccolto quella mattina.",
      piatti: [
        {
          portata: "Primo",
          nome: "Spaghetti al pomodoro fresco dell'orto e basilico",
          tempo: "25 min",
          ingredienti: [
            { q: "400 g", nome: "spaghetti o linguine" },
            { q: "600 g", nome: "pomodori ramati maturi (o San Marzano)" },
            { q: "3 spicchi", nome: "aglio" },
            { q: "1 mazzo", nome: "basilico fresco" },
            { q: "4 cucchiai", nome: "olio extravergine d'oliva" },
            { q: "q.b.", nome: "sale e peperoncino" },
          ],
          preparazione: [
            "Scottare i pomodori in acqua bollente per 30 secondi, pelarli e tritarli grossolanamente.",
            "In padella scaldare l'olio con l'aglio schiacciato. Aggiungere i pomodori con il loro succo. Cuocere a fuoco vivace per 12-15 minuti fino ad addensare.",
            "Cuocere la pasta al dente. Scolare conservando un mestolo di acqua di cottura.",
            "Saltare la pasta nel sugo aggiungendo l'acqua di cottura se necessario. Spegnere, aggiungere il basilico spezzato a mano.",
          ],
          nota: "San Benedetto scrisse: 'L'ozio è il nemico dell'anima'. Ma un buon piatto di pasta al pomodoro, preparato con cura, è la smentita culinaria di questo aforisma — o forse la sua conferma più profonda.",
        },
        {
          portata: "Contorno",
          nome: "Finocchi brasati al forno",
          tempo: "30 min",
          ingredienti: [
            { q: "3", nome: "finocchi" },
            { q: "2 cucchiai", nome: "olio extravergine d'oliva" },
            { q: "100 ml", nome: "brodo vegetale" },
            { q: "q.b.", nome: "sale e pepe" },
          ],
          preparazione: [
            "Tagliare i finocchi a spicchi. Disporli in una teglia con olio, brodo, sale e pepe.",
            "Cuocere in forno a 190°C per 25 minuti, girando a metà cottura.",
          ],
        },
        {
          portata: "Frutta",
          nome: "Albicocche fresche con mandorle",
          tempo: "3 min",
          ingredienti: [
            { q: "4-5", nome: "albicocche mature per persona" },
            { q: "q.b.", nome: "mandorle pelate" },
          ],
          preparazione: [
            "Lavare e tagliare le albicocche. Disporre le mandorle accanto.",
          ],
        },
      ],
      lettura: {
        titolo: "Inno Akathistos alla Madre di Dio — Strofa I",
        rito: "Il sabato si leggono testi mariani. Il lettore inclina il capo alla fine di ogni strofa.",
        testo: "«A te, o Madre di Dio, condottiera vittoriosa, rendo grazie per la vittoria io, tua città liberata dai mali. Ma poiché hai potere invincibile, liberami da ogni pericolo, affinché ti chiami: Gioisci, Sposa inviolata.»",
        fonte: "Inno Akathistos, Prologo · Tradizione greco-bizantina · V sec.",
      },
    },
    cena: {
      ora: "19:00",
      oraLatina: "Hora Vesperarum",
      titolo: "Cena",
      introduzione: "Sabato sera: il Salve Regina risuona ancora nelle orecchie. La cena è quieta. La polenta scalda l'anima nei mesi freschi.",
      piatti: [
        {
          portata: "Piatto",
          nome: "Polenta morbida con formaggio di capra e salvia",
          tempo: "40 min",
          ingredienti: [
            { q: "300 g", nome: "farina di mais gialla (bramata)" },
            { q: "1,2 l", nome: "acqua" },
            { q: "1 cucchiaino", nome: "sale" },
            { q: "100 g", nome: "formaggio di capra fresco" },
            { q: "6 foglie", nome: "salvia fresca" },
            { q: "2 cucchiai", nome: "burro" },
          ],
          preparazione: [
            "Portare l'acqua salata a ebollizione. Versare la farina di mais a pioggia mescolando continuamente con una frusta.",
            "Cuocere mescolando per 30-35 minuti fino a che la polenta si stacchi dalle pareti. Deve risultare morbida.",
            "Sciogliere il burro con le foglie di salvia in un padellino. Servire la polenta con il formaggio di capra sbriciolato sopra e il burro alla salvia.",
          ],
          nota: "La polenta morbida è il cibo della sera per eccellenza nelle regioni alpine. In molti monasteri del nord è il sabato sera che compare in tavola, come anticipo della quiete domenicale.",
        },
        {
          portata: "Tisana",
          nome: "Tisana di melissa e fiori di tiglio",
          tempo: "5 min",
          ingredienti: [
            { q: "1 cucchiaino", nome: "melissa essiccata" },
            { q: "1 cucchiaino", nome: "fiori di tiglio essiccati" },
            { q: "250 ml", nome: "acqua bollente" },
            { q: "q.b.", nome: "miele d'acacia (facoltativo)" },
          ],
          preparazione: [
            "Versare l'acqua bollente sulle erbe. Coprire e lasciare in infusione 7 minuti. Filtrare. Addolcire con un filo di miele se gradito.",
          ],
          nota: "Il tiglio è l'albero della quiete. I Certosini lo piantavano all'ingresso dei loro eremi. La sua tisana prepara al sonno e alla preghiera notturna.",
        },
      ],
      lettura: {
        titolo: "Salve Regina — Antifona Mariana",
        rito: "Cantata o recitata in piedi al termine della cena del sabato.",
        testo: "«Salve, Regina, Madre di misericordia, vita, dolcezza e speranza nostra, salve. A te ricorriamo, esuli figli di Eva; a te sospiriamo, gementi e piangenti in questa valle di lacrime. Orsù dunque, avvocata nostra, rivolgi a noi gli occhi tuoi misericordiosi. E mostraci, dopo questo esilio, Gesù, il frutto benedetto del tuo seno.»",
        fonte: "Salve Regina · Attribuita a Ermanno di Reichenau · XI sec.",
      },
    },
  },
];

export function getMenuGiorno(dayOfWeek?: number): GiornoMensa {
  const day = dayOfWeek ?? new Date().getDay();
  return MENU[day];
}

export function formatDataLiturgica(): string {
  const now = new Date();
  const giorni = ["Domenica", "Lunedì", "Martedì", "Mercoledì", "Giovedì", "Venerdì", "Sabato"];
  const mesi = ["Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno", "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre"];
  return `${giorni[now.getDay()]} ${now.getDate()} ${mesi[now.getMonth()]} ${now.getFullYear()}`;
}
