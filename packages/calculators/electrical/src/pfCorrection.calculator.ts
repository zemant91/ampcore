import type { CalculatorDef } from '@calc/engine';
import { solvePfCorrection, type PfCorrectionInputs, type PfCorrectionOutputs } from './pfCorrection';

const inRange = (v: number) => v >= 0.01 && v <= 1;

export const pfCorrection: CalculatorDef<PfCorrectionInputs, PfCorrectionOutputs> = {
  id: 'pf_correction',
  titleKey: 'calc.pfCorrection.title',
  descriptionKey: 'calc.pfCorrection.desc',
  category: 'fundamentals',
  tier: 'pro',
  fields: [
    { id: 'power', labelKey: 'field.power', symbol: 'P', quantity: 'power', role: 'input', defaultUnit: 'kW' },
    {
      id: 'cosPhi',
      labelKey: 'field.cosPhi',
      symbol: 'cosφ₁',
      quantity: 'dimensionless',
      role: 'input',
      defaultUnit: 'unit',
      validation: { min: 0.01, max: 1 },
    },
    {
      id: 'targetCosPhi',
      labelKey: 'field.targetCosPhi',
      symbol: 'cosφ₂',
      quantity: 'dimensionless',
      role: 'input',
      defaultUnit: 'unit',
      validation: { min: 0.01, max: 1 },
    },
    {
      id: 'compensationPower',
      labelKey: 'field.compensationPower',
      symbol: 'Qc',
      quantity: 'reactivePower',
      role: 'output',
      defaultUnit: 'kvar',
    },
    {
      id: 'apparentPowerBefore',
      labelKey: 'field.apparentPowerBefore',
      symbol: 'S₁',
      quantity: 'apparentPower',
      role: 'output',
      defaultUnit: 'kVA',
    },
    {
      id: 'apparentPowerAfter',
      labelKey: 'field.apparentPowerAfter',
      symbol: 'S₂',
      quantity: 'apparentPower',
      role: 'output',
      defaultUnit: 'kVA',
    },
    {
      id: 'currentReductionPercent',
      labelKey: 'field.currentReduction',
      quantity: 'dimensionless',
      role: 'output',
      defaultUnit: 'unit',
    },
  ],
  validate: (inputs) => {
    if ((['power', 'cosPhi', 'targetCosPhi'] as const).some((k) => inputs[k] === undefined)) {
      return ['error.missingRequiredFields'];
    }
    return inRange(inputs.cosPhi) && inRange(inputs.targetCosPhi) ? null : ['error.cosPhiOutOfRange'];
  },
  compute: (inputs) => solvePfCorrection(inputs),
  warnings: (inputs) => (inputs.targetCosPhi <= inputs.cosPhi ? ['info.pfAlreadyAtTarget'] : []),
  references: ['IEC 60831'],
  formulaKeys: () => ['formula.pfCorrection.1', 'formula.pfCorrection.2'],
};
