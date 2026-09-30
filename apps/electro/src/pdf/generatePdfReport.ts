import { Platform } from 'react-native';
import { generatePDF } from 'react-native-html-to-pdf';
import Share from 'react-native-share';
import type { CalculationSnapshot } from '../state/buildCalculationSnapshot';
import type { Project } from '../lib/projects';
import { buildProjectReportHtml, buildReportHtml } from './buildReportHtml';

export interface GeneratePdfReportParams {
  calculatorTitle: string;
  snapshot: CalculationSnapshot;
  /** When the calculation was done (history entries) — defaults to now */
  calculatedAt?: number;
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
 * it to the system share sheet. Caller is responsible for the Pro gate —
 * this assumes the caller already decided the user is entitled to generate
 * a report. Takes a pre-built snapshot so the live calculator screen and
 * History entries share one path.
 */
export async function generatePdfReport({
  calculatorTitle,
  snapshot,
  calculatedAt,
  resolveLabel,
  language,
  brandName,
  disclaimerKey,
}: GeneratePdfReportParams): Promise<void> {
  const format = (ts: number) =>
    new Intl.DateTimeFormat(language, { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(ts));

  const html = buildReportHtml({
    brandName,
    calculatorTitle,
    ...snapshot,
    inputsHeading: resolveLabel('pdf.inputsHeading'),
    outputsHeading: resolveLabel('pdf.outputsHeading'),
    warningsHeading: resolveLabel('pdf.warningsHeading'),
    generatedOnLabel: `${resolveLabel(calculatedAt ? 'pdf.calculatedOn' : 'pdf.generatedOn')} ${format(calculatedAt ?? Date.now())}`,
    disclaimer: resolveLabel(disclaimerKey),
  });

  await sharePdf(html, calculatorTitle);
}

async function sharePdf(html: string, title: string): Promise<void> {
  const fileName = `${slugify(title)}-${Date.now()}`;

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

export interface GenerateProjectPdfReportParams {
  project: Project;
  resolveLabel: (key: string) => string;
  language: string;
  brandName: string;
  disclaimerKey: string;
}

/** Same pipeline as generatePdfReport, for a whole project. The caller owns the Pro gate. */
export async function generateProjectPdfReport({
  project,
  resolveLabel,
  language,
  brandName,
  disclaimerKey,
}: GenerateProjectPdfReportParams): Promise<void> {
  const format = (ts: number) =>
    new Intl.DateTimeFormat(language, { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(ts));

  const html = buildProjectReportHtml({
    brandName,
    projectName: project.name,
    steps: project.steps.map((step) => ({
      title: step.calculatorName,
      dateLabel: `${resolveLabel('pdf.calculatedOn')} ${format(step.timestamp)}`,
      ...step.snapshot,
    })),
    inputsHeading: resolveLabel('pdf.inputsHeading'),
    outputsHeading: resolveLabel('pdf.outputsHeading'),
    warningsHeading: resolveLabel('pdf.warningsHeading'),
    generatedOnLabel: `${resolveLabel('pdf.generatedOn')} ${format(Date.now())}`,
    disclaimer: resolveLabel(disclaimerKey),
  });

  await sharePdf(html, project.name);
}
