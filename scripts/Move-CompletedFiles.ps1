[CmdletBinding()]
param(
    [Parameter(Mandatory = $true)]
    [ValidatePattern("^[A-Za-z_][A-Za-z0-9_]*$")]
    [string]$SongName,

    [string]$FilePrefix,
    [string]$NewDir = "public/suno_PJ/new",
    [string]$DoneDir = "public/suno_PJ/done",
    [switch]$DryRun
)

$ErrorActionPreference = "Stop"

$dataFile = "src/HelloWorld/${SongName}Data.ts"
if (-not (Test-Path -LiteralPath $dataFile)) {
    throw "Data file not found: $dataFile"
}

if (-not (Test-Path -LiteralPath $NewDir)) {
    throw "Source directory not found: $NewDir"
}

$dataContent = Get-Content -LiteralPath $dataFile -Raw -Encoding UTF8

if ([string]::IsNullOrWhiteSpace($FilePrefix)) {
    $titleMatch = [Regex]::Match($dataContent, 'title:\s*"([^"]+)"')
    if (-not $titleMatch.Success) {
        throw "Could not infer file prefix from title in $dataFile. Use -FilePrefix."
    }
    $FilePrefix = $titleMatch.Groups[1].Value
}

$lrcCandidates = @(
    Get-ChildItem -LiteralPath $NewDir -File |
        Where-Object { $_.Extension -ieq ".lrc" -and $_.BaseName -like "$FilePrefix*" }
)

$mediaCandidates = @(
    Get-ChildItem -LiteralPath $NewDir -File |
        Where-Object {
            ($_.Extension -ieq ".mp4" -or $_.Extension -ieq ".mp3" -or $_.Extension -ieq ".wav") -and
            $_.BaseName -like "$FilePrefix*"
        }
)

if ($lrcCandidates.Count -ne 1) {
    throw "Expected exactly 1 .lrc file for prefix '$FilePrefix' in $NewDir, found: $($lrcCandidates.Count)"
}
if ($mediaCandidates.Count -ne 1) {
    throw "Expected exactly 1 media file (.mp4/.mp3/.wav) for prefix '$FilePrefix' in $NewDir, found: $($mediaCandidates.Count)"
}

$lrcFile = $lrcCandidates[0]
$mediaFile = $mediaCandidates[0]

if ($DryRun) {
    Write-Host "[DRY RUN] Planned operations:"
    Write-Host "  Move: $($lrcFile.FullName) -> $DoneDir"
    Write-Host "  Move: $($mediaFile.FullName) -> $DoneDir"
    Write-Host "  Update: $dataFile (suno_PJ/new/ -> suno_PJ/done/)"
    return
}

if (-not (Test-Path -LiteralPath $DoneDir)) {
    New-Item -ItemType Directory -Path $DoneDir -Force | Out-Null
}

$backupPath = "${dataFile}.backup"
Copy-Item -LiteralPath $dataFile -Destination $backupPath -Force

$movedFiles = @()
try {
    foreach ($file in @($lrcFile, $mediaFile)) {
        $destination = Join-Path $DoneDir $file.Name
        Move-Item -LiteralPath $file.FullName -Destination $destination -Force
        $movedFiles += [PSCustomObject]@{
            Source = $file.FullName
            Destination = $destination
        }
    }

    $updatedData = $dataContent -replace 'suno_PJ[/\\]new[/\\]', 'suno_PJ/done/'
    Set-Content -LiteralPath $dataFile -Value $updatedData -Encoding UTF8

    Write-Host "Moved completed files and updated data path."
    Write-Host "  LRC  : $($lrcFile.Name)"
    Write-Host "  Media: $($mediaFile.Name)"
    Write-Host "Backup : $backupPath"
} catch {
    Write-Error "Error during move/update. Starting rollback."

    foreach ($moved in $movedFiles) {
        if (Test-Path -LiteralPath $moved.Destination) {
            Move-Item -LiteralPath $moved.Destination -Destination $moved.Source -Force -ErrorAction SilentlyContinue
        }
    }

    if (Test-Path -LiteralPath $backupPath) {
        Copy-Item -LiteralPath $backupPath -Destination $dataFile -Force
    }

    throw
}
