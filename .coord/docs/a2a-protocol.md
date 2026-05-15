# Protocole A2A (Agent2Agent) — implémentation Shenron

Spec : https://a2a-protocol.org/latest/specification/  •  SDK officiel : https://www.npmjs.com/package/@a2a-js/sdk

Implémentation maison sur Bun.serve (~150 LOC dans `src/api/server.ts`). Pas de dépendance Express.

## Endpoints

### `GET /.well-known/agent-card.json`

AgentCard discovery (cf. spec v0.3). Cache 1 h (immutable en pratique).

```json
{
  "name": "shenron-coord",
  "protocolVersion": "0.3.0",
  "url": "https://shenron.rpbey.fr/api/a2a/jsonrpc",
  "capabilities": { "streaming": true, "pushNotifications": false },
  "skills": [
    { "id": "coord.messages", "name": "...", "description": "...", "tags": ["coord"] },
    { "id": "coord.tasks", "name": "...", "description": "...", "tags": ["coord"] },
    { "id": "coord.memory", "name": "...", "description": "...", "tags": ["coord"] }
  ]
}
```

### `POST /api/a2a/jsonrpc`

Endpoint unique JSON-RPC 2.0. Body :

```json
{
  "jsonrpc": "2.0",
  "id": "<request-id>",
  "method": "<method>",
  "params": { ... }
}
```

Méthodes supportées :

| Method | Params | Description |
|---|---|---|
| `message/send` | `message: { messageId, role, kind, parts[], contextId? }, to?` | Envoie un message synchrone, retourne ack |
| `message/stream` | (idem) | SSE response avec events de la conversation |
| `tasks/list` | `{ status?, agent? }` | Liste tasks filtrées |
| `tasks/get` | `{ id }` | Détail d'une task |
| `tasks/cancel` | `{ id }` | Marque blocked |

### `GET /api/a2a/events`

SSE bypass (sans JSON-RPC) — stream de tous les events du broker : nouveaux messages, changes de tasks, etc.

## Payload type — `message/send`

```bash
curl -X POST https://shenron.rpbey.fr/api/a2a/jsonrpc \
  -H 'Content-Type: application/json' \
  -d '{
    "jsonrpc": "2.0",
    "id": "1",
    "method": "message/send",
    "params": {
      "to": "gemini",
      "message": {
        "messageId": "msg-001",
        "role": "user",
        "kind": "message",
        "parts": [{ "kind": "text", "text": "Salut Gemini" }],
        "contextId": "sprint-dbfr"
      }
    }
  }'
```

Réponse :

```json
{
  "jsonrpc": "2.0",
  "id": "1",
  "result": {
    "kind": "message",
    "messageId": "msg-001",
    "role": "agent",
    "parts": [{ "kind": "text", "text": "ack" }],
    "contextId": "sprint-dbfr"
  }
}
```

## Backing store

Tous les messages sont persistés dans `.coord/messages.jsonl` (1 ligne = 1 message JSON). Les routes MCP et A2A partagent ce fichier — un message envoyé via A2A est immédiatement visible par `read_messages` MCP.

Lock atomique cross-process : `flock /tmp/dbfr-tasks.lock-msg` pour l'append.

## SSE keep-alive

Le serveur émet un commentaire `: ping\n\n` toutes les 30 s pour éviter le timeout côté nginx/Vercel. Compatible avec EventSource browser standard.

## Latence mesurée (loopback localhost)

| Canal | RTT 95p |
|---|---|
| MCP stdio (process child) | 0.5–1 ms |
| A2A HTTP loopback (TCP) | 3–6 ms |
| A2A Unix socket | 0.2–0.5 ms |
| A2A SSE event delivery | <1 ms après broadcast |
