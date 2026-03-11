import { useState } from 'react';
import { C, T } from '../constants/theme.js';
import { WHATSAPP_NUMBER } from '../constants/config.js';
import HoverBtn from '../components/ui/HoverBtn.jsx';
import Footer from '../components/layout/Footer.jsx';
import SEO from '../components/SEO.jsx';
import { pageMeta, breadcrumbSchema } from '../utils/seo.js';

// ── CONTACT PAGE ─────────────────────────────────────────────────────────────
export default function ContactPage({setPage,L,mobile}) {
  const px=mobile?"16px":"40px";
  const [form,setForm]=useState({name:"",email:"",message:"",website:""});
  const [sent,setSent]=useState(false);
  const [sending,setSending]=useState(false);
  const [formError,setFormError]=useState("");

  const handleSubmit=async(e)=>{
    e.preventDefault();
    setFormError("");
    if(!form.name.trim()||form.name.trim().length<2){setFormError(L?.contactNameRequired||"Please enter your name.");return;}
    if(!form.email.includes("@")){setFormError(L?.validEmail||"Please enter a valid email.");return;}
    if(!form.message.trim()||form.message.trim().length<5){setFormError(L?.contactMessageRequired||"Please enter a message (at least 5 characters).");return;}
    // Honeypot: silently "succeed" if bot fills hidden field
    if(form.website){setSent(true);setTimeout(()=>setSent(false),5000);setForm({name:"",email:"",message:"",website:""});return;}
    setSending(true);
    try {
      const res=await fetch("/api/contact",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({name:form.name.trim(),email:form.email.trim(),message:form.message.trim(),website:form.website})});
      if(!res.ok){const data=await res.json().catch(()=>({}));throw new Error(data.error||"Failed to send");}
      setSent(true);
      setTimeout(()=>setSent(false),5000);
      setForm({name:"",email:"",message:"",website:""});
    } catch(err){
      setFormError(err.message||"Failed to send message. Please try again.");
    } finally{setSending(false);}
  };

  return (
    <div style={{paddingTop:mobile?78:104,background:C.cream}}>
      <SEO {...pageMeta("contact")} schema={breadcrumbSchema([{name:"Home",url:"/"},{name:"Contact"}])} />
      {/* HEADER */}
      <div style={{borderBottom:`1px solid ${C.lgray}`,padding:mobile?"28px 0":"40px 0"}}>
        <div style={{maxWidth:900,margin:"0 auto",padding:`0 ${px}`}}>
          <p style={{...T.labelSm,color:C.tan,marginBottom:10}}>{L.contactGetInTouch}</p>
          <h1 style={{...T.displayMd,color:C.black,marginBottom:8}}>{L.contactTitle}</h1>
          <p style={{...T.body,color:C.gray,lineHeight:1.9}}>{L.contactBody}</p>
        </div>
      </div>

      {/* CONTACT GRID */}
      <div style={{padding:mobile?"32px 0":"56px 0"}}>
        <div style={{maxWidth:900,margin:"0 auto",padding:`0 ${px}`,display:"grid",gridTemplateColumns:mobile?"1fr":"1fr 1fr",gap:mobile?32:64}}>

          {/* LEFT — Contact Info */}
          <div>
            <div style={{marginBottom:32}}>
              <p style={{...T.labelSm,color:C.tan,marginBottom:16,fontSize:10}}>{L.contactChannels}</p>
              {[
                {icon:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.tan} strokeWidth="1.5"><path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"/></svg>,label:"WhatsApp",value:"+995 555 999 555",href:`https://wa.me/${WHATSAPP_NUMBER}`,note:L.contactWhatsAppNote},
                {icon:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.tan} strokeWidth="1.5"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>,label:"Email",value:"info@alternative.ge",href:"mailto:info@alternative.ge",note:L.contactEmailNote},
                {icon:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.tan} strokeWidth="1.5"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/></svg>,label:L.contactPhoneNote,value:"+995 555 999 555",href:"tel:+995555999555",note:L.contactPhoneNote},
              ].map((ch,i)=>(
                <a key={i} href={ch.href} target={ch.href.startsWith("https")?"_blank":undefined} rel="noopener noreferrer"
                  style={{display:"flex",gap:14,padding:"16px 0",borderBottom:`1px solid ${C.lgray}`,textDecoration:"none",transition:"background 0.15s"}}>
                  <div style={{width:40,height:40,borderRadius:"50%",background:C.offwhite,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                    {ch.icon}
                  </div>
                  <div>
                    <p style={{...T.heading,color:C.black,fontSize:13,marginBottom:2}}>{ch.label}</p>
                    <p style={{...T.body,color:C.tan,fontSize:14,marginBottom:2}}>{ch.value}</p>
                    <p style={{...T.labelSm,color:C.gray,fontSize:8}}>{ch.note}</p>
                  </div>
                </a>
              ))}
            </div>

            <div style={{marginBottom:32}}>
              <p style={{...T.labelSm,color:C.tan,marginBottom:16,fontSize:10}}>{L.contactLocationLabel}</p>
              <p style={{...T.body,color:C.black,marginBottom:4}}>{L.contactLocationCity}</p>
              <p style={{...T.bodySm,color:C.gray,lineHeight:1.7}}>{L.contactLocationDesc}</p>
            </div>

            <div>
              <p style={{...T.labelSm,color:C.tan,marginBottom:16,fontSize:10}}>{L.contactHoursLabel}</p>
              <div style={{display:"flex",flexDirection:"column",gap:6}}>
                {[[L.contactMonSat,L.contactMonSatTime],[L.contactSunday,L.contactClosed]].map(([d,h])=>(
                  <div key={d} style={{display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:`1px solid ${C.lgray}`}}>
                    <span style={{...T.bodySm,color:C.black,fontSize:13}}>{d}</span>
                    <span style={{...T.label,color:C.gray,fontSize:11}}>{h}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT — Contact Form */}
          <div>
            <p style={{...T.labelSm,color:C.tan,marginBottom:16,fontSize:10}}>{L.contactSendMessage}</p>
            <form onSubmit={handleSubmit}>
              {/* Honeypot — hidden from real users, bots fill it */}
              <div style={{position:"absolute",left:"-9999px"}} aria-hidden="true">
                <input type="text" name="website" tabIndex={-1} autoComplete="off" value={form.website} onChange={e=>setForm({...form,website:e.target.value})}/>
              </div>
              {formError&&<div style={{padding:"11px 14px",background:"rgba(88,70,56,0.06)",border:`1px solid ${C.red}`,marginBottom:18}}><p style={{...T.bodySm,color:C.red,fontSize:12}}>{formError}</p></div>}
              {[
                {key:"name",label:L.contactFullName,type:"text",placeholder:L.contactFullNamePh},
                {key:"email",label:L.contactEmailLabel,type:"email",placeholder:L.contactEmailPh},
              ].map(f=>(
                <div key={f.key} style={{marginBottom:16}}>
                  <label style={{...T.labelSm,color:C.gray,fontSize:9,display:"block",marginBottom:6}}>{f.label}</label>
                  <input type={f.type} placeholder={f.placeholder} value={form[f.key]} onChange={e=>setForm({...form,[f.key]:e.target.value})} maxLength={f.key==="email"?254:100}
                    style={{width:"100%",padding:"12px 14px",border:`1px solid ${C.lgray}`,background:C.white,fontSize:14,color:C.black,outline:"none",...T.body}}/>
                </div>
              ))}
              <div style={{marginBottom:20}}>
                <label style={{...T.labelSm,color:C.gray,fontSize:9,display:"block",marginBottom:6}}>{L.contactMessageLabel}</label>
                <textarea placeholder={L.contactMessagePh} value={form.message} onChange={e=>setForm({...form,message:e.target.value})}
                  rows={5} maxLength={2000} style={{width:"100%",padding:"12px 14px",border:`1px solid ${C.lgray}`,background:C.white,fontSize:14,color:C.black,outline:"none",resize:"vertical",...T.body}}/>
              </div>
              <HoverBtn type="submit" variant="primary" style={{width:"100%",padding:"15px 24px"}} disabled={sending}>
                {sending?"...":sent?L.contactSent:L.contactSend}
              </HoverBtn>
              {sent&&<p style={{...T.bodySm,color:C.tan,marginTop:12,textAlign:"center"}}>{L.contactThankYou}</p>}
            </form>

            <div style={{padding:"16px 20px",background:C.offwhite,borderLeft:`3px solid ${C.tan}`,marginTop:24}}>
              <p style={{...T.bodySm,color:C.brown,lineHeight:1.8,fontSize:12}}>
                {L.contactWhatsappTip}
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer setPage={setPage} L={L} mobile={mobile}/>
    </div>
  );
}
