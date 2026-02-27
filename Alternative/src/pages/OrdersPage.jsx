import { useState, useEffect } from 'react';
import { C, T } from '../constants/theme.js';
import { ORDER_STATUSES } from '../constants/data.js';
import HoverBtn from '../components/ui/HoverBtn.jsx';
import Footer from '../components/layout/Footer.jsx';

// ── ORDERS PAGE ───────────────────────────────────────────────────────────────
export default function OrdersPage({mobile,orders,setPage,toast,L}) {
  const allOrders = orders || [];
  const [activeIdx,setActiveIdx]=useState(0);

  useEffect(()=>{if(allOrders.length>0)setActiveIdx(0);},[allOrders.length]);

  const current=allOrders[activeIdx]||null;
  const si=current?ORDER_STATUSES.findIndex(s=>s.key===current.status):0;
  const labelMap={reserved:"statusReservedLabel",sourcing:"statusSourcingLabel",confirmed:"statusConfirmedLabel",shipped:"statusShippedLabel",delivered:"statusDeliveredLabel"};
  const descMap={reserved:"statusReservedDesc",sourcing:"statusSourcingDesc",confirmed:"statusConfirmedDesc",shipped:"statusShippedDesc",delivered:"statusDeliveredDesc"};
  const sLabel=(s)=>L[labelMap[s.key]]||s.label;
  const sDesc=(s)=>L[descMap[s.key]]||s.desc;

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
          <p style={{...T.bodySm,color:C.gray,marginBottom:28}}>{L&&L.noOrdersHint||"Items you purchase will appear here."}</p>
          <HoverBtn onClick={()=>setPage("catalog")} variant="primary">{L&&L.exploreCollection||"Explore Collection"}</HoverBtn>
        </div>
      </div>
    );
  }

  return (
    <div style={{paddingTop:mobile?52:80,minHeight:"100vh",background:C.cream}}>
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
        {/* Order list sidebar */}
        <div>
          {allOrders.map((o,idx)=>{
            const osi=ORDER_STATUSES.findIndex(s=>s.key===o.status);
            const isA=idx===activeIdx;
            const itemCount=o.items?o.items.length:1;
            const firstItem=o.items?o.items[0]:o;
            return (
              <div key={o.orderId} onClick={()=>setActiveIdx(idx)} style={{padding:16,marginBottom:2,cursor:"pointer",background:isA?C.offwhite:C.cream,border:isA?`1px solid ${C.tan}`:"1px solid transparent",transition:"all 0.2s"}}>
                <div style={{display:"flex",gap:12,alignItems:"flex-start"}}>
                  <img src={firstItem.img} alt={firstItem.name||"Order item"} loading="lazy" width="48" height="48" style={{width:48,height:48,objectFit:"cover",flexShrink:0}}/>
                  <div style={{flex:1,minWidth:0}}>
                    <p style={{...T.heading,color:C.black,fontSize:12,marginBottom:2,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>
                      {itemCount>1?`${itemCount} items`:firstItem.name}
                    </p>
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

        {/* Order detail */}
        {current&&(
          <div>
            {/* Status bar */}
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

            {/* Order items */}
            <div style={{marginBottom:24}}>
              <p style={{...T.labelSm,color:C.tan,fontSize:9,marginBottom:12}}>{current.orderId}</p>
              {(current.items||[current]).map((item,i)=>(
                <div key={i} style={{display:"flex",gap:16,padding:"14px 0",borderBottom:`1px solid ${C.lgray}`}}>
                  <img src={item.img} alt={item.name} loading="lazy" width="80" height="80" style={{width:mobile?64:80,height:mobile?64:80,objectFit:"cover",flexShrink:0}}/>
                  <div style={{flex:1}}>
                    {item.brand&&<p style={{...T.labelSm,color:C.tan,fontSize:8,letterSpacing:"0.12em",marginBottom:2}}>{item.brand}</p>}
                    <p style={{fontFamily:"'Alido',serif",fontSize:mobile?16:20,fontWeight:300,color:C.black,lineHeight:1.2,marginBottom:4}}>{item.name}</p>
                    <p style={{...T.bodySm,color:C.gray,fontSize:12}}>{item.color}{item.selectedSize&&item.selectedSize!=="One Size"?" · "+item.selectedSize:""}</p>
                    <p style={{fontFamily:"'Alido',serif",fontSize:16,color:item.sale?C.red:C.black,marginTop:6}}>GEL {item.sale||item.price}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Status info */}
            <div style={{padding:16,background:C.offwhite,borderLeft:`3px solid ${ORDER_STATUSES[si]?.color||C.tan}`,marginBottom:20}}>
              <p style={{...T.labelSm,color:ORDER_STATUSES[si]?.color||C.tan,marginBottom:5,fontSize:9}}>{L.currentStatus||"Current status"}</p>
              <p style={{...T.label,color:C.black,fontSize:11,marginBottom:4}}>{ORDER_STATUSES[si]?sLabel(ORDER_STATUSES[si]):""}</p>
              <p style={{...T.bodySm,color:C.gray,lineHeight:1.7,fontSize:12}}>{ORDER_STATUSES[si]?sDesc(ORDER_STATUSES[si]):""}</p>
            </div>

            {current.wantVideo&&(
              <div style={{padding:"10px 14px",background:`rgba(177,154,122,0.08)`,border:`1px solid ${C.tan}`,marginBottom:20}}>
                <p style={{...T.labelSm,color:C.tan,fontSize:9}}>{L.videoIncluded||"Video verification included — will be sent to WhatsApp before dispatch"}</p>
              </div>
            )}

            {/* Totals */}
            <div style={{marginBottom:20}}>
              {[
                [L?.total||"Total",`GEL ${current.total||0}`],
              ].map(([k,v])=>(
                <div key={k} style={{display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:`1px solid ${C.lgray}`}}>
                  <span style={{...T.label,color:C.black,fontSize:10}}>{k}</span>
                  <span style={{fontFamily:"'Alido',serif",fontSize:18,color:C.black}}>{v}</span>
                </div>
              ))}
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
