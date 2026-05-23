"use client";

/**
 * Centre de contrôle du wiki : arborescence catégories → pages avec recherche
 * live, compteurs, et actions rapides (voir / éditer / ajouter). Reçoit l'arbre
 * sérialisé depuis le RSC parent.
 */
import Link from "next/link";
import { useMemo, useState } from "react";

type PageNode = { id: string; title: string; slug: string };
type CategoryNode = {
	id: string;
	name: string;
	slug: string;
	order: number;
	pages: PageNode[];
	children: {
		id: string;
		name: string;
		slug: string;
		pages: PageNode[];
	}[];
};

export function WikiManager({ categories }: { categories: CategoryNode[] }) {
	const [q, setQ] = useState("");

	const totals = useMemo(() => {
		let cats = categories.length;
		let pages = 0;
		for (const c of categories) {
			cats += c.children.length;
			pages += c.pages.length;
			for (const sub of c.children) pages += sub.pages.length;
		}
		return { cats, pages };
	}, [categories]);

	const needle = q.trim().toLowerCase();
	const match = (s: string) => !needle || s.toLowerCase().includes(needle);

	// Filtre l'arbre : garde une catégorie si elle matche ou contient une page/sous-cat qui matche.
	const filtered = useMemo(() => {
		if (!needle) return categories;
		return categories
			.map((c) => {
				const pages = c.pages.filter((p) => match(p.title) || match(p.slug));
				const children = c.children
					.map((sub) => ({
						...sub,
						pages: sub.pages.filter((p) => match(p.title) || match(p.slug)),
					}))
					.filter((sub) => match(sub.name) || sub.pages.length > 0);
				return { ...c, pages, children };
			})
			.filter(
				(c) => match(c.name) || c.pages.length > 0 || c.children.length > 0,
			);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [categories, needle]);

	return (
		<div className="w-full max-w-6xl mx-auto">
			<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
				<div>
					<h1 className="text-4xl font-saiyan text-dbz-orange">
						GESTION DU WIKI
					</h1>
					<p className="text-xs text-dbz-blue-light font-mono mt-1">
						{totals.cats} catégorie{totals.cats > 1 ? "s" : ""} · {totals.pages}{" "}
						page{totals.pages > 1 ? "s" : ""}
					</p>
				</div>
				<div className="flex gap-3">
					<Link href="/admin/wiki/category/new" className="dbz-button !text-lg">
						+ CATÉGORIE
					</Link>
					<Link href="/admin/wiki/page/new" className="dbz-button !text-lg">
						+ PAGE
					</Link>
				</div>
			</div>

			<input
				value={q}
				onChange={(e) => setQ(e.target.value)}
				placeholder="Rechercher une page ou une catégorie…"
				className="w-full p-3 mb-6 bg-dbz-bg border-2 border-dbz-border focus:border-dbz-orange outline-none text-white"
			/>

			<div className="space-y-6">
				{filtered.length === 0 ? (
					<div className="dbz-panel p-8 text-center">
						<p className="text-2xl font-saiyan text-dbz-blue-light uppercase">
							{needle
								? "Aucun résultat"
								: "Aucune catégorie. Créez la première."}
						</p>
					</div>
				) : (
					filtered.map((cat) => (
						<div key={cat.id} className="dbz-panel p-6 space-y-4">
							<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
								<div>
									<h2 className="text-2xl font-saiyan text-dbz-yellow">
										{cat.name}
										<span className="ml-2 text-sm text-gray-500 font-mono">
											({cat.pages.length})
										</span>
									</h2>
									<p className="text-xs text-dbz-blue-light font-mono mt-1">
										/{cat.slug} · order: {cat.order}
									</p>
								</div>
								<div className="flex gap-3">
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
											className="flex justify-between items-center group gap-3"
										>
											<Link
												href={`/wiki/${cat.slug}/${p.slug}`}
												className="text-sm text-gray-300 hover:text-dbz-orange transition-colors truncate"
											>
												{p.title}
											</Link>
											<span className="flex gap-3 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
												<Link
													href={`/wiki/${cat.slug}/${p.slug}`}
													className="font-saiyan text-xs text-gray-400 hover:text-dbz-yellow uppercase"
												>
													VOIR
												</Link>
												<Link
													href={`/admin/wiki/page/${p.id}`}
													className="font-saiyan text-xs text-dbz-blue-light hover:text-dbz-yellow uppercase"
												>
													ÉDITER
												</Link>
											</span>
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
													<span className="ml-2 text-xs text-gray-500 font-mono">
														({sub.pages.length})
													</span>
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
													<li
														key={p.id}
														className="flex justify-between group gap-3"
													>
														<Link
															href={`/wiki/${cat.slug}/${sub.slug}/${p.slug}`}
															className="text-gray-400 hover:text-dbz-orange transition-colors truncate"
														>
															{p.title}
														</Link>
														<Link
															href={`/admin/wiki/page/${p.id}`}
															className="opacity-0 group-hover:opacity-100 font-saiyan text-xs text-dbz-blue-light hover:text-dbz-yellow uppercase shrink-0"
														>
															ÉDITER
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
