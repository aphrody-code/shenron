import { permanentRedirect } from "next/navigation";

// Doublon historique de /wiki/films (lecture API id-based). La source canonique
// est désormais /wiki/films (Neon, slug-based, référencée dans la nav).
export default function MoviesLegacyRedirect() {
	permanentRedirect("/wiki/films");
}
