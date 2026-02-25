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
    [L.faqQ1,L.faqA1],
    [L.faqQ2,L.faqA2],
    [L.faqQ3,L.faqA3],
    [L.faqQ4,L.faqA4],
    [L.faqQ5,L.faqA5],
    [L.faqQ6,L.faqA6],
  ];
  return (
    <div style={{paddingTop:mobile?52:80,background:C.cream}}>
      <div style={{background:C.black,padding:mobile?"48px 0":"72px 0"}}>
        <div style={{maxWidth:900,margin:"0 auto",padding:mobile?"0 16px":"0 40px",textAlign:"center"}}>
          <p style={{...T.labelSm,color:C.tan,marginBottom:18}}>{L.ourProcessLabel}</p>
          <h1 style={{...T.displayLg,color:C.white,marginBottom:20}}>{L.howTitle}</h1>
          <p style={{...T.body,color:C.lgray,maxWidth:560,margin:"0 auto",lineHeight:1.9}}>{L.howSubtitleFull}</p>
        </div>
      </div>
      <div style={{padding:"88px 0"}}>
        <div style={{maxWidth:900,margin:"0 auto",padding:"0 40px"}}>
          {[
            {n:"01",t:L.processStep1T,body:L.processStep1B,note:L.processStep1N},
            {n:"02",t:L.processStep2T,body:L.processStep2B},
            {n:"03",t:L.processStep3T,body:L.processStep3B,note:L.processStep3N},
            {n:"04",t:L.processStep4T,body:L.processStep4B,note:L.processStep4N},
            {n:"05",t:L.processStep5T,body:L.processStep5B,note:L.processStep5N},
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
            <p style={{...T.labelSm,color:C.tan,marginBottom:10}}>{L.trackOrder}</p>
            <h2 style={{...T.displayMd,color:C.black}}>{L.orderStatusVisible}</h2>
          </div>
          <div style={{display:"grid",gridTemplateColumns:mobile?"1fr 1fr":"repeat(5,1fr)",gap:3}}>
            {ORDER_STATUSES.map((s,i)=>{
              const labelMap={reserved:"statusReservedLabel",sourcing:"statusSourcingLabel",confirmed:"statusConfirmedLabel",shipped:"statusShippedLabel",delivered:"statusDeliveredLabel"};
              const descMap={reserved:"statusReservedDesc",sourcing:"statusSourcingDesc",confirmed:"statusConfirmedDesc",shipped:"statusShippedDesc",delivered:"statusDeliveredDesc"};
              return(
              <div key={i} style={{background:C.cream,padding:"20px 16px"}}>
                <div style={{height:3,background:s.color,marginBottom:16}}/>
                <p style={{...T.label,color:C.black,marginBottom:7,fontSize:10}}>{L[labelMap[s.key]]||s.label}</p>
                <p style={{...T.bodySm,color:C.gray,fontSize:11,lineHeight:1.6}}>{L[descMap[s.key]]||s.desc}</p>
              </div>
            );})}
          </div>
        </div>
      </div>

      <div id="faq" style={{padding:"64px 0"}}>
        <div style={{maxWidth:900,margin:"0 auto",padding:mobile?"0 16px":"0 40px"}}>
          <h2 style={{...T.displayMd,color:C.black,marginBottom:mobile?24:40,fontSize:mobile?"clamp(22px,6vw,32px)":undefined}}>{L.faq}</h2>
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
