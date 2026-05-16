"use server";

import { botAdmin } from "@/lib/bot-admin";
import { requireAdmin } from "@/lib/session";
import { revalidatePath } from "next/cache";

export async function createWebhook(channelId: string, name: string) {
	await requireAdmin();
	try {
		await botAdmin.webhooksCreate({ channel_id: channelId, name });
		revalidatePath("/admin/webhooks");
		return { ok: true as const };
	} catch (err) {
		return {
			ok: false as const,
			error: err instanceof Error ? err.message : "erreur",
		};
	}
}

export async function deleteWebhook(id: string) {
	await requireAdmin();
	try {
		await botAdmin.webhooksDelete(id);
		revalidatePath("/admin/webhooks");
		return { ok: true as const };
	} catch (err) {
		return {
			ok: false as const,
			error: err instanceof Error ? err.message : "erreur",
		};
	}
}

export async function executeWebhook(
	url: string,
	content: string,
	username?: string,
) {
	await requireAdmin();
	try {
		await botAdmin.webhooksExecute({
			url,
			content,
			username: username || undefined,
		});
		return { ok: true as const };
	} catch (err) {
		return {
			ok: false as const,
			error: err instanceof Error ? err.message : "erreur",
		};
	}
}
