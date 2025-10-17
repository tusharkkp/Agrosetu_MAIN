# AgroSetu Minimal Startup Script
param(
    [switch]$SkipDependencies,
    [switch]$SkipBackend,
    [switch]$SkipFrontend,
    [switch]$OpenBrowser
)

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  AgroSetu Complete Startup" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if we're in the correct directory
$ProjectRoot = Get-Location
$ExpectedFiles = @("package.json", "vite.config.ts", "backend")

foreach ($file in $ExpectedFiles) {
    if (-not (Test-Path $file)) {
        Write-Host "❌ Required file/directory '$file' not found!" -ForegroundColor Red
        Write-Host "Please run this script from the AgroSetu project root directory." -ForegroundColor Yellow
        Write-Host "Expected location: .../agrosetu-main/sprout-smart-advise-main/" -ForegroundColor Yellow
        Write-Host ""
        Write-Host "Press any key to exit..." -ForegroundColor Gray
        $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
        exit 1
    }
}

Write-Host "✅ Project structure verified" -ForegroundColor Green

# Check Python installation
Write-Host "Checking Python installation..." -ForegroundColor Blue
try {
    $PythonVersion = python --version 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Python found: $PythonVersion" -ForegroundColor Green
    } else {
        throw "Python not found"
    }
} catch {
    Write-Host "❌ Python is not installed or not in PATH" -ForegroundColor Red
    Write-Host "Please install Python 3.8+ from https://python.org" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Press any key to exit..." -ForegroundColor Gray
    $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
    exit 1
}

# Check Node.js installation
Write-Host "Checking Node.js installation..." -ForegroundColor Blue
try {
    $NodeVersion = node --version 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Node.js found: $NodeVersion" -ForegroundColor Green
    } else {
        throw "Node.js not found"
    }
} catch {
    Write-Host "❌ Node.js is not installed or not in PATH" -ForegroundColor Red
    Write-Host "Please install Node.js 16+ from https://nodejs.org" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Press any key to exit..." -ForegroundColor Gray
    $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
    exit 1
}

# Check npm installation
Write-Host "Checking npm installation..." -ForegroundColor Blue
try {
    $NpmVersion = npm --version 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ npm found: v$NpmVersion" -ForegroundColor Green
    } else {
        throw "npm not found"
    }
} catch {
    Write-Host "❌ npm is not installed or not in PATH" -ForegroundColor Red
    Write-Host ""
    Write-Host "Press any key to exit..." -ForegroundColor Gray
    $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
    exit 1
}

# Install dependencies if not skipped
if (-not $SkipDependencies) {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host "  Installing Dependencies" -ForegroundColor Cyan
    Write-Host "========================================" -ForegroundColor Cyan
    
    # Install Python dependencies
    Write-Host "Installing Python dependencies..." -ForegroundColor Blue
    Set-Location "backend"
    try {
        pip install -r requirements.txt --quiet
        Write-Host "✅ Python dependencies installed" -ForegroundColor Green
    } catch {
        Write-Host "⚠️  Failed to install some Python dependencies. Continuing..." -ForegroundColor Yellow
    }
    Set-Location ".."
    
    # Install Node.js dependencies
    Write-Host "Installing Node.js dependencies..." -ForegroundColor Blue
    try {
        if (-not (Test-Path "node_modules")) {
            npm install --silent
            Write-Host "✅ Node.js dependencies installed" -ForegroundColor Green
        } else {
            Write-Host "✅ Node.js dependencies already installed" -ForegroundColor Green
        }
    } catch {
        Write-Host "⚠️  Failed to install some Node.js dependencies. Continuing..." -ForegroundColor Yellow
    }
} else {
    Write-Host "ℹ️  Skipping dependency installation" -ForegroundColor Blue
}

# Start backend server
if (-not $SkipBackend) {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host "  Starting Backend Server" -ForegroundColor Cyan
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host "Starting Flask backend on port 5000..." -ForegroundColor Blue
    
    # Start backend in a new PowerShell window
    $BackendScript = "Set-Location '$ProjectRoot\backend'; python start.py"
    Start-Process powershell -ArgumentList "-NoExit", "-Command", $BackendScript -WindowStyle Normal
    Write-Host "✅ Backend server starting in new window" -ForegroundColor Green
} else {
    Write-Host "ℹ️  Skipping backend startup" -ForegroundColor Blue
}

# Start frontend server
if (-not $SkipFrontend) {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host "  Starting Frontend Server" -ForegroundColor Cyan
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host "Starting Vite frontend on port 8080..." -ForegroundColor Blue
    
    # Start frontend in a new PowerShell window
    $FrontendScript = "Set-Location '$ProjectRoot'; npm run dev"
    Start-Process powershell -ArgumentList "-NoExit", "-Command", $FrontendScript -WindowStyle Normal
    Write-Host "✅ Frontend server starting in new window" -ForegroundColor Green
} else {
    Write-Host "ℹ️  Skipping frontend startup" -ForegroundColor Blue
}

# Final status
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  AgroSetu Startup Complete!" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "🌱 AgroSetu is now running with all features:" -ForegroundColor Green
Write-Host ""
Write-Host "📊 Available Features:" -ForegroundColor Cyan
Write-Host "   • AI-Powered Pest Detection" -ForegroundColor White
Write-Host "   • Real-time Market Prices (Data.gov.in)" -ForegroundColor White
Write-Host "   • Weather Alerts & Forecasts" -ForegroundColor White
Write-Host "   • Soil Guidance & Analysis" -ForegroundColor White
Write-Host "   • Voice Chatbot Support" -ForegroundColor White
Write-Host "   • Multilingual (English/Punjabi)" -ForegroundColor White
Write-Host ""
Write-Host "🌐 Access URLs:" -ForegroundColor Cyan
Write-Host "   Frontend: http://localhost:8080" -ForegroundColor Yellow
Write-Host "   Backend API: http://localhost:5000" -ForegroundColor Yellow
Write-Host "   Health Check: http://localhost:5000/api/health" -ForegroundColor Yellow
Write-Host ""
Write-Host "📱 Usage Instructions:" -ForegroundColor Cyan
Write-Host "   1. Open your browser and go to http://localhost:8080" -ForegroundColor White
Write-Host "   2. Navigate through different features using the menu" -ForegroundColor White
Write-Host "   3. Test Pest Detection with crop images" -ForegroundColor White
Write-Host "   4. Check Market Prices for commodity data" -ForegroundColor White
Write-Host "   5. Switch languages using the language toggle" -ForegroundColor White
Write-Host ""
Write-Host "🔧 Management:" -ForegroundColor Cyan
Write-Host "   • Backend and Frontend run in separate windows" -ForegroundColor White
Write-Host "   • Close those windows to stop the servers" -ForegroundColor White
Write-Host "   • Check console output for any errors" -ForegroundColor White
Write-Host "   • Edit backend/config.py for API key changes" -ForegroundColor White

# Open browser if requested
if ($OpenBrowser) {
    Write-Host ""
    Write-Host "Opening browser..." -ForegroundColor Blue
    Start-Process "http://localhost:8080"
}

Write-Host ""
Write-Host "✨ Happy Farming with AgroSetu! ✨" -ForegroundColor Green
Write-Host ""
Write-Host "Press any key to exit this window..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
