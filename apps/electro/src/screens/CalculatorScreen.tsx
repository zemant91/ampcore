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
import { useCalculatorState } from '../state/useCalculatorState';
import { buildFeedbackMailtoUrl } from '../feedback/buildFeedbackMailto';
import { useEntitlement } from '../subscriptions';
import { generatePdfReport } from '../pdf/generatePdfReport';

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
  const { calculatorId, initialValues } = route.params;
  const calculator = electro.calculators.find((c) => c.id === calculatorId);

  // The hook must be called in the same order on every render — the fallback
  // to the first calculator here exists purely, so we don't call the hook
  // conditionally; the actual render below still bails out to null if
  // the calculator wasn't found.
  const { values, outputs, warnings, onChangeValue } = useCalculatorState(
    calculator ?? electro.calculators[0]!,
    initialValues,
  );

  const onChainTo = useCallback(
    (targetId: string, mappedValues: Partial<Values>) => {
      navigation.push('Calculator', { calculatorId: targetId, initialValues: mappedValues });
    },
    [navigation],
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
      calculator,
      values,
      outputs,
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
  }, [calculator, generatingPdf, isPro, navigation, outputs, values, t, i18n.language]);

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
      />
    </SafeAreaView>
  );
}
