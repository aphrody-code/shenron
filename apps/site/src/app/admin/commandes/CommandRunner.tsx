"use client";

/**
 * Console bot : exécute une commande RÉELLE du bot à distance (hors Discord).
 * Calquée sur « Envoyer un message » — sélection d'une commande dans le catalogue
 * (servi par le bot), champs dynamiques, confirmation pour les commandes qui
 * modifient l'état, puis exécution via le proxy admin et affichage du résultat.
 */
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState, useTransition } from "react";
import { api } from "@/lib/admin-api";

type FieldType = "user" | "text" | "number" | "select" | "role" | "channel" | "persona";
interface Field {
	name: string;
	label: string;
	type: FieldType;
	required?: boolean;
	placeholder?: string;
	options?: { value: string; label: string }[];
}
interface CommandSpec {
	name: string;
	label: string;
	description: string;
	danger?: boolean;
	fields: Field[];
}
type ExecResult = { ok: boolean; message: string; data?: Record<string, unknown> } | null;

export function CommandRunner() {
	const catalog = useQuery({
		queryKey: ["console", "commands"],
		queryFn: () => api.get<{ commands: CommandSpec[] }>("/admin/console/commands"),
		staleTime: 5 * 60_000,
	});
	const commands = useMemo(() => catalog.data?.commands ?? [], [catalog.data]);

	const [selected, setSelected] = useState<string>("");
	const [args, setArgs] = useState<Record<string, string>>({});
	const [confirmed, setConfirmed] = useState(false);
	const [result, setResult] = useState<ExecResult>(null);
	const [pending, startTransition] = useTransition();

	const spec = commands.find((c) => c.name === selected);

	function pick(name: string) {
		setSelected(name);
		setArgs({});
		setConfirmed(false);
		setResult(null);
	}
	function setArg(k: string, v: string) {
		setArgs((a) => ({ ...a, [k]: v }));
	}

	const missing = spec?.fields.some((f) => f.required && !String(args[f.name] ?? "").trim());

	function submit(e: React.FormEvent) {
		e.preventDefault();
		if (!spec) return;
		if (spec.danger && !confirmed) {
			setConfirmed(true);
			return;
		}
		setResult(null);
		setConfirmed(false);
		// Coerce les nombres (les inputs number renvoient des strings).
		const payload: Record<string, unknown> = {};
		for (const f of spec.fields) {
			const raw = args[f.name];
			if (raw == null || raw === "") continue;
			payload[f.name] = f.type === "number" ? Number(raw) : raw;
		}
		startTransition(async () => {
			try {
				const res = await fetch("/api/bot-admin/admin/console/exec", {
					method: "POST",
					headers: { "content-type": "application/json" },
					body: JSON.stringify({ command: spec.name, args: payload }),
				});
				const data = (await res.json()) as ExecResult;
				setResult(data ?? { ok: false, message: `HTTP ${res.status}` });
			} catch (err) {
				setResult({ ok: false, message: err instanceof Error ? err.message : "erreur réseau" });
			}
		});
	}

	return (
		<div className="space-y-5">
			{/* Sélecteur de commande */}
			<div className="dbz-panel p-5">
				<label className="mb-2 block text-[10px] font-bold uppercase tracking-widest text-dbz-blue-light">
					Commande à exécuter
				</label>
				{catalog.isLoading ? (
					<p className="text-xs text-white/40">Chargement du catalogue…</p>
				) : catalog.isError ? (
					<p className="text-xs text-red-400">Impossible de charger le catalogue des commandes.</p>
				) : (
					<div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
						{commands.map((c) => (
							<button
								key={c.name}
								type="button"
								onClick={() => pick(c.name)}
								className={`rounded border p-2 text-left transition-colors ${
									selected === c.name
										? "border-dbz-orange bg-dbz-orange/10"
										: "border-dbz-border hover:border-dbz-orange/40"
								}`}
							>
								<p className="font-saiyan text-sm text-white">{c.label}</p>
								<p className="mt-0.5 text-[10px] leading-tight text-white/40">{c.description}</p>
							</button>
						))}
					</div>
				)}
			</div>

			{/* Formulaire de la commande */}
			{spec && (
				<form onSubmit={submit} className="dbz-panel space-y-4 p-5">
					<div>
						<h2 className="font-saiyan text-lg text-dbz-orange">{spec.label}</h2>
						<p className="text-xs text-white/50">{spec.description}</p>
					</div>

					{spec.fields.map((f) => (
						<div key={f.name}>
							<label className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-dbz-blue-light">
								{f.label}
								{f.required && <span className="ml-1 text-dbz-red">*</span>}
							</label>
							{f.type === "select" || f.type === "persona" ? (
								<select
									className="input w-full text-sm"
									value={args[f.name] ?? ""}
									onChange={(e) => setArg(f.name, e.target.value)}
									disabled={pending}
								>
									<option value="">— choisir —</option>
									{(f.options ?? []).map((o) => (
										<option key={o.value} value={o.value}>
											{o.label}
										</option>
									))}
								</select>
							) : f.type === "text" ? (
								<textarea
									className="input w-full font-mono text-sm"
									rows={f.name === "content" ? 4 : 2}
									placeholder={f.placeholder}
									value={args[f.name] ?? ""}
									onChange={(e) => setArg(f.name, e.target.value)}
									disabled={pending}
								/>
							) : (
								<input
									className="input w-full font-mono text-sm"
									type={f.type === "number" ? "number" : "text"}
									placeholder={
										f.placeholder ??
										(f.type === "user" || f.type === "role" || f.type === "channel"
											? "ID Discord (17-20 chiffres)"
											: "")
									}
									value={args[f.name] ?? ""}
									onChange={(e) => setArg(f.name, e.target.value)}
									disabled={pending}
								/>
							)}
						</div>
					))}

					{/* Confirmation pour les commandes qui modifient l'état */}
					{confirmed && spec.danger ? (
						<div className="rounded border-2 border-dbz-yellow/60 bg-dbz-yellow/5 p-4">
							<p className="mb-2 font-saiyan text-dbz-yellow">Confirmer l&apos;exécution ?</p>
							<p className="mb-3 text-sm text-white/70">
								<strong>{spec.label}</strong> va s&apos;exécuter immédiatement sur le bot en
								production.
							</p>
							<div className="flex gap-3">
								<button type="submit" disabled={pending} className="dbz-button disabled:opacity-40">
									{pending ? "Exécution…" : "Confirmer"}
								</button>
								<button
									type="button"
									onClick={() => setConfirmed(false)}
									className="dbz-button-ghost"
								>
									Annuler
								</button>
							</div>
						</div>
					) : (
						<button
							type="submit"
							disabled={pending || missing}
							className="dbz-button disabled:cursor-not-allowed disabled:opacity-40"
						>
							{pending ? "Exécution…" : spec.danger ? "Exécuter…" : "Exécuter"}
						</button>
					)}

					{result && (
						<div
							className={`rounded border-l-4 p-4 ${
								result.ok ? "border-green-500 bg-green-500/5" : "border-red-500 bg-red-500/5"
							}`}
						>
							<p className={`text-sm font-semibold ${result.ok ? "text-green-400" : "text-red-400"}`}>
								{result.ok ? "Exécuté" : "Échec"}
							</p>
							<p className="mt-1 text-sm text-white/80">{result.message}</p>
							{result.data && (
								<pre className="mt-2 overflow-x-auto rounded bg-black/40 p-2 text-[11px] text-white/60">
									{JSON.stringify(result.data, null, 2)}
								</pre>
							)}
						</div>
					)}
				</form>
			)}
		</div>
	);
}
