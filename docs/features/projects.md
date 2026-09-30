# Projects

Pro-gated named folders of saved calculations ("Garage panel": motor current ->
cable sizing -> breaker), with one combined PDF. Variant 1 of the idea: steps are
linked only by the existing `chainTo` buttons — there is no auto-recalculation
down the chain.

## Model and storage

`src/lib/projects.ts`, MMKV key `electrocalc_projects`. A `ProjectStep` stores
both the **raw `values`** (so the step can be reopened and edited) and a
`CalculationSnapshot` (display strings for the list and the PDF, same shape as
history). Limits: 50 projects, 30 steps per project; overwriting an existing
step is allowed even when full.

## Flow

- Entry: Menu -> "Projects" (non-Pro users go to the Paywall instead). The
  calculator's "Add to project" button is gated the same way.
- Calculator route params `projectId` / `stepId`: a screen *bound* to a project
  saves straight into it; with a `stepId` it **overwrites** that step, without
  one it appends and then binds itself to the new step (`navigation.setParams`).
- Inside a project, pressing a `chainTo` button first saves the current step and
  opens the next calculator already bound to the same project.
- Why Pro for everything (not "1 free project"): a free quota can't be enforced
  — it lives in local MMKV, so reinstalling resets it.

## Chains between calculators

`CalculatorDef.chainTo[].mapOutputs(outputs, inputs)` — the second argument
exists because typed-only values (system, voltage, length) never show up among
the outputs. Current links: kW<->A -> cable sizing, motor current -> cable sizing
/ breaker, cable sizing -> voltage drop / breaker (`__tests__/chainTo.test.ts`).
Cable sizing -> voltage drop sets the conductor temperature from the insulation
(PVC 70 °C, XLPE 90 °C, i.e. worst case). `onChainTo` sends free users to the
Paywall when the target is a Pro calculator — Pro locking otherwise lives on Home only.

## PDF

`buildProjectReportHtml` / `generateProjectPdfReport` (`src/pdf`) reuse the
single-report blocks and styles; one disclaimer at the end of the document. The
share/file part of `generatePdfReport.ts` was extracted into `sharePdf`.

## Not done (on purpose)

Project rename, auto-recalculation through the chain (would need an
output->input graph in `@calc/engine` — only worth it if users ask), sync/export.
