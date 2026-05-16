import { botAdmin } from "@/lib/bot-admin";
import { EndGiveawayButton } from "./end-button";

export const dynamic = "force-dynamic";

export default async function AdminGiveawaysPage() {
	const data = await botAdmin.giveaways().catch(() => ({ giveaways: [] }));
	const items = data.giveaways ?? [];
	const active = items.filter((g) => !g.ended);
	const ended = items.filter((g) => g.ended);

	return (
		<div className="w-full max-w-5xl mx-auto space-y-8">
			<header>
				<h1 className="text-4xl font-saiyan text-dbz-orange mb-2">GIVEAWAYS</h1>
				<p className="text-xs text-dbz-blue-light uppercase tracking-widest">
					{active.length} actifs · {ended.length} terminés
				</p>
			</header>

			{[
				{
					title: "Actifs",
					list: active,
					color: "text-green-400 border-green-400",
				},
				{
					title: "Terminés",
					list: ended,
					color: "text-gray-500 border-dbz-border",
				},
			].map((sec) => (
				<section key={sec.title}>
					<h2
						className={`text-2xl font-saiyan uppercase mb-3 border-b-2 pb-2 ${sec.color}`}
					>
						{sec.title} ({sec.list.length})
					</h2>
					<div className="space-y-3">
						{sec.list.map((g) => (
							<article
								key={g.id}
								className="dbz-panel p-4 flex flex-col sm:flex-row gap-3 sm:items-center"
							>
								<div className="flex-1">
									<div className="flex items-baseline gap-3 mb-1">
										<h3 className="text-lg font-saiyan text-dbz-yellow">
											{g.title}
										</h3>
										<span className="text-[10px] uppercase text-dbz-blue-light">
											#{g.id}
										</span>
									</div>
									<p className="text-sm text-gray-300 mb-1">
										🎁 {g.reward} · {g.winners} gagnant
										{g.winners > 1 ? "s" : ""}
									</p>
									<p className="text-xs text-gray-500 font-mono">
										{g.ended
											? `terminé · ${g.winnerIds ? JSON.parse(g.winnerIds).length : 0} winners`
											: `ends ${new Date(g.endsAt).toLocaleString("fr-FR")}`}
									</p>
								</div>
								{!g.ended && <EndGiveawayButton id={g.id} />}
							</article>
						))}
						{sec.list.length === 0 && (
							<p className="text-sm text-gray-500 font-saiyan uppercase">
								aucun
							</p>
						)}
					</div>
				</section>
			))}
		</div>
	);
}
