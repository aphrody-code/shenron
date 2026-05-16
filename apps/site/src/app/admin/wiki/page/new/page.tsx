import { db } from "@/lib/db";
import Link from "next/link";
import { createPage } from "../../_actions";

export const dynamic = "force-dynamic";

export default async function NewWikiPagePage({
	searchParams,
}: {
	searchParams: Promise<{ category?: string }>;
}) {
	const params = await searchParams;
	const allCategories = await db.query.wikiCategories.findMany({
		orderBy: (c, { asc }) => asc(c.order),
	});

	return (
		<div className="w-full max-w-3xl mx-auto">
			<div className="flex items-center gap-4 mb-8">
				<Link
					href="/admin/wiki"
					className="font-saiyan text-dbz-blue-light hover:text-dbz-orange uppercase"
				>
					← RETOUR
				</Link>
			</div>
			<h1 className="text-4xl font-saiyan text-dbz-orange mb-8">
				NOUVELLE PAGE WIKI
			</h1>

			<form action={createPage} className="dbz-panel p-6 space-y-4">
				<div>
					<label className="block text-xs uppercase tracking-widest text-dbz-blue-light mb-2">
						Titre
					</label>
					<input
						name="title"
						required
						className="w-full p-3 bg-dbz-bg border-2 border-dbz-border focus:border-dbz-orange outline-none font-bold text-white"
						placeholder="Ex: Goku Saiyan"
					/>
				</div>
				<div>
					<label className="block text-xs uppercase tracking-widest text-dbz-blue-light mb-2">
						Catégorie
					</label>
					<select
						name="categoryId"
						required
						defaultValue={params.category ?? ""}
						className="w-full p-3 bg-dbz-bg border-2 border-dbz-border focus:border-dbz-orange outline-none text-white"
					>
						<option value="">— Sélectionner —</option>
						{allCategories.map((c) => (
							<option key={c.id} value={c.id}>
								{c.name}
							</option>
						))}
					</select>
				</div>
				<div>
					<label className="block text-xs uppercase tracking-widest text-dbz-blue-light mb-2">
						Contenu (markdown)
					</label>
					<textarea
						name="body"
						rows={16}
						className="w-full p-3 bg-dbz-bg border-2 border-dbz-border focus:border-dbz-orange outline-none text-white font-mono text-sm"
						placeholder="# Goku&#10;&#10;Le légendaire Saiyan élevé sur Terre…"
					/>
				</div>
				<div>
					<label className="block text-xs uppercase tracking-widest text-dbz-blue-light mb-2">
						Ordre
					</label>
					<input
						type="number"
						name="order"
						defaultValue={0}
						className="w-full p-3 bg-dbz-bg border-2 border-dbz-border focus:border-dbz-orange outline-none text-white"
					/>
				</div>
				<button type="submit" className="dbz-button w-full !text-lg mt-6">
					CRÉER
				</button>
			</form>
		</div>
	);
}
