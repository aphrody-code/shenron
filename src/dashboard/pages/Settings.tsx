import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ChevronDown,
  Coins,
  Hash,
  MessageSquare,
  Power,
  Settings as SettingsIcon,
  Shield,
  ShieldAlert,
  Trash2,
  Trophy,
  Languages,
  Wrench,
} from "lucide-react";
import { useMemo, useState } from "react";
import { api } from "../lib/api";
import { ChannelSelect } from "../components/ChannelSelect";
import { RoleSelect } from "../components/RoleSelect";

interface SettingDef {
  key: string;
  type: "int" | "float" | "snowflake" | "string" | "bool";
  description: string;
  default?: unknown;
  min?: number;
  max?: number;
  category?: string;
  channelType?: "text" | "voice" | "category" | "any";
  prefix?: boolean;
}

interface CurrentSetting {
  key: string;
  value: string;
}

const CATEGORY_META: Record<string, { label: string; icon: React.ElementType; desc: string }> = {
  xp: {
    label: "XP & niveaux",
    icon: Trophy,
    desc: "Gain d'XP par message, vocal, multipliers de rôle.",
  },
  economy: { label: "Économie", icon: Coins, desc: "Récompenses zenis, drops, bonus level-up." },
  channels: {
    label: "Salons",
    icon: Hash,
    desc: "Mappage des salons par fonction (welcome, logs, etc.).",
  },
  roles: { label: "Rôles", icon: Shield, desc: "Rôles spéciaux : fusion, jail, bio." },
  features: { label: "Fonctions", icon: Power, desc: "Activer / désactiver les modules du bot." },
  moderation: { label: "Modération", icon: ShieldAlert, desc: "Seuils warns, durées par défaut." },
  anti_invite: {
    label: "Anti-invitation",
    icon: MessageSquare,
    desc: "Détection de liens d'invitation Discord.",
  },
  translate: {
    label: "Traduction",
    icon: Languages,
    desc: "Endpoints traducteurs (Lingva, LibreTranslate).",
  },
  advanced: { label: "Avancé", icon: Wrench, desc: "Préfixes dynamiques (xp.boost.role.<id>)." },
};

const CATEGORY_ORDER = [
  "features",
  "channels",
  "roles",
  "xp",
  "economy",
  "moderation",
  "anti_invite",
  "translate",
  "advanced",
];

export function Settings() {
  const qc = useQueryClient();

  const schema = useQuery({
    queryKey: ["settings", "schema"],
    queryFn: () => api.get<{ keys: SettingDef[] }>("/settings/schema"),
    staleTime: 5 * 60_000,
  });

  const current = useQuery({
    queryKey: ["settings", "current"],
    queryFn: () => api.get<{ rows: CurrentSetting[] }>("/database/guild_settings?limit=200"),
  });

  const set = useMutation({
    mutationFn: (data: { key: string; value: string }) => api.post("/services/settings/set", data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["settings"] }),
  });
  const unset = useMutation({
    mutationFn: (key: string) => api.post("/services/settings/unset", { key }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["settings"] }),
  });

  const valueMap = useMemo(() => {
    const m = new Map<string, string>();
    for (const r of (current.data as any)?.rows ?? []) m.set(r.key, r.value);
    return m;
  }, [current.data]);

  const grouped = useMemo(() => {
    const all = schema.data?.keys ?? [];
    const byCat = new Map<string, SettingDef[]>();
    for (const k of all) {
      const cat = k.category ?? "advanced";
      if (!byCat.has(cat)) byCat.set(cat, []);
      byCat.get(cat)!.push(k);
    }
    return CATEGORY_ORDER.filter((c) => byCat.has(c)).map((c) => ({
      category: c,
      keys: byCat.get(c)!,
    }));
  }, [schema.data]);

  const overriddenCount = (current.data as any)?.rows?.length ?? 0;
  const xpBoostRoles = useMemo(() => {
    const out: { roleId: string; multiplier: string }[] = [];
    for (const [k, v] of valueMap) {
      if (k.startsWith("xp.boost.role.")) out.push({ roleId: k.slice(14), multiplier: v });
    }
    return out;
  }, [valueMap]);

  if (schema.isLoading) return <div className="text-zinc-500">Chargement du schema…</div>;

  return (
    <div className="space-y-4">
      <div className="card">
        <div className="flex items-center gap-2">
          <SettingsIcon className="h-5 w-5 text-brand-400" />
          <h2 className="text-lg font-semibold">Configuration complète</h2>
        </div>
        <p className="mt-1 text-sm text-zinc-400">
          {schema.data?.keys.filter((k) => !k.prefix).length} clés configurables · {overriddenCount}{" "}
          surcharges actives. Toute valeur sans surcharge utilise la valeur par défaut affichée.
          Cache bot 30 s.
        </p>
      </div>

      {grouped.map(({ category, keys }) => (
        <CategorySection
          key={category}
          category={category}
          keys={keys}
          valueMap={valueMap}
          onSet={(key, value) => set.mutate({ key, value })}
          onUnset={(key) => unset.mutate(key)}
          xpBoostRoles={category === "xp" ? xpBoostRoles : undefined}
          pending={set.isPending || unset.isPending}
        />
      ))}
    </div>
  );
}

