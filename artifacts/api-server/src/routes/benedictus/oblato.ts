import { Router } from "express";
import { db } from "@workspace/db";
import {
  bOblatoProfileTable,
  bOfficiumCheckInTable,
  bSigilliTable,
  bCapitoliTable,
  bLibroCuoreTable,
} from "@workspace/db";
import { getBAuthUser } from "./auth";
import { eq, and, desc } from "drizzle-orm";

const router = Router();

// ── Gradi oblato ────────────────────────────────────────────────────────────

const GRADI = [
  { grado: 1, nome: "Curioso", xpMin: 0, xpMax: 99 },
  { grado: 2, nome: "Postulante", xpMin: 100, xpMax: 299 },
  { grado: 3, nome: "Novizio", xpMin: 300, xpMax: 699 },
  { grado: 4, nome: "Monaco", xpMin: 700, xpMax: 1499 },
  { grado: 5, nome: "Professo", xpMin: 1500, xpMax: 2999 },
  { grado: 6, nome: "Anziano", xpMin: 3000, xpMax: 5999 },
  { grado: 7, nome: "Abate", xpMin: 6000, xpMax: Infinity },
];

function gradoPerXp(xp: number) {
  return GRADI.find((g) => xp >= g.xpMin && xp <= g.xpMax) ?? GRADI[0];
}

function xpAlProssimo(xp: number): number {
  const g = gradoPerXp(xp);
  if (g.xpMax === Infinity) return 0;
  return g.xpMax + 1 - xp;
}

// ── XII Gradi dell'Umiltà ───────────────────────────────────────────────────

interface GradoUmilta {
  bit: number;
  sigilloId: string;
  nome: string;
  descrizione: string;
  icona: string;
  xpValore: number;
  check: (p: typeof bOblatoProfileTable.$inferSelect) => boolean;
}

const GRADI_UMILTA: GradoUmilta[] = [
  {
    bit: 0,
    sigilloId: "umilta_1",
    nome: "I Grado: Il Timore",
    descrizione: "Hai completato il tuo primo check-in all'Officium.",
    icona: "🕯️",
    xpValore: 50,
    check: (p) => p.checkInTotali >= 1,
  },
  {
    bit: 1,
    sigilloId: "umilta_2",
    nome: "II Grado: Il Volere",
    descrizione: "Hai ignorato la tua volontà per 3 giorni di fila (streak 3).",
    icona: "🌿",
    xpValore: 75,
    check: (p) => p.streakCorrente >= 3 || p.streakMassimo >= 3,
  },
  {
    bit: 2,
    sigilloId: "umilta_3",
    nome: "III Grado: L'Obbedienza",
    descrizione: "Hai letto 3 Lectio e completato il tuo primo capitolo.",
    icona: "📜",
    xpValore: 100,
    check: (p) => p.lectioCompletate >= 3 && p.capitoliLetti >= 1,
  },
  {
    bit: 3,
    sigilloId: "umilta_4",
    nome: "IV Grado: La Pazienza",
    descrizione: "Hai mantenuto una streak di 7 giorni.",
    icona: "⌛",
    xpValore: 150,
    check: (p) => p.streakMassimo >= 7,
  },
  {
    bit: 4,
    sigilloId: "umilta_5",
    nome: "V Grado: La Confessione",
    descrizione: "Hai scritto 5 voci nel tuo Libro del Cuore.",
    icona: "✍️",
    xpValore: 150,
    check: (p) => p.esamiCompletati >= 5,
  },
  {
    bit: 5,
    sigilloId: "umilta_6",
    nome: "VI Grado: Il Contentarsi",
    descrizione: "Hai tenuto 30 check-in nell'Officium.",
    icona: "🙏",
    xpValore: 200,
    check: (p) => p.checkInTotali >= 30,
  },
  {
    bit: 6,
    sigilloId: "umilta_7",
    nome: "VII Grado: L'Infimo",
    descrizione: "Hai raggiunto una streak di 14 giorni.",
    icona: "🌑",
    xpValore: 200,
    check: (p) => p.streakMassimo >= 14,
  },
  {
    bit: 7,
    sigilloId: "umilta_8",
    nome: "VIII Grado: La Regula",
    descrizione: "Hai letto 4 capitoli della Regola.",
    icona: "📖",
    xpValore: 250,
    check: (p) => p.capitoliLetti >= 4,
  },
  {
    bit: 8,
    sigilloId: "umilta_9",
    nome: "IX Grado: Il Silenzio",
    descrizione: "Hai raggiunto 100 check-in totali.",
    icona: "🤫",
    xpValore: 300,
    check: (p) => p.checkInTotali >= 100,
  },
  {
    bit: 9,
    sigilloId: "umilta_10",
    nome: "X Grado: La Custodia",
    descrizione: "Hai letto 10 Lectio.",
    icona: "🏛️",
    xpValore: 300,
    check: (p) => p.lectioCompletate >= 10,
  },
  {
    bit: 10,
    sigilloId: "umilta_11",
    nome: "XI Grado: La Parola",
    descrizione: "Hai scritto 20 voci nel Libro del Cuore.",
    icona: "🗝️",
    xpValore: 400,
    check: (p) => p.esamiCompletati >= 20,
  },
  {
    bit: 11,
    sigilloId: "umilta_12",
    nome: "XII Grado: Il Cuore",
    descrizione: "Hai raggiunto una streak di 30 giorni. Sei un Professo della Regola.",
    icona: "✝️",
    xpValore: 500,
    check: (p) => p.streakMassimo >= 30,
  },
];

