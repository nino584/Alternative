import { useState } from 'react';
import { C, T, S } from '../../constants/theme.js';
import { WHATSAPP_NUMBER } from '../../constants/config.js';
import { IconCheck } from '../icons/Icons.jsx';
import { Logo } from './Logo.jsx';

// ── FOOTER ────────────────────────────────────────────────────────────────────
export default function Footer({setPage,L,mobile}) {
  const px=mobile?`${S.lg}px`:`${S.xxl}px`;
  const [email,setEmail]=useState("");
  const [subscribed,setSubscribed]=useState(false);

  const onSubscribe=(e)=>{
    e&&e.preventDefault&&e.preventDefault();
    if(email.includes("@")){setSubscribed(true);setTimeout(()=>setSubscribed(false),4000);}
  };

  const linkStyle={display:"block",background:"none",border:"none",...T.bodySm,color:C.onDark,marginBottom:S.sm,padding:0,textAlign:"left",cursor:"pointer",transition:"color 0.2s,opacity 0.2s"};

  return (
    <footer role="contentinfo" aria-label="Site footer" style={{background:C.black}}>

      {/* ── NEWSLETTER ──────────────────────────────────────────── */}
      <div style={{borderBottom:`1px solid var(--c-divider)`,padding:mobile?`${S.xxl}px 0`:`${S.xxxl+S.sm}px 0`}}>
        <div style={{maxWidth:1360,margin:"0 auto",padding:`0 ${px}`,display:"grid",gridTemplateColumns:mobile?"1fr":"1fr 1fr",gap:mobile?S.xl:S.xxxxl-S.md,alignItems:"center"}}>
          <div>
            <h3 style={{...T.displaySm,color:C.cream,marginBottom:S.sm,fontSize:mobile?20:22,letterSpacing:"0.02em"}}>{L.footerNewsletterTitle}</h3>
            <p style={{...T.bodySm,color:C.onDarkMuted,lineHeight:1.6}}>{L.footerNewsletterBody}</p>
          </div>
          <div>
            <div style={{display:"flex",gap:0}}>
              <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder={L.footerEmailPlaceholder} aria-label={L.footerEmailPlaceholder||"Email address"}
                style={{flex:1,padding:`${S.md}px ${S.lg}px`,background:"transparent",border:`1px solid var(--c-divider)`,borderRight:"none",color:C.cream,...T.bodySm,outline:"none",letterSpacing:"0.02em"}}/>
              <button onClick={onSubscribe}
                style={{padding:`${S.md}px ${S.xl}px`,background:C.cream,border:"none",color:C.black,...T.labelSm,cursor:"pointer",flexShrink:0,transition:"all 0.25s",display:"inline-flex",alignItems:"center",gap:6}}>
                {subscribed?(<>{L.footerSubscribed} <IconCheck size={14} color={C.black} stroke={2}/></>):L.footerSubscribe}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── MAIN FOOTER GRID ────────────────────────────────────── */}
      <div style={{padding:mobile?`${S.xxl}px 0`:`${S.xxxl}px 0`,borderBottom:`1px solid var(--c-divider)`}}>
        <div style={{maxWidth:1360,margin:"0 auto",padding:`0 ${px}`,display:"grid",gridTemplateColumns:mobile?"1fr 1fr":"2.5fr 1fr 1fr 1fr",gap:mobile?S.xl:S.xxl}}>

          {/* Brand column */}
          <div style={mobile?{gridColumn:"1 / -1"}:{}}>
            <div style={{marginBottom:S.lg}}><Logo size={mobile?0.7:0.85} variant="white"/></div>
            <p style={{...T.bodySm,color:C.onDarkMuted,lineHeight:1.6,maxWidth:280,marginBottom:S.lg}}>{L.footerDesc}</p>

            <div style={{display:"flex",gap:S.md,alignItems:"center",marginBottom:S.lg}}>
              {[
                {label:"Instagram",href:"https://www.instagram.com/alternative.ge?igsh=MXNmanh4OHB3ZmphNw==",d:<><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="5"/><circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none"/></>},
                {label:"Facebook",href:"https://www.facebook.com/share/1HWqtnunMk/?mibextid=wwXIfr",d:<path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/>},
                {label:"TikTok",href:"https://www.tiktok.com/@alternative.ge?_r=1&_t=ZS-94DbATQVFWG",d:null,fill:<path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.88-2.89 2.89 2.89 0 012.88-2.89c.28 0 .55.04.81.11V9.01a6.32 6.32 0 00-.81-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V8.79a8.18 8.18 0 004.76 1.52v-3.4a4.85 4.85 0 01-1-.22z"/>},
              ].map(s=>(
                <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label} style={{width:44,height:44,borderRadius:"50%",border:`1px solid var(--c-divider)`,display:"flex",alignItems:"center",justifyContent:"center",textDecoration:"none",color:C.onDarkMuted,transition:"border-color 0.25s,color 0.25s"}}>
                  {s.fill?<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">{s.fill}</svg>
                  :<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">{s.d}</svg>}
                </a>
              ))}
            </div>

            <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer" style={{...T.labelSm,color:C.tan,display:"inline-flex",alignItems:"center",gap:6,textDecoration:"none",marginBottom:S.md}}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"/></svg>
              {L.whatsappUs}
            </a>
            <div style={{display:"flex",flexDirection:"column",gap:S.xs,marginTop:S.sm}}>
              <span style={{...T.caption,color:C.onDarkMuted}}>{L.footerLocation}</span>
              <a href="mailto:info@alternative.ge" style={{...T.caption,color:C.onDarkMuted,textDecoration:"none"}}>info@alternative.ge</a>
              <span style={{...T.caption,color:C.onDarkMuted,marginTop:S.xs}}>{L.footerHours}</span>
            </div>
          </div>

          {/* About column */}
          <div>
            <p style={{...T.labelSm,color:C.onDarkMuted,marginBottom:mobile?S.md:S.lg}}>{L.footerAbout}</p>
            {[[L.ourStoryFooter,"about",null],[L.footerHowItWorks,"how",null],[L.contact,"contact",null]].map(([l,pg,scrollTo])=>(
              <button key={l} onClick={()=>{if(scrollTo)window.__initHowScroll=scrollTo;setPage(pg);}} style={linkStyle}>{l}</button>
            ))}
          </div>

          {/* Help column */}
          <div>
            <p style={{...T.labelSm,color:C.onDarkMuted,marginBottom:mobile?S.md:S.lg}}>{L.footerHelp}</p>
            {[[L.faqFooter,"how","faq"],[L.footerShipping,"shipping",null],[L.footerReturnsLink,"returns",null]].map(([l,pg,scrollTo])=>(
              <button key={l} onClick={()=>{if(scrollTo)window.__initHowScroll=scrollTo;setPage(pg);}} style={linkStyle}>{l}</button>
            ))}
          </div>

          {/* Membership column */}
          <div>
            <p style={{...T.labelSm,color:C.onDarkMuted,marginBottom:mobile?S.md:S.lg}}>{L.footerDiscounts}</p>
            {[[L.footerAffiliate,"membership","affiliate"],[L.footerRefer,"membership","refer"],[L.footerMembership,"auth",null]].map(([l,pg,scrollTo])=>(
              <button key={l} onClick={()=>{if(scrollTo)window.__initMembershipScroll=scrollTo;setPage(pg);}} style={linkStyle}>{l}</button>
            ))}
          </div>
        </div>
      </div>

      {/* ── BOTTOM BAR ──────────────────────────────────────────── */}
      <div style={{padding:mobile?`${S.lg}px 0`:`${S.xl}px 0`}}>
        <div style={{maxWidth:1360,margin:"0 auto",padding:`0 ${px}`}}>
          <div style={{display:"flex",gap:mobile?S.md:S.xl,flexWrap:"wrap",marginBottom:S.md,alignItems:"center"}}>
            {[[L.footerPrivacy,"privacy"],[L.footerTerms,"terms"],[L.footerAccessibility,"accessibility"]].map(([l,pg])=>(
              <button key={pg} onClick={()=>setPage(pg)} style={{background:"none",border:"none",...T.caption,color:C.onDarkMuted,padding:`${S.xs}px 0`,cursor:"pointer",transition:"color 0.2s"}}>{l}</button>
            ))}
          </div>
          <div style={{display:"flex",gap:S.sm,marginBottom:S.md,alignItems:"center",flexWrap:"wrap"}}>
            <span style={{...T.caption,color:C.onDarkMuted}}>{L.footerPayments}</span>
            {["VISA","MC","BOG","TBC","BTC"].map(m=>(
              <span key={m} style={{padding:`${S.xs}px ${S.sm}px`,border:`1px solid var(--c-divider)`,borderRadius:"var(--radius-sm)",...T.caption,color:C.onDarkMuted}}>{m}</span>
            ))}
          </div>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:S.sm}}>
            <p style={{...T.caption,color:C.onDarkMuted}}>{L.copyright}</p>
            <p style={{...T.caption,color:C.onDarkMuted}}>{L.footerTbilisi}</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
