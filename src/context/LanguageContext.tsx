import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useTranslation } from 'react-i18next';

type Lang = 'en' | 'pa';

type Ctx = {
  language: Lang;
  setLanguage: (l: Lang) => void;
  toggleLanguage: () => void;
};

const LanguageContext = createContext<Ctx | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const { i18n } = useTranslation();
  const [language, setLanguageState] = useState<Lang>('en');

  useEffect(() => {
    const saved = (localStorage.getItem('agrosetu_lang') as Lang | null) || 'en';
    setLanguageState(saved);
    i18n.changeLanguage(saved);
  }, [i18n]);

  const setLanguage = (l: Lang) => {
    setLanguageState(l);
    localStorage.setItem('agrosetu_lang', l);
    i18n.changeLanguage(l);
  };

  const toggleLanguage = () => setLanguage(language === 'en' ? 'pa' : 'en');

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
};


