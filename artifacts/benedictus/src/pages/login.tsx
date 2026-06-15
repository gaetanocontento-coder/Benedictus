import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/lib/auth";
import { useBLogin } from "@workspace/api-client-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [, setLocation] = useLocation();
  const { setToken } = useAuth();

  const { mutate: login, isPending } = useBLogin({
    mutation: {
      onSuccess: (data) => {
        const anyData = data as unknown as Record<string, unknown>;
        if (anyData.token) {
          setToken(anyData.token as string);
        }
        setLocation("/");
      },
      onError: (err: unknown) => {
        const e = err as { response?: { data?: { error?: string } } };
        setError(e?.response?.data?.error ?? "Credenziali non valide");
      },
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    login({ data: { email, password } });
  };

  return (
    <div className="flex-1 flex bg-card min-h-[calc(100vh-80px)]">
      <div className="w-full max-w-md mx-auto flex flex-col justify-center px-6 py-12">
        <div className="text-center mb-12">
          <p className="text-primary tracking-[0.3em] text-xs uppercase mb-4">
            Ingresso
          </p>
          <h1 className="text-4xl font-serif text-foreground">
            Bentornato, <span className="italic text-primary">Custode.</span>
          </h1>
        </div>

        {error && (
          <div className="mb-6 p-4 border border-destructive/50 text-destructive text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="email" className="text-xs uppercase tracking-widest text-muted-foreground">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-background border border-border p-3 focus:outline-none focus:border-primary transition-colors text-foreground font-light"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="text-xs uppercase tracking-widest text-muted-foreground">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-background border border-border p-3 focus:outline-none focus:border-primary transition-colors text-foreground font-light"
            />
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-primary text-primary-foreground py-4 hover:bg-primary/90 transition-colors uppercase tracking-widest text-sm mt-4 disabled:opacity-50"
          >
            {isPending ? "Accesso..." : "Accedi"}
          </button>
        </form>

        <p className="text-center text-muted-foreground font-light text-sm mt-8">
          Non hai ancora iniziato il cammino? <br />
          <Link href="/registrazione" className="text-primary hover:underline mt-2 inline-block">
            Registrati qui
          </Link>
        </p>
      </div>
    </div>
  );
}