// ── XP per virtù da ora canonica ────────────────────────────────────────────

const ORA_VIRTU: Record<string, { virtu: string; xp: number }> = {
  silenzio: { virtu: "silenzio", xp: 5 },
  mattutino: { virtu: "preghiera", xp: 15 },
  lodi: { virtu: "preghiera", xp: 15 },
  terza: { virtu: "lavoro", xp: 10 },
  sesta: { virtu: "silenzio", xp: 10 },
  nona: { virtu: "lavoro", xp: 10 },
  vespri: { virtu: "preghiera", xp: 15 },
  compieta: { virtu: "silenzio", xp: 10 },
};

// ── Helpers ─────────────────────────────────────────────────────────────────

async function getOrCreateProfilo(userId: number) {
  const [existing] = await db
    .select()
    .from(bOblatoProfileTable)
    .where(eq(bOblatoProfileTable.userId, userId))
    .limit(1);

  if (existing) return existing;

  const [created] = await db
    .insert(bOblatoProfileTable)
    .values({ userId })
    .returning();
  return created;
}

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

async function checkAndUnlockSigilli(
  userId: number,
  profilo: typeof bOblatoProfileTable.$inferSelect
): Promise<typeof bSigilliTable.$inferSelect[]> {
  const newSigilli: typeof bSigilliTable.$inferSelect[] = [];
  const currentMask = profilo.gradiUmiltaSbloccati;

  for (const grado of GRADI_UMILTA) {
    const alreadyUnlocked = (currentMask & (1 << grado.bit)) !== 0;
    if (alreadyUnlocked) continue;
    if (!grado.check(profilo)) continue;

    // Unlock!
    const newMask = currentMask | (1 << grado.bit);
    await db
      .update(bOblatoProfileTable)
      .set({
        gradiUmiltaSbloccati: newMask,
        xpTotale: profilo.xpTotale + grado.xpValore,
        xpUmilta: profilo.xpUmilta + grado.xpValore,
      })
      .where(eq(bOblatoProfileTable.userId, userId));

    const [sigillo] = await db
      .insert(bSigilliTable)
      .values({
        userId,
        sigilloId: grado.sigilloId,
        nome: grado.nome,
        descrizione: grado.descrizione,
        icona: grado.icona,
        xpValore: grado.xpValore,
      })
      .onConflictDoNothing()
      .returning();

    if (sigillo) newSigilli.push(sigillo);
  }

  return newSigilli;
}

