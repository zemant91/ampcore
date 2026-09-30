import type { ReactElement } from 'react';
import { useState } from 'react';
import { Modal, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { buildTheme } from '@calc/ui';
import { electro } from '../brand';
import type { Project } from '../lib/projects';

const theme = buildTheme(electro.theme.accent);

/** Name input + "Create" button — shared by the Projects screen and the project picker. */
export function NewProjectRow({
  onCreate,
  autoFocus = false,
}: {
  onCreate: (name: string) => void;
  autoFocus?: boolean;
}): ReactElement {
  const { t } = useTranslation();
  const [name, setName] = useState('');
  const canCreate = name.trim() !== '';

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: theme.layout.spacingUnit }}>
      <TextInput
        style={{
          flex: 1,
          minHeight: theme.layout.minFieldHeight,
          paddingHorizontal: theme.layout.spacingUnit * 1.5,
          borderRadius: theme.layout.cardRadius,
          backgroundColor: theme.colors.cardSurface,
          color: theme.colors.textPrimary,
          fontFamily: theme.typography.uiFontFamily,
        }}
        value={name}
        onChangeText={setName}
        placeholder={t('ui.projects.newPlaceholder')}
        placeholderTextColor={theme.colors.textSecondary}
        maxLength={60}
        autoFocus={autoFocus}
        returnKeyType="done"
        onSubmitEditing={() => {
          if (canCreate) {
            onCreate(name);
            setName('');
          }
        }}
        testID="new-project-input"
      />
      <Pressable
        style={{
          minHeight: theme.layout.minFieldHeight,
          justifyContent: 'center',
          paddingHorizontal: theme.layout.spacingUnit * 2,
          borderRadius: theme.layout.cardRadius,
          backgroundColor: theme.accent,
          opacity: canCreate ? 1 : 0.4,
        }}
        disabled={!canCreate}
        onPress={() => {
          onCreate(name);
          setName('');
        }}
        testID="new-project-create"
      >
        <Text style={{ fontWeight: '700', color: theme.colors.background }}>{t('ui.projects.create')}</Text>
      </Pressable>
    </View>
  );
}

interface ProjectPickerModalProps {
  visible: boolean;
  projects: Project[];
  onPick: (projectId: string) => void;
  onCreate: (name: string) => void;
  onClose: () => void;
}

/** Bottom-of-screen chooser: pick an existing project or create one, for "Add to project" on a calculator. */
export function ProjectPickerModal({ visible, projects, onPick, onCreate, onClose }: ProjectPickerModalProps): ReactElement {
  const { t } = useTranslation();
  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: theme.layout.spacingUnit * 2,
          }}
        >
          <Text
            style={{
              color: theme.colors.textPrimary,
              fontFamily: theme.typography.uiFontFamily,
              fontSize: 18,
              fontWeight: '700',
            }}
          >
            {t('ui.projects.pickTitle')}
          </Text>
          <Pressable onPress={onClose} testID="project-picker-close">
            <Text style={{ color: theme.colors.textSecondary, fontFamily: theme.typography.uiFontFamily }}>
              {t('ui.projects.cancel')}
            </Text>
          </Pressable>
        </View>

        <ScrollView
          contentContainerStyle={{ gap: theme.layout.spacingUnit, padding: theme.layout.spacingUnit * 2 }}
          keyboardShouldPersistTaps="handled"
        >
          <NewProjectRow onCreate={onCreate} />
          {projects.map((project) => (
            <Pressable
              key={project.id}
              style={{
                padding: theme.layout.spacingUnit * 1.5,
                borderRadius: theme.layout.cardRadius,
                backgroundColor: theme.colors.cardSurface,
              }}
              onPress={() => onPick(project.id)}
              testID={`project-picker-${project.id}`}
            >
              <Text style={{ color: theme.colors.textPrimary, fontFamily: theme.typography.uiFontFamily }}>
                {project.name}
              </Text>
              <Text style={{ color: theme.colors.textSecondary, fontFamily: theme.typography.uiFontFamily, fontSize: 12 }}>
                {t('ui.projects.stepsLabel')}: {project.steps.length}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}
