import { botAdmin } from "@/lib/bot-admin";

export const dynamic = "force-dynamic";

type ShopRow = {
	key: string;
	type: string;
	name: string;
	description: string | null;
	price: number;
	roleId: string | null;
	enabled: number;
	meta: string | null;
};

export default async function AdminShopPage() {
	const data = await botAdmin
		.table("shop_items", 200, 0)
		.catch(() => ({ rows: [], total: 0, columns: [] }));
	const items = (data.rows ?? []) as ShopRow[];
	const byType = items.reduce<Record<string, ShopRow[]>>((acc, i) => {
		(acc[i.type] ??= []).push(i);
		return acc;
	}, {});

	return (
		<div className="w-full max-w-6xl mx-auto space-y-8">
			<header>
				<h1 className="text-4xl font-saiyan text-dbz-orange mb-2">
					SHOP (admin)
				</h1>
				<p className="text-xs text-dbz-blue-light uppercase tracking-widest">
					{items.length} items configurés · CRUD via{" "}
					<code className="text-dbz-orange">/admin/database/shop_items</code>
				</p>
			</header>

			{Object.entries(byType).map(([type, list]) => (
				<section key={type}>
					<h2 className="text-2xl font-saiyan text-dbz-yellow uppercase mb-3 border-b-2 border-dbz-yellow/40 pb-1">
						{type} ({list.length})
					</h2>
					<div className="dbz-panel overflow-x-auto">
						<table className="w-full min-w-[500px] text-xs">
							<thead className="bg-dbz-border/50 border-b-2 border-dbz-border">
								<tr>
									<th className="p-2 text-left font-bold uppercase tracking-widest text-dbz-blue-light">
										Key
									</th>
									<th className="p-2 text-left font-bold uppercase tracking-widest text-dbz-blue-light">
										Nom
									</th>
									<th className="p-2 text-right font-bold uppercase tracking-widest text-dbz-blue-light">
										Prix
									</th>
									<th className="p-2 text-left font-bold uppercase tracking-widest text-dbz-blue-light">
										Role / Meta
									</th>
									<th className="p-2 text-right font-bold uppercase tracking-widest text-dbz-blue-light">
										État
									</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-dbz-border">
								{list.map((i) => (
									<tr key={i.key} className="hover:bg-dbz-blue-light/5">
										<td className="p-2 font-mono text-dbz-orange">{i.key}</td>
										<td className="p-2 text-white">{i.name}</td>
										<td className="p-2 text-right font-mono text-dbz-yellow">
											{i.price} ¥
										</td>
										<td className="p-2 font-mono text-[10px] text-gray-400 max-w-xs truncate">
											{i.roleId ?? i.meta ?? "—"}
										</td>
										<td className="p-2 text-right">
											{i.enabled ? (
												<span className="text-green-400">●</span>
											) : (
												<span className="text-red-400">○</span>
											)}
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</section>
			))}
		</div>
	);
}
