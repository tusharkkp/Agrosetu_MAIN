const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export interface MarketPriceRecord {
  state: string;
  district: string;
  market: string;
  commodity: string;
  variety: string;
  grade: string;
  arrival_date: string;
  min_price: string;
  max_price: string;
  modal_price: string;
}

export interface MarketPricesResponse {
  success: boolean;
  records: MarketPriceRecord[];
  count: number;
  suggestion?: string;
  filters_applied?: Record<string, string>;
  error?: string;
}

export interface TrendData {
  date: string;
  avg_modal_price: number;
  count: number;
}

export interface MarketTrendsResponse {
  success: boolean;
  trends: TrendData[];
  commodity: string;
  error?: string;
}

export interface MarketsResponse {
  success: boolean;
  markets: string[];
  count: number;
  error?: string;
}

export interface MarketPricesParams {
  commodity?: string;
  state?: string;
  district?: string;
  market?: string;
  date?: string;
  location?: string;
  lat?: number;
  lon?: number;
}

export interface MarketTrendsParams {
  commodity: string;
  state?: string;
  district?: string;
  market?: string;
  days?: number;
  location?: string;
  lat?: number;
  lon?: number;
}

export interface MarketsParams {
  state?: string;
  district?: string;
  location?: string;
  lat?: number;
  lon?: number;
}

export const marketPricesApi = {
  async getMarketPrices(params: MarketPricesParams = {}): Promise<MarketPricesResponse> {
    try {
      const queryParams = new URLSearchParams();
      
      if (params.commodity) queryParams.append('commodity', params.commodity);
      if (params.state) queryParams.append('state', params.state);
      if (params.district) queryParams.append('district', params.district);
      if (params.market) queryParams.append('market', params.market);
      if (params.date) queryParams.append('date', params.date);
      if (params.location) queryParams.append('location', params.location);
      if (params.lat) queryParams.append('lat', params.lat.toString());
      if (params.lon) queryParams.append('lon', params.lon.toString());

      const response = await fetch(`${API_BASE_URL}/market-prices?${queryParams.toString()}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching market prices:', error);
      return {
        success: false,
        records: [],
        count: 0,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  },

  async getMarketTrends(params: MarketTrendsParams): Promise<MarketTrendsResponse> {
    try {
      const queryParams = new URLSearchParams();
      
      queryParams.append('commodity', params.commodity);
      if (params.state) queryParams.append('state', params.state);
      if (params.district) queryParams.append('district', params.district);
      if (params.market) queryParams.append('market', params.market);
      if (params.days) queryParams.append('days', params.days.toString());
      if (params.location) queryParams.append('location', params.location);
      if (params.lat) queryParams.append('lat', params.lat.toString());
      if (params.lon) queryParams.append('lon', params.lon.toString());

      const response = await fetch(`${API_BASE_URL}/market-trends?${queryParams.toString()}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching market trends:', error);
      return {
        success: false,
        trends: [],
        commodity: params.commodity,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  },

  async getMarkets(params: MarketsParams = {}): Promise<MarketsResponse> {
    try {
      const queryParams = new URLSearchParams();
      
      if (params.state) queryParams.append('state', params.state);
      if (params.district) queryParams.append('district', params.district);
      if (params.location) queryParams.append('location', params.location);
      if (params.lat) queryParams.append('lat', params.lat.toString());
      if (params.lon) queryParams.append('lon', params.lon.toString());

      const response = await fetch(`${API_BASE_URL}/markets?${queryParams.toString()}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching markets:', error);
      return {
        success: false,
        markets: [],
        count: 0,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }
};

export default marketPricesApi;
