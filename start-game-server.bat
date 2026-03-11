@echo off
cd /d "%~dp0roguelike"
echo Starting HTTP server on port 8000...
echo Game URL: http://127.0.0.1:8000/
python -m http.server 8000
pause
