import { useState } from 'react';
import { C, T } from '../constants/theme.js';
import { WHATSAPP_NUMBER } from '../constants/config.js';
import HoverBtn from '../components/ui/HoverBtn.jsx';
import Footer from '../components/layout/Footer.jsx';

// ── CONTACT PAGE ─────────────────────────────────────────────────────────────
export default function ContactPage({setPage,L,mobile}) {
  const px=mobile?"16px":"40px";
  const [form,setForm]=useState({name:"",email:"",message:""});
  const [sent,setSent]=useState(false);

  const handleSubmit=(e)=>{
    e.preventDefault();
    if(form.name.trim()&&form.email.includes("@")&&form.message.trim()){
      setSent(true);
      setTimeout(()=>setSent(false),5000);
      setForm({name:"",email:"",message:""});
    }
  };

  return (
    <div style={{paddingTop:mobile?52:80,background:C.cream}}>
      {/* HEADER */}
      <div style={{borderBottom:`1px solid ${C.lgray}`,padding:mobile?"28px 0":"40px 0"}}>
        <div style={{maxWidth:900,margin:"0 auto",padding:`0 ${px}`}}>
          <p style={{...T.labelSm,color:C.tan,marginBottom:10}}>Get in Touch</p>
          <h1 style={{...T.displayMd,color:C.black,marginBottom:8}}>Contact Us</h1>
          <p style={{...T.body,color:C.gray,lineHeight:1.9}}>We're here to help. Reach out through any of the channels below.</p>
        </div>
      </div>

      {/* CONTACT GRID */}
      <div style={{padding:mobile?"32px 0":"56px 0"}}>
        <div style={{maxWidth:900,margin:"0 auto",padding:`0 ${px}`,display:"grid",gridTemplateColumns:mobile?"1fr":"1fr 1fr",gap:mobile?32:64}}>

          {/* LEFT — Contact Info */}
          <div>
            <div style={{marginBottom:32}}>
              <p style={{...T.labelSm,color:C.tan,marginBottom:16,fontSize:10}}>CONTACT CHANNELS</p>
              {[
                {icon:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.tan} strokeWidth="1.5"><path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"/></svg>,label:"WhatsApp",value:"+995 555 999 555",href:`https://wa.me/${WHATSAPP_NUMBER}`,note:"Fastest way to reach us"},
                {icon:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.tan} strokeWidth="1.5"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>,label:"Email",value:"info@alternative.ge",href:"mailto:info@alternative.ge",note:"We reply within 24 hours"},
                {icon:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.tan} strokeWidth="1.5"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/></svg>,label:"Phone",value:"+995 555 999 555",href:"tel:+995555999555",note:"Mon–Sat 10:00–20:00"},
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
              <p style={{...T.labelSm,color:C.tan,marginBottom:16,fontSize:10}}>LOCATION</p>
              <p style={{...T.body,color:C.black,marginBottom:4}}>Tbilisi, Georgia</p>
              <p style={{...T.bodySm,color:C.gray,lineHeight:1.7}}>We currently operate online and deliver within Tbilisi. Nationwide shipping coming soon.</p>
            </div>

            <div>
              <p style={{...T.labelSm,color:C.tan,marginBottom:16,fontSize:10}}>BUSINESS HOURS</p>
              <div style={{display:"flex",flexDirection:"column",gap:6}}>
                {[["Monday – Saturday","10:00 – 20:00"],["Sunday","Closed"]].map(([d,h])=>(
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
            <p style={{...T.labelSm,color:C.tan,marginBottom:16,fontSize:10}}>SEND US A MESSAGE</p>
            <form onSubmit={handleSubmit}>
              {[
                {key:"name",label:"Full Name",type:"text",placeholder:"Your name"},
                {key:"email",label:"Email",type:"email",placeholder:"your@email.com"},
              ].map(f=>(
                <div key={f.key} style={{marginBottom:16}}>
                  <label style={{...T.labelSm,color:C.gray,fontSize:9,display:"block",marginBottom:6}}>{f.label}</label>
                  <input type={f.type} placeholder={f.placeholder} value={form[f.key]} onChange={e=>setForm({...form,[f.key]:e.target.value})}
                    style={{width:"100%",padding:"12px 14px",border:`1px solid ${C.lgray}`,background:C.white,fontSize:14,color:C.black,outline:"none",...T.body}}/>
                </div>
              ))}
              <div style={{marginBottom:20}}>
                <label style={{...T.labelSm,color:C.gray,fontSize:9,display:"block",marginBottom:6}}>Message</label>
                <textarea placeholder="How can we help you?" value={form.message} onChange={e=>setForm({...form,message:e.target.value})}
                  rows={5} style={{width:"100%",padding:"12px 14px",border:`1px solid ${C.lgray}`,background:C.white,fontSize:14,color:C.black,outline:"none",resize:"vertical",...T.body}}/>
              </div>
              <HoverBtn type="submit" variant="primary" style={{width:"100%",padding:"15px 24px"}}>
                {sent?"Message Sent!":"Send Message"}
              </HoverBtn>
              {sent&&<p style={{...T.bodySm,color:C.tan,marginTop:12,textAlign:"center"}}>Thank you! We'll get back to you soon.</p>}
            </form>

            <div style={{padding:"16px 20px",background:C.offwhite,borderLeft:`3px solid ${C.tan}`,marginTop:24}}>
              <p style={{...T.bodySm,color:C.brown,lineHeight:1.8,fontSize:12}}>
                For the fastest response, contact us on WhatsApp. We typically respond within minutes during business hours.
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer setPage={setPage} L={L} mobile={mobile}/>
    </div>
  );
}
