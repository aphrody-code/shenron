"use client";

import { useState, useTransition } from "react";

const PERSONAS = [
	{ id: "shenron", label: "Shenron" },
	{ id: "beerus", label: "Beerus" },
	{ id: "whis", label: "Whis" },
	{ id: "grandPretre", label: "Grand Prêtre" },
	{ id: "enma", label: "Enma" },
	{ id: "kaio", label: "Kaïo" },
] as const;

type Result =
	| { ok: true; messageId: string; url: string }
	| { ok: false; error: string }
	| null;

export function SendDiscordForm() {
	const [channelId, setChannelId] = useState("");
	const [content, setContent] = useState("");
	const [persona, setPersona] =
		useState<(typeof PERSONAS)[number]["id"]>("shenron");
	const [result, setResult] = useState<Result>(null);
	const [pending, startTransition] = useTransition();

	function submit(e: React.FormEvent) {
		e.preventDefault();
		setResult(null);
		startTransition(async () => {
			try {
				const res = await fetch("/api/bot-admin/discord/send", {
					method: "POST",
					headers: { "content-type": "application/json" },
					body: JSON.stringify({ channelId, content, persona }),
				});
				const data = await res.json();
				if (res.ok && data.ok) {
					setResult({ ok: true, messageId: data.messageId, url: data.url });
					setContent("");
				} else {
					setResult({ ok: false, error: data.error ?? `HTTP ${res.status}` });
				}
			} catch (err) {
				setResult({
					ok: false,
					error: err instanceof Error ? err.message : "erreur réseau",
				});
			}
		});
	}

	return (
		<form onSubmit={submit} className="dbz-panel p-6 space-y-5">
			<label className="block">
				<span className="font-saiyan uppercase tracking-widest text-sm text-dbz-yellow">
					Persona
				</span>
				<select
					value={persona}
					onChange={(e) => setPersona(e.target.value as typeof persona)}
					className="mt-2 w-full bg-dbz-bg border-2 border-dbz-border focus:border-dbz-orange p-2 font-mono"
					disabled={pending}
				>
					{PERSONAS.map((p) => (
						<option key={p.id} value={p.id}>
							{p.label}
						</option>
					))}
				</select>
			</label>

			<label className="block">
				<span className="font-saiyan uppercase tracking-widest text-sm text-dbz-yellow">
					Channel ID
				</span>
				<input
					type="text"
					value={channelId}
					onChange={(e) => setChannelId(e.target.value)}
					placeholder="1234567890123456789"
					required
					pattern="\d{17,20}"
					className="mt-2 w-full bg-dbz-bg border-2 border-dbz-border focus:border-dbz-orange p-2 font-mono"
					disabled={pending}
				/>
			</label>

			<label className="block">
				<span className="font-saiyan uppercase tracking-widest text-sm text-dbz-yellow">
					Contenu
				</span>
				<textarea
					value={content}
					onChange={(e) => setContent(e.target.value)}
					required
					maxLength={2000}
					rows={6}
					placeholder="Markdown Discord supporté…"
					className="mt-2 w-full bg-dbz-bg border-2 border-dbz-border focus:border-dbz-orange p-2 font-mono"
					disabled={pending}
				/>
				<span className="text-[10px] font-scouter tracking-widest text-dbz-blue-light/60 mt-1 block">
					{content.length} / 2000
				</span>
			</label>

			<div className="flex items-center gap-4 pt-2">
				<button
					type="submit"
					disabled={pending || !channelId || !content}
					className="dbz-button disabled:opacity-40 disabled:cursor-not-allowed"
				>
					{pending ? "ENVOI…" : "ENVOYER"}
				</button>
				{result?.ok && (
					<a
						href={result.url}
						target="_blank"
						rel="noreferrer"
						className="font-scouter text-xs tracking-widest text-dbz-yellow hover:text-dbz-orange underline"
					>
						OK // {result.messageId} ↗
					</a>
				)}
				{result && !result.ok && (
					<span className="font-scouter text-xs tracking-widest text-red-400">
						✗ {result.error}
					</span>
				)}
			</div>
		</form>
	);
}
