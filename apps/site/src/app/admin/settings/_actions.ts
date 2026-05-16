"use server";

import { botAdmin } from "@/lib/bot-admin";
import { requireAdmin } from "@/lib/session";
import { revalidatePath } from "next/cache";

export async function setSetting(key: string, value: string) {
	await requireAdmin();
	try {
		await botAdmin.settingsSet(key, value);
		revalidatePath("/admin/settings");
		return { ok: true as const };
	} catch (err) {
		return {
			ok: false as const,
			error: err instanceof Error ? err.message : "erreur",
		};
	}
}

export async function unsetSetting(key: string) {
	await requireAdmin();
	try {
		await botAdmin.settingsUnset(key);
		revalidatePath("/admin/settings");
		return { ok: true as const };
	} catch (err) {
		return {
			ok: false as const,
			error: err instanceof Error ? err.message : "erreur",
		};
	}
}
