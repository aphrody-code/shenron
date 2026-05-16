"use server";

import { botAdmin } from "@/lib/bot-admin";
import { requireAdmin } from "@/lib/session";
import { revalidatePath } from "next/cache";

export async function closeTicketAction(channelId: string) {
	await requireAdmin();
	try {
		await botAdmin.ticketsClose(channelId);
		revalidatePath("/admin/tickets");
		return { ok: true as const };
	} catch (err) {
		return {
			ok: false as const,
			error: err instanceof Error ? err.message : "erreur",
		};
	}
}
