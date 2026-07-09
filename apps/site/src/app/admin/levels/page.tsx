"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { UserSelect } from "@/components/admin/UserSelect";
import {
	Trophy,
	TrendingUp,
	Plus,
	Trash2,
	Save,
	Mic,
	MessageSquare,
	Coins,
	Flame,
	Loader2,
	AlertTriangle,
	CheckCircle2,
	X,
} from "lucide-react";
import { type FormEvent, useState } from "react";
import { api } from "@/lib/admin-api";
import { formatDuration } from "@/lib/admin-format";
import { RoleBadge } from "@/components/admin/RoleSelect";
import { RolePicker } from "@/components/admin/RolePicker";

interface Threshold {
	level: number;
	xp: number;
}

interface ConfigResponse {
	thresholds: Threshold[];
	defaults: Record<string, number>;
	overrides: Record<string, string>;
}

interface DistributionBucket {
	level: number;
	minXp: number;
	maxXp: number;
	count: number;
}

interface LevelReward {
	level: number;
	roleId: string;
	xpThreshold: number;
	zeniBonus: number;
}

interface RaceReward {
	race: string;
	level: number;
	roleId: string;
}

// Races du serveur (aligné sur RACE_IDS côté bot : lib/races.ts).
const RACE_OPTIONS: { id: string; label: string }[] = [
	{ id: "saiyan", label: "Saiyan" },
	{ id: "humain", label: "Humain / Terrien" },
	{ id: "namek", label: "Namek" },
	{ id: "mutant", label: "Mutant / Freezer" },
	{ id: "cyborg", label: "Cyborg" },
	{ id: "majin", label: "Majin" },
];

const raceLabel = (race: string): string =>
	RACE_OPTIONS.find((r) => r.id === race)?.label ?? race;

interface TopUser {
	id: string;
	xp: number;
	zeni: number;
	lastLevelReached: number;
	messageCount: number;
	totalVoiceMs: number;
	dailyStreak: number;
}

type Metric = "xp" | "zeni" | "voice" | "streak" | "messages";

// Modale de confirmation pour les actions destructives
function ConfirmDialog({
	title,
	message,
	confirmLabel,
	onConfirm,
	onCancel,
}: {
	title: string;
	message: string;
	confirmLabel: string;
	onConfirm: () => void;
	onCancel: () => void;
}) {
	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
			<div className="card w-full max-w-sm space-y-4 border border-red-500/40">
				<div className="flex items-start gap-3">
					<AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-red-400" />
					<div>
						<h3 className="font-semibold text-white">{title}</h3>
						<p className="mt-1 text-sm text-zinc-400">{message}</p>
					</div>
					<button type="button" onClick={onCancel} className="ml-auto btn btn-ghost px-1 py-1">
						<X className="h-4 w-4" />
					</button>
				</div>
				<div className="flex justify-end gap-2">
					<button type="button" onClick={onCancel} className="btn btn-ghost">
						Annuler
					</button>
					<button
						type="button"
						onClick={onConfirm}
						className="btn btn-primary bg-red-600 hover:bg-red-500 border-red-500"
					>
						{confirmLabel}
					</button>
				</div>
			</div>
		</div>
	);
}

export default function LevelsPage() {
	const config = useQuery({
		queryKey: ["levels", "config"],
		queryFn: () => api.get<ConfigResponse>("/levels/config"),
	});
	const distribution = useQuery({
		queryKey: ["levels", "distribution"],
		queryFn: () => api.get<{ buckets: DistributionBucket[] }>("/levels/distribution"),
	});
	const rewards = useQuery({
		queryKey: ["levels", "rewards"],
		queryFn: () => api.get<{ rewards: LevelReward[] }>("/levels/rewards"),
	});
	const raceRewards = useQuery({
		queryKey: ["levels", "race-rewards"],
		queryFn: () => api.get<{ rewards: RaceReward[] }>("/levels/race-rewards"),
	});

	return (
		<div className="space-y-6">
			{/* En-tête */}
			<div className="card">
				<div className="flex items-center gap-2">
					<Trophy className="h-5 w-5 text-brand-400" />
					<h2 className="text-lg font-semibold">Niveaux et XP</h2>
				</div>
				<p className="mt-1 text-sm text-zinc-400">
					Cette page vous permet de consulter les paliers d&apos;expérience, la répartition des
					joueurs, gérer les récompenses de niveau et modifier manuellement l&apos;XP ou les zénis
					d&apos;un membre. Le palier ultime &laquo;&nbsp;It&apos;s over 9
					millions&nbsp;!&nbsp;&raquo; correspond à 9&nbsp;000&nbsp;000 XP.
				</p>
			</div>

			{config.isError && (
				<div className="flex items-center gap-3 rounded-lg border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-400">
					<AlertTriangle className="h-4 w-4 shrink-0" />
					Impossible de charger la configuration. Le bot est-il en ligne ?
				</div>
			)}

			<XpRatesCard config={config.data} loading={config.isLoading} />
			<ThresholdCurveCard />
			<ThresholdsCard
				config={config.data}
				distribution={distribution.data?.buckets}
				loading={distribution.isLoading}
			/>
			<RewardsCard rewards={rewards.data?.rewards ?? []} loading={rewards.isLoading} />
			<RaceRewardsCard
				rewards={raceRewards.data?.rewards ?? []}
				loading={raceRewards.isLoading}
			/>
			<TopsCard />
			<ManualActionsCard />
		</div>
	);
}

