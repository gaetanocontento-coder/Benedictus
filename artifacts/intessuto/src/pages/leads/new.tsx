import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocation } from "wouter";
import { useCreateLead, getListLeadsQueryKey, LeadFonte, LeadInteresse, LeadStato } from "@workspace/api-client-react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import { useQueryClient } from "@tanstack/react-query";

const formSchema = z.object({
  nomeAzienda: z.string().min(1, "Campo obbligatorio"),
  referente: z.string().min(1, "Campo obbligatorio"),
  email: z.string().email("Email non valida"),
  telefono: z.string().min(5, "Telefono obbligatorio"),
  fonte: z.nativeEnum(LeadFonte),
  interesse: z.nativeEnum(LeadInteresse),
  stato: z.nativeEnum(LeadStato),
  commercialeAssegnato: z.string().min(1, "Campo obbligatorio"),
  note: z.string().optional()
});

type FormValues = z.infer<typeof formSchema>;

export default function NewLead() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const createLead = useCreateLead();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nomeAzienda: "",
      referente: "",
      email: "",
      telefono: "",
      fonte: LeadFonte.sito,
      interesse: LeadInteresse.tessuti,
      stato: LeadStato.nuovo,
      commercialeAssegnato: "",
      note: ""
    }
  });

  const onSubmit = (data: FormValues) => {
    createLead.mutate(
      { data },
      {
        onSuccess: (lead) => {
          queryClient.invalidateQueries({ queryKey: getListLeadsQueryKey() });
          toast({ title: "Lead creato con successo" });
          setLocation(`/leads/${lead.id}`);
        },
        onError: () => {
          toast({ title: "Errore durante la creazione", variant: "destructive" });
        }
      }
    );
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="flex items-center gap-4">
        <Link href="/leads">
          <Button variant="outline" size="icon" className="h-8 w-8">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-serif tracking-tight">Nuovo Lead</h1>
          <p className="text-muted-foreground mt-1">Inserisci i dati del nuovo potenziale cliente.</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Dettagli Anagrafici e Commerciali</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="nomeAzienda"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome Azienda</FormLabel>
                      <FormControl><Input {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="referente"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Referente Principale</FormLabel>
                      <FormControl><Input {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl><Input type="email" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="telefono"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Telefono</FormLabel>
                      <FormControl><Input {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t">
                <FormField
                  control={form.control}
                  name="fonte"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fonte Acquisizione</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleziona fonte" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Object.values(LeadFonte).map((fonte) => (
                            <SelectItem key={fonte} value={fonte} className="capitalize">
                              {fonte.replace('_', ' ')}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="interesse"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Interesse Principale</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleziona interesse" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Object.values(LeadInteresse).map((int) => (
                            <SelectItem key={int} value={int} className="capitalize">
                              {int}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="stato"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Stato Iniziale</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleziona stato" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Object.values(LeadStato).map((stato) => (
                            <SelectItem key={stato} value={stato} className="capitalize">
                              {stato.replace('_', ' ')}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="commercialeAssegnato"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Commerciale Assegnato</FormLabel>
                      <FormControl><Input {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="note"
                render={({ field }) => (
                  <FormItem className="pt-4 border-t">
                    <FormLabel>Note</FormLabel>
                    <FormControl><Textarea className="min-h-[100px]" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end gap-4 pt-4">
                <Link href="/leads">
                  <Button variant="outline" type="button">Annulla</Button>
                </Link>
                <Button type="submit" disabled={createLead.isPending}>
                  {createLead.isPending ? "Salvataggio..." : "Crea Lead"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
