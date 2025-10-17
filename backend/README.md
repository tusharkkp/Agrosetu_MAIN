# AgroSetu Pest Detection Backend

This is the backend API server for the AgroSetu Pest Detection feature, providing AI-powered crop pest and disease identification.

## Features

- **AI-Powered Analysis**: Uses Google's Gemini AI model for accurate pest and disease detection
- **Weather Integration**: Fetches current weather data for localized recommendations
- **Multilingual Support**: Provides analysis in multiple Indian languages
- **RESTful API**: Clean API endpoints for frontend integration
- **Image Processing**: Handles base64 encoded images for analysis

## Prerequisites

- Python 3.8 or higher
- Google Generative AI API key
- OpenWeather API key (optional, for weather data)

## Installation

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install the required dependencies:
   ```bash
   pip install -r requirements.txt
   ```

## Configuration

Set the following environment variables:

```bash
# Required: Google Generative AI API Key
export GOOGLE_API_KEY="your_google_api_key_here"

# Optional: OpenWeather API Key for weather data
export OPENWEATHER_API_KEY="your_openweather_api_key_here"

# Optional: Port (defaults to 5000)
export PORT=5000
```

### Getting API Keys

1. **Google Generative AI API Key**:
   - Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Create a new API key
   - Copy the key and set it as `GOOGLE_API_KEY`

2. **OpenWeather API Key** (optional):
   - Visit [OpenWeatherMap](https://openweathermap.org/api)
   - Sign up for a free account
   - Get your API key and set it as `OPENWEATHER_API_KEY`

## Running the Backend

### Method 1: Using the startup script
```bash
python start.py
```

### Method 2: Direct execution
```bash
python app.py
```

The backend will start on `http://localhost:5000` by default.

## API Endpoints

### Health Check
```
GET /api/health
```
Returns the status of the API server.

### Pest Detection
```
POST /api/pest-detection
```
Analyzes uploaded crop images for pest and disease identification.

**Request Body:**
```json
{
  "image": "base64_encoded_image_string",
  "cropType": "Tomato",
  "location": "Mumbai",
  "language": "English"
}
```

**Response:**
```json
{
  "success": true,
  "analysis": "Detailed analysis text...",
  "severity": "Moderate",
  "weather": "Temperature: 28°C, Humidity: 75%, Condition: partly cloudy",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### Feedback Submission
```
POST /api/feedback
```
Submits user feedback about the analysis.

**Request Body:**
```json
{
  "feedback": "Helpful",
  "comment": "The analysis was very accurate"
}
```

## Integration with Frontend

The backend is designed to work seamlessly with the AgroSetu frontend. Make sure to:

1. Start the backend server
2. Set the frontend environment variable:
   ```bash
   export VITE_API_BASE_URL=http://localhost:5000/api
   ```
3. The frontend will automatically connect to the backend API

## Troubleshooting

### Common Issues

1. **Import Errors**: Make sure all dependencies are installed:
   ```bash
   pip install -r requirements.txt
   ```

2. **API Key Errors**: Verify your API keys are correctly set:
   ```bash
   echo $GOOGLE_API_KEY
   echo $OPENWEATHER_API_KEY
   ```

3. **Port Already in Use**: Change the port:
   ```bash
   export PORT=5001
   python start.py
   ```

4. **CORS Issues**: The backend includes CORS headers for frontend integration. If you encounter CORS issues, check that the frontend is making requests to the correct backend URL.

### Logs

The backend runs in debug mode by default, providing detailed logs for troubleshooting. Check the console output for any error messages.

## Development

To contribute to the backend:

1. Follow the existing code structure
2. Add proper error handling
3. Include docstrings for new functions
4. Test new endpoints thoroughly
5. Update this README for any new features

## Security Notes

- Keep your API keys secure and never commit them to version control
- Use environment variables for all sensitive configuration
- The backend includes basic safety settings for the AI model
- Consider adding authentication for production deployment
