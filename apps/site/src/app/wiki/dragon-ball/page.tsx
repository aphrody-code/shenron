import { permanentRedirect } from "next/navigation";

// L'ancien index « Encyclopédie » fourre-tout (films + jeux + persos + planètes)
// a été démantelé : chaque axe a désormais sa page dédiée (/wiki/personnages,
// /wiki/planetes, /wiki/films, /wiki/jeux, /wiki/dragon-ball/techniques) et le
// hub /wiki agrège le tout. On garde l'URL vivante (liens entrants, SEO) en la
// renvoyant 308 vers la page Personnages. Les routes détail enfants
// (/wiki/dragon-ball/character|planet|techniques/…) restent inchangées.
export default function DragonBallIndexRedirect() {
	permanentRedirect("/wiki/personnages");
}