function effective(config: ConfigResponse | undefined, key: string): string {
	if (!config) return "—";
	if (config.overrides[key] !== undefined) return config.overrides[key]!;
	const def = config.defaults[key];
	return def !== undefined ? String(def) : "—";
}

function XpRatesCard({
	config,
	loading,
}: {
	config: ConfigResponse | undefined;
	loading: boolean;
}) {
	if (loading)
		return (
			<div className="flex items-center gap-2 rounded-lg border border-zinc-800 p-4 text-zinc-500">
				<Loader2 className="h-4 w-4 animate-spin" />
				Chargement de la configuration…
			</div>
		);
	if (!config) return null;

	const rates = [
		{
			key: "xp.message.min",
			label: "XP minimum par message",
			icon: <MessageSquare className="h-4 w-4" />,
			tooltip: "Quantité minimale d'XP gagnée à chaque message envoyé.",
		},
		{
			key: "xp.message.max",
			label: "XP maximum par message",
			icon: <MessageSquare className="h-4 w-4" />,
			tooltip: "Quantité maximale d'XP gagnée à chaque message envoyé.",
		},
		{
			key: "xp.message.cooldown_ms",
			label: "Délai entre messages (ms)",
			icon: <MessageSquare className="h-4 w-4" />,
			tooltip: "Temps d'attente en millisecondes entre deux gains d'XP par message.",
		},
		{
			key: "xp.voice.per_minute",
			label: "XP par minute en vocal",
			icon: <Mic className="h-4 w-4" />,
			tooltip: "XP gagnée toutes les minutes passées dans un salon vocal.",
		},
		{
			key: "zeni.daily_quest",
			label: "Récompense quête quotidienne",
			icon: <Flame className="h-4 w-4" />,
			tooltip: "Zénis obtenus en complétant la quête quotidienne.",
		},
		{
			key: "zeni.per_level",
			label: "Bonus zénis par montée de niveau",
			icon: <Coins className="h-4 w-4" />,
			tooltip: "Zénis offerts à chaque fois qu'un joueur monte de niveau.",
		},
	];

	return (
		<div className="card">
			<h3 className="mb-1 text-sm font-semibold uppercase tracking-wide text-zinc-400">
				Taux d&apos;XP et de zénis
			</h3>
			<p className="mb-3 text-xs text-zinc-500">
				Valeurs actuellement en vigueur sur le serveur. Pour modifier ces paramètres, rendez-vous
				sur la page <strong>Paramètres</strong> ou utilisez la commande <code>/config</code> dans
				Discord.
			</p>
			<div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
				{rates.map((r) => {
					const value = effective(config, r.key);
					const overridden = config?.overrides[r.key] !== undefined;
					return (
						<div
							key={r.key}
							className="rounded-lg border border-zinc-800 bg-zinc-950/40 p-3"
							title={r.tooltip}
						>
							<div className="mb-1 flex items-center gap-2 text-xs text-zinc-400">
								{r.icon}
								<span>{r.label}</span>
							</div>
							<p className="text-xl font-bold text-brand-400">{value}</p>
							{overridden && (
								<span className="mt-1 inline-block badge badge-warning text-[10px]">
									Valeur personnalisée
								</span>
							)}
						</div>
					);
				})}
			</div>
		</div>
	);
}

interface Threshold {
	level: number;
	xp: number;
}

/**
 * Éditeur de la COURBE DE NIVEAUX (paliers XP → niveau). Modifie la table active
 * côté bot (guild_settings.xp.thresholds) : ajout/suppression de paliers (jusqu'à
 * 50), XP par niveau. La progression de TOUS les joueurs s'y recale à chaud.
 */
