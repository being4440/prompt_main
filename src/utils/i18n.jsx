import { createContext, useContext, useState, useEffect } from 'react';

export const translations = {
  en: {
    nav_home: "Home",
    nav_checkin: "Check-in",
    nav_chat: "Chat",
    nav_dashboard: "Dashboard",
    logout: "Log Out",
    greeting_morning: "Good morning",
    greeting_afternoon: "Good afternoon",
    greeting_evening: "Good evening",
    insights_dashboard: "Insights Dashboard",
    current_streak: "Current Streak",
    days: "days",
    language: "Language",
    geeta_settings: "Geeta Quotes"
  },
  hi: {
    nav_home: "होम",
    nav_checkin: "चेक-इन",
    nav_chat: "चैट",
    nav_dashboard: "डैशबोर्ड",
    logout: "लॉग आउट",
    greeting_morning: "सुप्रभात",
    greeting_afternoon: "नमस्कार",
    greeting_evening: "शुभ संध्या",
    insights_dashboard: "इनसाइट्स डैशबोर्ड",
    current_streak: "वर्तमान स्ट्रीक",
    days: "दिन",
    language: "भाषा",
    geeta_settings: "गीता कोट्स"
  }
};

export const I18nContext = createContext();

export const I18nProvider = ({ children }) => {
  const [lang, setLang] = useState('en');

  useEffect(() => {
    const saved = localStorage.getItem('moodmate_lang');
    if (saved) setLang(saved);
  }, []);

  const changeLang = (newLang) => {
    setLang(newLang);
    localStorage.setItem('moodmate_lang', newLang);
  };

  const t = (key) => {
    return translations[lang]?.[key] || translations['en'][key] || key;
  };

  return (
    <I18nContext.Provider value={{ lang, changeLang, t }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useTranslation = () => useContext(I18nContext);
