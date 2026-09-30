import type { CalculatorDef } from '@calc/engine';
import { solvePowerFactor, type PowerFactorInputs, type PowerFactorOutputs } from './powerFactor';

const FIELD_IDS = ['power', 'reactivePower', 'apparentPower', 'cosPhi'] as const;

export const powerFactor: CalculatorDef<PowerFactorInputs, PowerFactorOutputs> = {
  id: 'power_factor',
  titleKey: 'calc.powerFactor.title',
  descriptionKey: 'calc.powerFactor.desc',
  category: 'fundamentals',
  tier: 'free',
  // All four are role:'input' — which two the user typed is decided at render
  // time (dynamicRoleFieldIds), exactly like ohms_law.
  fields: [
    { id: 'power', labelKey: 'field.power', symbol: 'P', quantity: 'power', role: 'input', defaultUnit: 'kW' },
    {
      id: 'reactivePower',
      labelKey: 'field.reactivePower',
      symbol: 'Q',
      quantity: 'reactivePower',
      role: 'input',
      defaultUnit: 'kvar',
    },
    {
      id: 'apparentPower',
      labelKey: 'field.apparentPower',
      symbol: 'S',
      quantity: 'apparentPower',
      role: 'input',
      defaultUnit: 'kVA',
    },
    {
      id: 'cosPhi',
      labelKey: 'field.cosPhi',
      symbol: 'cosφ',
      quantity: 'dimensionless',
      role: 'input',
      defaultUnit: 'unit',
      validation: { min: 0.01, max: 1 },
    },
  ],
  validate: (inputs) => {
    if (FIELD_IDS.filter((k) => inputs[k] !== undefined).length !== 2) return ['error.needExactlyTwoValues'];
    const { cosPhi, apparentPower: S, power: P, reactivePower: Q } = inputs;
    if (cosPhi !== undefined && (cosPhi < 0.01 || cosPhi > 1)) return ['error.cosPhiOutOfRange'];
    if (S !== undefined && ((P !== undefined && S < P) || (Q !== undefined && S < Q))) {
      return ['error.apparentPowerTooSmall'];
    }
    return null;
  },
  compute: (inputs) => solvePowerFactor(inputs),
  warnings: (_inputs, outputs) => {
    const nonFinite = Object.values(outputs).some((v) => typeof v === 'number' && !Number.isFinite(v));
    return nonFinite ? ['warn.divisionByZero'] : [];
  },
  references: ['IEC 60050-131'],
  dynamicRoleFieldIds: [...FIELD_IDS],
  formulaKeys: () => ['formula.powerFactor.1', 'formula.powerFactor.2', 'formula.powerFactor.3'],
  chainTo: [
    {
      calculatorId: 'pf_correction',
      labelKey: 'calc.pfCorrection.title',
      mapOutputs: (outputs) => ({ power: outputs.power, cosPhi: outputs.cosPhi }),
    },
    {
      calculatorId: 'transformer_rating',
      labelKey: 'calc.transformerRating.title',
      mapOutputs: (outputs) => ({ power: outputs.power, cosPhi: outputs.cosPhi }),
    },
  ],
};
