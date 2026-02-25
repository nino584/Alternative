import { useState } from 'react';
import { C, T } from '../../constants/theme.js';
import { WHATSAPP_NUMBER } from '../../constants/config.js';
import { IconCheck } from '../icons/Icons.jsx';
import { Logo } from './Logo.jsx';

// ── FOOTER ────────────────────────────────────────────────────────────────────
export default function Footer({setPage,L,mobile}) {
  const px=mobile?"16px":"40px";
  const [email,setEmail]=useState("");
  const [subscribed,setSubscribed]=useState(false);

  const onSubscribe=(e)=>{
    e&&e.preventDefault&&e.preventDefault();
    if(email.includes("@")){setSubscribed(true);setTimeout(()=>setSubscribed(false),4000);}
  };

  return (
    <footer style={{background:C.black}}>

      {/* NEWSLETTER SECTION */}
      <div style={{borderBottom:`1px solid rgba(168,162,150,0.12)`,padding:mobile?"40px 0":"56px 0"}}>
        <div style={{maxWidth:1360,margin:"0 auto",padding:`0 ${px}`,display:"grid",gridTemplateColumns:mobile?"1fr":"1fr 1fr",gap:mobile?24:64,alignItems:"start"}}>
          <div>
            <h3 style={{...T.displaySm,color:C.white,marginBottom:12,fontSize:mobile?20:24}}>Never miss a thing</h3>
            <p style={{...T.body,color:C.gray,lineHeight:1.8,fontSize:mobile?13:14}}>Sign up for promotions, tailored new arrivals, stock updates and more — straight to your inbox</p>
          </div>
          <div>
            <p style={{...T.labelSm,color:C.lgray,marginBottom:12,fontSize:9}}>GET UPDATES BY</p>
            <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:12}}>
              <div style={{display:"flex",alignItems:"center",gap:6}}>
                <div style={{width:18,height:18,borderRadius:3,border:`1.5px solid ${C.tan}`,display:"flex",alignItems:"center",justifyContent:"center",background:"transparent"}}>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={C.tan} strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
                <span style={{...T.bodySm,color:C.lgray,fontSize:13}}>Email</span>
              </div>
            </div>
            <div style={{display:"flex",gap:0}}>
              <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="Enter your email address"
                style={{flex:1,padding:"13px 16px",background:"transparent",border:`1px solid rgba(168,162,150,0.3)`,borderRight:"none",color:C.white,...T.body,fontSize:13,outline:"none"}}/>
              <button onClick={onSubscribe}
                style={{padding:"13px 24px",background:C.white,border:"none",color:C.black,...T.labelSm,fontSize:9,cursor:"pointer",flexShrink:0,transition:"all 0.2s",display:"inline-flex",alignItems:"center",gap:6}}>
                {subscribed?(<>SUBSCRIBED <IconCheck size={10} color={C.black} stroke={2}/></>):"SUBSCRIBE"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN FOOTER GRID */}
      <div style={{padding:mobile?"32px 0":"48px 0",borderBottom:`1px solid rgba(168,162,150,0.12)`}}>
        <div style={{maxWidth:1360,margin:"0 auto",padding:`0 ${px}`,display:"grid",gridTemplateColumns:mobile?"1fr 1fr":"2fr 1fr 1fr 1fr 1fr",gap:mobile?24:32}}>
          {/* Brand column */}
          <div style={mobile?{gridColumn:"1 / -1"}:{}}>
            <div style={{marginBottom:16}}><Logo color={C.white} size={mobile?0.7:0.85}/></div>
            <p style={{...T.bodySm,color:C.gray,lineHeight:1.8,maxWidth:240,marginBottom:18,fontSize:mobile?12:13}}>{L&&L.footerDesc||"Curated fashion sourced directly from verified suppliers. Shipped to Tbilisi."}</p>
            <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer" style={{...T.labelSm,color:C.tan,fontSize:9,display:"flex",alignItems:"center",gap:6,textDecoration:"none",marginBottom:16}}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"/></svg>
              {L&&L.whatsappUs||"WhatsApp us"}
            </a>
          </div>

          {/* Shop column */}
          <div>
            <p style={{...T.labelSm,color:C.lgray,marginBottom:mobile?10:16,fontSize:9}}>SHOP</p>
            {[["Collection","catalog",null],["New Arrivals","catalog","New In"],["Womenswear","catalog","Womenswear"],["Menswear","catalog","Menswear"],["Kidswear","catalog","Kidswear"]].map(([l,pg,section])=>(
              <button key={l} onClick={()=>{if(section&&section!=="New In")window.__initSection=section;if(section==="New In")window.__initSub="New In";setPage(pg);}} style={{display:"block",background:"none",border:"none",...T.bodySm,color:C.gray,marginBottom:7,padding:0,textAlign:"left",fontSize:mobile?12:13,cursor:"pointer"}}>{l}</button>
            ))}
          </div>

          {/* Account column */}
          <div>
            <p style={{...T.labelSm,color:C.lgray,marginBottom:mobile?10:16,fontSize:9}}>ACCOUNT</p>
            {[["My Orders","orders"],["Wishlist","account","wishlist"],["Sign In","auth"],["Register","auth"]].map(([l,pg,initTab])=>(
              <button key={l} onClick={()=>{if(initTab)window.__initAccountTab=initTab;setPage(pg);}} style={{display:"block",background:"none",border:"none",...T.bodySm,color:C.gray,marginBottom:7,padding:0,textAlign:"left",fontSize:mobile?12:13,cursor:"pointer"}}>{l}</button>
            ))}
          </div>

          {/* Discounts & Membership column */}
          <div>
            <p style={{...T.labelSm,color:C.lgray,marginBottom:mobile?10:16,fontSize:9}}>DISCOUNTS & MEMBERSHIP</p>
            {[["Affiliate Program","membership","affiliate"],["Refer a Friend","membership","refer"],["Alternative Membership","auth",null]].map(([l,pg,scrollTo])=>(
              <button key={l} onClick={()=>{if(scrollTo)window.__initMembershipScroll=scrollTo;setPage(pg);}} style={{display:"block",background:"none",border:"none",...T.bodySm,color:C.gray,marginBottom:7,padding:0,textAlign:"left",fontSize:mobile?12:13,cursor:"pointer"}}>{l}</button>
            ))}
          </div>

          {/* About column */}
          <div>
            <p style={{...T.labelSm,color:C.lgray,marginBottom:mobile?10:16,fontSize:9}}>ABOUT</p>
            {[["Our Story","about",null],["How It Works","how",null],["FAQ","how","faq"],["Contact","contact",null]].map(([l,pg,scrollTo])=>(
              <button key={l} onClick={()=>{if(scrollTo)window.__initHowScroll=scrollTo;setPage(pg);}} style={{display:"block",background:"none",border:"none",...T.bodySm,color:C.gray,marginBottom:7,padding:0,textAlign:"left",fontSize:mobile?12:13,cursor:"pointer"}}>{l}</button>
            ))}
          </div>
        </div>
      </div>

      {/* FOLLOW US + APP DOWNLOAD */}
      <div style={{padding:mobile?"28px 0":"36px 0",borderBottom:`1px solid rgba(168,162,150,0.12)`}}>
        <div style={{maxWidth:1360,margin:"0 auto",padding:`0 ${px}`,display:"grid",gridTemplateColumns:mobile?"1fr":"1fr 1fr",gap:mobile?28:40,alignItems:"start"}}>
          {/* Follow us */}
          <div>
            <p style={{...T.labelSm,color:C.lgray,marginBottom:14,fontSize:9}}>FOLLOW US</p>
            <div style={{display:"flex",gap:16,alignItems:"center"}}>
              {/* Instagram */}
              <a href="https://www.instagram.com/alternative.ge?igsh=MXNmanh4OHB3ZmphNw==" target="_blank" rel="noopener noreferrer" style={{width:40,height:40,borderRadius:"50%",border:`1px solid rgba(168,162,150,0.25)`,display:"flex",alignItems:"center",justifyContent:"center",textDecoration:"none"}}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={C.lgray} strokeWidth="1.5"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="5"/><circle cx="17.5" cy="6.5" r="1.5" fill={C.lgray} stroke="none"/></svg>
              </a>
              {/* Facebook */}
              <a href="https://www.facebook.com/share/1HWqtnunMk/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer" style={{width:40,height:40,borderRadius:"50%",border:`1px solid rgba(168,162,150,0.25)`,display:"flex",alignItems:"center",justifyContent:"center",textDecoration:"none"}}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={C.lgray} strokeWidth="1.5"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></svg>
              </a>
              {/* TikTok */}
              <a href="https://www.tiktok.com/@alternative.ge?_r=1&_t=ZS-94DbATQVFWG" target="_blank" rel="noopener noreferrer" style={{width:40,height:40,borderRadius:"50%",border:`1px solid rgba(168,162,150,0.25)`,display:"flex",alignItems:"center",justifyContent:"center",textDecoration:"none"}}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill={C.lgray}><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.88-2.89 2.89 2.89 0 012.88-2.89c.28 0 .55.04.81.11V9.01a6.32 6.32 0 00-.81-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V8.79a8.18 8.18 0 004.76 1.52v-3.4a4.85 4.85 0 01-1-.22z"/></svg>
              </a>
            </div>
          </div>

          {/* BUSINESS INFO */}
          <div>
            <p style={{...T.labelSm,color:C.lgray,marginBottom:14,fontSize:9}}>CONTACT & INFO</p>
            <div style={{display:"flex",flexDirection:"column",gap:10}}>
              <p style={{...T.bodySm,color:C.gray,fontSize:12,lineHeight:1.6}}>Tbilisi, Georgia</p>
              <a href="tel:+995555999555" style={{...T.bodySm,color:C.gray,fontSize:12,textDecoration:"none"}}>+995 555 999 555</a>
              <a href="mailto:info@alternative.ge" style={{...T.bodySm,color:C.gray,fontSize:12,textDecoration:"none"}}>info@alternative.ge</a>
              <p style={{...T.labelSm,color:"rgba(168,162,150,0.5)",fontSize:8,marginTop:8}}>Mon–Sat 10:00–20:00</p>
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM BAR: Legal + Copyright */}
      <div style={{padding:mobile?"20px 0":"24px 0"}}>
        <div style={{maxWidth:1360,margin:"0 auto",padding:`0 ${px}`}}>
          <div style={{display:"flex",gap:mobile?12:24,flexWrap:"wrap",marginBottom:14}}>
            {[["Privacy Policy","privacy"],["Terms & Conditions","terms"],["Returns & Refunds","returns"],["Shipping Info","shipping"],["Accessibility","accessibility"]].map(([l,pg])=>(
              <button key={l} onClick={()=>setPage(pg)} style={{background:"none",border:"none",...T.labelSm,color:C.gray,fontSize:8,padding:0,cursor:"pointer",textDecoration:"underline",textUnderlineOffset:2}}>{l}</button>
            ))}
          </div>
          {/* Payment methods */}
          <div style={{display:"flex",gap:12,marginBottom:14,alignItems:"center"}}>
            <span style={{...T.labelSm,color:"rgba(168,162,150,0.4)",fontSize:8}}>ACCEPTED PAYMENTS:</span>
            {["VISA","MC","BOG","TBC"].map(m=>(
              <span key={m} style={{padding:"3px 8px",border:"1px solid rgba(168,162,150,0.2)",borderRadius:3,...T.labelSm,color:"rgba(168,162,150,0.5)",fontSize:7}}>{m}</span>
            ))}
          </div>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:8}}>
            <p style={{...T.labelSm,color:"rgba(168,162,150,0.5)",fontSize:8}}>{L&&L.copyright||'© 2026 Alternative Concept Store. All rights reserved.'}</p>
            <p style={{...T.labelSm,color:"rgba(168,162,150,0.5)",fontSize:8}}>Tbilisi, Georgia · info@alternative.ge</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
