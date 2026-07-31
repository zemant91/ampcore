# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A pnpm-workspace monorepo for a portfolio of niche calculator apps sharing one
core: `packages/*` is the domain-agnostic foundation (engine, UI atoms, data
tables), `apps/*` are the actual React Native apps built on top of it.
Currently `apps/electro` (brand name **AmpCore**, electrical calculators —
Ohm's law, cable sizing, voltage drop, conduit fill, motor current, breaker
selection, PE conductor, kW↔A) is the only real app; `PlumbCalc EU`/`SolarCalc`
are planned future apps on the same foundation (see `README.md`'s "How to
stand up a new app on this foundation" for the exact recipe).

```
packages/
  engine/                    @calc/engine — CalculatorDef/FieldDef/BrandConfig types, unit conversion, field-label resolvers. Zero RN dependency.
  data/                      @calc/data — versioned IEC/EN reference tables (ampacity, resistivity, breaker ratings), accessed only through the DataAccess interface.
  ui/                        @calc/ui — atomic UI library (tokens/atoms/molecules/organisms) on top of design tokens. Knows nothing about a specific brand or CalculatorDef instance — brand/calculator data always arrives as props.
  calculators/electrical/    @calc/calculators-electrical — the electrical domain's CalculatorDef instances (ohms_law, cableSizing, ...).
apps/
  electro/                   AmpCore, the React Native app (bare RN, no Expo).
docs/                        Feature write-ups (English) — see docs/README.md.
```

## Commands

From the repo root:

```bash
pnpm install                              # install once, workspace-wide
pnpm build                                # build packages/* in dependency order (engine -> data/calculators-electrical -> ui)
pnpm build:watch                          # same packages, tsc --watch, all in parallel — run this while developing
pnpm typecheck                            # tsc --noEmit across packages/**/src + apps/**/src
pnpm test                                 # jest — but only picks up packages/* tests (see gotcha below)
```

Inside `apps/electro`:

```bash
npx jest                                  # this app's own tests (i18n parity, subscriptions, history formatting, ...)
npx jest src/i18n/__tests__/resources.test.ts   # a single test file
npx eslint .
npx react-native start                    # Metro
npx react-native run-ios / run-android
```

**Critical gotcha:** `apps/electro` consumes `packages/*` through their
**compiled `dist/`** output (each package's `main`/`types` point at `dist/`,
not `src/`) — Metro doesn't reliably resolve TS/JSX through pnpm's symlinked
workspace packages, so each package builds to flat JS first (see `README.md`
for the full rationale). This means **editing a file under `packages/*/src`
has no effect on the running app until that package is rebuilt.** Keep
`pnpm build:watch` running in a separate terminal during development, or
changes will silently appear stale. `dist/` is gitignored; every clone/CI
builds it locally.

The root `jest`/`tsc` commands only scan `packages/**` and `apps/**/src`
per their config's `include`/`testMatch`, but **`apps/electro`'s own test
suite must be run from inside `apps/electro`** (it has its own
`jest.config.js` using `@react-native/jest-preset`, incompatible with the
root's `ts-jest`-based config) — `pnpm test` from the root will NOT run
`apps/electro`'s tests.

## Architecture: the CalculatorDef pattern

Every calculator (Ohm's law, cable sizing, ...) is one `CalculatorDef` object
(`packages/engine/src/types.ts`) — `fields: FieldDef[]`, `compute()`,
optional `validate()`/`warnings()`/`chainTo`/`formulaKeys()`. A `BrandConfig`
(`packages/engine/src/brand.ts`) is just an explicit array of `CalculatorDef`s
plus branding (accent color, display name, paywall copy, legal disclaimer
key) — see `apps/electro/src/brand.ts` for the concrete `electro` brand.
**`calculators: CalculatorDef[]` is always a direct, explicit list of
imports from a domain package — never a barrel re-export of the whole
domain** — that list is what determines bundle weight and is the actual
white-label boundary between brands.

`apps/electro/src/screens/CalculatorScreen.tsx` is a **single generic
screen** for all calculators — `route.params.calculatorId` picks which
`CalculatorDef` to render via `CalculatorScreenTemplate`
(`packages/ui/src/organisms/`). There is deliberately no per-calculator
screen file, unlike the original web prototype (`ElectroCalc.zip` at the
repo root) that had one page per calculator.

**Field roles are usually static but not always:** a `FieldDef.role` is
`'input'` or `'output'`, but `ohms_law` is the one calculator with
`dynamicRoleFieldIds` — all four of voltage/current/resistance/power are
marked `role: 'input'` in the schema, and the UI layer determines at
render time which 2 were actually typed by the user vs. computed by
diffing raw inputs against `compute()`'s output. That diff lives in
`buildFieldCardStates` (`packages/ui/src/state/fieldCardState.ts`) —
**reuse it** whenever you need to know whether a field's value is
user-given or calculated (e.g. for a report/export); don't re-derive from
`role` alone, or dynamic-role calculators silently break.

`packages/data`'s `DataAccess` interface is the only way `compute()` may
read reference tables — never import a table directly in a calculator, so
tables can be swapped in tests or updated without touching calculator logic.

## Architecture: apps/electro specifics

- **i18n**: `apps/electro/src/i18n/resources/{en,pl,de,fr,it,es}.ts`, flat
  `Record<string, string>` keyed with dotted namespaces (`ui.menu.*`,
  `calc.*`, `field.*`, `formula.*`, `legal.*`). **English is the source of
  truth for the key set** — `src/i18n/__tests__/resources.test.ts` asserts
  every other locale has exactly en's keys (no missing, no extra, no empty
  values). Adding a UI string means adding it to all 6 files, or that test
  fails. `decimalSeparatorFor(language)` in `i18n.ts` governs `,` vs `.`
  parsing/display per locale.
- **Subscriptions (RevenueCat)**: `EntitlementProvider`
  (`src/subscriptions/EntitlementProvider.tsx`) is the single source of
  truth for `isPro`, consumed via `useEntitlement()`. RevenueCat API keys are
  read per-platform through `react-native-config`
  (`src/subscriptions/config.ts`) — Debug builds use a Test Store key,
  Release must use a real key (the SDK deliberately crashes on a test key in
  Release — see `ios/Podfile`'s `ENVFILES` / `android/app/build.gradle`).
  `PRO_ENTITLEMENT_ID` must match the RevenueCat dashboard's entitlement
  identifier exactly.
- **Dev-only Pro override**: a `__DEV__`-gated floating button
  (`src/dev/DevMenuButton.tsx`) can force `isPro` on/off (persisted in MMKV
  via `entitlementCache.ts`'s `getDevProOverride`/`setDevProOverride`) for
  exercising Pro-gated features without a real purchase — see
  `docs/features/dev-pseudo-subscription.md`.
- **History**: `src/lib/history.ts` (MMKV) auto-saves one entry per
  calculation via `useCalculatorState`'s debounced effect. `HistoryEntry`
  only stores the **primary** output field, not every output — know this
  before building anything that assumes full output data is available from
  history.
- **Persistent disclaimer footer**: `CalculatorScreenTemplate`'s
  `disclaimerKey` prop renders `BrandConfig.legalDisclaimerKey` as a
  non-scrolling footer on every calculator screen — not optional per-brand
  copy, always render it.
- **Native modules under Jest**: modules with native/TurboModule code throw
  under Jest unless mocked. Manual mocks in `apps/electro/__mocks__/*.js`
  (e.g. `react-native-purchases.js`, `react-native-html-to-pdf.js`) are
  auto-applied by Jest for node_modules packages — no `jest.mock()` call
  needed, just drop a same-named file in that folder.

## Three rules that keep packages/* from getting blurry (from README.md)

1. `packages/*` never imports from `apps/*` — only up the dependency graph.
2. `@calc/ui` never imports a specific `CalculatorDef` or `BrandConfig` —
   atoms/organisms receive data as props.
3. New logic only gets promoted into `packages/*` when a second real case
   demands it (a second brand, a second calculator) — not ahead of time.

## Docs

`docs/README.md` indexes feature write-ups (English, one file per
feature/topic) for non-obvious decisions and constraints — check there
before re-deriving context this file doesn't cover in depth.
