import { useState } from 'react';
import { C, T, S } from '../../constants/theme.js';
import { WHATSAPP_NUMBER } from '../../constants/config.js';
import { IconCheck } from '../icons/Icons.jsx';
import { Logo } from './Logo.jsx';
import { api } from '../../api.js';

// ── LUXURY FOOTER ────────────────────────────────────────────────────────────
export default function Footer({setPage,L,mobile}) {
  const px=mobile?`${S.lg}px`:`${S.xxl}px`;
  const [email,setEmail]=useState("");
  const [subscribed,setSubscribed]=useState(false);
  const [subError,setSubError]=useState("");
  const [subLoading,setSubLoading]=useState(false);

  const onSubscribe=(e)=>{
    e&&e.preventDefault&&e.preventDefault();
    if(!email.trim()){setSubError("enter");setTimeout(()=>setSubError(""),3000);return;}
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){setSubError("invalid");setTimeout(()=>setSubError(""),3000);return;}
    setSubError("");setSubLoading(true);
    api.subscribe(email)
      .then(()=>{setSubscribed(true);setEmail("");setTimeout(()=>setSubscribed(false),5000);})
      .catch(()=>{setSubError("failed");setTimeout(()=>setSubError(""),4000);})
      .finally(()=>setSubLoading(false));
  };

  const linkStyle={display:"block",background:"none",border:"none",fontFamily:"'Alido',serif",fontSize:14,fontWeight:400,color:C.onDark,marginBottom:10,padding:"2px 0",textAlign:"left",cursor:"pointer",transition:"color 0.3s"};

  return (
    <footer role="contentinfo" aria-label="Site footer" style={{background:C.black}}>

      {/* ── NEWSLETTER ──────────────────────────────────────────── */}
      <div style={{borderBottom:"1px solid rgba(177,154,122,0.08)",padding:mobile?`${S.xxl}px 0`:`${S.xxxl+S.md}px 0`}}>
        <div style={{maxWidth:1360,margin:"0 auto",padding:`0 ${px}`,display:"grid",gridTemplateColumns:mobile?"1fr":"1fr 1fr",gap:mobile?S.xl:S.xxxxl-S.md,alignItems:"center"}}>
          <div>
            <h3 style={{...T.displaySm,color:C.cream,marginBottom:S.sm,fontSize:mobile?20:22,letterSpacing:"0.02em"}}>{L.footerNewsletterTitle}</h3>
            <p style={{...T.bodySm,color:C.onDarkMuted,lineHeight:1.6}}>{L.footerNewsletterBody}</p>
          </div>
          <div>
            <div className="spotlight-input-wrap">
              <div style={{display:"flex",gap:0}}>
              <input type="email" value={email} onChange={e=>{setEmail(e.target.value);if(subError)setSubError("");}} onKeyDown={e=>e.key==="Enter"&&onSubscribe()} placeholder={L.footerEmailPlaceholder} aria-label={L.footerEmailPlaceholder||"Email address"}
                style={{flex:1,padding:`${S.md}px ${S.lg}px`,background:"transparent",border:"none",color:C.cream,...T.bodySm,outline:"none",letterSpacing:"0.02em",transition:"border-color 0.2s"}}/>
              <button onClick={onSubscribe} disabled={subLoading}
                style={{padding:`${S.md}px ${S.xl}px`,background:subscribed?C.tan:subError?C.brown:"transparent",border:"none",color:subscribed||subError?"#fff":C.tan,...T.labelSm,cursor:subLoading?"wait":"pointer",flexShrink:0,transition:"all 0.3s",display:"inline-flex",alignItems:"center",gap:6,minWidth:100,justifyContent:"center"}}>
                {subscribed?(<>{L.footerSubscribed||"Subscribed"} <IconCheck size={14} color="#fff" stroke={1.5}/></>)
                  :subError==="enter"?(L.enterEmail||"Enter email")
                  :subError==="invalid"?(L.invalidEmail||"Invalid email")
                  :subError==="failed"?(L.subFailed||"Try again")
                  :subLoading?"..."
                  :L.footerSubscribe}
              </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── MAIN FOOTER GRID ────────────────────────────────────── */}
      <div style={{padding:mobile?`${S.xxl}px 0`:`${S.xxxl}px 0`,borderBottom:"1px solid rgba(177,154,122,0.08)"}}>
        <div style={{maxWidth:1360,margin:"0 auto",padding:`0 ${px}`,display:"grid",gridTemplateColumns:mobile?"1fr 1fr":"2.5fr 1fr 1fr 1fr",gap:mobile?S.xl:S.xxl}}>

          {/* Brand column */}
          <div style={mobile?{gridColumn:"1 / -1"}:{}}>
            <div style={{marginBottom:S.lg+4}}><Logo size={mobile?0.7:0.85} variant="white"/></div>
            <p style={{fontFamily:"'Alido',serif",fontSize:14,fontWeight:400,color:C.onDarkMuted,lineHeight:1.7,maxWidth:280,marginBottom:S.lg+4}}>{L.footerDesc}</p>

            <div style={{display:"flex",gap:S.md+2,alignItems:"center",marginBottom:S.lg}}>
              {[
                {label:"Instagram",href:"https://www.instagram.com/alternative.ge?igsh=MXNmanh4OHB3ZmphNw==",d:<><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="5"/><circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none"/></>},
                {label:"Facebook",href:"https://www.facebook.com/share/1HWqtnunMk/?mibextid=wwXIfr",d:<path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/>},
                {label:"TikTok",href:"https://www.tiktok.com/@alternative.ge?_r=1&_t=ZS-94DbATQVFWG",d:null,fill:<path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.88-2.89 2.89 2.89 0 012.88-2.89c.28 0 .55.04.81.11V9.01a6.32 6.32 0 00-.81-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V8.79a8.18 8.18 0 004.76 1.52v-3.4a4.85 4.85 0 01-1-.22z"/>},
              ].map(s=>(
                <div key={s.label} className="spotlight-icon" style={{width:46,height:46}}>
                  <a href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label}
                    style={{width:"100%",height:"100%",display:"flex",alignItems:"center",justifyContent:"center",textDecoration:"none",color:C.onDarkMuted,transition:"color 0.3s"}}
                    onMouseEnter={e=>{e.currentTarget.style.color=C.tan;}}
                    onMouseLeave={e=>{e.currentTarget.style.color=C.onDarkMuted;}}>
                    {s.fill?<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">{s.fill}</svg>
                    :<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round">{s.d}</svg>}
                  </a>
                </div>
              ))}
            </div>

            <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer"
              style={{fontFamily:"'TT Interphases Pro',sans-serif",fontSize:11,fontWeight:500,letterSpacing:"0.12em",textTransform:"uppercase",color:C.tan,display:"inline-flex",alignItems:"center",gap:8,textDecoration:"none",marginBottom:S.md,transition:"opacity 0.3s"}}
              onMouseEnter={e=>e.currentTarget.style.opacity="0.7"} onMouseLeave={e=>e.currentTarget.style.opacity="1"}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"><path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"/></svg>
              {L.whatsappUs}
            </a>
            <div style={{display:"flex",flexDirection:"column",gap:S.xs+2,marginTop:S.sm}}>
              <span style={{fontFamily:"'Alido',serif",fontSize:13,fontWeight:400,color:C.onDarkMuted}}>{L.footerLocation}</span>
              <a href="mailto:info@alternative.ge" style={{fontFamily:"'Alido',serif",fontSize:13,fontWeight:400,color:C.onDarkMuted,textDecoration:"none",transition:"color 0.3s"}}
                onMouseEnter={e=>e.currentTarget.style.color=C.tan} onMouseLeave={e=>e.currentTarget.style.color=C.onDarkMuted}>info@alternative.ge</a>
              <span style={{fontFamily:"'Alido',serif",fontSize:13,fontWeight:400,color:C.onDarkMuted,marginTop:S.xs}}>{L.footerHours}</span>
            </div>
          </div>

          {/* About column */}
          <div>
            <p style={{fontFamily:"'TT Interphases Pro',sans-serif",fontSize:10,fontWeight:500,letterSpacing:"0.14em",textTransform:"uppercase",color:C.onDarkMuted,marginBottom:mobile?S.md:S.lg+4}}>{L.footerAbout}</p>
            {[[L.ourStoryFooter,"about",null],[L.footerHowItWorks,"how",null],[L.contact,"contact",null]].map(([l,pg,scrollTo])=>(
              <button key={l} onClick={()=>{if(scrollTo)window.__initHowScroll=scrollTo;setPage(pg);}} style={linkStyle}
                onMouseEnter={e=>e.currentTarget.style.color=C.tan} onMouseLeave={e=>e.currentTarget.style.color=C.onDark}>{l}</button>
            ))}
          </div>

          {/* Help column */}
          <div>
            <p style={{fontFamily:"'TT Interphases Pro',sans-serif",fontSize:10,fontWeight:500,letterSpacing:"0.14em",textTransform:"uppercase",color:C.onDarkMuted,marginBottom:mobile?S.md:S.lg+4}}>{L.footerHelp}</p>
            {[[L.faqFooter,"how","faq"],[L.footerShipping,"shipping",null],[L.footerReturnsLink,"returns",null]].map(([l,pg,scrollTo])=>(
              <button key={l} onClick={()=>{if(scrollTo)window.__initHowScroll=scrollTo;setPage(pg);}} style={linkStyle}
                onMouseEnter={e=>e.currentTarget.style.color=C.tan} onMouseLeave={e=>e.currentTarget.style.color=C.onDark}>{l}</button>
            ))}
          </div>

          {/* Membership column */}
          <div>
            <p style={{fontFamily:"'TT Interphases Pro',sans-serif",fontSize:10,fontWeight:500,letterSpacing:"0.14em",textTransform:"uppercase",color:C.onDarkMuted,marginBottom:mobile?S.md:S.lg+4}}>{L.footerDiscounts}</p>
            {[[L.footerAffiliate,"membership","affiliate"],[L.footerRefer,"membership","refer"],[L.footerMembership,"auth",null]].map(([l,pg,scrollTo])=>(
              <button key={l} onClick={()=>{if(scrollTo)window.__initMembershipScroll=scrollTo;setPage(pg);}} style={linkStyle}
                onMouseEnter={e=>e.currentTarget.style.color=C.tan} onMouseLeave={e=>e.currentTarget.style.color=C.onDark}>{l}</button>
            ))}
          </div>
        </div>
      </div>

      {/* ── BOTTOM BAR ──────────────────────────────────────────── */}
      <div style={{padding:mobile?`${S.lg}px 0`:`${S.xl+4}px 0`}}>
        <div style={{maxWidth:1360,margin:"0 auto",padding:`0 ${px}`}}>
          <div style={{display:"flex",gap:mobile?S.md:S.xl,flexWrap:"wrap",marginBottom:S.md,alignItems:"center"}}>
            {[[L.footerPrivacy,"privacy"],[L.footerTerms,"terms"],[L.footerAccessibility,"accessibility"]].map(([l,pg])=>(
              <button key={pg} onClick={()=>setPage(pg)} style={{background:"none",border:"none",fontFamily:"'Alido',serif",fontSize:13,fontWeight:400,color:C.onDarkMuted,padding:`${S.xs}px 0`,cursor:"pointer",transition:"color 0.3s"}}
                onMouseEnter={e=>e.currentTarget.style.color=C.tan} onMouseLeave={e=>e.currentTarget.style.color=C.onDarkMuted}>{l}</button>
            ))}
          </div>
          <div style={{display:"flex",gap:S.sm,marginBottom:S.md,alignItems:"center",flexWrap:"wrap"}}>
            <span style={{fontFamily:"'Alido',serif",fontSize:12,fontWeight:400,color:C.onDarkMuted}}>{L.footerPayments}</span>
            {["VISA","MC","BOG","TBC","BTC"].map(m=>(
              <span key={m} style={{padding:`${S.xs}px ${S.sm+2}px`,border:"1px solid rgba(177,154,122,0.1)",fontFamily:"'TT Interphases Pro',sans-serif",fontSize:11,fontWeight:400,letterSpacing:"0.04em",color:C.onDarkMuted}}>{m}</span>
            ))}
          </div>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:S.sm}}>
            <p style={{fontFamily:"'Alido',serif",fontSize:12,fontWeight:400,color:C.onDarkMuted}}>{L.copyright}</p>
            <p style={{fontFamily:"'Alido',serif",fontSize:12,fontWeight:400,color:C.onDarkMuted}}>{L.footerTbilisi}</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
