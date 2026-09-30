import {
  breakerSelection,
  cableSizing,
  earthLoop,
  kwToAmps,
  motorCurrent,
  pfCorrection,
  powerFactor,
  transformerRating,
  voltageDrop,
} from '@calc/calculators-electrical';
import type { CalculatorDef, Values } from '@calc/engine';
import { createDataAccess } from '@calc/data';

const data = createDataAccess();

/** Runs `from`, applies its chain to `toId`, and checks the mapped values are enough for `to` to compute. */
function chained(from: CalculatorDef, inputs: Values, to: CalculatorDef, extra: Values = {}) {
  const outputs = from.compute(inputs, data);
  const chain = from.chainTo!.find((c) => c.calculatorId === to.id)!;
  const mapped = chain.mapOutputs(outputs, inputs);
  expect(to.validate?.({ ...mapped, ...extra })).toBeNull();
  return { outputs, mapped, result: to.compute({ ...mapped, ...extra }, data) };
}

const cableExtra = { material: 'Cu', insulation: 'PVC', installMethod: 'C', ambientTemp: 30, grouping: '1' };

test('kW↔A -> cable sizing: the computed current becomes the load current', () => {
  const { outputs, mapped, result } = chained(
    kwToAmps,
    { system: '3ph', power: 11000, voltage: 400, cosPhi: 0.9 },
    cableSizing,
    cableExtra,
  );
  expect(mapped).toMatchObject({ system: '3ph', loadType: 'current', current: outputs.current, voltage: 400 });
  expect(result.designCurrent).toBeCloseTo(outputs.current as number);
});

test('motor current -> cable sizing: nominal current and the motor supply carry over', () => {
  const { outputs, mapped } = chained(
    motorCurrent,
    { system: '3ph', power: 7500, voltage: 400, efficiency: 0.9, cosPhi: 0.85 },
    cableSizing,
    cableExtra,
  );
  expect(mapped).toMatchObject({ system: '3ph', loadType: 'current', current: outputs.current, voltage: 400 });
});

test('cable sizing -> voltage drop: chosen section + design current, temperature from insulation', () => {
  const inputs = { system: '3ph', loadType: 'current', current: 32, voltage: 400, length: 40, ...cableExtra };
  const { outputs, mapped, result } = chained(cableSizing, inputs, voltageDrop);
  expect(mapped).toMatchObject({
    current: outputs.designCurrent,
    area: outputs.crossSection,
    length: 40,
    temperature: 70,
  });
  expect(result.voltageDropPercent).toBeGreaterThan(0);

  const xlpe = cableSizing.chainTo!.find((c) => c.calculatorId === 'voltage_drop')!.mapOutputs(outputs as never, {
    ...inputs,
    insulation: 'XLPE',
  } as never);
  expect(xlpe.temperature).toBe(90);
});

test('cable sizing -> earth loop: material, length, section, temperature and U0 (line voltage / √3 on 3-phase)', () => {
  const inputs = { system: '3ph', loadType: 'current', current: 16, voltage: 400, length: 40, ...cableExtra };
  const { outputs, mapped, result } = chained(cableSizing, inputs, earthLoop, {
    peArea: 4,
    breakerRating: 16,
    tripCurve: 'C',
  });
  expect(mapped).toMatchObject({ material: 'Cu', temperature: 70, length: 40, phaseArea: outputs.crossSection });
  expect(mapped.voltage).toBeCloseTo(400 / Math.sqrt(3), 6);
  expect(result.earthLoopImpedance).toBeGreaterThan(0);

  const dc = cableSizing.chainTo!.find((c) => c.calculatorId === 'earth_loop')!.mapOutputs(outputs as never, {
    ...inputs,
    system: 'dc',
  } as never);
  expect(dc.voltage).toBeUndefined();
});

test('breaker selection -> earth loop: the chosen rating becomes In', () => {
  const inputs = { designCurrent: 24, cableAmpacity: 32 };
  const { mapped } = chained(breakerSelection, inputs, earthLoop, {
    voltage: 230,
    material: 'Cu',
    temperature: 70,
    length: 20,
    phaseArea: 2.5,
    peArea: 2.5,
    tripCurve: 'C',
  });
  expect(mapped).toEqual({ breakerRating: 25 });
});

test('power factor -> PF correction / transformer rating: P and cosφ carry over', () => {
  const inputs = { power: 80000, cosPhi: 0.8 };
  const pfMapped = chained(powerFactor, inputs, pfCorrection, { targetCosPhi: 0.95 });
  expect(pfMapped.mapped).toMatchObject({ power: 80000, cosPhi: 0.8 });
  const trafo = chained(powerFactor, inputs, transformerRating, { system: '3ph', primaryVoltage: 20000, secondaryVoltage: 400 });
  expect(trafo.mapped).toMatchObject({ power: 80000, cosPhi: 0.8 });
});
