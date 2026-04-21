import { fr } from './fr';
import { en } from './en';
import { useLanguage } from '../context/LanguageContext';

type Translations = typeof fr;
type TranslationKey = keyof Translations;

const dictionaries = {
  fr,
  en,
};

export function useTranslation() {
  const { language, setLanguage } = useLanguage();

  const t = (key: TranslationKey, params?: Record<string, string | number>) => {
    let str = dictionaries[language][key];
    if (!str) {
      console.warn(`Translation key not found: ${key}`);
      return key;
    }

    if (params) {
      Object.keys(params).forEach((paramKey) => {
        str = str.replace(new RegExp(`{${paramKey}}`, 'g'), String(params[paramKey]));
      });
    }

    return str;
  };

  return { t, language, setLanguage };
}
