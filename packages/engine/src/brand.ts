import type { CalculatorDef } from './types';

export type UnitsSystem = 'metric' | 'imperial';
/**
 * 'technical' — symbolic labels (U, I, Z) + formula chips up top, a field-
 * oriented UI for professionals (electro/plumb/solar in the MVP).
 * 'plain' — spelled-out labels without symbols, formula chips hidden. Not
 * used by any brand yet, but section 3 of the master plan (#4, DIY app)
 * explicitly describes a non-professional audience — once it shows up, this
 * won't be solved by forking components, just by switching one enum.
 */
export type DisclosureLevel = 'technical' | 'plain';

export interface BrandTheme {
  /** The only mandatory visual token. See brand.md for the rationale — don't multiply tokens without a confirmed need (principle 5, master plan section 10). */
  accent: string; // hex
}

export interface UpcomingCalculator {
  id: string;
  titleKey: string;
  descriptionKey: string;
  /** Same category as real CalculatorDef entries — so it lands in the same Home section */
  category: string;
  icon: string;
}

export interface BrandConfig {
  /** Must match the native BRAND/applicationId — see the runtime assert in implementation-plan.md, risk #4 */
  id: string;
  displayName: string;
  theme: BrandTheme;
  /**
   * Explicit list of this app's calculators — direct imports from specific
   * domain packages (`@calc/calculators-electrical` etc.), NOT a barrel
   * re-export of the whole domain. This list is exactly what determines
   * bundle weight and the white-label boundary (see the barrel-export risk).
   */
  calculators: CalculatorDef[];
  /**
   * "SOON" cards on Home. NOT a CalculatorDef — that requires compute(),
   * and there's by definition nothing to compute here. A separate
   * lightweight type on purpose, so nobody's tempted to make a CalculatorDef
   * with a fake compute() just for a marketing card.
   */
  upcoming?: UpcomingCalculator[];
  defaultUnitsSystem: UnitsSystem;
  disclosureLevel: DisclosureLevel;
  /**
   * legalDisclaimerKey replaces the old legalDisclaimer: Record<Locale,string>
   * field. That was out of sync with the rest of the schema: everywhere
   * else — an i18n key (titleKey, labelKey...), here it was raw text sitting
   * directly in BrandConfig. Now it's a key; the actual text lives in the
   * i18next resource files (en.ts/pl.ts/de.ts/...).
   */
  legalDisclaimerKey: string;
  /** Content for onboarding — only what's actually brand-specific (slide 1) */
  onboarding: {
    welcomeTitleKey: string;
    welcomeBodyKey: string;
  };
  paywall: {
    /** i18n keys for paywall bullets — brand-specific, while the products (pro_monthly/pro_lifetime) are shared */
    valueProps: string[];
  };
  /** Destination for the "send feedback" mailto: link on the More screen (and the optional per-calculator report-issue entry point) */
  supportEmail: string;
}
