param(
    [string]$ProjectRoot = (Get-Location).Path,
    [int]$PortMin = 3000,
    [int]$PortMax = 3020,
    [int]$TimeoutSec = 60,
    [switch]$AsJson
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

function Read-TailSafe {
    param(
        [string]$Path,
        [int]$Tail = 20
    )
    if (Test-Path $Path) {
        return (Get-Content $Path -Tail $Tail) -join [Environment]::NewLine
    }
    return ""
}

function Parse-UrlFromLog {
    param([string]$LogPath)
    if (-not (Test-Path $LogPath)) {
        return $null
    }
    $content = Get-Content $LogPath -Raw
    $match = [regex]::Match($content, "http://localhost:\d+")
    if ($match.Success) {
        return $match.Value
    }
    return $null
}

$scriptRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$checkScript = Join-Path $scriptRoot "check_remotion_dev.ps1"

if (-not (Test-Path $checkScript)) {
    throw "check_remotion_dev.ps1 not found: $checkScript"
}

$existingJson = & $checkScript -PortMin $PortMin -PortMax $PortMax -AsJson
$existing = $existingJson | ConvertFrom-Json
if ($existing.status -eq "running") {
    $already = [ordered]@{
        status = "running"
        url = $existing.url
        port = $existing.port
        pid = $existing.pid
        out_log = $null
        err_log = $null
        stop_command = $existing.stop_command
        note = "Remotion Studio is already running."
    }
    if ($AsJson) {
        $already | ConvertTo-Json -Depth 5
        exit 0
    }
    Write-Output "STATUS=$($already.status)"
    Write-Output "URL=$($already.url)"
    Write-Output "PORT=$($already.port)"
    Write-Output "PID=$($already.pid)"
    Write-Output "STOP=$($already.stop_command)"
    Write-Output "NOTE=$($already.note)"
    exit 0
}

$resolvedRoot = (Resolve-Path $ProjectRoot).Path
$outLog = Join-Path $resolvedRoot "remotion-dev.out.log"
$errLog = Join-Path $resolvedRoot "remotion-dev.err.log"

if (Test-Path $outLog) { Remove-Item $outLog -Force }
if (Test-Path $errLog) { Remove-Item $errLog -Force }

$command = "Set-Location -LiteralPath '$resolvedRoot'; npm run dev"
$proc = Start-Process -FilePath "powershell.exe" `
    -ArgumentList "-NoProfile", "-Command", $command `
    -WorkingDirectory $resolvedRoot `
    -RedirectStandardOutput $outLog `
    -RedirectStandardError $errLog `
    -PassThru

$deadline = (Get-Date).AddSeconds($TimeoutSec)
$final = $null

while ((Get-Date) -lt $deadline) {
    Start-Sleep -Milliseconds 1000

    $freshJson = & $checkScript -PortMin $PortMin -PortMax $PortMax -AsJson
    $fresh = $freshJson | ConvertFrom-Json
    if ($fresh.status -eq "running") {
        $processId = $fresh.pid
        if (-not $processId) { $processId = $proc.Id }
        $final = [ordered]@{
            status = "started"
            url = $fresh.url
            port = $fresh.port
            pid = $processId
            out_log = $outLog
            err_log = $errLog
            stop_command = "Stop-Process -Id $processId"
            note = "Remotion Studio started successfully."
        }
        break
    }

    if ($proc.HasExited) {
        $final = [ordered]@{
            status = "failed"
            url = $null
            port = $null
            pid = $proc.Id
            out_log = $outLog
            err_log = $errLog
            stop_command = $null
            note = "Process exited before startup completed."
            out_log_tail = Read-TailSafe -Path $outLog -Tail 30
            err_log_tail = Read-TailSafe -Path $errLog -Tail 30
        }
        break
    }
}

if (-not $final) {
    $fallbackUrl = Parse-UrlFromLog -LogPath $outLog
    $final = [ordered]@{
        status = "failed"
        url = $fallbackUrl
        port = $null
        pid = $proc.Id
        out_log = $outLog
        err_log = $errLog
        stop_command = "Stop-Process -Id $($proc.Id)"
        note = "Startup timed out. Check log tails."
        out_log_tail = Read-TailSafe -Path $outLog -Tail 30
        err_log_tail = Read-TailSafe -Path $errLog -Tail 30
    }
}

if ($AsJson) {
    $final | ConvertTo-Json -Depth 6
    exit 0
}

Write-Output "STATUS=$($final.status)"
Write-Output "URL=$($final.url)"
Write-Output "PORT=$($final.port)"
Write-Output "PID=$($final.pid)"
Write-Output "OUT_LOG=$($final.out_log)"
Write-Output "ERR_LOG=$($final.err_log)"
Write-Output "STOP=$($final.stop_command)"
Write-Output "NOTE=$($final.note)"
if ($final.status -eq "failed") {
    Write-Output "OUT_LOG_TAIL<<EOF"
    Write-Output $final.out_log_tail
    Write-Output "EOF"
    Write-Output "ERR_LOG_TAIL<<EOF"
    Write-Output $final.err_log_tail
    Write-Output "EOF"
}
