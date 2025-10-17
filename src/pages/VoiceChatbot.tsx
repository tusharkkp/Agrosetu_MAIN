import { MeshGradientSVG } from "@/components/ui/shader-svg";
import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";

const VoiceChatbot = () => {
  const { t } = useTranslation();
  const widgetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const insertWidget = () => {
      if (widgetRef.current) {
        widgetRef.current.innerHTML = '<elevenlabs-convai agent-id="agent_7901k5br0kd2e538gxsv4hdqz26d"></elevenlabs-convai>';
      }
    };

    const existing = document.querySelector('script[src="https://unpkg.com/@elevenlabs/convai-widget-embed"]') as HTMLScriptElement | null;
    if (existing) {
      insertWidget();
    } else {
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/@elevenlabs/convai-widget-embed';
      script.async = true;
      script.type = 'text/javascript';
      script.onload = insertWidget;
      document.head.appendChild(script);
    }

    return () => {
      if (widgetRef.current) {
        widgetRef.current.innerHTML = '';
      }
    };
  }, []);

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-primary">{t('voice.title')}</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          {t('voice.subtitle')}
        </p>
      </div>

      {/* ElevenLabs Voice Chatbot - Right Side */}
      <div className="flex justify-end mb-8">
        <div 
          ref={widgetRef}
          className="max-h-[350px] overflow-hidden"
          style={{ maxHeight: '350px' }}
        ></div>
      </div>

      {/* Mesh Gradient Component */}
      <div className="flex justify-center">
        <MeshGradientSVG />
      </div>
    </div>
  );
};

export default VoiceChatbot;