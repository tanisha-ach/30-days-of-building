import { ALL_TOKENS, DEFAULT_MAP } from './defaults';
import type { DesignModeState } from './storage';

export function applyTheme(theme: 'light' | 'dark') {
  if (theme === 'dark') document.documentElement.setAttribute('data-theme', 'dark');
  else document.documentElement.removeAttribute('data-theme');
}

export function applyToken(name: string, value: string) {
  document.documentElement.style.setProperty(name, value);
}

export function clearToken(name: string) {
  document.documentElement.style.removeProperty(name);
}

/** Apply overrides; anything not overridden is cleared so CSS file defaults return. */
export function applyState(state: DesignModeState) {
  applyTheme(state.theme);
  const root = document.documentElement;
  for (const t of ALL_TOKENS) {
    const v = state.overrides[t.name];
    if (v != null && v !== '' && v.trim() !== DEFAULT_MAP[t.name]?.trim()) {
      root.style.setProperty(t.name, v);
    } else {
      root.style.removeProperty(t.name);
    }
  }
}

export function resetToken(name: string, state: DesignModeState): DesignModeState {
  const next = { ...state, overrides: { ...state.overrides } };
  delete next.overrides[name];
  clearToken(name);
  return next;
}

export function resetAll(): DesignModeState {
  for (const t of ALL_TOKENS) clearToken(t.name);
  applyTheme('light');
  return { theme: 'light', overrides: {} };
}
