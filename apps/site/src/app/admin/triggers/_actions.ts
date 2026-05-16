"use server";

import { botAdmin } from "@/lib/bot-admin";
import { requireAdmin } from "@/lib/session";
import { revalidatePath } from "next/cache";

export type TriggerInput = {
	code: string;
	description?: string | null;
	pattern: string;
	flags?: string;
	enabled?: boolean;
};

export async function createTrigger(input: TriggerInput) {
	await requireAdmin();
	try {
		await botAdmin.triggers.create(input);
		revalidatePath("/admin/triggers");
		return { ok: true as const };
	} catch (err) {
		return {
			ok: false as const,
			error: err instanceof Error ? err.message : "erreur",
		};
	}
}

export async function updateTrigger(
	code: string,
	patch: Partial<TriggerInput>,
) {
	await requireAdmin();
	try {
		await botAdmin.triggers.update(code, patch);
		revalidatePath("/admin/triggers");
		return { ok: true as const };
	} catch (err) {
		return {
			ok: false as const,
			error: err instanceof Error ? err.message : "erreur",
		};
	}
}

export async function deleteTrigger(code: string) {
	await requireAdmin();
	try {
		await botAdmin.triggers.remove(code);
		revalidatePath("/admin/triggers");
		return { ok: true as const };
	} catch (err) {
		return {
			ok: false as const,
			error: err instanceof Error ? err.message : "erreur",
		};
	}
}
