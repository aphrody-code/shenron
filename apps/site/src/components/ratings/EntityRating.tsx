/**
 * Panneau de notation 1–5 étoiles pour une fiche wiki (jeu, épisode, film, arc).
 *
 * - Lecture publique : moyenne + nombre de notes + commentaires.
 * - Écriture : membres connectés avec Discord lié (Better Auth).
 * - Commentaire optionnel ; suppression auteur ou admin.
 *
 * Îlot client → pages parentes restent ISR/cacheables.
 */
"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { Loader2, Trash2 } from "lucide-react";
import { useMe } from "@/lib/use-me";
import { RatingBadge, Stars } from "./Stars";

/** Aligné sur `RATING_TARGET_TYPES` (schema) — union locale pour rester client-safe. */
export type RatingTargetType = "game" | "episode" | "movie" | "arc";

type CommentRow = {
	id: string;
	score: number;
	comment: string;
	createdAt: string;
	updatedAt: string;
	author: {
		id: string;
		username: string;
		avatar: string | null;
		discordId: string;
	};
};

type Mine = {
	id: string;
	score: number;
	comment: string | null;
	createdAt: string;
	updatedAt: string;
} | null;

type State = {
	summary: { average: number; count: number };
	mine: Mine;
	comments: CommentRow[];
};

type Props = {
	targetType: RatingTargetType;
	targetId: string | number;
	/** Chemin pour le callback après login Discord. */
	signinCallback: string;
	/** Titre court pour l'UI (ex. « ce jeu »). */
	label?: string;
	className?: string;
};

const COMMENT_MAX = 800;

