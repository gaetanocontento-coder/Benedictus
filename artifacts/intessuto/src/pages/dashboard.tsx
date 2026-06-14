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
  { key: "totaleLead",         label: "Totale Lead",          icon: Users,        color: "text-blue-400",    border: "border-blue-500/20",    bg: "bg-blue-500/5"    },
  { key: "leadDaLavorare",     label: "Da Lavorare",          icon: Briefcase,    color: "text-amber-400",   border: "border-amber-500/20",   bg: "bg-amber-500/5"   },
  { key: "preventiviInviati",  label: "Preventivi Inviati",   icon: FileText,     color: "text-purple-400",  border: "border-purple-500/20",  bg: "bg-purple-500/5"  },
  { key: "clientiAttivi",      label: "Clienti Attivi",       icon: CheckCircle,  color: "text-emerald-400", border: "border-emerald-500/20", bg: "bg-emerald-500/5" },
  { key: "richiesteCampioni",  label: "Richieste Campioni",   icon: Package,      color: "text-orange-400",  border: "border-orange-500/20",  bg: "bg-orange-500/5"  },
  { key: "tassoConversione",   label: "Conv. Rate",           icon: TrendingUp,   color: "text-rose-400",    border: "border-rose-500/20",    bg: "bg-rose-500/5",   suffix: "%" },
];

function DarkTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-slate-800 border border-slate-700 p-3 rounded-lg shadow-xl text-sm">
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
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-white tracking-tight">Command Center</h1>
          <p className="text-slate-400 text-sm mt-0.5">Panoramica commerciale e performance di marketing.</p>
        </div>
        <div className="flex items-center gap-2">
          <select className="bg-slate-900 border border-slate-800 text-sm rounded-md px-3 py-1.5 text-slate-300 focus:outline-none focus:ring-1 focus:ring-amber-500 cursor-pointer">
            <option>Ultimi 30 giorni</option>
            <option>Questo Trimestre</option>
            <option>Quest'anno</option>
          </select>
          <button className="bg-amber-600 hover:bg-amber-500 text-white px-4 py-1.5 rounded-md text-sm font-medium transition-colors shadow shadow-amber-900/30">
            Esporta Report
          </button>
        </div>
      </div>

      {/* KPI Strip */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {KPI_CONFIG.map((kpi) => {
          const value = stats ? (stats as any)[kpi.key] : null;
          const Icon = kpi.icon;
          return (
            <div
              key={kpi.key}
              className={`bg-slate-900 border ${kpi.border} rounded-lg p-5 flex flex-col justify-between hover:border-opacity-60 transition-colors group`}
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-slate-400 text-xs font-medium leading-tight">{kpi.label}</span>
                <div className={`w-7 h-7 rounded-md ${kpi.bg} flex items-center justify-center`}>
                  <Icon size={14} className={kpi.color} />
                </div>
              </div>
              {statsLoading ? (
                <div className="h-8 w-16 bg-slate-800 rounded animate-pulse" />
              ) : (
                <div className="text-3xl font-bold text-white tracking-tight">
                  {value ?? "—"}{kpi.suffix ?? ""}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Charts */}
      <div className="space-y-4">
        {/* Bar Chart */}
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
          <div className="mb-5">
            <h2 className="text-base font-semibold text-white">Trend Acquisizione</h2>
            <p className="text-xs text-slate-400 mt-0.5">Lead generati vs Preventivi inviati nell'ultimo anno</p>
          </div>
          <div className="h-[320px]">
            {andamentoLoading ? (
              <div className="h-full w-full bg-slate-800/50 rounded-lg animate-pulse" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                  <XAxis dataKey="month" stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip content={<DarkTooltip />} cursor={{ fill: "#1e293b" }} />
                  <Legend
                    wrapperStyle={{ paddingTop: "16px", fontSize: "12px", color: "#cbd5e1" }}
                  />
                  <Bar dataKey="leads" name="Nuovi Lead" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={28} />
                  <Bar dataKey="preventivi" name="Preventivi Inviati" fill="#f59e0b" radius={[4, 4, 0, 0]} barSize={28} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Line Chart */}
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
          <div className="mb-5 flex justify-between items-start">
            <div>
              <h2 className="text-base font-semibold text-white">Crescita Clienti Attivi</h2>
              <p className="text-xs text-slate-400 mt-0.5">Andamento cumulativo base clienti</p>
            </div>
            {stats && (
              <div className="px-2.5 py-1 bg-emerald-500/10 text-emerald-400 text-xs font-medium rounded-full border border-emerald-500/20">
                {stats.clientiAttivi} attivi
              </div>
            )}
          </div>
          <div className="h-[280px]">
            {andamentoLoading ? (
              <div className="h-full w-full bg-slate-800/50 rounded-lg animate-pulse" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                  <XAxis dataKey="month" stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip content={<DarkTooltip />} />
                  <Legend
                    wrapperStyle={{ paddingTop: "16px", fontSize: "12px", color: "#cbd5e1" }}
                  />
                  <Line
                    type="monotone"
                    dataKey="clientiAttivi"
                    name="Clienti Attivi"
                    stroke="#10b981"
                    strokeWidth={2.5}
                    dot={{ r: 3.5, fill: "#10b981", strokeWidth: 0 }}
                    activeDot={{ r: 5.5, fill: "#10b981", stroke: "#0f172a", strokeWidth: 2 }}
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
