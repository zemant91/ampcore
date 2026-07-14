import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { CalculatorDef, FieldDef, Values, WarningKey } from '@calc/engine';
import { resolveFieldLabel } from '@calc/engine';
import { createDataAccess } from '@calc/data';
import { saveEntry } from '../lib/history';
import type { HistoryField } from '../lib/history';
import { resolveLabel } from '../i18n/resolveLabel';
import { applyDynamicFieldChange } from './dynamicFieldEviction';
import type { DynamicFieldState } from './dynamicFieldEviction';

const data = createDataAccess();

export interface CalculatorState {
  values: Values;
  outputs: Values | undefined;
  warnings: WarningKey[];
  onChangeValue: (fieldId: string, value: string | number | undefined) => void;
}

/**
 * A field's raw value as it should show up in history: for an `options`
 * field this resolves the matching option's labelKey ('dc' -> "DC"), not
 * the raw stored value — and skips the unit suffix in that case, since the
 * resolved label already reads naturally on its own (e.g. "20°C").
 */
export function formatFieldForHistory(field: FieldDef, mergedValues: Values): HistoryField {
  const rawValue = mergedValues[field.id];
  const option = field.options?.find((o) => o.value === rawValue);
  return {
    label: resolveLabel(resolveFieldLabel(field, mergedValues)),
    value: option ? resolveLabel(option.labelKey) : String(rawValue),
    unit: option ? '' : (field.defaultUnit ?? ''),
  };
}

/**
 * Owns the raw inputs of a single calculator screen, runs them through
 * validate()/compute()/warnings(), and auto-saves a history entry — one
 * hook instead of (as in the web prototype) manually calling
 * useHistoryEntry on each of the 9 pages.
 */
export function useCalculatorState(
  calculator: CalculatorDef,
  initialValues?: Partial<Values>,
): CalculatorState {
  const [formState, setFormState] = useState<DynamicFieldState>(() => {
    const initial: Values = { ...initialValues };
    const order = (calculator.dynamicRoleFieldIds ?? []).filter((id) => initial[id] !== undefined);
    return { values: initial, order };
  });
  const values = formState.values;

  const onChangeValue = useCallback(
    (fieldId: string, value: string | number | undefined) => {
      setFormState((prev) => applyDynamicFieldChange(prev, calculator.dynamicRoleFieldIds, fieldId, value));
    },
    [calculator],
  );

  const { outputs, warnings } = useMemo((): { outputs: Values | undefined; warnings: WarningKey[] } => {
    const validationErrors = calculator.validate?.(values);
    if (validationErrors && validationErrors.length > 0) {
      return { outputs: undefined, warnings: [] };
    }
    try {
      const computed = calculator.compute(values, data);
      return { outputs: computed, warnings: calculator.warnings?.(values, computed) ?? [] };
    } catch {
      // Calculators' compute() throws on missing fields (see the
      // ohms_law/cable_sizing solvers) — validate() should have caught this
      // earlier, but a safety net doesn't hurt.
      return { outputs: undefined, warnings: [] };
    }
  }, [calculator, values]);

  const lastSavedKeyRef = useRef<string | null>(null);

  useEffect(() => {
    if (outputs === undefined) return;
    const primaryOutputField = calculator.fields.find((f) => f.role === 'output');
    if (!primaryOutputField) return;

    const resultValue = outputs[primaryOutputField.id];
    if (resultValue === undefined) return;

    const dedupeKey = `${calculator.id}|${resultValue}`;
    if (dedupeKey === lastSavedKeyRef.current) return;

    const mergedValues: Values = { ...values, ...outputs };

    const timer = setTimeout(() => {
      saveEntry({
        id: Math.random().toString(36).slice(2, 10),
        timestamp: Date.now(),
        calculatorId: calculator.id,
        calculatorName: resolveLabel(calculator.titleKey),
        fields: calculator.fields
          .filter((f) => f.role === 'input' && values[f.id] !== undefined)
          .map((f) => formatFieldForHistory(f, mergedValues)),
        result: formatFieldForHistory(primaryOutputField, mergedValues),
      });
      lastSavedKeyRef.current = dedupeKey;
    }, 600);

    return () => clearTimeout(timer);
  }, [calculator, outputs, values]);

  return { values, outputs, warnings, onChangeValue };
}
