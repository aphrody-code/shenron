import { notFound } from "next/navigation";
import Image from "next/image";
import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { GatedWrap } from "@/components/GatedLink";
import { TrackView } from "@/components/TrackView";
import { WikiArticle, WikiSources } from "@/components/wiki/WikiArticle";
import { WikiEditBar } from "@/components/wiki/WikiEditBar";
import { assetUrl } from "@/lib/db-universe";
import { getShenronTransformation, getTransformationsAvecArticle } from "@/lib/shenron";
import { ogMeta } from "@/lib/og";

export const revalidate = 3600;

/**
 * Fiche d'une transformation.
 *
 * Elle n'existait pas : l'index regroupe les formes par nom et renvoie vers la
 * fiche du personnage. Résultat, **23 articles rédigés — dont « Super Saiyan »,
 * 3 175 caractères — n'étaient lisibles nulle part**, et autant d'URL
 * manquaient au sitemap.
 *
 * `generateStaticParams` ne rend QUE les formes qui portent un article : les 58
 * autres n'auraient qu'un titre et une image, et annoncer 58 pages minces à un
 * moteur de recherche dessert le reste du wiki. Elles restent visibles sur
 * l'index, comme avant.
 */
export async function generateStaticParams() {
	const list = await getTransformationsAvecArticle();
	return list.map((t) => ({ id: String(t.id) }));
}

export async function generateMetadata({
	params,
}: {
	params: Promise<{ id: string }>;
}): Promise<Metadata> {
	const { id } = await params;
	const t = await getShenronTransformation(Number(id));
	if (!t) return { title: "Transformation Dragon Ball" };
	const qui = t.character ? ` de ${t.character.name}` : "";
	return ogMeta({
		title: `${t.name} — Transformation Dragon Ball`,
		description: `La transformation ${t.name}${qui} : origine, apparence et effets, d'après le manga et les databooks.`,
		image: t.image ? assetUrl(t.image) : undefined,
		canonical: `/wiki/transformations/${id}`,
	});
}

export default async function TransformationPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = await params;
	const t = await getShenronTransformation(Number(id));
	if (!t) notFound();

	return (
		<article className="w-full mx-auto max-w-[1100px] px-6 py-10 lg:px-10 lg:py-14">
			<TrackView
				entityType="technique"
				entityId={t.id}
				entityName={t.name}
				image={t.image}
			/>
			<Breadcrumbs
				items={[
					{ label: "Transformations", href: "/wiki/transformations" },
					{ label: t.name },
				]}
			/>

			<div className="mb-8 mt-6">
				<WikiEditBar
					table="db_transformations"
					id={t.id}
					indexHref="/wiki/transformations"
					label={t.name}
				/>
			</div>

			<header className="flex flex-col gap-8 sm:flex-row sm:items-start">
				{t.image && (
					<div className="relative aspect-[3/4] w-44 shrink-0 overflow-hidden rounded-xl border border-white/10 bg-black sm:w-52">
						<Image
							src={assetUrl(t.image)}
							alt=""
							fill
							sizes="208px"
							className="object-cover object-top"
							priority
						/>
					</div>
				)}
				<div className="min-w-0">
					<p className="font-scouter text-[11px] uppercase tracking-[0.18em] text-dbz-orange">
						Transformation
					</p>
					<h1 className="mt-2 font-serif text-[36px] font-semibold leading-tight tracking-tight text-white md:text-[46px]">
						{t.name}
					</h1>
					{t.character && (
						<p className="mt-3 text-[15px] text-white/60">
							Forme de{" "}
							<GatedWrap
								href={`/wiki/personnages/${t.character.id}`}
								className="text-dbz-orange underline-offset-2 hover:underline"
							>
								{t.character.name}
							</GatedWrap>
						</p>
					)}
					{t.ki && (
						<dl className="mt-5 inline-flex rounded-xl border border-white/[0.08] px-5 py-3">
							<div>
								<dt className="font-scouter text-[10px] uppercase tracking-[0.16em] text-white/45">
									Ki
								</dt>
								<dd className="mt-0.5 font-scouter text-[15px] text-dbz-orange">{t.ki}</dd>
							</div>
						</dl>
					)}
				</div>
			</header>

			{t.article && t.article.trim() ? (
				<div className="mt-12">
					{/* « Description » et non le nom de la forme : celui-ci est déjà le
					    h1 de la page, deux lignes plus haut. Le répéter en tête du bloc
					    donne le même titre deux fois à l'écran. */}
					<WikiArticle article={t.article} heading="Description" accent="orange" />
				</div>
			) : (
				<p className="mt-12 text-sm italic text-white/45">
					Cette forme n&apos;a pas encore d&apos;article.
				</p>
			)}

			{/* Les autres formes du même personnage : c'est la navigation naturelle
			    d'une transformation à l'autre, qui n'existait nulle part. Seules
			    celles qui ont une page sont cliquables — les autres seraient un 404. */}
			{t.voisines.length > 0 && (
				<section className="mt-14 border-t border-white/[0.08] pt-8">
					<h2 className="mb-5 font-scouter text-[11px] uppercase tracking-[0.18em] text-white/45">
						Autres formes {t.character ? `de ${t.character.name}` : ""}
					</h2>
					<ul className="flex flex-wrap gap-2">
						{t.voisines.map((v) =>
							v.aArticle ? (
								<li key={v.id}>
									<GatedWrap
										href={`/wiki/transformations/${v.id}`}
										className="inline-flex rounded-full border border-white/12 px-4 py-2 text-[13px] font-medium text-white/75 transition-colors hover:border-dbz-orange/60 hover:text-dbz-orange"
									>
										{v.name}
									</GatedWrap>
								</li>
							) : (
								<li
									key={v.id}
									className="inline-flex rounded-full border border-white/[0.06] px-4 py-2 text-[13px] text-white/35"
									title="Cette forme n'a pas encore d'article"
								>
									{v.name}
								</li>
							)
						)}
					</ul>
				</section>
			)}

			<WikiSources sources={t.articleSources as never} />
		</article>
	);
}
