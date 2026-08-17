"use server";

import { db } from "@/lib/db";
import { posts, POST_STATUSES, type PostContentDoc } from "@/db/schema";
import { requireAdmin } from "@/lib/session";
import { autoExcerpt, computeReadingStats, renderPostDoc } from "@/lib/posts";
import { isValidSlug, slugify, uniqueSlug } from "@/lib/slug";
import { and, eq, ne } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

/**
 * Écritures du CMS éditorial.
 *
 * Le formulaire envoie un **document Tiptap**, jamais du HTML : le balisage
 * publié est régénéré ici (`renderPostDoc`) depuis le JSON, borné au schéma
 * d'extensions du site. Un client compromis ne peut donc pas injecter de HTML
 * arbitraire dans une page publique.
 */

const TAG_MAX = 8;

const postInput = z.object({
	id: z.string().trim().optional(),
	title: z.string().trim().min(3, "Le titre doit faire au moins 3 caractères.").max(180),
	slug: z.string().trim().max(80).optional(),
	excerpt: z.string().trim().max(320).optional(),
	doc: z.record(z.string(), z.unknown()).nullable(),
	cover: z.string().trim().max(600).optional(),
	coverAlt: z.string().trim().max(300).optional(),
	coverCaption: z.string().trim().max(300).optional(),
	tags: z.array(z.string().trim().min(1).max(40)).max(TAG_MAX).default([]),
	status: z.enum(POST_STATUSES),
	/** ISO 8601. Requis pour un article programmé. */
	publishedAt: z.string().trim().optional(),
	featured: z.boolean().default(false),
	seoTitle: z.string().trim().max(70).optional(),
	seoDescription: z.string().trim().max(180).optional(),
	ogImage: z.string().trim().max(600).optional(),
	canonicalUrl: z.string().trim().max(600).optional(),
	noindex: z.boolean().default(false),
});

export type PostInput = z.input<typeof postInput>;
export type SaveResult = { ok: true; id: string; slug: string } | { ok: false; error: string };

/** Vide → NULL (une chaîne vide en base n'est pas « absent »). */
function nullify(v: string | undefined): string | null {
	const s = v?.trim();
	return s ? s : null;
}

/**
 * N'accepte que des URL http(s) — bloque `javascript:` / `data:` sur les champs
 * d'URL libres (couverture, image sociale, canonique).
 */
function safeUrl(v: string | undefined): string | null {
	const s = nullify(v);
	if (!s) return null;
	// Chemin d'asset relatif servi par le bot (`./assets/...`) : autorisé tel quel.
	if (s.startsWith("./") || s.startsWith("/")) return s;
	try {
		const u = new URL(s);
		return u.protocol === "http:" || u.protocol === "https:" ? s : null;
	} catch {
		return null;
	}
}

/** Normalise les tags : trim, minuscules, dédoublonnage en préservant l'ordre. */
function normalizeTags(tags: string[]): string[] {
	const seen = new Set<string>();
	const out: string[] = [];
	for (const raw of tags) {
		const tag = raw.trim().replace(/\s+/g, " ");
		const key = tag.toLowerCase();
		if (!tag || seen.has(key)) continue;
		seen.add(key);
		out.push(tag);
	}
	return out.slice(0, TAG_MAX);
}

