import { useState, useRef, useEffect } from 'react';
import { C, T } from '../../constants/theme.js';
import { PRODUCTS } from '../../constants/data.js';
import { productUrl } from '../../utils/seo.js';

// ── LUXURY SEARCH OVERLAY ────────────────────────────────────────────────────
export default function SearchOverlay({onClose,setPage,setSelected,L,mobile,products:productsProp}) {
  const [q,setQ]=useState("");
  const [focused,setFocused]=useState(false);
  const ref=useRef(null);
  useEffect(()=>{ref.current?.focus();},[]);
  useEffect(()=>{const fn=e=>{if(e.key==="Escape")onClose();};window.addEventListener("keydown",fn);return()=>window.removeEventListener("keydown",fn);},[onClose]);

  const ALL_PRODUCTS = productsProp || PRODUCTS;
  const results=q.length>1?ALL_PRODUCTS.filter(p=>{
    const ql=q.toLowerCase();
    return (p.name||"").toLowerCase().includes(ql)||
      (p.cat||"").toLowerCase().includes(ql)||
      (p.section||"").toLowerCase().includes(ql)||
      (p.color||"").toLowerCase().includes(ql)||
      (p.brand||"").toLowerCase().includes(ql);
  }).slice(0,8):[];

  const navigate = (p) => {
    if (p.brand && p.name) {
      window.location.href = productUrl(p);
    } else {
      setPage("product", p);
    }
    onClose();
  };

  return (
    <div role="dialog" aria-label={L&&L.search||"Search"} aria-modal="true"
      style={{position:"fixed",inset:0,zIndex:400,display:"flex",flexDirection:"column",alignItems:"center",animation:"fadeIn 0.2s ease"}}>

      {/* Backdrop — frosted glass */}
      <div onClick={onClose} style={{position:"absolute",inset:0,background:"rgba(25,25,25,0.75)",backdropFilter:"blur(12px)",WebkitBackdropFilter:"blur(12px)"}}/>

      {/* Search container */}
      <div style={{position:"relative",width:"100%",maxWidth:720,padding:mobile?"60px 20px 0":"100px 24px 0",animation:"fadeUp 0.35s cubic-bezier(0.25,0.46,0.45,0.94)"}}>

        {/* Title */}
        <p style={{fontFamily:"'Alido',serif",fontSize:mobile?14:16,color:"rgba(255,255,255,0.5)",letterSpacing:"0.15em",textTransform:"uppercase",textAlign:"center",marginBottom:mobile?24:32}}>
          {L&&L.search||"Search"}
        </p>

        {/* Input area — minimal bottom-border style */}
        <div style={{position:"relative",marginBottom:4}}>
          <div style={{display:"flex",alignItems:"center",gap:16,paddingBottom:16,borderBottom:`1px solid ${focused?"rgba(177,154,122,0.6)":"rgba(255,255,255,0.2)"}`,transition:"border-color 0.3s ease"}}>
            {/* Refined search icon */}
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="1.2" strokeLinecap="round">
              <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
            </svg>
            <input ref={ref} value={q} onChange={e=>setQ(e.target.value)}
              onFocus={()=>setFocused(true)} onBlur={()=>setFocused(false)}
              placeholder={L&&L.searchPlaceholder||"Search for brands, products..."}
              style={{flex:1,border:"none",background:"transparent",fontSize:mobile?18:22,color:"#fff",outline:"none",fontFamily:"'TT Interphases Pro',sans-serif",fontWeight:300,letterSpacing:"0.02em"}}/>
            {q.length>0&&(
              <button onClick={()=>setQ("")} style={{background:"none",border:"none",color:"rgba(255,255,255,0.4)",fontSize:13,cursor:"pointer",padding:"4px 8px",letterSpacing:"0.1em",textTransform:"uppercase",fontFamily:"'TT Interphases Pro',sans-serif",transition:"color 0.2s"}}
                onMouseEnter={e=>e.currentTarget.style.color="rgba(255,255,255,0.8)"}
                onMouseLeave={e=>e.currentTarget.style.color="rgba(255,255,255,0.4)"}>
                Clear
              </button>
            )}
          </div>
          {/* Animated underline accent */}
          <div style={{position:"absolute",bottom:0,left:0,height:1,background:"linear-gradient(90deg,transparent,rgba(177,154,122,0.8),transparent)",width:focused||q.length>0?"100%":"0%",transition:"width 0.5s cubic-bezier(0.25,0.46,0.45,0.94)"}}/>
        </div>

        {/* Close button — top right */}
        <button onClick={onClose} aria-label="Close search"
          style={{position:"absolute",top:mobile?16:56,right:mobile?16:24,background:"none",border:"none",color:"rgba(255,255,255,0.4)",width:44,height:44,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",borderRadius:"50%",transition:"all 0.3s"}}
          onMouseEnter={e=>{e.currentTarget.style.color="rgba(255,255,255,0.9)";e.currentTarget.style.background="rgba(255,255,255,0.05)";}}
          onMouseLeave={e=>{e.currentTarget.style.color="rgba(255,255,255,0.4)";e.currentTarget.style.background="none";}}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
        </button>

        {/* Results */}
        {results.length>0&&(
          <div style={{marginTop:8,maxHeight:mobile?360:440,overflow:"auto"}}>
            {results.map((p,i)=>(
              <div key={p.id} onClick={()=>navigate(p)}
                style={{display:"flex",gap:16,padding:"16px 4px",cursor:"pointer",borderBottom:"1px solid rgba(255,255,255,0.06)",transition:"all 0.25s",animation:`fadeUp 0.3s ease ${i*0.04}s both`}}
                onMouseEnter={e=>{e.currentTarget.style.background="rgba(255,255,255,0.04)";e.currentTarget.style.paddingLeft="12px";}}
                onMouseLeave={e=>{e.currentTarget.style.background="transparent";e.currentTarget.style.paddingLeft="4px";}}>
                <img src={p.img} alt={p.name} loading="lazy" width="56" height="56"
                  style={{width:56,height:56,objectFit:"cover",flexShrink:0,opacity:0.9}}/>
                <div style={{display:"flex",flexDirection:"column",justifyContent:"center",gap:4}}>
                  <p style={{fontFamily:"'TT Interphases Pro',sans-serif",fontSize:11,fontWeight:500,letterSpacing:"0.1em",textTransform:"uppercase",color:"rgba(177,154,122,0.8)"}}>{p.brand}</p>
                  <p style={{fontFamily:"'TT Interphases Pro',sans-serif",fontSize:14,fontWeight:300,color:"rgba(255,255,255,0.9)",letterSpacing:"0.01em"}}>{L&&L.localNames&&L.localNames[p.name]||p.name}</p>
                  <p style={{fontFamily:"'Alido',serif",fontSize:13,color:"rgba(255,255,255,0.5)"}}>
                    {p.sale?<><span style={{textDecoration:"line-through",marginRight:8}}>GEL {p.price}</span><span style={{color:"rgba(177,154,122,0.9)"}}>GEL {p.sale}</span></>:<>GEL {p.price}</>}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
        {q.length>1&&results.length===0&&(
          <div style={{padding:"48px 0",textAlign:"center"}}>
            <p style={{fontFamily:"'TT Interphases Pro',sans-serif",fontSize:14,fontWeight:300,color:"rgba(255,255,255,0.4)",letterSpacing:"0.02em"}}>{L&&L.noResults||"No results for"} "{q}"</p>
          </div>
        )}

        {/* Quick links when empty */}
        {q.length===0&&(
          <div style={{padding:"32px 0",animation:"fadeIn 0.4s ease"}}>
            <p style={{fontSize:11,fontWeight:500,letterSpacing:"0.12em",textTransform:"uppercase",color:"rgba(255,255,255,0.3)",marginBottom:16,fontFamily:"'TT Interphases Pro',sans-serif"}}>{L&&L.popular||"Popular Searches"}</p>
            <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
              {["Bags","Shoes","Gucci","Bottega Veneta","Accessories","New In"].map(term=>(
                <button key={term} onClick={()=>setQ(term)}
                  style={{padding:"10px 20px",background:"transparent",border:"1px solid rgba(255,255,255,0.12)",color:"rgba(255,255,255,0.6)",fontSize:13,fontFamily:"'TT Interphases Pro',sans-serif",fontWeight:300,letterSpacing:"0.03em",cursor:"pointer",transition:"all 0.3s",borderRadius:0}}
                  onMouseEnter={e=>{e.currentTarget.style.borderColor="rgba(177,154,122,0.5)";e.currentTarget.style.color="rgba(255,255,255,0.9)";}}
                  onMouseLeave={e=>{e.currentTarget.style.borderColor="rgba(255,255,255,0.12)";e.currentTarget.style.color="rgba(255,255,255,0.6)";}}>
                  {term}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
