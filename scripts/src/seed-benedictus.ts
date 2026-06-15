import postgres from "postgres";

const sql = postgres(process.env.DATABASE_URL!);

await sql`INSERT INTO b_lectio (title, excerpt, body, category, published_at, required_tier, reading_minutes)
VALUES
  ('Ora et Labora: Ritrovare il Ritmo Perduto',
   'In un''epoca di iperconnessione, il principio benedettino del ritmo quotidiano offre una via di uscita dalla dispersione cronica.',
   'Il monaco benedettino non divide la sua vita in ore di lavoro e ore di svago. Egli vive. L''Ora et Labora non è una formula di gestione del tempo — è una cosmologia. Il tempo non si gestisce: si abita. Quando san Benedetto scriveva la sua Regola nel VI secolo, stava descrivendo non un sistema di produttività, ma una forma di presenza. Ogni ora del giorno aveva il suo nome, il suo colore, la sua voce: Mattutino, Lodi, Prima, Terza, Sesta, Nona, Vespro, Compieta. Sette ore di preghiera che non interrompevano il lavoro, ma lo abitavano. Il lavoro non era il contrario della preghiera. Erano la stessa cosa vista da angoli diversi. Oggi costruiamo i nostri calendari come se il tempo fosse una risorsa scarsa da ottimizzare. Svuotiamo le ore, le comprimiamo, le deleghiamo. E poi ci sorprendiamo di sentirci svuotati. La Regola ci dice qualcosa di diverso: il ritmo non si trova fuori di noi. È già in noi. Dobbiamo solo smettere di combatterlo.',
   'ritmo', NOW(), 'pellegrino', 7),
  ('L''Umiltà come Strategia: Il Paradosso del Leader Silenzioso',
   'Benedetto dedica dodici gradi all''umiltà nella sua Regola. Non come virtù passiva, ma come postura attiva verso la realtà.',
   'Il termine "umiltà" viene dal latino humus: terra, suolo. Non è coincidente. L''uomo umile è l''uomo che conosce il proprio peso specifico. Non è l''uomo che si svaluta. È l''uomo che si conosce.',
   'umilta', NOW() - INTERVAL ''3 days'', 'pellegrino', 8),
  ('Comunità come Metodologia: Perché le Organizzazioni Moderne Falliscono',
   'Il monastero non è una famiglia. Non è un''azienda. È qualcosa di terzo — un esperimento di vita comune volontaria con regole esplicite.',
   'Le aziende spendono miliardi ogni anno in team building, cultura aziendale, employer branding. E i dipendenti continuano ad andarsene. Non perché il compenso sia insufficiente. Perché manca qualcosa di più fondamentale: il senso di appartenere a qualcosa che vale più di una busta paga.',
   'comunita', NOW() - INTERVAL ''7 days'', 'monaco', 10),
  ('La Celluzza: L''Arte dello Spazio Interiore',
   'Ogni monaco ha la sua cella. Non è un privilegio — è una necessità spirituale. L''architettura del ritiro come condizione della presenza.',
   'La celluzza del monaco non è un luogo di isolamento. È un luogo di raccoglimento — portare insieme ciò che è sparso. Il monaco si ritira nella cella non per fuggire dal mondo, ma per diventare capace di starci.',
   'ascolto', NOW() - INTERVAL ''14 days'', 'monaco', 6),
  ('Custodia della Terra Comune: Il Benedettino e l''Ecologia del Dono',
   'I monasteri erano i custodi del territorio — non nel senso romantico, ma nel senso tecnico. Il sapere come bene comune.',
   'Il concetto benedettino di custodia non è metaforico. Per secoli i monasteri sono stati i principali gestori del territorio europeo. La parola che usa Benedetto è stabilitas: stabilità di luogo. Il monaco non migra in cerca di terre migliori. Resta.',
   'custodia', NOW() - INTERVAL ''21 days'', 'abbas', 9)
ON CONFLICT DO NOTHING`;