export function EntityRating({
	targetType,
	targetId,
	signinCallback,
	label = "cette fiche",
	className = "",
}: Props) {
	const me = useMe();
	const id = String(targetId);
	const [state, setState] = useState<State | null>(null);
	const [loadErr, setLoadErr] = useState<string | null>(null);
	const [hover, setHover] = useState<number | null>(null);
	const [draftScore, setDraftScore] = useState<number>(0);
	const [draftComment, setDraftComment] = useState("");
	const [saving, setSaving] = useState(false);
	const [saveErr, setSaveErr] = useState<string | null>(null);
	const [saveOk, setSaveOk] = useState(false);
	const [deletingId, setDeletingId] = useState<string | null>(null);

	const applyState = useCallback((s: State) => {
		setState(s);
		setDraftScore(s.mine?.score ?? 0);
		setDraftComment(s.mine?.comment ?? "");
	}, []);

	const load = useCallback(async () => {
		setLoadErr(null);
		try {
			const res = await fetch(
				`/api/ratings?type=${encodeURIComponent(targetType)}&id=${encodeURIComponent(id)}`,
				{ credentials: "include" }
			);
			if (!res.ok) throw new Error(`HTTP ${res.status}`);
			const data = (await res.json()) as State & { ok?: boolean };
			applyState({
				summary: data.summary ?? { average: 0, count: 0 },
				mine: data.mine ?? null,
				comments: data.comments ?? [],
			});
		} catch {
			setLoadErr("Impossible de charger les notes.");
		}
	}, [targetType, id, applyState]);

	useEffect(() => {
		void load();
	}, [load]);

	async function submit(score: number, comment: string) {
		if (saving) return;
		if (score < 1 || score > 5) {
			setSaveErr("Choisis une note entre 1 et 5 étoiles.");
			return;
		}
		setSaving(true);
		setSaveErr(null);
		setSaveOk(false);
		try {
			const res = await fetch("/api/ratings", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				credentials: "include",
				body: JSON.stringify({
					type: targetType,
					id,
					score,
					comment: comment.trim() || null,
				}),
			});
			if (res.status === 401) {
				setSaveErr("Connecte-toi avec Discord pour noter.");
				return;
			}
			if (res.status === 429) {
				setSaveErr("Trop de notes d'affilée. Réessaie dans un moment.");
				return;
			}
			if (!res.ok) {
				const body = (await res.json().catch(() => null)) as { error?: string } | null;
				setSaveErr(body?.error === "comment_too_long" ? "Commentaire trop long." : "Échec de l'envoi.");
				return;
			}
			const data = (await res.json()) as State;
			applyState({
				summary: data.summary,
				mine: data.mine,
				comments: data.comments,
			});
			setSaveOk(true);
			window.setTimeout(() => setSaveOk(false), 2000);
		} catch {
			setSaveErr("Erreur réseau.");
		} finally {
			setSaving(false);
		}
	}

	async function remove(ratingId: string, mode: "full" | "comment" = "full") {
		if (deletingId) return;
		setDeletingId(ratingId);
		setSaveErr(null);
		try {
			const res = await fetch(`/api/ratings/${ratingId}`, {
				method: "DELETE",
				headers: { "Content-Type": "application/json" },
				credentials: "include",
				body: JSON.stringify({ mode }),
			});
			if (!res.ok) {
				setSaveErr("Suppression impossible.");
				return;
			}
			const data = (await res.json()) as State;
			if (data.summary) {
				applyState({
					summary: data.summary,
					mine: data.mine ?? null,
					comments: data.comments ?? [],
				});
			} else {
				await load();
			}
		} catch {
			setSaveErr("Erreur réseau.");
		} finally {
			setDeletingId(null);
		}
	}

	const summary = state?.summary ?? { average: 0, count: 0 };
	const authReady = me !== undefined;
	const canRate = Boolean(me?.authenticated);

	return (
		<section
			className={`dbz-panel p-6 sm:p-8 relative overflow-hidden ${className}`}
			aria-labelledby={`rating-heading-${targetType}-${id}`}
		>
			<div className="absolute top-0 left-0 w-1 h-full bg-dbz-orange" />

			<div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
				<div>
					<h2
						id={`rating-heading-${targetType}-${id}`}
						className="font-display font-bold text-xl text-dbz-orange mb-2 uppercase tracking-widest"
					>
						Notes de la communauté
					</h2>
					<p className="text-[13px] text-white/55">
						Note {label} sur 5 étoiles. Commentaire facultatif.
					</p>
				</div>
				<div className="flex flex-col items-start sm:items-end gap-1">
					{state ? (
						<>
							<div className="flex items-center gap-3">
								<Stars value={summary.average} size="lg" label="Moyenne" />
								<span className="font-display font-bold text-2xl tabular-nums text-white">
									{summary.count > 0 ? summary.average.toFixed(1) : "—"}
								</span>
							</div>
							<RatingBadge average={summary.average} count={summary.count} />
						</>
					) : loadErr ? (
						<p className="text-[13px] text-red-400">{loadErr}</p>
					) : (
						<div className="h-8 w-32 rounded bg-white/[0.04] animate-pulse" aria-hidden />
					)}
				</div>
			</div>

			{/* Zone de saisie */}
			{!authReady ? (
				<div className="h-[100px] rounded-xl bg-white/[0.02] border border-white/[0.06]" aria-hidden />
			) : canRate ? (
				<div className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-4 sm:p-5 mb-6 space-y-4">
					<div className="flex flex-wrap items-center gap-3">
						<span className="text-[12px] font-display font-semibold tracking-[0.12em] uppercase text-white/50">
							Ta note
						</span>
						<Stars
							value={draftScore}
							size="lg"
							interactive
							hover={hover}
							onHover={setHover}
							onSelect={(n) => {
								setDraftScore(n);
								// Clic étoile = envoi immédiat (score) ; commentaire via bouton.
								void submit(n, draftComment);
							}}
							label="Ta note"
						/>
						{draftScore > 0 && (
							<span className="text-[13px] text-white/70 tabular-nums">
								{draftScore}/5
							</span>
						)}
					</div>

					<div>
						<label
							htmlFor={`rating-comment-${id}`}
							className="block text-[12px] font-display font-semibold tracking-[0.12em] uppercase text-white/50 mb-2"
						>
							Commentaire <span className="normal-case tracking-normal text-white/35">(optionnel)</span>
						</label>
						<textarea
							id={`rating-comment-${id}`}
							value={draftComment}
							onChange={(e) => setDraftComment(e.target.value.slice(0, COMMENT_MAX))}
							rows={3}
							maxLength={COMMENT_MAX}
							placeholder="Un avis court sur le combat final, le roster, le fun…"
							className="w-full rounded-lg bg-black/40 border border-white/10 px-3 py-2.5 text-[14px] text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-dbz-orange/50 resize-y min-h-[72px]"
						/>
						<div className="mt-1 flex justify-between text-[11px] text-white/35">
							<span>{draftComment.length}/{COMMENT_MAX}</span>
							{state?.mine && (
								<button
									type="button"
									className="hover:text-red-400 transition-colors"
									onClick={() => void remove(state.mine!.id, "full")}
									disabled={deletingId === state.mine.id}
								>
									Retirer ma note
								</button>
							)}
						</div>
					</div>

					<div className="flex flex-wrap items-center gap-3">
						<button
							type="button"
							disabled={saving || draftScore < 1}
							onClick={() => void submit(draftScore, draftComment)}
							className="inline-flex items-center h-10 px-5 rounded-full bg-dbz-orange hover:bg-white text-black font-display font-bold text-[12px] tracking-[0.10em] uppercase transition-colors disabled:opacity-40 disabled:pointer-events-none"
						>
							{saving ? (
								<>
									<Loader2 className="h-4 w-4 animate-spin mr-2" />
									Envoi…
								</>
							) : state?.mine ? (
								"Mettre à jour"
							) : (
								"Publier ma note"
							)}
						</button>
						{saveOk && (
							<span className="text-[13px] text-emerald-400">Enregistré !</span>
						)}
						{saveErr && <span className="text-[13px] text-red-400">{saveErr}</span>}
					</div>
				</div>
			) : (
				<div className="mb-6 p-5 rounded-xl bg-dbz-orange/10 border border-dbz-orange/30 flex flex-wrap items-center justify-between gap-4">
					<p className="text-[14px] text-white/85">
						Connecte-toi avec Discord pour noter {label}.
					</p>
					<Link
						href={`/signin?callbackURL=${encodeURIComponent(signinCallback)}`}
						className="inline-flex items-center h-10 px-5 rounded-full bg-dbz-orange hover:bg-white text-black font-display font-bold text-[12px] tracking-[0.10em] uppercase transition-colors whitespace-nowrap"
					>
						Connexion Discord
					</Link>
				</div>
			)}

			{/* Liste des commentaires */}
			{state && state.comments.length > 0 && (
				<div className="space-y-3">
					<h3 className="font-display font-semibold text-[12px] tracking-[0.16em] uppercase text-white/45">
						Avis ({state.comments.length})
					</h3>
					<ul className="space-y-3">
						{state.comments.map((c) => {
							const canDelete =
								me?.isAdmin ||
								(me?.authenticated && state.mine?.id === c.id);
							return (
								<li
									key={c.id}
									className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-4"
								>
									<div className="flex items-start justify-between gap-3 mb-2">
										<div className="flex items-center gap-3 min-w-0">
											{c.author.avatar ? (
												// eslint-disable-next-line @next/next/no-img-element
												<img
													src={c.author.avatar}
													alt=""
													className="h-8 w-8 rounded-full object-cover shrink-0"
												/>
											) : (
												<div className="h-8 w-8 rounded-full bg-white/10 shrink-0" />
											)}
											<div className="min-w-0">
												<p className="text-[13px] font-display font-semibold text-white truncate">
													{c.author.username}
												</p>
												<div className="flex items-center gap-2">
													<Stars value={c.score} size="sm" />
													<span className="text-[11px] text-white/40">
														{formatDate(c.updatedAt)}
													</span>
												</div>
											</div>
										</div>
										{canDelete && (
											<button
												type="button"
												title={me?.isAdmin ? "Supprimer la note (admin)" : "Supprimer mon avis"}
												onClick={() => void remove(c.id, "full")}
												disabled={deletingId === c.id}
												className="p-1.5 rounded-md text-white/40 hover:text-red-400 hover:bg-white/5 transition-colors disabled:opacity-40"
											>
												{deletingId === c.id ? (
													<Loader2 className="h-4 w-4 animate-spin" />
												) : (
													<Trash2 className="h-4 w-4" />
												)}
											</button>
										)}
									</div>
									<p className="text-[14px] text-white/80 leading-relaxed whitespace-pre-wrap">
										{c.comment}
									</p>
								</li>
							);
						})}
					</ul>
				</div>
			)}

			{state && state.comments.length === 0 && summary.count > 0 && (
				<p className="text-[13px] text-white/40">
					Des notes sans commentaire pour l&apos;instant — sois le premier à laisser un avis !
				</p>
			)}
		</section>
	);
}

/** Résumé agrégé en lecture seule (ex. moyenne d'une saga = arcs). */
export function AggregateRatingBanner({
	average,
	count,
	subtitle,
	className = "",
}: {
	average: number;
	count: number;
	subtitle?: string;
	className?: string;
}) {
	return (
		<div
			className={`inline-flex flex-wrap items-center gap-3 rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 ${className}`}
		>
			<Stars value={average} size="md" label="Moyenne" />
			<div>
				<p className="font-display font-bold text-lg tabular-nums text-white leading-none">
					{count > 0 ? average.toFixed(1) : "—"}
					<span className="text-white/40 text-sm font-normal"> / 5</span>
				</p>
				<p className="text-[11px] text-white/45 mt-0.5">
					{subtitle ??
						(count > 0
							? `${count} note${count > 1 ? "s" : ""} sur les arcs`
							: "Aucune note sur les arcs")}
				</p>
			</div>
		</div>
	);
}

function formatDate(iso: string): string {
	try {
		return new Date(iso).toLocaleDateString("fr-FR", {
			day: "numeric",
			month: "short",
			year: "numeric",
		});
	} catch {
		return "";
	}
}
