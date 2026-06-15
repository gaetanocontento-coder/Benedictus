export default function LaChiamata() {
  return (
    <div className="w-full">
      <section className="py-24 bg-background border-b border-border">
        <div className="container mx-auto px-6 max-w-4xl text-center">
          <p className="text-primary tracking-[0.3em] text-sm uppercase mb-6 animate-in fade-in">
            Perché Ora?
          </p>
          <h1 className="text-4xl md:text-6xl font-serif text-foreground mb-8">
            La fine del <span className="italic text-primary">rumore.</span>
          </h1>
        </div>
      </section>

      <section className="py-24 bg-card">
        <div className="container mx-auto px-6 max-w-3xl">
          <div className="prose prose-invert prose-stone mx-auto">
            <p className="lead text-xl text-muted-foreground font-light">
              Stiamo vivendo un'epoca di frammentazione. Abbiamo costruito macchine formidabili per connetterci, ma ci ritroviamo isolati nelle nostre stanze, nei nostri uffici, nei nostri schermi.
            </p>
            
            <p>
              Le aziende cercano "leader", offrendo loro manuali di management, tecniche di persuasione, algoritmi per massimizzare il profitto. Ma la tecnica senza anima genera solo macchine perfette e persone distrutte. L'esaurimento non è un incidente di percorso, è il risultato strutturale di un sistema che ignora il ritmo umano.
            </p>

            <blockquote className="border-l-primary text-primary italic font-serif text-2xl my-12">
              "C'è bisogno di oasi dove la parola possa ritrovare il suo peso e il silenzio la sua forza."
            </blockquote>

            <p>
              La Regula di San Benedetto, scritta nel VI secolo durante il crollo di una civiltà, non era un manuale di fuga dal mondo, ma un'architettura per ricostruirlo partendo da piccole comunità intenzionali. Benedetto intuì che prima di salvare un impero, bisognava salvare il tempo.
            </p>

            <h3 className="font-serif text-2xl text-foreground mt-12 mb-6">Una nuova categoria</h3>
            <p>
              Benedictus non è un software as a service. Non è un hub di contenuti. È un sanctuarium digitale. È il tentativo di fondare una nuova categoria: il <em>monachesimo laico applicato</em>. 
            </p>
            <p>
              Per chi gestisce persone, capitali, o semplicemente la propria vita, offriamo uno spazio dove l'efficienza lascia il posto alla fecondità, e dove la fretta viene sostituita dal ritmo.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