await sql`INSERT INTO b_episodes (title, description, embed_url, published_at, duration_minutes, is_featured)
VALUES
  ('Il Silenzio come Atto Politico — con il Prior Francesco Camoni',
   'In questa prima conversazione della stagione, esploriamo come il silenzio monastico non sia assenza di parola, ma forma di resistenza alla rumorologia del contemporaneo.',
   'https://www.youtube.com/embed/dQw4w9WgXcQ',
   NOW(), 67, true),
  ('Benedetto e il Management: Storie di Abbati Contemporanei',
   'Tre dirigenti raccontano come hanno applicato i principi della Regola alle loro organizzazioni. Non come framework di produttività, ma come postura esistenziale verso il potere.',
   'https://www.youtube.com/embed/dQw4w9WgXcQ',
   NOW() - INTERVAL ''14 days'', 54, false),
  ('La Lectio Divina come Pratica di Pensiero Lento',
   'Guida pratica alla Lectio Divina laica: come applicare il metodo monastico della lettura contemplativa a qualsiasi testo. Con la filosofa Chiara Metelli.',
   'https://www.youtube.com/embed/dQw4w9WgXcQ',
   NOW() - INTERVAL ''28 days'', 43, false)
ON CONFLICT DO NOTHING`;

await sql`INSERT INTO b_workshops (title, description, date, location, max_participants, current_participants)
VALUES
  ('Disarmare la Mente — Ritiro Introduttivo',
   'Un weekend residenziale per entrare nel cuore della Regola. Lectio, silenzio, meditazione guidata e conversazione profonda.',
   '2026-09-12', 'Abbazia di Praglia, Padova', 24, 11),
  ('Custodi del Tempo — Masterclass sul Ritmo',
   'Una giornata dedicata all''Ora et Labora: come costruire strutture temporali che sostengano invece di opprimere.',
   '2026-10-03', 'Milano, Spazio Chiostro', 30, 8),
  ('La Regula nell''Organizzazione — Workshop B2B',
   'Per team leader, HR e fondatori. Come i principi benedettini traducono in cultura organizzativa concreta.',
   '2026-11-07', 'Firenze, Villa il Gioiello', 20, 5)
ON CONFLICT DO NOTHING`;

await sql`INSERT INTO b_testimonials (quote, author_name, author_role, photo)
VALUES
  ('Benedictus non è un corso. È un cambio di asse. Ho smesso di ottimizzare la mia vita e ho iniziato ad abitarla.',
   'Marco Trevisan', 'CEO, Architettura del Silenzio', NULL),
  ('La Regola mi ha dato quello che anni di coaching non avevano mai toccato: una relazione diversa con l''autorità.',
   'Giulia Marchetti', 'Direttrice Risorse Umane, Gruppo Tessile del Nord', NULL),
  ('Sono entrata come scettica. Sono uscita con una pratica quotidiana che non ho più smesso.',
   'Valentina Cozzi', 'Ricercatrice, Università di Bologna', NULL),
  ('Non sapevo che mi mancasse un''ancora. Ora so cosa vuol dire stabilitas.',
   'Roberto Ferri', 'Imprenditore, 3a generazione', NULL)
ON CONFLICT DO NOTHING`;

await sql`INSERT INTO b_graduates (name, voto_date, message)
VALUES
  ('Luca Benedetti', '2025-06-15', 'Ho ricevuto più di quanto sapessi di cercare.'),
  ('Anna Fontana', '2025-06-15', 'La Regola è diventata la grammatica con cui leggo ogni mio giorno.'),
  ('Stefano Mori', '2025-06-15', NULL),
  ('Chiara Battaglia', '2024-12-01', 'Un anno di trasformazione silenziosa e profonda.'),
  ('Paolo Riva', '2024-12-01', 'Non avevo parole all''inizio. Ora ho silenzio — che è meglio.')
ON CONFLICT DO NOTHING`;

console.log("Seed completed");
await sql.end();
