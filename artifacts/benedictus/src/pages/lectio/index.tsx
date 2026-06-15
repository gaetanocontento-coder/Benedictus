import { useState } from "react";
import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import { useBListLectio } from "@workspace/api-client-react";

const CATEGORIES = [
  { value: "", label: "Tutto" },
  { value: "ascolto", label: "Ascolto" },
  { value: "comunita", label: "Comunità" },
  { value: "ritmo", label: "Ritmo" },
  { value: "umilta", label: "Umiltà" },
  { value: "custodia", label: "Custodia" },
];

export default function LectioIndex() {
  const [selectedCategory, setSelectedCategory] = useState("");
  const { data: lectios = [], isLoading } = useBListLectio({
    category: selectedCategory || undefined,
    limit: 20,
  });

  return (
    <div className="w-full">
      <section className="py-24 bg-background border-b border-border">
        <div className="container mx-auto px-6 max-w-4xl text-center">
          <p className="text-primary tracking-[0.3em] text-sm uppercase mb-6 animate-in fade-in">
            L'Archivio
          </p>
          <h1 className="text-4xl md:text-6xl font-serif text-foreground mb-8">
            Lectio <span className="italic text-primary">Divina.</span>
          </h1>
          <p className="text-xl text-muted-foreground font-light max-w-2xl mx-auto">
            Scritti, riflessioni e pratiche per nutrire il custode. Lettura lenta come atto spirituale.
          </p>
        </div>
      </section>

      <section className="bg-card border-b border-border py-6">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="flex flex-wrap gap-4 justify-center">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setSelectedCategory(cat.value)}
                className={`text-xs uppercase tracking-widest px-4 py-2 transition-colors border ${
                  selectedCategory === cat.value
                    ? "border-primary text-primary bg-primary/5"
                    : "border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-card">
        <div className="container mx-auto px-6 max-w-5xl">
          {isLoading ? (
            <div className="text-center py-24">
              <p className="text-muted-foreground tracking-widest uppercase text-xs animate-pulse">
                Raccogliendo la saggezza...
              </p>
            </div>
          ) : lectios.length === 0 ? (
            <div className="text-center py-24">
              <p className="text-muted-foreground font-serif text-xl">
                Nessuna lectio in questa categoria.
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-8">
              {lectios.map((lectio) => (
                <div
                  key={lectio.id}
                  className="border border-border p-8 bg-background/50 hover:border-primary/50 transition-colors"
                >
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-xs uppercase tracking-widest text-muted-foreground">
                      {lectio.category}
                    </span>
                    <span className="text-xs uppercase tracking-widest text-primary border border-primary/20 px-2 py-1">
                      {lectio.requiredTier}
                    </span>
                  </div>
                  <h2 className="text-2xl font-serif text-foreground mb-4">
                    {lectio.title}
                  </h2>
                  <p className="text-muted-foreground font-light mb-6">
                    {lectio.excerpt}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-muted-foreground">
                      {lectio.readingMinutes} min
                    </span>
                    <Link href={`/lectio/${lectio.id}`} className="text-primary hover:text-foreground transition-colors uppercase tracking-widest text-xs flex items-center gap-2">
                      Leggi <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
