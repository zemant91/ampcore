// react-native-purchases contains native code and cannot run under Jest —
// individual tests override methods via jest.spyOn(Purchases, '<method>').
const LOG_LEVEL = { VERBOSE: 'VERBOSE', DEBUG: 'DEBUG', INFO: 'INFO', WARN: 'WARN', ERROR: 'ERROR' };

const PURCHASES_ERROR_CODE = {
  UNKNOWN_ERROR: '0',
  PURCHASE_CANCELLED_ERROR: '1',
  STORE_PROBLEM_ERROR: '2',
  NETWORK_ERROR: '10',
};

const Purchases = {
  configure: jest.fn(),
  setLogLevel: jest.fn(),
  getCustomerInfo: jest.fn(() => Promise.resolve({ entitlements: { active: {}, all: {} } })),
  getOfferings: jest.fn(() => Promise.resolve({ current: null, all: {} })),
  purchasePackage: jest.fn(),
  restorePurchases: jest.fn(),
  addCustomerInfoUpdateListener: jest.fn(),
  removeCustomerInfoUpdateListener: jest.fn(),
};

module.exports = Purchases;
module.exports.default = Purchases;
module.exports.LOG_LEVEL = LOG_LEVEL;
module.exports.PURCHASES_ERROR_CODE = PURCHASES_ERROR_CODE;
