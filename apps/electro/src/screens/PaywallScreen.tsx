import type { ReactElement } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Check, Lock } from 'lucide-react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { buildTheme } from '@calc/ui';
import type { RootStackParamList } from '../navigation/types';
import { electro } from '../brand';
import { resolveLabel } from '../i18n/resolveLabel';
import { HOME_ICONS } from '../icons';

type Props = NativeStackScreenProps<RootStackParamList, 'Paywall'>;

const theme = buildTheme(electro.theme.accent);

const iconButtonStyle = {
  width: 36,
  height: 36,
  borderRadius: 10,
  alignItems: 'center' as const,
  justifyContent: 'center' as const,
  backgroundColor: theme.colors.cardSurface,
};

/**
 * A marketing/upsell screen, not a checkout — there's no real payment
 * integration behind this yet (no App Store/Play Billing/RevenueCat wiring),
 * so the CTA at the bottom is deliberately inert rather than pretending to
 * charge anything. Wire it up to a real purchase flow when there is one.
 */
export function PaywallScreen({ navigation }: Props): ReactElement {
  const proCalculators = electro.calculators.filter((calc) => calc.tier === 'pro');

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }} edges={['top', 'left', 'right']}>
      <ScrollView contentContainerStyle={{ flexGrow: 1, padding: theme.layout.spacingUnit * 2 }}>
        <View style={{ gap: theme.layout.spacingUnit * 2.5 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: theme.layout.spacingUnit }}>
              <Pressable style={iconButtonStyle} onPress={() => navigation.goBack()} testID="paywall-back">
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
                ElectroCalc Pro
              </Text>
            </View>

            <View
              style={{
                alignItems: 'center',
                gap: 4,
                padding: theme.layout.spacingUnit * 2,
                borderRadius: theme.layout.cardRadius,
                backgroundColor: `${theme.accent}20`,
              }}
            >
              <Lock size={24} color={theme.accent} />
              <Text
                style={{
                  fontFamily: theme.typography.uiFontFamily,
                  fontSize: 16,
                  fontWeight: '700',
                  color: theme.colors.textPrimary,
                }}
              >
                Unlock every calculator
              </Text>
              <Text
                style={{
                  fontFamily: theme.typography.uiFontFamily,
                  fontSize: 13,
                  color: theme.colors.textSecondary,
                  textAlign: 'center',
                }}
              >
                {proCalculators.length} pro calculators and unlimited history
              </Text>
            </View>

            <View style={{ gap: theme.layout.spacingUnit }}>
              {electro.paywall.valueProps.map((key) => {
                const isUnbuilt = key === 'paywall.pdfExport';
                return (
                  <View
                    key={key}
                    style={{ flexDirection: 'row', alignItems: 'center', gap: theme.layout.spacingUnit }}
                    testID={isUnbuilt ? 'paywall-pdf-export-soon' : undefined}
                  >
                    <Check size={16} color={isUnbuilt ? theme.colors.textSecondary : theme.accent} />
                    <Text
                      style={{
                        flex: 1,
                        fontFamily: theme.typography.uiFontFamily,
                        fontSize: 14,
                        color: isUnbuilt ? theme.colors.textSecondary : theme.colors.textPrimary,
                      }}
                    >
                      {resolveLabel(key)}
                    </Text>
                    {isUnbuilt && (
                      <View
                        style={{
                          paddingHorizontal: theme.layout.spacingUnit,
                          paddingVertical: 4,
                          borderRadius: 6,
                          backgroundColor: theme.colors.cardBorderMuted,
                        }}
                      >
                        <Text style={{ fontSize: 10, fontWeight: '700', color: theme.colors.textSecondary }}>SOON</Text>
                      </View>
                    )}
                  </View>
                );
              })}
            </View>

            {proCalculators.length > 0 && (
              <View style={{ gap: theme.layout.spacingUnit }}>
                <Text
                  style={{
                    color: theme.colors.textSecondary,
                    fontFamily: theme.typography.uiFontFamily,
                    fontSize: 12,
                    fontWeight: '700',
                    letterSpacing: 1,
                    textTransform: 'uppercase',
                  }}
                >
                  Includes
                </Text>
                {proCalculators.map((calc) => {
                  const Icon = HOME_ICONS[calc.id];
                  return (
                    <View
                      key={calc.id}
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: theme.layout.spacingUnit,
                        padding: theme.layout.spacingUnit * 1.5,
                        borderRadius: theme.layout.cardRadius,
                        backgroundColor: theme.colors.cardSurface,
                      }}
                    >
                      {Icon && <Icon size={16} color={theme.colors.textSecondary} />}
                      <Text
                        style={{ flex: 1, fontFamily: theme.typography.uiFontFamily, fontSize: 14, color: theme.colors.textPrimary }}
                      >
                        {resolveLabel(calc.titleKey)}
                      </Text>
                    </View>
                  );
                })}
              </View>
            )}

            <View style={{ gap: theme.layout.spacingUnit / 2 }}>
              <View
                style={{
                  alignItems: 'center',
                  padding: theme.layout.spacingUnit * 1.5,
                  borderRadius: theme.layout.cardRadius,
                  backgroundColor: theme.colors.cardBorderMuted,
                }}
                testID="paywall-cta-placeholder"
              >
                <Text style={{ fontWeight: '700', color: theme.colors.textSecondary }}>Upgrade — coming soon</Text>
              </View>
              <Text
                style={{ textAlign: 'center', fontSize: 11, color: theme.colors.textSecondary, fontFamily: theme.typography.uiFontFamily }}
              >
                No payment integration yet — nothing to buy here.
              </Text>
            </View>
          </View>
      </ScrollView>
    </SafeAreaView>
  );
}
