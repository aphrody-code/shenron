import type { ReactNode } from "react";
import {
  Activity,
  Database,
  Clock,
  Wrench,
  Bot,
  LogOut,
  Home,
  BarChart3,
  FileText,
  Settings as SettingsIcon,
  Terminal,
} from "lucide-react";
import { api } from "../lib/api";
import { cn } from "../lib/utils";

const NAV = [
  { path: "/", label: "Tableau de bord", icon: Home },
  { path: "/bot", label: "Bot · 44 commandes", icon: Bot },
  { path: "/database", label: "Base de données · 16 tables", icon: Database },
  { path: "/cron", label: "Tâches planifiées · 3", icon: Clock },
  { path: "/services", label: "Services · 15 actions", icon: Wrench },
  { path: "/stats", label: "Statistiques", icon: BarChart3 },
  { path: "/audit", label: "Journal d'audit", icon: FileText },
  { path: "/logs", label: "Journaux du service", icon: Terminal },
  { path: "/settings", label: "Configuration", icon: SettingsIcon },
];

interface Props {
  route: string;
  navigate: (path: string) => void;
  children: ReactNode;
}

export function Layout({ route, navigate, children }: Props) {
  const logout = async () => {
    await api.post("/auth/logout").catch(() => {});
    window.location.href = "/login";
  };

  return (
    <div className="flex min-h-screen">
      <aside className="sticky top-0 hidden h-screen w-72 flex-col border-r border-zinc-800 bg-zinc-950/80 backdrop-blur md:flex">
        <div className="flex items-center gap-3 border-b border-zinc-800 p-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-500/10 font-bold text-brand-400">
            S
          </div>
          <div>
            <h1 className="font-bold text-brand-400">Shenron</h1>
            <p className="text-xs text-zinc-500">Tableau de bord admin</p>
          </div>
        </div>

        <nav className="flex-1 space-y-1 p-3">
          {NAV.map(({ path, label, icon: Icon }) => {
            const active = route === path || (path !== "/" && route.startsWith(path));
            return (
              <button
                key={path}
                type="button"
                onClick={() => navigate(path)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                  active
                    ? "bg-brand-500/10 text-brand-400"
                    : "text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100",
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span className="truncate">{label}</span>
              </button>
            );
          })}
        </nav>

        <div className="border-t border-zinc-800 p-3">
          <button type="button" onClick={logout} className="btn btn-ghost w-full justify-start">
            <LogOut className="h-4 w-4" />
            Déconnexion
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-x-hidden">
        <header className="sticky top-0 z-10 flex items-center gap-3 border-b border-zinc-800 bg-zinc-950/90 px-6 py-3 backdrop-blur">
          <Activity className="h-4 w-4 text-brand-400" />
          <span className="text-sm font-medium text-zinc-300">{routeLabel(route)}</span>
        </header>
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}

function routeLabel(route: string): string {
  if (route === "/") return "Tableau de bord";
  if (route.startsWith("/database/"))
    return `Base de données · ${route.slice("/database/".length)}`;
  const match = NAV.find((n) => n.path === route);
  return match?.label ?? route;
}
