export type ConductorMaterial = 'Cu' | 'Al';
export type ConductorTemp = 20 | 70 | 90;
export type Insulation = 'PVC' | 'XLPE';

/**
 * Conductor resistivity (Ω·mm²/m) at a given temperature.
 * IEC 60228 / IEC 60364-5-52 Annex G: ρ(T) = ρ₂₀ · (1 + α·(T − 20)),
 * Cu: ρ₂₀ = 1/56, α = 0.00393; Al: ρ₂₀ = 1/35, α = 0.00403.
 * 20°C — for voltage_drop when the conductor temperature is known; 70/90°C —
 * the conductor's operating temperature under PVC/XLPE respectively (see
 * OPERATING_TEMP_BY_INSULATION, used by cable_sizing and pe_conductor).
 */
export const RESISTIVITY: Record<ConductorMaterial, Record<ConductorTemp, number>> = {
  Cu: { 20: 0.01786, 70: 0.02137, 90: 0.02277 },
  Al: { 20: 0.02857, 70: 0.03433, 90: 0.03663 },
};

export const OPERATING_TEMP_BY_INSULATION: Record<Insulation, ConductorTemp> = {
  PVC: 70,
  XLPE: 90,
};
