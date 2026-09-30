import { Platform } from 'react-native';
import Config from 'react-native-config';

/**
 * Must match the entitlement identifier configured in the RevenueCat dashboard
 * exactly — that identifier is "pro" (the "AmpCore Pro" name is only its
 * Description field in the dashboard, not the identifier the SDK matches on).
 */
export const PRO_ENTITLEMENT_ID = 'pro';

/**
 * RevenueCat public SDK keys aren't secret by design (like a Stripe
 * publishable key), but they're per-platform and env-specific — reading
 * them through react-native-config keeps dev/staging/prod builds from
 * hardcoding one project's key into the source.
 */
export function getRevenueCatApiKey(): string {
  const key = Platform.OS === 'ios' ? Config.REVENUECAT_IOS_API_KEY : Config.REVENUECAT_ANDROID_API_KEY;

  if (!key) {
    throw new Error(
      `Missing RevenueCat API key for platform "${Platform.OS}" — set REVENUECAT_IOS_API_KEY / REVENUECAT_ANDROID_API_KEY in .env (see .env.example).`,
    );
  }

  return key;
}
