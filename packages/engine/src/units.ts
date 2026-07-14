import type { Quantity } from './types';

export interface UnitDef {
  id: string;
  /** Linear conversion: base = value * factor. For non-linear ones (AWG etc.) — use toBase/fromBase. */
  factor?: number;
  toBase?: (value: number) => number;
  fromBase?: (value: number) => number;
}

const linear = (id: string, factor: number): UnitDef => ({ id, factor });

/**
 * Minimal unit set for the MVP (ohms_law + a base for future calculators).
 * Non-linear quantities (e.g. AWG <-> mm², master plan section 6 "awg-table, v2")
 * are added via toBase/fromBase — the interface already supports it.
 */
export const UNITS: Partial<Record<Quantity, UnitDef[]>> = {
  voltage: [linear('V', 1), linear('kV', 1000)],
  current: [linear('A', 1), linear('mA', 0.001)],
  resistance: [linear('ohm', 1), linear('kohm', 1000)],
  power: [linear('W', 1), linear('kW', 1000)],
  length: [linear('m', 1), linear('ft', 0.3048), linear('mm', 0.001)],
  area: [linear('mm2', 1)],
  temperature: [linear('C', 1)],
  time: [linear('s', 1)],
  dimensionless: [linear('unit', 1)],
};

function findUnit(quantity: Quantity, unitId: string): UnitDef {
  const list = UNITS[quantity];
  const unit = list?.find((u) => u.id === unitId);
  if (!unit) {
    throw new Error(`Unknown unit "${unitId}" for quantity "${quantity}"`);
  }
  return unit;
}

/** UI unit -> base (SI), on the way into the engine */
export function toBase(quantity: Quantity, value: number, unitId: string): number {
  const unit = findUnit(quantity, unitId);
  return unit.toBase ? unit.toBase(value) : value * (unit.factor ?? 1);
}

/** Base (SI) -> UI unit, on the way out of the engine */
export function fromBase(quantity: Quantity, value: number, unitId: string): number {
  const unit = findUnit(quantity, unitId);
  return unit.fromBase ? unit.fromBase(value) : value / (unit.factor ?? 1);
}