// ── Routes ───────────────────────────────────────────────────────────────────

// GET /b/oblato/profilo
router.get("/oblato/profilo", async (req, res) => {
  const user = await getBAuthUser(req);
  if (!user) { res.status(401).json({ error: "Accesso richiesto" }); return; }
  const profilo = await getOrCreateProfilo(user.id);
  const g = gradoPerXp(profilo.xpTotale);

  res.json({
    ...profilo,
    nomeGrado: g.nome,
    xpAlProssimoGrado: xpAlProssimo(profilo.xpTotale),
  });
});

// POST /b/officium/check-in
router.post("/officium/check-in", async (req, res) => {
  const user = await getBAuthUser(req);
  if (!user) { res.status(401).json({ error: "Accesso richiesto" }); return; }
  const userId = user.id;
  const { oraId } = req.body as { oraId: string };

  if (!oraId) {
    res.status(400).json({ error: "oraId richiesto" });
    return;
  }

  const giorno = today();

  // Check duplicato
  const [existing] = await db
    .select()
    .from(bOfficiumCheckInTable)
    .where(
      and(
        eq(bOfficiumCheckInTable.userId, userId),
        eq(bOfficiumCheckInTable.oraId, oraId),
        eq(bOfficiumCheckInTable.giorno, giorno)
      )
    )
    .limit(1);

  if (existing) {
    res.status(409).json({ error: "Hai già pregato quest'ora oggi." });
    return;
  }

  const virtMap = ORA_VIRTU[oraId] ?? { virtu: "preghiera", xp: 10 };
  const xpGuadagnato = virtMap.xp;

  // Inserisci check-in
  await db
    .insert(bOfficiumCheckInTable)
    .values({ userId, oraId, giorno, xpGuadagnato });

  // Aggiorna profilo
  let profilo = await getOrCreateProfilo(userId);

  // Calcola streak
  const ieri = new Date();
  ieri.setDate(ieri.getDate() - 1);
  const ieriStr = ieri.toISOString().slice(0, 10);

  const streakCorrente =
    profilo.ultimaPratica === ieriStr || profilo.ultimaPratica === giorno
      ? profilo.streakCorrente + (profilo.ultimaPratica === giorno ? 0 : 1)
      : 1;

  const streakMassimo = Math.max(profilo.streakMassimo, streakCorrente);

  // XP per virtù
  const updates: Partial<typeof bOblatoProfileTable.$inferInsert> = {
    xpTotale: profilo.xpTotale + xpGuadagnato,
    checkInTotali: profilo.checkInTotali + 1,
    streakCorrente,
    streakMassimo,
    ultimaPratica: giorno,
  };

  if (virtMap.virtu === "preghiera")
    updates.xpPreghiera = profilo.xpPreghiera + xpGuadagnato;
  else if (virtMap.virtu === "lavoro")
    updates.xpLavoro = profilo.xpLavoro + xpGuadagnato;
  else if (virtMap.virtu === "silenzio")
    updates.xpSilenzio = profilo.xpSilenzio + xpGuadagnato;

  const xpStabilitas = xpGuadagnato > 0 ? profilo.xpStabilitas + 2 : profilo.xpStabilitas;
  updates.xpStabilitas = xpStabilitas;

  await db
    .update(bOblatoProfileTable)
    .set(updates)
    .where(eq(bOblatoProfileTable.userId, userId));

  // Rileggi profilo aggiornato
  profilo = await getOrCreateProfilo(userId);

  // Check sigilli
  const sigilliNuovi = await checkAndUnlockSigilli(userId, profilo);

  // Grado
  const gradoPre = gradoPerXp(profilo.xpTotale - xpGuadagnato);
  const gradoPost = gradoPerXp(profilo.xpTotale);

  res.json({
    success: true,
    xpGuadagnato,
    sigilliNuovi,
    streakCorrente,
    grado: gradoPost.grado,
    gradoNuovo: gradoPost.grado > gradoPre.grado,
  });
});

