/**
 * GIFs thématiques DBZ pour les actions de modération.
 *
 * Override possible via `gif.<action>` côté SettingsService. Si l'override
 * est invalide (URL non https) on retombe sur le défaut.
 *
 * Defaults curatés sur Tenor / Giphy — jail = Mafuba, purge = Vegeta Final
 * Explosion / sacrifice, ban = Kamehameha, etc. Si Discord refuse l'embed,
 * fallback silencieux (pas d'image).
 */
import { container } from "tsyringe";
import { SettingsService } from "~/services/SettingsService";

export type SanctionAction =
	| "warn"
	| "unwarn"
	| "mute"
	| "unmute"
	| "kick"
	| "ban"
	| "unban"
	| "jail"
	| "unjail"
	| "purge";

const DEFAULT_GIFS: Record<SanctionAction, string> = {
	// Enma envoie l'âme en enfer (gif custom serveur RPB)
	jail: "https://cdn.discordapp.com/attachments/1474011285317484757/1499810957705347162/IMG_7125.gif",
	// Libération du Mafuba (Goku libère Tien)
	unjail:
		"https://media1.tenor.com/m/uhcq1HGgCmYAAAAC/dragon-ball-z-kai-saiyan-saga.gif",
	// Final Explosion / Vegeta sacrifice
	purge:
		"https://media1.tenor.com/m/4mhPRg2xyz0AAAAd/vegeta-final-explosion.gif",
	// Kamehameha
	ban: "https://media1.tenor.com/m/o-CkEKW7T2QAAAAd/goku-kamehameha.gif",
	unban: "https://media1.tenor.com/m/Pl8jPN4-Y8gAAAAd/welcome-back-dbz.gif",
	// Ki blast
	kick: "https://media1.tenor.com/m/ovxF-pODvqQAAAAd/dbz-vegeta.gif",
	// Mute — Buu silence sign
	mute: "https://media1.tenor.com/m/9N9b0x8aMyEAAAAd/majin-buu-shh.gif",
	unmute: "https://media1.tenor.com/m/J1Ge_3qjKb4AAAAd/dbz-goku.gif",
	warn: "https://media1.tenor.com/m/0ofcRVvbvOEAAAAC/dbz-vegeta.gif",
	unwarn: "https://media1.tenor.com/m/m5d2kZpQqWMAAAAd/goku-dbz.gif",
};

export async function gifFor(
	action: SanctionAction,
): Promise<string | undefined> {
	try {
		const settings = container.resolve(SettingsService);
		const override = await settings.getRaw(`gif.${action}`);
		if (override && /^https:\/\//i.test(override)) return override;
	} catch {
		// SettingsService pas encore prêt — utilise le défaut
	}
	return DEFAULT_GIFS[action];
}
