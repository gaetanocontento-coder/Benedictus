import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/lib/auth";
import { useBRegister } from "@workspace/api-client-react";

export default function Registrazione() {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState<string | null>(null);
  const [, setLocation] = useLocation();
  const { setToken } = useAuth();

  const { mutate: register, isPending } = useBRegister({
    mutation: {
      onSuccess: (data) => {
        const anyData = data as unknown as Record<string, unknown>;
        if (anyData.token) {
          setToken(anyData.token as string);
        }
        setLocation("/piani");
      },
      onError: (err: unknown) => {
        const e = err as { response?: { data?: { error?: string } } };
        setError(e?.response?.data?.error ?? "Registrazione non riuscita");
      },
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    register({ data: formData });
  };

  return (
    <div className="flex-1 flex bg-card min-h-[calc(100vh-80px)]">
      <div className="w-full max-w-md mx-auto flex flex-col justify-center px-6 py-12">
        <div className="text-center mb-12">
          <p className="text-primary tracking-[0.3em] text-xs uppercase mb-4">
            Primo Passo
          </p>
          <h1 className="text-4xl font-serif text-foreground">
            Inizia il <span className="italic text-primary">cammino.</span>
          </h1>
        </div>

        {error && (
          <div className="mb-6 p-4 border border-destructive/50 text-destructive text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="name" className="text-xs uppercase tracking-widest text-muted-foreground">
              Nome
            </label>
            <input
              id="name"
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-background border border-border p-3 focus:outline-none focus:border-primary transition-colors text-foreground font-light"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="text-xs uppercase tracking-widest text-muted-foreground">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
              minLength={8}
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full bg-background border border-border p-3 focus:outline-none focus:border-primary transition-colors text-foreground font-light"
            />
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-primary text-primary-foreground py-4 hover:bg-primary/90 transition-colors uppercase tracking-widest text-sm mt-4 disabled:opacity-50"
          >
            {isPending ? "Creazione..." : "Registrati"}
          </button>
        </form>

        <p className="text-center text-muted-foreground font-light text-sm mt-8">
          Sei già un pellegrino? <br />
          <Link href="/login" className="text-primary hover:underline mt-2 inline-block">
            Accedi qui
          </Link>
        </p>
      </div>
    </div>
  );
}
