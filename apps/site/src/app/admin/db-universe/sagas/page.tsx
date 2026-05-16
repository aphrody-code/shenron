import { adminFetch } from "../_lib";
import { AdminHeader } from "../_Header";

export const dynamic = "force-dynamic";

type Saga = {
	id: number;
	slug: string;
	name: string;
	name_ja: string | null;
	series: string;
	order_idx: number;
	description: string | null;
};

const SERIES_ORDER = [
	"DB",
	"DBZ",
	"DBGT",
	"DBS",
	"DBS_MANGA",
	"DBS_MOVIE",
	"DB_DAIMA",
];

export default async function AdminSagasPage() {
	const data = await adminFetch<{ sagas: Saga[] }>("/api/public/wiki/sagas");
	const sagas = data?.sagas ?? [];

	const byseries = SERIES_ORDER.map((s) => ({
		series: s,
		items: sagas
			.filter((sg) => sg.series === s)
			.sort((a, b) => a.order_idx - b.order_idx),
	})).filter((g) => g.items.length > 0);

	return (
		<div className="w-full max-w-6xl mx-auto">
			<AdminHeader
				title="DB Universe // Sagas"
				subtitle={`${sagas.length} sagas réparties sur ${byseries.length} séries`}
			/>

			{byseries.map((g) => (
				<section key={g.series} className="mb-10">
					<h2 className="font-saiyan text-2xl text-dbz-yellow uppercase mb-3 border-b-2 border-dbz-yellow/30 pb-2">
						{g.series}{" "}
						<span className="text-white/40 text-sm">{g.items.length}</span>
					</h2>
					<table className="w-full">
						<thead>
							<tr className="border-b border-dbz-border/40">
								<th className="p-2 text-left text-xs uppercase tracking-widest text-dbz-blue-light w-12">
									#
								</th>
								<th className="p-2 text-left text-xs uppercase tracking-widest text-dbz-blue-light w-40">
									Slug
								</th>
								<th className="p-2 text-left text-xs uppercase tracking-widest text-dbz-blue-light">
									Nom
								</th>
								<th className="p-2 text-left text-xs uppercase tracking-widest text-dbz-blue-light w-24">
									日本語
								</th>
							</tr>
						</thead>
						<tbody>
							{g.items.map((s) => (
								<tr
									key={s.id}
									className="border-b border-dbz-border/30 hover:bg-dbz-blue-light/5"
								>
									<td className="p-2 font-mono text-xs text-dbz-orange">
										{s.order_idx}
									</td>
									<td className="p-2 font-mono text-xs text-white/70">
										{s.slug}
									</td>
									<td className="p-2">
										<div className="text-sm text-white font-medium">
											{s.name}
										</div>
										{s.description && (
											<div className="text-[11px] text-white/55 mt-0.5 line-clamp-2">
												{s.description}
											</div>
										)}
									</td>
									<td className="p-2 font-jp text-sm text-dbz-yellow/85">
										{s.name_ja ?? ""}
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</section>
			))}
		</div>
	);
}
