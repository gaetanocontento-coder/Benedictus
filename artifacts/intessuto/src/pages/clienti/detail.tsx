import { useState, useRef, useEffect, useCallback } from "react";
import { useParams } from "wouter";
import { Link } from "wouter";
import { useGetCliente, useUpdateCliente, getGetClienteQueryKey, ClientePriorita } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Building2, Mail, Phone, MapPin, Briefcase } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";

export default function ClienteDetail() {
  const params = useParams();
  const id = Number(params.id);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: cliente, isLoading } = useGetCliente(id, {
    query: { enabled: !!id, queryKey: getGetClienteQueryKey(id) }
  });

  const updateCliente = useUpdateCliente();
  const mutateRef = useRef(updateCliente.mutate);
  mutateRef.current = updateCliente.mutate;

  const handleUpdate = useCallback((data: any) => {
    mutateRef.current(
      { id, data },
      {
        onSuccess: (updated) => {
          queryClient.setQueryData(getGetClienteQueryKey(id), updated);
          toast({ title: "Cliente aggiornato", description: "Le modifiche sono state salvate." });
        }
      }
    );
  }, [id, queryClient, toast]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex gap-4"><Skeleton className="h-8 w-8" /><Skeleton className="h-8 w-64" /></div>
        <Skeleton className="h-[400px] w-full" />
      </div>
    );
  }

  if (!cliente) return <div>Cliente non trovato</div>;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <Link href="/clienti">
            <Button variant="outline" size="icon" className="h-8 w-8">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-serif tracking-tight">{cliente.nomeAzienda}</h1>
            <p className="text-muted-foreground flex items-center gap-2 mt-1 text-sm">
              Cliente dal {new Date(cliente.createdAt).toLocaleDateString('it-IT')}
            </p>
          </div>
        </div>
        
        <div className="w-40">
          <Select 
            value={cliente.priorita} 
            onValueChange={(val) => handleUpdate({ priorita: val })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.values(ClientePriorita).map((p) => (
                <SelectItem key={p} value={p} className="capitalize">{p}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="col-span-1 lg:col-span-2">
          <CardHeader>
            <CardTitle>Anagrafica Cliente</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                  <Building2 className="h-4 w-4" /> Referente
                </div>
                <div className="font-medium">{cliente.referente}</div>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                  <Briefcase className="h-4 w-4" /> Settore
                </div>
                <div className="font-medium">{cliente.settore}</div>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                  <Mail className="h-4 w-4" /> Email
                </div>
                <div className="font-medium"><a href={`mailto:${cliente.email}`} className="text-primary hover:underline">{cliente.email}</a></div>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                  <Phone className="h-4 w-4" /> Telefono
                </div>
                <div className="font-medium"><a href={`tel:${cliente.telefono}`} className="hover:underline">{cliente.telefono}</a></div>
              </div>
              <div className="space-y-1 sm:col-span-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                  <MapPin className="h-4 w-4" /> Indirizzo
                </div>
                <div className="font-medium">{cliente.indirizzo || "-"}</div>
              </div>
            </div>

            <div className="pt-6 border-t">
              <p className="text-sm text-muted-foreground mb-2">Materiali di Interesse</p>
              <div className="flex flex-wrap gap-2">
                {cliente.materialiInteresse && cliente.materialiInteresse.length > 0 ? (
                  cliente.materialiInteresse.map(mat => (
                    <Badge key={mat} variant="secondary" className="font-normal">{mat}</Badge>
                  ))
                ) : (
                  <span className="text-sm text-muted-foreground">Nessun materiale specificato</span>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Prossima Azione</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea 
                defaultValue={cliente.prossimAzione || ""}
                onBlur={(e) => {
                  if (e.target.value !== cliente.prossimAzione) {
                    handleUpdate({ prossimAzione: e.target.value });
                  }
                }}
                placeholder="es. Chiamare martedì per feedback campioni..."
                className="min-h-[100px] resize-none"
              />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Note Interne</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea 
                defaultValue={cliente.note || ""}
                onBlur={(e) => {
                  if (e.target.value !== cliente.note) {
                    handleUpdate({ note: e.target.value });
                  }
                }}
                placeholder="Note storiche e preferenze..."
                className="min-h-[150px]"
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
