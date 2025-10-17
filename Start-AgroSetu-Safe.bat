@echo off
setlocal

echo ========================================
echo AgroSetu Safe Startup (Handles Execution Policy)
echo ========================================
echo.

REM Check if PowerShell is available
powershell -Command "Get-Host" >nul 2>&1
if %errorlevel% neq 0 (
    echo Error: PowerShell is not available on this system.
    echo Please install PowerShell or use the manual startup method.
    pause
    exit /b 1
)

echo Starting AgroSetu with safe PowerShell script...
echo This script handles execution policy issues automatically.
echo.

REM Run the safe PowerShell script
powershell -ExecutionPolicy Bypass -File "%~dp0Start-AgroSetu-Safe.ps1" %*

if %errorlevel% neq 0 (
    echo.
    echo Error: PowerShell script failed to execute properly.
    echo Please check the error messages above.
    echo.
    echo If you continue to have issues, try:
    echo 1. Right-click and "Run as Administrator"
    echo 2. Or manually set execution policy:
    echo    powershell -Command "Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser"
    pause
    exit /b %errorlevel%
)

endlocal
