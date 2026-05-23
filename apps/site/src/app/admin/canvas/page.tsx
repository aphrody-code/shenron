"use client";

import { useQuery } from "@tanstack/react-query";
import { RefreshCw, Download } from "lucide-react";
import { useMemo, useState } from "react";
import { api, proxyAsset } from "@/lib/admin-api";

interface CanvasDef {
	id: string;
	name: string;
	description: string;
	url: string;
	params: string[];
}

interface DiscordMember {
	id: string;
	username: string;
	displayName: string;
	avatar: string;
}

const PROFILE_THEMES = [
	"default",
	"goku",
	"vegeta",
	"kaio",
	"ssj",
	"blue",
	"rose",
	"ultra",
];

const CANVAS_DESCRIPTIONS: Record<string, string> = {
	profile:
		"Carte de profil personnalisée avec avatar, niveau, barre d'XP et thème DBZ.",
	scan: "Lecture du niveau de Ki d'un membre, basée sur son XP.",
	scouter: "Scouter humoristique (Gaydar de Bulma ou Racism-o-mètre).",
	fusion: "Carte de fusion entre deux membres.",
	leaderboard: "Classement graphique des meilleurs joueurs.",
};

export default function CanvasPage() {
	const list = useQuery({
		queryKey: ["canvas", "list"],
		queryFn: () => api.get<{ canvases: CanvasDef[] }>("/canvas/list"),
	});

	const members = useQuery({
		queryKey: ["discord", "members"],
		queryFn: () =>
			api.get<{ members: DiscordMember[] }>("/discord/members?limit=200"),
	});

	const [selected, setSelected] = useState("profile");

	if (list.isLoading)
		return (
			<div className="dbz-panel p-8 text-center">
				<p className="font-saiyan text-dbz-orange text-xl mb-2">CHARGEMENT…</p>
				<p className="text-sm text-white/40">
					Récupération des canvases disponibles.
				</p>
			</div>
		);

	if (list.isError)
		return (
			<div className="dbz-panel p-8 text-center border-l-4 border-red-500">
				<p className="font-saiyan text-red-400 text-xl mb-2">ERREUR</p>
				<p className="text-sm text-white/40">
					Impossible de charger la liste des canvases. Vérifiez que le bot est
					en ligne.
				</p>
			</div>
		);

	return (
		<div className="space-y-6">
			<header>
				<h1 className="text-4xl font-saiyan text-dbz-orange mb-2">
					IMAGES GÉNÉRÉES
				</h1>
				<p className="text-sm text-white/60 mb-1">
					Prévisualisez les cartes et images créées par le bot pour les membres
					du serveur.
				</p>
				<p className="text-xs text-white/30 uppercase tracking-widest">
					Rendu en direct via Skia · mise en cache 60 secondes
				</p>
			</header>

			{/* Sélecteur de type */}
			<div className="dbz-panel p-4">
				<p className="text-xs text-white/40 uppercase tracking-widest mb-3">
					Choisissez le type d&apos;image à prévisualiser
				</p>
				<div className="flex flex-wrap gap-2">
					{(list.data?.canvases ?? []).map((c) => (
						<button
							key={c.id}
							type="button"
							onClick={() => setSelected(c.id)}
							className={`dbz-button !text-sm !py-1.5 !px-4 ${selected === c.id ? "" : "opacity-50 hover:opacity-80"}`}
						>
							{c.name}
						</button>
					))}
				</div>
			</div>

			{/* Aperçu du canvas sélectionné */}
			{(list.data?.canvases ?? [])
				.filter((c) => c.id === selected)
				.map((c) => (
					<CanvasPreview
						key={c.id}
						def={c}
						members={members.data?.members ?? []}
					/>
				))}
		</div>
	);
}

