import type { ReactElement } from 'react';
import { useState } from 'react';
import { Modal, Pressable, Text, View } from 'react-native';
import { Chip, buildTheme } from '@calc/ui';
import { electro } from '../brand';
import { useEntitlement, getDevOfferingId, setDevOfferingId } from '../subscriptions';

const theme = buildTheme(electro.theme.accent);

/** Matches the "test" Offering identifier created in the RevenueCat dashboard for local paywall testing. */
const TEST_OFFERING_ID = 'test';

/**
 * Floating dev-only toggle for forcing the Pro entitlement on/off without a
 * real RevenueCat purchase — lets Pro-gated features (PDF export, cable
 * chaining, unlimited history) be exercised on a plain dev build/simulator.
 * `__DEV__` is RN's standard dev-vs-release global (see initPurchases.ts for
 * the same guard) — this never renders in a release build. The override
 * itself persists in MMKV (see entitlementCache.ts) so it survives reloads
 * during a test session, not just this component's own state.
 */
export function DevMenuButton(): ReactElement | null {
  const { devProOverride, setDevProOverride } = useEntitlement();
  const [open, setOpen] = useState(false);
  const [devOfferingId, setDevOfferingIdState] = useState(getDevOfferingId);

  if (!__DEV__) return null;

  const modeLabel = devProOverride === null ? 'DEV' : devProOverride ? 'PRO' : 'FREE';

  return (
    <>
      <Pressable
        onPress={() => setOpen(true)}
        style={{
          position: 'absolute',
          right: 16,
          bottom: 32,
          width: 44,
          height: 44,
          borderRadius: 22,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#1a1a1a',
          shadowColor: '#000',
          shadowOpacity: 0.3,
          shadowRadius: 4,
          shadowOffset: { width: 0, height: 2 },
          elevation: 6,
        }}
        testID="dev-menu-button"
      >
        <Text style={{ color: '#fff', fontSize: 10, fontWeight: '700' }}>{modeLabel}</Text>
      </Pressable>

      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <Pressable
          style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.5)' }}
          onPress={() => setOpen(false)}
          testID="dev-menu-backdrop"
        >
          {/* Swallow taps so they don't bubble to the backdrop's dismiss handler above */}
          <Pressable
            style={{ gap: 16, padding: 24, borderTopLeftRadius: 20, borderTopRightRadius: 20, backgroundColor: '#fff' }}
            onPress={() => {}}
          >
            <Text style={{ fontWeight: '700', fontSize: 16, color: '#1a1a1a' }}>Dev menu</Text>
            <Text style={{ fontSize: 13, color: '#666' }}>
              Pseudo subscription — overrides RevenueCat on this device until reset.
            </Text>
            <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
              <Chip
                label="Real"
                active={devProOverride === null}
                theme={theme}
                onPress={() => setDevProOverride(null)}
              />
              <Chip
                label="Force Pro"
                active={devProOverride === true}
                theme={theme}
                onPress={() => setDevProOverride(true)}
              />
              <Chip
                label="Force Free"
                active={devProOverride === false}
                theme={theme}
                onPress={() => setDevProOverride(false)}
              />
            </View>

            <Text style={{ fontSize: 13, color: '#666' }}>
              Paywall offering — which RevenueCat offering PaywallScreen loads, independent of the dashboard's Current setting.
            </Text>
            <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
              <Chip
                label="Prod (Current)"
                active={devOfferingId === null}
                theme={theme}
                onPress={() => {
                  setDevOfferingId(null);
                  setDevOfferingIdState(null);
                }}
              />
              <Chip
                label="Test"
                active={devOfferingId === TEST_OFFERING_ID}
                theme={theme}
                onPress={() => {
                  setDevOfferingId(TEST_OFFERING_ID);
                  setDevOfferingIdState(TEST_OFFERING_ID);
                }}
              />
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}
