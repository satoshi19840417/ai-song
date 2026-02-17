[CmdletBinding()]
param(
    [string]$SourceDir = "public/suno_PJ/new",
    [switch]$AsJson
)

$ErrorActionPreference = "Stop"

if (-not (Test-Path -LiteralPath $SourceDir)) {
    throw "Source directory not found: $SourceDir"
}

$lrcFiles = Get-ChildItem -LiteralPath $SourceDir -File -Filter "*.lrc" |
    Sort-Object LastWriteTime -Descending

if ($lrcFiles.Count -eq 0) {
    throw "No .lrc files found in $SourceDir"
}

$mediaExtensions = @(".mp4", ".mp3", ".wav")

$selected = $null
foreach ($lrc in $lrcFiles) {
    $exactMedia = $mediaExtensions |
        ForEach-Object { Join-Path $SourceDir ($lrc.BaseName + $_) } |
        Where-Object { Test-Path -LiteralPath $_ } |
        Select-Object -First 1

    if ($exactMedia) {
        $selected = [PSCustomObject]@{
            lrcFile = $lrc.FullName
            mediaFile = (Resolve-Path -LiteralPath $exactMedia).Path
            baseName = $lrc.BaseName
            sourceDir = (Resolve-Path -LiteralPath $SourceDir).Path
            matchType = "exact"
        }
        break
    }

    $prefixMedia = Get-ChildItem -LiteralPath $SourceDir -File |
        Where-Object {
            ($mediaExtensions -contains $_.Extension.ToLowerInvariant()) -and
            $_.BaseName -like "$($lrc.BaseName)*"
        } |
        Sort-Object LastWriteTime -Descending |
        Select-Object -First 1

    if ($prefixMedia) {
        $selected = [PSCustomObject]@{
            lrcFile = $lrc.FullName
            mediaFile = $prefixMedia.FullName
            baseName = $lrc.BaseName
            sourceDir = (Resolve-Path -LiteralPath $SourceDir).Path
            matchType = "prefix"
        }
        break
    }
}

if (-not $selected) {
    throw "No media pair found for any .lrc file in $SourceDir"
}

if ($AsJson) {
    $selected | ConvertTo-Json -Depth 5 -Compress
} else {
    Write-Host "LRC  : $($selected.lrcFile)"
    Write-Host "Media: $($selected.mediaFile)"
    Write-Host "Base : $($selected.baseName)"
    Write-Host "Type : $($selected.matchType)"
}
