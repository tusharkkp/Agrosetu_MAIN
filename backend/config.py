"""
Configuration file for AgroSetu Pest Detection Backend
Set your API keys here once and they'll be used automatically
"""

import os
from pathlib import Path

# Get the directory where this file is located
BASE_DIR = Path(__file__).parent

# API Keys Configuration
# Replace these with your actual API keys
GOOGLE_API_KEY = "AIzaSyCA_8Wj4BIBPaoKPpHDd_XPjiysbw9UE0A"  # Real API key
OPENWEATHER_API_KEY = "e8a723f45a48d5b1fdb6b1e35fb104ba"  # Real API key
DATAGOV_API_KEY = "579b464db66ec23bdd00000177085098ca8143d879f44c68ec4f7773"  # Data.gov.in API key

# Server Configuration
PORT = 5000
HOST = "0.0.0.0"
DEBUG = True

def load_config():
    """Load configuration and set environment variables"""
    # Set environment variables from config
    os.environ.setdefault("GOOGLE_API_KEY", GOOGLE_API_KEY)
    os.environ.setdefault("OPENWEATHER_API_KEY", OPENWEATHER_API_KEY)
    os.environ.setdefault("DATAGOV_API_KEY", DATAGOV_API_KEY)
    os.environ.setdefault("PORT", str(PORT))
    os.environ.setdefault("FLASK_ENV", "development" if DEBUG else "production")
    os.environ.setdefault("FLASK_DEBUG", str(DEBUG).lower())
    
    return {
        "GOOGLE_API_KEY": GOOGLE_API_KEY,
        "OPENWEATHER_API_KEY": OPENWEATHER_API_KEY,
        "DATAGOV_API_KEY": DATAGOV_API_KEY,
        "PORT": PORT,
        "HOST": HOST,
        "DEBUG": DEBUG
    }

def check_api_keys():
    """Check if API keys are properly configured"""
    config = load_config()
    
    issues = []
    
    if config["GOOGLE_API_KEY"] == "your_google_api_key_here":
        issues.append("Google API key not set")
    
    if config["OPENWEATHER_API_KEY"] == "your_openweather_api_key_here":
        issues.append("OpenWeather API key not set (optional)")
    
    if config["DATAGOV_API_KEY"] == "your_datagov_api_key_here":
        issues.append("Data.gov.in API key not set")
    
    if issues:
        print("⚠️  Configuration Issues:")
        for issue in issues:
            print(f"   - {issue}")
        print("\n📝 To fix:")
        print("   1. Edit backend/config.py")
        print("   2. Replace 'your_google_api_key_here' with your actual Google API key")
        print("   3. Replace 'your_openweather_api_key_here' with your actual OpenWeather API key")
        print("   4. Save the file and restart the server")
        return False
    
    print("✅ All API keys configured correctly!")
    return True

if __name__ == "__main__":
    check_api_keys()
