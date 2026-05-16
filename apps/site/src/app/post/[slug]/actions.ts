"use server";

import { db } from "@/lib/db";
import { comments, posts } from "@/db/schema";
import { requireUser } from "@/lib/session";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

const MAX_LEN = 2000;

export async function postCommentAction(
	slug: string,
	formData: FormData,
): Promise<{ ok: boolean; error?: string }> {
	const body = String(formData.get("body") ?? "").trim();
	if (!body) return { ok: false, error: "Commentaire vide" };
	if (body.length > MAX_LEN) {
		return { ok: false, error: `Trop long (max ${MAX_LEN} caractères)` };
	}

	const me = await requireUser(`/post/${slug}`);
	if (!me.user) return { ok: false, error: "Profil utilisateur introuvable" };

	const post = await db.query.posts.findFirst({
		where: eq(posts.slug, slug),
		columns: { id: true },
	});
	if (!post) return { ok: false, error: "Article introuvable" };

	await db.insert(comments).values({
		postId: post.id,
		authorId: me.user.id,
		body,
	});

	revalidatePath(`/post/${slug}`);
	return { ok: true };
}
