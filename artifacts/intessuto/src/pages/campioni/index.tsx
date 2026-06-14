import { useState } from "react";
import { useListCampioni, useUpdateCampione, getListCampioniQueryKey, RichiestaCampioneStatoSpedizione } from "@workspace/api-client-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { Package, AlertTriangle } from "lucide-react";

export default function Campioni() {
  const [statoFilter, setStatoFilter] = useState<string>("all");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: campioni, isLoading } = useListCampioni(
    { stato: statoFilter !== "all" ? statoFilter : undefined },
    { query: { queryKey: getListCampioniQueryKey({ stato: statoFilter !== "all" ? statoFilter : undefined }) } }
  );

  const updateCampione = useUpdateCampione();

  const handleStatusChange = (id: number, newStato: string) => {
    updateCampione.mutate(
      { id, data: { statoSpedizione: newStato } },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListCampioniQueryKey() });
          toast({ title: "Stato spedizione aggiornato" });
        }
      }
    );
  };

  const getStatoBadgeStyle = (stato: string) => {
    switch(stato) {
      case 'in_attesa': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'preparazione': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'spedito': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'consegnato': return 'bg-green-100 text-green-800 border-green-200';
      default: return '';
    }
  };

  const campioniFollowUp = campioni?.filter((c) => {
    if (c.statoSpedizione !== "spedito") return false;
    const reqDate = new Date(c.dataRichiesta);
    const diffTime = Math.abs(new Date().getTime() - reqDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 7;
  }) || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-serif tracking-tight">Richieste Campioni</h1>
          <p className="text-muted-foreground mt-1">Monitora lo stato di invio dei materiali ai clienti.</p>
        </div>
        
        <div className="w-full sm:w-64">
          <Select value={statoFilter} onValueChange={setStatoFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filtra per stato" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tutti gli stati</SelectItem>
              {Object.values(RichiestaCampioneStatoSpedizione).map((stato) => (
                <SelectItem key={stato} value={stato} className="capitalize">
                  {stato.replace('_', ' ')}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {campioniFollowUp.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 border-l-4 border-l-amber-500 rounded-md p-4 text-amber-900 shadow-sm">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-sm mb-1">
                {campioniFollowUp.length} campioni in attesa di feedback <span className="font-normal opacity-80">— Inviati da oltre 7 giorni senza risposta.</span>
              </p>
              <ul className="text-xs space-y-1 mt-2 font-medium opacity-90">
                {campioniFollowUp.map(c => (
                  <li key={c.id}>• {c.clienteNome} — {c.materialeNome} <span className="opacity-70 font-normal">(inviato il {new Date(c.dataRichiesta).toLocaleDateString('it-IT')})</span></li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      <div className="bg-card border rounded-xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Data Richiesta</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Materiale</TableHead>
              <TableHead>Stato Spedizione</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array(5).fill(0).map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-40" /></TableCell>
                  <TableCell><Skeleton className="h-8 w-32 rounded-md" /></TableCell>
                </TableRow>
              ))
            ) : campioni?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-12 text-muted-foreground">
                  <Package className="h-8 w-8 mx-auto mb-3 opacity-20" />
                  Nessuna richiesta campioni trovata.
                </TableCell>
              </TableRow>
            ) : (
              campioni?.map((campione) => (
                <TableRow key={campione.id}>
                  <TableCell className="whitespace-nowrap">
                    {new Date(campione.dataRichiesta).toLocaleDateString('it-IT')}
                  </TableCell>
                  <TableCell className="font-medium">
                    {campione.clienteNome}
                  </TableCell>
                  <TableCell>
                    {campione.materialeNome}
                  </TableCell>
                  <TableCell>
                    <Select 
                      value={campione.statoSpedizione} 
                      onValueChange={(val) => handleStatusChange(campione.id, val)}
                    >
                      <SelectTrigger className={`w-40 border-0 font-medium capitalize ${getStatoBadgeStyle(campione.statoSpedizione)}`}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.values(RichiestaCampioneStatoSpedizione).map((stato) => (
                          <SelectItem key={stato} value={stato} className="capitalize">
                            {stato.replace('_', ' ')}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
