param(
  [switch]$NoDeploy,
  [string]$SshHost = 'dbfr'
)
$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $PSScriptRoot
Set-Location $root
if ((git branch --show-current) -ne 'main') { throw 'La livraison exige la branche main.' }
git diff --check
bun run type-check
bun run test:all
git add -A
git diff --cached --check
git diff --cached --quiet
if ($LASTEXITCODE -ne 0) { git commit -m 'chore(ops): synchronise et déploie Shenron' }
git push origin main
if (-not $NoDeploy) {
  ssh $SshHost 'export PATH="$HOME/.bun/bin:$PATH"; cd shenron && bash scripts/deploy-shenron.sh --pull && bun apps/site/scripts/apply-bot-indexes.ts && bash scripts/deploy-mcp.sh && bash scripts/deploy-site.sh --pull && bash scripts/healthcheck.sh'
  if ($LASTEXITCODE -ne 0) { throw "La livraison distante sur $SshHost a échoué." }
}
