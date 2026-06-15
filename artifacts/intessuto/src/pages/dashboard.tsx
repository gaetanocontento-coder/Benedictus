import {
  useGetDashboardStats,
  useGetDashboardAndamento,
  getGetDashboardStatsQueryKey,
  getGetDashboardAndamentoQueryKey,
} from "@workspace/api-client-react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  Users,
  Briefcase,
  FileText,
  CheckCircle,
  Package,
  TrendingUp,
} from "lucide-react";

const KPI_CONFIG = [
  { key: "totaleLead",        label: "Totale Lead",         icon: Users,       color: "text-blue-400"    },
  { key: "leadDaLavorare",    label: "Da Lavorare",         icon: Briefcase,   color: "text-amber-400"   },
  { key: "preventiviInviati", label: "Preventivi Inviati",  icon: FileText,    color: "text-purple-400"  },
  { key: "clientiAttivi",     label: "Clienti Attivi",      icon: CheckCircle, color: "text-emerald-400" },
  { key: "richiesteCampioni", label: "Richieste Campioni",  icon: Package,     color: "text-orange-400"  },
  { key: "tassoConversione",  label: "Conv. Rate",          icon: TrendingUp,  color: "text-rose-400",   suffix: "%" },
];

function DarkTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-slate-800 border border-slate-700 p-3 rounded shadow-xl text-sm">
      <p className="text-slate-300 mb-2 font-medium">{label}</p>
      {payload.map((entry: any, i: number) => (
        <p key={i} style={{ color: entry.color }} className="font-medium">
          {entry.name}: {entry.value}
        </p>
      ))}
    </div>
  );
}

export default function Dashboard() {
  const { data: stats, isLoading: statsLoading } = useGetDashboardStats({
    query: { queryKey: getGetDashboardStatsQueryKey() },
  });
  const { data: andamento, isLoading: andamentoLoading } = useGetDashboardAndamento({
    query: { queryKey: getGetDashboardAndamentoQueryKey() },
  });

  const chartData = andamento?.map((d: any) => ({
    month: d.mese,
    leads: d.lead,
    preventivi: d.preventivi,
    clientiAttivi: d.clienti,
  })) ?? [];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-white tracking-tight">Command Center</h1>
          <p className="text-slate-400 text-sm mt-1">Panoramica commerciale e performance di marketing.</p>
        </div>
        <div className="flex items-center gap-3">
          <select className="bg-slate-900 border border-slate-800 text-sm rounded-md px-3 py-1.5 text-slate-300 focus:outline-none focus:ring-1 focus:ring-amber-500 cursor-pointer">
            <option>Ultimi 30 giorni</option>
            <option>Questo Trimestre</option>
            <option>Quest'anno</option>
          </select>
          <button className="bg-amber-600 hover:bg-amber-500 text-white px-4 py-1.5 rounded-md text-sm font-medium transition-colors shadow-lg shadow-amber-900/20">
            Esporta Report
          </button>
        </div>
      </div>

      {/* KPI Strip */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {KPI_CONFIG.map((kpi) => {
          const value = stats ? (stats as any)[kpi.key] : null;
          const Icon = kpi.icon;
          return (
            <div
              key={kpi.key}
              className="bg-slate-900 border border-slate-800 rounded-lg p-5 flex flex-col justify-between hover:border-slate-700 transition-colors group"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-slate-400 text-sm font-medium">{kpi.label}</span>
                <Icon size={18} className={`${kpi.color} opacity-70 group-hover:opacity-100 transition-opacity`} />
              </div>
              {statsLoading ? (
                <div className="h-9 w-16 bg-slate-800 rounded animate-pulse" />
              ) : (
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-white tracking-tight">
                    {value ?? "—"}{kpi.suffix ?? ""}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Charts */}
      <div className="space-y-6">
        {/* Bar Chart */}
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
          <div className="mb-6">
            <h2 className="text-lg font-medium text-white">Trend Acquisizione</h2>
            <p className="text-xs text-slate-400">Lead generati vs Preventivi inviati nell'ultimo anno</p>
          </div>
          <div className="h-[350px] w-full">
            {andamentoLoading ? (
              <div className="h-full w-full bg-slate-800/50 rounded-lg animate-pulse" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                  <XAxis dataKey="month" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip content={<DarkTooltip />} cursor={{ fill: "#1e293b" }} />
                  <Legend wrapperStyle={{ paddingTop: "20px", fontSize: "12px", color: "#cbd5e1" }} />
                  <Bar dataKey="leads" name="Nuovi Lead" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={32} />
                  <Bar dataKey="preventivi" name="Preventivi Inviati" fill="#f59e0b" radius={[4, 4, 0, 0]} barSize={32} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Line Chart */}
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
          <div className="mb-6 flex justify-between items-start">
            <div>
              <h2 className="text-lg font-medium text-white">Crescita Clienti Attivi</h2>
              <p className="text-xs text-slate-400">Andamento cumulativo base clienti</p>
            </div>
            {stats && (
              <div className="px-2.5 py-1 bg-emerald-500/10 text-emerald-400 text-xs font-medium rounded-full border border-emerald-500/20">
                {stats.clientiAttivi} attivi
              </div>
            )}
          </div>
          <div className="h-[300px] w-full">
            {andamentoLoading ? (
              <div className="h-full w-full bg-slate-800/50 rounded-lg animate-pulse" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                  <XAxis dataKey="month" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip content={<DarkTooltip />} />
                  <Legend wrapperStyle={{ paddingTop: "20px", fontSize: "12px", color: "#cbd5e1" }} />
                  <Line
                    type="monotone"
                    dataKey="clientiAttivi"
                    name="Clienti Attivi"
                    stroke="#10b981"
                    strokeWidth={3}
                    dot={{ r: 4, fill: "#10b981", strokeWidth: 0 }}
                    activeDot={{ r: 6, fill: "#10b981", stroke: "#0f172a", strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
