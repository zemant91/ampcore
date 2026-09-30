/**
 * Base physical quantities the calculators operate on.
 * Determines which units are available for a field (see units.ts).
 */
export type Quantity =
  | 'voltage'
  | 'current'
  | 'power'
  | 'resistance'
  | 'length'
  | 'area'
  | 'temperature'
  | 'time'
  | 'dimensionless';

export type Tier = 'free' | 'pro';

/**
 * Calculator field values in base SI units.
 * UI-unit <-> base conversion happens at the renderer boundary (units.ts), not here.
 */
export type Values = Record<string, number | string | undefined>;

export interface FieldOption {
  value: string | number;
  labelKey: string;
  /** Longer explanation shown in a details sheet (e.g. SegmentedControl's "?" trigger) — set only where the short label needs disambiguation */
  descriptionKey?: string;
}

export interface FieldValidation {
  min?: number;
  max?: number;
}

export interface FieldDef {
  id: string;
  /**
   * Usually a static i18n key. A function is the rare case where the label
   * depends on other fields (e.g. "RESISTANCE" in DC vs "IMPEDANCE" in AC
   * for the same physical field — see ohmsLaw.calculator.ts).
   */
  labelKey: string | ((values: Values) => string);
  /**
   * Physical symbol (U, I, Z...) for the "technical" two-line label style
   * (symbol + all-caps caption). Optional: not every field has a commonly
   * accepted single-letter symbol (e.g. "number of conductors").
   */
  symbol?: string | ((values: Values) => string);
  quantity: Quantity;
  defaultUnit?: string;
  role: 'input' | 'output';
  validation?: FieldValidation;
  options?: FieldOption[];
  /** Show the field only when a condition holds (e.g. cosφ — AC only) */
  visibleIf?: (values: Values) => boolean;
}

export type WarningKey = string;

/**
 * Access to versioned reference data (IEC tables etc.).
 * compute() NEVER imports tables directly — only through this interface.
 * Gives us: (a) swapping data in tests, (b) updating tables without a release (see master plan 6.6).
 */
export interface DataAccess {
  lookup<T = number>(table: string, key: string): T;
}

export interface CalculatorDef<
  TInputs extends Values = Values,
  TOutputs extends Values = Values,
> {
  id: string;
  titleKey: string;
  /** One-line subtitle shown under the title on Home (e.g. "Solve U, I, R, P for DC and AC systems") */
  descriptionKey: string;
  category: string;
  tier: Tier;
  fields: FieldDef[];
  /**
   * Method syntax (not `compute: (inputs) => ...`) — on purpose. TS checks
   * interface methods for parameter compatibility bivariantly, not
   * contravariantly like arrow-property members under strictFunctionTypes.
   * Without this, `CalculatorDef<OhmsLawInputs, OhmsLawOutputs>` couldn't be
   * put into `CalculatorDef<Values, Values>[]` (exactly what
   * BrandConfig.calculators needs — a heterogeneous list of calculators with
   * different Inputs/Outputs). A standard TS trade-off: slightly less
   * strictness at the registry boundary so the registry can be typed at all.
   * Inside its own file, each calculator stays fully type-safe — this only
   * affects the declaration's shape.
   */
  compute(inputs: TInputs, data: DataAccess): TOutputs;
  /**
   * Cross-field validation (e.g. "fill in exactly 2 of 4 values").
   * Separate from FieldValidation, which checks a single field in isolation.
   * Returns error keys, or null if everything's fine.
   */
  validate?(inputs: TInputs): WarningKey[] | null;
  /** "Out of spec" — what separates a professional tool from a toy */
  warnings?(inputs: TInputs, outputs: TOutputs): WarningKey[];
  references?: string[];
  /**
   * Jump to another calculator, carrying part of the result along (e.g.
   * cable_sizing -> breaker_select). A property of the calculator itself,
   * not of the brand — which calculators actually exist in the app is
   * decided by BrandConfig.calculators, and chainTo just stays silent if the
   * target calculator isn't in the build.
   */
  chainTo?: {
    calculatorId: string;
    labelKey: string;
    /** `inputs` too, for values that are only ever typed (system, voltage, ...) and never appear among the outputs */
    mapOutputs(outputs: TOutputs, inputs: TInputs): Partial<Values>;
  }[];
  /**
   * Field ids among which compute() solves for any 2 of N (currently only
   * ohms_law: any 2 of {voltage, current, resistance, power} — see the
   * dynamic-roles note in ohmsLaw.calculator.ts). Everything else has static
   * input/output roles and leaves this unset. Drives two UI behaviors,
   * generically, for whichever calculator sets it: the "N of 2 filled" hint
   * banner, and evicting the oldest filled field once a 3rd gets set
   * (LRU, not a validation error — see useCalculatorState in apps/electro).
   */
  dynamicRoleFieldIds?: string[];
  /**
   * i18n keys for read-only formula chips shown above the form (e.g.
   * "U = I · R"), evaluated against current values so they can vary by mode
   * (DC vs 1-phase vs 3-phase). Omit for calculators with no canonical
   * formula worth displaying as a chip.
   */
  formulaKeys?(values: Values): string[];
}
