import type { ReactElement } from 'react';
import { useCallback, useState } from 'react';
import { FlatList, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { buildTheme } from '@calc/ui';
import type { RootStackParamList } from '../navigation/types';
import { electro } from '../brand';
import { loadHistory, deleteEntry, clearHistory } from '../lib/history';
import type { HistoryEntry } from '../lib/history';

type Props = NativeStackScreenProps<RootStackParamList, 'History'>;

const theme = buildTheme(electro.theme.accent);

const iconButtonStyle = {
  width: 36,
  height: 36,
  borderRadius: 10,
  alignItems: 'center' as const,
  justifyContent: 'center' as const,
  backgroundColor: theme.colors.cardSurface,
};

export function HistoryScreen({ navigation }: Props): ReactElement {
  const { t } = useTranslation();
  const [entries, setEntries] = useState<HistoryEntry[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Re-read on every focus — history may have grown on the calculator
  // screen we just came from.
  useFocusEffect(
    useCallback(() => {
      setEntries(loadHistory());
    }, []),
  );

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: theme.colors.background }}
      edges={['top', 'left', 'right']}
      testID="history-screen"
    >
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: theme.layout.spacingUnit * 2,
        }}
      >
        <Pressable style={iconButtonStyle} onPress={() => navigation.goBack()} testID="history-screen-back">
          <Text style={{ color: theme.colors.textSecondary, fontSize: 18 }}>‹</Text>
        </Pressable>
        <Text
          style={{
            color: theme.colors.textPrimary,
            fontFamily: theme.typography.uiFontFamily,
            fontSize: 18,
            fontWeight: '700',
          }}
        >
          {t('ui.history.title')}
        </Text>
        {entries.length > 0 ? (
          <Pressable
            onPress={() => {
              clearHistory();
              setEntries([]);
            }}
            testID="history-screen-clear"
          >
            <Text style={{ color: theme.colors.danger, fontFamily: theme.typography.uiFontFamily }}>
              {t('ui.history.clear')}
            </Text>
          </Pressable>
        ) : (
          <View style={{ width: 36 }} />
        )}
      </View>

      <FlatList
        data={entries}
        keyExtractor={(entry) => entry.id}
        contentContainerStyle={{
          paddingHorizontal: theme.layout.spacingUnit * 2,
          paddingBottom: theme.layout.spacingUnit * 2,
          gap: theme.layout.spacingUnit,
        }}
        ListEmptyComponent={
          <Text
            style={{ color: theme.colors.textSecondary, fontFamily: theme.typography.uiFontFamily, textAlign: 'center' }}
            testID="history-screen-empty"
          >
            {t('ui.history.empty')}
          </Text>
        }
        renderItem={({ item }) => {
          const expanded = expandedId === item.id;
          return (
            <View
              style={{
                borderRadius: theme.layout.cardRadius,
                backgroundColor: theme.colors.cardSurface,
                overflow: 'hidden',
              }}
              testID={`history-entry-${item.id}`}
            >
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: theme.layout.spacingUnit,
                  padding: theme.layout.spacingUnit * 1.5,
                }}
              >
                <Pressable
                  style={{ flex: 1, flexDirection: 'row', alignItems: 'center', gap: theme.layout.spacingUnit }}
                  onPress={() => setExpandedId((prev) => (prev === item.id ? null : item.id))}
                  testID={`history-entry-toggle-${item.id}`}
                >
                  <View style={{ flex: 1, gap: 2 }}>
                    <Text style={{ color: theme.colors.textPrimary, fontFamily: theme.typography.uiFontFamily }}>
                      {item.calculatorName}
                    </Text>
                    <Text style={{ color: theme.accent, fontFamily: theme.typography.monoFontFamily, fontSize: 16 }}>
                      {item.result.label} = {item.result.value} {item.result.unit}
                    </Text>
                  </View>
                  {item.fields.length > 0 && (
                    <Text style={{ color: theme.colors.textSecondary, fontSize: 16 }}>{expanded ? '⌄' : '›'}</Text>
                  )}
                </Pressable>
                <Pressable
                  style={{ width: 32, height: 32, alignItems: 'center', justifyContent: 'center' }}
                  onPress={() => {
                    deleteEntry(item.id);
                    setEntries((prev) => prev.filter((e) => e.id !== item.id));
                    if (expandedId === item.id) setExpandedId(null);
                  }}
                  testID={`history-entry-delete-${item.id}`}
                >
                  <Text style={{ color: theme.colors.danger, fontSize: 16 }}>×</Text>
                </Pressable>
              </View>

              {expanded && item.fields.length > 0 && (
                <View
                  style={{
                    gap: 4,
                    paddingHorizontal: theme.layout.spacingUnit * 1.5,
                    paddingTop: theme.layout.spacingUnit,
                    paddingBottom: theme.layout.spacingUnit * 1.5,
                    borderTopWidth: 1,
                    borderTopColor: theme.colors.cardBorderMuted,
                  }}
                  testID={`history-entry-details-${item.id}`}
                >
                  {item.fields.map((field, index) => (
                    <View key={index} style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                      <Text
                        style={{ color: theme.colors.textSecondary, fontFamily: theme.typography.uiFontFamily, fontSize: 13 }}
                      >
                        {field.label}
                      </Text>
                      <Text
                        style={{ color: theme.colors.textPrimary, fontFamily: theme.typography.monoFontFamily, fontSize: 13 }}
                      >
                        {field.value} {field.unit}
                      </Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
          );
        }}
      />
    </SafeAreaView>
  );
}
