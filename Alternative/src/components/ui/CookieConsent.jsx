import { useState, useEffect } from 'react';
import { C, T } from '../../constants/theme.js';

const CONSENT_KEY = 'alternative_cookie_consent';

export default function CookieConsent({ L, mobile, setPage }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const consent = localStorage.getItem(CONSENT_KEY);
      if (!consent) {
        // Small delay so it doesn't flash on load
        const t = setTimeout(() => setVisible(true), 1200);
        return () => clearTimeout(t);
      }
    } catch (_) {}
  }, []);

  function accept(level) {
    try {
      localStorage.setItem(CONSENT_KEY, JSON.stringify({ level, date: new Date().toISOString() }));
    } catch (_) {}
    setVisible(false);

    // If user accepted analytics, load Plausible
    if (level === 'all') {
      loadAnalytics();
    }
  }

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label={L?.cookieConsent || 'Cookie consent'}
      style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 9999,
        background: C.black, borderTop: `1px solid rgba(177,154,122,0.2)`,
        padding: mobile ? '14px 14px' : '20px 40px',
        boxShadow: '0 -4px 24px rgba(0,0,0,0.2)',
        animation: 'slideUp 0.3s ease',
      }}>
      <div style={{
        maxWidth: 1360, margin: '0 auto',
        display: 'flex', alignItems: mobile ? 'stretch' : 'center',
        flexDirection: mobile ? 'column' : 'row',
        gap: mobile ? 10 : 24,
      }}>
        <div style={{ flex: 1 }}>
          <p style={{ ...T.heading, color: C.white, fontSize: mobile ? 12 : 14, marginBottom: mobile ? 4 : 6 }}>
            {L?.cookieTitle || 'We value your privacy'}
          </p>
          <p style={{ ...T.bodySm, color: 'rgba(168,162,150,0.7)', fontSize: mobile ? 10 : 12, lineHeight: mobile ? 1.5 : 1.7 }}>
            {L?.cookieBody || 'We use essential cookies for site functionality and optional analytics cookies to improve your experience. No personal data is sold or shared with third parties.'}
            {' '}
            <button
              onClick={() => { setVisible(false); if(setPage)setPage("privacy"); }}
              style={{
                background: 'none', border: 'none', color: C.tan, fontSize: 12,
                cursor: 'pointer', textDecoration: 'underline', padding: 0, fontFamily: 'inherit',
              }}>
              {L?.learnMore || 'Learn more'}
            </button>
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8, flexShrink: 0, alignItems: 'center' }}>
          <button
            onClick={() => accept('essential')}
            style={{
              padding: mobile ? '8px 14px' : '10px 20px', background: 'transparent',
              border: `1px solid rgba(168,162,150,0.3)`, color: 'rgba(168,162,150,0.7)',
              ...T.labelSm, fontSize: mobile ? 9 : 10, cursor: 'pointer', letterSpacing: '0.08em',
              transition: 'all 0.2s',
            }}>
            {L?.essentialOnly || 'Essential Only'}
          </button>
          <button
            onClick={() => accept('all')}
            style={{
              padding: mobile ? '8px 14px' : '10px 20px', background: C.tan, border: 'none', color: C.white,
              ...T.labelSm, fontSize: mobile ? 9 : 10, cursor: 'pointer', letterSpacing: '0.08em',
              transition: 'all 0.2s',
            }}>
            {L?.acceptAll || 'Accept All'}
          </button>
        </div>
      </div>
      <style>{`@keyframes slideUp{from{transform:translateY(100%)}to{transform:translateY(0)}}`}</style>
    </div>
  );
}

// Load Plausible analytics (only after consent)
function loadAnalytics() {
  const domain = import.meta.env.VITE_PLAUSIBLE_DOMAIN;
  if (!domain) return;

  // Don't double-load
  if (document.querySelector('script[data-domain]')) return;

  const script = document.createElement('script');
  script.defer = true;
  script.setAttribute('data-domain', domain);
  script.src = 'https://plausible.io/js/script.js';
  document.head.appendChild(script);
}

// Check if consent was previously given and load analytics on mount
export function initAnalyticsIfConsented() {
  try {
    const raw = localStorage.getItem(CONSENT_KEY);
    if (raw) {
      const consent = JSON.parse(raw);
      if (consent.level === 'all') loadAnalytics();
    }
  } catch (_) {}
}
