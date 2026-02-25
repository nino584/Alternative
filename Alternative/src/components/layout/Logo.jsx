import { C } from '../../constants/theme.js';

// ── LOGO ──────────────────────────────────────────────────────────────────────
export const LogoMark = ({color=C.black,size=1}) => (
  <svg width={28*size} height={28*size} viewBox="0 0 40 40" fill="none">
    <path d="M20 2L4 38h6.5l3-6.8h13l3 6.8H36L20 2zm0 11.2L27.1 28H12.9L20 13.2z" fill={color}/>
    <rect x="15" y="29" width="10" height="1.8" fill={color}/>
    <rect x="16" y="32" width="8" height="1.8" fill={color}/>
  </svg>
);

export const Logo = ({color=C.black,size=1}) => (
  <svg width={160*size} height={36*size} viewBox="0 0 160 36" fill="none">
    <text x="0" y="30" fontFamily="'Alido',Georgia,serif" fontSize="32" fontWeight="400" fill={color} letterSpacing="-0.5">Alternative</text>
  </svg>
);
