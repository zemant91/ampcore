import type { CalculatorDef } from '@calc/engine';
import { solveCableSizing, type CableSizingInputs, type CableSizingOutputs } from './cableSizing';

const VOLTAGE_DROP_WARN_THRESHOLD_PERCENT = 5;

export const cableSizing: CalculatorDef<CableSizingInputs, CableSizingOutputs> = {
  id: 'cable_sizing',
  titleKey: 'calc.cableSizing.title',
  descriptionKey: 'calc.cableSizing.desc',
  category: 'cable-wiring',
  tier: 'pro',
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
      id: 'loadType',
      labelKey: 'field.loadType',
      quantity: 'dimensionless',
      role: 'input',
      options: [
        { value: 'power', labelKey: 'loadType.power' },
        { value: 'current', labelKey: 'loadType.current' },
      ],
    },
    {
      id: 'power',
      labelKey: 'field.power',
      symbol: 'P',
      quantity: 'power',
      role: 'input',
      defaultUnit: 'kW',
      visibleIf: (v) => v.loadType === 'power',
    },
    {
      id: 'current',
      labelKey: 'field.loadCurrent',
      symbol: 'I',
      quantity: 'current',
      role: 'input',
      defaultUnit: 'A',
      visibleIf: (v) => v.loadType === 'current',
    },
    {
      id: 'cosPhi',
      labelKey: 'field.cosPhi',
      symbol: 'cosφ',
      quantity: 'dimensionless',
      role: 'input',
      defaultUnit: 'unit',
      validation: { min: 0.01, max: 1 },
      visibleIf: (v) => v.loadType === 'power' && v.system !== 'dc',
    },
    { id: 'voltage', labelKey: 'field.voltage', symbol: 'U', quantity: 'voltage', role: 'input', defaultUnit: 'V' },
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
      id: 'insulation',
      labelKey: 'field.insulation',
      quantity: 'dimensionless',
      role: 'input',
      options: [
        { value: 'PVC', labelKey: 'insulation.pvc' },
        { value: 'XLPE', labelKey: 'insulation.xlpe' },
      ],
    },
    {
      id: 'installMethod',
      labelKey: 'field.installMethod',
      quantity: 'dimensionless',
      role: 'input',
      options: [
        { value: 'A1', labelKey: 'installMethod.a1', descriptionKey: 'installMethod.a1.desc' },
        { value: 'B1', labelKey: 'installMethod.b1', descriptionKey: 'installMethod.b1.desc' },
        { value: 'C', labelKey: 'installMethod.c', descriptionKey: 'installMethod.c.desc' },
        { value: 'E', labelKey: 'installMethod.e', descriptionKey: 'installMethod.e.desc' },
      ],
    },
    {
      id: 'ambientTemp',
      labelKey: 'field.ambientTemperature',
      quantity: 'temperature',
      role: 'input',
      defaultUnit: 'C',
      options: [
        { value: 20, labelKey: 'ambientTemp.20' },
        { value: 25, labelKey: 'ambientTemp.25' },
        { value: 30, labelKey: 'ambientTemp.30' },
        { value: 35, labelKey: 'ambientTemp.35' },
        { value: 40, labelKey: 'ambientTemp.40' },
      ],
    },
    {
      id: 'grouping',
      labelKey: 'field.grouping',
      quantity: 'dimensionless',
      role: 'input',
      options: [
        { value: '1', labelKey: 'grouping.1' },
        { value: '2', labelKey: 'grouping.2' },
        { value: '3', labelKey: 'grouping.3' },
        { value: '4', labelKey: 'grouping.4' },
        { value: '5', labelKey: 'grouping.5' },
        { value: '6+', labelKey: 'grouping.6plus' },
      ],
    },
    { id: 'length', labelKey: 'field.length', symbol: 'L', quantity: 'length', role: 'input', defaultUnit: 'm' },
    {
      id: 'designCurrent',
      labelKey: 'field.designCurrent',
      symbol: 'Ib',
      quantity: 'current',
      role: 'output',
      defaultUnit: 'A',
    },
    {
      id: 'requiredAmpacity',
      labelKey: 'field.requiredAmpacity',
      symbol: 'Iz(req)',
      quantity: 'current',
      role: 'output',
      defaultUnit: 'A',
    },
    {
      id: 'crossSection',
      labelKey: 'field.crossSection',
      symbol: 'S',
      quantity: 'area',
      role: 'output',
      defaultUnit: 'mm2',
    },
    {
      id: 'tableAmpacity',
      labelKey: 'field.tableAmpacity',
      symbol: 'Iz',
      quantity: 'current',
      role: 'output',
      defaultUnit: 'A',
    },
    {
      id: 'marginPercent',
      labelKey: 'field.ampacityMargin',
      symbol: 'margin',
      quantity: 'dimensionless',
      role: 'output',
      defaultUnit: 'unit',
    },
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
    if (inputs.voltage === undefined) return ['error.missingRequiredFields'];
    if (inputs.loadType === 'power' && inputs.power === undefined) return ['error.missingRequiredFields'];
    if (inputs.loadType === 'current' && inputs.current === undefined) return ['error.missingRequiredFields'];
    return null;
  },
  compute: (inputs, data) => solveCableSizing(inputs, data),
  warnings: (_inputs, outputs) => {
    const warnings: string[] = [];
    if (outputs.marginPercent < 0) {
      warnings.push('warn.cableSizingNoTableFit');
    }
    if (outputs.voltageDropPercent !== undefined && outputs.voltageDropPercent > VOLTAGE_DROP_WARN_THRESHOLD_PERCENT) {
      warnings.push('warn.voltageDropExceedsIec');
    }
    return warnings;
  },
  references: ['IEC 60364-5-52'],
  chainTo: [
    {
      calculatorId: 'breaker_selection',
      labelKey: 'chainTo.breakerSelection',
      mapOutputs: (outputs) => ({
        designCurrent: outputs.designCurrent,
        cableAmpacity: outputs.tableAmpacity,
      }),
    },
  ],
};
