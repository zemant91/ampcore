export interface MotorPreset {
  kW: number;
  efficiency: number;
  cosPhi: number;
}

/** Typical efficiency/cosφ values by power — IEC 60034, class IE2 */
export const MOTOR_PRESETS: MotorPreset[] = [
  { kW: 0.55, efficiency: 0.72, cosPhi: 0.73 },
  { kW: 1.5, efficiency: 0.8, cosPhi: 0.77 },
  { kW: 3, efficiency: 0.84, cosPhi: 0.82 },
  { kW: 7.5, efficiency: 0.88, cosPhi: 0.84 },
  { kW: 15, efficiency: 0.91, cosPhi: 0.87 },
  { kW: 30, efficiency: 0.92, cosPhi: 0.89 },
];
