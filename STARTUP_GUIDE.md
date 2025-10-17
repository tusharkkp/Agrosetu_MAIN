# AgroSetu Complete Startup Guide

## 🚀 Quick Start

### Option 1: PowerShell Script (Recommended)
```powershell
# Run the complete startup script
.\Start-AgroSetu.ps1

# Or with browser auto-open
.\Start-AgroSetu.ps1 -OpenBrowser
```

### Option 2: Batch File Wrapper
```cmd
# Double-click or run
Start-AgroSetu.bat
```

### Option 3: Manual Startup
```bash
# Terminal 1 - Backend
cd backend
python start.py

# Terminal 2 - Frontend
npm run dev
```

## 📋 Prerequisites

### Required Software
- **Python 3.8+** - [Download](https://python.org)
- **Node.js 16+** - [Download](https://nodejs.org)
- **npm** - Comes with Node.js
- **PowerShell 5.1+** - Usually pre-installed on Windows 10/11

### API Keys (Optional but Recommended)
- **Google Generative AI** - For pest detection
- **OpenWeather** - For weather data
- **Data.gov.in** - For market prices (already configured)

## 🛠️ Features Included

### ✅ Fully Functional Features
- **AI-Powered Pest Detection** - Upload crop images for AI analysis
- **Real-time Market Prices** - Live commodity prices from Data.gov.in
- **Weather Alerts** - Current weather and forecasts
- **Soil Guidance** - Soil analysis and recommendations
- **Voice Chatbot** - Interactive voice assistance
- **Multilingual Support** - English and Punjabi

### 🔧 Technical Stack
- **Frontend**: React + TypeScript + Vite
- **Backend**: Flask + Python
- **APIs**: Google AI, OpenWeather, Data.gov.in
- **UI**: Shadcn/ui + Tailwind CSS
- **i18n**: react-i18next

## 🎯 Usage Instructions

### 1. Start the Application
```powershell
# Navigate to project directory
cd agrosetu-main/sprout-smart-advise-main

# Run startup script
.\Start-AgroSetu.ps1
```

### 2. Access the Application
- **Frontend**: http://localhost:8080
- **Backend API**: http://localhost:5000
- **Health Check**: http://localhost:5000/api/health

### 3. Test Features

#### Pest Detection
1. Go to "Pest Detection" in the menu
2. Upload a crop image or take a photo
3. Fill in crop details and location
4. Get AI-powered analysis and recommendations

#### Market Prices
1. Go to "Market Prices" in the menu
2. Search for commodities (Wheat, Rice, Tomato, etc.)
3. Filter by state, district, or market
4. View real-time prices and trends

#### Weather Alerts
1. Go to "Weather Alerts" in the menu
2. Enter your location
3. View current weather and forecasts

#### Language Switch
1. Use the language toggle in the top navigation
2. Switch between English and Punjabi
3. All content will be translated instantly

## 🔧 Troubleshooting

### Common Issues

#### PowerShell Execution Policy
```powershell
# If you get execution policy error
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

#### Port Already in Use
```bash
# Check what's using the ports
netstat -ano | findstr :5000
netstat -ano | findstr :8080

# Kill processes if needed
taskkill /PID <PID_NUMBER> /F
```

#### Python/Node Not Found
```bash
# Check installations
python --version
node --version
npm --version

# If not found, install from official websites
```

#### API Key Issues
```python
# Edit backend/config.py
GOOGLE_API_KEY = "your_actual_key_here"
OPENWEATHER_API_KEY = "your_actual_key_here"
DATAGOV_API_KEY = "579b464db66ec23bdd00000177085098ca8143d879f44c68ec4f7773"
```

### Debug Mode

#### Backend Debug
```bash
cd backend
python start.py
# Check console for error messages
```

#### Frontend Debug
```bash
npm run dev
# Check browser console for errors
```

#### API Testing
```bash
# Test backend health
curl http://localhost:5000/api/health

# Test market prices
curl "http://localhost:5000/api/market-prices?commodity=Wheat&state=Punjab"
```

## 📊 Project Structure

```
agrosetu-main/sprout-smart-advise-main/
├── Start-AgroSetu.ps1          # Main PowerShell startup script
├── Start-AgroSetu.bat          # Batch file wrapper
├── package.json                # Frontend dependencies
├── vite.config.ts              # Vite configuration
├── src/                        # Frontend source code
│   ├── pages/                  # Page components
│   │   ├── PestDetection.tsx   # AI pest detection
│   │   ├── MarketPrices.tsx    # Market prices
│   │   └── ...
│   ├── lib/                    # API clients
│   │   ├── pestDetectionApi.ts
│   │   └── marketPricesApi.ts
│   └── locales/                # Translations
│       ├── en.json
│       └── pa.json
├── backend/                    # Backend source code
│   ├── app.py                  # Flask application
│   ├── config.py               # API keys configuration
│   ├── start.py                # Backend startup script
│   └── requirements.txt        # Python dependencies
└── README.md                   # Project documentation
```

## 🚀 Advanced Usage

### Custom Parameters
```powershell
# Skip dependency installation
.\Start-AgroSetu.ps1 -SkipDependencies

# Skip backend startup
.\Start-AgroSetu.ps1 -SkipBackend

# Skip frontend startup
.\Start-AgroSetu.ps1 -SkipFrontend

# Auto-open browser
.\Start-AgroSetu.ps1 -OpenBrowser
```

### Development Mode
```bash
# Backend with debug
cd backend
python -c "import app; app.app.run(debug=True, port=5000)"

# Frontend with dev server
npm run dev
```

### Production Build
```bash
# Build frontend
npm run build

# Serve built files
npm run preview
```

## 📞 Support

### Getting Help
1. Check this startup guide first
2. Review console output for error messages
3. Check the main README.md for project details
4. Verify all prerequisites are installed

### Common Solutions
- **Restart the script** if servers don't start properly
- **Check firewall settings** if ports are blocked
- **Update dependencies** if there are version conflicts
- **Clear browser cache** if frontend doesn't load

## 🎉 Success Indicators

When everything is working correctly, you should see:
- ✅ Backend server running on port 5000
- ✅ Frontend server running on port 8080
- ✅ All API keys configured (if you set them)
- ✅ No error messages in console
- ✅ Website loads in browser
- ✅ All features accessible and functional

---

**Happy Farming with AgroSetu! 🌱**
