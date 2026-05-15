# Setup MCP `coord` — bridge Claude ↔ Gemini

Le MCP server `coord` (fichier `mcp/coord-server.ts`) est le canal principal de communication entre Claude Code et Gemini CLI sur ce VPS. Il expose :

- **12 tools** : `list_tasks`, `get_task`, `claim_task`, `complete_task`, `block_task`, `send_message`, `read_messages`, `read_memory`, `write_memory`, `list_docs`, `read_doc`, `write_doc`.
- **5 resources** : `coord://tasks`, `coord://memory/{shared,claude,gemini}`, `coord://messages`.

État backend : fichiers plats sous `.coord/` (tasks.json, memory/*.md, messages.jsonl, docs/*.md). Concurrence inter-agent via `flock /tmp/dbfr-tasks.lock`.

## Registration

### Gemini CLI

```bash
gemini mcp add coord /home/ubuntu/.bun/bin/bun /home/ubuntu/vps/apps/shenron/mcp/coord-server.ts \
  --env COORD_AGENT=gemini \
  --env COORD_DIR=/home/ubuntu/vps/apps/shenron/.coord
```

Vérifier : `gemini mcp list`.

### Claude Code CLI

```bash
claude mcp add coord \
  -e COORD_AGENT=claude \
  -e COORD_DIR=/home/ubuntu/vps/apps/shenron/.coord \
  -- /home/ubuntu/.bun/bin/bun /home/ubuntu/vps/apps/shenron/mcp/coord-server.ts
```

Vérifier : `claude mcp list` (doit afficher `coord: ... ✓ Connected`).

Note : il faut **redémarrer la session Claude Code** après l'ajout pour que les tools deviennent disponibles dans la conversation courante.

## Usage typique

### Côté Claude (en TS via tsyringe/MCP SDK ou via le CLI claude)

```ts
// Lister mes tasks en cours
await tools.list_tasks({ agent: "claude", status: "in_progress" });

// Annoncer un fix à Gemini
await tools.send_message({
  to: "gemini",
  type: "event",
  content: "API /api/public/profile/:id/card.png déployée. Doc dans .coord/docs/api-contract.md.",
});

// Lire les messages que Gemini m'a envoyés depuis 5 min
await tools.read_messages({ since: new Date(Date.now() - 5 * 60_000).toISOString() });
```

### Côté Gemini (via les mêmes tools dans son context)

```
> Lis les messages reçus de claude depuis ce matin
> [Gemini call tool: read_messages]
> Voici ce qu'il a envoyé : ...

> Marque la task gemini-04 comme done avec ce commit
> [Gemini call tool: complete_task]
```

## Test manuel stdio

```bash
printf '%s\n%s\n%s\n' \
  '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2024-11-05","capabilities":{},"clientInfo":{"name":"manual","version":"1"}}}' \
  '{"jsonrpc":"2.0","method":"notifications/initialized"}' \
  '{"jsonrpc":"2.0","id":2,"method":"tools/list"}' \
  | COORD_AGENT=test bun mcp/coord-server.ts
```

## A2A — bridge HTTP miroir

Le même `messages.jsonl` est backed par 3 canaux différents :

| Canal | Endpoint | Latence locale |
|---|---|---|
| MCP stdio (CLI) | `bun mcp/coord-server.ts` | <1 ms (process spawn) |
| A2A HTTP (port 5006) | `POST https://shenron.rpbey.fr/api/a2a/jsonrpc` | ~5 ms (TCP loopback) |
| A2A Unix socket | `curl --unix-socket /tmp/dbfr-a2a.sock http://localhost/jsonrpc` | <0.5 ms |
| A2A SSE events | `GET /api/a2a/events` ou `/events` (unix) | streaming |

AgentCard discovery : `GET /.well-known/agent-card.json` (sur le bot ou Unix sock).

## Démarrage Unix socket broker

```bash
nohup bun /home/ubuntu/vps/apps/shenron/scripts/a2a-broker.ts > /tmp/a2a-broker.log 2>&1 &
ls -la /tmp/dbfr-a2a.sock  # vérifie présent + 0666
```

Pour le démarrer auto au reboot, créer un service systemd user (TODO).
