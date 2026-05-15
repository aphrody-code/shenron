# Migration site DBFR → Axum + Leptos (hors VPS)

Gemini reprend le site `apps/dbfr-site` (Next.js 15 + Tailwind v4) et le réécrit en stack Rust full-stack :
- **Axum** (https://github.com/tokio-rs/axum) — serveur HTTP / server functions / SSR
- **Leptos** (https://github.com/leptos-rs/leptos) — UI réactive avec hydration, signals fine-grained
- **Déploiement** : hors VPS — cibles candidates : Fly.io (binaire Docker), Shuttle.rs (PaaS Rust natif), Cloudflare Workers (compile WASM).
- **DB** : Postgres Neon (cf. `SHENRON_MIGRATION_PLAN.md`) accessible directement depuis le binaire — moins de dépendance HTTP au bot pour les data en lecture.

Le bot Shenron **reste sur le VPS** ; les routes `/api/public/*` continuent de servir le bot Discord et restent disponibles si le site Axum/Leptos veut les consommer en lecture.

## Ce que Claude (bot shenron) garantit pour la migration

### 1. Contrat API stable
Toutes les routes `/api/public/*` sont **versionnées de facto** : breaking change → bump path `/api/public/v2/*`. Pour l'instant pas de v2.

Routes consommables :

| Méthode | Path | TTL Cache | Cache-Control |
|---|---|---|---|
| GET | `/.well-known/agent-card.json` | 1 h | `public, max-age=3600, s-maxage=7200, swr=14400` |
| GET | `/health/check` | 5 s | `public, max-age=5, s-maxage=10, swr=20` |
| GET | `/health/latency` | 5 s | idem |
| GET | `/api/public/user/:discordId` | 30 s | `public, max-age=30, s-maxage=60, swr=120` |
| GET | `/api/public/shop` | 5 min | `public, max-age=300, s-maxage=600, swr=1200` |
| GET | `/api/public/leaderboard?limit=N&enrich=1` | 1 min | `public, max-age=60, ...` |
| GET | `/api/public/stats` | 1 min | idem |
| GET | `/api/public/wiki/characters?q=` | 1 h | idem |
| GET | `/api/public/wiki/characters/:id` | 1 h | idem |
| GET | `/api/public/wiki/planets` | 1 h | idem |
| GET | `/api/public/wiki/planets/:id` | 1 h | idem |
| GET | `/api/public/profile/:discordId/card.png` | 1 h | image/webp ou png selon `Accept` |
| GET | `/api/public/profile/:discordId/scan.png` | 1 h | idem |
| GET | `/assets/dbz/characters/<slug>.webp` | longue | image statique |
| GET | `/assets/dbz/planetas/<slug>.webp` | longue | idem |
| GET | `/assets/dbz/transformaciones/<slug>.webp` | longue | idem |
| GET | `/assets/sanctions/<action>.gif` | longue | image statique |

ETag + 304 Not Modified supportés sur toutes les routes JSON. CORS allowlist :
- `https://dbfr.fr`, `https://www.dbfr.fr`, `https://shenron.rpbey.fr`, `http://localhost:3000`.

**À me dire (via MCP `send_message`)** : le nouveau domaine du site Axum (ex: `axum-dbfr.fly.dev` ou final FQDN) → je l'ajoute à l'allowlist CORS côté bot.

### 2. Types Rust serde-compatibles (à copier dans le crate)

```rust
// crate `dbfr-shenron-client` ou inline dans la binaire Axum.
use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ShenronUser {
    #[serde(rename = "discordId")]
    pub discord_id: String,
    pub username: Option<String>,
    pub avatar: Option<String>,            // avatar hash
    #[serde(rename = "avatarUrl")]
    pub avatar_url: Option<String>,        // URL CDN Discord déjà construite
    pub level: u32,
    pub xp: i64,
    pub zeni: i64,
    #[serde(rename = "xpProgress")]
    pub xp_progress: Option<XpProgress>,
    pub banner: Option<String>,            // URL absolue ou null
    pub equipped: Equipped,
    pub achievements: Vec<Achievement>,
    pub inventory: Vec<InventoryItem>,
    pub fusion: Option<Fusion>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct XpProgress {
    pub current: i64,
    #[serde(rename = "nextLevel")]
    pub next_level: u32,
    #[serde(rename = "nextLevelXp")]
    pub next_level_xp: i64,
    pub needed: i64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Equipped {
    pub card: Option<String>,
    pub badge: Option<String>,
    pub color: Option<String>,
    pub title: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Achievement {
    pub code: String,
    #[serde(rename = "unlockedAt")]
    pub unlocked_at: chrono::DateTime<chrono::Utc>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct InventoryItem {
    #[serde(rename = "type")]
    pub kind: String,         // "card" | "badge" | "color" | "title"
    pub key: String,
    pub name: String,
    pub description: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Fusion {
    #[serde(rename = "partnerId")]
    pub partner_id: String,
    #[serde(rename = "partnerName")]
    pub partner_name: Option<String>,
    #[serde(rename = "createdAt")]
    pub created_at: chrono::DateTime<chrono::Utc>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ShopItem {
    pub key: String,
    #[serde(rename = "type")]
    pub kind: String,
    pub name: String,
    pub description: Option<String>,
    pub price: i64,
    #[serde(rename = "roleId")]
    pub role_id: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct LeaderboardEntry {
    pub rank: u32,
    #[serde(rename = "discordId")]
    pub discord_id: String,
    pub username: Option<String>,
    #[serde(rename = "avatarUrl")]
    pub avatar_url: Option<String>,
    pub xp: i64,
    pub zeni: i64,
    pub level: u32,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct GlobalStats {
    pub users: i64,
    #[serde(rename = "totalXp")]
    pub total_xp: i64,
    #[serde(rename = "totalZeni")]
    pub total_zeni: i64,
    #[serde(rename = "achievementsUnlocked")]
    pub achievements_unlocked: i64,
    #[serde(rename = "shopItems")]
    pub shop_items: i64,
    #[serde(rename = "inventoryItems")]
    pub inventory_items: i64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct DbCharacter {
    pub id: i64,
    pub name: String,
    pub image: String,                          // path relatif ex. ./assets/dbz/characters/goku_normal.webp
    pub ki: Option<String>,
    #[serde(rename = "maxKi")]
    pub max_ki: Option<String>,
    pub race: Option<String>,
    pub gender: Option<String>,
    pub affiliation: Option<String>,
    pub description: Option<String>,
    #[serde(rename = "originPlanetId")]
    pub origin_planet_id: Option<i64>,
    #[serde(default)]
    pub transformations: Vec<DbTransformation>,  // détail endpoint only
    #[serde(rename = "originPlanet", default)]
    pub origin_planet: Option<DbPlanet>,         // détail endpoint only
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct DbTransformation {
    pub id: i64,
    pub name: String,
    pub image: String,
    pub ki: Option<String>,
    #[serde(rename = "characterId")]
    pub character_id: i64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct DbPlanet {
    pub id: i64,
    pub name: String,
    pub image: String,
    #[serde(rename = "isDestroyed")]
    pub is_destroyed: bool,
    pub description: Option<String>,
}
```

### 3. Client `reqwest` typé (~80 LOC)

```rust
use reqwest::Client;
use anyhow::Result;

#[derive(Clone)]
pub struct ShenronClient {
    base: String,
    http: Client,
}

impl ShenronClient {
    pub fn new(base_url: impl Into<String>) -> Self {
        Self {
            base: base_url.into(),
            http: Client::builder()
                .user_agent("dbfr-axum-site/1.0")
                .timeout(std::time::Duration::from_secs(10))
                .build()
                .expect("reqwest client"),
        }
    }

    pub async fn user(&self, discord_id: &str) -> Result<Option<ShenronUser>> {
        let res = self.http.get(format!("{}/api/public/user/{}", self.base, discord_id)).send().await?;
        if res.status() == 404 { return Ok(None); }
        Ok(Some(res.error_for_status()?.json::<ShenronUser>().await?))
    }

    pub async fn shop(&self) -> Result<Vec<ShopItem>> {
        #[derive(Deserialize)] struct Resp { items: Vec<ShopItem> }
        let res = self.http.get(format!("{}/api/public/shop", self.base)).send().await?;
        Ok(res.error_for_status()?.json::<Resp>().await?.items)
    }

    pub async fn leaderboard(&self, limit: u32, enrich: bool) -> Result<Vec<LeaderboardEntry>> {
        #[derive(Deserialize)] struct Resp { leaderboard: Vec<LeaderboardEntry> }
        let url = format!("{}/api/public/leaderboard?limit={}{}", self.base, limit, if enrich { "&enrich=1" } else { "" });
        let res = self.http.get(url).send().await?;
        Ok(res.error_for_status()?.json::<Resp>().await?.leaderboard)
    }

    pub async fn stats(&self) -> Result<GlobalStats> {
        Ok(self.http.get(format!("{}/api/public/stats", self.base)).send().await?.error_for_status()?.json().await?)
    }

    pub async fn wiki_characters(&self, query: Option<&str>) -> Result<Vec<DbCharacter>> {
        #[derive(Deserialize)] struct Resp { characters: Vec<DbCharacter> }
        let mut url = format!("{}/api/public/wiki/characters", self.base);
        if let Some(q) = query { url.push_str(&format!("?q={}", urlencoding::encode(q))); }
        let res = self.http.get(url).send().await?.error_for_status()?;
        Ok(res.json::<Resp>().await?.characters)
    }

    pub async fn wiki_character(&self, id: i64) -> Result<Option<DbCharacter>> {
        let res = self.http.get(format!("{}/api/public/wiki/characters/{}", self.base, id)).send().await?;
        if res.status() == 404 { return Ok(None); }
        Ok(Some(res.error_for_status()?.json::<DbCharacter>().await?))
    }

    pub async fn wiki_planets(&self) -> Result<Vec<DbPlanet>> {
        #[derive(Deserialize)] struct Resp { planets: Vec<DbPlanet> }
        Ok(self.http.get(format!("{}/api/public/wiki/planets", self.base)).send().await?.error_for_status()?.json::<Resp>().await?.planets)
    }

    /// Construit l'URL absolue d'une card profil (à utiliser dans <img src=…/>).
    pub fn card_url(&self, discord_id: &str) -> String {
        format!("{}/api/public/profile/{}/card.png", self.base, discord_id)
    }

    /// Préfixe les images wiki (qui arrivent en path relatif `./assets/...`).
    pub fn asset_url(&self, relative: &str) -> String {
        let path = relative.trim_start_matches("./").trim_start_matches('/');
        format!("{}/{}", self.base, path)
    }
}
```

### 4. Cargo.toml deps minimum suggéré

```toml
[package]
name = "dbfr-site"
edition = "2021"

[dependencies]
axum = { version = "0.7", features = ["macros"] }
tokio = { version = "1", features = ["rt-multi-thread", "macros", "signal"] }
tower = { version = "0.4", features = ["full"] }
tower-http = { version = "0.5", features = ["cors", "compression-gzip", "compression-br", "trace", "fs"] }
leptos = { version = "0.6", features = ["ssr"] }
leptos_axum = "0.6"
leptos_router = { version = "0.6", features = ["ssr"] }
leptos_meta = { version = "0.6", features = ["ssr"] }

# Data
serde = { version = "1", features = ["derive"] }
serde_json = "1"
reqwest = { version = "0.12", features = ["json", "rustls-tls"], default-features = false }
chrono = { version = "0.4", features = ["serde"] }
sqlx = { version = "0.8", features = ["postgres", "runtime-tokio-rustls", "chrono", "macros", "migrate"] }

# Observability
tracing = "0.1"
tracing-subscriber = { version = "0.3", features = ["env-filter", "json"] }
anyhow = "1"
urlencoding = "2"

[features]
hydrate = ["leptos/hydrate", "leptos_router/hydrate"]
```

### 5. Architecture binaire (suggestion)

```
dbfr-site/
├── Cargo.toml
├── src/
│   ├── main.rs              # axum server, layers, leptos_axum::generate_route_list
│   ├── shenron.rs           # ShenronClient + types serde (cf. §2 §3)
│   ├── db.rs                # sqlx connection pool Postgres Neon
│   ├── routes/
│   │   ├── mod.rs
│   │   ├── api.rs           # routes /api/* du site (admin CMS, etc.)
│   │   └── ssr.rs           # rendu Leptos SSR
│   └── components/
│       ├── mod.rs
│       ├── app.rs           # <App/> Leptos root
│       ├── home.rs
│       ├── shop.rs
│       ├── profile.rs       # consomme ShenronClient.user()
│       ├── wiki.rs          # consomme ShenronClient.wiki_*()
│       └── leaderboard.rs
├── style/                   # Tailwind v4 + tokens DBZ
└── public/
```

### 6. Server functions vs ShenronClient

Pour les pages SSR profil/shop/leaderboard, deux options :
1. **ShenronClient depuis le serveur Axum** : fetch direct du bot, idiomatic. Cache `tower-http::cache`.
2. **Server function Leptos** (`#[server]`) : déclenche le fetch côté serveur lors de l'hydration, mais Leptos sérialise le résultat → le client n'a pas à refaire la requête. Latence minimale après SSR.

Recommandation : combine — server function qui wrap `ShenronClient` :

```rust
#[server(GetUser, "/api")]
pub async fn get_user(discord_id: String) -> Result<Option<ShenronUser>, ServerFnError> {
    let client = expect_context::<ShenronClient>();
    Ok(client.user(&discord_id).await.map_err(|e| ServerFnError::ServerError(e.to_string()))?)
}
```

Composant Leptos consomme via `create_resource`.

## Ce que Claude (bot) peut/doit faire en plus

- **Ajouter le nouveau domaine à la CORS allowlist** : il suffit de me dire le FQDN (ex. `axum.dbfr.fr` ou tmp `dbfr.fly.dev`). Edit `PUBLIC_CORS_ORIGINS` dans `src/api/server.ts:2480`.
- **Exposer un endpoint manquant** : si tu as besoin d'une route que je n'ai pas (ex. `/api/public/achievements/catalog`), demande via MCP et je l'ajoute.
- **DB Postgres** : si tu veux lire la DB directement sans passer par le bot (lectures fréquentes), je peux migrer SQLite → Postgres Neon (cf. ton `SHENRON_MIGRATION_PLAN.md` §2). Confirme et je lance.
- **Stream events SSE** : pour le live (notifications level-up, achats), tu peux consommer `GET /api/a2a/events` (SSE déjà en place). Format : `data: {"kind":"...",...}\n\n`.

## TODO côté Gemini (suggéré)

- [ ] Choisir hébergement final (Fly.io / Shuttle / Cloudflare Workers WASM)
- [ ] Initialiser le crate `dbfr-site` avec `cargo leptos new --git leptos-rs/start-axum`
- [ ] Copier les types de §2 + client de §3 dans `src/shenron.rs`
- [ ] Migrer page par page depuis `apps/dbfr-site/src/app/*` vers `src/components/*` (Leptos)
- [ ] Confirmer Tailwind v4 → utiliser `cargo-leptos`'s `style-file` pour compile CSS
- [ ] Réutiliser les assets DBZ depuis `https://shenron.rpbey.fr/assets/dbz/*` OU upload sur CDN R2/Cloudflare
- [ ] Me communiquer le nouveau FQDN pour CORS allowlist

Ping moi quand tu as une question via MCP `send_message to=claude` ou écris dans `.coord/memory/gemini.md`.
