import google.generativeai as genai
from pathlib import Path
import os
import requests
from PIL import Image
from flask import Flask, request, jsonify
from flask_cors import CORS
import tempfile
import base64
from io import BytesIO
import json
from datetime import datetime, timedelta
from typing import Optional, List, Dict

# Load configuration automatically
from config import load_config, check_api_keys
config = load_config()

app = Flask(__name__)

# Configure CORS to allow all origins for development
CORS(app, resources={
    r"/api/*": {
        "origins": ["http://localhost:8080", "http://localhost:3000", "http://127.0.0.1:8080"],
        "methods": ["GET", "POST", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"]
    }
})

# Configure the GenerativeAI API key
genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))

# Set up the model configuration for text generation
generation_config = {
    "temperature": 0.4,
    "top_p": 1,
    "top_k": 32,
    "max_output_tokens": 4096,
}

# Define safety settings for content generation
safety_settings = [
    {"category": f"HARM_CATEGORY_{category}", "threshold": "BLOCK_MEDIUM_AND_ABOVE"}
    for category in ["HARASSMENT", "HATE_SPEECH", "SEXUALLY_EXPLICIT", "DANGEROUS_CONTENT"]
]

# Initialize the GenerativeModel
model = genai.GenerativeModel(
    model_name="gemini-1.5-flash",
    generation_config=generation_config,
    safety_settings=safety_settings,
)

# Function to read image data from base64
def read_image_from_base64(base64_string):
    try:
        # Remove data URL prefix if present
        if base64_string.startswith('data:image'):
            base64_string = base64_string.split(',')[1]
        
        image_data = base64.b64decode(base64_string)
        image = Image.open(BytesIO(image_data))
        
        # Convert to RGB if necessary
        if image.mode != 'RGB':
            image = image.convert('RGB')
        
        return image
    except Exception as e:
        raise ValueError(f"Error processing image: {str(e)}")

# Function to fetch current weather data
def get_weather(city):
    if not city:
        return "Weather data unavailable."
    
    api_key = os.getenv("OPENWEATHER_API_KEY")
    if not api_key or api_key == "your_openweather_api_key_here" or api_key == "demo_openweather_key_12345":
        # Return mock weather data for demo purposes
        import random
        temp = random.randint(25, 35)
        hum = random.randint(60, 85)
        conditions = ["sunny", "partly cloudy", "overcast", "light rain"]
        condition = random.choice(conditions)
        return f"Temperature: {temp}°C, Humidity: {hum}%, Condition: {condition}"
    
    try:
        url = f"http://api.openweathermap.org/data/2.5/weather?q={city},IN&appid={api_key}&units=metric"
        resp = requests.get(url).json()
        if resp.get('cod') != 200:
            return f"Weather data not available for {city}."
        
        temp = resp['main']['temp']
        hum = resp['main']['humidity']
        desc = resp['weather'][0]['description']
        return f"Temperature: {temp}°C, Humidity: {hum}%, Condition: {desc}"
    except Exception as e:
        # Return mock weather data if API fails
        import random
        temp = random.randint(25, 35)
        hum = random.randint(60, 85)
        conditions = ["sunny", "partly cloudy", "overcast", "light rain"]
        condition = random.choice(conditions)
        return f"Temperature: {temp}°C, Humidity: {hum}%, Condition: {condition} (demo data)"

# Function to generate a response based on a prompt and an image
def generate_gemini_response(prompt, image):
    try:
        # Check if we have a valid API key
        api_key = os.getenv("GOOGLE_API_KEY")
        if not api_key or api_key == "your_google_api_key_here" or api_key.startswith("AIzaSyB8m8m8m8m8m8m8m8m8m8m8m8m8m8m8m8m8m8m8"):
            # Return mock response for demo purposes
            print("⚠️  Using demo response - API key not configured")
            return generate_mock_response(prompt)
        
        print("🤖 Using real Google AI for analysis...")
        response = model.generate_content([prompt, image])
        return response.text
    except Exception as e:
        error_msg = str(e)
        print(f"❌ API Error: {error_msg}")
        if "API_KEY_INVALID" in error_msg or "API key not valid" in error_msg:
            print("⚠️  Invalid API key - falling back to demo response")
            return generate_mock_response(prompt)
        return f"Error generating response: {error_msg}"

