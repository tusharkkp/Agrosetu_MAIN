import { Leaf, TestTube, Target, BarChart } from "lucide-react";
import { useTranslation } from "react-i18next";

const SoilGuidance = () => {
  const { t } = useTranslation();
  
  const features = [
    {
      icon: <TestTube className="w-8 h-8" />,
      title: t('soil.analysis.title'),
      description: t('soil.analysis.description'),
      benefits: [t('soil.analysis.ph'), t('soil.analysis.nutrients'), t('soil.analysis.organic')]
    },
    {
      icon: <Target className="w-8 h-8" />,
      title: t('soil.fertilizer.title'),
      description: t('soil.fertilizer.description'),
      benefits: [t('soil.fertilizer.cost'), t('soil.fertilizer.yield'), t('soil.fertilizer.environmental')]
    },
    {
      icon: <BarChart className="w-8 h-8" />,
      title: t('soil.tracking.title'),
      description: t('soil.tracking.description'),
      benefits: [t('soil.tracking.historical'), t('soil.tracking.trends'), t('soil.tracking.roi')]
    }
  ];

  const soilTypes = [
    { name: t('soil.types.clay'), characteristics: t('soil.types.clayChar'), recommendation: t('soil.types.clayRec') },
    { name: t('soil.types.sandy'), characteristics: t('soil.types.sandyChar'), recommendation: t('soil.types.sandyRec') },
    { name: t('soil.types.loamy'), characteristics: t('soil.types.loamyChar'), recommendation: t('soil.types.loamyRec') },
    { name: t('soil.types.silt'), characteristics: t('soil.types.siltChar'), recommendation: t('soil.types.siltRec') }
  ];

  return (
    <div className="min-h-screen py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-text-dark mb-6">
            {t('soil.title')}
          </h1>
          <p className="text-xl text-text-medium max-w-3xl mx-auto">
            {t('soil.subtitle')}
          </p>
        </div>

        {/* Features */}
        <section className="mb-20">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="feature-card text-center">
                <div className="text-pear mb-6 flex justify-center">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-text-dark mb-4">
                  {feature.title}
                </h3>
                <p className="text-text-medium mb-6">
                  {feature.description}
                </p>
                <ul className="space-y-2">
                  {feature.benefits.map((benefit, idx) => (
                    <li key={idx} className="flex items-center justify-center text-sm">
                      <Leaf className="w-4 h-4 text-pear mr-2" />
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Soil Types Guide */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold text-text-dark mb-12 text-center">
            {t('soil.types.title')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {soilTypes.map((soil, index) => (
              <div key={index} className="glass-card p-6 border-2 border-green-500/50 shadow-lg shadow-green-500/20 hover:shadow-green-500/40 transition-all duration-300">
                <h3 className="text-lg font-semibold text-text-dark mb-3">
                  {soil.name}
                </h3>
                <p className="text-text-medium text-sm mb-3">
                  <strong>Characteristics:</strong> {soil.characteristics}
                </p>
                <p className="text-text-dark text-sm">
                  <strong>Recommendation:</strong> {soil.recommendation}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Interactive Demo */}
        <section className="bg-gradient-card rounded-3xl p-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-text-dark mb-4">
              {t('soil.demo.title')}
            </h2>
            <p className="text-text-medium">
              {t('soil.demo.subtitle')}
            </p>
          </div>

          <div className="max-w-2xl mx-auto">
            <div className="glass-card p-8 text-center border-2 border-green-500/50 shadow-lg shadow-green-500/20 hover:shadow-green-500/40 transition-all duration-300 cursor-pointer hover:scale-105">
              <div className="w-24 h-24 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-6">
                <TestTube className="w-12 h-12 text-text-dark" />
              </div>
              <h3 className="text-xl font-semibold text-text-dark mb-4">
                {t('soil.demo.ai')}
              </h3>
              <p className="text-text-medium mb-6">
                {t('soil.demo.description')}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="btn-hero">
                  {t('soil.demo.upload')}
                </button>
                <button className="btn-secondary">
                  {t('soil.demo.location')}
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Results Preview */}
        <section className="mt-20">
          <h2 className="text-3xl font-bold text-text-dark mb-12 text-center">
            {t('soil.results.title')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-card p-6 text-center">
              <div className="text-3xl font-bold text-pear mb-2">pH 6.8</div>
              <div className="text-text-medium">{t('soil.results.ph')}</div>
            </div>
            <div className="glass-card p-6 text-center">
              <div className="text-3xl font-bold text-indigo mb-2">85%</div>
              <div className="text-text-medium">{t('soil.results.nitrogen')}</div>
            </div>
            <div className="glass-card p-6 text-center">
              <div className="text-3xl font-bold text-pear mb-2">Good</div>
              <div className="text-text-medium">{t('soil.results.health')}</div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default SoilGuidance;