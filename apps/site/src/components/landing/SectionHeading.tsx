import type { ReactNode } from "react";

/**
 * Couple eyebrow + titre des sections landing.
 * Factorise les classes dupliquées entre UniverseGrid / CharactersTeaser /
 * BlogTeaser / PersonasShowcase. Le wrapper de section reste propre à chacun.
 */
export function SectionHeading({
	eyebrow,
	title,
	className = "",
}: {
	eyebrow: string;
	title: ReactNode;
	className?: string;
}) {
	return (
		<>
			<p className="font-display font-semibold text-[12px] tracking-[0.18em] uppercase text-dbz-orange mb-4">
				{eyebrow}
			</p>
			<h2
				className={`reveal-up font-display font-bold text-[40px] md:text-[56px] leading-[1.05] tracking-[-0.01em] text-white${className ? ` ${className}` : ""}`}
			>
				{title}
			</h2>
		</>
	);
}
