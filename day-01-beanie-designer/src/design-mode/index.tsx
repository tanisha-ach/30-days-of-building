import { createRoot, type Root } from 'react-dom/client';
import { DesignModePanel } from './DesignModePanel';

const HOST_ID = 'beanie-design-mode-root';

let root: Root | null = null;

/** Mount the Design Mode floating panel. Call once from the DEV + ?design=1 gate. */
export function mountDesignMode() {
  if (typeof document === 'undefined') return;
  let host = document.getElementById(HOST_ID);
  if (!host) {
    host = document.createElement('div');
    host.id = HOST_ID;
    document.body.appendChild(host);
  }
  if (!root) root = createRoot(host);
  root.render(<DesignModePanel />);
}

export function unmountDesignMode() {
  root?.unmount();
  root = null;
  document.getElementById(HOST_ID)?.remove();
}
