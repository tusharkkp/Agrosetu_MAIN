import { AlertCircle, TrendingDown, Users, DollarSign } from "lucide-react";
import MountainVistaParallax from "@/components/ui/mountain-vista-bg";
import { useTranslation } from "react-i18next";

const ProblemImpact = () => {
  const { t } = useTranslation();
  
  const challenges = [
    {
      icon: <TrendingDown className="w-8 h-8" />,
      title: t('problem.challenges.lowYields'),
      description: t('problem.challenges.lowYieldsDesc'),
      stat: t('problem.challenges.lowYieldsStat')
    },
    {
      icon: <AlertCircle className="w-8 h-8" />,
      title: t('problem.challenges.climate'),
      description: t('problem.challenges.climateDesc'),
      stat: t('problem.challenges.climateStat')
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: t('problem.challenges.expertise'),
      description: t('problem.challenges.expertiseDesc'),
      stat: t('problem.challenges.expertiseStat')
    },
    {
      icon: <DollarSign className="w-8 h-8" />,
      title: t('problem.challenges.market'),
      description: t('problem.challenges.marketDesc'),
      stat: t('problem.challenges.marketStat')
    }
  ];

  const impacts = [
    {
      title: t('problem.impact.foodSecurity'),
      description: t('problem.impact.foodSecurityDesc'),
      metric: t('problem.impact.foodSecurityMetric')
    },
    {
      title: t('problem.impact.economic'),
      description: t('problem.impact.economicDesc'),
      metric: t('problem.impact.economicMetric')
    },
    {
      title: t('problem.impact.environmental'),
      description: t('problem.impact.environmentalDesc'),
      metric: t('problem.impact.environmentalMetric')
    },
    {
      title: t('problem.impact.technology'),
      description: t('problem.impact.technologyDesc'),
      metric: t('problem.impact.technologyMetric')
    }
  ];

  return (
    <div className="min-h-screen py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with Parallax Background */}
        <div className="relative text-center mb-16 h-96 flex items-center justify-center overflow-hidden">
          {/* Parallax Background */}
          <div className="absolute inset-0 z-0">
            <MountainVistaParallax />
          </div>
          
          {/* Header Content */}
          <div className="relative z-10">
            <h1 className="text-4xl md:text-6xl font-bold text-text-dark mb-6">
              {t('problem.title')}
            </h1>
            <p className="text-xl text-text-medium max-w-3xl mx-auto">
              {t('problem.subtitle')}
            </p>
          </div>
        </div>

        {/* Challenges Section */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold text-text-dark mb-12 text-center">
            {t('problem.challenges.title')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {challenges.map((challenge, index) => (
              <div key={index} className="feature-card">
                <div className="flex items-start space-x-4">
                  <div className="text-pear">{challenge.icon}</div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-text-dark mb-2">
                      {challenge.title}
                    </h3>
                    <p className="text-text-medium mb-3">
                      {challenge.description}
                    </p>
                    <div className="inline-block px-3 py-1 bg-gradient-primary text-text-dark text-sm font-semibold rounded-full">
                      {challenge.stat}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Impact Section */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold text-text-dark mb-12 text-center">
            {t('problem.impact.title')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {impacts.map((impact, index) => (
              <div key={index} className="glass-card p-6 text-center">
                <h3 className="text-lg font-semibold text-text-dark mb-3">
                  {impact.title}
                </h3>
                <p className="text-text-medium text-sm mb-4">
                  {impact.description}
                </p>
                <div className="text-2xl font-bold text-gradient-secondary">
                  {impact.metric}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Solution Preview */}
        <section className="bg-emerald-500 rounded-3xl p-12">
          <div className="text-center text-white">
            <h2 className="text-3xl font-bold mb-6">
              {t('problem.solution.title')}
            </h2>
            <p className="text-xl text-ivory-light mb-8 max-w-3xl mx-auto">
              {t('problem.solution.subtitle')}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
              <div className="glass-card p-6">
                <h3 className="font-semibold mb-2 text-text-dark">{t('problem.solution.ai')}</h3>
                <p className="text-sm text-text-dark">
                  {t('problem.solution.aiDesc')}
                </p>
              </div>
              <div className="glass-card p-6">
                <h3 className="font-semibold mb-2 text-text-dark">{t('problem.solution.multilingual')}</h3>
                <p className="text-sm text-text-dark">
                  {t('problem.solution.multilingualDesc')}
                </p>
              </div>
              <div className="glass-card p-6">
                <h3 className="font-semibold mb-2 text-text-dark">{t('problem.solution.realtime')}</h3>
                <p className="text-sm text-text-dark">
                  {t('problem.solution.realtimeDesc')}
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ProblemImpact;