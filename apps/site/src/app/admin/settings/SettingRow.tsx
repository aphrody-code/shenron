"use client";

import { useState, useTransition } from "react";
import { setSetting, unsetSetting } from "./_actions";

export function SettingRow({
	settingKey,
	type,
	defaultValue,
	current,
}: {
	settingKey: string;
	type: string;
	defaultValue: unknown;
	current: unknown;
}) {
	const isOverridden = current !== null && current !== undefined;
	const [editing, setEditing] = useState(false);
	const [val, setVal] = useState<string>(
		isOverridden
			? typeof current === "string"
				? current
				: JSON.stringify(current)
			: typeof defaultValue === "string"
				? defaultValue
				: JSON.stringify(defaultValue ?? ""),
	);
	const [pending, start] = useTransition();
	const [error, setError] = useState<string | null>(null);

	function save() {
		setError(null);
		start(async () => {
			const r = await setSetting(settingKey, val);
			if (r.ok) setEditing(false);
			else setError(r.error ?? "erreur");
		});
	}

	function reset() {
		if (!confirm(`Reset ${settingKey} à la valeur par défaut ?`)) return;
		start(async () => {
			await unsetSetting(settingKey);
			setEditing(false);
		});
	}

	if (editing) {
		return (
			<div className="flex items-center gap-2">
				<input
					value={val}
					onChange={(e) => setVal(e.target.value)}
					autoFocus
					placeholder={type}
					className="bg-dbz-bg border border-fuchsia-400 px-2 py-1 font-mono text-xs flex-1 max-w-xs"
				/>
				<button
					type="button"
					onClick={save}
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
			</div>
		);
	}

	return (
		<div className="flex items-center gap-2">
			<button
				type="button"
				onClick={() => setEditing(true)}
				className={`font-mono text-xs underline decoration-dotted ${
					isOverridden ? "text-fuchsia-200" : "text-white/70"
				}`}
				title="Cliquer pour éditer"
			>
				{isOverridden
					? typeof current === "string"
						? current
						: JSON.stringify(current)
					: "—"}
			</button>
			{isOverridden && (
				<button
					type="button"
					onClick={reset}
					disabled={pending}
					className="text-[10px] text-cyan-300/70 hover:text-cyan-300"
					title="Reset au défaut"
				>
					↺
				</button>
			)}
		</div>
	);
}
