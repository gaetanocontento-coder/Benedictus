import React from "react";
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
  Legend 
} from "recharts";
import { 
  Users, 
  Briefcase, 
  FileText, 
  CheckCircle, 
  Package, 
  TrendingUp,
  Search,
  Bell,
  Settings,
  Menu
} from "lucide-react";

const kpis = [
  { label: "Totale Lead", value: "10", icon: Users, color: "text-blue-400" },
  { label: "Da Lavorare", value: "4", icon: Briefcase, color: "text-amber-400" },
  { label: "Preventivi Inviati", value: "2", icon: FileText, color: "text-purple-400" },
  { label: "Clienti Attivi", value: "5", icon: CheckCircle, color: "text-emerald-400" },
  { label: "Richieste Campioni", value: "6", icon: Package, color: "text-orange-400" },
  { label: "Conv. Rate", value: "10%", icon: TrendingUp, color: "text-rose-400" },
];

const chartData = [
  { month: "Gen", leads: 15, preventivi: 5, clientiAttivi: 40 },
  { month: "Feb", leads: 20, preventivi: 8, clientiAttivi: 42 },
  { month: "Mar", leads: 25, preventivi: 12, clientiAttivi: 45 },
  { month: "Apr", leads: 18, preventivi: 7, clientiAttivi: 46 },
  { month: "Mag", leads: 30, preventivi: 15, clientiAttivi: 50 },
  { month: "Giu", leads: 35, preventivi: 18, clientiAttivi: 54 },
  { month: "Lug", leads: 28, preventivi: 14, clientiAttivi: 55 },
  { month: "Ago", leads: 15, preventivi: 6, clientiAttivi: 56 },
  { month: "Set", leads: 40, preventivi: 22, clientiAttivi: 60 },
  { month: "Ott", leads: 45, preventivi: 25, clientiAttivi: 65 },
  { month: "Nov", leads: 38, preventivi: 20, clientiAttivi: 68 },
  { month: "Dic", leads: 25, preventivi: 12, clientiAttivi: 70 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-800 border border-slate-700 p-3 rounded shadow-xl text-sm">
        <p className="text-slate-300 mb-2 font-medium">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={`item-${index}`} style={{ color: entry.color }} className="font-medium">
            {entry.name}: {entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export function CommandCenter() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans flex flex-col">
      {/* Slim Top Navigation */}
      <header className="h-16 border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-10 flex items-center justify-between px-6">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-amber-600 flex items-center justify-center font-bold text-white shadow-lg shadow-amber-600/20">
              I
            </div>
            <span className="font-bold text-lg tracking-tight text-white">Intessuto</span>
          </div>
          
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <a href="#" className="text-amber-500">Dashboard</a>
            <a href="#" className="text-slate-400 hover:text-slate-200 transition-colors">Leads</a>
            <a href="#" className="text-slate-400 hover:text-slate-200 transition-colors">Preventivi</a>
            <a href="#" className="text-slate-400 hover:text-slate-200 transition-colors">Clienti</a>
            <a href="#" className="text-slate-400 hover:text-slate-200 transition-colors">Campioni</a>
          </nav>
        </div>

        <div className="flex items-center gap-4 text-slate-400">
          <button className="hover:text-white transition-colors p-2"><Search size={18} /></button>
          <button className="hover:text-white transition-colors p-2 relative">
            <Bell size={18} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full"></span>
          </button>
          <button className="hover:text-white transition-colors p-2"><Settings size={18} /></button>
          <div className="h-8 w-8 rounded-full bg-slate-800 border border-slate-700 ml-2 overflow-hidden">
            <img src="https://api.dicebear.com/7.x/notionists/svg?seed=Felix" alt="User" className="w-full h-full object-cover" />
          </div>
          <button className="md:hidden hover:text-white transition-colors p-2 ml-2"><Menu size={20} /></button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-8 max-w-[1600px] w-full mx-auto space-y-8">
        
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-white tracking-tight">Command Center</h1>
            <p className="text-slate-400 text-sm mt-1">Panoramica commerciale e performance di marketing.</p>
          </div>
          <div className="flex items-center gap-3">
            <select className="bg-slate-900 border border-slate-800 text-sm rounded-md px-3 py-1.5 text-slate-300 focus:outline-none focus:ring-1 focus:ring-amber-500">
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
          {kpis.map((kpi, idx) => (
            <div key={idx} className="bg-slate-900 border border-slate-800 rounded-lg p-5 flex flex-col justify-between hover:border-slate-700 transition-colors group">
              <div className="flex items-center justify-between mb-4">
                <span className="text-slate-400 text-sm font-medium">{kpi.label}</span>
                <kpi.icon size={18} className={`${kpi.color} opacity-70 group-hover:opacity-100 transition-opacity`} />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-white tracking-tight">{kpi.value}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="space-y-6">
          {/* Bar Chart - Full Width */}
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
            <div className="mb-6">
              <h2 className="text-lg font-medium text-white">Trend Acquisizione</h2>
              <p className="text-xs text-slate-400">Leads generati vs Preventivi inviati nell'ultimo anno</p>
            </div>
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                  <XAxis dataKey="month" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: '#1e293b' }} />
                  <Legend wrapperStyle={{ paddingTop: '20px', fontSize: '12px', color: '#cbd5e1' }} />
                  <Bar dataKey="leads" name="Nuovi Leads" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={32} />
                  <Bar dataKey="preventivi" name="Preventivi Inviati" fill="#f59e0b" radius={[4, 4, 0, 0]} barSize={32} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Line Chart - Full Width */}
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
            <div className="mb-6 flex justify-between items-start">
              <div>
                <h2 className="text-lg font-medium text-white">Crescita Clienti Attivi</h2>
                <p className="text-xs text-slate-400">Andamento cumulativo base clienti</p>
              </div>
              <div className="px-2.5 py-1 bg-emerald-500/10 text-emerald-400 text-xs font-medium rounded-full border border-emerald-500/20">
                +75% YTD
              </div>
            </div>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                  <XAxis dataKey="month" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Line 
                    type="monotone" 
                    dataKey="clientiAttivi" 
                    name="Clienti Attivi" 
                    stroke="#10b981" 
                    strokeWidth={3}
                    dot={{ r: 4, fill: '#10b981', strokeWidth: 0 }}
                    activeDot={{ r: 6, fill: '#10b981', stroke: '#0f172a', strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}
