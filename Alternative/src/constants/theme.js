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
const _m = "'Alido',serif";           // main font
const _s = "'TT Interphases Pro',sans-serif"; // secondary font
export const T = {
  displayXL:{fontFamily:_m,fontSize:"clamp(48px,8vw,96px)",fontWeight:400,lineHeight:0.95,letterSpacing:"-0.02em"},
  displayLg:{fontFamily:_m,fontSize:"clamp(32px,5.5vw,64px)",fontWeight:400,lineHeight:1.05},
  displayMd:{fontFamily:_m,fontSize:"clamp(24px,3.5vw,44px)",fontWeight:400,lineHeight:1.15},
  displaySm:{fontFamily:_m,fontSize:"clamp(20px,2.5vw,28px)",fontWeight:400,lineHeight:1.2},
  heading:  {fontFamily:_m,fontSize:16,fontWeight:400,letterSpacing:"0.02em",lineHeight:1.35},
  headingSm:{fontFamily:_m,fontSize:14,fontWeight:400,letterSpacing:"0.02em",lineHeight:1.35},
  label:    {fontFamily:_s,fontSize:14,fontWeight:500,letterSpacing:"0.10em",textTransform:"uppercase",lineHeight:1.3},
  labelSm:  {fontFamily:_s,fontSize:14,fontWeight:500,letterSpacing:"0.12em",textTransform:"uppercase",lineHeight:1.3},
  body:     {fontFamily:_m,fontSize:16,fontWeight:400,lineHeight:1.6},
  bodySm:   {fontFamily:_m,fontSize:14,fontWeight:400,lineHeight:1.6},
  caption:  {fontFamily:_s,fontSize:14,fontWeight:400,lineHeight:1.5},
  button:   {fontFamily:_s,fontSize:14,fontWeight:500,letterSpacing:"0.08em",textTransform:"uppercase",lineHeight:1},
};