function ThresholdCurveCard() {
	const qc = useQueryClient();
	const query = useQuery({
		queryKey: ["levels", "thresholds"],
		queryFn: () => api.get<{ thresholds: Threshold[] }>("/levels/thresholds"),
	});
	const [rows, setRows] = useState<Threshold[] | null>(null);
	const [err, setErr] = useState<string | null>(null);

	// Hydrate l'état local depuis la DB une fois chargé (ou après reset).
	const serverRows = query.data?.thresholds;
	const current = rows ?? serverRows ?? [];

	const save = useMutation({
		mutationFn: (next: Threshold[]) =>
			api.put<{ ok: boolean; thresholds: Threshold[] }>("/levels/thresholds", { thresholds: next }),
		onSuccess: (res) => {
			setErr(null);
			setRows(res.thresholds);
			void qc.invalidateQueries({ queryKey: ["levels"] });
			void qc.invalidateQueries({ queryKey: ["levels", "config"] });
		},
		onError: (e) => setErr(e instanceof Error ? e.message : "Échec de l'enregistrement."),
	});

	function edit(i: number, field: keyof Threshold, value: number) {
		setRows(current.map((r, j) => (j === i ? { ...r, [field]: value } : r)));
	}
	function addRow() {
		const maxLevel = current.reduce((m, r) => Math.max(m, r.level), 0);
		const maxXp = current.reduce((m, r) => Math.max(m, r.xp), 0);
		setRows([...current, { level: maxLevel + 1, xp: maxXp * 2 || 1000 }]);
	}
	function removeRow(i: number) {
		setRows(current.filter((_, j) => j !== i));
	}

	const dirty = JSON.stringify(current) !== JSON.stringify(serverRows ?? []);

	return (
		<div className="card">
			<h3 className="mb-1 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-zinc-400">
				<TrendingUp className="h-4 w-4" />
				Courbe de niveaux — paliers XP éditables
			</h3>
			<p className="mb-3 text-xs text-zinc-500">
				Définissez l&apos;XP requis pour chaque niveau. La progression de tous les joueurs se
				recale immédiatement (recalcul du niveau + rôles de palier au prochain gain d&apos;XP).
				Jusqu&apos;à 50 paliers ; l&apos;XP doit croître avec le niveau.
			</p>

			{query.isLoading ? (
				<div className="flex items-center gap-2 text-sm text-zinc-500">
					<Loader2 className="h-4 w-4 animate-spin" /> Chargement…
				</div>
			) : (
				<div className="space-y-2">
					<div className="flex items-center gap-3 px-1 text-[10px] font-bold uppercase tracking-wider text-zinc-500">
						<span className="w-20">Niveau</span>
						<span className="flex-1">XP requis</span>
						<span className="w-8" />
					</div>
					{current
						.slice()
						.sort((a, b) => a.level - b.level)
						.map((t) => {
							const idx = current.indexOf(t);
							return (
								<div key={idx} className="flex items-center gap-3">
									<input
										type="number"
										min={1}
										value={t.level}
										onChange={(e) => edit(idx, "level", Number(e.target.value))}
										className="w-20 rounded border border-zinc-700 bg-zinc-900 px-2 py-1 font-mono text-xs text-white"
									/>
									<input
										type="number"
										min={0}
										value={t.xp}
										onChange={(e) => edit(idx, "xp", Number(e.target.value))}
										className="flex-1 rounded border border-zinc-700 bg-zinc-900 px-2 py-1 font-mono text-xs text-white"
									/>
									<button
										type="button"
										onClick={() => removeRow(idx)}
										title="Supprimer ce palier"
										className="w-8 rounded p-1 text-red-400 hover:text-red-300"
									>
										<Trash2 className="h-4 w-4" />
									</button>
								</div>
							);
						})}
					<div className="flex flex-wrap items-center gap-2 pt-2">
						<button
							type="button"
							onClick={addRow}
							className="inline-flex items-center gap-1 rounded border border-zinc-700 px-2 py-1 text-xs text-zinc-300 hover:border-brand-500"
						>
							<Plus className="h-3.5 w-3.5" /> Ajouter un palier
						</button>
						<button
							type="button"
							disabled={!dirty || save.isPending || current.length === 0}
							onClick={() => save.mutate(current)}
							className="inline-flex items-center gap-1 rounded bg-brand-600 px-3 py-1 text-xs font-bold text-white hover:bg-brand-500 disabled:opacity-40"
						>
							<Save className="h-3.5 w-3.5" />
							{save.isPending ? "Enregistrement…" : "Enregistrer la courbe"}
						</button>
						{dirty && !save.isPending && (
							<button
								type="button"
								onClick={() => {
									setRows(null);
									setErr(null);
								}}
								className="text-xs text-zinc-500 hover:text-zinc-300"
							>
								Annuler
							</button>
						)}
						{save.isSuccess && !dirty && <span className="text-xs text-green-400">Enregistré ✓</span>}
					</div>
					{err && <p className="text-xs text-red-400">{err}</p>}
				</div>
			)}
		</div>
	);
}

