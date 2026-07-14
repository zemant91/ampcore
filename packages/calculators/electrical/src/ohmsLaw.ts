import type { Values } from '@calc/engine';

export type ElectricalSystem = 'dc' | '1ph' | '3ph';

export interface OhmsLawInputs extends Values {
  system: ElectricalSystem;
  voltage?: number; // U, base: V
  current?: number; // I, base: A
  resistance?: number; // R, base: Ω (DC only)
  power?: number; // P, base: W
  cosPhi?: number; // AC only, defaults to 1
}

export interface OhmsLawOutputs extends Values {
  voltage: number;
  current: number;
  resistance: number;
  power: number;
  apparentPower?: number; // S, AC only
  reactivePower?: number; // Q, AC only
}

type DcKnown = 'voltage' | 'current' | 'resistance' | 'power';

/**
 * A matrix of 6 "knowns -> formulas" pairs — not a symbolic solver (that's
 * intentional per the spec). The key is the two known fields joined with a
 * comma, in alphabetical order. The non-null assertions inside are safe:
 * before calling solveDc we've already checked that both fields of the pair
 * are set (see below) — TS can't express this statically without 6 separate
 * discriminated types, which would be overkill for 4 quantities.
 */
const DC_SOLVERS: Record<string, (v: OhmsLawInputs) => Record<DcKnown, number>> = {
  'current,power': ({ current: I, power: P }) => ({
    current: I!,
    power: P!,
    voltage: P! / I!,
    resistance: P! / (I! * I!),
  }),
  'current,resistance': ({ current: I, resistance: R }) => ({
    current: I!,
    resistance: R!,
    voltage: I! * R!,
    power: I! * I! * R!,
  }),
  'current,voltage': ({ current: I, voltage: U }) => ({
    current: I!,
    voltage: U!,
    resistance: U! / I!,
    power: U! * I!,
  }),
  'power,resistance': ({ power: P, resistance: R }) => ({
    power: P!,
    resistance: R!,
    voltage: Math.sqrt(P! * R!),
    current: Math.sqrt(P! / R!),
  }),
  'power,voltage': ({ power: P, voltage: U }) => ({
    power: P!,
    voltage: U!,
    current: P! / U!,
    resistance: (U! * U!) / P!,
  }),
  'resistance,voltage': ({ resistance: R, voltage: U }) => ({
    resistance: R!,
    voltage: U!,
    current: U! / R!,
    power: (U! * U!) / R!,
  }),
};

function solveDc(inputs: OhmsLawInputs): OhmsLawOutputs {
  const known = (['current', 'power', 'resistance', 'voltage'] as const).filter(
    (k) => inputs[k] !== undefined,
  );

  if (known.length !== 2) {
    throw new Error('DC: exactly two values must be given from {U, I, R, P}');
  }

  const key = known.join(',');
  const solver = DC_SOLVERS[key];
  if (!solver) {
    // Theoretically unreachable with known.length === 2 and 4 fields, but an
    // explicit error beats a silent undefined if the field set ever changes.
    throw new Error(`No solver for combination: ${key}`);
  }

  return solver(inputs);
}

type AcKnown = 'voltage' | 'current' | 'power' | 'resistance';

/**
 * The AC matrix mirrors DC_SOLVERS: U/I/Z relate like plain Ohm's law
 * (U = I·Z), and P = pf·U·I, where pf = kFactor·cosφ — the same multiplier
 * that folds 1ph/3ph and cosφ into a single number. At pf=1 the formulas
 * match DC (as expected: DC is the special case of AC with cosφ=1,
 * kFactor=1). Z here is the impedance magnitude, not the active resistance R
 * (see the R/RESISTANCE -> Z/IMPEDANCE labeling in ohmsLaw.calculator.ts).
 */
const AC_SOLVERS: Record<
  string,
  (v: OhmsLawInputs, pf: number) => Record<AcKnown, number>
> = {
  'current,power': ({ current: I, power: P }, pf) => {
    const voltage = P! / (pf * I!);
    return { current: I!, power: P!, voltage, resistance: voltage / I! };
  },
  'current,resistance': ({ current: I, resistance: Z }, pf) => {
    const voltage = I! * Z!;
    return { current: I!, resistance: Z!, voltage, power: pf * voltage * I! };
  },
  'current,voltage': ({ current: I, voltage: U }, pf) => ({
    current: I!,
    voltage: U!,
    resistance: U! / I!,
    power: pf * U! * I!,
  }),
  'power,resistance': ({ power: P, resistance: Z }, pf) => {
    const M = P! / pf; // M = U·I, same trick as the DC pair (power, resistance)
    return { power: P!, resistance: Z!, voltage: Math.sqrt(M * Z!), current: Math.sqrt(M / Z!) };
  },
  'power,voltage': ({ power: P, voltage: U }, pf) => {
    const current = P! / (pf * U!);
    return { power: P!, voltage: U!, current, resistance: U! / current };
  },
  'resistance,voltage': ({ resistance: Z, voltage: U }, pf) => {
    const current = U! / Z!;
    return { resistance: Z!, voltage: U!, current, power: pf * U! * current };
  },
};

function solveAc(system: '1ph' | '3ph', inputs: OhmsLawInputs): OhmsLawOutputs {
  const cosPhi = inputs.cosPhi ?? 1;
  const kFactor = system === '3ph' ? Math.sqrt(3) : 1;
  const pf = kFactor * cosPhi;

  const known = (['current', 'power', 'resistance', 'voltage'] as const).filter(
    (k) => inputs[k] !== undefined,
  );
  if (known.length !== 2) {
    throw new Error('AC: exactly two values must be given from {U, I, Z, P} (plus cosφ)');
  }

  const key = known.join(',');
  const solver = AC_SOLVERS[key];
  if (!solver) {
    throw new Error(`No solver for combination: ${key}`);
  }

  const { voltage, current, power, resistance } = solver(inputs, pf);
  const apparentPower = kFactor * voltage * current;
  const reactivePower = Math.sqrt(Math.max(apparentPower ** 2 - power ** 2, 0));

  return { voltage, current, power, resistance, apparentPower, reactivePower };
}

export function solveOhmsLaw(inputs: OhmsLawInputs): OhmsLawOutputs {
  return inputs.system === 'dc' ? solveDc(inputs) : solveAc(inputs.system, inputs);
}
