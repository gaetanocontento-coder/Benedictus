import React from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { LayoutDashboard, Users, FileText, Package, Settings, LogOut, Search, Bell } from 'lucide-react';

const barData = [
  { name: 'Gen', leads: 4, preventivi: 1 },
  { name: 'Feb', leads: 6, preventivi: 2 },
  { name: 'Mar', leads: 8, preventivi: 3 },
  { name: 'Apr', leads: 5, preventivi: 2 },
  { name: 'Mag', leads: 10, preventivi: 4 },
  { name: 'Giu', leads: 12, preventivi: 5 },
];

const lineData = [
  { name: 'Gen', clienti: 3 },
  { name: 'Feb', clienti: 3 },
  { name: 'Mar', clienti: 4 },
  { name: 'Apr', clienti: 4 },
  { name: 'Mag', clienti: 5 },
  { name: 'Giu', clienti: 5 },
];

export function Editorial() {
  return (
    <div className="flex h-screen w-full overflow-hidden text-neutral-900" style={{ backgroundColor: '#faf9f7', fontFamily: 'Inter, sans-serif' }}>
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&display=swap');
        .font-serif { font-family: 'Playfair Display', serif; }
      `}} />

      {/* Sidebar */}
      <aside className="w-16 md:w-64 border-r border-neutral-300 flex flex-col justify-between py-8 px-4 shrink-0">
        <div>
          <div className="font-serif text-2xl font-bold mb-12 hidden md:block px-2 tracking-tight">Intessuto</div>
          <div className="font-serif text-2xl font-bold mb-12 md:hidden px-2 text-center">I</div>
          <nav className="space-y-2">
            <a href="#" className="flex items-center gap-3 px-3 py-2.5 bg-neutral-200/50 rounded-sm text-neutral-900 transition-colors">
              <LayoutDashboard size={18} strokeWidth={1.5} /> 
              <span className="hidden md:inline text-sm font-medium">Dashboard</span>
            </a>
            <a href="#" className="flex items-center gap-3 px-3 py-2.5 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-200/30 rounded-sm transition-colors">
              <Users size={18} strokeWidth={1.5} /> 
              <span className="hidden md:inline text-sm font-medium">Clienti</span>
            </a>
            <a href="#" className="flex items-center gap-3 px-3 py-2.5 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-200/30 rounded-sm transition-colors">
              <FileText size={18} strokeWidth={1.5} /> 
              <span className="hidden md:inline text-sm font-medium">Preventivi</span>
            </a>
            <a href="#" className="flex items-center gap-3 px-3 py-2.5 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-200/30 rounded-sm transition-colors">
              <Package size={18} strokeWidth={1.5} /> 
              <span className="hidden md:inline text-sm font-medium">Campioni</span>
            </a>
          </nav>
        </div>
        <nav className="space-y-2">
          <a href="#" className="flex items-center gap-3 px-3 py-2.5 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-200/30 rounded-sm transition-colors">
            <Settings size={18} strokeWidth={1.5} /> 
            <span className="hidden md:inline text-sm font-medium">Impostazioni</span>
          </a>
          <a href="#" className="flex items-center gap-3 px-3 py-2.5 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-200/30 rounded-sm transition-colors">
            <LogOut size={18} strokeWidth={1.5} /> 
            <span className="hidden md:inline text-sm font-medium">Esci</span>
          </a>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Header */}
        <header className="h-20 border-b border-neutral-300 flex items-center justify-between px-8 shrink-0">
          <h1 className="font-serif text-2xl tracking-tight">Overview</h1>
          <div className="flex items-center gap-6">
            <button className="text-neutral-500 hover:text-neutral-900 transition-colors"><Search size={20} strokeWidth={1.5} /></button>
            <button className="text-neutral-500 hover:text-neutral-900 transition-colors"><Bell size={20} strokeWidth={1.5} /></button>
            <div className="w-8 h-8 rounded-full bg-neutral-300 border border-neutral-400"></div>
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-auto p-8 lg:p-12">
          <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-16 lg:gap-24">
            
            {/* Left Column (65%) */}
            <div className="lg:w-[65%] flex flex-col gap-16">
              {/* Hero KPI */}
              <div className="border-b border-neutral-300 pb-16 pt-8">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500 mb-6">Conversion Rate</p>
                <div className="font-serif text-8xl lg:text-[10rem] leading-none tracking-tighter">10%</div>
              </div>

              {/* Bar Chart */}
              <div>
                <div className="flex justify-between items-end mb-8">
                  <h2 className="font-serif text-2xl">Andamento</h2>
                  <p className="text-xs font-medium uppercase tracking-widest text-neutral-500">Leads vs Preventivi</p>
                </div>
                <div className="h-80 border border-neutral-300 p-6 bg-white/40">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={barData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e5e5" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#737373', fontFamily: 'Inter' }} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#737373', fontFamily: 'Inter' }} />
                      <Tooltip 
                        cursor={{ fill: '#f5f5f5' }} 
                        contentStyle={{ borderRadius: '0px', border: '1px solid #d4d4d4', boxShadow: 'none', fontFamily: 'Inter', fontSize: '12px' }} 
                      />
                      <Legend iconType="square" wrapperStyle={{ fontSize: '12px', fontFamily: 'Inter', paddingTop: '20px' }} />
                      <Bar dataKey="leads" name="Leads" fill="#262626" radius={[0, 0, 0, 0]} barSize={24} />
                      <Bar dataKey="preventivi" name="Preventivi" fill="#a3a3a3" radius={[0, 0, 0, 0]} barSize={24} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Right Column (35%) */}
            <div className="lg:w-[35%] flex flex-col gap-16 lg:pl-16 lg:border-l border-t lg:border-t-0 border-neutral-300 pt-16 lg:pt-8">
              
              {/* KPI List */}
              <div className="flex flex-col">
                <h2 className="font-serif text-2xl mb-8">Sintesi</h2>
                <div className="flex flex-col gap-6">
                  <div className="flex justify-between items-end border-b border-neutral-300 pb-4">
                    <span className="text-sm font-medium text-neutral-500 tracking-wide">Totale Lead</span>
                    <span className="font-serif text-4xl leading-none">10</span>
                  </div>
                  <div className="flex justify-between items-end border-b border-neutral-300 pb-4">
                    <span className="text-sm font-medium text-neutral-500 tracking-wide">Da Lavorare</span>
                    <span className="font-serif text-4xl leading-none">4</span>
                  </div>
                  <div className="flex justify-between items-end border-b border-neutral-300 pb-4">
                    <span className="text-sm font-medium text-neutral-500 tracking-wide">Preventivi Inviati</span>
                    <span className="font-serif text-4xl leading-none">2</span>
                  </div>
                  <div className="flex justify-between items-end border-b border-neutral-300 pb-4">
                    <span className="text-sm font-medium text-neutral-500 tracking-wide">Clienti Attivi</span>
                    <span className="font-serif text-4xl leading-none">5</span>
                  </div>
                  <div className="flex justify-between items-end border-b border-neutral-300 pb-4">
                    <span className="text-sm font-medium text-neutral-500 tracking-wide">Richieste Campioni</span>
                    <span className="font-serif text-4xl leading-none">6</span>
                  </div>
                </div>
              </div>

              {/* Line Chart */}
              <div>
                <h2 className="font-serif text-xl mb-6">Crescita Clienti</h2>
                <div className="h-56 border border-neutral-300 p-4 bg-white/40">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={lineData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e5e5" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#737373', fontFamily: 'Inter' }} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#737373', fontFamily: 'Inter' }} />
                      <Tooltip 
                        contentStyle={{ borderRadius: '0px', border: '1px solid #d4d4d4', boxShadow: 'none', fontFamily: 'Inter', fontSize: '12px' }} 
                      />
                      <Line type="step" dataKey="clienti" name="Clienti Attivi" stroke="#262626" strokeWidth={2} dot={{ r: 3, fill: '#262626', strokeWidth: 0 }} activeDot={{ r: 5 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

            </div>

          </div>
        </div>
      </main>
    </div>
  );
}
