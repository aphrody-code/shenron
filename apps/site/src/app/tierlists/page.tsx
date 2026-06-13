import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { TierlistView } from "@/components/tierlist/TierlistView";
import { listTierlists } from "@/lib/tierlists";
import { ogMeta } from "@/lib/og";

export const revalidate = 30;

export const metadata: Metadata = {
	title: "Tierlists",
	description:
		"Classe l'univers Dragon Ball : tierlists de personnages créées et partagées par la communauté.",
	...ogMeta({
		title: "Tierlists Dragon Ball",
		description: "Classe les personnages de Dragon Ball. Tierlists créées par la communauté.",
	}),
};

export default async function TierlistsPage() {
	const lists = await listTierlists(60).catch(() => []);

	return (
		<div className="container mx-auto max-w-5xl px-4 py-12">
			<PageHeader
				title="TIERLISTS"
				subtitle="Classe l'univers Dragon Ball — créées et partagées par la communauté"
			/>

			<div className="mb-10 flex flex-wrap justify-center gap-4">
				<Link
					href="/tierlists/creer"
					className="rounded-lg bg-dbz-orange px-6 py-3 text-sm font-bold uppercase tracking-wide text-black transition-opacity hover:opacity-90"
				>
					Créer ma tierlist
				</Link>
				<Link
					href="/tierlists/mes"
					className="rounded-lg border border-white/15 px-6 py-3 text-sm font-bold uppercase tracking-wide text-white/80 transition-colors hover:border-white/40"
				>
					Mes tierlists
				</Link>
			</div>

			{lists.length === 0 ? (
				<div className="dbz-panel p-8 text-center">
					<p className="text-2xl font-saiyan uppercase text-dbz-orange">
						Aucune tierlist pour l'instant.
					</p>
					<p className="mt-2 text-white/60">Sois le premier à classer l'univers Dragon Ball !</p>
				</div>
			) : (
				<div className="grid gap-6 sm:grid-cols-2">
					{lists.map((tl) => (
						<Link
							key={tl.id}
							href={`/tierlists/${tl.slug}`}
							className="dbz-panel block p-4 transition-colors hover:border-dbz-orange/60"
						>
							<h2 className="text-lg font-bold text-white">{tl.title}</h2>
							<p className="mb-3 text-[12px] text-white/45">
								par {tl.author?.username ?? "un Saiyan"}
							</p>
							<TierlistView tiers={tl.tiers} compact />
						</Link>
					))}
				</div>
			)}
		</div>
	);
}
