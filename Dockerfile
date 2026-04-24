# syntax=docker/dockerfile:1.7
# Shenron — image Bun optimisée pour Fly.io (et tout runtime container).
# Multi-stage : builder avec cache deps, runtime slim.

# ─── Builder : install des deps + gen:entries ──────────────────────────────
FROM oven/bun:1 AS builder
WORKDIR /app

# Auth GitHub Packages (pour les packages privés @rpbey/*)
ARG GH_PACKAGES_TOKEN
RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=bun.lock,target=bun.lock \
    --mount=type=cache,target=/root/.bun/install/cache \
    if [ -n "$GH_PACKAGES_TOKEN" ]; then \
      printf "@rpbey:registry=https://npm.pkg.github.com\n//npm.pkg.github.com/:_authToken=%s\n" "$GH_PACKAGES_TOKEN" > .npmrc ; \
    fi && \
    bun install --frozen-lockfile

# Copie du code + génération du barrel statique (nécessaire pour boot)
COPY . .
RUN bun run gen:entries

# ─── Backgrounds NASA (optionnel, ignorable si offline) ───────────────────
RUN bun run bg:fetch 2>/dev/null && bun run bg:optimize 2>/dev/null || \
    echo "! Backgrounds skip (API NASA indisponible)"

# ─── Runtime debian (il n'existe pas de tag 1-slim officiel) ──────────────
FROM oven/bun:1-debian AS runtime
WORKDIR /app

# libs requises par @napi-rs/canvas + certificats + tzdata pour dayjs
RUN apt-get update && apt-get install -y --no-install-recommends \
    ca-certificates tzdata \
    && rm -rf /var/lib/apt/lists/*

# User non-root pour le runtime
RUN groupadd -r shenron && useradd -r -g shenron -u 1001 shenron \
    && mkdir -p /data \
    && chown -R shenron:shenron /data /app

USER shenron

# Copie depuis le builder (pas de .npmrc → pas de token leak)
COPY --from=builder --chown=shenron:shenron /app/node_modules ./node_modules
COPY --from=builder --chown=shenron:shenron /app/src ./src
COPY --from=builder --chown=shenron:shenron /app/assets ./assets
COPY --from=builder --chown=shenron:shenron /app/package.json ./
COPY --from=builder --chown=shenron:shenron /app/bunfig.toml ./
COPY --from=builder --chown=shenron:shenron /app/tsconfig.json ./

ENV NODE_ENV=production \
    LOG_LEVEL=info \
    DATABASE_PATH=/data/bot.db \
    TZ=Europe/Paris

# /data = volume Fly (persistant) → DB + user data
VOLUME ["/data"]

# Pas de HTTP à exposer (Gateway WebSocket uniquement)
# EXPOSE supprimé intentionnellement

# Health = bot ready log dans stdout → fly monitore le process uptime
CMD ["bun", "src/index.ts"]
