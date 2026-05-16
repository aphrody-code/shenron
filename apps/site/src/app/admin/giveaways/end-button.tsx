"use client";
import { useTransition } from "react";
import { useRouter } from "next/navigation";

export function EndGiveawayButton({ id }: { id: number }) {
	const router = useRouter();
	const [pending, start] = useTransition();
	return (
		<button
			onClick={() =>
				start(async () => {
					if (!confirm(`Terminer le giveaway #${id} et tirer au sort ?`))
						return;
					await fetch(`/api/bot-admin/giveaways/${id}/end`, { method: "POST" });
					router.refresh();
				})
			}
			disabled={pending}
			className="px-4 py-2 font-saiyan uppercase text-sm border-2 bg-red-500/20 text-red-400 border-red-500 hover:bg-red-500 hover:text-white transition-colors disabled:opacity-50"
		>
			{pending ? "..." : "Terminer + tirer"}
		</button>
	);
}
