"use client";

import { useRef, useState, useTransition } from "react";
import { postCommentAction } from "./actions";

export function CommentForm({ slug }: { slug: string }) {
	const [error, setError] = useState<string | null>(null);
	const [pending, startTransition] = useTransition();
	const formRef = useRef<HTMLFormElement>(null);

	function submit(formData: FormData) {
		setError(null);
		startTransition(async () => {
			const res = await postCommentAction(slug, formData);
			if (!res.ok) {
				setError(res.error ?? "Erreur");
				return;
			}
			formRef.current?.reset();
		});
	}

	return (
		<form ref={formRef} action={submit} className="space-y-3">
			<textarea
				name="body"
				required
				maxLength={2000}
				rows={4}
				placeholder="Ton commentaire…"
				aria-label="Votre commentaire"
				className="w-full bg-dbz-bg/60 border border-dbz-border focus:border-dbz-orange outline-none rounded-lg p-4 text-white placeholder:text-white/50 transition-colors resize-y"
				disabled={pending}
			/>
			<div className="flex items-center justify-between gap-3">
				<div aria-live="polite">
					{error ? (
						<span role="alert" className="text-xs text-red-400">
							<span aria-hidden="true">✗</span> {error}
						</span>
					) : (
						<span className="text-xs text-white/50">Texte simple — sauts de ligne conservés</span>
					)}
				</div>
				<button
					type="submit"
					disabled={pending}
					className="dbz-button !text-xs disabled:opacity-40 disabled:cursor-not-allowed"
				>
					{pending ? "Envoi…" : "Publier"}
				</button>
			</div>
		</form>
	);
}
