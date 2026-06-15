import { useBGetFeaturedEpisode, useBListEpisodes } from "@workspace/api-client-react";

export default function Abbas() {
  const { data: featured, isLoading: featuredLoading } = useBGetFeaturedEpisode();
  const { data: episodes = [], isLoading: episodesLoading } = useBListEpisodes();

  const archiveEpisodes = episodes.filter((ep) => ep.id !== featured?.id);

  return (
    <div className="w-full">
      <section className="py-24 bg-background border-b border-border">
        <div className="container mx-auto px-6 max-w-4xl text-center">
          <p className="text-primary tracking-[0.3em] text-sm uppercase mb-6 animate-in fade-in">
            La Voce dei Maestri
          </p>
          <h1 className="text-4xl md:text-6xl font-serif text-foreground mb-8">
            Ascolta il <span className="italic text-primary">silenzio.</span>
          </h1>
          <p className="text-xl text-muted-foreground font-light max-w-2xl mx-auto">
            Dialoghi, monologhi e conversazioni per nutrire il cammino del custode.
          </p>
        </div>
      </section>

      {featuredLoading ? (
        <div className="py-48 text-center">
          <p className="text-muted-foreground tracking-widest uppercase text-xs animate-pulse">
            Caricamento...
          </p>
        </div>
      ) : featured ? (
        <section className="py-24 bg-card border-b border-border">
          <div className="container mx-auto px-6 max-w-5xl">
            <h2 className="text-2xl font-serif text-primary mb-8">
              Episodio in evidenza
            </h2>
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="aspect-video bg-background border border-border overflow-hidden">
                <iframe
                  src={featured.embedUrl}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title={featured.title}
                />
              </div>
              <div>
                <h3 className="text-3xl font-serif text-foreground mb-4">
                  {featured.title}
                </h3>
                <p className="text-muted-foreground font-light mb-6">
                  {featured.description}
                </p>
                <div className="flex items-center gap-4 text-xs uppercase tracking-widest text-muted-foreground">
                  <span>{featured.durationMinutes} min</span>
                  <span>•</span>
                  <span>Abbas</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {!episodesLoading && archiveEpisodes.length > 0 && (
        <section className="py-24 bg-background">
          <div className="container mx-auto px-6 max-w-4xl">
            <h2 className="text-2xl font-serif text-primary mb-12">Archivio</h2>
            <div className="space-y-8">
              {archiveEpisodes.map((episode) => (
                <div
                  key={episode.id}
                  className="border border-border p-8 hover:border-primary/50 transition-colors flex flex-col md:flex-row gap-8 justify-between md:items-center"
                >
                  <div className="flex-1">
                    <h3 className="text-xl font-serif text-foreground mb-2">
                      {episode.title}
                    </h3>
                    <p className="text-muted-foreground font-light text-sm">
                      {episode.description}
                    </p>
                  </div>
                  <div className="flex items-center gap-6">
                    <span className="text-xs uppercase tracking-widest text-muted-foreground">
                      {episode.durationMinutes} min
                    </span>
                    <a
                      href={episode.embedUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:text-foreground transition-colors uppercase tracking-widest text-xs border border-primary/20 px-4 py-2"
                    >
                      Ascolta
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
