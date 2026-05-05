import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { loadSiteContent, DEFAULT_LOCALE } from './content';
import { DEFAULT_SITE_CONTENT } from './content.default';
import { Locale, SiteContent } from './types';

interface SiteContentContextValue {
  content: SiteContent;
  setContent: React.Dispatch<React.SetStateAction<SiteContent>>;
  locale: Locale;
  setLocale: (locale: Locale) => void;
  isLoading: boolean;
  reloadContent: () => Promise<void>;
}

const SiteContentContext = createContext<SiteContentContextValue | null>(null);

const SUPPORTED_LOCALES: Locale[] = ['az', 'en', 'ru', 'tr'];

function normalizeLocale(value: string | null | undefined): Locale {
  if (value && SUPPORTED_LOCALES.includes(value as Locale)) {
    return value as Locale;
  }
  return DEFAULT_LOCALE as Locale;
}

export function SiteContentProvider({ children }: { children: React.ReactNode }) {
  const [content, setContent] = useState<SiteContent>(DEFAULT_SITE_CONTENT);
  const [isLoading, setIsLoading] = useState(true);
  const [locale, setLocaleState] = useState<Locale>(() => {
    if (typeof window === 'undefined') {
      return DEFAULT_LOCALE as Locale;
    }

    const urlLocale = new URLSearchParams(window.location.search).get('lang');
    if (urlLocale) {
      return normalizeLocale(urlLocale);
    }

    const storedLocale = localStorage.getItem('site_locale');
    return normalizeLocale(storedLocale);
  });

  const reloadContent = useCallback(async () => {
    setIsLoading(true);
    const loaded = await loadSiteContent();
    setContent(loaded);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    reloadContent();
  }, [reloadContent]);

  const setLocale = useCallback((nextLocale: Locale) => {
    const normalized = normalizeLocale(nextLocale);
    setLocaleState(normalized);
    localStorage.setItem('site_locale', normalized);
  }, []);

  const value = useMemo(
    () => ({
      content,
      setContent,
      locale,
      setLocale,
      isLoading,
      reloadContent,
    }),
    [content, locale, setLocale, isLoading, reloadContent],
  );

  return <SiteContentContext.Provider value={value}>{children}</SiteContentContext.Provider>;
}

export function useSiteContent() {
  const context = useContext(SiteContentContext);
  if (!context) {
    throw new Error('useSiteContent must be used within SiteContentProvider');
  }
  return context;
}
