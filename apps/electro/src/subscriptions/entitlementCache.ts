import { MMKV } from 'react-native-mmkv';

/**
 * RevenueCat's SDK already caches CustomerInfo on-device, but resolving it
 * is still async — this MMKV flag gives the first render of HomeScreen a
 * synchronous last-known answer instead of a "locked" flash before the SDK
 * responds. Same pattern as src/lib/settings.ts's onboarding flag.
 */
const storage = new MMKV({ id: 'electrocalc-subscriptions' });

const IS_PRO_KEY = 'electrocalc_is_pro';

export function getCachedIsPro(): boolean {
  return storage.getBoolean(IS_PRO_KEY) ?? false;
}

export function setCachedIsPro(isPro: boolean): void {
  storage.set(IS_PRO_KEY, isPro);
}
