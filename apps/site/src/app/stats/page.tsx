import { PageHeader } from "@/components/PageHeader";

const SHENRON_API_URL =
	process.env.SHENRON_API_URL ?? "https://shenron.rpbey.fr";

export const dynamic = "force-dynamic";
export const revalidate = 30;

async function getStats() {
	try {
		const res = await fetch(`${SHENRON_API_URL}/api/public/stats`, {
			next: { revalidate: 30 },
		});
		if (!res.ok) return null;
		return (await res.json()) as {
			users: number;
			totalXp: number;
			totalZeni: number;
			achievementsUnlocked: number;
			shopItems: number;
			inventoryItems: number;
		};
	} catch {
		return null;
	}
}

function StatCard({
	label,
	value,
	suffix,
	color,
}: {
	label: string;
	value: string | number;
	suffix?: string;
	color: string;
}) {
	return (
		<div className="dbz-panel p-6 text-center">
			<div className={`text-5xl font-saiyan ${color} mb-2`}>
				{value}
				{suffix && (
					<span className="text-2xl text-dbz-blue-light ml-1">{suffix}</span>
				)}
			</div>
			<div className="text-xs font-bold uppercase tracking-widest text-dbz-blue-light">
				{label}
			</div>
		</div>
	);
}

export default async function StatsPage() {
	const stats = await getStats();

	return (
		<div className="container mx-auto px-4 py-12 max-w-5xl">
			<PageHeader
				title="STATISTIQUES"
				subtitle="État de l'univers DBFR · temps réel"
			/>

			{!stats ? (
				<div className="dbz-panel p-8 text-center">
					<p className="text-2xl font-saiyan text-red-500 uppercase">
						Bot inaccessible
					</p>
				</div>
			) : (
				<div className="grid grid-cols-2 md:grid-cols-3 gap-4">
					<StatCard
						label="Guerriers"
						value={stats.users.toLocaleString("fr-FR")}
						color="text-dbz-orange"
					/>
					<StatCard
						label="XP cumulé"
						value={stats.totalXp.toLocaleString("fr-FR")}
						color="text-dbz-yellow"
					/>
					<StatCard
						label="Zéni circulant"
						value={stats.totalZeni.toLocaleString("fr-FR")}
						suffix="¥"
						color="text-dbz-yellow"
					/>
					<StatCard
						label="Succès débloqués"
						value={stats.achievementsUnlocked.toLocaleString("fr-FR")}
						color="text-dbz-blue-light"
					/>
					<StatCard
						label="Items boutique"
						value={stats.shopItems.toLocaleString("fr-FR")}
						color="text-dbz-orange"
					/>
					<StatCard
						label="Items inventaires"
						value={stats.inventoryItems.toLocaleString("fr-FR")}
						color="text-dbz-blue-light"
					/>
				</div>
			)}

			<footer className="mt-12 text-center text-xs text-gray-500 uppercase tracking-widest">
				Mise à jour en temps réel
			</footer>
		</div>
	);
}
