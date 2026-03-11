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

try {
  const root = ReactDOM.createRoot(document.getElementById('root'));
  root.render(
    <HelmetProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </HelmetProvider>
  );
} catch (err) {
  console.error('React render error:', err);
  const root = document.getElementById('root');
  root.textContent = '';
  const wrap = document.createElement('div');
  wrap.style.cssText = 'padding:40px;text-align:center;font-family:sans-serif';
  const h = document.createElement('h2');
  h.textContent = 'Render Error';
  const pre = document.createElement('pre');
  pre.style.cssText = 'text-align:left;max-width:600px;margin:20px auto;overflow:auto;font-size:13px';
  pre.textContent = (err.message || '') + '\n\n' + (err.stack || '');
  wrap.appendChild(h);
  wrap.appendChild(pre);
  root.appendChild(wrap);
}
