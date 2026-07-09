import type { Metadata } from "next";
import { getOpenCategoryKeys } from "@/lib/wiki-launch-config";
import { LaunchManager } from "./LaunchManager";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
	title: "Lancement du wiki",
	robots: { index: false },
};

export default async function AdminLaunchPage() {
	const openKeys = await getOpenCategoryKeys();

	return (
		<div className="mx-auto w-full max-w-4xl space-y-6">
			<header>
				<h1 className="mb-2 font-saiyan text-4xl text-dbz-orange">LANCEMENT DU WIKI</h1>
				<p className="mb-1 text-sm text-white/60">
					Choisis quelles catégories du wiki sont visibles par le public. Sors-les une par une :
					basculer une catégorie l&apos;ouvre immédiatement (index + fiches), le reste reste
					réservé aux admins.
				</p>
				<p className="text-xs uppercase tracking-widest text-white/30">
					Gating bêta piloté par la DB · effet immédiat (cache 30 s)
				</p>
			</header>
			<LaunchManager initialOpen={openKeys} />
		</div>
	);
}
