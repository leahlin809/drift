import { useLocales } from 'expo-localization';
import { createContext, type PropsWithChildren, useContext, useMemo } from 'react';

import { resources, type SupportedLocale, type TranslationKey } from './resources';

interface LocalizationContextValue {
  locale: SupportedLocale;
  t: (key: TranslationKey) => string;
}

const LocalizationContext = createContext<LocalizationContextValue | null>(null);

function resolveLocale(languageTag: string | undefined): SupportedLocale {
  return languageTag?.toLowerCase().startsWith('zh') ? 'zh-CN' : 'en';
}

export function LocalizationProvider({ children }: PropsWithChildren) {
  const locales = useLocales();
  const locale = resolveLocale(locales[0]?.languageTag);
  const value = useMemo<LocalizationContextValue>(
    () => ({ locale, t: (key) => resources[locale][key] }),
    [locale],
  );

  return (
    <LocalizationContext.Provider value={value}>
      {children}
    </LocalizationContext.Provider>
  );
}

export function useLocalization() {
  const value = useContext(LocalizationContext);
  if (!value) {
    throw new Error('useLocalization must be used inside LocalizationProvider');
  }
  return value;
}
