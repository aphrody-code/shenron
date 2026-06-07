import { db } from "@/lib/db";
import Link from "next/link";

export default async function AdminPosts() {
	const posts = await db.query.posts.findMany({
		orderBy: (p, { desc }) => desc(p.createdAt),
		with: { author: true },
	});

	return (
		<div className="w-full max-w-6xl mx-auto space-y-6">
			<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
				<div>
					<h1 className="text-4xl font-saiyan text-dbz-orange">ARTICLES</h1>
					<p className="text-sm text-white/50 mt-1">
						Gérez les articles publiés sur le site. Un article publié est visible par tous les
						visiteurs.
					</p>
				</div>
				<Link href="/admin/posts/new" className="dbz-button !text-base shrink-0">
					Nouvel article
				</Link>
			</div>

			{posts.length === 0 ? (
				<div className="dbz-panel p-8 text-center">
					<p className="font-saiyan text-dbz-yellow text-xl mb-2">AUCUN ARTICLE</p>
					<p className="text-sm text-white/40 mb-4">Aucun article n&apos;a encore été créé.</p>
					<Link href="/admin/posts/new" className="dbz-button !text-sm">
						Créer le premier article
					</Link>
				</div>
			) : (
				<div className="dbz-panel overflow-hidden overflow-x-auto w-full">
					<table className="w-full text-left min-w-[600px]">
						<thead className="bg-dbz-border/50 border-b-2 border-dbz-border">
							<tr>
								<th className="p-4 text-xs font-bold uppercase tracking-widest text-dbz-blue-light">
									Titre
								</th>
								<th className="p-4 text-xs font-bold uppercase tracking-widest text-dbz-blue-light">
									Statut
								</th>
								<th className="p-4 text-xs font-bold uppercase tracking-widest text-dbz-blue-light">
									Date de création
								</th>
								<th className="p-4 text-xs font-bold uppercase tracking-widest text-dbz-blue-light">
									Actions
								</th>
							</tr>
						</thead>
						<tbody className="divide-y-2 divide-dbz-border">
							{posts.map((post: any) => (
								<tr key={post.id} className="hover:bg-dbz-blue-light/10 transition-colors group">
									<td className="p-4 font-bold text-white group-hover:text-dbz-orange transition-colors">
										{post.title}
									</td>
									<td className="p-4">
										<span
											className={`px-2 py-1 border-2 text-[10px] font-bold uppercase ${
												post.published
													? "bg-green-500/20 text-green-400 border-green-500/50"
													: "bg-dbz-yellow/20 text-dbz-yellow border-dbz-yellow/50"
											}`}
										>
											{post.published ? "Publié" : "Brouillon"}
										</span>
									</td>
									<td className="p-4 text-sm text-gray-400">
										{new Date(post.createdAt).toLocaleDateString("fr-FR", {
											day: "numeric",
											month: "long",
											year: "numeric",
										})}
									</td>
									<td className="p-4">
										<Link
											href={`/admin/posts/${post.id}`}
											className="font-saiyan text-sm text-dbz-blue-light hover:text-dbz-yellow transition-colors uppercase tracking-wider"
										>
											Modifier
										</Link>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			)}
		</div>
	);
}
