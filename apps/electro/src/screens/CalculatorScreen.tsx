import type { ReactElement } from 'react';
import { useCallback, useState } from 'react';
import { Alert, Linking, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { History, Flag, FileText } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';
import DeviceInfo from 'react-native-device-info';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CalculatorScreenTemplate, buildTheme } from '@calc/ui';
import type { Values } from '@calc/engine';
import type { RootStackParamList } from '../navigation/types';
import { electro } from '../brand';
import { decimalSeparatorFor } from '../i18n/i18n';
import { getUnitsSystem } from '../lib/settings';
import { createProject, loadProjects, saveStep } from '../lib/projects';
import { buildCalculationSnapshot } from '../state/buildCalculationSnapshot';
import { useCalculatorState } from '../state/useCalculatorState';
import { buildFeedbackMailtoUrl } from '../feedback/buildFeedbackMailto';
import { useEntitlement } from '../subscriptions';
import { generatePdfReport } from '../pdf/generatePdfReport';
import { ProjectPickerModal } from './ProjectPicker';

type Props = NativeStackScreenProps<RootStackParamList, 'Calculator'>;

const theme = buildTheme(electro.theme.accent);

/**
 * One screen for ALL of the brand's calculators: route.params.calculatorId
 * decides which one to render. Previously (the apps/electro/App.tsx stub)
 * there was no screen at all, since @calc/ui had no organism/template —
 * now there's CalculatorScreenTemplate, and this file just wires it up to
 * navigation, state (useCalculatorState), and the brand.
 */
