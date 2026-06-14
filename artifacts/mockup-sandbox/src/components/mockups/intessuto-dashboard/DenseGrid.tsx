import React from "react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  LineChart, 
  Line 
} from "recharts";
import { Package, Users, FileText, CheckCircle, TrendingUp, Scissors } from "lucide-react";

const chartData = [
  { name: 'Gen', leads: 4, preventivi: 1, clienti: 2 },
  { name: 'Feb', leads: 7, preventivi: 2, clienti: 3 },
  { name: 'Mar', leads: 5, preventivi: 2, clienti: 3 },
  { name: 'Apr', leads: 8, preventivi: 3, clienti: 4 },
  { name: 'Mag', leads: 10, preventivi: 2, clienti: 5 },
];

const kpiData = [
  { title: "Totale Lead", value: "10", icon: Users, color: "text-blue-600", sparkline: "M0,20 L10,15 L20,18 L30,10 L40,12 L50,5" },
  { title: "Da Lavorare", value: "4", icon: Package, color: "text-amber-500", sparkline: "M0,5 L10,10 L20,8 L30,15 L40,12 L50,18" },
  { title: "Preventivi Inviati", value: "2", icon: FileText, color: "text-emerald-600", sparkline: "M0,18 L10,15 L20,15 L30,10 L40,8 L50,5" },
  { title: "Clienti Attivi", value: "5", icon: CheckCircle, color: "text-indigo-600", sparkline: "M0,20 L10,20 L20,15 L30,15 L40,10 L50,5" },
  { title: "Richieste Campioni", value: "6", icon: Scissors, color: "text-rose-500", sparkline: "M0,15 L10,10 L20,12 L30,5 L40,8 L50,2" },
  { title: "Conv. Rate", value: "10%", icon: TrendingUp, color: "text-slate-700", sparkline: "M0,20 L10,18 L20,15 L30,12 L40,10 L50,5" },
];

export function DenseGrid() {
  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans text-sm flex flex-col">
      {/* Topbar */}
      <header className="h-12 border-b border-slate-200 bg-white flex items-center px-4 justify-between shrink-0">
        <div className="flex items-center gap-6">
          <div className="font-bold text-base tracking-tight flex items-center gap-2">
            <div className="w-5 h-5 bg-slate-900 rounded-sm"></div>
            INTESSUTO
          </div>
          <nav className="flex gap-4 text-xs font-medium text-slate-500">
            <a href="#" className="text-slate-900">Dashboard</a>
            <a href="#">Leads</a>
            <a href="#">Clienti</a>
            <a href="#">Campioni</a>
          </nav>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <span className="text-slate-500">Q2 2024</span>
          <div className="w-6 h-6 rounded-full bg-slate-200"></div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4 flex flex-col gap-4 overflow-auto">
        
        {/* KPI Grid 3x2 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {kpiData.map((kpi, i) => (
            <div key={i} className="bg-white border border-slate-200 p-3 rounded shadow-sm flex flex-col gap-2 relative overflow-hidden">
              <div className="flex justify-between items-start">
                <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">{kpi.title}</span>
                <kpi.icon className={\`w-4 h-4 \${kpi.color}\`} />
              </div>
              <div className="flex items-end justify-between mt-1">
                <span className="text-2xl font-bold leading-none">{kpi.value}</span>
                <svg width="60" height="24" viewBox="0 0 50 24" className="stroke-current text-slate-300 fill-none" strokeWidth="2">
                  <path d={kpi.sparkline} strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>
          ))}
        </div>

        {/* Charts 2-col */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="bg-white border border-slate-200 p-3 rounded shadow-sm flex flex-col gap-3 h-[240px]">
            <h3 className="text-xs font-bold uppercase text-slate-700 tracking-wider">Leads & Preventivi (YTD)</h3>
            <div className="flex-1 min-h-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} />
                  <Tooltip contentStyle={{ fontSize: '12px', borderRadius: '4px', border: '1px solid #e2e8f0' }} cursor={{fill: '#f1f5f9'}} />
                  <Bar dataKey="leads" fill="#3b82f6" radius={[2, 2, 0, 0]} barSize={16} />
                  <Bar dataKey="preventivi" fill="#10b981" radius={[2, 2, 0, 0]} barSize={16} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white border border-slate-200 p-3 rounded shadow-sm flex flex-col gap-3 h-[240px]">
            <h3 className="text-xs font-bold uppercase text-slate-700 tracking-wider">Crescita Clienti Attivi</h3>
            <div className="flex-1 min-h-0">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} />
                  <Tooltip contentStyle={{ fontSize: '12px', borderRadius: '4px', border: '1px solid #e2e8f0' }} />
                  <Line type="monotone" dataKey="clienti" stroke="#4f46e5" strokeWidth={2} dot={{ r: 3, fill: '#4f46e5', strokeWidth: 0 }} activeDot={{ r: 5 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}
