import { useState, useEffect } from 'react';

const DISMISS_KEY = 'alt_app_banner_dismissed';
const BANNER_H = 36;

export default function AppBanner({ mobile, onHeightChange, L }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (sessionStorage.getItem(DISMISS_KEY)) return;
    } catch {}
    const t = setTimeout(() => {
      setVisible(true);
      if (onHeightChange) onHeightChange(BANNER_H);
    }, 600);
    return () => clearTimeout(t);
  }, []);

  const dismiss = () => {
    setVisible(false);
    if (onHeightChange) onHeightChange(0);
    try { sessionStorage.setItem(DISMISS_KEY, '1'); } catch {}
  };

  if (!visible) return null;

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 201,
      height: BANNER_H,
      background: 'rgba(25,25,25,0.97)',
      backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
      borderBottom: '1px solid rgba(177,154,122,0.08)',
      animation: 'bannerSlide 0.5s cubic-bezier(0.25,0.46,0.45,0.94) forwards',
    }}>
      <style>{`
        @keyframes bannerSlide { from { transform:translateY(-100%);opacity:0 } to { transform:translateY(0);opacity:1 } }
      `}</style>
      <div style={{
        maxWidth: 1360, margin: '0 auto', height: '100%',
        padding: mobile ? '0 16px' : '0 40px',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: mobile ? 12 : 20,
      }}>
        <p style={{
          fontFamily: "'TT Interphases Pro',sans-serif",
          fontSize: mobile ? 10 : 11, fontWeight: 400,
          letterSpacing: '0.06em',
          color: 'rgba(212,208,200,0.55)', margin: 0,
        }}>
          {mobile ? (L?.appBannerMobile||'Experience Alternative on the app') : (L?.appBannerDesktop||'The Alternative experience is better on the app')}
        </p>

        <a href="https://apps.apple.com" target="_blank" rel="noopener noreferrer" style={{
          flexShrink: 0,
          fontFamily: "'TT Interphases Pro',sans-serif",
          fontSize: mobile ? 10 : 11, fontWeight: 400,
          letterSpacing: '0.06em',
          color: 'rgba(177,154,122,0.7)',
          textDecoration: 'none',
          borderBottom: '1px solid rgba(177,154,122,0.25)',
          paddingBottom: 1,
          transition: 'color 0.3s, border-color 0.3s',
        }}
        onMouseEnter={e => { e.currentTarget.style.color = 'rgba(177,154,122,1)'; e.currentTarget.style.borderColor = 'rgba(177,154,122,0.5)'; }}
        onMouseLeave={e => { e.currentTarget.style.color = 'rgba(177,154,122,0.7)'; e.currentTarget.style.borderColor = 'rgba(177,154,122,0.25)'; }}
        >
          {L?.download||'Download'}
        </a>

        <button onClick={dismiss} aria-label="Dismiss" style={{
          flexShrink: 0, background: 'none', border: 'none', cursor: 'pointer',
          padding: 8, display: 'flex', alignItems: 'center', justifyContent: 'center',
          opacity: 0.35, transition: 'opacity 0.3s', minWidth: 28, minHeight: 28,
        }}
        onMouseEnter={e => e.currentTarget.style.opacity = '0.6'}
        onMouseLeave={e => e.currentTarget.style.opacity = '0.35'}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="rgba(212,208,200,0.8)" strokeWidth="1.2" strokeLinecap="round">
            <path d="M18 6L6 18M6 6l12 12"/>
          </svg>
        </button>
      </div>
    </div>
  );
}
