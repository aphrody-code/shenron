import { getShenronTechniques } from "@/lib/shenron";
import { assetUrl } from "@/lib/db-universe";
import Link from "next/link";
import Image from "next/image";

export default async function TechniquesPage() {
	const techniques = await getShenronTechniques();

	return (
		<div className="container mx-auto px-4 py-12">
			<div className="mb-12 flex items-center justify-between">
				<div>
					<h1 className="text-4xl font-bold text-dbz-orange uppercase tracking-widest font-saiyan">
						Techniques & Capacités
					</h1>
					<p className="mt-2 text-zinc-400">
						Le catalogue des attaques dévastatrices de l'univers Dragon Ball.
					</p>
				</div>
				<Link
					href="/wiki/dragon-ball"
					className="rounded-lg bg-zinc-800 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-700"
				>
					Retour au Wiki
				</Link>
			</div>

			<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
				{techniques.map((tech) => (
					<Link
						key={tech.id}
						href={`/wiki/dragon-ball/techniques/${tech.slug}`}
						className="group flex gap-4 rounded-xl border border-zinc-800 bg-zinc-900/50 p-5 transition hover:border-dbz-orange/50"
					>
						{tech.creatorImage && (
							<div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg border border-white/10 bg-black">
								<Image
									src={assetUrl(tech.creatorImage)}
									alt={tech.creatorName ?? tech.name}
									fill
									sizes="80px"
									className="object-cover object-top"
								/>
							</div>
						)}
						<div className="min-w-0 flex-1">
							<h2 className="text-xl font-bold text-white group-hover:text-dbz-orange transition-colors">
								{tech.name}
							</h2>
							{tech.creatorName && (
								<p className="mt-0.5 text-[11px] font-semibold uppercase tracking-widest text-dbz-orange/70">
									{tech.creatorName}
								</p>
							)}
							{tech.description && (
								<p className="mt-3 text-sm text-zinc-400 leading-relaxed line-clamp-3">
									{tech.description}
								</p>
							)}
						</div>
					</Link>
				))}
			</div>
		</div>
	);
}
