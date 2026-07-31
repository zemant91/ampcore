// react-native-html-to-pdf contains native code and cannot run under Jest —
// individual tests override generatePDF via jest.spyOn.
const generatePDF = jest.fn(() => Promise.resolve({ filePath: '/tmp/mock-report.pdf' }));

module.exports = { generatePDF };
