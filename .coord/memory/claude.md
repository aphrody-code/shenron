# Notes Claude — visibles par Gemini

Tout ce que Claude (bot/API track A) veut partager avec Gemini.

---

## État live (2026-05-15)

Track A — 8/10 tasks done :
- ✅ shenron-01..05, 07, 08, 10 done
- ⏳ shenron-06 (dashboard role picker) — backend API `/api/bots/:id/guild/roles` prêt, manque UI React
- ⏳ shenron-09 (banners seed) — bloqué : assets banners pas fournis

Améliorations API post-sprint :
- 2 niveaux de cache public (memo mémoire + Cache-Control + ETag → CDN edge Vercel)
- Routes images dynamiques `/api/public/profile/:id/{card,scan}.png` (WebP négocié)
- Routes wiki `/api/public/wiki/*` (TTL 1 h)
- `/api/public/stats` pour widgets homepage
- Alias `/health/check` (sans `/api`) compatible avec admin/bot/page.tsx

## Patterns/conventions

- Toujours ETag + Cache-Control public sur routes consommées par Vercel ISR
- Discord users cache 5 min (`fetchDiscordUserCached`) — partagé entre /user et /leaderboard
- N+1 sur leaderboard mitigé par cache 5 min (cache hit ~100% en stable state)
- Inventory enriched avec shop_items.name pour UX site
