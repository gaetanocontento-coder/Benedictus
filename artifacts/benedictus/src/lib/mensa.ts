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
  bevande: string[];
  piatti: Piatto[];
  lettura: Lettura;
}

export interface GiornoMensa {
  nomeBreve: string;
  nomeLiturgico: string;
  indicazioneGiorno: string;
  colazione: Pasto;
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
    natale:    "Nel Tempo di Natale il refettorio si allieta: l'olio è generoso, il pane è arricchito, la tavola risuona della gioia dell'Incarnazione.",
    quaresima: "In Quaresima si pratica l'astinenza: un solo pasto al giorno per le prime settimane, poi due pasti frugali. Niente carne, niente olio abbondante nei giorni feriali. Il corpo impara il silenzio.",
    pasqua:    "Nel Tempo Pasquale l'Alleluia ritorna sulla tavola: i cibi sono più abbondanti e gioiosi, il vino torna nei giorni festivi.",
    estate:    "D'estate nelle Murge il lavoro manuale è intenso. La tavola è fresca e stagionale: insalate dell'orto, legumi dell'aia, frutta abbondante. Il pasto di mezzogiorno è il principale.",
    ordinario: "Nel Tempo Ordinario si osserva la Regola nelle sue proporzioni abituali: pranzo sostanzioso, cena leggera, digiuno il venerdì. La semplicità pugliese si esprime in pochi ingredienti curati.",
  };
  return indicazioni[stagione];
}

