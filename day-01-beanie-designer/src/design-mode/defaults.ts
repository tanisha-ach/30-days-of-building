export type TokenKind = 'color' | 'length' | 'number' | 'font' | 'shadow';

export type TokenDef = {
  name: string;
  label: string;
  kind: TokenKind;
  /** Authored default (used as export "from" and reset target). */
  defaultValue: string;
  /** Optional min/max for length/number sliders (px for length). */
  min?: number;
  max?: number;
  step?: number;
};

export type TokenSection = {
  id: string;
  title: string;
  tokens: TokenDef[];
};

/** Contrast pairs checked in the Colors section (WCAG AA). */
export const CONTRAST_PAIRS: { fg: string; bg: string; label: string }[] = [
  { fg: '--color-text', bg: '--color-bg', label: 'Text / bg' },
  { fg: '--color-text-muted', bg: '--color-bg', label: 'Muted / bg' },
  { fg: '--color-text', bg: '--color-surface', label: 'Text / surface' },
  { fg: '--color-on-primary', bg: '--color-primary', label: 'On-primary / primary' },
  { fg: '--color-on-secondary', bg: '--color-secondary', label: 'On-secondary / secondary' },
  { fg: '--color-on-danger', bg: '--color-danger', label: 'On-danger / danger' },
  { fg: '--color-link', bg: '--color-bg', label: 'Link / bg' },
  { fg: '--color-danger', bg: '--color-danger-subtle', label: 'Danger / subtle' },
];

export const STORAGE_KEY = 'beanie-design-mode-v5';

