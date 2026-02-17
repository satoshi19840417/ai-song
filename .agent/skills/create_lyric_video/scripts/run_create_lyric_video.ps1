[CmdletBinding()]
param(
    [string]$SongName,
    [string]$LrcFile,
    [string]$MediaFile,
    [string]$Artist = "Suno AI",
    [string]$ProjectRoot = "",
    [string]$SourceDir = "public/suno_PJ/new",
    [switch]$SkipBuild,
    [switch]$MoveCompleted,
    [switch]$DryRun,
    [switch]$AsJson
)

$ErrorActionPreference = "Stop"

function Convert-ToPascalCase {
    param([Parameter(Mandatory = $true)][string]$InputText)

    $parts = $InputText -split '[^A-Za-z0-9]+' | Where-Object { $_ -ne "" }
    if ($parts.Count -eq 0) {
        return $null
    }

    return ($parts | ForEach-Object {
        if ($_.Length -eq 1) {
            $_.ToUpperInvariant()
        } else {
            $_.Substring(0, 1).ToUpperInvariant() + $_.Substring(1)
        }
    }) -join ""
}

function Invoke-DetectPair {
    param(
        [Parameter(Mandatory = $true)][string]$ScriptPath,
        [Parameter(Mandatory = $true)][string]$DirPath
    )

    $json = & $ScriptPath -SourceDir $DirPath -AsJson
    if ($LASTEXITCODE -ne 0) {
        throw "Pair detection failed."
    }
    return ($json | ConvertFrom-Json)
}

function Resolve-AgainstProjectRoot {
    param(
        [Parameter(Mandatory = $true)][string]$PathValue,
        [Parameter(Mandatory = $true)][string]$RootPath
    )

    if ([System.IO.Path]::IsPathRooted($PathValue)) {
        return [System.IO.Path]::GetFullPath($PathValue)
    }

    return [System.IO.Path]::GetFullPath((Join-Path $RootPath $PathValue))
}

$skillScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$defaultProjectRoot = [System.IO.Path]::GetFullPath((Join-Path $skillScriptDir "..\..\..\.."))
$projectRootBase = if ([string]::IsNullOrWhiteSpace($ProjectRoot)) { $defaultProjectRoot } else { $ProjectRoot }
$projectRootAbs = [System.IO.Path]::GetFullPath($projectRootBase)
$detectScript = Join-Path $skillScriptDir "detect_new_media_pair.ps1"
$newLyricVideoScript = Join-Path $projectRootAbs "scripts/New-LyricVideo.ps1"
$moveCompletedScript = Join-Path $projectRootAbs "scripts/Move-CompletedFiles.ps1"

if (-not (Test-Path -LiteralPath $newLyricVideoScript)) {
    throw "Missing script: $newLyricVideoScript"
}

if ([string]::IsNullOrWhiteSpace($LrcFile) -or [string]::IsNullOrWhiteSpace($MediaFile)) {
    if (-not (Test-Path -LiteralPath $detectScript)) {
        throw "Missing script: $detectScript"
    }
    $pair = Invoke-DetectPair -ScriptPath $detectScript -DirPath (Join-Path $projectRootAbs $SourceDir)
    if ([string]::IsNullOrWhiteSpace($LrcFile)) {
        $LrcFile = $pair.lrcFile
    }
    if ([string]::IsNullOrWhiteSpace($MediaFile)) {
        $MediaFile = $pair.mediaFile
    }
    if ([string]::IsNullOrWhiteSpace($SongName)) {
        $SongName = Convert-ToPascalCase -InputText $pair.baseName
    }
}

if ([string]::IsNullOrWhiteSpace($SongName)) {
    throw "SongName could not be inferred. Please provide -SongName explicitly."
}

$resolvedLrcFile = Resolve-AgainstProjectRoot -PathValue $LrcFile -RootPath $projectRootAbs
$resolvedMediaFile = Resolve-AgainstProjectRoot -PathValue $MediaFile -RootPath $projectRootAbs

$payload = [ordered]@{
    status = "planned"
    songName = $SongName
    lrcFile = $resolvedLrcFile
    mediaFile = $resolvedMediaFile
    artist = $Artist
    build = (-not $SkipBuild)
    moveCompleted = [bool]$MoveCompleted
    dryRun = [bool]$DryRun
}

if ($DryRun) {
    if ($AsJson) {
        $payload | ConvertTo-Json -Depth 5 -Compress
    } else {
        Write-Host "SongName    : $($payload.songName)"
        Write-Host "LRC File    : $($payload.lrcFile)"
        Write-Host "Media File  : $($payload.mediaFile)"
        Write-Host "Build       : $($payload.build)"
        Write-Host "Move        : $($payload.moveCompleted)"
        Write-Host "(DryRun) No changes applied."
    }
    exit 0
}

$newLyricArgs = @(
    "-SongName", $SongName,
    "-LrcFile", $payload.lrcFile,
    "-VideoFile", $payload.mediaFile,
    "-Artist", $Artist
)
if ($SkipBuild) {
    $newLyricArgs += "-SkipBuild"
}

Push-Location $projectRootAbs
try {
    & $newLyricVideoScript @newLyricArgs
    if ($LASTEXITCODE -ne 0) {
        throw "New-LyricVideo execution failed."
    }

    if ($MoveCompleted) {
        if (-not (Test-Path -LiteralPath $moveCompletedScript)) {
            throw "Missing script: $moveCompletedScript"
        }
        & $moveCompletedScript -SongName $SongName
        if ($LASTEXITCODE -ne 0) {
            throw "Move-CompletedFiles execution failed."
        }
    }
} finally {
    Pop-Location
}

$payload.status = "completed"
if ($AsJson) {
    $payload | ConvertTo-Json -Depth 5 -Compress
} else {
    Write-Host "Completed create_lyric_video pipeline."
    Write-Host "SongName: $SongName"
}
