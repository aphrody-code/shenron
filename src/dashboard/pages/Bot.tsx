import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { ChevronDown, Bot as BotIcon, Globe, Hash } from "lucide-react";
import { api } from "../lib/api";

interface Command {
  name: string;
  description: string;
  type: number;
  guildId: string | null;
  nsfw: boolean;
  options: Array<{
    name: string;
    description: string;
    type: number;
    required: boolean;
    choices?: Array<{ name: string; value: string | number }>;
  }>;
}

interface Guild {
  id: string;
  name: string;
  memberCount: number;
  iconUrl: string | null;
  joinedAt: string | null;
}

const TYPE_LABELS: Record<number, string> = {
  1: "CHAT_INPUT",
  2: "USER",
  3: "MESSAGE",
};

const OPTION_TYPES: Record<number, string> = {
  1: "SUB_COMMAND",
  2: "SUB_COMMAND_GROUP",
  3: "STRING",
  4: "INTEGER",
  5: "BOOLEAN",
  6: "USER",
  7: "CHANNEL",
  8: "ROLE",
  9: "MENTIONABLE",
  10: "NUMBER",
  11: "ATTACHMENT",
};

export function Bot() {
  const cmds = useQuery({
    queryKey: ["bot", "commands"],
    queryFn: () => api.get<{ commands: Command[]; count: number }>("/bot/commands"),
  });
  const guilds = useQuery({
    queryKey: ["bot", "guilds"],
    queryFn: () => api.get<{ guilds: Guild[] }>("/bot/guilds"),
  });

  return (
    <div className="space-y-6">
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="card">
          <div className="mb-2 flex items-center gap-2 text-zinc-400">
            <BotIcon className="h-4 w-4" />
            <h3 className="text-sm font-medium">Commandes</h3>
          </div>
          <p className="text-3xl font-bold text-brand-400">{cmds.data?.count ?? "—"}</p>
        </div>
        <div className="card">
          <div className="mb-2 flex items-center gap-2 text-zinc-400">
            <Globe className="h-4 w-4" />
            <h3 className="text-sm font-medium">Serveurs</h3>
          </div>
          <p className="text-3xl font-bold text-brand-400">{guilds.data?.guilds.length ?? "—"}</p>
        </div>
        <div className="card">
          <div className="mb-2 flex items-center gap-2 text-zinc-400">
            <Hash className="h-4 w-4" />
            <h3 className="text-sm font-medium">Total des membres</h3>
          </div>
          <p className="text-3xl font-bold text-brand-400">
            {guilds.data?.guilds.reduce((s, g) => s + g.memberCount, 0) ?? "—"}
          </p>
        </div>
      </div>

      <div className="card">
        <h2 className="mb-3 text-lg font-semibold">Serveurs Discord</h2>
        <div className="space-y-2">
          {guilds.data?.guilds.map((g) => (
            <div
              key={g.id}
              className="flex items-center gap-3 rounded-lg border border-zinc-800 bg-zinc-950/40 p-3"
            >
              {g.iconUrl ? (
                <img src={g.iconUrl} alt="" className="h-10 w-10 rounded-full" />
              ) : (
                <div className="h-10 w-10 rounded-full bg-zinc-800" />
              )}
              <div className="flex-1">
                <p className="font-medium">{g.name}</p>
                <p className="text-xs text-zinc-500">
                  {g.memberCount} membres · rejoint le {g.joinedAt?.slice(0, 10) ?? "—"}
                </p>
              </div>
              <code className="text-xs text-zinc-500">{g.id}</code>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <h2 className="mb-3 text-lg font-semibold">Commandes slash ({cmds.data?.count ?? "—"})</h2>
        <div className="space-y-2">
          {cmds.data?.commands.map((c) => (
            <CommandRow key={c.name} cmd={c} />
          ))}
        </div>
      </div>
    </div>
  );
}

function CommandRow({ cmd }: { cmd: Command }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-950/40">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-start gap-3 p-3 text-left transition-colors hover:bg-zinc-900/50"
      >
        <ChevronDown
          className={`mt-0.5 h-4 w-4 shrink-0 transition-transform ${open ? "rotate-0" : "-rotate-90"}`}
        />
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <code className="font-mono text-sm font-semibold text-brand-400">/{cmd.name}</code>
            <span className="badge">{TYPE_LABELS[cmd.type] ?? `type:${cmd.type}`}</span>
            {cmd.nsfw && <span className="badge badge-warning">NSFW</span>}
            {cmd.options.length > 0 && (
              <span className="badge">
                {cmd.options.length} option{cmd.options.length > 1 ? "s" : ""}
              </span>
            )}
          </div>
          <p className="mt-0.5 text-xs text-zinc-400">{cmd.description}</p>
        </div>
      </button>

      {open && cmd.options.length > 0 && (
        <div className="border-t border-zinc-800 p-3">
          <table className="w-full text-xs">
            <thead className="text-zinc-500">
              <tr>
                <th className="px-2 py-1 text-left">Nom</th>
                <th className="px-2 py-1 text-left">Type</th>
                <th className="px-2 py-1 text-left">Obligatoire</th>
                <th className="px-2 py-1 text-left">Description</th>
                <th className="px-2 py-1 text-left">Choix</th>
              </tr>
            </thead>
            <tbody>
              {cmd.options.map((o) => (
                <tr key={o.name} className="border-t border-zinc-900">
                  <td className="px-2 py-1 font-mono">{o.name}</td>
                  <td className="px-2 py-1 text-zinc-400">{OPTION_TYPES[o.type] ?? o.type}</td>
                  <td className="px-2 py-1">{o.required ? "Oui" : "—"}</td>
                  <td className="px-2 py-1 text-zinc-400">{o.description}</td>
                  <td className="px-2 py-1 text-zinc-400">
                    {o.choices?.map((c) => c.name).join(", ") ?? "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
