@echo off
title ScrapSail - Full Stack Startup
echo ========================================
echo ScrapSail Full Stack Startup
echo ========================================
echo.
echo This will start both backend and frontend servers.
echo.
echo IMPORTANT: Make sure MySQL is running first!
echo.
pause
echo.

echo Starting Backend Server (Terminal 1)...
start "ScrapSail Backend" cmd /k "cd /d c:\Users\likes\scrapsail-backend && mvn spring-boot:run"

timeout /t 10 /nobreak >nul

echo.
echo Starting Frontend Server (Terminal 2)...
start "ScrapSail Frontend" cmd /k "cd /d c:\Users\likes\scrapsail-frontend-new && npm start"

echo.
echo ========================================
echo Both servers are starting...
echo ========================================
echo.
echo Backend will be available at: http://localhost:8080
echo Frontend will be available at: http://localhost:3000
echo.
echo Wait for:
echo   - Backend: "Started BackendApplication"
echo   - Frontend: Browser opens automatically
echo.
pause

