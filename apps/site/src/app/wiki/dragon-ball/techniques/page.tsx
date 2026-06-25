import { getShenronTechniques } from "@/lib/shenron";
import { assetUrl } from "@/lib/db-universe";
import Link from "next/link";
import Image from "next/image";
import { PageHero } from "@/components/PageHero";
import { SAGAS_HERO } from "@/lib/db-banners";
import type { Metadata } from "next";

export const revalidate = 3600;

export const metadata: Metadata = {
	title: "Techniques Dragon Ball — DBFR",
	description:
		"Catalogue des techniques et capacités de l'univers Dragon Ball : Kamehameha, Genkidama, Final Flash et plus.",
	alternates: { canonical: "/wiki/dragon-ball/techniques" },
};

export default async function TechniquesPage() {
	const techniques = await getShenronTechniques();

	// Grouper par type
	const byType = techniques.reduce<Record<string, typeof techniques>>((acc, t) => {
		const key = t.type ?? "Autre";
		if (!acc[key]) acc[key] = [];
		acc[key].push(t);
		return acc;
	}, {});
	const typeOrder = Object.keys(byType).sort((a, b) =>
		a === "Autre" ? 1 : b === "Autre" ? -1 : a.localeCompare(b)
	);

	return (
		<div className="reveal-up">
			<PageHero
				eyebrow="Encyclopédie"
				title="Techniques & Capacités"
				lead={`${techniques.length} techniques répertoriées — Kamehameha, Genkidama, Final Flash et les attaques les plus dévastatrices de l'univers Dragon Ball.`}
				image={SAGAS_HERO}
				imageAlt="Techniques Dragon Ball"
			/>

			<div className="mx-auto max-w-[1400px] px-6 lg:px-10 py-16 lg:py-24 space-y-20">
				<div className="flex items-center gap-4 mb-2">
					<Link
						href="/wiki/dragon-ball"
						className="inline-flex items-center gap-2 text-dbz-orange hover:text-white transition-colors font-bold uppercase text-xs tracking-widest link-underline"
					>
						<span>← Encyclopédie</span>
					</Link>
					<div className="h-px flex-1 bg-dbz-border" />
					<span className="scouter-text text-dbz-orange text-xs">
						{techniques.length} TECHNIQUES
					</span>
				</div>

				{typeOrder.map((type) => (
					<section key={type} className="reveal-up">
						<div className="flex items-center gap-6 mb-8">
							<h2 className="font-saiyan text-3xl text-dbz-blue-light uppercase tracking-widest">
								{type}
							</h2>
							<div className="h-px flex-1 bg-gradient-to-r from-dbz-blue-light/40 to-transparent" />
							<span className="text-[10px] font-bold text-white/30 uppercase tracking-widest">
								{byType[type].length}
							</span>
						</div>

						<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
							{byType[type].map((tech) => (
								<Link
									key={tech.id}
									href={`/wiki/dragon-ball/techniques/${tech.slug}`}
									className="group dbz-panel p-5 flex gap-4 hover:border-dbz-blue-light transition-all"
								>
									{tech.creatorImage ? (
										<div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-white/10 bg-black">
											<Image
												src={assetUrl(tech.creatorImage)}
												alt={tech.creatorName ?? tech.name}
												fill
												sizes="64px"
												className="object-cover object-top group-hover:scale-110 transition-transform duration-500"
											/>
										</div>
									) : (
										<div className="h-16 w-16 shrink-0 flex items-center justify-center bg-dbz-bg border border-dbz-border rounded-lg">
											<span className="text-dbz-blue-light/30 font-saiyan text-xs">KI</span>
										</div>
									)}
									<div className="min-w-0 flex-1">
										<h3 className="font-display font-bold text-[16px] text-white group-hover:text-dbz-blue-light transition-colors leading-snug">
											{tech.name}
										</h3>
										{tech.creatorName && (
											<p className="mt-0.5 text-[10px] font-bold uppercase tracking-widest text-dbz-orange/70">
												{tech.creatorName}
											</p>
										)}
										{tech.description && (
											<p className="mt-2 text-xs text-gray-400 leading-relaxed line-clamp-2 font-sans">
												{tech.description}
											</p>
										)}
									</div>
								</Link>
							))}
						</div>
					</section>
				))}
			</div>
		</div>
	);
}
