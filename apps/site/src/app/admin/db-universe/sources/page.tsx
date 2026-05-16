import { adminFetch } from "../_lib";
import { AdminHeader } from "../_Header";

export const dynamic = "force-dynamic";

type Source = {
	id: string;
	name: string;
	url: string;
	license_key: string;
	attribution_template: string | null;
	license_name: string;
	license_url: string | null;
};

export default async function AdminSourcesPage() {
	const data = await adminFetch<{ sources: Source[] }>("/api/public/sources");
	const sources = data?.sources ?? [];

	return (
		<div className="w-full max-w-6xl mx-auto">
			<AdminHeader
				title="DB Universe // Sources"
				subtitle={`${sources.length} sources enregistrées · attribution + licence per-asset`}
			/>

			<div className="dbz-panel overflow-x-auto">
				<table className="w-full min-w-[800px]">
					<thead className="bg-dbz-border/50 border-b-2 border-dbz-border">
						<tr>
							<th className="p-3 text-left text-xs font-bold uppercase tracking-widest text-dbz-blue-light w-32">
								ID
							</th>
							<th className="p-3 text-left text-xs font-bold uppercase tracking-widest text-dbz-blue-light">
								Source
							</th>
							<th className="p-3 text-left text-xs font-bold uppercase tracking-widest text-dbz-blue-light w-40">
								Licence
							</th>
							<th className="p-3 text-left text-xs font-bold uppercase tracking-widest text-dbz-blue-light">
								Attribution
							</th>
						</tr>
					</thead>
					<tbody>
						{sources.map((s) => (
							<tr
								key={s.id}
								className="border-b border-dbz-border/40 hover:bg-dbz-blue-light/5"
							>
								<td className="p-3 align-top">
									<code className="text-dbz-orange text-xs font-mono">
										{s.id}
									</code>
								</td>
								<td className="p-3 align-top">
									<a
										href={s.url}
										target="_blank"
										rel="noopener noreferrer"
										className="text-white hover:text-dbz-orange font-saiyan text-sm uppercase tracking-wider"
									>
										{s.name}
									</a>
									<p className="text-[11px] text-white/45 mt-0.5 font-mono truncate max-w-md">
										{s.url}
									</p>
								</td>
								<td className="p-3 align-top">
									{s.license_url ? (
										<a
											href={s.license_url}
											target="_blank"
											rel="noopener noreferrer"
											className="text-dbz-yellow text-xs font-bold uppercase tracking-widest hover:underline"
										>
											{s.license_key}
										</a>
									) : (
										<span className="text-dbz-yellow text-xs font-bold uppercase tracking-widest">
											{s.license_key}
										</span>
									)}
									<p className="text-[10px] text-white/40 mt-1">
										{s.license_name}
									</p>
								</td>
								<td className="p-3 align-top text-xs text-white/75">
									{s.attribution_template ?? "—"}
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
}
