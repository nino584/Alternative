import { useState, useEffect } from 'react';
import { C, T } from '../constants/theme.js';
import { BI, HERO_IMAGE } from '../constants/images.js';
import { PRODUCTS } from '../constants/data.js';
import { IconCheck, IconPackage, IconVideo } from '../components/icons/Icons.jsx';
import HoverBtn from '../components/ui/HoverBtn.jsx';
import ProductCard from '../components/ui/ProductCard.jsx';
import Footer from '../components/layout/Footer.jsx';
import SEO from '../components/SEO.jsx';
import { pageMeta } from '../utils/seo.js';

// ── HOMEPAGE ──────────────────────────────────────────────────────────────────
export default function HomePage({setPage,setSelected,L,mobile,products:productsProp,wishlist,onWishlist}) {
  const [vis,setVis]=useState(false);
  const [heroSrc,setHeroSrc]=useState(HERO_IMAGE);
  useEffect(()=>{const t=setTimeout(()=>setVis(true),80);return()=>clearTimeout(t);},[]);
  const f=(d)=>({opacity:vis?1:0,transform:vis?"none":"translateY(22px)",transition:`all 0.9s ease ${d}s`});
  const px=mobile?"16px":"40px";

  return (
    <div style={{background:C.cream}}>
      <SEO {...pageMeta("home")} />
      <section style={mobile?{minHeight:"100vh",display:"flex",flexDirection:"column",overflow:"hidden",position:"relative",paddingTop:60}:{height:"100vh",display:"grid",gridTemplateColumns:"1fr 1fr",overflow:"hidden",minHeight:600,position:"relative"}}>
        {mobile&&(
          <div style={{height:280,overflow:"hidden",flexShrink:0}}>
            <img src={heroSrc} alt="Alternative" onError={()=>setHeroSrc(BI.bag_stone)} style={{width:"100%",height:"100%",objectFit:"cover",opacity:vis?1:0,transition:"opacity 1.2s ease"}}/>
            <div style={{position:"absolute",top:60,left:0,right:0,height:280,background:"rgba(25,25,25,0.06)"}}/>
          </div>
        )}
        <div style={{display:"flex",flexDirection:"column",justifyContent:mobile?"flex-start":"flex-end",padding:mobile?"32px 20px 40px":"0  clamp(32px,5vw,60px) 80px",position:"relative",zIndex:1,flex:mobile?1:undefined,background:C.heroBg}}>
          <div style={{...f(0)}}>
            <p style={{fontFamily:"'TT Interphases Pro',sans-serif",fontSize:mobile?10:11,fontWeight:400,letterSpacing:"0.12em",textTransform:"uppercase",color:C.heroSub,marginBottom:mobile?14:20,display:"flex",alignItems:"center",gap:10}}><span style={{display:"inline-block",width:24,height:1,background:C.heroSub}}/>{L.heroSub}</p>
          </div>
          <div style={f(0.15)}>
            <h1 style={{fontFamily:"'Alido',serif",fontSize:mobile?"2.5rem":"4.5rem",fontWeight:400,lineHeight:1.1,letterSpacing:"-0.01em",color:C.heroHeadline,marginBottom:mobile?6:14}}>Always</h1>
            <h1 style={{fontFamily:"'Alido',serif",fontSize:mobile?"2.5rem":"4.5rem",fontWeight:400,lineHeight:1.1,letterSpacing:"-0.01em",color:C.heroHeadline,marginBottom:mobile?6:14}}>Choose</h1>
            <h1 style={{fontFamily:"'Alido',serif",fontSize:mobile?"2.2rem":"4rem",fontWeight:400,lineHeight:1.1,letterSpacing:"-0.01em",color:C.heroTan,marginBottom:mobile?22:32}}>Alternative.</h1>
          </div>
          <div style={f(0.3)}>
            {(L.heroBody||"").split("\n").filter(Boolean).map((line,i)=>(
              <p key={i} style={{fontFamily:"'TT Interphases Pro',sans-serif",fontWeight:400,color:C.heroBody,maxWidth:380,marginBottom:i===0?4:0,marginTop:i===0?0:2,fontSize:mobile?14:16,lineHeight:1.7}}>{line}</p>
            ))}
            <div style={{marginBottom:mobile?22:30}}/>
          </div>
          <div style={{...f(0.45),display:"flex",gap:mobile?10:14,flexDirection:mobile?"column":"row"}}>
            <HoverBtn onClick={()=>setPage("catalog")} variant="primary" style={{...mobile?{width:"100%"}:{},textTransform:"uppercase",fontSize:11,letterSpacing:"0.14em",padding:"14px 32px",background:C.heroBtnDark,color:C.white,border:"none",fontFamily:"'TT Interphases Pro',sans-serif"}}>{L.heroCta1}</HoverBtn>
            <HoverBtn onClick={()=>setPage("how")} variant="secondary" style={{...mobile?{width:"100%"}:{},textTransform:"uppercase",fontSize:11,letterSpacing:"0.14em",padding:"13px 31px",background:"transparent",color:C.heroOutline,border:`1px solid ${C.heroOutline}`,fontFamily:"'TT Interphases Pro',sans-serif"}}>{L.heroCta2}</HoverBtn>
          </div>
        </div>
        {!mobile&&(
          <div style={{position:"relative",overflow:"hidden",background:C.heroRightBg}}>
            <img src={heroSrc} alt="Alternative" onError={()=>setHeroSrc(BI.bag_stone)} style={{width:"100%",height:"100%",objectFit:"cover",objectPosition:"center center",opacity:vis?1:0,transform:vis?"scale(1)":"scale(1.04)",transition:"opacity 1.2s ease, transform 1.4s ease"}}/>
            <div style={{position:"absolute",inset:0,background:"rgba(25,25,25,0.04)"}}/>
          </div>
        )}
      </section>

      <section style={{background:C.black}}>
        <div style={{maxWidth:1360,margin:"0 auto",padding:`0 ${px}`}}>
          <div style={mobile?{display:"grid",gridTemplateColumns:"1fr 1fr",gap:0}:{display:"grid",gridTemplateColumns:"repeat(4,1fr)"}}>
            {[
              {Icon:IconCheck,t:L&&L.trust1||"Quality Guaranteed"},
              {Icon:IconPackage,t:L&&L.trust2||"15 New Products Daily"},
              {Icon:IconPackage,t:L&&L.trust3||"Delivery in 10–18 Days"},
              {Icon:IconVideo,t:L&&L.trust4||"Optional Video Verification"},
            ].map((item,i)=>(
              <div key={i} style={{padding:mobile?"14px 12px":"22px 20px",borderRight:mobile?(i%2===0?`1px solid rgba(177,154,122,0.12)`:"none"):(i<3?`1px solid rgba(177,154,122,0.12)`:"none"),borderBottom:mobile&&i<2?`1px solid rgba(177,154,122,0.12)`:"none",display:"flex",alignItems:"center",gap:8}}>
                <item.Icon size={mobile?14:16} color={C.tan} style={{flexShrink:0}}/>
                <span style={{...T.bodySm,color:C.lgray,lineHeight:1.5,fontSize:mobile?10:12}}>{item.t}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{padding:mobile?"32px 0 28px":"64px 0 56px"}}>
        <div style={{maxWidth:1360,margin:"0 auto",padding:`0 ${px}`}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",marginBottom:mobile?28:44}}>
            <div><p style={{...T.labelSm,color:C.tan,marginBottom:10}}>{L.featuredLabel}</p><h2 style={{...T.displayMd,color:C.black,fontSize:mobile?"clamp(22px,6vw,32px)":undefined}}>{L.featuredTitle}</h2></div>
            <button onClick={()=>setPage("catalog")} style={{background:"none",border:"none",...T.bodySm,color:C.gray,textDecoration:"underline",cursor:"pointer",fontSize:mobile?11:undefined}}>View all →</button>
          </div>
          <div style={{display:"grid",gridTemplateColumns:mobile?"1fr 1fr":"repeat(3,1fr)",gap:3}}>
            {(productsProp||PRODUCTS).slice(0,mobile?4:3).map(p=><ProductCard key={p.id} product={p} onSelect={()=>{setPage("product",p);}} wishlist={wishlist} onWishlist={onWishlist} L={L} mobile={mobile}/>)}
          </div>
        </div>
      </section>

      <section style={{padding:mobile?"0 0 48px":"0 0 88px"}}>
        <div style={{maxWidth:1360,margin:"0 auto",padding:`0 ${px}`}}>
          <p style={{...T.labelSm,color:C.tan,marginBottom:10}}>{L.shopBy}</p>
          <h2 style={{...T.displayMd,color:C.black,marginBottom:mobile?28:44,fontSize:mobile?"clamp(22px,6vw,32px)":undefined}}>{L.collections}</h2>
          <div style={{display:"grid",gridTemplateColumns:mobile?"1fr":"1fr 1fr 1fr",gap:3}}>
            {[{name:L.womenswear,section:"Womenswear",src:BI.bag_stone,sub:L.womensSub},{name:L.menswear,section:"Menswear",src:BI.man_editorial,sub:L.mensSub},{name:L.kidswear,section:"Kidswear",src:BI.packaging,sub:L.kidsSub}].map((cat,i)=>(
              <div key={i} onClick={()=>{window.__initSection=cat.section;setPage("catalog");}} style={{position:"relative",height:mobile?260:420,cursor:"pointer",overflow:"hidden"}}>
                <img src={cat.src} alt={`${cat.name} collection at Alternative`} loading="lazy" style={{width:"100%",height:"100%",objectFit:"cover",objectPosition:"top center"}}/>
                <div style={{position:"absolute",inset:0,background:"linear-gradient(to top, rgba(25,25,25,0.62) 0%, transparent 52%)"}}/>
                <div style={{position:"absolute",bottom:mobile?16:24,left:mobile?16:24}}>
                  <p style={{...T.displaySm,color:C.white,marginBottom:4,fontSize:mobile?18:undefined}}>{cat.name}</p>
                  <p style={{...T.labelSm,color:"rgba(255,255,255,0.65)",fontSize:8}}>{cat.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{background:C.black,padding:mobile?"48px 0":"72px 0"}}>
        <div style={{maxWidth:1360,margin:"0 auto",padding:`0 ${px}`,display:"grid",gridTemplateColumns:mobile?"1fr":"1fr 1fr",gap:mobile?32:72,alignItems:"center"}}>
          <div style={{position:"relative",height:mobile?220:380,overflow:"hidden",order:mobile?1:0}}>
            <img src={BI.store_interior} alt="Video verification service at Alternative" loading="lazy" style={{width:"100%",height:"100%",objectFit:"cover"}}/>
            <div style={{position:"absolute",inset:0,background:"rgba(25,25,25,0.28)"}}/>
            <div style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",width:50,height:50,borderRadius:"50%",border:"2px solid rgba(255,255,255,0.8)",display:"flex",alignItems:"center",justifyContent:"center"}}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="rgba(255,255,255,0.9)"><polygon points="5 3 19 12 5 21 5 3"/></svg>
            </div>
          </div>
          <div style={{order:mobile?0:1}}>
            <span style={{...T.labelSm,display:"inline-block",color:C.tan,marginBottom:mobile?12:18,padding:"4px 12px",border:`1px solid ${C.tan}`,fontSize:9}}>{L.extraService}</span>
            <h2 style={{...T.displayMd,color:C.white,marginBottom:mobile?14:20,lineHeight:1.2,fontSize:mobile?"clamp(20px,5vw,28px)":undefined}}>{L.videoTitle}</h2>
            <p style={{...T.body,color:C.lgray,lineHeight:1.9,marginBottom:mobile?24:36,fontSize:mobile?13:undefined}}>{L.videoBody}</p>
            <HoverBtn onClick={()=>setPage("video-verification")} variant="tan">{L.shopAddService}</HoverBtn>
          </div>
        </div>
      </section>

      <section style={{background:C.black,padding:mobile?"48px 0":"72px 0",borderTop:`1px solid rgba(177,154,122,0.1)`}}>
        <div style={{maxWidth:1360,margin:"0 auto",padding:`0 ${px}`,display:"grid",gridTemplateColumns:mobile?"1fr":"1fr 1fr",gap:mobile?32:72,alignItems:"center"}}>
          <div>
            <p style={{...T.labelSm,color:C.tan,marginBottom:mobile?14:20}}>{L.verifyLabel||"Quality assurance"}</p>
            <h2 style={{...T.displayMd,color:C.white,marginBottom:mobile?16:24,lineHeight:1.2,fontSize:mobile?"clamp(20px,5vw,28px)":undefined}}>{L.verifyTitle||"Every item is verified before it reaches you."}</h2>
            <p style={{...T.body,color:C.lgray,lineHeight:1.9,marginBottom:mobile?24:36,fontSize:mobile?13:undefined}}>{L.verifyBody||"Our dedicated team physically handles every piece — checking hardware, stitching, and material quality — before it ships. What we verify is what arrives."}</p>
            <div style={{display:"flex",gap:mobile?24:40}}>
              {[["50+",L.itemsVerified],["98%",L.custSatisfaction],["4.9",L.avgRating]].map(([n,l])=>(
                <div key={n}><p style={{fontFamily:"'Alido',serif",fontSize:mobile?24:30,fontWeight:300,color:C.tan,lineHeight:1}}>{n}</p><p style={{...T.labelSm,color:C.lgray,marginTop:5,fontSize:8}}>{l}</p></div>
              ))}
            </div>
          </div>
          <div style={{height:mobile?220:380,overflow:"hidden",position:"relative"}}>
            <img src={BI.bag_stone} alt="Trusted sourcing and quality verification" loading="lazy" style={{width:"100%",height:"100%",objectFit:"cover"}}/>
            <div style={{position:"absolute",inset:0,background:"rgba(25,25,25,0.15)"}}/>
          </div>
        </div>
      </section>

      <Footer setPage={setPage} L={L} mobile={mobile}/>
    </div>
  );
}
