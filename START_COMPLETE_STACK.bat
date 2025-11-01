@echo off
title ScrapSail - Complete Stack Startup
color 0E
echo ========================================
echo   ScrapSail - Full Stack Startup
echo ========================================
echo.
echo This will start:
echo   1. Backend Server (Spring Boot on port 8080)
echo   2. Frontend Server (React on port 3000)
echo.
echo IMPORTANT: Make sure MySQL is running first!
echo.
pause

echo.
echo ========================================
echo   Starting Backend Server...
echo ========================================
start "ScrapSail Backend" /D "%~dp0\..\scrapsail-backend" cmd /k START_BACKEND_NOW.bat

echo Waiting 15 seconds for backend to start...
timeout /t 15 /nobreak >nul

echo.
echo ========================================
echo   Starting Frontend Server...
echo ========================================
start "ScrapSail Frontend" cmd /k START_FRONTEND_NOW.bat

echo.
echo ========================================
echo   Both servers are starting!
echo ========================================
echo.
echo Backend:  http://localhost:8080
echo Frontend: http://localhost:3000
echo.
echo Backend test: http://localhost:8080/api/auth/test
echo.
echo Wait for:
echo   - Backend: "Started BackendApplication"
echo   - Frontend: Browser opens automatically
echo.
echo Both terminal windows will stay open.
echo Close them to stop the servers.
echo.
pause

