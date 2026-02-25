// ── COLORS ────────────────────────────────────────────────────────────────────
export const C = {
  black:"#191919", cream:"#e7e8e1", tan:"#b19a7a", brown:"#584638",
  gray:"#a8a296", lgray:"#d4d0c8", offwhite:"#f4f2ed", white:"#ffffff",
  green:"#1a6b3a", red:"#8b2020",
  // Hero (reference-matched)
  heroBg:"#F2EDE7",
  heroHeadline:"#33302D",
  heroTan:"#B19A76",
  heroSub:"#7A7570",
  heroBody:"#5B5651",
  heroBtnDark:"#2B2B2B",
  heroScroll:"#C4BDB5",
  heroOutline:"#33302D",
  heroRightBg:"#E5E0DA",
};

// ── TYPOGRAPHY ────────────────────────────────────────────────────────────────
export const T = {
  displayXL:{fontFamily:"'Alido',serif",fontSize:"clamp(52px,8vw,104px)",fontWeight:400,lineHeight:0.92,letterSpacing:"-1px"},
  displayLg:{fontFamily:"'Alido',serif",fontSize:"clamp(36px,5.5vw,68px)",fontWeight:400,lineHeight:1.0},
  displayMd:{fontFamily:"'Alido',serif",fontSize:"clamp(26px,3.5vw,44px)",fontWeight:400,lineHeight:1.1},
  displaySm:{fontFamily:"'Alido',serif",fontSize:"clamp(20px,2.5vw,32px)",fontWeight:400,lineHeight:1.2},
  heading:{fontFamily:"'TT Interphases Pro',sans-serif",fontSize:"15px",fontWeight:500,letterSpacing:"0.04em"},
  label:{fontFamily:"'TT Interphases Pro',sans-serif",fontSize:"11px",fontWeight:500,letterSpacing:"0.14em",textTransform:"uppercase"},
  labelSm:{fontFamily:"'TT Interphases Pro',sans-serif",fontSize:"9px",fontWeight:500,letterSpacing:"0.18em",textTransform:"uppercase"},
  body:{fontFamily:"'TT Interphases Pro',sans-serif",fontSize:"15px",fontWeight:300,lineHeight:1.75},
  bodySm:{fontFamily:"'TT Interphases Pro',sans-serif",fontSize:"13px",fontWeight:300,lineHeight:1.65},
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
