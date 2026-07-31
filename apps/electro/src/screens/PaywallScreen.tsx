import type { ReactElement } from 'react';
import { Pressable, Text, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { buildTheme } from '@calc/ui';
import RevenueCatUI from 'react-native-purchases-ui';
import type { RootStackParamList } from '../navigation/types';
import { electro } from '../brand';
import { presentCustomerCenter, useEntitlement } from '../subscriptions';

type Props = NativeStackScreenProps<RootStackParamList, 'Paywall'>;

const theme = buildTheme(electro.theme.accent);

/**
 * Paywall content (headline, value props, pricing, purchase CTA) is owned by
 * RevenueCat's dashboard-configured Paywall template, not hand-built here —
 * that's the one place it can change (copy, pricing, layout) without an app
 * release. Purchase/restore/error states are all handled by the native view.
 */
export function PaywallScreen({ navigation }: Props): ReactElement {
  const { t } = useTranslation();
  const { isPro } = useEntitlement();
  const insets = useSafeAreaInsets();

  if (isPro) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }} edges={['top', 'left', 'right']}>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            gap: theme.layout.spacingUnit,
            padding: theme.layout.spacingUnit * 2,
          }}
        >
          <Text
            style={{
              fontFamily: theme.typography.uiFontFamily,
              fontSize: 18,
              fontWeight: '700',
              color: theme.colors.textPrimary,
            }}
          >
            {t('ui.paywall.alreadyProTitle')}
          </Text>
          <Text
            style={{
              textAlign: 'center',
              fontSize: 13,
              color: theme.colors.textSecondary,
              fontFamily: theme.typography.uiFontFamily,
            }}
          >
            {t('ui.paywall.alreadyProBody')}
          </Text>
          <Pressable
            style={{
              marginTop: theme.layout.spacingUnit,
              paddingHorizontal: theme.layout.spacingUnit * 2,
              paddingVertical: theme.layout.spacingUnit * 1.5,
              borderRadius: theme.layout.cardRadius,
              backgroundColor: theme.accent,
            }}
            onPress={() => presentCustomerCenter()}
            testID="paywall-manage-subscription"
          >
            <Text style={{ fontWeight: '700', color: theme.colors.background }}>
              {t('ui.menu.manageSubscription')}
            </Text>
          </Pressable>
          <Pressable onPress={() => navigation.goBack()} testID="paywall-back">
            <Text
              style={{ fontSize: 13, color: theme.colors.textSecondary, fontFamily: theme.typography.uiFontFamily }}
            >
              {t('ui.paywall.close')}
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }} edges={['top', 'left', 'right']}>
      <RevenueCatUI.Paywall
        style={{ flex: 1 }}
        onDismiss={() => navigation.goBack()}
        onPurchaseCompleted={() => navigation.goBack()}
        onRestoreCompleted={() => navigation.goBack()}
      />
      {/* RevenueCat's dashboard-configured close button (displayCloseButton) is
       * ignored for V2 paywall templates, so without this the native view has
       * no way back — this floating button is the app-side fallback RevenueCat
       * support points to. */}
      <Pressable
        style={{
          position: 'absolute',
          top: insets.top - theme.layout.spacingUnit,
          left: insets.left + theme.layout.spacingUnit * 2,
          width: 36,
          height: 36,
          borderRadius: 18,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'rgba(0,0,0,0.4)',
        }}
        onPress={() => navigation.goBack()}
        testID="paywall-back"
      >
        <Text style={{ color: '#fff', fontSize: 18 }}>‹</Text>
      </Pressable>
    </SafeAreaView>
  );
}
