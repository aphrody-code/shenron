"use server";

import { botAdmin } from "@/lib/bot-admin";
import { requireAdmin } from "@/lib/session";
import { revalidatePath } from "next/cache";

type PermInput = {
	command: string;
	scope: string;
	roleId?: string | null;
	userId?: string | null;
	allow: boolean;
};

export async function upsertPerm(input: PermInput) {
	await requireAdmin();
	if (!input.command || !input.scope) {
		return { ok: false as const, error: "command + scope requis" };
	}
	try {
		await botAdmin.commandPerms.upsert(input);
		revalidatePath("/admin/command-perms");
		return { ok: true as const };
	} catch (err) {
		return {
			ok: false as const,
			error: err instanceof Error ? err.message : "erreur",
		};
	}
}

export async function removePerm(input: Omit<PermInput, "allow">) {
	await requireAdmin();
	try {
		await botAdmin.commandPerms.remove(input);
		revalidatePath("/admin/command-perms");
		return { ok: true as const };
	} catch (err) {
		return {
			ok: false as const,
			error: err instanceof Error ? err.message : "erreur",
		};
	}
}
