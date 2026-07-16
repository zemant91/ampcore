import type { ReactElement, ReactNode } from 'react';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import Purchases, { type CustomerInfo } from 'react-native-purchases';
import { fetchCustomerInfo, isProEntitlementActive } from './purchases';
import { getCachedIsPro, setCachedIsPro } from './entitlementCache';

interface EntitlementState {
  /** Synchronous last-known value (MMKV cache) until the SDK resolves, then live. */
  isPro: boolean;
  /** True only until the first Purchases.getCustomerInfo() call resolves. */
  loading: boolean;
}

const EntitlementContext = createContext<EntitlementState | undefined>(undefined);

/**
 * Wraps RootNavigator (see App.tsx). initPurchases() must already have run
 * before this mounts — Purchases.getCustomerInfo() throws if the SDK isn't
 * configured yet.
 */
export function EntitlementProvider({ children }: { children: ReactNode }): ReactElement {
  const [isPro, setIsPro] = useState(getCachedIsPro);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    fetchCustomerInfo()
      .then((customerInfo) => {
        if (cancelled) return;
        const active = isProEntitlementActive(customerInfo);
        setIsPro(active);
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
      setIsPro(active);
      setCachedIsPro(active);
    };
    Purchases.addCustomerInfoUpdateListener(listener);

    return () => {
      cancelled = true;
      Purchases.removeCustomerInfoUpdateListener(listener);
    };
  }, []);

  const value = useMemo(() => ({ isPro, loading }), [isPro, loading]);

  return <EntitlementContext.Provider value={value}>{children}</EntitlementContext.Provider>;
}

export function useEntitlement(): EntitlementState {
  const ctx = useContext(EntitlementContext);
  if (!ctx) {
    throw new Error('useEntitlement() must be called within an EntitlementProvider');
  }
  return ctx;
}
