import type { Values } from '@calc/engine';

export interface DynamicFieldState {
  values: Values;
  /** Fill order among a calculator's dynamicRoleFieldIds, oldest first — not just Object.keys(values), since re-setting an existing key doesn't move it */
  order: string[];
}

/**
 * Applies one field change for a calculator with dynamicRoleFieldIds
 * (currently only ohms_law: any 2 of {voltage, current, resistance, power}).
 * Keeps at most 2 of those fields filled at a time by evicting the OLDEST
 * filled one — LRU, not a validation error — when a 3rd gets set.
 *
 * A pure function (no React) on purpose: useCalculatorState just calls this
 * inside its setState updater, and it's unit-testable without mounting a
 * hook or a component.
 */
export function applyDynamicFieldChange(
  state: DynamicFieldState,
  dynamicRoleFieldIds: string[] | undefined,
  fieldId: string,
  value: string | number | undefined,
): DynamicFieldState {
  let nextValues: Values = { ...state.values, [fieldId]: value };

  if (!dynamicRoleFieldIds || !dynamicRoleFieldIds.includes(fieldId)) {
    return { values: nextValues, order: state.order };
  }

  let nextOrder = state.order.filter((id) => id !== fieldId);
  if (value !== undefined) {
    nextOrder = [...nextOrder, fieldId];
  }

  const filled = nextOrder.filter((id) => nextValues[id] !== undefined);
  if (filled.length > 2) {
    const oldest = filled[0]!;
    nextValues = { ...nextValues, [oldest]: undefined };
    nextOrder = nextOrder.filter((id) => id !== oldest);
  }

  return { values: nextValues, order: nextOrder };
}
