import { useState, useEffect } from 'react';
import { C, T } from '../../constants/theme.js';
import { VIDEO_VERIFICATION_GEL } from '../../constants/config.js';
import { IconCheck, IconVideo } from '../icons/Icons.jsx';
import HoverBtn from '../ui/HoverBtn.jsx';
import { api } from '../../api.js';

const ADDR_KEY = "alternative_addresses";
function loadAddresses() {
  try { const r = localStorage.getItem(ADDR_KEY); return r ? JSON.parse(r) : []; } catch { return []; }
}

// ── CHECKOUT MODAL (Farfetch-like) ───────────────────────────────────────────
export default function CheckoutModal({cart,user,L,onClose,setPage,onComplete,toast}) {
  const [step,setStep]=useState(1);
  const [wantVideo,setWantVideo]=useState(false);
  const [payMethod,setPayMethod]=useState("BOG");
  const [formError,setFormError]=useState("");
  const [submitting,setSubmitting]=useState(false);
  const [confirmedOrderId,setConfirmedOrderId]=useState("");

  useEffect(()=>{const fn=e=>{if(e.key==="Escape"&&step<3)onClose();};window.addEventListener("keydown",fn);return()=>window.removeEventListener("keydown",fn);},[onClose,step]);

  const subtotal=(cart||[]).reduce((s,o)=>s+((Number(o.sale)||Number(o.price)||0)*(o.qty||1)),0);
  const grandTotal=subtotal+(wantVideo?VIDEO_VERIFICATION_GEL:0);

  // Guest form
  const [guestForm,setGuestForm]=useState({firstName:"",lastName:"",email:"",phone:"",address:"",city:"",country:"Georgia",postal:"",notes:""});

  // Logged-in user
  const [savedAddresses]=useState(()=>user?loadAddresses():[]);
  const defaultAddr=savedAddresses.find(a=>a.isDefault)||savedAddresses[0]||null;
  const [selectedAddr,setSelectedAddr]=useState(defaultAddr);
  const [loggedNotes,setLoggedNotes]=useState("");
  const loggedPhone=selectedAddr?.phone||"";
  const loggedName=user?.name||"";
  const isGuest=!user;

  const handleNext=async()=>{
    if (step===1){
      if (isGuest) {
        if (!guestForm.firstName.trim()||!guestForm.lastName.trim()){setFormError(L?.fillRequired||"Please fill in all required fields.");return;}
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(guestForm.email)){setFormError(L?.validEmail||"Please enter a valid email address.");return;}
        if (!guestForm.phone.trim()||guestForm.phone.trim().length<5){setFormError(L?.enterPhone||"Please enter a valid phone number.");return;}
        if (!guestForm.address.trim()||!guestForm.city.trim()){setFormError(L?.enterAddress||"Please enter your shipping address.");return;}
      } else {
        if (!selectedAddr){setFormError(L?.selectAddress||"Please select or add a shipping address.");return;}
      }
      setFormError("");
      setStep(2);
    } else if (step===2){
      if (submitting) return;
      setSubmitting(true);
      const customerName=isGuest?`${guestForm.firstName} ${guestForm.lastName}`.trim():loggedName;
      const phone=isGuest?guestForm.phone:loggedPhone;
      const notes=isGuest?guestForm.notes:loggedNotes;
      const email=isGuest?guestForm.email:(user?.email||"");
      const shippingAddress=isGuest
        ?{address:guestForm.address,city:guestForm.city,country:guestForm.country,postal:guestForm.postal||""}
        :{address:selectedAddr?.line1||"",city:selectedAddr?.city||"",country:selectedAddr?.country||"Georgia",postal:selectedAddr?.postal||""};

      try {
        const orderIds=[];
        for (const item of cart) {
          const res = await api.createOrder({
            productId: item.id,
            productName: item.name,
            selectedSize: item.selectedSize||"One Size",
            wantVideo,
            customerName,
            phone,
            email,
            notes: wantVideo?notes:"",
            shippingAddress,
            price: Number(item.sale)||Number(item.price),
            depositPaid: Number(item.sale)||Number(item.price),
          });
          if(res.order?.orderId) orderIds.push(res.order.orderId);
        }
        setConfirmedOrderId(orderIds.join(", "));
        onComplete({ items: cart, total: grandTotal });
        setStep(3);
      } catch (err) {
        toast(L?.orderFailed||"Failed to place order. Please try again.","error");
      } finally {
        setSubmitting(false);
      }
    }
  };

  const inputStyle=(hasError)=>({width:"100%",padding:"12px 14px",border:`1px solid ${hasError?C.red:C.lgray}`,background:C.white,fontSize:14,color:C.black,outline:"none",fontFamily:"'TT Interphases Pro',sans-serif",transition:"border-color 0.2s"});
  const labelStyle={...T.labelSm,color:C.gray,fontSize:9,display:"block",marginBottom:6};

  return (
    <div role="dialog" aria-label={L?.checkout||"Checkout"} aria-modal="true" style={{position:"fixed",inset:0,zIndex:400,display:"flex"}}>
      <div onClick={onClose} style={{position:"absolute",inset:0,background:"rgba(25,25,25,0.75)"}}/>
      <div style={{position:"relative",marginLeft:"auto",width:"100%",maxWidth:520,background:C.cream,height:"100%",overflow:"auto",animation:"slideRight 0.3s ease",boxShadow:"-12px 0 50px rgba(0,0,0,0.2)"}}>
        {/* Header */}
        <div style={{padding:"24px 32px",borderBottom:`1px solid ${C.lgray}`,display:"flex",justifyContent:"space-between",alignItems:"center",position:"sticky",top:0,background:C.cream,zIndex:2}}>
          <div>
            <p style={{...T.labelSm,color:C.tan,fontSize:9,marginBottom:4}}>{L?.stepOf?`${String(L.stepOf).replace("{n}",step).replace("{t}","3")}`:`STEP ${step} OF 3`}</p>
            <p style={{...T.heading,color:C.black}}>{step===1?(L?.yourDetails||"Your Details"):step===2?(L?.reviewPay||"Review & Pay"):(L?.orderConfirmed||"Order Confirmed")}</p>
          </div>
          {step<3&&<button onClick={onClose} aria-label="Close" style={{background:"none",border:"none",color:C.gray,fontSize:22,cursor:"pointer",width:44,height:44,display:"flex",alignItems:"center",justifyContent:"center"}}>×</button>}
        </div>
        {/* Progress bar */}
        <div style={{display:"flex"}}>
          {[1,2,3].map(n=><div key={n} style={{flex:1,height:3,background:step>=n?C.tan:C.lgray,transition:"background 0.3s",marginRight:n<3?1:0}}/>)}
        </div>

        <div style={{padding:"28px 32px"}}>

          {/* ── Order items summary ── */}
          <div style={{marginBottom:24}}>
            <p style={{...T.labelSm,color:C.gray,fontSize:9,marginBottom:12}}>{cart.length} {cart.length===1?(L?.itemInBag||"ITEM"):(L?.itemsInBag||"ITEMS")}</p>
            {cart.map((o,i)=>(
              <div key={o.addedAt||i} style={{display:"flex",gap:12,padding:"10px 0",borderBottom:i<cart.length-1?`1px solid ${C.lgray}`:"none"}}>
                <img src={o.img} alt={o.name} loading="lazy" width="48" height="48" style={{width:48,height:48,objectFit:"cover",flexShrink:0}}/>
                <div style={{flex:1,minWidth:0}}>
                  <p style={{...T.heading,color:C.black,fontSize:12,marginBottom:2,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{L?.localNames?.[o.name]||o.name}</p>
                  <p style={{...T.labelSm,color:C.gray,fontSize:9}}>{o.color}{o.selectedSize&&o.selectedSize!=="One Size"?" · "+o.selectedSize:""}</p>
                  {o.notes&&<p style={{...T.bodySm,color:C.brown,fontSize:9,fontStyle:"italic",marginTop:3}}>"{o.notes}"</p>}
                </div>
                <span style={{fontFamily:"'Alido',serif",fontSize:14,color:o.sale?C.red:C.black,flexShrink:0}}>GEL {o.sale||o.price}</span>
              </div>
            ))}
            <div style={{display:"flex",justifyContent:"space-between",padding:"12px 0",borderTop:`1px solid ${C.lgray}`,marginTop:4}}>
              <span style={{...T.label,color:C.black,fontSize:10}}>{L?.subtotal||"SUBTOTAL"}</span>
              <span style={{fontFamily:"'Alido',serif",fontSize:18,color:C.black}}>GEL {subtotal}</span>
            </div>
          </div>

          {/* ── STEP 1: DETAILS ── */}
          {step===1&&(
            <>
              {/* Logged-in user — quick checkout */}
              {!isGuest&&(
                <>
                  <div style={{padding:"16px 18px",background:C.offwhite,marginBottom:20,display:"flex",alignItems:"center",gap:12}}>
                    <div style={{width:36,height:36,borderRadius:"50%",background:C.tan,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.white} strokeWidth="2"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
                    </div>
                    <div>
                      <p style={{...T.heading,color:C.black,fontSize:13}}>{user.name}</p>
                      <p style={{...T.bodySm,color:C.gray,fontSize:11}}>{user.email}</p>
                    </div>
                    <div style={{marginLeft:"auto"}}><IconCheck size={16} color={C.tan} stroke={2}/></div>
                  </div>

                  <p style={{...T.label,color:C.black,fontSize:11,marginBottom:12}}>{L?.shippingAddress||"SHIPPING ADDRESS"}</p>
                  {formError&&<p style={{...T.bodySm,color:C.red,marginBottom:14}}>{formError}</p>}

                  {savedAddresses.length>0?(
                    <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:20}}>
                      {savedAddresses.map((addr,i)=>(
                        <div key={addr.id||i} onClick={()=>setSelectedAddr(addr)}
                          style={{padding:"14px 16px",border:`1.5px solid ${selectedAddr?.id===addr.id?C.tan:C.lgray}`,background:selectedAddr?.id===addr.id?"rgba(177,154,122,0.04)":"transparent",cursor:"pointer",transition:"all 0.2s"}}>
                          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
                            <p style={{...T.heading,color:C.black,fontSize:12}}>{addr.name}{addr.isDefault&&<span style={{...T.labelSm,color:C.tan,fontSize:8,marginLeft:8}}>DEFAULT</span>}</p>
                            <div style={{width:16,height:16,borderRadius:"50%",border:`2px solid ${selectedAddr?.id===addr.id?C.tan:C.lgray}`,background:selectedAddr?.id===addr.id?C.tan:"transparent",display:"flex",alignItems:"center",justifyContent:"center",transition:"all 0.2s"}}>
                              {selectedAddr?.id===addr.id&&<div style={{width:6,height:6,borderRadius:"50%",background:C.white}}/>}
                            </div>
                          </div>
                          <p style={{...T.bodySm,color:C.gray,fontSize:11,lineHeight:1.5}}>{addr.line1}{addr.line2?", "+addr.line2:""}</p>
                          <p style={{...T.bodySm,color:C.gray,fontSize:11}}>{addr.city}{addr.postal?", "+addr.postal:""} · {addr.country}</p>
                          {addr.phone&&<p style={{...T.bodySm,color:C.gray,fontSize:11,marginTop:2}}>{addr.phone}</p>}
                        </div>
                      ))}
                    </div>
                  ):(
                    <div style={{padding:"20px 16px",border:`1px dashed ${C.lgray}`,textAlign:"center",marginBottom:20}}>
                      <p style={{...T.bodySm,color:C.gray,marginBottom:10}}>{L?.noSavedAddresses||"No saved addresses"}</p>
                      <HoverBtn onClick={()=>{onClose();setPage("account");}} variant="secondary" style={{padding:"10px 20px",fontSize:11}}>
                        {L?.addInAccount||"Add Address in Account"}
                      </HoverBtn>
                    </div>
                  )}

                </>
              )}

              {/* Guest checkout — full form */}
              {isGuest&&(
                <>
                  <div style={{padding:"14px 18px",background:"rgba(177,154,122,0.06)",border:`1px solid rgba(177,154,122,0.15)`,marginBottom:20,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                    <p style={{...T.bodySm,color:C.brown,fontSize:12}}>{L?.haveAccount||"Already have an account?"}</p>
                    <button onClick={()=>{onClose();setPage("auth");}} style={{background:"none",border:"none",...T.label,color:C.tan,fontSize:11,cursor:"pointer",textDecoration:"underline"}}>{L?.signInBtn||"Sign In"}</button>
                  </div>

                  <p style={{...T.label,color:C.black,fontSize:11,marginBottom:16}}>{L?.contactDetails||"CONTACT DETAILS"}</p>
                  {formError&&<p style={{...T.bodySm,color:C.red,marginBottom:14}}>{formError}</p>}

                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:0}}>
                    <div style={{marginBottom:16}}>
                      <label style={labelStyle}>{L?.firstName||"FIRST NAME"} *</label>
                      <input type="text" placeholder="Nino" value={guestForm.firstName} onChange={e=>setGuestForm({...guestForm,firstName:e.target.value})} style={inputStyle(formError&&!guestForm.firstName.trim())}/>
                    </div>
                    <div style={{marginBottom:16}}>
                      <label style={labelStyle}>{L?.lastName||"LAST NAME"} *</label>
                      <input type="text" placeholder="Gogishvili" value={guestForm.lastName} onChange={e=>setGuestForm({...guestForm,lastName:e.target.value})} style={inputStyle(formError&&!guestForm.lastName.trim())}/>
                    </div>
                  </div>

                  <div style={{marginBottom:16}}>
                    <label style={labelStyle}>{L?.emailAddress||"EMAIL ADDRESS"} *</label>
                    <input type="email" placeholder="nino@example.com" value={guestForm.email} onChange={e=>setGuestForm({...guestForm,email:e.target.value})} style={inputStyle(formError&&!guestForm.email.includes("@"))}/>
                  </div>

                  <div style={{marginBottom:16}}>
                    <label style={labelStyle}>{L?.whatsapp||"WHATSAPP NUMBER"} *</label>
                    <input type="tel" placeholder="+995 5XX XXX XXX" value={guestForm.phone} onChange={e=>setGuestForm({...guestForm,phone:e.target.value})} style={inputStyle(formError&&!guestForm.phone.trim())}/>
                  </div>

                  <p style={{...T.label,color:C.black,fontSize:11,marginBottom:16,marginTop:8}}>{L?.shippingAddress||"SHIPPING ADDRESS"}</p>

                  <div style={{marginBottom:16}}>
                    <label style={labelStyle}>{L?.addressLine||"ADDRESS"} *</label>
                    <input type="text" placeholder={L?.addressPlaceholder||"Street address, apartment, floor"} value={guestForm.address} onChange={e=>setGuestForm({...guestForm,address:e.target.value})} style={inputStyle(formError&&!guestForm.address.trim())}/>
                  </div>

                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
                    <div style={{marginBottom:16}}>
                      <label style={labelStyle}>{L?.city||"CITY"} *</label>
                      <input type="text" placeholder="Tbilisi" value={guestForm.city} onChange={e=>setGuestForm({...guestForm,city:e.target.value})} style={inputStyle(formError&&!guestForm.city.trim())}/>
                    </div>
                    <div style={{marginBottom:16}}>
                      <label style={labelStyle}>{L?.postalCode||"POSTAL CODE"}</label>
                      <input type="text" placeholder="0100" value={guestForm.postal} onChange={e=>setGuestForm({...guestForm,postal:e.target.value})} style={inputStyle(false)}/>
                    </div>
                  </div>

                  <div style={{marginBottom:16}}>
                    <label style={labelStyle}>{L?.country||"COUNTRY"}</label>
                    <select value={guestForm.country} onChange={e=>setGuestForm({...guestForm,country:e.target.value})} style={{...inputStyle(false),cursor:"pointer",appearance:"auto"}}>
                      {["Georgia","Turkey","Armenia","Azerbaijan","Russia","USA","Germany","France","UK","Italy","Other"].map(c=><option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>

                </>
              )}

              {/* Video verification option */}
              <p style={{...T.labelSm,color:C.tan,fontSize:8,marginBottom:8,marginTop:8}}>VIDEO VERIFICATION</p>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:20}}>
                <button type="button" onClick={()=>setWantVideo(false)}
                  style={{padding:"14px 10px",background:!wantVideo?C.black:"transparent",border:`1.5px solid ${!wantVideo?C.black:C.lgray}`,cursor:"pointer",textAlign:"center",transition:"all 0.2s"}}>
                  <p style={{...T.label,fontSize:10,color:!wantVideo?C.white:C.black,marginBottom:2}}>Standard</p>
                  <p style={{fontFamily:"'Alido',serif",fontSize:16,color:!wantVideo?C.white:C.black}}>GEL {subtotal}</p>
                </button>
                <button type="button" onClick={()=>setWantVideo(true)}
                  style={{padding:"14px 10px",background:wantVideo?C.black:"transparent",border:`1.5px solid ${wantVideo?C.tan:C.lgray}`,cursor:"pointer",textAlign:"center",position:"relative",transition:"all 0.2s"}}>
                  <div style={{position:"absolute",top:-1,right:-1,background:C.tan,padding:"2px 8px"}}><span style={{...T.labelSm,color:C.white,fontSize:6}}>RECOMMENDED</span></div>
                  <p style={{...T.label,fontSize:10,color:wantVideo?C.white:C.black,marginBottom:2,display:"flex",alignItems:"center",justifyContent:"center",gap:6}}>
                    <IconVideo size={12} color={wantVideo?C.white:C.black} stroke={1.6}/>
                    With Video
                  </p>
                  <p style={{fontFamily:"'Alido',serif",fontSize:16,color:wantVideo?C.white:C.black}}>GEL {subtotal+VIDEO_VERIFICATION_GEL}</p>
                </button>
              </div>

              {/* Notes — only when video verification is selected */}
              {wantVideo&&(
                <div style={{marginTop:16}}>
                  <label style={labelStyle}>{L?.videoNotes||"WHAT WOULD YOU LIKE TO SEE IN THE VIDEO?"}</label>
                  <input type="text" placeholder={L?.videoNotesPlaceholder||"e.g. Show stitching details, check hardware color, try on wrist..."} value={isGuest?guestForm.notes:loggedNotes} onChange={e=>isGuest?setGuestForm({...guestForm,notes:e.target.value}):setLoggedNotes(e.target.value)} style={inputStyle(false)} maxLength={300}/>
                  <p style={{...T.labelSm,color:C.gray,fontSize:8,marginTop:4}}>{L?.videoNotesHint||"Our team will cover these points in your personalized video"}</p>
                </div>
              )}
            </>
          )}

          {/* ── STEP 2: REVIEW & PAY ── */}
          {step===2&&(
            <>
              <p style={{...T.label,color:C.black,fontSize:11,marginBottom:16}}>{L?.orderSummary||"ORDER SUMMARY"}</p>
              {cart.map((o,i)=>(
                <div key={i} style={{display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:`1px solid ${C.lgray}`}}>
                  <span style={{...T.bodySm,color:C.gray,fontSize:12}}>{L?.localNames?.[o.name]||o.name} {o.selectedSize&&o.selectedSize!=="One Size"?`(${o.selectedSize})`:""}</span>
                  <span style={{...T.bodySm,color:C.black}}>GEL {o.sale||o.price}</span>
                </div>
              ))}
              {wantVideo&&(
                <div style={{display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:`1px solid ${C.lgray}`}}>
                  <span style={{...T.bodySm,color:C.gray,fontSize:12}}>{L?.videoVerif||"Video Verification"}</span>
                  <span style={{...T.bodySm,color:C.black}}>GEL {VIDEO_VERIFICATION_GEL}</span>
                </div>
              )}
              <div style={{display:"flex",justifyContent:"space-between",padding:"12px 0",borderBottom:`2px solid ${C.black}`}}>
                <span style={{...T.label,color:C.black,fontSize:11}}>{L?.total||"TOTAL"}</span>
                <span style={{fontFamily:"'Alido',serif",fontSize:22,color:C.black}}>GEL {grandTotal}</span>
              </div>

              {/* Shipping info */}
              <div style={{marginTop:20,marginBottom:16}}>
                <p style={{...T.label,color:C.black,fontSize:11,marginBottom:12}}>{L?.shippingTo||"SHIPPING TO"}</p>
                <div style={{padding:"14px 16px",background:C.offwhite}}>
                  <p style={{...T.heading,color:C.black,fontSize:12,marginBottom:4}}>{isGuest?`${guestForm.firstName} ${guestForm.lastName}`:loggedName}</p>
                  <p style={{...T.bodySm,color:C.gray,fontSize:11,lineHeight:1.6}}>
                    {isGuest?guestForm.address:selectedAddr?.line1}<br/>
                    {isGuest?`${guestForm.city}${guestForm.postal?", "+guestForm.postal:""} · ${guestForm.country}`:`${selectedAddr?.city||""}${selectedAddr?.postal?", "+selectedAddr.postal:""} · ${selectedAddr?.country||""}`}
                  </p>
                  <p style={{...T.bodySm,color:C.gray,fontSize:11,marginTop:4}}>{isGuest?guestForm.phone:loggedPhone}</p>
                </div>
                <button onClick={()=>setStep(1)} style={{background:"none",border:"none",...T.labelSm,color:C.tan,fontSize:9,cursor:"pointer",marginTop:8,textDecoration:"underline"}}>{L?.editDetails||"Edit details"}</button>
              </div>

              <div style={{padding:"14px 16px",background:C.offwhite,margin:"0 0 16px",borderLeft:`3px solid ${C.tan}`}}>
                <p style={{...T.bodySm,color:C.brown,lineHeight:1.7,fontSize:12}}>
                  {L?.refundNote||"Fully refundable if you cancel before shipping."}{wantVideo?" Video will be sent to your WhatsApp before dispatch.":""}
                </p>
              </div>

              <p style={{...T.label,color:C.black,fontSize:11,marginBottom:12}}>{L?.paymentMethod||"PAYMENT METHOD"}</p>
              {[["BOG",L?.bogTransfer||"BOG / TBC Bank Transfer",L?.recommended||"Recommended"],["card",L?.cardPayment||"Card Payment",""]].map(([v,m,tag])=>(
                <div key={v} onClick={()=>setPayMethod(v)} style={{display:"flex",alignItems:"center",gap:12,padding:12,border:`1px solid ${payMethod===v?C.tan:C.lgray}`,marginBottom:8,cursor:"pointer",transition:"border-color 0.2s"}}>
                  <div style={{width:14,height:14,borderRadius:"50%",border:`2px solid ${payMethod===v?C.tan:C.lgray}`,background:payMethod===v?C.tan:"transparent",transition:"all 0.2s",flexShrink:0}}/>
                  <span style={{...T.bodySm,color:C.black}}>{m}</span>
                  {tag&&<span style={{...T.labelSm,color:C.tan,fontSize:9,marginLeft:"auto"}}>{tag}</span>}
                </div>
              ))}
            </>
          )}

          {/* ── STEP 3: THANK YOU ── */}
          {step===3&&(
            <div style={{textAlign:"center",padding:"24px 0"}}>
              <div style={{width:72,height:72,borderRadius:"50%",background:"rgba(177,154,122,0.1)",border:`2px solid ${C.tan}`,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 20px",animation:"fadeUp 0.4s ease"}}>
                <IconCheck size={32} color={C.tan} stroke={2}/>
              </div>
              <p style={{...T.labelSm,color:C.tan,fontSize:9,letterSpacing:"0.2em",marginBottom:8}}>{L?.thankYou||"THANK YOU FOR YOUR ORDER"}</p>
              <h3 style={{fontFamily:"'Alido',serif",fontSize:32,fontWeight:300,color:C.black,marginBottom:8}}>{L?.orderConfirmed||"Order Confirmed"}</h3>
              {confirmedOrderId&&<p style={{...T.labelSm,color:C.gray,fontSize:10,marginBottom:16}}>{confirmedOrderId}</p>}
              <p style={{...T.body,color:C.gray,marginBottom:28,lineHeight:1.8,maxWidth:340,margin:"0 auto 28px"}}>
                {L?.contactNote||"We will contact you on WhatsApp at"} <strong style={{color:C.black}}>{isGuest?guestForm.phone:loggedPhone}</strong> {L?.within2h||"within 2 hours to confirm your order."}
              </p>

              <div style={{background:C.offwhite,padding:"20px 24px",textAlign:"left",marginBottom:20}}>
                {[[L?.itemCount||"Items",`${cart.length} ${cart.length===1?"item":"items"}`],[L?.total||"Total",`GEL ${grandTotal}`],[L?.paymentMethod||"Payment",payMethod==="BOG"?"Bank Transfer":"Card"],[L?.status||"Status",L?.processing||"Processing"]].map(([k,v],i)=>(
                  <div key={k} style={{display:"flex",justifyContent:"space-between",padding:"10px 0",borderBottom:i<3?`1px solid ${C.lgray}`:"none"}}>
                    <span style={{...T.labelSm,color:C.gray,fontSize:10}}>{k}</span>
                    <span style={{...T.bodySm,color:C.black,fontWeight:500}}>{v}</span>
                  </div>
                ))}
              </div>

              {wantVideo&&(
                <div style={{padding:"14px 18px",background:"rgba(177,154,122,0.06)",border:`1px solid rgba(177,154,122,0.15)`,marginBottom:20,textAlign:"left"}}>
                  <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}>
                    <IconVideo size={14} color={C.tan} stroke={1.6}/>
                    <span style={{...T.label,color:C.tan,fontSize:10}}>{L?.videoIncluded||"Video Verification Included"}</span>
                  </div>
                  <p style={{...T.bodySm,color:C.gray,fontSize:11,lineHeight:1.6}}>{L?.videoConfirmNote||"You'll receive a personalized video on WhatsApp before we ship."}</p>
                </div>
              )}

              <div style={{padding:"14px 18px",background:C.offwhite,textAlign:"left"}}>
                <p style={{...T.bodySm,color:C.gray,fontSize:11,lineHeight:1.7}}>
                  {L?.whatsNext||"What happens next: Our team will verify availability, confirm pricing, and reach out to you on WhatsApp to finalize your order."}
                </p>
              </div>
            </div>
          )}

          {/* Action button */}
          <HoverBtn onClick={step===3?()=>{onClose();setPage("orders");}:handleNext} variant="primary" style={{width:"100%",padding:"15px 24px",opacity:submitting?0.7:1,pointerEvents:submitting?"none":"auto"}} disabled={submitting}>
            {submitting?(L?.placingOrder||"Placing Order...")
              :step===1?(L?.reviewOrder||"Review Order")
              :step===2?`${L?.confirmPay||"Confirm & Pay"} — GEL ${grandTotal}`
              :(L?.viewMyOrders||"View My Orders")}
          </HoverBtn>

          {step===2&&(
            <button onClick={()=>setStep(1)} style={{width:"100%",background:"none",border:"none",...T.labelSm,color:C.gray,fontSize:10,padding:"12px 0",cursor:"pointer"}}>{L?.backToDetails||"Back to details"}</button>
          )}

          {step===1&&isGuest&&(
            <p style={{...T.bodySm,color:C.gray,fontSize:10,textAlign:"center",marginTop:14,lineHeight:1.6}}>
              {L?.checkoutDisclaimer||"By placing an order you agree to our"} <button onClick={()=>{onClose();setPage("terms");}} style={{background:"none",border:"none",color:C.tan,fontSize:10,cursor:"pointer",textDecoration:"underline",padding:0,fontFamily:"inherit"}}>{L?.termsLink||"Terms & Conditions"}</button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
