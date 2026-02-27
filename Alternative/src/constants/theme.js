// ── COLORS (CSS variable refs — dark mode via .dark class on html) ────────────
export const C = {
  black:"var(--c-black)", cream:"var(--c-cream)", tan:"var(--c-tan)",
  tanDark:"var(--c-tanDark)", brown:"var(--c-brown)", gray:"var(--c-gray)",
  lgray:"var(--c-lgray)", offwhite:"var(--c-offwhite)", white:"var(--c-white)",
  green:"var(--c-green)", red:"var(--c-red)",
  onDark:"var(--c-onDark)", onDarkMuted:"var(--c-onDarkMuted)",
  heroBg:"var(--c-heroBg)", heroHeadline:"var(--c-heroHeadline)",
  heroTan:"var(--c-heroTan)", heroSub:"var(--c-heroSub)",
  heroBody:"var(--c-heroBody)", heroBtnDark:"var(--c-heroBtnDark)",
  heroScroll:"var(--c-heroScroll)", heroOutline:"var(--c-heroOutline)",
  heroRightBg:"var(--c-heroRightBg)",
};

// ── SPACING (8px base grid) ──────────────────────────────────────────────────
export const S = { xs:4, sm:8, md:16, lg:24, xl:32, xxl:48, xxxl:64, xxxxl:96 };

// ── TYPOGRAPHY (14px min all text, body lineHeight ≥ 1.5) ────────────────────
const _s = "'Alido',serif";
const _f = "'TT Interphases Pro',sans-serif";
export const T = {
  displayXL:{fontFamily:_s,fontSize:"clamp(48px,8vw,96px)",fontWeight:400,lineHeight:0.95,letterSpacing:"-0.02em"},
  displayLg:{fontFamily:_s,fontSize:"clamp(32px,5.5vw,64px)",fontWeight:400,lineHeight:1.05},
  displayMd:{fontFamily:_s,fontSize:"clamp(24px,3.5vw,44px)",fontWeight:400,lineHeight:1.15},
  displaySm:{fontFamily:_s,fontSize:"clamp(20px,2.5vw,28px)",fontWeight:400,lineHeight:1.2},
  heading:  {fontFamily:_f,fontSize:16,fontWeight:500,letterSpacing:"0.03em",lineHeight:1.35},
  headingSm:{fontFamily:_f,fontSize:14,fontWeight:500,letterSpacing:"0.03em",lineHeight:1.35},
  label:    {fontFamily:_f,fontSize:14,fontWeight:500,letterSpacing:"0.10em",textTransform:"uppercase",lineHeight:1.3},
  labelSm:  {fontFamily:_f,fontSize:14,fontWeight:500,letterSpacing:"0.12em",textTransform:"uppercase",lineHeight:1.3},
  body:     {fontFamily:_f,fontSize:16,fontWeight:300,lineHeight:1.6},
  bodySm:   {fontFamily:_f,fontSize:14,fontWeight:300,lineHeight:1.6},
  caption:  {fontFamily:_f,fontSize:14,fontWeight:400,lineHeight:1.5},
  button:   {fontFamily:_f,fontSize:14,fontWeight:500,letterSpacing:"0.08em",textTransform:"uppercase",lineHeight:1},
};