function CanvasPreview({
	def,
	members,
}: {
	def: CanvasDef;
	members: DiscordMember[];
}) {
	const [params, setParams] = useState<Record<string, string>>(() =>
		initialParams(def, members),
	);
	const [bust, setBust] = useState(0);

	const url = useMemo(() => buildUrl(def, params, bust), [def, params, bust]);
	const isValid = paramsValid(def, params);

	return (
		<div className="grid gap-4 lg:grid-cols-3">
			{/* Panneau paramètres */}
			<div className="dbz-panel p-5 space-y-4 lg:col-span-1">
				<div>
					<h3 className="font-saiyan text-dbz-yellow text-base uppercase mb-0.5">
						{def.name}
					</h3>
					<p className="text-xs text-white/40">
						{CANVAS_DESCRIPTIONS[def.id] ?? def.description}
					</p>
				</div>

				{def.id === "profile" && (
					<>
						<MemberSelect
							label="Membre"
							value={params.userId ?? ""}
							onChange={(v) => setParams({ ...params, userId: v })}
							members={members}
						/>
						<div>
							<label className="block text-[10px] font-bold uppercase tracking-widest text-dbz-blue-light mb-1">
								Thème de carte
							</label>
							<select
								className="w-full bg-dbz-bg border-2 border-dbz-border focus:border-dbz-orange p-2 text-sm"
								value={params.theme ?? "default"}
								onChange={(e) =>
									setParams({ ...params, theme: e.target.value })
								}
							>
								{PROFILE_THEMES.map((t) => (
									<option key={t} value={t}>
										{t.charAt(0).toUpperCase() + t.slice(1)}
									</option>
								))}
							</select>
						</div>
					</>
				)}

				{def.id === "scan" && (
					<MemberSelect
						label="Membre à scanner"
						value={params.userId ?? ""}
						onChange={(v) => setParams({ ...params, userId: v })}
						members={members}
					/>
				)}

				{def.id === "scouter" && (
					<>
						<MemberSelect
							label="Cible du scouter"
							value={params.userId ?? ""}
							onChange={(v) => setParams({ ...params, userId: v })}
							members={members}
						/>
						<div>
							<label className="block text-[10px] font-bold uppercase tracking-widest text-dbz-blue-light mb-1">
								Type de scouter
							</label>
							<select
								className="w-full bg-dbz-bg border-2 border-dbz-border focus:border-dbz-orange p-2 text-sm"
								value={params.type ?? "gay"}
								onChange={(e) => setParams({ ...params, type: e.target.value })}
							>
								<option value="gay">Gaydar de Bulma (rose)</option>
								<option value="raciste">Racism-o-mètre (rouge)</option>
							</select>
						</div>
						<div>
							<label className="block text-[10px] font-bold uppercase tracking-widest text-dbz-blue-light mb-1">
								Pourcentage : {params.pct ?? "50"}%
							</label>
							<input
								type="range"
								min="0"
								max="101"
								className="w-full accent-dbz-orange"
								value={params.pct ?? "50"}
								onChange={(e) => setParams({ ...params, pct: e.target.value })}
							/>
						</div>
					</>
				)}

				{def.id === "fusion" && (
					<>
						<MemberSelect
							label="Membre A"
							value={params.a ?? ""}
							onChange={(v) => setParams({ ...params, a: v })}
							members={members}
						/>
						<MemberSelect
							label="Membre B"
							value={params.b ?? ""}
							onChange={(v) => setParams({ ...params, b: v })}
							members={members}
						/>
						<div>
							<label className="block text-[10px] font-bold uppercase tracking-widest text-dbz-blue-light mb-1">
								État de la fusion
							</label>
							<select
								className="w-full bg-dbz-bg border-2 border-dbz-border focus:border-dbz-orange p-2 text-sm"
								value={params.state ?? "success"}
								onChange={(e) =>
									setParams({ ...params, state: e.target.value })
								}
							>
								<option value="propose">Proposition de fusion</option>
								<option value="success">Fusion réussie</option>
							</select>
						</div>
						<div>
							<label className="block text-[10px] font-bold uppercase tracking-widest text-dbz-blue-light mb-1">
								Nom de fusion
							</label>
							<input
								className="w-full bg-dbz-bg border-2 border-dbz-border focus:border-dbz-orange p-2 text-sm"
								value={params.name ?? ""}
								onChange={(e) => setParams({ ...params, name: e.target.value })}
								placeholder="ex : Gokuetto"
							/>
						</div>
					</>
				)}

				{def.id === "leaderboard" && (
					<>
						<div>
							<label className="block text-[10px] font-bold uppercase tracking-widest text-dbz-blue-light mb-1">
								Classement
							</label>
							<select
								className="w-full bg-dbz-bg border-2 border-dbz-border focus:border-dbz-orange p-2 text-sm"
								value={params.metric ?? "xp"}
								onChange={(e) =>
									setParams({ ...params, metric: e.target.value })
								}
							>
								<option value="xp">Points d&apos;expérience (XP)</option>
								<option value="zeni">Zénis (monnaie)</option>
							</select>
						</div>
						<div>
							<label className="block text-[10px] font-bold uppercase tracking-widest text-dbz-blue-light mb-1">
								Nombre de joueurs : {params.limit ?? "10"}
							</label>
							<input
								type="range"
								min="3"
								max="20"
								className="w-full accent-dbz-orange"
								value={params.limit ?? "10"}
								onChange={(e) =>
									setParams({ ...params, limit: e.target.value })
								}
							/>
						</div>
					</>
				)}

				<div className="flex gap-2 pt-2">
					<button
						type="button"
						onClick={() => setBust(bust + 1)}
						className="dbz-button !text-xs !py-1.5 !px-3 flex items-center gap-1.5"
					>
						<RefreshCw className="h-3 w-3" />
						Regénérer
					</button>
					{isValid && (
						<a
							href={url}
							download={`${def.id}.png`}
							className="dbz-button-ghost !text-xs !py-1.5 !px-3 flex items-center gap-1.5"
						>
							<Download className="h-3 w-3" />
							Télécharger
						</a>
					)}
				</div>
			</div>

			{/* Aperçu visuel */}
			<div className="dbz-panel p-5 lg:col-span-2">
				<h3 className="font-saiyan text-dbz-blue-light text-base uppercase mb-3">
					Aperçu
				</h3>
				<div className="flex items-center justify-center rounded border border-dbz-border bg-black/30 p-4 min-h-[200px]">
					{isValid ? (
						<img
							src={url}
							alt={def.name}
							className="max-w-full rounded"
							loading="lazy"
						/>
					) : (
						<p className="text-sm text-white/30 text-center">
							Renseignez les paramètres à gauche pour afficher l&apos;aperçu.
						</p>
					)}
				</div>
				{isValid && (
					<div className="mt-3">
						<p className="text-[10px] text-white/30 uppercase tracking-widest mb-1">
							URL générée (pour intégration)
						</p>
						<code className="block break-all rounded bg-black/40 p-2 text-[10px] text-white/40 border border-dbz-border">
							{url}
						</code>
					</div>
				)}
			</div>
		</div>
	);
}

