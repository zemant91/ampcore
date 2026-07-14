import { solveKwToAmps, kwToAmps } from '@calc/calculators-electrical';
import { toBase } from '@calc/engine';
import type { DataAccess } from '@calc/engine';

/**
 * Mirrors exactly what the UI does before calling compute(): parse the raw
 * text against the field's OWN declared quantity/defaultUnit via toBase()
 * (see @calc/ui CalculatorForm.parseFieldText) — not a hardcoded conversion
 * factor here, so this actually exercises the field schema, not a copy of it.
 */
function parseFieldTextLikeUi(fieldId: 'power' | 'voltage', text: string): number {
  const field = kwToAmps.fields.find((f) => f.id === fieldId)!;
  return field.defaultUnit ? toBase(field.quantity, Number(text), field.defaultUnit) : Number(text);
}

describe('solveKwToAmps: DC', () => {
  test('P=1000W, U=230V -> I ≈ 4.3478A', () => {
    const out = solveKwToAmps({ system: 'dc', power: 1000, voltage: 230 });
    expect(out.current).toBeCloseTo(1000 / 230, 6);
  });
});

describe('solveKwToAmps: 1PH — P/(U·cosφ)', () => {
  test('P=1000W, U=230V, cosφ=0.85 -> I ≈ 5.1153A', () => {
    const out = solveKwToAmps({ system: '1ph', power: 1000, voltage: 230, cosPhi: 0.85 });
    expect(out.current).toBeCloseTo(1000 / (230 * 0.85), 6);
  });

  test('cosφ not given -> defaults to 1 (same as in ohms_law)', () => {
    const out = solveKwToAmps({ system: '1ph', power: 1000, voltage: 230 });
    expect(out.current).toBeCloseTo(1000 / 230, 6);
  });
});

describe('solveKwToAmps: 3PH — P/(√3·U·cosφ)', () => {
  test('P=1000W, U=400V, cosφ=0.85 -> I ≈ 1.6997A', () => {
    const out = solveKwToAmps({ system: '3ph', power: 1000, voltage: 400, cosPhi: 0.85 });
    expect(out.current).toBeCloseTo(1000 / (Math.sqrt(3) * 400 * 0.85), 6);
  });
});

describe('regression: power field must convert kW -> W before compute() (unit-skip bug)', () => {
  test('DC, P="11000" (kW), U="11" (V) -> I = 1,000,000 A, not 1,000 A', () => {
    // A field-schema check, not a hand-typed constant: power's defaultUnit
    // is 'kW' (base W), so parsing "11000" through the field's own schema
    // must yield 11,000,000 W. If toBase() were skipped (the reported bug),
    // this would silently stay 11000 and produce I=1000A instead of 1e6 A.
    const power = parseFieldTextLikeUi('power', '11000');
    const voltage = parseFieldTextLikeUi('voltage', '11');
    expect(power).toBe(11_000_000);
    expect(voltage).toBe(11);

    const out = solveKwToAmps({ system: 'dc', power, voltage });
    expect(out.current).toBeCloseTo(1_000_000, 6);
  });
});

describe('CalculatorDef kwToAmps: engine integration', () => {
  const dummyData: DataAccess = {
    lookup: () => {
      throw new Error('kw_to_amps does not use reference tables');
    },
  };

  test('compute() delegates to solveKwToAmps', () => {
    const out = kwToAmps.compute({ system: 'dc', power: 1000, voltage: 230 }, dummyData);
    expect(out.current).toBeCloseTo(1000 / 230, 6);
  });

  test('validate(): power/voltage are required', () => {
    expect(kwToAmps.validate!({ system: 'dc', voltage: 230 } as never)).toEqual([
      'error.missingRequiredFields',
    ]);
    expect(kwToAmps.validate!({ system: 'dc', power: 1000, voltage: 230 })).toBeNull();
  });

  test('cosPhi is hidden for DC (visibleIf)', () => {
    const field = kwToAmps.fields.find((f) => f.id === 'cosPhi')!;
    expect(field.visibleIf!({ system: 'dc' })).toBe(false);
    expect(field.visibleIf!({ system: '3ph' })).toBe(true);
  });

  test('warnings(): division by zero at U=0 -> Infinity -> warning', () => {
    const inputs = { system: 'dc' as const, power: 1000, voltage: 0 };
    const out = solveKwToAmps(inputs);
    expect(Number.isFinite(out.current)).toBe(false);
    expect(kwToAmps.warnings!(inputs, out)).toEqual(['warn.divisionByZero']);
  });
});
