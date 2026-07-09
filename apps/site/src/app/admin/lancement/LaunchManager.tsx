"use client";

/**
 * Contrôle de LANCEMENT du wiki : bascule quelles catégories sont visibles au
 * public (gating bêta). Ouvrir une catégorie = son index + ses fiches détail
 * deviennent publics immédiatement (le reste reste réservé aux admins). Les
 * catégories bêta (episodes/films/manga/chronologie) sont verrouillées ON.
 */
import { useState } from "react";
import { Check, Loader2, Lock } from "lucide-react";
import { ALWAYS_OPEN_KEYS, LAUNCH_CATEGORIES } from "@/lib/wiki-launch";

export function LaunchManager({ initialOpen }: { initialOpen: string[] }) {
	const [open, setOpen] = useState<Set<string>>(new Set(initialOpen));
	const [saving, setSaving] = useState(false);
	const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
	const always = new Set(ALWAYS_OPEN_KEYS);

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
				setMsg({ ok: true, text: "Enregistré — les catégories ouvertes sont publiques." });
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

	return (
		<div className="space-y-5">
			<div className="dbz-panel flex flex-wrap items-center justify-between gap-3 p-4">
				<p className="text-sm text-white/70">
					<strong className="text-dbz-orange">{openCount}</strong> / {LAUNCH_CATEGORIES.length}{" "}
					catégories publiques
				</p>
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
				Les catégories verrouillées <Lock className="inline h-3 w-3" /> sont déjà en ligne (bêta) et
				ne peuvent pas être refermées. Ouvrir une catégorie rend publics son index ET ses fiches
				détail ; sa fiche apparaît dans la barre de navigation à la prochaine revalidation.
			</p>
		</div>
	);
}
