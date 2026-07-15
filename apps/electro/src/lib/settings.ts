import { MMKV } from 'react-native-mmkv';
import type { UnitsSystem } from '@calc/engine';

/**
 * Local app settings that need to survive a restart: onboarding completion
 * and the user's units-system choice. Same storage mechanism (MMKV) already
 * used for the language override in i18n.ts — a separate instance sharing
 * the same `id` is fine, MMKV is built for that, and it keeps this module
 * independent of i18n's.
 */
const storage = new MMKV({ id: 'electrocalc-settings' });

const ONBOARDING_COMPLETED_KEY = 'electrocalc_onboarding_completed';
const UNITS_SYSTEM_KEY = 'electrocalc_units_system';

export function isOnboardingCompleted(): boolean {
  return storage.getBoolean(ONBOARDING_COMPLETED_KEY) ?? false;
}

function isUnitsSystem(value: string | undefined): value is UnitsSystem {
  return value === 'metric' || value === 'imperial';
}

export function getUnitsSystem(fallback: UnitsSystem): UnitsSystem {
  const stored = storage.getString(UNITS_SYSTEM_KEY);
  return isUnitsSystem(stored) ? stored : fallback;
}

export function setUnitsSystem(system: UnitsSystem): void {
  storage.set(UNITS_SYSTEM_KEY, system);
}

/**
 * The one action the last onboarding slide takes: persist the slide-2 units
 * choice and mark onboarding done, together — so there's no window where
 * one is saved without the other (see App.tsx: it re-checks
 * isOnboardingCompleted() to decide whether to render onboarding at all).
 */
export function completeOnboarding(unitsSystem: UnitsSystem): void {
  setUnitsSystem(unitsSystem);
  storage.set(ONBOARDING_COMPLETED_KEY, true);
}
