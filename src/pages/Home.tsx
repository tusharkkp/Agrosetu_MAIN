import Hero from "@/components/Hero";
import { Link } from "react-router-dom";
import { 
  Brain, 
  CloudRain, 
  Bug, 
  TrendingUp, 
  Mic, 
  MessageSquare,
  Leaf,
  BarChart3 
} from "lucide-react";
import { useTranslation } from "react-i18next";

const Home = () => {
  const { t } = useTranslation();
  
  const features = [
    {
      icon: <Brain className="w-8 h-8" />,
      title: t('features.problemAnalysis'),
      description: t('features.problemDescription'),
      href: "/problem-impact",
      color: "text-pear"
    },
    {
      icon: <Leaf className="w-8 h-8" />,
      title: t('features.soilHealth'), 
      description: t('features.soilDescription'),
      href: "/soil-guidance",
      color: "text-indigo"
    },
    {
      icon: <CloudRain className="w-8 h-8" />,
      title: t('features.weatherAlerts'),
      description: t('features.weatherDescription'),
      href: "/weather-alerts",
      color: "text-pear"
    },
    {
      icon: <Bug className="w-8 h-8" />,
      title: t('features.pestDetection'),
      description: t('features.pestDescription'),
      href: "/pest-detection",
      color: "text-indigo"
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: t('features.marketTracking'),
      description: t('features.marketDescription'),
      href: "/market-prices",
      color: "text-pear"
    },
    {
      icon: <Mic className="w-8 h-8" />,
      title: t('features.voiceAdvisory'),
      description: t('features.voiceDescription'),
      href: "/voice-chatbot",
      color: "text-indigo"
    },
    {
      icon: <MessageSquare className="w-8 h-8" />,
      title: t('features.farmerFeedback'),
      description: t('features.feedbackDescription'),
      href: "/feedback",
      color: "text-pear"
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: t('features.analytics'),
      description: t('features.analyticsDescription'),
      href: "/analytics",
      color: "text-indigo"
    }
  ];

  return (
    <div className="min-h-screen">
      <Hero />
      
      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-text-dark mb-6">
              {t('features.title')}
            </h2>
            <p className="text-xl text-text-medium max-w-3xl mx-auto">
              {t('features.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Link
                key={index}
                to={feature.href}
                className="feature-card group hover:shadow-glow transition-all duration-300"
              >
                <div className={`${feature.color} mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-text-dark mb-3">
                  {feature.title}
                </h3>
                <p className="text-text-medium group-hover:text-text-dark transition-colors duration-300">
                  {feature.description}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src="/lovable-uploads/486616bb-8b30-44c8-9751-7eeccba8dfad.png"
            alt="Smart farming with drone technology"
            className="w-full h-full object-cover"
          />
          
        </div>
        <div className="relative z-10 max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            {t('cta.title')}
          </h2>
          <p className="text-xl text-ivory-light mb-10">
            {t('cta.subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <button className="btn-hero">
              {t('cta.download')}
            </button>
            <button className="btn-secondary">
              {t('cta.learnMore')}
            </button>
          </div>
        </div>
      </section>

      {/* Spacer between CTA and next section/footer */}
      <div className="my-12 sm:my-16 bg-[var(--background,transparent)]" />
    </div>
  );
};

export default Home;