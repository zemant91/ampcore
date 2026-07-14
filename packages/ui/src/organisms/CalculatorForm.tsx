import type { ReactElement } from 'react';
import { resolveFieldLabel, toBase } from '@calc/engine';
import type { CalculatorDef, FieldDef, Values } from '@calc/engine';
import { View, Text } from 'react-native';
import { FieldCard } from '../atoms/FieldCard';
import { Chip } from '../atoms/Chip';
import { buildFieldCardStates } from '../state/fieldCardState';
import type { ThemeTokens } from '../tokens/theme';

export interface CalculatorFormProps {
  calculator: CalculatorDef;
  /** Raw values entered by the user (before compute()), in base units */
  values: Values;
  /** The last successful compute() result, if validate() returned no errors */
  outputs: Values | undefined;
  theme: ThemeTokens;
  /** labelKey -> text. The organism doesn't know about i18n, it just forwards the resolver further down */
  resolveLabel: (labelKey: string) => string;
  /** ',' for locales that write decimals as "2,5" instead of "2.5" — see parseFieldText. Defaults to '.' */
  decimalSeparator?: ',' | '.';
  /** fieldId, the new value in base units (undefined — field cleared/invalid) */
  onChangeValue: (fieldId: string, value: string | number | undefined) => void;
}

/**
 * Numeric options (temperature/ambientTemp/kFactor etc.) in every current
 * calculator are given in units with factor=1 (°C, dimensionless k-factors)
 * — so the option's value already equals the base value and toBase isn't
 * needed. String options (system/material/...) can't go through toBase in
 * the first place (they're not numbers).
 */
export function parseFieldText(field: FieldDef, text: string, decimalSeparator: ',' | '.' = '.'): number | undefined {
  if (text.trim() === '') return undefined;
  const normalized = decimalSeparator === ',' ? text.replace(',', '.') : text;
  const parsed = Number(normalized);
  if (Number.isNaN(parsed)) return undefined;
  return field.defaultUnit ? toBase(field.quantity, parsed, field.defaultUnit) : parsed;
}

/**
 * Builds the "N of 2 filled" hint text out of already-resolved fragments
 * (resolveLabel(key) for each piece) instead of template interpolation —
 * @calc/ui stays agnostic of whatever templating a real i18n library would
 * use later, it just concatenates strings the resolver already gave it.
 */
export function buildDynamicFieldsHint(
  calculator: CalculatorDef,
  dynamicRoleFieldIds: string[],
  mergedValues: Values,
  resolveLabel: (labelKey: string) => string,
): string {
  const filledIds = dynamicRoleFieldIds.filter((id) => mergedValues[id] !== undefined);

  if (filledIds.length === 0) {
    return resolveLabel('hint.enterAnyTwo');
  }

  const labelOf = (id: string) => {
    const field = calculator.fields.find((f) => f.id === id)!;
    return resolveLabel(resolveFieldLabel(field, mergedValues));
  };

  if (filledIds.length === 1) {
    return `${labelOf(filledIds[0]!)} ${resolveLabel('hint.oneMoreValue')}`;
  }

  // filledIds.length >= 2: eviction (see useCalculatorState) should already
  // keep this at exactly 2, but if it's ever more, just describe the first two.
  return `${resolveLabel('hint.solvingFrom')} ${labelOf(filledIds[0]!)} ${resolveLabel('hint.and')} ${labelOf(filledIds[1]!)}`;
}

/**
 * An organism: assembles FieldCard/SegmentedControl into a single
 * calculator's form. Doesn't import anything about a specific CalculatorDef
 * — receives it as a prop, like everything else (foundation principle #2
 * from the root README: "@calc/ui never imports a specific CalculatorDef or
 * BrandConfig").
 */
export function CalculatorForm({
  calculator,
  values,
  outputs,
  theme,
  resolveLabel,
  decimalSeparator = '.',
  onChangeValue,
}: CalculatorFormProps): ReactElement {
  const states = buildFieldCardStates(calculator.fields, values, outputs);
  // FieldCard reads a field's value from a single merged object, without
  // distinguishing the source (user input vs compute()) — the same trick
  // buildFieldCardStates uses for the given/calculated diff (see its docstring).
  const mergedValues: Values = outputs ? { ...values, ...outputs } : values;

  const visibleFields = calculator.fields.filter(
    (field) => field.visibleIf === undefined || field.visibleIf(mergedValues),
  );

  const formulaKeys = calculator.formulaKeys?.(mergedValues) ?? [];
  const hint = calculator.dynamicRoleFieldIds
    ? buildDynamicFieldsHint(calculator, calculator.dynamicRoleFieldIds, mergedValues, resolveLabel)
    : undefined;

  return (
    <View style={{ gap: theme.layout.spacingUnit }} testID={`calculator-form-${calculator.id}`}>
      {formulaKeys.length > 0 && (
        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: theme.layout.spacingUnit / 2,
            padding: theme.layout.spacingUnit / 2,
            borderRadius: theme.layout.cardRadius,
            backgroundColor: theme.colors.cardSurface,
          }}
          testID={`calculator-form-formulas-${calculator.id}`}
        >
          {formulaKeys.map((key) => (
            <Chip key={key} label={resolveLabel(key)} interactive={false} theme={theme} />
          ))}
        </View>
      )}

      {hint !== undefined && (
        <Text
          style={{
            fontFamily: theme.typography.uiFontFamily,
            fontSize: 12,
            color: theme.colors.textSecondary,
          }}
          testID={`calculator-form-hint-${calculator.id}`}
        >
          {hint}
        </Text>
      )}

      {visibleFields.map((field) => (
        <FieldCard
          key={field.id}
          field={field}
          values={mergedValues}
          state={states[field.id]!}
          theme={theme}
          resolveLabel={resolveLabel}
          onChangeText={
            field.options === undefined && field.role === 'input'
              ? (text) => onChangeValue(field.id, parseFieldText(field, text, decimalSeparator))
              : undefined
          }
          onChangeOption={
            field.options !== undefined ? (value) => onChangeValue(field.id, value) : undefined
          }
        />
      ))}
    </View>
  );
}
