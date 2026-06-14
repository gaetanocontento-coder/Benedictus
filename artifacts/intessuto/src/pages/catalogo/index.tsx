import { useState } from "react";
import { useListMateriali, getListMaterialiQueryKey, MaterialeCategoria, MaterialeFasciaPrezzo, useListClienti, getListClientiQueryKey, useCreateCampione, getListCampioniQueryKey, RichiestaCampioneStatoSpedizione } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Package, Plus, SearchCheck, Droplets, PawPrint, Flame, Sparkles, Leaf, ShieldCheck, BadgeCheck } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { Label } from "@/components/ui/label";

const renderTechBadge = (tech: string) => {
  const normalized = tech.toLowerCase();
  if (normalized === "aquaclean") {
    return <span key={tech} className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 text-[10px] font-medium px-2 py-0.5 rounded"><Droplets className="h-3 w-3" /> Aquaclean</span>;
  }
  if (normalized === "pet-friendly") {
    return <span key={tech} className="inline-flex items-center gap-1 bg-green-100 text-green-800 text-[10px] font-medium px-2 py-0.5 rounded"><PawPrint className="h-3 w-3" /> Pet Friendly</span>;
  }
  if (normalized === "ignifugo") {
    return <span key={tech} className="inline-flex items-center gap-1 bg-orange-100 text-orange-800 text-[10px] font-medium px-2 py-0.5 rounded"><Flame className="h-3 w-3" /> Ignifugo Cl.1</span>;
  }
  if (normalized === "smacchiabile") {
    return <span key={tech} className="inline-flex items-center gap-1 bg-teal-100 text-teal-800 text-[10px] font-medium px-2 py-0.5 rounded"><Sparkles className="h-3 w-3" /> Smacchiabile</span>;
  }
  return null;
};

const renderCertBadge = (cert: string) => {
  const normalized = cert.toLowerCase();
  if (normalized.includes("grs")) {
    return <span key={cert} className="inline-flex items-center gap-1 border border-emerald-600 text-emerald-700 text-[10px] font-medium px-1.5 py-0.5 rounded"><Leaf className="h-3 w-3" /> GRS Certified</span>;
  }
  if (normalized.includes("safe-front")) {
    return <span key={cert} className="inline-flex items-center gap-1 border border-slate-400 text-slate-600 text-[10px] font-medium px-1.5 py-0.5 rounded"><ShieldCheck className="h-3 w-3" /> SAFE-FRONT</span>;
  }
  if (normalized.includes("aquaclean")) {
    return <span key={cert} className="inline-flex items-center gap-1 border border-blue-400 text-blue-600 text-[10px] font-medium px-1.5 py-0.5 rounded"><BadgeCheck className="h-3 w-3" /> Aquaclean Cert.</span>;
  }
  return <span key={cert} className="inline-flex items-center gap-1 border border-slate-300 text-slate-600 text-[10px] font-medium px-1.5 py-0.5 rounded">{cert}</span>;
};

