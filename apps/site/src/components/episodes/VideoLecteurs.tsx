"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { track } from "@/lib/telemetry";

export interface Lecteur {
	name: string;
	provider: string;
	embedUrl: string;
	lang?: "vf" | "vostfr";
}

const LANG_LABEL: Record<string, string> = { vf: "VF", vostfr: "VOSTFR" };
const LANG_ORDER = ["vf", "vostfr"] as const;

/** Retire le préfixe « VF · » / « VOSTFR · » que l'import ajoute au nom du lecteur
 *  (la langue est désormais portée par le sélecteur dédié). */
function cleanName(name: string): string {
	return name.replace(/^\s*(VF|VOSTFR)\s*·\s*/i, "").trim();
}

/**
 * Sélecteur de « lecteurs » (sources de streaming externes) rendu en `<iframe>`.
 * Notre player hls.js ne peut pas consommer ces embeds (pages-lecteur tierces à
 * token éphémère) → on les affiche en iframe.
 *
 * Quand les lecteurs portent un tag de langue (`lang: "vf" | "vostfr"`, posé par
 * `import-voiranime-players-vf.ts`), on affiche un sélecteur **VF / VOSTFR** :
 * l'utilisateur choisit d'abord la langue, puis « Lecteur 1/2/3 » dans cette
 * langue. VF par défaut (audience FR). Sans tag de langue (data legacy), on
 * retombe sur une liste plate « Lecteur N ».
 */
export function VideoLecteurs({
	players,
	entityType,
	entityId,
}: {
	players: Lecteur[];
	/** Entité regardée — sans elle, aucun événement de lecture n'est émis. */
	entityType?: "episode" | "movie";
	entityId?: string | number;
}) {
	// Langues réellement présentes, ordonnées VF puis VOSTFR.
	const langs = useMemo(() => {
		const present = new Set(players.map((p) => p.lang).filter(Boolean) as string[]);
		return LANG_ORDER.filter((l) => present.has(l));
	}, [players]);
	const hasLangs = langs.length > 0;

	const [lang, setLang] = useState<string>(() => langs[0] ?? "");
	const [active, setActive] = useState(0);

	// Lecteurs de la langue choisie. Les lecteurs SANS tag de langue restent
	// toujours visibles (sinon, en cas de data mixte, ils disparaîtraient).
	const list = useMemo(
		() => (hasLangs && lang ? players.filter((p) => !p.lang || p.lang === lang) : players),
		[players, hasLangs, lang]
	);

	const current = list[active] ?? list[0];

	/**
	 * Ouverture d'un lecteur. C'est LE signal de valeur du site — savoir ce qui
	 * est réellement regardé, dans quelle langue et sur quel hébergeur — et le
	 * type `play_open` était déclaré depuis le début sans être émis une seule
	 * fois. L'hébergeur compte : c'est ce qui permet de repérer un lecteur mort
	 * autrement qu'en attendant un signalement (7 hébergeurs sur 8 sont déjà
	 * tombés, cf. la purge des lecteurs morts).
	 */
	const dejaEmis = useRef<string | null>(null);
	useEffect(() => {
		if (!entityType || entityId == null || !current) return;
		const cle = `${entityId}:${current.embedUrl}`;
		if (dejaEmis.current === cle) return;
		dejaEmis.current = cle;
		track("play_open", {
			entityType,
			entityId,
			lang: current.lang ?? undefined,
			// `provider` (« vidmoly », « mail.ru ») plutôt que le nom d'affichage :
			// c'est l'hébergeur qui tombe, pas le libellé.
			player: current.provider || current.name || undefined,
		});
	}, [entityType, entityId, current]);
	if (!current) return null;

	const selectLang = (l: string) => {
		setLang(l);
		setActive(0);
	};

	return (
		<div className="space-y-3">
			{/* Sélecteur de langue (VF / VOSTFR) — visible seulement si les deux existent. */}
			{langs.length > 1 && (
				<div
					role="group"
					aria-label="Langue audio (VF / VOSTFR)"
					className="inline-flex items-center gap-1 rounded-full bg-white/[0.06] p-1"
				>
					{langs.map((l) => (
						<button
							key={l}
							type="button"
							onClick={() => selectLang(l)}
							aria-pressed={lang === l}
							className={`rounded-full px-4 py-1.5 text-[12px] font-display font-bold tracking-wide transition-colors ${
								lang === l ? "bg-dbz-orange text-black" : "text-white/70 hover:text-white"
							}`}
						>
							{LANG_LABEL[l]}
						</button>
					))}
				</div>
			)}

			{/* Sélecteur de lecteur dans la langue active. */}
			<div role="group" aria-label="Choix du lecteur" className="flex flex-wrap items-center gap-2">
				{list.map((p, i) => (
					<button
						key={`${p.provider}-${i}`}
						type="button"
						onClick={() => setActive(i)}
						aria-pressed={i === active}
						className={`rounded-full px-3.5 py-1.5 text-[12px] font-display font-semibold tracking-wide transition-colors ${
							i === active
								? "bg-dbz-orange text-black"
								: "bg-white/[0.06] text-white/70 hover:bg-white/[0.12] hover:text-white"
						}`}
						title={`${cleanName(p.name)} · ${p.provider}`}
					>
						Lecteur {i + 1}
					</button>
				))}
			</div>

			<div className="dbz-panel overflow-hidden rounded-lg border border-dbz-border bg-black p-0">
				{/* sandbox : autorise le player tiers (scripts + accès à SA propre
				    origine, requis pour les tokens de flux) mais bloque popups et
				    navigation du top-window → coupe popunders et hijack de l'onglet
				    dragonballfr.com. NE PAS ajouter allow-popups / allow-top-navigation. */}
				<iframe
					key={current.embedUrl}
					src={current.embedUrl}
					title={`Lecteur ${active + 1} — ${cleanName(current.name)}`}
					className="aspect-video w-full rounded-lg bg-black"
					sandbox="allow-scripts allow-same-origin allow-presentation allow-forms"
					allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
					allowFullScreen
					referrerPolicy="origin"
					loading="lazy"
				/>
			</div>
			<p className="text-[11px] text-white/50">
				{hasLangs && lang ? `${LANG_LABEL[lang]} · ` : ""}Lecteur externe «{" "}
				{cleanName(current.name)} ». Les liens peuvent expirer — relancer l'import si un lecteur ne
				répond pas.
			</p>
		</div>
	);
}
