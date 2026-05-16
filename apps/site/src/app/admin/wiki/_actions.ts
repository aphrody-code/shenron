"use server";

import { auth } from "@/lib/auth";
import { db, schema } from "@/lib/db";
import { and, eq } from "drizzle-orm";
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
