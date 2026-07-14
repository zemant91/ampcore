import type { DataAccess, Values } from '@calc/engine';

export interface BreakerSelectionInputs extends Values {
  designCurrent: number; // Ip, base: A
  cableAmpacity: number; // Iz, base: A
}

export interface BreakerSelectionOutputs extends Values {
  rating?: number; // In — the smallest standard rating with Ip ≤ In ≤ Iz; undefined if none fits
}

/** EN 60898: the smallest standard rating In satisfying Ip ≤ In ≤ Iz */
export function solveBreakerSelection(inputs: BreakerSelectionInputs, data: DataAccess): BreakerSelectionOutputs {
  const { designCurrent, cableAmpacity } = inputs;
  const standardRatings = data.lookup<number[]>('breakers/standard-ratings', '*');
  const rating = standardRatings.find((n) => n >= designCurrent && n <= cableAmpacity);
  return { rating };
}
