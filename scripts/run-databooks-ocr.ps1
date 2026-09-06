[CmdletBinding()]
param(
	[string]$Root = "data/sj-ocr",
	[int]$MaxTokens = 2048,
	[int]$PollSeconds = 30
)

$ErrorActionPreference = "Stop"
$aphrody = (Get-Command aphrody -ErrorAction Stop).Source
$rootPath = (Resolve-Path $Root).Path
$logPath = Join-Path $rootPath "ocr-monitor.log"

function Write-Log([string]$Message) {
	$line = "[{0}] {1}" -f (Get-Date -Format "yyyy-MM-dd HH:mm:ss"), $Message
	Add-Content -LiteralPath $logPath -Value $line
	Write-Output $line
}

function Normalize-Results([string]$Path) {
	if (-not (Test-Path -LiteralPath $Path)) { return 0 }
	$records = [ordered]@{}
	$invalid = 0
	foreach ($line in Get-Content -LiteralPath $Path) {
		if (-not $line.Trim()) { continue }
		try {
			$r = $line | ConvertFrom-Json
			$key = [IO.Path]::GetFileName([string]$r.image).ToLowerInvariant()
			if ($key) { $records[$key] = $r }
		} catch { $invalid++ }
	}
	if ($invalid -gt 0) { throw "$Path contient $invalid ligne(s) JSON invalides; arrêt sans réécriture" }
	$backup = "$Path.raw-$(Get-Date -Format 'yyyyMMdd-HHmmss').jsonl"
	Copy-Item -LiteralPath $Path -Destination $backup -ErrorAction Stop
	$tmp = "$Path.tmp"
	[IO.File]::WriteAllText($tmp, "", [Text.UTF8Encoding]::new($false))
	$records.Values | ForEach-Object {
		$_.image = [IO.Path]::GetFileName([string]$_.image)
		($_ | ConvertTo-Json -Depth 20 -Compress) | Add-Content -LiteralPath $tmp -Encoding utf8NoBOM
	}
	Move-Item -LiteralPath $tmp -Destination $Path -Force
	[void](Write-Log "NORMALIZE $([IO.Path]::GetFileName((Split-Path $Path -Parent))): $($records.Count) entrées uniques; brut=$([IO.Path]::GetFileName($backup))")
	return $records.Count
}

Write-Log "Démarrage OCR databooks root=$rootPath maxTokens=$MaxTokens"
$lots = Get-ChildItem -LiteralPath $rootPath -Directory | Where-Object Name -match '^lot-[0-9]+$' | Sort-Object Name
if ($lots.Count -eq 0) { throw "Aucun lot trouvé dans $rootPath" }

foreach ($lot in $lots) {
	$imagesPath = Join-Path $lot.FullName "images"
	$images = @(Get-ChildItem -LiteralPath $imagesPath -Recurse -File -ErrorAction SilentlyContinue | Where-Object Extension -in '.jpg','.jpeg','.png','.webp')
	if ($images.Count -eq 0) { Write-Log "SKIP $($lot.Name): aucune image dans images/"; continue }
	$out = Join-Path $lot.FullName "resultats.jsonl"
	Write-Log "RUN $($lot.Name): $($images.Count) images -> $out"
	$completed = Normalize-Results $out
	if ($completed -ge $images.Count) {
		Write-Log "SKIP $($lot.Name): $completed/$($images.Count) images déjà traitées"
		continue
	}
	& $aphrody ocr databooks $imagesPath --out $out --skip-done --max-tokens $MaxTokens 2>&1 | ForEach-Object {
		Add-Content -LiteralPath $logPath -Value ("[{0}] {1}" -f (Get-Date -Format "yyyy-MM-dd HH:mm:ss"), $_)
	}
	if ($LASTEXITCODE -ne 0) { Write-Log "FAIL $($lot.Name): exit=$LASTEXITCODE"; continue }
	Write-Log "DONE $($lot.Name): resultats=$(if(Test-Path $out){(Get-Content $out).Count}else{0})"
}
Write-Log "Fin OCR databooks"
