# AgroSetu Market Prices Integration

## Overview
The Market Prices feature has been successfully integrated into AgroSetu, providing farmers with real-time commodity prices, market trends, and location-based market information using the Data.gov.in API.

## Features Implemented

### 🔍 **Real-Time Market Prices**
- Live commodity prices from Data.gov.in AGMARKNET
- Filter by commodity, state, district, market, or location
- Price range display (min, max, modal prices)
- Best market suggestions for selling

### 📊 **Price Trends Analysis**
- 7-day price trend visualization
- Interactive bar chart showing price changes
- Average price calculations over time
- Commodity-specific trend analysis

### 🗺️ **Location-Based Search**
- Geocoding support for city/location search
- Nearby market discovery
- State and district filtering
- Market-specific price data

### 🌐 **Multilingual Support**
- English and Punjabi translations
- Complete UI localization
- Cultural context for Indian farmers

## Technical Implementation

### Backend (Flask)
- **File**: `backend/app.py`
- **Endpoints**:
  - `GET /api/market-prices` - Fetch current market prices
  - `GET /api/market-trends` - Get price trends over time
  - `GET /api/markets` - List available markets
  - `GET /api/health` - Health check with API status

### Frontend (React + TypeScript)
- **File**: `src/pages/MarketPrices.tsx`
- **API Client**: `src/lib/marketPricesApi.ts`
- **Features**:
  - Advanced search and filtering
  - Real-time data loading
  - Interactive price charts
  - Responsive design

### API Integration
- **Data Source**: Data.gov.in AGMARKNET API
- **API Key**: `579b464db66ec23bdd00000177085098ca8143d879f44c68ec4f7773`
- **Base URL**: `https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070`

## Configuration

### API Keys Setup
The Data.gov.in API key is configured in `backend/config.py`:
```python
DATAGOV_API_KEY = "579b464db66ec23bdd00000177085098ca8143d879f44c68ec4f7773"
```

### Environment Variables
All API keys are automatically loaded from the config file:
- `GOOGLE_API_KEY` - For pest detection AI
- `OPENWEATHER_API_KEY` - For weather data
- `DATAGOV_API_KEY` - For market prices data

## Usage

### Starting the Application
1. **Quick Start**: Run `start-market-prices.bat`
2. **Manual Start**:
   ```bash
   # Backend
   cd backend
   python start.py
   
   # Frontend
   npm run dev
   ```

### Using Market Prices
1. Navigate to "Market Prices" in the main menu
2. Use the search filters to find specific commodities
3. Select commodity, state, district, or market
4. View real-time prices and trends
5. Get suggestions for best selling markets

## API Endpoints

### Get Market Prices
```
GET /api/market-prices?commodity=Wheat&state=Punjab&district=Ludhiana
```

**Parameters**:
- `commodity` - Commodity name (e.g., "Wheat", "Rice", "Tomato")
- `state` - State name
- `district` - District name
- `market` - Market name
- `date` - Date in DD/MM/YYYY format (default: today)
- `location` - City name for geocoding
- `lat` - Latitude for location-based search
- `lon` - Longitude for location-based search

**Response**:
```json
{
  "success": true,
  "records": [
    {
      "state": "Punjab",
      "district": "Ludhiana",
      "market": "Ludhiana Mandi",
      "commodity": "Wheat",
      "variety": "HD-2967",
      "grade": "Fair Average Quality",
      "arrival_date": "15/12/2024",
      "min_price": "2100",
      "max_price": "2300",
      "modal_price": "2200"
    }
  ],
  "count": 1,
  "suggestion": "Best market to sell: Ludhiana Mandi in Ludhiana, Punjab at modal price ₹2200/quintal"
}
```

### Get Market Trends
```
GET /api/market-trends?commodity=Wheat&days=7
```

**Parameters**:
- `commodity` - Commodity name (required)
- `state` - State name (optional)
- `district` - District name (optional)
- `market` - Market name (optional)
- `days` - Number of days for trends (1-30, default: 7)
- `location` - City name for geocoding
- `lat` - Latitude for location-based search
- `lon` - Longitude for location-based search

**Response**:
```json
{
  "success": true,
  "trends": [
    {
      "date": "15/12/2024",
      "avg_modal_price": 2200.0,
      "count": 5
    }
  ],
  "commodity": "Wheat"
}
```

### Get Markets List
```
GET /api/markets?state=Punjab
```

**Parameters**:
- `state` - State name (optional)
- `district` - District name (optional)
- `location` - City name for geocoding
- `lat` - Latitude for location-based search
- `lon` - Longitude for location-based search

**Response**:
```json
{
  "success": true,
  "markets": ["Ludhiana Mandi", "Amritsar Mandi", "Jalandhar Mandi"],
  "count": 3
}
```

## Error Handling

The system includes comprehensive error handling:
- Network connectivity issues
- API rate limiting
- Invalid parameters
- Data processing errors
- Geocoding failures

All errors are logged and user-friendly messages are displayed.

## Testing

### Test Script
Run the test script to verify functionality:
```bash
python test-market-prices.py
```

### Manual Testing
1. Start both backend and frontend servers
2. Navigate to http://localhost:8080
3. Go to Market Prices section
4. Test search functionality with different filters
5. Verify price trends display
6. Check multilingual support

## Performance Considerations

- **Caching**: API responses are not cached (can be added for production)
- **Rate Limiting**: Data.gov.in API has rate limits
- **Pagination**: Large result sets are limited to 1000 records
- **Geocoding**: Uses OpenStreetMap Nominatim (free tier)

## Future Enhancements

1. **Price Alerts**: Email/SMS notifications for target prices
2. **Historical Data**: Extended historical price analysis
3. **Market Comparison**: Side-by-side market comparison
4. **Export Data**: CSV/Excel export functionality
5. **Mobile App**: Native mobile application
6. **Offline Support**: Cached data for offline access

## Troubleshooting

### Common Issues

1. **No Data Found**
   - Check if commodity name is correct
   - Verify state/district spelling
   - Try broader search terms

2. **API Errors**
   - Verify API key is correct
   - Check network connectivity
   - Ensure backend is running

3. **Geocoding Issues**
   - Use specific city names
   - Try alternative location formats
   - Check internet connectivity

### Debug Mode
Enable debug logging by setting `DEBUG = True` in `backend/config.py`.

## Support

For technical support or feature requests, please refer to the main AgroSetu documentation or contact the development team.

---

**Integration Status**: ✅ Complete and Functional
**Last Updated**: December 2024
**Version**: 1.0.0
