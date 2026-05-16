"use client";

import { useState, useTransition } from "react";
import { giveZeniAction } from "./_actions";

export function GiveZeniForm() {
	const [mode, setMode] = useState<"user" | "role" | "all">("user");
	const [pending, start] = useTransition();
	const [r, setR] = useState<{
		ok: boolean;
		error?: string;
		applied?: number;
	} | null>(null);
	function onSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		const fd = new FormData(e.currentTarget);
		const userId = String(fd.get("userId") ?? "").trim();
		const roleId = String(fd.get("roleId") ?? "").trim();
		const amount = Number(fd.get("amount") ?? 0);
		const reason = String(fd.get("reason") ?? "") || undefined;
		start(async () => {
			const res = await giveZeniAction({
				mode,
				userId: mode === "user" ? userId : undefined,
				roleId: mode === "role" ? roleId : undefined,
				amount,
				reason,
			});
			setR(res);
			if (res.ok) (e.target as HTMLFormElement).reset();
		});
	}
	return (
		<form onSubmit={onSubmit} className="dbz-panel p-5 space-y-3">
			<div className="flex items-baseline justify-between flex-wrap gap-3">
				<h3 className="font-saiyan text-xl text-fuchsia-300">
					💸 Give / remove zénis
				</h3>
				<div className="flex gap-1 text-[10px]">
					{(["user", "role", "all"] as const).map((m) => (
						<button
							key={m}
							type="button"
							onClick={() => setMode(m)}
							className={`px-3 py-1.5 uppercase tracking-widest border rounded ${
								mode === m
									? "border-fuchsia-400 bg-fuchsia-500/20 text-white"
									: "border-dbz-border text-white/40 hover:border-fuchsia-400"
							}`}
						>
							{m}
						</button>
					))}
				</div>
			</div>
			<div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
				{mode === "user" && (
					<input
						name="userId"
						required
						pattern="\d{17,20}"
						placeholder="User Discord ID"
						className="bg-dbz-bg border border-dbz-border focus:border-fuchsia-400 p-2 font-mono"
					/>
				)}
				{mode === "role" && (
					<input
						name="roleId"
						required
						pattern="\d{17,20}"
						placeholder="Role Discord ID (tous les membres)"
						className="bg-dbz-bg border border-dbz-border focus:border-fuchsia-400 p-2 font-mono"
					/>
				)}
				{mode === "all" && (
					<div className="p-2 text-yellow-300 text-[10px] border border-yellow-500/40 bg-yellow-500/10 rounded">
						⚠ MASS · applique à TOUS les users de la table
					</div>
				)}
				<input
					name="amount"
					type="number"
					required
					placeholder="Amount (négatif = retrait)"
					className="bg-dbz-bg border border-dbz-border focus:border-fuchsia-400 p-2 font-mono"
				/>
				<input
					name="reason"
					placeholder="Raison (optionnel)"
					className="bg-dbz-bg border border-dbz-border focus:border-fuchsia-400 p-2"
				/>
			</div>
			<div className="flex items-center gap-3">
				<button
					type="submit"
					disabled={pending}
					className="dbz-button !text-xs disabled:opacity-40"
				>
					{pending ? "…" : "Appliquer"}
				</button>
				{r && (
					<span
						className={`text-xs ${r.ok ? "text-green-300" : "text-red-400"}`}
					>
						{r.ok
							? `✓ Appliqué${r.applied !== undefined ? ` à ${r.applied} users` : ""}`
							: `✗ ${r.error}`}
					</span>
				)}
			</div>
		</form>
	);
}
