import { getShenronTechniques } from "@/lib/shenron";
import Link from "next/link";

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
					<div
						key={tech.id}
						className="group flex flex-col rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 transition hover:border-dbz-orange/50"
					>
						<h2 className="text-xl font-bold text-white group-hover:text-dbz-orange transition-colors">
							{tech.name}
						</h2>
						{tech.description && (
							<p className="mt-4 text-sm text-zinc-400 leading-relaxed line-clamp-4">
								{tech.description}
							</p>
						)}
					</div>
				))}
			</div>
		</div>
	);
}
