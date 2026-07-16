interface FeedbackContext {
  supportEmail: string;
  appVersion: string;
  os: string; // Platform.OS
  osVersion: string; // String(Platform.Version)
  calculatorTitle?: string; // optional — if invoked from a specific calculator screen
  calculatorValues?: Record<string, string | number | undefined>; // current entered values
}

/**
 * Plain mailto: link, not a form post — the native mail client opens with
 * this prefilled, and the user still sees/edits/sends it themselves.
 * encodeURIComponent runs once over the fully-assembled subject/body (not
 * per line) — encoding each line separately would double-encode the '&'
 * and '?' the join introduces, and RN's Linking.openURL is sensitive to that.
 */
export function buildFeedbackMailtoUrl(ctx: FeedbackContext): string {
  const subject = ctx.calculatorTitle
    ? `ElectroCalc EU — issue with ${ctx.calculatorTitle}`
    : 'ElectroCalc EU feedback';

  const contextLines = [
    '---',
    `App version: ${ctx.appVersion}`,
    `OS: ${ctx.os} ${ctx.osVersion}`,
  ];

  if (ctx.calculatorTitle) {
    contextLines.push(`Calculator: ${ctx.calculatorTitle}`);
  }

  if (ctx.calculatorValues) {
    for (const [key, value] of Object.entries(ctx.calculatorValues)) {
      if (value === undefined) continue;
      contextLines.push(`  ${key}: ${value}`);
    }
  }

  const body = ['Describe the issue here:', '', '', ...contextLines].join('\n');

  return `mailto:${ctx.supportEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
