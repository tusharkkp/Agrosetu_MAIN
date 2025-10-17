import { TrendingUp, TrendingDown, DollarSign, MapPin, Search, Filter, RefreshCw, AlertCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import { marketPricesApi, MarketPriceRecord, TrendData } from "@/lib/marketPricesApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

const MarketPrices = () => {
  const { t } = useTranslation();
  
  // State management
  const [marketData, setMarketData] = useState<MarketPriceRecord[]>([]);
  const [trendsData, setTrendsData] = useState<TrendData[]>([]);
  const [markets, setMarkets] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Filter states
  const [selectedCommodity, setSelectedCommodity] = useState<string>("");
  const [selectedState, setSelectedState] = useState<string>("");
  const [selectedDistrict, setSelectedDistrict] = useState<string>("");
  const [selectedMarket, setSelectedMarket] = useState<string>("");
  const [location, setLocation] = useState<string>("");
  
  // Common commodities for dropdown
  const commonCommodities = [
    "Wheat", "Rice", "Tomato", "Onion", "Potato", "Cotton", "Sugarcane", 
    "Maize", "Bajra", "Jowar", "Gram", "Mustard", "Groundnut", "Soybean"
  ];

  // Fetch market prices
  const fetchMarketPrices = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const params: any = {};
      if (selectedCommodity) params.commodity = selectedCommodity;
      if (selectedState) params.state = selectedState;
      if (selectedDistrict) params.district = selectedDistrict;
      if (selectedMarket) params.market = selectedMarket;
      if (location) params.location = location;
      
      const response = await marketPricesApi.getMarketPrices(params);
      
      if (response.success) {
        setMarketData(response.records);
        if (response.suggestion) {
          toast.success("Market data loaded!", {
            description: response.suggestion
          });
        }
      } else {
        setError(response.error || "Failed to fetch market data");
        toast.error("Failed to fetch market data");
      }
    } catch (err) {
      setError("Network error. Please try again.");
      toast.error("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch market trends
  const fetchMarketTrends = async (commodity: string) => {
    if (!commodity) return;
    
    try {
      const params: any = { commodity };
      if (selectedState) params.state = selectedState;
      if (selectedDistrict) params.district = selectedDistrict;
      if (selectedMarket) params.market = selectedMarket;
      if (location) params.location = location;
      
      const response = await marketPricesApi.getMarketTrends(params);
      
      if (response.success) {
        setTrendsData(response.trends);
      }
    } catch (err) {
      console.error("Error fetching trends:", err);
    }
  };

  // Fetch available markets
  const fetchMarkets = async () => {
    try {
      const params: any = {};
      if (selectedState) params.state = selectedState;
      if (selectedDistrict) params.district = selectedDistrict;
      if (location) params.location = location;
      
      const response = await marketPricesApi.getMarkets(params);
      
      if (response.success) {
        setMarkets(response.markets);
      }
    } catch (err) {
      console.error("Error fetching markets:", err);
    }
  };

  // Load initial data
  useEffect(() => {
    fetchMarketPrices();
    fetchMarkets();
  }, []);

  // Fetch trends when commodity changes
  useEffect(() => {
    if (selectedCommodity) {
      fetchMarketTrends(selectedCommodity);
    }
  }, [selectedCommodity]);

  // Handle search
  const handleSearch = () => {
    fetchMarketPrices();
    if (selectedCommodity) {
      fetchMarketTrends(selectedCommodity);
    }
  };

  // Clear filters
  const clearFilters = () => {
    setSelectedCommodity("");
    setSelectedState("");
    setSelectedDistrict("");
    setSelectedMarket("");
    setLocation("");
    setMarketData([]);
    setTrendsData([]);
  };

  const marketInsights = [
    {
      title: t('market.insights.seasonal'),
      description: t('market.insights.seasonalDesc'),
      impact: t('market.insights.impact.high')
    },
    {
      title: t('market.insights.export'),
      description: t('market.insights.exportDesc'),
      impact: t('market.insights.impact.medium')
    },
    {
      title: t('market.insights.weather'),
      description: t('market.insights.weatherDesc'),
      impact: t('market.insights.impact.medium')
    },
    {
      title: t('market.insights.policy'),
      description: t('market.insights.policyDesc'),
      impact: t('market.insights.impact.high')
    }
  ];

  const nearbyMarkets = [
    {
      name: t('market.nearby.centralMandi'),
      distance: "2.5 km",
      status: t('market.nearby.open'),
      avgPrice: "₹2,100/quintal"
    },
    {
      name: t('market.nearby.wholesaleMarket'),
      distance: "5.2 km", 
      status: t('market.nearby.open'),
      avgPrice: "₹2,050/quintal"
    },
    {
      name: t('market.nearby.farmerMarket'),
      distance: "8.1 km",
      status: t('market.nearby.closed'),
      avgPrice: "₹2,200/quintal"
    }
  ];

  return (
    <div className="min-h-screen py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-text-dark mb-6">
            {t('market.title')}
          </h1>
          <p className="text-xl text-text-medium max-w-3xl mx-auto">
            {t('market.subtitle')}
          </p>
        </div>

        {/* Search and Filters */}
        <section className="mb-12">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="w-5 h-5" />
                Search Market Prices
              </CardTitle>
              <CardDescription>
                Filter by commodity, location, or market to find the best prices
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
                <div>
                  <label className="text-sm font-medium text-text-dark mb-2 block">
                    Commodity
                  </label>
                  <Select value={selectedCommodity} onValueChange={setSelectedCommodity}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select commodity" />
                    </SelectTrigger>
                    <SelectContent>
                      {commonCommodities.map((commodity) => (
                        <SelectItem key={commodity} value={commodity}>
                          {commodity}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-text-dark mb-2 block">
                    State
                  </label>
                  <Input
                    value={selectedState}
                    onChange={(e) => setSelectedState(e.target.value)}
                    placeholder="Enter state"
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium text-text-dark mb-2 block">
                    District
                  </label>
                  <Input
                    value={selectedDistrict}
                    onChange={(e) => setSelectedDistrict(e.target.value)}
                    placeholder="Enter district"
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium text-text-dark mb-2 block">
                    Market
                  </label>
                  <Select value={selectedMarket} onValueChange={setSelectedMarket}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select market" />
                    </SelectTrigger>
                    <SelectContent>
                      {markets.slice(0, 50).map((market) => (
                        <SelectItem key={market} value={market}>
                          {market}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-text-dark mb-2 block">
                    Location
                  </label>
                  <Input
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Enter city"
                  />
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button onClick={handleSearch} disabled={loading} className="flex items-center gap-2">
                  {loading ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <Search className="w-4 h-4" />
                  )}
                  {loading ? "Searching..." : "Search Prices"}
                </Button>
                <Button variant="outline" onClick={clearFilters}>
                  Clear Filters
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Error Display */}
        {error && (
          <Alert className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Live Prices */}
        <section className="mb-20">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-text-dark">
              {t('market.prices.title')}
              {marketData.length > 0 && (
                <Badge variant="secondary" className="ml-4">
                  {marketData.length} records
                </Badge>
              )}
            </h2>
            <div className="flex items-center text-text-medium">
              <div className="w-2 h-2 bg-pear rounded-full mr-2 animate-pulse"></div>
              Live Updates
            </div>
          </div>
          
          {marketData.length === 0 && !loading ? (
            <Card className="glass-card p-12 text-center">
              <DollarSign className="w-16 h-16 text-pear mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-text-dark mb-2">
                No Market Data Found
              </h3>
              <p className="text-text-medium mb-4">
                Try adjusting your search filters or search for a different commodity.
              </p>
              <Button onClick={handleSearch}>
                Search Again
              </Button>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {marketData.slice(0, 12).map((record, index) => (
                <Card key={index} className="glass-card p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold text-text-dark">
                      {record.commodity}
                    </h3>
                    <Badge variant="outline">
                      {record.grade || "Standard"}
                    </Badge>
                  </div>
                  
                  <div className="text-2xl font-bold text-text-dark mb-2">
                    ₹{record.modal_price}
                    <span className="text-sm font-normal text-text-medium ml-2">
                      {t('market.prices.perQuintal')}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 mb-4 text-sm">
                    <div>
                      <span className="text-text-medium">Min: </span>
                      <span className="font-semibold">₹{record.min_price}</span>
                    </div>
                    <div>
                      <span className="text-text-medium">Max: </span>
                      <span className="font-semibold">₹{record.max_price}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center text-text-medium text-sm mb-2">
                    <MapPin className="w-4 h-4 mr-1" />
                    {record.market}, {record.district}
                  </div>
                  
                  <div className="text-xs text-text-light">
                    {record.state} • {record.arrival_date}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </section>

        {/* Price Trends Chart */}
        {trendsData.length > 0 && (
          <section className="mb-20">
            <Card className="glass-card p-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Price Trends - {selectedCommodity}
                </CardTitle>
                <CardDescription>
                  Price trends over the last 7 days
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-gradient-card rounded-lg p-4">
                  <div className="flex items-end justify-between h-full gap-2">
                    {trendsData.slice().reverse().map((trend, index) => (
                      <div key={index} className="flex flex-col items-center flex-1">
                        <div 
                          className="bg-pear rounded-t w-full mb-2 transition-all duration-300 hover:bg-pear/80"
                          style={{ 
                            height: `${Math.max(20, (trend.avg_modal_price / Math.max(...trendsData.map(t => t.avg_modal_price))) * 200)}px` 
                          }}
                        />
                        <div className="text-xs text-text-medium text-center">
                          <div className="font-semibold">₹{trend.avg_modal_price}</div>
                          <div className="text-text-light">{trend.date.split('/')[0]}/{trend.date.split('/')[1]}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>
        )}

        {/* Market Insights */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold text-text-dark mb-12 text-center">
            {t('market.insights.title')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {marketInsights.map((insight, index) => (
              <div key={index} className="feature-card">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-lg font-semibold text-text-dark">
                    {insight.title}
                  </h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    insight.impact === 'High' ? 'bg-red-100 text-red-700' :
                    insight.impact === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-green-100 text-green-700'
                  }`}>
{insight.impact}
                  </span>
                </div>
                <p className="text-text-medium">{insight.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Nearby Markets */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold text-text-dark mb-12 text-center">
            {t('market.nearby.title')}
          </h2>
          <div className="space-y-4">
            {nearbyMarkets.map((market, index) => (
              <div key={index} className="glass-card p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <MapPin className="w-6 h-6 text-pear" />
                    <div>
                      <h3 className="text-lg font-semibold text-text-dark">
                        {market.name}
                      </h3>
                      <p className="text-text-medium">{market.distance} {t('market.nearby.away')}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium mb-2 ${
                      market.status === t('market.nearby.open') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {market.status}
                    </div>
                    <div className="text-text-dark font-semibold">
                      {market.avgPrice}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Price Alerts */}
        <section>
          <div className="bg-gradient-hero rounded-3xl p-12 text-center">
            <h2 className="text-3xl font-bold text-white mb-6">
              {t('market.alerts.title')}
            </h2>
            <p className="text-xl text-ivory-light mb-8 max-w-2xl mx-auto">
              {t('market.alerts.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
              <input
                type="text"
                placeholder={t('market.alerts.commodity')}
                className="flex-1 px-4 py-3 rounded-lg text-text-dark"
              />
              <input
                type="text"
                placeholder={t('market.alerts.targetPrice')}
                className="flex-1 px-4 py-3 rounded-lg text-text-dark"
              />
              <button className="btn-secondary whitespace-nowrap">
{t('market.alerts.setAlert')}
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default MarketPrices;