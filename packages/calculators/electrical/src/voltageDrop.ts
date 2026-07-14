import type { DataAccess, Values } from '@calc/engine';
import type { ConductorMaterial, ConductorTemp } from '@calc/data';

export type ElectricalSystem = 'dc' | '1ph' | '3ph';

export interface VoltageDropInputs extends Values {
  system: ElectricalSystem;
  material: ConductorMaterial;
  temperature: ConductorTemp; // base: °C, one of 20/70/90
  voltage: number; // U, base: V
  current: number; // I, base: A
  length: number; // L, base: m (one-way run length)
  area: number; // S, base: mm²
}

export interface VoltageDropOutputs extends Values {
  voltageDrop: number; // ΔU, base: V
  voltageDropPercent: number; // ΔU%, dimensionless (already in percent, not 0..1)
}

/**
 * ΔU = factor·ρ·L·I / S, factor = √3 for 3ph (line drop), 2 for DC/1ph
 * (current travels out and back through two conductors). The same trick as
 * in cable_sizing (see runCalc in the prototype) — not a coincidence, both
 * formulas come from the same section of IEC 60364-5-52 Annex G.
 */
export function solveVoltageDrop(inputs: VoltageDropInputs, data: DataAccess): VoltageDropOutputs {
  const { system, material, temperature, voltage, current, length, area } = inputs;
  const rhoByTemp = data.lookup<Record<ConductorTemp, number>>('resistivity/table', material);
  const rho = rhoByTemp[temperature];

  const factor = system === '3ph' ? Math.sqrt(3) : 2;
  const voltageDrop = (factor * rho * length * current) / area;
  const voltageDropPercent = (voltageDrop / voltage) * 100;

  return { voltageDrop, voltageDropPercent };
}
