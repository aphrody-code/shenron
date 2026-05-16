import { botAdmin } from "@/lib/bot-admin";
export const dynamic = "force-dynamic";

export default async function AdminHierarchyPage() {
	const data = await botAdmin.moderation
		.hierarchy()
		.catch(() => ({ tiers: [] }));
	return (
		<div className="w-full max-w-4xl mx-auto">
			<header className="mb-6">
				<h1 className="text-4xl font-saiyan text-dbz-orange mb-2">HIERARCHY</h1>
				<p className="text-xs text-dbz-blue-light uppercase tracking-widest">
					Tiers de modération · qui peut sanctionner qui
				</p>
			</header>
			<div className="space-y-3">
				{[...data.tiers]
					.sort((a, b) => b.level - a.level)
					.map((t) => (
						<div key={t.name} className="dbz-panel p-4">
							<div className="flex items-baseline justify-between mb-2">
								<h2 className="font-saiyan text-xl text-dbz-yellow uppercase">
									{t.name}
								</h2>
								<span className="text-xs uppercase text-dbz-blue-light">
									Niveau {t.level}
								</span>
							</div>
							<div className="flex flex-wrap gap-1">
								{t.roleIds.map((rid) => (
									<code
										key={rid}
										className="text-[10px] font-mono px-2 py-1 bg-dbz-bg border border-dbz-border text-gray-300"
									>
										{rid}
									</code>
								))}
								{t.roleIds.length === 0 && (
									<span className="text-xs text-gray-500 italic">
										aucun rôle
									</span>
								)}
							</div>
						</div>
					))}
				{data.tiers.length === 0 && (
					<div className="dbz-panel p-8 text-center text-gray-500 font-saiyan uppercase">
						Aucune hierarchy
					</div>
				)}
			</div>
		</div>
	);
}
