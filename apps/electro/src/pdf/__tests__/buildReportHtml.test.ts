import { buildProjectReportHtml, buildReportHtml } from '../buildReportHtml';

const headings = { inputsHeading: 'In', outputsHeading: 'Out', warningsHeading: 'Warn' };
const field = (label: string, value: string) => ({ label, value, unit: 'V' });

test('project report: one numbered section per step, disclaimer once, values escaped', () => {
  const html = buildProjectReportHtml({
    ...headings,
    brandName: 'Brand',
    projectName: 'Garage <1>',
    generatedOnLabel: 'Today',
    disclaimer: 'Disclaimer text',
    steps: [
      { title: 'Motor', dateLabel: 'd1', formulaLines: [], inputs: [field('a', '1')], outputs: [field('I', '2')], warnings: [] },
      { title: 'Cable', dateLabel: 'd2', formulaLines: ['U=IR'], inputs: [], outputs: [field('S', '3')], warnings: ['careful'] },
    ],
  });

  expect(html).toContain('Garage &lt;1&gt;');
  expect(html).toContain('1. Motor');
  expect(html).toContain('2. Cable');
  expect(html.match(/Disclaimer text/g)).toHaveLength(1);
  expect(html).toContain('careful');
});

test('single report still renders title, blocks and disclaimer', () => {
  const html = buildReportHtml({
    ...headings,
    brandName: 'Brand',
    calculatorTitle: 'Ohm',
    formulaLines: ['U=IR'],
    inputs: [field('U', '5')],
    outputs: [field('I', '1')],
    warnings: [],
    generatedOnLabel: 'Today',
    disclaimer: 'D',
  });
  expect(html).toContain('<h1>Ohm</h1>');
  expect(html).toContain('U=IR');
  expect(html).not.toContain('class="warnings"');
});
