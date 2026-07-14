import { parseFieldText, buildDynamicFieldsHint } from '../src/organisms/CalculatorForm';
import type { CalculatorDef, FieldDef } from '@calc/engine';

const powerField: FieldDef = {
  id: 'power',
  labelKey: 'field.power',
  quantity: 'power',
  role: 'input',
  defaultUnit: 'kW',
};

const dimensionlessField: FieldDef = {
  id: 'cosPhi',
  labelKey: 'field.cosPhi',
  quantity: 'dimensionless',
  role: 'input',
  defaultUnit: 'unit',
};

describe('parseFieldText: field text -> number in base units', () => {
  test('"1.5" with defaultUnit=kW -> 1500 (base: W)', () => {
    expect(parseFieldText(powerField, '1.5')).toBe(1500);
  });

  test('empty string -> undefined (field cleared)', () => {
    expect(parseFieldText(powerField, '')).toBeUndefined();
    expect(parseFieldText(powerField, '   ')).toBeUndefined();
  });

  test('non-numeric text -> undefined', () => {
    expect(parseFieldText(powerField, 'abc')).toBeUndefined();
  });

  test('unit factor=1 (dimensionless) -> value unchanged', () => {
    expect(parseFieldText(dimensionlessField, '0.85')).toBe(0.85);
  });

  test('field without defaultUnit -> the number as-is, no toBase', () => {
    const field: FieldDef = { id: 'n', labelKey: 'field.n', quantity: 'dimensionless', role: 'input' };
    expect(parseFieldText(field, '3')).toBe(3);
  });
});

describe('buildDynamicFieldsHint: "N of 2 filled" hint text', () => {
  const dynamicCalc: CalculatorDef = {
    id: 'demo_dynamic',
    titleKey: 'demo.title',
    descriptionKey: 'demo.desc',
    category: 'test',
    tier: 'free',
    fields: [
      { id: 'a', labelKey: 'field.a', quantity: 'dimensionless', role: 'input' },
      { id: 'b', labelKey: 'field.b', quantity: 'dimensionless', role: 'input' },
      { id: 'c', labelKey: 'field.c', quantity: 'dimensionless', role: 'input' },
    ],
    compute: () => ({}),
  };

  const dict: Record<string, string> = {
    'field.a': 'Field A',
    'field.b': 'Field B',
    'hint.enterAnyTwo': 'Enter any two values to calculate',
    'hint.oneMoreValue': 'set — enter one more value',
    'hint.solvingFrom': 'Solving from',
    'hint.and': 'and',
  };
  const resolveLabel = (key: string) => dict[key] ?? key;

  test('0 filled -> the generic "enter any two" prompt', () => {
    expect(buildDynamicFieldsHint(dynamicCalc, ['a', 'b', 'c'], {}, resolveLabel)).toBe(
      'Enter any two values to calculate',
    );
  });

  test('1 filled -> "{label} set — enter one more value"', () => {
    expect(buildDynamicFieldsHint(dynamicCalc, ['a', 'b', 'c'], { a: 5 }, resolveLabel)).toBe(
      'Field A set — enter one more value',
    );
  });

  test('2 filled -> "Solving from {A} and {B}", in dynamicRoleFieldIds order', () => {
    expect(buildDynamicFieldsHint(dynamicCalc, ['a', 'b', 'c'], { a: 5, b: 10 }, resolveLabel)).toBe(
      'Solving from Field A and Field B',
    );
  });
});
