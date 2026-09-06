# SPDX-License-Identifier: Apache-2.0
[CmdletBinding()] param([switch]$Pull,[switch]$Migrate,[switch]$NoBuild,[switch]$AllowLowMemory)
$ErrorActionPreference = 'Stop'
$root = Split-Path $PSScriptRoot -Parent
Set-Location $root
if ($Pull) { git pull --ff-only }
$args = @('scripts/ops/deploy-site.ts')
if ($Migrate) { $args += '--migrate' }
if ($NoBuild) { $args += '--no-build' }
if ($AllowLowMemory) { $args += '--allow-low-memory' }
& bun @args
exit $LASTEXITCODE
