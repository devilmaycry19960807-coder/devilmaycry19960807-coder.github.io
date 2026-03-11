@echo off
echo Starting local server for Roguelike game...
echo The game will open at: http://localhost:8080
echo Press Ctrl+C to stop the server
echo.
python -m http.server 8080
