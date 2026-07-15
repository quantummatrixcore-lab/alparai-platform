# Bridge Watcher - Monitors .bridge/tasks for new Claude Code tasks
# Run in a background terminal: pwsh -NoLogo .\scripts\bridge\watch-bridge.ps1

$BridgeDir = "D:\Alparai\.bridge"
$TasksDir = Join-Path $BridgeDir "tasks"
$ResultsDir = Join-Path $BridgeDir "results"

Write-Host "[BRIDGE WATCHER] Monitoring $TasksDir for new tasks..." -ForegroundColor Cyan

$watcher = New-Object System.IO.FileSystemWatcher
$watcher.Path = $TasksDir
$watcher.Filter = "*.json"
$watcher.EnableRaisingEvents = $true

$action = {
    $path = $Event.SourceEventArgs.FullPath
    $name = $Event.SourceEventArgs.Name
    $changeType = $Event.SourceEventArgs.ChangeType

    if ($changeType -eq "Created") {
        Write-Host "[BRIDGE WATCHER] New task detected: $name" -ForegroundColor Yellow
        Start-Sleep -Seconds 2  # Wait for file to be fully written

        try {
            $result = & "D:\Alparai\scripts\bridge\dispatch-claude.ps1" -TaskFile $path
            Write-Host "[BRIDGE WATCHER] Task $name completed" -ForegroundColor Green
        } catch {
            Write-Host "[BRIDGE WATCHER] Error processing $name : $_" -ForegroundColor Red
        }
    }
}

Register-ObjectEvent $watcher "Created" -Action $action | Out-Null

Write-Host "[BRIDGE WATCHER] Ready. Press Ctrl+C to stop." -ForegroundColor Green

# Keep running
while ($true) {
    Start-Sleep -Seconds 1
}
