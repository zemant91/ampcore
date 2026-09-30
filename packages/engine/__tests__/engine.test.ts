import {
  toBase,
  fromBase,
  unitForField,
  displayUnit,
  METRIC_UNIT,
  IMPERIAL_UNIT,
  DIFFERING_QUANTITIES,
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

  test('kA, kVA, MVA and kvar convert to their base units', () => {
    expect(toBase('current', 24.5, 'kA')).toBe(24500);
    expect(toBase('apparentPower', 630, 'kVA')).toBe(630000);
    expect(toBase('apparentPower', 250, 'MVA')).toBe(250e6);
    expect(fromBase('reactivePower', 42000, 'kvar')).toBe(42);
  });

  test('unknown unit throws a clear error', () => {
    expect(() => toBase('voltage', 1, 'lightyear')).toThrow(/Unknown unit/);
  });

  test('ft -> m (base unit) and back', () => {
    expect(toBase('length', 10, 'ft')).toBeCloseTo(3.048, 6);
    expect(fromBase('length', 3.048, 'ft')).toBeCloseTo(10, 6);
  });

  test('kcmil -> mm2 (base unit) and back', () => {
    expect(toBase('area', 4, 'kcmil')).toBeCloseTo(2.0268, 4);
    expect(fromBase('area', 2.0268, 'kcmil')).toBeCloseTo(4, 3);
  });

  test('F -> C (base unit) and back — non-linear (offset), not just a factor', () => {
    expect(toBase('temperature', 32, 'F')).toBeCloseTo(0, 6);
    expect(toBase('temperature', 212, 'F')).toBeCloseTo(100, 6);
    expect(fromBase('temperature', 100, 'F')).toBeCloseTo(212, 6);
  });
});

describe('unitForField: resolves the effective unit for the active units system', () => {
  test('metric -> always the field default, regardless of quantity', () => {
    expect(unitForField('length', 'm', 'metric')).toBe('m');
    expect(unitForField('voltage', 'V', 'metric')).toBe('V');
  });

  test('imperial -> the IMPERIAL_UNIT entry for length/area/temperature', () => {
    expect(unitForField('length', 'm', 'imperial')).toBe('ft');
    expect(unitForField('area', 'mm2', 'imperial')).toBe('kcmil');
    expect(unitForField('temperature', 'C', 'imperial')).toBe('F');
  });

  test('imperial -> falls through to defaultUnit for quantities with no imperial variant (V/A/ohm/W)', () => {
    expect(unitForField('voltage', 'V', 'imperial')).toBe('V');
    expect(unitForField('current', 'A', 'imperial')).toBe('A');
    expect(unitForField('resistance', 'ohm', 'imperial')).toBe('ohm');
    expect(unitForField('power', 'kW', 'imperial')).toBe('kW');
  });
});

describe('DIFFERING_QUANTITIES / METRIC_UNIT: the data UI reads to describe both systems, instead of hand-written prose', () => {
  test('DIFFERING_QUANTITIES is derived from IMPERIAL_UNIT, not a separately hand-kept list', () => {
    expect(DIFFERING_QUANTITIES.sort()).toEqual(['area', 'length', 'temperature']);
  });

  test('METRIC_UNIT has one entry per DIFFERING_QUANTITIES entry', () => {
    for (const quantity of DIFFERING_QUANTITIES) {
      expect(METRIC_UNIT[quantity]).toBeDefined();
      expect(IMPERIAL_UNIT[quantity]).toBeDefined();
    }
  });

  test('unitForField driven off METRIC_UNIT matches the hardcoded expectations above', () => {
    for (const quantity of DIFFERING_QUANTITIES) {
      expect(unitForField(quantity, METRIC_UNIT[quantity]!, 'metric')).toBe(METRIC_UNIT[quantity]);
      expect(unitForField(quantity, METRIC_UNIT[quantity]!, 'imperial')).toBe(IMPERIAL_UNIT[quantity]);
    }
  });
});

describe('displayUnit: typeset form of a unit id', () => {
  test('mm2 -> mm², C -> °C, F -> °F', () => {
    expect(displayUnit('mm2')).toBe('mm²');
    expect(displayUnit('C')).toBe('°C');
    expect(displayUnit('F')).toBe('°F');
  });

  test('units with no special display form pass through as-is', () => {
    expect(displayUnit('m')).toBe('m');
    expect(displayUnit('ft')).toBe('ft');
    expect(displayUnit('kcmil')).toBe('kcmil');
    expect(displayUnit('kW')).toBe('kW');
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
      displayName: 'AmpCore',
      theme: { accent: '#F5A623' },
      calculators: [ohmsLaw], // direct import, not a barrel re-export of the domain
      upcoming: [
        { id: 'power_factor', titleKey: 'calc.powerFactor.title', descriptionKey: 'calc.powerFactor.desc', category: 'fundamentals', icon: 'pulse' },
        { id: 'short_circuit', titleKey: 'calc.shortCircuit.title', descriptionKey: 'calc.shortCircuit.desc', category: 'protection-coordination', icon: 'shield' },
      ],
      defaultUnitsSystem: 'metric',
      disclosureLevel: 'technical',
      legalDisclaimerKey: 'legal.disclaimer',
      onboarding: { welcomeTitleKey: 'onboarding.welcome.title', welcomeBodyKey: 'onboarding.welcome.body' },
      paywall: { valueProps: ['paywall.cableChain', 'paywall.pdfExport', 'paywall.unlimitedHistory'] },
      supportEmail: 'feedback@electrocalc.eu',
    };

    expect(electro.calculators).toHaveLength(1);
    expect(electro.calculators[0]!.id).toBe('ohms_law');
  });
});
