import { useState } from "react";

export default function Officina() {
  const [workshops, setWorkshops] = useState([
    {
      id: 1,
      title: "Ritiro: La Regola del Custode",
      description: "Tre giorni di silenzio, studio e discernimento nell'Abbazia di Praglia. Un'immersione totale nel ritmo benedettino.",
      date: "12-14 Ottobre",
      location: "Abbazia di Praglia, PD",
      maxParticipants: 15,
      currentParticipants: 12,
      isRegistered: false
    },
    {
      id: 2,
      title: "Workshop: Disarmare il Leader",
      description: "Una giornata intensiva per riconoscere e dismettere le corazze dell'ego che ostacolano la vera autorevolezza.",
      date: "25 Novembre",
      location: "Milano, Spazio Oasi",
      maxParticipants: 25,
      currentParticipants: 25,
      isRegistered: true
    }
  ]);

  const handleRegister = (id: number) => {
    setWorkshops(workshops.map(w => w.id === id ? { ...w, isRegistered: true, currentParticipants: w.currentParticipants + 1 } : w));
  };

  return (
    <div className="w-full">
      <section className="py-24 bg-background border-b border-border">
        <div className="container mx-auto px-6 max-w-4xl text-center">
          <p className="text-primary tracking-[0.3em] text-sm uppercase mb-6 animate-in fade-in">
            Officina
          </p>
          <h1 className="text-4xl md:text-6xl font-serif text-foreground mb-8">
            Il lavoro <span className="italic text-primary">condiviso.</span>
          </h1>
          <p className="text-xl text-muted-foreground font-light max-w-2xl mx-auto">
            Ritiri, seminari e incontri in presenza. Perché la comunità ha bisogno di sguardi.
          </p>
        </div>
      </section>

      <section className="py-24 bg-card">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="grid gap-8">
            {workshops.map((workshop) => {
              const isFull = workshop.currentParticipants >= workshop.maxParticipants;
              return (
                <div key={workshop.id} className="border border-border p-8 bg-background flex flex-col md:flex-row gap-8">
                  <div className="md:w-1/4 border-b md:border-b-0 md:border-r border-border pb-6 md:pb-0 md:pr-6 flex flex-col justify-center text-center md:text-left">
                    <p className="text-2xl font-serif text-primary">{workshop.date}</p>
                    <p className="text-sm text-muted-foreground uppercase tracking-widest mt-2">{workshop.location}</p>
                  </div>
                  <div className="md:w-2/4 flex flex-col justify-center">
                    <h2 className="text-xl font-serif text-foreground mb-3">{workshop.title}</h2>
                    <p className="text-muted-foreground font-light text-sm">{workshop.description}</p>
                  </div>
                  <div className="md:w-1/4 flex flex-col justify-center items-center md:items-end gap-4">
                    <p className="text-xs uppercase tracking-widest text-muted-foreground">
                      {workshop.currentParticipants}/{workshop.maxParticipants} posti
                    </p>
                    {workshop.isRegistered ? (
                      <span className="text-primary border border-primary/20 px-6 py-2 uppercase tracking-widest text-xs">
                        Iscritto
                      </span>
                    ) : isFull ? (
                      <span className="text-muted-foreground border border-border px-6 py-2 uppercase tracking-widest text-xs">
                        Completo
                      </span>
                    ) : (
                      <button 
                        onClick={() => handleRegister(workshop.id)}
                        className="bg-primary text-primary-foreground hover:bg-primary/90 transition-colors px-6 py-2 uppercase tracking-widest text-xs"
                      >
                        Registrati
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
