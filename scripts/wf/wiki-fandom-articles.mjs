export const meta = {
	name: 'wiki-fandom-articles',
	description: 'Génère des articles wiki FR ancrés MANGA (planches OCR + chapitres) et les écrit en PG bot.*',
	phases: [{ title: 'Articles' }],
}

// args = { type, ids } pour un seul type, OU { jobs: [{type, ids}, ...] } pour
// enchaîner plusieurs types dans UN run sériel (évite de stacker des workflows
// concurrents → rate-limit). `conc` borne la concurrence (défaut 6).
// Robustesse : selon le harness, `args` peut arriver en objet OU en string JSON.
let A = args
if (typeof A === 'string') { try { A = JSON.parse(A) } catch { A = {} } }
const JOBS = (A && Array.isArray(A.jobs))
	? A.jobs.filter((j) => j && j.type && Array.isArray(j.ids) && j.ids.length)
	: ((A && A.type && Array.isArray(A.ids)) ? [{ type: A.type, ids: A.ids }] : [])
const CONC = (A && Number(A.conc)) || 6
const totalAll = JOBS.reduce((n, j) => n + j.ids.length, 0)
log(`${JOBS.length} job(s) · ${totalAll} entités · concurrence ${CONC}`)
if (!totalAll) { log('Aucun id fourni — rien à faire.'); return [] }

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
	return `Tu es encyclopédiste pour **dragonballfr.com**, un wiki Dragon Ball RIGOUREUSEMENT ANCRÉ DANS LE MANGA d'Akira Toriyama (et les databooks officiels). Tu rédiges l'ARTICLE long-format de l'entité ${type} #${id}.

ÉTAPE 1 — Récupère le grounding manga (chapitres + planches OCR nettoyées + faits structurés) :
\`\`\`
cd /home/ubuntu/shenron && ${ENV}
bun apps/bot/scripts/wiki-articles.ts context ${type} ${id}
\`\`\`
La sortie contient : FAITS STRUCTURÉS (notre base), DESCRIPTION ACTUELLE (contexte, NE PAS recopier), éventuellement un **ARTICLE EXISTANT (BASE DE TRAVAIL)**, REPÈRES CHAPITRES MANGA (titres propres, citables tels quels), PLANCHES MANGA [n] (OCR de vraies planches déjà dé-bruité — les bulles peuvent être désordonnées : reconstitue le sens), et la ligne SOURCES_JSON. **Ces passages sont l'UNIQUE source autorisée avec les faits structurés.**

ÉTAPE 2 — Rédige/MIGRE un VRAI article encyclopédique en **français**, en **markdown** :
${GUIDE[type] || GUIDE.characters}

RÈGLES STRICTES :
- **SI un ARTICLE EXISTANT est fourni → tu le MIGRES, tu ne repars PAS de zéro** : garde sa structure, sa prose de qualité et toutes les ENTITÉS qu'il cite (autres personnages/lieux/sagas = liens & sujets à creuser), mais RÉ-ANCRE chaque fait notable sur les PLANCHES MANGA / REPÈRES CHAPITRES, remplace les renvois Fandom par des citations manga, et APPROFONDIS avec ce que les planches révèlent. Le résultat doit être ≥ aussi riche que l'existant, mais 100 % sourcé manga. Sinon (pas d'existant), rédige de zéro depuis le grounding.
- **SOURCE = MANGA UNIQUEMENT.** Appuie-toi sur les PLANCHES MANGA [n], les REPÈRES CHAPITRES et les FAITS STRUCTURÉS. Tu peux compléter avec le canon manga LARGEMENT et indiscutablement établi (ex. ordre des sagas), mais chaque fait notable (événement, combat, transformation, mort, résurrection) doit pouvoir s'ancrer sur une planche/chapitre cité.
- **FANDOM INTERDIT.** Ne cite JAMAIS Fandom, wikia, ni aucune URL externe. Aucune source ne doit pointer ailleurs que le manga (tome/chapitre). Si une info ne vient ni des planches ni du canon manga incontestable, OMETS-LA plutôt que de l'inventer.
- N'invente AUCUN chiffre (niveau de ki, date précise, taille) qui ne figure pas explicitement dans le grounding.
- Ton encyclopédique mais VIVANT. Pas de méta-commentaire (« selon l'OCR », « d'après les planches »), pas de « selon les sources ».
- NE commence PAS par un titre \`#\` (le nom est déjà affiché en H1 par la page). Commence par le paragraphe d'intro en gras.
- Utilise \`##\` / \`###\` pour les sections, des listes \`-\` quand c'est pertinent. Markdown propre.
- Place des appels de citation \`[n]\` renvoyant aux PLANCHES MANGA là où tu t'appuies sur un événement précis. Référence les chapitres en clair (« …(Manga, Tome X / Chapitre NN) [n] »).
- Longueur cible : 2500 à 7000 caractères selon le matériel disponible (entité majeure = riche ; mineure = plus courte mais complète).

ÉTAPE 3 — Écris les fichiers puis persiste en base :
1. Écris l'article markdown dans \`/tmp/wiki-art-${type}-${id}.md\`.
2. Écris les sources citées dans \`/tmp/wiki-art-${type}-${id}.sources.json\` : un tableau JSON \`[{"n":1,"label":"Manga, Tome X / Chapitre NN","url":"/wiki/manga","kind":"manga"}]\` — REPRENDS les entrées de SOURCES_JSON correspondant aux [n] que tu as RÉELLEMENT cités (garde la même numérotation n). Toutes les sources doivent être \`"kind":"manga"\` avec une \`url\` interne (/wiki/manga) — AUCUNE URL Fandom/externe.
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

// Concurrence BORNÉE par batches séquentiels (défaut 6) : éviter de saturer la
// concurrence de l'API (pipeline auto-16 + workflows concurrents → rate-limit).
// « Aucune limite de temps » → on privilégie la fiabilité à la vitesse.
phase('Articles')
const summary = []
let grandOk = 0
for (const job of JOBS) {
	const TYPE = job.type
	const IDS = job.ids
	let jobOk = 0
	for (let i = 0; i < IDS.length; i += CONC) {
		const chunk = IDS.slice(i, i + CONC)
		const r = await parallel(
			chunk.map((id) => () => agent(composePrompt(TYPE, id), {
				agentType: 'general-purpose',
				label: `${TYPE}:${id}`,
				phase: 'Articles',
				schema: STATUS,
			})),
		)
		jobOk += r.filter((x) => x && x.ok).length
		const done = Math.min(i + CONC, IDS.length)
		log(`[${TYPE}] ${done}/${IDS.length} traités · ${jobOk} OK cumulés`)
	}
	grandOk += jobOk
	summary.push({ type: TYPE, total: IDS.length, ok: jobOk, failed: IDS.length - jobOk })
	log(`[${TYPE}] terminé : ${jobOk}/${IDS.length} OK`)
}
log(`GLOBAL : ${grandOk}/${totalAll} articles écrits.`)
return { totalAll, ok: grandOk, jobs: summary }
