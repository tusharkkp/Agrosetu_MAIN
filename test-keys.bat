@echo off
echo Testing API Keys...
echo.

cd backend
python -c "
import sys
from pathlib import Path
sys.path.insert(0, str(Path.cwd()))

try:
    from config import load_config
    import google.generativeai as genai
    import requests
    
    print('🔧 Testing API Keys...')
    config = load_config()
    
    # Test Google API
    print('🤖 Testing Google API...')
    google_key = config['GOOGLE_API_KEY']
    genai.configure(api_key=google_key)
    model = genai.GenerativeModel('gemini-1.5-flash')
    response = model.generate_content('Say API test successful')
    print(f'✅ Google API: {response.text[:50]}...')
    
    # Test Weather API
    print('🌤️  Testing Weather API...')
    weather_key = config['OPENWEATHER_API_KEY']
    url = f'http://api.openweathermap.org/data/2.5/weather?q=London&appid={weather_key}&units=metric'
    resp = requests.get(url)
    if resp.status_code == 200:
        data = resp.json()
        print(f'✅ Weather API: {data[\"weather\"][0][\"description\"]} - {data[\"main\"][\"temp\"]}°C')
    else:
        print(f'❌ Weather API Error: {resp.status_code}')
        
    print('🎯 All API keys are working!')
    
except Exception as e:
    print(f'❌ Error: {e}')
"

echo.
echo Test complete!
pause
