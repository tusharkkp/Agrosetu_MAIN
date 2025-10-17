@echo off
echo Starting AgroSetu with Market Prices Integration...
echo.

echo ========================================
echo AgroSetu Market Prices System
echo ========================================
echo.

echo Checking backend configuration...
cd backend
python -c "
from config import load_config, check_api_keys
config = load_config()
print('API Keys Status:')
print(f'  Google API: {\"✅\" if config[\"GOOGLE_API_KEY\"] != \"your_google_api_key_here\" else \"❌\"}')
print(f'  OpenWeather API: {\"✅\" if config[\"OPENWEATHER_API_KEY\"] != \"your_openweather_api_key_here\" else \"❌\"}')
print(f'  Data.gov.in API: {\"✅\" if config[\"DATAGOV_API_KEY\"] != \"your_datagov_api_key_here\" else \"❌\"}')
"

echo.
echo Starting backend server...
start cmd /k "cd backend && python start.py"

echo.
echo Waiting for backend to start...
timeout /t 5 /nobreak > NUL

echo.
echo Starting frontend server...
start cmd /k "npm run dev"

echo.
echo ========================================
echo Servers Started!
echo ========================================
echo.
echo Backend: http://localhost:5000
echo Frontend: http://localhost:8080
echo.
echo Market Prices Features:
echo - Real-time commodity prices from Data.gov.in
echo - Price trends and market analysis
echo - Location-based market search
echo - Multilingual support (English/Punjabi)
echo.
echo Both servers are now running in separate windows.
echo You can close this window.

pause
