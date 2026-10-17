import { colorName } from '../lib/pattern';
import { useDesign } from '../store';
import { useSpec } from '../useSpec';

const fmt = (n: number) => (Math.round(n * 4) / 4).toString().replace('.25', '¼').replace('.5', '½').replace('.75', '¾');

export function HatControls() {
  const s = useDesign();
  const spec = useSpec();
  const type = spec.type;
  const g = { sts: spec.stsPerIn * 4, rows: spec.rowsPerIn * 4 };

  return (
    <section className="card">
      <div className="field">
        <div className="field-row">
          <span className="field-label">Your gauge over 4"</span>
          <label className="check">
            <input
              type="checkbox"
              checked={s.usePatternGauge}
              onChange={(e) =>
                s.set({ usePatternGauge: e.target.checked, ...(e.target.checked ? { gauge: { ...type.gauge } } : {}) })
              }
            />
            Use pattern gauge
          </label>
        </div>
        <div className="gauge">
          <label>
            <input
              type="number"
              step={0.5}
              min={6}
              max={48}
              value={g.sts}
              onChange={(e) => s.set({ usePatternGauge: false, gauge: { ...g, sts: Math.max(6, +e.target.value || 6) } })}
            />
            stitches
          </label>
          <label>
            <input
              type="number"
              step={0.5}
              min={6}
              max={64}
              value={g.rows}
              onChange={(e) => s.set({ usePatternGauge: false, gauge: { ...g, rows: Math.max(6, +e.target.value || 6) } })}
            />
            rounds
          </label>
        </div>
      </div>

      <div className="stats stats-compact">
        <div>
          <b>{spec.bodySts}</b>
          <span>sts around</span>
        </div>
        <div>
          <b>{spec.brimRows + spec.bodyRows + spec.crown.rows}</b>
          <span>rounds total</span>
        </div>
        <div>
          <b>
            {fmt(spec.finishedCircIn)}" × {fmt(spec.wornHeightIn)}"
          </b>
          <span>finished</span>
        </div>
      </div>

      <div className="field two">
        <label className="mini">
          <span className="field-label">{type.brim.kind === 'rolled' ? 'Edge colour' : 'Brim colour'}</span>
          <select className="select" value={s.brimColor} onChange={(e) => s.set({ brimColor: +e.target.value })}>
            {s.palette.map((_, i) => (
              <option key={i} value={i}>
                {colorName(i)}
              </option>
            ))}
          </select>
        </label>
        <label className="mini">
          <span className="field-label">Pom-pom</span>
          <select
            className="select"
            value={s.pomPom ? s.pomColor : -1}
            onChange={(e) =>
              +e.target.value < 0 ? s.set({ pomPom: false }) : s.set({ pomPom: true, pomColor: +e.target.value })
            }
          >
            <option value={-1}>None</option>
            {s.palette.map((_, i) => (
              <option key={i} value={i}>
                {colorName(i)}
              </option>
            ))}
          </select>
        </label>
      </div>

      {spec.warnings.length > 0 && (
        <ul className="warnings">
          {spec.warnings.map((w) => (
            <li key={w}>{w}</li>
          ))}
        </ul>
      )}
    </section>
  );
}
