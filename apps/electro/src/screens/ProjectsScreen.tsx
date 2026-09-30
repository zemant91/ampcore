import type { ReactElement } from 'react';
import { useCallback, useState } from 'react';
import { Alert, FlatList, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { buildTheme } from '@calc/ui';
import type { RootStackParamList } from '../navigation/types';
import { electro } from '../brand';
import { createProject, deleteProject, loadProjects } from '../lib/projects';
import type { Project } from '../lib/projects';
import { NewProjectRow } from './ProjectPicker';

type Props = NativeStackScreenProps<RootStackParamList, 'Projects'>;

const theme = buildTheme(electro.theme.accent);

const iconButtonStyle = {
  width: 36,
  height: 36,
  borderRadius: 10,
  alignItems: 'center' as const,
  justifyContent: 'center' as const,
  backgroundColor: theme.colors.cardSurface,
};

/** Pro-gated by its entry points (Menu row, calculator "Add to project") — not re-checked here. */
export function ProjectsScreen({ route, navigation }: Props): ReactElement {
  const { t, i18n } = useTranslation();
  const [projects, setProjects] = useState<Project[]>([]);

  // Re-read on every focus — steps get added from calculator screens.
  useFocusEffect(
    useCallback(() => {
      setProjects(loadProjects());
    }, []),
  );

  const onCreate = (name: string) => {
    const project = createProject(name);
    if (!project) {
      Alert.alert(t('ui.projects.limitReached'));
      return;
    }
    setProjects(loadProjects());
    navigation.navigate('Project', { projectId: project.id });
  };

  const onDelete = (project: Project) => {
    Alert.alert(t('ui.projects.deleteTitle'), t('ui.projects.deleteBody'), [
      { text: t('ui.projects.cancel'), style: 'cancel' },
      {
        text: t('ui.projects.delete'),
        style: 'destructive',
        onPress: () => {
          deleteProject(project.id);
          setProjects(loadProjects());
        },
      },
    ]);
  };

  const formatDate = (ts: number) => new Intl.DateTimeFormat(i18n.language, { dateStyle: 'medium' }).format(new Date(ts));

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: theme.colors.background }}
      edges={['top', 'left', 'right']}
      testID="projects-screen"
    >
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: theme.layout.spacingUnit,
          padding: theme.layout.spacingUnit * 2,
        }}
      >
        <Pressable style={iconButtonStyle} onPress={() => navigation.goBack()} testID="projects-screen-back">
          <Text style={{ color: theme.colors.textSecondary, fontSize: 18 }}>‹</Text>
        </Pressable>
        <Text
          style={{
            flex: 1,
            color: theme.colors.textPrimary,
            fontFamily: theme.typography.uiFontFamily,
            fontSize: 20,
            fontWeight: '700',
          }}
        >
          {t('ui.projects.title')}
        </Text>
      </View>

      <FlatList
        data={projects}
        keyExtractor={(project) => project.id}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          paddingHorizontal: theme.layout.spacingUnit * 2,
          paddingBottom: theme.layout.spacingUnit * 2,
          gap: theme.layout.spacingUnit,
        }}
        ListHeaderComponent={
          <View style={{ gap: theme.layout.spacingUnit * 1.5 }}>
            <Text
              style={{ color: theme.colors.textSecondary, fontFamily: theme.typography.uiFontFamily, fontSize: 13, lineHeight: 19 }}
              testID="projects-screen-description"
            >
              {t('ui.projects.description')}
            </Text>
            <NewProjectRow onCreate={onCreate} autoFocus={route.params?.focusNew === true} />
          </View>
        }
        ListEmptyComponent={
          <Text
            style={{
              color: theme.colors.textSecondary,
              fontFamily: theme.typography.uiFontFamily,
              textAlign: 'center',
              marginTop: theme.layout.spacingUnit * 2,
            }}
            testID="projects-screen-empty"
          >
            {t('ui.projects.empty')}
          </Text>
        }
        renderItem={({ item }) => (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              borderRadius: theme.layout.cardRadius,
              backgroundColor: theme.colors.cardSurface,
              padding: theme.layout.spacingUnit * 1.5,
              gap: theme.layout.spacingUnit,
            }}
            testID={`project-${item.id}`}
          >
            <Pressable
              style={{ flex: 1, gap: 2 }}
              onPress={() => navigation.navigate('Project', { projectId: item.id })}
              testID={`project-open-${item.id}`}
            >
              <Text style={{ color: theme.colors.textPrimary, fontFamily: theme.typography.uiFontFamily }}>{item.name}</Text>
              <Text style={{ color: theme.colors.textSecondary, fontFamily: theme.typography.uiFontFamily, fontSize: 12 }}>
                {t('ui.projects.stepsLabel')}: {item.steps.length} · {formatDate(item.updatedAt)}
              </Text>
            </Pressable>
            <Pressable
              style={{ width: 32, height: 32, alignItems: 'center', justifyContent: 'center' }}
              onPress={() => onDelete(item)}
              testID={`project-delete-${item.id}`}
            >
              <Text style={{ color: theme.colors.danger, fontSize: 16 }}>×</Text>
            </Pressable>
          </View>
        )}
      />
    </SafeAreaView>
  );
}
