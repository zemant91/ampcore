import RevenueCatUI from 'react-native-purchases-ui';

/**
 * RevenueCat's hosted Customer Center — manage/cancel/refund (iOS)/restore,
 * all configured in the RC dashboard. Covers restore-purchases too, so
 * there's no separate hand-rolled restore flow: a user with no active
 * subscription who opens this gets prompted to restore automatically.
 */
export async function presentCustomerCenter(): Promise<void> {
  await RevenueCatUI.presentCustomerCenter();
}
