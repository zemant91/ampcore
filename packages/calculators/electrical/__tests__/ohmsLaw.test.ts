import { solveOhmsLaw, ohmsLaw } from '@calc/calculators-electrical';
import type { DataAccess } from '@calc/engine';

// Reference: U=12V, I=2A, R=6Ω, P=24W — consistent across all formulas.
describe('solveOhmsLaw: DC — all 6 pairs of known quantities', () => {
  test('U, I known -> R, P', () => {
    const out = solveOhmsLaw({ system: 'dc', voltage: 12, current: 2 });
    expect(out.resistance).toBeCloseTo(6, 10);
    expect(out.power).toBeCloseTo(24, 10);
  });

  test('U, R known -> I, P', () => {
    const out = solveOhmsLaw({ system: 'dc', voltage: 12, resistance: 6 });
    expect(out.current).toBeCloseTo(2, 10);
    expect(out.power).toBeCloseTo(24, 10);
  });

  test('U, P known -> I, R', () => {
    const out = solveOhmsLaw({ system: 'dc', voltage: 12, power: 24 });
    expect(out.current).toBeCloseTo(2, 10);
    expect(out.resistance).toBeCloseTo(6, 10);
  });

  test('I, R known -> U, P', () => {
    const out = solveOhmsLaw({ system: 'dc', current: 2, resistance: 6 });
    expect(out.voltage).toBeCloseTo(12, 10);
    expect(out.power).toBeCloseTo(24, 10);
  });

  test('I, P known -> U, R', () => {
    const out = solveOhmsLaw({ system: 'dc', current: 2, power: 24 });
    expect(out.voltage).toBeCloseTo(12, 10);
    expect(out.resistance).toBeCloseTo(6, 10);
  });

  test('R, P known -> U, I', () => {
    const out = solveOhmsLaw({ system: 'dc', resistance: 6, power: 24 });
    expect(out.voltage).toBeCloseTo(12, 10);
    expect(out.current).toBeCloseTo(2, 10);
  });

  test('one known quantity -> error', () => {
    expect(() => solveOhmsLaw({ system: 'dc', voltage: 12 })).toThrow(/exactly two values/);
  });

  test('all four known -> error (ambiguous which two to treat as given)', () => {
    expect(() =>
      solveOhmsLaw({ system: 'dc', voltage: 12, current: 2, resistance: 6, power: 24 }),
    ).toThrow(/exactly two values/);
  });
});

describe('solveOhmsLaw: AC 1ph — U·I·cosφ', () => {
  test('U=230V, I=10A, cosφ=0.8 -> P=1840W, S=2300VA, Q=1380var', () => {
    const out = solveOhmsLaw({ system: '1ph', voltage: 230, current: 10, cosPhi: 0.8 });
    expect(out.power).toBeCloseTo(1840, 6);
    expect(out.apparentPower).toBeCloseTo(2300, 6);
    expect(out.reactivePower).toBeCloseTo(1380, 6);
  });

  test('cosφ defaults to 1 -> Q = 0', () => {
    const out = solveOhmsLaw({ system: '1ph', voltage: 230, current: 10 });
    expect(out.power).toBeCloseTo(2300, 6);
    expect(out.reactivePower).toBeCloseTo(0, 6);
  });

  test('U, P known -> solves for I', () => {
    const out = solveOhmsLaw({ system: '1ph', voltage: 230, power: 1840, cosPhi: 0.8 });
    expect(out.current).toBeCloseTo(10, 6);
  });
});

describe('solveOhmsLaw: AC 3ph — √3·U·I·cosφ', () => {
  test('U=400V, I=10A, cosφ=0.9 -> P ≈ 6235.4W, S ≈ 6928.2VA', () => {
    const out = solveOhmsLaw({ system: '3ph', voltage: 400, current: 10, cosPhi: 0.9 });
    expect(out.power).toBeCloseTo(Math.sqrt(3) * 400 * 10 * 0.9, 4);
    expect(out.apparentPower).toBeCloseTo(Math.sqrt(3) * 400 * 10, 4);
  });
});

