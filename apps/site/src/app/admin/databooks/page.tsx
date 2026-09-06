import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { Alerte, CocheCercle, FlecheCoin, LienExterne, Livre } from "@/components/icones";
import { AdminHeader } from "../db-universe/_Header";
import { assetCdnUrl } from "../db-universe/_lib";
import { TranscriptionSearch } from "@/components/admin/TranscriptionSearch";
import { RythmeSparkline } from "@/components/admin/RythmeSparkline";
import { DatabooksLiveRefresh } from "@/components/admin/DatabooksLiveRefresh";
import {
	etatPipelinesLocaux,
	mangaUploadStatus,
	progressionTranscription,
	type EtatPipelinesLocaux,
	type MangaUploadStatus,
	type ProgressionFiche,
} from "@/lib/databooks-transcription";

/**
 * Suivi des transcriptions de databooks.
 *
 * La rubrique produit du texte à partir de scans japonais. Les chiffres de
 * PostgreSQL et les manifests fournis par Aphrody sont relus à chaque rendu ;
 * le client admin redemande une mesure toutes les cinq secondes quand la page
 * reste ouverte. Cette page répond aux trois questions : **où on en est**,
 * **ce qui cloche**, **où aller corriger**.
 */
export const dynamic = "force-dynamic";

function pct(n: number, d: number): number {
	return d > 0 ? Math.round((n / d) * 100) : 0;
}

/** Compact : 325 446 signes se lit mal, « 325 k » se lit d'un coup d'œil. */
function signes(n: number): string {
	if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)} M`;
	if (n >= 1_000) return `${Math.round(n / 1_000)} k`;
	return String(n);
}

function dateCourte(d: Date | null): string {
	if (!d) return "—";
	return d.toLocaleDateString("fr-FR", { day: "2-digit", month: "short" });
}

function dateHeure(d: Date | null): string {
	if (!d) return "inconnue";
	return d.toLocaleString("fr-FR", {
		day: "2-digit",
		month: "2-digit",
		hour: "2-digit",
		minute: "2-digit",
	});
}

function EtatBadge({ etat }: { etat: "actif" | "arrêté" }) {
	const actif = etat === "actif";
	return (
		<span
			className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
				actif
					? "border-green-400/30 bg-green-400/10 text-green-300"
					: "border-white/15 bg-white/5 text-white/55"
			}`}
		>
			<span className={`h-1.5 w-1.5 rounded-full ${actif ? "bg-green-400" : "bg-white/35"}`} />
			{actif ? "actif" : "arrêté"}
		</span>
	);
}

function CartePipeline({
	children,
	titre,
	etat,
}: {
	children: ReactNode;
	titre: string;
	etat: "actif" | "arrêté";
}) {
	return (
		<div className="dbz-panel p-4">
			<div className="mb-3 flex items-center justify-between gap-3">
				<h3 className="font-saiyan text-sm uppercase tracking-wider text-dbz-orange">{titre}</h3>
				<EtatBadge etat={etat} />
			</div>
			{children}
		</div>
	);
}

