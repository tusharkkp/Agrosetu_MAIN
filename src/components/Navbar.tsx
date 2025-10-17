import { 
  Home, 
  Brain, 
  Leaf, 
  CloudRain, 
  Bug, 
  TrendingUp, 
  Mic, 
  MessageSquare 
} from "lucide-react";
import { NavBar } from "./ui/tubelight-navbar";
import { useAuth } from "@/components/auth/AuthProvider";
import AuthModal from "@/components/auth/AuthModal";
import { Link } from "react-router-dom";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import SkyToggle from "@/components/ui/sky-toggle";
import { useLanguage } from "@/context/LanguageContext";
import { useTranslation } from "react-i18next";

const Navbar = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { language, setLanguage } = useLanguage();

  const navItems = [
    { name: t('nav.home'), url: "/", icon: Home },
    { name: t('nav.problem'), url: "/problem-impact", icon: Brain },
    { name: t('nav.soil'), url: "/soil-guidance", icon: Leaf },
    { name: t('nav.weather'), url: "/weather-alerts", icon: CloudRain },
    { name: t('nav.pest'), url: "/pest-detection", icon: Bug },
    { name: t('nav.market'), url: "/market-prices", icon: TrendingUp },
    { name: t('nav.voice'), url: "/voice-chatbot", icon: Mic },
    { name: t('nav.feedback'), url: "/feedback", icon: MessageSquare },
  ];

  return (
    <NavBar
      items={navItems}
      className=""
      rightContent={
        <div className="flex items-center">
          {user ? (
            <AccountMenu />
          ) : (
            <AuthModal
              trigger={
                <button
                  className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 font-poppins hover:text-pear"
                  style={{ color: '#1a1a1a' }}
                >
                  {t('nav.signIn')}
                </button>
              }
            />
          )}
          <div className="ml-3">
            <SkyToggle
              checked={language === 'pa'}
              onToggle={(checked) => setLanguage(checked ? 'pa' : 'en')}
            />
          </div>
        </div>
      }
    />
  );
};

const AccountMenu = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const name = (user?.user_metadata as any)?.full_name as string | undefined;
  const initials = name ? name.split(' ').map(s=>s[0]).join('').slice(0,2).toUpperCase() : 'ME';
  const avatar = (user?.user_metadata as any)?.avatar_url as string | undefined;
  return (
    <div className="flex items-center gap-3">
      <Avatar className="h-8 w-8">
        {avatar ? <AvatarImage src={avatar} alt={name || 'User'} /> : <AvatarFallback>{initials}</AvatarFallback>}
      </Avatar>
      <span className="text-sm" style={{ color: '#1a1a1a' }}>{name || t('nav.myAccount')}</span>
      <button
        onClick={async () => {
          const { supabase } = await import("@/lib/supabaseClient");
          await supabase.auth.signOut();
        }}
        className="px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-300 font-poppins hover:text-pear"
        style={{ color: '#1a1a1a' }}
      >
        {t('nav.signOut')}
      </button>
    </div>
  );
};

export default Navbar;