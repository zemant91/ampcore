# Power factor, PF correction, transformer rating, short-circuit, earth loop

Five calculators added together. Tiers: `power_factor` free, the rest Pro.
Everything below is a *simplified design estimate* (the app's disclaimer applies) —
the assumptions are listed so they can be reviewed.

| Calculator | Method | Assumptions worth knowing |
|---|---|---|
| `power_factor` | power triangle, any 2 of P/Q/S/cosφ (same `dynamicRoleFieldIds` mechanism as `ohms_law`) | Q is a magnitude (no capacitive sign) |
| `pf_correction` | Qc = P·(tanφ₁ − tanφ₂) | target ≤ present -> Qc = 0 with an info note; no capacitor-bank step sizes, no voltage/capacitance |
| `transformer_rating` | S = P/cosφ·(1 + reserve), smallest standard kVA ≥ S, rated currents | kVA list in `packages/data/src/tables/transformers.ts` is a common-practice R10-based series (10–2500 kVA), **not quoted from the standard text** |
| `short_circuit` | IEC 60909-0: Ik″ = c·Un/(√3·Zk) | c = 1.05 (LV, tolerance ≤ 6 %); transformer purely reactive (ur = 0, slightly conservative) with KT = 0.95·c/(1 + 0.6·xT); grid optional (ZQ = c·Un²/S″kQ, XQ = 0.995·ZQ, RQ = 0.1·XQ), omitted = infinitely strong; cable R at 20 °C (max Ik), fixed X = 0.08 Ω/km; symmetrical 3-phase fault only (no Ik1/Ik2, no peak current) |
| `earth_loop` | TN automatic disconnection: Zs = Ze + ρ·L·(1/S + 1/Spe) ≤ U0/Ia, Ia = m·In, m = 5/10/20 for B/C/D (upper instantaneous-trip limit, IEC 60898-1) | resistance only (no reactance); ρ at the chosen conductor temperature, so no extra 0.8 / 2⁄3 factor is applied; Ze is optional (blank = 0) |

## New quantities / units (`@calc/engine`)
`apparentPower` (VA, kVA, MVA) and `reactivePower` (var, kvar) are separate from
`power` so a field can never offer the wrong unit; `current` gained `kA`.
`@calc/data`: `transformers/standard-kva`, `breakers/trip-multiple`.

## Chains
power factor -> PF correction / transformer rating; transformer rating -> short-circuit
(uk suggested 4 % up to 630 kVA, 6 % above — an editable starting point, not a
nameplate value); cable sizing -> earth loop (U0 = line voltage/√3 on 3-phase, none for DC);
breaker selection -> earth loop (In).

`__tests__/newCalculators.test.ts` holds hand-checked values;
`apps/electro/src/i18n/__tests__/calculatorKeys.test.ts` asserts every key a
calculator declares exists in the locale files.