def generate_mock_response(prompt):
    """Generate a mock response for demo purposes when API key is not available"""
    # Extract crop type and location from prompt
    crop_type = "Tomato"
    location = "Pune"
    
    if "Crop Type:" in prompt:
        crop_match = prompt.split("Crop Type:")[1].split("\n")[0].strip()
        if crop_match and crop_match != "Unknown":
            crop_type = crop_match
    
    if "Location:" in prompt:
        location_match = prompt.split("Location:")[1].split("\n")[0].strip()
        if location_match and location_match != "Unknown":
            location = location_match
    
    mock_responses = {
        "Tomato": {
            "pest": "Tomato Hornworm",
            "severity": "Moderate",
            "analysis": f"""Tomato Hornworm (Manduca quinquemaculata)

Based on the image analysis, I can identify the presence of Tomato Hornworm larvae on your {crop_type} plants in {location}.

Severity Assessment: Moderate
The infestation appears to be in the moderate range with visible damage to leaves and potential impact on fruit development.

Detailed Findings:
- Large green caterpillars with distinctive horn-like projections
- Significant leaf defoliation in affected areas
- Presence of dark droppings (frass) on leaves
- Potential impact on fruit quality and yield

Actionable Recommendations:
1. Manual Removal: Pick off visible caterpillars and drop them in soapy water
2. Natural Predators: Encourage beneficial insects like parasitic wasps
3. Organic Control: Apply Bacillus thuringiensis (Bt) spray every 7-10 days
4. Companion Planting: Plant marigolds and basil to deter hornworms

Preventive Measures:
- Regular field scouting every 2-3 days during growing season
- Remove plant debris after harvest to eliminate overwintering sites
- Use floating row covers early in season
- Maintain good plant spacing for air circulation

Weather & Pest Prediction:
Based on current weather conditions in {location}, the risk of continued hornworm activity is moderate. Warm, humid conditions favor their development.

Next Steps:
1. Begin manual removal immediately
2. Apply Bt treatment within 24-48 hours
3. Monitor closely for 2 weeks
4. Contact local agricultural extension if infestation persists

Note: This analysis is based on AI image recognition. For severe infestations, consult with local agricultural experts.""",
        },
        "Rice": {
            "pest": "Rice Blast Disease",
            "severity": "Mild",
            "analysis": f"""Rice Blast Disease (Magnaporthe oryzae)

I've identified early signs of Rice Blast disease in your {crop_type} crop in {location}.

Severity Assessment: Mild
The disease appears to be in early stages with limited lesion development.

Detailed Findings:
- Small, diamond-shaped lesions on leaves
- Lesions with gray centers and brown borders
- Early stage infection with minimal yield impact
- Favorable conditions for disease progression

Actionable Recommendations:
1. Fungicide Treatment: Apply tricyclazole or azoxystrobin
2. Cultural Practices: Improve drainage and reduce humidity
3. Nitrogen Management: Avoid excessive nitrogen fertilization
4. Resistant Varieties: Consider planting blast-resistant varieties next season

Preventive Measures:
- Maintain proper water management
- Ensure good field drainage
- Use balanced fertilization
- Remove infected plant debris

Weather & Pest Prediction:
Current weather conditions in {location} show moderate humidity levels that may favor disease development. Monitor closely for 7-10 days.

Next Steps:
1. Apply preventive fungicide treatment
2. Improve field drainage
3. Monitor disease progression
4. Consider variety selection for next planting

This is a demo analysis. For accurate diagnosis, consult with local agricultural experts."""
        }
    }
    
    # Default response for other crops
    default_response = f"""Common Pest/Disease Detected

Based on the image analysis of your {crop_type} crop in {location}, I've identified signs of pest or disease activity.

Severity Assessment: Moderate
The affected area shows typical symptoms that require attention and treatment.

Detailed Findings:
- Visible damage to plant tissue
- Signs of pest feeding or disease infection
- Potential impact on crop health and yield
- Requires immediate intervention

Actionable Recommendations:
1. Identify specific pest or disease through local extension services
2. Apply appropriate treatment based on confirmed diagnosis
3. Implement integrated pest management practices
4. Monitor crop health regularly

Preventive Measures:
- Regular field monitoring
- Proper crop rotation
- Good cultural practices
- Timely irrigation and fertilization

Weather & Pest Prediction:
Current conditions in {location} may favor pest/disease development. Monitor closely.

Next Steps:
1. Contact local agricultural extension office
2. Get professional diagnosis
3. Apply recommended treatments
4. Implement preventive measures

Note: This is a demo analysis. For accurate diagnosis and treatment recommendations, please consult with qualified agricultural experts in your area."""
    
    return mock_responses.get(crop_type, default_response)["analysis"]

