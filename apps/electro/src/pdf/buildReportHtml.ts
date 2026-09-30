import type { HistoryField } from '../lib/history';

export interface ReportData {
  brandName: string;
  calculatorTitle: string;
  formulaLines: string[];
  inputs: HistoryField[];
  outputs: HistoryField[];
  warnings: string[];
  inputsHeading: string;
  outputsHeading: string;
  warningsHeading: string;
  generatedOnLabel: string;
  disclaimer: string;
}

// Escapes values that ultimately come from user input (field values) or
// translation strings, before splicing them into the HTML string below —
// none of it is untrusted in the web sense (no network/remote content), but
// a stray "<" or "&" in a value would otherwise break the markup.
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function renderFieldRows(fields: HistoryField[]): string {
  return fields
    .map(
      (field) => `
        <tr>
          <td class="label">${escapeHtml(field.label)}</td>
          <td class="value">${escapeHtml(field.value)}${field.unit ? ` <span class="unit">${escapeHtml(field.unit)}</span>` : ''}</td>
        </tr>`,
    )
    .join('');
}

interface Headings {
  inputsHeading: string;
  outputsHeading: string;
  warningsHeading: string;
}

type CalculationBlocksData = Pick<ReportData, 'formulaLines' | 'inputs' | 'outputs' | 'warnings'> & Headings;

/** The formula / inputs / results / warnings blocks of one calculation — shared by the single-calculation and the project report. */
function renderCalculationBlocks(data: CalculationBlocksData): string {
  const formulaBlock =
    data.formulaLines.length > 0
      ? `<div class="formula">${data.formulaLines.map((line) => `<div>${escapeHtml(line)}</div>`).join('')}</div>`
      : '';

  const warningsBlock =
    data.warnings.length > 0
      ? `<h2>${escapeHtml(data.warningsHeading)}</h2>
    <div class="warnings">${data.warnings.map((w) => `<div>&#9888; ${escapeHtml(w)}</div>`).join('')}</div>`
      : '';

  return `${formulaBlock}

    <h2>${escapeHtml(data.inputsHeading)}</h2>
    <table>${renderFieldRows(data.inputs)}</table>

    <h2>${escapeHtml(data.outputsHeading)}</h2>
    <table class="results">${renderFieldRows(data.outputs)}</table>

    ${warningsBlock}`;
}

const STYLE = `
      body {
        font-family: -apple-system, Roboto, Helvetica, Arial, sans-serif;
        color: #1a1a1a;
        padding: 24px;
      }
      h1 { font-size: 20px; margin: 0 0 4px; }
      .brand { font-size: 12px; color: #666; margin: 0 0 24px; }
      h2 { font-size: 13px; text-transform: uppercase; letter-spacing: 0.04em; color: #666; margin: 20px 0 8px; }
      table { width: 100%; border-collapse: collapse; margin-bottom: 8px; }
      td { padding: 6px 0; border-bottom: 1px solid #eee; font-size: 14px; }
      td.label { color: #555; }
      td.value { text-align: right; font-weight: 600; }
      .unit { font-weight: 400; color: #888; }
      .formula { font-family: 'Courier New', monospace; font-size: 15px; background: #f6f5f0; border-radius: 8px; padding: 12px 16px; margin: 8px 0 20px; }
      .warnings { background: #fff4e5; border-left: 3px solid #e08a00; border-radius: 4px; padding: 10px 14px; font-size: 13px; line-height: 1.6; color: #6b4200; }
      .results td { font-size: 16px; }
      .step { page-break-inside: avoid; margin-top: 28px; padding-top: 12px; border-top: 2px solid #ddd; }
      .step h1 { font-size: 17px; }
      .step .brand { margin-bottom: 8px; }
      .disclaimer { margin-top: 32px; padding-top: 12px; border-top: 1px solid #eee; font-size: 10px; line-height: 1.5; color: #888; }
    `;

function renderDocument(body: string, disclaimer: string): string {
  return `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <style>${STYLE}</style>
  </head>
  <body>
    ${body}

    <p class="disclaimer">${escapeHtml(disclaimer)}</p>
  </body>
</html>`;
}

/**
 * Pure HTML builder — every string it receives is already resolved (t()
 * called by the caller), so this has no i18n/react-native dependency and is
 * trivial to unit-test.
 */
export function buildReportHtml(data: ReportData): string {
  return renderDocument(
    `<h1>${escapeHtml(data.calculatorTitle)}</h1>
    <p class="brand">${escapeHtml(data.brandName)} &middot; ${escapeHtml(data.generatedOnLabel)}</p>

    ${renderCalculationBlocks(data)}`,
    data.disclaimer,
  );
}

export interface ProjectReportData extends Headings {
  brandName: string;
  projectName: string;
  generatedOnLabel: string;
  steps: {
    title: string;
    dateLabel: string;
    formulaLines: string[];
    inputs: HistoryField[];
    outputs: HistoryField[];
    warnings: string[];
  }[];
  disclaimer: string;
}

/** One document for a whole project: its calculations in order, one disclaimer at the end. */
export function buildProjectReportHtml(data: ProjectReportData): string {
  const steps = data.steps
    .map(
      (step, index) => `<section class="step">
    <h1>${index + 1}. ${escapeHtml(step.title)}</h1>
    <p class="brand">${escapeHtml(step.dateLabel)}</p>
    ${renderCalculationBlocks({ ...step, ...data })}
    </section>`,
    )
    .join('\n');

  return renderDocument(
    `<h1>${escapeHtml(data.projectName)}</h1>
    <p class="brand">${escapeHtml(data.brandName)} &middot; ${escapeHtml(data.generatedOnLabel)}</p>
    ${steps}`,
    data.disclaimer,
  );
}
