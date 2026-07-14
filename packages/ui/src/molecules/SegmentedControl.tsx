import type { ReactElement } from 'react';
import { useEffect, useState } from 'react';
import type { FieldOption } from '@calc/engine';
import { View, Text, Pressable, Modal } from 'react-native';
import { Chip } from '../atoms/Chip';
import type { ThemeTokens } from '../tokens/theme';

export interface SegmentedControlProps {
  options: FieldOption[];
  value: string | number | undefined;
  theme: ThemeTokens;
  /** labelKey -> text. An i18n string resolver — passed in from outside, the molecule doesn't know about i18n */
  resolveLabel: (labelKey: string) => string;
  onChange: (value: string | number) => void;
}

/**
 * Chips wrap (flexWrap) instead of dividing the row into N equal-width
 * slivers — with short codes ("A1"/"B1"/...) that's barely visible, but it's
 * what actually saves fields with 5-6 options (ambientTemp, grouping) or
 * long labels from turning into a column of single letters.
 *
 * A "?" trigger shows up only when at least one option carries a
 * descriptionKey (currently just installMethod, where "A1" alone doesn't
 * say what it means) — opens a plain bottom sheet listing every option's
 * full label + description. Deliberately a bare react-native Modal, not a
 * gesture-driven bottom sheet library: no second real case for that yet
 * (see the foundation's "abstract on the second occurrence" principle).
 */
export function SegmentedControl({ options, value, theme, resolveLabel, onChange }: SegmentedControlProps): ReactElement {
  const [detailsOpen, setDetailsOpen] = useState(false);
  const hasDetails = options.some((option) => option.descriptionKey !== undefined);

  useEffect(() => {
    if (value === undefined && options.length > 0) {
      onChange(options[0]!.value);
    }
    // Only ever runs at mount time — once the field has a value (from this
    // default or from the user), it's never undefined again on its own.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'flex-start', gap: theme.layout.spacingUnit / 2 }}>
      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          flexWrap: 'wrap',
          justifyContent: 'center',
          alignItems: 'center',
          gap: theme.layout.spacingUnit / 2,
          padding: theme.layout.spacingUnit / 2,
          borderRadius: theme.layout.cardRadius,
          backgroundColor: theme.colors.cardSurface,
        }}
      >
        {options.map((option) => (
          <Chip
            key={String(option.value)}
            label={resolveLabel(option.labelKey)}
            active={option.value === value}
            theme={theme}
            onPress={() => onChange(option.value)}
          />
        ))}
      </View>

      {hasDetails && (
        <>
          <Pressable
            onPress={() => setDetailsOpen(true)}
            style={{
              width: 32,
              height: 32,
              borderRadius: 16,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: theme.colors.cardSurface,
            }}
            testID="segmented-control-details-trigger"
          >
            <Text style={{ color: theme.colors.textSecondary, fontWeight: '700' }}>?</Text>
          </Pressable>

          <Modal
            visible={detailsOpen}
            transparent
            animationType="slide"
            onRequestClose={() => setDetailsOpen(false)}
          >
            <Pressable
              style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.5)' }}
              onPress={() => setDetailsOpen(false)}
              testID="segmented-control-details-backdrop"
            >
              <Pressable
                style={{
                  gap: theme.layout.spacingUnit * 1.5,
                  padding: theme.layout.spacingUnit * 2,
                  borderTopLeftRadius: theme.layout.cardRadius,
                  borderTopRightRadius: theme.layout.cardRadius,
                  backgroundColor: theme.colors.background,
                }}
                onPress={() => {}}
              >
                {options.map((option) => (
                  <View key={String(option.value)} style={{ gap: 2 }}>
                    <Text
                      style={{
                        fontFamily: theme.typography.uiFontFamily,
                        fontWeight: '700',
                        color: option.value === value ? theme.accent : theme.colors.textPrimary,
                      }}
                    >
                      {resolveLabel(option.labelKey)}
                    </Text>
                    {option.descriptionKey !== undefined && (
                      <Text
                        style={{
                          fontFamily: theme.typography.uiFontFamily,
                          fontSize: 13,
                          color: theme.colors.textSecondary,
                        }}
                      >
                        {resolveLabel(option.descriptionKey)}
                      </Text>
                    )}
                  </View>
                ))}
              </Pressable>
            </Pressable>
          </Modal>
        </>
      )}
    </View>
  );
}
