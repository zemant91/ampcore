import {
  toBase,
  fromBase,
  getDuplicateFieldIds,
  hasNoOutputFields,
  resolveFieldLabel,
  resolveFieldSymbol,
} from '@calc/engine';
import type { CalculatorDef, BrandConfig, FieldDef } from '@calc/engine';
import { ohmsLaw } from '@calc/calculators-electrical';

describe('units: toBase / fromBase', () => {
  test('kV -> V (base unit) and back', () => {
    expect(toBase('voltage', 2.3, 'kV')).toBe(2300);
    expect(fromBase('voltage', 2300, 'kV')).toBe(2.3);
  });

  test('mA -> A', () => {
    expect(toBase('current', 500, 'mA')).toBeCloseTo(0.5, 6);
  });

  test('unknown unit throws a clear error', () => {
    expect(() => toBase('voltage', 1, 'lightyear')).toThrow(/Unknown unit/);
  });
});

describe('validate: schema sanity checks', () => {
  const goodDef: CalculatorDef = {
    id: 'demo',
    titleKey: 'demo.title',
    descriptionKey: 'demo.desc',
    category: 'test',
    tier: 'free',
    fields: [
      { id: 'a', labelKey: 'a', quantity: 'dimensionless', role: 'input' },
      { id: 'b', labelKey: 'b', quantity: 'dimensionless', role: 'output' },
    ],
    compute: () => ({}),
  };

  test('getDuplicateFieldIds finds duplicate ids', () => {
    const withDupe: CalculatorDef = {
      ...goodDef,
      fields: [...goodDef.fields, { id: 'a', labelKey: 'a2', quantity: 'dimensionless', role: 'input' }],
    };
    expect(getDuplicateFieldIds(goodDef)).toEqual([]);
    expect(getDuplicateFieldIds(withDupe)).toEqual(['a']);
  });

  test('hasNoOutputFields catches a calculator with no output fields', () => {
    const noOutput: CalculatorDef = {
      ...goodDef,
      fields: goodDef.fields.filter((f) => f.role !== 'output'),
    };
    expect(hasNoOutputFields(goodDef)).toBe(false);
    expect(hasNoOutputFields(noOutput)).toBe(true);
  });
});

describe('resolveFieldLabel / resolveFieldSymbol', () => {
  test('a static string is returned as-is', () => {
    const field: FieldDef = { id: 'x', labelKey: 'field.x', symbol: 'X', quantity: 'dimensionless', role: 'input' };
    expect(resolveFieldLabel(field, {})).toBe('field.x');
    expect(resolveFieldSymbol(field, {})).toBe('X');
  });

  test('a function is called with the current values (real case: resistance -> Z in ohms_law)', () => {
    const field = ohmsLaw.fields.find((f) => f.id === 'resistance')!;
    expect(resolveFieldLabel(field, { system: 'dc' })).toBe('field.resistance');
    expect(resolveFieldLabel(field, { system: '3ph' })).toBe('field.impedance');
    expect(resolveFieldSymbol(field, { system: '1ph' })).toBe('Z');
  });

  test('a field without symbol -> undefined, doesn\'t throw', () => {
    const field: FieldDef = { id: 'y', labelKey: 'field.y', quantity: 'dimensionless', role: 'input' };
    expect(resolveFieldSymbol(field, {})).toBeUndefined();
  });
});

describe('BrandConfig: smoke test with the real electro brand', () => {
  test('assembles from the already-written ohms_law with no type or runtime errors', () => {
    const electro: BrandConfig = {
      id: 'electro',
      displayName: 'ElectroCalc EU',
      theme: { accent: '#F5A623' },
      calculators: [ohmsLaw], // direct import, not a barrel re-export of the domain
      upcoming: [
        { id: 'power_factor', titleKey: 'calc.powerFactor.title', descriptionKey: 'calc.powerFactor.desc', category: 'fundamentals', icon: 'pulse' },
        { id: 'short_circuit', titleKey: 'calc.shortCircuit.title', descriptionKey: 'calc.shortCircuit.desc', category: 'protection-coordination', icon: 'shield' },
      ],
      defaultUnitsSystem: 'metric',
      disclosureLevel: 'technical',
      legalDisclaimer: { en: 'Results are for reference only.', pl: 'Wyniki mają charakter poglądowy.' },
      paywall: { valueProps: ['paywall.cableChain', 'paywall.pdfExport', 'paywall.unlimitedHistory'] },
    };

    expect(electro.calculators).toHaveLength(1);
    expect(electro.calculators[0]!.id).toBe('ohms_law');
  });
});