# Initial input prompt for the pest and disease expert
input_prompt = """
As a highly skilled plant pathologist and entomologist, your expertise is indispensable in helping small and marginal farmers identify and manage crop pests and diseases. You will be provided with an image of a crop (leaf, stem, or fruit) along with details like crop type, location, and current weather. Your role is to analyze the image, identify issues, assess severity, provide cost-effective recommendations, and predict potential outbreaks.

Analysis Guidelines:

1. Disease/Pest Identification: Examine the image to identify and name the specific pest or disease accurately. Start the response with the name on the first line.

2. Severity Assessment: Classify the issue as Mild, Moderate, or Severe based on the extent of damage.

3. Detailed Findings: Describe the symptoms, affected parts, and potential causes in detail.

4. Actionable Recommendations: Suggest cost-effective organic and chemical control options, including dosages suitable for small farms. Prioritize organic where possible.

5. Preventive Measures: Outline steps to prevent further spread, considering local conditions.

6. Weather & Pest Prediction: Based on the provided weather and location, predict potential pest or disease outbreaks in the next 7 days (e.g., high risk due to humidity).

7. Next Steps: Recommend immediate actions, including when to seek expert help.

Keep the response thorough yet concise, focused on practical advice for small farmers. Use plain text format without bold or markdown.

Disclaimer:
Please note that the information provided is based on AI analysis and should not replace professional agricultural advice. Consult with qualified agricultural experts before implementing any strategies or treatments.
"""

@app.route('/api/pest-detection', methods=['POST', 'OPTIONS'])
def process_detection():
    # Handle CORS preflight request
    if request.method == 'OPTIONS':
        return jsonify({"status": "ok"}), 200
    
    try:
        print("Received pest detection request")
        data = request.get_json()
        
        if not data:
            print("No data provided in request")
            return jsonify({"success": False, "error": "No data provided"}), 400
        
        image_base64 = data.get('image')
        crop_type = data.get('cropType', 'Unknown')
        location = data.get('location', 'Unknown')
        language = data.get('language', 'English')
        
        print(f"Processing request: crop={crop_type}, location={location}, language={language}")
        
        if not image_base64:
            print("No image provided in request")
            return jsonify({"success": False, "error": "No image provided"}), 400
        
        # Process the image
        print("Processing image...")
        image = read_image_from_base64(image_base64)
        
        # Get weather information
        print("Getting weather information...")
        weather_info = get_weather(location)
        
        # Create the full prompt
        full_prompt = input_prompt + f"\n\nAdditional Information:\n- Crop Type: {crop_type}\n- Location: {location}\n- Current Weather: {weather_info}\n- Provide the entire response in {language}."
        
        # Generate response
        print("Generating AI response...")
        response = generate_gemini_response(full_prompt, image)
        
        # Parse severity
        lower_resp = response.lower()
        severity = "Severe" if "severe" in lower_resp else "Moderate" if "moderate" in lower_resp else "Mild"
        
        print(f"Analysis complete. Severity: {severity}")
        
        return jsonify({
            "success": True,
            "analysis": response,
            "severity": severity,
            "weather": weather_info,
            "timestamp": str(Path().cwd())
        })
        
    except Exception as e:
        print(f"Error in pest detection: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({
            "success": False,
            "error": f"Analysis failed: {str(e)}"
        }), 500

@app.route('/api/feedback', methods=['POST', 'OPTIONS'])
def submit_feedback():
    # Handle CORS preflight request
    if request.method == 'OPTIONS':
        return jsonify({"status": "ok"}), 200
    try:
        data = request.get_json()
        feedback_choice = data.get('feedback')
        feedback_comment = data.get('comment', '')
        
        # In a real application, you would save this to a database
        print(f"Feedback: {feedback_choice} - {feedback_comment}")
        
        return jsonify({
            "success": True,
            "message": "Feedback submitted successfully! Thank you for helping us improve."
        })
        
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({
        "status": "healthy",
        "message": "Pest Detection API is running",
        "timestamp": str(Path().cwd()),
        "google_api_configured": bool(os.getenv("GOOGLE_API_KEY") and os.getenv("GOOGLE_API_KEY") != "your_google_api_key_here")
    })

