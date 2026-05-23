"use server";

import { auth } from "@/lib/auth";
import { db, schema } from "@/lib/db";
import { assetUrl } from "@/lib/db-universe";
import { env } from "@/lib/env";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

async function requireAdmin() {
	const session = await auth.api.getSession({
		headers: await headers(),
	});
	if (!session?.user) redirect("/signin");

	const account = await db.query.baAccount.findFirst({
		where: (acc, { eq }) => eq(acc.userId, session.user.id),
	});

	const discordId = account?.accountId;
	const user = await db.query.users.findFirst({
		where: (u, { eq }) => eq(u.discordId, discordId ?? ""),
	});
	if (!user?.roleAdmin) redirect("/");
	return user;
}

function slugify(s: string): string {
	return s
		.normalize("NFD")
		.replace(/\p{Diacritic}/gu, "")
		.replace(/[^a-zA-Z0-9]+/g, "-")
		.toLowerCase()
		.replace(/^-+|-+$/g, "");
}

export async function createCategory(formData: FormData) {
	await requireAdmin();
	const name = String(formData.get("name") ?? "").trim();
	const parentId = String(formData.get("parentId") ?? "") || null;
	const order = Number(formData.get("order") ?? 0);
	if (!name) return;
	const slug = slugify(name);
	await db
		.insert(schema.wikiCategories)
		.values({ name, slug, parentId, order });
	revalidatePath("/admin/wiki");
	revalidatePath("/wiki");
	redirect("/admin/wiki");
}

export async function updateCategory(id: string, formData: FormData) {
	await requireAdmin();
	const name = String(formData.get("name") ?? "").trim();
	const parentId = String(formData.get("parentId") ?? "") || null;
	const order = Number(formData.get("order") ?? 0);
	if (!name) return;
	const slug = slugify(name);
	await db
		.update(schema.wikiCategories)
		.set({ name, slug, parentId, order })
		.where(eq(schema.wikiCategories.id, id));
	revalidatePath("/admin/wiki");
	revalidatePath("/wiki");
	redirect("/admin/wiki");
}

export async function deleteCategory(id: string) {
	await requireAdmin();
	await db
		.delete(schema.wikiCategories)
		.where(eq(schema.wikiCategories.id, id));
	revalidatePath("/admin/wiki");
	revalidatePath("/wiki");
	redirect("/admin/wiki");
}

export async function createPage(formData: FormData) {
	await requireAdmin();
	const title = String(formData.get("title") ?? "").trim();
	const categoryId = String(formData.get("categoryId") ?? "");
	const body = String(formData.get("body") ?? "");
	const order = Number(formData.get("order") ?? 0);
	if (!title || !categoryId) return;
	const slug = slugify(title);
	await db.insert(schema.wikiPages).values({
		title,
		slug,
		categoryId,
		body,
		order,
		updatedAt: new Date(),
	});
	revalidatePath("/admin/wiki");
	revalidatePath("/wiki");
	redirect("/admin/wiki");
}

export async function updatePage(id: string, formData: FormData) {
	await requireAdmin();
	const title = String(formData.get("title") ?? "").trim();
	const categoryId = String(formData.get("categoryId") ?? "");
	const body = String(formData.get("body") ?? "");
	const order = Number(formData.get("order") ?? 0);
	if (!title || !categoryId) return;
	const slug = slugify(title);
	await db
		.update(schema.wikiPages)
		.set({ title, slug, categoryId, body, order, updatedAt: new Date() })
		.where(eq(schema.wikiPages.id, id));
	revalidatePath("/admin/wiki");
	revalidatePath("/wiki");
	redirect("/admin/wiki");
}

export async function deletePage(id: string) {
	await requireAdmin();
	await db.delete(schema.wikiPages).where(eq(schema.wikiPages.id, id));
	revalidatePath("/admin/wiki");
	revalidatePath("/wiki");
	redirect("/admin/wiki");
}

/**
 * Upload une image vers le bot (`POST /api/assets/upload`). Next gère le
 * multipart nativement (le proxy /api/bot-admin lit `req.text()` et corromprait
 * les bytes binaires → on passe par cette server action). Le token admin reste
 * server-only. Retourne l'URL CDN absolue à insérer dans le markdown.
 */
export async function uploadWikiImage(
	formData: FormData,
): Promise<{ url: string } | { error: string }> {
	await requireAdmin();
	const file = formData.get("file");
	if (!(file instanceof File) || file.size === 0) {
		return { error: "Aucun fichier" };
	}
	const token = env.SHENRON_ADMIN_TOKEN;
	if (!token) return { error: "SHENRON_ADMIN_TOKEN absent côté site" };

	const upstream = new FormData();
	upstream.append("file", file, file.name);
	try {
		const res = await fetch(`${env.SHENRON_API_URL}/api/assets/upload`, {
			method: "POST",
			headers: { authorization: `Bearer ${token}` },
			body: upstream,
			cache: "no-store",
		});
		const data = (await res.json().catch(() => null)) as {
			path?: string;
			error?: string;
		} | null;
		if (!res.ok || !data?.path) {
			return { error: data?.error ?? `Upload échoué (${res.status})` };
		}
		return { url: assetUrl(data.path) };
	} catch (err) {
		return { error: err instanceof Error ? err.message : "Upload échoué" };
	}
}
