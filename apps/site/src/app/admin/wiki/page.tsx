import { db } from "@/lib/db";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminWikiPage() {
	const categories = await db.query.wikiCategories.findMany({
		where: (c, { isNull }) => isNull(c.parentId),
		with: {
			children: { with: { pages: true } },
			pages: true,
		},
		orderBy: (c, { asc }) => asc(c.order),
	});

	return (
		<div className="w-full max-w-6xl mx-auto">
			<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
				<h1 className="text-4xl font-saiyan text-dbz-orange">
					GESTION DU WIKI
				</h1>
				<div className="flex gap-3">
					<Link href="/admin/wiki/category/new" className="dbz-button !text-lg">
						+ CATÉGORIE
					</Link>
					<Link href="/admin/wiki/page/new" className="dbz-button !text-lg">
						+ PAGE
					</Link>
				</div>
			</div>

			<div className="space-y-6">
				{categories.length === 0 ? (
					<div className="dbz-panel p-8 text-center">
						<p className="text-2xl font-saiyan text-dbz-blue-light uppercase">
							Aucune catégorie. Créez la première.
						</p>
					</div>
				) : (
					categories.map((cat) => (
						<div key={cat.id} className="dbz-panel p-6 space-y-4">
							<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
								<div>
									<h2 className="text-2xl font-saiyan text-dbz-yellow">
										{cat.name}
									</h2>
									<p className="text-xs text-dbz-blue-light font-mono mt-1">
										slug: /{cat.slug} · order: {cat.order}
									</p>
								</div>
								<div className="flex gap-2">
									<Link
										href={`/admin/wiki/category/${cat.id}`}
										className="font-saiyan text-sm text-dbz-blue-light hover:text-dbz-yellow uppercase tracking-wider"
									>
										ÉDITER
									</Link>
									<Link
										href={`/admin/wiki/page/new?category=${cat.id}`}
										className="font-saiyan text-sm text-dbz-orange hover:text-dbz-yellow uppercase tracking-wider"
									>
										+ PAGE
									</Link>
								</div>
							</div>

							{cat.pages.length > 0 && (
								<ul className="space-y-1 ml-4 border-l-2 border-dbz-border pl-4">
									{cat.pages.map((p) => (
										<li
											key={p.id}
											className="flex justify-between items-center group"
										>
											<Link
												href={`/wiki/${cat.slug}/${p.slug}`}
												className="text-sm text-gray-300 hover:text-dbz-orange transition-colors"
											>
												{p.title}
											</Link>
											<Link
												href={`/admin/wiki/page/${p.id}`}
												className="opacity-0 group-hover:opacity-100 transition-opacity font-saiyan text-xs text-dbz-blue-light hover:text-dbz-yellow uppercase"
											>
												ÉDITER
											</Link>
										</li>
									))}
								</ul>
							)}

							{cat.children.length > 0 && (
								<div className="ml-4 space-y-3">
									{cat.children.map((sub) => (
										<div
											key={sub.id}
											className="border-l-2 border-dbz-blue/50 pl-4"
										>
											<div className="flex justify-between items-center mb-2">
												<h3 className="font-saiyan text-lg text-dbz-blue-light">
													{sub.name}
												</h3>
												<Link
													href={`/admin/wiki/category/${sub.id}`}
													className="text-xs text-gray-500 hover:text-dbz-yellow uppercase"
												>
													ÉDITER
												</Link>
											</div>
											<ul className="space-y-1 text-sm">
												{sub.pages.map((p) => (
													<li key={p.id} className="flex justify-between group">
														<Link
															href={`/wiki/${cat.slug}/${sub.slug}/${p.slug}`}
															className="text-gray-400 hover:text-dbz-orange transition-colors"
														>
															{p.title}
														</Link>
														<Link
															href={`/admin/wiki/page/${p.id}`}
															className="opacity-0 group-hover:opacity-100 font-saiyan text-xs text-dbz-blue-light uppercase"
														>
															ÉD
														</Link>
													</li>
												))}
											</ul>
										</div>
									))}
								</div>
							)}
						</div>
					))
				)}
			</div>
		</div>
	);
}
