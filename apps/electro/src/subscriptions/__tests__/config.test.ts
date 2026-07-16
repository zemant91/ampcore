import { Platform } from 'react-native';
import Config from 'react-native-config';
import { getRevenueCatApiKey } from '../config';

describe('getRevenueCatApiKey', () => {
  const originalOS = Platform.OS;

  afterEach(() => {
    Platform.OS = originalOS;
    Config.REVENUECAT_IOS_API_KEY = 'test-ios-key';
    Config.REVENUECAT_ANDROID_API_KEY = 'test-android-key';
  });

  test('reads the iOS key on iOS', () => {
    Platform.OS = 'ios';
    expect(getRevenueCatApiKey()).toBe('test-ios-key');
  });

  test('reads the Android key on Android', () => {
    Platform.OS = 'android';
    expect(getRevenueCatApiKey()).toBe('test-android-key');
  });

  test('throws a descriptive error when the key for the current platform is missing', () => {
    Platform.OS = 'ios';
    Config.REVENUECAT_IOS_API_KEY = undefined;
    expect(() => getRevenueCatApiKey()).toThrow(/REVENUECAT_IOS_API_KEY/);
  });
});
