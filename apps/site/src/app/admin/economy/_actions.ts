"use server";

import { botAdmin } from "@/lib/bot-admin";
import { requireAdmin } from "@/lib/session";
import { revalidatePath } from "next/cache";

export async function giveZeniAction(
	userId: string,
	amount: number,
	reason?: string,
) {
	await requireAdmin();
	if (!/^\d{17,20}$/.test(userId)) {
		return { ok: false as const, error: "userId Discord invalide" };
	}
	if (!Number.isFinite(amount) || amount === 0) {
		return { ok: false as const, error: "amount ≠ 0 requis" };
	}
	try {
		await botAdmin.economyGive(userId, amount, reason);
		revalidatePath("/admin/economy");
		return { ok: true as const };
	} catch (err) {
		return {
			ok: false as const,
			error: err instanceof Error ? err.message : "erreur",
		};
	}
}
