import type { DataAccess, Values } from '@calc/engine';

export type TransformerSystem = '1ph' | '3ph';

export interface TransformerRatingInputs extends Values {
  system: TransformerSystem;
  power: number; // P, base: W — active load
  cosPhi?: number; // defaults to 1
  reservePercent?: number; // growth / safety reserve, defaults to 0
  primaryVoltage: number; // base: V (line-to-line for 3ph)
  secondaryVoltage: number; // base: V
}

export interface TransformerRatingOutputs extends Values {
  requiredApparentPower: number; // load S plus reserve, base: VA
  ratedApparentPower?: number; // smallest standard rating ≥ required, base: VA; undefined above the table
  loadPercent?: number; // load S / rated S, % (without the reserve)
  primaryCurrent: number; // rated (or, if no rating fits, required) current, base: A
  secondaryCurrent: number;
}

export function solveTransformerRating(inputs: TransformerRatingInputs, data: DataAccess): TransformerRatingOutputs {
  const { system, power, primaryVoltage, secondaryVoltage } = inputs;
  const loadApparentPower = power / (inputs.cosPhi ?? 1);
  const requiredApparentPower = loadApparentPower * (1 + (inputs.reservePercent ?? 0) / 100);

  const ratingsKva = data.lookup<number[]>('transformers/standard-kva', '*');
  const ratedKva = ratingsKva.find((kva) => kva * 1000 >= requiredApparentPower);
  const ratedApparentPower = ratedKva === undefined ? undefined : ratedKva * 1000;

  const kFactor = system === '3ph' ? Math.sqrt(3) : 1;
  const currentBasis = ratedApparentPower ?? requiredApparentPower;
  return {
    requiredApparentPower,
    ratedApparentPower,
    loadPercent: ratedApparentPower === undefined ? undefined : (loadApparentPower / ratedApparentPower) * 100,
    primaryCurrent: currentBasis / (kFactor * primaryVoltage),
    secondaryCurrent: currentBasis / (kFactor * secondaryVoltage),
  };
}
