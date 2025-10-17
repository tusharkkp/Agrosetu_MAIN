import { Cloud, CloudRain, Sun, AlertTriangle, Thermometer, Wind } from "lucide-react";
import { WaveAnimation } from "@/components/ui/wave-animation-1";
import { useTranslation } from "react-i18next";

const WeatherAlerts = () => {
  const { t } = useTranslation();
  
  const currentWeather = {
    temperature: "28°C",
    humidity: "65%",
    windSpeed: "12 km/h",
    conditions: t('weather.forecast.partlyCloudy'),
    icon: <Cloud className="w-12 h-12" />
  };

  const alerts = [
    {
      type: t('weather.alerts.heavyRain'),
      severity: t('weather.alerts.severity.high'),
      time: "Next 6 hours",
      description: t('weather.alerts.heavyRainDesc'),
      icon: <CloudRain className="w-6 h-6" />,
      color: "text-red-500"
    },
    {
      type: t('weather.alerts.irrigation'),
      severity: t('weather.alerts.severity.medium'), 
      time: "Tomorrow 6 AM",
      description: t('weather.alerts.irrigationDesc'),
      icon: <Sun className="w-6 h-6" />,
      color: "text-pear"
    },
    {
      type: t('weather.alerts.frost'),
      severity: t('weather.alerts.severity.high'),
      time: t('weather.alerts.tonight'),
      description: t('weather.alerts.frostDesc'),
      icon: <AlertTriangle className="w-6 h-6" />,
      color: "text-indigo"
    }
  ];

  const weeklyForecast = [
    { day: t('weather.forecast.mon'), temp: "29°C", condition: t('weather.forecast.sunny'), icon: <Sun className="w-6 h-6" /> },
    { day: t('weather.forecast.tue'), temp: "31°C", condition: t('weather.forecast.partlyCloudy'), icon: <Cloud className="w-6 h-6" /> },
    { day: t('weather.forecast.wed'), temp: "26°C", condition: t('weather.forecast.rainy'), icon: <CloudRain className="w-6 h-6" /> },
    { day: t('weather.forecast.thu'), temp: "28°C", condition: t('weather.forecast.cloudy'), icon: <Cloud className="w-6 h-6" /> },
    { day: t('weather.forecast.fri'), temp: "30°C", condition: t('weather.forecast.sunny'), icon: <Sun className="w-6 h-6" /> },
    { day: t('weather.forecast.sat'), temp: "32°C", condition: t('weather.forecast.hot'), icon: <Sun className="w-6 h-6" /> },
    { day: t('weather.forecast.sun'), temp: "29°C", condition: t('weather.forecast.partlyCloudy'), icon: <Cloud className="w-6 h-6" /> }
  ];

  const farmingTips = [
    {
      title: t('weather.tips.irrigation'),
      tip: t('weather.tips.irrigationTip')
    },
    {
      title: t('weather.tips.planting'),
      tip: t('weather.tips.plantingTip')
    },
    {
      title: t('weather.tips.harvest'),
      tip: t('weather.tips.harvestTip')
    },
    {
      title: t('weather.tips.pest'),
      tip: t('weather.tips.pestTip')
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Header with Full-Width Background */}
      <section className="relative w-full overflow-hidden min-h-[500px] py-20">
        <WaveAnimation 
          className="absolute inset-0 w-full h-full z-0 pointer-events-none"
          waveSpeed={3}
          waveIntensity={50}
          particleColor="#fff200"
          pointSize={3}
          gridDistance={2}
        />
        <div className="absolute inset-0 bg-black/20 z-5"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-16 min-h-[400px] flex flex-col justify-center">
          <h1 className="text-6xl md:text-8xl font-black text-white mb-6 drop-shadow-lg uppercase tracking-wider">
            {t('weather.title')}
          </h1>
          <p className="text-2xl md:text-3xl text-white/90 max-w-4xl mx-auto drop-shadow-md font-medium">
            {t('weather.subtitle')}
          </p>
        </div>
      </section>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* Current Weather */}
        <section className="mb-12">
          <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-8 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-[1.02] hover:bg-white/15">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-text-dark mb-2">{t('weather.current.title')}</h2>
                <p className="text-text-medium">{t('weather.current.subtitle')}</p>
              </div>
              <div className="text-pear">
                {currentWeather.icon}
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8">
              <div className="text-center">
                <Thermometer className="w-8 h-8 text-pear mx-auto mb-2" />
                <div className="text-2xl font-bold text-text-dark">{currentWeather.temperature}</div>
                <div className="text-text-medium text-sm">{t('weather.current.temperature')}</div>
              </div>
              <div className="text-center">
                <Cloud className="w-8 h-8 text-indigo mx-auto mb-2" />
                <div className="text-2xl font-bold text-text-dark">{currentWeather.humidity}</div>
                <div className="text-text-medium text-sm">{t('weather.current.humidity')}</div>
              </div>
              <div className="text-center">
                <Wind className="w-8 h-8 text-pear mx-auto mb-2" />
                <div className="text-2xl font-bold text-text-dark">{currentWeather.windSpeed}</div>
                <div className="text-text-medium text-sm">{t('weather.current.windSpeed')}</div>
              </div>
              <div className="text-center">
                <Sun className="w-8 h-8 text-indigo mx-auto mb-2" />
                <div className="text-xl font-bold text-text-dark">{currentWeather.conditions}</div>
                <div className="text-text-medium text-sm">{t('weather.current.conditions')}</div>
              </div>
            </div>
          </div>
        </section>

        {/* Active Alerts */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-text-dark mb-8">{t('weather.alerts.title')}</h2>
          <div className="space-y-4">
            {alerts.map((alert, index) => (
              <div key={index} className="glass-card p-6 shadow-lg shadow-emerald-500/20 border border-emerald-400/30 hover:shadow-emerald-500/40 hover:border-emerald-400/50 transition-all duration-300">
                <div className="flex items-start space-x-4">
                  <div className={alert.color}>
                    {alert.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-semibold text-text-dark">{alert.type}</h3>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        alert.severity === 'High' ? 'bg-red-100 text-red-700' :
                        alert.severity === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-green-100 text-green-700'
                      }`}>
                        {alert.severity}
                      </span>
                    </div>
                    <p className="text-text-medium mb-2">{alert.description}</p>
                    <p className="text-sm text-text-light">{t('weather.alerts.expected')} {alert.time}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Weekly Forecast */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-text-dark mb-8">{t('weather.forecast.title')}</h2>
          <div className="grid grid-cols-2 md:grid-cols-7 gap-4">
            {weeklyForecast.map((day, index) => {
              const temp = parseInt(day.temp);
              let tempColorClass = "border-gray-300";
              if (temp >= 30) tempColorClass = "border-red-400 shadow-red-200/50";
              else if (temp <= 20) tempColorClass = "border-blue-400 shadow-blue-200/50";
              else tempColorClass = "border-orange-400 shadow-orange-200/50";
              
              return (
              <div key={index} className={`glass-card p-4 text-center border-2 ${tempColorClass} shadow-lg transition-all duration-300`}>
                <div className="font-semibold text-text-dark mb-2">{day.day}</div>
                <div className="text-pear mb-2 flex justify-center">{day.icon}</div>
                <div className="text-lg font-bold text-text-dark mb-1">{day.temp}</div>
                <div className="text-xs text-text-medium">{day.condition}</div>
              </div>
              );
            })}
          </div>
        </section>

        {/* Farming Tips */}
        <section>
          <h2 className="text-3xl font-bold text-text-dark mb-8">{t('weather.tips.title')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {farmingTips.map((tip, index) => (
              <div key={index} className="feature-card">
                <h3 className="text-lg font-semibold text-text-dark mb-3">{tip.title}</h3>
                <p className="text-text-medium">{tip.tip}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default WeatherAlerts;