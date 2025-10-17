#!/usr/bin/env python3
"""
Startup script for AgroSetu Pest Detection Backend
"""

import os
import sys
from pathlib import Path

# Add the backend directory to Python path
backend_dir = Path(__file__).parent
sys.path.insert(0, str(backend_dir))

# Load configuration automatically
try:
    from config import load_config, check_api_keys
    
    print("🔧 Loading configuration...")
    config = load_config()
    
    # Check if API keys are properly configured
    if not check_api_keys():
        print("\n⚠️  The server will start but AI features won't work without proper API keys.")
        print("   Please edit backend/config.py and set your actual API keys.\n")
    
except ImportError as e:
    print(f"❌ Error loading configuration: {e}")
    print("   Make sure config.py exists in the backend directory.")
    sys.exit(1)

try:
    from app import app
    
    if __name__ == "__main__":
        port = int(os.environ.get('PORT', 5000))
        print(f"Starting AgroSetu Pest Detection Backend on port {port}")
        print("Make sure to set your API keys in environment variables:")
        print("- GOOGLE_API_KEY: Your Google Generative AI API key")
        print("- OPENWEATHER_API_KEY: Your OpenWeather API key")
        print("\nBackend will be available at: http://localhost:5000")
        print("Health check endpoint: http://localhost:5000/api/health")
        
        app.run(host='0.0.0.0', port=port, debug=True)
        
except ImportError as e:
    print(f"Error importing dependencies: {e}")
    print("Please install the required packages by running:")
    print("pip install -r requirements.txt")
    sys.exit(1)
except Exception as e:
    print(f"Error starting the backend: {e}")
    sys.exit(1)
