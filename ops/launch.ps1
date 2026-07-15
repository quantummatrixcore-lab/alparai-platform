#!/usr/bin/env pwsh
param(
    [switch]$Attach,
    [switch]$Kill,
    [string]$Session = "alparai"
)

$TMUX = "C:\Users\ercum\AppData\Local\Microsoft\WinGet\Packages\arndawg.tmux-windows_Microsoft.Winget.Source_8wekyb3d8bbwe\tmux.exe"
$PROJECT = "D:\Alparai"

$TMUX_CONF = "D:\Alparai\ops\.tmux.conf"
function Invoke-Tmux { & $TMUX -f $TMUX_CONF @args }

Write-Host ""
Write-Host "  ╔══════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "  ║     ALPAR AI — OTOMASYON ORKESTRATÖR         ║" -ForegroundColor Cyan
Write-Host "  ║     tmux 3.6a  .  3 Window  .  8 Pane       ║" -ForegroundColor Cyan
Write-Host "  ╚══════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

if ($Kill) {
    Write-Host "  Oturum kapatiliyor: $Session" -ForegroundColor Yellow
    Invoke-Tmux kill-session -t $Session 2>$null
    Write-Host "  Kapatildi." -ForegroundColor Green
    exit 0
}

if ($Attach) {
    $sessions = Invoke-Tmux ls 2>&1
    if ($sessions -match $Session) {
        Write-Host "  Mevcut oturuma baglaniliyor: $Session" -ForegroundColor Green
        Invoke-Tmux attach-session -t $Session
    } else {
        Write-Host "  Oturum bulunamadi: $Session" -ForegroundColor Yellow
    }
    exit 0
}

$existing = Invoke-Tmux ls 2>&1
if ($existing -match $Session) {
    Write-Host "  '$Session' oturumu zaten calisiyor." -ForegroundColor Yellow
    $choice = Read-Host "  [R]eplace / [A]ttach / [Q]uit"
    switch ($choice.ToUpper()) {
        "R" { Invoke-Tmux kill-session -t $Session 2>$null; Start-Sleep -Milliseconds 400 }
        "A" { Invoke-Tmux attach-session -t $Session; exit 0 }
        default { exit 0 }
    }
}

# ── Window 0: MAIN ──────────────────────────────────────────────────────────
Write-Host '  Window 0: MAIN (dev + test + opencode + git)' -ForegroundColor Cyan

Invoke-Tmux new-session -d -s $Session -n "MAIN" -c $PROJECT
Start-Sleep -Milliseconds 200

# Pane 0 (sol ust): Dev Server
Invoke-Tmux send-keys -t "${Session}:MAIN.0" "pnpm dev" Enter

# Pane 1 (sag ust): Vitest watch
Invoke-Tmux split-window -t "${Session}:MAIN.0" -h -c $PROJECT
Start-Sleep -Milliseconds 100
Invoke-Tmux send-keys -t "${Session}:MAIN.1" "pnpm test --watch 2>&1" Enter

# Pane 2 (sol alt): OpenCode AI
Invoke-Tmux split-window -t "${Session}:MAIN.0" -v -c $PROJECT
Start-Sleep -Milliseconds 100
Invoke-Tmux send-keys -t "${Session}:MAIN.2" "opencode" Enter

# Pane 3 (sag alt): Git log watch
Invoke-Tmux split-window -t "${Session}:MAIN.1" -v -c $PROJECT
Start-Sleep -Milliseconds 100
Invoke-Tmux send-keys -t "${Session}:MAIN.3" 'while ($true) { Clear; git log --oneline -12 --color; Start-Sleep 15 }' Enter

Invoke-Tmux select-layout -t "${Session}:MAIN" tiled

# ── Window 1: OPS ───────────────────────────────────────────────────────────
Write-Host '  Window 1: OPS (lint + typecheck + shell)' -ForegroundColor Cyan

Invoke-Tmux new-window -t $Session -n "OPS" -c $PROJECT
Start-Sleep -Milliseconds 200

# Pane 0: Lint watch (30s interval)
Invoke-Tmux send-keys -t "${Session}:OPS.0" 'while ($true) { pnpm lint 2>&1 | Select-Object -Last 8; Start-Sleep 30 }' Enter

# Pane 1: TypeCheck watch (60s interval)
Invoke-Tmux split-window -t "${Session}:OPS.0" -h -c $PROJECT
Start-Sleep -Milliseconds 100
Invoke-Tmux send-keys -t "${Session}:OPS.1" 'while ($true) { pnpm typecheck 2>&1 | Select-Object -Last 10; Start-Sleep 60 }' Enter

# Pane 2: Free shell
Invoke-Tmux split-window -t "${Session}:OPS.0" -v -c $PROJECT
Start-Sleep -Milliseconds 100
Invoke-Tmux send-keys -t "${Session}:OPS.2" "Write-Host 'FREE SHELL - D:\Alparai' -ForegroundColor Yellow" Enter

Invoke-Tmux select-layout -t "${Session}:OPS" main-horizontal

# ── Window 2: LOGS ──────────────────────────────────────────────────────────
Write-Host '  Window 2: LOGS (vercel + i18n watch)' -ForegroundColor Cyan

Invoke-Tmux new-window -t $Session -n "LOGS" -c $PROJECT
Start-Sleep -Milliseconds 200

# Pane 0: Vercel log stream
Invoke-Tmux send-keys -t "${Session}:LOGS.0" "npx vercel logs --follow 2>&1" Enter

# Pane 1: i18n check watch
Invoke-Tmux split-window -t "${Session}:LOGS.0" -h -c $PROJECT
Start-Sleep -Milliseconds 100
Invoke-Tmux send-keys -t "${Session}:LOGS.1" 'while ($true) { pnpm i18n:check; Start-Sleep 30 }' Enter

Invoke-Tmux select-layout -t "${Session}:LOGS" even-horizontal

# ── Focus ──────────────────────────────────────────────────────────────────
Invoke-Tmux select-window -t "${Session}:MAIN"
Invoke-Tmux select-pane   -t "${Session}:MAIN.0"

Write-Host ""
Write-Host "  3 window x 8 pane hazir!" -ForegroundColor Green
Write-Host ""
Write-Host "  Navigasyon (tmux prefix = Ctrl+B):" -ForegroundColor White
Write-Host "    Ctrl+B 0   Window 0: MAIN  (dev / test / opencode / git)" -ForegroundColor Gray
Write-Host "    Ctrl+B 1   Window 1: OPS   (lint / typecheck / shell)" -ForegroundColor Gray
Write-Host "    Ctrl+B 2   Window 2: LOGS  (vercel / i18n)" -ForegroundColor Gray
Write-Host "    Ctrl+B yön Paneler arasi gecis" -ForegroundColor Gray
Write-Host "    Ctrl+B d   Detach  (oturum arka planda devam eder)" -ForegroundColor Gray
Write-Host ""
Write-Host "  Yeniden baglanmak:  .\ops\launch.ps1 -Attach" -ForegroundColor Cyan
Write-Host "  Kapatmak:           .\ops\launch.ps1 -Kill" -ForegroundColor Cyan
Write-Host ""

# Attach only when running in an interactive terminal
if ([Environment]::UserInteractive -and $Host.Name -ne 'Default Host') {
    Invoke-Tmux attach-session -t $Session
} else {
    Write-Host ""
    Write-Host "  Oturum arka planda calisiyor. Baglanmak icin terminalde calistirin:" -ForegroundColor Yellow
    Write-Host "  .\ops\launch.ps1 -Attach" -ForegroundColor Cyan
}
