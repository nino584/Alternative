import { useState, useRef, useEffect } from 'react';
import { C, T } from '../../constants/theme.js';
import { PRODUCTS } from '../../constants/data.js';

// ── SEARCH OVERLAY ────────────────────────────────────────────────────────────
export default function SearchOverlay({onClose,setPage,setSelected,L,mobile}) {
  const [q,setQ]=useState("");
  const ref=useRef(null);
  useEffect(()=>{ref.current?.focus();},[]);
  const results=q.length>1?PRODUCTS.filter(p=>
    p.name.toLowerCase().includes(q.toLowerCase())||
    p.cat.toLowerCase().includes(q.toLowerCase())||
    p.section.toLowerCase().includes(q.toLowerCase())||
    p.color.toLowerCase().includes(q.toLowerCase())
  ):[];
  return (
    <div style={{position:"fixed",inset:0,zIndex:400,background:"rgba(25,25,25,0.85)",display:"flex",flexDirection:"column",alignItems:"center",paddingTop:mobile?70:120}}>
      <div onClick={onClose} style={{position:"absolute",inset:0}}/>
      <div style={{position:"relative",width:"100%",maxWidth:680,padding:"0 24px"}}>
        <div style={{display:"flex",alignItems:"center",background:C.cream,padding:"16px 20px",gap:14}}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={C.gray} strokeWidth="1.5">
            <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
          </svg>
          <input ref={ref} value={q} onChange={e=>setQ(e.target.value)}
            placeholder={L&&L.searchPlaceholder||"Search…"}
            style={{flex:1,border:"none",background:"transparent",fontSize:18,color:C.black,outline:"none",...T.body}}/>
          <button onClick={onClose} style={{background:"none",border:"none",color:C.gray,fontSize:22,lineHeight:1}}>×</button>
        </div>
        {results.length>0&&(
          <div style={{background:C.cream,borderTop:`1px solid ${C.lgray}`,maxHeight:400,overflow:"auto"}}>
            {results.map(p=>(
              <div key={p.id} onClick={()=>{setPage("product",p);onClose();}}
                style={{display:"flex",gap:14,padding:"14px 20px",cursor:"pointer",transition:"background 0.15s",borderBottom:`1px solid ${C.lgray}`}}
                onMouseEnter={e=>e.currentTarget.style.background=C.offwhite}
                onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                <img src={p.img} alt={p.name} style={{width:48,height:48,objectFit:"cover",flexShrink:0}}/>
                <div>
                  <p style={{...T.heading,color:C.black,marginBottom:3,fontSize:13}}>{L&&L.localNames&&L.localNames[p.name]||p.name}</p>
                  <p style={{...T.labelSm,color:C.gray,fontSize:9}}>{p.section} · {p.cat} · GEL {p.sale||p.price}</p>
                </div>
              </div>
            ))}
          </div>
        )}
        {q.length>1&&results.length===0&&(
          <div style={{background:C.cream,padding:"28px 20px",textAlign:"center"}}>
            <p style={{...T.bodySm,color:C.gray}}>{L&&L.noResults||"No results for"} "{q}"</p>
          </div>
        )}
      </div>
    </div>
  );
}
