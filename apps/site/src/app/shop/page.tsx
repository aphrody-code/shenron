import { getShenronShop, type ShenronShopItem } from "@/lib/shenron";

export const dynamic = "force-dynamic";
export const revalidate = 60;

const TYPE_LABELS: Record<string, string> = {
	card: "CARTE",
	badge: "BADGE",
	color: "COULEUR",
	title: "TITRE",
	banner: "BANNIÈRE",
};

const TYPE_COLORS: Record<string, string> = {
	card: "border-dbz-blue-light text-dbz-blue-light",
	badge: "border-dbz-yellow text-dbz-yellow",
	color: "border-purple-400 text-purple-400",
	title: "border-dbz-orange text-dbz-orange",
	banner: "border-pink-500 text-pink-400",
};

export default async function ShopPage() {
	const items = await getShenronShop();

	// Tri par type + prix
	const grouped = items.reduce<Record<string, ShenronShopItem[]>>((acc, it) => {
		const k = it.type;
		(acc[k] ??= []).push(it);
		return acc;
	}, {});
	for (const k of Object.keys(grouped))
		grouped[k].sort((a, b) => a.price - b.price);

	const TYPE_ORDER: ShenronShopItem["type"][] = [
		"banner",
		"card",
		"badge",
		"color",
		"title",
	];

	return (
		<div className="container mx-auto px-4 py-8 md:py-16">
			<header className="text-center mb-12">
				<h1
					className="text-5xl md:text-7xl text-dbz-yellow mb-4"
					style={{ textShadow: "4px 4px 0px rgba(168, 85, 247, 0.6), 0 0 24px rgba(56, 189, 248, 0.3)" }}
				>
					BOUTIQUE SHENRON
				</h1>
				<p className="text-dbz-blue-light font-bold tracking-widest uppercase max-w-2xl mx-auto">
					Cosmétiques exclusifs · achat via{" "}
					<code className="text-dbz-orange">/shop</code> Discord · équipement
					via <code className="text-dbz-orange">/inventaire equip</code>
				</p>
			</header>

			{items.length === 0 ? (
				<div className="dbz-panel p-12 text-center">
					<p className="font-saiyan text-3xl text-dbz-orange uppercase">
						La boutique galactique est fermée pour maintenance.
					</p>
				</div>
			) : (
				<div className="space-y-12">
					{TYPE_ORDER.filter((t) => grouped[t]?.length).map((type) => (
						<section key={type}>
							<h2 className="text-3xl font-saiyan text-dbz-orange uppercase mb-6 border-b-4 border-dbz-orange/30 pb-2">
								{TYPE_LABELS[type]} ({grouped[type].length})
							</h2>
							<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
								{grouped[type].map((item) => (
									<article
										key={item.key}
										className="dbz-panel overflow-hidden flex flex-col group hover:border-dbz-orange transition-colors"
									>
										{item.preview && (
											<div className="aspect-[16/6] bg-dbz-bg overflow-hidden border-b-4 border-dbz-border">
												<img
													src={item.preview}
													alt={item.name}
													className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
													loading="lazy"
												/>
											</div>
										)}
										<div className="p-5 flex flex-col flex-1">
											<div className="flex justify-between items-start mb-3 gap-2">
												<span
													className={`font-saiyan text-xs bg-dbz-bg px-2 py-1 border-2 ${TYPE_COLORS[type]}`}
												>
													{TYPE_LABELS[type]}
												</span>
												<div className="text-right">
													<div className="font-saiyan text-2xl text-dbz-yellow leading-none">
														{item.price.toLocaleString("fr-FR")}
													</div>
													<div className="text-[10px] font-bold text-dbz-orange uppercase">
														Zénis
													</div>
												</div>
											</div>
											<h3 className="text-lg text-white mb-2 leading-tight">
												{item.name}
											</h3>
											<p className="text-gray-400 text-xs mb-4 flex-1 line-clamp-3">
												{item.description}
											</p>
											<div className="bg-dbz-bg border-2 border-dbz-border p-2 text-center">
												<code className="text-dbz-yellow font-mono text-[11px]">
													/shop {item.key}
												</code>
											</div>
										</div>
									</article>
								))}
							</div>
						</section>
					))}
				</div>
			)}
		</div>
	);
}
