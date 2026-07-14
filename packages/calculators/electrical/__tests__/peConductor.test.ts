import { solvePeConductor, peConductor } from '@calc/calculators-electrical';
import { createDataAccess, STANDARD_PE_SIZES } from '@calc/data';
import type { DataAccess } from '@calc/engine';

const data: DataAccess = createDataAccess();

describe('solvePeConductor: adiabatic — S = I·√t / k', () => {
  test('I=1000A, t=0.4s, k=143 (Cu sep.) -> required S and rounded up to the standard range', () => {
    const out = solvePeConductor(
      { method: 'adiabatic', faultCurrent: 1000, disconnectionTime: 0.4, kFactor: 143 },
      data,
    );
    const expected = (1000 * Math.sqrt(0.4)) / 143;
    expect(out.requiredSection).toBeCloseTo(expected, 10);
    expect(out.standardSection).toBe(STANDARD_PE_SIZES.find((s) => s >= expected));
  });
});

describe('solvePeConductor: simplified — Table 54.7', () => {
  test('S_ph=10mm² (≤16) -> S_PE = S_ph directly', () => {
    const out = solvePeConductor({ method: 'simplified', phaseSection: 10 }, data);
    expect(out.requiredSection).toBe(10);
  });

  test('S_ph=25mm² (16 < S ≤ 35) -> S_PE = 16', () => {
    const out = solvePeConductor({ method: 'simplified', phaseSection: 25 }, data);
    expect(out.requiredSection).toBe(16);
  });

  test('S_ph=70mm² (>35) -> S_PE = S_ph / 2', () => {
    const out = solvePeConductor({ method: 'simplified', phaseSection: 70 }, data);
    expect(out.requiredSection).toBe(35);
  });
});

describe('solvePeConductor: required section above the standard range', () => {
  test('required > 300mm² -> standardSection is undefined', () => {
    const out = solvePeConductor({ method: 'simplified', phaseSection: 1000 }, data);
    expect(out.requiredSection).toBe(500);
    expect(out.standardSection).toBeUndefined();
  });
});

describe('CalculatorDef peConductor: engine integration', () => {
  test('validate(): adiabatic requires faultCurrent+disconnectionTime+kFactor', () => {
    expect(peConductor.validate!({ method: 'adiabatic', faultCurrent: 1000 } as never)).toEqual([
      'error.missingRequiredFields',
    ]);
    expect(
      peConductor.validate!({ method: 'adiabatic', faultCurrent: 1000, disconnectionTime: 0.4, kFactor: 143 }),
    ).toBeNull();
  });

  test('validate(): simplified requires phaseSection', () => {
    expect(peConductor.validate!({ method: 'simplified' } as never)).toEqual(['error.missingRequiredFields']);
    expect(peConductor.validate!({ method: 'simplified', phaseSection: 10 })).toBeNull();
  });

  test('adiabatic/simplified fields are visible only for their own method (visibleIf)', () => {
    const faultCurrent = peConductor.fields.find((f) => f.id === 'faultCurrent')!;
    const phaseSection = peConductor.fields.find((f) => f.id === 'phaseSection')!;
    expect(faultCurrent.visibleIf!({ method: 'adiabatic' })).toBe(true);
    expect(faultCurrent.visibleIf!({ method: 'simplified' })).toBe(false);
    expect(phaseSection.visibleIf!({ method: 'simplified' })).toBe(true);
    expect(phaseSection.visibleIf!({ method: 'adiabatic' })).toBe(false);
  });

  test('kFactor.options are built from @calc/data PE_K_FACTORS (143/115/76)', () => {
    const kFactor = peConductor.fields.find((f) => f.id === 'kFactor')!;
    expect(kFactor.options!.map((o) => o.value)).toEqual([143, 115, 76]);
  });

  test('warnings(): no matching standard section -> warning', () => {
    const inputs = { method: 'simplified' as const, phaseSection: 1000 };
    const out = peConductor.compute(inputs, data);
    expect(peConductor.warnings!(inputs, out)).toEqual(['error.noPeSizeFitsInRange']);
  });
});
