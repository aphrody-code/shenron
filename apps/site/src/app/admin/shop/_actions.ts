"use server";

import { botAdmin } from "@/lib/bot-admin";
import { requireAdmin } from "@/lib/session";
import { revalidatePath } from "next/cache";

export type ShopItemInput = {
	key: string;
	type: "card" | "badge" | "color" | "title" | "banner";
	name: string;
	description?: string | null;
	price: number;
	role_id?: string | null;
	meta?: string | null;
	enabled?: boolean;
};

export async function createShopItem(input: ShopItemInput) {
	await requireAdmin();
	try {
		await botAdmin.shop.create(input);
		revalidatePath("/admin/shop");
		return { ok: true as const };
	} catch (err) {
		return {
			ok: false as const,
			error: err instanceof Error ? err.message : "erreur",
		};
	}
}

export async function updateShopItem(
	key: string,
	patch: Partial<ShopItemInput>,
) {
	await requireAdmin();
	try {
		await botAdmin.shop.update(key, patch);
		revalidatePath("/admin/shop");
		return { ok: true as const };
	} catch (err) {
		return {
			ok: false as const,
			error: err instanceof Error ? err.message : "erreur",
		};
	}
}

export async function deleteShopItem(key: string) {
	await requireAdmin();
	try {
		await botAdmin.shop.remove(key);
		revalidatePath("/admin/shop");
		return { ok: true as const };
	} catch (err) {
		return {
			ok: false as const,
			error: err instanceof Error ? err.message : "erreur",
		};
	}
}

export async function toggleShopItem(key: string) {
	await requireAdmin();
	try {
		const res = await botAdmin.shop.toggle(key);
		revalidatePath("/admin/shop");
		return { ok: true as const, enabled: res.enabled };
	} catch (err) {
		return {
			ok: false as const,
			error: err instanceof Error ? err.message : "erreur",
		};
	}
}
