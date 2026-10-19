import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { applyState, applyToken, resetAll, resetToken } from './apply';
import { CONTRAST_PAIRS, FONT_PRESETS, SECTIONS, type TokenDef } from './defaults';
import { passesAa, readComputedToken } from './contrast';
import { exportJson, exportPrompt, parseImport } from './export';
import { isChanged, loadState, saveState, type DesignModeState } from './storage';
import './design-mode.css';

function currentValue(state: DesignModeState, token: TokenDef): string {
  return state.overrides[token.name] ?? token.defaultValue;
}

function toColorInput(value: string, tokenName?: string): string {
  if (/^#[0-9a-f]{6}$/i.test(value)) return value;
  if (/^#[0-9a-f]{3}$/i.test(value)) {
    const h = value.slice(1);
    return `#${h[0]}${h[0]}${h[1]}${h[1]}${h[2]}${h[2]}`;
  }
  const fromToken = tokenName ? readComputedToken(tokenName) : '';
  const probe = fromToken || value;
  const el = document.createElement('div');
  el.style.color = probe.startsWith('#') || probe.startsWith('rgb') ? probe : value;
  if (tokenName && !probe.startsWith('#') && !probe.startsWith('rgb')) {
    el.style.color = `var(${tokenName})`;
  }
  document.body.appendChild(el);
  const c = getComputedStyle(el).color;
  document.body.removeChild(el);
  const m = c.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  if (m) {
    const hex = [m[1], m[2], m[3]].map((n) => Number(n).toString(16).padStart(2, '0')).join('');
    return `#${hex}`;
  }
  return '#808080';
}

function parsePx(value: string): number {
  const n = parseFloat(value);
  return Number.isFinite(n) ? n : 0;
}

/** Normalize typed color text into a token value, or null if not ready/valid. */
function normalizeColorInput(raw: string): string | null {
  let t = raw.trim();
  if (!t) return null;
  if (/^[0-9a-f]{3}$/i.test(t) || /^[0-9a-f]{6}$/i.test(t)) t = `#${t}`;
  if (/^#[0-9a-f]{3}$/i.test(t)) {
    const h = t.slice(1);
    return `#${h[0]}${h[0]}${h[1]}${h[1]}${h[2]}${h[2]}`.toLowerCase();
  }
  if (/^#[0-9a-f]{6}$/i.test(t)) return t.toLowerCase();
  if (
    t.startsWith('var(') ||
    t.startsWith('color-mix(') ||
    t.startsWith('rgb') ||
    t.startsWith('hsl') ||
    t.startsWith('oklch(')
  ) {
    return t;
  }
  return null;
}

function ColorInputs({
  value,
  tokenName,
  label,
  onChange,
}: {
  value: string;
  tokenName: string;
  label: string;
  onChange: (value: string) => void;
}) {
  const [draft, setDraft] = useState(value);
  const focusedRef = useRef(false);

  useEffect(() => {
    if (!focusedRef.current) setDraft(value);
  }, [value]);

  const commitDraft = (raw: string) => {
    const next = normalizeColorInput(raw);
    if (next) {
      onChange(next);
      setDraft(next);
      return;
    }
    setDraft(value);
  };

  return (
    <>
      <input
        type="color"
        value={toColorInput(value, tokenName)}
        onChange={(e) => onChange(e.target.value.toLowerCase())}
        title={value}
        aria-label={`${label} swatch`}
      />
      <input
        type="text"
        className="dm-hex"
        value={draft}
        onFocus={() => {
          focusedRef.current = true;
        }}
        onChange={(e) => {
          const next = e.target.value;
          setDraft(next);
          // Live-apply only complete 6-digit hex so typing "#c9a…" isn't expanded early.
          const trimmed = next.trim();
          const bare = trimmed.startsWith('#') ? trimmed.slice(1) : trimmed;
          if (/^[0-9a-f]{6}$/i.test(bare) && (trimmed.startsWith('#') || trimmed.length === 6)) {
            const hex = `#${bare.toLowerCase()}`;
            onChange(hex);
          }
        }}
        onBlur={() => {
          focusedRef.current = false;
          commitDraft(draft);
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            e.currentTarget.blur();
          }
        }}
        spellCheck={false}
        autoComplete="off"
        aria-label={`${label} hex`}
        placeholder="#000000"
      />
    </>
  );
}

function TokenRow({
  token,
  state,
  onChange,
  onReset,
}: {
  token: TokenDef;
  state: DesignModeState;
  onChange: (name: string, value: string) => void;
  onReset: (name: string) => void;
}) {
  const value = currentValue(state, token);
  const changed = isChanged(token.name, state.overrides[token.name]);

  return (
    <div className={`dm-row${changed ? ' changed' : ''}`}>
      <div className="dm-row-label">
        <span>{token.label}</span>
        <code>{token.name}</code>
      </div>
      <div className="dm-row-controls">
        {token.kind === 'color' && (
          <ColorInputs
            value={value}
            tokenName={token.name}
            label={token.label}
            onChange={(v) => onChange(token.name, v)}
          />
        )}
        {token.kind === 'length' && token.min != null && token.max != null && (
          <>
            <input
              type="range"
              min={token.min}
              max={token.max}
              step={token.step ?? 1}
              value={parsePx(value.endsWith('px') ? value : String(readComputedToken(token.name) || token.min))}
              onChange={(e) => onChange(token.name, `${e.target.value}px`)}
            />
            <span className="dm-value">{value.endsWith('px') ? value : `${parsePx(readComputedToken(token.name))}px*`}</span>
          </>
        )}
        {token.kind === 'number' && token.min != null && token.max != null && (
          <>
            <input
              type="range"
              min={token.min}
              max={token.max}
              step={token.step ?? 1}
              value={parseFloat(value) || token.min}
              onChange={(e) => onChange(token.name, e.target.value)}
            />
            <span className="dm-value">{value}</span>
          </>
        )}
        {token.kind === 'font' && (
          <select
            value={FONT_PRESETS.find((p) => p.sans === value || p.display === value)?.label ?? ''}
            onChange={(e) => {
              const preset = FONT_PRESETS.find((p) => p.label === e.target.value);
              if (!preset) return;
              if (token.name === '--font-sans') onChange(token.name, preset.sans);
              if (token.name === '--font-display') onChange(token.name, preset.display);
            }}
          >
            <option value="">Custom / default</option>
            {FONT_PRESETS.map((p) => (
              <option key={p.label} value={p.label}>
                {p.label}
              </option>
            ))}
          </select>
        )}
        {token.kind === 'shadow' && (
          <input type="text" value={value} onChange={(e) => onChange(token.name, e.target.value)} spellCheck={false} />
        )}
        {changed && (
          <button type="button" className="dm-reset-one" onClick={() => onReset(token.name)}>
            Reset
          </button>
        )}
      </div>
    </div>
  );
}

function ContrastChecks() {
  const [, tick] = useState(0);
  useEffect(() => {
    const id = window.setInterval(() => tick((n) => n + 1), 400);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div className="dm-contrast-list">
      {CONTRAST_PAIRS.map((pair) => {
        const fg = readComputedToken(pair.fg);
        const bg = readComputedToken(pair.bg);
        const ok = passesAa(fg, bg);
        return (
          <div key={pair.label} className="dm-contrast-row">
            <span>
              {pair.label}{' '}
              <span
                className="dm-contrast-sample"
                style={{ color: `var(${pair.fg})`, background: `var(${pair.bg})` }}
              >
                Aa
              </span>
            </span>
            <span className={`dm-badge ${ok === true ? 'pass' : ok === false ? 'fail' : 'unknown'}`}>
              {ok === true ? 'AA pass' : ok === false ? 'AA fail' : 'n/a'}
            </span>
          </div>
        );
      })}
    </div>
  );
}

export function DesignModePanel() {
  const [state, setState] = useState<DesignModeState>(() => loadState());
  const [open, setOpen] = useState(true);
  const [sections, setSections] = useState<Record<string, boolean>>({
    seeds: true,
    'semantic-colors': true,
    spacing: false,
    radius: false,
    typography: false,
    'shadows-border': false,
    contrast: true,
    import: false,
  });
  const [toast, setToast] = useState('');
  const [importText, setImportText] = useState('');

  useEffect(() => {
    applyState(state);
    saveState(state);
  }, [state]);

  const changedCount = useMemo(
    () => Object.keys(state.overrides).filter((k) => isChanged(k, state.overrides[k])).length,
    [state.overrides],
  );

  const showToast = (msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(''), 1800);
  };

  const setToken = useCallback((name: string, value: string) => {
    setState((s) => {
      const overrides = { ...s.overrides, [name]: value };
      applyToken(name, value);
      return { ...s, overrides };
    });
  }, []);

  const onResetOne = useCallback((name: string) => {
    setState((s) => resetToken(name, s));
  }, []);

  const toggleSection = (id: string) => setSections((s) => ({ ...s, [id]: !s[id] }));

  if (!open) {
    return (
      <div className="dm-root" data-collapsed="true">
        <div className="dm-head">
          <h2>Design Mode{changedCount ? ` · ${changedCount}` : ''}</h2>
          <button type="button" className="dm-icon-btn" onClick={() => setOpen(true)} aria-label="Expand">
            ▢
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="dm-root" role="complementary" aria-label="Design Mode">
      <div className="dm-head">
        <h2>Design Mode{changedCount ? ` · ${changedCount} changed` : ''}</h2>
        <div className="dm-head-actions">
          <button type="button" className="dm-icon-btn" onClick={() => setOpen(false)} aria-label="Collapse">
            —
          </button>
        </div>
      </div>

      <div className="dm-theme-toggle">
        <button
          type="button"
          className={state.theme === 'light' ? 'on' : ''}
          onClick={() => setState((s) => ({ ...s, theme: 'light' }))}
        >
          Light
        </button>
        <button
          type="button"
          className={state.theme === 'dark' ? 'on' : ''}
          onClick={() => setState((s) => ({ ...s, theme: 'dark' }))}
        >
          Dark
        </button>
      </div>

      <div className="dm-body">
        {SECTIONS.map((section) => (
          <div key={section.id} className="dm-section">
            <button type="button" className="dm-section-toggle" onClick={() => toggleSection(section.id)}>
              {section.title}
              <span>{sections[section.id] ? '▾' : '▸'}</span>
            </button>
            {sections[section.id] && (
              <div className="dm-section-body">
                {section.id === 'typography' && (
                  <div className="dm-row">
                    <div className="dm-row-label">
                      <span>Font preset</span>
                      <code>applies sans + display</code>
                    </div>
                    <div className="dm-row-controls">
                      <select
                        onChange={(e) => {
                          const preset = FONT_PRESETS.find((p) => p.label === e.target.value);
                          if (!preset) return;
                          setToken('--font-sans', preset.sans);
                          setToken('--font-display', preset.display);
                        }}
                        defaultValue=""
                      >
                        <option value="">Choose preset…</option>
                        {FONT_PRESETS.map((p) => (
                          <option key={p.label} value={p.label}>
                            {p.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}
                {section.tokens.map((token) => (
                  <TokenRow key={token.name} token={token} state={state} onChange={setToken} onReset={onResetOne} />
                ))}
              </div>
            )}
          </div>
        ))}

        <div className="dm-section">
          <button type="button" className="dm-section-toggle" onClick={() => toggleSection('contrast')}>
            Contrast (WCAG AA)
            <span>{sections.contrast ? '▾' : '▸'}</span>
          </button>
          {sections.contrast && (
            <div className="dm-section-body">
              <ContrastChecks />
            </div>
          )}
        </div>

        <div className="dm-section">
          <button type="button" className="dm-section-toggle" onClick={() => toggleSection('import')}>
            Import
            <span>{sections.import ? '▾' : '▸'}</span>
          </button>
          {sections.import && (
            <div className="dm-section-body dm-import-box">
              <textarea
                value={importText}
                onChange={(e) => setImportText(e.target.value)}
                placeholder='Paste export JSON: { "theme": "light", "tokens": { ... } }'
                spellCheck={false}
              />
              <button
                type="button"
                onClick={() => {
                  const result = parseImport(importText);
                  if ('error' in result) {
                    showToast(result.error);
                    return;
                  }
                  setState(result);
                  showToast('Imported');
                }}
              >
                Apply import
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="dm-foot">
        <button
          type="button"
          className="primary"
          onClick={async () => {
            const json = exportJson(state);
            await navigator.clipboard.writeText(json);
            showToast('Copied JSON');
          }}
        >
          Export JSON
        </button>
        <button
          type="button"
          className="primary"
          onClick={async () => {
            await navigator.clipboard.writeText(exportPrompt(state));
            showToast('Copied prompt');
          }}
        >
          Export prompt
        </button>
        <button
          type="button"
          onClick={() => {
            setState(() => resetAll());
            showToast('Reset all');
          }}
        >
          Reset all
        </button>
      </div>

      {toast && <div className="dm-toast">{toast}</div>}
    </div>
  );
}
