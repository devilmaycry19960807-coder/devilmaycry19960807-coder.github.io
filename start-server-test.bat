@echo off
cd /d "%~dp0"
echo ====================================
echo 无尽地下城 - 游戏启动器
echo ====================================
echo.

REM 检查 Python
python --version >nul 2>&1
if %errorlevel% == 0 (
    echo 正在使用 Python 启动本地服务器...
    echo 游戏地址: http://localhost:8000
    echo.
    echo 按 Ctrl+C 停止服务器
    echo ====================================
    echo.
    start http://localhost:8000/index.html
    python -m http.server 8000
) else (
    echo 未找到 Python，尝试使用 Node.js...
    node --version >nul 2>&1
    if %errorlevel% == 0 (
        echo 正在使用 Node.js 启动本地服务器...
        echo 游戏地址: http://localhost:8000
        echo.
        echo 按 Ctrl+C 停止服务器
        echo ====================================
        echo.
        npx -y http-server -p 8000 -c-1
    ) else (
        echo ====================================
        echo 未找到 Python 或 Node.js
        echo ====================================
        echo.
        echo 请直接用浏览器打开 index.html
        echo 文件位置: %CD%\index.html
        echo.
        pause
        explorer "%CD%\index.html"
    )
)
