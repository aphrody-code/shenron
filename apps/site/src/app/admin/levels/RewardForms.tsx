"use client";

import { useState, useTransition } from "react";
import { upsertRewardAction, removeRewardAction } from "./_actions";

export function RewardUpsertForm() {
	const [pending, start] = useTransition();
	const [r, setR] = useState<{ ok: boolean; error?: string } | null>(null);
	function onSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		const fd = new FormData(e.currentTarget);
		const input = {
			level: Number(fd.get("level") ?? 0),
			roleId: String(fd.get("roleId") ?? "").trim(),
			xpThreshold: Number(fd.get("xpThreshold") ?? 0),
			zeniBonus: Number(fd.get("zeniBonus") ?? 0),
		};
		start(async () => {
			const res = await upsertRewardAction(input);
			setR(res);
			if (res.ok) (e.target as HTMLFormElement).reset();
		});
	}
	return (
		<form onSubmit={onSubmit} className="dbz-panel p-5 space-y-3 mb-4">
			<h3 className="font-saiyan text-xl text-fuchsia-300 mb-2">
				+ Upsert reward (level)
			</h3>
			<div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
				<input
					name="level"
					type="number"
					required
					min={1}
					placeholder="Level"
					className="bg-dbz-bg border border-dbz-border focus:border-fuchsia-400 p-2 font-mono"
				/>
				<input
					name="xpThreshold"
					type="number"
					required
					min={0}
					placeholder="XP threshold"
					className="bg-dbz-bg border border-dbz-border focus:border-fuchsia-400 p-2 font-mono"
				/>
				<input
					name="roleId"
					required
					pattern="\d{17,20}"
					placeholder="Role ID"
					className="bg-dbz-bg border border-dbz-border focus:border-fuchsia-400 p-2 font-mono"
				/>
				<input
					name="zeniBonus"
					type="number"
					defaultValue={1000}
					placeholder="Bonus zéni"
					className="bg-dbz-bg border border-dbz-border focus:border-fuchsia-400 p-2 font-mono"
				/>
			</div>
			<div className="flex items-center gap-3">
				<button
					type="submit"
					disabled={pending}
					className="dbz-button !text-xs disabled:opacity-40"
				>
					{pending ? "…" : "Upsert"}
				</button>
				{r && (
					<span
						className={`text-xs ${r.ok ? "text-green-300" : "text-red-400"}`}
					>
						{r.ok ? "✓ Reward upserted" : `✗ ${r.error}`}
					</span>
				)}
			</div>
		</form>
	);
}

export function RewardRemoveButton({ level }: { level: number }) {
	const [pending, start] = useTransition();
	return (
		<button
			type="button"
			disabled={pending}
			onClick={() =>
				start(async () => {
					if (!confirm(`Retirer reward niveau ${level} ?`)) return;
					await removeRewardAction(level);
				})
			}
			className="px-2 py-1 text-[10px] uppercase tracking-widest border border-red-400/50 text-red-300 hover:bg-red-500/10 rounded"
		>
			✗
		</button>
	);
}
