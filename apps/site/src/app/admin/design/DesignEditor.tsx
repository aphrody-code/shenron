"use client";

/**
 * Éditeur de design global (/admin/design).
 *
 * Palette + rayon des coins du site, appliqués partout via l'injection `:root`
 * du layout racine (cf. lib/site-theme.ts). Écrit un document JSON unique via
 * PUT /api/theme-config (gate admin) qui revalide tout le site. Repli : sans
 * thème, le site garde sa palette d'origine.
 */
import { useEffect, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Palette, RotateCcw, Save } from "lucide-react";
import {
	DEFAULT_SITE_THEME,
	THEME_COLORS,
	type SiteTheme,
	type ThemeColorKey,
} from "@/lib/site-theme";

async function loadTheme(): Promise<{ theme: SiteTheme }> {
	const r = await fetch("/api/theme-config", { credentials: "same-origin" });
	if (!r.ok) throw new Error(`HTTP ${r.status}`);
	return r.json();
}

async function saveTheme(theme: SiteTheme): Promise<{ ok: boolean; theme: SiteTheme }> {
	const r = await fetch("/api/theme-config", {
		method: "PUT",
		credentials: "same-origin",
		headers: { "content-type": "application/json" },
		body: JSON.stringify(theme),
	});
	if (!r.ok) {
		const t = await r.text().catch(() => "");
		throw new Error(t || `HTTP ${r.status}`);
	}
	return r.json();
}

function ColorRow({
	label,
	hint,
	value,
	onChange,
}: {
	label: string;
	hint: string;
	value: string;
	onChange: (v: string) => void;
}) {
	// <input type=color> exige un hex 6 chiffres ; on garde un champ texte libre à côté.
	const colorValue = /^#[0-9a-fA-F]{6}$/.test(value) ? value : "#000000";
	return (
		<div className="flex items-center gap-3 rounded-lg border border-zinc-800 bg-black/30 p-3">
			<input
				type="color"
				value={colorValue}
				onChange={(e) => onChange(e.target.value)}
				className="h-10 w-12 shrink-0 cursor-pointer rounded border border-zinc-700 bg-transparent"
				aria-label={label}
			/>
			<div className="min-w-0 flex-1">
				<div className="text-sm font-semibold text-white">{label}</div>
				<div className="truncate text-[11px] text-zinc-500">{hint}</div>
			</div>
			<input
				value={value}
				onChange={(e) => onChange(e.target.value)}
				className="input w-28 font-mono text-xs"
				spellCheck={false}
			/>
		</div>
	);
}

