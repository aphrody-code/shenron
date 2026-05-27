# syntax=docker/dockerfile:1.7
# ─────────────────────────────────────────────────────────────────────────
# Shenron — image Bun pour Fly.io / tout runtime conteneur (cible SANS VPS).
#
# IMPORTANT : monorepo. Le contexte de build doit être la RACINE du repo
# (lockfile `bun.lock`, workspaces `packages/*` + `apps/*` y vivent). Les deps
# `@rpbey/*` sont des workspaces (symlinks node_modules → packages/), résolues
# localement ; seul `@aphrody-code/canvas` (fork privé) vient de GitHub Packages
# → nécessite GH_PACKAGES_TOKEN au build.
#
# Build :  docker build -t shenron -f Dockerfile --build-arg GH_PACKAGES_TOKEN=<PAT> .
#          (depuis la racine du repo)
# ─────────────────────────────────────────────────────────────────────────
FROM oven/bun:1-debian
WORKDIR /app

# libs runtime : certs (HTTPS Discord/API), tzdata (dayjs Europe/Paris).
# @aphrody-code/canvas est un binaire napi prebuilt → pas de toolchain C requise.
RUN apt-get update && apt-get install -y --no-install-recommends \
      ca-certificates tzdata \
    && rm -rf /var/lib/apt/lists/*

# Auth GitHub Packages pour le fork canvas (@aphrody-code). Le .npmrc est créé
# ET supprimé dans le MÊME layer → le token n'est jamais persisté dans l'image.
ARG GH_PACKAGES_TOKEN
COPY . .
RUN if [ -n "$GH_PACKAGES_TOKEN" ]; then \
      printf "@aphrody-code:registry=https://npm.pkg.github.com\n//npm.pkg.github.com/:_authToken=%s\n" "$GH_PACKAGES_TOKEN" > .npmrc ; \
    fi && \
    bun install --frozen-lockfile && \
    rm -f .npmrc

# Barrel statique des entries (commandes/events/guards) — requis au boot.
RUN cd apps/bot && bun run gen:entries

# Backgrounds canvas (optionnel — refetch NASA/assets, ignorable si offline).
RUN cd apps/bot && (bun run bg:fetch && bun run bg:optimize) 2>/dev/null \
    || echo "! backgrounds skip (source indisponible)"

# User non-root + /data (volume persistant : DB SQLite + user data)
RUN groupadd -r shenron && useradd -r -g shenron -u 1001 shenron \
    && mkdir -p /data && chown -R shenron:shenron /data /app
USER shenron

ENV NODE_ENV=production \
    LOG_LEVEL=info \
    DATABASE_PATH=/data/bot.db \
    TZ=Europe/Paris

VOLUME ["/data"]

# Worker pur (Gateway WebSocket + API interne :5006) — pas d'EXPOSE requis pour
# le rôle bot ; l'API n'est utile que derrière un proxy (cf. deploy/nginx sur VPS).
WORKDIR /app/apps/bot
CMD ["bun", "src/index.ts"]
