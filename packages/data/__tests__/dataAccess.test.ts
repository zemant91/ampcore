import { createDataAccess } from '../src/dataAccess';
import { RESISTIVITY } from '../src/tables/resistivity';
import { AMPACITY, GROUPING_FACTOR } from '../src/tables/ampacity';
import { STANDARD_BREAKER_RATINGS } from '../src/tables/breakers';
import { MOTOR_PRESETS } from '../src/tables/motors';

describe('createDataAccess(): keyed tables', () => {
  const data = createDataAccess();

  test('resistivity/table by material returns the Ω·mm²/m sub-record by temperature', () => {
    expect(data.lookup('resistivity/table', 'Cu')).toEqual(RESISTIVITY.Cu);
  });

  test('ampacity/iz by "material-insulation" returns the install-method table', () => {
    expect(data.lookup('ampacity/iz', 'Cu-PVC')).toEqual(AMPACITY['Cu-PVC']);
  });

  test('ampacity/grouping-factor: key is the group itself, value is the factor directly', () => {
    expect(data.lookup<number>('ampacity/grouping-factor', '3')).toBe(GROUPING_FACTOR['3']);
  });

  test('unknown key in a known table -> error', () => {
    expect(() => data.lookup('resistivity/table', 'Fe')).toThrow(/no entry/);
  });

  test('unknown table -> error', () => {
    expect(() => data.lookup('no/such/table', 'x')).toThrow(/no entry/);
  });
});

describe('createDataAccess(): whole tables (key ignored, returned in full)', () => {
  const data = createDataAccess();

  test('breakers/standard-ratings -> the entire rating range', () => {
    expect(data.lookup('breakers/standard-ratings', '*')).toEqual(STANDARD_BREAKER_RATINGS);
  });

  test('motors/presets -> the entire preset list', () => {
    expect(data.lookup('motors/presets', '*')).toEqual(MOTOR_PRESETS);
  });
});
