export const meta = {
	name: 'wiki-fandom-articles',
	description: 'Génère des articles wiki Fandom FR sourcés (RAG) et les écrit en PG bot.*',
	phases: [{ title: 'Articles' }],
}

// args = { type: "characters"|"planets"|..., ids: number[] }
// Robustesse : selon le harness, `args` peut arriver en objet OU en string JSON.
let A = args
if (typeof A === 'string') { try { A = JSON.parse(A) } catch { A = {} } }
const TYPE = (A && A.type) || 'characters'
const IDS = (A && Array.isArray(A.ids)) ? A.ids : []
log(`Type=${TYPE} · ${IDS.length} entités à traiter.`)
if (!IDS.length) { log('Aucun id fourni (args.ids) — rien à faire.'); return [] }

// Préfixe bash : charge DATABASE_URL (PG du site) depuis le fichier systemd-format.
const ENV = `export DATABASE_URL="$(grep -h '^DATABASE_URL=' ~/.shenron-neon.env | tail -1 | cut -d= -f2- | tr -d '\\"')"`

// Consignes éditoriales par type (sections attendues, ton).
const GUIDE = {
	characters: `Sections markdown attendues (n'inclus QUE celles soutenues par les passages/faits) :
- un PARAGRAPHE d'introduction en **gras** sur le nom (qui est l'entité, race, rôle dans la franchise).
- ## Histoire  (avec des sous-sections ### par saga/arc quand le matériel le permet : enfance, Saga des Saiyans, Namek/Freezer, Cell, Majin Boo, Super…)
- ## Personnalité
- ## Pouvoirs et techniques  (techniques de ki, capacités ; cite les techniques connues)
- ## Transformations  (si le personnage en a)
- ## Anecdotes  (trivia sourcé, étymologie du nom, différences manga/anime)`,
	planets: `- intro **gras** (nom, système, rôle).
- ## Histoire
- ## Habitants  (peuple, race dominante)
- ## Géographie / Environnement
- ## Destruction  (si détruite)
- ## Anecdotes`,
	sagas: `- intro **gras** (nom de la saga, série, place dans la chronologie).
- ## Résumé de l'intrigue  (### par arc si pertinent)
- ## Personnages principaux
- ## Affrontements clés
- ## Anecdotes`,
	arcs: `- intro **gras**.
- ## Résumé
- ## Combats et personnages
- ## Dénouement
- ## Anecdotes`,
	techniques: `- intro **gras** (nom, type, utilisateur d'origine).
- ## Fonctionnement
- ## Utilisateurs
- ## Première apparition  (chapitre manga / épisode si connu)
- ## Variantes / Anecdotes`,
	transformations: `- intro **gras** (nom, qui peut l'atteindre).
- ## Conditions et activation
- ## Apparence
- ## Puissance et capacités
- ## Première apparition
- ## Anecdotes`,
	races: `- intro **gras** (nom de la race, planète d'origine).
- ## Caractéristiques / Biologie
- ## Société / Culture
- ## Membres notables
- ## Anecdotes`,
}

function composePrompt(type, id) {
	return `Tu es encyclopédiste pour **dragonballfr.com**, un wiki Dragon Ball factuel façon Fandom, CENTRÉ sur les sources du manga et le canon. Tu rédiges l'ARTICLE long-format de l'entité ${type} #${id}.

ÉTAPE 1 — Récupère le grounding (passages sourcés + faits structurés) :
\`\`\`
cd /home/ubuntu/shenron && ${ENV}
bun apps/bot/scripts/wiki-articles.ts context ${type} ${id}
\`\`\`
Lis attentivement la sortie : FAITS STRUCTURÉS, DESCRIPTION ACTUELLE, PASSAGES SOURCÉS [n], et la ligne SOURCES_JSON.
(Optionnel : tu peux compléter avec l'outil MCP dragon-ball \`rag_search\` si un point reste flou, mais NE TE BASE QUE sur des informations vérifiables.)

ÉTAPE 2 — Rédige un VRAI article encyclopédique en **français**, en **markdown** :
${GUIDE[type] || GUIDE.characters}

RÈGLES STRICTES :
- FACTUEL avant tout. N'invente RIEN : utilise uniquement les PASSAGES SOURCÉS + FAITS STRUCTURÉS + canon Dragon Ball largement établi. En cas de doute sur un chiffre (niveau de ki, date), n'affirme pas — reste prudent ou omets.
- Ton encyclopédique mais VIVANT, comme un bon article Fandom. Pas de méta-commentaire, pas de « selon les sources ».
- NE commence PAS par un titre \`#\` (le nom est déjà affiché en H1 par la page). Commence par le paragraphe d'intro en gras.
- Utilise \`##\` / \`###\` pour les sections, des listes \`-\` quand c'est pertinent. Markdown propre.
- Place des appels de citation \`[n]\` (correspondant aux passages) là où tu t'appuies sur une source précise (faits non triviaux, dates, événements).
- Longueur cible : 2500 à 7000 caractères selon le matériel disponible (un personnage majeur = riche ; une entité mineure = plus court mais complet).
- Privilégie le canon manga ; signale les différences notables manga/anime/films/jeux quand elles sont sourcées.

ÉTAPE 3 — Écris les fichiers puis persiste en base :
1. Écris l'article markdown dans \`/tmp/wiki-art-${type}-${id}.md\`.
2. Écris les sources citées dans \`/tmp/wiki-art-${type}-${id}.sources.json\` : un tableau JSON \`[{"n":1,"label":"...","url":"...","kind":"..."}]\` — REPRENDS les entrées de SOURCES_JSON correspondant aux [n] que tu as RÉELLEMENT cités (garde la même numérotation n).
3. Persiste :
\`\`\`
cd /home/ubuntu/shenron && ${ENV}
bun apps/bot/scripts/wiki-articles.ts write ${type} ${id} --article-file /tmp/wiki-art-${type}-${id}.md --sources-file /tmp/wiki-art-${type}-${id}.sources.json
\`\`\`
La commande affiche « ✓ ${type} #${id} : article N c, M sources. » en cas de succès.

Réponds avec le statut final (l'objet structuré demandé).`
}

const STATUS = {
	type: 'object',
	additionalProperties: false,
	required: ['id', 'ok', 'chars', 'nSources'],
	properties: {
		id: { type: 'number' },
		ok: { type: 'boolean', description: 'true si l\'écriture PG a réussi' },
		chars: { type: 'number', description: 'longueur de l\'article écrit' },
		nSources: { type: 'number', description: 'nombre de sources citées' },
		note: { type: 'string', description: 'court résumé ou raison d\'échec' },
	},
}

phase('Articles')
const results = await pipeline(
	IDS,
	(id) => agent(composePrompt(TYPE, id), {
		agentType: 'general-purpose',
		label: `${TYPE}:${id}`,
		phase: 'Articles',
		schema: STATUS,
	}),
)

const ok = results.filter((r) => r && r.ok)
const failed = results.filter((r) => !r || !r.ok)
log(`Terminé : ${ok.length}/${IDS.length} articles écrits · ${failed.length} échec(s).`)
return { type: TYPE, total: IDS.length, ok: ok.length, failed: failed.length, results }
