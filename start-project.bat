@echo off
echo Starting AgroSetu Pest Detection System...
echo.

echo ========================================
echo AgroSetu Pest Detection Setup
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
echo Installing backend dependencies...
cd backend
pip install -r requirements.txt
if errorlevel 1 (
    echo Error: Failed to install backend dependencies
    pause
    exit /b 1
)

echo Backend dependencies installed successfully!

echo.
echo ========================================
echo IMPORTANT: API Keys Setup
echo ========================================
echo.
echo To set your API keys permanently:
echo.
echo 1. Edit the file: backend\config.py
echo 2. Replace 'your_google_api_key_here' with your actual Google API key
echo 3. Replace 'your_openweather_api_key_here' with your actual OpenWeather API key
echo 4. Save the file
echo.
echo Get your API keys:
echo - Google API Key: https://makersuite.google.com/app/apikey
echo - OpenWeather API Key: https://openweathermap.org/api
echo.
echo Once configured, you can start the servers with:
echo - Backend: cd backend && python start.py
echo - Frontend: npm run dev
echo.
echo ========================================
echo Frontend Setup
echo ========================================
echo.

cd ..
echo Installing frontend dependencies...
npm install
if errorlevel 1 (
    echo Error: Failed to install frontend dependencies
    pause
    exit /b 1
)

echo Frontend dependencies installed successfully!

echo.
echo ========================================
echo Setup Complete!
echo ========================================
echo.
echo To start the system:
echo.
echo 1. First, set your API keys (see instructions above)
echo 2. Start the backend: cd backend && python start.py
echo 3. In a new terminal, start the frontend: npm run dev
echo.
echo The frontend will be available at: http://localhost:8080
echo The backend will be available at: http://localhost:5000
echo.
echo Press any key to exit...
pause >nul
