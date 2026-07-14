import type { CalculatorDef } from '@calc/engine';
import { solveConduitFill, type ConduitFillInputs, type ConduitFillOutputs } from './conduitFill';

export const conduitFill: CalculatorDef<ConduitFillInputs, ConduitFillOutputs> = {
  id: 'conduit_fill',
  titleKey: 'calc.conduitFill.title',
  descriptionKey: 'calc.conduitFill.desc',
  category: 'cable-wiring',
  tier: 'pro',
  fields: [
    {
      id: 'conduitDiameter',
      labelKey: 'field.conduitDiameter',
      symbol: 'D',
      quantity: 'length',
      role: 'input',
      defaultUnit: 'mm',
    },
    {
      id: 'cableCount',
      labelKey: 'field.cableCount',
      symbol: 'n',
      quantity: 'dimensionless',
      role: 'input',
      defaultUnit: 'unit',
    },
    {
      id: 'totalCableArea',
      labelKey: 'field.totalCableArea',
      symbol: 'ΣA',
      quantity: 'area',
      role: 'input',
      defaultUnit: 'mm2',
    },
    {
      id: 'fillPercent',
      labelKey: 'field.conduitFillPercent',
      symbol: 'Fill',
      quantity: 'dimensionless',
      role: 'output',
      defaultUnit: 'unit',
    },
    {
      id: 'fillLimit',
      labelKey: 'field.conduitFillLimit',
      symbol: 'Limit',
      quantity: 'dimensionless',
      role: 'output',
      defaultUnit: 'unit',
    },
  ],
  validate: (inputs) => {
    const missing = (['conduitDiameter', 'cableCount', 'totalCableArea'] as const).some(
      (k) => inputs[k] === undefined,
    );
    return missing ? ['error.missingRequiredFields'] : null;
  },
  compute: (inputs, data) => solveConduitFill(inputs, data),
  warnings: (_inputs, outputs) =>
    outputs.fillPercent > outputs.fillLimit ? ['warn.conduitFillExceedsLimit'] : [],
  references: ['NEC/IEC conduit fill practice'],
};
