import { useState, useEffect } from 'react';
import { C, T, S } from '../constants/theme.js';
import { BI, HERO_IMAGE } from '../constants/images.js';
import { PRODUCTS } from '../constants/data.js';
import { IconShield, IconPackage, IconVideo, IconDiamond } from '../components/icons/Icons.jsx';
import HoverBtn from '../components/ui/HoverBtn.jsx';
import ProductCard from '../components/ui/ProductCard.jsx';
import Footer from '../components/layout/Footer.jsx';
import SEO from '../components/SEO.jsx';
import { pageMeta } from '../utils/seo.js';
import useInView from '../hooks/useInView.js';

// ── SEASON HELPER ─────────────────────────────────────────────────────────────
function getSeasonLabel(lang) {
  const now = new Date();
  const m = now.getMonth(); // 0-11
  const y = now.getFullYear();
  // Feb–Jul = SS, Aug–Jan = FW
  const isSS = m >= 1 && m <= 6;
  const seasonYear = m === 0 ? y - 1 : y; // Jan counts as prev year's FW
  if (lang === "ka") return isSS ? `გაზაფხული / ზაფხული ${y}` : `შემოდგომა / ზამთარი ${isSS ? y : (m === 0 ? y : y)}`;
  if (lang === "ru") return isSS ? `ВЕСНА / ЛЕТО ${y}` : `ОСЕНЬ / ЗИМА ${m === 0 ? y : y}`;
  return isSS ? `SPRING / SUMMER ${y}` : `FALL / WINTER ${m === 0 ? y : y}`;
}

// ── HOMEPAGE ──────────────────────────────────────────────────────────────────
const DEMO_VIDEO_URL = "https://cdn.shopify.com/videos/c/o/v/87c0928e89c34bdfb4e4fefc45f14cb2.mp4";

