import { applyDynamicFieldChange } from '../dynamicFieldEviction';

const DYNAMIC_IDS = ['voltage', 'current', 'resistance', 'power'];

describe('applyDynamicFieldChange: calculators without dynamicRoleFieldIds', () => {
  test('undefined dynamicRoleFieldIds -> plain merge, order untouched', () => {
    const result = applyDynamicFieldChange({ values: { a: 1 }, order: [] }, undefined, 'b', 2);
    expect(result).toEqual({ values: { a: 1, b: 2 }, order: [] });
  });

  test('fieldId not in dynamicRoleFieldIds -> plain merge, order untouched', () => {
    const result = applyDynamicFieldChange({ values: {}, order: [] }, DYNAMIC_IDS, 'system', 'dc');
    expect(result).toEqual({ values: { system: 'dc' }, order: [] });
  });
});

describe('applyDynamicFieldChange: ohms_law-style 2-of-4 fields', () => {
  test('filling 1 of 4 -> just recorded, no eviction', () => {
    const result = applyDynamicFieldChange({ values: {}, order: [] }, DYNAMIC_IDS, 'voltage', 12);
    expect(result).toEqual({ values: { voltage: 12 }, order: ['voltage'] });
  });

  test('filling a 2nd -> both kept, order tracks fill sequence', () => {
    const afterFirst = applyDynamicFieldChange({ values: {}, order: [] }, DYNAMIC_IDS, 'voltage', 12);
    const afterSecond = applyDynamicFieldChange(afterFirst, DYNAMIC_IDS, 'current', 2);
    expect(afterSecond).toEqual({ values: { voltage: 12, current: 2 }, order: ['voltage', 'current'] });
  });

  test('filling a 3rd evicts the OLDEST filled field, not the newest', () => {
    let state = applyDynamicFieldChange({ values: {}, order: [] }, DYNAMIC_IDS, 'voltage', 12);
    state = applyDynamicFieldChange(state, DYNAMIC_IDS, 'current', 2);
    state = applyDynamicFieldChange(state, DYNAMIC_IDS, 'resistance', 6);

    // voltage was filled first -> evicted; current/resistance (the two most recent) remain
    expect(state.values.voltage).toBeUndefined();
    expect(state.values.current).toBe(2);
    expect(state.values.resistance).toBe(6);
    expect(state.order).toEqual(['current', 'resistance']);
  });

  test('re-setting an already-filled field moves it to "most recent", not just a value overwrite', () => {
    let state = applyDynamicFieldChange({ values: {}, order: [] }, DYNAMIC_IDS, 'voltage', 12);
    state = applyDynamicFieldChange(state, DYNAMIC_IDS, 'current', 2);
    // re-touch voltage (still the oldest by fill time, but now "renewed")
    state = applyDynamicFieldChange(state, DYNAMIC_IDS, 'voltage', 24);
    // filling power now should evict 'current' (the actual oldest untouched one), not voltage
    state = applyDynamicFieldChange(state, DYNAMIC_IDS, 'power', 100);

    expect(state.values.current).toBeUndefined();
    expect(state.values.voltage).toBe(24);
    expect(state.values.power).toBe(100);
    expect(state.order).toEqual(['voltage', 'power']);
  });

  test('clearing a field (value=undefined) drops it from the fill order without evicting anything else', () => {
    let state = applyDynamicFieldChange({ values: {}, order: [] }, DYNAMIC_IDS, 'voltage', 12);
    state = applyDynamicFieldChange(state, DYNAMIC_IDS, 'current', 2);
    state = applyDynamicFieldChange(state, DYNAMIC_IDS, 'voltage', undefined);

    expect(state.values.voltage).toBeUndefined();
    expect(state.values.current).toBe(2);
    expect(state.order).toEqual(['current']);
  });
});
