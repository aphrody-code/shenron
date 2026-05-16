"use client";

import { useState, useTransition } from "react";
import { createWebhook, deleteWebhook, executeWebhook } from "./_actions";

export function WebhookCreateForm() {
	const [pending, start] = useTransition();
	const [r, setR] = useState<{ ok: boolean; error?: string } | null>(null);
	function onSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		const fd = new FormData(e.currentTarget);
		const ch = String(fd.get("channel_id") ?? "").trim();
		const name = String(fd.get("name") ?? "").trim();
		if (!ch || !name)
			return setR({ ok: false, error: "channel + name requis" });
		start(async () => {
			const res = await createWebhook(ch, name);
			setR(res);
			if (res.ok) (e.target as HTMLFormElement).reset();
		});
	}
	return (
		<form onSubmit={onSubmit} className="dbz-panel p-5 space-y-3 mb-4">
			<h3 className="font-saiyan text-xl text-fuchsia-300">+ Créer webhook</h3>
			<div className="grid sm:grid-cols-2 gap-3 text-xs">
				<input
					name="channel_id"
					required
					pattern="\d{17,20}"
					placeholder="Channel ID"
					className="bg-dbz-bg border border-dbz-border focus:border-fuchsia-400 p-2 font-mono"
				/>
				<input
					name="name"
					required
					placeholder="Nom du webhook"
					className="bg-dbz-bg border border-dbz-border focus:border-fuchsia-400 p-2"
				/>
			</div>
			<div className="flex items-center gap-3">
				<button
					type="submit"
					disabled={pending}
					className="dbz-button !text-xs disabled:opacity-40"
				>
					{pending ? "…" : "Créer"}
				</button>
				{r && (
					<span
						className={`text-xs ${r.ok ? "text-green-300" : "text-red-400"}`}
					>
						{r.ok ? "✓ Créé" : `✗ ${r.error}`}
					</span>
				)}
			</div>
		</form>
	);
}

export function WebhookDeleteButton({ id }: { id: string }) {
	const [pending, start] = useTransition();
	return (
		<button
			type="button"
			disabled={pending}
			onClick={() =>
				start(async () => {
					if (!confirm("Supprimer ce webhook ?")) return;
					await deleteWebhook(id);
				})
			}
			className="px-2 py-1 text-[10px] uppercase tracking-widest border border-red-400/50 text-red-300 hover:bg-red-500/10 rounded"
		>
			✗ Suppr
		</button>
	);
}

export function WebhookExecuteModal({ url }: { url: string }) {
	const [open, setOpen] = useState(false);
	const [pending, start] = useTransition();
	const [r, setR] = useState<{ ok: boolean; error?: string } | null>(null);
	function onSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		const fd = new FormData(e.currentTarget);
		const content = String(fd.get("content") ?? "").trim();
		const username = String(fd.get("username") ?? "").trim() || undefined;
		if (!content) return setR({ ok: false, error: "content vide" });
		start(async () => {
			const res = await executeWebhook(url, content, username);
			setR(res);
			if (res.ok) {
				(e.target as HTMLFormElement).reset();
				setTimeout(() => {
					setOpen(false);
					setR(null);
				}, 600);
			}
		});
	}
	if (!open) {
		return (
			<button
				type="button"
				onClick={() => setOpen(true)}
				className="px-2 py-1 text-[10px] uppercase tracking-widest border border-cyan-400/50 text-cyan-300 hover:bg-cyan-500/10 rounded"
			>
				✉ Envoyer
			</button>
		);
	}
	return (
		<div className="fixed inset-0 z-50 bg-black/80 grid place-items-center p-4">
			<form
				onSubmit={onSubmit}
				className="dbz-panel p-6 max-w-lg w-full space-y-3"
			>
				<div className="flex justify-between items-center">
					<h3 className="font-saiyan text-xl text-fuchsia-300">
						Envoyer via webhook
					</h3>
					<button
						type="button"
						onClick={() => setOpen(false)}
						className="text-white/40 hover:text-white"
					>
						✗
					</button>
				</div>
				<input
					name="username"
					placeholder="Username override (optionnel)"
					className="w-full bg-dbz-bg border border-dbz-border p-2 text-xs"
				/>
				<textarea
					name="content"
					required
					rows={5}
					maxLength={2000}
					placeholder="Message (markdown Discord)"
					className="w-full bg-dbz-bg border border-dbz-border p-2 text-xs resize-y"
				/>
				<div className="flex items-center gap-3">
					<button
						type="submit"
						disabled={pending}
						className="dbz-button !text-xs disabled:opacity-40"
					>
						{pending ? "Envoi…" : "Envoyer"}
					</button>
					{r && (
						<span
							className={`text-xs ${r.ok ? "text-green-300" : "text-red-400"}`}
						>
							{r.ok ? "✓ Envoyé" : `✗ ${r.error}`}
						</span>
					)}
				</div>
			</form>
		</div>
	);
}
