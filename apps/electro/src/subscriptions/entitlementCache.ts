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

const DEV_PRO_OVERRIDE_KEY = 'electrocalc_dev_pro_override';

/**
 * __DEV__-only: forces isPro on/off for testing Pro-gated features without a
 * real RevenueCat purchase (see DevMenuButton). null means "no override, use
 * the real entitlement" — distinct from a stored false, hence `contains()`
 * rather than a `?? null` default on getBoolean().
 */
export function getDevProOverride(): boolean | null {
  return storage.contains(DEV_PRO_OVERRIDE_KEY) ? (storage.getBoolean(DEV_PRO_OVERRIDE_KEY) ?? null) : null;
}

export function setDevProOverride(value: boolean | null): void {
  if (value === null) {
    storage.delete(DEV_PRO_OVERRIDE_KEY);
  } else {
    storage.set(DEV_PRO_OVERRIDE_KEY, value);
  }
}
