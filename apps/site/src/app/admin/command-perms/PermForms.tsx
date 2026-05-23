"use client";

import { useState, useTransition } from "react";
import { upsertPerm, removePerm } from "./_actions";

export function PermCreateForm() {
	const [pending, start] = useTransition();
	const [r, setR] = useState<{ ok: boolean; error?: string } | null>(null);
	function onSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		const fd = new FormData(e.currentTarget);
		const input = {
			command: String(fd.get("command") ?? "").trim(),
			scope: String(fd.get("scope") ?? "").trim(),
			roleId: String(fd.get("roleId") ?? "").trim() || null,
			userId: String(fd.get("userId") ?? "").trim() || null,
			allow: fd.get("allow") === "on",
		};
		start(async () => {
			const res = await upsertPerm(input);
			setR(res);
			if (res.ok) (e.target as HTMLFormElement).reset();
		});
	}
	return (
		<form onSubmit={onSubmit} className="dbz-panel p-5 space-y-3 mb-4">
			<h3 className="font-saiyan text-xl text-fuchsia-300">
				Ajouter / modifier une règle
			</h3>
			<p className="text-xs text-zinc-400">
				Définissez si un rôle ou un utilisateur peut utiliser une commande.
				Portée = nom de la commande ou joker (<code>admin *</code>,{" "}
				<code>*</code>). Une règle plus spécifique prime toujours sur une règle
				plus générale.
			</p>
			<div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
				<label>
					<span className="font-scouter tracking-widest text-cyan-300 text-[10px] uppercase">
						Commande
					</span>
					<input
						name="command"
						required
						placeholder="warn"
						className="mt-1 w-full bg-dbz-bg border border-dbz-border focus:border-fuchsia-400 p-2 font-mono rounded outline-none"
					/>
				</label>
				<label>
					<span className="font-scouter tracking-widest text-cyan-300 text-[10px] uppercase">
						Portée (sous-commande ou *)
					</span>
					<input
						name="scope"
						required
						placeholder="* | add | reload"
						className="mt-1 w-full bg-dbz-bg border border-dbz-border focus:border-fuchsia-400 p-2 font-mono rounded outline-none"
					/>
				</label>
				<label>
					<span className="font-scouter tracking-widest text-cyan-300 text-[10px] uppercase">
						ID du rôle (exclusif avec utilisateur)
					</span>
					<input
						name="roleId"
						pattern="\d{17,20}"
						placeholder="Identifiant du rôle Discord (17-20 chiffres)"
						className="mt-1 w-full bg-dbz-bg border border-dbz-border focus:border-fuchsia-400 p-2 font-mono rounded outline-none"
					/>
				</label>
				<label>
					<span className="font-scouter tracking-widest text-cyan-300 text-[10px] uppercase">
						ID de l'utilisateur (exclusif avec rôle)
					</span>
					<input
						name="userId"
						pattern="\d{17,20}"
						placeholder="Identifiant de l'utilisateur Discord"
						className="mt-1 w-full bg-dbz-bg border border-dbz-border focus:border-fuchsia-400 p-2 font-mono rounded outline-none"
					/>
				</label>
				<label className="flex items-center gap-2 pt-5 sm:col-span-2">
					<input
						type="checkbox"
						name="allow"
						defaultChecked
						className="w-4 h-4"
					/>
					<span className="font-scouter tracking-widest text-cyan-300 text-[10px]">
						AUTORISER (décocher = INTERDIRE)
					</span>
				</label>
			</div>
			<div className="flex items-center gap-3">
				<button
					type="submit"
					disabled={pending}
					className="dbz-button !text-xs disabled:opacity-40"
				>
					{pending ? "Enregistrement…" : "Créer / mettre à jour"}
				</button>
				{r && (
					<span
						className={`text-xs ${r.ok ? "text-green-300" : "text-red-400"}`}
					>
						{r.ok ? "Règle appliquée" : `Erreur : ${r.error}`}
					</span>
				)}
			</div>
		</form>
	);
}

export function PermDeleteButton({
	command,
	scope,
	roleId,
	userId,
}: {
	command: string;
	scope: string;
	roleId?: string | null;
	userId?: string | null;
}) {
	const [pending, start] = useTransition();
	return (
		<button
			type="button"
			disabled={pending}
			onClick={() =>
				start(async () => {
					if (
						!confirm(
							`Supprimer la règle « ${command} / ${scope} » ?\n\nLes réglages par défaut s'appliqueront à nouveau.`,
						)
					)
						return;
					await removePerm({ command, scope, roleId, userId });
				})
			}
			className="px-2 py-1 text-[10px] uppercase tracking-widest border border-red-400/50 text-red-300 hover:bg-red-500/10 rounded disabled:opacity-40"
		>
			Supprimer
		</button>
	);
}
