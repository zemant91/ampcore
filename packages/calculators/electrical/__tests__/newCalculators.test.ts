import {
  earthLoop,
  pfCorrection,
  powerFactor,
  shortCircuit,
  solveEarthLoop,
  solvePfCorrection,
  solvePowerFactor,
  solveShortCircuit,
  solveTransformerRating,
  transformerRating,
} from '@calc/calculators-electrical';
import { createDataAccess } from '@calc/data';

const data = createDataAccess();

describe('power_factor: any 2 of {P, Q, S, cosφ} -> the 80/60/100 kVA triangle', () => {
  const cases: [string, Record<string, number>][] = [
    ['P,Q', { power: 80, reactivePower: 60 }],
    ['P,S', { power: 80, apparentPower: 100 }],
    ['P,cosφ', { power: 80, cosPhi: 0.8 }],
    ['Q,S', { reactivePower: 60, apparentPower: 100 }],
    ['Q,cosφ', { reactivePower: 60, cosPhi: 0.8 }],
    ['S,cosφ', { apparentPower: 100, cosPhi: 0.8 }],
  ];
  test.each(cases)('%s', (_name, inputs) => {
    const out = solvePowerFactor(inputs);
    expect(out.power).toBeCloseTo(80, 6);
    expect(out.reactivePower).toBeCloseTo(60, 6);
    expect(out.apparentPower).toBeCloseTo(100, 6);
    expect(out.cosPhi).toBeCloseTo(0.8, 6);
  });

  test('validate: needs exactly two values, S can not be below P or Q, cosφ in range', () => {
    expect(powerFactor.validate!({ power: 1 })).toEqual(['error.needExactlyTwoValues']);
    expect(powerFactor.validate!({ power: 1, reactivePower: 1, cosPhi: 0.5 })).toEqual(['error.needExactlyTwoValues']);
    expect(powerFactor.validate!({ power: 100, apparentPower: 80 })).toEqual(['error.apparentPowerTooSmall']);
    expect(powerFactor.validate!({ power: 100, cosPhi: 1.5 })).toEqual(['error.cosPhiOutOfRange']);
    expect(powerFactor.validate!({ power: 80, apparentPower: 100 })).toBeNull();
  });

  test('Q with cosφ = 1 divides by zero -> warning', () => {
    const out = solvePowerFactor({ reactivePower: 10, cosPhi: 1 });
    expect(powerFactor.warnings!({ reactivePower: 10, cosPhi: 1 }, out)).toEqual(['warn.divisionByZero']);
  });
});

describe('pf_correction: Qc = P·(tanφ₁ − tanφ₂)', () => {
  test('100 kW, 0.8 -> 0.95: Qc ≈ 42.13 kvar, S 125 -> 105.26 kVA, current −15.8 %', () => {
    const out = solvePfCorrection({ power: 100000, cosPhi: 0.8, targetCosPhi: 0.95 });
    expect(out.compensationPower).toBeCloseTo(42132, -1);
    expect(out.apparentPowerBefore).toBeCloseTo(125000, 3);
    expect(out.apparentPowerAfter).toBeCloseTo(105263, -1);
    expect(out.currentReductionPercent).toBeCloseTo(15.79, 1);
  });

  test('target at or below the present power factor -> no compensation, info note', () => {
    const inputs = { power: 100000, cosPhi: 0.96, targetCosPhi: 0.95 };
    const out = solvePfCorrection(inputs);
    expect(out.compensationPower).toBe(0);
    expect(out.currentReductionPercent).toBe(0);
    expect(pfCorrection.warnings!(inputs, out)).toEqual(['info.pfAlreadyAtTarget']);
  });
});

describe('transformer_rating', () => {
  const inputs = { system: '3ph' as const, power: 400000, cosPhi: 0.9, reservePercent: 20, primaryVoltage: 20000, secondaryVoltage: 400 };

  test('400 kW, cosφ 0.9, +20 % -> 533 kVA required -> 630 kVA, 70.6 % loaded, 909 A / 18.2 A', () => {
    const out = solveTransformerRating(inputs, data);
    expect(out.requiredApparentPower).toBeCloseTo(533333, -1);
    expect(out.ratedApparentPower).toBe(630000);
    expect(out.loadPercent).toBeCloseTo(70.55, 1);
    expect(out.secondaryCurrent).toBeCloseTo(909.3, 1);
    expect(out.primaryCurrent).toBeCloseTo(18.19, 2);
  });

  test('above the largest standard rating -> no rating, warning', () => {
    const big = { ...inputs, power: 3000000 };
    const out = solveTransformerRating(big, data);
    expect(out.ratedApparentPower).toBeUndefined();
    expect(transformerRating.warnings!(big, out)).toEqual(['error.noTransformerFitsInRange']);
  });

  test('chainTo short_circuit: rated kVA, uk 4 % up to 630 kVA (6 % above), secondary voltage', () => {
    const chain = transformerRating.chainTo!.find((c) => c.calculatorId === 'short_circuit')!;
    expect(chain.mapOutputs(solveTransformerRating(inputs, data), inputs)).toEqual({
      transformerPower: 630000,
      ukPercent: 4,
      voltage: 400,
    });
    expect(chain.mapOutputs({ ratedApparentPower: 1000000 } as never, inputs)).toMatchObject({ ukPercent: 6 });
  });
});

