import "server-only";

/**
 * Authentification par jeton porteur pour les API d'écriture.
 *
 * Certaines routes doivent être appelables par un client HORS navigateur (outil
 * local, script d'ingest) : la session Better Auth par cookie ne s'y prête pas.
 * On accepte donc `Authorization: Bearer <jeton>`, en plus de la session admin.
 *
 * Jeton = `DATABOOKS_API_TOKEN` s'il est défini, sinon repli sur
 * `SHENRON_ADMIN_TOKEN` (déjà présent en production). Sans aucun des deux,
 * l'écriture est REFUSÉE — jamais ouverte par défaut.
 */
import { timingSafeEqual } from "node:crypto";

/** Comparaison à durée constante : une comparaison naïve fuite le préfixe. */
function egal(a: string, b: string): boolean {
	const ba = Buffer.from(a);
	const bb = Buffer.from(b);
	if (ba.length !== bb.length) return false;
	return timingSafeEqual(ba, bb);
}

/** Le jeton attendu, ou `null` si aucun n'est configuré (écriture fermée). */
export function expectedApiToken(): string | null {
	const t = (process.env.DATABOOKS_API_TOKEN ?? process.env.SHENRON_ADMIN_TOKEN ?? "").trim();
	return t.length >= 16 ? t : null;
}

/** La requête porte-t-elle un jeton porteur valide ? */
export function hasValidApiToken(req: Request): boolean {
	const attendu = expectedApiToken();
	if (!attendu) return false;
	const brut = req.headers.get("authorization") ?? "";
	const m = /^Bearer\s+(.+)$/i.exec(brut.trim());
	if (!m) return false;
	return egal(m[1]!.trim(), attendu);
}
