import { useState, useEffect } from 'react';

export default function LoadingScreen({ onComplete }) {
  const [phase, setPhase] = useState(0); // 0=initial, 1=animate, 2=fadeout, 3=done

  useEffect(() => {
    // Phase 1: Start animation after brief delay
    const t1 = setTimeout(() => setPhase(1), 100);
    // Phase 2: Start fadeout
    const t2 = setTimeout(() => setPhase(2), 1800);
    // Phase 3: Remove from DOM
    const t3 = setTimeout(() => {
      setPhase(3);
      if (onComplete) onComplete();
    }, 2400);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onComplete]);

  if (phase === 3) return null;

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 99999,
      background: '#191919',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      opacity: phase === 2 ? 0 : 1,
      transition: 'opacity 0.6s ease',
    }}>
      <style>{`
        @keyframes logoReveal {
          0% { letter-spacing: 0.8em; opacity: 0; transform: translateY(10px); }
          60% { letter-spacing: 0.35em; opacity: 1; transform: translateY(0); }
          100% { letter-spacing: 0.25em; opacity: 1; transform: translateY(0); }
        }
        @keyframes lineGrow {
          0% { width: 0; }
          100% { width: 80px; }
        }
        @keyframes subtitleFade {
          0% { opacity: 0; transform: translateY(5px); }
          100% { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* Brand name */}
      <h1 style={{
        fontFamily: "'Alido', Georgia, serif",
        fontSize: 'clamp(24px, 5vw, 42px)',
        fontWeight: 300,
        color: '#faf8f5',
        margin: 0,
        letterSpacing: '0.25em',
        textTransform: 'uppercase',
        animation: phase >= 1 ? 'logoReveal 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards' : 'none',
        opacity: phase >= 1 ? undefined : 0,
      }}>
        ALTERNATIVE
      </h1>

      {/* Gold accent line */}
      <div style={{
        height: 1,
        background: 'linear-gradient(90deg, transparent, #b19a7a, transparent)',
        marginTop: 20,
        animation: phase >= 1 ? 'lineGrow 1s 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards' : 'none',
        width: phase >= 1 ? undefined : 0,
      }} />

    </div>
  );
}
