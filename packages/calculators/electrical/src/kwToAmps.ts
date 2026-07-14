import type { Values } from '@calc/engine';

export type ElectricalSystem = 'dc' | '1ph' | '3ph';

export interface KwToAmpsInputs extends Values {
  system: ElectricalSystem;
  power: number; // P, base: W
  voltage: number; // U, base: V
  cosPhi?: number; // AC only, defaults to 1 (same as in ohms_law)
}

export interface KwToAmpsOutputs extends Values {
  current: number; // I, base: A
}

/**
 * Unlike ohms_law, this isn't a "solve any 2 of N" — power/voltage are
 * always inputs, current is always the output. The formula mirrors the AC
 * branch of solveOhmsLaw (same kFactor·cosφ), but simpler: there's no
 * "through Z" branch here.
 */
export function solveKwToAmps(inputs: KwToAmpsInputs): KwToAmpsOutputs {
  const { system, power, voltage } = inputs;
  if (system === 'dc') {
    return { current: power / voltage };
  }
  const cosPhi = inputs.cosPhi ?? 1;
  const kFactor = system === '3ph' ? Math.sqrt(3) : 1;
  return { current: power / (kFactor * cosPhi * voltage) };
}
