import { useParams, Link } from "wouter";
import { useGetProposta, useUpdateProposta, getGetPropostaQueryKey, getListProposteQueryKey, PropostaStato, useListMateriali, getListMaterialiQueryKey } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Printer, Droplets, PawPrint, Flame, Sparkles, Leaf, ShieldCheck, BadgeCheck } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";

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

export default function PropostaDetail() {
  const params = useParams();
  const id = Number(params.id);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: proposta, isLoading } = useGetProposta(id, {
    query: { enabled: !!id, queryKey: getGetPropostaQueryKey(id) }
  });

  const { data: materiali } = useListMateriali({}, { 
    query: { queryKey: getListMaterialiQueryKey({}), enabled: !!proposta } 
  });

  const updateProposta = useUpdateProposta();

  const handleStatusChange = (newStato: string) => {
    updateProposta.mutate(
      { id, data: { stato: newStato } },
      {
        onSuccess: (updated) => {
          queryClient.setQueryData(getGetPropostaQueryKey(id), updated);
          queryClient.invalidateQueries({ queryKey: getListProposteQueryKey() });
          toast({ title: "Stato proposta aggiornato" });
        }
      }
    );
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(value);
  };

  const getStatoBadgeStyle = (stato: string) => {
    switch(stato) {
      case 'bozza': return 'bg-slate-100 text-slate-800 border-slate-200';
      case 'inviata': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'accettata': return 'bg-green-100 text-green-800 border-green-200';
      case 'rifiutata': return 'bg-red-100 text-red-800 border-red-200';
      default: return '';
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-4xl mx-auto">
        <div className="flex gap-4"><Skeleton className="h-8 w-8" /><Skeleton className="h-8 w-64" /></div>
        <Skeleton className="h-[400px] w-full" />
      </div>
    );
  }

  if (!proposta) return <div>Proposta non trovata</div>;

  const propostaMateriali = materiali?.filter(m => proposta.items.some(i => i.materialeId === m.id)) || [];

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <Link href="/proposte">
            <Button variant="outline" size="icon" className="h-8 w-8">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-serif tracking-tight">Proposta PR-{String(proposta.id).padStart(4, '0')}</h1>
              <Badge className={`${getStatoBadgeStyle(proposta.stato)} capitalize font-normal`} variant="secondary">
                {proposta.stato}
              </Badge>
            </div>
            <p className="text-muted-foreground mt-1 text-sm">
              Per <strong>{proposta.clienteNome}</strong> • Creato il {new Date(proposta.createdAt).toLocaleDateString('it-IT')}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" className="gap-2">
            <Printer className="h-4 w-4" /> Stampa
          </Button>
          <Select value={proposta.stato} onValueChange={handleStatusChange} disabled={updateProposta.isPending}>
            <SelectTrigger className="w-[160px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.values(PropostaStato).map((stato) => (
                <SelectItem key={stato} value={stato} className="capitalize">
                  {stato === 'inviata' ? 'Invia a cliente' : stato}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card>
        <CardHeader className="border-b bg-muted/20">
          <CardTitle>Dettaglio Articoli</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/10 hover:bg-muted/10">
                <TableHead className="px-6 py-4">Materiale</TableHead>
                <TableHead className="text-right py-4">Q.tà (ml/mq)</TableHead>
                <TableHead className="text-right py-4">Prezzo Unit.</TableHead>
                <TableHead className="text-right px-6 py-4">Importo</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {proposta.items.map((item, idx) => (
                <TableRow key={idx}>
                  <TableCell className="px-6 py-4 font-medium">{item.materialeNome}</TableCell>
                  <TableCell className="text-right py-4">{item.quantita}</TableCell>
                  <TableCell className="text-right py-4">{formatCurrency(item.prezzoUnitario)}</TableCell>
                  <TableCell className="text-right px-6 py-4 font-medium">{formatCurrency(item.quantita * item.prezzoUnitario)}</TableCell>
                </TableRow>
              ))}
              <TableRow className="bg-muted/10 hover:bg-muted/10">
                <TableCell colSpan={3} className="text-right px-6 py-5 font-serif text-lg">Totale Proposta</TableCell>
                <TableCell className="text-right px-6 py-5 font-serif text-2xl font-semibold text-primary">
                  {formatCurrency(proposta.totale)}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {propostaMateriali.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Scheda Tecnica Materiali</CardTitle>
            <CardDescription>Caratteristiche e certificazioni dei materiali inclusi</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {propostaMateriali.map(mat => (
              <div key={mat.id} className="space-y-2 border-b last:border-0 pb-4 last:pb-0">
                <div className="flex flex-col gap-1.5">
                  <h4 className="font-bold text-base">{mat.nome}</h4>
                  
                  {((mat.tecnologie && mat.tecnologie.length > 0) || (mat.certificazioni && mat.certificazioni.length > 0)) && (
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {mat.tecnologie?.map(renderTechBadge)}
                      {mat.certificazioni?.map(renderCertBadge)}
                    </div>
                  )}
                  
                  <div className="text-xs text-muted-foreground mt-2 space-y-1">
                    {mat.tecnologie?.map(tech => {
                      const t = tech.toLowerCase();
                      if (t === "aquaclean") return <p key={tech}><strong>Aquaclean:</strong> lavabile con sola acqua, macchie rimovibili senza detergenti</p>;
                      if (t === "ignifugo") return <p key={tech}><strong>Ignifugo Cl.1:</strong> conforme normative antincendio</p>;
                      return null;
                    })}
                    {mat.certificazioni?.map(cert => {
                      const c = cert.toLowerCase();
                      if (c.includes("grs")) return <p key={cert}><strong>GRS:</strong> cotone 100% rigenerato certificato Global Recycled Standard</p>;
                      if (c.includes("safe-front")) return <p key={cert}><strong>SAFE-FRONT:</strong> superficie antibatterica testata</p>;
                      return null;
                    })}
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
      
      {proposta.note && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Note</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">{proposta.note}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
