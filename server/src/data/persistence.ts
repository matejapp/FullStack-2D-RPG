import type { Hero, Monster } from "@jobfair/shared";

const SAVE_KEY = "jobfair_run";

export interface SavedRun {
  runId: string;
  hero: Hero;
  encounters: Monster[];
  encounterIndex: number;
}

export function saveRun(data: SavedRun): void {
  localStorage.setItem(SAVE_KEY, JSON.stringify(data));
}

export function loadSavedRun(): SavedRun | null {
  const raw = localStorage.getItem(SAVE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as SavedRun;
  } catch {
    return null;
  }
}

export function clearSavedRun(): void {
  localStorage.removeItem(SAVE_KEY);
}
