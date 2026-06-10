import { addLocaleData } from 'react-intl';
import en from 'react-intl/locale-data/en';
import es from 'react-intl/locale-data/es';
import fr from 'react-intl/locale-data/fr';
import de from 'react-intl/locale-data/de';
import it from 'react-intl/locale-data/it';
import pt from 'react-intl/locale-data/pt';
import ja from 'react-intl/locale-data/ja';
import ko from 'react-intl/locale-data/ko';
import zh from 'react-intl/locale-data/zh';

// Import locale data
addLocaleData([...en, ...es, ...fr, ...de, ...it, ...pt, ...ja, ...ko, ...zh]);

// Import translation messages
import enMessages from './locales/en.json';
import esMessages from './locales/es.json';
import frMessages from './locales/fr.json';
import deMessages from './locales/de.json';
import itMessages from './locales/it.json';
import ptMessages from './locales/pt.json';
import jaMessages from './locales/ja.json';
import koMessages from './locales/ko.json';
import zhMessages from './locales/zh.json';

export const messages = {
  en: enMessages,
  es: esMessages,
  fr: frMessages,
  de: deMessages,
  it: itMessages,
  pt: ptMessages,
  ja: jaMessages,
  ko: koMessages,
  zh: zhMessages,
};

export const defaultLocale = 'en';

export const supportedLocales = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹' },
  { code: 'pt', name: 'Português', flag: '🇵🇹' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
  { code: 'ko', name: '한국어', flag: '🇰🇷' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
];

// Function to get browser locale
export const getBrowserLocale = () => {
  if (typeof window === 'undefined') return defaultLocale;
  
  const browserLocale = navigator.language || navigator.userLanguage;
  const localeCode = browserLocale.split('-')[0];
  
  return supportedLocales.find(locale => locale.code === localeCode)?.code || defaultLocale;
};

// Function to format date based on locale
export const formatDate = (date, locale = defaultLocale, options = {}) => {
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...options,
  }).format(date);
};

// Function to format time based on locale
export const formatTime = (date, locale = defaultLocale, options = {}) => {
  return new Intl.DateTimeFormat(locale, {
    hour: '2-digit',
    minute: '2-digit',
    ...options,
  }).format(date);
};

// Function to format number based on locale
export const formatNumber = (number, locale = defaultLocale, options = {}) => {
  return new Intl.NumberFormat(locale, options).format(number);
};

// Function to format currency based on locale
export const formatCurrency = (amount, locale = defaultLocale, currency = 'USD') => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(amount);
};

// Function to get RTL direction for locale
export const getDirection = (locale) => {
  const rtlLocales = ['ar', 'he', 'fa', 'ur'];
  return rtlLocales.includes(locale) ? 'rtl' : 'ltr';
};

// Function to get text alignment for locale
export const getTextAlign = (locale) => {
  return getDirection(locale) === 'rtl' ? 'right' : 'left';
};

export default messages;
