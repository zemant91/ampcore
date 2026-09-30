import { electro } from '../../brand';
import { en } from '../resources/en';

/** Every static i18n key a calculator declares (titles, field labels, options, formulas, chain buttons) must exist — a missing one renders as a raw token. */
test('every key the brand\'s calculators declare exists in en.ts', () => {
  const keys: string[] = [];
  for (const calc of electro.calculators) {
    keys.push(calc.titleKey, calc.descriptionKey, ...(calc.formulaKeys?.({}) ?? []));
    for (const chain of calc.chainTo ?? []) keys.push(chain.labelKey);
    for (const field of calc.fields) {
      if (typeof field.labelKey === 'string') keys.push(field.labelKey);
      for (const option of field.options ?? []) {
        keys.push(option.labelKey);
        if (option.descriptionKey) keys.push(option.descriptionKey);
      }
    }
  }
  expect(keys.filter((key) => !(key in en))).toEqual([]);
});
