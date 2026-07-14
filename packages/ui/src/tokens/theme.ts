/**
 * Tokens from Prompt 0 (calc-suite-design-prompts.md), as code. The only
 * thing overridden per brand is accent (from BrandConfig.theme.accent).
 * Everything else here is shared across electro/plumb/solar on purpose —
 * master plan section 10, principle 5: abstract on the second real case,
 * not ahead of time. Until there's a second brand with a real reason to
 * have a different background or typography, those fields won't be here.
 */
export const colors = {
  background: '#0C1420',
  cardSurface: '#1A2030',
  cardBorderMuted: '#2A3142',
  textPrimary: '#E8EAF0',
  textSecondary: '#8B93A7',
  warning: '#E0A030',
  danger: '#E05252',
  /**
   * Added while porting ElectroCalc (plan Phase 5): the one missing
   * cross-brand tone. In the web prototype, Banner has exactly two variants
   * — warn (red) and info (this blue, `#6AA0DC`) — and info is already used
   * by two calculators (voltage_drop, cable_sizing) for notes like
   * "reactance not accounted for" (not an error, not a warning, just
   * context) — that clears the "second occurrence" bar from principle 5.
   */
  info: '#6AA0DC',
} as const;

export const typography = {
  /** UI chrome: labels, captions, buttons, disclaimers */
  uiFontFamily: 'Inter',
  /** All numbers and all formula chips, no exceptions — see Prompt 0 */
  monoFontFamily: 'JetBrains Mono',
} as const;

export const layout = {
  cardRadius: 20,
  /** 76px — sized for working with gloves on, doesn't shrink on dense screens (Cable Sizing) */
  minFieldHeight: 76,
  spacingUnit: 8,
} as const;

export interface ThemeTokens {
  colors: typeof colors;
  typography: typeof typography;
  layout: typeof layout;
  /** The only token that actually comes from BrandConfig.theme.accent */
  accent: string;
}

export function buildTheme(accent: string): ThemeTokens {
  return { colors, typography, layout, accent };
}
