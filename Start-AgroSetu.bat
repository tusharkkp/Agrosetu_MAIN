@echo off
echo ========================================
echo AgroSetu Complete Project Startup
echo ========================================
echo.

echo Checking Python installation...
python --version >nul 2>&1
if errorlevel 1 (
    echo Error: Python is not installed or not in PATH
    echo Please install Python 3.8 or higher
    pause
    exit /b 1
)
echo Python found!

echo.
echo Checking Node.js installation...
node --version >nul 2>&1
if errorlevel 1 (
    echo Error: Node.js is not installed or not in PATH
    echo Please install Node.js 16 or higher
    pause
    exit /b 1
)
echo Node.js found!

echo.
echo Checking npm installation...
npm --version >nul 2>&1
if errorlevel 1 (
    echo Error: npm is not installed or not in PATH
    pause
    exit /b 1
)
echo npm found!

echo.
echo ========================================
echo Installing Dependencies
echo ========================================
echo.

echo Installing Python dependencies...
cd backend
pip install -r requirements.txt --quiet
if errorlevel 1 (
    echo Warning: Some Python dependencies failed to install. Continuing...
) else (
    echo Python dependencies installed successfully!
)
cd ..

echo.
echo Installing Node.js dependencies...
if not exist "node_modules" (
    npm install --silent
    if errorlevel 1 (
        echo Warning: Some Node.js dependencies failed to install. Continuing...
    ) else (
        echo Node.js dependencies installed successfully!
    )
) else (
    echo Node.js dependencies already installed!
)

echo.
echo ========================================
echo Starting Servers
echo ========================================
echo.

echo Starting Backend Server...
start "AgroSetu Backend" cmd /k "cd /d %~dp0backend && python start.py"

echo Starting Frontend Server...
start "AgroSetu Frontend" cmd /k "cd /d %~dp0 && npm run dev"

echo.
echo ========================================
echo AgroSetu Startup Complete!
echo ========================================
echo.
echo 🌱 AgroSetu is now running with all features:
echo.
echo 📊 Available Features:
echo    • AI-Powered Pest Detection
echo    • Real-time Market Prices (Data.gov.in)
echo    • Weather Alerts and Forecasts
echo    • Soil Guidance and Analysis
echo    • Voice Chatbot Support
echo    • Multilingual (English/Punjabi)
echo.
echo 🌐 Access URLs:
echo    Frontend: http://localhost:8080
echo    Backend API: http://localhost:5000
echo    Health Check: http://localhost:5000/api/health
echo.
echo 📱 Usage Instructions:
echo    1. Open your browser and go to http://localhost:8080
echo    2. Navigate through different features using the menu
echo    3. Test Pest Detection with crop images
echo    4. Check Market Prices for commodity data
echo    5. Switch languages using the language toggle
echo.
echo 🔧 Management:
echo    • Backend and Frontend run in separate windows
echo    • Close those windows to stop the servers
echo    • Check console output for any errors
echo    • Edit backend/config.py for API key changes
echo.
echo Opening browser...
start http://localhost:8080

echo.
echo ✨ Happy Farming with AgroSetu! ✨
echo.
pause