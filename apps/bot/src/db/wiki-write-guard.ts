/**
 * Garde d'écriture du wiki éditorial dans le SQLite LOCAL.
 *
 * Neon `bot.*` est la SOURCE DE VÉRITÉ du wiki éditorial ; le SQLite du bot est
 * un replica de lecture rafraîchi par le reverse-sync (`sync-neon-to-sqlite.ts`,
 * timer toutes les 15 min). Tout seed/ingest qui écrit l'éditorial ICI serait
 * SILENCIEUSEMENT ÉCRASÉ au prochain pull → travail perdu + faux succès.
 *
 * Importer pour le side-effect EN TÊTE de tout script qui écrit les tables
 * éditoriales du SQLite : `import "~/db/wiki-write-guard";` (scripts) ou
 * `import "./wiki-write-guard";` (src/db).
 *
 * Override (risqué, perdu au prochain pull) : `ALLOW_SQLITE_WIKI_WRITE=1`.
 * Le seed/ingest éditorial doit désormais cibler Neon, pas ce replica.
 */
if (!Bun.env.ALLOW_SQLITE_WIKI_WRITE) {
	console.error(
		"✗ Wiki migré sur Neon (source de vérité). Ce script écrit le SQLite local,\n" +
			"  écrasé par le reverse-sync Neon→SQLite. Seed/ingest éditorial doit cibler Neon.\n" +
			"  Override (risqué, perdu au prochain pull) : ALLOW_SQLITE_WIKI_WRITE=1.",
	);
	process.exit(1);
}
