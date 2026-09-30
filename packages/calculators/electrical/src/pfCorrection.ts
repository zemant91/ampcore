import type { Values } from '@calc/engine';

export interface PfCorrectionInputs extends Values {
  power: number; // P, base: W
  cosPhi: number; // the existing power factor
  targetCosPhi: number;
}

export interface PfCorrectionOutputs extends Values {
  compensationPower: number; // Qc, base: var — 0 if the target is already met
  apparentPowerBefore: number; // base: VA
  apparentPowerAfter: number; // base: VA
  currentReductionPercent: number; // supply-current drop at the same voltage, %
}

const tanFrom = (cosPhi: number) => Math.sqrt(1 - cosPhi * cosPhi) / cosPhi;

/** Qc = P·(tanφ₁ − tanφ₂): the capacitor-bank power that lifts cosφ₁ to cosφ₂ at constant P. */
export function solvePfCorrection({ power, cosPhi, targetCosPhi }: PfCorrectionInputs): PfCorrectionOutputs {
  const apparentPowerBefore = power / cosPhi;
  const compensationPower = Math.max(power * (tanFrom(cosPhi) - tanFrom(targetCosPhi)), 0);
  const apparentPowerAfter = compensationPower === 0 ? apparentPowerBefore : power / targetCosPhi;
  return {
    compensationPower,
    apparentPowerBefore,
    apparentPowerAfter,
    currentReductionPercent: (1 - apparentPowerAfter / apparentPowerBefore) * 100,
  };
}
