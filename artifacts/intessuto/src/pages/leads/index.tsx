import { useState } from "react";
import { Link } from "wouter";
import { useListLeads, getListLeadsQueryKey, Lead, LeadStato, LeadFonte, LeadInteresse } from "@workspace/api-client-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Plus } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function Leads() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statoFilter, setStatoFilter] = useState<string>("all");
  
  const { data: leads, isLoading } = useListLeads(
    { stato: statoFilter !== "all" ? statoFilter : undefined },
    { query: { queryKey: getListLeadsQueryKey({ stato: statoFilter !== "all" ? statoFilter : undefined }) } }
  );

  const filteredLeads = leads?.filter(lead => 
    lead.nomeAzienda.toLowerCase().includes(searchTerm.toLowerCase()) || 
    lead.referente.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatoColor = (stato: LeadStato) => {
    const map: Record<string, string> = {
      nuovo: "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300",
      contattato: "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300",
      campione_inviato: "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300",
      preventivo_inviato: "bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/30 dark:text-orange-300",
      chiuso: "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300",
      perso: "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-300",
    };
    return map[stato] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-serif tracking-tight">Leads</h1>
          <p className="text-muted-foreground mt-1">Gestisci i contatti e le opportunità commerciali.</p>
        </div>
        <Link href="/leads/new">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Nuovo Lead
          </Button>
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 bg-card p-4 rounded-xl border">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Cerca azienda o referente..." 
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="w-full sm:w-64">
          <Select value={statoFilter} onValueChange={setStatoFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filtra per stato" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tutti gli stati</SelectItem>
              {Object.values(LeadStato).map((stato) => (
                <SelectItem key={stato} value={stato} className="capitalize">
                  {stato.replace('_', ' ')}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="bg-card border rounded-xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Azienda</TableHead>
              <TableHead>Referente</TableHead>
              <TableHead>Interesse</TableHead>
              <TableHead>Fonte</TableHead>
              <TableHead>Stato</TableHead>
              <TableHead className="text-right">Commerciale</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array(5).fill(0).map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-24 rounded-full" /></TableCell>
                  <TableCell className="text-right"><Skeleton className="h-5 w-24 ml-auto" /></TableCell>
                </TableRow>
              ))
            ) : filteredLeads?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                  Nessun lead trovato.
                </TableCell>
              </TableRow>
            ) : (
              filteredLeads?.map((lead) => (
                <TableRow key={lead.id} className="cursor-pointer hover:bg-muted/50 transition-colors">
                  <TableCell className="font-medium">
                    <Link href={`/leads/${lead.id}`} className="block w-full">
                      {lead.nomeAzienda}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Link href={`/leads/${lead.id}`} className="block w-full text-muted-foreground">
                      {lead.referente}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize font-normal">
                      {lead.interesse}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-muted-foreground capitalize">
                      {lead.fonte.replace('_', ' ')}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className={`${getStatoColor(lead.stato)} border font-medium capitalize`}>
                      {lead.stato.replace('_', ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right text-sm">
                    {lead.commercialeAssegnato}
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
