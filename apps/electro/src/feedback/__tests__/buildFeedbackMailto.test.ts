import { buildFeedbackMailtoUrl } from '../buildFeedbackMailto';

const baseCtx = {
  supportEmail: 'feedback@electrocalc.eu',
  appVersion: '1.2.3',
  os: 'ios',
  osVersion: '17.4',
};

describe('buildFeedbackMailtoUrl', () => {
  test('starts with mailto: and the support address', () => {
    const url = buildFeedbackMailtoUrl(baseCtx);
    expect(url.startsWith('mailto:feedback@electrocalc.eu?')).toBe(true);
  });

  test('subject is generic without a calculatorTitle', () => {
    const url = buildFeedbackMailtoUrl(baseCtx);
    const subject = new URLSearchParams(url.split('?')[1]).get('subject');
    expect(subject).toBe('ElectroCalc EU feedback');
  });

  test('subject names the calculator when calculatorTitle is set', () => {
    const url = buildFeedbackMailtoUrl({ ...baseCtx, calculatorTitle: 'Voltage Drop' });
    const subject = new URLSearchParams(url.split('?')[1]).get('subject');
    expect(subject).toBe('ElectroCalc EU — issue with Voltage Drop');
  });

  test('body contains app version and OS', () => {
    const url = buildFeedbackMailtoUrl(baseCtx);
    const body = new URLSearchParams(url.split('?')[1]).get('body') ?? '';
    expect(body).toContain('App version: 1.2.3');
    expect(body).toContain('OS: ios 17.4');
  });

  test('body includes calculator values when provided', () => {
    const url = buildFeedbackMailtoUrl({
      ...baseCtx,
      calculatorTitle: 'Voltage Drop',
      calculatorValues: { voltage: 230, current: undefined, length: '15' },
    });
    const body = new URLSearchParams(url.split('?')[1]).get('body') ?? '';
    expect(body).toContain('voltage: 230');
    expect(body).toContain('length: 15');
    expect(body).not.toContain('current:');
  });

  test('special characters (newline, &, ?) in subject/body are encoded and do not break the mailto structure', () => {
    const url = buildFeedbackMailtoUrl({
      ...baseCtx,
      calculatorTitle: 'A & B? Cable',
    });

    // Exactly one '?' (query separator) and one '&' (param separator) appear unencoded.
    expect(url.indexOf('?')).toBe(url.lastIndexOf('?'));
    expect((url.match(/&/g) ?? []).length).toBe(1);

    const params = new URLSearchParams(url.split('?')[1]);
    expect(params.get('subject')).toBe('ElectroCalc EU — issue with A & B? Cable');
    expect(params.get('body')).toContain('\n');
  });
});
