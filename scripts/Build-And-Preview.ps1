[CmdletBinding()]
param(
    [switch]$SkipBuild
)

$ErrorActionPreference = "Stop"

if (-not $SkipBuild) {
    Write-Host "Building project..."
    npm run build

    if ($LASTEXITCODE -ne 0) {
        throw "Build failed."
    }
}

Write-Host "Starting Remotion preview..."
npm run dev
