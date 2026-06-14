import { useAuth } from "@/lib/auth";
import { useLocation, Link } from "wouter";
import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  Users,
  Building2,
  Package,
  TestTube2,
  FileText,
  Lightbulb,
  LogOut,
  Search,
  Bell,
  Settings,
  Store,
  Wand2,
  Menu,
  X,
  UserCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const PUBLIC_PATHS = ["/shop", "/configuratore"];

const navItems = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Leads", url: "/leads", icon: Users },
  { title: "Clienti", url: "/clienti", icon: Building2 },
  { title: "Catalogo", url: "/catalogo", icon: Package },
  { title: "Campioni", url: "/campioni", icon: TestTube2 },
  { title: "Proposte", url: "/proposte", icon: FileText },
  { title: "Insight", url: "/insight", icon: Lightbulb },
];

function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b bg-card px-6 py-3 flex items-center justify-between sticky top-0 z-10">
        <Link href="/shop" className="flex items-center gap-2 font-serif text-xl tracking-tight hover:opacity-80 transition-opacity">
          <div className="h-5 w-5 bg-primary rounded-sm" />
          INTESSUTO
        </Link>
        <nav className="flex items-center gap-1">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/shop" className="flex items-center gap-1.5"><Store className="h-4 w-4" /> Catalogo</Link>
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/configuratore" className="flex items-center gap-1.5"><Wand2 className="h-4 w-4" /> Configuratore</Link>
          </Button>
        </nav>
      </header>
      <div className="flex-1">{children}</div>
    </div>
  );
}

export function Layout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const [location, setLocation] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isPublicRoute = PUBLIC_PATHS.some((p) => location.startsWith(p));

  useEffect(() => {
    if (!user && !isPublicRoute && location !== "/login") {
      setLocation("/login");
    }
  }, [user, location, setLocation, isPublicRoute]);

  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  if (isPublicRoute) {
    return <PublicLayout>{children}</PublicLayout>;
  }

  if (!user) {
    return <>{children}</>;
  }

  const handleLogout = () => {
    logout();
    setLocation("/login");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 flex flex-col">
      {/* Top Navigation */}
      <header className="h-14 border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-20 flex items-center justify-between px-4 md:px-6 shrink-0">
        {/* Left: logo + nav */}
        <div className="flex items-center gap-6">
          <Link href="/dashboard" className="flex items-center gap-2 shrink-0">
            <div className="w-7 h-7 rounded bg-amber-600 flex items-center justify-center font-bold text-white text-sm shadow shadow-amber-900/40">
              I
            </div>
            <span className="font-semibold text-base tracking-tight text-white hidden sm:block">Intessuto</span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const active = location.startsWith(item.url);
              return (
                <Link
                  key={item.url}
                  href={item.url}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    active
                      ? "text-amber-400 bg-amber-500/10"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
                  }`}
                >
                  <item.icon className="h-3.5 w-3.5 shrink-0" />
                  {item.title}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right: actions + user */}
        <div className="flex items-center gap-1 text-slate-400">
          {/* Public page shortcuts */}
          <div className="hidden md:flex items-center gap-1 mr-2 pr-3 border-r border-slate-800">
            <Link
              href="/shop"
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
            >
              <Store size={13} /> Catalogo
            </Link>
            <Link
              href="/configuratore"
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
            >
              <Wand2 size={13} /> Configuratore
            </Link>
          </div>

          <button className="hidden md:flex items-center justify-center w-8 h-8 rounded-md hover:text-white hover:bg-slate-800 transition-colors">
            <Search size={16} />
          </button>
          <button className="hidden md:flex items-center justify-center w-8 h-8 rounded-md hover:text-white hover:bg-slate-800 transition-colors relative">
            <Bell size={16} />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-rose-500 rounded-full"></span>
          </button>
          <button className="hidden md:flex items-center justify-center w-8 h-8 rounded-md hover:text-white hover:bg-slate-800 transition-colors">
            <Settings size={16} />
          </button>

          <div className="hidden md:flex items-center gap-2.5 ml-2 pl-3 border-l border-slate-800">
            <div className="h-7 w-7 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center">
              <UserCircle className="h-4 w-4 text-slate-400" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-xs font-medium text-white">{user.nome}</span>
              <span className="text-[10px] text-slate-500 capitalize">{user.ruolo}</span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center justify-center w-7 h-7 rounded-md hover:text-rose-400 hover:bg-rose-500/10 transition-colors ml-1"
              title="Logout"
            >
              <LogOut size={14} />
            </button>
          </div>

          {/* Mobile menu toggle */}
          <button
            className="md:hidden flex items-center justify-center w-8 h-8 rounded-md hover:text-white hover:bg-slate-800 transition-colors ml-1"
            onClick={() => setMobileOpen((v) => !v)}
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </header>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 top-14 z-10 bg-slate-950/95 backdrop-blur-sm flex flex-col p-4 gap-1 overflow-y-auto">
          {navItems.map((item) => {
            const active = location.startsWith(item.url);
            return (
              <Link
                key={item.url}
                href={item.url}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  active
                    ? "text-amber-400 bg-amber-500/10"
                    : "text-slate-300 hover:text-white hover:bg-slate-800"
                }`}
              >
                <item.icon className="h-4 w-4 shrink-0" />
                {item.title}
              </Link>
            );
          })}
          <div className="border-t border-slate-800 mt-3 pt-3 px-2 flex flex-col gap-3">
            <p className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold px-2">Pagine pubbliche</p>
            <div className="flex gap-2">
              <Link href="/shop" className="flex items-center gap-1.5 px-3 py-2 rounded-md text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 transition-colors flex-1">
                <Store size={13} /> Catalogo
              </Link>
              <Link href="/configuratore" className="flex items-center gap-1.5 px-3 py-2 rounded-md text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 transition-colors flex-1">
                <Wand2 size={13} /> Configuratore
              </Link>
            </div>
            <div className="flex items-center gap-3">
              <UserCircle className="h-5 w-5 text-slate-400" />
              <div>
                <div className="text-sm font-medium text-white">{user.nome}</div>
                <div className="text-xs text-slate-500 capitalize">{user.ruolo}</div>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-sm text-rose-400 hover:text-rose-300 transition-colors"
            >
              <LogOut size={14} /> Logout
            </button>
          </div>
        </div>
      )}

      {/* Page Content */}
      <main className="flex-1 overflow-auto">
        <div className="max-w-[1600px] mx-auto px-4 md:px-8 py-8">
          {children}
        </div>
      </main>
    </div>
  );
}
