import { useGetInsights, getGetInsightsQueryKey } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "wouter";
import { PieChart, Pie, Cell, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import { AlertCircle, ArrowRight, TrendingUp, Package, Clock } from "lucide-react";

const COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))', 'hsl(var(--chart-5))'];

export default function Insight() {
  const { data: insights, isLoading } = useGetInsights({
    query: { queryKey: getGetInsightsQueryKey() }
  });

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-serif tracking-tight">Insight</h1>
          <p className="text-muted-foreground mt-1">Dati e suggerimenti per orientare le vendite.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
        </div>
      </div>
    );
  }

  if (!insights) return null;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-serif tracking-tight">Insight Strategici</h1>
        <p className="text-muted-foreground mt-1">Dati analitici e raccomandazioni in tempo reale.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <div className="col-span-1 space-y-6">
          {/* Lead da seguire urgenti */}
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-primary" />
                <CardTitle>Lead Prioritari</CardTitle>
              </div>
              <CardDescription>Richiedono attenzione immediata</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {insights.leadDaSeguire.map((lead) => (
                <Link key={lead.leadId} href={`/leads/${lead.leadId}`}>
                  <div className="bg-card p-4 rounded-lg border hover:border-primary/50 transition-colors cursor-pointer group">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-sm font-sans">{lead.nomeAzienda}</h4>
                      <Badge variant={lead.urgenza === "alta" ? "destructive" : "secondary"}>
                        {lead.urgenza}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mb-3">{lead.motivo}</p>
                    <div className="flex items-center text-xs font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                      Vedi dettaglio <ArrowRight className="ml-1 h-3 w-3" />
                    </div>
                  </div>
                </Link>
              ))}
            </CardContent>
          </Card>

          {/* Campioni da Seguire */}
          {insights.campioniDaFollowUp && insights.campioniDaFollowUp.length > 0 && (
            <Card className="border-amber-500/20 bg-amber-500/5">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-amber-600" />
                  <CardTitle>Campioni da Seguire</CardTitle>
                </div>
                <CardDescription>Follow-up necessari post-spedizione</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {insights.campioniDaFollowUp.map((campione) => (
                  <Link key={campione.id} href={`/campioni`}>
                    <div className="bg-card p-4 rounded-lg border hover:border-amber-500/50 transition-colors cursor-pointer group">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium text-sm font-sans">{campione.clienteNome}</h4>
                        <Badge variant={campione.giorniAttesa > 14 ? "destructive" : "secondary"} className={campione.giorniAttesa <= 14 ? "bg-amber-100 text-amber-800" : ""}>
                          {campione.giorniAttesa} gg
                        </Badge>
                      </div>
                      <p className="text-xs font-medium mb-1">{campione.materialeNome}</p>
                      <p className="text-xs text-muted-foreground mb-3">Inviato {campione.giorniAttesa} giorni fa</p>
                      <div className="flex items-center text-xs font-medium text-amber-600 opacity-0 group-hover:opacity-100 transition-opacity">
                        Vai a campioni <ArrowRight className="ml-1 h-3 w-3" />
                      </div>
                    </div>
                  </Link>
                ))}
              </CardContent>
            </Card>
          )}
        </div>

        <div className="col-span-1 lg:col-span-2 space-y-6">
          {/* Fonti più performanti */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-muted-foreground" />
                <CardTitle>Fonti di Acquisizione Performanti</CardTitle>
              </div>
              <CardDescription>Distribuzione delle origini dei lead</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px] flex items-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={insights.fontiPerformanti}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="percentuale"
                    nameKey="fonte"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {insights.fontiPerformanti.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip 
                    formatter={(value: number) => [`${value}%`, 'Percentuale']}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Materiali Più Richiesti */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Package className="h-5 w-5 text-muted-foreground" />
                <CardTitle>Materiali Più Richiesti</CardTitle>
              </div>
              <CardDescription>Classifica dei materiali con più richieste di campioni</CardDescription>
            </CardHeader>
            <CardContent className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={insights.materialiPiuRichiesti} layout="vertical" margin={{ top: 0, right: 30, left: 40, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                  <XAxis type="number" />
                  <YAxis dataKey="nome" type="category" width={150} tick={{fontSize: 12}} />
                  <RechartsTooltip 
                    cursor={{fill: 'var(--muted)'}}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Bar dataKey="richieste" name="N° Richieste" fill="hsl(var(--chart-3))" radius={[0, 4, 4, 0]}>
                    {insights.materialiPiuRichiesti.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}
