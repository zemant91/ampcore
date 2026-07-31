import type { ReactElement, ReactNode } from 'react';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import Purchases, { type CustomerInfo } from 'react-native-purchases';
import { fetchCustomerInfo, isProEntitlementActive } from './purchases';
import {
  getCachedIsPro,
  setCachedIsPro,
  getDevProOverride,
  setDevProOverride as persistDevProOverride,
} from './entitlementCache';

interface EntitlementState {
  /** Synchronous last-known value (MMKV cache) until the SDK resolves, then live — or the dev override below, if set. */
  isPro: boolean;
  /** True only until the first Purchases.getCustomerInfo() call resolves. */
  loading: boolean;
  /** __DEV__ only: null defers to the real RevenueCat-derived isPro above (see DevMenuButton) */
  devProOverride: boolean | null;
  setDevProOverride: (value: boolean | null) => void;
}

const EntitlementContext = createContext<EntitlementState | undefined>(undefined);

/**
 * Wraps RootNavigator (see App.tsx). initPurchases() must already have run
 * before this mounts — Purchases.getCustomerInfo() throws if the SDK isn't
 * configured yet.
 */
export function EntitlementProvider({ children }: { children: ReactNode }): ReactElement {
  const [realIsPro, setRealIsPro] = useState(getCachedIsPro);
  const [loading, setLoading] = useState(true);
  const [devProOverride, setDevProOverrideState] = useState<boolean | null>(getDevProOverride);

  useEffect(() => {
    let cancelled = false;

    fetchCustomerInfo()
      .then((customerInfo) => {
        if (cancelled) return;
        const active = isProEntitlementActive(customerInfo);
        setRealIsPro(active);
        setCachedIsPro(active);
      })
      .catch(() => {
        // Offline on cold start with no prior cache — fall back to the
        // MMKV value already in state; the listener below will correct it
        // once connectivity + the SDK's own cache catch up.
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    const listener = (customerInfo: CustomerInfo) => {
      const active = isProEntitlementActive(customerInfo);
      setRealIsPro(active);
      setCachedIsPro(active);
    };
    Purchases.addCustomerInfoUpdateListener(listener);

    return () => {
      cancelled = true;
      Purchases.removeCustomerInfoUpdateListener(listener);
    };
  }, []);

  const setDevProOverride = (value: boolean | null): void => {
    persistDevProOverride(value);
    setDevProOverrideState(value);
  };

  // __DEV__ guard here too (not just at DevMenuButton's render) — belt and
  // suspenders: an override could only ever be persisted by that dev-only
  // button, but this keeps a stray MMKV value from ever affecting a release
  // build's entitlement, even if e.g. a device kept dev-installed storage.
  const isPro = __DEV__ && devProOverride !== null ? devProOverride : realIsPro;

  const value = useMemo(
    () => ({ isPro, loading, devProOverride, setDevProOverride }),
    [isPro, loading, devProOverride],
  );

  return <EntitlementContext.Provider value={value}>{children}</EntitlementContext.Provider>;
}

export function useEntitlement(): EntitlementState {
  const ctx = useContext(EntitlementContext);
  if (!ctx) {
    throw new Error('useEntitlement() must be called within an EntitlementProvider');
  }
  return ctx;
}
