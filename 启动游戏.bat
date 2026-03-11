@echo off
chcp 65001 >nul
cd /d "%~dp0roguelike"
echo.
echo ========================================
echo   Roguelike 游戏服务器启动中...
echo ========================================
echo.
echo 游戏地址:
echo   http://127.0.0.1:8000/
echo   http://localhost:8000/
echo.

:: 启动服务器（后台）
start /min python -m http.server 8000

:: 等待服务器启动
timeout /t 2 /nobreak >nul

:: 自动打开浏览器
start http://127.0.0.1:8000/

echo ========================================
echo   游戏已启动！浏览器正在打开...
echo   关闭此窗口不会停止游戏
echo ========================================
echo.
pause
:: 关闭此窗口时，也关闭Python服务器
taskkill /f /im python.exe /fi "windowtitle eq http.server*" 2>nul

