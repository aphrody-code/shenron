param([switch]$NoDeploy)
$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $PSScriptRoot
Set-Location $root
if ((git branch --show-current) -ne 'main') { throw 'La livraison exige la branche main.' }
git diff --check
bun run type-check
bun run test:all
git add -A
git diff --cached --check
if ((git diff --cached --quiet) -ne $true) { git commit -m 'chore(ops): synchronise et déploie Shenron' }
git push origin main
if (-not $NoDeploy) {
  bash scripts/deploy-shenron.sh --pull
  bash scripts/deploy-site.sh --pull
  bash scripts/healthcheck.sh
}
