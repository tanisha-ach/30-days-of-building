/** Relative luminance (sRGB), WCAG 2.x. */
function luminance(hex: string): number | null {
  const rgb = parseColor(hex);
  if (!rgb) return null;
  const [r, g, b] = rgb.map((c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function parseColor(input: string): [number, number, number] | null {
  const v = input.trim();
  if (!v || v === 'transparent') return null;

  const hex = v.match(/^#([0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})$/i);
  if (hex) {
    let h = hex[1];
    if (h.length === 3) h = h.split('').map((c) => c + c).join('');
    if (h.length === 8) h = h.slice(0, 6);
    const n = parseInt(h, 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  }

  const rgb = v.match(/^rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)/i);
  if (rgb) return [+rgb[1], +rgb[2], +rgb[3]];

  // Resolve via browser when value is color-mix / named / oklch
  if (typeof document !== 'undefined') {
    const el = document.createElement('div');
    el.style.color = v;
    document.body.appendChild(el);
    const computed = getComputedStyle(el).color;
    document.body.removeChild(el);
    if (computed && computed !== v) return parseColor(computed);
  }
  return null;
}

export function contrastRatio(fg: string, bg: string): number | null {
  const L1 = luminance(fg);
  const L2 = luminance(bg);
  if (L1 == null || L2 == null) return null;
  const lighter = Math.max(L1, L2);
  const darker = Math.min(L1, L2);
  return (lighter + 0.05) / (darker + 0.05);
}

/** AA normal text ≥ 4.5:1 */
export function passesAa(fg: string, bg: string): boolean | null {
  const r = contrastRatio(fg, bg);
  if (r == null) return null;
  return r >= 4.5;
}

export function readComputedToken(name: string): string {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}
