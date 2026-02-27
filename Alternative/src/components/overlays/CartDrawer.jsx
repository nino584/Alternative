import { C, T } from '../../constants/theme.js';
import HoverBtn from '../ui/HoverBtn.jsx';

// ── SHOPPING BAG DRAWER ──────────────────────────────────────────────────────
export default function CartDrawer({cart,onClose,setPage,removeFromCart,onCheckout,L,mobile}) {
  const total=(cart||[]).reduce((s,o)=>s+(Number(o.sale)||Number(o.price)||0),0);
  return (
    <div role="dialog" aria-label={L&&L.shoppingBag||"Shopping Bag"} aria-modal="true" style={{position:"fixed",inset:0,zIndex:350,display:"flex"}}>
      <div onClick={onClose} style={{position:"absolute",inset:0,background:"rgba(25,25,25,0.6)"}}/>
      <div style={{position:"relative",marginLeft:"auto",width:"100%",maxWidth:440,background:C.cream,height:"100%",overflow:"auto",animation:"slideRight 0.3s ease",boxShadow:"-12px 0 50px rgba(0,0,0,0.15)"}}>
        <div style={{padding:"24px 28px",borderBottom:`1px solid ${C.lgray}`,display:"flex",justifyContent:"space-between",alignItems:"center",position:"sticky",top:0,background:C.cream,zIndex:2}}>
          <div>
            <p style={{...T.labelSm,color:C.tan,marginBottom:4,fontSize:9}}>{L&&L.yourBag||"YOUR BAG"}</p>
            <p style={{...T.heading,color:C.black}}>{L&&L.shoppingBag||"Shopping Bag"} ({cart.length})</p>
          </div>
          <button onClick={onClose} aria-label="Close" style={{background:"none",border:"none",color:C.gray,fontSize:22,width:44,height:44,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"}}>×</button>
        </div>
        <div style={{padding:"20px 28px",flex:1}}>
          {cart.length===0?(
            <div style={{textAlign:"center",padding:"60px 0"}}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke={C.lgray} strokeWidth="1" style={{marginBottom:16}}>
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/>
              </svg>
              <p style={{...T.bodySm,color:C.gray,marginBottom:24}}>{L&&L.emptyBag||"Your bag is empty."}</p>
              <HoverBtn onClick={()=>{setPage("catalog");onClose();}} variant="primary">{L&&L.exploreCollection||"Explore Collection"}</HoverBtn>
            </div>
          ):cart.map((o,i)=>(
            <div key={o.addedAt||i} style={{display:"flex",gap:14,padding:"16px 0",borderBottom:`1px solid ${C.lgray}`}}>
              <img src={o.img} alt={o.name} loading="lazy" width="72" height="72" style={{width:72,height:72,objectFit:"cover",flexShrink:0,cursor:"pointer"}}
                onClick={()=>{setPage("product",o);onClose();}}/>
              <div style={{flex:1,minWidth:0}}>
                {o.brand&&<p style={{...T.labelSm,color:C.tan,fontSize:8,letterSpacing:"0.12em",marginBottom:2}}>{o.brand}</p>}
                <p style={{...T.heading,color:C.black,fontSize:12,marginBottom:3,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{L?.localNames?.[o.name]||o.name}</p>
                <p style={{...T.labelSm,color:C.gray,fontSize:9,marginBottom:8}}>{o.color}{o.selectedSize&&o.selectedSize!=="One Size"?" · "+o.selectedSize:""}</p>
                {o.notes&&<p style={{...T.bodySm,color:C.brown,fontSize:10,fontStyle:"italic",marginBottom:6,lineHeight:1.4}}>"{o.notes}"</p>}
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <span style={{fontFamily:"'Alido',serif",fontSize:18,color:o.sale?C.red:C.black}}>
                    GEL {o.sale||o.price}
                    {o.sale&&<span style={{fontSize:12,color:C.gray,textDecoration:"line-through",marginLeft:6}}>GEL {o.price}</span>}
                  </span>
                  <button onClick={()=>removeFromCart(i)} style={{background:"none",border:"none",...T.labelSm,color:C.gray,fontSize:9,cursor:"pointer"}}>{L&&L.removeItem||"Remove"}</button>
                </div>
              </div>
            </div>
          ))}
        </div>
        {cart.length>0&&(
          <div style={{position:"sticky",bottom:0,background:C.cream,borderTop:`1px solid ${C.lgray}`,padding:"20px 28px"}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
              <span style={{...T.labelSm,color:C.gray,fontSize:9}}>{L&&L.subtotal||"SUBTOTAL"}</span>
              <span style={{fontFamily:"'Alido',serif",fontSize:24,color:C.black}}>GEL {total}</span>
            </div>
            <p style={{...T.labelSm,color:C.gray,fontSize:9,marginBottom:16}}>{L&&L.shippingAtCheckout||"Shipping calculated at checkout"}</p>
            <HoverBtn onClick={onCheckout} variant="primary" style={{width:"100%",marginBottom:8}}>{L&&L.checkout||"Checkout"}</HoverBtn>
            <button onClick={()=>{setPage("catalog");onClose();}} style={{width:"100%",background:"none",border:"none",...T.labelSm,color:C.tan,fontSize:10,padding:"10px 0",cursor:"pointer"}}>{L&&L.continueShopping||"Continue Shopping"}</button>
          </div>
        )}
      </div>
    </div>
  );
}
