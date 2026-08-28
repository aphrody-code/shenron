import Link from "next/link";
import type { Metadata } from "next";
import { DISCORD_INVITE } from "@/lib/config";

export const metadata: Metadata = {
	title: "Licence & usage",
	description:
		"Politique d'usage des contenus DBFR, mentions fair-use, attribution Fandom CC-BY-SA, contact pour demande de retrait.",
	alternates: { canonical: "/licence" },
};

export default function LicencePage() {
	return (
		<div className="w-full mx-auto max-w-[820px] px-6 lg:px-10 py-16 lg:py-24">
			<header className="mb-12">
				<p className="font-display font-semibold text-[12px] tracking-[0.18em] uppercase text-dbz-orange mb-4">
					Mentions légales
				</p>
				<h1 className="font-display font-bold text-[40px] md:text-[56px] leading-[1.05] tracking-[-0.01em] text-white mb-6">
					Licence & usage
				</h1>
				<p className="text-[17px] leading-relaxed text-white/70">
					DBFR (« le site ») est un site de fans communautaire à but non lucratif, dédié à la
					promotion francophone de l'œuvre Dragon Ball d'Akira Toriyama.
				</p>
			</header>

			<div className="prose prose-invert prose-headings:font-display prose-headings:font-bold prose-headings:text-white prose-h2:text-[24px] prose-h2:mt-12 prose-h2:mb-4 prose-h2:border-b prose-h2:border-white/10 prose-h2:pb-2 prose-h3:text-[18px] prose-h3:mt-8 prose-p:text-white/75 prose-p:leading-relaxed prose-p:text-[15px] prose-a:text-dbz-orange prose-a:no-underline hover:prose-a:underline prose-strong:text-white prose-li:text-white/75 prose-li:text-[15px] max-w-none">
				<h2>1. Statut du site</h2>
				<p>
					DBFR est un projet associatif, édité bénévolement par des fans francophones de Dragon
					Ball. Le site <strong>ne vend ni produits dérivés ni abonnement</strong> et ne
					commercialise aucun contenu Dragon Ball. Il affiche en revanche des{" "}
					<strong>annonces publicitaires</strong> (Google AdSense) dont les recettes servent
					exclusivement à couvrir les frais d'hébergement, de nom de domaine et de bande passante du
					projet — voir la <Link href="/confidentialite">politique de confidentialité</Link>. Les
					éventuels liens vers des boutiques officielles (Bandai Namco, dbz-store, Toei Shop) ne
					sont pas affiliés.
				</p>
				<p>
					Le site n'est <strong>en aucune façon affilié, sponsorisé, ou approuvé</strong> par Bird
					Studio, Shueisha, Toei Animation, Bandai Namco Entertainment ou tout autre ayant droit de
					la franchise Dragon Ball.
				</p>

				<h2>2. Propriété intellectuelle des œuvres</h2>
				<p>
					Dragon Ball, Dragon Ball Z, Dragon Ball Super, Dragon Ball GT, Dragon Ball Daima, Dragon
					Ball Heroes, ainsi que l'ensemble des personnages, lieux, attaques, transformations et
					éléments graphiques associés sont la <strong>propriété exclusive</strong> de leurs ayants
					droit respectifs :
				</p>
				<ul>
					<li>© Bird Studio / Akira Toriyama — œuvre originale (1984)</li>
					<li>© Shueisha — édition manga</li>
					<li>© Toei Animation — productions animées</li>
					<li>© Bandai Namco Entertainment — jeux vidéo officiels</li>
				</ul>
				<p>
					Les images, scans, stills, artworks officiels et noms de marque apparaissant sur ce site
					sont utilisés à des fins
					<strong> strictement informatives et éditoriales</strong>, encyclopédiques et non
					commerciales, dans un cadre comparable aux sites de fans encyclopédiques (Fandom,
					ja.wikipedia, etc.).
				</p>

				<h2>3. Contenu produit par DBFR</h2>
				<p>
					Le contenu rédactionnel original (articles de news, résumés de sagas, classements, code
					applicatif) est publié par défaut sous licence{" "}
					<a
						href="https://creativecommons.org/licenses/by-sa/4.0/deed.fr"
						target="_blank"
						rel="noopener noreferrer"
					>
						Creative Commons BY-SA 4.0
					</a>{" "}
					(attribution + partage à l'identique). Tu peux reprendre, citer et modifier ce contenu en
					créditant DBFR et en redistribuant sous la même licence.
				</p>

				<h2>4. Contenu repris de sources tierces</h2>
				<h3>Textes issus de Fandom</h3>
				<p>
					Les passages encyclopédiques repris de{" "}
					<a
						href="https://dragonball.fandom.com/fr/wiki/Wiki_Dragon_Ball"
						target="_blank"
						rel="noopener noreferrer"
					>
						dragonball.fandom.com
					</a>{" "}
					sont publiés sous licence{" "}
					<a
						href="https://creativecommons.org/licenses/by-sa/3.0/"
						target="_blank"
						rel="noopener noreferrer"
					>
						CC-BY-SA 3.0
					</a>{" "}
					avec attribution explicite et lien vers la page d'origine.
				</p>
				<h3>Données issues d'APIs publiques</h3>
				<p>
					Les fiches personnages et planètes proviennent de l'API open-source{" "}
					<a href="https://dragonball-api.com/" target="_blank" rel="noopener noreferrer">
						dragonball-api.com
					</a>
					. Les métadonnées anime/manga proviennent de Jikan, Kitsu et AniList (APIs publiques).
				</p>

				<h2>5. Hébergement &amp; données utilisateurs</h2>
				<p>
					Site hébergé sur un serveur dédié <a href="https://www.ovhcloud.com/">OVHcloud</a>{" "}
					(France, Gravelines). Authentification via Discord OAuth (
					<a href="https://discord.com/developers/docs">Discord Inc.</a>). Aucune donnée personnelle
					n'est revendue. Tu peux demander suppression de ton compte à tout moment via le serveur
					Discord. Le détail des traitements (mesure d'audience, publicité, cookies) figure dans la{" "}
					<Link href="/confidentialite">politique de confidentialité</Link>.
				</p>

				<h2 id="takedown">6. Demande de retrait (DMCA / droit voisin)</h2>
				<p>
					Si vous êtes ayant droit et estimez qu'un contenu publié sur DBFR porte atteinte à vos
					droits, nous procédons au retrait <strong>sous 48 heures</strong> sur simple demande
					motivée. Aucun recours juridique préalable n'est nécessaire.
				</p>
				<p>
					Indiquez : l'URL du contenu litigieux, votre qualité (ayant droit / mandataire), et la
					nature de l'atteinte. Contact :
				</p>
				<ul>
					<li>
						Serveur Discord :{" "}
						<a href={DISCORD_INVITE} target="_blank" rel="noopener noreferrer">
							discord.gg/dragonballfr
						</a>{" "}
						(canal #admin)
					</li>
					<li>E-mail : à publier (utiliser Discord en attendant)</li>
				</ul>

				<h2>7. Modifications</h2>
				<p>
					Cette licence peut être amendée à tout moment. La version en vigueur est celle publiée sur
					cette page. Dernière révision :{" "}
					{new Date().toLocaleDateString("fr-FR", {
						day: "numeric",
						month: "long",
						year: "numeric",
					})}
					.
				</p>
			</div>

			<div className="mt-16 p-8 rounded-2xl bg-white/[0.04] border border-white/[0.06] flex flex-wrap items-center justify-between gap-4">
				<p className="text-[14px] text-white/70 max-w-md">
					Une question sur l'usage d'un contenu ? Notre canal{" "}
					<code className="text-dbz-orange">#admin</code> sur Discord répond sous 24h.
				</p>
				<Link
					href="/credits"
					className="inline-flex items-center h-10 px-5 rounded-full border border-white/20 hover:border-dbz-orange hover:text-dbz-orange text-white font-display font-semibold text-[13px] tracking-[0.10em] uppercase transition-colors"
				>
					Voir les crédits
				</Link>
			</div>
		</div>
	);
}
