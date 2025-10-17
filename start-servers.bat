@echo off
echo Starting AgroSetu Pest Detection Servers...
echo.

echo Starting Backend Server...
start "AgroSetu Backend" cmd /k "cd backend && python start.py"

echo Waiting for backend to start...
timeout /t 5 /nobreak >nul

echo Starting Frontend Server...
start "AgroSetu Frontend" cmd /k "npm run dev"

echo.
echo ========================================
echo Servers Started!
echo ========================================
echo.
echo Backend: http://localhost:5000
echo Frontend: http://localhost:8080
echo.
echo Both servers are now running in separate windows.
echo You can close this window.
echo.
pause
