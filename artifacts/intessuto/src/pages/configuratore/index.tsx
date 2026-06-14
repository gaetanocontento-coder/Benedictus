import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Droplets, PawPrint, Flame, Sparkles, Leaf, ShieldCheck, BadgeCheck, Package, CheckCircle2, ChevronRight, ChevronLeft, Sofa, Building2, Sunset, Anchor } from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

type Materiale = {
  id: number;
  nome: string;
  categoria: string;
  colore: string;
  fasciaPrezzo: string;
  utilizzoConsigliato: string;
  disponibile: boolean;
  tecnologie: string[];
  certificazioni: string[];
  descrizione: string | null;
  collezione: string | null;
};

const STEP1 = [
  { value: "residenziale", label: "Divano residenziale", desc: "Casa, appartamento, villa privata", icon: Sofa },
  { value: "contract", label: "Contract / Ufficio", desc: "Hotel, ristorante, ufficio, comunità", icon: Building2 },
  { value: "outdoor", label: "Esterno / Terrazza", desc: "Giardino, area esterna, nautica leggera", icon: Sunset },
  { value: "nautica", label: "Nautica / Marine", desc: "Barche, yacht, ambienti marini", icon: Anchor },
];

const STEP2 = [
  { value: "animali", label: "Ho animali domestici", desc: "Gatti, cani — resistenza graffi e pelo" },
  { value: "bambini", label: "Ci sono bambini", desc: "Macchie frequenti, lavabilità importante" },
  { value: "pulizia_facile", label: "Voglio massima praticità", desc: "Smacchiabile con acqua, manutenzione zero" },
  { value: "sostenibile", label: "Preferisco materiali green", desc: "Cotone riciclato, certificazioni ambientali" },
  { value: "ignifugo", label: "Serve resistenza al fuoco", desc: "Contract, norma EN 1021, classe 1" },
];

const STEP3 = [
  { value: "economy", label: "Economy", desc: "Qualità solida, prezzo competitivo" },
  { value: "standard", label: "Standard", desc: "Il miglior rapporto qualità-prezzo" },
  { value: "premium", label: "Premium", desc: "Materiali selezionati, finiture di qualità" },
  { value: "luxury", label: "Luxury", desc: "Top di gamma, esclusivo" },
];

function scoreMatch(mat: Materiale, uso: string, caratteristiche: string[], budget: string): number {
  let score = 0;
  const tags = [...mat.tecnologie, ...mat.certificazioni].map((t) => t.toLowerCase());
  const desc = (mat.utilizzoConsigliato || "").toLowerCase();

  if (budget === mat.fasciaPrezzo) score += 3;
  if (uso === "outdoor" && mat.categoria === "outdoor") score += 4;
  if (uso === "nautica" && (mat.categoria === "outdoor" || desc.includes("nautica") || desc.includes("marino"))) score += 4;
  if (uso === "contract" && (desc.includes("contract") || tags.includes("ignifugo"))) score += 3;
  if (uso === "residenziale" && (mat.categoria === "tessuto" || mat.categoria === "pelle" || mat.categoria === "velluto")) score += 2;

  if (caratteristiche.includes("animali") && (tags.includes("pet-friendly") || tags.includes("aquaclean"))) score += 4;
  if (caratteristiche.includes("bambini") && (tags.includes("aquaclean") || tags.includes("smacchiabile"))) score += 4;
  if (caratteristiche.includes("pulizia_facile") && (tags.includes("aquaclean") || tags.includes("smacchiabile"))) score += 4;
  if (caratteristiche.includes("sostenibile") && (tags.some((t) => t.includes("grs")) || tags.some((t) => t.includes("green")))) score += 4;
  if (caratteristiche.includes("ignifugo") && tags.includes("ignifugo")) score += 5;

  return score;
}

