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
import { getConsent, setConsent, setConsentFromCmp } from "@/lib/consent";

/**
 * API IAB TCF v2.2, exposée par un CMP certifié — chez nous « Confidentialité et
 * messages » d'AdSense (Funding Choices), chargé par `adsbygoogle.js`.
 */
type TcfApi = (
	command: "addEventListener" | "removeEventListener",
	version: 2,
	callback: (tcData: TcData, success: boolean) => void,
	listenerId?: number
) => void;

interface TcData {
	eventStatus?: string;
	gdprApplies?: boolean;
	listenerId?: number;
	purpose?: { consents?: Record<number, boolean> };
}

/**
 * Délai laissé au CMP pour s'annoncer avant de retomber sur notre bannière, et
 * fenêtre pendant laquelle on continue de le guetter. Le stub `__tcfapi` n'est
 * posé qu'après le chargement réseau d'`adsbygoogle.js` : sur connexion lente il
 * peut arriver bien après notre montage. On affiche donc notre bannière au bout
 * de `CMP_WAIT_MS`, mais on continue de surveiller jusqu'à `CMP_WATCH_MS` — si
 * le CMP finit par apparaître, on retire la nôtre plutôt que d'empiler deux
 * demandes de consentement contradictoires.
 */
const CMP_WAIT_MS = 2500;
const CMP_WATCH_MS = 10_000;

function isDoNotTrack(): boolean {
	if (typeof navigator === "undefined") return false;
	const nav = navigator as Navigator & {
		doNotTrack?: string;
		msDoNotTrack?: string;
	};
	const dnt =
		nav.doNotTrack ?? (window as unknown as { doNotTrack?: string }).doNotTrack ?? nav.msDoNotTrack;
	return dnt === "1" || dnt === "yes";
}

export function ConsentGate() {
	const [visible, setVisible] = useState(false);

	useEffect(() => {
		// DNT actif → on respecte le refus implicite, pas de bannière.
		if (isDoNotTrack()) return;
		// Choix déjà fait → rien à afficher.
		if (getConsent().decided) return;

		// --- Priorité au CMP certifié -------------------------------------------
		// AdSense n'a le droit de diffuser dans l'EEE/UK que si le consentement
		// publicitaire vient d'un CMP **certifié Google** parlant IAB TCF. Notre
		// bannière maison ne l'est pas : quand le CMP d'AdSense est actif, il prend
		// la main et l'on ne montre PAS un second bandeau par-dessus (deux
		// demandes de consentement concurrentes = choix incohérents côté Google,
		// et un mur de bandeaux côté visiteur).
		let listenerId: number | undefined;
		let timer: ReturnType<typeof setTimeout> | undefined;
		let poll: ReturnType<typeof setInterval> | undefined;
		let settled = false;

		const tcfApi = (): TcfApi | undefined => (window as unknown as { __tcfapi?: TcfApi }).__tcfapi;

		const attach = (api: TcfApi): void => {
			settled = true;
			// Le CMP certifié prend la main : notre bannière disparaît, même si elle
			// avait déjà été affichée pendant l'attente.
			setVisible(false);
			api("addEventListener", 2, (tcData, success) => {
				if (!success || !tcData) return;
				listenerId = tcData.listenerId ?? listenerId;
				// `cmpuishown` = bandeau du CMP à l'écran, le visiteur n'a pas
				// encore tranché : on attend, sans afficher le nôtre.
				if (tcData.eventStatus !== "tcloaded" && tcData.eventStatus !== "useractioncomplete") {
					return;
				}
				// Hors périmètre RGPD → le CMP ne demande rien ; on retombe sur notre
				// bannière pour la mesure d'audience (posture opt-in stricte).
				if (tcData.gdprApplies === false) {
					setVisible(true);
					return;
				}
				const consents = tcData.purpose?.consents ?? {};
				// Finalité 1 = stockage/accès sur l'appareil, finalité 8 = mesure de
				// la performance des contenus : le couple qui conditionne notre
				// télémétrie. Les finalités publicitaires restent gérées par le CMP.
				setConsentFromCmp(consents[1] === true && consents[8] === true);
			});
		};

		const existing = tcfApi();
		if (existing) {
			attach(existing);
		} else {
			// Le stub `__tcfapi` est posé par le script AdSense, donc après notre
			// montage : on le guette brièvement avant de conclure à son absence.
			const startedAt = performance.now();
			poll = setInterval(() => {
				if (settled) return;
				const api = tcfApi();
				if (api) {
					if (poll) clearInterval(poll);
					attach(api);
					return;
				}
				// Fin de la fenêtre de surveillance : plus aucun CMP n'est attendu.
				if (performance.now() - startedAt >= CMP_WATCH_MS && poll) clearInterval(poll);
			}, 150);
			timer = setTimeout(() => {
				// Pas (encore) de CMP certifié → notre bannière prend le relais ; la
				// surveillance continue et la retirera si le CMP finit par arriver.
				if (!settled) setVisible(true);
			}, CMP_WAIT_MS);
		}

		return () => {
			if (poll) clearInterval(poll);
			if (timer) clearTimeout(timer);
			if (listenerId !== undefined) {
				tcfApi()?.("removeEventListener", 2, () => {}, listenerId);
			}
		};
	}, []);

	// Marque le document tant que le bandeau occupe le bas de l'écran. Sur mobile
	// il s'étend sur toute la largeur à `bottom-24` et recouvrait les boutons
	// flottants « Signaler » et « Discord » — quatre calques se disputaient le même
	// coin. La règle CSS `html[data-consent-open]` (globals.css) efface les FAB
	// secondaires le temps du choix, qui est de toute façon ponctuel.
	useEffect(() => {
		if (!visible) return;
		document.documentElement.setAttribute("data-consent-open", "");
		return () => document.documentElement.removeAttribute("data-consent-open");
	}, [visible]);

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
			className="fixed bottom-24 right-4 left-4 md:left-auto md:right-6 md:bottom-24 z-[60] max-w-md mx-auto md:mx-0 reveal-up"
		>
			<div className="dbz-panel p-5 border-2 border-dbz-orange/40 bg-dbz-card/95 backdrop-blur-sm shadow-2xl">
				<p className="text-sm font-bold text-white uppercase tracking-widest mb-2 font-display">
					Mesure d'audience
				</p>
				<p className="text-xs text-white/70 leading-relaxed mb-4 font-sans">
					On utilise une mesure d'audience anonymisée pour améliorer le wiki et te proposer des
					recommandations pertinentes. Aucune adresse IP brute n'est conservée. Tu peux refuser :
					l'essentiel du site fonctionne sans.
				</p>
				<div className="flex gap-3">
					<button type="button" onClick={accept} className="dbz-button !py-2 !px-4 !text-xs flex-1">
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
