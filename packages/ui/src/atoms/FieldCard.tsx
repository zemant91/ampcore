import type { ReactElement } from 'react';
import { resolveFieldLabel, resolveFieldSymbol, fromBase, unitForField } from '@calc/engine';
import type { FieldDef, UnitsSystem, Values } from '@calc/engine';
import { View, Text, TextInput } from 'react-native';
import type { ViewStyle } from 'react-native';
import type { ThemeTokens } from '../tokens/theme';
import type { FieldCardState } from '../state/fieldCardState';
import { SegmentedControl } from '../molecules/SegmentedControl';

export interface FieldCardProps {
  field: FieldDef;
  values: Values;
  state: FieldCardState;
  theme: ThemeTokens;
  /** labelKey -> text. The atom doesn't know about i18n, it's given the resolver from outside */
  resolveLabel: (labelKey: string) => string;
  /** Which unit this field displays in (see unitForField) — defaults to 'metric' */
  unitsSystem?: UnitsSystem;
  /** Set -> the field is editable (only for role='input', no options, and state != 'calculated') */
  onChangeText?: (text: string) => void;
  /** Set -> the field has `options` and renders a SegmentedControl in the value slot instead of text */
  onChangeOption?: (value: string | number) => void;
}

/**
 * A single row shape for BOTH kinds of fields — free-form text entry and a
 * fixed set of options — so a form isn't a mix of "text-input cards" plus
 * separately-styled, unlabeled segmented controls floating on their own
 * (that looked like two unrelated widgets glued together). The symbol/label
 * column and the card chrome are shared; only the content in the value slot
 * differs (SegmentedControl vs TextInput/Text).
 *
 * Otherwise a purely presentational atom: gets an already-computed `state`
 * from outside (see buildFieldCardStates) — it doesn't decide anything about
 * given/calculated itself, only draws. That keeps the atom testable with no
 * engine/data at all.
 *
 * The only exception to "purely presentational" is the mere fact of calling
 * onChangeText/onChangeOption: the card doesn't decide WHAT to do with the
 * value (parsing/toBase is the organism's job above), it just forwards it.
 */
export function FieldCard({
  field,
  values,
  state,
  theme,
  resolveLabel,
  unitsSystem = 'metric',
  onChangeText,
  onChangeOption,
}: FieldCardProps): ReactElement {
  const label = resolveLabel(resolveFieldLabel(field, values));
  const symbol = resolveFieldSymbol(field, values);
  const rawValue = values[field.id];
  const hasOptions = field.options !== undefined;
  // The unit this field actually parses/displays in — same resolution
  // CalculatorForm.parseFieldText uses, so the two can't disagree.
  const unit = field.defaultUnit ? unitForField(field.quantity, field.defaultUnit, unitsSystem) : undefined;

  const displayValue =
    state === 'empty' || rawValue === undefined
      ? '—'
      : unit && typeof rawValue === 'number'
        ? fromBase(field.quantity, rawValue, unit)
        : rawValue;

  const editable = !hasOptions && field.role === 'input' && state !== 'calculated' && onChangeText !== undefined;

  const cardStyle: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'stretch',
    minHeight: theme.layout.minFieldHeight,
    borderRadius: theme.layout.cardRadius,
    borderWidth: 1,
    backgroundColor: theme.colors.cardSurface,
    borderStyle: state === 'empty' ? 'dashed' : 'solid',
    borderColor: state === 'empty' ? theme.colors.cardBorderMuted : theme.accent,
    overflow: 'hidden',
  };

  const valueStyle = {
    flex: 1,
    fontSize: 20,
    fontFamily: theme.typography.monoFontFamily,
    color: state === 'calculated' ? theme.accent : theme.colors.textPrimary,
  };

  return (
    <View style={cardStyle} testID={`field-card-${field.id}`}>
      <View
        style={{
          // Wider than the original 76px: many resolved labels are two
          // words ("Cross-section", "Ambient temperature", "Design
          // current") and were wrapping to 3 lines / clipping at 76.
          width: 108,
          padding: theme.layout.spacingUnit,
          justifyContent: 'center',
          alignItems: 'center',
          gap: 4,
          borderRightWidth: 1,
          borderRightColor: theme.colors.cardBorderMuted,
        }}
      >
        {symbol !== undefined && (
          <Text
            style={{
              fontFamily: theme.typography.monoFontFamily,
              fontSize: 18,
              textAlign: 'center',
              color: theme.colors.textPrimary,
            }}
          >
            {symbol}
          </Text>
        )}
        <Text
          style={{
            fontFamily: theme.typography.uiFontFamily,
            fontSize: 10,
            fontWeight: '700',
            letterSpacing: 0.5,
            textTransform: 'uppercase',
            textAlign: 'center',
            color: theme.colors.textSecondary,
          }}
        >
          {label}
        </Text>
      </View>
      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: hasOptions ? theme.layout.spacingUnit : theme.layout.spacingUnit * 1.5,
          gap: theme.layout.spacingUnit,
        }}
      >
        {hasOptions ? (
          <SegmentedControl
            options={field.options!}
            value={rawValue as string | number | undefined}
            theme={theme}
            resolveLabel={resolveLabel}
            onChange={(value) => onChangeOption?.(value)}
          />
        ) : editable ? (
          <TextInput
            style={valueStyle}
            value={state === 'empty' ? '' : String(displayValue)}
            onChangeText={onChangeText}
            placeholder="—"
            placeholderTextColor={theme.colors.cardBorderMuted}
            keyboardType="decimal-pad"
            testID={`field-card-input-${field.id}`}
          />
        ) : (
          <Text style={valueStyle}>
            {state === 'calculated' ? '= ' : ''}
            {String(displayValue)}
          </Text>
        )}
        {!hasOptions && state !== 'empty' && unit && (
          <Text style={{ fontFamily: theme.typography.uiFontFamily, fontSize: 13, fontWeight: '700', color: theme.accent }}>
            {unit}
          </Text>
        )}
      </View>
    </View>
  );
}
