import { buildFieldCardStates } from '@calc/ui';
import { ohmsLaw, solveOhmsLaw } from '@calc/calculators-electrical';
import type { CalculatorDef } from '@calc/engine';

describe('buildFieldCardStates: ohms_law (dynamic roles)', () => {
  test('before any input — everything is empty', () => {
    const states = buildFieldCardStates(ohmsLaw.fields, { system: 'dc' }, undefined);
    expect(states.voltage).toBe('empty');
    expect(states.current).toBe('empty');
  });

  test('after entering U and R — U/R are given, I/P are calculated (exactly as in the screenshots)', () => {
    const rawInputs = { system: 'dc' as const, voltage: 220, resistance: 2000 };
    const outputs = solveOhmsLaw(rawInputs);
    const states = buildFieldCardStates(ohmsLaw.fields, rawInputs, outputs);

    expect(states.voltage).toBe('given');
    expect(states.resistance).toBe('given');
    expect(states.current).toBe('calculated');
    expect(states.power).toBe('calculated');
  });
});

describe('buildFieldCardStates: static roles (not ohms_law)', () => {
  const staticDef: CalculatorDef = {
    id: 'demo_static',
    titleKey: 'demo.title',
    descriptionKey: 'demo.desc',
    category: 'test',
    tier: 'free',
    fields: [
      { id: 'a', labelKey: 'a', quantity: 'dimensionless', role: 'input' },
      { id: 'b', labelKey: 'b', quantity: 'dimensionless', role: 'input' },
      { id: 'result', labelKey: 'result', quantity: 'dimensionless', role: 'output' },
    ],
    compute: (inputs) => ({ result: Number(inputs.a) + Number(inputs.b) }),
  };

  test('role=input never becomes calculated, even if it is present in outputs', () => {
    const rawInputs = { a: 2 };
    const states = buildFieldCardStates(staticDef.fields, rawInputs, undefined);
    expect(states.a).toBe('given');
    expect(states.b).toBe('empty');
    expect(states.result).toBe('empty');
  });

  test('role=output is always calculated once it has a value, never given', () => {
    const rawInputs = { a: 2, b: 3 };
    const outputs = staticDef.compute(rawInputs, { lookup: () => { throw new Error('unused'); } });
    const states = buildFieldCardStates(staticDef.fields, rawInputs, outputs);
    expect(states.result).toBe('calculated');
  });
});
