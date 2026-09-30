import {
  MAX_PROJECTS,
  MAX_STEPS,
  createProject,
  deleteProject,
  getProject,
  loadProjects,
  removeStep,
  saveStep,
} from '../projects';

const step = (name: string, v = 1) => ({
  calculatorId: 'ohms_law',
  calculatorName: name,
  timestamp: 1,
  values: { voltage: v },
  snapshot: { formulaLines: [], inputs: [], outputs: [], warnings: [] },
});

beforeEach(() => {
  loadProjects().forEach((p) => deleteProject(p.id));
});

test('createProject trims the name and rejects a blank one', () => {
  expect(createProject('   ')).toBeUndefined();
  expect(createProject('  Garage  ')?.name).toBe('Garage');
  expect(loadProjects()).toHaveLength(1);
});

test('createProject stops at MAX_PROJECTS', () => {
  for (let i = 0; i < MAX_PROJECTS; i++) createProject(`p${i}`);
  expect(createProject('one too many')).toBeUndefined();
});

test('saveStep appends, then overwrites the same step id in place', () => {
  const p = createProject('P')!;
  const a = saveStep(p.id, step('A'))!;
  saveStep(p.id, step('B'));
  saveStep(p.id, step('A2', 2), a);

  const steps = getProject(p.id)!.steps;
  expect(steps.map((s) => s.calculatorName)).toEqual(['A2', 'B']);
  expect(steps[0]!.values).toEqual({ voltage: 2 });
});

test('saveStep returns undefined for a missing project and when the project is full', () => {
  expect(saveStep('nope', step('A'))).toBeUndefined();
  const p = createProject('P')!;
  for (let i = 0; i < MAX_STEPS; i++) saveStep(p.id, step(`s${i}`));
  expect(saveStep(p.id, step('extra'))).toBeUndefined();
  // overwriting an existing step is still allowed when full
  const first = getProject(p.id)!.steps[0]!.id;
  expect(saveStep(p.id, step('edited'), first)).toBe(first);
});

test('removeStep drops just that step', () => {
  const p = createProject('P')!;
  const a = saveStep(p.id, step('A'))!;
  saveStep(p.id, step('B'));
  removeStep(p.id, a);
  expect(getProject(p.id)!.steps.map((s) => s.calculatorName)).toEqual(['B']);
});
