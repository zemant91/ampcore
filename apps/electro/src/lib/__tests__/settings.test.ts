import {
  isOnboardingCompleted,
  getUnitsSystem,
  setUnitsSystem,
  completeOnboarding,
} from '../settings';

describe('settings: units system', () => {
  test('getUnitsSystem falls back to the given default when nothing is stored', () => {
    expect(getUnitsSystem('metric')).toBe('metric');
  });

  test('setUnitsSystem persists the choice', () => {
    setUnitsSystem('imperial');
    expect(getUnitsSystem('metric')).toBe('imperial');
  });
});

describe('completeOnboarding: the single action the last onboarding slide takes', () => {
  test('not completed before completeOnboarding() is ever called', () => {
    expect(isOnboardingCompleted()).toBe(false);
  });

  test('completeOnboarding persists the units choice AND sets the completed flag, together', () => {
    completeOnboarding('imperial');

    expect(isOnboardingCompleted()).toBe(true);
    expect(getUnitsSystem('metric')).toBe('imperial');
  });

  test('completeOnboarding with "metric" persists metric, not just the previous value', () => {
    completeOnboarding('metric');

    expect(isOnboardingCompleted()).toBe(true);
    expect(getUnitsSystem('imperial')).toBe('metric');
  });
});