export default function DesignEditor() {
	const query = useQuery({ queryKey: ["theme-config"], queryFn: loadTheme });
	const [theme, setTheme] = useState<SiteTheme | null>(null);
	const [toast, setToast] = useState<{ type: "success" | "error"; msg: string } | null>(null);

	useEffect(() => {
		if (query.data?.theme) setTheme(query.data.theme);
	}, [query.data]);

	useEffect(() => {
		if (!toast) return;
		const t = setTimeout(() => setToast(null), 3500);
		return () => clearTimeout(t);
	}, [toast]);

	const save = useMutation({
		mutationFn: () => saveTheme(theme as SiteTheme),
		onSuccess: (res) => {
			setTheme(res.theme);
			setToast({ type: "success", msg: "Thème enregistré et appliqué à tout le site." });
		},
		onError: (e: Error) => setToast({ type: "error", msg: `Échec : ${e.message}` }),
	});

	if (query.isLoading || !theme) {
		return <div className="text-sm text-zinc-500">Chargement du thème…</div>;
	}
	if (query.isError) {
		return <div className="text-sm text-red-400">Erreur : {String(query.error)}</div>;
	}

	const setColor = (key: ThemeColorKey, v: string) =>
		setTheme((t) => (t ? { ...t, colors: { ...t.colors, [key]: v } } : t));

	return (
		<div className="space-y-4">
			{toast && (
				<div
					className={`fixed right-4 top-4 z-50 rounded-lg border px-4 py-3 text-sm shadow-xl ${
						toast.type === "success"
							? "border-green-500/50 bg-dbz-card text-green-300"
							: "border-red-500/50 bg-dbz-card text-red-300"
					}`}
				>
					{toast.msg}
				</div>
			)}

			<div className="dbz-panel flex flex-wrap items-center gap-3 p-4">
				<div className="flex flex-1 items-center gap-2">
					<Palette className="h-5 w-5 text-dbz-orange" />
					<div>
						<h2 className="font-saiyan text-lg uppercase text-dbz-orange">Design &amp; thème</h2>
						<p className="text-xs text-zinc-400">
							Palette et coins appliqués à <strong>tout le site</strong> après enregistrement.
						</p>
					</div>
				</div>
				<button
					type="button"
					onClick={() => {
						if (confirm("Réinitialiser le thème aux valeurs par défaut ?")) {
							setTheme(structuredClone(DEFAULT_SITE_THEME));
						}
					}}
					className="btn btn-ghost text-amber-300"
				>
					<RotateCcw className="mr-1 h-4 w-4" /> Défauts
				</button>
				<button
					type="button"
					onClick={() => save.mutate()}
					disabled={save.isPending}
					className="btn btn-primary"
				>
					<Save className="mr-1 h-4 w-4" /> {save.isPending ? "Enregistrement…" : "Enregistrer"}
				</button>
			</div>

			<div className="grid gap-3 lg:grid-cols-2">
				{THEME_COLORS.map((c) => (
					<ColorRow
						key={c.key}
						label={c.label}
						hint={c.hint}
						value={theme.colors[c.key]}
						onChange={(v) => setColor(c.key, v)}
					/>
				))}
			</div>

			<div className="card p-4">
				<label className="block text-xs text-zinc-400">
					Rayon des coins : <span className="font-mono text-white">{theme.radius}rem</span>
					<input
						type="range"
						min={0}
						max={2}
						step={0.05}
						value={theme.radius}
						onChange={(e) => setTheme((t) => (t ? { ...t, radius: Number(e.target.value) } : t))}
						className="mt-2 w-full"
					/>
				</label>
			</div>

			{/* Aperçu rapide — swatches + carte témoin (couleurs du state, pas encore live). */}
			<div
				className="card p-4"
				style={{
					background: theme.colors.card,
					borderColor: theme.colors.border,
					borderRadius: `${theme.radius}rem`,
				}}
			>
				<div className="mb-3 flex items-center gap-2">
					{THEME_COLORS.map((c) => (
						<span
							key={c.key}
							title={`${c.label} · ${theme.colors[c.key]}`}
							className="h-6 w-6 rounded border border-white/20"
							style={{ background: theme.colors[c.key] }}
						/>
					))}
				</div>
				<div className="flex items-center gap-3">
					<span
						className="rounded px-3 py-1.5 text-sm font-bold text-black"
						style={{ background: theme.colors.orange, borderRadius: `${theme.radius}rem` }}
					>
						Bouton doré
					</span>
					<span style={{ color: theme.colors.blueLight }} className="text-sm">
						Texte secondaire
					</span>
					<span style={{ color: theme.colors.red }} className="text-sm font-bold">
						Énergie
					</span>
				</div>
				<p className="mt-2 text-[11px] text-zinc-500">
					Aperçu indicatif. Enregistre pour appliquer réellement le thème à tout le site.
				</p>
			</div>

			<div className="flex justify-end">
				<button
					type="button"
					onClick={() => save.mutate()}
					disabled={save.isPending}
					className="btn btn-primary"
				>
					<Save className="mr-1 h-4 w-4" /> {save.isPending ? "Enregistrement…" : "Enregistrer"}
				</button>
			</div>
		</div>
	);
}
