import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import './fonts.css';
import App from './App';

// ── Global error monitoring ──────────────────────────────────────────────
function reportError(msg, stack) {
  try {
    fetch('/api/report-error', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: msg, stack, url: location.href, userAgent: navigator.userAgent }),
    }).catch(() => {});
  } catch (_) {}
}
window.addEventListener('error', (e) => { reportError(e.message, e.error?.stack); });
window.addEventListener('unhandledrejection', (e) => { reportError(String(e.reason), e.reason?.stack); });

ReactDOM.createRoot(document.getElementById('root')).render(
  <HelmetProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </HelmetProvider>
);
