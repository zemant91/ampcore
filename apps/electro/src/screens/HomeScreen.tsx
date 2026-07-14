import type { ReactElement } from 'react';
import { useMemo, useState } from 'react';
import { FlatList, Pressable, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, Lock, Settings } from 'lucide-react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { buildTheme } from '@calc/ui';
import type { CalculatorDef } from '@calc/engine';
import type { RootStackParamList } from '../navigation/types';
import { electro } from '../brand';
import { resolveLabel } from '../i18n/resolveLabel';
import { HOME_ICONS } from '../icons';

/** Not a real category — marks the flat search-results list so renderItem skips the category caption */
const SEARCH_RESULTS = '__search_results__';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

const theme = buildTheme(electro.theme.accent);

interface CategorySection {
  category: string;
  items: CalculatorDef[];
}

function groupByCategory(calculators: CalculatorDef[]): CategorySection[] {
  const order: string[] = [];
  const groups = new Map<string, CalculatorDef[]>();
  for (const calc of calculators) {
    if (!groups.has(calc.category)) {
      groups.set(calc.category, []);
      order.push(calc.category);
    }
    groups.get(calc.category)!.push(calc);
  }
  return order.map((category) => ({ category, items: groups.get(category)! }));
}

const cardStyle = {
  flexDirection: 'row' as const,
  alignItems: 'center' as const,
  minHeight: theme.layout.minFieldHeight,
  paddingHorizontal: theme.layout.spacingUnit * 2,
  gap: theme.layout.spacingUnit * 1.5,
  borderRadius: theme.layout.cardRadius,
  backgroundColor: theme.colors.cardSurface,
};

const iconBoxStyle = {
  width: 40,
  height: 40,
  borderRadius: 10,
  alignItems: 'center' as const,
  justifyContent: 'center' as const,
  // 6-digit accent + alpha suffix — react-native accepts #RRGGBBAA directly,
  // no need to parse the hex into rgba() by hand.
  backgroundColor: `${theme.accent}20`,
};

/** Renders nothing if the id has no registered icon, rather than crashing on a lookup miss */
function CalculatorIcon({ iconId, muted }: { iconId: string; muted?: boolean }): ReactElement | null {
  const Icon = HOME_ICONS[iconId];
  if (!Icon) return null;
  return (
    <View style={muted ? { ...iconBoxStyle, backgroundColor: theme.colors.cardBorderMuted } : iconBoxStyle}>
      <Icon size={18} color={muted ? theme.colors.textSecondary : theme.accent} />
    </View>
  );
}

/**
 * A generic screen: sections and cards are built from electro.calculators/
 * upcoming, not described by hand (in the web prototype, CATEGORIES was
 * hardcoded right in Home.tsx — here the single source of truth is
 * BrandConfig, exactly as @calc/engine intends).
 */