// ── GLOBAL CSS ───────────────────────────────────────────────────────────────
export const STYLES = `
  /* ── Light Theme Variables ───────────────────────────────────────────────── */
  :root{
    --c-black:#191919;--c-cream:#e7e8e1;--c-tan:#b19a7a;--c-tanDark:#7a6a52;
    --c-brown:#584638;--c-gray:#706b63;--c-lgray:#d4d0c8;--c-offwhite:#f4f2ed;
    --c-white:#ffffff;--c-green:#b19a7a;--c-red:#584638;
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
    --c-white:#1a1a18;--c-green:#c8b08e;--c-red:#a08068;
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
  body{font-family:'Alido',serif;background:var(--c-cream);color:var(--c-black);-webkit-font-smoothing:antialiased;transition:background 0.3s,color 0.3s}
  ::-webkit-scrollbar{width:4px}::-webkit-scrollbar-track{background:var(--c-cream)}::-webkit-scrollbar-thumb{background:var(--c-tan)}
  html{scrollbar-width:thin;scrollbar-color:var(--c-tan) var(--c-cream)}
  button{cursor:pointer;font-family:'TT Interphases Pro',sans-serif}
  input,select,textarea{font-family:'Alido',serif;-webkit-appearance:none}
  img{display:block}
  /* ── Focus ───────────────────────────────────────────────────────────────── */
  :focus-visible{outline:2px solid var(--c-tan);outline-offset:2px}
  input:focus-visible,select:focus-visible,textarea:focus-visible{outline:none;border-color:var(--c-tan) !important;box-shadow:0 0 0 3px rgba(177,154,122,0.15)}
  /* ── Button System ───────────────────────────────────────────────────────── */
  .btn{display:inline-flex;align-items:center;justify-content:center;font-family:'TT Interphases Pro',sans-serif;/* buttons stay secondary */font-size:14px;font-weight:500;letter-spacing:0.08em;text-transform:uppercase;line-height:1;border:none;padding:14px 32px;border-radius:var(--radius-sm);transition:all 0.25s cubic-bezier(0.4,0,0.2,1);cursor:pointer;position:relative;overflow:hidden}
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
  @keyframes shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}
  @keyframes gradientShift{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}
  @keyframes spotlightMove{0%{background-position:0% 0}100%{background-position:200% 0}}
  @keyframes marqueeScroll{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}
  @keyframes borderRotate{from{transform:translate(-50%,-50%) rotate(0deg)}to{transform:translate(-50%,-50%) rotate(360deg)}}

  /* ── Spotlight Input Border ────────────────────────────────────────────── */
  .spotlight-input-wrap{position:relative;padding:1px;overflow:hidden;border:1px solid rgba(177,154,122,0.12)}
  .spotlight-input-wrap::before{content:'';position:absolute;top:50%;left:50%;width:300%;height:300%;background:conic-gradient(from 0deg,transparent 0%,transparent 65%,var(--c-tan) 75%,rgba(177,154,122,0.6) 80%,transparent 90%,transparent 100%);animation:borderRotate 4s linear infinite;z-index:0}
  .spotlight-input-wrap::after{content:'';position:absolute;inset:1px;background:var(--c-black);z-index:0}
  .spotlight-input-wrap>*{position:relative;z-index:1}

  /* ── Spotlight Icon Border ───────────────────────────────────────────── */
  .spotlight-icon{position:relative;padding:1px;overflow:hidden}
  .spotlight-icon::before{content:'';position:absolute;top:50%;left:50%;width:300%;height:300%;background:conic-gradient(from 0deg,transparent 0%,transparent 65%,var(--c-tan) 75%,rgba(177,154,122,0.6) 80%,transparent 90%,transparent 100%);animation:borderRotate 4s linear infinite;z-index:0}
  .spotlight-icon::after{content:'';position:absolute;inset:1px;background:var(--c-black);z-index:0}
  .spotlight-icon>*{position:relative;z-index:1}

  /* ── Luxury Button Effects ─────────────────────────────────────────────── */

  /* Underline Draw — line draws in from left on hover */
  .btn-underline-draw{position:relative;background:transparent;border:none;color:var(--c-black);padding:14px 0;overflow:visible}
  .btn-underline-draw::after{content:'';position:absolute;bottom:0;left:0;width:0;height:1px;background:var(--c-tan);transition:width 0.4s cubic-bezier(0.25,0.46,0.45,0.94)}
  .btn-underline-draw:hover::after{width:100%}
  .btn-underline-draw:hover{color:var(--c-tan)}

  /* Shimmer Button — subtle light sweep across surface */
  .btn-shimmer{position:relative;overflow:hidden;background:var(--c-black);color:var(--c-cream)}
  .btn-shimmer::before{content:'';position:absolute;top:0;left:-100%;width:50%;height:100%;background:linear-gradient(90deg,transparent,rgba(255,255,255,0.08),transparent);transition:none}
  .btn-shimmer:hover::before{left:150%;transition:left 0.7s ease}
  .btn-shimmer:hover{box-shadow:0 4px 20px rgba(177,154,122,0.2)}

  /* Spotlight Border — glowing border that sweeps around */
  .btn-spotlight{position:relative;background:transparent;border:1px solid var(--c-lgray);color:var(--c-black);overflow:hidden;z-index:0}
  .btn-spotlight::before{content:'';position:absolute;inset:-1px;border-radius:inherit;background:linear-gradient(90deg,transparent,var(--c-tan),transparent);background-size:200% 100%;opacity:0;transition:opacity 0.3s ease;z-index:-2}
  .btn-spotlight:hover::before{opacity:1;animation:spotlightMove 1.5s linear infinite}
  .btn-spotlight::after{content:'';position:absolute;inset:1px;background:var(--c-cream);border-radius:inherit;z-index:-1}
  .btn-spotlight:hover{border-color:transparent;color:var(--c-tan)}

  /* Gradient Shift — smooth color gradient morph on hover */
  .btn-gradient{background:linear-gradient(135deg,var(--c-black) 0%,var(--c-brown) 50%,var(--c-black) 100%);background-size:200% 200%;color:var(--c-cream);border:none;transition:all 0.5s ease}
  .btn-gradient:hover{background-position:100% 100%;box-shadow:0 6px 24px rgba(88,70,56,0.25)}

  /* Top + Bottom Lines — decorative lines animate in from center */
  .btn-lines{position:relative;background:transparent;border:none;color:var(--c-black);padding:18px 32px}
  .btn-lines::before,.btn-lines::after{content:'';position:absolute;left:50%;width:0;height:1px;background:var(--c-tan);transition:width 0.35s cubic-bezier(0.25,0.46,0.45,0.94),left 0.35s cubic-bezier(0.25,0.46,0.45,0.94)}
  .btn-lines::before{top:0}
  .btn-lines::after{bottom:0}
  .btn-lines:hover::before,.btn-lines:hover::after{width:100%;left:0}
  .btn-lines:hover{color:var(--c-tan)}

  /* Luxury link — underline draw for nav/inline links */
  .luxury-link{position:relative;display:inline-block;color:inherit;text-decoration:none;transition:color 0.3s ease}
  .luxury-link::after{content:'';position:absolute;bottom:-2px;left:0;width:0;height:1px;background:var(--c-tan);transition:width 0.3s cubic-bezier(0.25,0.46,0.45,0.94)}
  .luxury-link:hover::after{width:100%}
  .luxury-link:hover{color:var(--c-tan)}

  /* Luxury icon button — refined hover */
  .icon-btn{display:flex;align-items:center;justify-content:center;background:none;border:none;cursor:pointer;width:44px;height:44px;border-radius:50%;transition:all 0.3s cubic-bezier(0.25,0.46,0.45,0.94);position:relative}
  .icon-btn:hover{background:rgba(177,154,122,0.08);transform:translateY(-1px)}
  .icon-btn:active{transform:scale(0.92);background:rgba(177,154,122,0.12)}
  .icon-btn svg{transition:all 0.3s ease}

  /* Gold accent divider */
  .gold-divider{width:40px;height:1px;background:linear-gradient(90deg,transparent,var(--c-tan),transparent);margin:0 auto}

  /* Elegant card hover — shadow only on image box */
  .luxury-card .card-img{transition:box-shadow 0.4s cubic-bezier(0.25,0.46,0.45,0.94)}
  .luxury-card:hover .card-img{box-shadow:0 8px 40px rgba(0,0,0,0.08)}

  /* Premium input — bottom border only, minimal */
  .luxury-input{background:transparent;border:none;border-bottom:1px solid var(--c-lgray);padding:16px 0;font-size:16px;color:var(--c-black);outline:none;transition:border-color 0.3s ease;width:100%;font-family:'Alido',serif;letter-spacing:0.02em}
  .luxury-input:focus{border-color:var(--c-tan)}
  .luxury-input::placeholder{color:var(--c-gray);letter-spacing:0.04em}

  /* ── Dark mode ─────────────────────────────────────────────────────────── */
  .dark img{filter:brightness(0.9)contrast(1.05)}
  .dark .btn-underline-draw,.dark .btn-lines{color:var(--c-cream)}
  .dark .btn-underline-draw:hover,.dark .btn-lines:hover{color:var(--c-tan)}
  .dark .btn-spotlight::after{background:var(--c-black)}
  .dark .btn-spotlight{color:var(--c-cream)}
  .dark .luxury-link{color:var(--c-cream)}
  .dark .luxury-input{color:var(--c-cream);border-color:var(--c-gray)}
  .dark .icon-btn:hover{background:rgba(200,176,142,0.1)}
`;
