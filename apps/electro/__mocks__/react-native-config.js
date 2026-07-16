// react-native-config contains native code and cannot run under Jest —
// tests that need specific values override this via jest.mock(..., () => ({...})).
export default {
  REVENUECAT_IOS_API_KEY: 'test-ios-key',
  REVENUECAT_ANDROID_API_KEY: 'test-android-key',
};
