import type { CalculatorDef } from '@calc/engine';
import {
  solveTransformerRating,
  type TransformerRatingInputs,
  type TransformerRatingOutputs,
} from './transformerRating';

export const transformerRating: CalculatorDef<TransformerRatingInputs, TransformerRatingOutputs> = {
  id: 'transformer_rating',
  titleKey: 'calc.transformerRating.title',
  descriptionKey: 'calc.transformerRating.desc',
  category: 'protection-coordination',
  tier: 'pro',
  fields: [
    {
      id: 'system',
      labelKey: 'field.system',
      quantity: 'dimensionless',
      role: 'input',
      options: [
        { value: '3ph', labelKey: 'system.3ph' },
        { value: '1ph', labelKey: 'system.1ph' },
      ],
    },
    { id: 'power', labelKey: 'field.power', symbol: 'P', quantity: 'power', role: 'input', defaultUnit: 'kW' },
    {
      id: 'cosPhi',
      labelKey: 'field.cosPhi',
      symbol: 'cosφ',
      quantity: 'dimensionless',
      role: 'input',
      defaultUnit: 'unit',
      validation: { min: 0.01, max: 1 },
    },
    {
      id: 'reservePercent',
      labelKey: 'field.reservePercent',
      quantity: 'dimensionless',
      role: 'input',
      defaultUnit: 'unit',
      validation: { min: 0, max: 100 },
    },
    {
      id: 'primaryVoltage',
      labelKey: 'field.primaryVoltage',
      symbol: 'U1',
      quantity: 'voltage',
      role: 'input',
      defaultUnit: 'kV',
    },
    {
      id: 'secondaryVoltage',
      labelKey: 'field.secondaryVoltage',
      symbol: 'U2',
      quantity: 'voltage',
      role: 'input',
      defaultUnit: 'V',
    },
    {
      id: 'requiredApparentPower',
      labelKey: 'field.requiredApparentPower',
      symbol: 'S',
      quantity: 'apparentPower',
      role: 'output',
      defaultUnit: 'kVA',
    },
    {
      id: 'ratedApparentPower',
      labelKey: 'field.ratedApparentPower',
      symbol: 'Sr',
      quantity: 'apparentPower',
      role: 'output',
      defaultUnit: 'kVA',
    },
    {
      id: 'loadPercent',
      labelKey: 'field.transformerLoad',
      quantity: 'dimensionless',
      role: 'output',
      defaultUnit: 'unit',
    },
    {
      id: 'primaryCurrent',
      labelKey: 'field.primaryCurrent',
      symbol: 'I1',
      quantity: 'current',
      role: 'output',
      defaultUnit: 'A',
    },
    {
      id: 'secondaryCurrent',
      labelKey: 'field.secondaryCurrent',
      symbol: 'I2',
      quantity: 'current',
      role: 'output',
      defaultUnit: 'A',
    },
  ],
  validate: (inputs) => {
    const missing = (['power', 'primaryVoltage', 'secondaryVoltage'] as const).some((k) => inputs[k] === undefined);
    if (missing) return ['error.missingRequiredFields'];
    const { cosPhi } = inputs;
    return cosPhi !== undefined && (cosPhi < 0.01 || cosPhi > 1) ? ['error.cosPhiOutOfRange'] : null;
  },
  compute: (inputs, data) => solveTransformerRating(inputs, data),
  warnings: (_inputs, outputs) => (outputs.ratedApparentPower === undefined ? ['error.noTransformerFitsInRange'] : []),
  references: ['EN 50464-1', 'IEC 60076'],
  formulaKeys: () => ['formula.transformer.1', 'formula.transformer.2'],
  chainTo: [
    {
      calculatorId: 'short_circuit',
      labelKey: 'calc.shortCircuit.title',
      // EN 50464-1 typical uk: 4 % up to 630 kVA, 6 % above — an editable starting point, not a nameplate value
      mapOutputs: (outputs, inputs) => ({
        transformerPower: outputs.ratedApparentPower,
        ukPercent: outputs.ratedApparentPower === undefined ? undefined : outputs.ratedApparentPower <= 630000 ? 4 : 6,
        voltage: inputs.secondaryVoltage,
      }),
    },
  ],
};
