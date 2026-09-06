"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

/**
 * La page reste un Server Component pour lire PostgreSQL et les manifests
 * Aphrody. Ce petit client ne fait qu'observer la mesure JSON et demander un
 * nouveau rendu quand un chiffre a effectivement changé.
 */
export function DatabooksLiveRefresh() {
	const router = useRouter();
	const [etat, setEtat] = useState<"live" | "indisponible">("live");

	useEffect(() => {
		let precedent = "";
		let monte = true;

		const sonder = async () => {
			try {
				const response = await fetch("/api/admin/databooks/status", {
					cache: "no-store",
					headers: { accept: "application/json" },
				});
				if (!response.ok) throw new Error(`HTTP ${response.status}`);
				const corps = await response.text();
				if (precedent && precedent !== corps) router.refresh();
				precedent = corps;
				if (monte) setEtat("live");
			} catch {
				if (monte) setEtat("indisponible");
			}
		};

		void sonder();
		const intervalle = window.setInterval(sonder, 5_000);
		return () => {
			monte = false;
			window.clearInterval(intervalle);
		};
	}, [router]);

	return (
		<span
			className={`text-[10px] font-bold uppercase tracking-wider ${etat === "live" ? "text-green-300" : "text-amber-300"}`}
		>
			{etat === "live" ? "● live · 5 s" : "● live indisponible"}
		</span>
	);
}
