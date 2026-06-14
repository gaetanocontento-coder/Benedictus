import { useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/lib/auth";
import { useLogin } from "@workspace/api-client-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building2, Presentation, Megaphone, Store, Wand2 } from "lucide-react";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";

const roles = [
  {
    id: "admin",
    title: "Direzione",
    description: "Accesso completo a KPI, vendite e gestione piattaforma.",
    icon: Building2,
    username: "admin@intessuto.it",
    password: "password123"
  },
  {
    id: "commerciale",
    title: "Commerciale",
    description: "Gestione lead, clienti, campioni e proposte.",
    icon: Presentation,
    username: "commerciale@intessuto.it",
    password: "password123"
  },
  {
    id: "marketing",
    title: "Marketing",
    description: "Analisi insight, fonti lead e catalogo materiali.",
    icon: Megaphone,
    username: "marketing@intessuto.it",
    password: "password123"
  }
];

export default function Login() {
  const [, setLocation] = useLocation();
  const { login } = useAuth();
  const { toast } = useToast();
  const loginMutation = useLogin();
  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  const handleLogin = (role: typeof roles[0]) => {
    setSelectedRole(role.id);
    loginMutation.mutate(
      { data: { username: role.username, password: role.password } },
      {
        onSuccess: (data) => {
          login(data);
          setLocation("/dashboard");
          toast({
            title: "Accesso effettuato",
            description: `Benvenuto, ${data.nome}`,
          });
        },
        onError: () => {
          setSelectedRole(null);
          toast({
            title: "Errore di accesso",
            description: "Credenziali non valide",
            variant: "destructive"
          });
        }
      }
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 fixed inset-0 z-50">
      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
        
        <div className="flex flex-col justify-center space-y-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3 font-serif text-3xl tracking-tight mb-8">
              <div className="h-8 w-8 bg-primary rounded-sm" />
              INTESSUTO
            </div>
            <h1 className="text-4xl font-serif tracking-tight">Performance Suite</h1>
            <p className="text-lg text-muted-foreground">
              La piattaforma integrata per la gestione commerciale e marketing nel settore contract e interior design.
            </p>
          </div>
        </div>

        <div className="bg-card border rounded-xl shadow-lg p-8">
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight">Accesso Piattaforma</h2>
              <p className="text-sm text-muted-foreground mt-1">Seleziona un ruolo demo per accedere</p>
            </div>

            <div className="grid gap-4">
              {roles.map((role) => (
                <Card 
                  key={role.id} 
                  className={`cursor-pointer transition-colors hover:border-primary/50 ${selectedRole === role.id ? "border-primary ring-1 ring-primary" : ""}`}
                  onClick={() => handleLogin(role)}
                >
                  <CardHeader className="p-4 flex flex-row items-center gap-4 space-y-0">
                    <div className="bg-primary/10 p-3 rounded-lg text-primary">
                      <role.icon className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-base">{role.title}</CardTitle>
                      <CardDescription className="text-xs">{role.description}</CardDescription>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>

            <div className="border-t pt-4">
              <p className="text-xs text-muted-foreground mb-2">Pagine pubbliche (senza login)</p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1 gap-2" asChild>
                  <Link href="/shop"><Store className="h-4 w-4" /> Catalogo</Link>
                </Button>
                <Button variant="outline" size="sm" className="flex-1 gap-2" asChild>
                  <Link href="/configuratore"><Wand2 className="h-4 w-4" /> Configuratore</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
