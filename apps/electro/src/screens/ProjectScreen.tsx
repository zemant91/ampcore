import type { ReactElement } from 'react';
import { useCallback, useState } from 'react';
import { Alert, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { FileText } from 'lucide-react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { buildTheme } from '@calc/ui';
import type { RootStackParamList } from '../navigation/types';
import { electro } from '../brand';
import { getProject, removeStep } from '../lib/projects';
import type { Project } from '../lib/projects';
import { generateProjectPdfReport } from '../pdf/generatePdfReport';

type Props = NativeStackScreenProps<RootStackParamList, 'Project'>;

const theme = buildTheme(electro.theme.accent);

const iconButtonStyle = {
  width: 36,
  height: 36,
  borderRadius: 10,
  alignItems: 'center' as const,
  justifyContent: 'center' as const,
  backgroundColor: theme.colors.cardSurface,
};

/**
 * One project: its saved calculations in order (tap to reopen and edit —
 * saving there overwrites the step), calculators to add another, and a
 * single PDF for the whole project. Pro-gated by its entry points.
 */
export function ProjectScreen({ route, navigation }: Props): ReactElement {
  const { projectId } = route.params;
  const { t, i18n } = useTranslation();
  const [project, setProject] = useState<Project | undefined>();
  const [generatingPdf, setGeneratingPdf] = useState(false);

  // Re-read on every focus — a step may have been saved/overwritten on the calculator screen.
  useFocusEffect(
    useCallback(() => {
      setProject(getProject(projectId));
    }, [projectId]),
  );

  const onExportPdf = () => {
    if (!project || project.steps.length === 0 || generatingPdf) return;
    setGeneratingPdf(true);
    generateProjectPdfReport({
      project,
      resolveLabel: t,
      language: i18n.language,
      brandName: electro.displayName,
      disclaimerKey: electro.legalDisclaimerKey,
    })
      .catch(() => Alert.alert(t('pdf.errorTitle'), t('pdf.errorBody')))
      .finally(() => setGeneratingPdf(false));
  };

  const onRemoveStep = (stepId: string) => {
    removeStep(projectId, stepId);
    setProject(getProject(projectId));
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: theme.colors.background }}
      edges={['top', 'left', 'right']}
      testID="project-screen"
    >
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: theme.layout.spacingUnit,
          padding: theme.layout.spacingUnit * 2,
        }}
      >
        <Pressable style={iconButtonStyle} onPress={() => navigation.goBack()} testID="project-screen-back">
          <Text style={{ color: theme.colors.textSecondary, fontSize: 18 }}>‹</Text>
        </Pressable>
        <Text
          numberOfLines={1}
          style={{
            flex: 1,
            color: theme.colors.textPrimary,
            fontFamily: theme.typography.uiFontFamily,
            fontSize: 20,
            fontWeight: '700',
          }}
        >
          {project?.name ?? ''}
        </Text>
        {project !== undefined && project.steps.length > 0 && (
          <Pressable style={iconButtonStyle} onPress={onExportPdf} testID="project-screen-pdf">
            <FileText size={16} color={theme.colors.textSecondary} />
          </Pressable>
        )}
      </View>

      <ScrollView
        contentContainerStyle={{
          gap: theme.layout.spacingUnit,
          paddingHorizontal: theme.layout.spacingUnit * 2,
          paddingBottom: theme.layout.spacingUnit * 2,
        }}
      >
        {project?.steps.length === 0 && (
          <Text
            style={{ color: theme.colors.textSecondary, fontFamily: theme.typography.uiFontFamily, textAlign: 'center' }}
            testID="project-screen-empty"
          >
            {t('ui.projects.emptySteps')}
          </Text>
        )}

        {project?.steps.map((step, index) => {
          const [result] = step.snapshot.outputs;
          return (
            <View
              key={step.id}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                borderRadius: theme.layout.cardRadius,
                backgroundColor: theme.colors.cardSurface,
                padding: theme.layout.spacingUnit * 1.5,
                gap: theme.layout.spacingUnit,
              }}
              testID={`project-step-${step.id}`}
            >
              <Pressable
                style={{ flex: 1, gap: 2 }}
                onPress={() =>
                  navigation.push('Calculator', {
                    calculatorId: step.calculatorId,
                    initialValues: step.values,
                    projectId,
                    stepId: step.id,
                  })
                }
                testID={`project-step-open-${step.id}`}
              >
                <Text style={{ color: theme.colors.textPrimary, fontFamily: theme.typography.uiFontFamily }}>
                  {index + 1}. {step.calculatorName}
                </Text>
                {result && (
                  <Text style={{ color: theme.accent, fontFamily: theme.typography.monoFontFamily, fontSize: 16 }}>
                    {result.label} = {result.value} {result.unit}
                  </Text>
                )}
              </Pressable>
              <Pressable
                style={{ width: 32, height: 32, alignItems: 'center', justifyContent: 'center' }}
                onPress={() => onRemoveStep(step.id)}
                testID={`project-step-delete-${step.id}`}
              >
                <Text style={{ color: theme.colors.danger, fontSize: 16 }}>×</Text>
              </Pressable>
            </View>
          );
        })}

        <Text
          style={{
            marginTop: theme.layout.spacingUnit,
            color: theme.colors.textSecondary,
            fontFamily: theme.typography.uiFontFamily,
            fontSize: 13,
            fontWeight: '700',
          }}
        >
          {t('ui.projects.addCalculation')}
        </Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: theme.layout.spacingUnit }}>
          {electro.calculators.map((calculator) => (
            <Pressable
              key={calculator.id}
              style={{
                paddingHorizontal: theme.layout.spacingUnit * 1.5,
                paddingVertical: theme.layout.spacingUnit,
                borderRadius: theme.layout.cardRadius,
                borderWidth: 1,
                borderColor: theme.accent,
              }}
              onPress={() => navigation.push('Calculator', { calculatorId: calculator.id, projectId })}
              testID={`project-add-${calculator.id}`}
            >
              <Text style={{ color: theme.accent, fontFamily: theme.typography.uiFontFamily, fontSize: 13 }}>
                {t(calculator.titleKey)}
              </Text>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
