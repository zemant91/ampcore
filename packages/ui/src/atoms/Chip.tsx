import type { ReactElement } from 'react';
import { Pressable, Text } from 'react-native';
import type { ThemeTokens } from '../tokens/theme';

export interface ChipProps {
  label: string;
  active?: boolean;
  interactive?: boolean;
  theme: ThemeTokens;
  onPress?: () => void;
}

/** Non-clickable chip (formula up top) — same atom, `interactive={false}` */
export function Chip({ label, active, interactive = true, theme, onPress }: ChipProps): ReactElement {
  const style = {
    // Sized to content (not flex:1 dividing the row equally) so a
    // SegmentedControl can flexWrap: short/long labels and 5-6+ options
    // wrap onto their own lines instead of squeezing into equal slivers.
    minWidth: 44,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    paddingVertical: theme.layout.spacingUnit,
    paddingHorizontal: theme.layout.spacingUnit * 1.5,
    borderRadius: theme.layout.cardRadius - theme.layout.spacingUnit,
    backgroundColor: active ? theme.accent : 'transparent',
  };
  const textStyle = {
    fontFamily: theme.typography.uiFontFamily,
    fontWeight: active ? ('700' as const) : ('500' as const),
    color: active ? theme.colors.background : theme.colors.textSecondary,
  };

  return (
    <Pressable style={style} onPress={interactive ? onPress : undefined} disabled={!interactive}>
      <Text style={textStyle}>{label}</Text>
    </Pressable>
  );
}
