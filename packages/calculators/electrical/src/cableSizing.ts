import type { DataAccess, Values } from '@calc/engine';
import type {
  ConductorMaterial,
  Insulation,
  InstallMethod,
  AmbientTemp,
  Grouping,
  ConductorTemp,
} from '@calc/data';

export type ElectricalSystem = 'dc' | '1ph' | '3ph';
export type LoadType = 'power' | 'current';

export interface CableSizingInputs extends Values {
  system: ElectricalSystem;
  loadType: LoadType;
  power?: number; // P, base: W (loadType='power')
  current?: number; // given load current, base: A (loadType='current')
  voltage: number; // U, base: V
  cosPhi?: number; // AC + loadType='power' only, defaults to 1
  material: ConductorMaterial;
  insulation: Insulation;
  installMethod: InstallMethod;
  ambientTemp: AmbientTemp;
  grouping: Grouping;
  length?: number; // L, base: m — if given, ΔU is also computed
}

export interface CableSizingOutputs extends Values {
  designCurrent: number; // Ib, base: A
  ambientCorrectionFactor: number; // k1
  groupingCorrectionFactor: number; // k2
  requiredAmpacity: number; // Iz_req = Ib / (k1·k2), base: A
  crossSection: number; // S — the chosen standard cross-section, base: mm²
  tableAmpacity: number; // Iz_table — tabulated Iz for the chosen cross-section, base: A
  marginPercent: number; // (Iz_table/Iz_req - 1)·100; negative -> no cross-section fit (see warnings)
  voltageDrop?: number; // ΔU, only if length is given, base: V
  voltageDropPercent?: number; // ΔU%, only if length is given
}

function designCurrentFrom(inputs: CableSizingInputs): number {
  if (inputs.loadType === 'current') {
    return inputs.current!;
  }
  const { system, power, voltage } = inputs;
  const cosPhi = inputs.cosPhi ?? 1;
  if (system === 'dc') return power! / voltage;
  const kFactor = system === '3ph' ? Math.sqrt(3) : 1;
  return power! / (kFactor * cosPhi * voltage);
}

/**
 * IEC 60364-5-52: Iz_req = Ib / (k1·k2), pick the smallest standard
 * cross-section with tabulated Iz ≥ Iz_req. If none fits, take the largest
 * one in the range (margin comes out negative, see warnings in
 * cableSizing.calculator.ts — deliberately not a boolean tooLarge field,
 * since Values doesn't support booleans).
 */
export function solveCableSizing(inputs: CableSizingInputs, data: DataAccess): CableSizingOutputs {
  const { system, material, insulation, installMethod, ambientTemp, grouping, voltage, length } = inputs;

  const designCurrent = designCurrentFrom(inputs);

  const ambientCorrectionFactor = data.lookup<Record<Insulation, number>>(
    'ampacity/ambient-correction',
    String(ambientTemp),
  )[insulation];
  const groupingCorrectionFactor = data.lookup<number>('ampacity/grouping-factor', grouping);
  const requiredAmpacity = designCurrent / (ambientCorrectionFactor * groupingCorrectionFactor);

  const sections = data.lookup<number[]>('ampacity/sections', material);
  const ampacityByMethod = data.lookup<Record<InstallMethod, number[]>>(
    'ampacity/iz',
    `${material}-${insulation}`,
  );
  const ampacityRow = ampacityByMethod[installMethod];
  const foundIdx = ampacityRow.findIndex((iz) => iz >= requiredAmpacity);
  const resolvedIdx = foundIdx === -1 ? ampacityRow.length - 1 : foundIdx;

  // resolvedIdx is always valid: either the found index, or the last element of the range.
  const crossSection = sections[resolvedIdx]!;
  const tableAmpacity = ampacityRow[resolvedIdx]!;
  const marginPercent = (tableAmpacity / requiredAmpacity - 1) * 100;

  const outputs: CableSizingOutputs = {
    designCurrent,
    ambientCorrectionFactor,
    groupingCorrectionFactor,
    requiredAmpacity,
    crossSection,
    tableAmpacity,
    marginPercent,
  };

  if (length !== undefined && length > 0) {
    const operatingTemp = data.lookup<ConductorTemp>('resistivity/operating-temp', insulation);
    const rho = data.lookup<Record<ConductorTemp, number>>('resistivity/table', material)[operatingTemp];
    const factor = system === '3ph' ? Math.sqrt(3) : 2;
    const voltageDrop = (factor * rho * length * designCurrent) / crossSection;
    outputs.voltageDrop = voltageDrop;
    outputs.voltageDropPercent = (voltageDrop / voltage) * 100;
  }

  return outputs;
}
