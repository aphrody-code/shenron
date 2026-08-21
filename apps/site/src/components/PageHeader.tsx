import type { ReactNode } from "react";

/**
 * En-tête de page interne (centré, style Saiyan néon).
 * Factorise le header dupliqué sur jeux / shop / leaderboard / commands /
 * stats / canvas / personas et les pages de jeu (`size="md"`).
 */
export function PageHeader({
	title,
	subtitle,
	size = "lg",
	className = "mb-12",
}: {
	title: string;
	subtitle?: ReactNode;
	size?: "md" | "lg";
	className?: string;
}) {
	return (
		<header className={`text-center ${className}`}>
			<h1
				className={`text-dbz-yellow ${size === "lg" ? "text-5xl md:text-7xl mb-4" : "text-5xl mb-2"}`}
				style={{
					textShadow:
						"4px 4px 0px color-mix(in srgb, var(--color-dbz-ember) 60%, transparent), 0 0 24px color-mix(in srgb, var(--color-dbz-ki) 30%, transparent)",
				}}
			>
				{title}
			</h1>
			{subtitle &&
				(size === "lg" ? (
					<p className="text-dbz-blue-light font-bold tracking-widest uppercase max-w-3xl mx-auto">
						{subtitle}
					</p>
				) : (
					<p className="font-scouter text-xs tracking-[0.3em] text-dbz-blue-light">{subtitle}</p>
				))}
		</header>
	);
}
