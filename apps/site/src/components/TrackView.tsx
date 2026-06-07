"use client";

/**
 * TrackView — îlot client de tracking de vue d'entité wiki.
 *
 * À déposer dans une page serveur (`/wiki/.../[id]`) pour émettre une
 * `wiki_view` typée au montage, sans transformer la page en Client Component ni
 * importer la télémétrie côté serveur. Rend `null` (pur effet de bord).
 *
 * No-op sans consentement / sous Do-Not-Track (géré par `track()`).
 */
import { useEffect } from "react";
import { trackWikiView, type TelemetryEvent } from "@/lib/telemetry";

type WikiViewProps = Extract<TelemetryEvent, { name: "wiki_view" }>["props"];

export function TrackView({ entityType, entityId, entityName, series }: WikiViewProps) {
	useEffect(() => {
		trackWikiView(entityType, entityId, { entityName, series });
		// Re-track si on navigue d'une fiche à l'autre (clé id change).
	}, [entityType, entityId, entityName, series]);
	return null;
}
