import { useState } from 'react';
import { C, T } from '../../constants/theme.js';

// ── SIZE FIT WIDGET ───────────────────────────────────────────────────────────
export default function SizeFitWidget({product,onGuide,L}) {
  const [open,setOpen]=useState(false);
  if (!product.fit) return null;
  const {fit,notes}=product.fit;
  const isSmall=fit.toLowerCase().includes("small")||fit.toLowerCase().includes("slim");
  const isLarge=fit.toLowerCase().includes("large")||fit.toLowerCase().includes("oversized")||fit.toLowerCase().includes("relaxed");
  const isTrue=fit.toLowerCase().includes("true");
  const pos=isSmall?1:isLarge?3:isTrue?2:2;
  return (
    <div style={{marginBottom:20}}>
      <button onClick={()=>setOpen(!open)} style={{background:"none",border:`1px solid ${open?C.tan:C.lgray}`,padding:"11px 16px",width:"100%",display:"flex",justifyContent:"space-between",alignItems:"center",cursor:"pointer",transition:"border-color 0.2s"}}
        onMouseEnter={e=>e.currentTarget.style.borderColor=C.tan} onMouseLeave={e=>{if(!open)e.currentTarget.style.borderColor=C.lgray}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.tan} strokeWidth="1.5">
            <circle cx="12" cy="7" r="4"/><path d="M6 21v-2a4 4 0 018 0v2"/>
          </svg>
          <span style={{...T.labelSm,color:C.black,fontSize:10}}>{L&&L.sizeFit||"Size & Fit"}</span>
          <span style={{...T.bodySm,color:C.tan,fontSize:12,fontStyle:"italic"}}>{fit}</span>
        </div>
        <span style={{color:C.gray,fontSize:11,transition:"transform 0.2s",display:"inline-block",transform:open?"rotate(180deg)":"none"}}>▼</span>
      </button>
      {open&&(
        <div style={{border:`1px solid ${C.tan}`,borderTop:"none",padding:"18px 16px",background:C.offwhite,animation:"slideDown 0.2s ease"}}>
          <div style={{marginBottom:14}}>
            <div style={{display:"flex",justifyContent:"space-between",...T.labelSm,color:C.gray,fontSize:8,marginBottom:8}}>
              <span>{L&&L.runSmall||"Runs small"}</span><span>{L&&L.trueToSize||"True to size"}</span><span>{L&&L.runsLarge||"Runs large"}</span>
            </div>
            <div style={{position:"relative",height:4,background:C.lgray,borderRadius:2}}>
              <div style={{position:"absolute",left:`${(pos-1)*50}%`,top:"50%",transform:"translate(-50%,-50%)",width:13,height:13,borderRadius:"50%",background:C.tan,border:`2px solid ${C.cream}`}}/>
            </div>
          </div>
          <p style={{...T.bodySm,color:C.gray,lineHeight:1.7,marginBottom:12}}>{notes}</p>
          <button onClick={onGuide} style={{background:"none",border:"none",...T.labelSm,color:C.tan,fontSize:9,padding:0,textDecoration:"underline"}}>{L&&L.fullSizeGuide||'Full size guide →'}</button>
        </div>
      )}
    </div>
  );
}
