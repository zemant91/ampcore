import { en } from '../resources/en';
import { pl } from '../resources/pl';
import { de } from '../resources/de';
import { fr } from '../resources/fr';
import { it } from '../resources/it';
import { es } from '../resources/es';

const LOCALES: Record<string, Record<string, string>> = { pl, de, fr, it, es };
const englishKeys = Object.keys(en).sort();

describe('i18n resource parity: every locale has exactly en.ts\'s key set', () => {
  for (const [code, dict] of Object.entries(LOCALES)) {
    test(`${code}.ts has no missing keys`, () => {
      const missing = englishKeys.filter((key) => !(key in dict));
      expect(missing).toEqual([]);
    });

    test(`${code}.ts has no extra keys`, () => {
      const extra = Object.keys(dict).filter((key) => !(key in en));
      expect(extra).toEqual([]);
    });

    test(`${code}.ts has no empty translations`, () => {
      const empty = Object.entries(dict)
        .filter(([, value]) => value.trim() === '')
        .map(([key]) => key);
      expect(empty).toEqual([]);
    });
  }
});
