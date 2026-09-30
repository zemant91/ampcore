import type { CalculatorDef } from '@calc/engine';
import { solveMotorCurrent, type MotorCurrentInputs, type MotorCurrentOutputs } from './motorCurrent';

export const motorCurrent: CalculatorDef<MotorCurrentInputs, MotorCurrentOutputs> = {
  id: 'motor_current',
  titleKey: 'calc.motorCurrent.title',
  descriptionKey: 'calc.motorCurrent.desc',
  category: 'motors-drives',
  tier: 'pro',
  fields: [
    {
      id: 'system',
      labelKey: 'field.system',
      quantity: 'dimensionless',
      role: 'input',
      options: [
        { value: '1ph', labelKey: 'system.1ph' },
        { value: '3ph', labelKey: 'system.3ph' },
      ],
    },
    { id: 'power', labelKey: 'field.power', symbol: 'P', quantity: 'power', role: 'input', defaultUnit: 'kW' },
    { id: 'voltage', labelKey: 'field.voltage', symbol: 'U', quantity: 'voltage', role: 'input', defaultUnit: 'V' },
    {
      id: 'efficiency',
      labelKey: 'field.efficiency',
      symbol: 'η',
      quantity: 'dimensionless',
      role: 'input',
      defaultUnit: 'unit',
      validation: { min: 0.01, max: 1 },
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
    { id: 'current', labelKey: 'field.nominalCurrent', symbol: 'I', quantity: 'current', role: 'output', defaultUnit: 'A' },
    {
      id: 'startupCurrentMin',
      labelKey: 'field.startupCurrentMin',
      symbol: 'Ist min',
      quantity: 'current',
      role: 'output',
      defaultUnit: 'A',
    },
    {
      id: 'startupCurrentMax',
      labelKey: 'field.startupCurrentMax',
      symbol: 'Ist max',
      quantity: 'current',
      role: 'output',
      defaultUnit: 'A',
    },
  ],
  validate: (inputs) => {
    const required = ['power', 'voltage', 'efficiency', 'cosPhi'] as const;
    const missing = required.some((k) => inputs[k] === undefined);
    return missing ? ['error.missingRequiredFields'] : null;
  },
  compute: (inputs) => solveMotorCurrent(inputs),
  warnings: (_inputs, outputs) => {
    const hasNonFinite = Object.values(outputs).some(
      (v) => typeof v === 'number' && !Number.isFinite(v),
    );
    return hasNonFinite ? ['warn.divisionByZero'] : [];
  },
  references: ['IEC 60034'],
  chainTo: [
    {
      calculatorId: 'cable_sizing',
      labelKey: 'calc.cableSizing.title',
      mapOutputs: (outputs, inputs) => ({
        system: inputs.system,
        loadType: 'current',
        current: outputs.current,
        voltage: inputs.voltage,
      }),
    },
    {
      calculatorId: 'breaker_selection',
      labelKey: 'chainTo.breakerSelection',
      mapOutputs: (outputs) => ({ designCurrent: outputs.current }),
    },
  ],
};
