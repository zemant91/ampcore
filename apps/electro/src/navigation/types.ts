import type { Values } from '@calc/engine';

export type RootStackParamList = {
  Home: undefined;
  /** projectId/stepId: opened from (or bound to) a project — saving then writes to that project; stepId overwrites that step */
  Calculator: { calculatorId: string; initialValues?: Partial<Values>; projectId?: string; stepId?: string };
  History: undefined;
  /** focusNew: opened from Home's "+" — put the cursor in the new-project name field */
  Projects: { focusNew?: boolean } | undefined;
  Project: { projectId: string };
  Paywall: undefined;
  Menu: undefined;
  Settings: undefined;
};
