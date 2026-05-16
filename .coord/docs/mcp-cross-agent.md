# MCP & A2A Cross-Agent Documentation

Ce document de référence est conçu pour synchroniser les architectures de Gemini CLI et Claude Code autour des protocoles MCP (Model Context Protocol) et A2A (Agent2Agent), en s'appuyant sur les SDKs Rust officiels.

## 1. Model Context Protocol (MCP) - Rust SDK
**Dépôt :** `https://github.com/modelcontextprotocol/rust-sdk`

L'implémentation Rust de MCP utilise `tokio` pour fournir un environnement asynchrone performant.
L'architecture repose sur deux crates principales :
- `rmcp` : Protocol, transports (stdio, TokioChildProcess), et traits (`ServerHandler`, `ClientHandler`).
- `rmcp-macros` : Macros procédurales (`#[tool]`, `#[prompt]`, `#[task_handler]`) générant le boilerplate et les schémas JSON via `schemars`.

**Exemple d'implémentation Serveur :**
```rust
use rmcp::{handler::server::wrapper::Parameters, schemars, tool, tool_router, ServiceExt, transport::stdio};

#[derive(serde::Deserialize, schemars::JsonSchema)]
struct AddParams { a: i32, b: i32 }

#[derive(Clone)]
struct MyServer;

#[tool_router(server_handler)]
impl MyServer {
    #[tool(description = "Ajouter deux nombres")]
    fn add(&self, Parameters(AddParams { a, b }): Parameters<AddParams>) -> String {
        (a + b).to_string()
    }
}

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    let service = MyServer.serve(stdio()).await?;
    service.waiting().await?;
    Ok(())
}
```

## 2. Agent2Agent (A2A) Protocol - Rust SDK
**Dépôt :** `https://github.com/a2aproject/a2a-rs`

A2A est un protocole ouvert permettant aux agents IA d'interagir comme des boîtes noires, utilisant JSON-RPC 2.0 sur HTTP/S. L'implémentation Rust `a2a-rs` inclut :
- `a2a` : Modèles de base, events, erreurs.
- `a2a-server` : Framework serveur basé sur **Axum** pour REST et JSON-RPC.
- `a2a-client` : Client asynchrone pour l'abstraction du transport.
- Modèles d'interactions : `GetAgentCard`, `CreateTask`, `SendMessage`, `SendStreamingMessage`.

L'intégration d'Axum est particulièrement pertinente pour notre prochaine migration : le serveur A2A et le backend de l'application pourront partager le même runtime et router Axum, optimisant drastiquement les performances et la latence.

## 3. Stratégie de Refonte Axum (Site & Dashboard)
Le but est de migrer le site public Next.js et le dashboard React (Bun) en dehors du dossier `vps` vers une stack Rust 100% native (Axum + Tokio) :

1. **Workspace Rust** :
   - `crates/api` : Serveur Axum principal remplaçant l'API Bun et Next.js.
   - `crates/db` : Accès aux données partagées avec `sqlx` ou `sea-orm` (PostgreSQL Neon).
   - `crates/mcp-bridge` : Serveur A2A et RMCP pour l'interaction Claude ↔ Gemini.

2. **Frontend** :
   - Le frontend pourra être servi statiquement par Axum, ou transformé en SSR via Askama/Tera si l'on souhaite abandonner complètement Node.js/Bun pour le rendu des vues.
