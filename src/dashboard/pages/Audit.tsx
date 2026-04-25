import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { api } from "../lib/api";
import { formatRelative } from "../lib/utils";

interface ActionLog {
  id: number;
  action: string;
  userId: string | null;
  moderatorId: string | null;
  reason: string | null;
  meta: string | null;
  createdAt: number;
}

export function Audit() {
  const [page, setPage] = useState(0);
  const limit = 50;
  const offset = page * limit;

  const { data, isLoading } = useQuery({
    queryKey: ["audit", page],
    queryFn: () =>
      api.get<{ rows: ActionLog[]; total: number }>(
        `/database/action_logs?limit=${limit}&offset=${offset}`,
      ),
  });

  if (isLoading) return <div className="text-zinc-500">Chargement en cours…</div>;

  return (
    <div className="space-y-4">
      <div className="card">
        <h2 className="text-lg font-semibold">Journal d'audit</h2>
        <p className="mt-1 text-sm text-zinc-400">
          {data?.total ?? 0} entrée{(data?.total ?? 0) > 1 ? "s" : ""} (lecture seule). Toutes les
          actions de modération et d'administration sont tracées.
        </p>
      </div>

      <div className="card overflow-x-auto p-0">
        <table className="w-full text-sm">
          <thead className="border-b border-zinc-800 bg-zinc-900/40 text-xs uppercase tracking-wide text-zinc-400">
            <tr>
              <th className="px-3 py-2 text-left">Date</th>
              <th className="px-3 py-2 text-left">Action</th>
              <th className="px-3 py-2 text-left">Utilisateur</th>
              <th className="px-3 py-2 text-left">Modérateur</th>
              <th className="px-3 py-2 text-left">Motif</th>
              <th className="px-3 py-2 text-left">Métadonnées</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800 font-mono text-xs">
            {data?.rows.map((r) => (
              <tr key={r.id} className="hover:bg-zinc-900/30">
                <td
                  className="px-3 py-2 text-zinc-400"
                  title={new Date(r.createdAt).toLocaleString()}
                >
                  {formatRelative(r.createdAt)}
                </td>
                <td className="px-3 py-2">
                  <span className="badge">{r.action}</span>
                </td>
                <td className="px-3 py-2">{r.userId ?? "—"}</td>
                <td className="px-3 py-2">{r.moderatorId ?? "—"}</td>
                <td className="px-3 py-2 text-zinc-400">{r.reason ?? "—"}</td>
                <td className="max-w-xs truncate px-3 py-2 text-zinc-500" title={r.meta ?? ""}>
                  {r.meta ?? "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between">
        <button
          type="button"
          onClick={() => setPage((p) => Math.max(0, p - 1))}
          disabled={page === 0}
          className="btn btn-ghost"
        >
          Page précédente
        </button>
        <span className="text-sm text-zinc-400">
          Page {page + 1} sur {Math.max(1, Math.ceil((data?.total ?? 0) / limit))}
        </span>
        <button
          type="button"
          onClick={() => setPage((p) => p + 1)}
          disabled={offset + limit >= (data?.total ?? 0)}
          className="btn btn-ghost"
        >
          Page suivante
        </button>
      </div>
    </div>
  );
}
