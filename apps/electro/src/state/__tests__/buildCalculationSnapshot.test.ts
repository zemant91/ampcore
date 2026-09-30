import { createDataAccess } from '@calc/data';
import { ohmsLaw } from '@calc/calculators-electrical';
import { buildCalculationSnapshot } from '../buildCalculationSnapshot';

test('ohms_law (all fields role:input): typed fields -> inputs, computed ones -> outputs', () => {
  const values = { system: 'dc' as const, voltage: 230, current: 2 };
  const outputs = ohmsLaw.compute(values, createDataAccess());
  const snap = buildCalculationSnapshot({
    calculator: ohmsLaw,
    values,
    outputs,
    warnings: [],
    resolveLabel: (k) => k,
    unitsSystem: 'metric',
  });
  // system selector + the 2 typed numbers; the other 2 numbers are computed
  expect(snap.inputs.map((f) => f.label)).toEqual(['field.system', 'field.voltage', 'field.current']);
  expect(snap.outputs.length).toBeGreaterThan(0);
});
