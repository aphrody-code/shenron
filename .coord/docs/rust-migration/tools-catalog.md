# Catalog tools agents — backend Rust dispatch

Catalogue de **tous les tools** des 2 agents (Gemini CLI + Claude Code) pour que le backend Rust (`apps/server` Axum) puisse les comprendre, les traduire et éventuellement les exécuter.

Sources :
- **Gemini CLI Core** : https://github.com/google-gemini/gemini-cli/tree/main/packages/core/src/tools (canonical : `definitions/base-declarations.ts`)
- **Claude Code** : harness tools (cf. system prompt + `ToolSearch` deferred tools list)
- **Spec MCP** : https://spec.modelcontextprotocol.io/specification/2025-03-26/server/tools/

## 1. Built-in tools Gemini CLI (canonical names)

Source : `packages/core/src/tools/definitions/base-declarations.ts` + `tool-names.ts::ALL_BUILTIN_TOOL_NAMES`.

| Nom canonique | Display Name | Params clés | Description |
|---|---|---|---|
| `glob` | FindFiles | `pattern`, `case_sensitive?`, `respect_git_ignore?`, `dir_path?` | Match files via glob |
| `grep_search` | SearchText | `pattern`, `path?`, `include_pattern?`, `exclude_pattern?`, `names_only?`, `max_matches_per_file?`, `total_max_matches?`, `fixed_strings?`, `context?`, `after?`, `before?`, `no_ignore?` | ripgrep-backed search |
| `list_directory` | ReadFolder | `dir_path`, `ignore?`, `respect_git_ignore?` | ls + tree |
| `read_file` | ReadFile | `file_path`, `start_line?`, `end_line?` | Read file contents (range) |
| `run_shell_command` | (Shell) | `command`, `description?`, `is_background?` | Bash exec (sandboxable) |
| `write_file` | WriteFile | `file_path`, `content` | Overwrite/create file |
| `replace` | Edit | `file_path`, `old_string`, `new_string`, `instruction?`, `allow_multiple?` | Exact string replace |
| `google_web_search` | GoogleSearch | `query` | Google search |
| `write_todos` | (Todos) | `todos[{description,status}]` | Update todo list |
| `web_fetch` | WebFetch | `url`, `prompt` | Fetch URL + LLM extract |
| `read_many_files` | ReadManyFiles | `include[]`, `exclude[]?`, `recursive?`, `useDefaultExcludes?` | Batch read |
| `get_internal_docs` | (Docs) | `path` | Internal docs lookup |
| `activate_skill` | (Skill) | `name`, `args?` | Invoke Claude/Gemini skill |
| `ask_user` | Ask User | `questions[{question,header,type,options?,multiSelect?,placeholder?}]` | Prompt user |
| `enter_plan_mode` | (Plan) | `reason` | Enter plan mode |
| `exit_plan_mode` | (Plan) | `plan_filename?` | Exit plan mode |
| `update_topic` | Update Topic Context | `title`, `summary`, `strategic_intent` | Topic mgmt |
| `complete_task` | Complete Task | — | Mark task done |
| `invoke_agent` | (Agent) | `description`, `prompt`, `subagent_type?`, `model?`, `run_in_background?`, `isolation?` | Spawn sub-agent |
| `read_mcp_resource` | — | `server`, `uri` | Read MCP resource |
| `list_mcp_resources` | — | `server?` | List MCP resources |
| `tracker_create_task` | — | `description`, `dependsOn?` | Create tracker task |
| `tracker_update_task` | — | `id`, `status?`, `description?` | Update tracker task |
| `tracker_get_task` | — | `id` | Get tracker task |
| `tracker_list_tasks` | — | `status?`, `agent?` | List tracker tasks |
| `tracker_add_dependency` | — | `taskId`, `dependsOnId` | Add dep |
| `tracker_visualize` | — | — | Render task graph |

**Total : 26 tools built-in**.

Legacy alias :
- `search_file_content` → `grep_search`

