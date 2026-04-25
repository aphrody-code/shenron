import { useQuery } from "@tanstack/react-query";
import { Activity, Server, Users, Cpu } from "lucide-react";
import { api } from "../lib/api";
import { formatBytes, formatDuration } from "../lib/utils";

export function Overview() {
  const health = useQuery({
    queryKey: ["health", "monitoring"],
    queryFn: () => api.get<any>("/health/monitoring"),
  });
  const stats = useQuery({
    queryKey: ["stats", "totals"],
    queryFn: () => api.get<any>("/stats/totals"),
  });

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card title="Bot" icon={<Server className="h-4 w-4" />}>
          {health.data?.botStatus.online ? (
            <span className="badge badge-success">en ligne</span>
          ) : (
            <span className="badge badge-error">hors ligne</span>
          )}
          <p className="mt-2 text-xs text-zinc-400">
            Uptime {health.data ? formatDuration(health.data.botStatus.uptime ?? 0) : "—"}
          </p>
        </Card>

        <Card title="Joueurs en base" icon={<Users className="h-4 w-4" />}>
          <p className="text-3xl font-bold text-brand-400">{stats.data?.stats.totalUsers ?? "—"}</p>
          <p className="mt-2 text-xs text-zinc-400">
            {stats.data?.stats.totalActiveUsers ?? "—"} actifs ·{" "}
            {stats.data?.stats.totalGuilds ?? "—"} serveurs
          </p>
        </Card>

        <Card title="Latence" icon={<Activity className="h-4 w-4" />}>
          <p className="text-3xl font-bold">
            {health.data?.latency.ws ?? "—"}
            <span className="text-sm text-zinc-500">ms</span>
          </p>
          <p className="mt-2 text-xs text-zinc-400">
            WS Discord · base {health.data?.latency.db ?? "—"} ms
          </p>
        </Card>

        <Card title="Mémoire du bot" icon={<Cpu className="h-4 w-4" />}>
          <p className="text-3xl font-bold">
            {health.data ? formatBytes(health.data.pid.rss).split(" ")[0] : "—"}
            <span className="text-sm text-zinc-500">
              {" "}
              {health.data ? formatBytes(health.data.pid.rss).split(" ")[1] : ""}
            </span>
          </p>
          <p className="mt-2 text-xs text-zinc-400">
            Processeur {health.data?.pid.cpu ?? "—"} % · machine{" "}
            {health.data?.host.cpu.usage ?? "—"} %
          </p>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="card">
          <h2 className="mb-4 text-lg font-semibold">Commandes</h2>
          <p className="text-2xl font-bold text-brand-400">
            {stats.data?.stats.totalCommands ?? "—"}
          </p>
          <p className="mt-2 text-sm text-zinc-400">Commandes slash enregistrées sur le serveur</p>
        </div>

        <div className="card">
          <h2 className="mb-4 text-lg font-semibold">Machine hôte</h2>
          {health.data ? (
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-zinc-400">Système</dt>
                <dd>{health.data.host.platform}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-zinc-400">Cœurs CPU</dt>
                <dd>{health.data.host.cpu.count}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-zinc-400">Mémoire</dt>
                <dd>
                  {formatBytes(health.data.host.memory.used)} /{" "}
                  {formatBytes(health.data.host.memory.total)}{" "}
                  <span className="text-zinc-500">({health.data.host.memory.usage} %)</span>
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-zinc-400">Uptime de la machine</dt>
                <dd>{formatDuration(health.data.host.uptime * 1000)}</dd>
              </div>
            </dl>
          ) : (
            <p className="text-zinc-500">…</p>
          )}
        </div>
      </div>
    </div>
  );
}

interface CardProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}

function Card({ title, icon, children }: CardProps) {
  return (
    <div className="card">
      <div className="mb-3 flex items-center gap-2 text-zinc-400">
        {icon}
        <h3 className="text-sm font-medium">{title}</h3>
      </div>
      {children}
    </div>
  );
}
