import { adminFetch } from "../_lib";
import { AdminHeader } from "../_Header";

export const dynamic = "force-dynamic";

type Movie = {
	id: number;
	slug: string;
	title: string;
	title_ja: string | null;
	series: string;
	release_date: number | null;
	duration_min: number | null;
	poster: string | null;
	mal_id: number | null;
};

export default async function AdminFilmsPage() {
	const data = await adminFetch<{ movies: Movie[] }>("/api/public/wiki/movies");
	const movies = (data?.movies ?? []).sort(
		(a, b) => (a.release_date ?? 0) - (b.release_date ?? 0),
	);

	return (
		<div className="w-full max-w-6xl mx-auto">
			<AdminHeader
				title="DB Universe // Films"
				subtitle={`${movies.length} long-métrages catalogués via Jikan`}
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
						<th className="p-2 text-left text-xs uppercase tracking-widest text-dbz-blue-light w-24">
							Série
						</th>
						<th className="p-2 text-left text-xs uppercase tracking-widest text-dbz-blue-light w-24">
							Sortie
						</th>
						<th className="p-2 text-left text-xs uppercase tracking-widest text-dbz-blue-light w-16">
							Durée
						</th>
						<th className="p-2 text-right text-xs uppercase tracking-widest text-dbz-blue-light w-20">
							MAL
						</th>
					</tr>
				</thead>
				<tbody>
					{movies.map((m) => (
						<tr
							key={m.id}
							className="border-b border-dbz-border/30 hover:bg-dbz-blue-light/5"
						>
							<td className="p-2 font-mono text-xs text-white/70">{m.slug}</td>
							<td className="p-2">
								<div className="text-sm text-white">{m.title}</div>
								{m.title_ja && (
									<div className="font-jp text-xs text-dbz-yellow/75 mt-0.5">
										{m.title_ja}
									</div>
								)}
							</td>
							<td className="p-2 font-mono text-xs text-dbz-orange">
								{m.series}
							</td>
							<td className="p-2 text-[11px] text-white/55">
								{m.release_date
									? new Date(m.release_date).toLocaleDateString("fr-FR")
									: "—"}
							</td>
							<td className="p-2 text-xs text-white/70">
								{m.duration_min ? `${m.duration_min} min` : "—"}
							</td>
							<td className="p-2 text-right">
								{m.mal_id && (
									<a
										href={`https://myanimelist.net/anime/${m.mal_id}`}
										target="_blank"
										rel="noopener noreferrer"
										className="text-[10px] font-mono text-dbz-blue-light/70 hover:text-dbz-orange"
									>
										#{m.mal_id}
									</a>
								)}
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}
