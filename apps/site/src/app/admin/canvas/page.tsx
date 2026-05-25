"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
	RefreshCw,
	Download,
	Plus,
	Save,
	Trash2,
	X,
	Power,
	PowerOff,
	Palette,
	Loader2,
	Image as ImageIcon,
} from "lucide-react";
import { type FormEvent, type ReactNode, useMemo, useState } from "react";
import { api, proxyAsset } from "@/lib/admin-api";
import { botAsset } from "@/lib/bot-assets";

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

interface CardTheme {
	id: string;
	name: string;
	accent: string;
	aura: string;
	bgGrad1: string;
	bgGrad2: string;
	bgGrad3: string;
	bgFile: string | null;
	textShadow: string;
	enabled: boolean;
}

interface AssetFile {
	path: string;
	url: string;
	name: string;
}

interface AssetListResponse {
	dir: string;
	dirs: string[];
	count: number;
	files: AssetFile[];
}

const ASSET_DIR_LABELS: Record<string, string> = {
	banners: "Bannières",
	backgrounds: "Fonds de carte",
	cards: "Cartes (legacy)",
	dbz: "Personnages / planètes",
	ext: "Médias wiki (films, épisodes…)",
	sanctions: "Sanctions",
	wiki: "Uploads wiki",
};

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

function TabBtn({
	active,
	onClick,
	children,
}: {
	active: boolean;
	onClick: () => void;
	children: ReactNode;
}) {
	return (
		<button
			type="button"
			onClick={onClick}
			className={`font-saiyan text-sm uppercase tracking-wider px-4 py-2 -mb-px border-b-2 transition-colors ${
				active
					? "border-dbz-orange text-dbz-orange"
					: "border-transparent text-white/40 hover:text-white/70"
			}`}
		>
			{children}
		</button>
	);
}

export default function CanvasPage() {
	const [tab, setTab] = useState<"preview" | "themes" | "gallery">("preview");

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

	const sampleUserId = useMemo(
		() =>
			(members.data?.members ?? []).find((m) => !m.id.startsWith("0"))?.id ??
			"",
		[members.data],
	);

	return (
		<div className="space-y-6">
			<header>
				<h1 className="text-4xl font-saiyan text-dbz-orange mb-2">
					CANVAS & THÈMES
				</h1>
				<p className="text-sm text-white/60 mb-1">
					Prévisualisez les images générées par le bot et éditez les thèmes des
					cartes de profil.
				</p>
				<p className="text-xs text-white/30 uppercase tracking-widest">
					Rendu en direct via Skia · mise en cache 60 secondes
				</p>
			</header>

			<div className="flex gap-2 border-b border-dbz-border">
				<TabBtn active={tab === "preview"} onClick={() => setTab("preview")}>
					Aperçu
				</TabBtn>
				<TabBtn active={tab === "themes"} onClick={() => setTab("themes")}>
					Édition des thèmes
				</TabBtn>
				<TabBtn active={tab === "gallery"} onClick={() => setTab("gallery")}>
					Galerie
				</TabBtn>
			</div>

			{tab === "preview" && (
				<PreviewSection
					list={list.data?.canvases ?? []}
					isLoading={list.isLoading}
					isError={list.isError}
					members={members.data?.members ?? []}
					selected={selected}
					setSelected={setSelected}
				/>
			)}
			{tab === "themes" && <ThemesSection sampleUserId={sampleUserId} />}
			{tab === "gallery" && <AssetGallery />}
		</div>
	);
}

