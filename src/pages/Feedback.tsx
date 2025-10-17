import { Star, MessageSquare, TrendingUp, Users } from "lucide-react";
import { useState } from "react";
import FeedbackSlider from "@/components/ui/feedback-slider";
import { useTranslation } from "react-i18next";

const Feedback = () => {
  const { t } = useTranslation();
  const [rating, setRating] = useState(0);
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    cropType: "",
    feedback: "",
    suggestion: ""
  });

  const testimonials = [
    {
      name: "राम शर्मा",
      location: "पंजाब",
      crop: t('feedback.crops.wheat'),
      rating: 5,
      feedback: "Smart Crop Advisory ने मेरी फसल की पैदावार 30% बढ़ाई है। मिट्टी की सलाह बहुत उपयोगी थी।",
      translation: "Smart Crop Advisory increased my crop yield by 30%. The soil advice was very useful."
    },
    {
      name: "प्रिया पटेल",
      location: "गुजरात", 
      crop: t('feedback.crops.cotton'),
      rating: 5,
      feedback: "Voice chatbot की वजह से मैं आसानी से सलाह ले पाती हूं। बहुत अच्छी सेवा है।",
      translation: "Because of the voice chatbot, I can easily get advice. It's a very good service."
    },
    {
      name: "अजय कुमार",
      location: "बिहार",
      crop: t('feedback.crops.rice'),
      rating: 4,
      feedback: "Weather alerts की वजह से मैंने समय पर अपनी फसल को बचाया। धन्यवाद!",
      translation: "Thanks to weather alerts, I saved my crop on time. Thank you!"
    }
  ];

  const stats = [
    {
      icon: <Users className="w-8 h-8" />,
      value: "25,000+",
      label: t('feedback.stats.activeFarmers'),
      color: "text-pear"
    },
    {
      icon: <Star className="w-8 h-8" />,
      value: "4.8/5",
      label: t('feedback.stats.averageRating'),
      color: "text-indigo"
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      value: "35%",
      label: t('feedback.stats.yieldImprovement'),
      color: "text-pear"
    },
    {
      icon: <MessageSquare className="w-8 h-8" />,
      value: "98%",
      label: t('feedback.stats.satisfactionRate'),
      color: "text-indigo"
    }
  ];

  const cropTypes = [
    t('feedback.crops.wheat'), t('feedback.crops.rice'), t('feedback.crops.cotton'), t('feedback.crops.sugarcane'), t('feedback.crops.tomato'), t('feedback.crops.onion'), 
    t('feedback.crops.potato'), t('feedback.crops.corn'), t('feedback.crops.soybean'), t('feedback.crops.barley'), t('feedback.crops.other')
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Feedback submitted:", { ...formData, rating });
    // Handle form submission
  };

  return (
    <div className="min-h-screen py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-text-dark mb-6">
            {t('feedback.title')}
          </h1>
          <p className="text-xl text-text-medium max-w-3xl mx-auto">
            {t('feedback.subtitle')}
          </p>
        </div>

        {/* Interactive Feedback Slider */}
        <section className="mb-20">
          <div className="max-w-2xl mx-auto">
            <FeedbackSlider />
          </div>
        </section>

        {/* Stats */}
        <section className="mb-20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div key={index} className="glass-card p-6 text-center">
                <div className={`${stat.color} mb-4 flex justify-center`}>
                  {stat.icon}
                </div>
                <div className="text-2xl font-bold text-text-dark mb-2">
                  {stat.value}
                </div>
                <div className="text-text-medium text-sm">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Feedback Form */}
          <section>
            <div className="glass-card p-8">
              <h2 className="text-2xl font-bold text-text-dark mb-6">
                {t('feedback.share.title')}
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-text-dark font-medium mb-2">{t('feedback.form.name')}</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full px-4 py-3 border border-ivory-dark rounded-lg focus:ring-2 focus:ring-pear"
                      placeholder={t('feedback.form.namePlaceholder')}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-text-dark font-medium mb-2">{t('feedback.form.location')}</label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData({...formData, location: e.target.value})}
                      className="w-full px-4 py-3 border border-ivory-dark rounded-lg focus:ring-2 focus:ring-pear"
                      placeholder={t('feedback.form.locationPlaceholder')}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-text-dark font-medium mb-2">{t('feedback.form.cropType')}</label>
                  <select
                    value={formData.cropType}
                    onChange={(e) => setFormData({...formData, cropType: e.target.value})}
                    className="w-full px-4 py-3 border border-ivory-dark rounded-lg focus:ring-2 focus:ring-pear"
                    required
                  >
                    <option value="">{t('feedback.form.cropTypePlaceholder')}</option>
                    {cropTypes.map(crop => (
                      <option key={crop} value={crop}>{crop}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-text-dark font-medium mb-2">{t('feedback.form.rating')}</label>
                  <div className="flex space-x-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className={`p-1 transition-colors duration-200 ${
                          star <= rating ? 'text-yellow-400' : 'text-gray-300'
                        }`}
                      >
                        <Star className="w-8 h-8 fill-current" />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-text-dark font-medium mb-2">{t('feedback.form.feedback')}</label>
                  <textarea
                    value={formData.feedback}
                    onChange={(e) => setFormData({...formData, feedback: e.target.value})}
                    rows={4}
                    className="w-full px-4 py-3 border border-ivory-dark rounded-lg focus:ring-2 focus:ring-pear"
                    placeholder={t('feedback.form.feedbackPlaceholder')}
                    required
                  />
                </div>

                <div>
                  <label className="block text-text-dark font-medium mb-2">{t('feedback.form.suggestions')}</label>
                  <textarea
                    value={formData.suggestion}
                    onChange={(e) => setFormData({...formData, suggestion: e.target.value})}
                    rows={3}
                    className="w-full px-4 py-3 border border-ivory-dark rounded-lg focus:ring-2 focus:ring-pear"
                    placeholder={t('feedback.form.suggestionsPlaceholder')}
                  />
                </div>

                <button type="submit" className="btn-hero w-full">
                  {t('feedback.form.submit')}
                </button>
              </form>
            </div>
          </section>

          {/* Testimonials */}
          <section>
            <h2 className="text-2xl font-bold text-text-dark mb-6">
              {t('feedback.testimonials.title')}
            </h2>
            <div className="space-y-6">
              {testimonials.map((testimonial, index) => (
                <div key={index} className="feature-card">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-text-dark">
                        {testimonial.name}
                      </h3>
                      <p className="text-text-medium text-sm">
                        {testimonial.location} • {testimonial.crop} Farmer
                      </p>
                    </div>
                    <div className="flex space-x-1">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                      ))}
                    </div>
                  </div>
                  
                  <blockquote className="text-text-dark mb-3 italic">
                    "{testimonial.feedback}"
                  </blockquote>
                  
                  <p className="text-text-light text-sm italic">
                    Translation: "{testimonial.translation}"
                  </p>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Call to Action */}
        <section className="mt-20">
          <div className="bg-gradient-hero rounded-3xl p-12 text-center">
            <h2 className="text-3xl font-bold text-white mb-6">
              {t('feedback.cta.title')}
            </h2>
            <p className="text-xl text-ivory-light mb-8 max-w-2xl mx-auto">
              {t('feedback.cta.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="btn-hero">
                {t('feedback.cta.download')}
              </button>
              <button className="btn-secondary">
                {t('feedback.cta.contact')}
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Feedback;