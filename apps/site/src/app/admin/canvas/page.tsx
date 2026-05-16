import { botAdmin } from "@/lib/bot-admin";

export const dynamic = "force-dynamic";

export default async function AdminCanvasPage() {
	const data = await botAdmin.canvas.list().catch(() => ({ canvases: [] }));
	const examples = [
		{ name: "profile", userId: "853295213473038376" },
		{ name: "scouter", userId: "853295213473038376" },
		{ name: "scan", userId: "853295213473038376" },
	];

	return (
		<div className="w-full max-w-6xl mx-auto space-y-8">
			<header>
				<h1 className="text-4xl font-saiyan text-dbz-orange mb-2">CANVAS</h1>
				<p className="text-xs text-dbz-blue-light uppercase tracking-widest">
					{data.canvases.length} canvases enregistrés · Skia napi-rs · cache LRU
					32 · ETag FNV-1a
				</p>
			</header>

			<section>
				<h2 className="text-2xl font-saiyan text-dbz-yellow uppercase mb-4">
					Liste enregistrée
				</h2>
				<div className="dbz-panel overflow-x-auto">
					<table className="w-full min-w-[500px]">
						<thead className="bg-dbz-border/50 border-b-2 border-dbz-border">
							<tr>
								<th className="p-2 text-left text-xs font-bold uppercase tracking-widest text-dbz-blue-light">
									Nom
								</th>
								<th className="p-2 text-left text-xs font-bold uppercase tracking-widest text-dbz-blue-light">
									Path
								</th>
								<th className="p-2 text-left text-xs font-bold uppercase tracking-widest text-dbz-blue-light">
									Description
								</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-dbz-border">
							{data.canvases.map((c) => (
								<tr key={c.name} className="hover:bg-dbz-blue-light/5">
									<td className="p-2 font-saiyan text-dbz-yellow">{c.name}</td>
									<td className="p-2 font-mono text-xs text-dbz-orange">
										{c.path}
									</td>
									<td className="p-2 text-xs text-gray-300">{c.description}</td>
								</tr>
							))}
							{data.canvases.length === 0 && (
								<tr>
									<td
										colSpan={3}
										className="p-6 text-center text-gray-500 font-saiyan uppercase"
									>
										Aucun canvas listé
									</td>
								</tr>
							)}
						</tbody>
					</table>
				</div>
			</section>

			<section>
				<h2 className="text-2xl font-saiyan text-dbz-yellow uppercase mb-4">
					Aperçus live (via proxy admin)
				</h2>
				<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
					{examples.map((e) => (
						<div key={e.name} className="dbz-panel overflow-hidden">
							<div className="aspect-[16/9] bg-dbz-bg">
								{/* eslint-disable-next-line @next/next/no-img-element */}
								<img
									src={`/api/bot-admin/canvas/${e.name}/${e.userId}`}
									alt={e.name}
									className="w-full h-full object-cover"
									loading="lazy"
								/>
							</div>
							<div className="p-3 text-center">
								<code className="text-xs text-dbz-orange font-mono">
									/api/canvas/{e.name}/:id
								</code>
							</div>
						</div>
					))}
				</div>
			</section>
		</div>
	);
}
