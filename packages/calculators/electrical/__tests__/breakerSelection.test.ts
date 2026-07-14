import { solveBreakerSelection, breakerSelection } from '@calc/calculators-electrical';
import { createDataAccess, STANDARD_BREAKER_RATINGS } from '@calc/data';

const data = createDataAccess();

describe('solveBreakerSelection: the smallest In with Ip ≤ In ≤ Iz', () => {
  test('Ip=24A, Iz=32A -> In=25A (first rating in the range falling within [24,32])', () => {
    const out = solveBreakerSelection({ designCurrent: 24, cableAmpacity: 32 }, data);
    expect(out.rating).toBe(25);
  });

  test('Ip=6A, Iz=200A -> In=6A (exact match with the smallest rating)', () => {
    const out = solveBreakerSelection({ designCurrent: 6, cableAmpacity: 200 }, data);
    expect(out.rating).toBe(6);
  });

  test('Ip=Iz=63A -> In=63A (exact match)', () => {
    const out = solveBreakerSelection({ designCurrent: 63, cableAmpacity: 63 }, data);
    expect(out.rating).toBe(63);
  });

  test('[Ip, Iz] window above the range\'s max rating (125A) -> rating is undefined', () => {
    const out = solveBreakerSelection({ designCurrent: 130, cableAmpacity: 130.5 }, data);
    expect(out.rating).toBeUndefined();
  });
});

describe('CalculatorDef breakerSelection: engine integration', () => {
  test('validate(): designCurrent/cableAmpacity are required', () => {
    expect(breakerSelection.validate!({ designCurrent: 10 } as never)).toEqual(['error.missingRequiredFields']);
    expect(breakerSelection.validate!({ designCurrent: 10, cableAmpacity: 20 })).toBeNull();
  });

  test('compute() uses the rating range from @calc/data', () => {
    const out = breakerSelection.compute({ designCurrent: 24, cableAmpacity: 32 }, data);
    expect(STANDARD_BREAKER_RATINGS).toContain(out.rating);
  });

  test('warnings(): no matching rating found -> warning', () => {
    const inputs = { designCurrent: 130, cableAmpacity: 130.5 };
    const out = breakerSelection.compute(inputs, data);
    expect(breakerSelection.warnings!(inputs, out)).toEqual(['error.noBreakerFitsInRange']);
  });

  test('warnings(): normal case -> empty array', () => {
    const inputs = { designCurrent: 24, cableAmpacity: 32 };
    const out = breakerSelection.compute(inputs, data);
    expect(breakerSelection.warnings!(inputs, out)).toEqual([]);
  });
});
