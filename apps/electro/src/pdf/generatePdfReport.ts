import { Platform } from 'react-native';
import { generatePDF } from 'react-native-html-to-pdf';
import Share from 'react-native-share';
import type { CalculatorDef, Values } from '@calc/engine';
import { buildFieldCardStates } from '@calc/ui';
import { formatFieldForHistory } from '../state/useCalculatorState';
import { buildReportHtml } from './buildReportHtml';

export interface GeneratePdfReportParams {
  calculator: CalculatorDef;
  values: Values;
  outputs: Values;
  resolveLabel: (key: string) => string;
  language: string;
  brandName: string;
  disclaimerKey: string;
}

/** Filesystem-safe stand-in for the calculator's title, used as the PDF's file name. */
function slugify(title: string): string {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'report';
}

/**
 * Builds the report HTML, converts it to a PDF (react-native-html-to-pdf,
 * offline WebView render — no network/remote resources involved) and hands
 * it to the system share sheet. Caller (CalculatorScreen) is responsible for
 * the Pro gate — this assumes the caller already decided the user is
 * entitled to generate a report.
 */
export async function generatePdfReport({
  calculator,
  values,
  outputs,
  resolveLabel,
  language,
  brandName,
  disclaimerKey,
}: GeneratePdfReportParams): Promise<void> {
  const mergedValues: Values = { ...values, ...outputs };

  // Static field.role isn't enough on its own — ohms_law marks all 4 of
  // voltage/current/resistance/power as role: 'input' and relies on the UI
  // layer to diff rawInputs vs outputs to see which 2 were actually typed
  // vs computed (see ohmsLaw.calculator.ts's docstring). buildFieldCardStates
  // is that same diffing logic already used by CalculatorForm — reusing it
  // here instead of re-deriving from role keeps this correct for that
  // calculator too, not just the ones with static roles.
  const fieldStates = buildFieldCardStates(calculator.fields, values, outputs);

  const inputs = calculator.fields
    .filter((field) => fieldStates[field.id] === 'given')
    .map((field) => formatFieldForHistory(field, mergedValues, resolveLabel));

  const reportOutputs = calculator.fields
    .filter((field) => fieldStates[field.id] === 'calculated')
    .map((field) => formatFieldForHistory(field, mergedValues, resolveLabel));

  const formattedDate = new Intl.DateTimeFormat(language, { dateStyle: 'medium', timeStyle: 'short' }).format(
    new Date(),
  );

  const html = buildReportHtml({
    brandName,
    calculatorTitle: resolveLabel(calculator.titleKey),
    formulaLines: calculator.formulaKeys?.(values).map(resolveLabel) ?? [],
    inputs,
    outputs: reportOutputs,
    inputsHeading: resolveLabel('pdf.inputsHeading'),
    outputsHeading: resolveLabel('pdf.outputsHeading'),
    generatedOnLabel: `${resolveLabel('pdf.generatedOn')} ${formattedDate}`,
    disclaimer: resolveLabel(disclaimerKey),
  });

  const fileName = `${slugify(resolveLabel(calculator.titleKey))}-${Date.now()}`;

  // iOS: the module's default (no `directory`) writes to NSTemporaryDirectory(),
  // which the share sheet's out-of-process extensions (Quick Look preview,
  // "Save to Files", ...) can't reliably read — some targets silently no-op,
  // others crash. 'Documents' is the one custom value react-native-html-to-pdf
  // honors on iOS, and it's a stable, shareable location.
  // Android: leave the default (app cache dir) alone — react-native-share's
  // bundled FileProvider config only maps a cache-dir root and a
  // Download/ external-storage root, not getExternalFilesDir()/Documents, so
  // requesting 'Documents' there would break FileProvider resolution instead.
  const { filePath } = await generatePDF({
    html,
    fileName,
    base64: false,
    ...(Platform.OS === 'ios' ? { directory: 'Documents' } : {}),
  });

  await Share.open({
    url: `file://${filePath}`,
    type: 'application/pdf',
    filename: fileName,
    // A user backing out of the share sheet isn't an error worth surfacing.
    failOnCancel: false,
  });
}
