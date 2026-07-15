import type { ReactElement } from 'react';
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Check } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { buildTheme } from '@calc/ui';
import type { UnitsSystem } from '@calc/engine';
import type { RootStackParamList } from '../navigation/types';
import { electro } from '../brand';
import { SUPPORTED_LANGUAGES, setLanguage } from '../i18n/i18n';
import type { SupportedLanguage } from '../i18n/i18n';
import { getUnitsSystem, setUnitsSystem } from '../lib/settings';

const UNITS_SYSTEMS: UnitsSystem[] = ['metric', 'imperial'];

type Props = NativeStackScreenProps<RootStackParamList, 'Settings'>;

const theme = buildTheme(electro.theme.accent);

const iconButtonStyle = {
  width: 36,
  height: 36,
  borderRadius: 10,
  alignItems: 'center' as const,
  justifyContent: 'center' as const,
  backgroundColor: theme.colors.cardSurface,
};

const rowStyle = {
  flexDirection: 'row' as const,
  alignItems: 'center' as const,
  justifyContent: 'space-between' as const,
  minHeight: theme.layout.minFieldHeight,
  paddingHorizontal: theme.layout.spacingUnit * 2,
  borderRadius: theme.layout.cardRadius,
  backgroundColor: theme.colors.cardSurface,
};

/** Each language's own name, in that language — not translated per active locale, so a user lost in the wrong language can still find their own */
const LANGUAGE_NAMES: Record<SupportedLanguage, string> = {
  en: 'English',
  pl: 'Polski',
  de: 'Deutsch',
  fr: 'Français',
  it: 'Italiano',
  es: 'Español',
};

/**
 * Two settings so far: language (overrides the auto-detected device
 * locale — see detectInitialLanguage in i18n.ts) and units system (set at
 * onboarding, changeable here — the onboarding units slide's hint promises
 * exactly this: "You can change this anytime in Settings").
 */
export function SettingsScreen({ navigation }: Props): ReactElement {
  const { t, i18n } = useTranslation();
  const [unitsSystem, setUnitsSystemState] = useState<UnitsSystem>(() =>
    getUnitsSystem(electro.defaultUnitsSystem),
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }} edges={['top', 'left', 'right']}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: theme.layout.spacingUnit,
          padding: theme.layout.spacingUnit * 2,
        }}
      >
        <Pressable style={iconButtonStyle} onPress={() => navigation.goBack()} testID="settings-back">
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
          {t('ui.settings.title')}
        </Text>
      </View>

      <Text
        style={{
          color: theme.colors.textSecondary,
          fontFamily: theme.typography.uiFontFamily,
          fontSize: 13,
          paddingHorizontal: theme.layout.spacingUnit * 2,
          paddingBottom: theme.layout.spacingUnit,
        }}
      >
        {t('ui.settings.systemDefault')}
      </Text>

      <View style={{ gap: theme.layout.spacingUnit, paddingHorizontal: theme.layout.spacingUnit * 2 }}>
        {SUPPORTED_LANGUAGES.map((code) => {
          const active = i18n.language === code;
          return (
            <Pressable
              key={code}
              style={rowStyle}
              onPress={() => setLanguage(code)}
              testID={`settings-language-${code}`}
            >
              <Text
                style={{
                  fontFamily: theme.typography.uiFontFamily,
                  fontSize: 15,
                  color: active ? theme.colors.textPrimary : theme.colors.textSecondary,
                  fontWeight: active ? '700' : '400',
                }}
              >
                {LANGUAGE_NAMES[code]}
              </Text>
              {active && <Check size={18} color={theme.accent} />}
            </Pressable>
          );
        })}
      </View>

      <Text
        style={{
          color: theme.colors.textSecondary,
          fontFamily: theme.typography.uiFontFamily,
          fontSize: 12,
          fontWeight: '700',
          letterSpacing: 1,
          textTransform: 'uppercase',
          paddingHorizontal: theme.layout.spacingUnit * 2,
          paddingTop: theme.layout.spacingUnit * 2.5,
          paddingBottom: theme.layout.spacingUnit,
        }}
      >
        {t('ui.onboarding.unitsTitle')}
      </Text>

      <View style={{ gap: theme.layout.spacingUnit, paddingHorizontal: theme.layout.spacingUnit * 2 }}>
        {UNITS_SYSTEMS.map((system) => {
          const active = unitsSystem === system;
          return (
            <Pressable
              key={system}
              style={rowStyle}
              onPress={() => {
                setUnitsSystem(system);
                setUnitsSystemState(system);
              }}
              testID={`settings-units-${system}`}
            >
              <Text
                style={{
                  fontFamily: theme.typography.uiFontFamily,
                  fontSize: 15,
                  color: active ? theme.colors.textPrimary : theme.colors.textSecondary,
                  fontWeight: active ? '700' : '400',
                }}
              >
                {system === 'metric' ? t('ui.onboarding.unitsMetric') : t('ui.onboarding.unitsImperial')}
              </Text>
              {active && <Check size={18} color={theme.accent} />}
            </Pressable>
          );
        })}
      </View>
    </SafeAreaView>
  );
}
