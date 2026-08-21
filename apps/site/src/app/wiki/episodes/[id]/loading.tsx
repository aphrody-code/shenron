/**
 * Squelette de FICHE (et non de catalogue) : sans lui, `[id]` héritait du
 * `loading.tsx` de la rubrique, qui dessine un billboard et des rails — une
 * structure qui n'a rien à voir avec la page qui va s'afficher, donc un saut
 * visuel à chaque ouverture non prérendue.
 */
export default function Loading() {
	return (
		<div className="mx-auto w-full max-w-[1180px] px-6 py-12 lg:px-10 lg:py-16">
			<div className="h-3 w-64 animate-pulse rounded bg-white/10" />
			<div className="mt-8 h-10 w-3/4 max-w-2xl animate-pulse rounded bg-white/15" />
			<div className="mt-4 h-4 w-40 animate-pulse rounded bg-white/10" />
			<div className="mt-10 aspect-video w-full animate-pulse rounded-xl bg-dbz-card ring-1 ring-white/[0.06]" />
			<div className="mt-10 space-y-3">
				{Array.from({ length: 5 }).map((_, i) => (
					<div key={i} className="h-3 w-full animate-pulse rounded bg-white/[0.07]" />
				))}
			</div>
		</div>
	);
}
