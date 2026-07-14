import type { DataAccess, Values } from '@calc/engine';
import type { ConduitFillBucket } from '@calc/data';

export interface ConduitFillInputs extends Values {
  conduitDiameter: number; // conduit internal diameter, base: mm
  cableCount: number; // number of cables in the bundle
  /**
   * Sum of cross-section areas of all cables, base: mm². A variable-length
   * cable list is UI state (add/remove a cable), not something the engine's
   * shape supports: FieldDef/Values are built for one number per field, not
   * an array. The UI aggregates the areas itself (π·(d/2)² per cable) and
   * passes in the already-computed sum — the engine doesn't know about the
   * list at all, only about the three numbers the fill % is made of.
   */
  totalCableArea: number;
}

export interface ConduitFillOutputs extends Values {
  fillPercent: number; // conduit fill %
  fillLimit: number; // allowed % by cable count (see @calc/data CONDUIT_FILL_LIMIT_PERCENT)
}

function fillBucket(cableCount: number): ConduitFillBucket {
  if (cableCount === 1) return '1';
  if (cableCount === 2) return '2';
  return '3+';
}

export function solveConduitFill(inputs: ConduitFillInputs, data: DataAccess): ConduitFillOutputs {
  const { conduitDiameter, cableCount, totalCableArea } = inputs;
  const conduitArea = Math.PI * (conduitDiameter / 2) ** 2;
  const fillPercent = (totalCableArea / conduitArea) * 100;
  const fillLimit = data.lookup<number>('conduit/fill-limit-percent', fillBucket(cableCount));
  return { fillPercent, fillLimit };
}
