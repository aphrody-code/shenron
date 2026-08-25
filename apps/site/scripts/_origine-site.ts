/**
 * Origine HTTP du site, résolue depuis le **slot bleu/vert réellement en ligne**.
 *
 * Les scripts d'ops (dépôt de transcriptions, corrections OCR) écrivent par
 * l'API du site en loopback. Coder `127.0.0.1:3000` en dur les a cassés le jour
 * où le déploiement bleu/vert a basculé le trafic sur le slot B (`:3010`) :
 * chaque dépôt sortait en « Unable to connect » alors que le site était debout.
 * Le seul endroit qui sait quel slot sert est le fichier d'amont que génère
 * `scripts/ops/deploy-site.ts` — on le lit, et on ne devine qu'à défaut.
 */
import { readFileSync } from "node:fs";

const AMONT = "/etc/nginx/shenron-upstreams/shenron_site.conf";

/** Port du slot en ligne, lu dans l'amont nginx ; `null` si illisible. */
function portDuSlotActif(): number | null {
	try {
		const conf = readFileSync(AMONT, "utf8");
		const m = conf.match(/^\s*server\s+127\.0\.0\.1:(\d+)/m);
		return m ? Number(m[1]) : null;
	} catch {
		return null;
	}
}

/**
 * Base d'API à utiliser. `$DATABOOKS_API_BASE` reste prioritaire (tests, preview,
 * dépôt depuis un poste distant vers `https://dragonballfr.com`).
 */
export function origineSite(): string {
	const forcee = process.env.DATABOOKS_API_BASE?.trim();
	if (forcee) return forcee.replace(/\/$/, "");
	return `http://127.0.0.1:${portDuSlotActif() ?? 3000}`;
}
