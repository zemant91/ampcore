import type { CalculatorDef } from '@calc/engine';
import { solveShortCircuit, type ShortCircuitInputs, type ShortCircuitOutputs } from './shortCircuit';

export const shortCircuit: CalculatorDef<ShortCircuitInputs, ShortCircuitOutputs> = {
  id: 'short_circuit',
  titleKey: 'calc.shortCircuit.title',
  descriptionKey: 'calc.shortCircuit.desc',
  category: 'protection-coordination',
  tier: 'pro',
  fields: [
    {
      id: 'transformerPower',
      labelKey: 'field.transformerPower',
      symbol: 'Sr',
      quantity: 'apparentPower',
      role: 'input',
      defaultUnit: 'kVA',
    },
    {
      id: 'ukPercent',
      labelKey: 'field.ukPercent',
      symbol: 'uk',
      quantity: 'dimensionless',
      role: 'input',
      defaultUnit: 'unit',
      validation: { min: 0.1, max: 20 },
    },
    { id: 'voltage', labelKey: 'field.voltage', symbol: 'Un', quantity: 'voltage', role: 'input', defaultUnit: 'V' },
    {
      id: 'networkPower',
      labelKey: 'field.networkPower',
      symbol: 'S"kQ',
      quantity: 'apparentPower',
      role: 'input',
      defaultUnit: 'MVA',
    },
    {
      id: 'material',
      labelKey: 'field.material',
      quantity: 'dimensionless',
      role: 'input',
      options: [
        { value: 'Cu', labelKey: 'material.cu' },
        { value: 'Al', labelKey: 'material.al' },
      ],
    },
    { id: 'area', labelKey: 'field.crossSection', symbol: 'S', quantity: 'area', role: 'input', defaultUnit: 'mm2' },
    { id: 'length', labelKey: 'field.length', symbol: 'L', quantity: 'length', role: 'input', defaultUnit: 'm' },
    {
      id: 'shortCircuitCurrentSource',
      labelKey: 'field.shortCircuitSource',
      symbol: 'Ik″',
      quantity: 'current',
      role: 'output',
      defaultUnit: 'kA',
    },
    {
      id: 'shortCircuitCurrent',
      labelKey: 'field.shortCircuitEnd',
      symbol: 'Ik″',
      quantity: 'current',
      role: 'output',
      defaultUnit: 'kA',
    },
    {
      id: 'totalImpedance',
      labelKey: 'field.totalImpedance',
      symbol: 'Zk',
      quantity: 'resistance',
      role: 'output',
      defaultUnit: 'ohm',
    },
  ],
  validate: (inputs) => {
    const missing = (['transformerPower', 'ukPercent', 'voltage'] as const).some((k) => inputs[k] === undefined);
    if (missing) return ['error.missingRequiredFields'];
    // a cable run needs its cross-section
    return inputs.length !== undefined && inputs.length > 0 && inputs.area === undefined
      ? ['error.missingRequiredFields']
      : null;
  },
  compute: (inputs, data) => solveShortCircuit(inputs, data),
  warnings: (_inputs, outputs) => {
    const nonFinite = Object.values(outputs).some((v) => typeof v === 'number' && !Number.isFinite(v));
    return nonFinite ? ['warn.divisionByZero'] : [];
  },
  references: ['IEC 60909-0'],
  formulaKeys: () => ['formula.shortCircuit.1', 'formula.shortCircuit.2'],
};