export async function savePost(input: PostInput): Promise<SaveResult> {
	const me = await requireAdmin();

	const parsed = postInput.safeParse(input);
	if (!parsed.success) {
		return { ok: false, error: parsed.error.issues[0]?.message ?? "Formulaire invalide." };
	}
	const data = parsed.data;
	const doc = (data.doc ?? null) as PostContentDoc | null;

	// --- Contenu : HTML, texte brut et statistiques dérivés du document -------
	const rendered = renderPostDoc(doc);
	if (!rendered.text.trim()) {
		return { ok: false, error: "L'article est vide — ajoutez du contenu avant d'enregistrer." };
	}

	// --- Slug : unique, stable, validé ---------------------------------------
	const desired = data.slug?.trim() ? data.slug.trim() : slugify(data.title);
	if (data.slug?.trim() && !isValidSlug(desired)) {
		return {
			ok: false,
			error: "Le slug ne peut contenir que des minuscules, des chiffres et des tirets.",
		};
	}
	// Slugs déjà pris, en excluant l'article courant (sinon chaque enregistrement
	// incrémenterait son propre suffixe : mon-article → mon-article-2 → -3…).
	const taken = await db
		.select({ slug: posts.slug })
		.from(posts)
		.where(data.id ? ne(posts.id, data.id) : undefined);
	const slug = uniqueSlug(
		desired,
		taken.map((r) => r.slug)
	);

	// --- Statut et date de parution ------------------------------------------
	// `published` = validé par la rédaction ; `publishedAt` = date d'entrée en
	// ligne. Un article programmé est donc « published » avec une date future :
	// il sort seul à la revalidation, sans tâche planifiée (cf. publicPostFilter).
	const status = data.status;
	const now = new Date();
	let publishedAt: Date | null = null;
	if (status !== "draft") {
		const parsedDate = data.publishedAt ? new Date(data.publishedAt) : null;
		const valid = parsedDate && !Number.isNaN(parsedDate.getTime());
		publishedAt = valid ? parsedDate : now;
		if (status === "scheduled" && (!valid || parsedDate.getTime() <= now.getTime())) {
			return {
				ok: false,
				error: "Un article programmé demande une date de publication dans le futur.",
			};
		}
	}

	const excerpt = nullify(data.excerpt) ?? autoExcerpt(rendered.text);
	const stats = computeReadingStats(rendered.text);

	const values = {
		title: data.title,
		slug,
		excerpt,
		// `body` conserve le texte brut : recherche, repli d'affichage et
		// compatibilité avec les articles Markdown antérieurs à l'éditeur riche.
		body: rendered.text,
		contentJson: doc,
		contentHtml: rendered.html,
		cover: safeUrl(data.cover),
		coverAlt: nullify(data.coverAlt),
		coverCaption: nullify(data.coverCaption),
		tags: normalizeTags(data.tags),
		status,
		published: status !== "draft",
		publishedAt,
		featured: data.featured,
		seoTitle: nullify(data.seoTitle),
		seoDescription: nullify(data.seoDescription),
		ogImage: safeUrl(data.ogImage),
		canonicalUrl: safeUrl(data.canonicalUrl),
		noindex: data.noindex,
		readingMinutes: stats.readingMinutes,
		wordCount: stats.wordCount,
		updatedAt: now,
	};

	let id = data.id ?? "";
	if (id) {
		await db.update(posts).set(values).where(eq(posts.id, id));
	} else {
		const [created] = await db
			.insert(posts)
			.values({ ...values, authorId: me.user.id })
			.returning({ id: posts.id });
		id = created.id;
	}

	revalidateArticleRoutes(slug);
	return { ok: true, id, slug };
}

/** Bascule rapide publié/brouillon depuis la liste, sans ouvrir l'éditeur. */
export async function togglePostPublished(id: string): Promise<void> {
	await requireAdmin();
	const post = await db.query.posts.findFirst({ where: eq(posts.id, id) });
	if (!post) return;

	const nowPublished = !post.published;
	await db
		.update(posts)
		.set({
			published: nowPublished,
			status: nowPublished ? "published" : "draft",
			// Première mise en ligne : on fige la date de parution maintenant.
			publishedAt: nowPublished ? (post.publishedAt ?? new Date()) : post.publishedAt,
			updatedAt: new Date(),
		})
		.where(eq(posts.id, id));

	revalidateArticleRoutes(post.slug);
}

export async function deletePost(formData: FormData): Promise<void> {
	await requireAdmin();
	const id = String(formData.get("id") ?? "").trim();
	if (!id) return;
	const post = await db.query.posts.findFirst({ where: eq(posts.id, id) });
	await db.delete(posts).where(eq(posts.id, id));
	revalidateArticleRoutes(post?.slug);
	redirect("/admin/posts");
}

/**
 * Disponibilité d'un slug — alimente le témoin temps réel de l'éditeur, pour que
 * l'admin voie le conflit AVANT d'enregistrer (et non un slug silencieusement
 * suffixé après coup).
 */
export async function checkSlug(
	slug: string,
	currentId?: string
): Promise<{ available: boolean; normalized: string }> {
	await requireAdmin();
	const normalized = slugify(slug);
	if (!normalized) return { available: false, normalized };

	const clash = await db.query.posts.findFirst({
		where: currentId
			? and(eq(posts.slug, normalized), ne(posts.id, currentId))
			: eq(posts.slug, normalized),
		columns: { id: true },
	});
	return { available: !clash, normalized };
}

/** Purge le cache de toutes les surfaces qui affichent des articles. */
function revalidateArticleRoutes(slug?: string | null): void {
	revalidatePath("/admin/posts");
	revalidatePath("/actualites");
	revalidatePath("/"); // la home affiche les derniers articles
	revalidatePath("/sitemap.xml");
	if (slug) {
		revalidatePath(`/actualites/${slug}`);
		revalidatePath(`/post/${slug}`); // ancienne URL, redirigée en 308
	}
}
