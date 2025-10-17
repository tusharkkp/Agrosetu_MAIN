@echo off
echo Setting up API keys for AgroSetu Pest Detection...
echo.

cd backend
python setup-api-keys.py

echo.
echo Setup complete! You can now start the servers.
echo.
echo To start the application:
echo 1. Backend: cd backend && python start.py
echo 2. Frontend: npm run dev
echo.
pause
