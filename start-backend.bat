@echo off
echo Starting AgroSetu Backend with Real API Keys...
echo.

cd backend
echo Current directory: %CD%
echo.

echo Starting backend server...
python start.py

echo.
echo Backend stopped.
pause
