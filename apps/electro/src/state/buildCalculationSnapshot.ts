import type { CalculatorDef, FieldDef, UnitsSystem, Values, WarningKey } from '@calc/engine';
import { displayUnit, fromBase, resolveFieldLabel, unitForField } from '@calc/engine';
import { buildFieldCardStates } from '@calc/ui';
import type { HistoryField } from '../lib/history';

/**
 * A field as it should show up in history/reports: an `options` field
 * resolves the matching option's labelKey ('dc' -> "DC") and skips the unit
 * suffix (the label already reads naturally, e.g. "20°C"); a numeric field
 * is converted from base units to the unit the screen shows in
 * `unitsSystem`, rounded to 6 significant digits (no float noise).
 */
export function formatFieldForHistory(
  field: FieldDef,
  mergedValues: Values,
  resolveLabel: (key: string) => string,
  unitsSystem: UnitsSystem = 'metric',
): HistoryField {
  const rawValue = mergedValues[field.id];
  const option = field.options?.find((o) => o.value === rawValue);
  const label = resolveLabel(resolveFieldLabel(field, mergedValues));
  if (option) return { label, value: resolveLabel(option.labelKey), unit: '' };

  if (field.defaultUnit && typeof rawValue === 'number') {
    const unit = unitForField(field.quantity, field.defaultUnit, unitsSystem);
    return {
      label,
      value: String(Number(fromBase(field.quantity, rawValue, unit).toPrecision(6))),
      unit: displayUnit(unit),
    };
  }
  return { label, value: String(rawValue), unit: field.defaultUnit ? displayUnit(field.defaultUnit) : '' };
}

export interface CalculationSnapshot {
  formulaLines: string[];
  inputs: HistoryField[];
  outputs: HistoryField[];
  warnings: string[];
}

/**
 * Everything a finished calculation needs to be shown later (history list,
 * PDF report), already resolved to display strings. The single place that
 * decides what is "given" vs "calculated" — buildFieldCardStates, not
 * field.role alone, so ohms_law's dynamic roles work (see CLAUDE.md).
 */
export function buildCalculationSnapshot(params: {
  calculator: CalculatorDef;
  values: Values;
  outputs: Values;
  warnings: WarningKey[];
  resolveLabel: (key: string) => string;
  unitsSystem: UnitsSystem;
}): CalculationSnapshot {
  const { calculator, values, outputs, warnings, resolveLabel, unitsSystem } = params;
  const mergedValues: Values = { ...values, ...outputs };
  const states = buildFieldCardStates(calculator.fields, values, outputs);
  const visible = calculator.fields.filter((f) => !f.visibleIf || f.visibleIf(mergedValues));
  const pick = (state: 'given' | 'calculated') =>
    visible
      .filter((f) => states[f.id] === state)
      .map((f) => formatFieldForHistory(f, mergedValues, resolveLabel, unitsSystem));

  return {
    formulaLines: calculator.formulaKeys?.(mergedValues).map(resolveLabel) ?? [],
    inputs: pick('given'),
    outputs: pick('calculated'),
    warnings: warnings.map(resolveLabel),
  };
}
