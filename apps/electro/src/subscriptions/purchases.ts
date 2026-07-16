import Purchases, { LOG_LEVEL, type CustomerInfo } from 'react-native-purchases';
import { getRevenueCatApiKey, PRO_ENTITLEMENT_ID } from './config';

let configured = false;

/** Idempotent — safe to call more than once (e.g. Fast Refresh during dev). */
export function initPurchases(): void {
  if (configured) return;
  if (__DEV__) {
    Purchases.setLogLevel(LOG_LEVEL.WARN);
  }
  Purchases.configure({ apiKey: getRevenueCatApiKey() });
  configured = true;
}

export function isProEntitlementActive(customerInfo: CustomerInfo): boolean {
  return customerInfo.entitlements.active[PRO_ENTITLEMENT_ID] !== undefined;
}

export async function fetchCustomerInfo(): Promise<CustomerInfo> {
  return Purchases.getCustomerInfo();
}

export { PRO_ENTITLEMENT_ID } from './config';
export type { CustomerInfo };