function PipelinesLocaux({
	local,
	uploads,
}: {
	local: EtatPipelinesLocaux;
	uploads: MangaUploadStatus;
}) {
	const databooks = local.databooks;
	const manga = local.manga;
	return (
		<section className="mb-8">
			<div className="mb-3 flex flex-wrap items-baseline justify-between gap-2 border-b-2 border-dbz-orange/30 pb-2">
				<h2 className="font-saiyan text-xl uppercase text-dbz-orange">Pipelines &amp; uploads</h2>
				<div className="flex items-center gap-3 text-[11px] text-white/45">
					<span>local = manifests du poste · publié = PostgreSQL</span>
					<DatabooksLiveRefresh />
				</div>
			</div>
			<div className="grid gap-3 lg:grid-cols-3">
				{databooks ? (
					<CartePipeline titre="AphrodyGPU · databooks" etat={databooks.etat}>
						<div className="flex items-baseline justify-between gap-2 text-sm">
							<strong className="tabular-nums text-white">
								{databooks.resultats.toLocaleString("fr-FR")} /{" "}
								{databooks.expected.toLocaleString("fr-FR")}
							</strong>
							<span className="text-dbz-orange">résultats</span>
						</div>
						<div className="mt-2 text-[11px] text-white/55">
							{databooks.restant.toLocaleString("fr-FR")} restant ·{" "}
							{databooks.textes.toLocaleString("fr-FR")} avec texte
						</div>
						<div className="mt-3 space-y-1 text-[10px] text-white/40">
							<div>Dernière activité : {dateHeure(databooks.derniereActivite)}</div>
							<div>
								État mesuré : {dateHeure(databooks.genereLe)} ·{" "}
								{databooks.lotActif ?? "aucun lot actif"}
							</div>
							{databooks.gpu && (
								<div>
									{databooks.gpu.nom} · {databooks.gpu.memoireUtilisee} /{" "}
									{databooks.gpu.memoireTotale} · {databooks.gpu.utilisation} au dernier relevé
								</div>
							)}
						</div>
					</CartePipeline>
				) : (
					<div className="dbz-panel p-4 lg:col-span-1">
						<h3 className="font-saiyan text-sm uppercase tracking-wider text-white/60">
							AphrodyGPU · databooks
						</h3>
						<p className="mt-3 text-xs leading-relaxed text-white/45">
							Aucun manifeste OCR databooks local n&apos;est monté dans ce runtime.
						</p>
					</div>
				)}

				{manga ? (
					<CartePipeline titre="OCR manga · run local" etat={manga.etat}>
						<div className="flex items-baseline justify-between gap-2 text-sm">
							<strong className="tabular-nums text-white">
								{manga.resultats.toLocaleString("fr-FR")} / {manga.pages.toLocaleString("fr-FR")}
							</strong>
							<span className="text-dbz-orange">résultats</span>
						</div>
						<div className="mt-2 text-[11px] text-white/55">
							{manga.restant.toLocaleString("fr-FR")} restant ·{" "}
							{manga.aRelire.toLocaleString("fr-FR")} audit{manga.aRelire > 1 ? "s" : ""} à relire
						</div>
						<div className="mt-3 space-y-1 text-[10px] text-white/40">
							<div>
								Run {manga.runId} · {manga.lots} lot{manga.lots > 1 ? "s" : ""}
							</div>
							<div>Manifest généré : {dateHeure(manga.genereLe)} · non déposé automatiquement</div>
						</div>
					</CartePipeline>
				) : (
					<div className="dbz-panel p-4">
						<h3 className="font-saiyan text-sm uppercase tracking-wider text-white/60">
							OCR manga · run local
						</h3>
						<p className="mt-3 text-xs leading-relaxed text-white/45">
							Aucun run manga local détecté.
						</p>
					</div>
				)}

				<div className="dbz-panel p-4">
					<div className="mb-3 flex items-center justify-between gap-3">
						<h3 className="font-saiyan text-sm uppercase tracking-wider text-dbz-orange">
							Manga upload · base publiée
						</h3>
						<span className="rounded-full border border-green-400/30 bg-green-400/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-green-300">
							PostgreSQL
						</span>
					</div>
					<div className="flex items-baseline justify-between gap-2 text-sm">
						<strong className="tabular-nums text-white">
							{uploads.planches.toLocaleString("fr-FR")}
						</strong>
						<span className="text-dbz-orange">planches référencées</span>
					</div>
					<div className="mt-2 text-[11px] text-white/55">
						{uploads.chapitresAvecPages.toLocaleString("fr-FR")} /{" "}
						{uploads.chapitres.toLocaleString("fr-FR")} chapitres avec pages
					</div>
					<div className="mt-3 space-y-1 text-[10px] text-white/40">
						<div>
							OCR miroir : {uploads.ocrPlanches.toLocaleString("fr-FR")} planches ·{" "}
							{uploads.ocrPlanchesAvecTexte.toLocaleString("fr-FR")} avec texte
						</div>
						<div>
							{uploads.series
								.map((serie) => `${serie.serie} : ${serie.planches.toLocaleString("fr-FR")}`)
								.join(" · ") || "Aucune série"}
						</div>
					</div>
				</div>
			</div>
			<p className="mt-3 text-[11px] leading-relaxed text-white/40">
				Les deux premiers blocs décrivent le poste local et peuvent être absents sur le serveur
				public. Le bloc upload est la mesure de publication ; un résultat OCR local ne devient pas
				public avant audit et dépôt explicite.
			</p>
		</section>
	);
}

