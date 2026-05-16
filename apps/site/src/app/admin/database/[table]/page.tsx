import { botAdmin } from "@/lib/bot-admin";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function TablePage({
	params,
	searchParams,
}: {
	params: Promise<{ table: string }>;
	searchParams: Promise<{ offset?: string }>;
}) {
	const { table } = await params;
	const { offset = "0" } = await searchParams;
	const off = Math.max(0, Number.parseInt(offset, 10) || 0);
	const limit = 50;
	const data = await botAdmin.table(table, limit, off).catch(() => null);

	return (
		<div className="w-full max-w-6xl mx-auto">
			<div className="flex items-center gap-4 mb-8">
				<Link
					href="/admin/database"
					className="font-saiyan text-dbz-blue-light hover:text-dbz-orange uppercase"
				>
					← TABLES
				</Link>
			</div>
			<h1 className="text-4xl font-saiyan text-dbz-orange mb-2">{table}</h1>
			<p className="text-xs text-dbz-blue-light uppercase tracking-widest mb-6">
				{data ? `${data.total} rows · cols: ${data.columns.join(", ")}` : "—"}
			</p>

			{data ? (
				<>
					<div className="dbz-panel overflow-x-auto">
						<table className="w-full min-w-[600px] text-xs">
							<thead className="bg-dbz-border/50 border-b-2 border-dbz-border">
								<tr>
									{data.columns.map((c) => (
										<th
											key={c}
											className="p-2 text-left font-bold uppercase tracking-widest text-dbz-blue-light"
										>
											{c}
										</th>
									))}
								</tr>
							</thead>
							<tbody className="divide-y divide-dbz-border">
								{data.rows.map((row, i) => {
									const r = row as Record<string, unknown>;
									return (
										<tr key={i} className="hover:bg-dbz-blue-light/10">
											{data.columns.map((c) => (
												<td
													key={c}
													className="p-2 font-mono text-gray-300 truncate max-w-[200px]"
												>
													{r[c] === null ? (
														<span className="text-gray-600 italic">null</span>
													) : (
														String(r[c])
													)}
												</td>
											))}
										</tr>
									);
								})}
								{data.rows.length === 0 && (
									<tr>
										<td
											colSpan={data.columns.length}
											className="p-8 text-center text-gray-500 font-saiyan uppercase"
										>
											Empty
										</td>
									</tr>
								)}
							</tbody>
						</table>
					</div>

					<div className="flex justify-between items-center mt-6 text-sm">
						{off > 0 ? (
							<Link
								href={`/admin/database/${table}?offset=${Math.max(0, off - limit)}`}
								className="dbz-button !text-sm !py-2"
							>
								← PRÉCÉDENT
							</Link>
						) : (
							<span />
						)}
						<span className="text-dbz-blue-light font-mono">
							{off + 1} – {Math.min(off + limit, data.total)} / {data.total}
						</span>
						{off + limit < data.total ? (
							<Link
								href={`/admin/database/${table}?offset=${off + limit}`}
								className="dbz-button !text-sm !py-2"
							>
								SUIVANT →
							</Link>
						) : (
							<span />
						)}
					</div>
				</>
			) : (
				<div className="dbz-panel p-8 text-center text-red-500 font-saiyan uppercase">
					Table inaccessible
				</div>
			)}
		</div>
	);
}
