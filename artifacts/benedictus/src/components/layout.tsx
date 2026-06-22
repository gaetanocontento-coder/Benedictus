import { Link, useLocation } from "wouter";
import { useAuth } from "@/lib/auth";
import { AudioPlayer } from "@/components/AudioPlayer";
import { LiturgiaOre } from "@/components/LiturgiaOre";

export function Layout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const [location] = useLocation();

  const isHome = location === "/";

  return (
    <div className="min-h-screen flex flex-col w-full relative">
      <header
        className={`w-full z-50 py-5 transition-colors duration-500 ${
          isHome
            ? "absolute top-0 left-0 bg-transparent border-b border-transparent"
            : "bg-background/95 border-b border-border/60 backdrop-blur-sm"
        }`}
      >
        <div className="container mx-auto px-6 lg:px-12 flex items-center justify-between">
          {/* Logo — Cinzel maiuscoletto, sempre crema/oro */}
          <Link
            href="/"
            className="font-display text-lg tracking-[0.3em] uppercase transition-colors text-primary hover:text-primary/80"
          >
            Benedictvs
          </Link>

          {/* Nav links */}
          <nav className="hidden md:flex items-center gap-7 text-[11px] uppercase tracking-[0.2em]">
            {[
              { href: "/chi-siamo",   label: "Chi Siamo"    },
              { href: "/la-regula",   label: "La Regola"    },
              { href: "/liturgia",    label: "Liturgia"     },
              { href: "/lectio",      label: "Lectio"       },
              { href: "/scriptorium", label: "Scriptorium"  },
              { href: "/video",       label: "Video"        },
              { href: "/percorso",    label: "Percorso"     },
              { href: "/piani",       label: "Piani"        },
            ].map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`transition-colors ${
                  isHome
                    ? "text-foreground/70 hover:text-primary"
                    : "text-foreground/60 hover:text-primary"
                }`}
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* Auth */}
          <div className="flex items-center gap-6 text-[11px] uppercase tracking-[0.2em]">
            {user ? (
              <>
                <Link
                  href="/oblato"
                  className="transition-colors hidden md:block text-foreground/60 hover:text-primary"
                >
                  Cursus Oblati
                </Link>
                <Link
                  href="/admin"
                  className="transition-colors hidden md:block text-foreground/60 hover:text-primary"
                >
                  Sanctuarium
                </Link>
                <button
                  onClick={logout}
                  className="transition-colors text-foreground/60 hover:text-primary"
                >
                  Esci
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="transition-colors text-foreground/60 hover:text-primary"
              >
                Accedi
              </Link>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col">
        {children}
      </main>

      <LiturgiaOre />
      <AudioPlayer />

      <footer className="bg-card border-t border-border/60 py-16 text-center">
        <div className="container mx-auto px-6">
          <h2 className="font-display text-2xl mb-2 text-primary tracking-[0.3em] uppercase">Benedictvs</h2>
          <p className="text-muted-foreground tracking-[0.25em] text-[10px] uppercase mb-8">
            Anno Domini MCCCXXVII
          </p>
          <div className="w-16 h-px bg-primary/30 mx-auto mb-8" />
          <div className="flex justify-center gap-8 text-[11px] uppercase tracking-widest mb-10">
            <Link href="/contatti"     className="text-foreground/40 hover:text-primary transition-colors">Contatti</Link>
            <Link href="/il-manifesto" className="text-foreground/40 hover:text-primary transition-colors">Il Manifesto</Link>
            <Link href="/testimonianze" className="text-foreground/40 hover:text-primary transition-colors">Testimonianze</Link>
          </div>
          <p className="text-[11px] text-muted-foreground/50">
            &copy; {new Date().getFullYear()} Regula Humanitatis. Un cammino per il custode moderno.
          </p>
        </div>
      </footer>
    </div>
  );
}
