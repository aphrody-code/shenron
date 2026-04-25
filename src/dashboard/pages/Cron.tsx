import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Play, Clock } from "lucide-react";
import { api } from "../lib/api";
import { formatDuration, formatRelative } from "../lib/utils";

interface CronJob {
  name: string;
  description: string | null;
  intervalMs: number;
  lastRunAt: number | null;
  lastDurationMs: number | null;
  runCount: number;
  lastError: string | null;
  nextRunAt: number | null;
}

export function Cron() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["cron"],
    queryFn: () => api.get<{ jobs: CronJob[] }>("/cron"),
    refetchInterval: 5_000,
  });

  const trigger = useMutation({
    mutationFn: (name: string) => api.post(`/cron/${name}/trigger`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["cron"] }),
  });

  if (isLoading) return <div className="text-zinc-500">Chargement…</div>;

  return (
    <div className="space-y-4">
      <div className="card">
        <h2 className="text-lg font-semibold">Cron jobs</h2>
        <p className="mt-1 text-sm text-zinc-400">
          Tâches périodiques registres dans <code>CronRegistry</code>. Auto-refresh 5s.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {data?.jobs.map((job) => (
          <div key={job.name} className="card">
            <div className="mb-3 flex items-start justify-between gap-3">
              <div>
                <h3 className="font-mono text-sm font-semibold text-brand-400">{job.name}</h3>
                {job.description && <p className="mt-1 text-xs text-zinc-400">{job.description}</p>}
              </div>
              <button
                type="button"
                onClick={() => trigger.mutate(job.name)}
                disabled={trigger.isPending}
                className="btn btn-primary"
              >
                <Play className="h-3 w-3" />
                Trigger
              </button>
            </div>

            <dl className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <dt className="text-zinc-500">Intervalle</dt>
                <dd className="font-medium">{formatDuration(job.intervalMs)}</dd>
              </div>
              <div>
                <dt className="text-zinc-500">Runs</dt>
                <dd className="font-medium">{job.runCount}</dd>
              </div>
              <div>
                <dt className="text-zinc-500">Dernier</dt>
                <dd className="font-medium">
                  {formatRelative(job.lastRunAt)}
                  {job.lastDurationMs != null && (
                    <span className="text-zinc-500"> ({job.lastDurationMs}ms)</span>
                  )}
                </dd>
              </div>
              <div>
                <dt className="text-zinc-500">Prochain</dt>
                <dd className="flex items-center gap-1 font-medium">
                  <Clock className="h-3 w-3" />
                  {formatRelative(job.nextRunAt)}
                </dd>
              </div>
            </dl>

            {job.lastError && (
              <div className="mt-3 rounded border border-red-800 bg-red-900/20 p-2 text-xs text-red-400">
                ⚠ {job.lastError}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
