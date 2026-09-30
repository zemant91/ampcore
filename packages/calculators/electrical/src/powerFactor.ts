import type { Values } from '@calc/engine';

export interface PowerFactorInputs extends Values {
  power?: number; // P, base: W
  reactivePower?: number; // Q, base: var
  apparentPower?: number; // S, base: VA
  cosPhi?: number; // cosφ
}

export interface PowerFactorOutputs extends Values {
  power: number;
  reactivePower: number;
  apparentPower: number;
  cosPhi: number;
}

const KNOWN_ORDER = ['power', 'reactivePower', 'apparentPower', 'cosPhi'] as const;

const sinFrom = (cosPhi: number) => Math.sqrt(Math.max(1 - cosPhi * cosPhi, 0));
/** Catheter of the power triangle from its hypotenuse and the other catheter; clamped so rounding never gives NaN */
const leg = (hypotenuse: number, other: number) => Math.sqrt(Math.max(hypotenuse * hypotenuse - other * other, 0));

/**
 * The power triangle S² = P² + Q², cosφ = P/S: any 2 of {P, Q, S, cosφ} give
 * the other two (the same "2 of N" shape as ohms_law, see dynamicRoleFieldIds
 * on the calculator). The key is the two knowns in KNOWN_ORDER.
 */
const SOLVERS: Record<string, (v: PowerFactorInputs) => PowerFactorOutputs> = {
  'power,reactivePower': ({ power: P, reactivePower: Q }) => {
    const S = Math.hypot(P!, Q!);
    return { power: P!, reactivePower: Q!, apparentPower: S, cosPhi: P! / S };
  },
  'power,apparentPower': ({ power: P, apparentPower: S }) => ({
    power: P!,
    apparentPower: S!,
    reactivePower: leg(S!, P!),
    cosPhi: P! / S!,
  }),
  'power,cosPhi': ({ power: P, cosPhi: c }) => {
    const S = P! / c!;
    return { power: P!, cosPhi: c!, apparentPower: S, reactivePower: S * sinFrom(c!) };
  },
  'reactivePower,apparentPower': ({ reactivePower: Q, apparentPower: S }) => {
    const P = leg(S!, Q!);
    return { reactivePower: Q!, apparentPower: S!, power: P, cosPhi: P / S! };
  },
  'reactivePower,cosPhi': ({ reactivePower: Q, cosPhi: c }) => {
    const S = Q! / sinFrom(c!); // cosφ = 1 -> Infinity (see the divisionByZero warning)
    return { reactivePower: Q!, cosPhi: c!, apparentPower: S, power: S * c! };
  },
  'apparentPower,cosPhi': ({ apparentPower: S, cosPhi: c }) => ({
    apparentPower: S!,
    cosPhi: c!,
    power: S! * c!,
    reactivePower: S! * sinFrom(c!),
  }),
};

export function solvePowerFactor(inputs: PowerFactorInputs): PowerFactorOutputs {
  const key = KNOWN_ORDER.filter((k) => inputs[k] !== undefined).join(',');
  const solver = SOLVERS[key];
  if (!solver) throw new Error('Exactly two values must be given from {P, Q, S, cosφ}');
  return solver(inputs);
}
