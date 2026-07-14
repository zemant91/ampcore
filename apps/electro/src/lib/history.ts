import { MMKV } from 'react-native-mmkv';

export interface HistoryField {
  label: string;
  value: string;
  unit: string;
}

export interface HistoryEntry {
  id: string;
  timestamp: number;
  calculatorId: string; // CalculatorDef.id, e.g. "ohms_law" — matches the calculator screen's route param
  calculatorName: string;
  fields: HistoryField[]; // fields the user filled in, for the list summary
  result: HistoryField; // the primary result (the calculator's first output field)
}

const KEY = 'electrocalc_history';
const MAX_ROWS = 120;

const storage = new MMKV();

export function loadHistory(): HistoryEntry[] {
  try {
    const raw = storage.getString(KEY);
    return raw ? (JSON.parse(raw) as HistoryEntry[]) : [];
  } catch {
    return [];
  }
}

export function saveEntry(entry: HistoryEntry): void {
  const prev = loadHistory();
  storage.set(KEY, JSON.stringify([entry, ...prev].slice(0, MAX_ROWS)));
}

export function deleteEntry(id: string): void {
  storage.set(KEY, JSON.stringify(loadHistory().filter((e) => e.id !== id)));
}

export function clearHistory(): void {
  storage.delete(KEY);
}
