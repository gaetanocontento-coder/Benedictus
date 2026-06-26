import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { AudioPlayer } from "@/components/AudioPlayer";
import { LiturgiaOre } from "@/components/LiturgiaOre";

const NAV_LINKS = [
  { href: "/chi-siamo",        label: "Chi Siamo"       },
  { href: "/la-regula",        label: "La Regola"       },
  { href: "/liturgia",         label: "Liturgia"        },
  { href: "/lectio",           label: "Lectio"          },
  { href: "/padre-benedetto",  label: "Padre Benedetto" },
  { href: "/scriptorium",      label: "Scriptorium"     },
  { href: "/video",            label: "Video"           },
  { href: "/refettorio",       label: "Refettorio"      },
  { href: "/percorso",         label: "Percorso"        },
  { href: "/piani",            label: "Piani"           },
];


export function Layout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const closeMobile = () => setMobileOpen(false);

  return (
    <div className="min-h-screen flex flex-col w-full relative">
      <header className="w-full z-50 sticky top-0 bg-background/96 border-b border-border/60 backdrop-blur-sm">
        <div className="container mx-auto px-6 lg:px-12 flex items-center justify-between h-16">

          {/* Logo */}
          <Link
            href="/"
            onClick={closeMobile}
            className="font-serif text-[15px] tracking-[0.28em] uppercase text-foreground hover:text-accent transition-colors"
          >
            Benedictvs
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8 text-[13px]">
            {NAV_LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="text-foreground/60 hover:text-foreground transition-colors"
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* Desktop auth */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <>
                <Link href="/oblato" className="text-[13px] text-foreground/60 hover:text-foreground transition-colors">
                  Cursus Oblati
                </Link>
                <Link href="/admin" className="text-[13px] text-foreground/60 hover:text-foreground transition-colors">
                  Sanctuarium
                </Link>
                <button onClick={logout} className="text-[13px] text-foreground/60 hover:text-foreground transition-colors">
                  Esci
                </button>
              </>
            ) : (
              <Link href="/login" className="text-[13px] text-foreground/60 hover:text-foreground transition-colors">
                Accedi
              </Link>
            )}
            <Link
              href="/registrazione"
              className="bg-primary text-primary-foreground text-[11px] uppercase tracking-[0.12em] font-medium px-5 py-2.5 rounded-full hover:bg-primary/85 transition-colors"
            >
              Inizia Gratis
            </Link>
          </div>

          {/* Hamburger — mobile only */}
          <button
            onClick={() => setMobileOpen((o) => !o)}
            aria-label={mobileOpen ? "Chiudi menu" : "Apri menu"}
            className="md:hidden text-foreground/70 hover:text-foreground transition-colors p-1"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile drawer */}
        {mobileOpen && (
          <div className="md:hidden bg-background/98 border-t border-border/40">
            <nav className="container mx-auto px-6 py-6 flex flex-col gap-0">
              {NAV_LINKS.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={closeMobile}
                  className="py-3.5 border-b border-border/30 text-[13px] text-foreground/70 hover:text-foreground transition-colors"
                >
                  {label}
                </Link>
              ))}
              <div className="pt-6 flex flex-col gap-3">
                {user ? (
                  <>
                    <Link href="/oblato" onClick={closeMobile} className="text-[13px] text-foreground/60 hover:text-foreground transition-colors">
                      Cursus Oblati
                    </Link>
                    <Link href="/admin" onClick={closeMobile} className="text-[13px] text-foreground/60 hover:text-foreground transition-colors">
                      Sanctuarium
                    </Link>
                    <button onClick={() => { logout(); closeMobile(); }} className="text-left text-[13px] text-foreground/60 hover:text-foreground transition-colors">
                      Esci
                    </button>
                  </>
                ) : (
                  <Link href="/login" onClick={closeMobile} className="text-[13px] text-foreground/70">
                    Accedi
                  </Link>
                )}
                <Link
                  href="/registrazione"
                  onClick={closeMobile}
                  className="inline-block bg-primary text-primary-foreground text-[11px] uppercase tracking-widest px-5 py-2.5 rounded-full text-center hover:bg-primary/85 transition-colors"
                >
                  Inizia Gratis
                </Link>
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
          <div className="mb-2">
            <h2 className="font-serif text-[15px] tracking-[0.28em] uppercase text-foreground">Benedictvs</h2>
          </div>
          <p className="text-muted-foreground text-[11px] uppercase tracking-widest mb-8">
            Regula Humanitatis · Est. MCM
          </p>
          <div className="w-12 h-px bg-border mx-auto mb-8" />
          <div className="flex justify-center gap-8 text-[12px] mb-10">
            <Link href="/contatti"      className="text-foreground/40 hover:text-foreground transition-colors">Contatti</Link>
            <Link href="/il-manifesto"  className="text-foreground/40 hover:text-foreground transition-colors">Il Manifesto</Link>
            <Link href="/testimonianze" className="text-foreground/40 hover:text-foreground transition-colors">Testimonianze</Link>
          </div>
          <p className="text-[11px] text-muted-foreground/40 mb-1">
            Made in Never Before Italia
          </p>
          <p className="text-[11px] text-muted-foreground/60">
            &copy; {new Date().getFullYear()} Regula Humanitatis. Un cammino per il custode moderno.
          </p>
        </div>
      </footer>
    </div>
  );
}
