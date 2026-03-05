import { useState, useEffect } from 'react';
import { C, T } from '../../constants/theme.js';
import { IconCheck } from '../icons/Icons.jsx';
import HoverBtn from '../ui/HoverBtn.jsx';

// ── QUICK VIEW MODAL (Farfetch / Luisaviaroma style) ────────────────────────
export default function QuickViewModal({product:p,onClose,addToCart,setPage,onWishlist,wishlist,toast,L,mobile}) {
  const [selectedSize,setSelectedSize]=useState(p.sizes?.length===1?p.sizes[0]:"");
  const [sizeError,setSizeError]=useState(false);
  const [added,setAdded]=useState(false);
  const wished=wishlist?.includes(p.id);

  useEffect(()=>{
    const fn=e=>{if(e.key==="Escape")onClose();};
    window.addEventListener("keydown",fn);
    document.body.style.overflow="hidden";
    return()=>{window.removeEventListener("keydown",fn);document.body.style.overflow="";};
  },[onClose]);

  const handleAdd=()=>{
    if(p.sizes?.length>1&&p.sizes[0]!=="One Size"&&!selectedSize){setSizeError(true);return;}
    setSizeError(false);
    addToCart(p,selectedSize||"One Size");
    setAdded(true);
    toast?.(L?.addedToCart||"Added to bag","success");
    setTimeout(()=>setAdded(false),2000);
  };

  const imgSrc=p.img||(p.images&&p.images[0])||null;
  const effectivePrice=p.sale||p.price;

  return (
    <div style={{position:"fixed",inset:0,zIndex:400,display:"flex",alignItems:"center",justifyContent:"center"}}>
      {/* Backdrop */}
      <div onClick={onClose} style={{position:"absolute",inset:0,background:"rgba(25,25,25,0.6)",backdropFilter:"blur(6px)",WebkitBackdropFilter:"blur(6px)"}}/>

      {/* Modal */}
      <div style={{position:"relative",width:"95%",maxWidth:mobile?420:900,maxHeight:"90vh",background:C.cream,display:"flex",flexDirection:mobile?"column":"row",overflow:"hidden",animation:"qvSlide 0.3s ease",boxShadow:"0 20px 80px rgba(0,0,0,0.2)"}}>
        <style>{`@keyframes qvSlide{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}`}</style>

        {/* Close button */}
        <button onClick={onClose} aria-label="Close" style={{position:"absolute",top:16,right:16,zIndex:10,width:40,height:40,background:"rgba(255,255,255,0.9)",border:"none",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",boxShadow:"0 2px 8px rgba(0,0,0,0.1)"}}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.black} strokeWidth="1.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
        </button>

        {/* Left: Image */}
        <div style={{flex:mobile?"none":"1",height:mobile?320:"auto",minHeight:mobile?"auto":400,background:"#f5f5f3",position:"relative",overflow:"hidden"}}>
          {imgSrc?(
            <img src={imgSrc} alt={`${p.brand} ${p.name}`} style={{width:"100%",height:"100%",objectFit:"contain",padding:20}}/>
          ):(
            <div style={{width:"100%",height:"100%",display:"flex",alignItems:"center",justifyContent:"center",background:"linear-gradient(165deg,#f5f0eb,#e8e0d6)"}}>
              <span style={{fontFamily:"'Alido',serif",fontSize:64,color:"rgba(177,154,122,0.3)"}}>{(p.brand||"A").charAt(0)}</span>
            </div>
          )}
          {/* Tags */}
          <div style={{position:"absolute",top:16,left:16,display:"flex",gap:6}}>
            {p.tag==="Sale"&&<span style={{...T.labelSm,color:"#fff",background:C.black,padding:"5px 12px",fontSize:9}}>SALE</span>}
            {p.tag==="New"&&<span style={{...T.labelSm,color:"#fff",background:C.black,padding:"5px 12px",fontSize:9}}>NEW</span>}
            {p.tag==="Limited"&&<span style={{...T.labelSm,color:"#fff",background:C.tan,padding:"5px 12px",fontSize:9}}>LIMITED</span>}
          </div>
        </div>

        {/* Right: Details */}
        <div style={{flex:mobile?"none":"1",padding:mobile?"24px 20px":"36px 32px",overflowY:"auto",maxHeight:mobile?"50vh":"90vh",display:"flex",flexDirection:"column"}}>
          {/* Brand */}
          <p style={{...T.labelSm,color:C.tan,fontSize:10,letterSpacing:"0.16em",marginBottom:6}}>{p.brand}</p>

          {/* Name */}
          <h2 style={{fontFamily:"'Alido',serif",fontSize:mobile?22:28,fontWeight:300,color:C.black,marginBottom:6,lineHeight:1.2}}>{L?.localNames?.[p.name]||p.name}</h2>

          {/* Color / Section */}
          <p style={{...T.bodySm,color:C.gray,fontSize:12,marginBottom:16}}>{p.color} · {p.section}</p>

          {/* Price */}
          <div style={{display:"flex",alignItems:"baseline",gap:10,marginBottom:24}}>
            <span style={{fontFamily:"'Alido',serif",fontSize:26,color:p.sale?C.red:C.black}}>GEL {effectivePrice}</span>
            {p.sale&&<span style={{fontFamily:"'Alido',serif",fontSize:16,color:C.gray,textDecoration:"line-through"}}>GEL {p.price}</span>}
          </div>

          {/* Size selector */}
          {p.sizes&&p.sizes.length>0&&p.sizes[0]!=="One Size"&&(
            <div style={{marginBottom:20}}>
              <p style={{...T.labelSm,fontSize:9,color:sizeError?C.red:C.gray,letterSpacing:"0.1em",marginBottom:10}}>
                {sizeError?(L?.selectSize||"PLEASE SELECT A SIZE"):(L?.size||"SIZE")}
              </p>
              <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
                {p.sizes.map(s=>(
                  <button key={s} onClick={()=>{setSelectedSize(s);setSizeError(false);}}
                    style={{padding:"10px 16px",border:`1.5px solid ${selectedSize===s?C.black:sizeError?"rgba(200,80,80,0.4)":"rgba(200,200,190,0.5)"}`,background:selectedSize===s?C.black:"transparent",color:selectedSize===s?"#fff":C.black,...T.labelSm,fontSize:10,cursor:"pointer",transition:"all 0.2s",minWidth:48,textAlign:"center"}}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {p.sizes&&p.sizes[0]==="One Size"&&(
            <p style={{...T.labelSm,fontSize:9,color:C.gray,letterSpacing:"0.1em",marginBottom:20}}>{L?.oneSize||"ONE SIZE"}</p>
          )}

          {/* Description */}
          {p.desc&&(
            <p style={{...T.bodySm,color:C.gray,fontSize:13,lineHeight:1.7,marginBottom:20}}>{p.desc}</p>
          )}

          {/* Lead time */}
          {p.lead&&(
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:20}}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.tan} strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
              <span style={{...T.bodySm,color:C.gray,fontSize:11}}>{L?.estimatedDelivery||"Estimated delivery"}: {p.lead}</span>
            </div>
          )}

          {/* Spacer */}
          <div style={{flex:1,minHeight:12}}/>

          {/* Add to bag button */}
          <HoverBtn onClick={handleAdd} variant={added?"secondary":"primary"} style={{width:"100%",padding:"16px 24px",marginBottom:10}}>
            {added?(
              <span style={{display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
                <IconCheck size={14} stroke={2}/> {L?.addedToBag||"Added to Bag"}
              </span>
            ):`${L?.addToBag||"ADD TO BAG"} — GEL ${effectivePrice}`}
          </HoverBtn>

          {/* View full details link */}
          <button onClick={()=>{onClose();setPage("product",p);}}
            style={{width:"100%",background:"none",border:"none",...T.labelSm,color:C.tan,fontSize:10,padding:"12px 0",cursor:"pointer",letterSpacing:"0.1em"}}>
            {L?.viewFullDetails||"VIEW FULL DETAILS"}
          </button>

          {/* Wishlist */}
          {onWishlist&&(
            <button onClick={()=>onWishlist(p.id)}
              style={{width:"100%",background:"none",border:`1px solid ${C.lgray}`,padding:"12px",display:"flex",alignItems:"center",justifyContent:"center",gap:8,cursor:"pointer",marginTop:6,transition:"all 0.2s"}}
              onMouseEnter={e=>e.currentTarget.style.borderColor=C.tan}
              onMouseLeave={e=>e.currentTarget.style.borderColor=C.lgray}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill={wished?"#b19a7a":"none"} stroke={wished?"#b19a7a":C.gray} strokeWidth="1.5">
                <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
              </svg>
              <span style={{...T.labelSm,fontSize:9,color:wished?C.tan:C.gray}}>{wished?(L?.inWishlist||"IN WISHLIST"):(L?.addToWishlist||"ADD TO WISHLIST")}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
