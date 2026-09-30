import type { ReactElement } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { RootStackParamList } from './types';
import { HomeScreen } from '../screens/HomeScreen';
import { CalculatorScreen } from '../screens/CalculatorScreen';
import { HistoryScreen } from '../screens/HistoryScreen';
import { ProjectsScreen } from '../screens/ProjectsScreen';
import { ProjectScreen } from '../screens/ProjectScreen';
import { PaywallScreen } from '../screens/PaywallScreen';
import { MenuScreen } from '../screens/MenuScreen';
import { SettingsScreen } from '../screens/SettingsScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

/**
 * Screens are registered once, as generic components (CalculatorScreen
 * renders ANY calculator based on route.params.calculatorId) — not one
 * Screen per calculator, the way the ElectroCalc web prototype had 9
 * separate pages.
 */
export function RootNavigator(): ReactElement {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Calculator" component={CalculatorScreen} />
        <Stack.Screen name="History" component={HistoryScreen} />
        <Stack.Screen name="Projects" component={ProjectsScreen} />
        <Stack.Screen name="Project" component={ProjectScreen} />
        <Stack.Screen name="Paywall" component={PaywallScreen} />
        <Stack.Screen name="Menu" component={MenuScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
