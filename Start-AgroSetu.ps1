#Requires -Version 5.1
<#
.SYNOPSIS
    AgroSetu Complete Project Startup Script
.DESCRIPTION
    This PowerShell script starts the complete AgroSetu project with all features:
    - Pest Detection with AI
    - Market Prices with Data.gov.in API
    - Weather Alerts
    - Soil Guidance
    - Voice Chatbot
    - Multilingual Support (English/Punjabi)
.PARAMETER SkipDependencies
    Skip dependency installation check
.PARAMETER SkipBackend
    Skip backend server startup
.PARAMETER SkipFrontend
    Skip frontend server startup
.PARAMETER OpenBrowser
    Automatically open browser after startup
.EXAMPLE
    .\Start-AgroSetu.ps1
    Starts the complete AgroSetu project
.EXAMPLE
    .\Start-AgroSetu.ps1 -OpenBrowser
    Starts the project and opens browser automatically
#>

param(
    [switch]$SkipDependencies,
    [switch]$SkipBackend,
    [switch]$SkipFrontend,
    [switch]$OpenBrowser
)

# Set error action preference to prevent script from stopping on errors
$ErrorActionPreference = "Continue"

# Function to pause and wait for user input
function Wait-ForUserInput {
    param([string]$Message = "Press any key to continue...")
    Write-Host "`n$Message" -ForegroundColor Gray
    try {
        $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
    } catch {
        # Fallback if ReadKey fails
        Read-Host "Press Enter to continue"
    }
}

# Function to check if a command exists
function Test-Command {
    param([string]$Command)
    try {
        Get-Command $Command -ErrorAction Stop | Out-Null
        return $true
    } catch {
        return $false
    }
}

# Script configuration
$ScriptName = "AgroSetu Complete Startup"
$Version = "1.0.0"
$BackendPort = 5000
$FrontendPort = 8080
$BackendUrl = "http://localhost:$BackendPort"
$FrontendUrl = "http://localhost:$FrontendPort"

# Color functions
function Write-ColorOutput {
    param(
        [string]$Message,
        [string]$Color = "White"
    )
    Write-Host $Message -ForegroundColor $Color
}

function Write-Header {
    param([string]$Title)
    Write-ColorOutput "`n" -Color "Cyan"
    Write-ColorOutput "=" * 60 -Color "Cyan"
    Write-ColorOutput "  $Title" -Color "Cyan"
    Write-ColorOutput "=" * 60 -Color "Cyan"
}

function Write-Success {
    param([string]$Message)
    Write-ColorOutput "✅ $Message" -Color "Green"
}

function Write-Warning {
    param([string]$Message)
    Write-ColorOutput "⚠️  $Message" -Color "Yellow"
}

function Write-Error {
    param([string]$Message)
    Write-ColorOutput "❌ $Message" -Color "Red"
}

function Write-Info {
    param([string]$Message)
    Write-ColorOutput "ℹ️  $Message" -Color "Blue"
}

