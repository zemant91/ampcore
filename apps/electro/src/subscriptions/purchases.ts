import Purchases, { LOG_LEVEL, type CustomerInfo, type PurchasesOffering } from 'react-native-purchases';
import { getRevenueCatApiKey, PRO_ENTITLEMENT_ID } from './config';

let configured = false;

/**
 * Idempotent — safe to call more than once (e.g. Fast Refresh during dev).
 *
 * Called at module scope in App.tsx, before the first render — an uncaught
 * throw here (e.g. a missing API key because .env wasn't present for this
 * particular build) would crash the whole app before React even mounts, so
 * this degrades instead: the rest of the app (all free-tier calculators)
 * stays usable, entitlement just resolves to "not pro" until it's fixed.
 */
export function initPurchases(): void {
  if (configured) return;
  try {
    if (__DEV__) {
      Purchases.setLogLevel(LOG_LEVEL.WARN);
    }
    Purchases.configure({ apiKey: getRevenueCatApiKey() });
    configured = true;
  } catch (error) {
    console.error('[subscriptions] initPurchases() failed — subscriptions will be unavailable this session', error);
  }
}

export function isProEntitlementActive(customerInfo: CustomerInfo): boolean {
  return customerInfo.entitlements.active[PRO_ENTITLEMENT_ID] !== undefined;
}

export async function fetchCustomerInfo(): Promise<CustomerInfo> {
  return Purchases.getCustomerInfo();
}

/** offeringId falls back to the dashboard's Current offering if unset or not found (e.g. in production, or a stale/deleted dev override). */
export async function fetchPaywallOffering(offeringId?: string | null): Promise<PurchasesOffering | null> {
  const offerings = await Purchases.getOfferings();
  if (offeringId) return offerings.all[offeringId] ?? offerings.current;
  return offerings.current;
}

export { PRO_ENTITLEMENT_ID } from './config';
export type { CustomerInfo, PurchasesOffering };
