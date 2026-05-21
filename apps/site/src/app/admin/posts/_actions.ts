"use server";

import { db } from "@/lib/db";
import { posts } from "@/db/schema";
import { requireAdmin } from "@/lib/session";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

function slugify(s: string): string {
	return s
		.toLowerCase()
		.normalize("NFD")
		.replace(/[̀-ͯ]/g, "")
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-+|-+$/g, "")
		.slice(0, 80);
}

export async function savePost(formData: FormData) {
	const me = await requireAdmin();
	const id = String(formData.get("id") ?? "").trim();
	const title = String(formData.get("title") ?? "").trim();
	const slug = String(formData.get("slug") ?? "").trim() || slugify(title);
	const excerpt = String(formData.get("excerpt") ?? "").trim();
	const body = String(formData.get("body") ?? "").trim();
	const cover = String(formData.get("cover") ?? "").trim() || null;
	const published = formData.get("published") === "on";

	if (!title || !slug || !excerpt || !body) {
		throw new Error("Titre, slug, extrait et contenu sont requis.");
	}

	if (id) {
		await db
			.update(posts)
			.set({
				title,
				slug,
				excerpt,
				body,
				cover,
				published,
				updatedAt: new Date(),
			})
			.where(eq(posts.id, id));
	} else {
		await db
			.insert(posts)
			.values({
				title,
				slug,
				excerpt,
				body,
				cover,
				published,
				authorId: me.user.id,
			});
	}

	revalidatePath("/admin/posts");
	revalidatePath("/actualites");
	revalidatePath("/");
	redirect("/admin/posts");
}

export async function deletePost(formData: FormData) {
	await requireAdmin();
	const id = String(formData.get("id") ?? "").trim();
	if (id) await db.delete(posts).where(eq(posts.id, id));
	revalidatePath("/admin/posts");
	revalidatePath("/actualites");
	redirect("/admin/posts");
}
