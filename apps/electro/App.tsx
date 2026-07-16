// apps/electro/App.tsx
import type { ReactElement } from 'react';
import { useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
// Side-effect import: runs i18n.init() (device-locale detection, resource
// loading) before the first screen renders.
import './src/i18n/i18n';
import { RootNavigator } from './src/navigation/RootNavigator';
import { OnboardingScreen } from './src/screens/OnboardingScreen';
import { isOnboardingCompleted } from './src/lib/settings';
import { EntitlementProvider, initPurchases } from './src/subscriptions';

// Configures the RevenueCat SDK once, before EntitlementProvider's first
// Purchases.getCustomerInfo() call — module-level (not an effect) so it
// runs exactly once per app process, same lifetime as the SDK itself.
initPurchases();

export default function App(): ReactElement {
  // Checked once at mount, before Home (or anything else) ever renders —
  // not a route inside RootNavigator, so there's no stack entry to
  // back-swipe past and no way to reach Home except through onComplete.
  const [onboardingDone, setOnboardingDone] = useState(() => isOnboardingCompleted());

  return (
    <SafeAreaProvider>
      <EntitlementProvider>
        {onboardingDone ? (
          <RootNavigator />
        ) : (
          <OnboardingScreen onComplete={() => setOnboardingDone(true)} />
        )}
      </EntitlementProvider>
    </SafeAreaProvider>
  );
}
