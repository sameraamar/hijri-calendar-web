import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './en.json';
import ar from './ar.json';

export const supportedLanguages = ['en', 'ar'] as const;
export type SupportedLanguage = (typeof supportedLanguages)[number];

const resources = {
  en: { translation: en },
  ar: { translation: ar }
} as const;

export function isRtlLanguage(lang: SupportedLanguage): boolean {
  return lang === 'ar';
}

export function initI18n(initialLanguage: SupportedLanguage = 'en'): void {
  if (i18n.isInitialized) return;

  i18n
    .use(initReactI18next)
    .init({
      resources,
      lng: initialLanguage,
      fallbackLng: 'en',
      interpolation: { escapeValue: false }
    });
}

export default i18n;
