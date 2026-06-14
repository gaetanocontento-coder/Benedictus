import { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Search, Package, Droplets, PawPrint, Flame, Sparkles, Leaf, ShieldCheck, BadgeCheck, CheckCircle2 } from "lucide-react";
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
  stagione: string | null;
};

const renderTechBadge = (tech: string) => {
  const n = tech.toLowerCase();
  if (n === "aquaclean") return <span key={tech} className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 text-[10px] font-medium px-2 py-0.5 rounded"><Droplets className="h-3 w-3" /> Aquaclean</span>;
  if (n === "pet-friendly") return <span key={tech} className="inline-flex items-center gap-1 bg-green-100 text-green-800 text-[10px] font-medium px-2 py-0.5 rounded"><PawPrint className="h-3 w-3" /> Pet Friendly</span>;
  if (n === "ignifugo") return <span key={tech} className="inline-flex items-center gap-1 bg-orange-100 text-orange-800 text-[10px] font-medium px-2 py-0.5 rounded"><Flame className="h-3 w-3" /> Ignifugo Cl.1</span>;
  if (n === "smacchiabile") return <span key={tech} className="inline-flex items-center gap-1 bg-teal-100 text-teal-800 text-[10px] font-medium px-2 py-0.5 rounded"><Sparkles className="h-3 w-3" /> Smacchiabile</span>;
  return null;
};

const renderCertBadge = (cert: string) => {
  const n = cert.toLowerCase();
  if (n.includes("grs")) return <span key={cert} className="inline-flex items-center gap-1 border border-emerald-600 text-emerald-700 text-[10px] font-medium px-1.5 py-0.5 rounded"><Leaf className="h-3 w-3" /> GRS Certified</span>;
  if (n.includes("safe-front")) return <span key={cert} className="inline-flex items-center gap-1 border border-slate-400 text-slate-600 text-[10px] font-medium px-1.5 py-0.5 rounded"><ShieldCheck className="h-3 w-3" /> SAFE-FRONT</span>;
  if (n.includes("aquaclean")) return <span key={cert} className="inline-flex items-center gap-1 border border-blue-400 text-blue-600 text-[10px] font-medium px-1.5 py-0.5 rounded"><BadgeCheck className="h-3 w-3" /> Aquaclean Cert.</span>;
  return <span key={cert} className="inline-flex items-center gap-1 border border-slate-300 text-slate-600 text-[10px] font-medium px-1.5 py-0.5 rounded">{cert}</span>;
};

const CATEGORIE = ["tessuto", "pelle", "outdoor", "tecnico", "velluto"];
const TECH_OPTIONS = [
  { value: "aquaclean", label: "Aquaclean" },
  { value: "greenfabrics", label: "GreenFabrics (GRS)" },
  { value: "safe-front", label: "SAFE-FRONT" },
  { value: "ignifugo", label: "Ignifugo" },
  { value: "pet-friendly", label: "Pet Friendly" },
];

async function fetchMateriali(categoria?: string): Promise<Materiale[]> {
  const url = categoria
    ? `${BASE}/api/public/materiali?categoria=${categoria}`
    : `${BASE}/api/public/materiali`;
  const res = await fetch(url);
  return res.json();
}

