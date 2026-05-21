import Link from "next/link";
import { savePost, deletePost } from "./_actions";

type PostData = {
	id: string;
	slug: string;
	title: string;
	cover: string | null;
	excerpt: string;
	body: string;
	published: boolean;
};

const field =
	"w-full bg-dbz-bg border-2 border-dbz-border focus:border-dbz-orange outline-none p-3 text-white text-sm rounded";
const label =
	"block text-[10px] font-bold uppercase tracking-widest text-dbz-blue-light mb-1";

/**
 * Éditeur d'article (création + édition). Server Component : le formulaire poste
 * directement vers la Server Action `savePost` (pas de JS client requis).
 */
export function PostForm({ post }: { post?: PostData }) {
	return (
		<div className="w-full max-w-3xl mx-auto space-y-6">
			<form action={savePost} className="dbz-panel p-6 space-y-5">
				{post && <input type="hidden" name="id" value={post.id} />}

				<div>
					<label className={label} htmlFor="title">
						Titre
					</label>
					<input
						id="title"
						name="title"
						required
						defaultValue={post?.title}
						className={field}
						placeholder="Titre de l'article"
					/>
				</div>

				<div>
					<label className={label} htmlFor="slug">
						Slug (URL) — laissé vide = généré depuis le titre
					</label>
					<input
						id="slug"
						name="slug"
						defaultValue={post?.slug}
						className={`${field} font-mono`}
						placeholder="mon-article"
					/>
				</div>

				<div>
					<label className={label} htmlFor="cover">
						Image de couverture (URL)
					</label>
					<input
						id="cover"
						name="cover"
						type="url"
						defaultValue={post?.cover ?? ""}
						className={`${field} font-mono`}
						placeholder="https://…"
					/>
				</div>

				<div>
					<label className={label} htmlFor="excerpt">
						Extrait
					</label>
					<textarea
						id="excerpt"
						name="excerpt"
						required
						rows={2}
						defaultValue={post?.excerpt}
						className={field}
						placeholder="Résumé court affiché dans les listes."
					/>
				</div>

				<div>
					<label className={label} htmlFor="body">
						Contenu (Markdown)
					</label>
					<textarea
						id="body"
						name="body"
						required
						rows={16}
						defaultValue={post?.body}
						className={`${field} font-mono leading-relaxed`}
						placeholder="# Titre&#10;&#10;Contenu en Markdown…"
					/>
				</div>

				<label className="flex items-center gap-3 cursor-pointer">
					<input
						type="checkbox"
						name="published"
						defaultChecked={post?.published ?? false}
						className="w-5 h-5 accent-dbz-orange"
					/>
					<span className="text-sm font-bold text-white uppercase tracking-wide">
						Publié (visible sur le site)
					</span>
				</label>

				<div className="flex items-center gap-3 pt-2">
					<button type="submit" className="dbz-button !text-base">
						{post ? "Enregistrer" : "Créer l'article"}
					</button>
					<Link href="/admin/posts" className="dbz-button-ghost !text-sm">
						Annuler
					</Link>
				</div>
			</form>

			{post && (
				<form
					action={deletePost}
					className="dbz-panel p-4 border-l-4 border-dbz-red flex items-center justify-between"
				>
					<input type="hidden" name="id" value={post.id} />
					<span className="text-sm text-white/70">
						Supprimer définitivement cet article.
					</span>
					<button
						type="submit"
						className="px-4 py-2 bg-dbz-red text-white font-bold uppercase text-xs tracking-widest rounded hover:brightness-110"
					>
						Supprimer
					</button>
				</form>
			)}
		</div>
	);
}
