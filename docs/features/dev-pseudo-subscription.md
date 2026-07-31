# Dev pseudo-subscription toggle

**App:** `apps/electro` (AmpCore) · **Status:** shipped · **Scope:** `__DEV__` only

## What it does

A floating button (bottom-right, visible on every screen) that opens a small
sheet with three options — **Real** / **Force Pro** / **Force Free** — to
override the RevenueCat-derived Pro entitlement for testing, without a real
sandbox purchase. Lets Pro-gated features (PDF export, cable-sizing chain,
unlimited history) be exercised on a plain dev build.

Never renders in a release build: the button component itself checks
`__DEV__` and returns `null` otherwise (same guard already used in
`initPurchases.ts`) — belt-and-suspenders, since nothing outside a dev build
can ever set the override in the first place.

## Key files

- `apps/electro/src/dev/DevMenuButton.tsx` — the floating button + sheet.
- `apps/electro/src/subscriptions/EntitlementProvider.tsx` — `isPro` is now
  `__DEV__ && devProOverride !== null ? devProOverride : realIsPro`; the
  context also exposes `devProOverride`/`setDevProOverride` alongside the
  existing `isPro`/`loading`. Existing consumers (`HomeScreen`,
  `CalculatorScreen`, `PaywallScreen`) are unaffected — they only destructure
  `isPro`.
- `apps/electro/src/subscriptions/entitlementCache.ts` — `getDevProOverride`/
  `setDevProOverride`, MMKV-backed, next to the existing
  `getCachedIsPro`/`setCachedIsPro`. `null` means "no override, use the real
  entitlement" (distinct from a stored `false`, hence `storage.contains(...)`
  rather than a `getBoolean(...) ?? false` default).
- `apps/electro/App.tsx` — renders `<DevMenuButton />` as a sibling to
  `RootNavigator`/`OnboardingScreen`, inside `EntitlementProvider`.

## Non-obvious decisions

- **Persisted in MMKV, not just component state.** A dev build reloads
  constantly (Fast Refresh, manual reload); in-memory state would reset the
  override on every reload, which defeats the point of a "leave it on Force
  Pro while I keep iterating" workflow. The override survives reloads and
  app relaunches until explicitly reset to "Real".
- **Not persisted forever by intent** — it's a per-device debug flag, not a
  feature flag system. No expiry/TTL; if a stale override ever causes
  confusing behavior on a dev device, reset it via the sheet's "Real" option.
