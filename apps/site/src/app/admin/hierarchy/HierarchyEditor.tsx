"use client";

import { useState, useTransition } from "react";
import { saveHierarchy } from "./_actions";

type Tier = { name: string; roleIds: string[]; level: number };

export function HierarchyEditor({ initial }: { initial: Tier[] }) {
	const [levels, setLevels] = useState<string[][]>(() =>
		[...initial].sort((a, b) => b.level - a.level).map((t) => [...t.roleIds]),
	);
	const [pending, start] = useTransition();
	const [r, setR] = useState<{ ok: boolean; error?: string } | null>(null);

	function addLevel() {
		setLevels((l) => [...l, []]);
	}
	function removeLevel(i: number) {
		setLevels((l) => l.filter((_, idx) => idx !== i));
	}
	function moveUp(i: number) {
		if (i === 0) return;
		setLevels((l) => {
			const next = [...l];
			[next[i - 1], next[i]] = [next[i]!, next[i - 1]!];
			return next;
		});
	}
	function moveDown(i: number) {
		setLevels((l) => {
			if (i === l.length - 1) return l;
			const next = [...l];
			[next[i + 1], next[i]] = [next[i]!, next[i + 1]!];
			return next;
		});
	}
	function addRole(i: number, roleId: string) {
		const id = roleId.trim();
		if (!/^\d{17,20}$/.test(id)) return;
		setLevels((l) =>
			l.map((roles, idx) =>
				idx === i && !roles.includes(id) ? [...roles, id] : roles,
			),
		);
	}
	function removeRole(i: number, roleId: string) {
		setLevels((l) =>
			l.map((roles, idx) =>
				idx === i ? roles.filter((r) => r !== roleId) : roles,
			),
		);
	}
	function save() {
		setR(null);
		start(async () => {
			const res = await saveHierarchy(levels);
			setR(res);
		});
	}

	return (
		<div className="space-y-3">
			{levels.map((roles, i) => (
				<div key={i} className="dbz-panel p-4">
					<div className="flex items-baseline justify-between mb-3 gap-3">
						<h2 className="font-saiyan text-xl text-dbz-yellow uppercase">
							Niveau {levels.length - i}
						</h2>
						<div className="flex gap-1 text-xs">
							<button
								type="button"
								onClick={() => moveUp(i)}
								disabled={i === 0}
								className="px-2 py-1 border border-dbz-border hover:border-fuchsia-400 disabled:opacity-30 rounded"
							>
								↑
							</button>
							<button
								type="button"
								onClick={() => moveDown(i)}
								disabled={i === levels.length - 1}
								className="px-2 py-1 border border-dbz-border hover:border-fuchsia-400 disabled:opacity-30 rounded"
							>
								↓
							</button>
							<button
								type="button"
								onClick={() => removeLevel(i)}
								className="px-2 py-1 border border-red-400/50 text-red-300 hover:bg-red-500/10 rounded"
							>
								✗ Suppr niveau
							</button>
						</div>
					</div>
					<div className="flex flex-wrap gap-2 mb-2">
						{roles.map((rid) => (
							<span
								key={rid}
								className="inline-flex items-center gap-1 px-2 py-1 bg-fuchsia-500/10 border border-fuchsia-500/40 rounded text-[11px] font-mono text-fuchsia-200"
							>
								{rid}
								<button
									type="button"
									onClick={() => removeRole(i, rid)}
									className="text-red-300 hover:text-red-200 ml-1"
								>
									×
								</button>
							</span>
						))}
						{roles.length === 0 && (
							<span className="text-xs text-white/40 italic">Aucun rôle</span>
						)}
					</div>
					<form
						onSubmit={(e) => {
							e.preventDefault();
							const fd = new FormData(e.currentTarget);
							const id = String(fd.get("rid") ?? "");
							addRole(i, id);
							(e.target as HTMLFormElement).reset();
						}}
						className="flex gap-2"
					>
						<input
							name="rid"
							pattern="\d{17,20}"
							placeholder="Role ID Discord (17-20 chiffres)"
							className="flex-1 bg-dbz-bg border border-dbz-border focus:border-fuchsia-400 p-1.5 font-mono text-xs"
						/>
						<button
							type="submit"
							className="dbz-button-ghost !text-[10px] !py-1 !px-3"
						>
							+ Ajouter
						</button>
					</form>
				</div>
			))}

			<div className="flex items-center justify-between gap-3 pt-2">
				<button
					type="button"
					onClick={addLevel}
					className="dbz-button-ghost !text-xs"
				>
					+ Ajouter un niveau
				</button>
				<div className="flex items-center gap-3">
					{r && (
						<span
							className={`text-xs ${r.ok ? "text-green-300" : "text-red-400"}`}
						>
							{r.ok ? "✓ Sauvegardé" : `✗ ${r.error}`}
						</span>
					)}
					<button
						type="button"
						onClick={save}
						disabled={pending}
						className="dbz-button !text-xs disabled:opacity-40"
					>
						{pending ? "Sauvegarde…" : "Sauvegarder l'arbre"}
					</button>
				</div>
			</div>
		</div>
	);
}
