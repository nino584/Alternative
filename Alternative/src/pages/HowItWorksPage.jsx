import { useState, useEffect } from 'react';
import { C, T } from '../constants/theme.js';
import { ORDER_STATUSES } from '../constants/data.js';
import Footer from '../components/layout/Footer.jsx';

// ── HOW IT WORKS ──────────────────────────────────────────────────────────────
export default function HowItWorksPage({setPage,L,mobile}) {
  const [openFaq,setOpenFaq]=useState(null);
  useEffect(()=>{
    if(window.__initHowScroll){
      const id=window.__initHowScroll;
      delete window.__initHowScroll;
      setTimeout(()=>{const el=document.getElementById(id);if(el)el.scrollIntoView({behavior:"smooth",block:"start"});},100);
    }
  },[]);
  const faqs=[
    ["Can I cancel my order?","Yes — before your item ships you can cancel at any time for a full refund. No questions asked."],
    ["What if my item arrives damaged?","Contact us within 48 hours with photos. We will arrange a replacement or full refund."],
    ["What payment methods do you accept?","BOG / TBC bank transfer (recommended), or card payment via secure link."],
    ["How does video verification work?","Add it at checkout for GEL 28. We film your item before shipping and send the full video directly to your WhatsApp number."],
    ["How long does shipping take?","10–18 business days from order confirmation, depending on item. Lead time is shown on each product page."],
    ["Do you ship outside Tbilisi?","Currently we deliver to Tbilisi. Nationwide shipping coming soon."],
  ];
  return (
    <div style={{paddingTop:mobile?52:80,background:C.cream}}>
      <div style={{background:C.black,padding:mobile?"48px 0":"72px 0"}}>
        <div style={{maxWidth:900,margin:"0 auto",padding:mobile?"0 16px":"0 40px",textAlign:"center"}}>
          <p style={{...T.labelSm,color:C.tan,marginBottom:18}}>{L&&L.ourProcessLabel||'Our process'}</p>
          <h1 style={{...T.displayLg,color:C.white,marginBottom:20}}>How Ordering Works</h1>
          <p style={{...T.body,color:C.lgray,maxWidth:560,margin:"0 auto",lineHeight:1.9}}>We source directly from verified suppliers and deliver to Georgia with a transparent, structured process designed for confidence and convenience.</p>
        </div>
      </div>
      <div style={{padding:"88px 0"}}>
        <div style={{maxWidth:900,margin:"0 auto",padding:"0 40px"}}>
          {[
            {n:"01",t:"Place Your Order",body:"Select your item and complete checkout by paying for the item. Shipping is paid upon arrival in Georgia.",note:"Orders can be cancelled free of charge within 24 hours after purchase."},
            {n:"02",t:"Sourcing & Processing",body:"Once your order is confirmed, we source the item through our verified supplier network. The product is prepared for dispatch according to our quality standards."},
            {n:"03",t:"Optional Video Verification — €10",body:"For additional peace of mind, you may add Video Verification at checkout. If selected, our team inspects your item and creates detailed photo and video material showing: overall condition, hardware & details, stitching & materials.",note:"The media is sent to you via WhatsApp and email. Shipping to Georgia happens only after your approval."},
            {n:"04",t:"Shipping to Georgia",body:"If Video Verification is not selected, your item ships directly to Georgia after sourcing. Once the item arrives, you have two delivery options:",note:"Home Delivery — we deliver to your door in premium Alternative branded packaging. Post Office Pickup — collect your order from the designated postal location."},
            {n:"05",t:"Delivery & Support",body:"Your order arrives securely packaged and ready to enjoy. For any issue upon delivery, contact us and our team will assist you.",note:"Support: info@alternative.ge"},
          ].map((s,i)=>(
            <div key={i} style={{display:"grid",gridTemplateColumns:mobile?"48px 1fr":"72px 1fr",gap:mobile?20:44,marginBottom:56,paddingBottom:56,borderBottom:i<4?`1px solid ${C.lgray}`:"none"}}>
              <div style={{textAlign:"right",paddingTop:4}}><span style={{...T.displayMd,fontSize:48,color:C.tan,lineHeight:1}}>{s.n}</span></div>
              <div>
                <h3 style={{...T.heading,color:C.black,marginBottom:12,fontSize:16}}>{s.t}</h3>
                <p style={{...T.body,color:C.gray,marginBottom:s.note?12:0,lineHeight:1.9}}>{s.body}</p>
                {s.note&&<div style={{padding:"11px 14px",background:C.offwhite,borderLeft:`2px solid ${C.tan}`}}>
                  <p style={{...T.bodySm,color:C.brown,fontSize:12}}>{s.note}</p>
                </div>}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{background:C.offwhite,padding:"64px 0"}}>
        <div style={{maxWidth:1360,margin:"0 auto",padding:"0 40px"}}>
          <div style={{textAlign:"center",marginBottom:44}}>
            <p style={{...T.labelSm,color:C.tan,marginBottom:10}}>{L&&L.trackOrder||'Track your order'}</p>
            <h2 style={{...T.displayMd,color:C.black}}>{L&&L.orderStatusVisible||'Order status — always visible'}</h2>
          </div>
          <div style={{display:"grid",gridTemplateColumns:mobile?"1fr 1fr":"repeat(5,1fr)",gap:3}}>
            {ORDER_STATUSES.map((s,i)=>(
              <div key={i} style={{background:C.cream,padding:"20px 16px"}}>
                <div style={{height:3,background:s.color,marginBottom:16}}/>
                <p style={{...T.label,color:C.black,marginBottom:7,fontSize:10}}>{s.label}</p>
                <p style={{...T.bodySm,color:C.gray,fontSize:11,lineHeight:1.6}}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div id="faq" style={{padding:"64px 0"}}>
        <div style={{maxWidth:900,margin:"0 auto",padding:mobile?"0 16px":"0 40px"}}>
          <h2 style={{...T.displayMd,color:C.black,marginBottom:mobile?24:40,fontSize:mobile?"clamp(22px,6vw,32px)":undefined}}>{L&&L.faq||"Frequently asked"}</h2>
          {faqs.map(([q,a],i)=>(
            <div key={i} style={{borderBottom:`1px solid ${C.lgray}`}}>
              <button onClick={()=>setOpenFaq(openFaq===i?null:i)} style={{width:"100%",display:"flex",justifyContent:"space-between",alignItems:"center",padding:"20px 0",background:"none",border:"none",textAlign:"left",cursor:"pointer"}}>
                <span style={{...T.label,color:C.black,fontSize:12}}>{q}</span>
                <span style={{color:C.tan,fontSize:14,flexShrink:0,marginLeft:20,transform:openFaq===i?"rotate(180deg)":"none",transition:"transform 0.2s",display:"inline-block"}}>▼</span>
              </button>
              {openFaq===i&&<p style={{...T.body,color:C.gray,lineHeight:1.85,paddingBottom:20,animation:"slideDown 0.2s ease"}}>{a}</p>}
            </div>
          ))}
        </div>
      </div>
      <Footer setPage={setPage} L={L} mobile={mobile}/>
    </div>
  );
}
