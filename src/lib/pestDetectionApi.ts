const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export interface PestDetectionRequest {
  image: string; // base64 encoded image
  cropType: string;
  location: string;
  language: string;
}

export interface PestDetectionResponse {
  success: boolean;
  analysis: string;
  severity: 'Mild' | 'Moderate' | 'Severe';
  weather: string;
  timestamp: string;
  error?: string;
}

export interface FeedbackRequest {
  feedback: 'Helpful' | 'Not Accurate' | 'Partially Helpful';
  comment: string;
}

export interface FeedbackResponse {
  success: boolean;
  message: string;
  error?: string;
}

export const pestDetectionApi = {
  async detectPest(request: PestDetectionRequest): Promise<PestDetectionResponse> {
    console.log('Starting pest detection API call...');
    console.log('API Base URL:', API_BASE_URL);
    console.log('Request data:', { 
      ...request, 
      image: request.image ? `${request.image.substring(0, 50)}...` : 'No image' 
    });

    try {
      const response = await fetch(`${API_BASE_URL}/pest-detection`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        const errorText = await response.text();
        console.error('HTTP Error Response:', errorText);
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log('Success response:', data);
      return data;
    } catch (error) {
      console.error('Error in pest detection API:', error);
      
      let errorMessage = 'Unknown error occurred';
      if (error instanceof Error) {
        errorMessage = error.message;
        if (error.message.includes('Failed to fetch')) {
          errorMessage = 'Cannot connect to the server. Please make sure the backend is running on http://localhost:5000';
        }
      }
      
      return {
        success: false,
        analysis: '',
        severity: 'Mild',
        weather: '',
        timestamp: '',
        error: errorMessage
      };
    }
  },

  async submitFeedback(request: FeedbackRequest): Promise<FeedbackResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/feedback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error in feedback API:', error);
      return {
        success: false,
        message: '',
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  },

  async healthCheck(): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/health`);
      return response.ok;
    } catch (error) {
      console.error('Health check failed:', error);
      return false;
    }
  }
};

export default pestDetectionApi;
