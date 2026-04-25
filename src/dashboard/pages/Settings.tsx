import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Save, Trash2, Plus, Settings as SettingsIcon } from "lucide-react";
import { useState, type FormEvent } from "react";
import { api } from "../lib/api";

interface Setting {
  key: string;
  value: string;
  def?: { type: string; description: string; default?: unknown };
}

const KNOWN_KEYS = [
  { key: "xp.message.min", desc: "XP min par message" },
  { key: "xp.message.max", desc: "XP max par message" },
  { key: "xp.message.cooldown_ms", desc: "Cooldown XP (ms)" },
  { key: "xp.voice.per_minute", desc: "XP/min en vocal" },
  { key: "zeni.daily_quest", desc: "Récompense quête quotidienne" },
  { key: "channel.announce", desc: "Salon annonces" },
  { key: "channel.achievement", desc: "Salon accomplissements" },
  { key: "channel.commands", desc: "Salon commandes" },
];

export function Settings() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["settings"],
    queryFn: () => api.get<{ settings: Setting[] }>("/database/guild_settings?limit=100"),
  });

  const set = useMutation({
    mutationFn: (data: { key: string; value: string }) => api.post("/services/settings/set", data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["settings"] }),
  });
  const unset = useMutation({
    mutationFn: (key: string) => api.post("/services/settings/unset", { key }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["settings"] }),
  });

  if (isLoading) return <div className="text-zinc-500">Chargement en cours…</div>;

  const current = (data as any)?.rows ?? [];

  return (
    <div className="space-y-4">
      <div className="card">
        <div className="flex items-center gap-2">
          <SettingsIcon className="h-5 w-5 text-brand-400" />
          <h2 className="text-lg font-semibold">Configuration à chaud</h2>
        </div>
        <p className="mt-1 text-sm text-zinc-400">
          Surcharges runtime qui priment sur les variables d'environnement et les constantes codées
          en dur. Mise en cache 30 secondes côté bot.
        </p>
      </div>

      <div className="card">
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-zinc-400">
          Surcharges actives ({current.length})
        </h3>
        <div className="space-y-2">
          {current.map((s: any) => (
            <div
              key={s.key}
              className="flex items-center gap-3 rounded-lg border border-zinc-800 bg-zinc-950/40 p-3"
            >
              <code className="flex-1 font-mono text-sm">{s.key}</code>
              <code className="rounded bg-zinc-800 px-2 py-1 text-sm">{s.value}</code>
              <button
                type="button"
                onClick={() => unset.mutate(s.key)}
                className="btn btn-ghost px-2 text-red-400"
              >
                <Trash2 className="h-3 w-3" />
              </button>
            </div>
          ))}
          {current.length === 0 && (
            <p className="text-sm italic text-zinc-500">
              Aucune surcharge active. Les valeurs par défaut s'appliquent.
            </p>
          )}
        </div>
      </div>

      <AddSettingForm
        onSubmit={(key, value) => set.mutate({ key, value })}
        pending={set.isPending}
      />
    </div>
  );
}

function AddSettingForm({
  onSubmit,
  pending,
}: {
  onSubmit: (key: string, value: string) => void;
  pending: boolean;
}) {
  const [key, setKey] = useState(KNOWN_KEYS[0]?.key ?? "");
  const [value, setValue] = useState("");

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!key || !value) return;
    onSubmit(key, value);
    setValue("");
  };

  return (
    <form onSubmit={submit} className="card space-y-3">
      <h3 className="text-sm font-semibold uppercase tracking-wide text-zinc-400">
        Définir ou mettre à jour une surcharge
      </h3>
      <div className="grid gap-3 sm:grid-cols-3">
        <select className="input" value={key} onChange={(e) => setKey(e.target.value)}>
          {KNOWN_KEYS.map((k) => (
            <option key={k.key} value={k.key}>
              {k.key} · {k.desc}
            </option>
          ))}
        </select>
        <input
          className="input sm:col-span-2"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Nouvelle valeur (entier ou identifiant Discord)"
        />
      </div>
      <button type="submit" disabled={!value || pending} className="btn btn-primary">
        <Plus className="h-3 w-3" /> {pending ? "Application…" : "Appliquer la surcharge"}
      </button>
    </form>
  );
}
