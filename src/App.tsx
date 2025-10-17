import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import ProblemImpact from "./pages/ProblemImpact";
import SoilGuidance from "./pages/SoilGuidance";
import WeatherAlerts from "./pages/WeatherAlerts";
import PestDetection from "./pages/PestDetection";
import MarketPrices from "./pages/MarketPrices";
import VoiceChatbot from "./pages/VoiceChatbot";
import Feedback from "./pages/Feedback";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="problem-impact" element={<ProblemImpact />} />
            <Route path="soil-guidance" element={<SoilGuidance />} />
            <Route path="weather-alerts" element={<WeatherAlerts />} />
            <Route path="pest-detection" element={<PestDetection />} />
            <Route path="market-prices" element={<MarketPrices />} />
            <Route path="voice-chatbot" element={<VoiceChatbot />} />
            <Route path="feedback" element={<Feedback />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
