// ── COLORS ────────────────────────────────────────────────────────────────────
export const C = {
  black:"#191919", cream:"#f0f0ec", tan:"#b19a7a", brown:"#584638",
  gray:"#5c564f", lgray:"#d4d0c8", offwhite:"#f7f6f3", white:"#ffffff",
  green:"#1a6b3a", red:"#8b2020",
  muted:"#8a8479",
  border:"#e0ddd7",
};

// ── TYPOGRAPHY ────────────────────────────────────────────────────────────────
export const T = {
  displayXL:{fontFamily:"'Alido',serif",fontSize:"clamp(52px,8vw,104px)",fontWeight:400,lineHeight:0.92,letterSpacing:"-1px"},
  displayLg:{fontFamily:"'Alido',serif",fontSize:"clamp(36px,5.5vw,68px)",fontWeight:400,lineHeight:1.0},
  displayMd:{fontFamily:"'Alido',serif",fontSize:"clamp(26px,3.5vw,44px)",fontWeight:400,lineHeight:1.1},
  displaySm:{fontFamily:"'Alido',serif",fontSize:"clamp(20px,2.5vw,32px)",fontWeight:400,lineHeight:1.2},
  heading:{fontFamily:"'TT Interphases Pro',sans-serif",fontSize:"16px",fontWeight:500,letterSpacing:"0.03em"},
  label:{fontFamily:"'TT Interphases Pro',sans-serif",fontSize:"12px",fontWeight:600,letterSpacing:"0.1em",textTransform:"uppercase"},
  labelSm:{fontFamily:"'TT Interphases Pro',sans-serif",fontSize:"10px",fontWeight:600,letterSpacing:"0.12em",textTransform:"uppercase"},
  body:{fontFamily:"'TT Interphases Pro',sans-serif",fontSize:"15px",fontWeight:400,lineHeight:1.7},
  bodySm:{fontFamily:"'TT Interphases Pro',sans-serif",fontSize:"14px",fontWeight:400,lineHeight:1.6},
};

// ── GLOBAL CSS ────────────────────────────────────────────────────────────────
export const STYLES = `
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
  html{scroll-behavior:smooth}
  body{font-family:'TT Interphases Pro',sans-serif;background:#e7e8e1;color:#191919;-webkit-font-smoothing:antialiased}
  ::-webkit-scrollbar{width:4px}::-webkit-scrollbar-track{background:#e7e8e1}::-webkit-scrollbar-thumb{background:#b19a7a}
  button{cursor:pointer;font-family:'TT Interphases Pro',sans-serif}
  input,select,textarea{font-family:'TT Interphases Pro',sans-serif;-webkit-appearance:none}
  img{display:block}
  @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
  @keyframes fadeIn{from{opacity:0}to{opacity:1}}
  @keyframes slideRight{from{transform:translateX(100%)}to{transform:translateX(0)}}
  @keyframes slideDown{from{opacity:0;transform:translateY(-8px)}to{opacity:1;transform:translateY(0)}}
  @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.3}}
  @keyframes toastIn{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
  @keyframes toastOut{from{opacity:1;transform:translateY(0)}to{opacity:0;transform:translateY(16px)}}
  @keyframes spinAnim{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
`;
