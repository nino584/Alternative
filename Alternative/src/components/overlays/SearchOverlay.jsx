import { useState, useRef, useEffect } from 'react';
import { C, T } from '../../constants/theme.js';
import { PRODUCTS } from '../../constants/data.js';
import { productUrl } from '../../utils/seo.js';

// ── LUXURY SEARCH OVERLAY (Farfetch / Luisaviaroma style) ────────────────────
export default function SearchOverlay({onClose,setPage,setSelected,L,mobile,products:productsProp}) {
  const [q,setQ]=useState("");
  const [focused,setFocused]=useState(false);
  const [section,setSection]=useState("All");
  const ref=useRef(null);
  useEffect(()=>{ref.current?.focus();},[]);
  useEffect(()=>{const fn=e=>{if(e.key==="Escape")onClose();};window.addEventListener("keydown",fn);return()=>window.removeEventListener("keydown",fn);},[onClose]);

  const ALL_PRODUCTS = productsProp || PRODUCTS;
  const sectionTabs = [
    {key:"All",label:L&&L.all||"All"},
    {key:"Womenswear",label:L&&L.womenswear||"Womenswear"},
    {key:"Menswear",label:L&&L.menswear||"Menswear"},
    {key:"Kidswear",label:L&&L.kidswear||"Kidswear"},
  ];
  const results=q.length>1?ALL_PRODUCTS.filter(p=>{
    const ql=q.toLowerCase();
    const matchesQuery = (p.name||"").toLowerCase().includes(ql)||
      (p.cat||"").toLowerCase().includes(ql)||
      (p.section||"").toLowerCase().includes(ql)||
      (p.color||"").toLowerCase().includes(ql)||
      (p.brand||"").toLowerCase().includes(ql);
    if (!matchesQuery) return false;
    if (section!=="All" && (p.section||"") !== section) return false;
    return true;
  }).slice(0,12):[];

  const navigate = (p) => {
    if (p.brand && p.name) {
      window.location.href = productUrl(p);
    } else {
      setPage("product", p);
    }
    onClose();
  };

  // Group brands from results for suggestion
  const brandMatches = q.length>1 ? [...new Set(results.map(p=>p.brand).filter(Boolean))].slice(0,4) : [];

  return (
    <>
      {/* Blurred backdrop — click to close */}
      <div onClick={onClose} style={{position:"fixed",inset:0,zIndex:399,backdropFilter:"blur(12px)",WebkitBackdropFilter:"blur(12px)",background:"rgba(255,255,255,0.55)",animation:"fadeIn 0.2s ease"}}/>

      {/* Search panel on top */}
      <div role="dialog" aria-label={L&&L.search||"Search"} aria-modal="true"
        style={{position:"fixed",top:0,left:0,right:0,zIndex:400,display:"flex",flexDirection:"column",maxHeight:"85vh",overflow:"auto",WebkitOverflowScrolling:"touch",animation:"fadeIn 0.15s ease"}}>

        {/* Top bar with search input */}
        <div style={{background:"rgba(255,255,255,0.92)",backdropFilter:"blur(20px)",WebkitBackdropFilter:"blur(20px)"}}>
          <div style={{maxWidth:960,margin:"0 auto",padding:mobile?"14px 18px":"40px 32px 24px",display:"flex",alignItems:"center",gap:14,minHeight:mobile?56:undefined}}>

            {/* Search icon */}
            <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke={C.black} strokeWidth="1.2" strokeLinecap="round" style={{flexShrink:0,opacity:0.4}}>
              <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
            </svg>

            {/* Input — no border, clean look */}
            <input ref={ref} value={q} onChange={e=>setQ(e.target.value)}
              onFocus={()=>setFocused(true)} onBlur={()=>setFocused(false)}
              placeholder={L&&L.searchPlaceholder||"Search items, categories, colors..."}
              style={{flex:1,border:"none",background:"transparent",fontSize:mobile?17:24,color:C.black,outline:"none",fontFamily:"'TT Interphases Pro',sans-serif",fontWeight:300,letterSpacing:"0.01em",padding:"6px 0"}}/>

            {/* Clear / Close */}
            {q.length>0&&(
              <button onClick={()=>{setQ("");ref.current?.focus();}} style={{background:"none",border:"none",color:C.gray,fontSize:12,cursor:"pointer",padding:"6px 12px",letterSpacing:"0.1em",textTransform:"uppercase",fontFamily:"'TT Interphases Pro',sans-serif",fontWeight:500,transition:"color 0.2s",whiteSpace:"nowrap"}}
                onMouseEnter={e=>e.currentTarget.style.color=C.black}
                onMouseLeave={e=>e.currentTarget.style.color=C.gray}>
                {L&&L.clear||"Clear"}
              </button>
            )}

            <button onClick={onClose} aria-label="Close search"
              style={{background:"none",border:"none",cursor:"pointer",width:40,height:40,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,transition:"opacity 0.2s"}}
              onMouseEnter={e=>e.currentTarget.style.opacity="0.5"}
              onMouseLeave={e=>e.currentTarget.style.opacity="1"}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={C.black} strokeWidth="1.2" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
            </button>
          </div>

          {/* Subtle separator line */}
          <div style={{maxWidth:960,margin:"0 auto",padding:mobile?"0 20px":"0 32px"}}>
            <div style={{height:1,background:C.lgray,opacity:0.5}}/>
          </div>

          {/* Section tabs */}
          <div style={{maxWidth:960,margin:"0 auto",padding:mobile?"0 20px":"0 32px",display:"flex",gap:mobile?20:32}}>
            {sectionTabs.map(tab=>(
              <button key={tab.key} onClick={()=>setSection(tab.key)}
                style={{background:"none",border:"none",borderBottom:section===tab.key?`2px solid ${C.black}`:"2px solid transparent",padding:"12px 0",fontFamily:"'TT Interphases Pro',sans-serif",fontSize:13,fontWeight:section===tab.key?500:400,letterSpacing:"0.02em",color:section===tab.key?C.black:C.gray,cursor:"pointer",transition:"all 0.2s"}}>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div style={{background:"rgba(255,255,255,0.95)",backdropFilter:"blur(20px)",WebkitBackdropFilter:"blur(20px)",flex:1}}>
          <div style={{maxWidth:960,margin:"0 auto",width:"100%",padding:mobile?"24px 20px":"40px 32px"}}>

            {/* Brand matches */}
            {brandMatches.length>0&&(
              <div style={{marginBottom:32}}>
                <p style={{fontFamily:"'TT Interphases Pro',sans-serif",fontSize:11,fontWeight:500,letterSpacing:"0.14em",textTransform:"uppercase",color:C.gray,marginBottom:14}}>{L&&L.brands||"Brands"}</p>
                <div style={{display:"flex",flexDirection:"column",gap:0}}>
                  {brandMatches.map(brand=>(
                    <button key={brand} onClick={()=>setQ(brand)}
                      style={{display:"flex",alignItems:"center",justifyContent:"space-between",background:"none",border:"none",borderBottom:`1px solid ${C.lgray}`,padding:"14px 0",cursor:"pointer",textAlign:"left",transition:"padding-left 0.2s"}}
                      onMouseEnter={e=>e.currentTarget.style.paddingLeft="8px"}
                      onMouseLeave={e=>e.currentTarget.style.paddingLeft="0"}>
                      <span style={{fontFamily:"'TT Interphases Pro',sans-serif",fontSize:15,fontWeight:400,color:C.black,letterSpacing:"0.01em"}}>{brand}</span>
                      <span style={{fontFamily:"'TT Interphases Pro',sans-serif",fontSize:11,fontWeight:400,letterSpacing:"0.08em",color:C.gray,textTransform:"uppercase"}}>{L&&L.brand||"Brand"}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Product results — grid */}
            {results.length>0&&(
              <div>
                <p style={{fontFamily:"'TT Interphases Pro',sans-serif",fontSize:11,fontWeight:500,letterSpacing:"0.14em",textTransform:"uppercase",color:C.gray,marginBottom:20}}>
                  {L&&L.suggestedResults||"Suggested Results"}
                </p>
                <div style={{display:"grid",gridTemplateColumns:mobile?"repeat(2,1fr)":"repeat(4,1fr)",gap:mobile?12:20}}>
                  {results.map((p,i)=>(
                    <div key={p.id} onClick={()=>navigate(p)}
                      style={{cursor:"pointer",animation:`fadeUp 0.3s ease ${i*0.03}s both`}}>
                      <div style={{position:"relative",paddingBottom:"125%",background:C.offwhite,marginBottom:12,overflow:"hidden",borderRadius:2}}>
                        <img src={p.img||(p.images&&p.images[0])||""} alt={p.name} loading="lazy"
                          onError={e=>{e.target.onerror=null;e.target.style.display="none";}}
                          style={{position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"contain",padding:8,transition:"transform 0.4s cubic-bezier(0.25,0.46,0.45,0.94)"}}
                          onMouseEnter={e=>e.currentTarget.style.transform="scale(1.05)"}
                          onMouseLeave={e=>e.currentTarget.style.transform="scale(1)"}/>
                      </div>
                      <p style={{fontFamily:"'TT Interphases Pro',sans-serif",fontSize:10,fontWeight:500,letterSpacing:"0.12em",textTransform:"uppercase",color:C.gray,marginBottom:4}}>{p.brand}</p>
                      <p style={{fontFamily:"'TT Interphases Pro',sans-serif",fontSize:13,fontWeight:400,color:C.black,marginBottom:4,lineHeight:1.4}}>{L&&L.localNames&&L.localNames[p.name]||p.name}</p>
                      <p style={{fontFamily:"'TT Interphases Pro',sans-serif",fontSize:13,color:C.gray}}>
                        {p.sale?<><span style={{textDecoration:"line-through",marginRight:8}}>GEL {p.price}</span><span style={{color:C.tan,fontWeight:500}}>GEL {p.sale}</span></>:<>GEL {p.price}</>}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* No results */}
            {q.length>1&&results.length===0&&(
              <div style={{padding:"60px 0",textAlign:"center"}}>
                <p style={{fontFamily:"'TT Interphases Pro',sans-serif",fontSize:15,fontWeight:300,color:C.gray,letterSpacing:"0.02em"}}>{L&&L.noResults||"No results for"} "{q}"</p>
              </div>
            )}

            {/* Popular searches when empty */}
            {q.length===0&&(
              <div style={{padding:mobile?"16px 0":"24px 0"}}>
                <p style={{fontFamily:"'TT Interphases Pro',sans-serif",fontSize:11,fontWeight:500,letterSpacing:"0.14em",textTransform:"uppercase",color:C.gray,marginBottom:20}}>{L&&L.popular||"Popular Searches"}</p>
                <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
                  {[L?.bags||"Bags",L?.shoes||"Shoes","Gucci","Bottega Veneta",L?.accessories||"Accessories",L?.newIn||"New In"].map(term=>(
                    <button key={term} onClick={()=>setQ(term)}
                      style={{padding:"12px 24px",background:"transparent",border:`1px solid ${C.lgray}`,color:C.black,fontSize:13,fontFamily:"'TT Interphases Pro',sans-serif",fontWeight:400,letterSpacing:"0.03em",cursor:"pointer",transition:"all 0.25s"}}
                      onMouseEnter={e=>{e.currentTarget.style.borderColor=C.tan;e.currentTarget.style.color=C.tan;}}
                      onMouseLeave={e=>{e.currentTarget.style.borderColor=C.lgray;e.currentTarget.style.color=C.black;}}>
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
