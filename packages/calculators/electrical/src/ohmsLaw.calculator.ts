import type { CalculatorDef } from '@calc/engine';
import { solveOhmsLaw, type OhmsLawInputs, type OhmsLawOutputs } from './ohmsLaw';

/**
 * IMPORTANT about the field roles below: voltage/current/resistance/power
 * are all marked role: 'input', even though for any given calculation two
 * of them are actually "output" (computed by solveOhmsLaw). This is the
 * only calculator in the MVP with dynamic roles — the static schema
 * (role: input|output) wasn't designed for this.
 *
 * The fix: we do NOT change the FieldDef type just for one calculator. The
 * UI renderer already tracks two states — "raw user input" (before compute)
 * and "result" (after compute). By diffing these two states, the renderer
 * itself figures out which fields were set by the user (echo as input) and
 * which were computed (show as a ResultCard) — that's the UI layer's job,
 * the engine doesn't know about it (see principle 5.2: "the engine doesn't
 * know about React Native at all").
 */
export const ohmsLaw: CalculatorDef<OhmsLawInputs, OhmsLawOutputs> = {
  id: 'ohms_law',
  titleKey: 'calc.ohmsLaw.title',
  descriptionKey: 'calc.ohmsLaw.desc',
  // category is the grouping section on Home ('Electrical Fundamentals' in
  // the screenshot), not the whole domain. The domain is already determined
  // by this file living in @calc/calculators-electrical — no need to
  // duplicate it in category. Convention for electrical-domain sections:
  // fundamentals / cable-wiring / motors-drives / protection-coordination.
  category: 'fundamentals',
  tier: 'free',
  fields: [
    {
      id: 'system',
      labelKey: 'field.system',
      quantity: 'dimensionless',
      role: 'input',
      options: [
        { value: 'dc', labelKey: 'system.dc' },
        { value: '1ph', labelKey: 'system.1ph' },
        { value: '3ph', labelKey: 'system.3ph' },
      ],
    },
    { id: 'voltage', labelKey: 'field.voltage', symbol: 'U', quantity: 'voltage', role: 'input', defaultUnit: 'V' },
    { id: 'current', labelKey: 'field.current', symbol: 'I', quantity: 'current', role: 'input', defaultUnit: 'A' },
    {
      id: 'resistance',
      // DC: active resistance (R). AC: impedance magnitude (Z), but
      // physically the same field — see the 3-Phase screenshots decision.
      labelKey: (v) => (v.system === 'dc' ? 'field.resistance' : 'field.impedance'),
      symbol: (v) => (v.system === 'dc' ? 'R' : 'Z'),
      quantity: 'resistance',
      role: 'input',
      defaultUnit: 'ohm',
    },
    { id: 'power', labelKey: 'field.power', symbol: 'P', quantity: 'power', role: 'input', defaultUnit: 'W' },
    {
      id: 'cosPhi',
      labelKey: 'field.cosPhi',
      symbol: 'cosφ',
      quantity: 'dimensionless',
      role: 'input',
      defaultUnit: 'unit',
      validation: { min: 0.01, max: 1 },
      visibleIf: (v) => v.system !== 'dc',
    },
  ],
  validate: (inputs) => {
    // Same field set for DC and AC now, since Z is a full-fledged 4th
    // quantity of the AC matrix (AC used to check only 3 of {U,I,P}).
    const relevant = ['voltage', 'current', 'resistance', 'power'] as const;
    const knownCount = relevant.filter((k) => inputs[k] !== undefined).length;
    return knownCount === 2 ? null : ['error.needExactlyTwoValues'];
  },
  compute: (inputs) => solveOhmsLaw(inputs),
  warnings: (_inputs, outputs) => {
    const hasNaN = Object.values(outputs).some((v) => typeof v === 'number' && Number.isNaN(v));
    return hasNaN ? ['warn.divisionByZero'] : [];
  },
  references: ["Ohm's law, IEC 60050-131"],
  // Same 4 fields as validate()'s "exactly 2 of 4" check above — this is
  // what lets the UI show the "N of 2 filled" hint and evict the oldest
  // field on a 3rd input, generically, without ohms_law-specific UI code.
  dynamicRoleFieldIds: ['voltage', 'current', 'resistance', 'power'],
  formulaKeys: (v) => {
    if (v.system === 'dc') return ['formula.ohmsLaw.dc1', 'formula.ohmsLaw.dc2', 'formula.ohmsLaw.dc3'];
    if (v.system === '3ph') return ['formula.ohmsLaw.3ph1', 'formula.ohmsLaw.3ph2', 'formula.ohmsLaw.3ph3'];
    return ['formula.ohmsLaw.1ph1', 'formula.ohmsLaw.1ph2', 'formula.ohmsLaw.1ph3'];
  },
};
