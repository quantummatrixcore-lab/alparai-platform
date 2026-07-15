param(
    [Parameter(Mandatory)]
    [string]$TaskFile,
    [string]$BridgeDir = "D:\Alparai\.bridge"
)

$ErrorActionPreference = "Stop"
$ResultsDir = Join-Path $BridgeDir "results"

# Read task
$task = Get-Content $TaskFile -Raw | ConvertFrom-Json

Write-Host "[BRIDGE] Processing task $($task.id) - $($task.title)" -ForegroundColor Cyan

# Build prompt for Claude
$prompt = @"
[CLAUDE BRIDGE TASK: $($task.id)]
Type: $($task.type)
Priority: $($task.priority)

## Instructions
$($task.instructions)

## Context Files
$($task.context.files -join "`n")

## Expected Output
$($task.expectedOutput)

Write the result to $ResultsDir\$($task.id).json
"@

# Write active prompt
$prompt | Out-File (Join-Path $BridgeDir "active.md") -Encoding utf8

# Invoke Claude Code
Write-Host "[BRIDGE] Invoking Claude Code..." -ForegroundColor Yellow
$output = claude -p $prompt --output-format json --print 2>&1

# Write result
$result = @{
    taskId = $task.id
    status = "done"
    output = $output
    completedAt = (Get-Date -Format "o")
} | ConvertTo-Json

$resultPath = Join-Path $ResultsDir "$($task.id).json"
$result | Out-File $resultPath -Encoding utf8

Write-Host "[BRIDGE] Task $($task.id) completed" -ForegroundColor Green
