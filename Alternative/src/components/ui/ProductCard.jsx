import { useState, memo } from 'react';
import { C, T } from '../../constants/theme.js';

// ── LUXURY PRODUCT CARD ──────────────────────────────────────────────────────
export default memo(function ProductCard({product:p,onSelect,onQuickView,wishlist,onWishlist,L,mobile}) {
  const [h,setH]=useState(false);
  const [imgErr,setImgErr]=useState(false);
  const wished=wishlist?.includes(p.id);
  const imgSrc=p.img||(p.images&&p.images.length>0?p.images[0]:null);
  return (
    <div onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)} onClick={onSelect}
      className="luxury-card"
      style={{cursor:"pointer",position:"relative"}}>
      <div className="card-img" style={{aspectRatio:"3/4",overflow:"hidden",position:"relative",background:"#f5f5f3",marginBottom:14}}>
        {!imgSrc||imgErr?(
          <div style={{width:"100%",height:"100%",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",background:"linear-gradient(165deg,#f5f0eb 0%,#e8e0d6 100%)"}}>
            <span style={{fontFamily:"'Alido',serif",fontSize:42,fontWeight:700,color:"rgba(177,154,122,0.35)",letterSpacing:"0.05em",textTransform:"uppercase",lineHeight:1}}>{(p.brand||p.name||"A").charAt(0)}</span>
            <span style={{fontFamily:"'Alido',serif",fontSize:10,fontWeight:400,color:"rgba(177,154,122,0.45)",letterSpacing:"0.15em",textTransform:"uppercase",marginTop:8}}>{L?.photoSoon||"PHOTO SOON"}</span>
          </div>
        ):(
          <img src={imgSrc} alt={`${p.brand} ${p.name} in ${p.color}`} loading="lazy" onError={()=>setImgErr(true)}
            style={{width:"100%",height:"100%",objectFit:"contain",transform:h?"scale(1.05)":"scale(1)",transition:"transform 0.8s cubic-bezier(0.25,0.46,0.45,0.94)"}}/>
        )}
        <div style={{position:"absolute",top:10,left:10,display:"flex",gap:5,flexWrap:"wrap"}}>
          {p.tag==="Sale"&&<span style={{...T.labelSm,color:"#fff",background:C.black,padding:"5px 12px",fontSize:9,letterSpacing:"0.14em"}}>SALE</span>}
          {p.tag==="New"&&<span style={{...T.labelSm,color:"#fff",background:C.black,padding:"5px 12px",fontSize:9,letterSpacing:"0.14em"}}>NEW</span>}
          {p.tag==="Popular"&&<span style={{...T.labelSm,color:"#fff",background:C.brown,padding:"5px 12px",fontSize:9,letterSpacing:"0.14em"}}>POPULAR</span>}
          {p.tag==="Limited"&&<span style={{...T.labelSm,color:"#fff",background:C.tan,padding:"5px 12px",fontSize:9,letterSpacing:"0.14em"}}>LIMITED</span>}
        </div>
        {/* Quick view hint on hover */}
        {h&&!mobile&&(
          <div onClick={e=>{e.stopPropagation();onQuickView?onQuickView(p):onSelect();}} style={{position:"absolute",bottom:0,left:0,right:0,padding:"14px",background:"rgba(25,25,25,0.85)",backdropFilter:"blur(4px)",display:"flex",alignItems:"center",justifyContent:"center",animation:"fadeUp 0.2s ease",cursor:"pointer",zIndex:2}}>
            <span style={{fontSize:11,fontWeight:500,letterSpacing:"0.12em",textTransform:"uppercase",color:"rgba(255,255,255,0.9)",fontFamily:"'Alido',serif"}}>{L?.quickView||"Quick View"}</span>
          </div>
        )}
        {p.inStock===false&&(
          <div style={{position:"absolute",inset:0,background:"rgba(245,245,243,0.55)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:1}}>
            <span style={{...T.labelSm,fontSize:10,letterSpacing:"0.14em",color:C.black,background:"rgba(255,255,255,0.85)",padding:"8px 16px",backdropFilter:"blur(2px)"}}>{L?.outOfStock||"OUT OF STOCK"}</span>
          </div>
        )}
        {onWishlist&&(
          <button onClick={e=>{e.stopPropagation();onWishlist(p.id);}} aria-label={wished?"Remove from wishlist":"Add to wishlist"}
            style={{position:"absolute",top:10,right:10,background:"rgba(255,255,255,0.92)",border:"none",width:38,height:38,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",transition:"all 0.3s cubic-bezier(0.25,0.46,0.45,0.94)",transform:wished?"scale(1)":h?"scale(1)":"scale(0.9)",opacity:mobile||h||wished?1:0,boxShadow:"0 1px 4px rgba(0,0,0,0.08)"}}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill={wished?"#b19a7a":"none"} stroke={wished?"#b19a7a":"rgba(25,25,25,0.55)"} strokeWidth="1.5" strokeLinecap="round" style={{transition:"all 0.3s ease"}}>
              <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
            </svg>
          </button>
        )}
      </div>
      <div style={{padding:"0 2px"}}>
        <p style={{fontFamily:"'Alido',serif",fontSize:12,fontWeight:700,color:C.black,marginBottom:3,textTransform:"uppercase",letterSpacing:"0.02em"}}>{p.brand}</p>
        <p style={{fontFamily:"'Alido',serif",fontSize:12,fontWeight:300,color:C.gray,marginBottom:p.vendorName?2:8,lineHeight:1.4}}>{L&&L.localNames&&L.localNames[p.name]||p.name}</p>
        {p.vendorName&&<p style={{fontFamily:"'TT Interphases Pro',sans-serif",fontSize:10,color:C.tan,marginBottom:8,letterSpacing:"0.04em"}}>{L?.byVendor||"by"} {p.vendorName}</p>}
        <div style={{display:"flex",alignItems:"baseline",gap:10}}>
          {p.sale?(
            <>
              <span style={{fontFamily:"'Alido',serif",fontSize:14,fontWeight:600,color:C.black}}>{p.sale} GEL</span>
              <span style={{fontFamily:"'Alido',serif",fontSize:12,color:C.gray,textDecoration:"line-through",fontWeight:300}}>{p.price} GEL</span>
            </>
          ):(
            <span style={{fontFamily:"'Alido',serif",fontSize:14,fontWeight:600,color:C.black}}>{p.price} GEL</span>
          )}
        </div>
      </div>
    </div>
  );
});
