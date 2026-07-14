import type { CalculatorDef } from '@calc/engine';
import { solveVoltageDrop, type VoltageDropInputs, type VoltageDropOutputs } from './voltageDrop';

const WARN_THRESHOLD_PERCENT = 5; // IEC-recommended ΔU% limit
const LARGE_SECTION_MM2 = 50; // above this, reactance becomes noticeable — the formula doesn't account for it

export const voltageDrop: CalculatorDef<VoltageDropInputs, VoltageDropOutputs> = {
  id: 'voltage_drop',
  titleKey: 'calc.voltageDrop.title',
  descriptionKey: 'calc.voltageDrop.desc',
  category: 'cable-wiring',
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
    {
      id: 'temperature',
      labelKey: 'field.conductorTemperature',
      quantity: 'temperature',
      role: 'input',
      defaultUnit: 'C',
      options: [
        { value: 20, labelKey: 'temp.20' },
        { value: 70, labelKey: 'temp.70' },
        { value: 90, labelKey: 'temp.90' },
      ],
    },
    { id: 'voltage', labelKey: 'field.voltage', symbol: 'U', quantity: 'voltage', role: 'input', defaultUnit: 'V' },
    { id: 'current', labelKey: 'field.current', symbol: 'I', quantity: 'current', role: 'input', defaultUnit: 'A' },
    { id: 'length', labelKey: 'field.length', symbol: 'L', quantity: 'length', role: 'input', defaultUnit: 'm' },
    { id: 'area', labelKey: 'field.crossSection', symbol: 'S', quantity: 'area', role: 'input', defaultUnit: 'mm2' },
    {
      id: 'voltageDrop',
      labelKey: 'field.voltageDrop',
      symbol: 'ΔU',
      quantity: 'voltage',
      role: 'output',
      defaultUnit: 'V',
    },
    {
      id: 'voltageDropPercent',
      labelKey: 'field.voltageDropPercent',
      symbol: 'ΔU%',
      quantity: 'dimensionless',
      role: 'output',
      defaultUnit: 'unit',
    },
  ],
  validate: (inputs) => {
    const required = ['voltage', 'current', 'length', 'area'] as const;
    const missing = required.some((k) => inputs[k] === undefined);
    return missing ? ['error.missingRequiredFields'] : null;
  },
  compute: (inputs, data) => solveVoltageDrop(inputs, data),
  warnings: (_inputs, outputs) => {
    const warnings: string[] = [];
    if (outputs.voltageDropPercent > WARN_THRESHOLD_PERCENT) {
      warnings.push('warn.voltageDropExceedsIec');
    }
    if (_inputs.area > LARGE_SECTION_MM2) {
      warnings.push('info.largeSectionReactanceIgnored');
    }
    return warnings;
  },
  references: ['IEC 60364-5-52 Annex G'],
};
