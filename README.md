# calc-suite — shared foundation (shared packages)

This is **not the whole project**, just `packages/*` — the parts reused
across all future apps (ElectroCalc EU, PlumbCalc EU, SolarCalc).
Specific apps (`apps/electro` etc.) are deliberately not included here —
that's the next step, done on top of this foundation separately for each
app. For a detailed breakdown of what's inside and why, see `calc-suite-structure.md`.

## Structure

```
calc-suite/
├── packages/
│   ├── engine/                    # @calc/engine — types, units, BrandConfig, resolvers
│   ├── ui/                        # @calc/ui — atomic UI library (tokens/state/atoms/molecules)
│   └── calculators/
│       └── electrical/            # @calc/calculators-electrical — ohms_law
├── jest.config.js
├── tsconfig.base.json / tsconfig.json
└── pnpm-workspace.yaml            # already includes the "apps/*" pattern — ahead of time, for your future apps/
```

## Running it

```bash
npm install   # verified this way in the sandbox; in production — pnpm install
npx jest                          # 34 tests, all green
npx tsc --noEmit -p tsconfig.json # typecheck the whole foundation
```

Verified to be self-contained: this archive builds and passes tests without a
single reference to `apps/electro` — the boundary between "shared" and
"specific app" is real, not just declared.

---

## How Metro sees these packages from an app

**An important decision that changed along the way:** originally, each
package's `main`/`types` pointed straight at `src/index.ts` — simple, no
build step, but it ran into a real problem: Metro doesn't reliably resolve
TS/JSX through pnpm symlinks (workspace packages in pnpm are always
symlinks, regardless of `node-linker=hoisted` in `.npmrc` — that only
affects third-party dependencies).

Now each package's `main`/`types` point at `dist/` — the built, flat JS.
Metro resolves a symlink to a `.js` file noticeably more reliably than to a
`.ts` file with a JSX transform across a package boundary. Verified in this
sandbox with an end-to-end `require()` through the symlink, not just by
type-checking.

**Build order matters** — `@calc/ui` and `@calc/calculators-electrical`
resolve `@calc/engine` through its `dist/*.d.ts`, so engine has to build
first:

```bash
pnpm -r run build          # pnpm builds the topological order itself from
                            # the dependencies in package.json — engine builds
                            # before ui/calculators-electrical automatically
```

For development — `build:watch` in each package (the same approach you
already used in `react-native-mobile-control` — several parallel processes
instead of one):

```bash
# the first build must be sequential (see above), then:
pnpm -r --parallel run build:watch   # in one terminal, all packages at once
# and separately, in apps/electro:
npx react-native start
```

The Metro config (`apps/electro/metro.config.js`) still needs to be able to
resolve symlinks either way — `resolver.unstable_enableSymlinks: true` +
`mergeConfig(getDefaultConfig(...), ...)` — building to dist doesn't remove
that requirement, it just makes it noticeably less fragile, because it now
resolves already-built JS instead of running a TS transform across a
package boundary.

`dist/` is in `.gitignore`, not committed — every developer/CI builds it
locally.

---

## How to stand up a new app on this foundation

`pnpm-workspace.yaml` already contains the `apps/*` pattern, so a new folder
gets picked up automatically. The recipe (what we already did for electro —
repeats identically for plumb/solar, or for finishing electro):

**1. `apps/<name>/package.json`**
```json
{
  "name": "<name>calc-eu",
  "version": "0.0.1",
  "private": true,
  "dependencies": {
    "@calc/engine": "workspace:*",
    "@calc/ui": "workspace:*",
    "@calc/calculators-<domain>": "workspace:*"
  }
}
```

**2. `apps/<name>/src/brand.ts`** — a literal `BrandConfig`, not via an alias:
```typescript
import type { BrandConfig } from '@calc/engine';
import { /* domain calculators */ } from '@calc/calculators-<domain>';

export const <name>: BrandConfig = {
  id: '<name>',
  displayName: '<Name>Calc EU',
  theme: { accent: '#...' },       // the only mandatory visual token
  calculators: [/* an explicit list, not a barrel import of the domain */],
  upcoming: [],
  defaultUnitsSystem: 'metric',
  disclosureLevel: 'technical',
  legalDisclaimer: { en: '...', pl: '...' },
  paywall: { valueProps: [] },
};
```

**3. `apps/<name>/src/App.tsx`** — until `@calc/ui` has an organism/template
level, an honest stub:
```typescript
import { <name> } from './brand';
export default function App(): null {
  void <name>;
  return null;
}
```

**4. Locally (not in this sandbox — needs Xcode/Android SDK):**
```bash
npx react-native init <Name>Calc
# add to apps/<name>/package.json: react, react-native
# add the workspace dependencies from step 1
```

From there — regular development inside `apps/<name>`, with live access to
all of `packages/*` through the pnpm workspace (edit `@calc/engine` — both
apps see the change on the next build, no publishing, no copying).

## What's needed before a second app

- **`organisms`/`templates` in `@calc/ui`** — `CalculatorForm`, `CalculatorScreenTemplate`.
  Right now there are only atoms/molecules (`FieldCard`, `Chip`, `SegmentedControl`) —
  enough to lock in the pattern, but a screen hasn't been assembled from them yet.
- **`packages/data`** — versioned reference tables (`resistivity`,
  `ampacity-iec` etc.) — not needed by `ohms_law`, but will be needed for `voltage_drop`/`cable_sizing`.

## Three rules that keep the foundation from getting blurry

1. `packages/*` never imports from `apps/*` — only up the dependency graph.
2. `@calc/ui` never imports a specific `CalculatorDef` or `BrandConfig` —
   atoms receive data as props.
3. New logic only gets promoted into `packages/*` when a second real case
   demands it (a second brand, a second calculator), not ahead of time.
