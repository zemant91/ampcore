import type { DataAccess, Values } from '@calc/engine';
import type { ConductorMaterial, ConductorTemp, TripCurve } from '@calc/data';

export interface EarthLoopInputs extends Values {
  voltage: number; // U0, phase-to-earth, base: V
  externalImpedance?: number; // Ze, base: Ω — defaults to 0
  material: ConductorMaterial;
  temperature: ConductorTemp; // conductor temperature, base: °C
  length: number; // L, base: m
  phaseArea: number; // base: mm²
  peArea: number; // base: mm²
  breakerRating: number; // In, base: A
  tripCurve: TripCurve;
}

export interface EarthLoopOutputs extends Values {
  loopResistance: number; // R1 + R2 of the circuit's own conductors, base: Ω
  earthLoopImpedance: number; // Zs, base: Ω
  earthFaultCurrent: number; // If = U0/Zs, base: A
  maxLoopImpedance: number; // Zs,max = U0/Ia, base: Ω
  marginPercent: number; // (Zs,max/Zs − 1)·100; negative = the breaker may not trip instantly
}

/**
 * TN-system automatic disconnection, IEC 60364-4-41: Zs·Ia ≤ U0, with Ia the
 * upper instantaneous-trip current of the breaker (m·In, m = 5/10/20 for
 * B/C/D, IEC 60898-1). Zs = Ze + ρ·L·(1/S_phase + 1/S_PE) — resistance only,
 * at the chosen conductor temperature; reactance is ignored (fine for the
 * small sections of final circuits, optimistic for large ones).
 */
export function solveEarthLoop(inputs: EarthLoopInputs, data: DataAccess): EarthLoopOutputs {
  const { voltage, material, temperature, length, phaseArea, peArea, breakerRating, tripCurve } = inputs;
  const rho = data.lookup<Record<ConductorTemp, number>>('resistivity/table', material)[temperature];
  const multiple = data.lookup<number>('breakers/trip-multiple', tripCurve);

  const loopResistance = rho * length * (1 / phaseArea + 1 / peArea);
  const earthLoopImpedance = (inputs.externalImpedance ?? 0) + loopResistance;
  const maxLoopImpedance = voltage / (multiple * breakerRating);
  return {
    loopResistance,
    earthLoopImpedance,
    earthFaultCurrent: voltage / earthLoopImpedance,
    maxLoopImpedance,
    marginPercent: (maxLoopImpedance / earthLoopImpedance - 1) * 100,
  };
}
