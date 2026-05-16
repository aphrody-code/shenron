"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

export function CronTriggerButton({ name }: { name: string }) {
	const router = useRouter();
	const [pending, start] = useTransition();
	const [status, setStatus] = useState<"idle" | "ok" | "err">("idle");

	function trigger() {
		start(async () => {
			try {
				const res = await fetch(
					`/api/bot-admin/cron/${encodeURIComponent(name)}/trigger`,
					{
						method: "POST",
					},
				);
				setStatus(res.ok ? "ok" : "err");
				router.refresh();
				setTimeout(() => setStatus("idle"), 2500);
			} catch {
				setStatus("err");
			}
		});
	}

	return (
		<button
			onClick={trigger}
			disabled={pending}
			className={`px-3 py-1 text-xs font-saiyan uppercase tracking-wider border-2 transition-all ${
				status === "ok"
					? "bg-green-500/20 text-green-500 border-green-500"
					: status === "err"
						? "bg-red-500/20 text-red-500 border-red-500"
						: "bg-dbz-blue text-white border-dbz-blue-light hover:bg-dbz-orange hover:border-dbz-orange disabled:opacity-50"
			}`}
		>
			{pending
				? "..."
				: status === "ok"
					? "✓ OK"
					: status === "err"
						? "✗ ERR"
						: "▶ RUN"}
		</button>
	);
}
