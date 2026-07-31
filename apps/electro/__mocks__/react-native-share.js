// react-native-share contains native code and cannot run under Jest —
// individual tests override Share.open via jest.spyOn.
const Share = {
  open: jest.fn(() => Promise.resolve({ success: true, message: '' })),
};

module.exports = Share;
module.exports.default = Share;
