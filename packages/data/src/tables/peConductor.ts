export type PeKFactorKey = 'Cu_sep' | 'Cu_cable' | 'Al_cable';

export interface PeKFactorOption {
  key: PeKFactorKey;
  label: string;
  k: number;
}

/** Adiabatic formula coefficient k — IEC 60364-5-54 */
export const PE_K_FACTORS: PeKFactorOption[] = [
  { key: 'Cu_sep', label: 'Cu sep.', k: 143 },
  { key: 'Cu_cable', label: 'Cu cable', k: 115 },
  { key: 'Al_cable', label: 'Al cable', k: 76 },
];

/** Standard PE conductor cross-section range (mm²) */
export const STANDARD_PE_SIZES = [1.5, 2.5, 4, 6, 10, 16, 25, 35, 50, 70, 95, 120, 150, 185, 240, 300];
