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
      <header className={`w-full z-50 ${isHome ? 'absolute top-0 left-0 bg-transparent' : 'bg-background border-b border-border'} py-6`}>
        <div className="container mx-auto px-6 lg:px-12 flex items-center justify-between">
          <Link href="/" className="font-serif text-2xl tracking-widest text-primary uppercase">
            Benedictus
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm uppercase tracking-widest">
            <Link href="/chi-siamo" className="hover:text-primary transition-colors">Chi Siamo</Link>
            <Link href="/la-regula" className="hover:text-primary transition-colors">La Regula</Link>
            <Link href="/lectio" className="hover:text-primary transition-colors">Lectio</Link>
            <Link href="/scriptorium" className="hover:text-primary transition-colors">Scriptorium</Link>
            <Link href="/percorso" className="hover:text-primary transition-colors">Percorso</Link>
            <Link href="/piani" className="hover:text-primary transition-colors">Piani</Link>
          </nav>

          <div className="flex items-center gap-6 text-sm uppercase tracking-widest">
            {user ? (
              <>
                <Link href="/oblato" className="hover:text-primary transition-colors hidden md:block">
                  Cursus Oblati
                </Link>
                <Link href="/admin" className="hover:text-primary transition-colors hidden md:block">
                  Sanctuarium
                </Link>
                <button onClick={logout} className="hover:text-primary transition-colors">
                  Esci
                </button>
              </>
            ) : (
              <Link href="/login" className="hover:text-primary transition-colors">Accedi</Link>
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
          <p className="text-muted-foreground uppercase tracking-widest text-sm mb-4">Anno Domini MCCCXXVII</p>
          <div className="flex justify-center gap-8 text-sm uppercase tracking-widest mb-12">
            <Link href="/contatti" className="hover:text-primary transition-colors">Contatti</Link>
            <Link href="/il-manifesto" className="hover:text-primary transition-colors">Il Manifesto</Link>
            <Link href="/testimonianze" className="hover:text-primary transition-colors">Testimonianze</Link>
          </div>
          <p className="text-xs text-muted-foreground/60">
            &copy; {new Date().getFullYear()} Regula Humanitatis. Un cammino per il custode moderno.
          </p>
        </div>
      </footer>
    </div>
  );
}
