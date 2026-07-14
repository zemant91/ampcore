import type { ComponentType, ReactElement } from 'react';
import { Zap, ArrowLeftRight, Cable, TrendingDown, Settings2, Power, Activity, Shield, Cpu } from 'lucide-react-native';
import ConduitFillSvg from '../../assets/icons/conduit-fill.svg';
import PeConductorSvg from '../../assets/icons/pe-conductor.svg';

export interface IconProps {
  size?: number;
  color?: string;
}

/**
 * The two icons the web prototype drew as inline <svg> (not from lucide) —
 * ported verbatim (same viewBox/geometry) as standalone .svg assets, wired
 * through react-native-svg-transformer (see metro.config.js). No stroke
 * baked into the file itself, so the `stroke` prop set here at usage time
 * cascades to every child element via normal SVG inheritance.
 */
function ConduitFillIcon({ size = 18, color = '#EFF3F8' }: IconProps): ReactElement {
  return <ConduitFillSvg width={size} height={size} stroke={color} />;
}

function PeConductorIcon({ size = 18, color = '#EFF3F8' }: IconProps): ReactElement {
  return <PeConductorSvg width={size} height={size} stroke={color} />;
}

/**
 * Keyed by id — CalculatorDef.id for real calculators (ohms_law,
 * cable_sizing, ...) and UpcomingCalculator.icon for "soon" cards (the
 * latter isn't itself a calculator id, so it keeps its own short key:
 * pulse/shield/transformer, set in brand.ts). One shared lookup either way.
 */
export const HOME_ICONS: Record<string, ComponentType<IconProps>> = {
  ohms_law: Zap,
  kw_to_amps: ArrowLeftRight,
  cable_sizing: Cable,
  voltage_drop: TrendingDown,
  conduit_fill: ConduitFillIcon,
  motor_current: Settings2,
  breaker_selection: Power,
  pe_conductor: PeConductorIcon,
  pulse: Activity,
  shield: Shield,
  transformer: Cpu,
};
