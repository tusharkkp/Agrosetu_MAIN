#!/bin/bash

echo "Starting AgroSetu Pest Detection System..."
echo

echo "========================================"
echo "AgroSetu Pest Detection Setup"
echo "========================================"
echo

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "Error: Python 3 is not installed"
    echo "Please install Python 3.8 or higher"
    exit 1
fi

echo "Python found: $(python3 --version)"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "Error: Node.js is not installed"
    echo "Please install Node.js"
    exit 1
fi

echo "Node.js found: $(node --version)"
echo

# Install backend dependencies
echo "Installing backend dependencies..."
cd backend
pip3 install -r requirements.txt
if [ $? -ne 0 ]; then
    echo "Error: Failed to install backend dependencies"
    exit 1
fi

echo "Backend dependencies installed successfully!"
echo

echo "========================================"
echo "IMPORTANT: API Keys Setup"
echo "========================================"
echo
echo "Before starting the backend, you need to set your API keys:"
echo
echo "1. Google Generative AI API Key:"
echo "   - Visit: https://makersuite.google.com/app/apikey"
echo "   - Create a new API key"
echo "   - Set it as: export GOOGLE_API_KEY='your_key_here'"
echo
echo "2. OpenWeather API Key (optional):"
echo "   - Visit: https://openweathermap.org/api"
echo "   - Sign up for free account"
echo "   - Set it as: export OPENWEATHER_API_KEY='your_key_here'"
echo
echo "Example:"
echo "export GOOGLE_API_KEY='AIzaSyC...'"
echo "export OPENWEATHER_API_KEY='abc123...'"
echo
echo "After setting the keys, run:"
echo "python3 start.py"
echo

cd ..

echo "========================================"
echo "Frontend Setup"
echo "========================================"
echo

echo "Installing frontend dependencies..."
npm install
if [ $? -ne 0 ]; then
    echo "Error: Failed to install frontend dependencies"
    exit 1
fi

echo "Frontend dependencies installed successfully!"
echo

echo "========================================"
echo "Setup Complete!"
echo "========================================"
echo
echo "To start the system:"
echo
echo "1. First, set your API keys (see instructions above)"
echo "2. Start the backend: cd backend && python3 start.py"
echo "3. In a new terminal, start the frontend: npm run dev"
echo
echo "The frontend will be available at: http://localhost:8080"
echo "The backend will be available at: http://localhost:5000"
echo

# Make the script executable
chmod +x "$0"
