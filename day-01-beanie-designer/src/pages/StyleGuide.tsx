import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '../components/Icon';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { IconButton } from '../components/ui/IconButton';
import { SelectField, TextField } from '../components/ui/TextField';

const SURFACES = [
  '--color-bg',
  '--color-surface',
  '--color-surface-raised',
  '--color-surface-muted',
  '--color-surface-subtle',
  '--color-overlay',
];
const TEXT = ['--color-text', '--color-text-muted', '--color-text-subtle', '--color-text-inverse', '--color-link', '--color-text-secondary'];
const BORDERS = ['--color-border', '--color-border-strong', '--color-focus-ring'];
const ACTIONS = [
  '--color-primary',
  '--color-primary-hover',
  '--color-primary-active',
  '--color-on-primary',
  '--color-primary-subtle',
  '--color-secondary',
  '--color-on-secondary',
  '--color-secondary-subtle',
  '--color-danger',
  '--color-danger-subtle',
  '--color-success',
  '--color-success-subtle',
  '--color-warning',
  '--color-warning-subtle',
  '--color-info',
  '--color-info-subtle',
];
const SPACES = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
const RADII = ['--radius-sm', '--radius-md', '--radius-lg', '--radius-xl', '--radius-2xl', '--radius-3xl', '--radius-full'];
const TYPE_SIZES = [
  '--font-size-micro',
  '--font-size-2xs',
  '--font-size-caption',
  '--font-size-body-sm',
  '--font-size-body',
  '--font-size-body-md',
  '--font-size-ui',
  '--font-size-title',
  '--font-size-title-lg',
  '--font-size-display',
];
const SHADOWS = ['--elevation-sm', '--elevation-md', '--elevation-lg', '--elevation-brand-sm', '--elevation-brand-md', '--elevation-brand-btn'];

function Swatch({ name }: { name: string }) {
  return (
    <div className="sg-swatch">
      <div className="sg-swatch-chip" style={{ background: `var(${name})` }} />
      <code>{name}</code>
    </div>
  );
}

export function StyleGuide() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme === 'dark' ? 'dark' : 'light');
    return () => document.documentElement.removeAttribute('data-theme');
  }, [theme]);

  return (
    <div className="sg">
      <header className="sg-top">
        <div>
          <p className="eyebrow">Design system</p>
          <h1>Style guide</h1>
          <p className="muted">Tokens and component states. Toggle theme to check dark remaps.</p>
        </div>
        <div className="row-actions">
          <Button variant={theme === 'light' ? 'primary' : 'ghost'} on={theme === 'light'} onClick={() => setTheme('light')}>
            Light
          </Button>
          <Button variant={theme === 'dark' ? 'primary' : 'ghost'} on={theme === 'dark'} onClick={() => setTheme('dark')}>
            Dark
          </Button>
          <Link className="btn ghost" to="/">
            ← App
          </Link>
        </div>
      </header>

      <main className="sg-main">
        <Card>
          <header className="card-head">
            <h2>Surfaces</h2>
          </header>
          <div className="sg-grid">{SURFACES.map((n) => <Swatch key={n} name={n} />)}</div>
        </Card>

        <Card>
          <header className="card-head">
            <h2>Text & borders</h2>
          </header>
          <div className="sg-grid">{TEXT.map((n) => <Swatch key={n} name={n} />)}</div>
          <div className="sg-grid" style={{ marginTop: 'var(--space-4)' }}>
            {BORDERS.map((n) => <Swatch key={n} name={n} />)}
          </div>
        </Card>

        <Card>
          <header className="card-head">
            <h2>Actions & feedback</h2>
          </header>
          <div className="sg-grid">{ACTIONS.map((n) => <Swatch key={n} name={n} />)}</div>
        </Card>

        <Card>
          <header className="card-head">
            <h2>Spacing</h2>
            <p className="muted">--space-unit drives the scale</p>
          </header>
          <div className="sg-space-row">
            {SPACES.map((n) => (
              <div key={n} className="sg-space-item">
                <div className="sg-space-bar" style={{ width: `var(--space-${n})`, height: `var(--space-${n})` }} />
                <code>--space-{n}</code>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <header className="card-head">
            <h2>Radius</h2>
          </header>
          <div className="sg-radius-row">
            {RADII.map((n) => (
              <div key={n} className="sg-radius-item">
                <div className="sg-radius-box" style={{ borderRadius: `var(${n})` }} />
                <code>{n}</code>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <header className="card-head">
            <h2>Typography</h2>
          </header>
          <div className="sg-type-stack">
            {TYPE_SIZES.map((n) => (
              <p key={n} style={{ fontSize: `var(${n})`, fontFamily: 'var(--font-family-display)', margin: 0 }}>
                <code>{n}</code> — The quick yarn fox
              </p>
            ))}
          </div>
        </Card>

        <Card>
          <header className="card-head">
            <h2>Shadows</h2>
          </header>
          <div className="sg-shadow-row">
            {SHADOWS.map((n) => (
              <div key={n} className="sg-shadow-card" style={{ boxShadow: `var(${n})` }}>
                <code>{n}</code>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <header className="card-head">
            <h2>Components</h2>
            <p className="muted">Every interactive state</p>
          </header>

          <h3 className="sg-sub">Button</h3>
          <div className="row-actions">
            <Button variant="primary">Primary</Button>
            <Button variant="primary" disabled>
              Disabled
            </Button>
            <Button variant="primary" loading>
              Loading
            </Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="ghost" on>
              Ghost on
            </Button>
            <Button variant="ghost" size="sm">
              Small
            </Button>
            <IconButton label="Close sample">
              <Icon name="close" />
            </IconButton>
          </div>

          <h3 className="sg-sub">Inputs</h3>
          <div className="sg-form-row">
            <TextField placeholder="Default input" />
            <TextField placeholder="Error input" error defaultValue="oops" />
            <TextField placeholder="Disabled" disabled />
            <SelectField defaultValue="a">
              <option value="a">Select option</option>
              <option value="b">Another</option>
            </SelectField>
          </div>

          <h3 className="sg-sub">Seg / pills / toggle</h3>
          <div className="seg labeled compact" role="group">
            <button type="button" className="on" aria-pressed>
              <Icon name="brush" size={15} />
              <span className="tool-label">Paint</span>
            </button>
            <button type="button">
              <Icon name="bucket" size={15} />
              <span className="tool-label">Fill</span>
            </button>
            <button type="button" disabled>
              <Icon name="undo" size={15} />
              <span className="tool-label">Undo</span>
            </button>
          </div>
          <div className="motif-pills" style={{ marginTop: 'var(--space-3)' }}>
            <button type="button" className="motif-pill on">
              Active
            </button>
            <button type="button" className="motif-pill">
              Idle
            </button>
          </div>
          <div className="toggle-row sg-toggle-demo">
            <span className="field-label flush">
              Toggle
            </span>
            <button type="button" className="toggle on" aria-pressed role="switch" />
          </div>

          <h3 className="sg-sub">Type card</h3>
          <div className="type-grid sg-type-demo">
            <button type="button" className="type-card on">
              <span className="type-name">Selected</span>
              <span className="type-tag">With cuff</span>
            </button>
            <button type="button" className="type-card">
              <span className="type-name">Idle</span>
              <span className="type-tag">Ribbed edge</span>
            </button>
          </div>

          <h3 className="sg-sub">Feedback</h3>
          <p className="note">Note / warning surface using danger tokens.</p>
          <div className="empty-state muted" style={{ marginTop: 'var(--space-3)' }}>
            Empty state — nothing here yet.
          </div>
        </Card>
      </main>
    </div>
  );
}
