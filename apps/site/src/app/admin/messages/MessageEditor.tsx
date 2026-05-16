"use client";

import { useState, useTransition } from "react";
import { upsertMessage, resetMessage, previewMessage } from "./_actions";

export function MessageEditor({
	event,
	initial,
}: {
	event: string;
	initial: {
		template: string | null;
		channelKey: string | null;
		enabled: boolean;
	};
}) {
	const [template, setTemplate] = useState(initial.template ?? "");
	const [channelKey, setChannelKey] = useState(initial.channelKey ?? "");
	const [enabled, setEnabled] = useState(initial.enabled);
	const [open, setOpen] = useState(false);
	const [pending, start] = useTransition();
	const [preview, setPreview] = useState<string | null>(null);
	const [result, setResult] = useState<{ ok: boolean; error?: string } | null>(
		null,
	);

	if (!open) {
		return (
			<button
				type="button"
				onClick={() => setOpen(true)}
				className="dbz-button-ghost !text-[10px] !py-1 !px-3"
			>
				✏ Éditer
			</button>
		);
	}

	function save() {
		setResult(null);
		start(async () => {
			const r = await upsertMessage(event, {
				template: template || null,
				channelKey: channelKey || null,
				enabled,
			});
			setResult(r);
			if (r.ok) setOpen(false);
		});
	}
	function reset() {
		setResult(null);
		start(async () => {
			if (!confirm(`Reset template "${event}" au défaut ?`)) return;
			const r = await resetMessage(event);
			setResult(r);
			if (r.ok) setOpen(false);
		});
	}
	function doPreview() {
		setPreview(null);
		start(async () => {
			const r = await previewMessage(event, {
				user: "<@123>",
				zeni: 100,
				level: 7,
			});
			if (r.ok) setPreview(r.preview);
			else setResult(r);
		});
	}

	return (
		<div className="fixed inset-0 z-50 bg-black/80 grid place-items-center p-4 overflow-y-auto">
			<div className="dbz-panel p-6 max-w-2xl w-full space-y-3 my-8">
				<div className="flex justify-between items-baseline">
					<h3 className="font-saiyan text-xl text-fuchsia-300">
						Éditer template · <code className="text-cyan-300">{event}</code>
					</h3>
					<button
						type="button"
						onClick={() => setOpen(false)}
						className="text-white/40 hover:text-white"
					>
						✗
					</button>
				</div>

				<label className="block">
					<span className="font-scouter text-[10px] tracking-widest text-cyan-300 uppercase">
						Channel key (settings.channels.X)
					</span>
					<input
						value={channelKey}
						onChange={(e) => setChannelKey(e.target.value)}
						placeholder="logs.levelup"
						className="mt-1 w-full bg-dbz-bg border border-dbz-border focus:border-fuchsia-400 p-2 font-mono text-xs"
					/>
				</label>

				<label className="block">
					<span className="font-scouter text-[10px] tracking-widest text-cyan-300 uppercase">
						Template (Discord markdown · placeholders {`{user}`}, {`{zeni}`},
						{` {level}`})
					</span>
					<textarea
						value={template}
						onChange={(e) => setTemplate(e.target.value)}
						rows={8}
						placeholder="🎉 {user} passe niveau **{level}** ! +{zeni} z"
						className="mt-1 w-full bg-dbz-bg border border-dbz-border focus:border-fuchsia-400 p-2 font-mono text-xs resize-y"
					/>
				</label>

				<label className="flex items-center gap-2">
					<input
						type="checkbox"
						checked={enabled}
						onChange={(e) => setEnabled(e.target.checked)}
						className="w-4 h-4"
					/>
					<span className="font-scouter tracking-widest text-cyan-300 text-xs">
						ACTIVÉ
					</span>
				</label>

				{preview && (
					<div className="dbz-panel p-3 bg-dbz-bg/60">
						<div className="font-scouter text-[10px] tracking-widest text-fuchsia-300 mb-1">
							PREVIEW
						</div>
						<pre className="text-xs text-white whitespace-pre-wrap break-words">
							{preview}
						</pre>
					</div>
				)}

				{result && (
					<span
						className={`text-xs ${result.ok ? "text-green-300" : "text-red-400"}`}
					>
						{result.ok ? "✓ Sauvegardé" : `✗ ${result.error}`}
					</span>
				)}

				<div className="flex flex-wrap items-center gap-2 pt-2">
					<button
						type="button"
						onClick={save}
						disabled={pending}
						className="dbz-button !text-xs disabled:opacity-40"
					>
						{pending ? "…" : "Sauvegarder"}
					</button>
					<button
						type="button"
						onClick={doPreview}
						disabled={pending}
						className="dbz-button-ghost !text-xs disabled:opacity-40"
					>
						👁 Preview
					</button>
					<button
						type="button"
						onClick={reset}
						disabled={pending}
						className="dbz-button-ghost !text-xs text-red-300 border-red-400/40 disabled:opacity-40"
					>
						↺ Reset au défaut
					</button>
				</div>
			</div>
		</div>
	);
}
