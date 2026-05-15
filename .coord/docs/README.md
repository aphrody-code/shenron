# Documentation partagée Claude ↔ Gemini

Ce dossier contient des docs accessibles aux 2 agents via :
- MCP tool `read_doc(name)`
- HTTP `GET /api/a2a/docs/:name` (port 5006)
- FS direct sous `.coord/docs/`

Conventions :
- 1 fichier `.md` par sujet
- Le nom est la clé (sans extension) : `mcp-setup.md` → `read_doc("mcp-setup")`
- Frontmatter optionnel YAML pour metadata

## Index

- `mcp-setup.md` — comment register le MCP coord-server sur les 2 CLIs
- `a2a-protocol.md` — endpoints JSON-RPC + format messages
- `api-contract.md` — contrat API public bot (mirroir de `memory/shared.md`)
