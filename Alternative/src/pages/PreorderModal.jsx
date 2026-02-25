import { useState } from 'react';
import { C, T } from '../constants/theme.js';
import { VIDEO_VERIFICATION_GEL } from '../constants/config.js';
import { IconCheck, IconVideo } from '../components/icons/Icons.jsx';
import HoverBtn from '../components/ui/HoverBtn.jsx';

// ── PREORDER MODAL ────────────────────────────────────────────────────────────
export default function PreorderModal({product:p,selectedSize,onClose,onComplete,setPage,L}) {
  const [step,setStep]=useState(1);
  const [form,setForm]=useState({name:"",phone:"",notes:""});
  const [wantVideo,setWantVideo]=useState(false);
  const [payMethod,setPayMethod]=useState("BOG");
  const [formError,setFormError]=useState("");
  const effectivePrice=p.sale||p.price;
  const totalPrice=effectivePrice;

  const handleNext=()=>{
    if (step===1){
      if (!form.name.trim()||!form.phone.trim()){setFormError(L&&L.enterNamePhone||'Enter name and WhatsApp.');return;}
      setFormError("");
      setStep(2);
    } else if (step===2){
      const orderId="ALT-2026-"+String(Math.floor(Math.random()*9000)+1000);
      onComplete({...p,orderId,status:"reserved",depositPaid:totalPrice,selectedSize,wantVideo,customerName:form.name,phone:form.phone});
      setStep(3);
    }
  };

  return (
    <div style={{position:"fixed",inset:0,zIndex:300,display:"flex"}}>
      <div onClick={onClose} style={{position:"absolute",inset:0,background:"rgba(25,25,25,0.75)"}}/>
      <div style={{position:"relative",marginLeft:"auto",width:"100%",maxWidth:500,background:C.cream,height:"100%",overflow:"auto",animation:"slideRight 0.3s ease",boxShadow:"-12px 0 50px rgba(0,0,0,0.2)"}}>
        <div style={{padding:"24px 32px",borderBottom:`1px solid ${C.lgray}`,display:"flex",justifyContent:"space-between",alignItems:"center",position:"sticky",top:0,background:C.cream,zIndex:2}}>
          <div>
            <p style={{...T.labelSm,color:C.tan,fontSize:9,marginBottom:4}}>Step {step} of 3</p>
            <p style={{...T.heading,color:C.black}}>{step===1?(L&&L.yourDetails||'Your Details'):step===2?(L&&L.reviewPay||'Review & Pay'):(L&&L.orderConfirmed||'Order Confirmed')}</p>
          </div>
          <button onClick={onClose} style={{background:"none",border:"none",color:C.gray,fontSize:22}}>×</button>
        </div>
        <div style={{display:"flex"}}>
          {[1,2,3].map(n=><div key={n} style={{flex:1,height:3,background:step>=n?C.tan:C.lgray,transition:"background 0.3s",marginRight:n<3?1:0}}/>)}
        </div>

        <div style={{padding:"28px 32px"}}>
          <div style={{display:"flex",gap:12,padding:14,background:C.offwhite,marginBottom:24}}>
            <img src={p.img} alt={p.name} style={{width:56,height:56,objectFit:"cover",flexShrink:0}}/>
            <div>
              <p style={{...T.heading,color:C.black,fontSize:13,marginBottom:2}}>{p.name}</p>
              <p style={{...T.labelSm,color:C.gray,fontSize:9,marginBottom:5}}>{p.color}{selectedSize&&selectedSize!=="One Size"?" · "+selectedSize:""}</p>
              <p style={{...T.bodySm,color:C.tan}}>GEL {effectivePrice} total</p>
            </div>
          </div>

          {step===1&&(
            <>
              <p style={{...T.label,color:C.black,fontSize:11,marginBottom:16}}>{L&&L.contactDetails||'Contact Details'}</p>
              {formError&&<p style={{...T.bodySm,color:C.red,marginBottom:14}}>{formError}</p>}
              {[[L&&L.fullName||"Full name *","name","text","Your full name"],[L&&L.whatsapp||"WhatsApp *","phone","tel","+995 5XX XXX XXX"],[L&&L.notes||"Notes","notes","text",L&&L.notesPlaceholder||"Notes…"]].map(([label,key,type,ph])=>(
                <div key={key} style={{marginBottom:16}}>
                  <label style={{...T.labelSm,color:C.gray,fontSize:9,display:"block",marginBottom:6}}>{label}</label>
                  <input type={type} placeholder={ph} value={form[key]} onChange={e=>setForm({...form,[key]:e.target.value})}
                    style={{width:"100%",padding:"12px 14px",border:`1px solid ${(key==="name"||key==="phone")&&formError&&!form[key].trim()?C.red:C.lgray}`,background:C.white,fontSize:14,color:C.black,outline:"none"}}/>
                </div>
              ))}
              <p style={{...T.labelSm,color:C.tan,fontSize:8,marginBottom:8,marginTop:8}}>VIDEO VERIFICATION</p>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                <button type="button" onClick={()=>setWantVideo(false)}
                  style={{padding:"14px 10px",background:!wantVideo?C.black:"transparent",border:`1.5px solid ${!wantVideo?C.black:C.lgray}`,cursor:"pointer",textAlign:"center",transition:"all 0.2s"}}>
                  <p style={{...T.label,fontSize:10,color:!wantVideo?C.white:C.black,marginBottom:2}}>Standard</p>
                  <p style={{fontFamily:"'Alido',serif",fontSize:16,color:!wantVideo?C.white:C.black}}>GEL {totalPrice}</p>
                </button>
                <button type="button" onClick={()=>setWantVideo(true)}
                  style={{padding:"14px 10px",background:wantVideo?C.black:"transparent",border:`1.5px solid ${wantVideo?C.tan:C.lgray}`,cursor:"pointer",textAlign:"center",position:"relative",transition:"all 0.2s"}}>
                  {<div style={{position:"absolute",top:-1,right:-1,background:C.tan,padding:"2px 8px"}}><span style={{...T.labelSm,color:C.white,fontSize:6}}>RECOMMENDED</span></div>}
                  <p style={{...T.label,fontSize:10,color:wantVideo?C.white:C.black,marginBottom:2,display:"flex",alignItems:"center",justifyContent:"center",gap:6}}>
                    <IconVideo size={12} color={wantVideo?C.white:C.black} stroke={1.6}/>
                    With Video
                  </p>
                  <p style={{fontFamily:"'Alido',serif",fontSize:16,color:wantVideo?C.white:C.black}}>GEL {totalPrice+VIDEO_VERIFICATION_GEL}</p>
                </button>
              </div>
            </>
          )}

          {step===2&&(
            <>
              <p style={{...T.label,color:C.black,fontSize:11,marginBottom:16}}>{L&&L.orderSummary||"Order Summary"}</p>
              {[
                [L&&L.item||"Item",p.name],[L&&L.size||"Size",selectedSize||"One Size"],[L&&L.leadTime||"Lead time",p.lead],
                [L&&L.depositNow||"Payment",`GEL ${totalPrice}`],
                ...(wantVideo?[[L&&L.videoVerif||"Video verification",`GEL ${VIDEO_VERIFICATION_GEL}`]]:[]),
                [L&&L.total||"Total",`GEL ${totalPrice+(wantVideo?VIDEO_VERIFICATION_GEL:0)}`],
              ].map(([k,v],i,arr)=>(
                <div key={k} style={{display:"flex",justifyContent:"space-between",padding:"9px 0",borderBottom:`1px solid ${C.lgray}`,fontWeight:i===arr.length-1?500:300}}>
                  <span style={{...T.labelSm,color:i===arr.length-1?C.black:C.gray,fontSize:9}}>{k}</span>
                  <span style={{...T.bodySm,color:i===arr.length-1?C.black:C.gray,fontWeight:i===arr.length-1?500:300}}>{v}</span>
                </div>
              ))}
              <div style={{padding:"14px 16px",background:C.offwhite,margin:"16px 0",borderLeft:`3px solid ${C.tan}`}}>
                <p style={{...T.bodySm,color:C.brown,lineHeight:1.7,fontSize:12}}>
                  {L&&L.refundNote||'Fully refundable if you cancel before shipping.'}{wantVideo?" Video will be sent to your WhatsApp before dispatch.":""}
                </p>
              </div>
              <p style={{...T.label,color:C.black,fontSize:11,marginBottom:12}}>{L&&L.paymentMethod||"Payment Method"}</p>
              {[["BOG",L&&L.bogTransfer||"BOG / TBC Bank Transfer",L&&L.recommended||"Recommended"],["card",L&&L.cardPayment||"Card Payment",""]].map(([v,m,tag])=>(
                <div key={v} onClick={()=>setPayMethod(v)} style={{display:"flex",alignItems:"center",gap:12,padding:12,border:`1px solid ${payMethod===v?C.tan:C.lgray}`,marginBottom:8,cursor:"pointer",transition:"border-color 0.2s"}}>
                  <div style={{width:14,height:14,borderRadius:"50%",border:`2px solid ${payMethod===v?C.tan:C.lgray}`,background:payMethod===v?C.tan:"transparent",transition:"all 0.2s",flexShrink:0}}/>
                  <span style={{...T.bodySm,color:C.black}}>{m}</span>
                  {tag&&<span style={{...T.labelSm,color:C.tan,fontSize:9,marginLeft:"auto"}}>{tag}</span>}
                </div>
              ))}
            </>
          )}

          {step===3&&(
            <div style={{textAlign:"center",padding:"16px 0"}}>
              <div style={{width:56,height:56,borderRadius:"50%",border:`2px solid ${C.tan}`,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 16px"}}>
                <IconCheck size={28} color={C.tan} stroke={2}/>
              </div>
              <h3 style={{fontFamily:"'Alido',serif",fontSize:28,fontWeight:300,color:C.black,marginBottom:12}}>{L&&L.orderConfirmed||"Order Confirmed"}</h3>
              <p style={{...T.body,color:C.gray,marginBottom:24,lineHeight:1.8}}>
{L&&L.contactNote||"We will contact you on WhatsApp at"} <strong>{form.phone}</strong> {L&&L.within2h||"within 2 hours."}
{wantVideo&&(L&&L.videoShipping||" Video will be sent before shipping.")}
              </p>
              <div style={{background:C.offwhite,padding:16,textAlign:"left",marginBottom:24}}>
                {[[L&&L.status||"Status",L&&L.processing||"Processing"],[L&&L.leadTime||"Lead time",p.lead],[L&&L.depositDue||"Amount due",`GEL ${totalPrice}`]].map(([k,v])=>(
                  <div key={k} style={{display:"flex",justifyContent:"space-between",padding:"7px 0",borderBottom:`1px solid ${C.lgray}`}}>
                    <span style={{...T.labelSm,color:C.gray,fontSize:9}}>{k}</span>
                    <span style={{...T.bodySm,color:C.black}}>{v}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <HoverBtn onClick={step===3?()=>{onClose();setPage&&setPage("orders");}:handleNext} variant="primary" style={{width:"100%",padding:"15px 24px"}}>
{step===1?(L&&L.reviewOrder||"Review Order →"):step===2?`${L&&L.confirmPay||"Confirm & Pay"} — GEL ${totalPrice+(wantVideo?VIDEO_VERIFICATION_GEL:0)}`:(L&&L.viewMyOrders||"View My Orders →")}
          </HoverBtn>
        </div>
      </div>
    </div>
  );
}