/**
 * Trois états de travail, dans l'ordre où ils intéressent un relecteur : ce qui
 * est en cours d'abord (c'est là qu'on reprend), le reste ensuite.
 */
type Etat = "en-cours" | "termine" | "vide";

function etatDe(f: ProgressionFiche): Etat {
	if (f.planches === 0) return "vide";
	return f.transcrites >= f.planches ? "termine" : "en-cours";
}

function Jauge({ valeur, sur }: { valeur: number; sur: number }) {
	const p = pct(valeur, sur);
	return (
		<div
			className="h-1.5 w-full overflow-hidden rounded-full bg-white/10"
			role="progressbar"
			aria-valuenow={p}
			aria-valuemin={0}
			aria-valuemax={100}
			aria-label={`${valeur} planches transcrites sur ${sur}`}
		>
			<div
				className={`h-full rounded-full transition-[width] ${
					p >= 100 ? "bg-green-400" : p >= 50 ? "bg-dbz-orange" : "bg-dbz-yellow/70"
				}`}
				style={{ width: `${p}%` }}
			/>
		</div>
	);
}

function Tuile({
	valeur,
	libelle,
	detail,
	accent,
}: {
	valeur: string;
	libelle: string;
	detail?: string;
	accent?: "orange" | "vert" | "ambre";
}) {
	const couleur =
		accent === "vert"
			? "text-green-300"
			: accent === "ambre"
				? "text-amber-300"
				: "text-dbz-orange";
	return (
		<div className="dbz-panel p-4">
			<div className={`font-saiyan text-3xl tabular-nums ${couleur}`}>{valeur}</div>
			<div className="mt-1 text-[10px] font-bold uppercase tracking-widest text-dbz-blue-light">
				{libelle}
			</div>
			{detail && <div className="mt-1 text-[11px] text-white/50">{detail}</div>}
		</div>
	);
}

