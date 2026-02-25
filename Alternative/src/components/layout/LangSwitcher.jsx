import { useState, useRef, useEffect } from 'react';
import { C, T } from '../../constants/theme.js';
import { IconCheck } from '../icons/Icons.jsx';

const OPTS = [
  { code: 'en', label: 'EN', fullLabel: 'English' },
  { code: 'ka', label: 'GE', fullLabel: 'ქართული' },
  { code: 'ru', label: 'RU', fullLabel: 'Русский' },
];

function ChevronDown({ open }) {
  return (
    <svg
      width="10"
      height="6"
      viewBox="0 0 10 6"
      fill="none"
      stroke={C.black}
      strokeOpacity={0.7}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{
        display: 'block',
        transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
        transition: 'transform 0.2s ease',
      }}
    >
      <path d="M1 1l4 4 4-4" />
    </svg>
  );
}

// ── LANGUAGE SWITCHER ─────────────────────────────────────────────────────────
export default function LangSwitcher({ lang, setLang }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const fn = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', fn);
    return () => document.removeEventListener('mousedown', fn);
  }, []);

  const current = OPTS.find((o) => o.code === lang) || OPTS[0];

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label="Select language"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          height: 40,
          padding: '0 12px 0 12px',
          background: open ? 'rgba(25,25,25,0.06)' : 'transparent',
          border: 'none',
          borderRadius: 6,
          cursor: 'pointer',
          transition: 'background 0.2s ease',
        }}
        onMouseEnter={(e) => {
          if (!open) e.currentTarget.style.background = 'rgba(25,25,25,0.04)';
        }}
        onMouseLeave={(e) => {
          if (!open) e.currentTarget.style.background = 'transparent';
        }}
      >
        <span
          style={{
            ...T.labelSm,
            color: C.black,
            fontSize: 10,
            fontWeight: 500,
            letterSpacing: '0.12em',
            transition: 'color 0.2s ease',
          }}
        >
          {current.label}
        </span>
        <ChevronDown open={open} />
      </button>

      {open && (
        <div
          role="listbox"
          aria-label="Language options"
          style={{
            position: 'absolute',
            top: 'calc(100% + 8px)',
            right: 0,
            minWidth: 180,
            background: C.white,
            border: `1px solid rgba(25,25,25,0.14)`,
            borderRadius: 8,
            boxShadow: '0 8px 24px rgba(25,25,25,0.12), 0 2px 8px rgba(25,25,25,0.06)',
            zIndex: 300,
            overflow: 'hidden',
            animation: 'slideDown 0.2s ease',
          }}
        >
          {OPTS.map((o) => {
            const isSelected = lang === o.code;
            return (
              <button
                key={o.code}
                type="button"
                role="option"
                aria-selected={isSelected}
                onClick={() => {
                  setLang(o.code);
                  setOpen(false);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  width: '100%',
                  padding: '12px 16px',
                  background: isSelected ? 'rgba(25,25,25,0.06)' : 'transparent',
                  border: 'none',
                  borderLeft: `3px solid ${isSelected ? C.brown : 'transparent'}`,
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'background 0.15s ease, border-color 0.15s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = isSelected ? 'rgba(25,25,25,0.08)' : 'rgba(25,25,25,0.04)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = isSelected ? 'rgba(25,25,25,0.06)' : 'transparent';
                }}
              >
                <span
                  style={{
                    ...T.bodySm,
                    color: isSelected ? C.black : C.brown,
                    fontSize: 13,
                    fontWeight: isSelected ? 600 : 400,
                    flex: 1,
                  }}
                >
                  {o.fullLabel}
                </span>
                {isSelected && (
                  <span style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
                    <IconCheck size={14} color={C.brown} stroke={2} />
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
