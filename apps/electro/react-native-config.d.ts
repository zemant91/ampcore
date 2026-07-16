declare module 'react-native-config' {
  export interface NativeConfig {
    REVENUECAT_IOS_API_KEY?: string;
    REVENUECAT_ANDROID_API_KEY?: string;
  }

  export const Config: NativeConfig;
  export default Config;
}
