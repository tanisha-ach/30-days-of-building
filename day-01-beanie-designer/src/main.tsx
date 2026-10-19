import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter, Navigate, Route, Routes } from 'react-router-dom';
import App from './App';
import { StyleGuide } from './pages/StyleGuide';
import './tokens/index.css';
import './styles.css';
import './styles/styleguide.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HashRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/styleguide" element={<StyleGuide />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  </StrictMode>,
);

// Design Mode lives in src/design-mode/ but is not mounted. Re-enable only when explicitly asked.
