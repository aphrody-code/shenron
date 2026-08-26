/**
 * /wiki/contribuer — la page qui transforme « signaler » en « écrire ».
 *
 * Trois choses, dans cet ordre, parce que c'est l'ordre dans lequel on se
 * décide à contribuer :
 *   1. comment ça marche, en trois phrases (et ce qu'on risque : rien) ;
 *   2. **où il manque quelque chose**, mesuré en direct — c'est ce qui donne
 *      envie, pas l'invitation générale ;
 *   3. qui a déjà contribué, parce qu'un travail crédité en appelle d'autres.
 *
 * La règle des sources y est écrite noir sur blanc, sans détour : le wiki se
 * rédige sur le manga et les databooks, et le contenu venu de Fandom est en
 * cours de remplacement, pas de prolongement. Autant que ce soit dit ici plutôt
 * que découvert au moment d'un refus.
 */
import Link from "next/link";
import { BookOpen, PenLine, ShieldCheck, Sparkles } from "lucide-react";
import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { MesContributions } from "@/components/wiki/MesContributions";
import { listeChantiers } from "@/lib/wiki-chantiers";
import { topContributors } from "@/lib/wiki-contributions";
import { ogMeta } from "@/lib/og";

export const revalidate = 600;

export const metadata: Metadata = ogMeta({
	title: "Contribuer au wiki",
	description:
		"Corrigez et complétez le wiki Dragon Ball : chaque fiche s'édite depuis sa page, la proposition est relue puis publiée à votre nom.",
	canonical: "/wiki/contribuer",
	type: "website",
});

const ETAPES = [
	{
		icon: PenLine,
		titre: "Ouvre la fiche et clique sur « Proposer une correction »",
		texte:
			"Le bouton est sous le titre de chaque fiche, et sous chaque section. Le texte actuel s'ouvre dans une zone d'édition : tu modifies ce qui cloche, rien d'autre.",
	},
	{
		icon: BookOpen,
		titre: "Indique d'où vient l'information",
		texte:
			"Un tome et une planche, un databook et une page. Une correction sourcée est relue en quelques minutes ; sans source, il faut la vérifier avant, ce qui prend des jours.",
	},
	{
		icon: ShieldCheck,
		titre: "Un relecteur publie — sous ton nom",
		texte:
			"Rien n'est modifié tant qu'une proposition n'est pas acceptée. Une fois publiée, la modification apparaît dans l'historique du wiki avec ton pseudo, et reste annulable.",
	},
];