function ThresholdsCard({
	config,
	distribution,
	loading,
}: {
	config: ConfigResponse | undefined;
	distribution: DistributionBucket[] | undefined;
	loading: boolean;
}) {
	if (!config) return null;
	const total = (distribution ?? []).reduce((s, b) => s + b.count, 0);
	const max = Math.max(...(distribution ?? [{ count: 1 }]).map((b) => b.count), 1);

	return (
		<div className="card">
			<h3 className="mb-1 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-zinc-400">
				<TrendingUp className="h-4 w-4" />
				Paliers DBZ — répartition des joueurs
			</h3>
			<p className="mb-3 text-xs text-zinc-500">
				Chaque barre représente le nombre de joueurs dans ce palier d&apos;XP. Total :{" "}
				<strong>
					{total} joueur{total !== 1 ? "s" : ""}
				</strong>{" "}
				enregistré{total !== 1 ? "s" : ""}.
			</p>
			{loading && (
				<div className="flex items-center gap-2 text-zinc-500 text-sm">
					<Loader2 className="h-4 w-4 animate-spin" />
					Chargement de la distribution…
				</div>
			)}
			<div className="space-y-2">
				{config.thresholds.map((t, i) => {
					const bucket = distribution?.find((b) => b.level === t.level);
					const minXp = i === 0 ? 0 : config.thresholds[i - 1]!.xp;
					const count = bucket?.count ?? 0;
					return (
						<div key={t.level} className="flex items-center gap-3">
							<span className="w-20 font-mono text-xs text-zinc-400">niveau {t.level}</span>
							<span className="w-32 text-right font-mono text-xs text-zinc-500">
								{minXp.toLocaleString("fr-FR")} – {t.xp.toLocaleString("fr-FR")}
							</span>
							<div className="relative h-5 flex-1 overflow-hidden rounded bg-zinc-800">
								<div
									className="h-full bg-gradient-to-r from-brand-600 to-brand-400 transition-all"
									style={{ width: `${(count / max) * 100}%` }}
								/>
							</div>
							<span className="w-20 text-right font-mono text-xs">
								{count} joueur{count !== 1 ? "s" : ""}
							</span>
						</div>
					);
				})}
				{distribution?.find((b) => b.level === 11)?.count ? (
					<div className="flex items-center gap-3">
						<span className="w-20 font-mono text-xs text-amber-400">au-delà</span>
						<span className="w-32 text-right font-mono text-xs text-zinc-500">&gt; 9 000 000</span>
						<div className="relative h-5 flex-1 overflow-hidden rounded bg-zinc-800">
							<div
								className="h-full bg-gradient-to-r from-amber-600 to-amber-400 transition-all"
								style={{
									width: `${((distribution?.find((b) => b.level === 11)?.count ?? 0) / max) * 100}%`,
								}}
							/>
						</div>
						<span className="w-20 text-right font-mono text-xs text-amber-400">
							{distribution?.find((b) => b.level === 11)?.count}
						</span>
					</div>
				) : null}
			</div>
		</div>
	);
}

