import { useParams, useLocation } from "wouter";
import { useGetLead, useUpdateLead, useDeleteLead, getGetLeadQueryKey, getListLeadsQueryKey, LeadStato } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "wouter";
import { ArrowLeft, Mail, Phone, Building, User, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

export default function LeadDetail() {
  const params = useParams();
  const id = Number(params.id);
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: lead, isLoading } = useGetLead(id, {
    query: { enabled: !!id, queryKey: getGetLeadQueryKey(id) }
  });

  const updateLead = useUpdateLead();
  const deleteLead = useDeleteLead();

  const handleStatusChange = (newStato: string) => {
    updateLead.mutate(
      { id, data: { stato: newStato } },
      {
        onSuccess: (updatedLead) => {
          queryClient.setQueryData(getGetLeadQueryKey(id), updatedLead);
          queryClient.invalidateQueries({ queryKey: getListLeadsQueryKey() });
          toast({ title: "Stato aggiornato" });
        }
      }
    );
  };

  const handleDelete = () => {
    deleteLead.mutate(
      { id },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getListLeadsQueryKey() });
          toast({ title: "Lead eliminato" });
          setLocation("/leads");
        }
      }
    );
  };

  const getStatoColor = (stato: string) => {
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

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex gap-4"><Skeleton className="h-8 w-8" /><Skeleton className="h-8 w-64" /></div>
        <Skeleton className="h-[400px] w-full" />
      </div>
    );
  }

  if (!lead) return <div>Lead non trovato</div>;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <Link href="/leads">
            <Button variant="outline" size="icon" className="h-8 w-8">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-serif tracking-tight">{lead.nomeAzienda}</h1>
            <p className="text-muted-foreground flex items-center gap-2 mt-1 text-sm">
              Creato il {new Date(lead.createdAt).toLocaleDateString('it-IT')}
              <span>•</span>
              Gestito da: {lead.commercialeAssegnato}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="w-48">
            <Select value={lead.stato} onValueChange={handleStatusChange} disabled={updateLead.isPending}>
              <SelectTrigger className={`${getStatoColor(lead.stato)} font-medium capitalize border-0`}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.values(LeadStato).map((stato) => (
                  <SelectItem key={stato} value={stato} className="capitalize">
                    {stato.replace('_', ' ')}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="icon">
                <Trash2 className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Sei sicuro?</AlertDialogTitle>
                <AlertDialogDescription>
                  Questa azione non può essere annullata. Il lead verrà eliminato permanentemente.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Annulla</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                  Elimina
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="col-span-1 md:col-span-2">
          <CardHeader>
            <CardTitle>Dettagli Contatto</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                  <User className="h-4 w-4" /> Referente
                </div>
                <div className="font-medium text-lg">{lead.referente}</div>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                  <Building className="h-4 w-4" /> Azienda
                </div>
                <div className="font-medium text-lg">{lead.nomeAzienda}</div>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                  <Mail className="h-4 w-4" /> Email
                </div>
                <div className="font-medium"><a href={`mailto:${lead.email}`} className="text-primary hover:underline">{lead.email}</a></div>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                  <Phone className="h-4 w-4" /> Telefono
                </div>
                <div className="font-medium"><a href={`tel:${lead.telefono}`} className="hover:underline">{lead.telefono}</a></div>
              </div>
            </div>

            <div className="pt-6 border-t grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-muted-foreground mb-2">Interesse Principale</p>
                <Badge variant="outline" className="text-sm capitalize py-1">{lead.interesse}</Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-2">Fonte Acquisizione</p>
                <Badge variant="secondary" className="text-sm capitalize py-1">{lead.fonte.replace('_', ' ')}</Badge>
              </div>
            </div>

            {lead.note && (
              <div className="pt-6 border-t">
                <p className="text-sm text-muted-foreground mb-2">Note Commerciali</p>
                <div className="bg-muted/50 p-4 rounded-md text-sm whitespace-pre-wrap">
                  {lead.note}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="col-span-1 bg-muted/20 border-primary/10">
          <CardHeader>
            <CardTitle className="text-lg">Azioni Rapide</CardTitle>
            <CardDescription>Flusso di conversione</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start font-normal">Invia email</Button>
            <Button variant="outline" className="w-full justify-start font-normal">Richiedi Campione</Button>
            <Button variant="outline" className="w-full justify-start font-normal">Genera Proposta</Button>
            <Button variant="outline" className="w-full justify-start font-normal">Converti in Cliente</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
