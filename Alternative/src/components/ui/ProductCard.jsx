import { useState } from 'react';
import { C, T } from '../../constants/theme.js';

// ── PRODUCT CARD ──────────────────────────────────────────────────────────────
export default function ProductCard({product:p,onSelect,wishlist,onWishlist,L,mobile}) {
  const [h,setH]=useState(false);
  const wished=wishlist?.includes(p.id);
  return (
    <div onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)} onClick={onSelect}
      style={{cursor:"pointer",background:C.offwhite,overflow:"hidden",position:"relative"}}>
      <div style={{height:mobile?280:340,overflow:"hidden",position:"relative"}}>
        <img src={p.img} alt={p.name} style={{width:"100%",height:"100%",objectFit:"cover",transform:h?"scale(1.04)":"scale(1)",transition:"transform 0.6s ease"}}/>
        <div style={{position:"absolute",top:10,left:10,display:"flex",gap:5,flexWrap:"wrap"}}>
          {p.tag==="Sale"&&<span style={{...T.labelSm,color:C.white,background:C.red,padding:"4px 10px",fontSize:8}}>SALE</span>}
          {p.tag==="New"&&<span style={{...T.labelSm,color:C.white,background:C.black,padding:"4px 10px",fontSize:8}}>NEW</span>}
          {p.tag==="Popular"&&<span style={{...T.labelSm,color:C.white,background:C.brown,padding:"4px 10px",fontSize:8}}>POPULAR</span>}
          {p.tag==="Limited"&&<span style={{...T.labelSm,color:C.white,background:C.tan,padding:"4px 10px",fontSize:8}}>LIMITED</span>}
        </div>
        {onWishlist&&(
          <button onClick={e=>{e.stopPropagation();onWishlist(p.id);}}
            style={{position:"absolute",top:8,right:8,background:wished?"rgba(177,154,122,0.9)":"rgba(255,255,255,0.85)",border:"none",width:44,height:44,display:"flex",alignItems:"center",justifyContent:"center",transition:"all 0.2s"}}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill={wished?C.white:"none"} stroke={wished?C.white:C.gray} strokeWidth="1.5">
              <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
            </svg>
          </button>
        )}
      </div>
      <div style={{padding:"14px 14px 16px",borderTop:`1px solid ${C.lgray}`}}>
        <p style={{...T.labelSm,color:C.tan,marginBottom:4,fontSize:9}}>{p.brand}</p>
        <p style={{...T.heading,color:C.black,marginBottom:3,fontSize:13}}>{L&&L.localNames&&L.localNames[p.name]||p.name}</p>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",marginTop:6}}>
          <div>
            {p.sale?(
              <span style={{display:"flex",alignItems:"baseline",gap:8}}>
                <span style={{fontFamily:"'Alido',serif",fontSize:18,color:C.red,lineHeight:1}}>GEL {p.sale}</span>
                <span style={{fontFamily:"'Alido',serif",fontSize:13,color:C.gray,textDecoration:"line-through"}}>GEL {p.price}</span>
              </span>
            ):(
              <span style={{fontFamily:"'Alido',serif",fontSize:19,color:C.black,lineHeight:1}}>GEL {p.price}</span>
            )}
          </div>
          <span style={{...T.labelSm,color:C.lgray,fontSize:8}}>{p.lead}</span>
        </div>
      </div>
    </div>
  );
}
