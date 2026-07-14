import type { Values } from '@calc/engine';

export type RootStackParamList = {
  Home: undefined;
  Calculator: { calculatorId: string; initialValues?: Partial<Values> };
  History: undefined;
  Paywall: undefined;
  Menu: undefined;
};
