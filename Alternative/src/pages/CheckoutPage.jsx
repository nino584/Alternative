import { useState, useEffect } from 'react';
import { C, T } from '../constants/theme.js';
import { VIDEO_VERIFICATION_GEL } from '../constants/config.js';
import { IconCheck, IconVideo } from '../components/icons/Icons.jsx';
import { Logo } from '../components/layout/Logo.jsx';
import HoverBtn from '../components/ui/HoverBtn.jsx';
import { api } from '../api.js';

const ADDR_KEY = "alternative_addresses";
function loadAddresses() {
  try { const r = localStorage.getItem(ADDR_KEY); return r ? JSON.parse(r) : []; } catch { return []; }
}

// ── LUXURY FULL-PAGE CHECKOUT ────────────────────────────────────────────────
export default function CheckoutPage({cart,user,L,setPage,onComplete,toast,mobile}) {
  const [step,setStep]=useState(1);
  const [wantVideo,setWantVideo]=useState(false);
  const [payMethod,setPayMethod]=useState("BOG");
  const [formError,setFormError]=useState("");
  const [submitting,setSubmitting]=useState(false);
  const [confirmedOrderId,setConfirmedOrderId]=useState("");
  const [confirmedItems,setConfirmedItems]=useState([]);
  const [confirmedTotal,setConfirmedTotal]=useState(0);

  // Redirect if cart is empty (unless on thank you step or just submitted)
  useEffect(()=>{
    if ((!cart||cart.length===0)&&step!==3&&confirmedItems.length===0) setPage("catalog");
  },[cart,step,setPage,confirmedItems.length]);

  // Guest form
  const [promoCode,setPromoCode]=useState("");
  const [promoApplied,setPromoApplied]=useState(null); // {code, discount, type}
  const [promoError,setPromoError]=useState("");
  const [promoLoading,setPromoLoading]=useState(false);

  const applyPromo=()=>{
    if(!promoCode.trim())return;
    setPromoLoading(true);setPromoError("");
    api.validatePromo(promoCode.trim(),subtotal)
      .then(res=>{setPromoApplied({code:res.code,discount:res.discount,type:res.type||"fixed"});setPromoError("");})
      .catch(err=>{setPromoError(err.message||L?.invalidPromo||"Invalid promo code");setPromoApplied(null);})
      .finally(()=>setPromoLoading(false));
  };
  const removePromo=()=>{setPromoApplied(null);setPromoCode("");setPromoError("");};

  const promoDiscount=promoApplied?promoApplied.discount:0;
  const subtotal=(cart||[]).reduce((s,o)=>s+((Number(o.sale)||Number(o.price)||0)*(o.qty||1)),0);
  const videoFee=wantVideo?VIDEO_VERIFICATION_GEL:0;
  const grandTotal=Math.max(0,subtotal+videoFee-promoDiscount);
  const [gf,setGf]=useState({firstName:"",lastName:"",email:"",phone:"",address:"",city:"",country:"Georgia",postal:"",notes:""});
  const gu=(k,v)=>setGf(p=>({...p,[k]:v}));

  // Logged-in
  const [savedAddresses]=useState(()=>user?loadAddresses():[]);
  const defaultAddr=savedAddresses.find(a=>a.isDefault)||savedAddresses[0]||null;
  const [selectedAddr,setSelectedAddr]=useState(defaultAddr);
  const [loggedNotes,setLoggedNotes]=useState("");
  const isGuest=!user;

  const handleNext=async()=>{
    if (step===1){
      if (isGuest) {
        if (!gf.firstName.trim()||!gf.lastName.trim()){setFormError(L?.fillRequired||"Please fill in all required fields.");return;}
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(gf.email)){setFormError(L?.validEmail||"Please enter a valid email.");return;}
        if (!gf.phone.trim()||gf.phone.trim().length<5){setFormError(L?.enterPhone||"Please enter a valid phone.");return;}
        if (!gf.address.trim()||!gf.city.trim()){setFormError(L?.enterAddress||"Please enter your shipping address.");return;}
      } else {
        if (!selectedAddr){setFormError(L?.selectAddress||"Please select or add a shipping address.");return;}
      }
      setFormError("");setStep(2);
    } else if (step===2){
      if (submitting) return;
      setSubmitting(true);
      const customerName=isGuest?`${gf.firstName} ${gf.lastName}`.trim():user?.name||"";
      const phone=isGuest?gf.phone:(selectedAddr?.phone||"");
      const notes=isGuest?gf.notes:loggedNotes;
      const email=isGuest?gf.email:(user?.email||"");
      const shippingAddress=isGuest
        ?{address:gf.address,city:gf.city,country:gf.country,postal:gf.postal||""}
        :{address:selectedAddr?.line1||"",city:selectedAddr?.city||"",country:selectedAddr?.country||"Georgia",postal:selectedAddr?.postal||""};
      try {
        const orderIds=[];
        for (const item of cart) {
          const affiliateCode=localStorage.getItem('affiliate_ref')||'';
          const res = await api.createOrder({
            productId:item.id, productName:item.name, selectedSize:item.selectedSize||"One Size",
            img:(item.img && !item.img.startsWith('data:')) ? item.img : "", brand:item.brand||"", color:item.color||"",
            wantVideo, customerName, phone, email, notes:wantVideo?notes:"", shippingAddress,
            price:Number(item.sale)||Number(item.price), depositPaid:Number(item.sale)||Number(item.price),
            payMethod, affiliateCode, promoCode:promoApplied?.code||"",
          });
          if(res.order?.orderId) orderIds.push(res.order.orderId);
        }
        localStorage.removeItem('affiliate_ref');
        if(promoApplied) setPromoApplied(null);
        setConfirmedOrderId(orderIds.join(", "));
        setConfirmedItems([...cart]);
        setConfirmedTotal(grandTotal);
        setStep(3);
        onComplete({items:cart,total:grandTotal});
        window.scrollTo({top:0,behavior:"smooth"});
      } catch {
        toast(L?.orderFailed||"Failed to place order. Please try again.","error");
      } finally {
        setSubmitting(false);
      }
    }
  };

  const inputStyle=(err)=>({width:"100%",padding:"14px 16px",border:`1px solid ${err?C.red:"rgba(200,200,190,0.5)"}`,background:C.white,fontSize:14,color:C.black,outline:"none",fontFamily:"'TT Interphases Pro',sans-serif",transition:"border-color 0.2s"});
  const labelStyle={...T.labelSm,color:C.gray,fontSize:9,display:"block",marginBottom:6,letterSpacing:"0.08em"};

  // ── STEP 3: THANK YOU (FULL PAGE) ──
  if (step===3) return (
    <div style={{minHeight:"100vh",background:C.cream,display:"flex",flexDirection:"column"}}>
      <style>{`@keyframes thankFade{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}} @keyframes checkPop{0%{transform:scale(0)}60%{transform:scale(1.2)}100%{transform:scale(1)}}`}</style>
      {/* Minimal header */}
      <div style={{padding:"24px 0",borderBottom:`1px solid ${C.lgray}`,background:C.white}}>
        <div style={{maxWidth:800,margin:"0 auto",textAlign:"center",padding:"0 20px"}}>
          <Logo size={0.7}/>
        </div>
      </div>

      <div style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",padding:mobile?"32px 16px":"60px 20px"}}>
        <div style={{maxWidth:560,width:"100%",animation:"thankFade 0.6s ease"}}>
          {/* Check icon */}
          <div style={{textAlign:"center",marginBottom:32}}>
            <div style={{width:88,height:88,borderRadius:"50%",background:"rgba(177,154,122,0.08)",border:`2px solid ${C.tan}`,display:"inline-flex",alignItems:"center",justifyContent:"center",animation:"checkPop 0.5s ease 0.2s both"}}>
              <IconCheck size={40} color={C.tan} stroke={2}/>
            </div>
          </div>

          <div style={{textAlign:"center",marginBottom:36}}>
            <p style={{...T.labelSm,color:C.tan,fontSize:10,letterSpacing:"0.25em",marginBottom:10}}>{L?.thankYou||"THANK YOU FOR YOUR ORDER"}</p>
            <h1 style={{fontFamily:"'Alido',serif",fontSize:mobile?32:42,fontWeight:300,color:C.black,marginBottom:10}}>{L?.orderConfirmed||"Order Confirmed"}</h1>
            {confirmedOrderId&&<p style={{...T.bodySm,color:C.gray,fontSize:13,marginBottom:6}}>Order {confirmedOrderId}</p>}
            <p style={{...T.bodySm,color:C.gray,fontSize:14,lineHeight:1.7,maxWidth:400,margin:"0 auto"}}>
              {L?.confirmEmailSent||"A confirmation email has been sent to"} <strong style={{color:C.black}}>{isGuest?gf.email:user?.email}</strong>
            </p>
          </div>

          {/* Order details card */}
          <div style={{background:C.white,padding:mobile?"24px 20px":"32px 28px",marginBottom:20}}>
            <p style={{...T.labelSm,color:C.tan,fontSize:9,letterSpacing:"0.15em",marginBottom:16}}>{L?.orderSummary||"ORDER SUMMARY"}</p>
            {confirmedItems.map((o,i)=>(
              <div key={i} style={{display:"flex",gap:14,padding:"14px 0",borderBottom:i<confirmedItems.length-1?`1px solid rgba(200,200,190,0.3)`:"none"}}>
                <img src={o.img} alt={o.name} width="64" height="64" style={{width:64,height:64,objectFit:"cover",flexShrink:0,background:"#f5f5f3"}}/>
                <div style={{flex:1,minWidth:0}}>
                  <p style={{...T.labelSm,color:C.tan,fontSize:8,letterSpacing:"0.1em"}}>{o.brand}</p>
                  <p style={{...T.heading,color:C.black,fontSize:13,marginBottom:2}}>{L?.localNames?.[o.name]||o.name}</p>
                  <p style={{...T.bodySm,color:C.gray,fontSize:11}}>{o.color}{o.selectedSize&&o.selectedSize!=="One Size"?" · "+o.selectedSize:""}</p>
                </div>
                <span style={{fontFamily:"'Alido',serif",fontSize:15,color:o.sale?C.red:C.black,flexShrink:0}}>GEL {o.sale||o.price}</span>
              </div>
            ))}
            <div style={{borderTop:`1px solid ${C.lgray}`,marginTop:14,paddingTop:14}}>
              {wantVideo&&(
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
                  <span style={{...T.bodySm,color:C.gray,fontSize:12}}>{L?.videoVerif||"Video Verification"}</span>
                  <span style={{...T.bodySm,color:C.black,fontSize:12}}>GEL {VIDEO_VERIFICATION_GEL}</span>
                </div>
              )}
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline"}}>
                <span style={{...T.label,color:C.black,fontSize:11}}>{L?.total||"TOTAL"}</span>
                <span style={{fontFamily:"'Alido',serif",fontSize:26,color:C.black}}>GEL {confirmedTotal}</span>
              </div>
            </div>
          </div>

          {/* Next steps */}
          <div style={{background:C.white,padding:mobile?"24px 20px":"28px 28px",marginBottom:20}}>
            <p style={{...T.labelSm,color:C.tan,fontSize:9,letterSpacing:"0.15em",marginBottom:16}}>{L?.whatHappensNext||"WHAT HAPPENS NEXT"}</p>
            {[
              {icon:"1",title:L?.step1Title||"Order Verification",desc:L?.step1Desc||"Our team verifies availability with our supplier network"},
              {icon:"2",title:L?.step2Title||"WhatsApp Confirmation",desc:L?.step2Desc||"We'll reach out within 2 hours to confirm your order"},
              {icon:"3",title:wantVideo?(L?.step3VideoTitle||"Video Verification"):(L?.step3Title||"Sourcing & Shipping"),desc:wantVideo?(L?.step3VideoDesc||"You'll receive a personalized video before we ship"):(L?.step3Desc||"Item sourced and shipped to Tbilisi in 10-18 days")},
            ].map((s,i)=>(
              <div key={i} style={{display:"flex",gap:14,padding:"12px 0",borderBottom:i<2?`1px solid rgba(200,200,190,0.2)`:"none"}}>
                <span style={{width:28,height:28,borderRadius:"50%",background:C.black,color:C.white,display:"flex",alignItems:"center",justifyContent:"center",...T.labelSm,fontSize:10,flexShrink:0}}>{s.icon}</span>
                <div>
                  <p style={{...T.heading,color:C.black,fontSize:12,marginBottom:2}}>{s.title}</p>
                  <p style={{...T.bodySm,color:C.gray,fontSize:12,lineHeight:1.6}}>{s.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {wantVideo&&(
            <div style={{padding:"16px 20px",background:"rgba(177,154,122,0.06)",border:`1px solid rgba(177,154,122,0.15)`,marginBottom:20,display:"flex",alignItems:"center",gap:12}}>
              <IconVideo size={18} color={C.tan} stroke={1.6}/>
              <p style={{...T.bodySm,color:C.brown,fontSize:12,lineHeight:1.5}}>{L?.videoConfirmNote||"You'll receive a personalized video on WhatsApp before we ship."}</p>
            </div>
          )}

          <div style={{display:"flex",gap:12,flexDirection:mobile?"column":"row"}}>
            <HoverBtn onClick={()=>setPage("orders")} variant="primary" style={{flex:1,padding:"16px",textAlign:"center"}}>{L?.viewMyOrders||"View My Orders"}</HoverBtn>
            <HoverBtn onClick={()=>setPage("catalog")} variant="secondary" style={{flex:1,padding:"16px",textAlign:"center"}}>{L?.continueShopping||"Continue Shopping"}</HoverBtn>
          </div>
        </div>
      </div>
    </div>
  );

  // ── CHECKOUT FORM (STEPS 1–2) ──
  return (
    <div style={{minHeight:"100vh",background:C.cream}}>
      <style>{`@keyframes spinAnim{to{transform:rotate(360deg)}}`}</style>
      {/* ── Top bar ── */}
      <div style={{background:C.white,borderBottom:`1px solid ${C.lgray}`,position:"sticky",top:0,zIndex:100}}>
        <div style={{maxWidth:1200,margin:"0 auto",padding:mobile?"14px 16px":"18px 40px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <button onClick={()=>setPage("home")} style={{background:"none",border:"none",cursor:"pointer",padding:0}}>
            <Logo size={mobile?1.2:1.5}/>
          </button>
          <div style={{display:"flex",alignItems:"center",gap:mobile?12:24}}>
            {/* Step indicators */}
            {[{n:1,l:L?.details||"Details"},{n:2,l:L?.payment||"Payment"},{n:3,l:L?.confirmation||"Confirmation"}].map((s,i)=>(
              <div key={s.n} style={{display:"flex",alignItems:"center",gap:mobile?4:8}}>
                <div style={{width:mobile?22:26,height:mobile?22:26,borderRadius:"50%",background:step>=s.n?C.black:"transparent",border:`1.5px solid ${step>=s.n?C.black:C.lgray}`,color:step>=s.n?C.white:C.gray,display:"flex",alignItems:"center",justifyContent:"center",...T.labelSm,fontSize:mobile?9:10,transition:"all 0.3s"}}>
                  {step>s.n?<IconCheck size={12} color={C.white} stroke={2.5}/>:s.n}
                </div>
                {!mobile&&<span style={{...T.labelSm,fontSize:10,color:step>=s.n?C.black:C.gray,letterSpacing:"0.06em"}}>{s.l}</span>}
                {i<2&&<svg width={mobile?12:20} height="2" style={{display:"block"}}><line x1="0" y1="1" x2={mobile?"12":"20"} y2="1" stroke={step>s.n?C.black:C.lgray} strokeWidth="1.5"/></svg>}
              </div>
            ))}
          </div>
          <button onClick={()=>setPage("catalog")} style={{background:"none",border:"none",...T.labelSm,color:C.gray,fontSize:10,cursor:"pointer",display:"flex",alignItems:"center",gap:6}}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
            {!mobile&&(L?.close||"Close")}
          </button>
        </div>
      </div>

      {/* ── Main content ── */}
      <div style={{maxWidth:1200,margin:"0 auto",padding:mobile?"24px 16px 100px":"40px 40px 80px",display:"grid",gridTemplateColumns:mobile?"1fr":"1fr 420px",gap:mobile?32:60,alignItems:"start"}}>

        {/* ── LEFT: FORM ── */}
        <div>
          {step===1&&(
            <>
              <h2 style={{fontFamily:"'Alido',serif",fontSize:mobile?24:30,fontWeight:300,color:C.black,marginBottom:6}}>{L?.shippingDetails||"Shipping Details"}</h2>
              <p style={{...T.bodySm,color:C.gray,fontSize:13,marginBottom:28}}>{L?.shippingSubtitle||"Where should we deliver your order?"}</p>

              {formError&&<div style={{padding:"12px 16px",background:"rgba(88,70,56,0.06)",border:`1px solid ${C.red}`,marginBottom:20}}><p style={{...T.bodySm,color:C.red,fontSize:12}}>{formError}</p></div>}

              {/* Guest form */}
              {isGuest&&(
                <>
                  <div style={{padding:"14px 18px",background:"rgba(177,154,122,0.05)",border:`1px solid rgba(177,154,122,0.12)`,marginBottom:24,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                    <p style={{...T.bodySm,color:C.brown,fontSize:12}}>{L?.haveAccount||"Already have an account?"}</p>
                    <button onClick={()=>{window.__returnAfterAuth="checkout";setPage("auth");}} style={{background:"none",border:"none",...T.label,color:C.tan,fontSize:11,cursor:"pointer",textDecoration:"underline"}}>{L?.signInBtn||"Sign In"}</button>
                  </div>

                  <p style={{...T.labelSm,color:C.black,fontSize:10,letterSpacing:"0.12em",marginBottom:16}}>{L?.contactDetails||"CONTACT DETAILS"}</p>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:0}}>
                    <div style={{marginBottom:18}}>
                      <label style={labelStyle}>{L?.firstName||"FIRST NAME"} *</label>
                      <input type="text" placeholder="Nino" value={gf.firstName} onChange={e=>gu("firstName",e.target.value)} style={inputStyle(formError&&!gf.firstName.trim())}/>
                    </div>
                    <div style={{marginBottom:18}}>
                      <label style={labelStyle}>{L?.lastName||"LAST NAME"} *</label>
                      <input type="text" placeholder="Gogishvili" value={gf.lastName} onChange={e=>gu("lastName",e.target.value)} style={inputStyle(formError&&!gf.lastName.trim())}/>
                    </div>
                  </div>
                  <div style={{marginBottom:18}}>
                    <label style={labelStyle}>{L?.emailAddress||"EMAIL ADDRESS"} *</label>
                    <input type="email" placeholder="nino@example.com" value={gf.email} onChange={e=>gu("email",e.target.value)} style={inputStyle(formError&&!gf.email.includes("@"))}/>
                    <p style={{...T.bodySm,color:C.gray,fontSize:10,marginTop:4}}>{L?.emailOrderUpdates||"Order confirmation and updates will be sent here"}</p>
                  </div>
                  <div style={{marginBottom:24}}>
                    <label style={labelStyle}>{L?.whatsapp||"WHATSAPP NUMBER"} *</label>
                    <input type="tel" placeholder="+995 5XX XXX XXX" value={gf.phone} onChange={e=>gu("phone",e.target.value)} style={inputStyle(formError&&!gf.phone.trim())}/>
                  </div>

                  <p style={{...T.labelSm,color:C.black,fontSize:10,letterSpacing:"0.12em",marginBottom:16}}>{L?.shippingAddress||"SHIPPING ADDRESS"}</p>
                  <div style={{marginBottom:18}}>
                    <label style={labelStyle}>{L?.addressLine||"ADDRESS"} *</label>
                    <input type="text" placeholder={L?.addressPlaceholder||"Street address, apartment, floor"} value={gf.address} onChange={e=>gu("address",e.target.value)} style={inputStyle(formError&&!gf.address.trim())}/>
                  </div>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
                    <div style={{marginBottom:18}}>
                      <label style={labelStyle}>{L?.city||"CITY"} *</label>
                      <input type="text" placeholder="Tbilisi" value={gf.city} onChange={e=>gu("city",e.target.value)} style={inputStyle(formError&&!gf.city.trim())}/>
                    </div>
                    <div style={{marginBottom:18}}>
                      <label style={labelStyle}>{L?.postalCode||"POSTAL CODE"}</label>
                      <input type="text" placeholder="0100" value={gf.postal} onChange={e=>gu("postal",e.target.value)} style={inputStyle(false)}/>
                    </div>
                  </div>
                  <div style={{marginBottom:24}}>
                    <label style={labelStyle}>{L?.country||"COUNTRY"}</label>
                    <select value={gf.country} onChange={e=>gu("country",e.target.value)} style={{...inputStyle(false),cursor:"pointer",appearance:"auto"}}>
                      {["Georgia","Turkey","Armenia","Azerbaijan","Russia","USA","Germany","France","UK","Italy","Other"].map(c=><option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </>
              )}

              {/* Logged-in user */}
              {!isGuest&&(
                <>
                  <div style={{padding:"18px 20px",background:C.white,marginBottom:24,display:"flex",alignItems:"center",gap:14}}>
                    <div style={{width:44,height:44,borderRadius:"50%",background:C.tan,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={C.white} strokeWidth="2"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
                    </div>
                    <div style={{flex:1}}>
                      <p style={{...T.heading,color:C.black,fontSize:14}}>{user.name}</p>
                      <p style={{...T.bodySm,color:C.gray,fontSize:12}}>{user.email}</p>
                    </div>
                    <IconCheck size={18} color={C.tan} stroke={2}/>
                  </div>

                  <p style={{...T.labelSm,color:C.black,fontSize:10,letterSpacing:"0.12em",marginBottom:16}}>{L?.shippingAddress||"SHIPPING ADDRESS"}</p>
                  {savedAddresses.length>0?(
                    <div style={{display:"flex",flexDirection:"column",gap:10,marginBottom:24}}>
                      {savedAddresses.map((addr,i)=>(
                        <div key={addr.id||i} onClick={()=>setSelectedAddr(addr)}
                          style={{padding:"16px 18px",background:C.white,border:`1.5px solid ${selectedAddr?.id===addr.id?C.tan:C.lgray}`,cursor:"pointer",transition:"all 0.2s"}}>
                          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
                            <p style={{...T.heading,color:C.black,fontSize:13}}>{addr.name}{addr.isDefault&&<span style={{...T.labelSm,color:C.tan,fontSize:8,marginLeft:8}}>DEFAULT</span>}</p>
                            <div style={{width:18,height:18,borderRadius:"50%",border:`2px solid ${selectedAddr?.id===addr.id?C.tan:C.lgray}`,background:selectedAddr?.id===addr.id?C.tan:"transparent",display:"flex",alignItems:"center",justifyContent:"center",transition:"all 0.2s"}}>
                              {selectedAddr?.id===addr.id&&<div style={{width:7,height:7,borderRadius:"50%",background:C.white}}/>}
                            </div>
                          </div>
                          <p style={{...T.bodySm,color:C.gray,fontSize:12,lineHeight:1.5}}>{addr.line1}{addr.line2?", "+addr.line2:""}</p>
                          <p style={{...T.bodySm,color:C.gray,fontSize:12}}>{addr.city}{addr.postal?", "+addr.postal:""} · {addr.country}</p>
                        </div>
                      ))}
                    </div>
                  ):(
                    <div style={{padding:"24px 20px",background:C.white,border:`1px dashed ${C.lgray}`,textAlign:"center",marginBottom:24}}>
                      <p style={{...T.bodySm,color:C.gray,marginBottom:12}}>{L?.noSavedAddresses||"No saved addresses"}</p>
                      <HoverBtn onClick={()=>setPage("account")} variant="secondary" style={{padding:"10px 24px",fontSize:11}}>
                        {L?.addInAccount||"Add Address in Account"}
                      </HoverBtn>
                    </div>
                  )}
                </>
              )}

              {/* Video verification */}
              <div style={{borderTop:`1px solid ${C.lgray}`,paddingTop:24,marginTop:8}}>
                <p style={{...T.labelSm,color:C.black,fontSize:10,letterSpacing:"0.12em",marginBottom:14}}>{L?.videoVerifLabel||"VIDEO VERIFICATION"}</p>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:16}}>
                  <button onClick={()=>setWantVideo(false)}
                    onMouseEnter={e=>{if(!(!wantVideo))e.currentTarget.style.borderColor=C.black;}}
                    onMouseLeave={e=>{if(!(!wantVideo))e.currentTarget.style.borderColor="rgba(200,200,190,0.5)";}}
                    style={{padding:"18px 14px",background:!wantVideo?C.black:"transparent",border:`1.5px solid ${!wantVideo?C.black:"rgba(200,200,190,0.5)"}`,cursor:"pointer",textAlign:"center",transition:"all 0.2s"}}>
                    <p style={{...T.label,fontSize:11,color:!wantVideo?C.white:C.black,marginBottom:4}}>{L?.standardOption||"Standard"}</p>
                    <p style={{fontFamily:"'Alido',serif",fontSize:18,color:!wantVideo?C.white:C.black}}>GEL {subtotal}</p>
                  </button>
                  <button onClick={()=>setWantVideo(true)}
                    onMouseEnter={e=>{if(!wantVideo)e.currentTarget.style.borderColor=C.tan;}}
                    onMouseLeave={e=>{if(!wantVideo)e.currentTarget.style.borderColor="rgba(200,200,190,0.5)";}}
                    style={{padding:"18px 14px",background:wantVideo?C.black:"transparent",border:`1.5px solid ${wantVideo?C.tan:"rgba(200,200,190,0.5)"}`,cursor:"pointer",textAlign:"center",position:"relative",transition:"all 0.2s"}}>
                    <div style={{position:"absolute",top:-1,right:-1,background:C.tan,padding:"3px 10px"}}><span style={{...T.labelSm,color:C.white,fontSize:7}}>{L?.recommended||"RECOMMENDED"}</span></div>
                    <p style={{...T.label,fontSize:11,color:wantVideo?C.white:C.black,marginBottom:4,display:"flex",alignItems:"center",justifyContent:"center",gap:6}}>
                      <IconVideo size={13} color={wantVideo?C.white:C.black} stroke={1.6}/>
                      {L?.withVideo||"With Video"}
                    </p>
                    <p style={{fontFamily:"'Alido',serif",fontSize:18,color:wantVideo?C.white:C.black}}>GEL {subtotal+VIDEO_VERIFICATION_GEL}</p>
                  </button>
                </div>
                {wantVideo&&(
                  <div>
                    <label style={labelStyle}>{L?.videoNotes||"WHAT WOULD YOU LIKE US TO CHECK?"}</label>
                    <input type="text" placeholder={L?.videoNotesPlaceholder||"e.g. Show stitching details, check hardware color..."} value={isGuest?gf.notes:loggedNotes} onChange={e=>isGuest?gu("notes",e.target.value):setLoggedNotes(e.target.value)} style={inputStyle(false)} maxLength={300}/>
                  </div>
                )}
              </div>

              <div style={{marginTop:28}}>
                <HoverBtn onClick={handleNext} variant="primary" style={{width:"100%",padding:"17px 24px"}}>{L?.reviewOrder||"Review Order"}</HoverBtn>
                <p style={{...T.bodySm,color:C.gray,fontSize:10,textAlign:"center",marginTop:12,lineHeight:1.6}}>
                  {L?.checkoutDisclaimer||"By placing an order you agree to our"} <button onClick={()=>setPage("terms")} style={{background:"none",border:"none",color:C.tan,fontSize:10,cursor:"pointer",textDecoration:"underline",padding:0,fontFamily:"inherit"}}>{L?.termsLink||"Terms & Conditions"}</button>
                </p>
              </div>
            </>
          )}

          {step===2&&(
            <>
              <h2 style={{fontFamily:"'Alido',serif",fontSize:mobile?24:30,fontWeight:300,color:C.black,marginBottom:6}}>{L?.reviewPay||"Review & Pay"}</h2>
              <p style={{...T.bodySm,color:C.gray,fontSize:13,marginBottom:28}}>{L?.reviewSubtitle||"Please review your order before confirming"}</p>

              {/* Shipping summary */}
              <div style={{background:C.white,padding:"20px 22px",marginBottom:20}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
                  <p style={{...T.labelSm,color:C.black,fontSize:10,letterSpacing:"0.1em"}}>{L?.shippingTo||"SHIPPING TO"}</p>
                  <button onClick={()=>setStep(1)} style={{background:"none",border:"none",...T.labelSm,color:C.tan,fontSize:9,cursor:"pointer",textDecoration:"underline"}}>{L?.edit||"Edit"}</button>
                </div>
                <p style={{...T.heading,color:C.black,fontSize:13,marginBottom:4}}>{isGuest?`${gf.firstName} ${gf.lastName}`:user?.name}</p>
                <p style={{...T.bodySm,color:C.gray,fontSize:12,lineHeight:1.6}}>
                  {isGuest?gf.address:(selectedAddr?.line1||"")}<br/>
                  {isGuest?`${gf.city}${gf.postal?", "+gf.postal:""} · ${gf.country}`:`${selectedAddr?.city||""}${selectedAddr?.postal?", "+selectedAddr.postal:""} · ${selectedAddr?.country||""}`}
                </p>
                <p style={{...T.bodySm,color:C.gray,fontSize:12,marginTop:4}}>{isGuest?gf.phone:(selectedAddr?.phone||"")}</p>
              </div>

              {/* Refund note */}
              <div style={{padding:"14px 18px",background:"rgba(177,154,122,0.05)",borderLeft:`3px solid ${C.tan}`,marginBottom:24}}>
                <p style={{...T.bodySm,color:C.brown,lineHeight:1.7,fontSize:12}}>
                  {L?.refundNote||"Fully refundable if you cancel before shipping."}{wantVideo?" Video will be sent to your WhatsApp before dispatch.":""}
                </p>
              </div>

              {/* Payment */}
              <p style={{...T.labelSm,color:C.black,fontSize:10,letterSpacing:"0.12em",marginBottom:14}}>{L?.paymentMethod||"PAYMENT METHOD"}</p>
              {[["BOG",L?.bogTransfer||"BOG / TBC Bank Transfer",L?.recommended||"Recommended"],["card",L?.cardPayment||"Card Payment",""]].map(([v,m,tag])=>(
                <div key={v} onClick={()=>setPayMethod(v)}
                  style={{display:"flex",alignItems:"center",gap:14,padding:"16px 18px",background:C.white,border:`1.5px solid ${payMethod===v?C.tan:C.lgray}`,marginBottom:10,cursor:"pointer",transition:"all 0.2s"}}>
                  <div style={{width:16,height:16,borderRadius:"50%",border:`2px solid ${payMethod===v?C.tan:C.lgray}`,background:payMethod===v?C.tan:"transparent",transition:"all 0.2s",flexShrink:0}}/>
                  <span style={{...T.bodySm,color:C.black,fontSize:13}}>{m}</span>
                  {tag&&<span style={{...T.labelSm,color:C.tan,fontSize:9,marginLeft:"auto"}}>{tag}</span>}
                </div>
              ))}

              <div style={{marginTop:28,display:"flex",flexDirection:"column",gap:10}}>
                <HoverBtn onClick={handleNext} variant="primary" style={{width:"100%",padding:"17px 24px",opacity:submitting?0.7:1}} disabled={submitting}>
                  {submitting?(
                    <span style={{display:"flex",alignItems:"center",justifyContent:"center",gap:10}}>
                      <span style={{display:"inline-block",width:16,height:16,border:"2px solid rgba(255,255,255,0.3)",borderTop:`2px solid ${C.white}`,borderRadius:"50%",animation:"spinAnim 0.7s linear infinite"}}/>
                      {L?.placingOrder||"Placing Order..."}
                    </span>
                  ):`${L?.confirmPay||"Confirm & Pay"} — GEL ${grandTotal}`}
                </HoverBtn>
                <button onClick={()=>setStep(1)} style={{width:"100%",background:"none",border:"none",...T.bodySm,color:C.gray,fontSize:12,padding:"12px 0",cursor:"pointer"}}>{L?.backToDetails||"Back to details"}</button>
              </div>
            </>
          )}
        </div>

        {/* ── RIGHT: ORDER SUMMARY (sticky) ── */}
        {step<3&&(
          <div style={{position:mobile?"relative":"sticky",top:mobile?"auto":100}}>
            <div style={{background:C.white,padding:mobile?"24px 20px":"28px 24px"}}>
              <p style={{...T.labelSm,color:C.tan,fontSize:9,letterSpacing:"0.15em",marginBottom:18}}>{L?.orderSummaryLabel||"YOUR ORDER"} ({cart.length})</p>

              {cart.map((o,i)=>(
                <div key={o.addedAt||i} style={{display:"flex",gap:12,padding:"12px 0",borderBottom:`1px solid rgba(200,200,190,0.3)`}}>
                  <div style={{position:"relative"}}>
                    <img src={o.img} alt={o.name} width="72" height="72" style={{width:72,height:72,objectFit:"cover",flexShrink:0,background:"#f5f5f3"}}/>
                  </div>
                  <div style={{flex:1,minWidth:0}}>
                    <p style={{...T.labelSm,color:C.tan,fontSize:7,letterSpacing:"0.1em",marginBottom:2}}>{o.brand}</p>
                    <p style={{...T.heading,color:C.black,fontSize:12,marginBottom:3,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{L?.localNames?.[o.name]||o.name}</p>
                    <p style={{...T.bodySm,color:C.gray,fontSize:10}}>{o.color}{o.selectedSize&&o.selectedSize!=="One Size"?" · "+o.selectedSize:""}</p>
                  </div>
                  <span style={{fontFamily:"'Alido',serif",fontSize:14,color:o.sale?C.red:C.black,flexShrink:0}}>GEL {o.sale||o.price}</span>
                </div>
              ))}

              <div style={{paddingTop:16}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
                  <span style={{...T.bodySm,color:C.gray,fontSize:12}}>{L?.subtotal||"Subtotal"}</span>
                  <span style={{...T.bodySm,color:C.black,fontSize:12}}>GEL {subtotal}</span>
                </div>
                {wantVideo&&(
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
                    <span style={{...T.bodySm,color:C.gray,fontSize:12}}>{L?.videoVerif||"Video Verification"}</span>
                    <span style={{...T.bodySm,color:C.black,fontSize:12}}>GEL {VIDEO_VERIFICATION_GEL}</span>
                  </div>
                )}
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
                  <span style={{...T.bodySm,color:C.gray,fontSize:12}}>{L?.shipping||"Shipping"}</span>
                  <span style={{...T.bodySm,color:C.tan,fontSize:12}}>{L?.included||"Included"}</span>
                </div>
                {/* Promo code */}
                <div style={{borderTop:`1px solid ${C.lgray}`,paddingTop:14,marginTop:10,marginBottom:10}}>
                  {promoApplied?(
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 14px",background:"rgba(177,154,122,0.06)",border:`1px solid ${C.tan}`}}>
                      <div>
                        <span style={{...T.labelSm,color:C.tan,fontSize:9}}>{promoApplied.code}</span>
                        <span style={{...T.bodySm,color:C.black,fontSize:12,marginLeft:8}}>-GEL {promoApplied.discount}</span>
                      </div>
                      <button onClick={removePromo} style={{background:"none",border:"none",color:C.gray,cursor:"pointer",fontSize:14,padding:"0 4px"}}>&times;</button>
                    </div>
                  ):(
                    <div>
                      <div style={{display:"flex",gap:0}}>
                        <input type="text" value={promoCode} onChange={e=>{setPromoCode(e.target.value);if(promoError)setPromoError("");}} onKeyDown={e=>e.key==="Enter"&&applyPromo()}
                          placeholder={L?.promoPlaceholder||"Promo code"} style={{flex:1,padding:"10px 14px",border:`1px solid ${promoError?C.red:C.lgray}`,borderRight:"none",fontSize:12,color:C.black,outline:"none",fontFamily:"'TT Interphases Pro',sans-serif"}}/>
                        <button onClick={applyPromo} disabled={promoLoading}
                          style={{padding:"10px 18px",background:"transparent",border:`1px solid ${C.lgray}`,borderLeft:"none",...T.labelSm,color:C.tan,fontSize:9,cursor:promoLoading?"wait":"pointer",transition:"all 0.2s"}}>
                          {promoLoading?"...":L?.apply||"APPLY"}
                        </button>
                      </div>
                      {promoError&&<p style={{...T.bodySm,color:C.red,fontSize:10,marginTop:6}}>{promoError}</p>}
                    </div>
                  )}
                </div>

                {promoApplied&&(
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
                    <span style={{...T.bodySm,color:C.tan,fontSize:12}}>{L?.promoDiscount||"Promo discount"}</span>
                    <span style={{...T.bodySm,color:C.tan,fontSize:12}}>-GEL {promoDiscount}</span>
                  </div>
                )}

                <div style={{borderTop:`2px solid ${C.black}`,paddingTop:14,marginTop:4,display:"flex",justifyContent:"space-between",alignItems:"baseline"}}>
                  <span style={{...T.label,color:C.black,fontSize:11}}>{L?.total||"TOTAL"}</span>
                  <span style={{fontFamily:"'Alido',serif",fontSize:24,color:C.black}}>GEL {grandTotal}</span>
                </div>
              </div>
            </div>

            {/* Trust badges */}
            <div style={{padding:"18px 24px",background:"rgba(177,154,122,0.04)",marginTop:2}}>
              {[
                {text:L?.qualityGuaranteed||"Quality guaranteed from verified suppliers"},
                {text:L?.freeCancelNote||"Free cancellation before sourcing"},
                {text:L?.secureCheckout||"Secure & encrypted checkout"},
              ].map((b,i)=>(
                <div key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"6px 0"}}>
                  <IconCheck size={12} color={C.tan} stroke={2}/>
                  <span style={{...T.bodySm,color:C.gray,fontSize:11}}>{b.text}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