# Main script execution
try {
    # Clear screen and show header
    Clear-Host
    Write-Header "$ScriptName v$Version"
    Write-ColorOutput "🌱 Starting AgroSetu - Smart Crop Advisory Platform" -Color "Green"
    Write-ColorOutput "   Empowering farmers with AI-powered solutions" -Color "Gray"
    Write-ColorOutput "`n"

    # Check if we're in the correct directory
    $ProjectRoot = Get-Location
    $ExpectedFiles = @("package.json", "vite.config.ts", "backend")
    $DirectoryValid = $true
    
    foreach ($file in $ExpectedFiles) {
        if (-not (Test-Path $file)) {
            Write-Error "Required file/directory '$file' not found!"
            Write-Info "Please run this script from the AgroSetu project root directory."
            Write-Info "Expected location: .../agrosetu-main/sprout-smart-advise-main/"
            $DirectoryValid = $false
        }
    }
    
    if (-not $DirectoryValid) {
        Write-Error "Project structure validation failed!"
        Wait-ForUserInput "Press any key to exit..."
        exit 1
    }
    
    Write-Success "Project structure verified"

    # Check Python installation
    Write-Info "Checking Python installation..."
    if (Test-Command "python") {
        try {
            $PythonVersion = python --version 2>&1
            Write-Success "Python found: $PythonVersion"
        } catch {
            Write-Warning "Python found but version check failed. Continuing..."
        }
    } else {
        Write-Error "Python is not installed or not in PATH"
        Write-Info "Please install Python 3.8+ from https://python.org"
        Wait-ForUserInput "Press any key to exit..."
        exit 1
    }

    # Check Node.js installation
    Write-Info "Checking Node.js installation..."
    if (Test-Command "node") {
        try {
            $NodeVersion = node --version 2>&1
            Write-Success "Node.js found: $NodeVersion"
        } catch {
            Write-Warning "Node.js found but version check failed. Continuing..."
        }
    } else {
        Write-Error "Node.js is not installed or not in PATH"
        Write-Info "Please install Node.js 16+ from https://nodejs.org"
        Wait-ForUserInput "Press any key to exit..."
        exit 1
    }

    # Check npm installation
    Write-Info "Checking npm installation..."
    if (Test-Command "npm") {
        try {
            $NpmVersion = npm --version 2>&1
            Write-Success "npm found: v$NpmVersion"
        } catch {
            Write-Warning "npm found but version check failed. Continuing..."
        }
    } else {
        Write-Error "npm is not installed or not in PATH"
        Wait-ForUserInput "Press any key to exit..."
        exit 1
    }

    # Install dependencies if not skipped
    if (-not $SkipDependencies) {
        Write-Header "Installing Dependencies"
        
        # Install Python dependencies
        Write-Info "Installing Python dependencies..."
        Set-Location "backend"
        try {
            pip install -r requirements.txt --quiet
            Write-Success "Python dependencies installed"
        } catch {
            Write-Warning "Failed to install some Python dependencies. Continuing..."
        }
        Set-Location ".."
        
        # Install Node.js dependencies
        Write-Info "Installing Node.js dependencies..."
        try {
            if (-not (Test-Path "node_modules")) {
                npm install --silent
                Write-Success "Node.js dependencies installed"
            } else {
                Write-Success "Node.js dependencies already installed"
            }
        } catch {
            Write-Warning "Failed to install some Node.js dependencies. Continuing..."
        }
    } else {
        Write-Info "Skipping dependency installation"
    }

    # Check API configuration
    Write-Header "Checking API Configuration"
    Set-Location "backend"
    try {
        # Create a temporary Python script to check API configuration
        $TempScript = "temp_config_check.py"
        $PythonCode = @'
from config import load_config
config = load_config()
print('API Keys Status:')
print(f'  Google API: {"✅" if config["GOOGLE_API_KEY"] != "your_google_api_key_here" else "❌"}')
print(f'  OpenWeather API: {"✅" if config["OPENWEATHER_API_KEY"] != "your_openweather_api_key_here" else "❌"}')
print(f'  Data.gov.in API: {"✅" if config["DATAGOV_API_KEY"] != "your_datagov_api_key_here" else "❌"}')
'@
        $PythonCode | Out-File -FilePath $TempScript -Encoding UTF8
        $ConfigCheck = python $TempScript
        Remove-Item $TempScript -ErrorAction SilentlyContinue
        Write-ColorOutput $ConfigCheck -Color "White"
        
        if ($ConfigCheck -match "❌") {
            Write-Warning "Some API keys are not configured. Some features may not work properly."
            Write-Info "Edit backend/config.py to set your API keys for full functionality."
        } else {
            Write-Success "All API keys are configured"
        }
    } catch {
        Write-Warning "Could not check API configuration. Continuing..."
    }
    Set-Location ".."

    # Start backend server
    if (-not $SkipBackend) {
        Write-Header "Starting Backend Server"
        Write-Info "Starting Flask backend on port $BackendPort..."
        
        # Start backend in a new PowerShell window
        $BackendScript = "Set-Location '$ProjectRoot\backend'; python start.py"
        
        Start-Process powershell -ArgumentList "-NoExit", "-Command", $BackendScript -WindowStyle Normal
        Write-Success "Backend server starting in new window"
        
        # Wait for backend to start
        Write-Info "Waiting for backend to initialize..."
        $BackendReady = $false
        $Attempts = 0
        $MaxAttempts = 30
        
        while (-not $BackendReady -and $Attempts -lt $MaxAttempts) {
            Start-Sleep -Seconds 2
            $Attempts++
            try {
                $Response = Invoke-WebRequest -Uri "$BackendUrl/api/health" -TimeoutSec 5 -ErrorAction SilentlyContinue
                if ($Response.StatusCode -eq 200) {
                    $BackendReady = $true
                    Write-Success "Backend server is ready!"
                }
            } catch {
                Write-Info "Waiting for backend... ($Attempts/$MaxAttempts)"
            }
        }
        
        if (-not $BackendReady) {
            Write-Warning "Backend may not be fully ready yet. Continuing..."
        }
    } else {
        Write-Info "Skipping backend startup"
    }

    # Start frontend server
    if (-not $SkipFrontend) {
        Write-Header "Starting Frontend Server"
        Write-Info "Starting Vite frontend on port $FrontendPort..."
        
        # Start frontend in a new PowerShell window
        $FrontendScript = "Set-Location '$ProjectRoot'; npm run dev"
        
        Start-Process powershell -ArgumentList "-NoExit", "-Command", $FrontendScript -WindowStyle Normal
        Write-Success "Frontend server starting in new window"
        
        # Wait for frontend to start
        Write-Info "Waiting for frontend to initialize..."
        $FrontendReady = $false
        $Attempts = 0
        $MaxAttempts = 30
        
        while (-not $FrontendReady -and $Attempts -lt $MaxAttempts) {
            Start-Sleep -Seconds 2
            $Attempts++
            try {
                $Response = Invoke-WebRequest -Uri $FrontendUrl -TimeoutSec 5 -ErrorAction SilentlyContinue
                if ($Response.StatusCode -eq 200) {
                    $FrontendReady = $true
                    Write-Success "Frontend server is ready!"
                }
            } catch {
                Write-Info "Waiting for frontend... ($Attempts/$MaxAttempts)"
            }
        }
        
        if (-not $FrontendReady) {
            Write-Warning "Frontend may not be fully ready yet. Check the frontend window."
        }
    } else {
        Write-Info "Skipping frontend startup"
    }

    # Final status
    Write-Header "AgroSetu Startup Complete!"
    Write-ColorOutput "🌱 AgroSetu is now running with all features:" -Color "Green"
    Write-ColorOutput "`n📊 Available Features:" -Color "Cyan"
    Write-ColorOutput "   • AI-Powered Pest Detection" -Color "White"
    Write-ColorOutput "   • Real-time Market Prices (Data.gov.in)" -Color "White"
    Write-ColorOutput "   • Weather Alerts & Forecasts" -Color "White"
    Write-ColorOutput "   • Soil Guidance & Analysis" -Color "White"
    Write-ColorOutput "   • Voice Chatbot Support" -Color "White"
    Write-ColorOutput "   • Multilingual (English/Punjabi)" -Color "White"
    
    Write-ColorOutput "`n🌐 Access URLs:" -Color "Cyan"
    Write-ColorOutput "   Frontend: $FrontendUrl" -Color "Yellow"
    Write-ColorOutput "   Backend API: $BackendUrl" -Color "Yellow"
    Write-ColorOutput "   Health Check: $BackendUrl/api/health" -Color "Yellow"
    
    Write-ColorOutput "`n📱 Usage Instructions:" -Color "Cyan"
    Write-ColorOutput "   1. Open your browser and go to $FrontendUrl" -Color "White"
    Write-ColorOutput "   2. Navigate through different features using the menu" -Color "White"
    Write-ColorOutput "   3. Test Pest Detection with crop images" -Color "White"
    Write-ColorOutput "   4. Check Market Prices for commodity data" -Color "White"
    Write-ColorOutput "   5. Switch languages using the language toggle" -Color "White"
    
    Write-ColorOutput "`n🔧 Management:" -Color "Cyan"
    Write-ColorOutput "   • Backend and Frontend run in separate windows" -Color "White"
    Write-ColorOutput "   • Close those windows to stop the servers" -Color "White"
    Write-ColorOutput "   • Check console output for any errors" -Color "White"
    Write-ColorOutput "   • Edit backend/config.py for API key changes" -Color "White"
    
    # Open browser if requested
    if ($OpenBrowser) {
        Write-Info "Opening browser..."
        Start-Process $FrontendUrl
    }
    
    Write-ColorOutput "`n✨ Happy Farming with AgroSetu! ✨" -Color "Green"
    Wait-ForUserInput "Press any key to exit this window..."

} catch {
    Write-Error "An error occurred: $($_.Exception.Message)"
    Write-Info "Please check the error details and try again."
    Write-Info "Error details: $($_.Exception)"
    Wait-ForUserInput "Press any key to exit..."
    exit 1
}
