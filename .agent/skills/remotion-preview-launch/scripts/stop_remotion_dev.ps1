param(
    [int]$ProcessId = 0,
    [int]$PortMin = 3000,
    [int]$PortMax = 3020,
    [switch]$AsJson
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$scriptRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$checkScript = Join-Path $scriptRoot "check_remotion_dev.ps1"

function Emit-Result {
    param([hashtable]$Result)

    if ($AsJson) {
        $Result | ConvertTo-Json -Depth 5
    } else {
        Write-Output "STATUS=$($Result.status)"
        Write-Output "PID=$($Result.pid)"
        Write-Output "NOTE=$($Result.note)"
    }
}

if ($ProcessId -gt 0) {
    $target = Get-Process -Id $ProcessId -ErrorAction SilentlyContinue
    if (-not $target) {
        Emit-Result @{
            status = "not_running"
            pid = $ProcessId
            note = "PID not found."
        }
        exit 0
    }

    Stop-Process -Id $ProcessId -Force
    Emit-Result @{
        status = "stopped"
        pid = $ProcessId
        note = "Process stopped."
    }
    exit 0
}

if (-not (Test-Path $checkScript)) {
    throw "check_remotion_dev.ps1 not found: $checkScript"
}

$runningJson = & $checkScript -PortMin $PortMin -PortMax $PortMax -AsJson
$running = $runningJson | ConvertFrom-Json
if ($running.status -ne "running" -or -not $running.pid) {
    Emit-Result @{
        status = "not_running"
        pid = $null
        note = "No running Remotion Studio found in range $PortMin-$PortMax."
    }
    exit 0
}

Stop-Process -Id ([int]$running.pid) -Force
Emit-Result @{
    status = "stopped"
    pid = [int]$running.pid
    note = "Stopped running Remotion Studio."
}
