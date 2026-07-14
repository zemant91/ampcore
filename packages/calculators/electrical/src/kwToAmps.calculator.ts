import type { CalculatorDef } from '@calc/engine';
import { solveKwToAmps, type KwToAmpsInputs, type KwToAmpsOutputs } from './kwToAmps';

export const kwToAmps: CalculatorDef<KwToAmpsInputs, KwToAmpsOutputs> = {
  id: 'kw_to_amps',
  titleKey: 'calc.kwToAmps.title',
  descriptionKey: 'calc.kwToAmps.desc',
  category: 'fundamentals',
  tier: 'free',
  fields: [
    {
      id: 'system',
      labelKey: 'field.system',
      quantity: 'dimensionless',
      role: 'input',
      options: [
        { value: 'dc', labelKey: 'system.dc' },
        { value: '1ph', labelKey: 'system.1ph' },
        { value: '3ph', labelKey: 'system.3ph' },
      ],
    },
    { id: 'power', labelKey: 'field.power', symbol: 'P', quantity: 'power', role: 'input', defaultUnit: 'kW' },
    { id: 'voltage', labelKey: 'field.voltage', symbol: 'U', quantity: 'voltage', role: 'input', defaultUnit: 'V' },
    {
      id: 'cosPhi',
      labelKey: 'field.cosPhi',
      symbol: 'cosφ',
      quantity: 'dimensionless',
      role: 'input',
      defaultUnit: 'unit',
      validation: { min: 0.01, max: 1 },
      visibleIf: (v) => v.system !== 'dc',
    },
    { id: 'current', labelKey: 'field.current', symbol: 'I', quantity: 'current', role: 'output', defaultUnit: 'A' },
  ],
  validate: (inputs) => {
    const missing = (['power', 'voltage'] as const).some((k) => inputs[k] === undefined);
    return missing ? ['error.missingRequiredFields'] : null;
  },
  compute: (inputs) => solveKwToAmps(inputs),
  warnings: (_inputs, outputs) => {
    // Unlike ohms_law (0/0 = NaN), here voltage is always a direct
    // divisor -> division by zero gives Infinity, not NaN.
    const hasNonFinite = Object.values(outputs).some(
      (v) => typeof v === 'number' && !Number.isFinite(v),
    );
    return hasNonFinite ? ['warn.divisionByZero'] : [];
  },
  references: ["Ohm's law / power triangle"],
};
