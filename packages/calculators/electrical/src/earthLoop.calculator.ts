import type { CalculatorDef } from '@calc/engine';
import { solveEarthLoop, type EarthLoopInputs, type EarthLoopOutputs } from './earthLoop';

export const earthLoop: CalculatorDef<EarthLoopInputs, EarthLoopOutputs> = {
  id: 'earth_loop',
  titleKey: 'calc.earthLoop.title',
  descriptionKey: 'calc.earthLoop.desc',
  category: 'protection-coordination',
  tier: 'pro',
  fields: [
    { id: 'voltage', labelKey: 'field.earthVoltage', symbol: 'U0', quantity: 'voltage', role: 'input', defaultUnit: 'V' },
    {
      id: 'externalImpedance',
      labelKey: 'field.externalImpedance',
      symbol: 'Ze',
      quantity: 'resistance',
      role: 'input',
      defaultUnit: 'ohm',
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
    { id: 'length', labelKey: 'field.length', symbol: 'L', quantity: 'length', role: 'input', defaultUnit: 'm' },
    {
      id: 'phaseArea',
      labelKey: 'field.phaseSection',
      symbol: 'S',
      quantity: 'area',
      role: 'input',
      defaultUnit: 'mm2',
    },
    {
      id: 'peArea',
      labelKey: 'field.peSection',
      symbol: 'Spe',
      quantity: 'area',
      role: 'input',
      defaultUnit: 'mm2',
    },
    {
      id: 'breakerRating',
      labelKey: 'field.breakerRating',
      symbol: 'In',
      quantity: 'current',
      role: 'input',
      defaultUnit: 'A',
    },
    {
      id: 'tripCurve',
      labelKey: 'field.tripCurve',
      quantity: 'dimensionless',
      role: 'input',
      options: [
        { value: 'B', labelKey: 'tripCurve.B' },
        { value: 'C', labelKey: 'tripCurve.C' },
        { value: 'D', labelKey: 'tripCurve.D' },
      ],
    },
    {
      id: 'loopResistance',
      labelKey: 'field.loopResistance',
      symbol: 'R1+R2',
      quantity: 'resistance',
      role: 'output',
      defaultUnit: 'ohm',
    },
    {
      id: 'earthLoopImpedance',
      labelKey: 'field.earthLoopImpedance',
      symbol: 'Zs',
      quantity: 'resistance',
      role: 'output',
      defaultUnit: 'ohm',
    },
    {
      id: 'earthFaultCurrent',
      labelKey: 'field.faultCurrent',
      symbol: 'If',
      quantity: 'current',
      role: 'output',
      defaultUnit: 'A',
    },
    {
      id: 'maxLoopImpedance',
      labelKey: 'field.maxLoopImpedance',
      symbol: 'Zs,max',
      quantity: 'resistance',
      role: 'output',
      defaultUnit: 'ohm',
    },
    {
      id: 'marginPercent',
      labelKey: 'field.ampacityMargin',
      symbol: 'margin',
      quantity: 'dimensionless',
      role: 'output',
      defaultUnit: 'unit',
    },
  ],
  validate: (inputs) => {
    const required = ['voltage', 'length', 'phaseArea', 'peArea', 'breakerRating'] as const;
    return required.some((k) => inputs[k] === undefined) ? ['error.missingRequiredFields'] : null;
  },
  compute: (inputs, data) => solveEarthLoop(inputs, data),
  warnings: (_inputs, outputs) => {
    const nonFinite = Object.values(outputs).some((v) => typeof v === 'number' && !Number.isFinite(v));
    if (nonFinite) return ['warn.divisionByZero'];
    return outputs.marginPercent < 0 ? ['warn.earthLoopTooHigh'] : [];
  },
  references: ['IEC 60364-4-41', 'IEC 60898-1'],
  formulaKeys: () => ['formula.earthLoop.1', 'formula.earthLoop.2'],
};