export function HomeScreen({ navigation }: Props): ReactElement {
  const [query, setQuery] = useState('');
  const sections = useMemo(() => groupByCategory(electro.calculators), []);

  const trimmedQuery = query.trim().toLowerCase();
  const visibleSections = useMemo(() => {
    if (trimmedQuery === '') return sections;
    const matches = electro.calculators.filter((calc) => {
      const haystack = `${resolveLabel(calc.titleKey)} ${resolveLabel(calc.descriptionKey)}`.toLowerCase();
      return haystack.includes(trimmedQuery);
    });
    return [{ category: SEARCH_RESULTS, items: matches }];
  }, [trimmedQuery, sections]);
  const isSearching = trimmedQuery !== '';

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: theme.colors.background }}
      edges={['top', 'left', 'right']}
      testID="home-screen"
    >
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: theme.layout.spacingUnit,
          paddingHorizontal: theme.layout.spacingUnit * 2,
          paddingTop: theme.layout.spacingUnit * 2,
        }}
      >
        <Text
          style={{
            color: theme.colors.textPrimary,
            fontFamily: theme.typography.uiFontFamily,
            fontSize: 22,
            fontWeight: '700',
          }}
        >
          {electro.displayName}
        </Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: theme.layout.spacingUnit }}>
          <Pressable
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 4,
              paddingHorizontal: theme.layout.spacingUnit,
              paddingVertical: 6,
              borderRadius: 8,
              backgroundColor: theme.accent,
            }}
            onPress={() => navigation.navigate('Paywall')}
            testID="home-plan-badge"
          >
            <Lock size={11} color={theme.colors.background} />
            <Text style={{ fontSize: 10, fontWeight: '700', color: theme.colors.background }}>FREE PLAN</Text>
          </Pressable>
          <Pressable
            style={{
              width: 32,
              height: 32,
              borderRadius: 9,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: theme.colors.cardSurface,
            }}
            onPress={() => navigation.navigate('Menu')}
            testID="home-menu-button"
          >
            <Settings size={16} color={theme.colors.textSecondary} />
          </Pressable>
        </View>
      </View>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: theme.layout.spacingUnit,
          margin: theme.layout.spacingUnit * 2,
          marginBottom: theme.layout.spacingUnit,
          paddingHorizontal: theme.layout.spacingUnit * 1.5,
          borderRadius: theme.layout.cardRadius,
          backgroundColor: theme.colors.cardSurface,
        }}
      >
        <Search size={16} color={theme.colors.textSecondary} />
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search calculators..."
          placeholderTextColor={theme.colors.textSecondary}
          style={{
            flex: 1,
            paddingVertical: theme.layout.spacingUnit * 1.5,
            color: theme.colors.textPrimary,
            fontFamily: theme.typography.uiFontFamily,
            fontSize: 15,
          }}
          testID="home-search-input"
        />
      </View>
      <FlatList
        data={visibleSections}
        keyExtractor={(section) => section.category}
        contentContainerStyle={{
          paddingHorizontal: theme.layout.spacingUnit * 2,
          paddingBottom: theme.layout.spacingUnit * 2,
          gap: theme.layout.spacingUnit * 2,
        }}
        renderItem={({ item: section }) => (
          <View style={{ gap: theme.layout.spacingUnit }} testID={`home-category-${section.category}`}>
            {section.category !== SEARCH_RESULTS && (
              <Text
                style={{
                  color: theme.colors.textSecondary,
                  fontFamily: theme.typography.uiFontFamily,
                  fontSize: 12,
                  fontWeight: '700',
                  letterSpacing: 1,
                  textTransform: 'uppercase',
                }}
              >
                {resolveLabel(`category.${section.category}`)}
              </Text>
            )}
            {section.category === SEARCH_RESULTS && section.items.length === 0 && (
              <Text
                style={{ color: theme.colors.textSecondary, fontFamily: theme.typography.uiFontFamily, fontSize: 14 }}
                testID="home-search-empty"
              >
                No calculators found
              </Text>
            )}
            <View style={{ gap: theme.layout.spacingUnit }}>
              {section.items.map((calc) => (
                <Pressable
                  key={calc.id}
                  style={cardStyle}
                  onPress={() => navigation.navigate('Calculator', { calculatorId: calc.id })}
                  testID={`home-calculator-${calc.id}`}
                >
                  <CalculatorIcon iconId={calc.id} />
                  <View style={{ flex: 1, gap: 4 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                      <Text
                        style={{
                          color: theme.colors.textPrimary,
                          fontFamily: theme.typography.uiFontFamily,
                          fontSize: 16,
                          fontWeight: '700',
                        }}
                      >
                        {resolveLabel(calc.titleKey)}
                      </Text>
                      {calc.tier === 'pro' && (
                        <Lock size={12} color={theme.colors.textSecondary} testID={`home-calculator-${calc.id}-pro-lock`} />
                      )}
                    </View>
                    <Text
                      style={{ color: theme.colors.textSecondary, fontFamily: theme.typography.uiFontFamily, fontSize: 13 }}
                    >
                      {resolveLabel(calc.descriptionKey)}
                    </Text>
                  </View>
                </Pressable>
              ))}
            </View>
          </View>
        )}
        ListFooterComponent={
          !isSearching && electro.upcoming && electro.upcoming.length > 0 ? (
            <View style={{ gap: theme.layout.spacingUnit }} testID="home-upcoming">
              <Text
                style={{
                  color: theme.colors.textSecondary,
                  fontFamily: theme.typography.uiFontFamily,
                  fontSize: 12,
                  fontWeight: '700',
                  letterSpacing: 1,
                  textTransform: 'uppercase',
                }}
              >
                Soon
              </Text>
              {electro.upcoming.map((item) => (
                <View
                  key={item.id}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: theme.layout.spacingUnit * 1.5,
                    padding: theme.layout.spacingUnit * 2,
                    borderRadius: theme.layout.cardRadius,
                    borderWidth: 1,
                    borderStyle: 'dashed',
                    borderColor: theme.colors.cardBorderMuted,
                  }}
                  testID={`home-upcoming-${item.id}`}
                >
                  <CalculatorIcon iconId={item.icon} muted />
                  <View style={{ flex: 1, gap: 4 }}>
                    <Text style={{ color: theme.colors.textSecondary, fontFamily: theme.typography.uiFontFamily, fontSize: 16 }}>
                      {resolveLabel(item.titleKey)}
                    </Text>
                    <Text style={{ color: theme.colors.textSecondary, fontFamily: theme.typography.uiFontFamily, fontSize: 13 }}>
                      {resolveLabel(item.descriptionKey)}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          ) : null
        }
      />
    </SafeAreaView>
  );
}
