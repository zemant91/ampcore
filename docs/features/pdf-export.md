# PDF report export

**App:** `apps/electro` (AmpCore) · **Status:** shipped · **Tier:** Pro-only

## What it does

A header button on the calculator screen (`CalculatorScreenTemplate`'s
`onGeneratePdf`/`generatePdfIcon` props, next to report-issue/history) —
visible once a calculation has a result — generates a one-page PDF report
(calculator title, formula, inputs, results, brand name, generation date,
the app's legal disclaimer) and hands it to the system share sheet.

This was already promised to users before it existed: `paywall.pdfExport`
in the paywall's value props, and a disabled `ComingSoonRow` in `MenuScreen`
for `ui.menu.exportPdf`. This feature implements the calculator-screen path;
the `MenuScreen` row is intentionally left as a "coming soon" placeholder
(see Limitations below).

## Key files

- `apps/electro/src/pdf/buildReportHtml.ts` — pure HTML string builder, no
  RN/i18n dependency (all strings arrive pre-resolved), easy to unit-test.
- `apps/electro/src/pdf/generatePdfReport.ts` — assembles report data from a
  `CalculatorDef`/`values`/`outputs`, converts via `react-native-html-to-pdf`,
  shares via `react-native-share`.
- `packages/ui/src/organisms/CalculatorScreenTemplate.tsx` — the header
  button itself (`onGeneratePdf`/`generatePdfIcon` props).
- `apps/electro/src/screens/CalculatorScreen.tsx` — wires the button to
  `useEntitlement().isPro`; non-Pro users are routed to the Paywall screen
  instead of generating anything.

## Non-obvious decisions / gotchas

- **Inputs vs. results aren't just `field.role`.** `ohms_law` marks all of
  voltage/current/resistance/power as `role: 'input'` and relies on a
  UI-layer diff (which fields came from the user vs. from `compute()`) to
  tell them apart — see the docstring in `ohmsLaw.calculator.ts`. The report
  reuses `buildFieldCardStates` (from `@calc/ui`, the same utility
  `CalculatorForm` uses to render the screen) instead of re-deriving that
  diff — filtering by `role` alone silently produced an empty Results
  section for this calculator.
- **iOS: `directory: 'Documents'`, not the module's default.** With no
  `directory` option, `react-native-html-to-pdf` writes to
  `NSTemporaryDirectory()`. Sharing straight out of `tmp` is unreliable — the
  share sheet's out-of-process extensions (Quick Look preview, "Save to
  Files", ...) don't reliably have access to it: some targets silently
  no-op, others crash. `'Documents'` is the one custom value the module
  honors on iOS and is a stable, shareable location.
- **Android: do NOT set `directory` at all.** `react-native-share` ships its
  own `FileProvider` config (`share_download_paths.xml`) that maps the app's
  cache dir (`<cache-path path="/" />`) and `Environment` `Download/` — not
  `getExternalFilesDir()/Documents`. Requesting `'Documents'` there breaks
  `FileProvider` resolution instead of fixing anything; the module's default
  (cache dir) is already covered.
- **Native modules need jest mocks to run tests at all.** Both packages
  contain native/TurboModule code that throws under Jest
  (`TurboModuleRegistry.getEnforcing` fails) unless mocked. Manual mocks live
  at `apps/electro/__mocks__/react-native-html-to-pdf.js` and
  `react-native-share.js` (Jest auto-applies mocks placed in a `__mocks__`
  folder next to `node_modules` for node_modules packages — no `jest.mock()`
  call needed), following the same pattern as the existing
  `react-native-purchases(-ui).js` mocks.

## Limitations (not implemented)

- **No PDF export from History.** `HistoryEntry` (`apps/electro/src/lib/history.ts`)
  only stores the primary output field per past calculation, not every
  output — generating a full report from a history entry would need a
  storage format migration. Out of scope for now; the header button only
  works from a live calculator screen where all outputs are in memory.
- `MenuScreen`'s `ui.menu.exportPdf` row is still a disabled `ComingSoonRow`
  by design — kept as non-Pro marketing surface rather than wired to
  anything, since it has no single calculator's result to export.
