"use server";

import { botAdmin } from "@/lib/bot-admin";
import { requireAdmin } from "@/lib/session";
import { revalidatePath } from "next/cache";

export async function upsertMessage(
	event: string,
	body: {
		template?: string | null;
		channelKey?: string | null;
		enabled?: boolean;
	},
) {
	await requireAdmin();
	try {
		await botAdmin.messagesUpsert(event, body);
		revalidatePath("/admin/messages");
		return { ok: true as const };
	} catch (err) {
		return {
			ok: false as const,
			error: err instanceof Error ? err.message : "erreur",
		};
	}
}

export async function resetMessage(event: string) {
	await requireAdmin();
	try {
		await botAdmin.messagesRemove(event);
		revalidatePath("/admin/messages");
		return { ok: true as const };
	} catch (err) {
		return {
			ok: false as const,
			error: err instanceof Error ? err.message : "erreur",
		};
	}
}

export async function previewMessage(
	event: string,
	params?: Record<string, unknown>,
) {
	await requireAdmin();
	try {
		const r = await botAdmin.messagesPreview(event, params);
		return {
			ok: true as const,
			preview: (r.rendered ?? r.preview ?? JSON.stringify(r)) as string,
		};
	} catch (err) {
		return {
			ok: false as const,
			error: err instanceof Error ? err.message : "erreur",
		};
	}
}
