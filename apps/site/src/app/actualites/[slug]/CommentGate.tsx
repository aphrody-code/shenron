"use client";

import Link from "next/link";
import { useMe } from "@/lib/use-me";
import { CommentForm } from "./CommentForm";

/**
 * Îlot client du bloc commentaire : décide entre le formulaire (membre connecté)
 * et le CTA de connexion via `/api/me`, sans lire cookies/headers côté serveur.
 * Garde la page /actualites/[slug] statique/ISR cacheable (cf. règle latence CLAUDE.md).
 */
export function CommentGate({ slug }: { slug: string }) {
	const me = useMe();

	// Placeholder neutre tant que /api/me n'a pas répondu (anti-CLS).
	if (me === undefined) {
		return (
			<div
				className="h-[120px] rounded-xl bg-white/[0.02] border border-white/[0.06]"
				aria-hidden
			/>
		);
	}

	if (me.authenticated) {
		return <CommentForm slug={slug} />;
	}

	return (
		<div className="p-6 rounded-xl bg-dbz-orange/10 border border-dbz-orange/30 flex flex-wrap items-center justify-between gap-4">
			<p className="text-[15px] text-white/85">
				Connecte-toi avec Discord pour commenter cet article.
			</p>
			<Link
				href={`/signin?callbackURL=/actualites/${slug}`}
				className="inline-flex items-center h-10 px-5 rounded-full bg-dbz-orange hover:bg-white text-black font-display font-bold text-[12px] tracking-[0.10em] uppercase transition-colors whitespace-nowrap"
			>
				Connexion
			</Link>
		</div>
	);
}