const MENU: GiornoMensa[] = [
  // ── DOMENICA (0) ─────────────────────────────────────────────────────────
  {
    nomeBreve: "Domenica",
    nomeLiturgico: "Dies Dominica",
    indicazioneGiorno: "La domenica è il giorno del Signore. Il lavoro si ferma, il refettorio si apre con gioia. Il pasto è più abbondante del solito — un anticipo del banchetto eterno. Si usa il vino dell'abbazia. La colazione del mattino è arricchita con il miele e la frutta dell'orto.",
    colazione: {
      ora: "7:00",
      oraLatina: "Hora Prima",
      titolo: "Colazione",
      introduzione: "La domenica la colazione è più ricca del solito. Dopo le Lodi si spezza il pane festivo con fichi e miele. Il corpo si risveglia lentamente verso il giorno del Signore.",
      bevande: ["Orzo tostato", "Acqua sorgiva delle Murge", "Tisana di melissa"],
      piatti: [
        {
          portata: "Pane",
          nome: "Pane di Altamura tostato con olio e origano del Gargano",
          tempo: "5 min",
          ingredienti: [
            { q: "2 fette spesse", nome: "pane di Altamura (semola rimacinata DOP)" },
            { q: "2 cucchiai", nome: "olio extravergine coratina (Puglia)" },
            { q: "q.b.", nome: "origano del Gargano essiccato" },
            { q: "1 pizzico", nome: "sale marino di Margherita di Savoia" },
          ],
          preparazione: [
            "Tostare le fette di pane di Altamura sulla griglia o in forno finché dorate. La semola rimacinata le rende croccanti fuori e morbide dentro.",
            "Versare un filo d'olio crudo sulle fette calde. Cospargere di origano e un pizzico di sale.",
          ],
          nota: "Il pane di Altamura — a pochi chilometri dall'Abbazia della Scala — è il pane della Murgia per eccellenza. La sua semola dorata nutre in modo completo e antico.",
        },
        {
          portata: "Frutta e dolce naturale",
          nome: "Fichi neri del Salento con miele di zagara e mandorle di Toritto",
          tempo: "3 min",
          ingredienti: [
            { q: "3-4", nome: "fichi neri maturi per persona" },
            { q: "1 cucchiaino", nome: "miele di zagara (fiori d'arancio, Puglia)" },
            { q: "1 manciata", nome: "mandorle di Toritto DOP, leggermente tostate" },
          ],
          preparazione: [
            "Aprire i fichi a metà. Disporli nel piatto con le mandorle.",
            "Versare un filo sottile di miele di zagara. Servire subito.",
          ],
          nota: "Le mandorle di Toritto — a pochi passi dall'abbazia — sono tra le più pregiate della Puglia. Il miele di zagara profuma di primavera anche in estate.",
        },
      ],
      lettura: {
        titolo: "Salmo 117 (118) — Il grande Hallel della domenica",
        rito: "Il salmo domenicale si canta a Prima. A colazione il lettore ne proclama i versetti centrali.",
        testo: "«Rendete grazie al Signore perché è buono: eterna è la sua misericordia. Dica pure Israele: eterna è la sua misericordia. La destra del Signore ha fatto meraviglie, la destra del Signore mi ha rialzato. Questo è il giorno che ha fatto il Signore: rallegriamoci ed esultiamo in esso. Ti rendo grazie perché mi hai risposto e sei stato la mia salvezza. La pietra scartata dai costruttori è diventata la pietra d'angolo: dal Signore è stato fatto questo ed è mirabile ai nostri occhi.»",
        fonte: "Salmo 118 (117), 1.2.16-17.22-23 · Bibbia CEI",
      },
    },
    pranzo: {
      ora: "12:30",
      oraLatina: "Hora Sexta",
      titolo: "Pranzo",
      introduzione: "Il pasto domenicale è il più curato della settimana. Si serve il vino delle Murge — con sobrietà, come prescrive la Regola. Le orecchiette sono l'identità culinaria di questa terra.",
      bevande: ["Vino Primitivo delle Murge (un calice)", "Acqua sorgiva"],
      piatti: [
        {
          portata: "Primo",
          nome: "Orecchiette al ragù di agnello delle Murge con pomodoro fiaschetto",
          tempo: "90 min",
          ingredienti: [
            { q: "400 g", nome: "orecchiette fresche di semola (fatte in abbazia)" },
            { q: "500 g", nome: "spalla di agnello delle Murge a pezzi" },
            { q: "600 g", nome: "pomodori fiaschetto di Torre Guaceto, pelati" },
            { q: "1", nome: "cipolla di Acquaviva delle Fonti (rossa)" },
            { q: "2 spicchi", nome: "aglio" },
            { q: "1 mazzetto", nome: "basilico fresco" },
            { q: "4 cucchiai", nome: "olio extravergine coratina" },
            { q: "100 ml", nome: "vino rosso Primitivo per sfumare" },
            { q: "q.b.", nome: "sale, peperoncino fresco" },
          ],
          preparazione: [
            "In una casseruola capiente rosolare i pezzi di agnello nell'olio con la cipolla tritata finché ben dorati da tutti i lati. Sfumare con il Primitivo e lasciar evaporare completamente.",
            "Aggiungere l'aglio schiacciato, i pomodori fiaschetto spezzettati con le mani e il peperoncino. Cuocere a fuoco bassissimo coperto per 60-70 minuti — il ragù deve sobollire piano, quasi pregare.",
            "A cottura ultimata, separare la carne dall'intingolo. Disossare e sminuzzare la carne, rimetterla nel sugo. Spegnere e aggiungere le foglie di basilico strappate.",
            "Cuocere le orecchiette in acqua salata bollente. Scolare e mantecare nel ragù aggiungendo un mestolo di acqua di cottura.",
          ],
          nota: "Le orecchiette — dette anche «recchietelle» in dialetto barese — si fanno a mano trascinando il pollice sul tavolo di pietra. Nei monasteri pugliesi le novizie le imparavano come prima arte della vita comunitaria.",
        },
        {
          portata: "Contorno",
          nome: "Insalata di pomodori di campagna con cipolla rossa di Acquaviva e origano",
          tempo: "10 min",
          ingredienti: [
            { q: "4", nome: "pomodori maturi (cuore di bue o costoluto)" },
            { q: "1/2", nome: "cipolla rossa di Acquaviva delle Fonti" },
            { q: "3 cucchiai", nome: "olio extravergine coratina" },
            { q: "q.b.", nome: "origano del Gargano, sale marino di Margherita" },
            { q: "q.b.", nome: "olive baresane in salamoia" },
          ],
          preparazione: [
            "Tagliare i pomodori a fette spesse. Affettare finemente la cipolla e ammollarla in acqua fredda per 10 minuti per addolcirla.",
            "Comporre il piatto alternando pomodori, cipolla e olive. Condire abbondantemente con olio, origano e sale. Lasciare riposare 5 minuti prima di portare in tavola.",
          ],
        },
        {
          portata: "Frutta",
          nome: "Uva da tavola di Puglia",
          tempo: "2 min",
          ingredienti: [
            { q: "1 grappolo", nome: "uva Italia o Vittoria (Puglia)" },
          ],
          preparazione: [
            "Lavare il grappolo e portarlo in tavola intero. Ogni fratello prende la propria porzione.",
          ],
          nota: "La Puglia è la prima regione vitivinicola d'Italia per superficie. L'uva da tavola — soprattutto la varietà Italia — è un dono dell'estate meridionale.",
        },
      ],
      lettura: {
        titolo: "Regola di San Benedetto — Prologo",
        rito: "Il lettore della settimana si alza. La comunità inclina il capo in ascolto. Nessuno mangia finché non è terminata la lettura.",
        testo: "«Ausculta, o fili, præcepta magistri. — Ascolta, o figlio, i precetti del maestro, e piega l'orecchio del tuo cuore; accogli volentieri il consiglio di un padre amoroso e mettilo in pratica con efficacia: così, attraverso la fatica dell'obbedienza, ritornerai a Colui dal quale ti eri allontanato mediante la pigrizia della disobbedienza. A te dunque si rivolge il mio discorso, chiunque tu sia, che rinunciando alla tua volontà imbracciando le armi fortissime e gloriose dell'obbedienza combatti per il Signore Cristo, il vero Re.\n\nPrima di tutto, ogni volta che intraprendi qualcosa di buono, chiedi a Dio con preghiera intensissima che lo porti a compimento. Egli che già si è degnato di annoverarci tra i figli non dovrà rattristarsi delle nostre cattive azioni. Dobbiamo servirlo con i beni che ci ha dato, affinché non venga il giorno in cui, adiratosi per i nostri peccati, ci escluda dalla sua eredità come padre offeso disconosce i figli, o come re terribile punisce i servi malvagi che non vollero seguirlo nella gloria.\n\nAlziamoci dunque finalmente: la Scrittura ci desta dal sonno gridando: È ormai l'ora di svegliarsi, perché ora la nostra salvezza è più vicina di quando credemmo. Apriamo gli occhi alla luce divinizzante e le orecchie alla voce divina che ogni giorno ci ammonisce: Oggi, se udite la sua voce, non indurite il vostro cuore. E ancora: Chi ha orecchi, ascolti ciò che lo Spirito dice alle Chiese. Corriamo e facciamo ora ciò che giova per l'eternità.»",
        fonte: "Regola di San Benedetto, Prologo 1–44 · ca. 530 d.C.",
      },
    },
    cena: {
      ora: "19:00",
      oraLatina: "Hora Vesperarum",
      titolo: "Cena",
      introduzione: "La cena domenicale è leggera: dopo il pasto festivo di mezzogiorno il corpo non chiede molto. Un brodo caldo, la burrata fresca dell'abbazia, il pane avanzato dal pranzo.",
      bevande: ["Acqua sorgiva", "Tisana di camomilla selvatica"],
      piatti: [
        {
          portata: "Zuppa",
          nome: "Brodo di verdure dell'orto con crostini di pane di Altamura",
          tempo: "30 min",
          ingredienti: [
            { q: "2", nome: "carote delle Murge" },
            { q: "2 gambi", nome: "sedano" },
            { q: "1", nome: "cipolla" },
            { q: "1", nome: "pomodoro maturo" },
            { q: "2 foglie", nome: "alloro" },
            { q: "q.b.", nome: "sale e pepe nero" },
            { q: "4 fette", nome: "pane di Altamura raffermo tostato" },
          ],
          preparazione: [
            "Mettere le verdure pulite intere o a grossi pezzi in una pentola con acqua fredda. Portare a ebollizione e cuocere 25 minuti.",
            "Filtrare il brodo. Servire ben caldo nelle ciotole con i crostini di Altamura tostati e un filo d'olio crudo.",
          ],
        },
        {
          portata: "Piatto",
          nome: "Burrata di Andria con pomodorino e olive baresane",
          tempo: "5 min",
          ingredienti: [
            { q: "1", nome: "burrata di Andria fresca (125 g per persona)" },
            { q: "100 g", nome: "pomodorini del piennolo o datterino" },
            { q: "q.b.", nome: "olive baresane verdi in salamoia" },
            { q: "2 cucchiai", nome: "olio extravergine coratina" },
            { q: "q.b.", nome: "origano del Gargano" },
          ],
          preparazione: [
            "Portare la burrata a temperatura ambiente almeno 20 minuti prima. Disporla nel piatto con i pomodorini tagliati a metà e le olive.",
            "Condire con olio, origano e un pizzico di sale. Servire con pane di Altamura.",
          ],
          nota: "La burrata nasce ad Andria nel 1956 come modo di riutilizzare i ritagli di mozzarella. Oggi è l'emblema della cucina pugliese nel mondo. Il suo cuore cremoso — la stracciatella — si spalma sul pane come una preghiera silenziosa.",
        },
      ],
      lettura: {
        titolo: "Sant'Agostino di Ippona — Confessioni, Libro I",
        rito: "Silenzio. Il lettore si alza lentamente dopo il Benedicite.",
        testo: "«Grandi sei, o Signore, e grandissima è la tua potenza, e la tua sapienza non ha misura. E l'uomo vuole lodarti — questa parte minima della tua creazione — e porta con sé la sua mortalità, porta con sé la testimonianza del suo peccato. Eppure l'uomo vuole lodarti: tu l'hai fatto per te, e il nostro cuore è inquieto finché non riposa in te.\n\nChi mi darà di riposare in te? Chi mi darà che tu venga nel mio cuore e lo inebri, così che io dimentichi i miei mali e ti abbracci, il mio unico bene? Che cosa sei per me? Abbi pietà di me, perché io possa parlare. Che cosa sono io per te, che mi comandi di amarti? E se non lo faccio, sei sdegnato con me e minacci grandi miserie. Basta essa sola a essere grande miseria, non amarti.\n\nTardi ti ho amato, bellezza così antica e così nuova, tardi ti ho amato! Ed ecco, tu eri dentro di me, e io ero fuori, e là ti cercavo. Dentro di me eri tu, e io non ero con te. Mi tenevano lontano da te le cose che, se non fossero in te, non sarebbero affatto. Mi chiamasti, gridasti, e spezzasti la mia sordità. Balenasti, brillasti, e scacciasti la mia cecità. Spirasti, e ora respiro e anelo a te.»",
        fonte: "Confessioni I, 1 e X, 27 · Sant'Agostino di Ippona · 397 d.C.",
      },
    },
  },

  // ── LUNEDÌ (1) ───────────────────────────────────────────────────────────
  {
    nomeBreve: "Lunedì",
    nomeLiturgico: "Feria Secunda",
    indicazioneGiorno: "Il lunedì si riprende il ritmo ordinario. L'ora di Prima suona ancora nel silenzio del chiostro. Il corpo, tornato al lavoro nelle Murge, chiede cibo semplice e nutritivo — quello che la terra pugliese dà senza orpelli.",
    colazione: {
      ora: "7:00",
      oraLatina: "Hora Prima",
      titolo: "Colazione",
      introduzione: "Colazione feriale: semplice, rapida, necessaria. Il pane di Altamura con un filo d'olio nutre per tutta la mattinata di lavoro. Niente eccessi — è il lunedì.",
      bevande: ["Orzo tostato non zuccherato", "Acqua sorgiva"],
      piatti: [
        {
          portata: "Pane",
          nome: "Pane di Altamura con olio nuovo e sale di Margherita",
          tempo: "3 min",
          ingredienti: [
            { q: "2 fette", nome: "pane di Altamura DOP" },
            { q: "1 cucchiaio", nome: "olio extravergine coratina" },
            { q: "1 pizzico", nome: "sale marino di Margherita di Savoia" },
          ],
          preparazione: [
            "Versare l'olio sul pane a temperatura ambiente. Cospargere di sale. Non tostare nei giorni feriali ordinari — il pane si mangia così.",
          ],
        },
        {
          portata: "Frutta",
          nome: "Frutta di stagione dell'orto",
          tempo: "1 min",
          ingredienti: [
            { q: "1", nome: "frutto di stagione per commensale (fico, pesca, pera, mela — secondo il mese)" },
          ],
          preparazione: [
            "Lavare e portare in tavola. La semplicità è la norma dei giorni ordinari.",
          ],
        },
      ],
      lettura: {
        titolo: "Regola di San Benedetto — Cap. XLVIII: Il lavoro quotidiano",
        rito: "Breve lettura al primo spezzare del pane. Il lavoro inizia presto.",
        testo: "«L'ozio è il nemico dell'anima; i monaci perciò devono dedicarsi a certi momenti al lavoro manuale e ad altri momenti alla lettura divina. Pensiamo che i tempi dell'uno e dell'altra si debbano distribuire nel modo seguente: dalla Pasqua alle calende di ottobre, al mattino si lavori da Prima fino all'ora quarta; dall'ora quarta fino quasi all'ora sesta ci si dedichi alla lettura. Dall'ora sesta, alzandosi da mensa, riposino sui loro letti in assoluto silenzio. E se qualcuno vuole leggere per conto suo, legga senza disturbare gli altri. Si dica Nona un po' prima, verso la metà dell'ottava ora, e poi lavorino di nuovo fino al Vespro.»",
        fonte: "Regola di San Benedetto, Cap. XLVIII · ca. 530 d.C.",
      },
    },
    pranzo: {
      ora: "12:30",
      oraLatina: "Hora Sexta",
      titolo: "Pranzo",
      introduzione: "Fave e cicoria: il piatto simbolo della cucina pugliese, antico quanto la civiltà contadina delle Murge. Nutriente, economico, profondamente onesto. Nei monasteri benedettini della Puglia è il piatto dei giorni feriali per eccellenza.",
      bevande: ["Acqua sorgiva delle Murge", "Vino rosso (solo festività)"],
      piatti: [
        {
          portata: "Piatto unico",
          nome: "Fave e cicoria alla maniera dell'Abbazia della Scala",
          tempo: "2 h (con ammollo) · 45 min (senza)",
          ingredienti: [
            { q: "400 g", nome: "fave bianche secche decorticate (Puglia)" },
            { q: "1 kg", nome: "cicoria selvatica fresca o coltivata" },
            { q: "5 cucchiai", nome: "olio extravergine coratina" },
            { q: "2 spicchi", nome: "aglio" },
            { q: "q.b.", nome: "sale marino di Margherita di Savoia" },
            { q: "q.b.", nome: "peperoncino fresco o essiccato" },
          ],
          preparazione: [
            "Ammollare le fave bianche per 8-12 ore (o usare quelle già ammollate). Sciacquarle e cuocerle in acqua fredda non salata — portare a ebollizione, schiumare, poi cuocere a fuoco basso per 40-50 minuti fino a completa disfatta. Aggiungere il sale solo alla fine.",
            "Nel frattempo lessare la cicoria in abbondante acqua salata per 8-10 minuti. Scolare conservando l'acqua di cottura (è nutriente e saporita). Strizzare leggermente.",
            "In una padella scaldare 3 cucchiai d'olio con l'aglio e il peperoncino. Saltare la cicoria per 5 minuti a fuoco vivace finché insaporita.",
            "Frullare le fave con un cucchiaio di legno o con il passaverdure — non devono essere lisce come una crema, ma rustiche. Aggiungere l'acqua di cottura della cicoria per ottenere la consistenza desiderata: densa ma non secca.",
            "Impiattare versando la purée di fave a specchio e disponendo la cicoria sopra. Completare con abbondante olio crudo a filo.",
          ],
          nota: "La purée di fave e cicoria — chiamata in dialetto barese «fav'e cecore» — è il piatto che identifica la cucina delle Murge più di ogni altro. Ippocrate la citava come medicina. I monaci la cucinano ogni lunedì da secoli.",
        },
        {
          portata: "Pane",
          nome: "Pane di Altamura dell'abbazia",
          tempo: "3 h (lievitazione inclusa)",
          ingredienti: [
            { q: "500 g", nome: "semola rimacinata di grano duro (Altamura DOP)" },
            { q: "320 ml", nome: "acqua tiepida" },
            { q: "10 g", nome: "lievito di birra fresco" },
            { q: "10 g", nome: "sale marino" },
            { q: "1 cucchiaio", nome: "olio extravergine coratina" },
          ],
          preparazione: [
            "Sciogliere il lievito nell'acqua tiepida con un pizzico di zucchero. Attendere 10 minuti fino alla formazione della schiuma.",
            "Mescolare la semola con il sale. Versare gradualmente l'acqua con il lievito e l'olio, impastando energicamente per 10 minuti fino a un impasto liscio e tenace — la semola richiede più forza del grano tenero.",
            "Coprire con un panno umido e lievitare 2 ore. Formare una pagnotta alta. Incidere la superficie con una croce — atto di benedizione monastico. Infornare a 220°C per 40 minuti.",
          ],
          nota: "Il pane di Altamura è uno dei più antichi d'Italia — Orazio lo menzionava già nel I secolo a.C. La semola di grano duro lo rende compatto e nutriente: dura 3-4 giorni senza indurirsi, come si conviene a un pane monastico.",
        },
      ],
      lettura: {
        titolo: "Regola di San Benedetto — Cap. XXXIX: La quantità del cibo",
        rito: "Il lettore prende posto. Nessuno mangia prima che inizi la lettura.",
        testo: "«Crediamo sufficiente per il pasto quotidiano — a qualunque ora si mangi, sesta o nona — due pietanze cotte, tenendo conto delle diverse debolezze dei fratelli, affinché chi non può mangiare di una, possa ristorarsi dell'altra. Due pietanze cotte dunque bastino a tutti i fratelli; e se si può avere frutta o legumi freschi, si aggiunga una terza. Basta una libra di pane al giorno, sia che vi sia un solo pasto sia che vi siano il pranzo e la cena. Se ci sarà la cena, il cellario conserverà un terzo della libra per distribuirla alla cena.\n\nSe il lavoro fu particolarmente pesante, l'abate può aggiungere qualcosa, se lo giudica opportuno, purché si eviti sopra ogni cosa l'ingordigia, affinché il monaco non venga colto da pesantezza. Niente, infatti, è così contrario a ogni cristiano come l'eccesso del mangiare, come ce lo insegna il nostro Signore: «Guardatevi che i vostri cuori non si appesantiscano per crapula e ubriachezza.» Ai fanciulli di tenera età non si daranno le stesse quantità, ma sempre meno degli adulti, con parsimonia in ogni cosa.»",
        fonte: "Regola di San Benedetto, Cap. XXXIX · ca. 530 d.C.",
      },
    },
    cena: {
      ora: "19:00",
      oraLatina: "Hora Vesperarum",
      titolo: "Cena",
      introduzione: "La cena è leggera. Dopo il Vespro, il corpo si calma. San Benedetto prescrive per la cena un terzo della razione del pranzo. Le uova dell'aia e le erbe dell'orto del chiostro bastano.",
      bevande: ["Acqua sorgiva", "Tisana di erbe del chiostro"],
      piatti: [
        {
          portata: "Piatto",
          nome: "Frittata alle erbe aromatiche dell'orto del chiostro",
          tempo: "15 min",
          ingredienti: [
            { q: "3", nome: "uova fresche dell'abbazia per persona" },
            { q: "2 cucchiai", nome: "erbe fresche tritate: prezzemolo, origano, maggiorana, erba cipollina" },
            { q: "1 cucchiaio", nome: "olio extravergine coratina" },
            { q: "q.b.", nome: "sale e pepe nero" },
          ],
          preparazione: [
            "Sbattere le uova con le erbe aromatiche tritate, sale e pepe fino a un composto omogeneo e spumoso.",
            "Scaldare l'olio in una padella di ferro a fuoco medio. Versare il composto. Coprire con un coperchio e cuocere a fuoco basso per 8 minuti fino a che la frittata sia soda e dorata sotto.",
            "Servire calda tagliata a spicchi, con pane di Altamura avanzato dal pranzo.",
          ],
          nota: "Le uova sono l'alimento monastico per eccellenza nei giorni senza carne. Semplici, nutrienti, rapide — come deve essere la cena dopo un lungo giorno di preghiera e lavoro nelle Murge.",
        },
        {
          portata: "Insalata",
          nome: "Pomodori e cetrioli con olio e menta",
          tempo: "5 min",
          ingredienti: [
            { q: "2", nome: "pomodori dell'orto" },
            { q: "1", nome: "cetriolo" },
            { q: "3-4 foglie", nome: "menta fresca" },
            { q: "2 cucchiai", nome: "olio extravergine coratina" },
            { q: "q.b.", nome: "sale" },
          ],
          preparazione: [
            "Tagliare a pezzi grossi pomodori e cetrioli. Condire con olio, menta spezzettata e sale. Servire subito.",
          ],
        },
      ],
      lettura: {
        titolo: "Thomas Merton — Nessun uomo è un'isola",
        rito: "Lettura breve. La sera invita al silenzio più che alle parole.",
        testo: "«Il silenzio non è la negazione del suono, ma la sua pienezza. Nella cella del silenzio l'anima impara a distinguere la propria voce dalla voce di Dio — e questa distinzione è tutta la vita spirituale.\n\nIl mondo moderno è non tanto un mondo senza fede quanto un mondo che ha perso il silenzio. E senza silenzio non può esserci contemplazione vera. La contemplazione non è pensiero profondo, non è meditazione intensa: è l'attenzione silenziosa di tutto l'essere a Colui che è il Fondamento di ogni essere.\n\nChi non sa stare in silenzio con se stesso non sa ancora chi è. E chi non sa chi è non sa ancora amare. L'amore autentico nasce dal centro silenzioso dell'essere, non dalla periferia rumorosa del fare. Per questo la vita monastica non è una fuga dal mondo, ma un ritorno al cuore delle cose.»",
        fonte: "Nessun uomo è un'isola · Thomas Merton · 1955",
      },
    },
  },

  // ── MARTEDÌ (2) ──────────────────────────────────────────────────────────
  {
    nomeBreve: "Martedì",
    nomeLiturgico: "Feria Tertia",
    indicazioneGiorno: "Il martedì porta avanti il ritmo della settimana. Il lavoro si consolida, la preghiera tiene il centro. La tavola rispecchia questa stabilità — sapori pugliesi familiari e ben eseguiti, come la mano del monaco esperto che compie senza affanno il suo compito quotidiano.",
    colazione: {
      ora: "7:00",
      oraLatina: "Hora Prima",
      titolo: "Colazione",
      introduzione: "Il martedì si comincia col pane e la marmellata fatta in abbazia — fichi o fichi d'india, secondo la stagione. La semplicità è già una forma di preghiera.",
      bevande: ["Orzo tostato", "Acqua sorgiva"],
      piatti: [
        {
          portata: "Pane e conserva",
          nome: "Pane di Altamura con marmellata di fichi neri dell'abbazia",
          tempo: "3 min",
          ingredienti: [
            { q: "2 fette", nome: "pane di Altamura" },
            { q: "2 cucchiai", nome: "marmellata di fichi neri del Salento (preparata in abbazia)" },
          ],
          preparazione: [
            "Spalmare la marmellata sul pane. La marmellata di fichi si prepara in estate con i fichi dell'orto e si conserva per tutto l'anno.",
          ],
          nota: "I fichi del Salento — varietà Dottato — sono tra i più dolci d'Italia. Essiccati, sciroppati o in marmellata: nei monasteri pugliesi non mancano mai.",
        },
        {
          portata: "Frutta",
          nome: "Uva di Puglia o fico fresco di stagione",
          tempo: "1 min",
          ingredienti: [
            { q: "1 porzione", nome: "uva da tavola di Puglia (estate-autunno) o fico fresco (agosto-settembre)" },
          ],
          preparazione: ["Portare in tavola lavata. Mangiare in silenzio."],
        },
      ],
      lettura: {
        titolo: "Proverbio monastico delle Murge",
        rito: "Una sola frase, pronunciata dall'abate prima del pane.",
        testo: "«Chi lavora prega due volte — ma chi mangia con gratitudine compie il cerchio. Il pane non è nostro: è dono della terra, della pioggia e delle mani di chi ha seminato. Ricevilo come tale, e ogni pasto sarà un atto di fede.»",
        fonte: "Tradizione orale monastica benedettina, Puglia",
      },
    },
    pranzo: {
      ora: "12:30",
      oraLatina: "Hora Sexta",
      titolo: "Pranzo",
      introduzione: "Pasta e ceci alla pugliese: il piatto dei poveri e dei monaci. Nutriente, economico, antico quanto la civiltà mediterranea. Con il rosmarino e il peperoncino — le spezie dell'orto del chiostro.",
      bevande: ["Acqua sorgiva delle Murge"],
      piatti: [
        {
          portata: "Piatto unico",
          nome: "Pasta e ceci alla pugliese con rosmarino e peperoncino",
          tempo: "40 min (con ceci in scatola) · 3 h con ceci secchi",
          ingredienti: [
            { q: "400 g", nome: "ceci pugliesi cotti (o 200 g secchi ammollati 12 ore)" },
            { q: "200 g", nome: "pasta mista corta (o lagane — tagliatelle corte di semola)" },
            { q: "1", nome: "cipolla dorata" },
            { q: "2 spicchi", nome: "aglio" },
            { q: "300 g", nome: "pomodori fiaschetto pelati" },
            { q: "1 rametto", nome: "rosmarino fresco dell'orto" },
            { q: "1", nome: "peperoncino fresco delle Murge" },
            { q: "4 cucchiai", nome: "olio extravergine coratina" },
            { q: "q.b.", nome: "sale marino di Margherita" },
          ],
          preparazione: [
            "Soffriggere la cipolla tritata in olio abbondante con l'aglio e il peperoncino fino a doratura. Aggiungere il rosmarino.",
            "Unire i pomodori pelati spezzettati e cuocere 10 minuti. Aggiungere metà dei ceci interi e l'altra metà frullati grossolanamente — questo crea la consistenza cremosa tipica del piatto.",
            "Versare il brodo o acqua calda necessaria a coprire, portare a ebollizione. Buttare la pasta e cuocerla direttamente nella zuppa di ceci, mescolando spesso.",
            "Servire non troppo asciutta — deve rimanere all'onda. Condire con abbondante olio crudo e pepe.",
          ],
          nota: "La pasta e ceci in Puglia si chiama in dialetto «pasta e cicer». Catone il Censore la citava come alimento dei legionari romani. Nei monasteri benedettini delle Murge è il martedì che compare — giorno ordinario, senza fronzoli.",
        },
        {
          portata: "Contorno",
          nome: "Cime di rapa ripassate in padella con aglio e peperoncino",
          tempo: "20 min",
          ingredienti: [
            { q: "600 g", nome: "cime di rapa fresche (Puglia)" },
            { q: "3 spicchi", nome: "aglio" },
            { q: "1", nome: "peperoncino fresco" },
            { q: "3 cucchiai", nome: "olio extravergine coratina" },
            { q: "q.b.", nome: "sale" },
          ],
          preparazione: [
            "Pulire le cime di rapa tenendo le parti più tenere e i fiori. Lessare in acqua salata bollente per 5 minuti. Scolare.",
            "In una padella capiente scaldare l'olio con l'aglio affettato e il peperoncino. Aggiungere le cime di rapa e ripassare a fuoco vivo per 5-7 minuti finché lucide e insaporite.",
          ],
          nota: "Le cime di rapa sono la verdura simbolo della Puglia. Meglio con le orecchiette, lo sappiamo — ma anche da sole, ripassate nell'olio coratina, sono un piatto completo e perfetto.",
        },
      ],
      lettura: {
        titolo: "Thomas à Kempis — Imitazione di Cristo, Libro I",
        rito: "Il lettore inizia dopo il Benedicite. La comunità ascolta in silenzio.",
        testo: "«Molti sanno molte cose ma hanno poca cura di se stessi. Meglio certamente è un umile contadino che serve Dio di un filosofo superbo che osserva il corso delle stelle e trascura la conoscenza di se stesso. Chi si conosce bene, si vile stima, né si diletta di lodi umane.\n\nAnche se conoscessi tutto il mondo e non avessi la carità, che cosa ti gioverebbe dinanzi a Dio, che ti giudicherà secondo le tue opere? Frena l'eccessivo desiderio di sapere, perché vi si trovano molta distrazione e molti inganni. I dotti amano sembrare tali e vuole essere chiamati savi. Molte cose vi sono che a sapere importa poco o niente all'anima.\n\nDi che serve ragionare profondamente intorno alla Trinità, se sei privo d'umiltà? Non le alte parole fanno l'uomo santo e giusto, ma la vita virtuosa lo rende caro a Dio. Preferisco sentire nel cuore la contrizione che saperla definire. Che ti giova discorrere profondamente intorno all'umiltà, se sei privo dell'umiltà? La scienza non serve, se non serve la vita.»",
        fonte: "Imitazione di Cristo, Libro I, Capp. II–III · Thomas à Kempis · 1418",
      },
    },
    cena: {
      ora: "19:00",
      oraLatina: "Hora Vesperarum",
      titolo: "Cena",
      introduzione: "Cena leggera di martedì. Le verdure dell'orto gratinate con il pecorino danno calore e soddisfazione al termine della giornata senza appesantire.",
      bevande: ["Acqua sorgiva", "Tisana di erba cedrina"],
      piatti: [
        {
          portata: "Piatto",
          nome: "Verdure pugliesi gratinate con pangrattato di Altamura e origano",
          tempo: "30 min",
          ingredienti: [
            { q: "2", nome: "zucchine dell'orto" },
            { q: "1", nome: "melanzana violetta pugliese" },
            { q: "2", nome: "pomodori maturi" },
            { q: "70 g", nome: "pangrattato di pane di Altamura" },
            { q: "30 g", nome: "pecorino pugliese grattugiato" },
            { q: "1 cucchiaio", nome: "origano del Gargano essiccato" },
            { q: "3 cucchiai", nome: "olio extravergine coratina" },
            { q: "q.b.", nome: "sale" },
          ],
          preparazione: [
            "Tagliare le verdure a fette di circa 1 cm. Disporle in una teglia oliata in strati sovrapposti.",
            "Mescolare il pangrattato con il pecorino, l'origano e 2 cucchiai d'olio. Distribuire sopra le verdure pressando leggermente.",
            "Infornare a 200°C per 25 minuti fino a doratura della crosta. Servire caldo o tiepido.",
          ],
          nota: "Il pangrattato di Altamura — fatto dal pane raffermo grattugiato — è l'ingrediente segreto della cucina pugliese. Nei monasteri non si butta niente: il pane avanzato diventa gratin, zuppe, e polpette.",
        },
        {
          portata: "Formaggio",
          nome: "Caciocavallo podolico con miele di cardo",
          tempo: "2 min",
          ingredienti: [
            { q: "80 g", nome: "caciocavallo podolico stagionato (Murge)" },
            { q: "1 cucchiaino", nome: "miele di cardo (Puglia)" },
            { q: "q.b.", nome: "pane di Altamura" },
          ],
          preparazione: [
            "Tagliare il caciocavallo a fette. Versare un filo di miele di cardo. Servire con pane.",
          ],
          nota: "Il caciocavallo podolico è prodotto dai pastori nomadi delle Murge con il latte delle vacche podoliche — razza antichissima che pascola libera. Il miele di cardo, amaro e complesso, bilancia la grassezza del formaggio.",
        },
      ],
      lettura: {
        titolo: "Salmo 22 (23) — Il Signore è il mio pastore",
        rito: "Recitato insieme a voce bassa, prima di cena.",
        testo: "«Il Signore è il mio pastore: non manco di nulla. Su pascoli erbosi mi fa riposare, ad acque tranquille mi conduce. Rinfranca l'anima mia, mi guida per il giusto cammino a motivo del suo nome. Anche se vado per una valle oscura, non temo alcun male, perché tu sei con me. Il tuo bastone e il tuo vincastro mi danno sicurezza.\n\nEgli prepara davanti a me una mensa sotto gli occhi dei miei nemici. Ungi di olio il mio capo; il mio calice trabocca. Sì, bontà e fedeltà mi saranno compagne tutti i giorni della mia vita, abiterò ancora nella casa del Signore per lunghi giorni.»",
        fonte: "Salmo 23 (22), 1–6 · Bibbia CEI",
      },
    },
  },

  // ── MERCOLEDÌ (3) ────────────────────────────────────────────────────────
  {
    nomeBreve: "Mercoledì",
    nomeLiturgico: "Feria Quarta",
    indicazioneGiorno: "Il mercoledì è giorno di penitenza nella tradizione benedettina. Il pasto è più sobrio: meno condimento, meno varietà, più silenzio. La cicoria ripassata senza olio abbondante, il pane asciutto, il corpo che impara a digiunare — sono già una forma di preghiera.",
    colazione: {
      ora: "7:00",
      oraLatina: "Hora Prima",
      titolo: "Colazione",
      introduzione: "Nel giorno penitenziale la colazione è la più sobria della settimana: solo pane e acqua. Il corpo si sveglia nel silenzio. Anche questo è orazione.",
      bevande: ["Acqua sorgiva", "Tisana di achillea (senza dolcificante)"],
      piatti: [
        {
          portata: "Pane",
          nome: "Pane di Altamura con sale — senza condimento",
          tempo: "1 min",
          ingredienti: [
            { q: "1 fetta", nome: "pane di Altamura" },
            { q: "1 pizzico", nome: "sale marino" },
          ],
          preparazione: [
            "Il pane si porta in tavola senza olio né marmellata. Mangiare in silenzio, lentamente.",
          ],
          nota: "Nella tradizione monastica benedettina il mercoledì e il venerdì sono giorni di digiuno o astinenza. La colazione sobria non è punizione: è l'esercizio del distacco dai piaceri sensibili per aprire spazio allo spirito.",
        },
      ],
      lettura: {
        titolo: "Regola di San Benedetto — Cap. IV: Gli strumenti delle buone opere",
        rito: "Una sola voce, nel silenzio del refettorio ancora buio.",
        testo: "«Anzitutto, amare il Signore Iddio con tutto il cuore, tutta l'anima e tutta la forza. Poi il prossimo come se stesso. Non uccidere. Non commettere adulterio. Non rubare. Non concupire. Non dire falsa testimonianza. Onorare tutti gli uomini. Non fare ad altri ciò che non si vuole venga fatto a sé. Rinnegarsi a se stesso per seguire Cristo. Mortificare il proprio corpo. Non amare i piaceri. Non amare la propria volontà. Questo sono gli strumenti dell'arte spirituale: se li mettiamo in pratica di giorno e di notte senza mai smettere, quando li restituiremo al Signore nel giorno del giudizio, riceveremo da Lui quella ricompensa che Egli stesso ha promesso.»",
        fonte: "Regola di San Benedetto, Cap. IV · ca. 530 d.C.",
      },
    },
    pranzo: {
      ora: "12:30",
      oraLatina: "Hora Sexta",
      titolo: "Pranzo",
      introduzione: "Giorno penitenziale. La tavola è sobria: cicoria ripassata con poca olio e pane di segale. L'assenza di abbondanza non è tristezza — è lucidità del corpo e della mente.",
      bevande: ["Acqua sorgiva (senza vino)"],
      piatti: [
        {
          portata: "Piatto unico",
          nome: "Cicoria selvatica ripassata con aglio e pane integrale",
          tempo: "25 min",
          ingredienti: [
            { q: "800 g", nome: "cicoria selvatica delle Murge" },
            { q: "2 spicchi", nome: "aglio" },
            { q: "2 cucchiai", nome: "olio extravergine coratina (ridotto, giorno penitenziale)" },
            { q: "q.b.", nome: "sale e peperoncino" },
          ],
          preparazione: [
            "Mondare e lavare la cicoria. Lessare in acqua salata bollente per 10 minuti — deve risultare ben tenera. Scolare strizzando.",
            "In una padella scaldare l'olio con l'aglio affettato. Aggiungere la cicoria e saltare a fuoco vivo per 5 minuti. Aggiustare di sale e peperoncino.",
            "Servire con pane integrale. L'olio è dimezzato rispetto ai giorni ordinari.",
          ],
          nota: "La cicoria selvatica delle Murge cresce spontanea lungo i tratturi — i percorsi dei pastori transumanti. Amara e vitale, insegna al corpo che non tutto il nutrimento deve essere dolce.",
        },
        {
          portata: "Pane",
          nome: "Pane di segale con semi di finocchio selvatico",
          tempo: "3 h",
          ingredienti: [
            { q: "300 g", nome: "farina di segale" },
            { q: "200 g", nome: "semola rimacinata di Altamura" },
            { q: "320 ml", nome: "acqua tiepida" },
            { q: "7 g", nome: "lievito secco" },
            { q: "10 g", nome: "sale" },
            { q: "1 cucchiaino", nome: "semi di finocchio selvatico" },
          ],
          preparazione: [
            "Sciogliere il lievito in acqua tiepida. Mescolare le farine con il sale e i semi di finocchio.",
            "Impastare fino a un composto omogeneo — la segale è più appiccicosa del grano. Lievitare 2 ore. Formare una pagnotta allungata e cuocere a 190°C per 40 minuti.",
          ],
          nota: "Il finocchio selvatico cresce spontaneo in tutta la Puglia. I monaci lo raccolgono dall'orto o dai campi. I suoi semi profumati arricchiscono il pane penitenziale senza renderlo lussuoso.",
        },
      ],
      lettura: {
        titolo: "Regola di San Benedetto — Cap. XLIX: L'osservanza quaresimale",
        rito: "Lettura tenuta in tono sommesso, come si conviene al giorno penitenziale.",
        testo: "«La vita del monaco dovrebbe sempre avere un carattere quaresimale. Tuttavia, poiché pochi posseggono questa virtù, esortiamo tutti in questi giorni santi a conservare la purezza della vita e a lavare, in questo tempo sacro, le negligenze di altri tempi.\n\nCiò si fa degnamente se ci asteniamo da ogni vizio e ci dedichiamo alla preghiera con le lacrime, alla lettura, alla compunzione del cuore e all'astinenza. Durante questi giorni dunque aggiungiamo qualcosa all'usuale prestazione di servizio: preghiere particolari, astinenza da cibo e bevande, in modo che ciascuno, al di là della porzione che gli è assegnata, offra a Dio di sua iniziativa qualcosa del suo libero arbitrio, con la gioia dello Spirito Santo.\n\nSi dica però all'abate quello che si offre, e si faccia con la sua benedizione e approvazione. Perché ciò che si fa senza il permesso del padre spirituale sarà attribuito a presunzione e vanagloria, non a merito. Tutto dunque si faccia col consenso dell'abate.»",
        fonte: "Regola di San Benedetto, Cap. XLIX · ca. 530 d.C.",
      },
    },
    cena: {
      ora: "19:00",
      oraLatina: "Hora Vesperarum",
      titolo: "Cena",
      introduzione: "Cena ridotta nel giorno penitenziale. Il corpo ha già ricevuto ciò di cui aveva bisogno a pranzo. Uova e pane avanzato — non si prepara nulla di nuovo.",
      bevande: ["Acqua sorgiva", "Tisana di achillea e menta"],
      piatti: [
        {
          portata: "Piatto",
          nome: "Uova sode con erbe selvatiche delle Murge e pane di segale",
          tempo: "12 min",
          ingredienti: [
            { q: "2", nome: "uova fresche per persona" },
            { q: "q.b.", nome: "prezzemolo, erba cipollina, cerfoglio freschi tritati" },
            { q: "q.b.", nome: "sale grosso marino di Margherita" },
            { q: "q.b.", nome: "pane di segale avanzato dal pranzo" },
          ],
          preparazione: [
            "Cuocere le uova in acqua bollente per 9 minuti esatti. Raffreddarle sotto acqua corrente e sgusciarle con cura.",
            "Cospargere di erbe tritate e sale grosso. Servire con il pane di segale avanzato dal pranzo. Non si prepara nulla di nuovo.",
          ],
          nota: "Nel giorno penitenziale la cena usa solo ciò che rimane. Il risparmio è virtù monastica: niente va sprecato in un monastero, né il pane né il tempo.",
        },
        {
          portata: "Tisana",
          nome: "Tisana di achillea e menta del chiostro",
          tempo: "5 min",
          ingredienti: [
            { q: "1 cucchiaino", nome: "achillea essiccata (dall'orto del chiostro)" },
            { q: "1 cucchiaino", nome: "menta fresca o essiccata" },
            { q: "250 ml", nome: "acqua bollente" },
          ],
          preparazione: [
            "Versare l'acqua bollente sulle erbe. Coprire con un piattino e lasciare in infusione 7 minuti. Filtrare e bere calda, lentamente.",
          ],
          nota: "L'achillea — detta anche erba militare — cresce selvatica sulle Murge. I monaci la raccolgono in estate e la essiccano per l'inverno. Ha azione digestiva e calmante: ideale al termine di una giornata penitenziale.",
        },
      ],
      lettura: {
        titolo: "Salmo 50 (51) — Miserere",
        rito: "Recitato in silenzio, ognuno nel proprio cuore, prima di sedersi a cena.",
        testo: "«Pietà di me, o Dio, nel tuo amore; nella tua grande misericordia cancella il mio peccato. Lavami da tutte le mie colpe, mondami dal mio peccato. Riconosco la mia colpa, il mio peccato mi sta sempre dinanzi.\n\nCrea in me, o Dio, un cuore puro, rinnova in me uno spirito saldo. Non scacciarmi dalla tua presenza e non togliermi il tuo santo spirito. Rendimi la gioia della tua salvezza, sostienimi con uno spirito generoso. Insegnerò agli erranti le tue vie e i peccatori a te ritorneranno.\n\nSignore, apri le mie labbra e la mia bocca proclami la tua lode. Tu non gradisci il sacrificio; se offro olocausti, non li accetti. Uno spirito contrito è sacrificio a Dio; un cuore contrito e affranto tu, o Dio, non disprezzi.»",
        fonte: "Salmo 51 (50) · Bibbia CEI",
      },
    },
  },

  // ── GIOVEDÌ (4) ──────────────────────────────────────────────────────────
  {
    nomeBreve: "Giovedì",
    nomeLiturgico: "Feria Quinta",
    indicazioneGiorno: "Il giovedì è un giorno ordinario ma dignitoso. Non c'è la sobrietà penitenziale del mercoledì né la festività della domenica — è il ritmo autentico della vita monastica nel suo procedere fedele. La terra delle Murge dà il suo meglio in questo equilibrio.",
    colazione: {
      ora: "7:00",
      oraLatina: "Hora Prima",
      titolo: "Colazione",
      introduzione: "Il giovedì si può gustare la ricotta fresca dell'abbazia — quando il monaco che accudisce le pecore l'ha preparata il giorno prima. Con un filo di miele, è sufficiente per la mattinata.",
      bevande: ["Orzo tostato", "Acqua sorgiva"],
      piatti: [
        {
          portata: "Latticino",
          nome: "Ricotta di pecora fresca dell'abbazia con miele di cardo",
          tempo: "2 min",
          ingredienti: [
            { q: "80 g", nome: "ricotta di pecora fresca (prodotta in abbazia)" },
            { q: "1 cucchiaino", nome: "miele di cardo (Puglia)" },
          ],
          preparazione: [
            "Servire la ricotta fresca in una ciotola. Versare il miele sopra. Accompagnare con pane di Altamura.",
          ],
          nota: "Le pecore podoliche delle Murge producono un latte ricchissimo. La ricotta ottenuta dal loro siero è morbida, dolce, profumata. Il miele di cardo — leggermente amaro — la bilancia perfettamente.",
        },
        {
          portata: "Pane",
          nome: "Pane di Altamura con olio",
          tempo: "2 min",
          ingredienti: [
            { q: "2 fette", nome: "pane di Altamura" },
            { q: "1 cucchiaio", nome: "olio extravergine coratina" },
          ],
          preparazione: ["Versare l'olio sul pane. Servire con la ricotta."],
        },
      ],
      lettura: {
        titolo: "Detti dei Padri del Deserto — Abba Mosè",
        rito: "Il più anziano della comunità legge a bassa voce.",
        testo: "«Un fratello andò da Abba Mosè per chiedergli una parola. Il vecchio gli disse: Va, siedi nella tua cella e la tua cella ti insegnerà tutto. Perché il monaco che rimane nella sua cella impara tre cose: la pazienza, la conoscenza di sé e la preghiera. Ma il monaco che esce senza necessità perde tutte e tre nello stesso momento.»",
        fonte: "Apophthegmata Patrum — Abba Mosè, 6 · IV-V sec.",
      },
    },
    pranzo: {
      ora: "12:30",
      oraLatina: "Hora Sexta",
      titolo: "Pranzo",
      introduzione: "I troccoli — la pasta tradizionale della Daunia pugliese — con il sugo di pomodoro fresco e i lampascioni in agrodolce: due sapori che raccontano la Puglia profonda, quella dei tratturi e delle masserie.",
      bevande: ["Acqua sorgiva delle Murge"],
      piatti: [
        {
          portata: "Primo",
          nome: "Troccoli al pomodoro fresco di Torre Guaceto e basilico",
          tempo: "30 min",
          ingredienti: [
            { q: "400 g", nome: "troccoli di semola (pasta quadrata tipica della Daunia)" },
            { q: "700 g", nome: "pomodori fiaschetto di Torre Guaceto maturi" },
            { q: "4 spicchi", nome: "aglio" },
            { q: "1 mazzo abbondante", nome: "basilico fresco" },
            { q: "5 cucchiai", nome: "olio extravergine coratina" },
            { q: "q.b.", nome: "sale marino e peperoncino" },
          ],
          preparazione: [
            "Scottare i pomodori in acqua bollente per 30 secondi, pelarli e tritarli grossolanamente a coltello — non frullare. Il sugo deve conservare la texture.",
            "In una padella capiente scaldare l'olio con l'aglio schiacciato. Aggiungere i pomodori e cuocere a fuoco vivo per 15 minuti finché il sugo si addensa. Aggiustare di sale.",
            "Cuocere i troccoli in abbondante acqua salata bollente al dente. Scolare conservando un mestolo di acqua di cottura. Saltare nel sugo con qualche foglia di basilico e l'acqua di cottura se necessario.",
            "Servire con le restanti foglie di basilico strappate a mano e un filo d'olio crudo.",
          ],
          nota: "I troccoli si fanno con il troccolaturo — un mattarello rigato che incide la sfoglia in spaghetti quadrati. Nelle cucine monastiche della Capitanata erano lo strumento del giovedì.",
        },
        {
          portata: "Contorno",
          nome: "Lampascioni in agrodolce all'aceto di vino rosso",
          tempo: "45 min",
          ingredienti: [
            { q: "400 g", nome: "lampascioni (cipollaccio col fiocco, tipico delle Murge)" },
            { q: "3 cucchiai", nome: "olio extravergine coratina" },
            { q: "2 cucchiai", nome: "aceto di vino rosso" },
            { q: "1 cucchiaio", nome: "zucchero di canna" },
            { q: "q.b.", nome: "sale" },
          ],
          preparazione: [
            "Lessare i lampascioni in acqua bollente per 20 minuti per attenuarne l'amarezza. Scolare e asciugare.",
            "In una padella rosolare nell'olio per 10 minuti. Sfumare con l'aceto, aggiungere lo zucchero e una presa di sale. Cuocere ancora 5 minuti mescolando. Servire tiepidi o a temperatura ambiente.",
          ],
          nota: "I lampascioni — il bulbo selvatico del muscari comoso — crescono spontanei nelle Murge. Amari e aromatici, sono l'ingrediente più antico e identitario della cucina rurale pugliese. I monaci li raccolgono in inverno tra le pietre dei muretti a secco.",
        },
      ],
      lettura: {
        titolo: "Gregorio Magno — Vita di San Benedetto, Libro II",
        rito: "Il lettore proclama. I fratelli ascoltano tenendo le mani sul tavolo.",
        testo: "«Benedetto, uomo di Dio, sin dall'infanzia ebbe il cuore di un vecchio. Per età era fanciullo, ma per i costumi aveva già un'anima matura. Lasciato il mondo con tutti i suoi piaceri, cercò di piacere unicamente a Dio. Cercò un luogo dove la sua vita religiosa non fosse disturbata: trovò una grotta a Subiaco, e là cominciò a costruire la sua anima.\n\nVisse tre anni nascosto a quasi tutti gli uomini, ignorato ad eccezione di Romanus, il monaco che di tanto in tanto gli portava il pane. Ma Dio aveva altri progetti: poiché la luce non può restare nascosta sotto il moggio, la santità di Benedetto cominciò a manifestarsi, e uomini cominciarono a venire da lui da ogni parte.\n\nQuel che caratterizzava Benedetto non erano i miracoli — anche se ne compì — ma la continua compunzione del cuore. Egli stava sempre davanti agli occhi di Dio come un uomo che sa di essere visto. Questa consapevolezza dello sguardo divino è tutto il segreto della vita monastica, e tutto il segreto della Regola che egli scrisse per noi.»",
        fonte: "Vita di San Benedetto, Libro II, Cap. 1-3 · Gregorio Magno · 594 d.C.",
      },
    },
    cena: {
      ora: "19:00",
      oraLatina: "Hora Vesperarum",
      titolo: "Cena",
      introduzione: "Un minestrone caldo di verdure di stagione chiude la giornata di giovedì. Il calore del brodo è anche il calore della comunità riunita dopo le Compiete.",
      bevande: ["Acqua sorgiva", "Tisana di erba cedrina e menta"],
      piatti: [
        {
          portata: "Zuppa",
          nome: "Minestrone delle Murge con pasta di farro e verdure dell'orto",
          tempo: "35 min",
          ingredienti: [
            { q: "1", nome: "patata delle Murge" },
            { q: "1", nome: "zucchina dell'orto" },
            { q: "1", nome: "pomodoro maturo" },
            { q: "1 gambo", nome: "sedano" },
            { q: "1", nome: "carota" },
            { q: "100 g", nome: "pasta di farro o pasta di semola spezzata" },
            { q: "1 l", nome: "brodo vegetale" },
            { q: "2 cucchiai", nome: "olio extravergine coratina" },
            { q: "q.b.", nome: "basilico fresco e sale" },
          ],
          preparazione: [
            "Tagliare tutte le verdure a dadini piccoli. Soffriggere nell'olio per 5 minuti mescolando.",
            "Versare il brodo caldo. Cuocere 20 minuti a fuoco medio finché le verdure siano morbide.",
            "Aggiungere la pasta e cuocere secondo le indicazioni. Spegnere e aggiungere le foglie di basilico spezzate a mano. Servire con olio crudo.",
          ],
        },
        {
          portata: "Pane",
          nome: "Pane di Altamura raffermo con olio",
          tempo: "1 min",
          ingredienti: [
            { q: "1 fetta", nome: "pane di Altamura raffermo" },
            { q: "1 cucchiaio", nome: "olio extravergine coratina" },
          ],
          preparazione: ["Il pane raffermo si può ammollare nel brodo del minestrone — diventa ancora più buono."],
          nota: "In molte cucine pugliesi il pane raffermo finisce nel brodo della zuppa: si chiama pancotto, ed è uno dei piatti poveri più antichi e nutrienti della tradizione contadina.",
        },
      ],
      lettura: {
        titolo: "Romano Guardini — Lo Spirito della Liturgia",
        rito: "Lettura meditativa. Nessuna fretta.",
        testo: "«La liturgia non ha uno scopo esterno — essa è fine a se stessa. Non è uno strumento per raggiungere qualcos'altro: non è catechesi, non è organizzazione, non è propaganda. Come il gioco del bambino e l'opera dell'artista, esiste in sé e per sé. È la vita dell'anima nella sua forma più alta, ed è per questo che può essere anche la forma più alta del riposo.\n\nIn questo senso la liturgia è profondamente affine al gioco. Il bambino che gioca non ha uno scopo fuori del gioco. Costruisce torri e le abbatte, percorre sentieri che non portano da nessuna parte, canta canzoni che non dicono nulla di utile — eppure in questo fare senza scopo egli è pienamente vivo, pienamente presente. Così l'anima che prega nella liturgia: costruisce, canta, si muove — e in questo fare non mira a nulla fuori del fare stesso. Mira a Dio. E Dio è il Non-scopo per eccellenza — l'unica fine che non è mezzo.»",
        fonte: "Lo Spirito della Liturgia · Romano Guardini · 1918",
      },
    },
  },

  // ── VENERDÌ (5) ──────────────────────────────────────────────────────────
  {
    nomeBreve: "Venerdì",
    nomeLiturgico: "Feria Sexta",
    indicazioneGiorno: "Il venerdì è giorno di astinenza dalla carne in memoria della Passione di Cristo. Dal mare di Taranto arriva il pesce fresco — le alici, il polpo, la spigola. Il corpo porta il segno della Croce anche attraverso ciò che mangia o non mangia.",
    colazione: {
      ora: "7:00",
      oraLatina: "Hora Prima",
      titolo: "Colazione",
      introduzione: "Venerdì. La colazione è sobria come il mercoledì. Il corpo inizia il giorno nella memoria della Passione. Solo pane e acqua benedetta.",
      bevande: ["Acqua sorgiva", "Tisana di camomilla (senza dolcificante)"],
      piatti: [
        {
          portata: "Pane",
          nome: "Pane di Altamura con sale — digiuno parziale",
          tempo: "1 min",
          ingredienti: [
            { q: "1 fetta", nome: "pane di Altamura" },
            { q: "1 pizzico", nome: "sale marino" },
          ],
          preparazione: [
            "Portare in tavola in silenzio. Il venerdì mattina si mangia in silenzio assoluto.",
          ],
          nota: "Nei monasteri benedettini il venerdì mattina spesso si salta la colazione o ci si limita a un sorso d'acqua. L'Abbazia della Scala di Noci mantiene la colazione sobria come atto di pietà, non di penitenza formale.",
        },
      ],
      lettura: {
        titolo: "Dal Vangelo di Giovanni — Gesù nel Getsemani",
        rito: "Letto in piedi, in silenzio, prima di portare il pane in tavola.",
        testo: "«Padre, se vuoi, allontana da me questo calice! Tuttavia non sia fatta la mia, ma la tua volontà. Gli apparve allora un angelo dal cielo per confortarlo. In preda all'angoscia, pregava più intensamente, e il suo sudore diventò come gocce di sangue che cadevano a terra. Poi, rialzatosi dalla preghiera, andò dai discepoli e li trovò che dormivano per la tristezza. E disse loro: Perché dormite? Alzatevi e pregate, per non entrare in tentazione.»",
        fonte: "Vangelo di Luca 22, 42-46 · Bibbia CEI",
      },
    },
    pranzo: {
      ora: "12:30",
      oraLatina: "Hora Sexta",
      titolo: "Pranzo",
      introduzione: "Giorno di astinenza dalla carne. Dal Canale di Taranto le alici del giorno — fresche, argentate — cuociono nel pomodoro e nei capperi. Il pesce umile è il pesce del venerdì.",
      bevande: ["Acqua sorgiva (senza vino il venerdì)"],
      piatti: [
        {
          portata: "Piatto unico",
          nome: "Alici di Taranto in tegame con pomodoro, capperi e olive",
          tempo: "25 min",
          ingredienti: [
            { q: "600 g", nome: "alici fresche del Canale di Taranto, pulite" },
            { q: "400 g", nome: "pomodori fiaschetto pelati" },
            { q: "2 cucchiai", nome: "capperi di Puglia sotto sale, dissalati" },
            { q: "100 g", nome: "olive baresane in salamoia, denocciolate" },
            { q: "3 spicchi", nome: "aglio" },
            { q: "1 mazzo", nome: "prezzemolo fresco" },
            { q: "4 cucchiai", nome: "olio extravergine coratina" },
            { q: "q.b.", nome: "peperoncino e sale" },
          ],
          preparazione: [
            "In una padella larga scaldare l'olio con l'aglio affettato e il peperoncino. Aggiungere i pomodori pelati schiacciati con la mano. Cuocere 8 minuti.",
            "Aggiungere capperi e olive. Disporre le alici pulite nel tegame in un solo strato. Non mescolare: cuocere coperto a fuoco basso per 8-10 minuti. Le alici non devono disfarsi.",
            "Cospargere di prezzemolo fresco tritato. Servire con crostini di pane di Altamura sfregati con aglio.",
          ],
          nota: "Taranto è a meno di 60 km dall'abbazia. Le alici del Mar Piccolo di Taranto sono tra le più pregiate del Mediterraneo — grasse, carnose, profumate. Nel venerdì monastico sono il pesce della misericordia.",
        },
        {
          portata: "Pane",
          nome: "Crostini di Altamura sfregati con aglio e olio",
          tempo: "5 min",
          ingredienti: [
            { q: "4 fette", nome: "pane di Altamura tostato" },
            { q: "1 spicchio", nome: "aglio" },
            { q: "2 cucchiai", nome: "olio extravergine coratina" },
          ],
          preparazione: [
            "Tostare le fette di Altamura sulla griglia o in forno finché dorate. Sfregare immediatamente con l'aglio tagliato. Versare un filo d'olio abbondante.",
          ],
          nota: "La frisella — il pane biscottato pugliese — è la versione tradizionale di questo crostino. In abbazia si usa il pane di Altamura raffermo che, tostato, ha la stessa funzione.",
        },
      ],
      lettura: {
        titolo: "Meditazione della Via Crucis — Tradizione monastica",
        rito: "Il venerdì, prima del pranzo, si legge in piedi dalla meditazione della Passione.",
        testo: "«La Croce non è la sconfitta di Dio: è il modo di Dio di vincere. Non vince con la potenza, ma con l'amore. Non annienta il nemico, ma lo abbraccia. Il Monaco guarda la Croce ogni venerdì non per rattristarsi, ma per capire. Capire che la sofferenza accettata per amore diventa redenzione. Capire che il corpo mortificato dal digiuno non è umiliato, ma liberato. Capire che la fame di questo giorno è una piccola partecipazione alla grande fame di Cristo sulla Croce: quella fame di amare e non essere amato, quella sete che nessuna spugna di aceto potrà mai spegnere.\n\nPorta la tua croce — diceva Benedetto ai suoi monaci — non come peso inutile, ma come strumento di lavoro. La Croce lavora in noi, trasforma in noi ciò che non possiamo trasformare da soli. Ogni venerdì, a tavola, questo pane e questo pesce sono il corpo e l'anima che imparano la Passione.»",
        fonte: "Meditazione della Via Crucis · Tradizione monastica benedettina",
      },
    },
    cena: {
      ora: "19:00",
      oraLatina: "Hora Vesperarum",
      titolo: "Cena",
      introduzione: "Il venerdì sera la cena è ridotta al minimo. Il corpo rende onore alla Passione anche con il suo silenzio e la sua frugalità.",
      bevande: ["Acqua sorgiva", "Tisana di camomilla"],
      piatti: [
        {
          portata: "Piatto",
          nome: "Uova in camicia su letto di cicoria ripassata",
          tempo: "15 min",
          ingredienti: [
            { q: "2", nome: "uova freschissime per persona" },
            { q: "300 g", nome: "cicoria lessata e ripassata (avanzata dal pranzo)" },
            { q: "1 cucchiaio", nome: "aceto di vino bianco (per la cottura delle uova)" },
            { q: "1 cucchiaio", nome: "olio extravergine coratina" },
            { q: "q.b.", nome: "sale e pepe nero" },
          ],
          preparazione: [
            "Scaldare la cicoria avanzata in padella con un filo d'olio. Disporla calda nel piatto.",
            "Portare a fremito una pentola di acqua leggermente acidulata con l'aceto. Rompere le uova una alla volta in una ciotolina e scivolarle delicatamente nell'acqua. Cuocere 3 minuti: il bianco rappreso, il tuorlo ancora morbido.",
            "Disporre le uova sulla cicoria. Pepe macinato al momento e un filo sottile d'olio crudo.",
          ],
          nota: "Il bianco dell'uovo rappreso ricorda il sudario. È un piatto che nei monasteri ha qualcosa di simbolico nel giorno del venerdì: la vita che emerge dalla morte, il tuorlo caldo dentro il bianco freddo.",
        },
      ],
      lettura: {
        titolo: "Passione secondo Giovanni — Consummatum est",
        rito: "Una sola lettura, breve, prima della cena. Poi silenzio per tutta la durata del pasto.",
        testo: "«Dopo questo, sapendo Gesù che ormai tutto era compiuto, affinché si adempisse la Scrittura, disse: \u201cHo sete.\u201d Vi era lì un vaso pieno di aceto; posero dunque una spugna imbevuta di aceto in cima a un ramo di issopo e gliela accostarono alla bocca. Dopo aver preso l'aceto, Gesù disse: \u201cÈ compiuto!\u201d E, chinato il capo, consegnò lo spirito.\n\nEra il giorno della Parasceve e i Giudei, perché i corpi non rimanessero in croce durante il sabato — era infatti un sabato solenne — avevano chiesto a Pilato che fossero spezzate loro le gambe e fossero portati via. Vennero dunque i soldati e spezzarono le gambe al primo e poi all'altro che era stato crocifisso insieme con lui. Venuti però da Gesù, vedendo che era già morto, non gli spezzarono le gambe. Uno dei soldati tuttavia gli trafisse il fianco con una lancia e subito ne uscì sangue e acqua.»",
        fonte: "Vangelo di Giovanni 19, 28-34 · Bibbia CEI",
      },
    },
  },

  // ── SABATO (6) ───────────────────────────────────────────────────────────
  {
    nomeBreve: "Sabato",
    nomeLiturgico: "Sabbatum",
    indicazioneGiorno: "Il sabato è dedicato alla Vergine Maria nella tradizione benedettina. Si canta il Salve Regina ai Vespri. Il refettorio è sereno — già si respira l'attesa della domenica. I sapori del sabato sono le orecchiette con le cime di rapa: il piatto più pugliese di tutti.",
    colazione: {
      ora: "7:00",
      oraLatina: "Hora Prima",
      titolo: "Colazione",
      introduzione: "La colazione del sabato è più curata del solito: si avvicina il giorno del Signore. La scamorza affumicata con il pane e un po' di miele — semplicità festiva.",
      bevande: ["Orzo tostato", "Acqua sorgiva delle Murge"],
      piatti: [
        {
          portata: "Formaggio",
          nome: "Scamorza affumicata delle Murge con miele di zagara",
          tempo: "3 min",
          ingredienti: [
            { q: "80 g", nome: "scamorza affumicata (produzione locale delle Murge)" },
            { q: "1 cucchiaino", nome: "miele di zagara" },
            { q: "2 fette", nome: "pane di Altamura" },
          ],
          preparazione: [
            "Tagliare la scamorza a fette. Servire con il miele e il pane.",
          ],
          nota: "La scamorza affumicata è il formaggio del sabato mattina nelle masserie delle Murge. Si affumica con la paglia di grano — il profumo è inconfondibile.",
        },
        {
          portata: "Frutta",
          nome: "Fichi d'India o uva di Puglia",
          tempo: "2 min",
          ingredienti: [
            { q: "2-3", nome: "fichi d'India pelati (settembre-ottobre) o uva Italia" },
          ],
          preparazione: ["Servire freddi di frigorifero. Il contrasto con la scamorza calda è piacevole."],
        },
      ],
      lettura: {
        titolo: "Inno Ave Maris Stella — strofa prima",
        rito: "Il sabato mattina, prima di iniziare la colazione, si intona o si recita l'Ave Maris Stella.",
        testo: "«Ave, o stella del mare, alma Madre di Dio, sempre Vergine Maria, porta beata del cielo. Tu che prendesti l'Ave dall'angelo Gabriele, confermaci nella pace, trasformando il nome di Eva. Scioglici le catene dei prigionieri, porta la luce ai ciechi, allontana i nostri mali, ottienici tutti i beni. Mostra di essere madre, e per te colui che nacque per noi tuo figlio accolga le nostre preghiere.»",
        fonte: "Ave Maris Stella · Inno latino del IX sec. · Tradizione benedettina",
      },
    },
    pranzo: {
      ora: "12:30",
      oraLatina: "Hora Sexta",
      titolo: "Pranzo",
      introduzione: "Orecchiette con le cime di rapa: il piatto identitario della Puglia, il piatto del sabato per eccellenza. Le orecchiette si fanno a mano nel refettorio il venerdì sera — cuocerle il giorno dopo è il gesto più pugliese che esista.",
      bevande: ["Acqua sorgiva delle Murge"],
      piatti: [
        {
          portata: "Primo",
          nome: "Orecchiette fresche con cime di rapa, alici e mollica croccante",
          tempo: "40 min (+ preparazione pasta il giorno prima)",
          ingredienti: [
            { q: "400 g", nome: "orecchiette fresche di semola (fatte a mano in abbazia)" },
            { q: "800 g", nome: "cime di rapa fresche" },
            { q: "6", nome: "filetti di alici sott'olio (o salate e dissalate)" },
            { q: "60 g", nome: "mollica di pane di Altamura raffermo" },
            { q: "4 spicchi", nome: "aglio" },
            { q: "1", nome: "peperoncino fresco" },
            { q: "5 cucchiai", nome: "olio extravergine coratina" },
            { q: "q.b.", nome: "sale" },
          ],
          preparazione: [
            "Pulire le cime di rapa tenendo le parti più tenere con i fiori gialli. Nella stessa acqua salata cuocere prima le cime di rapa per 5 minuti, poi aggiungere le orecchiette e cuocere insieme fino al dente — il metodo tradizionale prevede la cottura congiunta.",
            "In una padella capiente scaldare 4 cucchiai d'olio con l'aglio affettato, il peperoncino e i filetti di alici. Mescolare fino a che le alici si sciolgono completamente nell'olio — diventano il condimento.",
            "In una padellina separata tostare la mollica sbriciolata con un cucchiaio d'olio fino a doratura — diventerà croccante come il pangrattato.",
            "Scolare pasta e verdure conservando abbondante acqua di cottura. Saltare tutto nella padella con le alici aggiungendo acqua di cottura. Impiattare e completare con la mollica croccante sopra.",
          ],
          nota: "Le orecchiette si fanno trascinando il pollice sul marmo. Ogni monaco e ogni contadina pugliese ha il proprio ritmo, la propria pressione, la propria velocità — è un gesto che si apprende e non si dimentica. Le alici nell'olio si dissolvono diventando il condimento invisibile ma essenziale.",
        },
        {
          portata: "Contorno",
          nome: "Melagrana di Puglia e mandorle di Toritto tostate",
          tempo: "5 min",
          ingredienti: [
            { q: "1", nome: "melagrana matura per due persone" },
            { q: "1 manciata", nome: "mandorle di Toritto DOP, tostate" },
          ],
          preparazione: [
            "Aprire la melagrana e sgranare i chicchi rossi in una ciotola. Distribuire con le mandorle.",
          ],
          nota: "La melagrana — simbolo mariano — si porta in tavola il sabato. I suoi chicchi color rubino nella ciotola bianca sono già un'icona.",
        },
      ],
      lettura: {
        titolo: "Inno Akathistos alla Madre di Dio — Prologo e strofe I-III",
        rito: "Il sabato si leggono testi mariani. Il lettore inclina il capo alla fine di ogni strofa.",
        testo: "«A te, condottiera trionfante, innalziamo noi tuoi servi, o Madre di Dio, inni di vittoria e di ringraziamento, noi che siamo stati liberati dai mali. Ma tu che hai un potere invincibile, liberaci da ogni pericolo, affinché possiamo gridare a te: Gioisci, Sposa inviolata.\n\nUn angelo di rango eccelso fu mandato dal cielo per dire alla Madre di Dio: Gioisci! E insieme con la sua voce incorporea vedendoti, o Signore, prendere corpo, rimase stupito ed esclamò: Gioisci, o tu per cui la gioia brillerà; Gioisci, o tu per cui la maledizione scomparirà; Gioisci, o redenzione del pianto di Adamo; Gioisci, o liberazione delle lacrime di Eva.\n\nSapendo la Vergine santa di essere casta, disse con franchezza a Gabriele: La tua voce stranissima sembra difficile da accettare per la mia anima. Come puoi parlarmi di nascita da concepimento senza seme? Gridando: Alleluia!»",
        fonte: "Inno Akathistos, Prologo e Ikoi I-III · Tradizione greco-bizantina · V sec.",
      },
    },
    cena: {
      ora: "19:00",
      oraLatina: "Hora Vesperarum",
      titolo: "Cena",
      introduzione: "Sabato sera: il Salve Regina risuona ancora nell'aria del chiostro. La cena è quieta e dolce. Le frittelle di ricotta con il miele chiudono la settimana con un gesto di consolazione.",
      bevande: ["Acqua sorgiva", "Tisana di tiglio e melissa"],
      piatti: [
        {
          portata: "Piatto",
          nome: "Frittelle di ricotta di pecora con miele di zagara",
          tempo: "25 min",
          ingredienti: [
            { q: "300 g", nome: "ricotta di pecora fresca (produzione locale)" },
            { q: "2", nome: "uova" },
            { q: "3 cucchiai", nome: "semola rimacinata di Altamura" },
            { q: "1 pizzico", nome: "sale" },
            { q: "1 scorza", nome: "limone del Gargano grattugiata" },
            { q: "q.b.", nome: "olio extravergine per friggere (o cuocere in padella)" },
            { q: "q.b.", nome: "miele di zagara per servire" },
          ],
          preparazione: [
            "Mescolare la ricotta con le uova, la semola, il sale e la scorza di limone fino a un composto omogeneo e compatto.",
            "Formare piccole palline o dischi con le mani bagnate. Cuocere in padella con un filo d'olio a fuoco medio, 3-4 minuti per lato, fino a doratura.",
            "Servire calde con il miele di zagara versato sopra al momento.",
          ],
          nota: "Le frittelle di ricotta — dette anche «pittule di ricotta» in dialetto — sono il dolce senza eccesso della tradizione monastica pugliese. La ricotta di pecora delle Murge, morbida e profumata, non ha bisogno di zucchero: il miele basta.",
        },
        {
          portata: "Tisana",
          nome: "Tisana di tiglio e melissa del chiostro",
          tempo: "7 min",
          ingredienti: [
            { q: "1 cucchiaino", nome: "fiori di tiglio essiccati" },
            { q: "1 cucchiaino", nome: "melissa essiccata" },
            { q: "250 ml", nome: "acqua bollente" },
            { q: "q.b.", nome: "miele di zagara (facoltativo)" },
          ],
          preparazione: [
            "Versare l'acqua bollente sulle erbe. Coprire con un piattino e lasciare in infusione 7 minuti. Filtrare lentamente. Addolcire con un filo di miele se gradito.",
          ],
          nota: "Il tiglio e la melissa insieme preparano al sonno e alla preghiera notturna. Le Compiete si cantano tra poco: questa tisana è il confine tra il giorno e la notte.",
        },
      ],
      lettura: {
        titolo: "Salve Regina — Antifona Mariana",
        rito: "Cantata o recitata in piedi, l'intera comunità riunita, al termine della cena del sabato.",
        testo: "«Salve, Regina, Madre di misericordia, vita, dolcezza e speranza nostra, salve. A te ricorriamo, esuli figli di Eva; a te sospiriamo, gementi e piangenti in questa valle di lacrime. Orsù dunque, avvocata nostra, rivolgi a noi gli occhi tuoi misericordiosi. E mostraci, dopo questo esilio, Gesù, il frutto benedetto del tuo seno. O clemente, o pia, o dolce Vergine Maria.»",
        fonte: "Salve Regina · Attribuita a Ermanno di Reichenau · XI sec. · Recitata ogni sera ai Vespri benedettini",
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
