export interface ConduitSize {
  label: string;
  internalDiameterMm: number;
}

/** Cable conduits (EN 50086-2, medium duty), internal diameter */
export const CONDUIT_SIZES: ConduitSize[] = [
  { label: 'RL16', internalDiameterMm: 13.0 },
  { label: 'RL20', internalDiameterMm: 16.8 },
  { label: 'RL25', internalDiameterMm: 21.0 },
  { label: 'RL32', internalDiameterMm: 27.3 },
  { label: 'RL40', internalDiameterMm: 34.8 },
  { label: 'RL50', internalDiameterMm: 42.7 },
  { label: 'RL63', internalDiameterMm: 54.1 },
];

/** Common cable outer diameters (European catalog, mm) */
export const CABLE_OD_PRESETS_MM = [7.0, 8.5, 10.0, 13.0, 16.0];

export type ConduitFillBucket = '1' | '2' | '3+';

/** Allowed conduit fill % by cable count — typical NEC/IEC practice */
export const CONDUIT_FILL_LIMIT_PERCENT: Record<ConduitFillBucket, number> = {
  '1': 53,
  '2': 31,
  '3+': 40,
};
