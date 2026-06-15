import { useState } from "react";
import { Link } from "wouter";

export default function PasswordDimenticata() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [resetToken, setResetToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/b/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json() as { resetToken?: string; error?: string };
      if (!res.ok) {
        setError(data.error ?? "Errore imprevisto");
      } else {
        setResetToken(data.resetToken ?? null);
      }
    } catch {
      setError("Errore di rete. Riprova.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex bg-card min-h-[calc(100vh-80px)]">
      <div className="w-full max-w-md mx-auto flex flex-col justify-center px-6 py-12">
        <div className="text-center mb-12">
          <p className="text-primary tracking-[0.3em] text-xs uppercase mb-4">
            Accesso
          </p>
          <h1 className="text-4xl font-serif text-foreground mb-3">
            Password <span className="italic text-primary">dimenticata.</span>
          </h1>
          <p className="text-muted-foreground font-light text-sm">
            Inserisci la tua email per ricevere le istruzioni.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 border border-destructive/50 text-destructive text-sm text-center">
            {error}
          </div>
        )}

        {resetToken ? (
          <div className="space-y-6">
            <div className="p-5 border border-primary/30 bg-primary/5 space-y-4">
              <p className="text-xs uppercase tracking-widest text-primary mb-2">
                Token generato
              </p>
              <p className="text-muted-foreground font-light text-sm leading-relaxed">
                In produzione questo link sarebbe inviato via email. Cliccalo per reimpostare la password:
              </p>
              <Link
                href={`/reimposta-password?token=${resetToken}`}
                className="block text-xs font-mono text-primary/70 break-all hover:text-primary transition-colors underline underline-offset-2"
              >
                /reimposta-password?token={resetToken}
              </Link>
              <Link
                href={`/reimposta-password?token=${resetToken}`}
                className="mt-4 block w-full text-center bg-primary text-primary-foreground py-3 hover:bg-primary/90 transition-colors uppercase tracking-widest text-xs"
              >
                Reimposta Password →
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="text-xs uppercase tracking-widest text-muted-foreground"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-background border border-border p-3 focus:outline-none focus:border-primary transition-colors text-foreground font-light"
                placeholder="la.tua@email.it"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-primary-foreground py-4 hover:bg-primary/90 transition-colors uppercase tracking-widest text-sm mt-4 disabled:opacity-50"
            >
              {loading ? "Ricerca in corso…" : "Invia istruzioni"}
            </button>
          </form>
        )}

        <p className="text-center text-muted-foreground font-light text-sm mt-8">
          <Link href="/login" className="text-primary hover:underline">
            ← Torna al login
          </Link>
        </p>
      </div>
    </div>
  );
}
