/**
 * Route d'INTERCEPTION `@modal/(.)[slug]` — rendue à la place de la fiche film
 * quand on y navigue DEPUIS le catalogue `/wiki/films` (client-side). Affiche
 * l'aperçu rapide (`QuickLook`) dans la coquille `Modal`. En accès direct/refresh
 * l'interception ne s'applique pas → la vraie fiche `[slug]/page.tsx` est servie.
 */
import { dbUniverse } from "@/lib/db-universe";
import { bannerForSeries } from "@/lib/db-banners";
import { Modal } from "@/components/stream/Modal";
import { QuickLook } from "@/components/stream/QuickLook";

// L'interception ne se rend que sur navigation client → dynamique (jamais prérendu).
export const dynamic = "force-dynamic";

const SERIES_LABELS: Record<string, string> = {
	DB_MOVIE: "Film Dragon Ball",
	DBZ_MOVIE: "Film Dragon Ball Z",
	DBS_MOVIE: "Film Dragon Ball Super",
	DB_DAIMA_MOVIE: "Film Daima",
	DBZ_OVA: "OVA Dragon Ball Z",
	DBZ_SPECIAL: "Téléfilm Dragon Ball Z",
};

function stripSourceTags(s: string | null): string | null {
	if (!s) return s;
	let out = s;
	let prev: string;
	do {
		prev = out;
		out = out.replace(/\s*[([]\s*(?:source|écrit par)[^)\]]*[)\]]\s*$/i, "");
	} while (out !== prev);
	return out.trimEnd();
}

const hasLang = (
	players: { lang?: "vf" | "vostfr" }[] | null,
	lang: "vf" | "vostfr"
): boolean => (players ?? []).some((p) => p.lang === lang);

export default async function FilmModal({ params }: { params: Promise<{ slug: string }> }) {
	const { slug } = await params;
	const m = await dbUniverse.movie(slug);
	// Dans le slot d'interception, un null vient surtout d'une erreur DB transitoire
	// (les cartes lient des slugs réels) → aperçu « indisponible » gracieux plutôt
	// qu'un 404 racine par-dessus le catalogue. La fiche pleine page (accès direct)
	// garde son vrai notFound.
	if (!m) {
		return (
			<Modal>
				<div className="p-10 text-center">
					<p className="font-saiyan text-2xl uppercase text-white/45">Aperçu indisponible</p>
					<p className="mt-2 text-sm text-white/50">
						Impossible de charger cet aperçu pour le moment. Ouvre la fiche complète ou réessaie.
					</p>
				</div>
			</Modal>
		);
	}
	const year = m.release_date ? new Date(m.release_date * 1000).getFullYear() : null;

	return (
		<Modal>
			<QuickLook
				backdrop={bannerForSeries(m.series)}
				poster={m.poster}
				eyebrow={SERIES_LABELS[m.series] ?? "Film"}
				title={m.title}
				titleJa={m.title_ja}
				meta={[year ? String(year) : null, m.duration_min ? `${m.duration_min} min` : null]}
				synopsis={stripSourceTags(m.synopsis)}
				hasVf={hasLang(m.players, "vf")}
				hasVostfr={hasLang(m.players, "vostfr")}
				watchHref={`/wiki/films/${m.slug}`}
				watchLabel="Regarder le film"
			/>
		</Modal>
	);
}
