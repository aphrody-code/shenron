"use client";

/**
 * Contrôle des catégories visibles au public (barre de nav + gating URL).
 * Ouvrir = index + fiches publics. Bêta (épisodes/films/manga/chrono) verrouillées ON.
 *
 * UX : aperçu de la nav, bascules, actions rapides (bêta seule / tout ouvrir), save.
 */
import { useMemo, useState } from "react";
import { Check, Eye, EyeOff, Loader2, Lock } from "lucide-react";
import { ALWAYS_OPEN_KEYS, LAUNCH_CATEGORIES } from "@/lib/wiki-launch";

export function LaunchManager({ initialOpen }: { initialOpen: string[] }) {
	const [open, setOpen] = useState<Set<string>>(new Set(initialOpen));
	const [saving, setSaving] = useState(false);
	const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
	const always = useMemo(() => new Set(ALWAYS_OPEN_KEYS), []);

	function toggle(key: string) {
		if (always.has(key)) return;
		setOpen((prev) => {
			const next = new Set(prev);
			if (next.has(key)) next.delete(key);
			else next.add(key);
			return next;
		});
		setMsg(null);
	}

	function openAll() {
		setOpen(new Set(LAUNCH_CATEGORIES.map((c) => c.key)));
		setMsg(null);
	}

	function betaOnly() {
		setOpen(new Set(ALWAYS_OPEN_KEYS));
		setMsg(null);
	}

	async function save() {
		setSaving(true);
		setMsg(null);
		try {
			const res = await fetch("/api/wiki-launch", {
				method: "PUT",
				headers: { "content-type": "application/json" },
				body: JSON.stringify({ openKeys: [...open] }),
			});
			const data = await res.json();
			if (res.ok && data.ok) {
				setOpen(new Set(data.openKeys));
				setMsg({
					ok: true,
					text: "Enregistré — la nav publique se met à jour sous ~30 s (rafraîchis la page).",
				});
			} else {
				setMsg({ ok: false, text: data.error ?? "Échec de l'enregistrement." });
			}
		} catch {
			setMsg({ ok: false, text: "Erreur réseau." });
		} finally {
			setSaving(false);
		}
	}

	const openCount = LAUNCH_CATEGORIES.filter((c) => open.has(c.key) || always.has(c.key)).length;

	// Même règle que SiteNav : 4 premiers wiki en ligne, le reste en « Plus ».
	const openWikiLabels = LAUNCH_CATEGORIES.filter(
		(c) => c.href && (always.has(c.key) || open.has(c.key))
	).map((c) => c.label);
	const inlinePreview = openWikiLabels.slice(0, 4);
	const morePreview = openWikiLabels.slice(4);

	const publicNavPreview = [
		"Accueil",
		...inlinePreview,
		...(morePreview.length ? [`Plus (${morePreview.length})`] : []),
		"News",
	];

	return (
		<div className="space-y-5">
			{/* Aperçu barre de nav (miroir SiteNav) */}
			<div className="dbz-panel space-y-2 p-4">
				<p className="text-[10px] font-bold uppercase tracking-widest text-dbz-blue-light">
					Aperçu barre de navigation publique
				</p>
				<div className="flex flex-wrap items-center gap-1 rounded-lg border border-white/10 bg-black/40 px-2 py-2">
					{publicNavPreview.map((label) => (
						<span
							key={label}
							className={`rounded-md px-2.5 py-1 text-[13px] font-medium ${
								label.startsWith("Plus")
									? "text-white/45 border border-white/10"
									: "text-white/75"
							}`}
						>
							{label}
						</span>
					))}
				</div>
				{morePreview.length > 0 && (
					<p className="text-[11px] text-white/40">
						Dans « Plus » : {morePreview.join(" · ")}
					</p>
				)}
				<p className="text-[11px] text-white/40">
					Max 4 sections wiki en ligne (comme la nav d&apos;origine) — le surplus va dans le
					menu <strong className="text-white/55">Plus</strong>. Les catégories décochées restent
					visibles aux admins via <strong className="text-white/55">Sections</strong>.
				</p>
			</div>

			<div className="dbz-panel flex flex-wrap items-center justify-between gap-3 p-4">
				<p className="text-sm text-white/70">
					<strong className="text-dbz-orange">{openCount}</strong> / {LAUNCH_CATEGORIES.length}{" "}
					catégories publiques
				</p>
				<div className="flex flex-wrap items-center gap-2">
					<button
						type="button"
						onClick={betaOnly}
						className="btn btn-ghost gap-1.5 text-xs"
						title="Nav courte d'origine : Épisodes, Films, Chronologie, Manga"
					>
						<EyeOff className="h-3.5 w-3.5" />
						Bêta seule
					</button>
					<button
						type="button"
						onClick={openAll}
						className="btn btn-ghost gap-1.5 text-xs"
						title="Rendre toutes les catégories publiques"
					>
						<Eye className="h-3.5 w-3.5" />
						Tout ouvrir
					</button>
					<button
						type="button"
						onClick={save}
						disabled={saving}
						className="dbz-button gap-2 disabled:opacity-50"
					>
						{saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
						Enregistrer
					</button>
				</div>
			</div>

			<div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
				{LAUNCH_CATEGORIES.map((c) => {
					const locked = always.has(c.key);
					const isOpen = locked || open.has(c.key);
					return (
						<button
							key={c.key}
							type="button"
							onClick={() => toggle(c.key)}
							disabled={locked}
							className={`flex items-center justify-between rounded-lg border-2 p-3 text-left transition-colors ${
								isOpen
									? "border-green-500/60 bg-green-500/10"
									: "border-dbz-border bg-dbz-card/40 hover:border-dbz-orange/50"
							} ${locked ? "cursor-not-allowed opacity-80" : ""}`}
						>
							<div className="min-w-0">
								<p className="font-saiyan text-sm text-white">{c.label}</p>
								<p className="truncate text-[10px] text-white/40">{c.prefixes.join(" · ")}</p>
							</div>
							<span
								className={`ml-2 flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${
									isOpen ? "bg-green-500 text-black" : "bg-dbz-border text-white/40"
								}`}
							>
								{locked ? (
									<Lock className="h-3 w-3" />
								) : isOpen ? (
									<Check className="h-3.5 w-3.5" />
								) : null}
							</span>
						</button>
					);
				})}
			</div>

			{msg && (
				<p className={`text-sm ${msg.ok ? "text-green-400" : "text-red-400"}`}>{msg.text}</p>
			)}
			<p className="text-xs text-white/40">
				Les cases avec <Lock className="inline h-3 w-3" /> (Épisodes, Films, Chronologie, Manga) sont
				déjà en ligne et ne peuvent pas être refermées. Un clic pour basculer le reste, puis
				Enregistrer.
			</p>
		</div>
	);
}
