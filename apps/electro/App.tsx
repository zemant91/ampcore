// apps/electro/App.tsx
import type { ReactElement } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
// Side-effect import: runs i18n.init() (device-locale detection, resource
// loading) before the first screen renders.
import './src/i18n/i18n';
import { RootNavigator } from './src/navigation/RootNavigator';

export default function App(): ReactElement {
  return (
    <SafeAreaProvider>
      <RootNavigator />
    </SafeAreaProvider>
  );
}
