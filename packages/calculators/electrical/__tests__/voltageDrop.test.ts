import { solveVoltageDrop, voltageDrop } from '@calc/calculators-electrical';
import { createDataAccess, RESISTIVITY } from '@calc/data';
import type { DataAccess } from '@calc/engine';

/** Mock with a fixed ρ=0.02 — the test numbers don't depend on the actual table */
const mockData: DataAccess = {
  lookup: () => ({ 20: 0.02, 70: 0.02, 90: 0.02 }) as never,
};

describe('solveVoltageDrop: DC/1PH — factor = 2 (out and back)', () => {
  test('U=230V, I=10A, L=50m, S=6mm² -> ΔU and ΔU% per the 2ρLI/S formula', () => {
    const out = solveVoltageDrop(
      { system: '1ph', material: 'Cu', temperature: 70, voltage: 230, current: 10, length: 50, area: 6 },
      mockData,
    );
    const expectedDu = (2 * 0.02 * 50 * 10) / 6;
    expect(out.voltageDrop).toBeCloseTo(expectedDu, 10);
    expect(out.voltageDropPercent).toBeCloseTo((expectedDu / 230) * 100, 10);
  });
});

describe('solveVoltageDrop: 3PH — factor = √3', () => {
  test('U=400V, I=20A, L=80m, S=10mm² -> ΔU per the √3·ρLI/S formula', () => {
    const out = solveVoltageDrop(
      { system: '3ph', material: 'Al', temperature: 20, voltage: 400, current: 20, length: 80, area: 10 },
      mockData,
    );
    const expectedDu = (Math.sqrt(3) * 0.02 * 80 * 20) / 10;
    expect(out.voltageDrop).toBeCloseTo(expectedDu, 10);
  });
});

describe('solveVoltageDrop: integration with the real resistivity table from @calc/data', () => {
  test('Cu, 70°C, 1ph: U=230V, I=32A, L=25m, S=4mm²', () => {
    const data = createDataAccess();
    const out = solveVoltageDrop(
      { system: '1ph', material: 'Cu', temperature: 70, voltage: 230, current: 32, length: 25, area: 4 },
      data,
    );
    const rho = RESISTIVITY.Cu[70];
    const expectedDu = (2 * rho * 25 * 32) / 4;
    expect(out.voltageDrop).toBeCloseTo(expectedDu, 10);
    expect(out.voltageDropPercent).toBeCloseTo((expectedDu / 230) * 100, 10);
  });
});

describe('CalculatorDef voltageDrop: engine integration', () => {
  test('compute() delegates to solveVoltageDrop via the passed-in DataAccess', () => {
    const out = voltageDrop.compute(
      { system: 'dc', material: 'Cu', temperature: 70, voltage: 230, current: 10, length: 50, area: 6 },
      mockData,
    );
    expect(out.voltageDrop).toBeGreaterThan(0);
  });

  test('validate(): voltage/current/length/area are required', () => {
    expect(
      voltageDrop.validate!({ system: 'dc', material: 'Cu', temperature: 70, current: 10, length: 50, area: 6 } as never),
    ).toEqual(['error.missingRequiredFields']);
    expect(
      voltageDrop.validate!({
        system: 'dc',
        material: 'Cu',
        temperature: 70,
        voltage: 230,
        current: 10,
        length: 50,
        area: 6,
      }),
    ).toBeNull();
  });

  test('warnings(): ΔU% above 5% -> IEC warning', () => {
    const inputs = { system: 'dc' as const, material: 'Cu' as const, temperature: 70 as const, voltage: 230, current: 10, length: 500, area: 6 };
    const out = voltageDrop.compute(inputs, mockData);
    expect(out.voltageDropPercent).toBeGreaterThan(5);
    expect(voltageDrop.warnings!(inputs, out)).toContain('warn.voltageDropExceedsIec');
  });

  test('warnings(): cross-section above 50mm² -> informational reactance note', () => {
    const inputs = { system: 'dc' as const, material: 'Cu' as const, temperature: 70 as const, voltage: 400, current: 10, length: 5, area: 70 };
    const out = voltageDrop.compute(inputs, mockData);
    expect(voltageDrop.warnings!(inputs, out)).toContain('info.largeSectionReactanceIgnored');
  });

  test('warnings(): typical case with no remarks -> empty array', () => {
    const inputs = { system: 'dc' as const, material: 'Cu' as const, temperature: 70 as const, voltage: 230, current: 10, length: 10, area: 6 };
    const out = voltageDrop.compute(inputs, mockData);
    expect(voltageDrop.warnings!(inputs, out)).toEqual([]);
  });
});
