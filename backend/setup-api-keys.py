#!/usr/bin/env python3
"""
API Keys Setup Script for AgroSetu Pest Detection
This script helps you configure your API keys permanently
"""

import os
import sys
from pathlib import Path

def setup_api_keys():
    """Interactive setup for API keys"""
    print("🔑 AgroSetu Pest Detection - API Keys Setup")
    print("=" * 50)
    print()
    
    # Get current directory
    current_dir = Path(__file__).parent
    config_file = current_dir / "config.py"
    
    print("This script will help you set up your API keys permanently.")
    print("Your keys will be saved in backend/config.py")
    print()
    
    # Get Google API Key
    print("1. Google Generative AI API Key (Required)")
    print("   Get your key from: https://makersuite.google.com/app/apikey")
    google_key = input("   Enter your Google API key: ").strip()
    
    if not google_key:
        print("   ⚠️  No Google API key provided. AI features won't work.")
        google_key = "your_google_api_key_here"
    
    print()
    
    # Get OpenWeather API Key
    print("2. OpenWeather API Key (Optional)")
    print("   Get your key from: https://openweathermap.org/api")
    weather_key = input("   Enter your OpenWeather API key (or press Enter to skip): ").strip()
    
    if not weather_key:
        print("   ⚠️  No OpenWeather API key provided. Weather features will be limited.")
        weather_key = "your_openweather_api_key_here"
    
    print()
    
    # Update config file
    try:
        # Read current config
        with open(config_file, 'r') as f:
            content = f.read()
        
        # Replace placeholders
        content = content.replace("your_google_api_key_here", google_key)
        content = content.replace("your_openweather_api_key_here", weather_key)
        
        # Write updated config
        with open(config_file, 'w') as f:
            f.write(content)
        
        print("✅ Configuration saved successfully!")
        print()
        print("Your API keys have been saved to backend/config.py")
        print("You can now start the server without setting environment variables.")
        print()
        print("To start the server:")
        print("  cd backend")
        print("  python start.py")
        print()
        
        # Test the configuration
        try:
            from config import check_api_keys
            check_api_keys()
        except ImportError:
            print("✅ Configuration file updated successfully!")
        
    except Exception as e:
        print(f"❌ Error saving configuration: {e}")
        print("Please manually edit backend/config.py and set your API keys.")
        return False
    
    return True

def main():
    """Main function"""
    try:
        setup_api_keys()
    except KeyboardInterrupt:
        print("\n\nSetup cancelled by user.")
        sys.exit(1)
    except Exception as e:
        print(f"\n❌ Setup failed: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