function CategorySection({
  category,
  keys,
  valueMap,
  onSet,
  onUnset,
  xpBoostRoles,
  pending,
}: {
  category: string;
  keys: SettingDef[];
  valueMap: Map<string, string>;
  onSet: (key: string, value: string) => void;
  onUnset: (key: string) => void;
  xpBoostRoles?: { roleId: string; multiplier: string }[];
  pending: boolean;
}) {
  const meta = CATEGORY_META[category] ?? {
    label: category,
    icon: SettingsIcon,
    desc: "",
  };
  const Icon = meta.icon;
  const [open, setOpen] = useState(category === "features" || category === "channels");
  const overridden = keys.filter((k) => !k.prefix && valueMap.has(k.key)).length;
  const total = keys.filter((k) => !k.prefix).length;

  return (
    <div className="card p-0">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center gap-3 p-4 text-left transition-colors hover:bg-zinc-900/40"
      >
        <Icon className="h-5 w-5 shrink-0 text-brand-400" />
        <div className="flex-1">
          <h3 className="font-semibold">{meta.label}</h3>
          <p className="text-xs text-zinc-500">{meta.desc}</p>
        </div>
        <span className="badge">
          {overridden} / {total} surchargé{overridden > 1 ? "s" : ""}
        </span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-zinc-500 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <div className="border-t border-zinc-800 p-4">
          <div className="space-y-2">
            {keys
              .filter((k) => !k.prefix)
              .map((k) => (
                <SettingRow
                  key={k.key}
                  def={k}
                  current={valueMap.get(k.key)}
                  onSet={(v) => onSet(k.key, v)}
                  onUnset={() => onUnset(k.key)}
                  pending={pending}
                />
              ))}
          </div>
          {category === "xp" && xpBoostRoles && (
            <XpBoostRoleEditor
              entries={xpBoostRoles}
              onSet={(roleId, mult) => onSet(`xp.boost.role.${roleId}`, mult)}
              onUnset={(roleId) => onUnset(`xp.boost.role.${roleId}`)}
              pending={pending}
            />
          )}
        </div>
      )}
    </div>
  );
}

function SettingRow({
  def,
  current,
  onSet,
  onUnset,
  pending,
}: {
  def: SettingDef;
  current: string | undefined;
  onSet: (value: string) => void;
  onUnset: () => void;
  pending: boolean;
}) {
  const [draft, setDraft] = useState<string>(current ?? "");
  const [editing, setEditing] = useState(false);

  const isOverridden = current !== undefined;

  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-950/40 p-3">
      <div className="flex items-start gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <code className="text-sm font-medium">{def.key}</code>
            {isOverridden && <span className="badge badge-warning">surchargé</span>}
            {!isOverridden && def.default !== undefined && (
              <span className="text-xs text-zinc-500">défaut : {String(def.default)}</span>
            )}
          </div>
          <p className="mt-0.5 text-xs text-zinc-400">{def.description}</p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {!editing && (
            <SettingValuePreview def={def} value={current ?? def.default?.toString() ?? ""} />
          )}
          <button
            type="button"
            onClick={() => {
              setDraft(current ?? "");
              setEditing(!editing);
            }}
            className="btn btn-ghost px-2"
          >
            {editing ? "Fermer" : isOverridden ? "Modifier" : "Définir"}
          </button>
          {isOverridden && (
            <button
              type="button"
              onClick={onUnset}
              className="btn btn-ghost px-2 text-red-400"
              title="Supprimer la surcharge (retour au défaut)"
            >
              <Trash2 className="h-3 w-3" />
            </button>
          )}
        </div>
      </div>
      {editing && (
        <div className="mt-3 flex items-center gap-2 border-t border-zinc-800 pt-3">
          <SettingValueInput def={def} value={draft} onChange={setDraft} />
          <button
            type="button"
            onClick={() => {
              if (draft === "") return;
              onSet(draft);
              setEditing(false);
            }}
            disabled={pending || !draft}
            className="btn btn-primary"
          >
            Enregistrer
          </button>
        </div>
      )}
    </div>
  );
}

