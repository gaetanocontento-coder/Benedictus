import { useParams, Link } from "wouter";
import { useBGetLectio, getBGetLectioQueryKey } from "@workspace/api-client-react";
import { useAuth } from "@/lib/auth";
import { ArrowLeft, Clock } from "lucide-react";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("it-IT", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

const TIER_LABEL: Record<string, string> = {
  pellegrino: "Pellegrino",
  monaco: "Monaco",
  abbas: "Abbas",
};

export default function LectioDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const numericId = parseInt(id ?? "0", 10);

  const { data: lectio, isLoading, error } = useBGetLectio(numericId, {
    query: { enabled: !!numericId, queryKey: getBGetLectioQueryKey(numericId) },
  });

  const tierError =
    error &&
    typeof error === "object" &&
    "response" in error &&
    (error as { response?: { status?: number } }).response?.status === 403;

  return (
    <div className="w-full">
      {/* Header */}
      <section className="py-20 bg-background border-b border-border">
        <div className="container mx-auto px-6 max-w-4xl">
          <Link
            href="/lectio"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors mb-10"
          >
            <ArrowLeft className="w-3 h-3" /> Tutte le Lectio
          </Link>

          {isLoading && (
            <div className="text-center py-16">
              <p className="text-muted-foreground tracking-widest uppercase text-xs animate-pulse">
                Preparando la lectio…
              </p>
            </div>
          )}

          {!isLoading && !lectio && !tierError && (
            <div className="text-center py-16">
              <p className="text-muted-foreground font-serif text-xl">
                Lectio non trovata.
              </p>
              <Link
                href="/lectio"
                className="mt-6 inline-block text-primary text-xs uppercase tracking-widest hover:underline"
              >
                Torna all'archivio
              </Link>
            </div>
          )}

          {lectio && (
            <>
              <div className="flex flex-wrap gap-3 items-center mb-8">
                <span className="text-xs uppercase tracking-widest text-muted-foreground">
                  {lectio.category}
                </span>
                <span className="text-muted-foreground/30">·</span>
                <span className="text-xs uppercase tracking-widest text-primary border border-primary/20 px-2 py-0.5">
                  {TIER_LABEL[lectio.requiredTier] ?? lectio.requiredTier}
                </span>
                <span className="text-muted-foreground/30">·</span>
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {lectio.readingMinutes} min
                </span>
                <span className="text-muted-foreground/30">·</span>
                <span className="text-xs text-muted-foreground">
                  {formatDate(lectio.publishedAt)}
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl font-serif text-foreground leading-tight">
                {lectio.title}
              </h1>
              {lectio.excerpt && (
                <p className="mt-6 text-xl text-muted-foreground font-light leading-relaxed max-w-2xl">
                  {lectio.excerpt}
                </p>
              )}
            </>
          )}
        </div>
      </section>

      {/* Body */}
      {lectio && (
        <section className="py-20 bg-card">
          <div className="container mx-auto px-6 max-w-3xl">
            {lectio.body ? (
              <div
                className="prose prose-stone prose-invert max-w-none
                  prose-p:text-muted-foreground prose-p:font-light prose-p:leading-relaxed
                  prose-h2:font-serif prose-h2:text-foreground prose-h2:font-normal
                  prose-h3:font-serif prose-h3:text-foreground prose-h3:font-normal
                  prose-blockquote:border-l-primary prose-blockquote:text-muted-foreground
                  prose-blockquote:font-serif prose-blockquote:italic
                  prose-strong:text-foreground prose-strong:font-medium"
                dangerouslySetInnerHTML={{ __html: lectio.body }}
              />
            ) : (
              /* Access locked */
              <div className="text-center py-16 space-y-6">
                <div className="w-14 h-14 border border-primary/30 rounded-full flex items-center justify-center mx-auto">
                  <svg className="w-5 h-5 text-primary/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                      d="M12 15v2m0 0v2m0-2h2m-2 0H10m2-5a2 2 0 00-2-2V7a4 4 0 118 0v3a2 2 0 00-2 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-widest text-primary mb-3">
                    Contenuto Riservato
                  </p>
                  <h2 className="text-2xl font-serif text-foreground mb-3">
                    Riservato al piano{" "}
                    <span className="italic">{TIER_LABEL[lectio.requiredTier]}</span>
                  </h2>
                  <p className="text-muted-foreground font-light max-w-md mx-auto">
                    Questa lectio richiede un abbonamento superiore. Fai l'upgrade per continuare il cammino.
                  </p>
                </div>
                {user ? (
                  <Link
                    href="/piani"
                    className="inline-block bg-primary text-primary-foreground px-10 py-4 hover:bg-primary/90 transition-colors uppercase tracking-widest text-xs"
                  >
                    Esplora i Piani
                  </Link>
                ) : (
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                      href="/login"
                      className="inline-block border border-primary text-primary px-8 py-3 hover:bg-primary hover:text-primary-foreground transition-colors uppercase tracking-widest text-xs"
                    >
                      Accedi
                    </Link>
                    <Link
                      href="/piani"
                      className="inline-block bg-primary text-primary-foreground px-8 py-3 hover:bg-primary/90 transition-colors uppercase tracking-widest text-xs"
                    >
                      Scopri i Piani
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Tier error (403) */}
      {tierError && (
        <section className="py-20 bg-card">
          <div className="container mx-auto px-6 max-w-3xl text-center space-y-6">
            <div className="w-14 h-14 border border-primary/30 rounded-full flex items-center justify-center mx-auto">
              <svg className="w-5 h-5 text-primary/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M12 15v2m0 0v2m0-2h2m-2 0H10m2-5a2 2 0 00-2-2V7a4 4 0 118 0v3a2 2 0 00-2 2z" />
              </svg>
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest text-primary mb-3">Accesso Limitato</p>
              <h2 className="text-2xl font-serif text-foreground mb-3">
                Piano superiore richiesto
              </h2>
              <p className="text-muted-foreground font-light max-w-md mx-auto">
                Il tuo abbonamento attuale non include questa lectio. Esplora i piani disponibili per accedere a tutto il corpus.
              </p>
            </div>
            <Link
              href="/piani"
              className="inline-block bg-primary text-primary-foreground px-10 py-4 hover:bg-primary/90 transition-colors uppercase tracking-widest text-xs"
            >
              Esplora i Piani
            </Link>
          </div>
        </section>
      )}
    </div>
  );
}