// GET /b/officium/oggi
router.get("/officium/oggi", async (req, res) => {
  const user = await getBAuthUser(req);
  if (!user) { res.status(401).json({ error: "Accesso richiesto" }); return; }
  const userId = user.id;
  const giorno = today();

  const checkIns = await db
    .select()
    .from(bOfficiumCheckInTable)
    .where(
      and(
        eq(bOfficiumCheckInTable.userId, userId),
        eq(bOfficiumCheckInTable.giorno, giorno)
      )
    );

  res.json(checkIns);
});

// GET /b/sigilli
router.get("/sigilli", async (req, res) => {
  const user = await getBAuthUser(req);
  if (!user) { res.status(401).json({ error: "Accesso richiesto" }); return; }
  const userId = user.id;
  const sigilli = await db
    .select()
    .from(bSigilliTable)
    .where(eq(bSigilliTable.userId, userId))
    .orderBy(desc(bSigilliTable.sbloccatoIl));

  res.json(sigilli);
});

// GET /b/capitolo/corrente
router.get("/capitolo/corrente", async (req, res) => {
  const user = await getBAuthUser(req);
  if (!user) { res.status(401).json({ error: "Accesso richiesto" }); return; }
  const now = new Date();
  // Monday of current week
  const day = now.getDay();
  const diff = (day === 0 ? -6 : 1 - day);
  const monday = new Date(now);
  monday.setDate(now.getDate() + diff);
  const settimana = monday.toISOString().slice(0, 10);

  const [capitolo] = await db
    .select()
    .from(bCapitoliTable)
    .where(eq(bCapitoliTable.settimana, settimana))
    .limit(1);

  if (!capitolo) {
    // Return a seeded chapter based on week number
    const weekNumber = Math.floor(now.getTime() / (7 * 24 * 60 * 60 * 1000));
    const capNum = (weekNumber % 73) + 1;
    const seed = CAPITOLI_SEED[capNum] ?? CAPITOLI_SEED[4];
    res.json({ ...seed, settimana, domande: JSON.parse(seed.domande) });
    return;
  }

  res.json({ ...capitolo, domande: JSON.parse(capitolo.domande) });
});

// GET /b/libro-cuore
router.get("/libro-cuore", async (req, res) => {
  const user = await getBAuthUser(req);
  if (!user) { res.status(401).json({ error: "Accesso richiesto" }); return; }
  const userId = user.id;
  const entries = await db
    .select()
    .from(bLibroCuoreTable)
    .where(eq(bLibroCuoreTable.userId, userId))
    .orderBy(desc(bLibroCuoreTable.createdAt))
    .limit(50);

  res.json(entries);
});

// POST /b/libro-cuore
router.post("/libro-cuore", async (req, res) => {
  const user = await getBAuthUser(req);
  if (!user) { res.status(401).json({ error: "Accesso richiesto" }); return; }
  const userId = user.id;
  const { tipo, riferimentoId, testo, domanda, giorno } = req.body as {
    tipo: string;
    riferimentoId?: string;
    testo: string;
    domanda?: string;
    giorno: string;
  };

  if (!testo?.trim() || !tipo || !giorno) {
    res.status(400).json({ error: "Campi obbligatori mancanti" });
    return;
  }

  const [entry] = await db
    .insert(bLibroCuoreTable)
    .values({ userId, tipo, riferimentoId, testo, domanda, giorno })
    .returning();

  // Aggiorna contatore esami/capitoli
  const profilo = await getOrCreateProfilo(userId);
  if (tipo === "esame") {
    await db
      .update(bOblatoProfileTable)
      .set({
        esamiCompletati: profilo.esamiCompletati + 1,
        xpTotale: profilo.xpTotale + 5,
        xpUmilta: profilo.xpUmilta + 5,
        xpOspitalita: profilo.xpOspitalita + 3,
      })
      .where(eq(bOblatoProfileTable.userId, userId));
  } else if (tipo === "capitolo") {
    await db
      .update(bOblatoProfileTable)
      .set({
        capitoliLetti: profilo.capitoliLetti + 1,
        xpTotale: profilo.xpTotale + 20,
        xpPreghiera: profilo.xpPreghiera + 10,
        xpUmilta: profilo.xpUmilta + 10,
      })
      .where(eq(bOblatoProfileTable.userId, userId));
  }

  // Check nuovi sigilli
  const profiloAggiornato = await getOrCreateProfilo(userId);
  await checkAndUnlockSigilli(userId, profiloAggiornato);

  res.status(201).json(entry);
});

