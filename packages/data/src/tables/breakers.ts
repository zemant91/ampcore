/** Standard breaker rating range In (A) — EN 60898 */
export const STANDARD_BREAKER_RATINGS = [6, 10, 13, 16, 20, 25, 32, 40, 50, 63, 80, 100, 125];

export type TripCurve = 'B' | 'C' | 'D';

export interface TripCurveOption {
  letter: TripCurve;
  description: string;
  recommended?: true;
}

export const TRIP_CURVES: TripCurveOption[] = [
  { letter: 'B', description: 'Lighting, long cable runs' },
  { letter: 'C', description: 'General use, most installations', recommended: true },
  { letter: 'D', description: 'Heavy motor starting, welding' },
];
