param(
    [int]$PortMin = 3000,
    [int]$PortMax = 3020,
    [int]$RequestTimeoutSec = 2,
    [switch]$AsJson
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

function Get-ListeningPidForPort {
    param([int]$Port)

    $conn = Get-NetTCPConnection -State Listen -LocalPort $Port -ErrorAction SilentlyContinue | Select-Object -First 1
    if ($conn) {
        return [int]$conn.OwningProcess
    }

    $line = netstat -ano | Select-String -Pattern "LISTENING\s+(\d+)$" | Where-Object { $_.Line -match "[:\.]$Port\s" } | Select-Object -First 1
    if ($line -and $line.Matches.Count -gt 0) {
        return [int]$line.Matches[0].Groups[1].Value
    }

    return $null
}

function Test-RemotionPage {
    param(
        [int]$Port,
        [int]$TimeoutSec
    )

    $url = "http://localhost:$Port"
    try {
        $res = Invoke-WebRequest -UseBasicParsing -Uri $url -TimeoutSec $TimeoutSec
        if ($res.StatusCode -eq 200 -and $res.Content -match "(?i)remotion") {
            return $url
        }
    } catch {
        return $null
    }

    return $null
}

$result = [ordered]@{
    status = "not_running"
    url = $null
    port = $null
    pid = $null
    stop_command = $null
    checked_range = "$PortMin-$PortMax"
}

for ($port = $PortMin; $port -le $PortMax; $port++) {
    $url = Test-RemotionPage -Port $port -TimeoutSec $RequestTimeoutSec
    if (-not $url) {
        continue
    }

    $processId = Get-ListeningPidForPort -Port $port
    $result.status = "running"
    $result.url = $url
    $result.port = $port
    if ($processId) {
        $result.pid = $processId
        $result.stop_command = "Stop-Process -Id $processId"
    }
    break
}

if ($AsJson) {
    $result | ConvertTo-Json -Depth 5
    exit 0
}

Write-Output "STATUS=$($result.status)"
Write-Output "URL=$($result.url)"
Write-Output "PORT=$($result.port)"
Write-Output "PID=$($result.pid)"
Write-Output "STOP=$($result.stop_command)"
Write-Output "CHECKED_RANGE=$($result.checked_range)"
