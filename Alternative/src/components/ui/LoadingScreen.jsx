import { useState, useEffect } from 'react';

const BASE = import.meta.env.BASE_URL;

export default function LoadingScreen({ onComplete }) {
  const [phase, setPhase] = useState(0); // 0=initial, 1=animate, 2=fadeout, 3=done

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 100);
    const t2 = setTimeout(() => setPhase(2), 2000);
    const t3 = setTimeout(() => {
      setPhase(3);
      if (onComplete) onComplete();
    }, 2700);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onComplete]);

  if (phase === 3) return null;

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 99999,
      background: '#f5f0eb',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      opacity: phase === 2 ? 0 : 1,
      transition: 'opacity 0.7s cubic-bezier(0.4, 0, 0.2, 1)',
    }}>
      <style>{`
        @keyframes logoScale {
          0% { opacity: 0; transform: scale(0.7); filter: blur(8px); }
          50% { opacity: 1; transform: scale(1.04); filter: blur(0); }
          100% { opacity: 1; transform: scale(1); filter: blur(0); }
        }
        @keyframes shimmerLine {
          0% { width: 0; opacity: 0; }
          30% { opacity: 1; }
          100% { width: 100px; opacity: 1; }
        }
        @keyframes glowPulse {
          0%, 100% { opacity: 0.3; transform: translate(-50%,-50%) scale(1); }
          50% { opacity: 0.55; transform: translate(-50%,-50%) scale(1.1); }
        }
      `}</style>

      {/* Logo with glow */}
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {/* Blurred circular glow behind logo */}
        <div style={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%,-50%)',
          width: 'clamp(120px, 22vw, 200px)', height: 'clamp(120px, 22vw, 200px)',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(177,154,122,0.25) 0%, rgba(177,154,122,0.08) 50%, transparent 70%)',
          filter: 'blur(20px)',
          animation: phase >= 1 ? 'glowPulse 2.5s ease-in-out infinite' : 'none',
          opacity: phase >= 1 ? undefined : 0,
        }} />
        <div style={{
          position: 'relative',
          animation: phase >= 1 ? 'logoScale 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards' : 'none',
          opacity: phase >= 1 ? undefined : 0,
        }}>
          <img
            src={`${BASE}images/logo.png`}
            alt="Alternative"
            style={{ height: 'clamp(50px, 10vw, 80px)', width: 'auto', display: 'block' }}
          />
        </div>
      </div>

      {/* Gold accent line */}
      <div style={{
        height: 1,
        background: 'linear-gradient(90deg, transparent, #b19a7a, transparent)',
        marginTop: 24,
        animation: phase >= 1 ? 'shimmerLine 1s 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards' : 'none',
        width: phase >= 1 ? undefined : 0,
        opacity: 0,
      }} />
    </div>
  );
}
