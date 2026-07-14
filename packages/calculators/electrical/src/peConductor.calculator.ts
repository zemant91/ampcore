import type { CalculatorDef } from '@calc/engine';
import { PE_K_FACTORS } from '@calc/data';
import { solvePeConductor, type PeConductorInputs, type PeConductorOutputs } from './peConductor';

export const peConductor: CalculatorDef<PeConductorInputs, PeConductorOutputs> = {
  id: 'pe_conductor',
  titleKey: 'calc.peConductor.title',
  descriptionKey: 'calc.peConductor.desc',
  category: 'protection-coordination',
  tier: 'pro',
  fields: [
    {
      id: 'method',
      labelKey: 'field.method',
      quantity: 'dimensionless',
      role: 'input',
      options: [
        { value: 'adiabatic', labelKey: 'peMethod.adiabatic' },
        { value: 'simplified', labelKey: 'peMethod.simplified' },
      ],
    },
    {
      id: 'faultCurrent',
      labelKey: 'field.faultCurrent',
      symbol: 'I',
      quantity: 'current',
      role: 'input',
      defaultUnit: 'A',
      visibleIf: (v) => v.method === 'adiabatic',
    },
    {
      id: 'disconnectionTime',
      labelKey: 'field.disconnectionTime',
      symbol: 't',
      quantity: 'time',
      role: 'input',
      defaultUnit: 's',
      visibleIf: (v) => v.method === 'adiabatic',
    },
    {
      id: 'kFactor',
      labelKey: 'field.kFactor',
      symbol: 'k',
      quantity: 'dimensionless',
      role: 'input',
      // Values (143/115/76) — @calc/data PE_K_FACTORS is the single source
      // of truth; here we build the static field-schema option list once.
      options: PE_K_FACTORS.map((opt) => ({ value: opt.k, labelKey: `peKFactor.${opt.key}` })),
      visibleIf: (v) => v.method === 'adiabatic',
    },
    {
      id: 'phaseSection',
      labelKey: 'field.phaseSection',
      symbol: 'S',
      quantity: 'area',
      role: 'input',
      defaultUnit: 'mm2',
      visibleIf: (v) => v.method === 'simplified',
    },
    {
      id: 'requiredSection',
      labelKey: 'field.requiredPeSection',
      symbol: 'S_PE(calc)',
      quantity: 'area',
      role: 'output',
      defaultUnit: 'mm2',
    },
    {
      id: 'standardSection',
      labelKey: 'field.standardPeSection',
      symbol: 'S_PE',
      quantity: 'area',
      role: 'output',
      defaultUnit: 'mm2',
    },
  ],
  validate: (inputs) => {
    const missing =
      inputs.method === 'adiabatic'
        ? (['faultCurrent', 'disconnectionTime', 'kFactor'] as const).some((k) => inputs[k] === undefined)
        : inputs.phaseSection === undefined;
    return missing ? ['error.missingRequiredFields'] : null;
  },
  compute: (inputs, data) => solvePeConductor(inputs, data),
  warnings: (_inputs, outputs) =>
    outputs.standardSection === undefined ? ['error.noPeSizeFitsInRange'] : [],
  references: ['IEC 60364-5-54'],
};
