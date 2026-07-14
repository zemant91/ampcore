import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { findBestLanguageTag } from 'react-native-localize';
import { MMKV } from 'react-native-mmkv';
import { en } from './resources/en';
import { pl } from './resources/pl';
import { de } from './resources/de';
import { fr } from './resources/fr';
import { it } from './resources/it';
import { es } from './resources/es';

export const SUPPORTED_LANGUAGES = ['en', 'pl', 'de', 'fr', 'it', 'es'] as const;
export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

/** PL/DE/FR/IT/ES all use comma as the decimal separator; only EN uses period. */
const COMMA_DECIMAL_LANGUAGES: ReadonlySet<SupportedLanguage> = new Set(['pl', 'de', 'fr', 'it', 'es']);

export function decimalSeparatorFor(language: string): ',' | '.' {
  return COMMA_DECIMAL_LANGUAGES.has(language as SupportedLanguage) ? ',' : '.';
}

function isSupportedLanguage(value: string | undefined): value is SupportedLanguage {
  return value !== undefined && (SUPPORTED_LANGUAGES as readonly string[]).includes(value);
}

const LANGUAGE_STORAGE_KEY = 'electrocalc_language';
const languageStorage = new MMKV({ id: 'electrocalc-settings' });

export function getStoredLanguage(): SupportedLanguage | undefined {
  const stored = languageStorage.getString(LANGUAGE_STORAGE_KEY);
  return isSupportedLanguage(stored) ? stored : undefined;
}

export function persistLanguage(language: SupportedLanguage): void {
  languageStorage.set(LANGUAGE_STORAGE_KEY, language);
}

/**
 * A manual override (persisted in MMKV) wins over the device locale, which
 * wins over the 'en' fallback — findBestLanguageTag matches the device's
 * ranked locale list against our supported set instead of just taking
 * getLocales()[0], so e.g. a device set to "Breton, then French" still
 * resolves to 'fr' instead of falling back straight to 'en'.
 */
export function detectInitialLanguage(): SupportedLanguage {
  const stored = getStoredLanguage();
  if (stored) return stored;

  const best = findBestLanguageTag(SUPPORTED_LANGUAGES);
  return best?.languageTag ?? 'en';
}

export function setLanguage(language: SupportedLanguage): void {
  persistLanguage(language);
  i18n.changeLanguage(language).catch(() => {});
}

if (!i18n.isInitialized) {
  i18n.use(initReactI18next).init({
    resources: {
      en: { translation: en },
      pl: { translation: pl },
      de: { translation: de },
      fr: { translation: fr },
      it: { translation: it },
      es: { translation: es },
    },
    lng: detectInitialLanguage(),
    fallbackLng: 'en',
    // Existing labelKey/titleKey values are flat strings containing literal
    // dots (e.g. 'field.system') — disable i18next's nested-object key
    // parsing so those are treated as single flat keys, not nested paths.
    keySeparator: false,
    nsSeparator: false,
    interpolation: { escapeValue: false },
  });
}

export default i18n;
