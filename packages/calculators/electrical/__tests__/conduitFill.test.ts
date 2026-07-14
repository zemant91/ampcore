import { solveConduitFill, conduitFill } from '@calc/calculators-electrical';
import { createDataAccess } from '@calc/data';

const data = createDataAccess();

describe('solveConduitFill: fillPercent = ΣA_cables / A_conduit · 100', () => {
  test('RL25 (D=21mm), 2 cables of 8.5mm OD -> ~32.77%, limit for 2 cables = 31%', () => {
    const cableArea = Math.PI * (8.5 / 2) ** 2;
    const totalCableArea = 2 * cableArea;
    const out = solveConduitFill({ conduitDiameter: 21, cableCount: 2, totalCableArea }, data);

    const conduitArea = Math.PI * (21 / 2) ** 2;
    expect(out.fillPercent).toBeCloseTo((totalCableArea / conduitArea) * 100, 6);
    expect(out.fillLimit).toBe(31);
  });

  test('0 cables -> fillPercent = 0, limit from the "3+" branch (40%)', () => {
    const out = solveConduitFill({ conduitDiameter: 21, cableCount: 0, totalCableArea: 0 }, data);
    expect(out.fillPercent).toBe(0);
    expect(out.fillLimit).toBe(40);
  });

  test('1 cable -> 53% limit', () => {
    const out = solveConduitFill({ conduitDiameter: 21, cableCount: 1, totalCableArea: 50 }, data);
    expect(out.fillLimit).toBe(53);
  });

  test('3 or more cables -> 40% limit', () => {
    const out = solveConduitFill({ conduitDiameter: 21, cableCount: 5, totalCableArea: 50 }, data);
    expect(out.fillLimit).toBe(40);
  });
});

describe('CalculatorDef conduitFill: engine integration', () => {
  test('validate(): all three fields are required', () => {
    expect(conduitFill.validate!({ conduitDiameter: 21, cableCount: 2 } as never)).toEqual([
      'error.missingRequiredFields',
    ]);
    expect(
      conduitFill.validate!({ conduitDiameter: 21, cableCount: 2, totalCableArea: 100 }),
    ).toBeNull();
  });

  test('warnings(): fill above the limit -> warning', () => {
    const cableArea = Math.PI * (8.5 / 2) ** 2;
    const inputs = { conduitDiameter: 21, cableCount: 2, totalCableArea: 2 * cableArea };
    const out = conduitFill.compute(inputs, data);
    expect(out.fillPercent).toBeGreaterThan(out.fillLimit);
    expect(conduitFill.warnings!(inputs, out)).toEqual(['warn.conduitFillExceedsLimit']);
  });

  test('warnings(): fill within the limit -> empty array', () => {
    const inputs = { conduitDiameter: 21, cableCount: 1, totalCableArea: 10 };
    const out = conduitFill.compute(inputs, data);
    expect(conduitFill.warnings!(inputs, out)).toEqual([]);
  });
});
