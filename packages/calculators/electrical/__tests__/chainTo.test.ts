import { cableSizing, kwToAmps, motorCurrent, voltageDrop } from '@calc/calculators-electrical';
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
