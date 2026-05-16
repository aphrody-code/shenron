"use client";

import { useState, useTransition } from "react";
import { setCronInterval } from "./_actions";

function fmtInterval(ms: number): string {
	const s = ms / 1000;
	if (s < 60) return `${s}s`;
	if (s < 3600) return `${(s / 60).toFixed(0)}min`;
	return `${(s / 3600).toFixed(1)}h`;
}

export function CronIntervalEditor({
	name,
	intervalMs,
}: {
	name: string;
	intervalMs: number;
}) {
	const [editing, setEditing] = useState(false);
	const [val, setVal] = useState(String(Math.round(intervalMs / 1000)));
	const [pending, start] = useTransition();
	const [error, setError] = useState<string | null>(null);

	if (!editing) {
		return (
			<button
				type="button"
				onClick={() => setEditing(true)}
				className="text-fuchsia-200 hover:text-fuchsia-100 underline decoration-dotted text-xs"
			>
				{fmtInterval(intervalMs)}
			</button>
		);
	}

	return (
		<form
			onSubmit={(e) => {
				e.preventDefault();
				const sec = Number(val);
				if (!Number.isFinite(sec) || sec < 1) {
					setError("≥ 1 sec");
					return;
				}
				start(async () => {
					const r = await setCronInterval(name, sec * 1000);
					if (r.ok) setEditing(false);
					else setError(r.error ?? "erreur");
				});
			}}
			className="flex items-center gap-1"
		>
			<input
				type="number"
				value={val}
				onChange={(e) => setVal(e.target.value)}
				min={1}
				autoFocus
				className="w-16 bg-dbz-bg border border-fuchsia-400 p-1 font-mono text-xs"
			/>
			<span className="text-white/40 text-[10px]">sec</span>
			<button
				type="submit"
				disabled={pending}
				className="text-green-300 text-xs"
			>
				✓
			</button>
			<button
				type="button"
				onClick={() => setEditing(false)}
				className="text-white/40 text-xs"
			>
				✗
			</button>
			{error && <span className="text-red-400 text-[10px]">{error}</span>}
		</form>
	);
}
