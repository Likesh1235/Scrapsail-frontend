@echo off
title ScrapSail Frontend Server
color 0B
echo ========================================
echo   ScrapSail Frontend Server Startup
echo ========================================
echo.

echo Checking prerequisites...
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
) else (
    echo [OK] Node.js is installed
    node --version
)

echo.
echo Checking if node_modules exists...
if not exist "node_modules\" (
    echo [INFO] Installing dependencies...
    call npm install
    if %errorlevel% neq 0 (
        echo [ERROR] Failed to install dependencies
        pause
        exit /b 1
    )
) else (
    echo [OK] Dependencies are installed
)

echo.
echo ========================================
echo   Starting Frontend Server...
echo ========================================
echo.
echo Frontend will open at: http://localhost:3000
echo (or next available port)
echo.

cd /d "%~dp0"
call npm start

if %errorlevel% neq 0 (
    echo.
    echo [ERROR] Frontend failed to start!
    echo Check the error messages above.
    pause
)