export default async function PageContribuer() {
	const [chantiers, contributeurs] = await Promise.all([
		listeChantiers().catch(() => []),
		topContributors(20).catch(() => []),
	]);

	const totalVides = chantiers.reduce((n, c) => n + c.vides, 0);

	return (
		<div className="mx-auto w-full max-w-5xl px-6 py-12 lg:px-10 lg:py-20">
			<Breadcrumbs className="mb-8" items={[{ label: "Contribuer" }]} />

			<header className="max-w-2xl">
				<h1 className="font-saiyan text-4xl uppercase text-white lg:text-5xl">
					Écrire le wiki <span className="text-dbz-orange">à plusieurs</span>
				</h1>
				<p className="mt-4 text-base leading-relaxed text-white/60">
					Ce wiki est écrit sur deux sources tenues en propre&nbsp;: les 42 tomes du manga et les
					planches transcrites des databooks. Il est loin d&apos;être fini — et il n&apos;a aucune
					raison de l&apos;être par une seule personne.
				</p>
			</header>

			{/* --- Comment ça marche --- */}
			<section className="mt-14">
				<h2 className="font-saiyan text-2xl uppercase text-white">Comment ça marche</h2>
				<ol className="mt-6 grid gap-4 md:grid-cols-3">
					{ETAPES.map((e, i) => (
						<li
							key={e.titre}
							className="rounded-xl border border-white/10 bg-white/[0.02] p-5 transition-colors hover:border-dbz-orange/30"
						>
							<div className="flex items-center gap-2 text-dbz-orange">
								<e.icon className="h-4 w-4" />
								<span className="text-xs font-bold uppercase tracking-widest">Étape {i + 1}</span>
							</div>
							<h3 className="mt-3 text-sm font-bold leading-snug text-white">{e.titre}</h3>
							<p className="mt-2 text-xs leading-relaxed text-white/50">{e.texte}</p>
						</li>
					))}
				</ol>
			</section>

			{/* --- La règle des sources --- */}
			<section className="mt-14 rounded-xl border border-white/10 bg-white/[0.02] p-6">
				<h2 className="font-saiyan text-2xl uppercase text-white">Ce qui fait une bonne source</h2>
				<div className="mt-4 grid gap-6 md:grid-cols-2">
					<div>
						<p className="text-xs font-bold uppercase tracking-widest text-emerald-400">Accepté</p>
						<ul className="mt-3 space-y-2 text-sm leading-relaxed text-white/60">
							<li>
								<strong className="text-white/80">Le manga</strong> — le tome et le numéro de
								planche («&nbsp;tome 17, planche 42&nbsp;»).
							</li>
							<li>
								<strong className="text-white/80">Les databooks</strong> — Daizenshuu, Chōzenshū,
								guides officiels, avec la page.
							</li>
							<li>
								<strong className="text-white/80">L&apos;anime et les films</strong>, à condition de
								le dire&nbsp;: ce qui n&apos;est pas dans le manga se signale comme tel.
							</li>
						</ul>
					</div>
					<div>
						<p className="text-xs font-bold uppercase tracking-widest text-dbz-red">Refusé</p>
						<ul className="mt-3 space-y-2 text-sm leading-relaxed text-white/60">
							<li>
								<strong className="text-white/80">Les autres wikis</strong>, Fandom en tête. Le
								contenu qui en vient est en cours de remplacement ici&nbsp;; le recopier ferait
								revenir ce qu&apos;on retire.
							</li>
							<li>
								<strong className="text-white/80">Les jeux vidéo</strong> présentés comme du canon —
								beaucoup de fiches en portent encore les libellés, c&apos;est justement ce
								qu&apos;on corrige.
							</li>
							<li>
								<strong className="text-white/80">Les tournures d&apos;hypothèse</strong> —
								«&nbsp;probablement&nbsp;», «&nbsp;sans doute&nbsp;». Mieux vaut ne rien écrire
								qu&apos;écrire du plausible.
							</li>
						</ul>
					</div>
				</div>
			</section>

			{/* --- Où il manque quelque chose --- */}
			<section className="mt-14">
				<h2 className="font-saiyan text-2xl uppercase text-white">Où il manque quelque chose</h2>
				{chantiers.length === 0 ? (
					<p className="mt-4 text-sm text-white/50">
						Toutes les fiches visibles portent au moins un texte. Il reste à les vérifier et à les
						approfondir&nbsp;: ouvre n&apos;importe quelle fiche et compare-la à ta source.
					</p>
				) : (
					<>
						<p className="mt-2 text-sm text-white/50">
							{totalVides.toLocaleString("fr-FR")} fiches visibles n&apos;ont ni article ni
							description. Compté à l&apos;instant, directement en base.
						</p>
						<div className="mt-6 space-y-4">
							{chantiers.map((c) => (
								<div key={c.table} className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
									<div className="flex flex-wrap items-baseline justify-between gap-2">
										<h3 className="text-sm font-bold text-white">{c.rubrique}</h3>
										<p className="text-xs text-white/45">
											<span className="font-bold text-dbz-orange">{c.vides}</span> à écrire sur{" "}
											{c.total}
										</p>
									</div>
									<div className="mt-1.5 h-1 overflow-hidden rounded-full bg-white/8">
										<div
											className="h-full rounded-full bg-dbz-orange/70"
											style={{
												width: `${Math.round(((c.total - c.vides) / Math.max(c.total, 1)) * 100)}%`,
											}}
										/>
									</div>
									{c.exemples.length > 0 ? (
										<ul className="mt-3 flex flex-wrap gap-2">
											{c.exemples.map((e) => (
												<li key={e.href}>
													<Link
														href={e.href}
														className="inline-block rounded-full border border-white/12 px-3 py-1 text-xs text-white/60 transition-colors hover:border-dbz-orange/50 hover:text-white"
													>
														{e.label}
													</Link>
												</li>
											))}
										</ul>
									) : null}
								</div>
							))}
						</div>
					</>
				)}
			</section>

			{/* --- Les contributeurs --- */}
			<section className="mt-14">
				<h2 className="flex items-center gap-2 font-saiyan text-2xl uppercase text-white">
					<Sparkles className="h-5 w-5 text-dbz-orange" /> Celles et ceux qui écrivent
				</h2>
				{contributeurs.length === 0 ? (
					<p className="mt-4 text-sm leading-relaxed text-white/50">
						Personne n&apos;a encore de contribution publiée. La première correction acceptée
						apparaîtra ici — et dans l&apos;historique de la fiche concernée.
					</p>
				) : (
					<ol className="mt-6 grid gap-2 sm:grid-cols-2">
						{contributeurs.map((c, i) => (
							<li
								key={c.authorId}
								className="flex items-center justify-between gap-3 rounded-lg border border-white/8 bg-white/[0.02] px-4 py-2.5"
							>
								<span className="flex min-w-0 items-center gap-3">
									<span className="w-5 shrink-0 text-right text-xs font-bold text-white/30">
										{i + 1}
									</span>
									<span className="truncate text-sm text-white/80">{c.authorName}</span>
								</span>
								<span className="shrink-0 text-xs text-white/45">
									{c.accepted} contribution{c.accepted > 1 ? "s" : ""}
								</span>
							</li>
						))}
					</ol>
				)}
			</section>

			<MesContributions />

			<p className="mt-14 border-t border-white/8 pt-6 text-xs leading-relaxed text-white/40">
				Une question, un doute sur une source&nbsp;? Le bouton «&nbsp;Signaler une erreur&nbsp;» en
				bas de chaque page passe par le même canal. Et tout ce qui change ici est public&nbsp;:{" "}
				<Link href="/wiki/modifications" className="text-white/60 underline underline-offset-2 hover:text-dbz-orange">
					voir les modifications récentes
				</Link>
				.
			</p>
		</div>
	);
}
