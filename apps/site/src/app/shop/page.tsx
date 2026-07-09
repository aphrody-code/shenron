import type { Metadata } from "next";
import { getShenronShop } from "@/lib/shenron";
import { PageHeader } from "@/components/PageHeader";
import { ogMeta } from "@/lib/og";
import { ShopGrid } from "./ShopGrid";

export const revalidate = 60;

export const metadata: Metadata = {
	title: "Boutique",
	description:
		"Cosmétiques exclusifs Shenron : cartes de profil, badges, couleurs, titres et bannières à acheter et équiper directement sur le site avec tes Zénis.",
	...ogMeta({
		title: "Boutique Shenron",
		description:
			"Cartes de profil, badges, couleurs, titres et bannières exclusifs — achat et équipement directement sur le site.",
		canonical: "/shop",
	}),
};

export default async function ShopPage() {
	// Catalogue public (SSR caché) → l'îlot client ShopGrid ajoute solde + achat.
	const items = await getShenronShop();

	return (
		<div className="container mx-auto px-4 py-8 md:py-16">
			<PageHeader
				title="BOUTIQUE SHENRON"
				subtitle={
					<>
						Cosmétiques exclusifs · <strong className="text-dbz-orange">achat et équipement</strong>{" "}
						directement sur le site avec tes Zénis
					</>
				}
			/>

			{items.length === 0 ? (
				<div className="dbz-panel p-12 text-center">
					<p className="font-saiyan text-3xl uppercase text-dbz-orange">
						La boutique galactique est fermée pour maintenance.
					</p>
				</div>
			) : (
				<ShopGrid items={items} />
			)}
		</div>
	);
}