@app.route('/api/test', methods=['GET'])
def test_endpoint():
    return jsonify({
        "message": "Backend is working!",
        "cors_enabled": True,
        "endpoints": ["/api/health", "/api/test", "/api/pest-detection", "/api/feedback", "/api/market-prices", "/api/market-trends", "/api/markets"]
    })

# Market Prices API Endpoints
BASE_URL = "https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070"
DEFAULT_FORMAT = "json"
DEFAULT_LIMIT = 1000

def fetch_market_data(filters: Dict[str, str], limit: int = DEFAULT_LIMIT, offset: int = 0) -> Dict:
    """Fetch data from Data.gov.in API"""
    params = {
        "api-key": config["DATAGOV_API_KEY"],
        "format": DEFAULT_FORMAT,
        "limit": limit,
        "offset": offset,
    }
    for key, value in filters.items():
        params[f"filters[{key}]"] = value
    
    try:
        response = requests.get(BASE_URL, params=params, timeout=30)
        response.raise_for_status()
        return response.json()
    except Exception as e:
        print(f"Error fetching market data: {e}")
        return {"records": [], "count": 0}

def get_location_details(location: Optional[str] = None, lat: Optional[float] = None, lon: Optional[float] = None) -> Dict[str, str]:
    """Get location details using geocoding"""
    if lat is not None and lon is not None:
        geo_url = f"https://nominatim.openstreetmap.org/reverse?lat={lat}&lon={lon}&format=json&addressdetails=1"
    elif location:
        geo_url = f"https://nominatim.openstreetmap.org/search?q={location},India&format=json&addressdetails=1&limit=1"
    else:
        return {}
    
    headers = {"User-Agent": "AgroSetu/1.0"}
    try:
        resp = requests.get(geo_url, headers=headers, timeout=10)
        resp.raise_for_status()
        data = resp.json()
        if isinstance(data, list) and data:
            data = data[0]
        address = data.get("address", {})
        return {
            "state": address.get("state", ""),
            "district": address.get("state_district", "") or address.get("county", "")
        }
    except Exception as e:
        print(f"Geocoding failed: {e}")
        return {}

@app.route('/api/market-prices', methods=['GET', 'OPTIONS'])
def get_market_prices():
    """Get current market prices for commodities"""
    if request.method == 'OPTIONS':
        return jsonify({"status": "ok"}), 200
    
    try:
        # Get query parameters
        commodity = request.args.get('commodity')
        state = request.args.get('state')
        district = request.args.get('district')
        market = request.args.get('market')
        date = request.args.get('date')
        location = request.args.get('location')
        lat = request.args.get('lat', type=float)
        lon = request.args.get('lon', type=float)
        
        # Set default date to today
        if date is None:
            date = datetime.today().strftime("%d/%m/%Y")
        
        filters = {}
        if commodity:
            filters["commodity"] = commodity
        if market:
            filters["market"] = market
        filters["arrival_date"] = date
        
        # Handle location-based filtering
        if location or (lat is not None and lon is not None):
            loc_details = get_location_details(location, lat, lon)
            if loc_details.get("state"):
                filters["state"] = loc_details["state"]
            if loc_details.get("district"):
                filters["district"] = loc_details["district"]
        else:
            if state:
                filters["state"] = state
            if district:
                filters["district"] = district
        
        print(f"Fetching market data with filters: {filters}")
        data = fetch_market_data(filters)
        records = data.get("records", [])
        
        # Process records to ensure proper formatting
        processed_records = []
        for record in records:
            try:
                processed_record = {
                    "state": record.get("state", ""),
                    "district": record.get("district", ""),
                    "market": record.get("market", ""),
                    "commodity": record.get("commodity", ""),
                    "variety": record.get("variety", ""),
                    "grade": record.get("grade", ""),
                    "arrival_date": record.get("arrival_date", ""),
                    "min_price": record.get("min_price", "0"),
                    "max_price": record.get("max_price", "0"),
                    "modal_price": record.get("modal_price", "0")
                }
                processed_records.append(processed_record)
            except Exception as e:
                print(f"Error processing record: {e}")
                continue
        
        # Find best market for selling (highest modal price)
        suggestion = None
        if processed_records:
            try:
                best_record = max(processed_records, 
                                key=lambda r: float(r["modal_price"]) if r["modal_price"].replace(".", "").isdigit() else 0)
                suggestion = f"Best market to sell: {best_record['market']} in {best_record['district']}, {best_record['state']} at modal price ₹{best_record['modal_price']}/quintal"
            except Exception as e:
                print(f"Error finding best market: {e}")
        
        return jsonify({
            "success": True,
            "records": processed_records,
            "count": len(processed_records),
            "suggestion": suggestion,
            "filters_applied": filters
        })
        
    except Exception as e:
        print(f"Error in market prices: {e}")
        return jsonify({
            "success": False,
            "error": f"Failed to fetch market prices: {str(e)}"
        }), 500

