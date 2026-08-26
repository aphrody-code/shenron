/**
 * /wiki/modifications — le flux public des changements du wiki.
 *
 * Ce que la page apporte, et qui n'existait nulle part côté public :
 *   - elle **prouve** que le wiki bouge, ce qu'aucune fiche prise isolément ne
 *     montre ;
 *   - elle rend le crédit visible — le nom du contributeur est à côté de sa
 *     modification, pas enfoui dans un back-office ;
 *   - elle donne une prise pour vérifier : qui a écrit quoi, quand, sur quelle
 *     fiche.
 *
 * `revalidate` court (5 min) : un flux d'activité périmé d'une heure ne sert
 * pas son propos. Aucun cookie lu → le cache CDN reste utilisable.
 */
import Link from "next/link";
import { History } from "lucide-react";
import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { listeModifications } from "@/lib/wiki-modifications";
import { ogMeta } from "@/lib/og";

export const revalidate = 300;

export const metadata: Metadata = ogMeta({
	title: "Modifications récentes du wiki",
	description:
		"Ce qui vient de changer dans le wiki Dragon Ball : les fiches modifiées, par qui, et quand.",
	canonical: "/wiki/modifications",
	type: "website",
});

/** « il y a 3 h », « hier », « le 12 août » — plus lisible qu'un horodatage. */
function ilYA(iso: string): string {
	const d = new Date(iso);
	const min = Math.floor((Date.now() - d.getTime()) / 60_000);
	if (min < 1) return "à l'instant";
	if (min < 60) return `il y a ${min} min`;
	const h = Math.floor(min / 60);
	if (h < 24) return `il y a ${h} h`;
	const j = Math.floor(h / 24);
	if (j === 1) return "hier";
	if (j < 30) return `il y a ${j} jours`;
	return d.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
}

/** Regroupe par jour — un flux plat de 60 lignes ne se lit pas. */
function parJour(mods: Awaited<ReturnType<typeof listeModifications>>) {
	const groupes = new Map<string, typeof mods>();
	for (const m of mods) {
		const jour = new Date(m.createdAt).toLocaleDateString("fr-FR", {
			weekday: "long",
			day: "numeric",
			month: "long",
		});
		groupes.set(jour, [...(groupes.get(jour) ?? []), m]);
	}
	return [...groupes.entries()];
}

export default async function PageModifications() {
	const mods = await listeModifications(80).catch(() => []);
	const jours = parJour(mods);

	return (
		<div className="mx-auto w-full max-w-4xl px-6 py-12 lg:px-10 lg:py-20">
			<Breadcrumbs className="mb-8" items={[{ label: "Modifications récentes" }]} />

			<header className="max-w-2xl">
				<h1 className="flex items-center gap-3 font-saiyan text-4xl uppercase text-white">
					<History className="h-7 w-7 text-dbz-orange" />
					Ce qui vient de changer
				</h1>
				<p className="mt-4 text-base leading-relaxed text-white/60">
					Chaque modification du wiki est enregistrée, attribuée et réversible. Voici les
					dernières — y compris celles proposées par des membres et publiées après relecture.
				</p>
				<Link
					href="/wiki/contribuer"
					className="mt-5 inline-block rounded-lg border border-dbz-orange/40 bg-dbz-orange/[0.07] px-4 py-2 text-sm font-semibold text-dbz-orange transition-colors hover:bg-dbz-orange/15"
				>
					Proposer une correction à ton tour
				</Link>
			</header>

			{jours.length === 0 ? (
				<p className="mt-12 rounded-xl border border-white/8 bg-white/[0.02] px-5 py-12 text-center text-sm text-white/40">
					Aucune modification récente à afficher.
				</p>
			) : (
				<div className="mt-12 space-y-10">
					{jours.map(([jour, lignes]) => (
						<section key={jour}>
							<h2 className="text-xs font-bold uppercase tracking-widest text-white/35">{jour}</h2>
							<ul className="mt-3 divide-y divide-white/6 border-y border-white/6">
								{lignes.map((m) => (
									<li key={m.id} className="flex flex-wrap items-baseline gap-x-3 gap-y-1 py-2.5">
										<span className="w-20 shrink-0 text-[11px] uppercase tracking-wide text-white/30">
											{m.rubrique}
										</span>
										<span className="min-w-0 flex-1 text-sm">
											{m.href ? (
												<Link href={m.href} className="text-white/85 hover:text-dbz-orange">
													{m.label}
												</Link>
											) : (
												<span className="text-white/60">{m.label}</span>
											)}
											<span className="ml-2 text-xs text-white/35">{m.champs.join(", ")}</span>
										</span>
										<span className="shrink-0 text-xs text-white/40">
											{m.auteur ?? "—"} · {ilYA(m.createdAt)}
										</span>
									</li>
								))}
							</ul>
						</section>
					))}
				</div>
			)}
		</div>
	);
}
