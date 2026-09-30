import type { DataAccess, Values } from '@calc/engine';
import type { ConductorMaterial } from '@calc/data';

export interface ShortCircuitInputs extends Values {
  transformerPower: number; // Sr, base: VA
  ukPercent: number; // short-circuit voltage, %
  voltage: number; // Un, secondary line-to-line, base: V
  networkPower?: number; // S"kQ of the upstream grid, base: VA — omitted = infinitely strong grid
  material?: ConductorMaterial; // defaults to Cu
  area?: number; // S, base: mm²
  length?: number; // L, base: m — omitted or 0 = fault right at the transformer
}

export interface ShortCircuitOutputs extends Values {
  shortCircuitCurrentSource: number; // Ik" at the transformer terminals, base: A
  shortCircuitCurrent: number; // Ik" at the far end of the cable, base: A
  totalImpedance: number; // |Z| up to the cable end, base: Ω
}

/** IEC 60909 voltage factor c_max for LV networks (tolerance up to +6 %); 1.10 if the tolerance is +10 % */
export const C_MAX_LV = 1.05;
/** Typical LV cable reactance, Ω/m (0.08 Ω/km) — not section-specific */
const CABLE_REACTANCE_PER_M = 0.00008;

/**
 * Initial symmetrical 3-phase short-circuit current, IEC 60909-0 simplified:
 * Ik" = c·Un / (√3·|Zk|), Zk = grid + transformer (+ cable).
 * - grid: ZQ = c·Un²/S"kQ, XQ = 0.995·ZQ, RQ = 0.1·XQ (the standard's default split)
 * - transformer: ZT = uk·Un²/Sr treated as purely reactive (ur = 0 — slightly
 *   conservative, it maximises Ik), corrected by KT = 0.95·c/(1 + 0.6·xT)
 * - cable: R at 20 °C (maximum Ik), fixed reactance per metre
 * A simplified estimate for choosing breaking capacity, not a substitute for a full study.
 */
export function solveShortCircuit(inputs: ShortCircuitInputs, data: DataAccess): ShortCircuitOutputs {
  const { transformerPower: Sr, ukPercent, voltage: Un, networkPower, area, length } = inputs;
  const c = C_MAX_LV;

  const xT = ukPercent / 100;
  const KT = (0.95 * c) / (1 + 0.6 * xT);
  const transformerX = KT * xT * ((Un * Un) / Sr);

  let gridR = 0;
  let gridX = 0;
  if (networkPower !== undefined) {
    const zQ = (c * Un * Un) / networkPower;
    gridX = 0.995 * zQ;
    gridR = 0.1 * gridX;
  }

  const sourceR = gridR;
  const sourceX = gridX + transformerX;

  let cableR = 0;
  let cableX = 0;
  if (length !== undefined && length > 0 && area !== undefined) {
    const rho = data.lookup<Record<20 | 70 | 90, number>>('resistivity/table', inputs.material ?? 'Cu')[20];
    cableR = (rho * length) / area;
    cableX = CABLE_REACTANCE_PER_M * length;
  }

  const current = (z: number) => (c * Un) / (Math.sqrt(3) * z);
  const sourceZ = Math.hypot(sourceR, sourceX);
  const totalZ = Math.hypot(sourceR + cableR, sourceX + cableX);
  return {
    shortCircuitCurrentSource: current(sourceZ),
    shortCircuitCurrent: current(totalZ),
    totalImpedance: totalZ,
  };
}