// GET /b/esame/domande
router.get("/esame/domande", async (req, res) => {
  const user = await getBAuthUser(req);
  if (!user) { res.status(401).json({ error: "Accesso richiesto" }); return; }
  const now = new Date();
  const dayOfYear = Math.floor(
    (now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24)
  );

  // Rotate through pool of questions
  const pool = ESAME_DOMANDE_POOL;
  const idx = dayOfYear % pool.length;
  const domande = [
    pool[idx % pool.length],
    pool[(idx + 1) % pool.length],
    pool[(idx + 2) % pool.length],
  ];

  res.json({ domande, data: now.toISOString().slice(0, 10) });
});

// ── Seed data ────────────────────────────────────────────────────────────────

const ESAME_DOMANDE_POOL = [
  "Dove hai custodito oggi qualcosa di prezioso — una relazione, un compito, un silenzio?",
  "In quale momento della giornata hai sentito la tua presenza più piena?",
  "Cosa hai fatto con attenzione vera oggi — senza fretta, senza distrazione?",
  "Dove hai sciupato energia in cose che non contano?",
  "Chi hai ascoltato davvero, con tutto te stesso?",
  "Cosa hai rimandato che invece andava fatto?",
  "In quale momento hai scelto la via più difficile — e perché?",
  "Cosa hai imparato di te stesso oggi?",
  "Per cosa sei grato stanotte, anche se non è stato un giorno facile?",
  "Cosa vorresti portare nel riposo, e cosa vorresti lasciare andare?",
  "Dove hai agito da custode — di te, degli altri, del mondo?",
  "Quale pensiero ti ha occupato più del necessario oggi?",
  "Hai detto una cosa vera oggi — anche se era difficile da dire?",
  "Dove hai scelto il silenzio invece della parola? È stata la scelta giusta?",
  "Cosa ti ha sorpreso oggi — in bene o in male?",
  "Hai fatto qualcosa gratuitamente, senza aspettarti nulla in cambio?",
  "C'è qualcuno a cui devi chiedere perdono, o che devi perdonare?",
  "Qual è il gesto concreto più piccolo con cui hai onorato la tua dignità oggi?",
  "Cosa vorresti fare domani diversamente — non con perfezionismo, ma con più presenza?",
  "Il tuo corpo ti ha detto qualcosa oggi. Cosa?",
  "Hai incontrato la bellezza oggi? Dove?",
];

