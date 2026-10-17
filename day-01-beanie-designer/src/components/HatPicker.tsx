import { HAT_TYPES } from '../config/hatTypes';
import { HAT_SIZES } from '../config/sizes';
import { useDesign } from '../store';
import { useSpec } from '../useSpec';
import { HatGlyph } from './HatGlyph';

export function HatPicker() {
  const s = useDesign();
  const spec = useSpec();

  return (
    <section className="card hat-picker">
      <div className="field">
        <span className="field-label">Hat type</span>
        <div className="type-grid type-grid-compact">
          {HAT_TYPES.map((t) => (
            <button
              key={t.id}
              className={`type-card compact ${s.hatTypeId === t.id ? 'on' : ''}`}
              onClick={() => s.setHatType(t.id)}
              aria-pressed={s.hatTypeId === t.id}
            >
              <HatGlyph type={t} />
              <span className="type-name">{t.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="field">
        <span className="field-label">Size</span>
        <div className="seg seg-wide" role="radiogroup" aria-label="Size">
          {HAT_SIZES.map((z) => (
            <button
              key={z.id}
              className={s.sizeId === z.id ? 'on' : ''}
              onClick={() => s.set({ sizeId: z.id })}
              role="radio"
              aria-checked={s.sizeId === z.id}
            >
              <span>{z.name}</span>
              <small>
                {z.head[0]}–{z.head[1]}"
              </small>
            </button>
          ))}
        </div>
        {spec.type.extrapolatedSizes.includes(spec.size.id) && (
          <p className="note">This size isn't in the source pattern — measurements are interpolated.</p>
        )}
      </div>

      <div className="crown-glance">
        <span>Crown</span>
        <b>
          {spec.crown.rows} rnds · {spec.crown.visualSections} sections
        </b>
      </div>
    </section>
  );
}
