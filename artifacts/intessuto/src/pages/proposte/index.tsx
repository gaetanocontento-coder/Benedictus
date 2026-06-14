import { Link } from "wouter";
import { useListProposte, getListProposteQueryKey, PropostaStato } from "@workspace/api-client-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, FileText } from "lucide-react";

export default function Proposte() {
  const { data: proposte, isLoading } = useListProposte({
    query: { queryKey: getListProposteQueryKey() }
  });

  const getStatoBadgeStyle = (stato: PropostaStato) => {
    switch(stato) {
      case 'bozza': return 'bg-slate-100 text-slate-800 border-slate-200';
      case 'inviata': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'accettata': return 'bg-green-100 text-green-800 border-green-200';
      case 'rifiutata': return 'bg-red-100 text-red-800 border-red-200';
      default: return '';
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(value);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-serif tracking-tight">Proposte Commerciali</h1>
          <p className="text-muted-foreground mt-1">Genera e gestisci i preventivi per i clienti.</p>
        </div>
        <Link href="/proposte/new">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Nuova Proposta
          </Button>
        </Link>
      </div>

      <div className="bg-card border rounded-xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Data</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Articoli</TableHead>
              <TableHead className="text-right">Totale</TableHead>
              <TableHead>Stato</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array(5).fill(0).map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-5 w-12" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                  <TableCell className="text-right"><Skeleton className="h-5 w-20 ml-auto" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-24 rounded-full" /></TableCell>
                </TableRow>
              ))
            ) : proposte?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                  <FileText className="h-8 w-8 mx-auto mb-3 opacity-20" />
                  Nessuna proposta trovata.
                </TableCell>
              </TableRow>
            ) : (
              proposte?.map((proposta) => (
                <TableRow key={proposta.id} className="cursor-pointer hover:bg-muted/50 transition-colors">
                  <TableCell className="font-mono text-sm text-muted-foreground">
                    <Link href={`/proposte/${proposta.id}`} className="block w-full">
                      PR-{String(proposta.id).padStart(4, '0')}
                    </Link>
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    <Link href={`/proposte/${proposta.id}`} className="block w-full">
                      {new Date(proposta.createdAt).toLocaleDateString('it-IT')}
                    </Link>
                  </TableCell>
                  <TableCell className="font-medium">
                    <Link href={`/proposte/${proposta.id}`} className="block w-full">
                      {proposta.clienteNome}
                    </Link>
                  </TableCell>
                  <TableCell>
                    {proposta.items?.length || 0}
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {formatCurrency(proposta.totale)}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className={`${getStatoBadgeStyle(proposta.stato)} border font-medium capitalize`}>
                      {proposta.stato}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
