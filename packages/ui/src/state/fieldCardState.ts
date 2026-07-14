import type { FieldDef, Values } from '@calc/engine';

export type FieldCardState = 'empty' | 'given' | 'calculated';

/**
 * Computes each field's visual state from ONE source of truth: what the
 * user actually entered (rawInputs, before compute()) and what compute()
 * returned (outputs). Works the same way for:
 *  - calculators with static roles (voltage_drop and everything else except
 *    ohms_law): role='input' -> 'given' if filled in, role='output' ->
 *    'calculated' if it has a value;
 *  - ohms_law with dynamic roles: all 4 fields are role='input' in the
 *    schema, but two of them are actually 'given' (present in rawInputs)
 *    and two are 'calculated' (only showed up in outputs). Exactly the
 *    diffing logic we discussed as the UI layer's job back when we went
 *    through ohms_law.calculator.ts — here it's finally implemented, not
 *    just described in a comment.
 */
export function buildFieldCardStates(
  fields: FieldDef[],
  rawInputs: Values,
  outputs: Values | undefined,
): Record<string, FieldCardState> {
  const states: Record<string, FieldCardState> = {};

  for (const field of fields) {
    const rawValue = rawInputs[field.id];
    const outputValue = outputs?.[field.id];

    if (field.role === 'output') {
      states[field.id] = outputValue === undefined ? 'empty' : 'calculated';
      continue;
    }

    // role === 'input': usually 'given' or 'empty'. 'calculated' is only
    // possible for calculators with dynamic roles (currently just
    // ohms_law) — when the value came from outputs, not from the user.
    if (rawValue !== undefined) {
      states[field.id] = 'given';
    } else if (outputValue !== undefined) {
      states[field.id] = 'calculated';
    } else {
      states[field.id] = 'empty';
    }
  }

  return states;
}
