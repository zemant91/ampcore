import { en } from './en';

/**
 * The single point that resolves labelKey/titleKey/WarningKey -> text.
 * English only for now (see the porting plan) — but all the other code
 * already receives the resolver as a prop (SegmentedControl, CalculatorForm,
 * CalculatorScreenTemplate), so adding a locale parameter here later won't
 * require touching @calc/ui.
 */
export function resolveLabel(key: string): string {
  return en[key] ?? key;
}
