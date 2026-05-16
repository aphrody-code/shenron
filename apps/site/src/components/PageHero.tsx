import Image from "next/image";
import type { ReactNode } from "react";

/**
 * Hero d'en-tête de page (Sagas/Films/Jeux/Episodes/News).
 * Image officielle DB en cover + overlay sombre + contenu superposé.
 */
export function PageHero({
	eyebrow,
	title,
	lead,
	image,
	imageAlt,
	right,
	height = "md",
}: {
	eyebrow: string;
	title: string;
	lead?: string;
	image: string;
	imageAlt: string;
	right?: ReactNode;
	height?: "sm" | "md" | "lg";
}) {
	const h =
		height === "sm" ? "h-[280px]" : height === "lg" ? "h-[480px]" : "h-[380px]";
	return (
		<section
			className={`relative ${h} w-full overflow-hidden border-b border-white/[0.08]`}
		>
			<Image
				src={image}
				alt={imageAlt}
				fill
				priority
				sizes="100vw"
				className="object-cover object-center"
			/>
			<div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/30" />
			<div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-black/50" />

			<div className="relative h-full mx-auto max-w-[1280px] px-6 lg:px-10 flex items-end pb-12">
				<div className="flex-1 max-w-2xl">
					<p className="font-display font-semibold text-[12px] tracking-[0.18em] uppercase text-dbz-orange mb-3">
						{eyebrow}
					</p>
					<h1 className="font-display font-bold text-[40px] md:text-[56px] leading-[1.05] tracking-[-0.01em] text-white mb-4">
						{title}
					</h1>
					{lead && (
						<p className="text-[17px] leading-relaxed text-white/85 max-w-xl">
							{lead}
						</p>
					)}
				</div>
				{right && <div className="shrink-0 ml-6 hidden md:block">{right}</div>}
			</div>

			<div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-dbz-orange/40 to-transparent" />
		</section>
	);
}
