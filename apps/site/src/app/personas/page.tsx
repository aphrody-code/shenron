import { getShenronPersonas } from "@/lib/shenron";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";

export const dynamic = "force-dynamic";
export const revalidate = 30;

const PERSONA_BIOS: Record<string, { tagline: string; role: string }> = {
	shenron: {
		tagline: "Le Dragon Légendaire",
		role: "Exauce les vœux et veille sur le serveur. Maître absolu des lieux.",
	},
	beerus: {
		tagline: "Le Dieu de la Destruction",
		role: "Maintient l'ordre. Sanctionne avec sagesse et puissance.",
	},
	whis: {
		tagline: "L'Ange Précepteur",
		role: "Aide, conseille et accompagne les nouveaux venus.",
	},
	grandPretre: {
		tagline: "Le Grand Prêtre Cosmique",
		role: "Observe et chronique tout ce qui se passe sur le serveur.",
	},
	enma: {
		tagline: "Le Juge des Enfers",
		role: "Préside le tribunal et applique les sanctions des contrevenants.",
	},
	kaio: {
		tagline: "Le Maître du Nord",
		role: "Anime les jeux, distribue les zénis et fait grimper le Power Level.",
	},
};

export default async function PersonasPage() {
	const personas = await getShenronPersonas();

	return (
		<div className="container mx-auto px-4 py-12 max-w-6xl">
			<PageHeader
				title="LES SIX GARDIENS"
				subtitle="Six figures légendaires de Dragon Ball veillent sur la communauté. Chacune a son rôle, sa personnalité et sa mission."
			/>

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{personas.map((p) => {
					const bio = PERSONA_BIOS[p.id] ?? {
						tagline: "—",
						role: "—",
					};
					return (
						<article
							key={p.id}
							className="dbz-panel p-6 flex flex-col group hover:border-dbz-orange transition-colors"
						>
							<div className="flex items-center gap-4 mb-4">
								{p.avatar && (
									<img
										src={p.avatar}
										alt={p.name}
										className="w-20 h-20 border-4 border-dbz-border group-hover:border-dbz-orange transition-colors"
									/>
								)}
								<div className="flex-1">
									<h2 className="text-3xl font-saiyan text-dbz-yellow">
										{p.name}
									</h2>
									<p className="text-xs font-bold text-dbz-blue-light uppercase tracking-widest mt-1">
										{bio.tagline}
									</p>
								</div>
								<div
									className={`w-4 h-4 rounded-full ${p.online ? "bg-green-500" : "bg-red-500"} shadow-[0_0_8px_currentColor]`}
								/>
							</div>

							<p className="text-sm text-gray-300 mb-4 flex-1">{bio.role}</p>

							<div className="grid grid-cols-3 gap-2 text-center text-xs border-t-2 border-dbz-border pt-3">
								<div>
									<div className="font-saiyan text-2xl text-dbz-orange">
										{p.commandCount}
									</div>
									<div className="text-gray-500 uppercase">cmds</div>
								</div>
								<div>
									<div className="font-saiyan text-2xl text-dbz-yellow">
										{p.wsPing}
									</div>
									<div className="text-gray-500 uppercase">ms</div>
								</div>
								<div>
									<div className="font-saiyan text-2xl text-dbz-blue-light">
										{p.guildCount}
									</div>
									<div className="text-gray-500 uppercase">guild</div>
								</div>
							</div>

							<Link
								href={`/commands?persona=${p.id}`}
								className="mt-4 dbz-button text-center"
							>
								DÉCOUVRIR
							</Link>
						</article>
					);
				})}
			</div>

			<footer className="mt-12 text-center text-xs text-gray-500 uppercase tracking-widest">
				Les six gardiens de la communauté Dragon Ball France
			</footer>
		</div>
	);
}
