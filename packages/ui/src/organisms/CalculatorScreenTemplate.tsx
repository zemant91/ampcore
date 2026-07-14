import type { ReactElement, ReactNode } from 'react';
import type { CalculatorDef, Values, WarningKey } from '@calc/engine';
import { View, Text, Pressable, ScrollView } from 'react-native';
import type { ThemeTokens } from '../tokens/theme';
import { CalculatorForm } from './CalculatorForm';

export interface CalculatorScreenTemplateProps {
  calculator: CalculatorDef;
  values: Values;
  outputs: Values | undefined;
  /** Result of calculator.validate()/warnings() — computed outside (needs DataAccess, the template can't see it) */
  warnings: WarningKey[];
  theme: ThemeTokens;
  resolveLabel: (labelKey: string) => string;
  /** ',' for locales that write decimals as "2,5" (see CalculatorForm.parseFieldText); defaults to '.' */
  decimalSeparator?: ',' | '.';
  onChangeValue: (fieldId: string, value: string | number | undefined) => void;
  onBack: () => void;
  onOpenHistory: () => void;
  /** @calc/ui bundles no icon library — the app supplies the actual glyph; falls back to a plain glyph if omitted */
  historyIcon?: ReactNode;
  /** Only present if outputs are set — a chainTo jump with no ready result makes no sense */
  onChainTo?: (calculatorId: string, mappedValues: Partial<Values>) => void;
}

function warningColor(key: WarningKey, theme: ThemeTokens): string {
  // The web prototype distinguishes banner variants by exactly two colors
  // (see Banner in VoltageDrop/CableSizing.tsx): warn -> red, info -> blue.
  // error.* isn't any more severe than warn.* (both "need attention" — just
  // different causes: cross-field validation vs a compute() result).
  if (key.startsWith('info.')) return theme.colors.info;
  return theme.colors.danger;
}

/**
 * Template for a single calculator's screen: header (back/title/history) +
 * CalculatorForm + a warnings banner + chainTo buttons, rendered by a
 * generic loop over calculator.chainTo — instead of manually repeating this
 * chrome in each of the 9 calculator files, as the ElectroCalc web
 * prototype did.
 */
export function CalculatorScreenTemplate({
  calculator,
  values,
  outputs,
  warnings,
  theme,
  resolveLabel,
  decimalSeparator,
  onChangeValue,
  onBack,
  onOpenHistory,
  historyIcon,
  onChainTo,
}: CalculatorScreenTemplateProps): ReactElement {
  const iconButtonStyle = {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    backgroundColor: theme.colors.cardSurface,
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }} testID={`calculator-screen-${calculator.id}`}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: theme.layout.spacingUnit,
          padding: theme.layout.spacingUnit * 2,
        }}
      >
        <Pressable style={iconButtonStyle} onPress={onBack} testID="calculator-screen-back">
          <Text style={{ color: theme.colors.textSecondary, fontSize: 18 }}>‹</Text>
        </Pressable>
        <Text
          style={{
            flex: 1,
            fontFamily: theme.typography.uiFontFamily,
            fontSize: 20,
            fontWeight: '700',
            color: theme.colors.textPrimary,
          }}
        >
          {resolveLabel(calculator.titleKey)}
        </Text>
        <Pressable style={iconButtonStyle} onPress={onOpenHistory} testID="calculator-screen-history">
          {historyIcon ?? <Text style={{ color: theme.colors.textSecondary, fontSize: 16 }}>⏱</Text>}
        </Pressable>
      </View>

      {/* flexGrow: 1 on the content container is the whole trick: it lets
          short forms fill the screen without looking clipped/top-anchored,
          while longer forms (cable_sizing) scroll normally past the fold. */}
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          gap: theme.layout.spacingUnit * 2,
          paddingHorizontal: theme.layout.spacingUnit * 2,
          paddingBottom: theme.layout.spacingUnit * 2,
        }}
        keyboardShouldPersistTaps="handled"
      >
        <CalculatorForm
          calculator={calculator}
          values={values}
          outputs={outputs}
          theme={theme}
          resolveLabel={resolveLabel}
          decimalSeparator={decimalSeparator}
          onChangeValue={onChangeValue}
        />

        {warnings.length > 0 && (
          <View
            style={{
              gap: 4,
              padding: theme.layout.spacingUnit * 1.5,
              borderRadius: theme.layout.cardRadius,
              backgroundColor: theme.colors.cardSurface,
            }}
            testID="calculator-screen-warnings"
          >
            {warnings.map((key) => (
              <Text key={key} style={{ color: warningColor(key, theme), fontSize: 13 }}>
                {resolveLabel(key)}
              </Text>
            ))}
          </View>
        )}

        {outputs !== undefined && calculator.chainTo !== undefined && calculator.chainTo.length > 0 && (
          <View style={{ gap: theme.layout.spacingUnit }} testID="calculator-screen-chain-to">
            {calculator.chainTo.map((chain) => (
              <Pressable
                key={chain.calculatorId}
                style={{
                  alignItems: 'center',
                  padding: theme.layout.spacingUnit * 1.5,
                  borderRadius: theme.layout.cardRadius,
                  backgroundColor: theme.accent,
                }}
                onPress={() => onChainTo?.(chain.calculatorId, chain.mapOutputs(outputs))}
                testID={`calculator-screen-chain-to-${chain.calculatorId}`}
              >
                <Text style={{ fontWeight: '700', color: theme.colors.background }}>
                  {resolveLabel(chain.labelKey)}
                </Text>
              </Pressable>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}
