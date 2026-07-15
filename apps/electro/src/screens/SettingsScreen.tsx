import type { ReactElement } from 'react';
import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Check } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { buildTheme } from '@calc/ui';
import {
  DIFFERING_QUANTITIES,
  METRIC_UNIT,
  unitForField,
  displayUnit,
} from '@calc/engine';
import type { Quantity, UnitsSystem } from '@calc/engine';
import type { RootStackParamList } from '../navigation/types';
import { electro } from '../brand';
import { SUPPORTED_LANGUAGES, setLanguage } from '../i18n/i18n';
import type { SupportedLanguage } from '../i18n/i18n';
import { getUnitsSystem, setUnitsSystem } from '../lib/settings';

const UNITS_SYSTEMS: UnitsSystem[] = ['metric', 'imperial'];

/** Which i18n key names each of DIFFERING_QUANTITIES for the units-system hint below */
const QUANTITY_LABEL_KEY: Partial<Record<Quantity, string>> = {
  length: 'field.length',
  area: 'field.crossSection',
  temperature: 'field.temperature',
};

/**
 * "Length: m", "Cross-section: mm²", ... — built from the same data
 * unitForField uses for real fields (DIFFERING_QUANTITIES/METRIC_UNIT), not
 * hand-written prose per locale — a changed/added unit here updates
 * automatically instead of needing a matching edit in all 6 resource files.
 * Only the quantity names go through i18n; unit symbols (m, ft, mm²...)
 * aren't translated anywhere else in the app either.
 */
function unitsSummary(system: UnitsSystem, t: (key: string) => string): string {
  return DIFFERING_QUANTITIES.map(quantity => {
    const unit = unitForField(quantity, METRIC_UNIT[quantity]!, system);
    return `${t(QUANTITY_LABEL_KEY[quantity]!)}: ${displayUnit(unit)}`;
  }).join(' · ');
}

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

const sectionHeaderStyle = {
  color: theme.colors.textSecondary,
  fontFamily: theme.typography.uiFontFamily,
  fontSize: 12,
  fontWeight: '700' as const,
  letterSpacing: 1,
  textTransform: 'uppercase' as const,
  paddingHorizontal: theme.layout.spacingUnit * 2,
  paddingTop: theme.layout.spacingUnit * 2.5,
  paddingBottom: theme.layout.spacingUnit,
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
 * A general Settings screen, not a language-specific one — two peer
 * sections so far: Language (overrides the auto-detected device locale —
 * see detectInitialLanguage in i18n.ts) and Units (set at onboarding,
 * changeable here — the onboarding units slide's hint promises exactly
 * this: "You can change this anytime in Settings"). Each section gets its
 * own header; neither is "the" screen the way Language used to be before
 * Units was added here.
 */
export function SettingsScreen({ navigation }: Props): ReactElement {
  const { t, i18n } = useTranslation();
  const [unitsSystem, setUnitsSystemState] = useState<UnitsSystem>(() =>
    getUnitsSystem(electro.defaultUnitsSystem),
  );

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: theme.colors.background }}
      edges={['top', 'left', 'right']}
    >
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: theme.layout.spacingUnit,
          padding: theme.layout.spacingUnit * 2,
        }}
      >
        <Pressable
          style={iconButtonStyle}
          onPress={() => navigation.goBack()}
          testID="settings-back"
        >
          <Text style={{ color: theme.colors.textSecondary, fontSize: 18 }}>
            ‹
          </Text>
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

      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          paddingBottom: theme.layout.spacingUnit * 2,
        }}
      >
        <Text style={{ ...sectionHeaderStyle, paddingTop: 0 }}>
          {t('ui.settings.languageTitle')}
        </Text>

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

        <View
          style={{
            gap: theme.layout.spacingUnit,
            paddingHorizontal: theme.layout.spacingUnit * 2,
          }}
        >
          {SUPPORTED_LANGUAGES.map(code => {
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
                    color: active
                      ? theme.colors.textPrimary
                      : theme.colors.textSecondary,
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

        <Text style={sectionHeaderStyle}>{t('ui.onboarding.unitsTitle')}</Text>

        <View
          style={{
            gap: theme.layout.spacingUnit,
            paddingHorizontal: theme.layout.spacingUnit * 2,
          }}
        >
          {UNITS_SYSTEMS.map(system => {
            const active = unitsSystem === system;
            return (
              <Pressable
                key={system}
                style={{
                  ...rowStyle,
                  paddingVertical: theme.layout.spacingUnit * 1.5,
                }}
                onPress={() => {
                  setUnitsSystem(system);
                  setUnitsSystemState(system);
                }}
                testID={`settings-units-${system}`}
              >
                <View style={{ flex: 1, gap: 2 }}>
                  <Text
                    style={{
                      fontFamily: theme.typography.uiFontFamily,
                      fontSize: 15,
                      color: active
                        ? theme.colors.textPrimary
                        : theme.colors.textSecondary,
                      fontWeight: active ? '700' : '400',
                    }}
                  >
                    {system === 'metric'
                      ? t('ui.onboarding.unitsMetric')
                      : t('ui.onboarding.unitsImperial')}
                  </Text>
                  <Text
                    style={{
                      fontFamily: theme.typography.uiFontFamily,
                      fontSize: 12,
                      color: theme.colors.textSecondary,
                    }}
                  >
                    {unitsSummary(system, t)}
                  </Text>
                </View>
                {active && <Check size={18} color={theme.accent} />}
              </Pressable>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
