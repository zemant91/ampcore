export { createDataAccess, ALL_KEY } from './dataAccess';

export { RESISTIVITY, OPERATING_TEMP_BY_INSULATION } from './tables/resistivity';
export type { ConductorMaterial, ConductorTemp, Insulation } from './tables/resistivity';

export { SECTIONS, AMPACITY, AMBIENT_CORRECTION, GROUPING_FACTOR, INSTALL_METHOD_LABEL } from './tables/ampacity';
export type { InstallMethod, AmbientTemp, Grouping } from './tables/ampacity';

export { STANDARD_BREAKER_RATINGS, TRIP_CURVES, TRIP_MULTIPLE } from './tables/breakers';
export { STANDARD_TRANSFORMER_KVA } from './tables/transformers';
export type { TripCurve, TripCurveOption } from './tables/breakers';

export { CONDUIT_SIZES, CABLE_OD_PRESETS_MM, CONDUIT_FILL_LIMIT_PERCENT } from './tables/conduit';
export type { ConduitSize, ConduitFillBucket } from './tables/conduit';

export { PE_K_FACTORS, STANDARD_PE_SIZES } from './tables/peConductor';
export type { PeKFactorKey, PeKFactorOption } from './tables/peConductor';

export { MOTOR_PRESETS } from './tables/motors';
export type { MotorPreset } from './tables/motors';
