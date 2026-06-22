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
        className={`w-full z-50 py-6 transition-colors duration-300 ${
          isHome
            ? "absolute top-0 left-0 bg-transparent"
            : "bg-background border-b border-border"
        }`}
      >
        <div className="container mx-auto px-6 lg:px-12 flex items-center justify-between">
          {/* Logo — always cream on home (dark photo), brown on light pages */}
          <Link
            href="/"
            className={`font-serif text-2xl tracking-widest uppercase transition-colors ${
              isHome
                ? "text-[#f0e6d4] hover:text-white"
                : "text-primary hover:text-primary/80"
            }`}
          >
            Benedictus
          </Link>

          {/* Nav links */}
          <nav className="hidden md:flex items-center gap-8 text-sm uppercase tracking-widest">
            {[
              { href: "/chi-siamo",   label: "Chi Siamo"    },
              { href: "/la-regula",   label: "La Regula"    },
              { href: "/lectio",      label: "Lectio"       },
              { href: "/scriptorium", label: "Scriptorium"  },
              { href: "/percorso",    label: "Percorso"     },
              { href: "/piani",       label: "Piani"        },
            ].map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`transition-colors ${
                  isHome
                    ? "text-[#e8d9c2] hover:text-white"
                    : "text-foreground/70 hover:text-primary"
                }`}
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* Auth */}
          <div className="flex items-center gap-6 text-sm uppercase tracking-widest">
            {user ? (
              <>
                <Link
                  href="/oblato"
                  className={`transition-colors hidden md:block ${
                    isHome
                      ? "text-[#e8d9c2] hover:text-white"
                      : "text-foreground/70 hover:text-primary"
                  }`}
                >
                  Cursus Oblati
                </Link>
                <Link
                  href="/admin"
                  className={`transition-colors hidden md:block ${
                    isHome
                      ? "text-[#e8d9c2] hover:text-white"
                      : "text-foreground/70 hover:text-primary"
                  }`}
                >
                  Sanctuarium
                </Link>
                <button
                  onClick={logout}
                  className={`transition-colors ${
                    isHome
                      ? "text-[#e8d9c2] hover:text-white"
                      : "text-foreground/70 hover:text-primary"
                  }`}
                >
                  Esci
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className={`transition-colors ${
                  isHome
                    ? "text-[#e8d9c2] hover:text-white"
                    : "text-foreground/70 hover:text-primary"
                }`}
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

      <footer className="bg-card border-t border-border py-16 text-center">
        <div className="container mx-auto px-6">
          <h2 className="font-serif text-3xl mb-8 text-primary">Benedictus</h2>
          <p className="text-muted-foreground uppercase tracking-widest text-sm mb-4">
            Anno Domini MCCCXXVII
          </p>
          <div className="flex justify-center gap-8 text-sm uppercase tracking-widest mb-12">
            <Link href="/contatti"     className="text-foreground/60 hover:text-primary transition-colors">Contatti</Link>
            <Link href="/il-manifesto" className="text-foreground/60 hover:text-primary transition-colors">Il Manifesto</Link>
            <Link href="/testimonianze" className="text-foreground/60 hover:text-primary transition-colors">Testimonianze</Link>
          </div>
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} Regula Humanitatis. Un cammino per il custode moderno.
          </p>
        </div>
      </footer>
    </div>
  );
}
