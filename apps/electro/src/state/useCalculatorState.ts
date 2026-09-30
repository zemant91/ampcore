import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { CalculatorDef, Values, WarningKey } from '@calc/engine';
import { createDataAccess } from '@calc/data';
import { electro } from '../brand';
import { getUnitsSystem } from '../lib/settings';
import { saveEntry } from '../lib/history';
import { buildCalculationSnapshot } from './buildCalculationSnapshot';
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
 * Owns the raw inputs of a single calculator screen, runs them through
 * validate()/compute()/warnings(), and auto-saves a history entry — one
 * hook instead of (as in the web prototype) manually calling
 * useHistoryEntry on each of the 9 pages.
 */
export function useCalculatorState(
  calculator: CalculatorDef,
  initialValues?: Partial<Values>,
): CalculatorState {
  const { t } = useTranslation();
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

    // Keyed on the inputs, not just the result: changing an input that
    // leaves the primary result unchanged is still a new calculation.
    const dedupeKey = `${calculator.id}|${JSON.stringify(values)}`;
    if (dedupeKey === lastSavedKeyRef.current) return;

    const timer = setTimeout(() => {
      const snapshot = buildCalculationSnapshot({
        calculator,
        values,
        outputs,
        warnings,
        resolveLabel: t,
        unitsSystem: getUnitsSystem(electro.defaultUnitsSystem),
      });
      const [result] = snapshot.outputs;
      if (!result) return;
      saveEntry({
        id: Math.random().toString(36).slice(2, 10),
        timestamp: Date.now(),
        calculatorId: calculator.id,
        calculatorName: t(calculator.titleKey),
        fields: snapshot.inputs,
        result,
        outputs: snapshot.outputs,
        warnings: snapshot.warnings,
        formulaLines: snapshot.formulaLines,
      });
      lastSavedKeyRef.current = dedupeKey;
    }, 600);

    return () => clearTimeout(timer);
  }, [calculator, outputs, values, warnings, t]);

  return { values, outputs, warnings, onChangeValue };
}
