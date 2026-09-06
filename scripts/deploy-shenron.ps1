# SPDX-License-Identifier: Apache-2.0
[CmdletBinding()] param([switch]$Pull,[switch]$Build = $true,[switch]$Restart = $true)
$ErrorActionPreference = 'Stop'
$root = Split-Path $PSScriptRoot -Parent
Set-Location $root
if ($Pull) { git pull --ff-only origin main }
if ($Build) { bun --filter '@shenron/bot' run dashboard:css }
if ($Restart) {
  $service = Get-Service -Name shenron -ErrorAction SilentlyContinue
  if (-not $service) { throw 'Service Windows shenron absent; utiliser le script Linux sur le VPS.' }
  Restart-Service -Name shenron -Force
}