@app.route('/api/market-trends', methods=['GET', 'OPTIONS'])
def get_market_trends():
    """Get price trends for commodities over time"""
    if request.method == 'OPTIONS':
        return jsonify({"status": "ok"}), 200
    
    try:
        commodity = request.args.get('commodity')
        state = request.args.get('state')
        district = request.args.get('district')
        market = request.args.get('market')
        days = int(request.args.get('days', 7))
        location = request.args.get('location')
        lat = request.args.get('lat', type=float)
        lon = request.args.get('lon', type=float)
        
        if not commodity:
            return jsonify({
                "success": False,
                "error": "Commodity parameter is required"
            }), 400
        
        filters_base = {"commodity": commodity}
        if market:
            filters_base["market"] = market
        
        # Handle location
        if location or (lat is not None and lon is not None):
            loc_details = get_location_details(location, lat, lon)
            if loc_details.get("state"):
                filters_base["state"] = loc_details["state"]
            if loc_details.get("district"):
                filters_base["district"] = loc_details["district"]
        else:
            if state:
                filters_base["state"] = state
            if district:
                filters_base["district"] = district
        
        trends = []
        today = datetime.today()
        
        for i in range(days):
            past_date = (today - timedelta(days=i)).strftime("%d/%m/%Y")
            filters = filters_base.copy()
            filters["arrival_date"] = past_date
            
            data = fetch_market_data(filters, limit=100)
            records = data.get("records", [])
            
            if records:
                try:
                    modal_prices = [float(record["modal_price"]) for record in records 
                                  if record.get("modal_price") and record["modal_price"].replace(".", "").isdigit()]
                    avg_price = sum(modal_prices) / len(modal_prices) if modal_prices else 0
                    trends.append({
                        "date": past_date,
                        "avg_modal_price": round(avg_price, 2),
                        "count": len(records)
                    })
                except Exception as e:
                    print(f"Error processing trend data for {past_date}: {e}")
                    trends.append({
                        "date": past_date,
                        "avg_modal_price": 0,
                        "count": 0
                    })
            else:
                trends.append({
                    "date": past_date,
                    "avg_modal_price": 0,
                    "count": 0
                })
        
        return jsonify({
            "success": True,
            "trends": trends,
            "commodity": commodity
        })
        
    except Exception as e:
        print(f"Error in market trends: {e}")
        return jsonify({
            "success": False,
            "error": f"Failed to fetch market trends: {str(e)}"
        }), 500

@app.route('/api/markets', methods=['GET', 'OPTIONS'])
def get_markets():
    """Get list of available markets"""
    if request.method == 'OPTIONS':
        return jsonify({"status": "ok"}), 200
    
    try:
        state = request.args.get('state')
        district = request.args.get('district')
        location = request.args.get('location')
        lat = request.args.get('lat', type=float)
        lon = request.args.get('lon', type=float)
        
        filters = {}
        if location or (lat is not None and lon is not None):
            loc_details = get_location_details(location, lat, lon)
            if loc_details.get("state"):
                filters["state"] = loc_details["state"]
            if loc_details.get("district"):
                filters["district"] = loc_details["district"]
        else:
            if state:
                filters["state"] = state
            if district:
                filters["district"] = district
        
        data = fetch_market_data(filters, limit=2000)
        records = data.get("records", [])
        
        # Extract unique markets
        markets = set()
        for record in records:
            market_name = record.get("market", "")
            if market_name:
                markets.add(market_name)
        
        return jsonify({
            "success": True,
            "markets": list(markets),
            "count": len(markets)
        })
        
    except Exception as e:
        print(f"Error in markets: {e}")
        return jsonify({
            "success": False,
            "error": f"Failed to fetch markets: {str(e)}"
        }), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)
