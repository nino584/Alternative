import { useState, useEffect } from 'react';
import { C, T } from '../constants/theme.js';
import { ORDER_STATUSES } from '../constants/data.js';
import { VIDEO_VERIFICATION_GEL } from '../constants/config.js';
import HoverBtn from '../components/ui/HoverBtn.jsx';
import Footer from '../components/layout/Footer.jsx';

// ── ORDERS PAGE ───────────────────────────────────────────────────────────────
export default function OrdersPage({mobile,orders,setPage,toast,L}) {
  const allOrders = orders || [];
  const [active,setActive]=useState(allOrders[0] ?? null);

  useEffect(()=>{if(allOrders.length>0&&!active)setActive(allOrders[0]);},[allOrders.length]);

  const current=active||allOrders[0];
  const si=ORDER_STATUSES.findIndex(s=>s.key===current?.status);
  const labelMap={reserved:"statusReservedLabel",sourcing:"statusSourcingLabel",confirmed:"statusConfirmedLabel",shipped:"statusShippedLabel",delivered:"statusDeliveredLabel"};
  const descMap={reserved:"statusReservedDesc",sourcing:"statusSourcingDesc",confirmed:"statusConfirmedDesc",shipped:"statusShippedDesc",delivered:"statusDeliveredDesc"};
  const sLabel=(s)=>L[labelMap[s.key]]||s.label;
  const sDesc=(s)=>L[descMap[s.key]]||s.desc;
  const orderTotal=current?(current.sale||current.price)+(current.wantVideo?VIDEO_VERIFICATION_GEL:0):0;
  const balanceDue=current?orderTotal-(current.depositPaid||0):0;

  const handleCancel=()=>{
    if(window.confirm&&window.confirm(L&&L.cancelConfirm||"Cancel this order? Your payment will be fully refunded.")){
      toast(L&&L.cancelSuccess||"Cancellation request sent.","success");
    }
  };

  if (allOrders.length===0) {
    return (
      <div style={{paddingTop:mobile?52:80,minHeight:"100vh",background:C.cream}}>
        <div style={{padding:"32px 0 20px",borderBottom:`1px solid ${C.lgray}`}}>
          <div style={{maxWidth:1360,margin:"0 auto",padding:"0 40px",display:"flex",justifyContent:"space-between",alignItems:"flex-end"}}>
            <div>
              <p style={{...T.labelSm,color:C.tan,marginBottom:8}}>{L&&L.myAccount||'Account'}</p>
              <h1 style={{...T.displayMd,color:C.black}}>{L&&L.myOrders||'My Orders'}</h1>
            </div>
          </div>
        </div>
        <div style={{maxWidth:1360,margin:"0 auto",padding:"60px 40px 80px",textAlign:"center"}}>
          <p style={{...T.displaySm,color:C.gray,marginBottom:16}}>{L&&L.noOrdersYet||"No orders yet."}</p>
          <p style={{...T.bodySm,color:C.gray,marginBottom:28}}>{L&&L.noOrdersHint||"Reserve items from the collection to see them here."}</p>
          <HoverBtn onClick={()=>setPage("catalog")} variant="primary">{L&&L.exploreCollection||"Explore Collection"}</HoverBtn>
        </div>
      </div>
    );
  }

  return (
    <div style={{paddingTop:80,minHeight:"100vh",background:C.cream}}>
      <div style={{padding:"32px 0 20px",borderBottom:`1px solid ${C.lgray}`}}>
        <div style={{maxWidth:1360,margin:"0 auto",padding:"0 40px",display:"flex",justifyContent:"space-between",alignItems:"flex-end"}}>
          <div>
            <p style={{...T.labelSm,color:C.tan,marginBottom:8}}>{L&&L.myAccount||'Account'}</p>
            <h1 style={{...T.displayMd,color:C.black}}>{L&&L.myOrders||'My Orders'}</h1>
          </div>
          <HoverBtn onClick={()=>setPage("catalog")} variant="secondary" style={{padding:"10px 24px",fontSize:10}}>{L&&L.continueShopping||"Continue Shopping"}</HoverBtn>
        </div>
      </div>

      <div style={{maxWidth:1360,margin:"0 auto",padding:"32px 40px 80px",display:"grid",gridTemplateColumns:mobile?"1fr":"300px 1fr",gap:mobile?20:32}}>
        <div>
          {allOrders.map(o=>{
            const osi=ORDER_STATUSES.findIndex(s=>s.key===o.status);
            const isA=current?.orderId===o.orderId;
            return (
              <div key={o.orderId} onClick={()=>setActive(o)} style={{padding:16,marginBottom:2,cursor:"pointer",background:isA?C.offwhite:C.cream,border:isA?`1px solid ${C.tan}`:"1px solid transparent",transition:"all 0.2s"}}>
                <div style={{display:"flex",gap:12,alignItems:"flex-start"}}>
                  <img src={o.img} alt="" style={{width:48,height:48,objectFit:"cover",flexShrink:0}}/>
                  <div style={{flex:1,minWidth:0}}>
                    <p style={{...T.heading,color:C.black,fontSize:12,marginBottom:2,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{o.name}</p>
                    <p style={{...T.labelSm,color:C.gray,fontSize:8,marginBottom:6}}>{o.orderId}</p>
                    <div style={{display:"flex",gap:6,alignItems:"center"}}>
                      <div style={{width:5,height:5,borderRadius:"50%",background:ORDER_STATUSES[osi]?.color||C.tan,flexShrink:0}}/>
                      <span style={{...T.labelSm,fontSize:8,color:C.black}}>{ORDER_STATUSES[osi]?sLabel(ORDER_STATUSES[osi]):""}</span>
                      {o.wantVideo&&<span style={{...T.labelSm,fontSize:7,color:C.tan,padding:"1px 6px",border:`1px solid ${C.tan}`}}>VIDEO</span>}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {current&&(
          <div>
            <div style={{marginBottom:28}}>
              <div style={{display:"flex",marginBottom:8,gap:2}}>
                {ORDER_STATUSES.map((s,i)=><div key={i} style={{flex:1,height:3,background:i<=si?s.color:C.lgray,transition:"background 0.3s"}}/>)}
              </div>
              <div style={{display:"flex",justifyContent:"space-between"}}>
                {ORDER_STATUSES.map((s,i)=>(
                  <span key={i} style={{...T.labelSm,fontSize:8,color:i===si?s.color:C.gray,fontWeight:i===si?500:300}}>{sLabel(s)}</span>
                ))}
              </div>
            </div>

            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:24,marginBottom:24}}>
              <img src={current.img} alt={current.name} style={{width:"100%",height:220,objectFit:"cover"}}/>
              <div>
                <p style={{...T.labelSm,color:C.tan,fontSize:9,marginBottom:6}}>{current.orderId}</p>
                <h2 style={{fontFamily:"'Alido',serif",fontSize:26,fontWeight:300,color:C.black,lineHeight:1.2,marginBottom:6}}>{current.name}</h2>
                <p style={{...T.bodySm,color:C.gray,marginBottom:18}}>{current.color}{current.selectedSize&&current.selectedSize!=="One Size"?" · "+current.selectedSize:""}</p>
                <div style={{padding:16,background:C.offwhite,borderLeft:`3px solid ${ORDER_STATUSES[si]?.color||C.tan}`,marginBottom:14}}>
                  <p style={{...T.labelSm,color:ORDER_STATUSES[si]?.color||C.tan,marginBottom:5,fontSize:9}}>{L.currentStatus||"Current status"}</p>
                  <p style={{...T.label,color:C.black,fontSize:11,marginBottom:4}}>{ORDER_STATUSES[si]?sLabel(ORDER_STATUSES[si]):""}</p>
                  <p style={{...T.bodySm,color:C.gray,lineHeight:1.7,fontSize:12}}>{ORDER_STATUSES[si]?sDesc(ORDER_STATUSES[si]):""}</p>
                </div>
                {current.wantVideo&&(
                  <div style={{padding:"10px 14px",background:`rgba(177,154,122,0.08)`,border:`1px solid ${C.tan}`,marginBottom:14}}>
                    <p style={{...T.labelSm,color:C.tan,fontSize:9}}>▷ {L.videoIncluded||"Video verification included — will be sent to WhatsApp before dispatch"}</p>
                  </div>
                )}
                {[["Amount paid",`GEL ${current.depositPaid}`],["Total",`GEL ${orderTotal}`]].map(([k,v])=>(
                  <div key={k} style={{display:"flex",justifyContent:"space-between",padding:"6px 0",borderBottom:`1px solid ${C.lgray}`}}>
                    <span style={{...T.labelSm,color:C.gray,fontSize:9}}>{k}</span>
                    <span style={{...T.bodySm,color:C.black}}>{v}</span>
                  </div>
                ))}
              </div>
            </div>

            {(current.status==="reserved"||current.status==="sourcing")&&(
              <HoverBtn onClick={handleCancel} variant="danger" style={{padding:"10px 24px",fontSize:10}}>
                {L&&L.cancelOrder||"Cancel Order (Free)"}
              </HoverBtn>
            )}
          </div>
        )}
      </div>
      <Footer setPage={setPage} L={L} mobile={mobile}/>
    </div>
  );
}
