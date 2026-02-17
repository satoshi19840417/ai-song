[CmdletBinding()]
param(
    [Parameter(Mandatory = $true)]
    [ValidatePattern("^[A-Za-z_][A-Za-z0-9_]*$")]
    [string]$SongName,

    [Parameter(Mandatory = $true)]
    [string]$LrcFile,

    [Parameter(Mandatory = $true)]
    [string]$VideoFile,

    [string]$Artist = "Suno AI",
    [string]$RootPath = "src/Root.tsx",
    [string]$TemplatePath = "templates/LyricVideoTemplate.tsx",

    [ValidateRange(1, 120)]
    [int]$TailBufferSeconds = 12,

    [switch]$SkipComposition,
    [switch]$SkipBuild,
    [switch]$Force
)

$ErrorActionPreference = "Stop"

function Resolve-AbsolutePath {
    param([Parameter(Mandatory = $true)][string]$PathValue)

    if ([System.IO.Path]::IsPathRooted($PathValue)) {
        return [System.IO.Path]::GetFullPath($PathValue)
    }

    return [System.IO.Path]::GetFullPath((Join-Path (Get-Location) $PathValue))
}

function Get-LrcMaxSeconds {
    param([Parameter(Mandatory = $true)][string]$LrcPath)

    $pattern = '\[(\d{2}):(\d{2}(?:\.\d{2,3})?)\]'
    $maxSeconds = 0.0

    foreach ($line in Get-Content -LiteralPath $LrcPath -Encoding UTF8) {
        $matches = [Regex]::Matches($line, $pattern)
        foreach ($match in $matches) {
            $minutes = [int]$match.Groups[1].Value
            $secondsPart = [double]$match.Groups[2].Value
            $totalSeconds = ($minutes * 60) + $secondsPart
            if ($totalSeconds -gt $maxSeconds) {
                $maxSeconds = $totalSeconds
            }
        }
    }

    return $maxSeconds
}

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$parseScriptPath = Join-Path $scriptDir "parse_lrc_to_data.js"
$addCompositionScriptPath = Join-Path $scriptDir "Add-Composition.ps1"

$lrcAbsolute = Resolve-AbsolutePath -PathValue $LrcFile
$videoAbsolute = Resolve-AbsolutePath -PathValue $VideoFile
$templateAbsolute = Resolve-AbsolutePath -PathValue $TemplatePath

if (-not (Test-Path -LiteralPath $lrcAbsolute)) {
    throw "LRC file not found: $lrcAbsolute"
}
if (-not (Test-Path -LiteralPath $videoAbsolute)) {
    throw "Video file not found: $videoAbsolute"
}
if (-not (Test-Path -LiteralPath $templateAbsolute)) {
    throw "Template file not found: $templateAbsolute"
}
if (-not (Test-Path -LiteralPath $parseScriptPath)) {
    throw "Parser script not found: $parseScriptPath"
}

$videoOutputRelative = "src/HelloWorld/${SongName}Video.tsx"
$dataOutputRelative = "src/HelloWorld/${SongName}Data.ts"
$videoOutputAbsolute = Resolve-AbsolutePath -PathValue $videoOutputRelative
$dataOutputAbsolute = Resolve-AbsolutePath -PathValue $dataOutputRelative

if ((Test-Path -LiteralPath $videoOutputAbsolute) -and -not $Force) {
    throw "Video component already exists: $videoOutputRelative (use -Force to overwrite)"
}
if ((Test-Path -LiteralPath $dataOutputAbsolute) -and -not $Force) {
    throw "Data file already exists: $dataOutputRelative (use -Force to overwrite)"
}

$parseArgs = @(
    $parseScriptPath
    "--song-name", $SongName
    "--lrc-file", $lrcAbsolute
    "--video-file", $videoAbsolute
    "--artist", $Artist
    "--out-file", $dataOutputAbsolute
)

& node @parseArgs
if ($LASTEXITCODE -ne 0) {
    throw "Data file generation failed."
}

$schemaName = ("{0}{1}Schema" -f $SongName.Substring(0, 1).ToLowerInvariant(), $SongName.Substring(1))
$componentName = "${SongName}Video"

$templateContent = Get-Content -LiteralPath $templateAbsolute -Raw -Encoding UTF8
$videoSource = $templateContent.
    Replace("__SONG_NAME__", $SongName).
    Replace("__SCHEMA_NAME__", $schemaName).
    Replace("__COMPONENT_NAME__", $componentName)

Set-Content -LiteralPath $videoOutputAbsolute -Value $videoSource -Encoding UTF8

$durationInFrames = $null
if (-not $SkipComposition) {
    if (-not (Test-Path -LiteralPath $addCompositionScriptPath)) {
        throw "Composition script not found: $addCompositionScriptPath"
    }

    $maxSeconds = Get-LrcMaxSeconds -LrcPath $lrcAbsolute
    $durationInFrames = [Math]::Ceiling(($maxSeconds + $TailBufferSeconds) * 30)
    $durationInFrames = [Math]::Max($durationInFrames, 300)

    & $addCompositionScriptPath -SongName $SongName -RootPath $RootPath -DurationInFrames $durationInFrames
    if ($LASTEXITCODE -ne 0) {
        throw "Composition registration failed."
    }
}

if (-not $SkipBuild) {
    npm run build
    if ($LASTEXITCODE -ne 0) {
        throw "Build failed."
    }
}

Write-Host "Created lyric video files:"
Write-Host "  $dataOutputRelative"
Write-Host "  $videoOutputRelative"
if ($null -ne $durationInFrames) {
    Write-Host "Registered composition duration: $durationInFrames frames"
}
