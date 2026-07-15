import type { ReactElement } from 'react';
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { buildTheme, SegmentedControl } from '@calc/ui';
import type { UnitsSystem } from '@calc/engine';
import { electro } from '../brand';
import { completeOnboarding } from '../lib/settings';

const theme = buildTheme(electro.theme.accent);

const UNITS_OPTIONS = [
  { value: 'metric' as const, labelKey: 'ui.onboarding.unitsMetric' },
  { value: 'imperial' as const, labelKey: 'ui.onboarding.unitsImperial' },
];

interface Props {
  onComplete: () => void;
}

/**
 * Three slides, plain sequential navigation via a bottom button — not a
 * swipe pager. The third slide (legal disclaimer) needs a deliberate
 * confirming tap, not something a user can flick past by accident. This is
 * a single component with an internal step state, not three stack screens on
 * purpose: nothing pushed onto the navigator means there's no back-swipe
 * gesture or screen to dismiss out from under it (see App.tsx — this
 * replaces RootNavigator entirely until onComplete fires).
 */
export function OnboardingScreen({ onComplete }: Props): ReactElement {
  const { t } = useTranslation();
  const [step, setStep] = useState(0);
  const [unitsSystem, setUnitsSystem] = useState<UnitsSystem>(electro.defaultUnitsSystem);

  const finish = () => {
    completeOnboarding(unitsSystem);
    onComplete();
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: theme.colors.background }}
      edges={['top', 'left', 'right', 'bottom']}
      testID="onboarding-screen"
    >
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          gap: 6,
          paddingTop: theme.layout.spacingUnit * 2,
        }}
        testID="onboarding-step-indicator"
      >
        {[0, 1, 2].map((dot) => (
          <View
            key={dot}
            style={{
              width: 6,
              height: 6,
              borderRadius: 3,
              backgroundColor: dot === step ? theme.accent : theme.colors.cardBorderMuted,
            }}
          />
        ))}
      </View>

      <View style={{ flex: 1, justifyContent: 'center', padding: theme.layout.spacingUnit * 3, gap: theme.layout.spacingUnit * 2 }}>
        {step === 0 && (
          <View style={{ gap: theme.layout.spacingUnit }} testID="onboarding-slide-welcome">
            <Text
              style={{
                fontFamily: theme.typography.uiFontFamily,
                fontSize: 26,
                fontWeight: '700',
                color: theme.colors.textPrimary,
              }}
            >
              {t(electro.onboarding.welcomeTitleKey)}
            </Text>
            <Text
              style={{
                fontFamily: theme.typography.uiFontFamily,
                fontSize: 16,
                lineHeight: 22,
                color: theme.colors.textSecondary,
              }}
            >
              {t(electro.onboarding.welcomeBodyKey)}
            </Text>
          </View>
        )}

        {step === 1 && (
          <View style={{ gap: theme.layout.spacingUnit }} testID="onboarding-slide-units">
            <Text
              style={{
                fontFamily: theme.typography.uiFontFamily,
                fontSize: 22,
                fontWeight: '700',
                color: theme.colors.textPrimary,
              }}
            >
              {t('ui.onboarding.unitsTitle')}
            </Text>
            <View style={{ flexDirection: 'row' }}>
              <SegmentedControl
                options={UNITS_OPTIONS}
                value={unitsSystem}
                theme={theme}
                resolveLabel={t}
                onChange={(value) => setUnitsSystem(value as UnitsSystem)}
              />
            </View>
            <Text
              style={{
                fontFamily: theme.typography.uiFontFamily,
                fontSize: 13,
                color: theme.colors.textSecondary,
              }}
            >
              {t('ui.onboarding.unitsHint')}
            </Text>
          </View>
        )}

        {step === 2 && (
          <View style={{ gap: theme.layout.spacingUnit }} testID="onboarding-slide-disclaimer">
            <Text
              style={{
                fontFamily: theme.typography.uiFontFamily,
                fontSize: 22,
                fontWeight: '700',
                color: theme.colors.textPrimary,
              }}
            >
              {t('ui.onboarding.disclaimerTitle')}
            </Text>
            <Text
              style={{
                fontFamily: theme.typography.uiFontFamily,
                fontSize: 15,
                lineHeight: 21,
                color: theme.colors.textSecondary,
              }}
            >
              {t(electro.legalDisclaimerKey)}
            </Text>
          </View>
        )}
      </View>

      <View style={{ padding: theme.layout.spacingUnit * 2 }}>
        <Pressable
          style={{
            alignItems: 'center',
            padding: theme.layout.spacingUnit * 1.5,
            borderRadius: theme.layout.cardRadius,
            backgroundColor: theme.accent,
          }}
          onPress={() => (step < 2 ? setStep(step + 1) : finish())}
          testID="onboarding-primary-button"
        >
          <Text style={{ fontWeight: '700', color: theme.colors.background }}>
            {step < 2 ? t('ui.onboarding.next') : t('ui.onboarding.iUnderstand')}
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
