import { botAdmin } from "@/lib/bot-admin";
import { HierarchyEditor } from "./HierarchyEditor";

export const dynamic = "force-dynamic";

export default async function AdminHierarchyPage() {
	const data = await botAdmin.moderation
		.hierarchy()
		.catch(() => ({ tiers: [] }));
	return (
		<div className="w-full max-w-4xl mx-auto">
			<header className="mb-6">
				<h1 className="text-4xl font-saiyan text-dbz-orange mb-2">
					HIERARCHY ❯ ÉDITEUR
				</h1>
				<p className="text-xs text-dbz-blue-light uppercase tracking-widest">
					Tiers de modération · qui peut sanctionner qui · drag/drop disponible
				</p>
			</header>
			<HierarchyEditor initial={data.tiers} />
		</div>
	);
}
