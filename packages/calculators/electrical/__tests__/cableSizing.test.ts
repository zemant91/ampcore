import { solveCableSizing, cableSizing } from '@calc/calculators-electrical';
import { createDataAccess, RESISTIVITY } from '@calc/data';

const data = createDataAccess();

describe('solveCableSizing: 3ph, loadType=power', () => {
  test('P=15000W, U=400V, cosφ=0.9, Cu/PVC/C, 30°C, group 1 -> Ib≈24.06A, S=4mm², Iz=32A', () => {
    const out = solveCableSizing(
      {
        system: '3ph',
        loadType: 'power',
        power: 15000,
        voltage: 400,
        cosPhi: 0.9,
        material: 'Cu',
        insulation: 'PVC',
        installMethod: 'C',
        ambientTemp: 30,
        grouping: '1',
      },
      data,
    );
    const expectedIb = 15000 / (Math.sqrt(3) * 400 * 0.9);
    expect(out.designCurrent).toBeCloseTo(expectedIb, 6);
    expect(out.ambientCorrectionFactor).toBe(1.0);
    expect(out.groupingCorrectionFactor).toBe(1.0);
    expect(out.crossSection).toBe(4);
    expect(out.tableAmpacity).toBe(32);
    expect(out.marginPercent).toBeCloseTo((32 / expectedIb - 1) * 100, 6);
    expect(out.voltageDrop).toBeUndefined();
  });

  test('with length given -> also computes ΔU/ΔU%', () => {
    const out = solveCableSizing(
      {
        system: '3ph',
        loadType: 'power',
        power: 15000,
        voltage: 400,
        cosPhi: 0.9,
        material: 'Cu',
        insulation: 'PVC',
        installMethod: 'C',
        ambientTemp: 30,
        grouping: '1',
        length: 30,
      },
      data,
    );
    const rho = RESISTIVITY.Cu[70]; // PVC operating temperature
    const expectedDu = (Math.sqrt(3) * rho * 30 * out.designCurrent) / out.crossSection;
    expect(out.voltageDrop).toBeCloseTo(expectedDu, 6);
    expect(out.voltageDropPercent).toBeCloseTo((expectedDu / 400) * 100, 6);
  });
});

describe('solveCableSizing: DC, loadType=current', () => {
  test('I=50A, Al/XLPE/B1, 25°C, group 2 -> Iz_req=60.096A, S=16mm², Iz=63A', () => {
    const out = solveCableSizing(
      {
        system: 'dc',
        loadType: 'current',
        current: 50,
        voltage: 230,
        material: 'Al',
        insulation: 'XLPE',
        installMethod: 'B1',
        ambientTemp: 25,
        grouping: '2',
      },
      data,
    );
    expect(out.designCurrent).toBe(50);
    expect(out.ambientCorrectionFactor).toBe(1.04);
    expect(out.groupingCorrectionFactor).toBe(0.8);
    expect(out.requiredAmpacity).toBeCloseTo(50 / (1.04 * 0.8), 10);
    expect(out.crossSection).toBe(16);
    expect(out.tableAmpacity).toBe(63);
  });
});

describe('solveCableSizing: no standard cross-section fits', () => {
  test('huge required current -> the largest cross-section is picked, margin is negative', () => {
    const out = solveCableSizing(
      {
        system: 'dc',
        loadType: 'current',
        current: 10000,
        voltage: 400,
        material: 'Cu',
        insulation: 'PVC',
        installMethod: 'A1',
        ambientTemp: 30,
        grouping: '1',
      },
      data,
    );
    expect(out.crossSection).toBe(240); // largest Cu cross-section in the range
    expect(out.tableAmpacity).toBe(253); // last value of IZ['Cu-PVC'].A1
    expect(out.marginPercent).toBeLessThan(0);
  });
});

describe('CalculatorDef cableSizing: engine integration', () => {
  test('validate(): voltage is always required, power/current depend on loadType', () => {
    expect(cableSizing.validate!({ loadType: 'power', voltage: 230 } as never)).toEqual([
      'error.missingRequiredFields',
    ]);
    expect(cableSizing.validate!({ loadType: 'current', voltage: 230 } as never)).toEqual([
      'error.missingRequiredFields',
    ]);
    expect(
      cableSizing.validate!({
        system: 'dc',
        loadType: 'current',
        current: 10,
        voltage: 230,
        material: 'Cu',
        insulation: 'PVC',
        installMethod: 'A1',
        ambientTemp: 30,
        grouping: '1',
      }),
    ).toBeNull();
  });

  test('power/current fields are visible depending on loadType (visibleIf)', () => {
    const power = cableSizing.fields.find((f) => f.id === 'power')!;
    const current = cableSizing.fields.find((f) => f.id === 'current')!;
    expect(power.visibleIf!({ loadType: 'power' })).toBe(true);
    expect(power.visibleIf!({ loadType: 'current' })).toBe(false);
    expect(current.visibleIf!({ loadType: 'current' })).toBe(true);
    expect(current.visibleIf!({ loadType: 'power' })).toBe(false);
  });

  test('warnings(): no fitting cross-section -> warning', () => {
    const inputs = {
    system: 'dc' as const,
    loadType: 'current' as const,
    current: 10000,
    voltage: 400,
    material: 'Cu' as const,
    insulation: 'PVC' as const,
    installMethod: 'A1' as const,
    ambientTemp: 30 as const,
    grouping: '1' as const,
  };
  const out = cableSizing.compute(inputs, data);
  expect(cableSizing.warnings!(inputs, out)).toContain('warn.cableSizingNoTableFit');
});

test('warnings(): ΔU% above 5% with length given -> IEC warning', () => {
  const inputs = {
    system: '1ph' as const,
    loadType: 'current' as const,
    current: 20,
    voltage: 230,
    material: 'Cu' as const,
    insulation: 'PVC' as const,
    installMethod: 'A1' as const,
    ambientTemp: 30 as const,
    grouping: '1' as const,
    length: 500,
  };
  const out = cableSizing.compute(inputs, data);
  expect(out.voltageDropPercent).toBeGreaterThan(5);
  expect(cableSizing.warnings!(inputs, out)).toContain('warn.voltageDropExceedsIec');
});

test('chainTo -> breaker_selection maps designCurrent/tableAmpacity to Ip/Iz', () => {
  const inputs = {
      system: '3ph',
      loadType: 'power',
      power: 15000,
      voltage: 400,
      cosPhi: 0.9,
      material: 'Cu',
      insulation: 'PVC',
      installMethod: 'C',
      ambientTemp: 30,
      grouping: '1',
    } as const;
    const outputs = cableSizing.compute(inputs, data);
    const chain = cableSizing.chainTo!.find((c) => c.calculatorId === 'breaker_selection')!;
    expect(chain.mapOutputs(outputs, inputs)).toEqual({
      designCurrent: outputs.designCurrent,
      cableAmpacity: outputs.tableAmpacity,
    });
  });
});
