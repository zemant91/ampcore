import type { ConductorMaterial, Insulation } from './resistivity';

export type InstallMethod = 'A1' | 'B1' | 'C' | 'E';
export type AmbientTemp = 20 | 25 | 30 | 35 | 40;
export type Grouping = '1' | '2' | '3' | '4' | '5' | '6+';

/** Standard cross-section range (mm²) by conductor material — IEC 60228 */
export const SECTIONS: Record<ConductorMaterial, number[]> = {
  Cu: [1.5, 2.5, 4, 6, 10, 16, 25, 35, 50, 70, 95, 120, 150, 185, 240],
  Al: [2.5, 4, 6, 10, 16, 25, 35, 50, 70, 95, 120, 150, 185, 240],
};

/**
 * Tabulated continuous current-carrying capacity Iz (A) at 30°C —
 * IEC 60364-5-52 Table B.52.3. Array index matches the cross-section index
 * in SECTIONS[material] (same array length).
 */
export const AMPACITY: Record<`${ConductorMaterial}-${Insulation}`, Record<InstallMethod, number[]>> = {
  'Cu-PVC': {
    A1: [13, 17.5, 23, 29, 39, 52, 66, 80, 97, 122, 146, 169, 193, 220, 253],
    B1: [15.5, 21, 28, 36, 50, 68, 89, 110, 134, 171, 207, 239, 275, 314, 361],
    C: [17.5, 24, 32, 41, 57, 76, 96, 119, 144, 184, 223, 259, 299, 341, 393],
    E: [22, 30, 40, 51, 70, 94, 119, 148, 180, 232, 282, 328, 379, 434, 500],
  },
  'Cu-XLPE': {
    A1: [16.5, 22, 30, 37, 50, 66, 84, 101, 122, 153, 184, 212, 240, 272, 314],
    B1: [19.5, 26, 35, 45, 61, 81, 106, 129, 155, 198, 238, 276, 319, 362, 418],
    C: [22, 30, 40, 51, 70, 94, 119, 148, 178, 226, 274, 318, 363, 413, 477],
    E: [26, 36, 49, 63, 86, 115, 149, 185, 225, 289, 352, 410, 473, 542, 628],
  },
  'Al-PVC': {
    A1: [13.5, 17.5, 22.5, 30, 40, 51, 62, 75, 94, 113, 130, 149, 169, 194],
    B1: [16, 22, 28, 39, 53, 70, 86, 104, 133, 161, 186, 215, 245, 283],
    C: [18.5, 25, 32, 44, 59, 73, 90, 110, 140, 170, 197, 227, 259, 299],
    E: [23, 31, 40, 54, 73, 92, 115, 140, 178, 216, 251, 290, 333, 384],
  },
  'Al-XLPE': {
    A1: [16, 21, 27, 36, 48, 62, 75, 90, 113, 136, 156, 178, 203, 233],
    B1: [19, 26, 33, 46, 63, 83, 102, 124, 158, 191, 222, 256, 292, 337],
    C: [22, 30, 38, 53, 70, 87, 107, 130, 165, 200, 232, 269, 307, 354],
    E: [27, 37, 46, 63, 85, 108, 135, 164, 211, 257, 300, 346, 397, 459],
  },
};

/** Temperature correction k1 (ambient ≠ 30°C) — Table B.52.14 */
export const AMBIENT_CORRECTION: Record<AmbientTemp, Record<Insulation, number>> = {
  20: { PVC: 1.12, XLPE: 1.08 },
  25: { PVC: 1.06, XLPE: 1.04 },
  30: { PVC: 1.0, XLPE: 1.0 },
  35: { PVC: 0.94, XLPE: 0.96 },
  40: { PVC: 0.87, XLPE: 0.91 },
};

/** Grouping correction factor k2 — Table B.52.17 */
export const GROUPING_FACTOR: Record<Grouping, number> = {
  '1': 1.0,
  '2': 0.8,
  '3': 0.7,
  '4': 0.65,
  '5': 0.6,
  '6+': 0.57,
};

export const INSTALL_METHOD_LABEL: Record<InstallMethod, string> = {
  A1: 'Conduit in thermally insulating wall',
  B1: 'Conduit on wall or in trunking',
  C: 'Clipped direct to masonry surface',
  E: 'Cable tray or free air',
};
