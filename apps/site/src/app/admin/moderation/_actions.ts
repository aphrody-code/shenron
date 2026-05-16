"use server";

import { botAdmin } from "@/lib/bot-admin";
import { requireAdmin } from "@/lib/session";
import { revalidatePath } from "next/cache";

export async function deleteWarnAction(id: number) {
	await requireAdmin();
	try {
		await botAdmin.moderationActions.deleteWarn(id);
		revalidatePath("/admin/moderation");
		return { ok: true as const };
	} catch (err) {
		return {
			ok: false as const,
			error: err instanceof Error ? err.message : "erreur",
		};
	}
}

export async function clearUserWarnsAction(userId: string) {
	await requireAdmin();
	try {
		await botAdmin.moderationActions.clearWarns(userId);
		revalidatePath("/admin/moderation");
		return { ok: true as const };
	} catch (err) {
		return {
			ok: false as const,
			error: err instanceof Error ? err.message : "erreur",
		};
	}
}

export async function unjailAction(userId: string) {
	await requireAdmin();
	try {
		await botAdmin.moderationActions.unjail(userId);
		revalidatePath("/admin/moderation");
		return { ok: true as const };
	} catch (err) {
		return {
			ok: false as const,
			error: err instanceof Error ? err.message : "erreur",
		};
	}
}
