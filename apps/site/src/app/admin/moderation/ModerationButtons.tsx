"use client";

import { useTransition } from "react";
import {
	deleteWarnAction,
	clearUserWarnsAction,
	unjailAction,
} from "./_actions";

export function DeleteWarnButton({ id }: { id: number }) {
	const [pending, start] = useTransition();
	return (
		<button
			type="button"
			disabled={pending}
			onClick={() =>
				start(async () => {
					if (!confirm(`Annuler warn #${id} ?`)) return;
					await deleteWarnAction(id);
				})
			}
			className="px-2 py-1 text-[10px] uppercase tracking-widest border border-red-400/50 text-red-300 hover:bg-red-500/10 rounded"
		>
			✗
		</button>
	);
}

export function ClearWarnsButton({ userId }: { userId: string }) {
	const [pending, start] = useTransition();
	return (
		<button
			type="button"
			disabled={pending}
			onClick={() =>
				start(async () => {
					if (!confirm(`Effacer TOUS les warns de ${userId} ?`)) return;
					await clearUserWarnsAction(userId);
				})
			}
			className="px-2 py-1 text-[10px] uppercase tracking-widest border border-fuchsia-400/50 text-fuchsia-300 hover:bg-fuchsia-500/10 rounded"
		>
			Clear all
		</button>
	);
}

export function UnjailButton({ userId }: { userId: string }) {
	const [pending, start] = useTransition();
	return (
		<button
			type="button"
			disabled={pending}
			onClick={() =>
				start(async () => {
					if (!confirm(`Libérer ${userId} ?`)) return;
					await unjailAction(userId);
				})
			}
			className="px-2 py-1 text-[10px] uppercase tracking-widest border border-cyan-400/50 text-cyan-300 hover:bg-cyan-500/10 rounded"
		>
			🔓 Libérer
		</button>
	);
}
