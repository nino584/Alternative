import { useEffect } from 'react';
import { C, T } from '../../constants/theme.js';
import HoverBtn from '../ui/HoverBtn.jsx';

// ── LUXURY SHOPPING BAG DRAWER ──────────────────────────────────────────────
export default function CartDrawer({cart,onClose,setPage,removeFromCart,updateCartQty,onCheckout,L,mobile}) {
  useEffect(()=>{const fn=e=>{if(e.key==="Escape")onClose();};window.addEventListener("keydown",fn);return()=>window.removeEventListener("keydown",fn);},[onClose]);
  const total=(cart||[]).reduce((s,o)=>s+((Number(o.sale??o.price)||0)*(o.qty||1)),0);
  return (
    <div role="dialog" aria-label={L&&L.shoppingBag||"Shopping Bag"} aria-modal="true" style={{position:"fixed",inset:0,zIndex:350,display:"flex"}}>
      <div onClick={onClose} style={{position:"absolute",inset:0,background:"rgba(25,25,25,0.55)",backdropFilter:"blur(4px)",WebkitBackdropFilter:"blur(4px)",animation:"fadeIn 0.2s ease"}}/>
      <div style={{position:"relative",marginLeft:"auto",width:"100%",maxWidth:440,background:C.cream,height:"100%",display:"flex",flexDirection:"column",animation:"slideRight 0.3s cubic-bezier(0.25,0.46,0.45,0.94)",boxShadow:"-16px 0 60px rgba(0,0,0,0.12)"}}>

        {/* Header */}
        <div style={{padding:"24px 28px",borderBottom:`1px solid ${C.lgray}`,display:"flex",justifyContent:"space-between",alignItems:"center",flexShrink:0}}>
          <div>
            <p style={{fontFamily:"'TT Interphases Pro',sans-serif",fontSize:9,fontWeight:500,letterSpacing:"0.14em",textTransform:"uppercase",color:C.tan,marginBottom:6}}>{L&&L.yourBag||"YOUR BAG"}</p>
            <p style={{fontFamily:"'TT Interphases Pro',sans-serif",fontSize:16,fontWeight:500,color:C.black,letterSpacing:"0.02em"}}>{L&&L.shoppingBag||"Shopping Bag"} ({cart.length})</p>
          </div>
          <button onClick={onClose} aria-label="Close" className="icon-btn" style={{width:40,height:40,color:C.gray}}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
          </button>
        </div>

        {/* Cart items — scrollable */}
        <div style={{padding:"20px 28px",flex:1,overflowY:"auto",WebkitOverflowScrolling:"touch"}}>
          {cart.length===0?(
            <div style={{textAlign:"center",padding:"60px 0"}}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke={C.lgray} strokeWidth="0.8" strokeLinecap="round" style={{marginBottom:20}}>
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/>
              </svg>
              <p style={{fontFamily:"'TT Interphases Pro',sans-serif",fontSize:14,fontWeight:300,color:C.gray,marginBottom:8}}>{L&&L.emptyBag||"Your bag is empty."}</p>
              <div style={{width:24,height:1,background:`linear-gradient(90deg,transparent,${C.tan},transparent)`,margin:"0 auto 28px"}}/>
              <HoverBtn onClick={()=>{setPage("catalog");onClose();}} variant="shimmer">{L&&L.exploreCollection||"Explore Collection"}</HoverBtn>
            </div>
          ):cart.map((o,i)=>(
            <div key={o.addedAt||i} style={{display:"flex",gap:16,padding:"18px 0",borderBottom:"1px solid rgba(0,0,0,0.06)",transition:"opacity 0.3s"}}>
              <img src={o.img||(o.images&&o.images[0])||""} alt={o.name} loading="lazy" width="80" height="80"
                style={{width:80,height:80,objectFit:"cover",flexShrink:0,cursor:"pointer",transition:"opacity 0.3s"}}
                onClick={()=>{setPage("product",o);onClose();}}
                onError={e=>{e.target.style.display="none";}}
                onMouseEnter={e=>e.currentTarget.style.opacity="0.85"}
                onMouseLeave={e=>e.currentTarget.style.opacity="1"}/>
              <div style={{flex:1,minWidth:0}}>
                {o.brand&&<p style={{fontFamily:"'TT Interphases Pro',sans-serif",fontSize:9,fontWeight:500,letterSpacing:"0.14em",textTransform:"uppercase",color:C.tan,marginBottom:3}}>{o.brand}</p>}
                <p style={{fontFamily:"'TT Interphases Pro',sans-serif",fontSize:13,fontWeight:400,color:C.black,marginBottom:3,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",letterSpacing:"0.01em"}}>{L?.localNames?.[o.name]||o.name}</p>
                <p style={{fontFamily:"'TT Interphases Pro',sans-serif",fontSize:10,fontWeight:300,letterSpacing:"0.06em",textTransform:"uppercase",color:C.gray,marginBottom:10}}>{o.color}{o.selectedSize&&o.selectedSize!=="One Size"?" · "+o.selectedSize:""}</p>
                {o.notes&&<p style={{fontFamily:"'TT Interphases Pro',sans-serif",fontSize:11,fontWeight:300,color:C.brown,fontStyle:"italic",marginBottom:8,lineHeight:1.4}}>"{o.notes}"</p>}
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <span style={{fontFamily:"'Alido',serif",fontSize:17,color:C.black}}>
                    GEL {(o.sale??o.price)*(o.qty||1)}
                    {o.sale&&<span style={{fontFamily:"'TT Interphases Pro',sans-serif",fontSize:11,color:C.gray,textDecoration:"line-through",marginLeft:8,fontWeight:300}}>GEL {o.price*(o.qty||1)}</span>}
                  </span>
                  <button onClick={()=>removeFromCart(i)}
                    style={{background:"none",border:"none",fontFamily:"'TT Interphases Pro',sans-serif",fontSize:10,fontWeight:400,letterSpacing:"0.08em",textTransform:"uppercase",color:C.gray,cursor:"pointer",transition:"color 0.3s",padding:"4px 0"}}
                    onMouseEnter={e=>e.currentTarget.style.color=C.red} onMouseLeave={e=>e.currentTarget.style.color=C.gray}>{L&&L.removeItem||"Remove"}</button>
                </div>
                <div style={{display:"flex",alignItems:"center",gap:0,marginTop:10}}>
                  <button onClick={()=>updateCartQty&&updateCartQty(i,-1)} disabled={(o.qty||1)<=1}
                    style={{width:30,height:30,border:`1px solid ${C.lgray}`,background:"none",color:(o.qty||1)<=1?C.lgray:C.black,fontSize:14,cursor:(o.qty||1)<=1?"default":"pointer",display:"flex",alignItems:"center",justifyContent:"center",transition:"all 0.2s"}}
                    onMouseEnter={e=>{if((o.qty||1)>1)e.currentTarget.style.borderColor=C.tan;}} onMouseLeave={e=>e.currentTarget.style.borderColor=C.lgray}>−</button>
                  <span style={{width:36,textAlign:"center",fontFamily:"'TT Interphases Pro',sans-serif",fontSize:12,fontWeight:500,letterSpacing:"0.06em",color:C.black}}>{o.qty||1}</span>
                  <button onClick={()=>updateCartQty&&updateCartQty(i,1)}
                    style={{width:30,height:30,border:`1px solid ${C.lgray}`,background:"none",color:C.black,fontSize:14,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",transition:"all 0.2s"}}
                    onMouseEnter={e=>e.currentTarget.style.borderColor=C.tan} onMouseLeave={e=>e.currentTarget.style.borderColor=C.lgray}>+</button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer / checkout */}
        {cart.length>0&&(
          <div style={{flexShrink:0,background:C.cream,borderTop:`1px solid ${C.lgray}`,padding:"22px 28px"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",marginBottom:6}}>
              <span style={{fontFamily:"'TT Interphases Pro',sans-serif",fontSize:10,fontWeight:500,letterSpacing:"0.14em",textTransform:"uppercase",color:C.gray}}>{L&&L.subtotal||"SUBTOTAL"}</span>
              <span style={{fontFamily:"'Alido',serif",fontSize:24,color:C.black}}>GEL {total}</span>
            </div>
            <p style={{fontFamily:"'TT Interphases Pro',sans-serif",fontSize:10,fontWeight:300,letterSpacing:"0.06em",color:C.gray,marginBottom:18}}>{L&&L.shippingAtCheckout||"Shipping calculated at checkout"}</p>
            <HoverBtn onClick={onCheckout} variant="shimmer" style={{width:"100%",marginBottom:10,padding:"15px"}}>{L&&L.checkout||"Checkout"}</HoverBtn>
            <button onClick={()=>{setPage("catalog");onClose();}} className="btn-underline-draw"
              style={{width:"100%",fontFamily:"'TT Interphases Pro',sans-serif",fontSize:10,fontWeight:500,letterSpacing:"0.12em",textTransform:"uppercase",color:C.tan,padding:"10px 0",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>{L&&L.continueShopping||"Continue Shopping"}</button>
          </div>
        )}
      </div>
    </div>
  );
}
