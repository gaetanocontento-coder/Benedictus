import { useState } from "react";
import { useLocation, Link } from "wouter";
import { useListClienti, useListMateriali, useCreateProposta, getListClientiQueryKey, getListMaterialiQueryKey, getListProposteQueryKey, PropostaStato } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import { Label } from "@/components/ui/label";

type PropostaItemForm = {
  materialeId: number;
  materialeNome: string;
  quantita: number;
  prezzoUnitario: number;
};

export default function NewProposta() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [clienteId, setClienteId] = useState<string>("");
  const [items, setItems] = useState<PropostaItemForm[]>([]);
  const [selectedMaterialId, setSelectedMaterialId] = useState<string>("");
  const [quantitaInput, setQuantitaInput] = useState<string>("1");
  const [prezzoInput, setPrezzoInput] = useState<string>("");

  const { data: clienti } = useListClienti({ query: { queryKey: getListClientiQueryKey() } });
  const { data: materiali } = useListMateriali({}, { query: { queryKey: getListMaterialiQueryKey({}) } });
  const createProposta = useCreateProposta();

  const handleAddItem = () => {
    if (!selectedMaterialId || !quantitaInput || !prezzoInput) return;
    
    const mat = materiali?.find(m => m.id.toString() === selectedMaterialId);
    if (!mat) return;

    setItems([...items, {
      materialeId: mat.id,
      materialeNome: mat.nome,
      quantita: Number(quantitaInput),
      prezzoUnitario: Number(prezzoInput)
    }]);

    setSelectedMaterialId("");
    setQuantitaInput("1");
    setPrezzoInput("");
  };

  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const totale = items.reduce((acc, item) => acc + (item.quantita * item.prezzoUnitario), 0);

  const handleSubmit = () => {
    if (!clienteId || items.length === 0) {
      toast({ title: "Errore", description: "Seleziona un cliente e aggiungi almeno un articolo", variant: "destructive" });
      return;
    }

    createProposta.mutate(
      {
        data: {
          clienteId: Number(clienteId),
          stato: PropostaStato.bozza,
          items: items.map(i => ({
            materialeId: i.materialeId,
            materialeNome: i.materialeNome,
            quantita: i.quantita,
            prezzoUnitario: i.prezzoUnitario
          }))
        }
      },
      {
        onSuccess: (proposta) => {
          queryClient.invalidateQueries({ queryKey: getListProposteQueryKey() });
          toast({ title: "Proposta generata" });
          setLocation(`/proposte/${proposta.id}`);
        }
      }
    );
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(value);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-4">
        <Link href="/proposte">
          <Button variant="outline" size="icon" className="h-8 w-8">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-serif tracking-tight">Generatore Proposta</h1>
          <p className="text-muted-foreground mt-1">Crea un nuovo preventivo per un cliente.</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Dettagli Proposta</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>Cliente</Label>
            <Select value={clienteId} onValueChange={setClienteId}>
              <SelectTrigger>
                <SelectValue placeholder="Seleziona il cliente destinatario..." />
              </SelectTrigger>
              <SelectContent>
                {clienti?.map(c => (
                  <SelectItem key={c.id} value={c.id.toString()}>{c.nomeAzienda}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="pt-6 border-t space-y-4">
            <Label>Aggiungi Articolo</Label>
            <div className="flex flex-col sm:flex-row gap-4 items-end">
              <div className="flex-1 w-full">
                <Select value={selectedMaterialId} onValueChange={setSelectedMaterialId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleziona materiale..." />
                  </SelectTrigger>
                  <SelectContent>
                    {materiali?.map(m => (
                      <SelectItem key={m.id} value={m.id.toString()}>{m.nome} - {m.colore}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="w-full sm:w-24">
                <Input 
                  type="number" 
                  min="1" 
                  placeholder="Q.tà" 
                  value={quantitaInput} 
                  onChange={(e) => setQuantitaInput(e.target.value)}
                />
              </div>
              <div className="w-full sm:w-32">
                <Input 
                  type="number" 
                  min="0" 
                  step="0.01" 
                  placeholder="Prezzo unit." 
                  value={prezzoInput} 
                  onChange={(e) => setPrezzoInput(e.target.value)}
                />
              </div>
              <Button onClick={handleAddItem} disabled={!selectedMaterialId || !quantitaInput || !prezzoInput} type="button" variant="secondary">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {items.length > 0 && (
            <div className="border rounded-md mt-6 overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Materiale</TableHead>
                    <TableHead className="text-right">Q.tà</TableHead>
                    <TableHead className="text-right">Prezzo Unit.</TableHead>
                    <TableHead className="text-right">Totale</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map((item, idx) => (
                    <TableRow key={idx}>
                      <TableCell className="font-medium">{item.materialeNome}</TableCell>
                      <TableCell className="text-right">{item.quantita}</TableCell>
                      <TableCell className="text-right">{formatCurrency(item.prezzoUnitario)}</TableCell>
                      <TableCell className="text-right">{formatCurrency(item.quantita * item.prezzoUnitario)}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="icon" onClick={() => handleRemoveItem(idx)} className="h-8 w-8 text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow className="bg-muted/50 font-medium">
                    <TableCell colSpan={3} className="text-right text-lg">Totale Proposta</TableCell>
                    <TableCell className="text-right text-lg">{formatCurrency(totale)}</TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-end gap-4 border-t pt-6">
          <Link href="/proposte">
            <Button variant="outline">Annulla</Button>
          </Link>
          <Button onClick={handleSubmit} disabled={!clienteId || items.length === 0 || createProposta.isPending}>
            {createProposta.isPending ? "Generazione..." : "Salva Bozza Proposta"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
