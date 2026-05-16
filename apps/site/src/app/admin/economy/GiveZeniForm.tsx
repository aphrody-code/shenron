"use client";

import { useState, useTransition } from "react";
import { giveZeniAction } from "./_actions";

export function GiveZeniForm() {
	const [pending, start] = useTransition();
	const [r, setR] = useState<{ ok: boolean; error?: string } | null>(null);
	function onSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		const fd = new FormData(e.currentTarget);
		const userId = String(fd.get("userId") ?? "").trim();
		const amount = Number(fd.get("amount") ?? 0);
		const reason = String(fd.get("reason") ?? "") || undefined;
		start(async () => {
			const res = await giveZeniAction(userId, amount, reason);
			setR(res);
			if (res.ok) (e.target as HTMLFormElement).reset();
		});
	}
	return (
		<form onSubmit={onSubmit} className="dbz-panel p-5 space-y-3">
			<h3 className="font-saiyan text-xl text-fuchsia-300 mb-2">
				💸 Give / remove zénis
			</h3>
			<div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
				<input
					name="userId"
					required
					pattern="\d{17,20}"
					placeholder="Discord ID"
					className="bg-dbz-bg border border-dbz-border focus:border-fuchsia-400 p-2 font-mono"
				/>
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
						{r.ok ? "✓ Appliqué" : `✗ ${r.error}`}
					</span>
				)}
			</div>
		</form>
	);
}
