"use client";

import { useState, useTransition } from "react";
import {
	createTrigger,
	updateTrigger,
	deleteTrigger,
	type TriggerInput,
} from "./_actions";

export function TriggerCreateForm() {
	const [pending, start] = useTransition();
	const [result, setResult] = useState<{ ok: boolean; error?: string } | null>(
		null,
	);

	function onSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		const fd = new FormData(e.currentTarget);
		const input: TriggerInput = {
			code: String(fd.get("code") ?? "").trim(),
			description: (fd.get("description") as string) || null,
			pattern: String(fd.get("pattern") ?? "").trim(),
			flags: String(fd.get("flags") ?? "i").trim(),
			enabled: fd.get("enabled") === "on",
		};
		if (!input.code || !input.pattern) {
			setResult({ ok: false, error: "code + pattern requis" });
			return;
		}
		start(async () => {
			const r = await createTrigger(input);
			setResult(r);
			if (r.ok) (e.target as HTMLFormElement).reset();
		});
	}

	return (
		<form onSubmit={onSubmit} className="dbz-panel p-5 space-y-3 mb-4">
			<h3 className="font-saiyan text-xl text-fuchsia-300 mb-2">
				+ Nouveau trigger
			</h3>
			<div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
				<label>
					<span className="font-scouter tracking-widest text-cyan-300 text-[10px] uppercase">
						Code succès
					</span>
					<input
						name="code"
						required
						pattern="[a-z0-9_-]+"
						placeholder="achievement_xyz"
						className="mt-1 w-full bg-dbz-bg border border-dbz-border focus:border-fuchsia-400 p-2 font-mono"
					/>
				</label>
				<label>
					<span className="font-scouter tracking-widest text-cyan-300 text-[10px] uppercase">
						Description
					</span>
					<input
						name="description"
						placeholder="Optionnel"
						className="mt-1 w-full bg-dbz-bg border border-dbz-border focus:border-fuchsia-400 p-2"
					/>
				</label>
				<label className="sm:col-span-2">
					<span className="font-scouter tracking-widest text-cyan-300 text-[10px] uppercase">
						Pattern (regex JS)
					</span>
					<input
						name="pattern"
						required
						placeholder="\\bkamehameha\\b"
						className="mt-1 w-full bg-dbz-bg border border-dbz-border focus:border-fuchsia-400 p-2 font-mono"
					/>
				</label>
				<label>
					<span className="font-scouter tracking-widest text-cyan-300 text-[10px] uppercase">
						Flags
					</span>
					<input
						name="flags"
						defaultValue="i"
						placeholder="i | g | im"
						className="mt-1 w-full bg-dbz-bg border border-dbz-border focus:border-fuchsia-400 p-2 font-mono"
					/>
				</label>
				<label className="flex items-center gap-2 pt-5">
					<input
						type="checkbox"
						name="enabled"
						defaultChecked
						className="w-4 h-4"
					/>
					<span className="font-scouter tracking-widest text-cyan-300">
						ACTIVÉ
					</span>
				</label>
			</div>
			<div className="flex items-center gap-3 pt-2">
				<button
					type="submit"
					disabled={pending}
					className="dbz-button !text-xs disabled:opacity-40"
				>
					{pending ? "Création…" : "Créer trigger"}
				</button>
				{result && (
					<span
						className={`text-xs ${result.ok ? "text-green-300" : "text-red-400"}`}
					>
						{result.ok ? "✓ Trigger créé" : `✗ ${result.error}`}
					</span>
				)}
			</div>
		</form>
	);
}

export function TriggerRowActions({
	code,
	enabled,
}: {
	code: string;
	enabled: boolean;
}) {
	const [pending, start] = useTransition();
	return (
		<div className="flex gap-2 items-center justify-end">
			<button
				type="button"
				disabled={pending}
				onClick={() =>
					start(async () => {
						await updateTrigger(code, { enabled: !enabled });
					})
				}
				className={`px-2 py-1 text-[10px] uppercase tracking-widest border rounded ${
					enabled
						? "border-green-400/50 text-green-300 hover:bg-green-500/10"
						: "border-white/20 text-white/40 hover:bg-white/5"
				}`}
			>
				{enabled ? "ON" : "OFF"}
			</button>
			<button
				type="button"
				disabled={pending}
				onClick={() =>
					start(async () => {
						if (!confirm(`Supprimer trigger "${code}" ?`)) return;
						await deleteTrigger(code);
					})
				}
				className="px-2 py-1 text-[10px] uppercase tracking-widest border border-red-400/50 text-red-300 hover:bg-red-500/10 rounded"
			>
				✗ Suppr
			</button>
		</div>
	);
}

/**
 * Regex tester live : pas de network, tout côté client.
 */
export function RegexTester() {
	const [pattern, setPattern] = useState("\\bkamehameha\\b");
	const [flags, setFlags] = useState("i");
	const [sample, setSample] = useState("Goku lance un KAMEHAMEHA puissant");
	let result: React.ReactNode;
	try {
		const re = new RegExp(pattern, flags);
		const m = sample.match(re);
		result = m ? (
			<div className="text-green-300 text-xs">
				✓ Match : <code className="text-fuchsia-200">{m[0]}</code>
				{m.length > 1 && (
					<div className="mt-1 text-white/50">
						Groupes :{" "}
						{m.slice(1).map((g, i) => (
							<code key={i} className="ml-1 text-cyan-300">
								[{i + 1}] {g ?? "—"}
							</code>
						))}
					</div>
				)}
			</div>
		) : (
			<span className="text-red-300 text-xs">✗ Pas de match</span>
		);
	} catch (err) {
		result = (
			<span className="text-red-400 text-xs">
				✗ Regex invalide : {err instanceof Error ? err.message : "erreur"}
			</span>
		);
	}
	return (
		<div className="dbz-panel p-5 mb-6">
			<h3 className="font-saiyan text-xl text-cyan-300 mb-3">
				🧪 Regex tester
			</h3>
			<div className="grid sm:grid-cols-[1fr_80px] gap-2 mb-2">
				<input
					value={pattern}
					onChange={(e) => setPattern(e.target.value)}
					placeholder="Pattern regex"
					className="bg-dbz-bg border border-dbz-border focus:border-fuchsia-400 p-2 font-mono text-xs"
				/>
				<input
					value={flags}
					onChange={(e) => setFlags(e.target.value)}
					placeholder="Flags"
					className="bg-dbz-bg border border-dbz-border focus:border-fuchsia-400 p-2 font-mono text-xs text-center"
				/>
			</div>
			<input
				value={sample}
				onChange={(e) => setSample(e.target.value)}
				placeholder="Texte de test"
				className="w-full bg-dbz-bg border border-dbz-border focus:border-fuchsia-400 p-2 text-xs mb-3"
			/>
			{result}
		</div>
	);
}
