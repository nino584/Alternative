import { useState } from 'react';
import { C, T } from '../constants/theme.js';
import { BI } from '../constants/images.js';
import { VIDEO_VERIFICATION_GEL, DEMO_VIDEO_URL } from '../constants/config.js';
import { IconVideo, IconCheck } from '../components/icons/Icons.jsx';
import HoverBtn from '../components/ui/HoverBtn.jsx';
import Footer from '../components/layout/Footer.jsx';
import SEO from '../components/SEO.jsx';
import { pageMeta, breadcrumbSchema } from '../utils/seo.js';

// ── VIDEO VERIFICATION PAGE ──────────────────────────────────────────────────
export default function VideoVerificationPage({setPage,L,mobile}) {
  const [playing,setPlaying]=useState(false);

  return (
    <div style={{paddingTop:mobile?78:104,background:C.cream}}>
      <SEO {...pageMeta("video-verification")} schema={breadcrumbSchema([{name:"Home",url:"/"},{name:"Video Verification"}])} />
      {/* HERO */}
      <div style={{background:C.black,padding:mobile?"48px 0":"80px 0"}}>
        <div style={{maxWidth:900,margin:"0 auto",padding:mobile?"0 16px":"0 40px",textAlign:"center"}}>
          <p style={{...T.labelSm,color:C.tan,marginBottom:18,letterSpacing:"0.2em"}}>{L.vvHeroLabel}</p>
          <h1 style={{...T.displayLg,color:C.white,marginBottom:20,lineHeight:1.15}}>{L.vvHeroTitle}</h1>
          <p style={{...T.body,color:C.lgray,maxWidth:600,margin:"0 auto",lineHeight:1.9}}>
            {L.vvHeroBody}
          </p>
          <p style={{...T.labelSm,color:C.tan,marginTop:28,letterSpacing:"0.2em",fontSize:10}}>{L.vvHeroTagline}</p>
        </div>
      </div>

      {/* VIDEO PLAYER + INTRO */}
      <div style={{maxWidth:1360,margin:"0 auto",padding:mobile?"40px 16px":"64px 40px"}}>
        <div style={{display:"grid",gridTemplateColumns:mobile?"1fr":"1fr 1fr",gap:mobile?32:72,alignItems:"center"}}>
          {/* Video Player */}
          <div style={{position:"relative",overflow:"hidden",background:C.black,aspectRatio:"9/16",maxHeight:mobile?380:520,margin:"0 auto",width:mobile?"100%":"auto",maxWidth:mobile?"280px":"300px",borderRadius:4}}>
            {!playing?(
              <>
                <img src="/images/about-hero.jpg" alt="Video verification demo" loading="lazy" style={{width:"100%",height:"100%",objectFit:"cover",opacity:0.6}}/>
                <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:16}}>
                  <button onClick={()=>setPlaying(true)} aria-label="Play demo video"
                    style={{width:72,height:72,borderRadius:"50%",border:"2px solid rgba(255,255,255,0.85)",background:"rgba(0,0,0,0.3)",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",transition:"all 0.3s",backdropFilter:"blur(4px)"}}>
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="rgba(255,255,255,0.95)"><polygon points="6 3 20 12 6 21 6 3"/></svg>
                  </button>
                  <p style={{...T.labelSm,color:"rgba(255,255,255,0.85)",fontSize:10,letterSpacing:"0.15em"}}>{L.vvWatchSample}</p>
                </div>
              </>
            ):(
              <video
                src={DEMO_VIDEO_URL}
                autoPlay playsInline controls
                style={{width:"100%",height:"100%",objectFit:"cover"}}
                onEnded={()=>setPlaying(false)}
              />
            )}
          </div>

          <div>
            <p style={{...T.labelSm,color:C.tan,marginBottom:14,letterSpacing:"0.18em"}}>{L.vvHowLabel}</p>
            <h2 style={{...T.displayMd,color:C.black,marginBottom:16,lineHeight:1.2}}>{L.vvHowTitle}</h2>
            <p style={{...T.body,color:C.gray,lineHeight:1.9,marginBottom:24}}>
              {L.vvHowBody}
            </p>

            {/* Sample verification badge */}
            <div style={{padding:"14px 18px",background:"rgba(177,154,122,0.08)",border:`1px solid rgba(177,154,122,0.2)`,marginBottom:20,display:"flex",alignItems:"center",gap:12}}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={C.tan} strokeWidth="1.5"><rect x="2" y="3" width="20" height="14" rx="2"/><polygon points="10 8 16 10 10 12 10 8"/><line x1="2" y1="20" x2="22" y2="20"/></svg>
              <div>
                <p style={{...T.labelSm,color:C.black,fontSize:11}}>{L.vvWatchBadge}</p>
                <p style={{...T.bodySm,color:C.gray,fontSize:11}}>{L.vvWatchBadgeSub}</p>
              </div>
            </div>

            <div style={{padding:"16px 20px",background:C.offwhite,borderLeft:`3px solid ${C.tan}`,marginBottom:24}}>
              <p style={{...T.label,color:C.black,fontSize:13,marginBottom:4}}>+ GEL {VIDEO_VERIFICATION_GEL}</p>
              <p style={{...T.bodySm,color:C.gray,fontSize:12}}>{L.vvPriceNote}</p>
            </div>
            <HoverBtn onClick={()=>setPage("catalog")} variant="primary">{L.vvShopCollection}</HoverBtn>
          </div>
        </div>
      </div>

      {/* WHAT WE CHECK */}
      <div style={{background:C.offwhite,padding:mobile?"48px 0":"72px 0"}}>
        <div style={{maxWidth:900,margin:"0 auto",padding:mobile?"0 16px":"0 40px"}}>
          <div style={{textAlign:"center",marginBottom:mobile?32:48}}>
            <p style={{...T.labelSm,color:C.tan,marginBottom:10}}>{L.vvInspectLabel}</p>
            <h2 style={{...T.displayMd,color:C.black}}>{L.vvInspectTitle}</h2>
          </div>
          <div style={{display:"grid",gridTemplateColumns:mobile?"1fr":"1fr 1fr 1fr",gap:3}}>
            {[
              {title:L.vvCheck1Title,desc:L.vvCheck1Desc,icon:<path d="M1 6.5V1h5.5M17.5 1H23v5.5M23 17.5V23h-5.5M6.5 23H1v-5.5"/>},
              {title:L.vvCheck2Title,desc:L.vvCheck2Desc,icon:<><circle cx="12" cy="12" r="3"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></>},
              {title:L.vvCheck3Title,desc:L.vvCheck3Desc,icon:<><path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"/></>},
            ].map((item,i)=>(
              <div key={i} style={{background:C.cream,padding:mobile?"24px 20px":"32px 24px"}}>
                <div style={{width:40,height:40,borderRadius:"50%",background:C.black,display:"flex",alignItems:"center",justifyContent:"center",marginBottom:16}}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={C.tan} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">{item.icon}</svg>
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
            <p style={{...T.labelSm,color:C.tan,marginBottom:10}}>{L.vvProcessLabel}</p>
            <h2 style={{...T.displayMd,color:C.black}}>{L.vvProcessTitle}</h2>
          </div>
          {[
            {n:"01",t:L.vvStep1,body:L.vvStep1Body},
            {n:"02",t:L.vvStep2,body:L.vvStep2Body},
            {n:"03",t:L.vvStep3,body:L.vvStep3Body},
            {n:"04",t:L.vvStep4,body:L.vvStep4Body},
            {n:"05",t:L.vvStep5,body:L.vvStep5Body},
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
          <h2 style={{...T.displayMd,color:C.white,marginBottom:14,lineHeight:1.2}}>{L.vvCtaTitle}</h2>
          <p style={{...T.body,color:C.lgray,lineHeight:1.9,maxWidth:480,margin:"0 auto 24px"}}>
            {L.vvCtaBody} GEL {VIDEO_VERIFICATION_GEL}.
          </p>
          <p style={{...T.labelSm,color:C.tan,marginBottom:28,letterSpacing:"0.18em",fontSize:9}}>{L.vvHeroTagline}</p>
          <HoverBtn onClick={()=>setPage("catalog")} variant="tan">{L.vvStartShopping}</HoverBtn>
        </div>
      </div>

      <Footer setPage={setPage} L={L} mobile={mobile}/>
    </div>
  );
}
