import { DEFAULT_MAP, STORAGE_KEY } from './defaults';

export type DesignModeState = {
  theme: 'light' | 'dark';
  /** Token name → overridden value */
  overrides: Record<string, string>;
};

export function loadState(): DesignModeState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { theme: 'light', overrides: {} };
    const parsed = JSON.parse(raw) as Partial<DesignModeState>;
    return {
      theme: parsed.theme === 'dark' ? 'dark' : 'light',
      overrides: parsed.overrides && typeof parsed.overrides === 'object' ? parsed.overrides : {},
    };
  } catch {
    return { theme: 'light', overrides: {} };
  }
}

export function saveState(state: DesignModeState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function clearStorage() {
  localStorage.removeItem(STORAGE_KEY);
}

export function isChanged(name: string, value: string | undefined): boolean {
  if (value == null || value === '') return false;
  return value.trim() !== DEFAULT_MAP[name]?.trim();
}
