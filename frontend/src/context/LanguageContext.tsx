// src/context/LanguageContext.tsx
import { createContext, useContext, useState, type ReactNode } from "react";
import en from "../locales/en";
import si from "../locales/si";
import ta from "../locales/ta";

type Language = "en" | "si" | "ta";

interface LangContextProps {
  language: Language;
  t: (key: string) => string;
  changeLanguage: (lang: Language) => void;
}

const LanguageContext = createContext<LangContextProps>({
  language: "en",
  t: (key) => key,
  changeLanguage: () => {},
});

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>(
    (localStorage.getItem("lang") as Language) || "en"
  );

  const translations: Record<Language, Record<string, string>> = { en, si, ta };

  const t = (key: string): string => {
    return translations[language][key] ?? key;
  };

  const changeLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem("lang", lang);
  };

  return (
    <LanguageContext.Provider value={{ language, t, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLang = () => useContext(LanguageContext);