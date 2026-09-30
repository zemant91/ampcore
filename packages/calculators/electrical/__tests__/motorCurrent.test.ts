import { solveMotorCurrent, motorCurrent } from '@calc/calculators-electrical';

describe('solveMotorCurrent: 1PH — I = P/(U·η·cosφ)', () => {
  test('P=1500W, U=230V, η=0.8, cosφ=0.77 -> I, Ist min/max', () => {
    const out = solveMotorCurrent({ system: '1ph', power: 1500, voltage: 230, efficiency: 0.8, cosPhi: 0.77 });
    const expectedI = 1500 / (230 * 0.8 * 0.77);
    expect(out.current).toBeCloseTo(expectedI, 6);
    expect(out.startupCurrentMin).toBeCloseTo(5 * expectedI, 6);
    expect(out.startupCurrentMax).toBeCloseTo(7 * expectedI, 6);
  });
});

describe('solveMotorCurrent: 3PH — I = P/(√3·U·η·cosφ)', () => {
  test('P=7500W, U=400V, η=0.88, cosφ=0.84 -> I', () => {
    const out = solveMotorCurrent({ system: '3ph', power: 7500, voltage: 400, efficiency: 0.88, cosPhi: 0.84 });
    const expectedI = 7500 / (Math.sqrt(3) * 400 * 0.88 * 0.84);
    expect(out.current).toBeCloseTo(expectedI, 6);
  });
});

describe('CalculatorDef motorCurrent: engine integration', () => {
  test('validate(): all 4 fields are required', () => {
    expect(
      motorCurrent.validate!({ system: '1ph', voltage: 230, efficiency: 0.8, cosPhi: 0.77 } as never),
    ).toEqual(['error.missingRequiredFields']);
    expect(
      motorCurrent.validate!({ system: '1ph', power: 1500, voltage: 230, efficiency: 0.8, cosPhi: 0.77 }),
    ).toBeNull();
  });

  test('chainTo -> breaker_selection maps the nominal current to designCurrent (Ip)', () => {
    const inputs = { system: '3ph' as const, power: 7500, voltage: 400, efficiency: 0.88, cosPhi: 0.84 };
    const outputs = solveMotorCurrent(inputs);
    const chain = motorCurrent.chainTo!.find((c) => c.calculatorId === 'breaker_selection')!;
    expect(chain.mapOutputs(outputs, inputs)).toEqual({ designCurrent: outputs.current });
  });

  test('warnings(): division by zero at U=0 -> warning', () => {
    const inputs = { system: '1ph' as const, power: 1500, voltage: 0, efficiency: 0.8, cosPhi: 0.77 };
    const out = solveMotorCurrent(inputs);
    expect(motorCurrent.warnings!(inputs, out)).toEqual(['warn.divisionByZero']);
  });
});
