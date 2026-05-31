"use client";

/**
 * ConsentGate — bannière de consentement RGPD minimale (cible France/UE).
 *
 * Affichée tant que l'utilisateur n'a pas tranché ET que le navigateur n'envoie
 * pas Do-Not-Track (DNT = refus implicite, on ne demande rien). Le choix est
 * stocké côté client (`consent.ts` → localStorage) et propagé :
 *   - au Consent Mode v2 de Google (GTM) via `gtag('consent','update',…)`,
 *   - à la télémétrie first-party + Vercel Analytics (qui no-op sans accord).
 *
 * Le strictement nécessaire (auth, sécurité) n'est jamais conditionné — seules
 * la mesure d'audience et la personnalisation le sont.
 *
 * Îlot client léger : aucune dépendance lourde, monté en bas de page.
 */
import { useEffect, useState } from "react";
import { getConsent, setConsent } from "@/lib/consent";

function isDoNotTrack(): boolean {
	if (typeof navigator === "undefined") return false;
	const nav = navigator as Navigator & {
		doNotTrack?: string;
		msDoNotTrack?: string;
	};
	const dnt =
		nav.doNotTrack ??
		(window as unknown as { doNotTrack?: string }).doNotTrack ??
		nav.msDoNotTrack;
	return dnt === "1" || dnt === "yes";
}

export function ConsentGate() {
	const [visible, setVisible] = useState(false);

	useEffect(() => {
		// DNT actif → on respecte le refus implicite, pas de bannière.
		if (isDoNotTrack()) return;
		// Choix déjà fait → rien à afficher.
		if (getConsent().decided) return;
		setVisible(true);
	}, []);

	if (!visible) return null;

	const accept = () => {
		setConsent(true);
		setVisible(false);
	};
	const decline = () => {
		setConsent(false);
		setVisible(false);
	};

	return (
		<div
			role="dialog"
			aria-label="Préférences de confidentialité"
			aria-live="polite"
			className="fixed bottom-4 right-4 left-4 md:left-auto md:right-6 md:bottom-6 z-[60] max-w-md mx-auto md:mx-0 reveal-up"
		>
			<div className="dbz-panel p-5 border-2 border-dbz-orange/40 bg-dbz-card/95 backdrop-blur-sm shadow-2xl">
				<p className="text-sm font-bold text-white uppercase tracking-widest mb-2 font-display">
					Mesure d'audience
				</p>
				<p className="text-xs text-white/70 leading-relaxed mb-4 font-sans">
					On utilise une mesure d'audience anonymisée pour améliorer le wiki et
					te proposer des recommandations pertinentes. Aucune adresse IP brute
					n'est conservée. Tu peux refuser : l'essentiel du site fonctionne sans.
				</p>
				<div className="flex gap-3">
					<button
						type="button"
						onClick={accept}
						className="dbz-button !py-2 !px-4 !text-xs flex-1"
					>
						Accepter
					</button>
					<button
						type="button"
						onClick={decline}
						className="!py-2 !px-4 text-xs font-bold uppercase tracking-widest text-white/60 hover:text-white border border-dbz-border hover:border-white/40 transition-colors flex-1"
					>
						Refuser
					</button>
				</div>
			</div>
		</div>
	);
}
