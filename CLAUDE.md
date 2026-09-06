# CLAUDE.md — Shenron

## Doctrine

Monorepo Bun pour le bot Discord Dragon Ball, le site Next.js
`dragonballfr.com`, PostgreSQL, RAG et MCP. Une tâche claire doit être menée
jusqu’au bout : mesurer avant/après, modifier dans le dépôt, tester, committer,
pousser et déployer quand cela fait partie de la demande. Ne jamais inventer de
donnée éditoriale ; un champ vide vaut mieux qu’une valeur plausible.

## Architecture et sources de vérité

- `apps/bot` : `@shenron/bot`, Bun/TypeScript, discordy/discord.js, Drizzle,
  SQLite runtime, REST, GraphQL, OpenAPI et dashboard.
- `apps/site` : `@shenron/site`, Next 16 canary, React canary, Tailwind v4,
  Drizzle/postgres-js. Le wiki public lit PostgreSQL directement.
- `apps/mcp` : `@shenron/mcp`, MCP Streamable HTTP read-only ; il proxifie
  les API publiques et ne lit aucun secret ni aucune base privée.
- `packages/*` : DI, discordy, importer, internal et pagination.
- PostgreSQL local `shenron_site` : schémas `public` et `bot`.
- `apps/bot/data/bot.db` : runtime SQLite et réplica de lecture du wiki.
- Infrastructure vendorée : `deploy/`, services systemd et nginx.

Le bot n’a plus que **un client Gateway Shenron**. `beerus`, `whis`,
`grandPretre`, `enma` et `kaio` sont des aliases de compatibilité ; ils ne
doivent jamais recréer client, connexion, cache ou token. Les six fonctions
historiques sont regroupées dans ce runtime.

Production : `shenron.service` :5006, `shenron-mcp.service` :5010,
site bleu/vert `shenron-site.service` :3000 et
`shenron-site-b.service` :3010. Le slot site inactif est normal. L’embedder
RAG `shenron-embed.service` est nécessaire et ne doit pas être tué comme
processus parasite.

## Règles non négociables

1. Bun uniquement : jamais node, npm, pnpm, yarn ou tsx.
2. Secrets hors dépôt ; ne jamais afficher ni committer les `.env`.
3. Respecter les versions `catalog:` du workspace ; pas de dépendance concurrente.
4. Bot en TypeScript pur, sans FFI/Rust.
5. Aucun chemin absolu dans `deploy/systemd/` ou les scripts d’opérations.
6. Commits français, une ligne, format
   `feat|fix|chore|refactor|docs|ops(scope):`.
7. Après commande/event/guard bot : `bun run gen:entries`.
8. Après changement de `personas.ts`, lancer l’audit intent/event.
9. Lire `public."SiteTheme"` avant toute décision de palette ; écrire par
   `jsonb_set` ciblé.
10. Wiki : source de vérité PostgreSQL, révisions `public.wiki_revisions`,
    suppression logique `visible=false`, jamais de DELETE éditorial.
11. Ne jamais exécuter `rag:build` au premier plan ou sur le bot en production.
12. Avant de tuer un processus, vérifier MainPID systemd, parenté et rôle ;
    mesurer RAM/swap avant et après.

Sources éditoriales acceptées : manga/databooks hébergés, catalogues éditeurs,
AniList et Jikan. Fandom est interdit pour rédiger.

## Homepage et dashboard admin

La homepage est `apps/site/src/app/page.tsx` + `components/home/`. Elle
combine contenu éditorial PostgreSQL, compteurs wiki, état live du bot et
configuration éditable `/admin/home`. Elle doit rester cacheable :
ne pas introduire cookies/headers dans le layout racine ou les données publiques.
Le contenu live se met à jour côté client via `useLiveBotState`.

Le dashboard admin est sous `apps/site/src/app/admin/`. Il est protégé par
`requireAdmin()`, dynamique et non indexable. Les appels bot passent par les
proxys server-only `/api/bot-admin` ou `/api/bot-user`; aucun secret ne doit
arriver au navigateur. Le dashboard doit présenter le bot unifié, pas six
clients fictifs. Les aliases historiques ne sont affichés que pour compatibilité
technique.

## Synchronisation

- PostgreSQL `bot.*` est la source éditoriale.
- Reverse-sync PostgreSQL → SQLite : réplica wiki, garde anti-truncate,
  transaction atomique et vérification des compteurs obligatoires.
- Forward-sync SQLite → PostgreSQL : runtime et news uniquement ; exclut
  `WIKI_EDITORIAL`.
- Lire `docs/infra-vps.md`, `docs/pieges.md` avant tout changement de sync.
- La dernière ligne `^DATABASE_URL=` de `apps/site/.env` est la référence ;
  ne jamais révéler sa valeur.

## Commandes et vérifications

Depuis la racine :

```bash
bun run lint
bun run type-check
bun run test:all
```

Bot :

```bash
bash scripts/deploy-shenron.sh
```

MCP : redémarrer `shenron-mcp.service`, sonder
`http://127.0.0.1:5010/health`, vérifier `upstream=ok`.

Site : `bash scripts/deploy-site.sh`. Le script construit un release isolé,
sonde le slot inactif, bascule nginx puis draine l’ancien slot. Ne jamais
écraser manuellement le build du slot servi. Vérifier homepage, pages wiki,
`/api/me` et l’image optimisée après bascule.

Après déploiement, vérifier les états systemd, le slot nginx actif, bot
`/auth/me`, MCP `/health` et le site public. Un slot Next arrêté n’est pas
une panne.

## Documentation et plugin

Avant diagnostic : `docs/pieges.md`.
Infrastructure/sync : `docs/infra-vps.md`.
Wiki : `docs/wiki-editorial.md`.
Databooks : `docs/databooks-doctrine.md` et
`docs/databooks-transcription.md`.
Site : `apps/site/AGENTS.md`.

Le plugin `plugins/dragon-ball` fournit les skills Dragon Ball,
dragon-ball-japonais et toriyama-svg, ainsi que les agents OCR/traduction/wiki.
Pour les faits Dragon Ball, utiliser ses sources et citer les résultats.
MCP public read-only : `https://mcp.dragonballfr.com/mcp`.

## Mémoire opérationnelle

- Commit runtime bot/API déployé : `60534039`.
- Documentation agents réécrite : `e984bd59`.
- Dernier déploiement vérifié : bot actif, MCP actif, site slot B actif,
  homepage 200, sondes Next validées.
- Les fichiers locaux non suivis
  `plugins/dragon-ball/.codex-plugin/` et `.mcp.json` sont à préserver et
  ne pas ajouter par défaut.
