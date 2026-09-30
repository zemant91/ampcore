import type { Quantity } from './types';
import type { UnitsSystem } from './brand';

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
 *
 * 'kcmil' (thousand circular mils, base: mm²) and 'F' (Fahrenheit, base: °C)
 * are the imperial units used by IMPERIAL_UNIT below. kcmil, not AWG: AWG is
 * a discrete gauge table (14, 12, 10, 8, 6, 4, 2, 1, 1/0, 2/0...), not a
 * continuous unit — it doesn't fit this toBase/fromBase model without a
 * separate lookup table, which is out of scope here. kcmil IS a genuine,
 * professionally-used linear cross-section unit (large NEC conductors are
 * bought and specified in kcmil directly), so it's a correct imperial
 * cross-section unit on its own, not a stand-in for AWG.
 */
export const UNITS: Partial<Record<Quantity, UnitDef[]>> = {
  voltage: [linear('V', 1), linear('kV', 1000)],
  current: [linear('A', 1), linear('mA', 0.001), linear('kA', 1000)],
  resistance: [linear('ohm', 1), linear('kohm', 1000)],
  power: [linear('W', 1), linear('kW', 1000)],
  // S (VA) and Q (var) are distinct quantities from P (W) — same dimension, different meaning, so a field can't offer the wrong unit
  apparentPower: [linear('VA', 1), linear('kVA', 1000), linear('MVA', 1000000)],
  reactivePower: [linear('var', 1), linear('kvar', 1000)],
  length: [linear('m', 1), linear('ft', 0.3048), linear('mm', 0.001)],
  area: [linear('mm2', 1), linear('kcmil', 0.5067)],
  temperature: [
    linear('C', 1),
    { id: 'F', toBase: (f) => ((f - 32) * 5) / 9, fromBase: (c) => (c * 9) / 5 + 32 },
  ],
  time: [linear('s', 1)],
  dimensionless: [linear('unit', 1)],
};

/**
 * Per-quantity imperial unit, for the quantities where metric and imperial
 * actually differ (length, area, temperature). voltage/current/resistance/
 * power use the same SI units in both systems — there's no "imperial volt" —
 * so they're absent here on purpose: unitForField falls through to the
 * field's own defaultUnit for anything not listed.
 */
export const IMPERIAL_UNIT: Partial<Record<Quantity, string>> = {
  length: 'ft',
  area: 'kcmil',
  temperature: 'F',
};

/**
 * The metric counterpart to IMPERIAL_UNIT, for the same quantities — every
 * one of this app's calculators already declares these as field.defaultUnit,
 * this just names them once, generically, instead of only implicitly via
 * each calculator file. Exists so UI that needs to *describe* both systems
 * (e.g. the Settings units picker) can read this data instead of hand-
 * writing prose that has to be kept in sync with IMPERIAL_UNIT by hand.
 */
export const METRIC_UNIT: Partial<Record<Quantity, string>> = {
  length: 'm',
  area: 'mm2',
  temperature: 'C',
};

/** Every quantity where metric and imperial actually use a different unit. */
export const DIFFERING_QUANTITIES = Object.keys(IMPERIAL_UNIT) as Quantity[];

/**
 * The unit a field should actually render in, given the app's active units
 * system — defaultUnit unchanged for 'metric' or for quantities with no
 * imperial variant, IMPERIAL_UNIT's entry otherwise. The single place both
 * CalculatorForm (parsing) and FieldCard (display) resolve this, so the two
 * can never disagree about which unit is in effect for a given field.
 */
export function unitForField(quantity: Quantity, defaultUnit: string, unitsSystem: UnitsSystem): string {
  if (unitsSystem === 'imperial') {
    return IMPERIAL_UNIT[quantity] ?? defaultUnit;
  }
  return defaultUnit;
}

/**
 * Unit ids are ASCII-safe identifiers (toBase/fromBase lookup keys, e.g.
 * 'mm2', 'C') — this is their typeset display form ('mm²', '°C'). Only
 * units that actually differ from their id need an entry; everything else
 * (V, A, kW, m, ft, kcmil...) displays as its own id.
 */
const UNIT_DISPLAY: Record<string, string> = {
  mm2: 'mm²',
  C: '°C',
  F: '°F',
};

export function displayUnit(unitId: string): string {
  return UNIT_DISPLAY[unitId] ?? unitId;
}

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
