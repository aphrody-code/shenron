# SPDX-License-Identifier: Apache-2.0
[CmdletBinding()] param([switch]$Quiet)
$ErrorActionPreference = 'SilentlyContinue'
$rc = 0
function Say([string]$Text) { if (-not $Quiet) { Write-Host $Text } }
Say '=== Services ==='
foreach ($name in 'shenron','shenron-mcp','shenron-embed','filebrowser','postgresql','nginx') {
  $svc = Get-Service -Name $name
  if ($svc.Status -eq 'Running') { Say "  OK $name : active" } else { Say "  KO $name : $($svc.Status)"; $rc = 1 }
}
Say "`n=== Endpoints HTTP ==="
foreach ($check in @(@('site','https://dragonballfr.com/'),@('bot','https://bot.dragonballfr.com/health'),@('mcp','https://mcp.dragonballfr.com/health'),@('files','https://files.dragonballfr.com/'))) {
  try { $r = Invoke-WebRequest -Uri $check[1] -TimeoutSec 8 -UseBasicParsing; Say "  OK $($check[0]) : $([int]$r.StatusCode)" } catch { Say "  KO $($check[0])"; $rc = 1 }
}
if (-not $Quiet) { Say ($(if ($rc -eq 0) { 'OK Tout est vert' } else { 'KO Anomalies détectées' })) }
exit $rc