function SettingValueInput({
  def,
  value,
  onChange,
}: {
  def: SettingDef;
  value: string;
  onChange: (v: string) => void;
}) {
  if (def.type === "snowflake" && def.key.startsWith("channel.")) {
    const types =
      def.channelType === "voice"
        ? [2, 13]
        : def.channelType === "category"
          ? [4]
          : def.channelType === "any"
            ? [0, 2, 4, 5, 13, 15]
            : [0, 5, 15];
    return <ChannelSelect value={value} onChange={onChange} types={types} className="flex-1" />;
  }
  if (def.type === "snowflake" && def.key.startsWith("role.")) {
    return <RoleSelect value={value} onChange={onChange} className="flex-1" />;
  }
  if (def.type === "snowflake") {
    return (
      <input
        className="input flex-1 font-mono text-xs"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="snowflake (17-20 chiffres)"
      />
    );
  }
  if (def.type === "bool") {
    return (
      <select className="input flex-1" value={value} onChange={(e) => onChange(e.target.value)}>
        <option value="">— Choisir —</option>
        <option value="true">true (activé)</option>
        <option value="false">false (désactivé)</option>
      </select>
    );
  }
  if (def.type === "int" || def.type === "float") {
    return (
      <input
        className="input flex-1"
        type="number"
        step={def.type === "float" ? "0.01" : "1"}
        min={def.min}
        max={def.max}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    );
  }
  return (
    <input className="input flex-1" value={value} onChange={(e) => onChange(e.target.value)} />
  );
}

function SettingValuePreview({ def, value }: { def: SettingDef; value: string }) {
  if (!value) return <span className="text-xs italic text-zinc-600">non défini</span>;
  if (def.type === "snowflake" && def.key.startsWith("channel.")) {
    return <ChannelInline channelId={value} />;
  }
  if (def.type === "snowflake" && def.key.startsWith("role.")) {
    return <RoleInline roleId={value} />;
  }
  if (def.type === "bool") {
    const on = value === "true" || value === "1";
    return (
      <span className={`badge ${on ? "badge-success" : "badge-error"}`}>{on ? "ON" : "OFF"}</span>
    );
  }
  if (def.type === "int" || def.type === "float") {
    return (
      <code className="rounded bg-zinc-800 px-2 py-1 text-xs font-mono">
        {Number(value).toLocaleString("fr-FR")}
      </code>
    );
  }
  return <code className="rounded bg-zinc-800 px-2 py-1 text-xs font-mono">{value}</code>;
}

function ChannelInline({ channelId }: { channelId: string }) {
  const { data } = useQuery({
    queryKey: ["discord", "channels"],
    queryFn: () =>
      api.get<{ channels: { id: string; name: string; type: number }[] }>("/discord/channels"),
    staleTime: 30_000,
  });
  const c = data?.channels.find((x) => x.id === channelId);
  return (
    <code className="rounded bg-zinc-800 px-2 py-1 text-xs">{c ? `#${c.name}` : channelId}</code>
  );
}

function RoleInline({ roleId }: { roleId: string }) {
  const { data } = useQuery({
    queryKey: ["discord", "roles"],
    queryFn: () =>
      api.get<{ roles: { id: string; name: string; color: number }[] }>("/discord/roles"),
    staleTime: 30_000,
  });
  const r = data?.roles.find((x) => x.id === roleId);
  return (
    <code
      className="rounded bg-zinc-800 px-2 py-1 text-xs"
      style={
        r && r.color !== 0 ? { color: `#${r.color.toString(16).padStart(6, "0")}` } : undefined
      }
    >
      {r ? `@${r.name}` : roleId}
    </code>
  );
}

function XpBoostRoleEditor({
  entries,
  onSet,
  onUnset,
  pending,
}: {
  entries: { roleId: string; multiplier: string }[];
  onSet: (roleId: string, mult: string) => void;
  onUnset: (roleId: string) => void;
  pending: boolean;
}) {
  const [roleId, setRoleId] = useState("");
  const [mult, setMult] = useState("1.5");
  return (
    <div className="mt-4 rounded-lg border border-zinc-800 bg-zinc-950/40 p-3">
      <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-zinc-400">
        Multiplicateurs XP par rôle ({entries.length})
      </h4>
      <p className="mb-3 text-xs text-zinc-500">
        Si un membre a plusieurs rôles boostés, on prend le <strong>max</strong> (ne stack pas).
      </p>
      <div className="space-y-2">
        {entries.map((e) => (
          <div key={e.roleId} className="flex items-center gap-2">
            <RoleInline roleId={e.roleId} />
            <span className="text-xs text-zinc-500">×</span>
            <code className="rounded bg-zinc-800 px-2 py-1 text-xs">{e.multiplier}</code>
            <button
              type="button"
              onClick={() => onUnset(e.roleId)}
              className="btn btn-ghost px-2 text-red-400"
            >
              <Trash2 className="h-3 w-3" />
            </button>
          </div>
        ))}
      </div>
      <div className="mt-3 grid gap-2 sm:grid-cols-3">
        <RoleSelect value={roleId} onChange={setRoleId} />
        <input
          className="input"
          type="number"
          step="0.1"
          min="0.1"
          value={mult}
          onChange={(e) => setMult(e.target.value)}
          placeholder="1.5"
        />
        <button
          type="button"
          onClick={() => {
            if (!roleId || !mult) return;
            onSet(roleId, mult);
            setRoleId("");
            setMult("1.5");
          }}
          disabled={pending || !roleId || !mult}
          className="btn btn-primary"
        >
          Ajouter le booster
        </button>
      </div>
    </div>
  );
}
