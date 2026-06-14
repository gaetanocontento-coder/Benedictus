import { useState } from "react";
import { Link } from "wouter";
import { useListClienti, getListClientiQueryKey, ClientePriorita } from "@workspace/api-client-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function Clienti() {
  const [searchTerm, setSearchTerm] = useState("");
  
  const { data: clienti, isLoading } = useListClienti({
    query: { queryKey: getListClientiQueryKey() }
  });

  const filteredClienti = clienti?.filter(cliente => 
    cliente.nomeAzienda.toLowerCase().includes(searchTerm.toLowerCase()) || 
    cliente.referente.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getPrioritaBadge = (priorita: ClientePriorita) => {
    const map = {
      alta: "destructive",
      media: "default",
      bassa: "secondary"
    } as const;
    return <Badge variant={map[priorita]} className="capitalize">{priorita}</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-serif tracking-tight">Clienti Attivi</h1>
          <p className="text-muted-foreground mt-1">Gestisci il portafoglio clienti e le prossime azioni.</p>
        </div>
      </div>

      <div className="bg-card p-4 rounded-xl border">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Cerca azienda o referente..." 
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-card border rounded-xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Azienda</TableHead>
              <TableHead>Referente</TableHead>
              <TableHead>Settore</TableHead>
              <TableHead>Priorità</TableHead>
              <TableHead>Prossima Azione</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array(5).fill(0).map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-16 rounded-full" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-40" /></TableCell>
                </TableRow>
              ))
            ) : filteredClienti?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-12 text-muted-foreground">
                  Nessun cliente trovato.
                </TableCell>
              </TableRow>
            ) : (
              filteredClienti?.map((cliente) => (
                <TableRow key={cliente.id} className="cursor-pointer hover:bg-muted/50 transition-colors">
                  <TableCell className="font-medium">
                    <Link href={`/clienti/${cliente.id}`} className="block w-full">
                      {cliente.nomeAzienda}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Link href={`/clienti/${cliente.id}`} className="block w-full text-muted-foreground">
                      {cliente.referente}
                    </Link>
                  </TableCell>
                  <TableCell>
                    {cliente.settore}
                  </TableCell>
                  <TableCell>
                    {getPrioritaBadge(cliente.priorita)}
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm max-w-xs truncate">
                    {cliente.prossimAzione || "-"}
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
