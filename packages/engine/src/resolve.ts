import type { FieldDef, Values } from './types';

/** labelKey can be a string or a function of the current values (R -> Z in AC) */
export function resolveFieldLabel(field: FieldDef, values: Values): string {
  return typeof field.labelKey === 'function' ? field.labelKey(values) : field.labelKey;
}

/** symbol — same idea, plus a field may have no symbol at all (not every quantity has one) */
export function resolveFieldSymbol(field: FieldDef, values: Values): string | undefined {
  if (field.symbol === undefined) return undefined;
  return typeof field.symbol === 'function' ? field.symbol(values) : field.symbol;
}