describe('solveOhmsLaw: AC — Z (impedance) as the matrix\'s 4th quantity (per-screenshot decision)', () => {
  test('1ph, U, Z known -> I = U/Z, P = pf·U·I (equivalent to the DC form at pf=cosφ)', () => {
    const out = solveOhmsLaw({ system: '1ph', voltage: 230, resistance: 23, cosPhi: 0.8 });
    expect(out.current).toBeCloseTo(10, 6);
    expect(out.power).toBeCloseTo(1840, 6);
  });

  test('cross-check against real numbers from the screenshot: 3ph, U=220, Z=2000, cosφ=0.01 -> I≈0.110, P≈0.419', () => {
    const out = solveOhmsLaw({ system: '3ph', voltage: 220, resistance: 2000, cosPhi: 0.01 });
    expect(out.current).toBeCloseTo(0.11, 3);
    expect(out.power).toBeCloseTo(0.419, 3);
  });

  test('Z, P known -> solves for U and I (analogous to the DC pair power,resistance)', () => {
    const out = solveOhmsLaw({ system: '1ph', resistance: 23, power: 1840, cosPhi: 0.8 });
    expect(out.voltage).toBeCloseTo(230, 4);
    expect(out.current).toBeCloseTo(10, 4);
  });

  test('DC is the special case of AC at pf=1: U,Z and U,I,cosφ=1 give the same P', () => {
    const viaZ = solveOhmsLaw({ system: '1ph', voltage: 230, resistance: 23 }); // cosPhi defaults to 1
    expect(viaZ.power).toBeCloseTo(2300, 6);
  });
});

describe('CalculatorDef ohmsLaw: engine integration', () => {
  const dummyData: DataAccess = {
    lookup: () => {
      throw new Error('ohms_law does not use reference tables');
    },
  };

  test('compute() delegates to solveOhmsLaw', () => {
    const out = ohmsLaw.compute({ system: 'dc', voltage: 12, current: 2 }, dummyData);
    expect(out.resistance).toBeCloseTo(6, 10);
  });

  test('validate() requires exactly 2 known values for DC', () => {
    expect(ohmsLaw.validate!({ system: 'dc', voltage: 12 })).toEqual(['error.needExactlyTwoValues']);
    expect(ohmsLaw.validate!({ system: 'dc', voltage: 12, current: 2 })).toBeNull();
  });

  test('validate() is unified for DC and AC: the same 4 fields, including resistance/Z', () => {
    expect(ohmsLaw.validate!({ system: '1ph', voltage: 230, power: 1840 })).toBeNull();
    expect(ohmsLaw.validate!({ system: '1ph', voltage: 230, resistance: 23 })).toBeNull();
  });

  test('resistance\'s symbol and labelKey depend on system: R/RESISTANCE in DC, Z/IMPEDANCE in AC', () => {
    const field = ohmsLaw.fields.find((f) => f.id === 'resistance')!;
    const symbolFn = field.symbol as (v: { system: string }) => string;
    const labelFn = field.labelKey as (v: { system: string }) => string;
    expect(symbolFn({ system: 'dc' })).toBe('R');
    expect(symbolFn({ system: '3ph' })).toBe('Z');
    expect(labelFn({ system: 'dc' })).toBe('field.resistance');
    expect(labelFn({ system: '3ph' })).toBe('field.impedance');
  });

  test('warnings() catches NaN from division by zero (0/0 in the current,power pair)', () => {
    const inputs = { system: 'dc' as const, current: 0, power: 0 };
    const out = solveOhmsLaw(inputs);
    expect(Number.isNaN(out.voltage)).toBe(true);
    expect(ohmsLaw.warnings!(inputs, out)).toEqual(['warn.divisionByZero']);
  });

  test('dynamicRoleFieldIds matches the 4 fields validate() checks for "exactly 2"', () => {
    expect(ohmsLaw.dynamicRoleFieldIds).toEqual(['voltage', 'current', 'resistance', 'power']);
  });

  test('formulaKeys() switches on system (DC vs 1-phase vs 3-phase)', () => {
    expect(ohmsLaw.formulaKeys!({ system: 'dc' })).toEqual([
      'formula.ohmsLaw.dc1',
      'formula.ohmsLaw.dc2',
      'formula.ohmsLaw.dc3',
    ]);
    expect(ohmsLaw.formulaKeys!({ system: '1ph' })).toEqual([
      'formula.ohmsLaw.1ph1',
      'formula.ohmsLaw.1ph2',
      'formula.ohmsLaw.1ph3',
    ]);
    expect(ohmsLaw.formulaKeys!({ system: '3ph' })).toEqual([
      'formula.ohmsLaw.3ph1',
      'formula.ohmsLaw.3ph2',
      'formula.ohmsLaw.3ph3',
    ]);
  });
});
