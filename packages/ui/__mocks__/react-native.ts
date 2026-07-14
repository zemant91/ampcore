import type { ReactNode } from 'react';

/**
 * A runtime-only substitute for react-native, used ONLY by jest (see
 * moduleNameMapper in the root jest.config.js) — react-native's source is
 * written with Flow syntax, which ts-jest can't transpile without the full
 * Metro/Babel preset (the one apps/electro/jest.config.js uses — it has its
 * own separate config, and this substitution doesn't touch it).
 *
 * Types are NOT substituted: ts-jest resolves 'react-native' types as usual,
 * through the real .d.ts files in node_modules — the substitution only
 * happens at execution time, so any mismatch with the real react-native API
 * is still caught by the type checker.
 */
export function View({ children }: { children?: ReactNode }): ReactNode {
  return children ?? null;
}

export function Text({ children }: { children?: ReactNode }): ReactNode {
  return children ?? null;
}

export function Pressable({ children }: { children?: ReactNode }): ReactNode {
  return children ?? null;
}

export function TextInput(): null {
  return null;
}

export function Modal({ children, visible }: { children?: ReactNode; visible?: boolean }): ReactNode {
  return visible ? (children ?? null) : null;
}
