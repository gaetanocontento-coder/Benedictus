import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { AudioPlayer } from "@/components/AudioPlayer";
import { LiturgiaOre } from "@/components/LiturgiaOre";

const NAV_LINKS = [
  { href: "/chi-siamo",   label: "Chi Siamo"   },
  { href: "/la-regula",   label: "La Regola"   },
  { href: "/liturgia",    label: "Liturgia"    },
  { href: "/lectio",      label: "Lectio"      },
  { href: "/scriptorium", label: "Scriptorium" },
  { href: "/video",       label: "Video"       },
  { href: "/refettorio",  label: "Refettorio"  },
  { href: "/percorso",    label: "Percorso"    },
  { href: "/piani",       label: "Piani"       },
];

export function Layout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const [location] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isHome = location === "/";

  const closeMobile = () => setMobileOpen(false);

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
          {/* Logo */}
          <Link
            href="/"
            onClick={closeMobile}
            className="font-display text-lg tracking-[0.3em] uppercase transition-colors text-primary hover:text-primary/80"
          >
            Benedictvs
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-7 text-[11px] uppercase tracking-[0.2em]">
            {NAV_LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="transition-colors text-foreground/60 hover:text-primary"
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* Desktop auth + hamburger */}
          <div className="flex items-center gap-5 text-[11px] uppercase tracking-[0.2em]">
            {user ? (
              <>
                <Link href="/oblato" className="transition-colors hidden md:block text-foreground/60 hover:text-primary">
                  Cursus Oblati
                </Link>
                <Link href="/admin" className="transition-colors hidden md:block text-foreground/60 hover:text-primary">
                  Sanctuarium
                </Link>
                <button onClick={logout} className="transition-colors hidden md:block text-foreground/60 hover:text-primary">
                  Esci
                </button>
              </>
            ) : (
              <Link href="/login" className="transition-colors hidden md:block text-foreground/60 hover:text-primary">
                Accedi
              </Link>
            )}

            {/* Hamburger — mobile only */}
            <button
              onClick={() => setMobileOpen((o) => !o)}
              aria-label={mobileOpen ? "Chiudi menu" : "Apri menu"}
              className="md:hidden text-foreground/70 hover:text-primary transition-colors p-1"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile drawer */}
        {mobileOpen && (
          <div className="md:hidden bg-background/98 backdrop-blur-sm border-t border-border/40">
            <nav className="container mx-auto px-6 py-6 flex flex-col gap-0">
              {NAV_LINKS.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={closeMobile}
                  className="py-3.5 border-b border-border/30 text-[12px] uppercase tracking-[0.25em] text-foreground/70 hover:text-primary transition-colors"
                >
                  {label}
                </Link>
              ))}

              {/* Auth links on mobile */}
              <div className="pt-6 flex flex-col gap-3">
                {user ? (
                  <>
                    <Link href="/oblato" onClick={closeMobile} className="text-[12px] uppercase tracking-[0.2em] text-foreground/50 hover:text-primary transition-colors">
                      Cursus Oblati
                    </Link>
                    <Link href="/admin" onClick={closeMobile} className="text-[12px] uppercase tracking-[0.2em] text-foreground/50 hover:text-primary transition-colors">
                      Sanctuarium
                    </Link>
                    <button
                      onClick={() => { logout(); closeMobile(); }}
                      className="text-left text-[12px] uppercase tracking-[0.2em] text-foreground/50 hover:text-primary transition-colors"
                    >
                      Esci
                    </button>
                  </>
                ) : (
                  <Link href="/login" onClick={closeMobile} className="text-[12px] uppercase tracking-[0.2em] text-primary">
                    Accedi
                  </Link>
                )}
              </div>
            </nav>
          </div>
        )}
      </header>

      <main className="flex-1 flex flex-col pb-20 md:pb-0">
        {children}
      </main>

      <LiturgiaOre />
      <AudioPlayer />

      <footer className="bg-card border-t border-border/60 pt-16 pb-28 md:pb-16 text-center">
        <div className="container mx-auto px-6">
          <h2 className="font-display text-2xl mb-2 text-primary tracking-[0.3em] uppercase">Benedictvs</h2>
          <p className="text-muted-foreground tracking-[0.25em] text-[10px] uppercase mb-8">
            Anno Domini MCCCXXVII
          </p>
          <div className="w-16 h-px bg-primary/30 mx-auto mb-8" />
          <div className="flex justify-center gap-8 text-[11px] uppercase tracking-widest mb-10">
            <Link href="/contatti"      className="text-foreground/40 hover:text-primary transition-colors">Contatti</Link>
            <Link href="/il-manifesto"  className="text-foreground/40 hover:text-primary transition-colors">Il Manifesto</Link>
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