Prefix MCP : `mcp_<server>_<tool>` (tools découverts via MCP server externes).

Discovered prefix : `discovered_tool_<name>` (tools exposés par `gemini-cli`'s discovery).

## 2. Built-in tools Claude Code

| Nom | Params clés | Équivalent Gemini |
|---|---|---|
| `Read` | `file_path`, `offset?`, `limit?`, `pages?` (PDF) | `read_file` |
| `Write` | `file_path`, `content` | `write_file` |
| `Edit` | `file_path`, `old_string`, `new_string`, `replace_all?` | `replace` |
| `Bash` | `command`, `description`, `timeout?`, `run_in_background?`, `dangerouslyDisableSandbox?` | `run_shell_command` |
| `Glob` | `pattern`, `path?` | `glob` |
| `Grep` | `pattern`, `path?`, `glob?`, `type?`, `output_mode?`, `-A/-B/-C?`, `-i?`, `-n?`, `head_limit?`, `multiline?` | `grep_search` |
| `WebFetch` | `url`, `prompt` | `web_fetch` |
| `WebSearch` | `query`, `allowed_domains?`, `blocked_domains?` | `google_web_search` |
| `NotebookEdit` | `notebook_path`, `cell_id?`, `new_source`, `cell_type?`, `edit_mode?` | (pas d'équivalent direct) |
| `Skill` | `skill`, `args?` | `activate_skill` |
| `ToolSearch` | `query`, `max_results?` | (interne — fetch deferred schemas) |
| `AskUserQuestion` | `questions[{question,header,options[],multiSelect}]` | `ask_user` |
| `Agent` | `description`, `prompt`, `subagent_type?`, `model?`, `run_in_background?`, `isolation?` | `invoke_agent` |
| `TaskCreate` | `subject`, `description`, `activeForm?`, `metadata?` | `tracker_create_task` |
| `TaskUpdate` | `taskId`, `status?`, `subject?`, `description?`, `addBlocks?`, `addBlockedBy?`, `owner?` | `tracker_update_task` |
| `TaskList` | — | `tracker_list_tasks` |
| `TaskGet` | `taskId` | `tracker_get_task` |
| `TaskOutput` | `taskId` | (no eq.) |
| `TaskStop` | `taskId` | (no eq.) |
| `EnterPlanMode` | `reason` | `enter_plan_mode` |
| `ExitPlanMode` | `plan_filename?` | `exit_plan_mode` |
| `EnterWorktree` | `path` | (no eq.) |
| `ExitWorktree` | — | (no eq.) |
| `CronCreate` | `name`, `schedule`, `command` | (no eq.) |
| `CronDelete` | `name` | (no eq.) |
| `CronList` | — | (no eq.) |
| `ScheduleWakeup` | `at`, `prompt` | (no eq.) |
| `ListMcpResourcesTool` | `server?` | `list_mcp_resources` |
| `ReadMcpResourceTool` | `server`, `uri` | `read_mcp_resource` |

**Total : ~28 tools** (plus MCP server tools dynamiques : github, neon, context7, etc.).

## 3. Surface commune — couche d'abstraction Rust

Pour le backend Rust (`apps/server` Axum), définir un trait `AgentTool` qui couvre les **9 primitives universelles** (intersection Gemini ∩ Claude) :

```rust
#[async_trait]
pub trait AgentTool: Send + Sync {
    fn name(&self) -> &'static str;
    fn description(&self) -> &'static str;
    fn schema(&self) -> serde_json::Value; // JSON Schema input
    async fn execute(&self, ctx: ToolContext, params: serde_json::Value) -> Result<ToolOutput, ToolError>;
}

pub struct ToolContext {
    pub workspace_root: PathBuf,
    pub db: Arc<sqlx::PgPool>,
    pub mcp_clients: Arc<DashMap<String, McpClient>>,
    pub user_id: Option<String>,
    pub conversation_id: Option<String>,
}

pub enum ToolOutput {
    Text(String),
    Json(serde_json::Value),
    Binary(Vec<u8>, mime::Mime),
    Stream(Box<dyn Stream<Item = ToolEvent> + Send>),
}
```

Mapping primitives → impl Rust :

| Primitive Tool | Crate Rust recommandé | Notes |
|---|---|---|
| `glob` | `globset` + `walkdir` | `respect_git_ignore` via `ignore` crate |
| `grep_search` | `grep` (BurntSushi) ou shell out `rg` | Préférer FFI direct pour perf |
| `list_directory` | `tokio::fs::read_dir` | + `ignore::WalkBuilder` pour gitignore |
| `read_file` | `tokio::fs::read_to_string` | Range via `BufReader::lines().skip()` |
| `write_file` | `tokio::fs::write` | Atomic via `tempfile` + rename |
| `replace` (edit) | string find/replace + write | Validation : `old_string` unique |
| `run_shell_command` | `tokio::process::Command` | Sandbox via `nsjail`/`bubblewrap` |
| `web_fetch` | `reqwest` + `scraper` + `pulldown-cmark` | LLM extraction via API Anthropic/Gemini |
| `google_web_search` / `WebSearch` | `reqwest` API Google Custom Search ou DuckDuckGo | Quotas à gérer |

## 4. Stratégie de pont (proxy/translate)

Le backend Rust peut servir 3 rôles vis-à-vis des tools :

### a) Exposer un MCP server `shenron-tools`

Implémenter le protocole MCP côté Rust (crate `rmcp` = https://github.com/modelcontextprotocol/rust-sdk, déjà ajouté à n2b). Le serveur expose toutes les primitives (`read_file`, `write_file`, etc.) via JSON-RPC stdio. Les 2 agents (Claude Code + Gemini CLI) le configurent comme MCP server externe et appellent les tools de manière unifiée.

Exemple de config côté Claude Code :
```json
{
  "mcpServers": {
    "shenron-tools": {
      "command": "/home/ubuntu/vps/apps/shenron-axum/target/release/shenron-mcp",
      "args": ["--workspace", "/home/ubuntu/vps/apps/shenron"]
    }
  }
}
```

Côté Gemini CLI (`.gemini/settings.json`) :
```json
{
  "mcpServers": {
    "shenron-tools": {
      "command": "/home/ubuntu/vps/apps/shenron-axum/target/release/shenron-mcp"
    }
  }
}
```

→ **Les 2 agents partagent le même backend tools** = même résultat pour `read_file("/.coord/...")`, même cache, même journal.

### b) Translater les payloads tool

Si l'agent envoie un `read_file({file_path, start_line, end_line})` (Gemini) ou `Read({file_path, offset, limit})` (Claude), le backend Rust normalise vers un `ReadFileRequest` interne :

```rust
#[derive(Deserialize)]
#[serde(untagged)]
pub enum ReadFileInput {
    Gemini { file_path: String, start_line: Option<u64>, end_line: Option<u64> },
    Claude { file_path: String, offset: Option<u64>, limit: Option<u64> },
}

impl ReadFileInput {
    pub fn normalize(self) -> NormalizedReadFile {
        match self {
            Self::Gemini { file_path, start_line, end_line } => NormalizedReadFile {
                path: file_path,
                offset: start_line.unwrap_or(1).saturating_sub(1),
                limit: end_line.map(|e| e.saturating_sub(start_line.unwrap_or(1))),
            },
            Self::Claude { file_path, offset, limit } => NormalizedReadFile {
                path: file_path,
                offset: offset.unwrap_or(0),
                limit,
            },
        }
    }
}
```

### c) Audit log unifié

Chaque tool call est journalisé dans la table `tool_calls` Postgres :

```sql
CREATE TABLE tool_calls (
    id          BIGSERIAL PRIMARY KEY,
    agent       TEXT NOT NULL,       -- 'claude' | 'gemini'
    tool_name   TEXT NOT NULL,        -- 'read_file' | 'Read'
    params      JSONB NOT NULL,
    result_kind TEXT,                 -- 'text'|'json'|'binary'|'stream'|'error'
    duration_ms INTEGER,
    status      TEXT,                 -- 'ok'|'denied'|'failed'
    ts          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX tool_calls_agent_ts ON tool_calls (agent, ts DESC);
```

Permet de :
- Comparer perf Claude vs Gemini sur les mêmes tools
- Détecter les tools les plus utilisés (pour optimisation Rust)
- Sécurité : tracer toutes les actions sensibles (`run_shell_command`, `write_file`)

## 5. Plan d'implémentation Rust (sprint dédié)

### Phase A — Couche AgentTool trait + 9 primitives
- `pub trait AgentTool` (cf. supra)
- 9 impl primitives : glob, grep, list, read, write, replace, shell, web_fetch, web_search
- Registry global : `static TOOLS: OnceLock<HashMap<&'static str, Box<dyn AgentTool>>>`
- Test : 1 unit test par tool, 1 integration test cross-agent payload

### Phase B — MCP server stdio (`rmcp`)
- `apps/mcp-server` crate dans le workspace
- Implémenter `tools/list` + `tools/call` + `resources/list` + `resources/read`
- Wire avec le AgentTool registry de Phase A
- Binary `shenron-mcp` qui pipe stdio

### Phase C — HTTP exposure (Axum routes)
- `POST /api/tools/list` → JSON Schema de tous les tools
- `POST /api/tools/call` → `{ name, params }` → `ToolOutput`
- `POST /api/tools/translate` → normalisation Gemini ↔ Claude
- SSE `GET /api/tools/stream` pour les tools long-running

### Phase D — Audit + dashboard
- Table `tool_calls` + page Leptos `/admin/tools` qui visualise volume, durée, status par agent + heatmap des tools les plus appelés
- Export CSV pour analyse

### Phase E — Sécurité
- Sandboxer `run_shell_command` via `bubblewrap` (déjà dans nos services systemd)
- Whitelist de paths pour `read_file`/`write_file` (sortir du workspace = refus)
- Rate-limit par agent (60 calls/min, configurable)

## 6. Risques & questions ouvertes

- **Sandbox** : Gemini CLI utilise `sandbox-exec` (macOS) / `landlock` (Linux). Notre backend Rust devrait wrapper via `landlock` (crate `landlock`) pour le même niveau d'isolation.
- **MCP discovery** : Gemini CLI a un système de "discovered tools" via `mcp-client-manager.ts`. À reproduire pour permettre l'auto-discovery des MCP servers externes (github, neon, context7, etc.).
- **OAuth** : Gemini CLI a tout un système OAuth (`packages/core/src/mcp/oauth-provider.ts`). Notre bridge n'en a pas besoin (auth Bearer simple), mais à garder en tête si on veut supporter des MCP servers cloud (Linear, Slack, etc.).
- **Format unifié des erreurs** : Gemini retourne `tool-error` (cf. `tools/tool-error.ts`), Claude retourne un texte d'erreur. Normaliser via `ToolError` enum.
- **Streaming** : Gemini supporte streaming via SSE (cf. `executeCommand` dans a2a-server). Notre backend doit supporter même pattern via `Stream<Item = ToolEvent>` + Axum SSE response.

## 7. Liens

- `packages/core/src/tools/` (gemini-cli) : https://github.com/google-gemini/gemini-cli/tree/main/packages/core/src/tools
- `packages/core/src/mcp/` (auth providers OAuth) : https://github.com/google-gemini/gemini-cli/tree/main/packages/core/src/mcp
- MCP Rust SDK : https://github.com/modelcontextprotocol/rust-sdk
- A2A spec : https://a2a-protocol.org/latest/specification/
- Notre AgentCard live : https://shenron.rpbey.fr/.well-known/agent-card.json
- Notre A2A endpoint : https://shenron.rpbey.fr/api/a2a/jsonrpc
