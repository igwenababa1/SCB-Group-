import React, { createContext, useState, useCallback, useContext, useMemo, useEffect } from 'react';
import type { Language, Currency, TranslationKey } from '../types';
import { LANGUAGES, CURRENCIES, EXCHANGE_RATES, TRANSLATIONS } from '../i18n';

// --- Theme Context ---
type Theme = 'light' | 'dark';

interface ThemeContextType {
    theme: Theme;
    toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [theme, setTheme] = useState<Theme>('light');

    useEffect(() => {
        const savedTheme = localStorage.getItem('scb-theme') as Theme;
        const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (savedTheme) {
            setTheme(savedTheme);
        } else if (prefersDark) {
            setTheme('dark');
        }
    }, []);

    useEffect(() => {
        const root = document.documentElement;
        if (theme === 'dark') {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
        localStorage.setItem('scb-theme', theme);
    }, [theme]);

    const toggleTheme = useCallback(() => {
        setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
    }, []);

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = (): ThemeContextType => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};

// --- Language Context ---
interface LanguageContextType {
    language: Language;
    setLanguage: (language: Language) => void;
    t: (key: TranslationKey, replacements?: Record<string, string>) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [language, setLanguage] = useState<Language>(LANGUAGES[0]);

    const t = useCallback((key: TranslationKey, replacements: Record<string, string> = {}) => {
        let translation = TRANSLATIONS[language.code][key] || TRANSLATIONS['en'][key];
        Object.keys(replacements).forEach(rKey => {
            translation = translation.replace(`{${rKey}}`, replacements[rKey]);
        });
        return translation;
    }, [language]);

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = (): LanguageContextType => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};

// --- Currency Context ---
interface CurrencyContextType {
    currency: Currency;
    setCurrency: (currency: Currency) => void;
    exchangeRate: number;
    language: Language; // Pass language for formatting
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { language } = useLanguage();
    const [currency, setCurrency] = useState<Currency>(CURRENCIES[0]);
    
    const exchangeRate = useMemo(() => EXCHANGE_RATES[currency.code], [currency]);

    return (
        <CurrencyContext.Provider value={{ currency, setCurrency, exchangeRate, language }}>
            {children}
        </CurrencyContext.Provider>
    );
};

export const useCurrency = (): CurrencyContextType => {
    const context = useContext(CurrencyContext);
    if (!context) {
        throw new Error('useCurrency must be used within a CurrencyProvider');
    }
    return context;
};