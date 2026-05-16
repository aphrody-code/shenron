"use client";

import { useTransition } from "react";
import { closeTicketAction } from "./_actions";

export function CloseTicketButton({ channelId }: { channelId: string }) {
	const [pending, start] = useTransition();
	return (
		<button
			type="button"
			disabled={pending}
			onClick={() =>
				start(async () => {
					if (!confirm(`Fermer le ticket ${channelId} ?`)) return;
					await closeTicketAction(channelId);
				})
			}
			className="px-2 py-1 text-[10px] uppercase tracking-widest border border-red-400/50 text-red-300 hover:bg-red-500/10 rounded"
		>
			🔒 Fermer
		</button>
	);
}