export default async function AdminTranscriptionsPage() {
	const [{ fiches, total, rythme }, local, uploads] = await Promise.all([
		progressionTranscription(),
		etatPipelinesLocaux(),
		mangaUploadStatus(),
	]);

	const parEtat = {
		"en-cours": [] as ProgressionFiche[],
		termine: [] as ProgressionFiche[],
		vide: [] as ProgressionFiche[],
	};
	for (const f of fiches) parEtat[etatDe(f)].push(f);

	// En cours : le plus avancé d'abord — on finit ce qui est presque fini avant
	// d'ouvrir un nouvel ouvrage.
	parEtat["en-cours"].sort(
		(a, b) =>
			pct(b.transcrites, b.planches) - pct(a.transcrites, a.planches) || b.planches - a.planches
	);
	parEtat.termine.sort((a, b) => b.planches - a.planches);
	parEtat.vide.sort((a, b) => a.titre.localeCompare(b.titre, "fr"));

	const restantes = total.planches - total.transcrites;
	const fautives = fiches.filter((f) => f.fautives > 0).sort((a, b) => b.fautives - a.fautives);

	return (
		<div className="mx-auto w-full max-w-6xl">
			<AdminHeader
				title="Transcriptions"
				subtitle={`${total.transcrites.toLocaleString("fr-FR")} / ${total.planches.toLocaleString("fr-FR")} planches · ${pct(total.transcrites, total.planches)} %`}
				right={
					<Link href="/admin/db-universe/databooks" className="btn btn-ghost h-9 px-3 text-xs">
						<Livre className="h-3.5 w-3.5" />
						Fiches & métadonnées
					</Link>
				}
			/>

			<p className="mb-6 max-w-3xl text-sm leading-relaxed text-white/50">
				Le texte des planches est produit par lecture automatique des scans, puis relu ici. Chaque
				écriture passe par <code className="text-dbz-orange/80">public.wiki_revisions</code> — une
				transcription reste une <strong className="text-white/70">proposition réversible</strong>,
				consultable depuis{" "}
				<Link href="/admin/wiki/history" className="text-dbz-orange hover:underline">
					l&apos;historique wiki
				</Link>
				.
			</p>

			{/* ── Synthèse ─────────────────────────────────────────────────────── */}
			<div className="mb-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
				<Tuile
					valeur={`${pct(total.transcrites, total.planches)} %`}
					libelle="Progression"
					detail={`${restantes.toLocaleString("fr-FR")} planches restantes`}
				/>
				<Tuile
					valeur={signes(total.signes)}
					libelle="Signes transcrits"
					detail={`${Math.round(total.signes / Math.max(1, total.transcrites))} par planche en moyenne`}
					accent="vert"
				/>
				<Tuile
					valeur={String(parEtat.termine.length)}
					libelle="Ouvrages terminés"
					detail={`${parEtat["en-cours"].length} en cours · ${parEtat.vide.length} sans planche`}
					accent="vert"
				/>
				<Tuile
					valeur={total.fautives.toLocaleString("fr-FR")}
					libelle="Signaux OCR durs"
					detail="Caractères illisibles, alphabets hallucinés, faux chinois"
					accent={total.fautives > 0 ? "ambre" : "vert"}
				/>
			</div>

			<div className="dbz-panel mb-8 p-5">
				<div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
					<h2 className="font-saiyan text-sm uppercase tracking-wider text-dbz-orange">
						Avancement global
					</h2>
					<span className="text-[11px] text-white/50">
						{total.transcrites.toLocaleString("fr-FR")} transcrites ·{" "}
						{total.avecImage.toLocaleString("fr-FR")} avec planche scannée
					</span>
				</div>
				<Jauge valeur={total.transcrites} sur={total.planches} />
				<RythmeSparkline points={rythme} />
			</div>

			<PipelinesLocaux local={local} uploads={uploads} />

			{/* ── Recherche dans les planches ──────────────────────────────────── */}
			<TranscriptionSearch />

			{/* ── Planches à vérifier ──────────────────────────────────────────── */}
			{fautives.length > 0 && (
				<section className="mb-10">
					<h2 className="mb-3 flex items-center gap-2 border-b-2 border-amber-500/30 pb-2 font-saiyan text-xl uppercase text-amber-300">
						<Alerte className="h-4 w-4" />
						Signaux OCR durs
						<span className="font-sans text-xs font-normal normal-case text-white/50">
							{total.fautives} planche{total.fautives > 1 ? "s" : ""} sur {fautives.length} ouvrage
							{fautives.length > 1 ? "s" : ""}
						</span>
					</h2>
					<p className="mb-3 text-xs text-white/50">
						Ce compteur couvre les défauts OCR certains. La file « À vérifier » de chaque ouvrage
						ajoute aussi les textes trop courts et les répétitions, contrôlés dans le lecteur.
					</p>
					<div className="flex flex-wrap gap-2">
						{fautives.map((f) => (
							<Link
								key={f.id}
								href={`/admin/databooks/${f.id}?filtre=suspectes`}
								className="inline-flex items-center gap-2 rounded-md border border-amber-500/30 bg-amber-500/5 px-3 py-1.5 text-xs text-amber-100/90 transition-colors hover:border-amber-400 hover:bg-amber-500/10"
							>
								<span className="max-w-[26ch] truncate">{f.titre}</span>
								<span className="rounded bg-amber-500/20 px-1.5 py-0.5 font-mono text-[10px] font-bold tabular-nums">
									{f.fautives}
								</span>
							</Link>
						))}
					</div>
				</section>
			)}

			{/* ── Ouvrages ─────────────────────────────────────────────────────── */}
			{(
				[
					["en-cours", "En cours", parEtat["en-cours"]],
					["termine", "Terminés", parEtat.termine],
					["vide", "Sans planche", parEtat.vide],
				] as const
			).map(([cle, libelle, liste]) =>
				liste.length === 0 ? null : (
					<section key={cle} className="mb-10">
						<h2 className="mb-3 flex items-center gap-2 border-b-2 border-dbz-yellow/30 pb-2 font-saiyan text-xl uppercase text-dbz-yellow">
							{cle === "termine" && <CocheCercle className="h-4 w-4 text-green-400" />}
							{libelle}
							<span className="font-sans text-xs font-normal normal-case text-white/50">
								{liste.length}
							</span>
						</h2>

						{cle === "vide" ? (
							<p className="mb-3 text-xs text-white/50">
								Aucun scan déposé : rien à transcrire tant que les planches n&apos;ont pas été
								importées.
							</p>
						) : null}

						<div className="overflow-x-auto">
							<table className="w-full">
								<thead>
									<tr className="border-b-2 border-dbz-border/60">
										<th className="w-12 p-2" />
										<th className="p-2 text-left text-xs uppercase tracking-widest text-dbz-blue-light">
											Ouvrage
										</th>
										<th className="w-48 p-2 text-left text-xs uppercase tracking-widest text-dbz-blue-light">
											Transcription
										</th>
										<th className="w-20 p-2 text-right text-xs uppercase tracking-widest text-dbz-blue-light">
											Signes
										</th>
										<th className="w-20 p-2 text-center text-xs uppercase tracking-widest text-dbz-blue-light">
											Signaux
										</th>
										<th className="w-24 p-2 text-left text-xs uppercase tracking-widest text-dbz-blue-light">
											Dernier dépôt
										</th>
										<th className="w-28 p-2 text-right text-xs uppercase tracking-widest text-dbz-blue-light">
											Actions
										</th>
									</tr>
								</thead>
								<tbody>
									{liste.map((f) => {
										const coverUrl = f.cover
											? /^https?:\/\//.test(f.cover)
												? f.cover
												: assetCdnUrl(f.cover)
											: null;
										return (
											<tr
												key={f.id}
												className="border-b border-dbz-border/30 transition-colors hover:bg-dbz-blue-light/5"
											>
												<td className="p-2">
													{coverUrl ? (
														<Image
															src={coverUrl}
															alt=""
															width={32}
															height={46}
															className="rounded border border-dbz-border object-cover"
															unoptimized
														/>
													) : (
														<div className="h-[46px] w-8 rounded bg-dbz-border/30" />
													)}
												</td>
												<td className="p-2">
													<Link
														href={`/admin/databooks/${f.id}`}
														className="text-sm font-medium text-white hover:text-dbz-orange"
													>
														{f.titre}
													</Link>
													<div className="mt-0.5 flex flex-wrap items-center gap-2 text-[10px]">
														{f.categorie && (
															<span className="font-mono uppercase text-dbz-orange/80">
																{f.categorie}
															</span>
														)}
														{!f.visible && (
															<span className="rounded bg-white/5 px-1 py-0.5 font-bold uppercase text-white/50">
																masqué
															</span>
														)}
													</div>
												</td>
												<td className="p-2">
													{f.planches === 0 ? (
														<span className="text-[11px] text-white/40">aucune planche</span>
													) : (
														<>
															<div className="mb-1 flex items-baseline justify-between text-[11px] tabular-nums">
																<span className="text-white/70">
																	{f.transcrites}/{f.planches}
																</span>
																<span className="font-bold text-dbz-orange">
																	{pct(f.transcrites, f.planches)} %
																</span>
															</div>
															<Jauge valeur={f.transcrites} sur={f.planches} />
														</>
													)}
												</td>
												<td className="p-2 text-right text-[11px] tabular-nums text-white/55">
													{f.signes > 0 ? signes(f.signes) : "—"}
												</td>
												<td className="p-2 text-center">
													{f.fautives > 0 ? (
														<Link
															href={`/admin/databooks/${f.id}?filtre=suspectes`}
															className="inline-block rounded bg-amber-500/15 px-1.5 py-0.5 font-mono text-[10px] font-bold tabular-nums text-amber-300 hover:bg-amber-500/25"
														>
															{f.fautives}
														</Link>
													) : (
														<span className="text-[11px] text-white/25">—</span>
													)}
												</td>
												<td className="p-2 text-[11px] text-white/55">
													{dateCourte(f.derniereEdition)}
												</td>
												<td className="p-2">
													<div className="flex items-center justify-end gap-1">
														{f.planches > 0 && (
															<Link
																href={`/admin/databooks/${f.id}`}
																className="inline-flex items-center gap-1 rounded border border-dbz-border/60 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-dbz-blue-light transition-colors hover:border-dbz-orange hover:text-dbz-orange"
															>
																Relire
																<FlecheCoin className="h-3 w-3" />
															</Link>
														)}
														<a
															href={`/wiki/databooks/${f.id}`}
															target="_blank"
															rel="noopener noreferrer"
															className="rounded border border-dbz-border/60 p-1 text-white/50 transition-colors hover:border-dbz-orange hover:text-dbz-orange"
															title="Page publique"
														>
															<LienExterne className="h-3 w-3" />
														</a>
													</div>
												</td>
											</tr>
										);
									})}
								</tbody>
							</table>
						</div>
					</section>
				)
			)}
		</div>
	);
}
