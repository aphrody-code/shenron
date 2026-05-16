import { adminFetch } from "../_lib";
import { AdminHeader } from "../_Header";

export const dynamic = "force-dynamic";

type Game = {
	id: number;
	slug: string;
	title: string;
	title_ja: string | null;
	platforms: string | null;
	release_date: number | null;
	developer: string | null;
	publisher: string | null;
	official_url: string | null;
};

export default async function AdminGamesPage() {
	const data = await adminFetch<{ games: Game[] }>("/api/public/wiki/games");
	const games = data?.games ?? [];

	return (
		<div className="w-full max-w-6xl mx-auto">
			<AdminHeader
				title="DB Universe // Games"
				subtitle={`${games.length} jeux Bandai Namco catalogués`}
			/>

			<table className="w-full">
				<thead>
					<tr className="border-b-2 border-dbz-border/60">
						<th className="p-2 text-left text-xs uppercase tracking-widest text-dbz-blue-light w-32">
							Slug
						</th>
						<th className="p-2 text-left text-xs uppercase tracking-widest text-dbz-blue-light">
							Titre
						</th>
						<th className="p-2 text-left text-xs uppercase tracking-widest text-dbz-blue-light w-48">
							Plateformes
						</th>
						<th className="p-2 text-left text-xs uppercase tracking-widest text-dbz-blue-light w-24">
							Sortie
						</th>
						<th className="p-2 text-left text-xs uppercase tracking-widest text-dbz-blue-light w-32">
							Studio
						</th>
					</tr>
				</thead>
				<tbody>
					{games.map((g) => (
						<tr
							key={g.id}
							className="border-b border-dbz-border/30 hover:bg-dbz-blue-light/5"
						>
							<td className="p-2 font-mono text-xs text-white/70">{g.slug}</td>
							<td className="p-2">
								<div className="text-sm text-white">{g.title}</div>
								{g.title_ja && (
									<div className="font-jp text-xs text-dbz-yellow/75 mt-0.5">
										{g.title_ja}
									</div>
								)}
								{g.official_url && (
									<a
										href={g.official_url}
										target="_blank"
										rel="noopener noreferrer"
										className="text-[10px] text-dbz-orange hover:underline"
									>
										{g.official_url}
									</a>
								)}
							</td>
							<td className="p-2">
								<div className="flex flex-wrap gap-1">
									{(g.platforms ?? "")
										.split(",")
										.map((p) => p.trim())
										.filter(Boolean)
										.map((p) => (
											<span
												key={p}
												className="text-[10px] font-mono px-1.5 py-0.5 bg-dbz-orange/15 text-dbz-orange uppercase"
											>
												{p}
											</span>
										))}
								</div>
							</td>
							<td className="p-2 text-[11px] text-white/55">
								{g.release_date
									? new Date(g.release_date).toLocaleDateString("fr-FR")
									: "—"}
							</td>
							<td className="p-2 text-xs text-white/70">
								{g.developer ?? "—"}
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}