function PreviewSection({
	list,
	isLoading,
	isError,
	members,
	selected,
	setSelected,
}: {
	list: CanvasDef[];
	isLoading: boolean;
	isError: boolean;
	members: DiscordMember[];
	selected: string;
	setSelected: (id: string) => void;
}) {
	if (isLoading)
		return (
			<div className="dbz-panel p-8 text-center">
				<p className="font-saiyan text-dbz-orange text-xl mb-2">CHARGEMENT…</p>
				<p className="text-sm text-white/40">
					Récupération des canvases disponibles.
				</p>
			</div>
		);

	if (isError)
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
			<div className="dbz-panel p-4">
				<p className="text-xs text-white/40 uppercase tracking-widest mb-3">
					Choisissez le type d&apos;image à prévisualiser
				</p>
				<div className="flex flex-wrap gap-2">
					{list.map((c) => (
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

			{list
				.filter((c) => c.id === selected)
				.map((c) => (
					<CanvasPreview key={c.id} def={c} members={members} />
				))}
		</div>
	);
}

// ── Édition des thèmes de carte ──────────────────────────────────────────────

const EMPTY_THEME: CardTheme = {
	id: "",
	name: "",
	accent: "#F3E603",
	aura: "#D67711",
	bgGrad1: "#550000",
	bgGrad2: "#D67711",
	bgGrad3: "#1a0a00",
	bgFile: null,
	textShadow: "rgba(0,0,0,0.8)",
	enabled: true,
};

function ThemesSection({ sampleUserId }: { sampleUserId: string }) {
	const qc = useQueryClient();
	const [editing, setEditing] = useState<CardTheme | null>(null);
	const [creating, setCreating] = useState(false);

	const themes = useQuery({
		queryKey: ["card-themes"],
		queryFn: () => api.get<{ rows: CardTheme[] }>("/card-themes"),
	});

	const rows = themes.data?.rows ?? [];

	const closeEditor = () => {
		setEditing(null);
		setCreating(false);
	};
	const onSaved = () => {
		qc.invalidateQueries({ queryKey: ["card-themes"] });
		closeEditor();
	};

	return (
		<div className="space-y-4">
			<div className="dbz-panel p-4 flex items-center gap-3">
				<Palette className="h-5 w-5 text-dbz-orange" />
				<div className="flex-1">
					<p className="font-saiyan text-dbz-yellow text-sm uppercase">
						Thèmes des cartes de profil
					</p>
					<p className="text-xs text-white/40">
						Couleurs et fond utilisés par la commande de profil. Les
						modifications sont appliquées en direct (cache bot purgé à
						l&apos;enregistrement).
					</p>
				</div>
				<button
					type="button"
					className="dbz-button !text-xs !py-1.5 !px-3 flex items-center gap-1.5"
					onClick={() => setCreating(true)}
				>
					<Plus className="h-3 w-3" /> Nouveau thème
				</button>
			</div>

			{themes.isLoading && (
				<div className="flex items-center gap-2 text-white/40 text-sm">
					<Loader2 className="h-4 w-4 animate-spin" /> Chargement des thèmes…
				</div>
			)}
			{themes.isError && (
				<div className="dbz-panel p-4 border-l-4 border-red-500 text-sm text-white/50">
					Impossible de charger les thèmes. Vérifiez que le bot est en ligne.
				</div>
			)}

			<div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
				{rows.map((t) => (
					<ThemeCard
						key={t.id}
						theme={t}
						sampleUserId={sampleUserId}
						onEdit={() => setEditing(t)}
					/>
				))}
				{!themes.isLoading && rows.length === 0 && (
					<div className="dbz-panel p-6 col-span-full text-center text-sm text-white/40">
						Aucun thème en base. Créez-en un — il s&apos;ajoutera aux thèmes
						intégrés du bot.
					</div>
				)}
			</div>

			{(editing || creating) && (
				<ThemeEditor
					theme={editing}
					sampleUserId={sampleUserId}
					onClose={closeEditor}
					onSaved={onSaved}
				/>
			)}
		</div>
	);
}

function ThemeCard({
	theme,
	sampleUserId,
	onEdit,
}: {
	theme: CardTheme;
	sampleUserId: string;
	onEdit: () => void;
}) {
	const previewUrl = sampleUserId
		? proxyAsset(
				`/canvas/profile/${sampleUserId}?theme=${encodeURIComponent(theme.id)}`,
			)
		: "";

	return (
		<div
			className={`dbz-panel p-3 space-y-2 ${theme.enabled ? "" : "opacity-50"}`}
		>
			<div className="flex items-center gap-2">
				<span className="font-saiyan text-dbz-yellow text-sm uppercase truncate">
					{theme.name}
				</span>
				{!theme.enabled && (
					<span className="text-[10px] uppercase text-red-400 border border-red-500/40 rounded px-1">
						Masqué
					</span>
				)}
				<code className="ml-auto text-[10px] text-white/30">{theme.id}</code>
			</div>
			<div className="flex gap-1">
				{[
					theme.accent,
					theme.aura,
					theme.bgGrad1,
					theme.bgGrad2,
					theme.bgGrad3,
				].map((c, i) => (
					<span
						key={i}
						className="h-4 flex-1 rounded-sm border border-black/30"
						style={{ background: c }}
						title={c}
					/>
				))}
			</div>
			{previewUrl && (
				<img
					src={previewUrl}
					alt={theme.name}
					className="w-full rounded border border-dbz-border"
					loading="lazy"
				/>
			)}
			<button
				type="button"
				className="dbz-button-ghost !text-xs !py-1 !px-3 w-full"
				onClick={onEdit}
			>
				Modifier
			</button>
		</div>
	);
}

function ColorField({
	label,
	value,
	onChange,
}: {
	label: string;
	value: string;
	onChange: (v: string) => void;
}) {
	return (
		<div>
			<label className="block text-[10px] font-bold uppercase tracking-widest text-dbz-blue-light mb-1">
				{label}
			</label>
			<div className="flex gap-1.5">
				<input
					type="color"
					className="h-9 w-10 shrink-0 cursor-pointer rounded border-2 border-dbz-border bg-dbz-bg"
					value={/^#[0-9a-fA-F]{6}$/.test(value) ? value : "#000000"}
					onChange={(e) => onChange(e.target.value)}
				/>
				<input
					className="w-full bg-dbz-bg border-2 border-dbz-border focus:border-dbz-orange p-2 text-xs font-mono"
					value={value}
					onChange={(e) => onChange(e.target.value)}
				/>
			</div>
		</div>
	);
}

function ThemeEditor({
	theme,
	sampleUserId,
	onClose,
	onSaved,
}: {
	theme: CardTheme | null;
	sampleUserId: string;
	onClose: () => void;
	onSaved: () => void;
}) {
	const isCreate = !theme;
	const [draft, setDraft] = useState<CardTheme>(theme ?? EMPTY_THEME);
	const [error, setError] = useState<string | null>(null);
	const [bust, setBust] = useState(0);
	const [picker, setPicker] = useState(false);

	const set = (patch: Partial<CardTheme>) => setDraft({ ...draft, ...patch });

	const save = useMutation({
		mutationFn: async (payload: CardTheme) => {
			if (isCreate) return api.post("/card-themes", payload);
			return api.put(`/card-themes/${encodeURIComponent(payload.id)}`, payload);
		},
		onSuccess: () => {
			// La carte rendue lit la DB : on rafraîchit l'aperçu après écriture.
			setBust((b) => b + 1);
			onSaved();
		},
		onError: (err) => setError((err as Error).message),
	});

	const del = useMutation({
		mutationFn: () =>
			api.delete(`/card-themes/${encodeURIComponent(draft.id)}`),
		onSuccess: onSaved,
		onError: (err) => setError((err as Error).message),
	});

	const submit = (e: FormEvent) => {
		e.preventDefault();
		setError(null);
		if (!draft.id || !draft.name) {
			setError("L'identifiant et le nom sont obligatoires.");
			return;
		}
		if (!/^[a-z0-9_-]+$/.test(draft.id)) {
			setError(
				"L'identifiant doit contenir uniquement des lettres minuscules, chiffres, tirets ou underscores.",
			);
			return;
		}
		save.mutate(draft);
	};

	const previewUrl =
		sampleUserId && !isCreate
			? proxyAsset(
					`/canvas/profile/${sampleUserId}?theme=${encodeURIComponent(draft.id)}&_=${bust}`,
				)
			: "";

	return (
		<>
			{picker && (
				<AssetPickerModal
					onPick={(path) => set({ bgFile: path })}
					onClose={() => setPicker(false)}
				/>
			)}
			<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur">
				<form
					onSubmit={submit}
					className="dbz-panel w-full max-w-3xl p-5 space-y-4 max-h-[92vh] overflow-y-auto"
				>
					<div className="flex items-center gap-2">
						<h3 className="font-saiyan text-dbz-orange text-lg uppercase">
							{isCreate ? "Nouveau thème" : `Modifier « ${draft.name} »`}
						</h3>
						<button
							type="button"
							onClick={onClose}
							className="ml-auto dbz-button-ghost !px-2 !py-1"
						>
							<X className="h-4 w-4" />
						</button>
					</div>

					{error && (
						<div className="rounded border border-red-500/40 bg-red-500/10 p-2 text-xs text-red-400">
							{error}
						</div>
					)}

					<div className="grid gap-3 sm:grid-cols-2">
						<div>
							<label className="block text-[10px] font-bold uppercase tracking-widest text-dbz-blue-light mb-1">
								Identifiant (slug)
							</label>
							<input
								className="w-full bg-dbz-bg border-2 border-dbz-border focus:border-dbz-orange p-2 text-xs font-mono disabled:opacity-50"
								value={draft.id}
								disabled={!isCreate}
								onChange={(e) => set({ id: e.target.value })}
								placeholder="goku"
							/>
						</div>
						<div>
							<label className="block text-[10px] font-bold uppercase tracking-widest text-dbz-blue-light mb-1">
								Nom affiché
							</label>
							<input
								className="w-full bg-dbz-bg border-2 border-dbz-border focus:border-dbz-orange p-2 text-sm"
								value={draft.name}
								onChange={(e) => set({ name: e.target.value })}
								placeholder="Goku"
							/>
						</div>

						<ColorField
							label="Accent (ring, highlights)"
							value={draft.accent}
							onChange={(v) => set({ accent: v })}
						/>
						<ColorField
							label="Aura (avatar, barre XP)"
							value={draft.aura}
							onChange={(v) => set({ aura: v })}
						/>
						<ColorField
							label="Dégradé fond — 1"
							value={draft.bgGrad1}
							onChange={(v) => set({ bgGrad1: v })}
						/>
						<ColorField
							label="Dégradé fond — 2"
							value={draft.bgGrad2}
							onChange={(v) => set({ bgGrad2: v })}
						/>
						<ColorField
							label="Dégradé fond — 3"
							value={draft.bgGrad3}
							onChange={(v) => set({ bgGrad3: v })}
						/>

						<div>
							<label className="block text-[10px] font-bold uppercase tracking-widest text-dbz-blue-light mb-1">
								Visibilité
							</label>
							<button
								type="button"
								onClick={() => set({ enabled: !draft.enabled })}
								className={`w-full flex items-center justify-center gap-1.5 p-2 text-sm border-2 ${
									draft.enabled
										? "border-dbz-orange text-dbz-orange"
										: "border-dbz-border text-white/40"
								}`}
							>
								{draft.enabled ? (
									<>
										<Power className="h-3 w-3" /> Actif
									</>
								) : (
									<>
										<PowerOff className="h-3 w-3" /> Masqué
									</>
								)}
							</button>
						</div>

						<div className="sm:col-span-2">
							<label className="block text-[10px] font-bold uppercase tracking-widest text-dbz-blue-light mb-1">
								Image de fond (optionnelle)
								<span className="ml-1 normal-case text-white/30">
									— vide = dégradé seul · ex : une bannière comme fond
								</span>
							</label>
							<div className="flex gap-1.5">
								<input
									className="w-full bg-dbz-bg border-2 border-dbz-border focus:border-dbz-orange p-2 text-xs font-mono"
									value={draft.bgFile ?? ""}
									onChange={(e) => set({ bgFile: e.target.value || null })}
									placeholder="assets/banners/banner-09.png"
								/>
								<button
									type="button"
									onClick={() => setPicker(true)}
									className="dbz-button-ghost !text-xs !py-1 !px-3 shrink-0 flex items-center gap-1.5"
								>
									<ImageIcon className="h-3 w-3" /> Parcourir
								</button>
								{draft.bgFile && (
									<button
										type="button"
										onClick={() => set({ bgFile: null })}
										className="dbz-button-ghost !text-xs !py-1 !px-2 shrink-0 !text-red-400"
										title="Retirer le fond"
									>
										<X className="h-3 w-3" />
									</button>
								)}
							</div>
							{draft.bgFile && (
								// eslint-disable-next-line @next/next/no-img-element
								<img
									src={botAsset(draft.bgFile)}
									alt="Fond sélectionné"
									className="mt-2 h-20 w-full rounded border border-dbz-border object-cover"
								/>
							)}
						</div>

						<div className="sm:col-span-2">
							<label className="block text-[10px] font-bold uppercase tracking-widest text-dbz-blue-light mb-1">
								Ombre de texte (rgba)
							</label>
							<input
								className="w-full bg-dbz-bg border-2 border-dbz-border focus:border-dbz-orange p-2 text-xs font-mono"
								value={draft.textShadow}
								onChange={(e) => set({ textShadow: e.target.value })}
								placeholder="rgba(0,0,0,0.8)"
							/>
						</div>
					</div>

					{/* Aperçu live (reflète l'état enregistré) */}
					{previewUrl ? (
						<div>
							<div className="flex items-center justify-between mb-1">
								<p className="text-[10px] text-white/30 uppercase tracking-widest">
									Aperçu (état enregistré)
								</p>
								<button
									type="button"
									onClick={() => setBust((b) => b + 1)}
									className="dbz-button-ghost !text-[10px] !py-0.5 !px-2 flex items-center gap-1"
								>
									<RefreshCw className="h-3 w-3" /> Rafraîchir
								</button>
							</div>
							<img
								src={previewUrl}
								alt={draft.name}
								className="w-full rounded border border-dbz-border"
							/>
							<p className="mt-1 text-[10px] text-white/30">
								Enregistrez pour voir vos changements de couleurs/fond ici.
							</p>
						</div>
					) : (
						isCreate && (
							<p className="text-[10px] text-white/30">
								L&apos;aperçu sera disponible après la première création.
							</p>
						)
					)}

					<div className="flex items-center gap-2 border-t border-dbz-border pt-3">
						<button
							type="submit"
							disabled={save.isPending}
							className="dbz-button !text-xs !py-1.5 !px-4 flex items-center gap-1.5"
						>
							<Save className="h-3 w-3" />
							{save.isPending
								? "Enregistrement…"
								: isCreate
									? "Créer le thème"
									: "Enregistrer"}
						</button>
						<button
							type="button"
							onClick={onClose}
							className="dbz-button-ghost !text-xs !py-1.5 !px-4"
						>
							Annuler
						</button>
						{!isCreate && (
							<button
								type="button"
								onClick={() => {
									if (
										window.confirm(
											`Supprimer le thème « ${draft.name} » ? Le bot retombera sur le thème intégré du même nom s'il existe.`,
										)
									)
										del.mutate();
								}}
								disabled={del.isPending}
								className="ml-auto dbz-button-ghost !text-xs !py-1.5 !px-3 flex items-center gap-1.5 !text-red-400"
							>
								<Trash2 className="h-3 w-3" /> Supprimer
							</button>
						)}
					</div>
				</form>
			</div>
		</>
	);
}

// ── Galerie d'assets ─────────────────────────────────────────────────────────

/**
 * Grille d'images d'un dossier d'assets du bot. Mode picker si `onPick` fourni
 * (clic = sélection), sinon clic = copie du chemin relatif. Images chargées en
 * direct depuis le bot (botAsset → bot.rpbey.fr/assets/, public, sans auth).
 */
function AssetGrid({
	dir,
	onPick,
}: {
	dir: string;
	onPick?: (path: string) => void;
}) {
	const [copied, setCopied] = useState<string | null>(null);

	const assets = useQuery({
		queryKey: ["assets", dir],
		queryFn: () =>
			api.get<AssetListResponse>(`/assets/list?dir=${encodeURIComponent(dir)}`),
	});

	const files = assets.data?.files ?? [];

	const handleClick = (path: string) => {
		if (onPick) {
			onPick(path);
			return;
		}
		navigator.clipboard?.writeText(path).then(
			() => {
				setCopied(path);
				setTimeout(() => setCopied(null), 1500);
			},
			() => {},
		);
	};

	if (assets.isLoading)
		return (
			<div className="flex items-center gap-2 text-white/40 text-sm">
				<Loader2 className="h-4 w-4 animate-spin" /> Chargement des images…
			</div>
		);
	if (assets.isError)
		return (
			<div className="dbz-panel p-4 border-l-4 border-red-500 text-sm text-white/50">
				Impossible de lister les images. Vérifiez que le bot est en ligne.
			</div>
		);
	if (files.length === 0)
		return (
			<div className="dbz-panel p-6 text-center text-sm text-white/40">
				Aucune image dans ce dossier.
			</div>
		);

	return (
		<div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
			{files.map((f) => (
				<button
					key={f.path}
					type="button"
					onClick={() => handleClick(f.path)}
					title={onPick ? `Choisir ${f.name}` : `Copier ${f.path}`}
					className="group relative overflow-hidden rounded border border-dbz-border bg-black/30 text-left hover:border-dbz-orange transition-colors"
				>
					<img
						src={botAsset(f.path)}
						alt={f.name}
						className="aspect-video w-full object-cover"
						loading="lazy"
					/>
					<div className="p-1.5">
						<code className="block truncate text-[10px] text-white/50">
							{f.name}
						</code>
					</div>
					{copied === f.path && (
						<span className="absolute inset-x-0 top-0 bg-emerald-600/90 text-center text-[10px] py-0.5 text-white">
							Chemin copié !
						</span>
					)}
				</button>
			))}
		</div>
	);
}

function AssetGallery({ onPick }: { onPick?: (path: string) => void }) {
	const [dir, setDir] = useState(onPick ? "banners" : "banners");

	const list = useQuery({
		queryKey: ["assets", dir],
		queryFn: () =>
			api.get<AssetListResponse>(`/assets/list?dir=${encodeURIComponent(dir)}`),
	});
	const dirs = list.data?.dirs ?? Object.keys(ASSET_DIR_LABELS);

	return (
		<div className="space-y-4">
			<div className="dbz-panel p-3 flex flex-wrap items-center gap-2">
				{dirs.map((d) => (
					<button
						key={d}
						type="button"
						onClick={() => setDir(d)}
						className={`dbz-button !text-xs !py-1 !px-3 ${dir === d ? "" : "opacity-50 hover:opacity-80"}`}
					>
						{ASSET_DIR_LABELS[d] ?? d}
						{list.data && dir === d ? ` (${list.data.count})` : ""}
					</button>
				))}
				{!onPick && (
					<span className="ml-auto text-[10px] text-white/30">
						Cliquez une image pour copier son chemin
					</span>
				)}
			</div>
			<AssetGrid dir={dir} onPick={onPick} />
		</div>
	);
}

function AssetPickerModal({
	onPick,
	onClose,
}: {
	onPick: (path: string) => void;
	onClose: () => void;
}) {
	return (
		<div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 p-4 backdrop-blur">
			<div className="dbz-panel w-full max-w-4xl p-5 space-y-4 max-h-[90vh] overflow-y-auto">
				<div className="flex items-center gap-2">
					<h3 className="font-saiyan text-dbz-orange text-lg uppercase">
						Choisir une image de fond
					</h3>
					<button
						type="button"
						onClick={onClose}
						className="ml-auto dbz-button-ghost !px-2 !py-1"
					>
						<X className="h-4 w-4" />
					</button>
				</div>
				<AssetGallery
					onPick={(path) => {
						onPick(path);
						onClose();
					}}
				/>
			</div>
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
