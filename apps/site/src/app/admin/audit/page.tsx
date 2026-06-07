"use client";

import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { FileSearch, Loader2, AlertTriangle, ChevronLeft, ChevronRight } from "lucide-react";
import { api } from "@/lib/admin-api";
import { formatRelative } from "@/lib/admin-format";

interface ActionLog {
	id: number;
	action: string;
	userId: string | null;
	moderatorId: string | null;
	reason: string | null;
	meta: string | null;
	createdAt: string | number;
}

interface DiscordAuditEntry {
	id: string;
	user_id: string | null;
	target_id: string | null;
	action_type: number;
	reason?: string;
	changes?: { key: string; old_value?: unknown; new_value?: unknown }[];
}

interface DiscordAuditLog {
	audit_log_entries: DiscordAuditEntry[];
	users: { id: string; username: string; avatar: string | null }[];
}

// Labels lisibles pour les actions Discord
const ACTION_TYPE_LABELS: Record<number, string> = {
	1: "Mise à jour du serveur",
	10: "Création de salon",
	11: "Modification de salon",
	12: "Suppression de salon",
	20: "Expulsion de membre",
	21: "Élagage de membres",
	22: "Bannissement",
	23: "Débannissement",
	24: "Mise à jour de membre",
	25: "Changement de rôle",
	26: "Déplacement en vocal",
	27: "Déconnexion vocal",
	28: "Ajout de bot",
	30: "Création de rôle",
	31: "Modification de rôle",
	32: "Suppression de rôle",
	40: "Création d'invitation",
	42: "Suppression d'invitation",
	72: "Suppression de message",
	73: "Suppression de messages en masse",
	74: "Message épinglé",
	75: "Message désépinglé",
	83: "Règle d'auto-modération créée",
};

// Labels internes lisibles
const INTERNAL_ACTION_LABELS: Record<string, string> = {
	WARN: "Avertissement",
	UNWARN: "Retrait d'avertissement",
	MUTE: "Mise en sourdine",
	UNMUTE: "Fin de sourdine",
	JAIL: "Mise en prison",
	UNJAIL: "Libération de prison",
	BAN: "Bannissement",
	UNBAN: "Débannissement",
	KICK: "Expulsion",
	PURGE: "Suppression de messages",
	LOCK: "Verrouillage salon",
	UNLOCK: "Déverrouillage salon",
	SLOWMODE: "Mode lent activé",
	NOTE: "Note interne",
	CLEARWARNS: "Purge d'avertissements",
	ROLE: "Changement de rôle",
	ROLE_BULK: "Rôles en masse",
	LEVEL_UP: "Montée de niveau",
	SHOP_PURCHASE: "Achat boutique",
	ZENI_ADMIN_GIVE: "Don administrateur",
	ZENI_ADMIN_REMOVE: "Retrait administrateur",
	ZENI_ADMIN_SET: "Définition de solde",
	ZENI_ADMIN_BULK: "Distribution de masse",
};

function ts(v: string | number | null | undefined): number {
	if (!v) return 0;
	if (typeof v === "number") return v;
	const n = new Date(v).getTime();
	return Number.isFinite(n) ? n : 0;
}

