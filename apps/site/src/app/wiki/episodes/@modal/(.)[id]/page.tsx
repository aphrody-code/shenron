/**
 * Route d'INTERCEPTION `@modal/(.)[id]` — aperçu rapide d'un épisode en modale
 * quand on navigue depuis `/wiki/episodes` (client). Accès direct/refresh de
 * `/wiki/episodes/[id]` = fiche pleine page. Cf. `wiki/films/@modal/(.)[slug]`.
 */
import { dbUniverse } from "@/lib/db-universe";
import { assetUrl } from "@/lib/assets";
import { notFound } from "next/navigation";
import { bannerForSeries } from "@/lib/db-banners";
import { Modal } from "@/components/stream/Modal";
import { QuickLook } from "@/components/stream/QuickLook";

export const dynamic = "force-dynamic";

const SERIES_LABELS: Record<string, string> = {
	DB: "Dragon Ball",
	DBZ: "Dragon Ball Z",
	DBZ_KAI: "Dragon Ball Z Kai",
	DBGT: "Dragon Ball GT",
	DBS: "Dragon Ball Super",
	DB_DAIMA: "Dragon Ball Daima",
};

const hasLang = (
	players: { lang?: "vf" | "vostfr" }[] | null,
	lang: "vf" | "vostfr"
): boolean => (players ?? []).some((p) => p.lang === lang);

export default async function EpisodeModal({ params }: { params: Promise<{ id: string }> }) {
	const { id } = await params;
	const ep = await dbUniverse.episode(Number(id));
	if (!ep) notFound();
	const year = ep.air_date ? new Date(ep.air_date * 1000).getFullYear() : null;

	return (
		<Modal>
			<QuickLook
				backdrop={ep.image ? assetUrl(ep.image) : bannerForSeries(ep.series)}
				eyebrow={`${SERIES_LABELS[ep.series] ?? ep.series} · Épisode ${ep.number_in_series}`}
				title={ep.title}
				titleJa={ep.title_ja}
				meta={[year ? String(year) : null]}
				synopsis={ep.synopsis}
				hasVf={hasLang(ep.players, "vf")}
				hasVostfr={hasLang(ep.players, "vostfr")}
				watchHref={`/wiki/episodes/${ep.id}`}
				watchLabel="Regarder l'épisode"
			/>
		</Modal>
	);
}