function MemberSelect({
	label,
	value,
	onChange,
	members,
}: {
	label: string;
	value: string;
	onChange: (id: string) => void;
	members: DiscordMember[];
}) {
	const [search, setSearch] = useState("");
	const filtered = members.filter(
		(m) =>
			!search ||
			m.username.toLowerCase().includes(search.toLowerCase()) ||
			m.displayName.toLowerCase().includes(search.toLowerCase()) ||
			m.id.includes(search),
	);

	return (
		<div>
			<label className="block text-[10px] font-bold uppercase tracking-widest text-dbz-blue-light mb-1">
				{label}
			</label>
			<input
				className="w-full bg-dbz-bg border-2 border-dbz-border focus:border-dbz-orange p-2 text-xs mb-1"
				placeholder="Rechercher par pseudo…"
				value={search}
				onChange={(e) => setSearch(e.target.value)}
			/>
			<select
				className="w-full bg-dbz-bg border-2 border-dbz-border focus:border-dbz-orange p-2 text-sm"
				value={value}
				onChange={(e) => onChange(e.target.value)}
			>
				<option value="">— choisir un membre —</option>
				{filtered.slice(0, 50).map((m) => (
					<option key={m.id} value={m.id}>
						{m.displayName !== m.username
							? `${m.displayName} (${m.username})`
							: m.username}
					</option>
				))}
			</select>
			{filtered.length > 50 && (
				<p className="mt-1 text-[10px] text-white/30">
					{filtered.length} résultats — affinez la recherche.
				</p>
			)}
		</div>
	);
}

function initialParams(
	def: CanvasDef,
	members: DiscordMember[],
): Record<string, string> {
	const firstMember = members.find((m) => !m.id.startsWith("0"))?.id ?? "";
	switch (def.id) {
		case "profile":
			return { userId: firstMember, theme: "default" };
		case "scan":
			return { userId: firstMember };
		case "scouter":
			return { userId: firstMember, type: "gay", pct: "50" };
		case "fusion":
			return {
				a: members[0]?.id ?? "",
				b: members[1]?.id ?? "",
				state: "success",
				name: "Gokuetto",
			};
		case "leaderboard":
			return { metric: "xp", limit: "10" };
		default:
			return {};
	}
}

function paramsValid(def: CanvasDef, params: Record<string, string>): boolean {
	if (def.id === "profile" || def.id === "scan" || def.id === "scouter")
		return !!params.userId;
	if (def.id === "fusion") return !!params.a && !!params.b;
	if (def.id === "leaderboard") return true;
	return false;
}

function buildUrl(
	def: CanvasDef,
	params: Record<string, string>,
	bust: number,
): string {
	const sp = new URLSearchParams();
	let path = "";
	switch (def.id) {
		case "profile":
			path = `/canvas/profile/${params.userId ?? ""}`;
			if (params.theme) sp.set("theme", params.theme);
			break;
		case "scan":
			path = `/canvas/scan/${params.userId ?? ""}`;
			break;
		case "scouter":
			path = `/canvas/scouter/${params.userId ?? ""}`;
			if (params.type) sp.set("type", params.type);
			if (params.pct) sp.set("pct", params.pct);
			break;
		case "fusion":
			path = "/canvas/fusion";
			sp.set("a", params.a ?? "");
			sp.set("b", params.b ?? "");
			if (params.state) sp.set("state", params.state);
			if (params.name) sp.set("name", params.name);
			break;
		case "leaderboard":
			path = "/canvas/leaderboard";
			if (params.metric) sp.set("metric", params.metric);
			if (params.limit) sp.set("limit", params.limit);
			break;
	}
	if (bust) sp.set("_", String(bust));
	const qs = sp.toString();
	const base = proxyAsset(path);
	return qs ? `${base}?${qs}` : base;
}
