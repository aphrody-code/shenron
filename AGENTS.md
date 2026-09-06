<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

Next.js est une version canary avec des changements incompatibles. Avant toute
modification de `apps/site`, lire la documentation correspondante dans
`node_modules/next/dist/docs/` et respecter ses dépréciations.
<!-- END:nextjs-agent-rules -->

# AGENTS.md — Shenron

## Principes

Monorepo Bun du bot Dragon Ball, du site `dragonballfr.com` et du MCP public.
Exécuter les tâches claires jusqu’au bout, mesurer avant/après, vérifier le
résultat et ne pas élargir le périmètre sans nécessité.

Ne jamais inventer de donnée éditoriale. Sources autorisées : manga/databooks
hébergés, catalogues éditeurs, AniList et Jikan. Fandom est interdit pour la
rédaction. Un champ vide vaut mieux qu’une valeur plausible.

## Architecture réelle

- `apps/bot` — `@shenron/bot`, Bun + TypeScript + discordy/discord.js + Drizzle
  SQLite + API REST/GraphQL/OpenAPI + dashboard.
- `apps/site` — `@shenron/site`, Next 16 + React canary + Tailwind v4 +
  Drizzle/postgres-js. Le wiki public lit directement PostgreSQL.
- `apps/mcp` — `@shenron/mcp`, serveur MCP Bun read-only qui proxifie l’API
  publique du bot et les données publiques du site.
- `packages/*` — bibliothèques partagées DI, discordy, importer et pagination.

Le bot fonctionne avec un seul client Gateway Shenron. Les anciens IDs
`beerus`, `whis`, `grandPretre`, `enma` et `kaio` sont des aliases de compatibilité
pour l’API et le dashboard ; ils ne doivent pas recréer de client, token ou
connexion Gateway. Toutes les commandes/events sont routés vers `shenron`.

Production : bot `shenron.service` sur 5006, MCP `shenron-mcp.service` sur 5010,
site bleu/vert `shenron-site.service` sur 3000 ou `shenron-site-b.service` sur
3010. Le slot inactif est normalement arrêté. PostgreSQL local `shenron_site`
porte les schémas `public` et `bot`; `apps/bot/data/bot.db` est un réplica de
lecture du wiki et le runtime local du bot.

## Règles impératives

1. Bun uniquement : jamais `node`, `npm`, `pnpm`, `yarn` ou `tsx`.
2. Ne jamais divulguer ni committer les secrets. Les `.env` sont gitignorés,
   protégés et ne doivent pas être lus en sortie utilisateur.
3. Utiliser les versions `catalog:` du monorepo. Ne pas ajouter une version
   locale concurrente de Next, React, TypeScript ou Bun.
4. Bot en TypeScript pur : pas de FFI ni Rust.
5. Aucun chemin absolu dans `deploy/systemd/` ou les scripts opérationnels.
6. Ne pas créer de rapport Markdown à la racine. Les commits sont en français,
   sur une ligne : `feat|fix|chore|refactor|docs|ops(scope): ...`.
7. Après toute commande, event ou guard ajouté/modifié, exécuter
   `bun run gen:entries` dans `apps/bot`.
8. Après toute modification de `personas.ts`, lancer l’audit intent/event
   documenté dans `.claude/agents/intent-auditor.md`.
9. Avant toute modification de couleur du site, lire `public.\"SiteTheme\"`;
   écrire par `jsonb_set` ciblé, jamais par remplacement global.
10. Écrire le wiki dans PostgreSQL et via `public.wiki_revisions`. Une
    suppression éditoriale devient `visible = false`, jamais `DELETE`.
11. Ne jamais lancer `rag:build` au premier plan ou sur le service en production.
12. Ne tuer un processus qu’après avoir vérifié qu’il n’est pas le MainPID d’un
    service systemd, un build actif ou un worker nécessaire. Mesurer RAM/swap
    avant et après.

## Données et synchronisation

- Source de vérité éditoriale : PostgreSQL `bot.*`.
- Le reverse-sync PostgreSQL → SQLite alimente le réplica wiki du bot et doit
  conserver ses gardes anti-truncate et ses vérifications de compteurs.
- Le forward-sync SQLite → PostgreSQL ne doit jamais écraser les tables
  éditoriales listées dans `apps/bot/scripts/_wiki-editorial.ts`.
- Ne jamais toucher simultanément aux timers de sync sans lire
  `docs/infra-vps.md` et `docs/pieges.md`.
- `DATABASE_URL` du site se lit sur la dernière ligne `^DATABASE_URL=` de
  `apps/site/.env`; ne jamais afficher sa valeur.

## Vérifications et déploiement

Contrôles usuels depuis la racine :

```bash
bun run lint
bun run type-check
bun run test:all
```

Bot :

```bash
bash scripts/deploy-shenron.sh
```

MCP : vérifier puis redémarrer `shenron-mcp.service`; sonder `/health` et
vérifier que l’upstream bot répond.

Site : utiliser `bash scripts/deploy-site.sh`, qui construit en bleu/vert,
sonde le slot inactif, bascule nginx puis draine l’ancien slot. Ne pas lancer
un build manuel sur le slot servi. Le build Next doit être lancé avec Bun en
passant le binaire depuis la racine, sans `--bun`.

Après déploiement, vérifier au minimum : bot `/auth/me`, MCP `/health`, site
public, état systemd des services et slot nginx actif. Ne pas interpréter le
slot site inactif comme une panne.

## Documentation de référence

Lire avant diagnostic : `docs/pieges.md`.
Lire avant infrastructure/sync : `docs/infra-vps.md`.
Lire avant wiki : `docs/wiki-editorial.md`.
Lire avant databooks : `docs/databooks-doctrine.md` et
`docs/databooks-transcription.md`.
Lire `apps/site/AGENTS.md` avant toute modification Next/site.

## Plugin et MCP Dragon Ball

Le plugin local `plugins/dragon-ball` fournit les skills Dragon Ball,
dragon-ball japonais et SVG Toriyama, ainsi que les agents OCR/traduction/wiki.
Pour les faits Dragon Ball, consulter ces sources et citer les résultats plutôt
que répondre de mémoire. MCP public read-only :
`https://mcp.dragonballfr.com/mcp`; il n’accède ni aux secrets ni aux bases
privées.

<!-- `apps/site` est l’application Next. `next` est hoisté dans le
     node_modules racine ; voir aussi CLAUDE.md pour la mémoire opérationnelle. -->