export default function Catalogo() {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoriaFilter, setCategoriaFilter] = useState<string>("all");
  const [techFilter, setTechFilter] = useState<string>("all");
  const [selectedMaterialId, setSelectedMaterialId] = useState<number | null>(null);
  const [selectedClienteId, setSelectedClienteId] = useState<string>("");
  const [agente, setAgente] = useState("");
  const [campioneDialogOpen, setCampioneDialogOpen] = useState(false);

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: materiali, isLoading } = useListMateriali(
    { categoria: categoriaFilter !== "all" ? categoriaFilter : undefined },
    { query: { queryKey: getListMaterialiQueryKey({ categoria: categoriaFilter !== "all" ? categoriaFilter : undefined }) } }
  );

  const { data: clienti } = useListClienti({
    query: { queryKey: getListClientiQueryKey() }
  });

  const createCampione = useCreateCampione();

  const filteredMateriali = materiali?.filter(mat => {
    const matchesSearch = mat.nome.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          mat.colore.toLowerCase().includes(searchTerm.toLowerCase());
                          
    let matchesTech = true;
    if (techFilter !== "all") {
      const allTags = [...(mat.tecnologie || []), ...(mat.certificazioni || [])].map(t => t.toLowerCase());
      matchesTech = allTags.some(t => t.includes(techFilter.toLowerCase()));
    }
    
    return matchesSearch && matchesTech;
  });

  const handleRichiediCampione = () => {
    if (!selectedMaterialId || !selectedClienteId) return;

    createCampione.mutate(
      {
        data: {
          clienteId: Number(selectedClienteId),
          materialeId: selectedMaterialId,
          dataRichiesta: new Date().toISOString(),
          statoSpedizione: RichiestaCampioneStatoSpedizione.in_attesa,
          note: agente.trim() ? `Agente: ${agente.trim()} — ` : undefined
        }
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListCampioniQueryKey() });
          toast({ title: "Richiesta campione registrata" });
          setCampioneDialogOpen(false);
          setSelectedMaterialId(null);
          setSelectedClienteId("");
          setAgente("");
        }
      }
    );
  };

  const getPrezzoColor = (fascia: MaterialeFasciaPrezzo) => {
    switch(fascia) {
      case 'luxury': return 'text-purple-600 bg-purple-100 dark:bg-purple-900/30 dark:text-purple-300';
      case 'premium': return 'text-amber-600 bg-amber-100 dark:bg-amber-900/30 dark:text-amber-300';
      case 'standard': return 'text-blue-600 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300';
      case 'economy': return 'text-slate-600 bg-slate-100 dark:bg-slate-900/30 dark:text-slate-300';
      default: return '';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-serif tracking-tight">Catalogo Materiali</h1>
          <p className="text-muted-foreground mt-1">Esplora collezioni, verifica disponibilità e ordina campioni.</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 bg-card p-4 rounded-xl border">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Cerca per nome o colore..." 
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="w-full sm:w-56">
          <Select value={categoriaFilter} onValueChange={setCategoriaFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Tutte le categorie" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tutte le categorie</SelectItem>
              {Object.values(MaterialeCategoria).map((cat) => (
                <SelectItem key={cat} value={cat} className="capitalize">
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="w-full sm:w-56">
          <Select value={techFilter} onValueChange={setTechFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Tutte le tecnologie" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tutte le tecnologie</SelectItem>
              <SelectItem value="aquaclean">Aquaclean</SelectItem>
              <SelectItem value="greenfabrics">GreenFabrics (GRS)</SelectItem>
              <SelectItem value="safe-front">SAFE-FRONT</SelectItem>
              <SelectItem value="ignifugo">Ignifugo</SelectItem>
              <SelectItem value="pet-friendly">Pet Friendly</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array(8).fill(0).map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <Skeleton className="h-40 w-full rounded-none" />
              <CardContent className="p-4"><Skeleton className="h-6 w-3/4 mb-2" /><Skeleton className="h-4 w-1/2" /></CardContent>
              <CardFooter className="p-4 pt-0 gap-2"><Skeleton className="h-9 flex-1" /><Skeleton className="h-9 flex-1" /></CardFooter>
            </Card>
          ))}
        </div>
      ) : filteredMateriali?.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          Nessun materiale trovato.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredMateriali?.map((mat) => (
            <Card key={mat.id} className="overflow-hidden flex flex-col">
              <div className="h-40 bg-muted flex items-center justify-center relative">
                <Package className="h-12 w-12 text-muted-foreground/30" />
                <Badge 
                  variant={mat.disponibile ? "default" : "destructive"} 
                  className="absolute top-3 right-3"
                >
                  {mat.disponibile ? "Disponibile" : "Esaurito"}
                </Badge>
              </div>
              <CardHeader className="p-4 pb-2">
                {mat.collezione && (
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-1">{mat.collezione}</p>
                )}
                <div className="flex justify-between items-start gap-2">
                  <CardTitle className="text-lg leading-tight">{mat.nome}</CardTitle>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="outline" className="capitalize text-xs font-normal">{mat.categoria}</Badge>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getPrezzoColor(mat.fasciaPrezzo)}`}>
                    {mat.fasciaPrezzo}
                  </span>
                </div>
                {((mat.tecnologie && mat.tecnologie.length > 0) || (mat.certificazioni && mat.certificazioni.length > 0)) && (
                  <div className="flex flex-wrap gap-1.5 mt-3 pt-2 border-t">
                    {mat.tecnologie?.map(renderTechBadge)}
                    {mat.certificazioni?.map(renderCertBadge)}
                  </div>
                )}
              </CardHeader>
              <CardContent className="p-4 pt-2 flex-1">
                <div className="text-sm text-muted-foreground mb-1">
                  <span className="font-medium text-foreground">Colore:</span> {mat.colore}
                </div>
                <div className="text-sm text-muted-foreground line-clamp-2">
                  {mat.utilizzoConsigliato}
                </div>
              </CardContent>
              <CardFooter className="p-4 pt-0 gap-2">
                <Button 
                  variant="outline" 
                  className="flex-1 text-xs px-0" 
                  disabled={!mat.disponibile}
                  onClick={() => {
                    setSelectedMaterialId(mat.id);
                    setCampioneDialogOpen(true);
                  }}
                >
                  <SearchCheck className="mr-1 h-3 w-3" /> Campione
                </Button>
                <Button className="flex-1 text-xs px-0">
                  <Plus className="mr-1 h-3 w-3" /> Proposta
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={campioneDialogOpen} onOpenChange={setCampioneDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Richiedi Campione</DialogTitle>
            <DialogDescription>
              Seleziona il cliente a cui inviare il campione del materiale.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="space-y-2">
              <Label>Cliente Destinatario</Label>
              <Select value={selectedClienteId} onValueChange={setSelectedClienteId}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleziona cliente..." />
                </SelectTrigger>
                <SelectContent>
                  {clienti?.map((c) => (
                    <SelectItem key={c.id} value={c.id.toString()}>
                      {c.nomeAzienda} - {c.referente}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Agente di zona (opzionale)</Label>
              <Input 
                placeholder="Es. Mario Rossi"
                value={agente}
                onChange={e => setAgente(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCampioneDialogOpen(false)}>Annulla</Button>
            <Button onClick={handleRichiediCampione} disabled={!selectedClienteId || createCampione.isPending}>
              {createCampione.isPending ? "Invio..." : "Conferma Richiesta"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
}
