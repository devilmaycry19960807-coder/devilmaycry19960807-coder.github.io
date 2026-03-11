# PowerShell server startup script
Write-Host "Starting local server for Roguelike game..." -ForegroundColor Green
Write-Host "The game will open at: http://localhost:8080" -ForegroundColor Cyan
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow
Write-Host ""

# Start Python HTTP server
python -m http.server 8080
