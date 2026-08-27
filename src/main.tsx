import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Safely suppress benign third-party cross-origin errors (e.g. Disqus iframe or analytics)
if (typeof window !== 'undefined') {
  window.addEventListener('error', (event) => {
    if (
      event.message === 'Script error.' ||
      (event.filename && (event.filename.includes('disqus') || event.filename.includes('leaflet')))
    ) {
      // Prevent cross-origin third-party script error from propagating
      event.stopImmediatePropagation?.();
      return true;
    }
  });

  window.addEventListener('unhandledrejection', (event) => {
    if (
      event.reason &&
      typeof event.reason === 'string' &&
      event.reason.includes('disqus')
    ) {
      event.preventDefault();
    }
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

