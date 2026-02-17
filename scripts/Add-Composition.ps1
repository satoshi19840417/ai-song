[CmdletBinding()]
param(
    [Parameter(Mandatory = $true)]
    [ValidatePattern("^[A-Za-z_][A-Za-z0-9_]*$")]
    [string]$SongName,

    [string]$RootPath = "src/Root.tsx",

    [ValidateRange(1, 2147483647)]
    [int]$DurationInFrames = 6300
)

$ErrorActionPreference = "Stop"

if (-not (Test-Path -LiteralPath $RootPath)) {
    throw "Root file not found: $RootPath"
}

$componentName = "${SongName}Video"
$schemaName = ("{0}{1}Schema" -f $SongName.Substring(0, 1).ToLowerInvariant(), $SongName.Substring(1))
$dataName = ("{0}{1}Data" -f $SongName.Substring(0, 1).ToLowerInvariant(), $SongName.Substring(1))

$importVideoLine = "import { $componentName, $schemaName } from `"./HelloWorld/$componentName`";"
$importDataLine = "import { $dataName } from `"./HelloWorld/${SongName}Data`";"
$compositionIdPattern = [Regex]::Escape("id=`"$SongName`"")

$originalContent = Get-Content -LiteralPath $RootPath -Raw -Encoding UTF8
if ($originalContent -match $compositionIdPattern) {
    Write-Host "Composition '$SongName' is already registered."
    exit 0
}

$newline = if ($originalContent.Contains("`r`n")) { "`r`n" } else { "`n" }
$updatedContent = $originalContent

$needsVideoImport = $updatedContent -notmatch [Regex]::Escape("./HelloWorld/$componentName")
$needsDataImport = $updatedContent -notmatch [Regex]::Escape("./HelloWorld/${SongName}Data")

if ($needsVideoImport -or $needsDataImport) {
    $importMatches = [Regex]::Matches($updatedContent, "(?ms)^import[\s\S]*?;\r?\n")
    if ($importMatches.Count -eq 0) {
        throw "Could not find import block in $RootPath"
    }

    $lastImportMatch = $importMatches[$importMatches.Count - 1]
    $insertIndex = $lastImportMatch.Index + $lastImportMatch.Length

    $importsToAdd = @()
    if ($needsVideoImport) {
        $importsToAdd += $importVideoLine
    }
    if ($needsDataImport) {
        $importsToAdd += $importDataLine
    }

    $importBlock = ($importsToAdd -join $newline) + $newline
    $updatedContent = $updatedContent.Insert($insertIndex, $importBlock)
}

$compositionBlock = @(
    "      <Composition",
    "        id=`"$SongName`"",
    "        component={$componentName}",
    "        durationInFrames={$DurationInFrames}",
    "        fps={30}",
    "        width={1920}",
    "        height={1080}",
    "        schema={$schemaName}",
    "        defaultProps={$dataName}",
    "      />"
) -join $newline

$fragmentMatches = [Regex]::Matches($updatedContent, "(?m)^\s*</>\s*$")
if ($fragmentMatches.Count -eq 0) {
    throw "Could not find fragment closing tag '</>' in $RootPath"
}

$lastFragmentMatch = $fragmentMatches[$fragmentMatches.Count - 1]
$updatedContent = $updatedContent.Insert($lastFragmentMatch.Index, $compositionBlock + $newline)

if ($updatedContent -eq $originalContent) {
    Write-Host "No changes were necessary."
    exit 0
}

$backupPath = "${RootPath}.backup"
Copy-Item -LiteralPath $RootPath -Destination $backupPath -Force
Set-Content -LiteralPath $RootPath -Value $updatedContent -Encoding UTF8

Write-Host "Added composition '$SongName' to $RootPath"
Write-Host "Backup created at $backupPath"
