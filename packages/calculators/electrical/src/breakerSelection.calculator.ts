import type { CalculatorDef } from '@calc/engine';
import {
  solveBreakerSelection,
  type BreakerSelectionInputs,
  type BreakerSelectionOutputs,
} from './breakerSelection';

export const breakerSelection: CalculatorDef<BreakerSelectionInputs, BreakerSelectionOutputs> = {
  id: 'breaker_selection',
  titleKey: 'calc.breakerSelection.title',
  descriptionKey: 'calc.breakerSelection.desc',
  category: 'protection-coordination',
  tier: 'free',
  fields: [
    {
      id: 'designCurrent',
      labelKey: 'field.designCurrent',
      symbol: 'Ip',
      quantity: 'current',
      role: 'input',
      defaultUnit: 'A',
    },
    {
      id: 'cableAmpacity',
      labelKey: 'field.tableAmpacity',
      symbol: 'Iz',
      quantity: 'current',
      role: 'input',
      defaultUnit: 'A',
    },
    {
      id: 'rating',
      labelKey: 'field.breakerRating',
      symbol: 'In',
      quantity: 'current',
      role: 'output',
      defaultUnit: 'A',
    },
  ],
  validate: (inputs) => {
    const missing = (['designCurrent', 'cableAmpacity'] as const).some((k) => inputs[k] === undefined);
    return missing ? ['error.missingRequiredFields'] : null;
  },
  compute: (inputs, data) => solveBreakerSelection(inputs, data),
  warnings: (_inputs, outputs) => (outputs.rating === undefined ? ['error.noBreakerFitsInRange'] : []),
  references: ['EN 60898'],
  chainTo: [
    {
      calculatorId: 'earth_loop',
      labelKey: 'calc.earthLoop.title',
      mapOutputs: (outputs) => ({ breakerRating: outputs.rating }),
    },
  ],
};
