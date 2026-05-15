# Protocole A2A (Agent2Agent) — implémentation Shenron

Spec : https://a2a-protocol.org/latest/specification/  •  SDK officiel : https://www.npmjs.com/package/@a2a-js/sdk

Implémentation maison sur Bun.serve (~200 LOC dans `src/api/server.ts`). Pas de dépendance Express.

**Compatible @a2a-js/sdk v0.3** — AgentCard et SSE wrappers calqués sur l'implémentation officielle de `packages/a2a-server` de gemini-cli (https://github.com/google-gemini/gemini-cli/tree/main/packages/a2a-server). Cf. `CoderAgentEvent` (text-content, state-change, thought) pour les event kinds.

## Endpoints

### `GET /.well-known/agent-card.json`

AgentCard discovery (cf. spec v0.3). Cache 1 h (immutable en pratique).

```json
{
  "name": "shenron-coord",
  "version": "1.1.0",
  "protocolVersion": "0.3.0",
  "url": "https://shenron.rpbey.fr/api/a2a/jsonrpc",
  "provider": { "organization": "DBFR / shenron.rpbey.fr", "url": "https://shenron.rpbey.fr" },
  "capabilities": { "streaming": true, "pushNotifications": false, "stateTransitionHistory": true },
  "securitySchemes": { "bearerAuth": { "type": "http", "scheme": "bearer" } },
  "security": [{ "bearerAuth": [] }, {}],
  "defaultInputModes": ["text"],
  "defaultOutputModes": ["text"],
  "supportsAuthenticatedExtendedCard": false,
  "skills": [
    { "id": "coord.messages", "name": "Inter-agent messages", "examples": ["message/send..."], "inputModes": ["text"], "outputModes": ["text"] },
    { "id": "coord.tasks", "name": "Sprint tasks", "examples": ["tasks/list..."], "inputModes": ["text"], "outputModes": ["text"] },
    { "id": "coord.memory", "name": "Shared markdown memory", "examples": ["memory/read..."], "inputModes": ["text"], "outputModes": ["text"] }
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
| `message/send` | `message: { messageId, role, parts[], contextId? }, to?` | Envoie un message synchrone, retourne ack. Broadcast `text-content` + `message` events. |
| `message/stream` | (idem) | SSE response avec events de la conversation. `id` JSON-RPC est propagé dans chaque event. |
| `tasks/list` | `{ status?, agent? }` | Liste tasks filtrées |
| `tasks/get` | `{ id }` | Détail d'une task |
| `tasks/cancel` | `{ id }` | Marque blocked |
| `tasks/resubscribe` | `{ id? }` | Re-attache un client en SSE sur un task existant |
| `agent/getAuthenticatedExtendedCard` | — | Retourne `-32601` (notre AgentCard publique est canonique) |

## SSE event format (calqué sur gemini-cli)

Chaque event est wrappé dans une enveloppe JSON-RPC 2.0 et émis sur la stream :

```
data: {"jsonrpc":"2.0","id":"<rpcId|taskId|messageId|null>","result":<event>}\n\n
```

Event kinds adoptés depuis `CoderAgentEvent` (gemini-cli) :

| Kind | Émis quand | Payload `result.kind` |
|---|---|---|
| `state-change` | Welcome event à l'ouverture du SSE, transitions de TaskState | `state-change` |
| `text-content` | Après un `message/send` (en plus du legacy `message`) | `text-content` |
| `message` | Legacy event broadcast — conservé pour rétrocompat | `message` |

Le `id` du wrapper JSON-RPC correspond au `taskId` si l'event est lié à une task, sinon au `messageId` du message envoyé, sinon au `rpcId` du `message/stream` initial.

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
