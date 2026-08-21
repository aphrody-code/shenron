"use client";

/**
 * Bouton flottant « Signaler une erreur » présent sur toutes les pages publiques
 * (îlot client → n'introduit aucune session côté serveur, cache préservé). Ouvre
 * une modale de signalement réservée aux membres **connectés** (compte Discord
 * lié) ; un anonyme est invité à se connecter. Chaque envoi crée un ticket
 * (`POST /api/reports`) visible dans /admin/signalements.
 *
 * Masqué sur le back-office (/admin) : l'équipe n'a pas à se signaler à elle-même.
 */
import { CheckCircle2, Flag, Loader2, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { SignInDiscord } from "@/components/SignInDiscord";
import { REPORT_CATEGORIES, REPORT_MESSAGE_MAX } from "@/lib/report-types";
import { useMe } from "@/lib/use-me";

type Phase = "idle" | "sending" | "done" | "error";

export function ReportButton() {
	const pathname = usePathname();
	const me = useMe();
	const [open, setOpen] = useState(false);
	const [category, setCategory] = useState<string>(REPORT_CATEGORIES[0].key);
	const [message, setMessage] = useState("");
	const [phase, setPhase] = useState<Phase>("idle");
	const [err, setErr] = useState<string | null>(null);

	// Fermeture au clavier (Échap).
	useEffect(() => {
		if (!open) return;
		const onKey = (e: KeyboardEvent) => {
			if (e.key === "Escape") setOpen(false);
		};
		document.addEventListener("keydown", onKey);
		return () => document.removeEventListener("keydown", onKey);
	}, [open]);

	// Ne s'affiche pas dans le back-office admin.
	if (pathname?.startsWith("/admin")) return null;

	async function submit() {
		if (phase === "sending") return;
		if (message.trim().length < 5) {
			setErr("Décris un peu plus le problème (5 caractères min).");
			return;
		}
		setPhase("sending");
		setErr(null);
		try {
			const res = await fetch("/api/reports", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				credentials: "same-origin",
				body: JSON.stringify({
					path: pathname ?? (typeof window !== "undefined" ? window.location.pathname : "/"),
					pageTitle: typeof document !== "undefined" ? document.title : null,
					category,
					message: message.trim(),
				}),
			});
			if (res.status === 401) {
				setPhase("error");
				setErr("Connecte-toi avec Discord pour envoyer un signalement.");
				return;
			}
			if (res.status === 429) {
				setPhase("error");
				setErr("Trop de signalements d'affilée. Réessaie dans quelques minutes.");
				return;
			}
			if (!res.ok) throw new Error(`HTTP ${res.status}`);
			setPhase("done");
			setMessage("");
			setTimeout(() => {
				setOpen(false);
				setPhase("idle");
			}, 1800);
		} catch {
			setPhase("error");
			setErr("Échec de l'envoi. Réessaie dans un instant.");
		}
	}

	return (
		<>
			{/* Bouton flottant */}
			<button
				type="button"
				onClick={() => {
					setOpen(true);
					setPhase("idle");
					setErr(null);
				}}
				aria-label="Signaler une erreur"
				className="fab-secondary fixed bottom-20 left-4 z-40 inline-flex items-center gap-2 rounded-full border border-dbz-orange/40 bg-[rgba(10,10,10,0.85)] px-4 py-2.5 text-[13px] font-display font-semibold text-dbz-orange shadow-lg backdrop-blur-md transition-all hover:bg-dbz-orange hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dbz-orange/60 md:bottom-24 md:left-6"
			>
				<Flag className="h-4 w-4" />
				<span className="hidden sm:inline">Signaler une erreur</span>
			</button>

			{open && (
				<div
					role="dialog"
					aria-modal="true"
					aria-label="Signaler une erreur"
					className="fixed inset-0 z-[60] flex items-end justify-center bg-black/60 p-4 backdrop-blur-sm sm:items-center"
					onMouseDown={(e) => {
						if (e.target === e.currentTarget) setOpen(false);
					}}
				>
					<div className="w-full max-w-md overflow-hidden rounded-xl border border-dbz-orange/25 bg-dbz-card shadow-2xl">
						{/* En-tête */}
						<div className="flex items-center justify-between border-b border-white/10 px-5 py-3.5">
							<h2 className="flex items-center gap-2 font-saiyan text-lg uppercase tracking-widest text-dbz-orange">
								<Flag className="h-4 w-4" /> Signaler une erreur
							</h2>
							<button
								type="button"
								onClick={() => setOpen(false)}
								aria-label="Fermer"
								className="rounded-full p-1.5 text-white/50 transition-colors hover:bg-white/10 hover:text-white"
							>
								<X className="h-4 w-4" />
							</button>
						</div>

						<div className="space-y-4 p-5">
							{phase === "done" ? (
								<div className="flex flex-col items-center gap-3 py-6 text-center">
									<CheckCircle2 className="h-10 w-10 text-green-400" />
									<p className="font-display text-base font-semibold text-white">
										Merci, c&apos;est envoyé !
									</p>
									<p className="text-sm text-white/50">
										L&apos;équipe verra ton signalement dans son tableau de bord.
									</p>
								</div>
							) : me && !me.authenticated ? (
								// Anonyme → invitation à se connecter.
								<div className="space-y-4 py-2 text-center">
									<p className="text-sm text-white/70">
										Connecte-toi avec Discord pour nous envoyer un signalement (on pourra te
										répondre et te tenir au courant).
									</p>
									<SignInDiscord className="inline-flex h-11 items-center justify-center rounded-full bg-dbz-orange px-6 font-display font-bold text-black transition-colors hover:bg-white">
										Se connecter avec Discord
									</SignInDiscord>
								</div>
							) : (
								<>
									<p className="text-xs text-white/50">
										Page concernée : <span className="font-mono text-white/70">{pathname}</span>
									</p>

									<div>
										<label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-dbz-blue-light">
											Type de problème
										</label>
										<select
											className="input w-full text-sm"
											value={category}
											onChange={(e) => setCategory(e.target.value)}
										>
											{REPORT_CATEGORIES.map((c) => (
												<option key={c.key} value={c.key}>
													{c.label}
												</option>
											))}
										</select>
									</div>

									<div>
										<label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-dbz-blue-light">
											Décris le problème
										</label>
										<textarea
											className="input min-h-[110px] w-full resize-y text-sm"
											placeholder="Ex : l'image de Goku ne se charge pas, le lien vers la saga X est cassé, une info est fausse…"
											maxLength={REPORT_MESSAGE_MAX}
											value={message}
											onChange={(e) => setMessage(e.target.value)}
										/>
										<p className="mt-1 text-right text-[10px] text-white/50">
											{message.length}/{REPORT_MESSAGE_MAX}
										</p>
									</div>

									{err && <p className="text-sm text-dbz-red">{err}</p>}

									<button
										type="button"
										onClick={submit}
										disabled={phase === "sending"}
										className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-dbz-orange px-5 py-3 font-display font-bold text-black transition-colors hover:bg-white disabled:opacity-60"
									>
										{phase === "sending" ? (
											<>
												<Loader2 className="h-4 w-4 animate-spin" /> Envoi…
											</>
										) : (
											"Envoyer le signalement"
										)}
									</button>
								</>
							)}
						</div>
					</div>
				</div>
			)}
		</>
	);
}
