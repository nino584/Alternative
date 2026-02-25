import { C, T } from '../../constants/theme.js';
import HoverBtn from '../ui/HoverBtn.jsx';

// ── CART DRAWER ───────────────────────────────────────────────────────────────
export default function CartDrawer({cart,onClose,setPage,removeFromCart,L,mobile}) {
  const total=cart.reduce((s,o)=>s+(o.sale||o.price),0);
  return (
    <div style={{position:"fixed",inset:0,zIndex:350,display:"flex"}}>
      <div onClick={onClose} style={{position:"absolute",inset:0,background:"rgba(25,25,25,0.6)"}}/>
      <div style={{position:"relative",marginLeft:"auto",width:"100%",maxWidth:440,background:C.cream,height:"100%",overflow:"auto",animation:"slideRight 0.3s ease",boxShadow:"-12px 0 50px rgba(0,0,0,0.15)"}}>
        <div style={{padding:"24px 28px",borderBottom:`1px solid ${C.lgray}`,display:"flex",justifyContent:"space-between",alignItems:"center",position:"sticky",top:0,background:C.cream,zIndex:2}}>
          <div>
            <p style={{...T.labelSm,color:C.tan,marginBottom:4,fontSize:9}}>{L&&L.yourReserved||"Your"}</p>
            <p style={{...T.heading,color:C.black}}>{L&&L.reservedOrders||"Reserved Orders"} ({cart.length})</p>
          </div>
          <button onClick={onClose} style={{background:"none",border:"none",color:C.gray,fontSize:22}}>×</button>
        </div>
        <div style={{padding:"20px 28px",flex:1}}>
          {cart.length===0?(
            <div style={{textAlign:"center",padding:"60px 0"}}>
              <p style={{...T.bodySm,color:C.gray,marginBottom:24}}>{L&&L.noReserved||"No reserved orders yet."}</p>
              <HoverBtn onClick={()=>{setPage("catalog");onClose();}} variant="primary">{L&&L.exploreCollection||"Explore Collection"}</HoverBtn>
            </div>
          ):cart.map((o,i)=>(
            <div key={o.orderId||i} style={{display:"flex",gap:14,padding:"16px 0",borderBottom:`1px solid ${C.lgray}`}}>
              <img src={o.img} alt={o.name} style={{width:64,height:64,objectFit:"cover",flexShrink:0}}/>
              <div style={{flex:1,minWidth:0}}>
                <p style={{...T.heading,color:C.black,fontSize:12,marginBottom:3,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{o.name}</p>
                <p style={{...T.labelSm,color:C.gray,fontSize:9,marginBottom:6}}>{o.color}{o.selectedSize&&o.selectedSize!=="One Size"?" · "+o.selectedSize:""}</p>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <span style={{fontFamily:"'Alido',serif",fontSize:18,color:C.black}}>GEL {o.sale||o.price}</span>
                  <button onClick={()=>removeFromCart(i)} style={{background:"none",border:"none",...T.labelSm,color:C.gray,fontSize:9}}>{L&&L.removeItem||"Remove"}</button>
                </div>
              </div>
            </div>
          ))}
        </div>
        {cart.length>0&&(
          <div style={{position:"sticky",bottom:0,background:C.cream,borderTop:`1px solid ${C.lgray}`,padding:"20px 28px"}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:16}}>
              <span style={{...T.label,color:C.black,fontSize:11}}>{L&&L.totalReserved||"Total Reserved"}</span>
              <span style={{fontFamily:"'Alido',serif",fontSize:24,color:C.black}}>GEL {total}</span>
            </div>
            <HoverBtn onClick={()=>{setPage("orders");onClose();}} variant="primary" style={{width:"100%"}}>{L&&L.viewAllOrders||"View All Orders"}</HoverBtn>
          </div>
        )}
      </div>
    </div>
  );
}
