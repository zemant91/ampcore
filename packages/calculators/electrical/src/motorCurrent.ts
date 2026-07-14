import type { Values } from '@calc/engine';

export type MotorPhase = '1ph' | '3ph';

export interface MotorCurrentInputs extends Values {
  system: MotorPhase;
  power: number; // P, base: W
  voltage: number; // U, base: V
  efficiency: number; // η, 0..1
  cosPhi: number; // cosφ, 0..1
}

export interface MotorCurrentOutputs extends Values {
  current: number; // I (nominal current), base: A
  startupCurrentMin: number; // ≈5×I — typical startup-current range for an induction motor
  startupCurrentMax: number; // ≈7×I
}

const STARTUP_FACTOR_MIN = 5;
const STARTUP_FACTOR_MAX = 7;

export function solveMotorCurrent(inputs: MotorCurrentInputs): MotorCurrentOutputs {
  const { system, power, voltage, efficiency, cosPhi } = inputs;
  const kFactor = system === '3ph' ? Math.sqrt(3) : 1;
  const current = power / (kFactor * voltage * efficiency * cosPhi);

  return {
    current,
    startupCurrentMin: STARTUP_FACTOR_MIN * current,
    startupCurrentMax: STARTUP_FACTOR_MAX * current,
  };
}
