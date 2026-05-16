"use server";

import { botAdmin } from "@/lib/bot-admin";
import { requireAdmin } from "@/lib/session";
import { revalidatePath } from "next/cache";

export async function setCronInterval(name: string, intervalMs: number) {
	await requireAdmin();
	if (!Number.isFinite(intervalMs) || intervalMs < 1000) {
		return { ok: false as const, error: "intervalMs >= 1000" };
	}
	try {
		await botAdmin.cronSetInterval(name, intervalMs);
		revalidatePath("/admin/cron");
		return { ok: true as const };
	} catch (err) {
		return {
			ok: false as const,
			error: err instanceof Error ? err.message : "erreur",
		};
	}
}