const renderTechBadge = (tech: string) => {
  const n = tech.toLowerCase();
  if (n === "aquaclean") return <span key={tech} className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 text-[10px] font-medium px-2 py-0.5 rounded"><Droplets className="h-3 w-3" /> Aquaclean</span>;
  if (n === "pet-friendly") return <span key={tech} className="inline-flex items-center gap-1 bg-green-100 text-green-800 text-[10px] font-medium px-2 py-0.5 rounded"><PawPrint className="h-3 w-3" /> Pet Friendly</span>;
  if (n === "ignifugo") return <span key={tech} className="inline-flex items-center gap-1 bg-orange-100 text-orange-800 text-[10px] font-medium px-2 py-0.5 rounded"><Flame className="h-3 w-3" /> Ignifugo</span>;
  if (n === "smacchiabile") return <span key={tech} className="inline-flex items-center gap-1 bg-teal-100 text-teal-800 text-[10px] font-medium px-2 py-0.5 rounded"><Sparkles className="h-3 w-3" /> Smacchiabile</span>;
  return null;
};

const renderCertBadge = (cert: string) => {
  const n = cert.toLowerCase();
  if (n.includes("grs")) return <span key={cert} className="inline-flex items-center gap-1 border border-emerald-600 text-emerald-700 text-[10px] font-medium px-1.5 py-0.5 rounded"><Leaf className="h-3 w-3" /> GRS</span>;
  if (n.includes("safe-front")) return <span key={cert} className="inline-flex items-center gap-1 border border-slate-400 text-slate-600 text-[10px] font-medium px-1.5 py-0.5 rounded"><ShieldCheck className="h-3 w-3" /> SAFE-FRONT</span>;
  if (n.includes("aquaclean")) return <span key={cert} className="inline-flex items-center gap-1 border border-blue-400 text-blue-600 text-[10px] font-medium px-1.5 py-0.5 rounded"><BadgeCheck className="h-3 w-3" /> Aq. Cert.</span>;
  return null;
};

