import { useEffect, useMemo, useRef, useState } from 'react';
import { loadImage, loadImageFromUrl, otsuThreshold, quantize, sampleImage } from '../lib/imageToChart';
import { MAX_COLORS, useDesign } from '../store';
import { useSpec } from '../useSpec';
import { cssToken } from '../lib/cssToken';
import { Icon } from './Icon';
import { Button } from './ui/Button';
import { IconButton } from './ui/IconButton';
import { TextField } from './ui/TextField';

export function ImageMotifDialog({ onClose }: { onClose: () => void }) {
  const s = useDesign();
  const spec = useSpec();
  const [img, setImg] = useState<HTMLImageElement | null>(null);
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [colors, setColors] = useState(Math.min(3, Math.max(2, s.palette.length)));
  const [threshold, setThreshold] = useState(128);
  const [invert, setInvert] = useState(false);
  const [drag, setDrag] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const previewRef = useRef<HTMLCanvasElement>(null);

  const width = s.chart.w;
  const height = img
    ? Math.max(2, Math.min(spec.bodyRows, Math.round((width / spec.stsPerIn) * (img.naturalHeight / img.naturalWidth) * spec.rowsPerIn)))
    : 0;

  const pixels = useMemo(() => (img ? sampleImage(img, width, height) : null), [img, width, height]);

  const result = useMemo(() => {
    if (!pixels) return null;
    return quantize(pixels, {
      colors,
      threshold,
      mode: colors === 2 ? 'threshold' : 'cluster',
      invert,
      palette: s.palette.length >= colors ? s.palette : undefined,
    });
  }, [pixels, colors, threshold, invert, s.palette]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  useEffect(() => {
    const cv = previewRef.current;
    if (!cv || !result) return;
    const cell = Math.max(2, Math.floor(280 / Math.max(width, height)));
    cv.width = width * cell;
    cv.height = height * cell;
    const ctx = cv.getContext('2d')!;
    result.cells.forEach((v, i) => {
      ctx.fillStyle = result.palette[v] ?? cssToken('--color-text');
      ctx.fillRect((i % width) * cell, Math.floor(i / width) * cell, cell, cell);
    });
  }, [result, width, height]);

  const openFile = async (file?: File) => {
    if (!file || !file.type.startsWith('image/')) {
      setError('Choose an image file (PNG, JPG, WebP…).');
      return;
    }
    setBusy(true);
    setError('');
    try {
      const im = await loadImage(file);
      setImg(im);
      setName(file.name);
      setThreshold(otsuThreshold(sampleImage(im, 48, 48)));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not read that image.');
    } finally {
      setBusy(false);
    }
  };

  const openUrl = async () => {
    setBusy(true);
    setError('');
    try {
      const im = await loadImageFromUrl(url);
      setImg(im);
      setName(url.trim().split('/').pop()?.split('?')[0] || 'Linked image');
      setThreshold(otsuThreshold(sampleImage(im, 48, 48)));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not load that link.');
    } finally {
      setBusy(false);
    }
  };

  const apply = () => {
    if (!result || !height) return;
    const cells = new Array(width * spec.bodyRows).fill(0);
    const dy = spec.bodyRows - height;
    for (let y = 0; y < height; y++)
      for (let x = 0; x < width; x++) {
        const ny = y + dy;
        if (ny >= 0 && ny < spec.bodyRows) cells[ny * width + x] = result.cells[y * width + x];
      }
    const useImagePalette = colors > 2 && s.palette.length < colors;
    s.replaceChart({ w: width, h: spec.bodyRows, cells }, useImagePalette ? result.palette : undefined);
    s.set({ tileVertical: false, verticalPos: 0 });
    onClose();
  };

  return (
    <div className="scrim" onClick={onClose}>
      <div
        className="dialog image-motif-dialog"
        role="dialog"
        aria-modal
        aria-label="Image to motif"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="dialog-head">
          <div>
            <p className="eyebrow">Chart motif</p>
            <h2>From an image</h2>
          </div>
          <IconButton label="Close" onClick={onClose}>
            <Icon name="close" />
          </IconButton>
        </header>

        <div className="dialog-body image-motif-body">
          {!img ? (
            <>
              <p className="muted image-motif-lede">
                Upload a picture or paste a link. We’ll turn it into stitches that fit your chart.
              </p>
              <button
                type="button"
                className={`drop ${drag ? 'drag' : ''}`}
                disabled={busy}
                onClick={() => inputRef.current?.click()}
                onDragOver={(e) => {
                  e.preventDefault();
                  setDrag(true);
                }}
                onDragLeave={() => setDrag(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setDrag(false);
                  openFile(e.dataTransfer.files[0]);
                }}
              >
                <Icon name="image" size={26} />
                <span>{busy ? 'Loading…' : 'Drop an image or click to choose'}</span>
                <small>Bold, high-contrast pictures work best</small>
              </button>

              <div className="image-url-row">
                <label className="field-label" htmlFor="image-url">
                  Or paste a link
                </label>
                <div className="image-url-fields">
                  <TextField
                    id="image-url"
                    className="image-url-input"
                    type="url"
                    placeholder="https://…"
                    value={url}
                    error={Boolean(error && !img)}
                    onChange={(e) => setUrl(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        openUrl();
                      }
                    }}
                  />
                  <Button variant="primary" disabled={busy || !url.trim()} loading={busy} onClick={openUrl}>
                    Load
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="import image-motif-import">
              <div className="import-previews">
                <figure>
                  <img src={img.src} alt="" />
                  <figcaption>{name}</figcaption>
                </figure>
                <figure>
                  <canvas ref={previewRef} />
                  <figcaption>
                    {width} × {height} sts
                  </figcaption>
                </figure>
              </div>
              <div className="import-controls">
                <label className="slider">
                  <span>
                    Colours <b>{colors}</b>
                  </span>
                  <input
                    type="range"
                    min={2}
                    max={MAX_COLORS}
                    value={colors}
                    onChange={(e) => setColors(+e.target.value)}
                  />
                </label>
                {colors === 2 && (
                  <label className="slider">
                    <span>
                      Threshold <b>{threshold}</b>
                    </span>
                    <input
                      type="range"
                      min={1}
                      max={254}
                      value={threshold}
                      onChange={(e) => setThreshold(+e.target.value)}
                    />
                  </label>
                )}
                <label className="check">
                  <input type="checkbox" checked={invert} onChange={(e) => setInvert(e.target.checked)} />
                  Swap light and dark
                </label>
                <div className="row-actions">
                  <Button variant="primary" onClick={apply} disabled={!result}>
                    <Icon name="sparkle" /> Add to chart
                  </Button>
                  <Button variant="ghost" onClick={() => inputRef.current?.click()}>
                    Another image
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setImg(null);
                      setName('');
                      setError('');
                    }}
                  >
                    Clear
                  </Button>
                </div>
              </div>
            </div>
          )}

          {error && <p className="note">{error}</p>}
        </div>

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          hidden
          onChange={(e) => openFile(e.target.files?.[0] ?? undefined)}
        />
      </div>
    </div>
  );
}