export default function HomePage({setPage,setSelected,L,lang,mobile,products:productsProp,wishlist,onWishlist}) {
  const [vis,setVis]=useState(false);
  const [heroSrc,setHeroSrc]=useState(HERO_IMAGE);
  const [vidPlaying,setVidPlaying]=useState(false);
  useEffect(()=>{const t=setTimeout(()=>setVis(true),80);return()=>clearTimeout(t);},[]);
  const f=(d)=>({opacity:vis?1:0,transform:vis?"none":"translateY(22px)",transition:`all 0.9s cubic-bezier(0.25,0.46,0.45,0.94) ${d}s`});
  const px=mobile?"16px":"40px";

  const [featRef, featVis] = useInView();
  const [colRef, colVis] = useInView();
  const [vidRef, vidVis] = useInView();
  const [qualRef, qualVis] = useInView();

  return (
    <div style={{background:C.cream}}>
      <SEO {...pageMeta("home")} />

      {/* ── HERO ───────────────────────────────────────────────────────────── */}
      <section style={mobile?{minHeight:"100vh",display:"flex",flexDirection:"column",overflow:"hidden",position:"relative",paddingTop:60}:{height:"100vh",display:"grid",gridTemplateColumns:"1fr 1fr",overflow:"hidden",minHeight:600,position:"relative"}}>
        {mobile&&(
          <div style={{height:280,overflow:"hidden",flexShrink:0}}>
            <img src={heroSrc} alt="Alternative luxury pre-order fashion" fetchpriority="high" onError={()=>setHeroSrc(BI.bag_stone)} style={{width:"100%",height:"100%",objectFit:"cover",opacity:vis?1:0,transition:"opacity 1.2s ease"}}/>
            <div style={{position:"absolute",top:60,left:0,right:0,height:280,background:"rgba(25,25,25,0.06)"}}/>
          </div>
        )}
        <div style={{display:"flex",flexDirection:"column",justifyContent:mobile?"flex-start":"flex-end",padding:mobile?"32px 20px 40px":"0  clamp(32px,5vw,60px) 80px",position:"relative",zIndex:1,flex:mobile?1:undefined,background:C.heroBg}}>
          <div style={{...f(0)}}>
            <p style={{fontFamily:"'TT Interphases Pro',sans-serif",fontSize:13,fontWeight:400,letterSpacing:"0.15em",textTransform:"uppercase",color:C.heroSub,marginBottom:mobile?14:20,display:"flex",alignItems:"center",gap:12}}>
              <span style={{display:"inline-block",width:28,height:1,background:`linear-gradient(90deg,transparent,${C.heroSub})`}}/>{getSeasonLabel(lang)}
            </p>
          </div>
          <div style={f(0.15)}>
            <h1 style={{fontFamily:"'Alido',serif",fontSize:mobile?"2.5rem":"4.5rem",fontWeight:400,lineHeight:1.1,letterSpacing:"-0.01em",color:C.heroHeadline,marginBottom:mobile?6:14}}>Always</h1>
            <h1 style={{fontFamily:"'Alido',serif",fontSize:mobile?"2.5rem":"4.5rem",fontWeight:400,lineHeight:1.1,letterSpacing:"-0.01em",color:C.heroHeadline,marginBottom:mobile?6:14}}>Choose</h1>
            <h1 style={{fontFamily:"'Alido',serif",fontSize:mobile?"2.2rem":"4rem",fontWeight:400,lineHeight:1.1,letterSpacing:"-0.01em",color:C.heroTan,marginBottom:mobile?22:32}}>Alternative.</h1>
          </div>
          <div style={f(0.3)}>
            {(L.heroBody||"").split("\n").filter(Boolean).map((line,i)=>(
              <p key={i} style={{fontFamily:"'Alido',serif",fontWeight:400,color:C.heroBody,maxWidth:380,marginBottom:i===0?4:0,marginTop:i===0?0:2,fontSize:mobile?14:16,lineHeight:1.7}}>{line}</p>
            ))}
            <div style={{marginBottom:mobile?22:30}}/>
          </div>
          <div style={{...f(0.45),display:"flex",gap:mobile?10:14,flexDirection:mobile?"column":"row"}}>
            <HoverBtn onClick={()=>setPage("catalog")} variant="shimmer" style={{...mobile?{width:"100%"}:{},textTransform:"uppercase",fontSize:11,letterSpacing:"0.14em",padding:"15px 34px",background:C.heroBtnDark,color:"#fff",border:"none",fontFamily:"'TT Interphases Pro',sans-serif"}}>{L.heroCta1}</HoverBtn>
            <HoverBtn onClick={()=>setPage("how")} variant="lines" style={{...mobile?{width:"100%",justifyContent:"center",display:"flex"}:{display:"inline-flex",alignItems:"center",justifyContent:"center"},textTransform:"uppercase",fontSize:11,letterSpacing:"0.14em",padding:"15px 34px",color:C.heroOutline,fontFamily:"'TT Interphases Pro',sans-serif"}}>{L.heroCta2}</HoverBtn>
          </div>
        </div>
        {!mobile&&(
          <div style={{position:"relative",overflow:"hidden",background:C.heroRightBg}}>
            <img src={heroSrc} alt="Alternative luxury pre-order fashion" fetchpriority="high" onError={()=>setHeroSrc(BI.bag_stone)} style={{width:"100%",height:"100%",objectFit:"cover",objectPosition:"center center",opacity:vis?1:0,transform:vis?"scale(1)":"scale(1.04)",transition:"opacity 1.2s ease, transform 1.6s cubic-bezier(0.25,0.46,0.45,0.94)"}}/>
            <div style={{position:"absolute",inset:0,background:"rgba(25,25,25,0.04)"}}/>
          </div>
        )}
      </section>

      {/* ── TRUST BAR ──────────────────────────────────────────────────────── */}
      <section style={{background:C.black,padding:mobile?"18px 0":"22px 0"}}>
        <div style={{maxWidth:1360,margin:"0 auto",padding:`0 ${px}`,display:"flex",justifyContent:mobile?"center":"space-between",alignItems:"center",flexWrap:"wrap",gap:mobile?16:24}}>
          {[
            {Icon:IconShield,t:L&&L.trust1||"Quality Guaranteed"},
            {Icon:IconDiamond,t:L&&L.trust2||"15 New Products Daily"},
            {Icon:IconPackage,t:L&&L.trust3||"Delivery in 10–18 Days"},
            {Icon:IconVideo,t:L&&L.trust4||"Optional Video Verification"},
          ].map((item,i)=>(
            <div key={i} style={{display:"flex",alignItems:"center",gap:8}}>
              <item.Icon size={14} color="rgba(177,154,122,0.5)" style={{flexShrink:0}}/>
              <span style={{fontFamily:"'TT Interphases Pro',sans-serif",fontSize:11,fontWeight:400,letterSpacing:"0.08em",textTransform:"uppercase",color:"rgba(212,208,200,0.6)"}}>{item.t}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURED PRODUCTS ──────────────────────────────────────────────── */}
      <section ref={featRef} className={`reveal${featVis?' visible':''}`} style={{padding:mobile?"36px 0 32px":"72px 0 64px"}}>
        <div style={{maxWidth:1360,margin:"0 auto",padding:`0 ${px}`}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",marginBottom:mobile?28:48}}>
            <div>
              <p style={{...T.labelSm,color:C.tan,marginBottom:10,letterSpacing:"0.14em"}}>{L.featuredLabel}</p>
              <h2 style={{...T.displayMd,color:C.black,fontSize:mobile?"clamp(22px,6vw,32px)":undefined}}>{L.featuredTitle}</h2>
            </div>
            <button onClick={()=>setPage("catalog")} className="luxury-link" style={{background:"none",border:"none",...T.bodySm,color:C.gray,cursor:"pointer",padding:"4px 0",fontSize:13}}>View all →</button>
          </div>
          <div style={{display:"grid",gridTemplateColumns:mobile?"1fr 1fr":"repeat(3,1fr)",gap:mobile?10:3}}>
            {(productsProp||PRODUCTS).slice(0,mobile?4:3).map(p=><ProductCard key={p.id} product={p} onSelect={()=>{setPage("product",p);}} wishlist={wishlist} onWishlist={onWishlist} L={L} mobile={mobile}/>)}
          </div>
        </div>
      </section>

      {/* ── COLLECTIONS ────────────────────────────────────────────────────── */}
      <section ref={colRef} className={`reveal${colVis?' visible':''}`} style={{padding:mobile?"0 0 48px":"0 0 88px"}}>
        <div style={{maxWidth:1360,margin:"0 auto",padding:`0 ${px}`}}>
          <p style={{...T.labelSm,color:C.tan,marginBottom:10,letterSpacing:"0.14em"}}>{L.shopBy}</p>
          <h2 style={{...T.displayMd,color:C.black,marginBottom:mobile?28:48,fontSize:mobile?"clamp(22px,6vw,32px)":undefined}}>{L.collections}</h2>
          <div style={{display:"grid",gridTemplateColumns:mobile?"1fr":"1fr 1fr 1fr",gap:mobile?10:3}}>
            {[{name:L.womenswear,section:"Womenswear",src:BI.bag_stone,sub:L.womensSub},{name:L.menswear,section:"Menswear",src:BI.man_editorial,sub:L.mensSub},{name:L.kidswear,section:"Kidswear",src:BI.packaging,sub:L.kidsSub}].map((cat,i)=>(
              <div key={i} onClick={()=>{window.__initSection=cat.section;setPage("catalog");}}
                style={{position:"relative",height:mobile?260:420,cursor:"pointer",overflow:"hidden"}}
                onMouseEnter={e=>{const img=e.currentTarget.querySelector('img');if(img)img.style.transform="scale(1.05)";}}
                onMouseLeave={e=>{const img=e.currentTarget.querySelector('img');if(img)img.style.transform="scale(1)";}}>
                <img src={cat.src} alt={`${cat.name} collection at Alternative`} loading="lazy" style={{width:"100%",height:"100%",objectFit:"cover",objectPosition:"top center",transition:"transform 0.8s cubic-bezier(0.25,0.46,0.45,0.94)"}}/>
                <div style={{position:"absolute",inset:0,background:"linear-gradient(to top, rgba(25,25,25,0.65) 0%, rgba(25,25,25,0.1) 40%, transparent 60%)"}}/>
                <div style={{position:"absolute",bottom:mobile?18:28,left:mobile?18:28}}>
                  <p style={{fontFamily:"'Alido',serif",fontSize:mobile?20:24,fontWeight:400,color:"#fff",marginBottom:6,letterSpacing:"0.01em"}}>{cat.name}</p>
                  <p style={{fontFamily:"'TT Interphases Pro',sans-serif",fontSize:11,fontWeight:400,letterSpacing:"0.12em",textTransform:"uppercase",color:"rgba(255,255,255,0.75)"}}>{cat.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BRAND MARQUEE ───────────────────────────────────────────────────── */}
      <section style={{padding:mobile?"28px 0":"40px 0",overflow:"hidden",background:C.cream,borderTop:`1px solid rgba(177,154,122,0.08)`,borderBottom:`1px solid rgba(177,154,122,0.08)`}}>
        <div style={{textAlign:"center",marginBottom:mobile?16:24}}>
          <p style={{fontFamily:"'TT Interphases Pro',sans-serif",fontSize:9,fontWeight:500,letterSpacing:"0.2em",textTransform:"uppercase",color:C.tan,marginBottom:8}}>{L.ourDesigners||"OUR DESIGNERS"}</p>
          <div style={{width:32,height:1,background:"rgba(177,154,122,0.3)",margin:"0 auto"}}/>
        </div>
        <div style={{position:"relative",width:"100%",overflow:"hidden",maskImage:"linear-gradient(90deg,transparent,black 6%,black 94%,transparent)",WebkitMaskImage:"linear-gradient(90deg,transparent,black 6%,black 94%,transparent)"}}>
          <div style={{display:"flex",animation:"marqueeScroll 40s linear infinite",width:"max-content"}}>
            {[...Array(2)].map((_,setIdx)=>(
              <div key={setIdx} style={{display:"flex",alignItems:"center",flexShrink:0}}>
                {["Bottega Veneta","Saint Laurent","Loewe","Chloé","Brunello Cucinelli","Max Mara","Valentino","Tom Ford","Cartier","Gucci","Loro Piana","The Row","Moncler","Golden Goose"].map((brand,i)=>(
                  <div key={`${setIdx}-${i}`} style={{display:"flex",alignItems:"center",flexShrink:0}}>
                    <span style={{fontFamily:"'Alido',serif",fontSize:mobile?15:18,fontWeight:400,color:"rgba(25,25,25,0.35)",whiteSpace:"nowrap",padding:mobile?"0 20px":"0 32px",letterSpacing:"0.04em"}}>{brand}</span>
                    <span style={{color:"rgba(25,25,25,0.12)",fontSize:6,flexShrink:0}}>·</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── VIDEO VERIFICATION ─────────────────────────────────────────────── */}
      <section ref={vidRef} className={`reveal${vidVis?' visible':''}`} style={{background:C.black,padding:mobile?"48px 0":"80px 0"}}>
        <div style={{maxWidth:1360,margin:"0 auto",padding:`0 ${px}`,display:"grid",gridTemplateColumns:mobile?"1fr":"1fr 1fr",gap:mobile?32:80,alignItems:"center"}}>
          <div style={{position:"relative",height:mobile?220:400,overflow:"hidden",order:mobile?1:0,background:C.black}}>
            {!vidPlaying?(
              <>
                <img src={BI.store_interior} alt="Video verification service at Alternative" loading="lazy" style={{width:"100%",height:"100%",objectFit:"cover",opacity:0.55}}/>
                <button onClick={()=>setVidPlaying(true)} aria-label="Play demo video"
                  style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",width:64,height:64,borderRadius:"50%",border:"1px solid rgba(255,255,255,0.7)",background:"rgba(0,0,0,0.2)",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",transition:"all 0.4s cubic-bezier(0.25,0.46,0.45,0.94)",backdropFilter:"blur(8px)"}}
                  onMouseEnter={e=>{e.currentTarget.style.transform="translate(-50%,-50%) scale(1.08)";e.currentTarget.style.borderColor="rgba(177,154,122,0.8)";}}
                  onMouseLeave={e=>{e.currentTarget.style.transform="translate(-50%,-50%)";e.currentTarget.style.borderColor="rgba(255,255,255,0.7)";}}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="rgba(255,255,255,0.9)" style={{marginLeft:2}}><polygon points="6 3 20 12 6 21 6 3"/></svg>
                </button>
                <p style={{position:"absolute",bottom:mobile?12:20,left:0,right:0,textAlign:"center",fontFamily:"'TT Interphases Pro',sans-serif",fontSize:9,fontWeight:400,letterSpacing:"0.16em",textTransform:"uppercase",color:"rgba(255,255,255,0.6)"}}>WATCH SAMPLE VERIFICATION</p>
              </>
            ):(
              <video src={DEMO_VIDEO_URL} autoPlay playsInline controls onEnded={()=>setVidPlaying(false)} style={{width:"100%",height:"100%",objectFit:"cover"}}/>
            )}
          </div>
          <div style={{order:mobile?0:1}}>
            <span style={{fontFamily:"'TT Interphases Pro',sans-serif",fontSize:10,fontWeight:500,letterSpacing:"0.14em",textTransform:"uppercase",display:"inline-block",color:C.tan,marginBottom:mobile?14:20,padding:"6px 14px",border:`1px solid rgba(177,154,122,0.3)`}}>{L.extraService}</span>
            <h2 style={{...T.displayMd,color:"#fff",marginBottom:mobile?14:22,lineHeight:1.15,fontSize:mobile?"clamp(20px,5vw,28px)":undefined}}>{L.videoTitle}</h2>
            <p style={{fontFamily:"'Alido',serif",fontSize:15,fontWeight:400,color:C.onDark,lineHeight:1.8,marginBottom:mobile?24:40}}>{L.videoBody}</p>
            <HoverBtn onClick={()=>setPage("video-verification")} variant="gradient" style={{padding:"14px 36px"}}>{L.shopAddService}</HoverBtn>
          </div>
        </div>
      </section>

      {/* divider between video & quality */}
      <div style={{background:C.black}}><div style={{maxWidth:1360,margin:"0 auto",padding:`0 ${px}`}}><div style={{height:1,background:"rgba(177,154,122,0.12)"}}/></div></div>

      {/* ── QUALITY SECTION ────────────────────────────────────────────────── */}
      <section ref={qualRef} className={`reveal${qualVis?' visible':''}`} style={{background:C.black,padding:mobile?"40px 0":"64px 0"}}>
        <div style={{maxWidth:1360,margin:"0 auto",padding:`0 ${px}`,display:"grid",gridTemplateColumns:mobile?"1fr":"1fr 1fr",gap:mobile?24:48,alignItems:"center"}}>
          <div style={{minWidth:0}}>
            <p style={{fontFamily:"'TT Interphases Pro',sans-serif",fontSize:9,fontWeight:500,letterSpacing:"0.16em",textTransform:"uppercase",color:C.tan,marginBottom:mobile?10:16}}>{L.verifyLabel||"WHY WE'RE DIFFERENT"}</p>
            <h2 style={{fontFamily:"'Alido',serif",fontSize:mobile?20:26,fontWeight:400,color:"#fff",marginBottom:mobile?12:18,lineHeight:1.2}}>{L.verifyTitle||"You see the actual item before it arrives."}</h2>
            <p style={{fontFamily:"'Alido',serif",fontSize:14,fontWeight:400,color:C.onDark,lineHeight:1.7,marginBottom:12}}>{L.verifyBody||"Most stores show you a stock photo and hope for the best. We show you YOUR specific piece — on camera, in natural light, every stitch and detail visible."}</p>
            <p style={{fontFamily:"'Alido',serif",fontSize:14,fontWeight:400,color:C.onDark,lineHeight:1.7,marginBottom:mobile?20:28}}>{L.verifyProof||"Want proof? Add video verification to your order."}</p>
            <div style={{display:"flex",gap:mobile?20:40}}>
              {[{n:"50+",l:"VERIFIED SUPPLIERS"},{n:"98%",l:"CUSTOMER SATISFACTION"},{n:"4.9",l:"AVERAGE RATING"}].map((s,i)=>(
                <div key={i}>
                  <p style={{fontFamily:"'Alido',serif",fontSize:mobile?22:28,fontWeight:300,color:"#fff",marginBottom:4}}>{s.n}</p>
                  <p style={{fontFamily:"'TT Interphases Pro',sans-serif",fontSize:mobile?9:8,fontWeight:500,letterSpacing:"0.12em",color:C.onDarkMuted}}>{s.l}</p>
                </div>
              ))}
            </div>
          </div>
          <div style={{overflow:"hidden",height:mobile?220:400}}>
            <img src={BI.bag_stone} alt="Trusted sourcing and quality verification" loading="lazy" style={{width:"100%",height:"100%",objectFit:"cover",objectPosition:"top center",display:"block"}}/>
          </div>
        </div>
      </section>

      <Footer setPage={setPage} L={L} mobile={mobile}/>
    </div>
  );
}
