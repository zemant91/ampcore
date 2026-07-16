// react-native-purchases-ui contains native view managers and cannot run
// under Jest — tests that need specific behavior override methods via
// jest.spyOn(RevenueCatUI, '<method>').
const React = require('react');

const PAYWALL_RESULT = {
  NOT_PRESENTED: 'NOT_PRESENTED',
  ERROR: 'ERROR',
  CANCELLED: 'CANCELLED',
  PURCHASED: 'PURCHASED',
  RESTORED: 'RESTORED',
};

const RevenueCatUI = {
  PAYWALL_RESULT,
  presentPaywall: jest.fn(() => Promise.resolve(PAYWALL_RESULT.NOT_PRESENTED)),
  presentPaywallIfNeeded: jest.fn(() => Promise.resolve(PAYWALL_RESULT.NOT_PRESENTED)),
  presentCustomerCenter: jest.fn(() => Promise.resolve()),
  Paywall: () => null,
  CustomerCenterView: () => null,
  OriginalTemplatePaywallFooterContainerView: ({ children }) => React.createElement(React.Fragment, null, children),
};

module.exports = RevenueCatUI;
module.exports.default = RevenueCatUI;
module.exports.PAYWALL_RESULT = PAYWALL_RESULT;
