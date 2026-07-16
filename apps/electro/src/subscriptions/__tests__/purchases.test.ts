import { isProEntitlementActive } from '../purchases';
import { PRO_ENTITLEMENT_ID } from '../config';

function makeCustomerInfo(activeEntitlementIds: string[]) {
  const active: Record<string, unknown> = {};
  for (const id of activeEntitlementIds) active[id] = { identifier: id, isActive: true };
  return { entitlements: { active, all: active } } as never;
}

describe('isProEntitlementActive', () => {
  test('true when the pro entitlement is in the active map', () => {
    expect(isProEntitlementActive(makeCustomerInfo([PRO_ENTITLEMENT_ID]))).toBe(true);
  });

  test('false when the active map is empty', () => {
    expect(isProEntitlementActive(makeCustomerInfo([]))).toBe(false);
  });

  test('false when only an unrelated entitlement is active', () => {
    expect(isProEntitlementActive(makeCustomerInfo(['other']))).toBe(false);
  });
});
