import type { CalculatorDef } from './types';

/** Finds duplicate field ids — a typical copy-paste mistake in a config */
export function getDuplicateFieldIds(def: CalculatorDef): string[] {
  const seen = new Set<string>();
  const duplicates = new Set<string>();
  for (const field of def.fields) {
    if (seen.has(field.id)) duplicates.add(field.id);
    seen.add(field.id);
  }
  return [...duplicates];
}

/** A calculator must have at least one output-role field — otherwise there's nowhere to put the result */
export function hasNoOutputFields(def: CalculatorDef): boolean {
  return !def.fields.some((f) => f.role === 'output');
}
