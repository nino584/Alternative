import { C, T } from '../constants/theme.js';
import { BI } from '../constants/images.js';
import { VIDEO_VERIFICATION_GEL } from '../constants/config.js';
import { IconVideo, IconCheck } from '../components/icons/Icons.jsx';
import HoverBtn from '../components/ui/HoverBtn.jsx';
import Footer from '../components/layout/Footer.jsx';
import SEO from '../components/SEO.jsx';
import { pageMeta, breadcrumbSchema } from '../utils/seo.js';

// ── VIDEO VERIFICATION PAGE ──────────────────────────────────────────────────
export default function VideoVerificationPage({setPage,L,mobile}) {
  return (
    <div style={{paddingTop:mobile?52:80,background:C.cream}}>
      <SEO {...pageMeta("video-verification")} schema={breadcrumbSchema([{name:"Home",url:"/"},{name:"Video Verification"}])} />
      {/* HERO */}
      <div style={{background:C.black,padding:mobile?"48px 0":"72px 0"}}>
        <div style={{maxWidth:900,margin:"0 auto",padding:mobile?"0 16px":"0 40px",textAlign:"center"}}>
          <p style={{...T.labelSm,color:C.tan,marginBottom:18}}>Extra Service</p>
          <h1 style={{...T.displayLg,color:C.white,marginBottom:20}}>Video Verification</h1>
          <p style={{...T.body,color:C.lgray,maxWidth:560,margin:"0 auto",lineHeight:1.9}}>
            See your exact item before it ships. Our team creates a detailed video walkthrough and sends it directly to your WhatsApp.
          </p>
        </div>
      </div>

      {/* IMAGE + INTRO */}
      <div style={{maxWidth:1360,margin:"0 auto",padding:mobile?"40px 16px":"64px 40px"}}>
        <div style={{display:"grid",gridTemplateColumns:mobile?"1fr":"1fr 1fr",gap:mobile?32:72,alignItems:"center"}}>
          <div style={{position:"relative",height:mobile?240:400,overflow:"hidden"}}>
            <img src={BI.store_interior} alt="Video verification service at Alternative" loading="lazy" style={{width:"100%",height:"100%",objectFit:"cover"}}/>
            <div style={{position:"absolute",inset:0,background:"rgba(25,25,25,0.28)"}}/>
            <div style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",width:60,height:60,borderRadius:"50%",border:"2px solid rgba(255,255,255,0.8)",display:"flex",alignItems:"center",justifyContent:"center"}}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="rgba(255,255,255,0.9)"><polygon points="5 3 19 12 5 21 5 3"/></svg>
            </div>
          </div>
          <div>
            <p style={{...T.labelSm,color:C.tan,marginBottom:14}}>Why Video Verification?</p>
            <h2 style={{...T.displayMd,color:C.black,marginBottom:16,lineHeight:1.2}}>Complete transparency before every shipment.</h2>
            <p style={{...T.body,color:C.gray,lineHeight:1.9,marginBottom:24}}>
              When you add Video Verification to your order, our team inspects your item before it ships to Georgia.
              They create detailed photo and video material showing the exact condition of your piece — so you know exactly what you're receiving.
            </p>
            <div style={{padding:"16px 20px",background:C.offwhite,borderLeft:`3px solid ${C.tan}`,marginBottom:24}}>
              <p style={{...T.label,color:C.black,fontSize:13,marginBottom:4}}>+ GEL {VIDEO_VERIFICATION_GEL}</p>
              <p style={{...T.bodySm,color:C.gray,fontSize:12}}>Added at checkout. One-time fee per order.</p>
            </div>
            <HoverBtn onClick={()=>setPage("catalog")} variant="primary">Shop Collection</HoverBtn>
          </div>
        </div>
      </div>

      {/* WHAT WE CHECK */}
      <div style={{background:C.offwhite,padding:mobile?"48px 0":"72px 0"}}>
        <div style={{maxWidth:900,margin:"0 auto",padding:mobile?"0 16px":"0 40px"}}>
          <div style={{textAlign:"center",marginBottom:mobile?32:48}}>
            <p style={{...T.labelSm,color:C.tan,marginBottom:10}}>What We Inspect</p>
            <h2 style={{...T.displayMd,color:C.black}}>Every detail, verified on camera.</h2>
          </div>
          <div style={{display:"grid",gridTemplateColumns:mobile?"1fr":"1fr 1fr 1fr",gap:3}}>
            {[
              {title:"Overall Condition",desc:"Full 360° walkthrough of the item. We show the overall build, structure, and finish from every angle."},
              {title:"Hardware & Details",desc:"Close-up footage of zippers, buckles, clasps, buttons, and all metal hardware — checking for flaws and finish quality."},
              {title:"Stitching & Materials",desc:"Detailed inspection of stitching consistency, leather grain, fabric texture, and lining quality."},
            ].map((item,i)=>(
              <div key={i} style={{background:C.cream,padding:mobile?"24px 20px":"32px 24px"}}>
                <div style={{width:40,height:40,borderRadius:"50%",background:C.black,display:"flex",alignItems:"center",justifyContent:"center",marginBottom:16}}>
                  <IconCheck size={18} color={C.tan} stroke={2}/>
                </div>
                <h3 style={{...T.heading,color:C.black,marginBottom:8,fontSize:14}}>{item.title}</h3>
                <p style={{...T.bodySm,color:C.gray,lineHeight:1.7}}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* HOW IT WORKS STEPS */}
      <div style={{padding:mobile?"48px 0":"72px 0"}}>
        <div style={{maxWidth:900,margin:"0 auto",padding:mobile?"0 16px":"0 40px"}}>
          <div style={{textAlign:"center",marginBottom:mobile?32:48}}>
            <p style={{...T.labelSm,color:C.tan,marginBottom:10}}>The Process</p>
            <h2 style={{...T.displayMd,color:C.black}}>How it works</h2>
          </div>
          {[
            {n:"01",t:"Add at Checkout",body:"Select Video Verification when placing your order. The fee is added to your total."},
            {n:"02",t:"Item Inspection",body:"After sourcing, your item is inspected by our verification team before shipping."},
            {n:"03",t:"Photo & Video Created",body:"Detailed photos and video are taken showing: overall condition, hardware & details, stitching & materials."},
            {n:"04",t:"Media Sent to You",body:"The full photo and video package is sent directly to your WhatsApp and email for review."},
            {n:"05",t:"You Approve, We Ship",body:"Only after your approval does the item ship to Georgia. If you're not satisfied, we work with you on a resolution."},
          ].map((s,i)=>(
            <div key={i} style={{display:"grid",gridTemplateColumns:mobile?"48px 1fr":"72px 1fr",gap:mobile?20:44,marginBottom:40,paddingBottom:40,borderBottom:i<4?`1px solid ${C.lgray}`:"none"}}>
              <div style={{textAlign:"right",paddingTop:4}}>
                <span style={{...T.displayMd,fontSize:48,color:C.tan,lineHeight:1}}>{s.n}</span>
              </div>
              <div>
                <h3 style={{...T.heading,color:C.black,marginBottom:8,fontSize:16}}>{s.t}</h3>
                <p style={{...T.body,color:C.gray,lineHeight:1.9}}>{s.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div style={{background:C.black,padding:mobile?"48px 0":"64px 0"}}>
        <div style={{maxWidth:700,margin:"0 auto",padding:mobile?"0 16px":"0 40px",textAlign:"center"}}>
          <div style={{width:56,height:56,borderRadius:"50%",border:`2px solid ${C.tan}`,display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 20px"}}>
            <IconVideo size={24} color={C.tan} stroke={1.8}/>
          </div>
          <h2 style={{...T.displayMd,color:C.white,marginBottom:14,lineHeight:1.2}}>Never wonder what you're getting.</h2>
          <p style={{...T.body,color:C.lgray,lineHeight:1.9,marginBottom:32,maxWidth:480,margin:"0 auto 32px"}}>
            Add Video Verification to any order for GEL {VIDEO_VERIFICATION_GEL}. Available at checkout on every product.
          </p>
          <HoverBtn onClick={()=>setPage("catalog")} variant="tan">Start Shopping</HoverBtn>
        </div>
      </div>

      <Footer setPage={setPage} L={L} mobile={mobile}/>
    </div>
  );
}
