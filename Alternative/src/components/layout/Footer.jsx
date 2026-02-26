import { useState } from 'react';
import { C, T } from '../../constants/theme.js';
import { WHATSAPP_NUMBER } from '../../constants/config.js';
import { IconCheck } from '../icons/Icons.jsx';
import { Logo } from './Logo.jsx';

// ── FOOTER ────────────────────────────────────────────────────────────────────
export default function Footer({setPage,L,mobile}) {
  const px=mobile?"20px":"48px";
  const [email,setEmail]=useState("");
  const [subscribed,setSubscribed]=useState(false);

  const onSubscribe=(e)=>{
    e&&e.preventDefault&&e.preventDefault();
    if(email.includes("@")){setSubscribed(true);setTimeout(()=>setSubscribed(false),4000);}
  };

  const linkStyle={display:"block",background:"none",border:"none",...T.bodySm,color:"rgba(168,162,150,0.75)",marginBottom:10,padding:0,textAlign:"left",fontSize:mobile?12:13,cursor:"pointer",letterSpacing:"0.01em",transition:"color 0.2s"};

  return (
    <footer style={{background:C.black}}>

      {/* ── NEWSLETTER ──────────────────────────────────────────── */}
      <div style={{borderBottom:`1px solid rgba(168,162,150,0.1)`,padding:mobile?"48px 0":"72px 0"}}>
        <div style={{maxWidth:1360,margin:"0 auto",padding:`0 ${px}`,display:"grid",gridTemplateColumns:mobile?"1fr":"1fr 1fr",gap:mobile?28:80,alignItems:"center"}}>
          <div>
            <h3 style={{...T.displaySm,color:C.white,marginBottom:10,fontSize:mobile?20:22,letterSpacing:"0.02em"}}>{L.footerNewsletterTitle}</h3>
            <p style={{...T.body,color:"rgba(168,162,150,0.6)",lineHeight:1.8,fontSize:mobile?12:13}}>{L.footerNewsletterBody}</p>
          </div>
          <div>
            <div style={{display:"flex",gap:0}}>
              <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder={L.footerEmailPlaceholder}
                style={{flex:1,padding:"14px 18px",background:"transparent",border:`1px solid rgba(168,162,150,0.2)`,borderRight:"none",color:C.white,...T.body,fontSize:13,outline:"none",letterSpacing:"0.02em"}}/>
              <button onClick={onSubscribe}
                style={{padding:"14px 28px",background:C.white,border:"none",color:C.black,...T.labelSm,fontSize:9,cursor:"pointer",flexShrink:0,transition:"all 0.25s",display:"inline-flex",alignItems:"center",gap:6,letterSpacing:"0.12em"}}>
                {subscribed?(<>{L.footerSubscribed} <IconCheck size={10} color={C.black} stroke={2}/></>):L.footerSubscribe}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── MAIN FOOTER GRID ────────────────────────────────────── */}
      <div style={{padding:mobile?"40px 0":"64px 0",borderBottom:`1px solid rgba(168,162,150,0.1)`}}>
        <div style={{maxWidth:1360,margin:"0 auto",padding:`0 ${px}`,display:"grid",gridTemplateColumns:mobile?"1fr 1fr":"2.5fr 1fr 1fr 1fr",gap:mobile?28:48}}>

          {/* Brand column */}
          <div style={mobile?{gridColumn:"1 / -1"}:{}}>
            <div style={{marginBottom:20}}><Logo size={mobile?0.7:0.85} variant="white"/></div>
            <p style={{...T.bodySm,color:"rgba(168,162,150,0.55)",lineHeight:1.9,maxWidth:280,marginBottom:24,fontSize:mobile?12:13}}>{L.footerDesc}</p>

            {/* Social icons — inline, monochrome, minimal */}
            <div style={{display:"flex",gap:14,alignItems:"center",marginBottom:24}}>
              <a href="https://www.instagram.com/alternative.ge?igsh=MXNmanh4OHB3ZmphNw==" target="_blank" rel="noopener noreferrer" style={{width:36,height:36,borderRadius:"50%",border:`1px solid rgba(168,162,150,0.18)`,display:"flex",alignItems:"center",justifyContent:"center",textDecoration:"none",transition:"border-color 0.25s"}}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(168,162,150,0.55)" strokeWidth="1.5"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="5"/><circle cx="17.5" cy="6.5" r="1.5" fill="rgba(168,162,150,0.55)" stroke="none"/></svg>
              </a>
              <a href="https://www.facebook.com/share/1HWqtnunMk/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer" style={{width:36,height:36,borderRadius:"50%",border:`1px solid rgba(168,162,150,0.18)`,display:"flex",alignItems:"center",justifyContent:"center",textDecoration:"none",transition:"border-color 0.25s"}}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(168,162,150,0.55)" strokeWidth="1.5"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></svg>
              </a>
              <a href="https://www.tiktok.com/@alternative.ge?_r=1&_t=ZS-94DbATQVFWG" target="_blank" rel="noopener noreferrer" style={{width:36,height:36,borderRadius:"50%",border:`1px solid rgba(168,162,150,0.18)`,display:"flex",alignItems:"center",justifyContent:"center",textDecoration:"none",transition:"border-color 0.25s"}}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="rgba(168,162,150,0.55)"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.88-2.89 2.89 2.89 0 012.88-2.89c.28 0 .55.04.81.11V9.01a6.32 6.32 0 00-.81-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V8.79a8.18 8.18 0 004.76 1.52v-3.4a4.85 4.85 0 01-1-.22z"/></svg>
              </a>
            </div>

            {/* WhatsApp + Contact */}
            <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer" style={{...T.labelSm,color:C.tan,fontSize:9,display:"inline-flex",alignItems:"center",gap:6,textDecoration:"none",letterSpacing:"0.1em",marginBottom:16}}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"/></svg>
              {L.whatsappUs}
            </a>
            <div style={{display:"flex",flexDirection:"column",gap:6,marginTop:8}}>
              <span style={{...T.bodySm,color:"rgba(168,162,150,0.45)",fontSize:11}}>{L.footerLocation}</span>
              <a href="mailto:info@alternative.ge" style={{...T.bodySm,color:"rgba(168,162,150,0.45)",fontSize:11,textDecoration:"none"}}>info@alternative.ge</a>
              <span style={{...T.bodySm,color:"rgba(168,162,150,0.35)",fontSize:10,marginTop:4}}>{L.footerHours}</span>
            </div>
          </div>

          {/* About column */}
          <div>
            <p style={{...T.labelSm,color:"rgba(168,162,150,0.5)",marginBottom:mobile?12:20,fontSize:9,letterSpacing:"0.14em"}}>{L.footerAbout}</p>
            {[[L.ourStoryFooter,"about",null],[L.footerHowItWorks,"how",null],[L.contact,"contact",null]].map(([l,pg,scrollTo])=>(
              <button key={l} onClick={()=>{if(scrollTo)window.__initHowScroll=scrollTo;setPage(pg);}} style={linkStyle}>{l}</button>
            ))}
          </div>

          {/* Help / Customer Care column */}
          <div>
            <p style={{...T.labelSm,color:"rgba(168,162,150,0.5)",marginBottom:mobile?12:20,fontSize:9,letterSpacing:"0.14em"}}>{L.footerHelp}</p>
            {[[L.faqFooter,"how","faq"],[L.footerShipping,"shipping",null],[L.footerReturnsLink,"returns",null]].map(([l,pg,scrollTo])=>(
              <button key={l} onClick={()=>{if(scrollTo)window.__initHowScroll=scrollTo;setPage(pg);}} style={linkStyle}>{l}</button>
            ))}
          </div>

          {/* Membership column */}
          <div>
            <p style={{...T.labelSm,color:"rgba(168,162,150,0.5)",marginBottom:mobile?12:20,fontSize:9,letterSpacing:"0.14em"}}>{L.footerDiscounts}</p>
            {[[L.footerAffiliate,"membership","affiliate"],[L.footerRefer,"membership","refer"],[L.footerMembership,"auth",null]].map(([l,pg,scrollTo])=>(
              <button key={l} onClick={()=>{if(scrollTo)window.__initMembershipScroll=scrollTo;setPage(pg);}} style={linkStyle}>{l}</button>
            ))}
          </div>
        </div>
      </div>

      {/* ── BOTTOM BAR ──────────────────────────────────────────── */}
      <div style={{padding:mobile?"20px 0":"28px 0"}}>
        <div style={{maxWidth:1360,margin:"0 auto",padding:`0 ${px}`}}>
          {/* Legal links */}
          <div style={{display:"flex",gap:mobile?12:28,flexWrap:"wrap",marginBottom:16,alignItems:"center"}}>
            {[[L.footerPrivacy,"privacy"],[L.footerTerms,"terms"],[L.footerAccessibility,"accessibility"]].map(([l,pg])=>(
              <button key={pg} onClick={()=>setPage(pg)} style={{background:"none",border:"none",...T.labelSm,color:"rgba(168,162,150,0.4)",fontSize:8,padding:0,cursor:"pointer",letterSpacing:"0.08em"}}>{l}</button>
            ))}
          </div>
          {/* Payments */}
          <div style={{display:"flex",gap:10,marginBottom:16,alignItems:"center"}}>
            <span style={{...T.labelSm,color:"rgba(168,162,150,0.3)",fontSize:8,letterSpacing:"0.08em"}}>{L.footerPayments}</span>
            {["VISA","MC","BOG","TBC","BTC"].map(m=>(
              <span key={m} style={{padding:"2px 7px",border:"1px solid rgba(168,162,150,0.12)",borderRadius:2,...T.labelSm,color:"rgba(168,162,150,0.35)",fontSize:7,letterSpacing:"0.06em"}}>{m}</span>
            ))}
          </div>
          {/* Copyright */}
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:8}}>
            <p style={{...T.labelSm,color:"rgba(168,162,150,0.35)",fontSize:8,letterSpacing:"0.04em"}}>{L.copyright}</p>
            <p style={{...T.labelSm,color:"rgba(168,162,150,0.35)",fontSize:8,letterSpacing:"0.04em"}}>{L.footerTbilisi}</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
