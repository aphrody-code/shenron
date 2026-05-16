"use server";

import { botAdmin } from "@/lib/bot-admin";
import { requireAdmin } from "@/lib/session";
import { revalidatePath } from "next/cache";

export async function giveZeniAction(input: {
	mode: "user" | "role" | "all";
	userId?: string;
	roleId?: string;
	amount: number;
	reason?: string;
}) {
	await requireAdmin();
	if (!Number.isFinite(input.amount) || input.amount === 0) {
		return { ok: false as const, error: "amount ≠ 0 requis" };
	}
	if (input.mode === "user" && !/^\d{17,20}$/.test(input.userId ?? "")) {
		return { ok: false as const, error: "userId Discord invalide" };
	}
	if (input.mode === "role" && !/^\d{17,20}$/.test(input.roleId ?? "")) {
		return { ok: false as const, error: "roleId Discord invalide" };
	}
	try {
		const r = await botAdmin.economyGiveBulk({
			mode: input.mode,
			userId: input.userId,
			roleId: input.roleId,
			amount: input.amount,
			reason: input.reason,
		});
		revalidatePath("/admin/economy");
		return { ok: true as const, applied: r.applied };
	} catch (err) {
		return {
			ok: false as const,
			error: err instanceof Error ? err.message : "erreur",
		};
	}
}