function RewardsCard({ rewards, loading }: { rewards: LevelReward[]; loading: boolean }) {
	const qc = useQueryClient();
	const [editing, setEditing] = useState<LevelReward | null>(null);
	const [adding, setAdding] = useState(false);
	const [confirmDelete, setConfirmDelete] = useState<LevelReward | null>(null);
	const [successMsg, setSuccessMsg] = useState<string | null>(null);

	const showSuccess = (msg: string) => {
		setSuccessMsg(msg);
		setTimeout(() => setSuccessMsg(null), 3000);
	};

	const upsert = useMutation({
		mutationFn: (r: LevelReward) =>
			api.post("/levels/rewards", {
				level: r.level,
				roleId: r.roleId,
				xpThreshold: r.xpThreshold,
				zeniBonus: r.zeniBonus,
			}),
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["levels", "rewards"] });
			setEditing(null);
			setAdding(false);
			showSuccess("Récompense enregistrée avec succès.");
		},
	});

	const remove = useMutation({
		mutationFn: (level: number) => api.delete(`/levels/rewards/${level}`),
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["levels", "rewards"] });
			showSuccess("Récompense supprimée.");
		},
	});

	return (
		<div className="card">
			<div className="mb-3 flex items-center justify-between">
				<div>
					<h3 className="text-sm font-semibold uppercase tracking-wide text-zinc-400">
						Récompenses de palier ({rewards.length})
					</h3>
					<p className="mt-0.5 text-xs text-zinc-500">
						Rôles et bonus zénis attribués automatiquement à chaque montée de niveau.
					</p>
				</div>
				<button type="button" onClick={() => setAdding(true)} className="btn btn-primary">
					<Plus className="h-3 w-3" />
					Ajouter une récompense
				</button>
			</div>

			{successMsg && (
				<div className="mb-3 flex items-center gap-2 rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-400">
					<CheckCircle2 className="h-4 w-4 shrink-0" />
					{successMsg}
				</div>
			)}

			{confirmDelete && (
				<ConfirmDialog
					title={`Supprimer la récompense du niveau ${confirmDelete.level} ?`}
					message="Cette récompense ne sera plus attribuée lors des prochaines montées de niveau. Les rôles déjà attribués aux joueurs ne seront pas retirés."
					confirmLabel="Supprimer définitivement"
					onConfirm={() => {
						remove.mutate(confirmDelete.level);
						setConfirmDelete(null);
					}}
					onCancel={() => setConfirmDelete(null)}
				/>
			)}

			{loading ? (
				<div className="flex items-center gap-2 text-zinc-500 text-sm">
					<Loader2 className="h-4 w-4 animate-spin" />
					Chargement des récompenses…
				</div>
			) : rewards.length === 0 ? (
				<div className="rounded-lg border border-zinc-800 bg-zinc-900/20 p-4 text-center text-sm text-zinc-500">
					Aucune récompense de palier définie pour le moment.
				</div>
			) : (
				<div className="overflow-x-auto">
					<table className="w-full text-sm">
						<thead className="text-xs uppercase tracking-wide text-zinc-500">
							<tr>
								<th className="px-3 py-2 text-left">Niveau</th>
								<th className="px-3 py-2 text-left">Rôle Discord attribué</th>
								<th className="px-3 py-2 text-right">Seuil XP requis</th>
								<th className="px-3 py-2 text-right">Bonus zénis</th>
								<th className="px-3 py-2" />
							</tr>
						</thead>
						<tbody className="divide-y divide-zinc-800">
							{rewards.map((r) => (
								<tr key={r.level}>
									<td className="px-3 py-2 font-bold text-brand-400">{r.level}</td>
									<td className="px-3 py-2 text-sm">
										<RoleBadge roleId={r.roleId} />
									</td>
									<td className="px-3 py-2 text-right font-mono text-xs">
										{r.xpThreshold.toLocaleString("fr-FR")}
									</td>
									<td className="px-3 py-2 text-right font-mono text-xs text-amber-400">
										+{r.zeniBonus.toLocaleString("fr-FR")}
									</td>
									<td className="px-3 py-2 text-right">
										<div className="flex justify-end gap-1">
											<button
												type="button"
												onClick={() => setEditing(r)}
												className="btn btn-ghost px-2"
												title="Modifier cette récompense"
											>
												<Save className="h-3 w-3" />
											</button>
											<button
												type="button"
												onClick={() => setConfirmDelete(r)}
												className="btn btn-ghost px-2 text-red-400"
												title="Supprimer cette récompense"
											>
												<Trash2 className="h-3 w-3" />
											</button>
										</div>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			)}

			{(editing || adding) && (
				<RewardForm
					initial={editing ?? undefined}
					onSubmit={(r) => upsert.mutate(r)}
					onCancel={() => {
						setEditing(null);
						setAdding(false);
					}}
					pending={upsert.isPending}
					error={upsert.isError ? (upsert.error as Error).message : null}
				/>
			)}
		</div>
	);
}

function RewardForm({
	initial,
	onSubmit,
	onCancel,
	pending,
	error,
}: {
	initial?: LevelReward;
	onSubmit: (r: LevelReward) => void;
	onCancel: () => void;
	pending: boolean;
	error: string | null;
}) {
	const [level, setLevel] = useState(String(initial?.level ?? ""));
	const [roleId, setRoleId] = useState(initial?.roleId ?? "");
	const [xpThreshold, setXpThreshold] = useState(String(initial?.xpThreshold ?? ""));
	const [zeniBonus, setZeniBonus] = useState(String(initial?.zeniBonus ?? "1000"));

	const submit = (e: FormEvent) => {
		e.preventDefault();
		onSubmit({
			level: Number(level),
			roleId,
			xpThreshold: Number(xpThreshold),
			zeniBonus: Number(zeniBonus),
		});
	};

	return (
		<form
			onSubmit={submit}
			className="mt-3 space-y-3 rounded-lg border border-zinc-800 bg-zinc-950/40 p-3"
		>
			<h4 className="text-xs font-semibold uppercase tracking-wide text-zinc-400">
				{initial ? "Modifier la récompense" : "Nouvelle récompense"}
			</h4>
			{error && (
				<div className="rounded border border-red-500/40 bg-red-500/10 p-2 text-xs text-red-400">
					{error}
				</div>
			)}
			<div className="grid gap-3 sm:grid-cols-4">
				<div>
					<label className="mb-1 block text-xs text-zinc-400">Niveau</label>
					<input
						className="input"
						type="number"
						min="1"
						value={level}
						onChange={(e) => setLevel(e.target.value)}
						required
						disabled={!!initial}
					/>
				</div>
				<div className="sm:col-span-3">
					<label className="mb-1 block text-xs text-zinc-400">Rôle Discord à attribuer</label>
					<RolePicker value={roleId} onChange={setRoleId} />
				</div>
				<div>
					<label className="mb-1 block text-xs text-zinc-400">Seuil XP requis</label>
					<input
						className="input"
						type="number"
						min="0"
						value={xpThreshold}
						onChange={(e) => setXpThreshold(e.target.value)}
						required
					/>
				</div>
				<div>
					<label className="mb-1 block text-xs text-zinc-400">Bonus zénis offerts</label>
					<input
						className="input"
						type="number"
						min="0"
						value={zeniBonus}
						onChange={(e) => setZeniBonus(e.target.value)}
						required
					/>
				</div>
			</div>
			<div className="flex justify-end gap-2">
				<button type="button" onClick={onCancel} className="btn btn-ghost">
					Annuler
				</button>
				<button type="submit" disabled={pending} className="btn btn-primary">
					<Save className="h-3 w-3" />
					{pending ? "Enregistrement…" : "Enregistrer la récompense"}
				</button>
			</div>
		</form>
	);
}

function RaceRewardsCard({ rewards, loading }: { rewards: RaceReward[]; loading: boolean }) {
	const qc = useQueryClient();
	const [race, setRace] = useState<string>(RACE_OPTIONS[0]!.id);
	const [level, setLevel] = useState("");
	const [roleId, setRoleId] = useState("");
	const [confirmDelete, setConfirmDelete] = useState<RaceReward | null>(null);
	const [successMsg, setSuccessMsg] = useState<string | null>(null);

	const showSuccess = (msg: string) => {
		setSuccessMsg(msg);
		setTimeout(() => setSuccessMsg(null), 3000);
	};

	const upsert = useMutation({
		mutationFn: (r: RaceReward) => api.post("/levels/race-rewards", r),
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["levels", "race-rewards"] });
			setLevel("");
			setRoleId("");
			showSuccess("Rôle de palier enregistré avec succès.");
		},
	});

	const remove = useMutation({
		mutationFn: (r: RaceReward) => api.delete(`/levels/race-rewards/${r.race}/${r.level}`),
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["levels", "race-rewards"] });
			showSuccess("Rôle de palier supprimé.");
		},
	});

	const submit = (e: FormEvent) => {
		e.preventDefault();
		upsert.mutate({ race, level: Number(level), roleId });
	};

	// Regroupe par race (dans l'ordre canonique) puis trie par niveau.
	const grouped = RACE_OPTIONS.map((opt) => ({
		...opt,
		rows: rewards.filter((r) => r.race === opt.id).sort((a, b) => a.level - b.level),
	})).filter((g) => g.rows.length > 0);

	return (
		<div className="card">
			<div className="mb-3">
				<h3 className="text-sm font-semibold uppercase tracking-wide text-zinc-400">
					Rôles de palier par race ({rewards.length})
				</h3>
				<p className="mt-0.5 text-xs text-zinc-500">
					Rôle de transformation attribué à chaque montée de palier, propre à chaque race. C&apos;est
					cette table qui pilote les rôles distribués lors des level-up (indépendante des bonus zénis
					ci-dessus). Une race sans palier configuré ne reçoit ni ne perd aucun rôle de
					transformation.
				</p>
			</div>

			{successMsg && (
				<div className="mb-3 flex items-center gap-2 rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-400">
					<CheckCircle2 className="h-4 w-4 shrink-0" />
					{successMsg}
				</div>
			)}

			{confirmDelete && (
				<ConfirmDialog
					title={`Supprimer le palier ${confirmDelete.level} (${raceLabel(confirmDelete.race)}) ?`}
					message="Ce rôle ne sera plus attribué lors des prochaines montées de niveau pour cette race. Les rôles déjà attribués aux joueurs ne seront pas retirés."
					confirmLabel="Supprimer définitivement"
					onConfirm={() => {
						remove.mutate(confirmDelete);
						setConfirmDelete(null);
					}}
					onCancel={() => setConfirmDelete(null)}
				/>
			)}

			<form
				onSubmit={submit}
				className="mb-4 space-y-3 rounded-lg border border-zinc-800 bg-zinc-950/40 p-3"
			>
				<h4 className="text-xs font-semibold uppercase tracking-wide text-zinc-400">
					Ajouter / modifier un palier de race
				</h4>
				{upsert.isError && (
					<div className="rounded border border-red-500/40 bg-red-500/10 p-2 text-xs text-red-400">
						{(upsert.error as Error).message}
					</div>
				)}
				<div className="grid gap-3 sm:grid-cols-4">
					<div>
						<label className="mb-1 block text-xs text-zinc-400">Race</label>
						<select className="input" value={race} onChange={(e) => setRace(e.target.value)}>
							{RACE_OPTIONS.map((r) => (
								<option key={r.id} value={r.id}>
									{r.label}
								</option>
							))}
						</select>
					</div>
					<div>
						<label className="mb-1 block text-xs text-zinc-400">Niveau (palier)</label>
						<input
							className="input"
							type="number"
							min="1"
							value={level}
							onChange={(e) => setLevel(e.target.value)}
							required
						/>
					</div>
					<div className="sm:col-span-2">
						<label className="mb-1 block text-xs text-zinc-400">Rôle Discord à attribuer</label>
						<RolePicker value={roleId} onChange={setRoleId} />
					</div>
				</div>
				<div className="flex justify-end">
					<button
						type="submit"
						disabled={!level || !roleId || upsert.isPending}
						className="btn btn-primary"
					>
						<Plus className="h-3 w-3" />
						{upsert.isPending ? "Enregistrement…" : "Ajouter"}
					</button>
				</div>
			</form>

			{loading ? (
				<div className="flex items-center gap-2 text-zinc-500 text-sm">
					<Loader2 className="h-4 w-4 animate-spin" />
					Chargement des paliers…
				</div>
			) : grouped.length === 0 ? (
				<div className="rounded-lg border border-zinc-800 bg-zinc-900/20 p-4 text-center text-sm text-zinc-500">
					Aucun rôle de palier configuré pour le moment.
				</div>
			) : (
				<div className="space-y-4">
					{grouped.map((g) => (
						<div key={g.id}>
							<h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-brand-400">
								{g.label} ({g.rows.length})
							</h4>
							<div className="overflow-x-auto">
								<table className="w-full text-sm">
									<thead className="text-xs uppercase tracking-wide text-zinc-500">
										<tr>
											<th className="px-3 py-2 text-left">Palier</th>
											<th className="px-3 py-2 text-left">Rôle Discord attribué</th>
											<th className="px-3 py-2" />
										</tr>
									</thead>
									<tbody className="divide-y divide-zinc-800">
										{g.rows.map((r) => (
											<tr key={`${r.race}-${r.level}`}>
												<td className="px-3 py-2 font-bold text-brand-400">{r.level}</td>
												<td className="px-3 py-2 text-sm">
													<RoleBadge roleId={r.roleId} />
												</td>
												<td className="px-3 py-2 text-right">
													<button
														type="button"
														onClick={() => setConfirmDelete(r)}
														className="btn btn-ghost px-2 text-red-400"
														title="Supprimer ce palier"
													>
														<Trash2 className="h-3 w-3" />
													</button>
												</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	);
}

function TopsCard() {
	const [metric, setMetric] = useState<Metric>("xp");
	const [limit, setLimit] = useState(10);
	const top = useQuery({
		queryKey: ["levels", "top", metric, limit],
		queryFn: () => api.get<{ users: TopUser[] }>(`/levels/top?metric=${metric}&limit=${limit}`),
	});

	const formatMetric = (u: TopUser): string => {
		switch (metric) {
			case "voice":
				return formatDuration(u.totalVoiceMs);
			case "streak":
				return `${u.dailyStreak} jour${u.dailyStreak !== 1 ? "s" : ""}`;
			case "messages":
				return `${u.messageCount.toLocaleString("fr-FR")} messages`;
			case "zeni":
				return `${u.zeni.toLocaleString("fr-FR")} zénis`;
			default:
				return `${u.xp.toLocaleString("fr-FR")} XP`;
		}
	};

	const metrics = [
		{ k: "xp" as Metric, label: "XP" },
		{ k: "zeni" as Metric, label: "Zénis" },
		{ k: "voice" as Metric, label: "Temps vocal" },
		{ k: "messages" as Metric, label: "Messages" },
		{ k: "streak" as Metric, label: "Streak quête" },
	] as const;

	return (
		<div className="card">
			<div className="mb-3 flex flex-wrap items-center gap-3">
				<h3 className="text-sm font-semibold uppercase tracking-wide text-zinc-400">
					Classement rapide
				</h3>
				<div className="flex flex-wrap gap-1">
					{metrics.map((m) => (
						<button
							key={m.k}
							type="button"
							onClick={() => setMetric(m.k)}
							className={`btn ${metric === m.k ? "btn-primary" : "btn-ghost"}`}
						>
							{m.label}
						</button>
					))}
				</div>
				<select
					className="input ml-auto w-32"
					value={limit}
					onChange={(e) => setLimit(Number(e.target.value))}
				>
					{[10, 25, 50].map((n) => (
						<option key={n} value={n}>
							Top {n}
						</option>
					))}
				</select>
			</div>

			{top.isLoading && (
				<div className="flex items-center gap-2 text-zinc-500 text-sm">
					<Loader2 className="h-4 w-4 animate-spin" />
					Chargement du classement…
				</div>
			)}
			{top.isError && (
				<div className="flex items-center gap-2 text-sm text-red-400">
					<AlertTriangle className="h-4 w-4" />
					Impossible de charger le classement. Réessayez.
				</div>
			)}

			<div className="space-y-1.5">
				{top.data?.users.map((u, i) => (
					<div key={u.id} className="flex items-center gap-3 text-sm">
						<span className="w-8 text-right font-mono text-xs text-zinc-500">#{i + 1}</span>
						<span className="w-44 truncate font-mono text-xs text-zinc-300" title={u.id}>
							{u.id.slice(0, 6)}…{u.id.slice(-4)}
							<span
								className="ml-1 text-[10px] text-zinc-600"
								title={`ID Discord complet : ${u.id}`}
							>
								({u.id})
							</span>
						</span>
						<span className="flex-1 truncate text-xs text-zinc-400">
							niveau {u.lastLevelReached} · {u.xp.toLocaleString("fr-FR")} XP ·{" "}
							{u.zeni.toLocaleString("fr-FR")} zénis
						</span>
						<span className="text-right font-mono text-sm text-brand-400">{formatMetric(u)}</span>
					</div>
				))}
				{top.data?.users.length === 0 && (
					<p className="text-sm italic text-zinc-500">
						Aucun joueur enregistré pour cette métrique.
					</p>
				)}
			</div>
		</div>
	);
}

function ManualActionsCard() {
	const [userId, setUserId] = useState("");
	const [target, setTarget] = useState<"xp" | "zeni">("xp");
	const [mode, setMode] = useState<"add" | "set">("add");
	const [amount, setAmount] = useState("");
	const [lastResult, setLastResult] = useState<{
		ok: boolean;
		msg: string;
	} | null>(null);

	const mutation = useMutation({
		mutationFn: () =>
			api.post(`/levels/users/${userId}/${target}`, {
				mode,
				amount: Number(amount),
			}),
		onSuccess: (data) => {
			const d = data as {
				ok?: boolean;
				newXp?: number;
				newZeni?: number;
				previousXp?: number;
				previousZeni?: number;
			};
			const newVal = target === "xp" ? d.newXp : d.newZeni;
			setLastResult({
				ok: true,
				msg: `Modification appliquée. Nouvelle valeur : ${newVal?.toLocaleString("fr-FR") ?? "—"} ${target === "xp" ? "XP" : "zénis"}.`,
			});
		},
		onError: (err) =>
			setLastResult({
				ok: false,
				msg: `Erreur : ${err instanceof Error ? err.message : String(err)}`,
			}),
	});

	const submit = (e: FormEvent) => {
		e.preventDefault();
		setLastResult(null);
		mutation.mutate();
	};

	return (
		<form onSubmit={submit} className="card space-y-3">
			<h3 className="text-sm font-semibold uppercase tracking-wide text-zinc-400">
				Modification manuelle d&apos;un joueur
			</h3>
			<p className="text-xs text-zinc-500">
				Permet d&apos;ajouter, retirer ou définir directement l&apos;XP ou les zénis d&apos;un
				membre. Renseignez son identifiant Discord (suite de chiffres visible dans les paramètres
				Discord avec le mode développeur activé).
			</p>
			<div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
				<div className="lg:col-span-2">
					<label className="mb-1 block text-xs text-zinc-400">Identifiant Discord du joueur</label>
					<UserSelect value={userId} onChange={setUserId} />
				</div>
				<div>
					<label className="mb-1 block text-xs text-zinc-400">Ce que l&apos;on modifie</label>
					<select
						className="input"
						value={target}
						onChange={(e) => setTarget(e.target.value as "xp" | "zeni")}
					>
						<option value="xp">Points d&apos;expérience (XP)</option>
						<option value="zeni">Zénis (monnaie)</option>
					</select>
				</div>
				<div>
					<label className="mb-1 block text-xs text-zinc-400">Opération</label>
					<select
						className="input"
						value={mode}
						onChange={(e) => setMode(e.target.value as "add" | "set")}
					>
						<option value="add">Ajouter / retirer</option>
						<option value="set">Définir exactement</option>
					</select>
				</div>
				<div className="lg:col-span-2">
					<label className="mb-1 block text-xs text-zinc-400">Montant (négatif pour retirer)</label>
					<input
						className="input"
						type="number"
						value={amount}
						onChange={(e) => setAmount(e.target.value)}
						placeholder={mode === "add" ? "ex. 1000 ou -500" : "ex. 50000"}
						required
					/>
				</div>
			</div>
			<button
				type="submit"
				disabled={!userId || !amount || mutation.isPending}
				className="btn btn-primary"
			>
				<Save className="h-3 w-3" />
				{mutation.isPending ? "Application en cours…" : "Appliquer la modification"}
			</button>
			{lastResult && (
				<div
					className={`flex items-start gap-2 rounded-lg border p-3 text-sm ${
						lastResult.ok
							? "border-emerald-500/40 bg-emerald-500/10 text-emerald-400"
							: "border-red-500/40 bg-red-500/10 text-red-400"
					}`}
				>
					{lastResult.ok ? (
						<CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
					) : (
						<AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
					)}
					{lastResult.msg}
				</div>
			)}
		</form>
	);
}
