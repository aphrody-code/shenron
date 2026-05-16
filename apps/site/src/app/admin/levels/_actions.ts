"use server";

import { botAdmin } from "@/lib/bot-admin";
import { requireAdmin } from "@/lib/session";
import { revalidatePath } from "next/cache";

export async function upsertRewardAction(input: {
	level: number;
	roleId: string;
	xpThreshold: number;
	zeniBonus?: number;
}) {
	await requireAdmin();
	if (!Number.isInteger(input.level) || input.level < 1) {
		return { ok: false as const, error: "level entier ≥ 1" };
	}
	if (!/^\d{17,20}$/.test(input.roleId)) {
		return { ok: false as const, error: "roleId Discord invalide" };
	}
	try {
		await botAdmin.levelsRewardUpsert(input);
		revalidatePath("/admin/levels");
		return { ok: true as const };
	} catch (err) {
		return {
			ok: false as const,
			error: err instanceof Error ? err.message : "erreur",
		};
	}
}

export async function removeRewardAction(level: number) {
	await requireAdmin();
	try {
		await botAdmin.levelsRewardRemove(level);
		revalidatePath("/admin/levels");
		return { ok: true as const };
	} catch (err) {
		return {
			ok: false as const,
			error: err instanceof Error ? err.message : "erreur",
		};
	}
}
