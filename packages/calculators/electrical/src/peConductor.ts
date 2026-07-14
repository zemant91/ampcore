import type { DataAccess, Values } from '@calc/engine';

export type PeMethod = 'adiabatic' | 'simplified';

export interface PeConductorInputs extends Values {
  method: PeMethod;
  faultCurrent?: number; // I, base: A (adiabatic)
  disconnectionTime?: number; // t, base: s (adiabatic)
  kFactor?: number; // k, material factor (adiabatic) — see @calc/data PE_K_FACTORS
  phaseSection?: number; // S_ph, base: mm² (simplified)
}

export interface PeConductorOutputs extends Values {
  requiredSection: number; // S_PE required (adiabatic or per Table 54.7), base: mm²
  standardSection?: number; // rounded up to the standard range; undefined if the required section is > 300mm²
}

/** IEC 60364-5-54: S = I·√t / k */
function requiredByAdiabatic(current: number, time: number, k: number): number {
  return (current * Math.sqrt(time)) / k;
}

/** IEC 60364-5-54 Table 54.7 (simplified relation to the phase conductor's cross-section) */
function requiredBySimplified(phaseSection: number): number {
  if (phaseSection <= 16) return phaseSection;
  if (phaseSection <= 35) return 16;
  return phaseSection / 2;
}

export function solvePeConductor(inputs: PeConductorInputs, data: DataAccess): PeConductorOutputs {
  const requiredSection =
    inputs.method === 'adiabatic'
      ? requiredByAdiabatic(inputs.faultCurrent!, inputs.disconnectionTime!, inputs.kFactor!)
      : requiredBySimplified(inputs.phaseSection!);

  const standardSizes = data.lookup<number[]>('pe/standard-sizes', '*');
  const standardSection = standardSizes.find((s) => s >= requiredSection);

  return { requiredSection, standardSection };
}
