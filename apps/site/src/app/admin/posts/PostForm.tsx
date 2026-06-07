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
const label = "block text-[10px] font-bold uppercase tracking-widest text-dbz-blue-light mb-1";
const hint = "text-[10px] text-white/30 mt-1";

/**
 * Éditeur d'article (création + édition). Server Component : le formulaire poste
 * directement vers la Server Action `savePost`.
 */
export function PostForm({ post }: { post?: PostData }) {
	return (
		<div className="w-full max-w-3xl mx-auto space-y-6">
			<form action={savePost} className="dbz-panel p-6 space-y-5">
				{post && <input type="hidden" name="id" value={post.id} />}

				<div>
					<label className={label} htmlFor="title">
						Titre de l&apos;article
					</label>
					<input
						id="title"
						name="title"
						required
						defaultValue={post?.title}
						className={field}
						placeholder="ex : Mise à jour des saisons 2 de Dragon Ball"
					/>
					<p className={hint}>Affiché en titre principal sur la page de l&apos;article.</p>
				</div>

				<div>
					<label className={label} htmlFor="slug">
						Identifiant URL (slug)
					</label>
					<input
						id="slug"
						name="slug"
						defaultValue={post?.slug}
						className={`${field} font-mono`}
						placeholder="laissez vide pour générer automatiquement depuis le titre"
					/>
					<p className={hint}>
						Utilisé dans l&apos;adresse de la page :{" "}
						<code className="text-dbz-blue-light">/actualites/mon-article</code>. Ne contient que
						des lettres, chiffres et tirets.
					</p>
				</div>

				<div>
					<label className={label} htmlFor="cover">
						Image de couverture
					</label>
					<input
						id="cover"
						name="cover"
						type="url"
						defaultValue={post?.cover ?? ""}
						className={`${field} font-mono`}
						placeholder="https://… (optionnel)"
					/>
					<p className={hint}>Image affichée en haut de l&apos;article et dans les listes.</p>
				</div>

				<div>
					<label className={label} htmlFor="excerpt">
						Résumé court
					</label>
					<textarea
						id="excerpt"
						name="excerpt"
						required
						rows={2}
						defaultValue={post?.excerpt}
						className={field}
						placeholder="Quelques phrases décrivant l'article, affichées dans les listes."
					/>
					<p className={hint}>
						Visible sur la page d&apos;accueil et dans les listes d&apos;articles.
					</p>
				</div>

				<div>
					<label className={label} htmlFor="body">
						Contenu de l&apos;article (Markdown)
					</label>
					<textarea
						id="body"
						name="body"
						required
						rows={16}
						defaultValue={post?.body}
						className={`${field} font-mono leading-relaxed`}
						placeholder={
							"# Titre\n\nCommencez à écrire votre article en Markdown…\n\n**Texte en gras**, *texte en italique*, [lien](https://…)"
						}
					/>
					<p className={hint}>
						Syntaxe Markdown supportée : titres (#), listes (- …), liens ([texte](url)), gras
						(**…**), etc.
					</p>
				</div>

				<label className="flex items-center gap-3 cursor-pointer p-3 rounded border border-dbz-border hover:border-dbz-orange/40 transition-colors">
					<input
						type="checkbox"
						name="published"
						defaultChecked={post?.published ?? false}
						className="w-5 h-5 accent-dbz-orange"
					/>
					<div>
						<span className="text-sm font-bold text-white uppercase tracking-wide">
							Publier l&apos;article
						</span>
						<p className={hint}>
							Si coché, l&apos;article sera visible par tous les visiteurs du site. Sinon, il reste
							en brouillon.
						</p>
					</div>
				</label>

				<div className="flex items-center gap-3 pt-2">
					<button type="submit" className="dbz-button !text-base">
						{post ? "Enregistrer les modifications" : "Créer l'article"}
					</button>
					<Link href="/admin/posts" className="dbz-button-ghost !text-sm">
						Annuler
					</Link>
				</div>
			</form>

			{post && (
				<form
					action={deletePost}
					className="dbz-panel p-5 border-l-4 border-red-500 space-y-3"
					onSubmit={(e) => {
						if (
							!confirm(
								`Supprimer définitivement l'article "${post.title}" ?\n\nCette action est irréversible.`
							)
						) {
							e.preventDefault();
						}
					}}
				>
					<input type="hidden" name="id" value={post.id} />
					<div>
						<p className="text-sm font-bold text-red-400 mb-1">Zone de danger</p>
						<p className="text-sm text-white/50">
							Supprimer définitivement cet article. Cette action est irréversible.
						</p>
					</div>
					<button
						type="submit"
						className="px-4 py-2 bg-red-600 text-white font-bold uppercase text-xs tracking-widest rounded hover:bg-red-500 transition-colors"
					>
						Supprimer l&apos;article
					</button>
				</form>
			)}
		</div>
	);
}