// ── GLOBAL CSS ───────────────────────────────────────────────────────────────
export const STYLES = `
  /* ── Light Theme Variables ───────────────────────────────────────────────── */
  :root{
    --c-black:#191919;--c-cream:#e7e8e1;--c-tan:#b19a7a;--c-tanDark:#7a6a52;
    --c-brown:#584638;--c-gray:#706b63;--c-lgray:#d4d0c8;--c-offwhite:#f4f2ed;
    --c-white:#ffffff;--c-green:#1a6b3a;--c-red:#8b2020;
    --c-onDark:#d4d0c8;--c-onDarkMuted:#9e9890;
    --c-heroBg:#F2EDE7;--c-heroHeadline:#33302D;--c-heroTan:#7a6748;
    --c-heroSub:#5e5953;--c-heroBody:#4a453f;--c-heroBtnDark:#2B2B2B;
    --c-heroScroll:#C4BDB5;--c-heroOutline:#33302D;--c-heroRightBg:#E5E0DA;
    --c-divider:rgba(177,154,122,0.12);--c-overlay:rgba(25,25,25,0.06);
    --shadow-sm:0 1px 3px rgba(0,0,0,0.06);
    --shadow-md:0 4px 12px rgba(0,0,0,0.08);
    --shadow-lg:0 8px 30px rgba(0,0,0,0.12);
    --shadow-card:0 1px 4px rgba(0,0,0,0.04),0 4px 16px rgba(0,0,0,0.04);
    --radius-sm:2px;--radius-md:4px;--radius-lg:8px;
  }
  /* ── Dark Theme ──────────────────────────────────────────────────────────── */
  .dark{
    --c-black:#e8e4df;--c-cream:#141412;--c-tan:#c8b08e;--c-tanDark:#c8b08e;
    --c-brown:#d4c0a8;--c-gray:#a09890;--c-lgray:#2e2c28;--c-offwhite:#1c1c1a;
    --c-white:#1a1a18;--c-green:#34a85c;--c-red:#d04848;
    --c-onDark:#2e2c28;--c-onDarkMuted:#5a5650;
    --c-heroBg:#1a1a18;--c-heroHeadline:#e8e4df;--c-heroTan:#c8b08e;
    --c-heroSub:#a09890;--c-heroBody:#c0b8b0;--c-heroBtnDark:#e0dcd6;
    --c-heroScroll:#4a4640;--c-heroOutline:#e8e4df;--c-heroRightBg:#1c1c1a;
    --c-divider:rgba(200,180,160,0.12);--c-overlay:rgba(0,0,0,0.15);
    --shadow-sm:0 1px 3px rgba(0,0,0,0.2);
    --shadow-md:0 4px 12px rgba(0,0,0,0.25);
    --shadow-lg:0 8px 30px rgba(0,0,0,0.35);
    --shadow-card:0 1px 4px rgba(0,0,0,0.15),0 4px 16px rgba(0,0,0,0.12);
  }
  /* ── Base Reset ──────────────────────────────────────────────────────────── */
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
  html{scroll-behavior:smooth}
  body{font-family:'TT Interphases Pro',sans-serif;background:var(--c-cream);color:var(--c-black);-webkit-font-smoothing:antialiased;transition:background 0.3s,color 0.3s}
  ::-webkit-scrollbar{width:4px}::-webkit-scrollbar-track{background:var(--c-cream)}::-webkit-scrollbar-thumb{background:var(--c-tan)}
  html{scrollbar-width:thin;scrollbar-color:var(--c-tan) var(--c-cream)}
  button{cursor:pointer;font-family:'TT Interphases Pro',sans-serif}
  input,select,textarea{font-family:'TT Interphases Pro',sans-serif;-webkit-appearance:none}
  img{display:block}
  /* ── Focus ───────────────────────────────────────────────────────────────── */
  :focus-visible{outline:2px solid var(--c-tan);outline-offset:2px}
  input:focus-visible,select:focus-visible,textarea:focus-visible{outline:none;border-color:var(--c-tan) !important;box-shadow:0 0 0 3px rgba(177,154,122,0.15)}
  /* ── Button System ───────────────────────────────────────────────────────── */
  .btn{display:inline-flex;align-items:center;justify-content:center;font-family:'TT Interphases Pro',sans-serif;font-size:14px;font-weight:500;letter-spacing:0.08em;text-transform:uppercase;line-height:1;border:none;padding:14px 32px;border-radius:var(--radius-sm);transition:all 0.25s cubic-bezier(0.4,0,0.2,1);cursor:pointer;position:relative;overflow:hidden}
  .btn:active:not(:disabled){transform:scale(0.97)}
  .btn:disabled{opacity:0.45;cursor:not-allowed;transform:none}
  .btn-primary{background:var(--c-black);color:var(--c-cream)}
  .btn-primary:hover:not(:disabled){background:var(--c-brown);box-shadow:var(--shadow-md)}
  .btn-secondary{background:transparent;color:var(--c-black);border:1px solid var(--c-black)}
  .btn-secondary:hover:not(:disabled){background:var(--c-black);color:var(--c-cream)}
  .btn-tan{background:var(--c-tan);color:var(--c-white)}
  .btn-tan:hover:not(:disabled){background:var(--c-brown);box-shadow:var(--shadow-md)}
  .btn-ghost{background:transparent;color:var(--c-gray);border:1px solid var(--c-lgray)}
  .btn-ghost:hover:not(:disabled){border-color:var(--c-black);color:var(--c-black)}
  .btn-danger{background:var(--c-red);color:#fff}
  .btn-danger:hover:not(:disabled){filter:brightness(0.85);box-shadow:var(--shadow-md)}
  .btn-white{background:#fff;color:var(--c-black);border:1px solid var(--c-divider)}
  .btn-white:hover:not(:disabled){background:var(--c-offwhite);box-shadow:var(--shadow-md)}
  /* ── Scroll Reveal ───────────────────────────────────────────────────────── */
  .reveal{opacity:0;transform:translateY(24px);transition:opacity 0.45s cubic-bezier(0.4,0,0.2,1),transform 0.45s cubic-bezier(0.4,0,0.2,1)}
  .reveal.visible{opacity:1;transform:translateY(0)}
  .reveal-delay-1{transition-delay:0.06s}.reveal-delay-2{transition-delay:0.12s}.reveal-delay-3{transition-delay:0.18s}.reveal-delay-4{transition-delay:0.24s}.reveal-delay-5{transition-delay:0.30s}
  /* ── Scroll-to-top ───────────────────────────────────────────────────────── */
  .scroll-top{position:fixed;bottom:24px;right:24px;width:44px;height:44px;border-radius:50%;background:var(--c-black);color:var(--c-cream);border:none;display:flex;align-items:center;justify-content:center;cursor:pointer;opacity:0;pointer-events:none;transition:opacity 0.3s,transform 0.3s,background 0.25s;z-index:100;box-shadow:var(--shadow-md)}
  .scroll-top.show{opacity:1;pointer-events:auto}
  .scroll-top:hover{background:var(--c-brown);transform:translateY(-2px);box-shadow:var(--shadow-lg)}
  .scroll-top:active{transform:scale(0.95)}
  /* ── Dark Mode Toggle ────────────────────────────────────────────────────── */
  .dark-toggle{width:44px;height:44px;border-radius:50%;background:transparent;border:1px solid var(--c-lgray);display:flex;align-items:center;justify-content:center;cursor:pointer;transition:all 0.25s}
  .dark-toggle:hover{background:var(--c-offwhite);border-color:var(--c-tan)}
  /* ── Reduced Motion ──────────────────────────────────────────────────────── */
  @media(prefers-reduced-motion:reduce){
    *,*::before,*::after{animation-duration:0.01ms !important;animation-iteration-count:1 !important;transition-duration:0.01ms !important;scroll-behavior:auto !important}
    .reveal{opacity:1;transform:none;transition:none}
  }
  /* ── Skip Link ───────────────────────────────────────────────────────────── */
  .skip-link{position:absolute;top:-44px;left:0;background:var(--c-black);color:var(--c-cream);padding:12px 20px;z-index:10000;font-size:14px;transition:top 0.2s;text-decoration:none}
  .skip-link:focus{top:0}
  /* ── Keyframes ───────────────────────────────────────────────────────────── */
  @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
  @keyframes fadeIn{from{opacity:0}to{opacity:1}}
  @keyframes slideRight{from{transform:translateX(100%)}to{transform:translateX(0)}}
  @keyframes slideDown{from{opacity:0;transform:translateY(-8px)}to{opacity:1;transform:translateY(0)}}
  @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.3}}
  @keyframes toastIn{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
  @keyframes toastOut{from{opacity:1;transform:translateY(0)}to{opacity:0;transform:translateY(16px)}}
  @keyframes spinAnim{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
  /* ── Dark mode images ────────────────────────────────────────────────────── */
  .dark img{filter:brightness(0.9)contrast(1.05)}
`;