export function CalculatorScreen({ route, navigation }: Props): ReactElement | null {
  const { t, i18n } = useTranslation();
  const { isPro } = useEntitlement();
  const [generatingPdf, setGeneratingPdf] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);
  const { calculatorId, initialValues, projectId, stepId } = route.params;
  const calculator = electro.calculators.find((c) => c.id === calculatorId);

  // The hook must be called in the same order on every render — the fallback
  // to the first calculator here exists purely, so we don't call the hook
  // conditionally; the actual render below still bails out to null if
  // the calculator wasn't found.
  const { values, outputs, warnings, onChangeValue } = useCalculatorState(
    calculator ?? electro.calculators[0]!,
    initialValues,
  );

  // Inputs as of the last save into a project (a step opened from a project starts out saved) —
  // the button reads "Saved" while they still match, "Save" once edited.
  const [savedKey, setSavedKey] = useState<string | null>(stepId ? JSON.stringify(initialValues ?? {}) : null);

  const isSaved = projectId !== undefined && savedKey === JSON.stringify(values);

  /** Writes the current calculation into `targetProjectId` (overwriting this screen's step if it already has one) and binds the screen to it. */
  const saveToProject = useCallback(
    (targetProjectId: string): boolean => {
      if (!calculator || outputs === undefined) return false;
      const id = saveStep(
        targetProjectId,
        {
          calculatorId: calculator.id,
          calculatorName: t(calculator.titleKey),
          timestamp: Date.now(),
          values,
          snapshot: buildCalculationSnapshot({
            calculator,
            values,
            outputs,
            warnings,
            resolveLabel: t,
            unitsSystem: getUnitsSystem(electro.defaultUnitsSystem),
          }),
        },
        targetProjectId === projectId ? stepId : undefined,
      );
      if (id === undefined) {
        Alert.alert(t('ui.projects.saveError'));
        return false;
      }
      navigation.setParams({ projectId: targetProjectId, stepId: id });
      setSavedKey(JSON.stringify(values));
      return true;
    },
    [calculator, navigation, outputs, projectId, stepId, t, values, warnings],
  );

  const onSaveToProject = useCallback(() => {
    if (!isPro) {
      navigation.navigate('Paywall');
      return;
    }
    if (projectId) saveToProject(projectId);
    else setPickerOpen(true);
  }, [isPro, navigation, projectId, saveToProject]);

  const onPickProject = useCallback(
    (targetProjectId: string) => {
      if (saveToProject(targetProjectId)) setPickerOpen(false);
    },
    [saveToProject],
  );

  const onCreateProject = useCallback(
    (name: string) => {
      const project = createProject(name);
      if (!project) {
        Alert.alert(t('ui.projects.limitReached'));
        return;
      }
      onPickProject(project.id);
    },
    [onPickProject, t],
  );

  const onChainTo = useCallback(
    (targetId: string, mappedValues: Partial<Values>) => {
      // Pro calculators are locked on Home only — a chain from a free one must not bypass that.
      if (!isPro && electro.calculators.find((c) => c.id === targetId)?.tier === 'pro') {
        navigation.navigate('Paywall');
        return;
      }
      // In a project the chain is part of it: record this step first, and keep the next calculator bound.
      if (projectId) saveToProject(projectId);
      navigation.push('Calculator', {
        calculatorId: targetId,
        initialValues: mappedValues,
        ...(projectId ? { projectId } : {}),
      });
    },
    [isPro, navigation, projectId, saveToProject],
  );

  const onReportIssue = useCallback(() => {
    if (!calculator) return;
    Linking.openURL(
      buildFeedbackMailtoUrl({
        supportEmail: electro.supportEmail,
        appVersion: DeviceInfo.getVersion(),
        os: Platform.OS,
        osVersion: String(Platform.Version),
        calculatorTitle: t(calculator.titleKey),
        calculatorValues: values,
      }),
    );
  }, [calculator, t, values]);

  const onGeneratePdf = useCallback(() => {
    if (!calculator || outputs === undefined || generatingPdf) return;

    if (!isPro) {
      navigation.navigate('Paywall');
      return;
    }

    setGeneratingPdf(true);
    generatePdfReport({
      calculatorTitle: t(calculator.titleKey),
      snapshot: buildCalculationSnapshot({
        calculator,
        values,
        outputs,
        warnings,
        resolveLabel: t,
        unitsSystem: getUnitsSystem(electro.defaultUnitsSystem),
      }),
      resolveLabel: t,
      language: i18n.language,
      brandName: electro.displayName,
      disclaimerKey: electro.legalDisclaimerKey,
    })
      .catch(() => {
        Alert.alert(t('pdf.errorTitle'), t('pdf.errorBody'));
      })
      .finally(() => {
        setGeneratingPdf(false);
      });
  }, [calculator, generatingPdf, isPro, navigation, outputs, values, warnings, t, i18n.language]);

  if (!calculator) return null;

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: theme.colors.background }}
      edges={['top', 'left', 'right', 'bottom']}
    >
      <CalculatorScreenTemplate
        calculator={calculator}
        values={values}
        outputs={outputs}
        warnings={warnings}
        theme={theme}
        resolveLabel={t}
        disclaimerKey={electro.legalDisclaimerKey}
        decimalSeparator={decimalSeparatorFor(i18n.language)}
        unitsSystem={getUnitsSystem(electro.defaultUnitsSystem)}
        onChangeValue={onChangeValue}
        onBack={() => navigation.goBack()}
        onOpenHistory={() => navigation.navigate('History')}
        historyIcon={<History size={16} color={theme.colors.textSecondary} />}
        onChainTo={onChainTo}
        onReportIssue={onReportIssue}
        reportIssueIcon={<Flag size={16} color={theme.colors.textSecondary} />}
        onGeneratePdf={onGeneratePdf}
        generatePdfIcon={<FileText size={16} color={theme.colors.textSecondary} />}
        onSaveToProject={onSaveToProject}
        saveToProjectLabel={t(
          !projectId ? 'ui.projects.addToProject' : isSaved ? 'ui.projects.saved' : 'ui.projects.saveToProject',
        )}
        saveToProjectDone={isSaved}
      />
      <ProjectPickerModal
        visible={pickerOpen}
        projects={pickerOpen ? loadProjects() : []}
        onPick={onPickProject}
        onCreate={onCreateProject}
        onClose={() => setPickerOpen(false)}
      />
    </SafeAreaView>
  );
}
