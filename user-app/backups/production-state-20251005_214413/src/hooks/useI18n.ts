import { useTranslation } from 'react-i18next';
import { useCallback } from 'react';

export const useI18n = () => {
  const { t, i18n } = useTranslation();

  const changeLanguage = useCallback((lng: string) => {
    i18n.changeLanguage(lng);
  }, [i18n]);

  const getCurrentLanguage = useCallback(() => {
    return i18n.language;
  }, [i18n]);

  const getSupportedLanguages = useCallback(() => {
    return ['nl', 'en', 'de', 'es', 'fr', 'ja', 'ko'];
  }, []);

  const getLanguageLabel = useCallback((lng: string) => {
    const labels: Record<string, string> = {
      'nl': 'Nederlands',
      'en': 'English',
      'de': 'Deutsch',
      'es': 'Español',
      'fr': 'Français',
      'ja': '日本語',
      'ko': '한국어'
    };
    return labels[lng] || lng;
  }, []);

  return {
    t,
    changeLanguage,
    getCurrentLanguage,
    getSupportedLanguages,
    getLanguageLabel,
    currentLanguage: i18n.language
  };
};