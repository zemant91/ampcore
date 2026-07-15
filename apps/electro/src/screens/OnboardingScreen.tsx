import type { ReactElement } from 'react';
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { buildTheme } from '@calc/ui';
import { electro } from '../brand';
import { completeOnboarding } from '../lib/settings';

const theme = buildTheme(electro.theme.accent);

interface Props {
  onComplete: () => void;
}

/**
 * Two slides, plain sequential navigation via a bottom button — not a
 * swipe pager. The second slide (legal disclaimer) needs a deliberate
 * confirming tap, not something a user can flick past by accident. This is
 * a single component with an internal step state, not stack screens on
 * purpose: nothing pushed onto the navigator means there's no back-swipe
 * gesture or screen to dismiss out from under it (see App.tsx — this
 * replaces RootNavigator entirely until onComplete fires).
 *
 * Units-system choice used to live here as its own slide — moved to
 * Settings instead (see SettingsScreen's Units section), so there's one
 * place to set it, not two. Onboarding completes with the brand's own
 * default (electro.defaultUnitsSystem); Settings is where it's changed.
 */
export function OnboardingScreen({ onComplete }: Props): ReactElement {
  const { t } = useTranslation();
  const [step, setStep] = useState(0);

  const finish = () => {
    completeOnboarding(electro.defaultUnitsSystem);
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
        {[0, 1].map(dot => (
          <View
            key={dot}
            style={{
              width: 6,
              height: 6,
              borderRadius: 3,
              backgroundColor:
                dot === step ? theme.accent : theme.colors.cardBorderMuted,
            }}
          />
        ))}
      </View>

      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          padding: theme.layout.spacingUnit * 3,
          gap: theme.layout.spacingUnit * 2,
        }}
      >
        {step === 0 && (
          <View
            style={{ gap: theme.layout.spacingUnit }}
            testID="onboarding-slide-welcome"
          >
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
          <View
            style={{ gap: theme.layout.spacingUnit }}
            testID="onboarding-slide-disclaimer"
          >
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
          onPress={() => (step < 1 ? setStep(step + 1) : finish())}
          testID="onboarding-primary-button"
        >
          <Text style={{ fontWeight: '700', color: theme.colors.background }}>
            {step < 1
              ? t('ui.onboarding.next')
              : t('ui.onboarding.iUnderstand')}
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