export default function Configuratore() {
  const [step, setStep] = useState(0);
  const [uso, setUso] = useState("");
  const [caratteristiche, setCaratteristiche] = useState<string[]>([]);
  const [budget, setBudget] = useState("");
  const [results, setResults] = useState<Materiale[] | null>(null);
  const [dialogMat, setDialogMat] = useState<Materiale | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [indirizzo, setIndirizzo] = useState("");

  const { data: allMateriali = [] } = useQuery<Materiale[]>({
    queryKey: ["public-materiali-all"],
    queryFn: async () => {
      const res = await fetch(`${BASE}/api/public/materiali`);
      return res.json();
    },
  });

  const submitMutation = useMutation({
    mutationFn: async (payload: object) => {
      const res = await fetch(`${BASE}/api/public/richiesta-campione`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Errore");
      return res.json();
    },
    onSuccess: () => setSubmitted(true),
  });

  const toggleCaratteristica = (v: string) => {
    setCaratteristiche((prev) => prev.includes(v) ? prev.filter((x) => x !== v) : [...prev, v]);
  };

  const computeResults = () => {
    const scored = allMateriali
      .map((m) => ({ mat: m, score: scoreMatch(m, uso, caratteristiche, budget) }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map((x) => x.mat);
    setResults(scored);
    setStep(3);
  };

  const resetAll = () => {
    setStep(0); setUso(""); setCaratteristiche([]); setBudget(""); setResults(null);
  };

  const resetDialog = () => {
    setDialogMat(null); setSubmitted(false);
    setNome(""); setEmail(""); setTelefono(""); setIndirizzo("");
  };

  const handleSubmit = () => {
    if (!dialogMat || !nome || !email) return;
    submitMutation.mutate({ nome, email, telefono, materialeId: dialogMat.id, materialeNome: dialogMat.nome, materialeCategoria: dialogMat.categoria, indirizzo, messaggio: `Configuratore: uso=${uso}, caratteristiche=${caratteristiche.join(",")}` });
  };

  const STEPS_TOTAL = 3;
  const progressPct = (step / STEPS_TOTAL) * 100;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-6 py-12 space-y-8">
        <div className="text-center space-y-2 border-b pb-6">
          <p className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">Intessuto Italia — Nuova Pugliatex S.r.l.</p>
          <h1 className="text-4xl font-serif tracking-tight">Trova il tuo materiale</h1>
          <p className="text-muted-foreground">3 domande, poi ti suggerisco i tessuti o le pelli più adatti a te.</p>
        </div>

        {step < 3 && (
          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-primary transition-all duration-500 rounded-full" style={{ width: `${progressPct}%` }} />
          </div>
        )}

        {step === 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Dove lo userai?</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {STEP1.map(({ value, label, desc, icon: Icon }) => (
                <button
                  key={value}
                  onClick={() => { setUso(value); setStep(1); }}
                  className={`text-left p-4 rounded-xl border-2 transition-all hover:border-primary hover:bg-primary/5 ${uso === value ? "border-primary bg-primary/5" : "border-border"}`}
                >
                  <Icon className="h-6 w-6 mb-2 text-primary" />
                  <p className="font-semibold">{label}</p>
                  <p className="text-sm text-muted-foreground">{desc}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Cosa è importante per te?</h2>
            <p className="text-sm text-muted-foreground">Puoi selezionare più opzioni.</p>
            <div className="space-y-2">
              {STEP2.map(({ value, label, desc }) => (
                <button
                  key={value}
                  onClick={() => toggleCaratteristica(value)}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all hover:border-primary hover:bg-primary/5 flex items-start gap-3 ${caratteristiche.includes(value) ? "border-primary bg-primary/5" : "border-border"}`}
                >
                  <div className={`mt-0.5 w-4 h-4 rounded border-2 flex-shrink-0 flex items-center justify-center ${caratteristiche.includes(value) ? "bg-primary border-primary" : "border-muted-foreground"}`}>
                    {caratteristiche.includes(value) && <div className="w-2 h-2 bg-white rounded-sm" />}
                  </div>
                  <div>
                    <p className="font-medium">{label}</p>
                    <p className="text-sm text-muted-foreground">{desc}</p>
                  </div>
                </button>
              ))}
            </div>
            <div className="flex gap-3 pt-2">
              <Button variant="outline" onClick={() => setStep(0)}><ChevronLeft className="h-4 w-4 mr-1" /> Indietro</Button>
              <Button onClick={() => setStep(2)} className="flex-1">Continua <ChevronRight className="h-4 w-4 ml-1" /></Button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Qual è il tuo budget?</h2>
            <div className="grid grid-cols-2 gap-3">
              {STEP3.map(({ value, label, desc }) => (
                <button
                  key={value}
                  onClick={() => setBudget(value)}
                  className={`text-left p-4 rounded-xl border-2 transition-all hover:border-primary hover:bg-primary/5 ${budget === value ? "border-primary bg-primary/5" : "border-border"}`}
                >
                  <p className="font-semibold capitalize">{label}</p>
                  <p className="text-sm text-muted-foreground">{desc}</p>
                </button>
              ))}
            </div>
            <div className="flex gap-3 pt-2">
              <Button variant="outline" onClick={() => setStep(1)}><ChevronLeft className="h-4 w-4 mr-1" /> Indietro</Button>
              <Button onClick={computeResults} disabled={!budget} className="flex-1">
                Trova i materiali <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        )}

        {step === 3 && results && (
          <div className="space-y-6">
            <div className="text-center space-y-1">
              <h2 className="text-2xl font-semibold">I tuoi materiali consigliati</h2>
              <p className="text-muted-foreground text-sm">Selezionati in base alle tue preferenze — richiedi un campione gratuito.</p>
            </div>
            {results.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">Nessun materiale trovato. Prova a cambiare le preferenze.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {results.map((mat, i) => (
                  <Card key={mat.id} className="overflow-hidden flex flex-col hover:shadow-md transition-shadow relative">
                    {i === 0 && <div className="absolute top-3 left-3 bg-primary text-primary-foreground text-[10px] font-semibold px-2 py-0.5 rounded-full">✦ Miglior match</div>}
                    <div className="h-36 bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center">
                      <Package className="h-10 w-10 text-muted-foreground/20" />
                    </div>
                    <CardHeader className="p-3 pb-1">
                      {mat.collezione && <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-1">{mat.collezione}</p>}
                      <CardTitle className="text-sm leading-tight">{mat.nome}</CardTitle>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="capitalize text-[10px]">{mat.categoria}</Badge>
                        <span className="text-[10px] text-muted-foreground capitalize">{mat.fasciaPrezzo}</span>
                      </div>
                      {(mat.tecnologie.length > 0 || mat.certificazioni.length > 0) && (
                        <div className="flex flex-wrap gap-1 mt-2 pt-2 border-t">
                          {mat.tecnologie.map(renderTechBadge)}
                          {mat.certificazioni.map(renderCertBadge)}
                        </div>
                      )}
                    </CardHeader>
                    <CardContent className="p-3 pt-1 flex-1">
                      <p className="text-xs text-muted-foreground line-clamp-2">{mat.utilizzoConsigliato}</p>
                    </CardContent>
                    <CardFooter className="p-3 pt-0">
                      <Button size="sm" className="w-full text-xs" onClick={() => setDialogMat(mat)}>
                        Richiedi campione
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
            <div className="text-center pt-2">
              <Button variant="ghost" onClick={resetAll}>← Ricomincia il configuratore</Button>
            </div>
          </div>
        )}

        <p className="text-center text-xs text-muted-foreground pb-4">
          Intessuto Italia — Nuova Pugliatex S.r.l. · Noci (BA) · info@intessuto.it
        </p>
      </div>

      <Dialog open={!!dialogMat} onOpenChange={(open) => { if (!open) resetDialog(); }}>
        <DialogContent className="max-w-md">
          {!submitted ? (
            <>
              <DialogHeader>
                <DialogTitle>Richiedi campione gratuito</DialogTitle>
                <DialogDescription>{dialogMat?.nome} — spedizione gratuita, entro 5 giorni lavorativi.</DialogDescription>
              </DialogHeader>
              <div className="space-y-3 py-2">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label>Nome e cognome *</Label>
                    <Input placeholder="Mario Rossi" value={nome} onChange={(e) => setNome(e.target.value)} />
                  </div>
                  <div className="space-y-1">
                    <Label>Email *</Label>
                    <Input type="email" placeholder="mario@email.it" value={email} onChange={(e) => setEmail(e.target.value)} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label>Telefono</Label>
                    <Input placeholder="+39 333 000 0000" value={telefono} onChange={(e) => setTelefono(e.target.value)} />
                  </div>
                  <div className="space-y-1">
                    <Label>Indirizzo spedizione</Label>
                    <Input placeholder="Via Roma 1, Noci BA" value={indirizzo} onChange={(e) => setIndirizzo(e.target.value)} />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={resetDialog}>Annulla</Button>
                <Button onClick={handleSubmit} disabled={!nome || !email || submitMutation.isPending}>
                  {submitMutation.isPending ? "Invio..." : "Invia richiesta"}
                </Button>
              </DialogFooter>
            </>
          ) : (
            <div className="py-8 text-center space-y-4">
              <CheckCircle2 className="h-14 w-14 text-green-500 mx-auto" />
              <h3 className="text-xl font-semibold">Richiesta inviata!</h3>
              <p className="text-muted-foreground">Ti contatteremo presto per confermare la spedizione del campione di <strong>{dialogMat?.nome}</strong>.</p>
              <Button onClick={resetDialog}>Chiudi</Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
