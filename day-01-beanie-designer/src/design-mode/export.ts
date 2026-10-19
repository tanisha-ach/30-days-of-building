import { DEFAULT_MAP, STORAGE_KEY } from './defaults';
import type { DesignModeState } from './storage';

export type ExportPayload = {
  theme: 'light' | 'dark' | 'both';
  tokens: Record<string, { from: string; to: string }>;
};

export function buildExport(state: DesignModeState): ExportPayload {
  const tokens: ExportPayload['tokens'] = {};
  for (const [name, to] of Object.entries(state.overrides)) {
    const from = DEFAULT_MAP[name];
    if (from == null) continue;
    if (to.trim() === from.trim()) continue;
    tokens[name] = { from, to };
  }
  return {
    theme: state.theme === 'dark' ? 'dark' : 'light',
    tokens,
  };
}

export function exportJson(state: DesignModeState): string {
  return JSON.stringify(buildExport(state), null, 2);
}

export function exportPrompt(state: DesignModeState): string {
  const json = exportJson(state);
  return [
    'Apply these design token changes as the new defaults in the token files, then remove Design Mode completely (its folder, its import, the ?design flag and its localStorage key). Keep /styleguide and tokens:check. Change nothing else. Changes:',
    json,
  ].join(' ');
}

export function parseImport(raw: string): DesignModeState | { error: string } {
  try {
    const data = JSON.parse(raw) as Partial<ExportPayload> & { overrides?: Record<string, string> };
    const overrides: Record<string, string> = {};

    if (data.tokens && typeof data.tokens === 'object') {
      for (const [name, entry] of Object.entries(data.tokens)) {
        if (entry && typeof entry === 'object' && typeof (entry as { to?: string }).to === 'string') {
          overrides[name] = (entry as { to: string }).to;
        } else if (typeof entry === 'string') {
          overrides[name] = entry;
        }
      }
    } else if (data.overrides && typeof data.overrides === 'object') {
      Object.assign(overrides, data.overrides);
    } else {
      return { error: 'JSON must include a "tokens" map.' };
    }

    const theme = data.theme === 'dark' || data.theme === 'both' ? 'dark' : 'light';
    return { theme: theme === 'dark' ? 'dark' : 'light', overrides };
  } catch {
    return { error: 'Invalid JSON.' };
  }
}

export { STORAGE_KEY };
