import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation files
import nlTranslations from './locales/nl.json';
import enTranslations from './locales/en.json';
import deTranslations from './locales/de.json';
import esTranslations from './locales/es.json';
import frTranslations from './locales/fr.json';
import jaTranslations from './locales/ja.json';
import koTranslations from './locales/ko.json';

const resources = {
  nl: {
    translation: nlTranslations
  },
  en: {
    translation: enTranslations
  },
  de: {
    translation: deTranslations
  },
  es: {
    translation: esTranslations
  },
  fr: {
    translation: frTranslations
  },
  ja: {
    translation: jaTranslations
  },
  ko: {
    translation: koTranslations
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'nl', // Default to Dutch (current primary language)
    debug: process.env.NODE_ENV === 'development',
    
    interpolation: {
      escapeValue: false, // React already does escaping
    },
    
    detection: {
      // Order and from where user language should be detected
      order: ['localStorage', 'navigator', 'htmlTag'],
      
      // Keys or params to lookup language from
      lookupLocalStorage: 'i18nextLng',
      
      // Cache user language on
      caches: ['localStorage']
    },
    
    // Only load languages we support
      // Supported languages
    supportedLngs: ['en', 'nl', 'de', 'es', 'fr', 'ja', 'ko'],
    
    // Namespace configuration
    defaultNS: 'translation',
    ns: ['translation'],
    
    // Key separator and nesting separator
    keySeparator: '.',
    nsSeparator: false,
    
    // Loading configuration
    load: 'languageOnly', // Load 'en' instead of 'en-US'
    
    // React specific options
    react: {
      useSuspense: false, // Disable suspense for now
      bindI18n: 'languageChanged',
      bindI18nStore: 'added',
      transEmptyNodeValue: '',
      transSupportBasicHtmlNodes: true,
      transKeepBasicHtmlNodesFor: ['br', 'strong', 'i', 'em'],
    }
  });

export default i18n;