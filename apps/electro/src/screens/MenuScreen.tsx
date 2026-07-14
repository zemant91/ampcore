import type { ReactElement } from 'react';
import { Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { History as HistoryIcon, FileText, Lock, Languages } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { buildTheme } from '@calc/ui';
import type { RootStackParamList } from '../navigation/types';
import { electro } from '../brand';

type Props = NativeStackScreenProps<RootStackParamList, 'Menu'>;

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
  gap: theme.layout.spacingUnit * 1.5,
  minHeight: theme.layout.minFieldHeight,
  paddingHorizontal: theme.layout.spacingUnit * 2,
  borderRadius: theme.layout.cardRadius,
  backgroundColor: theme.colors.cardSurface,
};

const rowIconBoxStyle = {
  width: 36,
  height: 36,
  borderRadius: 10,
  alignItems: 'center' as const,
  justifyContent: 'center' as const,
  backgroundColor: `${theme.accent}20`,
};

/** A row for a feature that isn't built yet — same muted/dashed treatment as "soon" calculators on Home */
function ComingSoonRow({ icon, label }: { icon: ReactElement; label: string }): ReactElement {
  const { t } = useTranslation();
  return (
    <View
      style={{
        ...rowStyle,
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderStyle: 'dashed',
        borderColor: theme.colors.cardBorderMuted,
      }}
    >
      <View style={{ ...rowIconBoxStyle, backgroundColor: theme.colors.cardBorderMuted }}>{icon}</View>
      <Text style={{ flex: 1, fontFamily: theme.typography.uiFontFamily, fontSize: 15, color: theme.colors.textSecondary }}>
        {label}
      </Text>
      <View
        style={{
          paddingHorizontal: theme.layout.spacingUnit,
          paddingVertical: 4,
          borderRadius: 6,
          backgroundColor: theme.colors.cardBorderMuted,
        }}
      >
        <Text style={{ fontSize: 10, fontWeight: '700', color: theme.colors.textSecondary }}>
          {t('ui.common.soonBadge')}
        </Text>
      </View>
    </View>
  );
}

/**
 * Everything that isn't a calculator: history, and future account/export
 * features. Kept as its own screen (not a Home bottom sheet) for the same
 * reason History already is — consistent with the rest of the app being
 * screen-based navigation, not a mix of modals and screens.
 */
export function MenuScreen({ navigation }: Props): ReactElement {
  const { t } = useTranslation();
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
        <Pressable style={iconButtonStyle} onPress={() => navigation.goBack()} testID="menu-back">
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
          {t('ui.menu.title')}
        </Text>
      </View>

      <View style={{ gap: theme.layout.spacingUnit, paddingHorizontal: theme.layout.spacingUnit * 2 }}>
        <Pressable style={rowStyle} onPress={() => navigation.navigate('History')} testID="menu-history">
          <View style={rowIconBoxStyle}>
            <HistoryIcon size={18} color={theme.accent} />
          </View>
          <Text style={{ flex: 1, fontFamily: theme.typography.uiFontFamily, fontSize: 15, color: theme.colors.textPrimary }}>
            {t('ui.history.title')}
          </Text>
        </Pressable>

        <Pressable style={rowStyle} onPress={() => navigation.navigate('Settings')} testID="menu-settings">
          <View style={rowIconBoxStyle}>
            <Languages size={18} color={theme.accent} />
          </View>
          <Text style={{ flex: 1, fontFamily: theme.typography.uiFontFamily, fontSize: 15, color: theme.colors.textPrimary }}>
            {t('ui.menu.settingsRow')}
          </Text>
        </Pressable>

        <ComingSoonRow icon={<FileText size={18} color={theme.colors.textSecondary} />} label={t('ui.menu.exportPdf')} />
        <ComingSoonRow icon={<Lock size={18} color={theme.colors.textSecondary} />} label={t('ui.menu.restorePurchases')} />
      </View>
    </SafeAreaView>
  );
}
