import Link from "next/link";
import type { Metadata } from "next";
import { Lock, ArrowRight } from "lucide-react";

// Écran « section en préparation » servi *à l'URL d'origine* (via rewrite du
// proxy) pour les sections wiki/tierlists encore gated en bêta — au lieu de
// renvoyer silencieusement le visiteur sur la home. Jamais indexable.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
	title: "Section en préparation",
	robots: { index: false, follow: true },
};

// Libellé lisible d'une section à partir de son chemin (plus long préfixe).
const SECTION_LABELS: Record<string, string> = {
	"/wiki/personnages": "les personnages",
	"/wiki/planetes": "les planètes",
	"/wiki/sagas": "les sagas",
	"/wiki/races": "les races",
	"/wiki/transformations": "les transformations",
	"/wiki/dragon-ball/techniques": "les techniques",
	"/wiki/dragon-ball/character": "cette fiche personnage",
	"/wiki/dragon-ball/planet": "cette fiche planète",
	"/wiki/jeux": "les jeux vidéo",
	"/wiki/arcs": "les arcs narratifs",
	"/wiki/search": "la recherche du wiki",
	"/wiki": "cette partie du wiki",
	"/tierlists": "les tier lists",
};

function labelFor(from: string): string {
	const match = Object.keys(SECTION_LABELS)
		.filter((p) => from === p || from.startsWith(p + "/") || from.startsWith(p))
		.sort((a, b) => b.length - a.length)[0];
	return match ? SECTION_LABELS[match] : "cette section";
}

// Sections déjà ouvertes au public (miroir de WIKI_OPEN dans proxy.ts).
const OPEN_SECTIONS = [
	{ href: "/wiki/episodes", label: "Épisodes", kanji: "話" },
	{ href: "/wiki/films", label: "Films", kanji: "映画" },
	{ href: "/wiki/manga", label: "Manga", kanji: "漫画" },
	{ href: "/wiki/chronologie", label: "Chronologie", kanji: "年表" },
];

export default async function WikiComingSoonPage({
	searchParams,
}: {
	searchParams: Promise<{ from?: string }>;
}) {
	const { from = "" } = await searchParams;
	const label = labelFor(from);

	return (
		<div className="mx-auto flex min-h-[70vh] max-w-3xl flex-col items-center justify-center px-6 py-20 text-center">
			<div className="dbz-panel relative w-full overflow-hidden p-10">
				<div className="screentone pointer-events-none absolute inset-0 opacity-40" />
				<div className="relative z-10">
					<span className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full border-2 border-dbz-orange/40 bg-dbz-orange/10">
						<Lock className="h-7 w-7 text-dbz-orange" />
					</span>
					<p className="mb-3 font-scouter text-[11px] uppercase tracking-[0.35em] text-dbz-orange">
						Bêta · accès progressif
					</p>
					<h1 className="mb-4 font-saiyan text-4xl uppercase tracking-widest text-white sm:text-5xl">
						En préparation
					</h1>
					<p className="mx-auto mb-8 max-w-xl text-gray-300">
						Nous finalisons {label} avant l'ouverture au public. Le contenu existe déjà et arrive
						très bientôt — en attendant, l'univers reste explorable par ici&nbsp;:
					</p>

					<div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
						{OPEN_SECTIONS.map((s) => (
							<Link
								key={s.href}
								href={s.href}
								className="dbz-panel group flex flex-col items-center gap-2 border border-dbz-border p-4 transition-colors hover:border-dbz-orange"
							>
								<span className="font-jp text-2xl text-dbz-blue-light transition-colors group-hover:text-dbz-orange">
									{s.kanji}
								</span>
								<span className="font-saiyan text-xs uppercase tracking-wider text-gray-200 group-hover:text-white">
									{s.label}
								</span>
							</Link>
						))}
					</div>

					<div className="flex flex-wrap items-center justify-center gap-3">
						<Link href="/" className="dbz-button inline-flex items-center gap-2">
							Retour à l'accueil
							<ArrowRight className="h-4 w-4" />
						</Link>
						<Link href="/wiki/chronologie" className="dbz-button-ghost">
							Voir la chronologie
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
}
