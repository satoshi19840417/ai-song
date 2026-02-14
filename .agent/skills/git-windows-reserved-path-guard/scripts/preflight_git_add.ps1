[CmdletBinding()]
param(
  [string]$RepoRoot = ".",
  [switch]$Fix,
  [switch]$AsJson
)

$ErrorActionPreference = "Stop"

function Get-RepositoryRoot {
  param([string]$StartPath)

  $resolved = Resolve-Path -LiteralPath $StartPath -ErrorAction Stop
  Push-Location -LiteralPath $resolved.Path
  try {
    $top = & git rev-parse --show-toplevel 2>$null
    if ($LASTEXITCODE -eq 0 -and -not [string]::IsNullOrWhiteSpace($top)) {
      return $top.Trim()
    }
    return $resolved.Path
  } finally {
    Pop-Location
  }
}

function Get-GitPathList {
  param(
    [string]$Top,
    [string[]]$GitArgs
  )

  Push-Location -LiteralPath $Top
  try {
    $lines = & git -c core.quotepath=false @GitArgs 2>$null
    if ($LASTEXITCODE -ne 0 -or $null -eq $lines) {
      return @()
    }
    return @($lines | Where-Object { -not [string]::IsNullOrWhiteSpace($_) })
  } finally {
    Pop-Location
  }
}

function Test-ReservedSegment {
  param(
    [string]$Segment,
    [string[]]$ReservedNames
  )

  if ([string]::IsNullOrWhiteSpace($Segment)) {
    return $false
  }

  $trimmed = $Segment.Trim().TrimEnd(".")
  if ([string]::IsNullOrWhiteSpace($trimmed)) {
    return $false
  }

  $base = ($trimmed -split "\.")[0]
  if ([string]::IsNullOrWhiteSpace($base)) {
    return $false
  }

  return ($ReservedNames -contains $base.ToUpperInvariant())
}

function Remove-PathWithReservedName {
  param([string]$FullPath)

  $longPath = if ($FullPath.StartsWith("\\?\")) { $FullPath } else { "\\?\$FullPath" }
  cmd /c "del /f /q ""$longPath"" >nul 2>&1" | Out-Null
  cmd /c "del /f /q $longPath >nul 2>&1" | Out-Null
  cmd /c "rmdir /s /q ""$longPath"" >nul 2>&1" | Out-Null
  cmd /c "rmdir /s /q $longPath >nul 2>&1" | Out-Null
}

$reservedNames = @("CON", "PRN", "AUX", "NUL")
1..9 | ForEach-Object {
  $reservedNames += "COM$_"
  $reservedNames += "LPT$_"
}

$repoTop = Get-RepositoryRoot -StartPath $RepoRoot
$tracked = Get-GitPathList -Top $repoTop -GitArgs @("ls-files")
$untracked = Get-GitPathList -Top $repoTop -GitArgs @("ls-files", "--others", "--exclude-standard")
$allGitPaths = @($tracked)
$allGitPaths += @($untracked)
$allGitPaths = @($allGitPaths | Sort-Object -Unique)

$items = @()

foreach ($relative in $allGitPaths) {
  $normalized = ($relative -replace "\\", "/").Trim()
  if ([string]::IsNullOrWhiteSpace($normalized)) {
    continue
  }

  $segments = $normalized -split "/"
  $matchedComponent = $null
  foreach ($segment in $segments) {
    if (Test-ReservedSegment -Segment $segment -ReservedNames $reservedNames) {
      $matchedComponent = $segment
      break
    }
  }

  if ($null -eq $matchedComponent) {
    continue
  }

  $windowsRelative = $normalized -replace "/", "\"
  $absolute = Join-Path -Path $repoTop -ChildPath $windowsRelative

  if ($Fix) {
    Remove-PathWithReservedName -FullPath $absolute
  }

  $items += [pscustomobject]@{
    relative_path = $normalized
    reserved_component = $matchedComponent
    absolute_path = $absolute
    exists_before = $true
    fixed = $false
    exists_after = $true
  }
}

$allGitPathsAfter = $allGitPaths
if ($Fix -and $items.Count -gt 0) {
  $trackedAfter = Get-GitPathList -Top $repoTop -GitArgs @("ls-files")
  $untrackedAfter = Get-GitPathList -Top $repoTop -GitArgs @("ls-files", "--others", "--exclude-standard")
  $allGitPathsAfter = @($trackedAfter)
  $allGitPathsAfter += @($untrackedAfter)
  $allGitPathsAfter = @($allGitPathsAfter | Sort-Object -Unique)
}

foreach ($item in $items) {
  $stillExists = ($allGitPathsAfter -contains $item.relative_path)
  $item.exists_after = $stillExists
  if ($Fix) {
    $item.fixed = -not $stillExists
  }
}

$remaining = @($items | Where-Object { $_.exists_after })
$resultStatus = "needs_fix"
if ($items.Count -eq 0) {
  $resultStatus = "ok"
} elseif ($Fix -and $remaining.Count -eq 0) {
  $resultStatus = "fixed"
} elseif ($Fix) {
  $resultStatus = "partially_fixed"
}

$resultItems = $items
$result = New-Object PSObject
$result | Add-Member -MemberType NoteProperty -Name "status" -Value $resultStatus
$result | Add-Member -MemberType NoteProperty -Name "repo_root" -Value $repoTop
$result | Add-Member -MemberType NoteProperty -Name "fix_requested" -Value ([bool]$Fix)
$result | Add-Member -MemberType NoteProperty -Name "detected_count" -Value ($items.Count)
$result | Add-Member -MemberType NoteProperty -Name "remaining_count" -Value ($remaining.Count)
$result | Add-Member -MemberType NoteProperty -Name "items" -Value $resultItems
$result | Add-Member -MemberType NoteProperty -Name "guidance" -Value @(
  "Use > `$null or | Out-Null in PowerShell, not > NUL.",
  "Run this preflight before git add when working on Windows."
)

if ($AsJson) {
  $result | ConvertTo-Json -Depth 6
} else {
  $result
}

if ($resultStatus -eq "ok" -or $resultStatus -eq "fixed") {
  exit 0
}
if ($resultStatus -eq "needs_fix") {
  exit 2
}
exit 3
