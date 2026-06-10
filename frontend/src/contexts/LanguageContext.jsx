import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { IntlProvider } from 'react-intl';
import { messages, defaultLocale, supportedLocales, getBrowserLocale } from '../i18n';

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider = ({ children }) => {
  const [locale, setLocale] = useState(() => {
    // Get saved locale from localStorage or browser locale
    if (typeof window !== 'undefined') {
      const savedLocale = localStorage.getItem('gametracker-locale');
      return savedLocale || getBrowserLocale();
    }
    return defaultLocale;
  });

  const [loading, setLoading] = useState(true);

  // Load locale data
  useEffect(() => {
    const loadLocale = async () => {
      try {
        setLoading(true);
        // In a real app, you might load locale data dynamically here
        // For now, we're using static imports
        setLoading(false);
      } catch (error) {
        console.error('Error loading locale:', error);
        setLoading(false);
      }
    };

    loadLocale();
  }, []);

  // Save locale to localStorage when it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('gametracker-locale', locale);
    }
  }, [locale]);

  // Change language
  const changeLanguage = (newLocale) => {
    if (supportedLocales.find(l => l.code === newLocale)) {
      setLocale(newLocale);
    } else {
      console.warn(`Unsupported locale: ${newLocale}`);
    }
  };

  // Get current locale info
  const currentLocale = useMemo(() => {
    return supportedLocales.find(l => l.code === locale) || supportedLocales[0];
  }, [locale]);

  // Format functions
  const formatMessage = (id, values = {}) => {
    try {
      return messages[locale]?.[id] || messages[defaultLocale]?.[id] || id;
    } catch (error) {
      console.error(`Error formatting message ${id}:`, error);
      return id;
    }
  };

  const formatDate = (date, options = {}) => {
    try {
      return new Intl.DateTimeFormat(locale, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        ...options,
      }).format(date);
    } catch (error) {
      console.error('Error formatting date:', error);
      return date.toString();
    }
  };

  const formatTime = (date, options = {}) => {
    try {
      return new Intl.DateTimeFormat(locale, {
        hour: '2-digit',
        minute: '2-digit',
        ...options,
      }).format(date);
    } catch (error) {
      console.error('Error formatting time:', error);
      return date.toString();
    }
  };

  const formatNumber = (number, options = {}) => {
    try {
      return new Intl.NumberFormat(locale, options).format(number);
    } catch (error) {
      console.error('Error formatting number:', error);
      return number.toString();
    }
  };

  const formatCurrency = (amount, currency = 'USD') => {
    try {
      return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency,
      }).format(amount);
    } catch (error) {
      console.error('Error formatting currency:', error);
      return amount.toString();
    }
  };

  // Get text direction
  const getTextDirection = () => {
    const rtlLocales = ['ar', 'he', 'fa', 'ur'];
    return rtlLocales.includes(locale) ? 'rtl' : 'ltr';
  };

  // Get text alignment
  const getTextAlign = () => {
    return getTextDirection() === 'rtl' ? 'right' : 'left';
  };

  const value = {
    locale,
    currentLocale,
    supportedLocales,
    changeLanguage,
    formatMessage,
    formatDate,
    formatTime,
    formatNumber,
    formatCurrency,
    getTextDirection,
    getTextAlign,
    loading,
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        fontSize: '18px',
        color: '#666'
      }}>
        Loading...
      </div>
    );
  }

  return (
    <LanguageContext.Provider value={value}>
      <IntlProvider
        locale={locale}
        messages={messages[locale] || messages[defaultLocale]}
        defaultLocale={defaultLocale}
      >
        <div dir={getTextDirection()} style={{ minHeight: '100vh' }}>
          {children}
        </div>
      </IntlProvider>
    </LanguageContext.Provider>
  );
};

export default LanguageContext;
