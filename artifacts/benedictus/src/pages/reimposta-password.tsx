import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";

export default function ReimpostaPassword() {
  const [, navigate] = useLocation();
  const token = new URLSearchParams(window.location.search).get("token") ?? "";

  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) navigate("/password-dimenticata");
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (newPassword !== confirm) {
      setError("Le password non coincidono.");
      return;
    }
    if (newPassword.length < 8) {
      setError("La password deve essere di almeno 8 caratteri.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/b/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword }),
      });
      const data = await res.json() as { error?: string };
      if (!res.ok) {
        setError(data.error ?? "Errore imprevisto");
      } else {
        setDone(true);
      }
    } catch {
      setError("Errore di rete. Riprova.");
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <div className="flex-1 flex bg-card min-h-[calc(100vh-80px)]">
        <div className="w-full max-w-md mx-auto flex flex-col justify-center px-6 py-12 text-center">
          <div className="w-14 h-14 border border-primary rounded-full flex items-center justify-center mx-auto mb-8">
            <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <p className="text-primary tracking-[0.3em] text-xs uppercase mb-4">Completato</p>
          <h1 className="text-3xl font-serif text-foreground mb-4">
            Password <span className="italic text-primary">aggiornata.</span>
          </h1>
          <p className="text-muted-foreground font-light text-sm mb-10">
            Puoi ora accedere con la nuova password.
          </p>
          <Link
            href="/login"
            className="inline-block bg-primary text-primary-foreground px-10 py-4 hover:bg-primary/90 transition-colors uppercase tracking-widest text-xs"
          >
            Accedi
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex bg-card min-h-[calc(100vh-80px)]">
      <div className="w-full max-w-md mx-auto flex flex-col justify-center px-6 py-12">
        <div className="text-center mb-12">
          <p className="text-primary tracking-[0.3em] text-xs uppercase mb-4">
            Accesso
          </p>
          <h1 className="text-4xl font-serif text-foreground mb-3">
            Nuova <span className="italic text-primary">password.</span>
          </h1>
          <p className="text-muted-foreground font-light text-sm">
            Scegli una password sicura di almeno 8 caratteri.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 border border-destructive/50 text-destructive text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label
              htmlFor="password"
              className="text-xs uppercase tracking-widest text-muted-foreground"
            >
              Nuova Password
            </label>
            <input
              id="password"
              type="password"
              required
              minLength={8}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full bg-background border border-border p-3 focus:outline-none focus:border-primary transition-colors text-foreground font-light"
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="confirm"
              className="text-xs uppercase tracking-widest text-muted-foreground"
            >
              Conferma Password
            </label>
            <input
              id="confirm"
              type="password"
              required
              minLength={8}
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="w-full bg-background border border-border p-3 focus:outline-none focus:border-primary transition-colors text-foreground font-light"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-primary-foreground py-4 hover:bg-primary/90 transition-colors uppercase tracking-widest text-sm mt-4 disabled:opacity-50"
          >
            {loading ? "Salvataggio…" : "Imposta nuova password"}
          </button>
        </form>

        <p className="text-center text-muted-foreground font-light text-sm mt-8">
          <Link href="/login" className="text-primary hover:underline">
            ← Torna al login
          </Link>
        </p>
      </div>
    </div>
  );
}