export const SECTIONS: TokenSection[] = [
  {
    id: 'seeds',
    title: 'Seed colors',
    tokens: [
      { name: '--color-neutral-seed', label: 'Neutral', kind: 'color', defaultValue: '#c9a582' },
      { name: '--color-brand-seed', label: 'Brand', kind: 'color', defaultValue: '#551100' },
      { name: '--color-success-seed', label: 'Accent / success', kind: 'color', defaultValue: '#4a5747' },
      { name: '--color-warning-seed', label: 'Warning', kind: 'color', defaultValue: '#cb7834' },
      { name: '--color-danger-seed', label: 'Danger', kind: 'color', defaultValue: '#ea3546' },
      { name: '--color-info-seed', label: 'Info', kind: 'color', defaultValue: '#541e0a' },
    ],
  },
  {
    id: 'semantic-colors',
    title: 'Semantic colors',
    tokens: [
      { name: '--color-bg', label: 'Background', kind: 'color', defaultValue: '#c9a582' },
      { name: '--color-surface', label: 'Surface', kind: 'color', defaultValue: '#f1e8df' },
      { name: '--color-surface-raised', label: 'Surface raised', kind: 'color', defaultValue: '#f0e6de' },
      { name: '--color-surface-muted', label: 'Surface muted', kind: 'color', defaultValue: '#e8d4bf' },
      { name: '--color-text', label: 'Text', kind: 'color', defaultValue: '#2d1605' },
      { name: '--color-text-muted', label: 'Text muted', kind: 'color', defaultValue: '#5c4a3a' },
      { name: '--color-text-inverse', label: 'Text inverse', kind: 'color', defaultValue: '#f3ebe0' },
      { name: '--color-link', label: 'Link', kind: 'color', defaultValue: '#5c7457' },
      { name: '--color-border', label: 'Border', kind: 'color', defaultValue: '#b8956e' },
      { name: '--color-border-strong', label: 'Border strong', kind: 'color', defaultValue: '#5c7457' },
      { name: '--color-focus-ring', label: 'Focus ring', kind: 'color', defaultValue: '#5c7457' },
      { name: '--color-primary', label: 'Primary', kind: 'color', defaultValue: '#510001' },
      { name: '--color-primary-hover', label: 'Primary hover', kind: 'color', defaultValue: 'color-mix(in oklch, #510001 82%, black)' },
      { name: '--color-primary-active', label: 'Primary active', kind: 'color', defaultValue: 'color-mix(in oklch, var(--color-primary) 70%, black)' },
      { name: '--color-on-primary', label: 'On primary', kind: 'color', defaultValue: '#fffaf4' },
      { name: '--color-primary-subtle', label: 'Primary subtle', kind: 'color', defaultValue: 'color-mix(in oklch, #510001 12%, #fffaf4)' },
      { name: '--color-secondary', label: 'Secondary', kind: 'color', defaultValue: '#2d1605' },
      { name: '--color-on-secondary', label: 'On secondary', kind: 'color', defaultValue: '#fffaf4' },
      { name: '--color-danger', label: 'Danger', kind: 'color', defaultValue: '#510001' },
      { name: '--color-danger-subtle', label: 'Danger subtle', kind: 'color', defaultValue: 'color-mix(in oklch, #510001 10%, #fffaf4)' },
      { name: '--color-success', label: 'Success', kind: 'color', defaultValue: 'var(--color-success-500)' },
      { name: '--color-warning', label: 'Warning', kind: 'color', defaultValue: 'var(--color-warning-500)' },
      { name: '--color-info', label: 'Info', kind: 'color', defaultValue: 'var(--color-info-500)' },
    ],
  },
  {
    id: 'spacing',
    title: 'Spacing',
    tokens: [
      { name: '--space-unit', label: 'Space unit', kind: 'length', defaultValue: '4px', min: 2, max: 8, step: 0.5 },
      { name: '--button-padding-x', label: 'Button padding X', kind: 'length', defaultValue: '8px', min: 4, max: 32, step: 1 },
      { name: '--button-padding-y', label: 'Button padding Y', kind: 'length', defaultValue: 'var(--space-2-25)', min: 4, max: 24, step: 1 },
      { name: '--input-padding-x', label: 'Input padding X', kind: 'length', defaultValue: 'var(--space-3)', min: 4, max: 24, step: 1 },
      { name: '--input-padding-y', label: 'Input padding Y', kind: 'length', defaultValue: 'var(--space-2)', min: 4, max: 20, step: 1 },
      { name: '--card-padding', label: 'Card padding', kind: 'length', defaultValue: '16px', min: 8, max: 40, step: 1 },
      { name: '--modal-padding-x', label: 'Modal padding X', kind: 'length', defaultValue: 'var(--space-7)', min: 8, max: 48, step: 1 },
      { name: '--modal-padding-y', label: 'Modal padding Y', kind: 'length', defaultValue: 'var(--space-5)', min: 8, max: 40, step: 1 },
    ],
  },
  {
    id: 'radius',
    title: 'Radius',
    tokens: [
      { name: '--radius-base', label: 'Radius base', kind: 'length', defaultValue: '4px', min: 0, max: 24, step: 1 },
      { name: '--button-radius', label: 'Button radius', kind: 'length', defaultValue: 'var(--radius-full)', min: 0, max: 999, step: 1 },
      { name: '--input-radius', label: 'Input radius', kind: 'length', defaultValue: 'var(--radius-md)', min: 0, max: 24, step: 1 },
      { name: '--card-radius', label: 'Card radius', kind: 'length', defaultValue: 'var(--radius-xl)', min: 0, max: 32, step: 1 },
      { name: '--modal-radius', label: 'Modal radius', kind: 'length', defaultValue: 'var(--radius-3xl)', min: 0, max: 40, step: 1 },
      { name: '--seg-radius', label: 'Seg radius', kind: 'length', defaultValue: 'var(--radius-lg)', min: 0, max: 24, step: 1 },
      { name: '--chip-radius', label: 'Chip radius', kind: 'length', defaultValue: 'var(--radius-md)', min: 0, max: 24, step: 1 },
    ],
  },
  {
    id: 'typography',
    title: 'Typography',
    tokens: [
      {
        name: '--font-sans',
        label: 'Body font',
        kind: 'font',
        defaultValue: "Nunito, system-ui, -apple-system, 'Segoe UI', sans-serif",
      },
      {
        name: '--font-display',
        label: 'Display font',
        kind: 'font',
        defaultValue: 'Quicksand, Nunito, system-ui, sans-serif',
      },
      { name: '--font-size-base', label: 'Base size', kind: 'length', defaultValue: '14px', min: 12, max: 20, step: 0.5 },
      { name: '--type-scale', label: 'Type scale', kind: 'number', defaultValue: '1.2', min: 1.05, max: 1.4, step: 0.01 },
      { name: '--font-weight-regular', label: 'Weight regular', kind: 'number', defaultValue: '400', min: 300, max: 500, step: 100 },
      { name: '--font-weight-medium', label: 'Weight medium', kind: 'number', defaultValue: '500', min: 400, max: 600, step: 100 },
      { name: '--font-weight-semibold', label: 'Weight semibold', kind: 'number', defaultValue: '600', min: 500, max: 700, step: 100 },
      { name: '--font-weight-bold', label: 'Weight bold', kind: 'number', defaultValue: '700', min: 600, max: 800, step: 100 },
    ],
  },
  {
    id: 'shadows-border',
    title: 'Shadows & border',
    tokens: [
      {
        name: '--shadow-sm',
        label: 'Shadow sm',
        kind: 'shadow',
        defaultValue: '0 1px 3px var(--shadow-color-neutral)',
      },
      {
        name: '--shadow-md',
        label: 'Shadow md',
        kind: 'shadow',
        defaultValue:
          '0 1px 2px color-mix(in oklch, var(--color-neutral-seed) 4%, transparent), 0 14px 32px -16px var(--shadow-color-brand)',
      },
      {
        name: '--shadow-lg',
        label: 'Shadow lg',
        kind: 'shadow',
        defaultValue: '0 30px 80px -20px var(--shadow-color-brand-lg)',
      },
      { name: '--border-width', label: 'Border width', kind: 'length', defaultValue: '1px', min: 0, max: 4, step: 0.5 },
      { name: '--border-width-strong', label: 'Border strong', kind: 'length', defaultValue: '2px', min: 0, max: 6, step: 0.5 },
      { name: '--border-width-emphasis', label: 'Border emphasis', kind: 'length', defaultValue: '1.5px', min: 0, max: 4, step: 0.5 },
    ],
  },
];

export const ALL_TOKENS: TokenDef[] = SECTIONS.flatMap((s) => s.tokens);

export const DEFAULT_MAP: Record<string, string> = Object.fromEntries(ALL_TOKENS.map((t) => [t.name, t.defaultValue]));

export const FONT_PRESETS = [
  { label: 'Nunito / Quicksand (default)', sans: DEFAULT_MAP['--font-sans'], display: DEFAULT_MAP['--font-display'] },
  { label: 'System UI', sans: 'system-ui, -apple-system, sans-serif', display: 'system-ui, -apple-system, sans-serif' },
  { label: 'Georgia / system', sans: 'system-ui, sans-serif', display: 'Georgia, "Times New Roman", serif' },
  { label: 'Inter-like system', sans: 'ui-sans-serif, system-ui, sans-serif', display: 'ui-sans-serif, system-ui, sans-serif' },
];