export default function AuditPage() {
	const [source, setSource] = useState<"local" | "discord">("local");
	const [page, setPage] = useState(0);
	const limit = 50;
	const offset = page * limit;

	const local = useQuery({
		queryKey: ["audit", "local", page],
		queryFn: () =>
			api.get<{ rows: ActionLog[]; total: number }>(
				`/database/action_logs?limit=${limit}&offset=${offset}`
			),
		enabled: source === "local",
	});

	const discord = useQuery({
		queryKey: ["audit", "discord"],
		queryFn: () => api.get<DiscordAuditLog>(`/discord/audit-logs?limit=100`),
		enabled: source === "discord",
	});

	const data = local.data;
	const isLoading = source === "local" ? local.isLoading : discord.isLoading;
	const isError = source === "local" ? local.isError : discord.isError;

	return (
		<div className="space-y-4">
			{/* En-tête */}
			<div className="card">
				<div className="flex items-center justify-between gap-3 flex-wrap">
					<div>
						<div className="flex items-center gap-2">
							<FileSearch className="h-5 w-5 text-brand-400" />
							<h2 className="text-lg font-semibold">Journal d&apos;audit</h2>
						</div>
						<p className="mt-1 text-sm text-zinc-400">
							{source === "local"
								? `Historique interne : ${data?.total ?? 0} entrée${(data?.total ?? 0) !== 1 ? "s" : ""} enregistrées dans la base de données du bot.`
								: `Journal Discord officiel : ${discord.data?.audit_log_entries.length ?? 0} entrée${(discord.data?.audit_log_entries.length ?? 0) !== 1 ? "s" : ""} récupérées depuis Discord.`}
						</p>
					</div>
					<div className="flex gap-2">
						<button
							type="button"
							onClick={() => {
								setSource("local");
								setPage(0);
							}}
							className={`btn ${source === "local" ? "btn-primary" : "btn-ghost"}`}
						>
							Interne (bot)
						</button>
						<button
							type="button"
							onClick={() => setSource("discord")}
							className={`btn ${source === "discord" ? "btn-primary" : "btn-ghost"}`}
						>
							Discord
						</button>
					</div>
				</div>
			</div>

			{/* Chargement */}
			{isLoading && (
				<div className="flex items-center gap-2 text-zinc-500 text-sm">
					<Loader2 className="h-4 w-4 animate-spin" />
					Chargement du journal…
				</div>
			)}

			{/* Erreur */}
			{isError && (
				<div className="flex items-center gap-3 rounded-lg border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-400">
					<AlertTriangle className="h-4 w-4 shrink-0" />
					<div>
						<p className="font-semibold">Impossible de charger le journal.</p>
						{source === "discord" && (
							<p className="text-xs text-white/40 mt-0.5">
								Vérifiez que le bot possède la permission &quot;Voir le journal d&apos;audit&quot;
								sur le serveur.
							</p>
						)}
					</div>
				</div>
			)}

			{/* Journal Discord */}
			{source === "discord" && discord.data && (
				<div className="card overflow-x-auto p-0">
					<table className="w-full text-sm">
						<thead className="border-b border-zinc-800 bg-zinc-900/40 text-xs uppercase tracking-wide text-zinc-400">
							<tr>
								<th className="px-3 py-2 text-left">Action</th>
								<th className="px-3 py-2 text-left">Auteur</th>
								<th className="px-3 py-2 text-left">Cible</th>
								<th className="px-3 py-2 text-left">Motif</th>
								<th className="px-3 py-2 text-left">Changements</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-zinc-800 text-xs">
							{discord.data.audit_log_entries.map((e) => {
								const author = discord.data!.users.find((u) => u.id === e.user_id);
								return (
									<tr key={e.id} className="hover:bg-zinc-900/30">
										<td className="px-3 py-2">
											<span className="badge">
												{ACTION_TYPE_LABELS[e.action_type] ?? `Type ${e.action_type}`}
											</span>
										</td>
										<td className="px-3 py-2 font-mono">
											{author?.username ?? (
												<span title={e.user_id ?? ""}>
													{e.user_id ? `${e.user_id.slice(0, 6)}…${e.user_id.slice(-4)}` : "—"}
												</span>
											)}
										</td>
										<td className="px-3 py-2 text-zinc-400 font-mono">
											{e.target_id ? (
												<span title={e.target_id}>
													{e.target_id.slice(0, 6)}…{e.target_id.slice(-4)}
												</span>
											) : (
												"—"
											)}
										</td>
										<td className="px-3 py-2 text-zinc-400">
											{e.reason ?? <span className="italic text-zinc-600">Aucun motif</span>}
										</td>
										<td className="px-3 py-2 text-zinc-500">
											{e.changes?.map((c) => c.key).join(", ") || "—"}
										</td>
									</tr>
								);
							})}
							{discord.data.audit_log_entries.length === 0 && (
								<tr>
									<td colSpan={5} className="p-6 text-center text-zinc-500">
										Aucune entrée dans le journal Discord.
									</td>
								</tr>
							)}
						</tbody>
					</table>
				</div>
			)}

			{/* Journal interne */}
			{source === "local" && data && (
				<>
					<div className="card overflow-x-auto p-0">
						<table className="w-full text-sm">
							<thead className="border-b border-zinc-800 bg-zinc-900/40 text-xs uppercase tracking-wide text-zinc-400">
								<tr>
									<th className="px-3 py-2 text-left">Date</th>
									<th className="px-3 py-2 text-left">Action</th>
									<th className="px-3 py-2 text-left">Membre</th>
									<th className="px-3 py-2 text-left">Modérateur</th>
									<th className="px-3 py-2 text-left">Motif</th>
									<th className="px-3 py-2 text-left">Données</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-zinc-800 text-xs">
								{data.rows.map((r) => {
									const createdMs = ts(r.createdAt);
									return (
										<tr key={r.id} className="hover:bg-zinc-900/30">
											<td
												className="px-3 py-2 text-zinc-400"
												title={createdMs ? new Date(createdMs).toLocaleString("fr-FR") : ""}
											>
												{createdMs ? formatRelative(createdMs) : "—"}
											</td>
											<td className="px-3 py-2">
												<span className="badge">
													{INTERNAL_ACTION_LABELS[r.action] ?? r.action}
												</span>
											</td>
											<td className="px-3 py-2 font-mono">
												{r.userId ? (
													<span title={r.userId}>
														{r.userId.slice(0, 6)}…{r.userId.slice(-4)}
													</span>
												) : (
													"—"
												)}
											</td>
											<td className="px-3 py-2 font-mono">
												{r.moderatorId ? (
													<span title={r.moderatorId}>
														{r.moderatorId.slice(0, 6)}…{r.moderatorId.slice(-4)}
													</span>
												) : (
													"—"
												)}
											</td>
											<td className="px-3 py-2 text-zinc-400 max-w-[160px] truncate">
												{r.reason ?? <span className="italic text-zinc-600">Aucun motif</span>}
											</td>
											<td
												className="max-w-xs truncate px-3 py-2 text-zinc-500"
												title={r.meta ?? ""}
											>
												{r.meta ?? "—"}
											</td>
										</tr>
									);
								})}
								{data.rows.length === 0 && (
									<tr>
										<td colSpan={6} className="p-6 text-center text-zinc-500">
											Aucune entrée dans le journal interne.
										</td>
									</tr>
								)}
							</tbody>
						</table>
					</div>

					{/* Pagination */}
					<div className="flex items-center justify-between">
						<button
							type="button"
							onClick={() => setPage((p) => Math.max(0, p - 1))}
							disabled={page === 0}
							className="btn btn-ghost"
						>
							<ChevronLeft className="h-4 w-4" />
							Précédent
						</button>
						<span className="text-sm text-zinc-400">
							Page {page + 1} sur {Math.max(1, Math.ceil((data.total ?? 0) / limit))}
							<span className="ml-1 text-zinc-600">
								({data.total} entrée{data.total !== 1 ? "s" : ""})
							</span>
						</span>
						<button
							type="button"
							onClick={() => setPage((p) => p + 1)}
							disabled={offset + limit >= (data.total ?? 0)}
							className="btn btn-ghost"
						>
							Suivant
							<ChevronRight className="h-4 w-4" />
						</button>
					</div>
				</>
			)}
		</div>
	);
}