export default function Shop() {
  const [search, setSearch] = useState("");
  const [categoriaFilter, setCategoriaFilter] = useState("all");
  const [techFilter, setTechFilter] = useState("all");
  const [dialogMat, setDialogMat] = useState<Materiale | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const [nome, setNome] = useState("");
  const [azienda, setAzienda] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [indirizzo, setIndirizzo] = useState("");
  const [messaggio, setMessaggio] = useState("");

  const { data: materiali = [], isLoading } = useQuery({
    queryKey: ["public-materiali", categoriaFilter],
    queryFn: () => fetchMateriali(categoriaFilter !== "all" ? categoriaFilter : undefined),
  });

  const submitMutation = useMutation({
    mutationFn: async (payload: object) => {
      const res = await fetch(`${BASE}/api/public/richiesta-campione`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Errore invio");
      return res.json();
    },
    onSuccess: () => setSubmitted(true),
  });

  const filtered = materiali.filter((m) => {
    const matchSearch = m.nome.toLowerCase().includes(search.toLowerCase()) || m.colore.toLowerCase().includes(search.toLowerCase());
    let matchTech = true;
    if (techFilter !== "all") {
      const tags = [...m.tecnologie, ...m.certificazioni].map((t) => t.toLowerCase());
      matchTech = tags.some((t) => t.includes(techFilter));
    }
    return matchSearch && matchTech;
  });

  const handleSubmit = () => {
    if (!dialogMat || !nome || !email) return;
    submitMutation.mutate({
      nome,
      azienda,
      email,
      telefono,
      materialeId: dialogMat.id,
      materialeNome: dialogMat.nome,
      materialeCategoria: dialogMat.categoria,
      indirizzo,
      messaggio,
    });
  };

  const resetDialog = () => {
    setDialogMat(null);
    setSubmitted(false);
    setNome(""); setAzienda(""); setEmail(""); setTelefono(""); setIndirizzo(""); setMessaggio("");
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-6 py-12 space-y-10">
        <div className="text-center space-y-3 pb-4 border-b">
          <p className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">Intessuto Italia — Nuova Pugliatex S.r.l.</p>
          <h1 className="text-4xl font-serif tracking-tight">Catalogo Materiali</h1>
          <p className="text-muted-foreground max-w-xl mx-auto">Esplora le nostre collezioni di tessuti, pelle e materiali tecnici. Richiedi gratuitamente un campione direttamente a casa tua o in azienda.</p>
          <div className="flex justify-center gap-3 pt-2 flex-wrap">
            <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 text-xs font-medium px-3 py-1 rounded-full"><Droplets className="h-3.5 w-3.5" /> Aquaclean</span>
            <span className="inline-flex items-center gap-1 bg-green-100 text-green-800 text-xs font-medium px-3 py-1 rounded-full"><PawPrint className="h-3.5 w-3.5" /> Pet Friendly</span>
            <span className="inline-flex items-center gap-1 border border-emerald-600 text-emerald-700 text-xs font-medium px-3 py-1 rounded-full"><Leaf className="h-3.5 w-3.5" /> GRS Certified</span>
            <span className="inline-flex items-center gap-1 bg-orange-100 text-orange-800 text-xs font-medium px-3 py-1 rounded-full"><Flame className="h-3.5 w-3.5" /> Ignifugo Cl.1</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 bg-card p-4 rounded-xl border">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Cerca per nome o colore..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <Select value={categoriaFilter} onValueChange={setCategoriaFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Categoria" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tutte le categorie</SelectItem>
              {CATEGORIE.map((c) => <SelectItem key={c} value={c} className="capitalize">{c}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={techFilter} onValueChange={setTechFilter}>
            <SelectTrigger className="w-full sm:w-52">
              <SelectValue placeholder="Tecnologia" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tutte le tecnologie</SelectItem>
              {TECH_OPTIONS.map((t) => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array(8).fill(0).map((_, i) => (
              <Card key={i} className="overflow-hidden animate-pulse">
                <div className="h-44 bg-muted" />
                <CardContent className="p-4"><div className="h-5 bg-muted rounded mb-2" /><div className="h-4 bg-muted rounded w-2/3" /></CardContent>
              </Card>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">Nessun materiale corrisponde ai filtri selezionati.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map((mat) => (
              <Card key={mat.id} className="overflow-hidden flex flex-col hover:shadow-md transition-shadow">
                <div className="h-44 bg-gradient-to-br from-muted to-muted/60 flex items-center justify-center relative">
                  <Package className="h-14 w-14 text-muted-foreground/20" />
                  <Badge className="absolute top-3 right-3" variant="default">Disponibile</Badge>
                </div>
                <CardHeader className="p-4 pb-2">
                  {mat.collezione && <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-1">{mat.collezione}</p>}
                  <CardTitle className="text-base leading-tight">{mat.nome}</CardTitle>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className="capitalize text-xs font-normal">{mat.categoria}</Badge>
                    <span className="text-xs text-muted-foreground">{mat.fasciaPrezzo}</span>
                  </div>
                  {(mat.tecnologie.length > 0 || mat.certificazioni.length > 0) && (
                    <div className="flex flex-wrap gap-1.5 mt-2 pt-2 border-t">
                      {mat.tecnologie.map(renderTechBadge)}
                      {mat.certificazioni.map(renderCertBadge)}
                    </div>
                  )}
                </CardHeader>
                <CardContent className="p-4 pt-1 flex-1">
                  <p className="text-sm text-muted-foreground"><span className="font-medium text-foreground">Colore:</span> {mat.colore}</p>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{mat.utilizzoConsigliato}</p>
                </CardContent>
                <CardFooter className="p-4 pt-0">
                  <Button className="w-full" onClick={() => setDialogMat(mat)}>
                    Richiedi campione gratuito
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}

        <p className="text-center text-xs text-muted-foreground pb-6">
          Intessuto Italia — Nuova Pugliatex S.r.l. · Noci (BA) · +39 080 000 0000 · info@intessuto.it
        </p>
      </div>

      <Dialog open={!!dialogMat} onOpenChange={(open) => { if (!open) resetDialog(); }}>
        <DialogContent className="max-w-md">
          {!submitted ? (
            <>
              <DialogHeader>
                <DialogTitle>Richiedi campione gratuito</DialogTitle>
                <DialogDescription>
                  {dialogMat?.nome} — riceverai il campione entro 5 giorni lavorativi, senza costi.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-3 py-2">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label>Nome e cognome *</Label>
                    <Input placeholder="Mario Rossi" value={nome} onChange={(e) => setNome(e.target.value)} />
                  </div>
                  <div className="space-y-1">
                    <Label>Azienda (opzionale)</Label>
                    <Input placeholder="Studio Rossi" value={azienda} onChange={(e) => setAzienda(e.target.value)} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label>Email *</Label>
                    <Input type="email" placeholder="mario@email.it" value={email} onChange={(e) => setEmail(e.target.value)} />
                  </div>
                  <div className="space-y-1">
                    <Label>Telefono</Label>
                    <Input placeholder="+39 333 000 0000" value={telefono} onChange={(e) => setTelefono(e.target.value)} />
                  </div>
                </div>
                <div className="space-y-1">
                  <Label>Indirizzo di spedizione</Label>
                  <Input placeholder="Via Roma 1, 70015 Noci BA" value={indirizzo} onChange={(e) => setIndirizzo(e.target.value)} />
                </div>
                <div className="space-y-1">
                  <Label>Messaggio (opzionale)</Label>
                  <Textarea placeholder="Es. sto cercando un tessuto per 3 divani..." rows={2} value={messaggio} onChange={(e) => setMessaggio(e.target.value)} />
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
              <p className="text-muted-foreground">Ti contatteremo entro 24 ore per confermare la spedizione del campione di <strong>{dialogMat?.nome}</strong>.</p>
              <Button onClick={resetDialog}>Chiudi</Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
