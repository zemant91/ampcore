import { MMKV } from 'react-native-mmkv';
import type { Values } from '@calc/engine';
import type { CalculationSnapshot } from '../state/buildCalculationSnapshot';

/** One saved calculation inside a project. */
export interface ProjectStep {
  id: string;
  calculatorId: string; // CalculatorDef.id — matches the calculator screen's route param
  calculatorName: string;
  timestamp: number;
  /** Raw user inputs, so the step can be reopened and edited (not the computed outputs) */
  values: Values;
  /** Already-resolved display strings, for the project screen and the PDF */
  snapshot: CalculationSnapshot;
}

export interface Project {
  id: string;
  name: string;
  createdAt: number;
  updatedAt: number;
  steps: ProjectStep[];
}

const KEY = 'electrocalc_projects';
export const MAX_PROJECTS = 50;
export const MAX_STEPS = 30;

const storage = new MMKV();

export function newId(): string {
  return Math.random().toString(36).slice(2, 10);
}

export function loadProjects(): Project[] {
  try {
    const raw = storage.getString(KEY);
    return raw ? (JSON.parse(raw) as Project[]) : [];
  } catch {
    return [];
  }
}

function write(projects: Project[]): void {
  storage.set(KEY, JSON.stringify(projects));
}

export function getProject(id: string): Project | undefined {
  return loadProjects().find((p) => p.id === id);
}

/** Returns the new project, or undefined when the name is blank or MAX_PROJECTS is reached. */
export function createProject(name: string): Project | undefined {
  const trimmed = name.trim();
  const prev = loadProjects();
  if (trimmed === '' || prev.length >= MAX_PROJECTS) return undefined;
  const now = Date.now();
  const project: Project = { id: newId(), name: trimmed, createdAt: now, updatedAt: now, steps: [] };
  write([project, ...prev]);
  return project;
}

export function deleteProject(id: string): void {
  write(loadProjects().filter((p) => p.id !== id));
}

/**
 * Saves a step into a project: overwrites the step with `stepId` if it
 * exists, otherwise appends. Returns the step's id, or undefined when the
 * project is gone or full (MAX_STEPS).
 */
export function saveStep(
  projectId: string,
  step: Omit<ProjectStep, 'id'>,
  stepId?: string,
): string | undefined {
  const projects = loadProjects();
  const project = projects.find((p) => p.id === projectId);
  if (!project) return undefined;

  const existing = stepId !== undefined && project.steps.some((s) => s.id === stepId);
  if (!existing && project.steps.length >= MAX_STEPS) return undefined;

  const id = existing ? stepId : newId();
  project.steps = existing
    ? project.steps.map((s) => (s.id === id ? { ...step, id } : s))
    : [...project.steps, { ...step, id }];
  project.updatedAt = Date.now();
  write(projects);
  return id;
}

export function removeStep(projectId: string, stepId: string): void {
  const projects = loadProjects();
  const project = projects.find((p) => p.id === projectId);
  if (!project) return;
  project.steps = project.steps.filter((s) => s.id !== stepId);
  project.updatedAt = Date.now();
  write(projects);
}