const CAPITOLI_SEED: Record<number, { id: number; numero: number; titolo: string; testo: string; domande: string }> = {
  4: {
    id: 0,
    numero: 4,
    titolo: "Quali sono gli strumenti delle buone opere",
    testo: `<p><em>Regola di San Benedetto, Capitolo 4</em></p>
<p>In primo luogo, amare il Signore Dio con tutto il cuore, con tutta l'anima, con tutte le forze; poi, amare il prossimo come se stesso. Poi non uccidere, non commettere adulterio, non rubare, non desiderare, non rendere falsa testimonianza: onorare tutti gli uomini, e non fare agli altri ciò che non vuoi sia fatto a te.</p>
<p>Rinnegarsi a se stessi per seguire Cristo. Castigare il corpo, non abbracciare i piaceri, amare il digiuno. Soccorrere i poveri, vestire l'ignudo, visitare il malato, seppellire il morto. Aiutare il travagliato, consolare l'addolorato.</p>
<p>Farsi estraneo alle azioni del mondo. Non anteporre nulla all'amore di Cristo. Non dare corso all'ira, non serbare rancore, non coltivare l'inganno nel cuore, non dare pace falsa, non abbandonare la carità.</p>
<p>Non giurare per non spergiurare. Dire la verità con il cuore e con la bocca. Non rendere male per male, non fare torto ma sopportare con pazienza il torto fatto. Amare i nemici.</p>
<p>Non maledire chi maledice ma benedire. Portare la persecuzione per la giustizia.</p>
<p>Non essere superbo, non beone, non mangione, non sonnolento, non pigro, non mormoratore, non dettrattore. Porre la propria speranza in Dio. Se si vede in sé qualcosa di buono, attribuirlo a Dio e non a se stessi; il male invece riconoscerlo come opera propria e imputarlo a se stessi.</p>
<p>Temere il giorno del giudizio. Avere orrore dell'inferno. Desiderare con tutto il desiderio la vita eterna. Tenere ogni giorno davanti ai propri occhi la morte imminente.</p>
<p>Custodire in ogni ora le azioni della propria vita. Sapere con certezza che in ogni luogo Dio ci vede. Spezzare subito contro Cristo i cattivi pensieri che vengono al cuore e svelarli al padre spirituale. Custodire la bocca dalla parola cattiva e perversa.</p>
<p>Non amare il parlare molto. Non pronunciare parole vane e che fanno ridere. Non amare il riso frequente e fragoroso.</p>
<p>Ascoltare volentieri le sante letture. Applicarsi spesso alla preghiera. Confessare ogni giorno a Dio in preghiera i peccati passati con lacrime e gemiti, e emendarsi di essi per il futuro. Non compiacere i desideri della carne. Detestare la propria volontà.</p>
<p>Obbedire ai comandi dell'abate in tutto, anche se egli — Dio non voglia — agisse diversamente, ricordandosi di quel precetto del Signore: <em>Fate ciò che dicono ma non fate ciò che fanno</em>.</p>
<p>Non voler essere chiamato santo prima di esserlo, ma esserlo prima e poi essere chiamato tale con verità. Adempiere ogni giorno con le opere i precetti di Dio. Amare la castità. Non odiare nessuno. Non avere gelosia e invidia. Non amare la contesa. Fuggire la vanagloria.</p>
<p>Ecco gli strumenti dell'arte spirituale. Quando li avremo usati notte e giorno senza posa e li avremo restituiti nel giorno del giudizio, quel compenso che il Signore ha promesso ci sarà dato: <em>ciò che occhio non vide, né orecchio udì, né al cuore dell'uomo salì, ciò che Dio ha preparato per coloro che lo amano</em>.</p>`,
    domande: JSON.stringify([
      "Quale di questi 'strumenti' senti più mancante nella tua vita quotidiana? Perché?",
      "San Benedetto elenca opere concrete e atteggiamenti interiori insieme. Qual è la connessione tra i due nella tua esperienza?",
      "\"Tenere ogni giorno davanti ai propri occhi la morte imminente\" — come cambierebbe le tue priorità se lo facessi davvero?",
    ]),
  },
  7: {
    id: 0,
    numero: 7,
    titolo: "Dell'umiltà",
    testo: `<p><em>Regola di San Benedetto, Capitolo 7</em></p>
<p>Dice la Scrittura: <em>Chiunque si esalta sarà umiliato, e chi si umilia sarà esaltato</em>. Con questo ci mostra che ogni esaltazione è una forma di superbia, contro cui il profeta dimostra di guardarsi quando dice: <em>Signore, il mio cuore non si è inorgoglito, né i miei occhi si sono alzati con superbia</em>.</p>
<p>Se dunque vogliamo raggiungere l'eccelsa vetta dell'umiltà e arrivare presto a quella esaltazione celeste a cui si sale con l'umiltà della vita presente, dobbiamo con le nostre opere ascendenti erigere quella scala che apparve in sogno a Giacobbe, lungo la quale gli angeli scendevano e saliva. Questa discesa e salita va intesa senza dubbio nel senso che si scende con la superbia e si sale con l'umiltà.</p>
<p>La scala eretta è la nostra vita nel mondo, che il Signore innalza al cielo quando il cuore è umile. I lati della scala sono il nostro corpo e la nostra anima, sui quali la vocazione divina ha innestato i diversi gradini di umiltà e disciplina che dobbiamo salire.</p>`,
    domande: JSON.stringify([
      "Il primo grado dell'umiltà è 'tenere sempre davanti agli occhi il timore di Dio'. Come si traduce questo nella tua vita pratica?",
      "Benedetto parla di 'discendere per salire' — abbassarsi per elevarsi. Dove stai cercando di salire senza prima scendere?",
      "Qual è la differenza tra umiltà e umiliazione? Hai confuso le due cose nella tua storia?",
    ]),
  },
  48: {
    id: 0,
    numero: 48,
    titolo: "Del lavoro manuale quotidiano",
    testo: `<p><em>Regola di San Benedetto, Capitolo 48</em></p>
<p>L'ozio è nemico dell'anima. Perciò i fratelli devono essere occupati in determinati momenti nel lavoro manuale, e in altri nelle ore dedicate alla lettura divina.</p>
<p>Riteniamo che i tempi per l'una e per l'altra cosa debbano essere distribuiti in questo modo: dalla Pasqua fino alle calende di ottobre, i fratelli usciranno la mattina e lavoreranno alle necessità richieste, dalla prima ora fino quasi alla quarta. Dalla quarta ora fino all'ora circa della Sesta si occuperanno nella lettura. Dopo la Sesta, alzatisi da tavola, riposino sui loro letti nel pieno silenzio, oppure se qualcuno vuole leggere per sé faccia in modo da non disturbare gli altri.</p>
<p>Si dica la Nona un poco prima dell'ora giusta, alla metà dell'ottava ora, e poi di nuovo lavoreranno a ciò che occorre fare fino ai Vespri. Se poi le necessità del luogo o la povertà li obbliga a raccogliere personalmente le messi, non si rattristino, perché allora sono monaci davvero, quando vivono del lavoro delle loro mani, come i nostri padri e gli apostoli.</p>`,
    domande: JSON.stringify([
      "\"L'ozio è nemico dell'anima\" — cosa distingue per te il riposo legittimo dall'ozio?",
      "Benedetto bilancia lavoro, lettura e preghiera in proporzioni precise. Come è distribuito il tuo tempo tra questi tre elementi?",
      "Il lavoro manuale era dignità monastica, non umiliazione. C'è lavoro concreto, fisico, che potrebbe arricchire la tua vita spirituale?",
    ]),
  },
  72: {
    id: 0,
    numero: 72,
    titolo: "Del buon fervore dei monaci",
    testo: `<p><em>Regola di San Benedetto, Capitolo 72</em></p>
<p>Come c'è uno zelo amaro e cattivo che allontana da Dio e porta all'inferno, così c'è uno zelo buono che separa dai vizi e porta a Dio e alla vita eterna.</p>
<p>Questo zelo dunque i monaci lo pratichino con ardentissimo amore: si prevengano a vicenda con l'onore, sopportino con la massima pazienza le infermità fisiche e morali degli altri, gareggino nell'obbedirsi l'un l'altro.</p>
<p>Nessuno persegua ciò che giudica utile per sé, ma piuttosto ciò che giova all'altro. Portino la carità fraterna con casto amore. Temano Dio. Amino il loro abate con sincero e umile amore. Non preferiscano assolutamente nulla a Cristo, che ci conduca tutti insieme alla vita eterna.</p>`,
    domande: JSON.stringify([
      "\"Nessuno persegua ciò che giudica utile per sé\" — dove nella tua vita professionale questo è più difficile?",
      "Lo 'zelo buono' si manifesta nel gareggiare nell'obbedirsi, non nel primeggiare. Com'è la qualità della tua attenzione agli altri?",
      "\"Non preferire assolutamente nulla a Cristo\" — sostituisci Cristo con il tuo valore più alto. Cosa stai davvero mettendo al centro?",
    ]),
  },
};

export default router;
