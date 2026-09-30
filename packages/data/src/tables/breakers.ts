/** Standard breaker rating range In (A) — EN 60898 */
export const STANDARD_BREAKER_RATINGS = [6, 10, 13, 16, 20, 25, 32, 40, 50, 63, 80, 100, 125];

export type TripCurve = 'B' | 'C' | 'D';

export interface TripCurveOption {
  letter: TripCurve;
  description: string;
  recommended?: true;
}

/**
 * Upper limit of the instantaneous (magnetic) trip range as a multiple of In,
 * IEC 60898-1: B 3–5, C 5–10, D 10–20 — the current that guarantees instant
 * tripping (used for the earth-loop Zs check).
 */
export const TRIP_MULTIPLE: Record<TripCurve, number> = { B: 5, C: 10, D: 20 };

export const TRIP_CURVES: TripCurveOption[] = [
  { letter: 'B', description: 'Lighting, long cable runs' },
  { letter: 'C', description: 'General use, most installations', recommended: true },
  { letter: 'D', description: 'Heavy motor starting, welding' },
];
