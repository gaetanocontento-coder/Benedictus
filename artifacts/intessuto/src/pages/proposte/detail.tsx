import { useParams, Link } from "wouter";
import { useGetProposta, useUpdateProposta, getGetPropostaQueryKey, getListProposteQueryKey, PropostaStato } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Printer, Send } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";

export default function PropostaDetail() {
  const params = useParams();
  const id = Number(params.id);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: proposta, isLoading } = useGetProposta(id, {
    query: { enabled: !!id, queryKey: getGetPropostaQueryKey(id) }
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
