import { getShenronPersonas } from "@/lib/shenron";
import Link from "next/link";

export const dynamic = "force-dynamic";
export const revalidate = 30;

const PERSONA_BIOS: Record<
	string,
	{ tagline: string; role: string; intents: string }
> = {
	shenron: {
		tagline: "Le Dragon Légendaire",
		role: "Admin · /config · héberge l'API REST",
		intents: "Standard",
	},
	beerus: {
		tagline: "Le Dieu de la Destruction",
		role: "Modération · /ban /kick /warn /mute /clear /role /lock /unlock /purge…",
		intents: "Standard",
	},
	whis: {
		tagline: "L'Ange Précepteur",
		role: "Utilitaires · /help /scan /ticket /wiki /races /planete",
		intents: "Standard",
	},
	grandPretre: {
		tagline: "Le Grand Prêtre Cosmique",
		role: "Logs · MessageLog · JoinLeave · BioRole · AuditLog · InteractionLog",
		intents: "MEMBERS + PRESENCE + MESSAGE_CONTENT",
	},
	enma: {
		tagline: "Le Juge des Enfers",
		role: "Sanctions · /jail /unjail + cron jail-expiry",
		intents: "Standard",
	},
	kaio: {
		tagline: "Le Maître du Nord",
		role: "Économie + Jeux + Level · /shop /eprofil /pendu /morpion /pfc /bingo /fusion /top /niveau…",
		intents: "MESSAGE_CONTENT",
	},
};

export default async function PersonasPage() {
	const personas = await getShenronPersonas();

	return (
		<div className="container mx-auto px-4 py-12 max-w-6xl">
			<header className="text-center mb-12">
				<h1
					className="text-5xl md:text-7xl text-dbz-yellow mb-4"
					style={{ textShadow: "4px 4px 0px rgba(168, 85, 247, 0.6), 0 0 24px rgba(56, 189, 248, 0.3)" }}
				>
					LES 6 PERSONAS
				</h1>
				<p className="text-dbz-blue-light font-bold tracking-widest uppercase max-w-3xl mx-auto">
					Le bot Shenron est composé de 6 entités Discord distinctes, chacune
					spécialisée dans un domaine de la vie du serveur.
				</p>
			</header>

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{personas.map((p) => {
					const bio = PERSONA_BIOS[p.id] ?? {
						tagline: "—",
						role: "—",
						intents: "—",
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

							<div className="mt-3 text-[10px] text-gray-500 font-mono uppercase">
								Intents : {bio.intents}
							</div>

							<Link
								href={`/commands?persona=${p.id}`}
								className="mt-4 dbz-button text-center"
							>
								VOIR LES COMMANDES
							</Link>
						</article>
					);
				})}
			</div>

			<footer className="mt-12 text-center text-xs text-gray-500 uppercase tracking-widest">
				Architecture mono-process · 6 Client discord.js · 1 DB SQLite WAL
				partagée
			</footer>
		</div>
	);
}
