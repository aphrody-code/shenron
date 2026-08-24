"use client";

import { useRef, useState, useTransition } from "react";
import { postCommentAction } from "./actions";
import { PlainField } from "@/components/editor/PlainField";

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
			<PlainField
				name="body"
				label="Votre commentaire"
				hideLabel
				required
				maxLength={2000}
				minRows={4}
				maxRows={14}
				placeholder="Ton commentaire…"
				disabled={pending}
				onSubmit={() => formRef.current?.requestSubmit()}
				// Un commentaire à moitié écrit survit à un rechargement ou à un
				// changement de page : c'est du texte qu'on ne réécrit jamais deux fois.
				draftKey={`comment:${slug}`}
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