describe('short_circuit: Ik″ = c·Un / (√3·Zk), IEC 60909', () => {
  const base = { transformerPower: 630000, ukPercent: 4, voltage: 400 };

  test('630 kVA, uk 4 %, infinite grid, at the transformer: ≈ 24.5 kA', () => {
    const out = solveShortCircuit(base, data);
    expect(out.shortCircuitCurrentSource).toBeCloseTo(24500, -2);
    expect(out.shortCircuitCurrent).toBe(out.shortCircuitCurrentSource); // no cable
  });

  test('50 mm² Cu, 100 m of cable: Ik drops to ≈ 6.07 kA', () => {
    const out = solveShortCircuit({ ...base, material: 'Cu', area: 50, length: 100 }, data);
    expect(out.shortCircuitCurrent).toBeCloseTo(6070, -2);
    expect(out.totalImpedance).toBeCloseTo(0.03995, 4);
    expect(out.shortCircuitCurrentSource).toBeCloseTo(24500, -2);
  });

  test('a finite grid (250 MVA) lowers Ik; aluminium gives less than copper', () => {
    const infinite = solveShortCircuit(base, data).shortCircuitCurrentSource;
    const finite = solveShortCircuit({ ...base, networkPower: 250e6 }, data).shortCircuitCurrentSource;
    expect(finite).toBeLessThan(infinite);
    const cable = { ...base, area: 50, length: 100 };
    expect(solveShortCircuit({ ...cable, material: 'Al' }, data).shortCircuitCurrent).toBeLessThan(
      solveShortCircuit({ ...cable, material: 'Cu' }, data).shortCircuitCurrent,
    );
  });

  test('validate: a cable length needs a cross-section', () => {
    expect(shortCircuit.validate!({ ...base, length: 50 })).toEqual(['error.missingRequiredFields']);
    expect(shortCircuit.validate!(base)).toBeNull();
  });
});

describe('earth_loop: Zs = Ze + ρ·L·(1/S + 1/Spe) against U0/(m·In)', () => {
  const base = {
    voltage: 230,
    externalImpedance: 0.35,
    material: 'Cu' as const,
    temperature: 70 as const,
    length: 50,
    phaseArea: 2.5,
    peArea: 1.5,
    breakerRating: 16,
    tripCurve: 'C' as const,
  };

  test('50 m of 2.5/1.5 mm² behind a C16: Zs ≈ 1.49 Ω > 1.44 Ω max -> warning', () => {
    const out = solveEarthLoop(base, data);
    expect(out.loopResistance).toBeCloseTo(1.1397, 3);
    expect(out.earthLoopImpedance).toBeCloseTo(1.4897, 3);
    expect(out.maxLoopImpedance).toBeCloseTo(1.4375, 4);
    expect(out.marginPercent).toBeLessThan(0);
    expect(earthLoop.warnings!(base, out)).toEqual(['warn.earthLoopTooHigh']);
  });

  test('30 m of the same cable passes with ≈ 39 % margin', () => {
    const inputs = { ...base, length: 30 };
    const out = solveEarthLoop(inputs, data);
    expect(out.marginPercent).toBeCloseTo(39.05, 1);
    expect(out.earthFaultCurrent).toBeCloseTo(230 / out.earthLoopImpedance, 6);
    expect(earthLoop.warnings!(inputs, out)).toEqual([]);
  });

  test('a B curve allows a higher Zs than C, D a lower one (5/10/20 × In)', () => {
    const max = (tripCurve: 'B' | 'C' | 'D') => solveEarthLoop({ ...base, tripCurve }, data).maxLoopImpedance;
    expect(max('B')).toBeCloseTo(2 * max('C'), 6);
    expect(max('D')).toBeCloseTo(max('C') / 2, 6);
  });
});
