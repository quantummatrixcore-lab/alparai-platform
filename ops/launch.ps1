$dir = "D:\Alparai"

Write-Host ""
Write-Host "  ALPAR AI — Dev Ortami" -ForegroundColor Cyan
Write-Host "  pnpm dev:all baslatiyor..." -ForegroundColor Gray
Write-Host ""

Set-Location $dir
pnpm dev:all
