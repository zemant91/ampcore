import type { DataAccess } from '@calc/engine';
import { RESISTIVITY, OPERATING_TEMP_BY_INSULATION } from './tables/resistivity';
import { SECTIONS, AMPACITY, AMBIENT_CORRECTION, GROUPING_FACTOR, INSTALL_METHOD_LABEL } from './tables/ampacity';
import { STANDARD_BREAKER_RATINGS, TRIP_CURVES } from './tables/breakers';
import { CONDUIT_SIZES, CABLE_OD_PRESETS_MM, CONDUIT_FILL_LIMIT_PERCENT } from './tables/conduit';
import { PE_K_FACTORS, STANDARD_PE_SIZES } from './tables/peConductor';
import { MOTOR_PRESETS } from './tables/motors';

/**
 * Tables naturally indexed by a key (material, insulation, ambient, etc.) —
 * lookup(table, key) returns the sub-record. compute() then decides for
 * itself what to do with the structure under that key (e.g. AMPACITY[key][method]).
 */
const KEYED_TABLES: Record<string, Record<string, unknown>> = {
  'resistivity/table': RESISTIVITY,
  'resistivity/operating-temp': OPERATING_TEMP_BY_INSULATION,
  'ampacity/sections': SECTIONS,
  'ampacity/iz': AMPACITY,
  'ampacity/ambient-correction': AMBIENT_CORRECTION,
  'ampacity/grouping-factor': GROUPING_FACTOR,
  'ampacity/install-method-label': INSTALL_METHOD_LABEL,
  'conduit/fill-limit-percent': CONDUIT_FILL_LIMIT_PERCENT,
};

/**
 * Tables with no natural key subdivision (flat arrays/option lists) —
 * lookup(table, '*') returns the whole table.
 */
const ALL_KEY = '*';
const WHOLE_TABLES: Record<string, unknown> = {
  'breakers/standard-ratings': STANDARD_BREAKER_RATINGS,
  'breakers/trip-curves': TRIP_CURVES,
  'conduit/sizes': CONDUIT_SIZES,
  'conduit/cable-od-presets': CABLE_OD_PRESETS_MM,
  'pe/k-factors': PE_K_FACTORS,
  'pe/standard-sizes': STANDARD_PE_SIZES,
  'motors/presets': MOTOR_PRESETS,
};

/**
 * The single point through which calculators' compute() sees these tables
 * (see DataAccess in @calc/engine) — lets us swap data in tests and update
 * tables without releasing a new calculator.
 */
export function createDataAccess(): DataAccess {
  return {
    lookup<T = number>(table: string, key: string): T {
      if (table in WHOLE_TABLES) {
        return WHOLE_TABLES[table] as T;
      }
      const entry = KEYED_TABLES[table];
      if (!entry || !(key in entry)) {
        throw new Error(`@calc/data: no entry "${key}" in table "${table}"`);
      }
      return entry[key] as T;
    },
  };
}

export { ALL_KEY };
