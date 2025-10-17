import { ArrowRight, Play, Maximize2, Minimize2 } from "lucide-react";
import heroImage from "@/assets/hero-farming.jpg";
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "@/components/ui/dialog";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";

const QR_IMAGE_SRC = "/qr-download.png"; // place the provided QR image into public as qr-download.png
const DEMO_VIDEO_SRC = "/demo.mp4"; // place your demo video into public as demo.mp4

const VideoDialog = () => {
  const { t } = useTranslation();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [expanded, setExpanded] = useState(false);
  const [aspect, setAspect] = useState<number | null>(null);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="btn-secondary group">
          <Play className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-300" />
          {t('hero.cta.watchDemo')}
        </button>
      </DialogTrigger>
      <DialogContent
        className={expanded ? "w-[96vw] max-w-6xl p-0 overflow-hidden" : "sm:max-w-3xl p-0 overflow-hidden"}
      >
        <div className="relative bg-background">
          <div className="flex items-center justify-between px-4 pt-4">
            <DialogTitle className="text-center w-full">{t('modal.demo.title')}</DialogTitle>
            <button
              aria-label={expanded ? t('modal.fullscreen.exit') : t('modal.fullscreen.enter')}
              className="absolute right-12 top-4 text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => setExpanded((v) => !v)}
            >
              {expanded ? <Minimize2 className="h-5 w-5" /> : <Maximize2 className="h-5 w-5" />}
            </button>
          </div>
          <div className="p-4">
            <div className="rounded-xl overflow-hidden shadow-lg bg-black">
              <div
                className="w-full"
                style={{ aspectRatio: (aspect ?? (16 / 9)) as unknown as string }}
              >
                <video
                  ref={videoRef}
                  className="w-full h-full object-contain bg-black block"
                  controls
                  preload="metadata"
                  playsInline
                  onLoadedMetadata={() => {
                    const el = videoRef.current;
                    if (el && el.videoWidth && el.videoHeight) {
                      setAspect(el.videoWidth / el.videoHeight);
                    }
                  }}
                >
                  <source src={DEMO_VIDEO_SRC} type="video/mp4" />
                </video>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const Hero = () => {
  const { t } = useTranslation();
  
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt="Modern sustainable farming with technology"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-hero opacity-70"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 animate-fade-up">
            {t('hero.title')}
            <span className="block text-4xl md:text-5xl font-semibold text-pear-light mt-2">
              {t('brand.tagline')}
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-ivory-light mb-12 max-w-3xl mx-auto leading-relaxed animate-fade-up [animation-delay:200ms]">
            {t('brand.description')} {t('brand.subtitle')}
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center animate-fade-up [animation-delay:400ms]">
            <Dialog>
              <DialogTrigger asChild>
                <button className="btn-hero group">
                  <ArrowRight className="w-5 h-5 mr-2 group-hover:translate-x-1 transition-transform duration-300" />
                  {t('hero.cta.getApp')}
                </button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md p-0 overflow-hidden">
                <div className="p-6">
                  <DialogTitle className="text-center mb-4">{t('modal.qr.title')}</DialogTitle>
                  <div className="rounded-xl overflow-hidden shadow-lg">
                    <img src={QR_IMAGE_SRC} alt="AgroSetu app QR" className="w-full h-auto" />
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            
            {/* Watch Demo Modal */}
            <VideoDialog />
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20 animate-fade-up [animation-delay:600ms]">
            <div className="glass-card p-6 text-center">
              <div className="text-3xl font-bold text-pear mb-2">0</div>
              <div className="text-text-dark">{t('stats.farmersHelped')}</div>
            </div>
            <div className="glass-card p-6 text-center">
              <div className="text-3xl font-bold text-pear mb-2">93%</div>
              <div className="text-text-dark">{t('stats.accuracyRate')}</div>
            </div>
            <div className="glass-card p-6 text-center">
              <div className="text-3xl font-bold text-pear mb-2">15+</div>
              <div className="text-text-dark">{t('stats.cropTypes')}</div>
            </div>
            <div className="glass-card p-6 text-center">
              <div className="text-3xl font-bold text-pear mb-2">24/7</div>
              <div className="text-text-dark">{t('stats.aiSupport')}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;