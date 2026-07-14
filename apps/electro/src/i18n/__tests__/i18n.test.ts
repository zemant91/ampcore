import { decimalSeparatorFor, SUPPORTED_LANGUAGES } from '../i18n';

describe('decimalSeparatorFor: PL/DE/FR/IT/ES use comma, EN uses period', () => {
  test('en -> period', () => {
    expect(decimalSeparatorFor('en')).toBe('.');
  });

  test.each(['pl', 'de', 'fr', 'it', 'es'])('%s -> comma', (lang) => {
    expect(decimalSeparatorFor(lang)).toBe(',');
  });

  test('unknown/unsupported language code -> defaults to period', () => {
    expect(decimalSeparatorFor('ja')).toBe('.');
  });

  test('SUPPORTED_LANGUAGES lists exactly the 6 shipped locales', () => {
    expect([...SUPPORTED_LANGUAGES].sort()).toEqual(['de', 'en', 'es', 'fr', 'it', 'pl']);
  });
});
