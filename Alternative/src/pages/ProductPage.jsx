import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { C, T, S } from '../constants/theme.js';
import { BI } from '../constants/images.js';
import { PRODUCTS } from '../constants/data.js';
import { VIDEO_VERIFICATION_GEL } from '../constants/config.js';
import HoverBtn from '../components/ui/HoverBtn.jsx';
import ProductCard from '../components/ui/ProductCard.jsx';
import SizeFitWidget from '../components/ui/SizeFitWidget.jsx';
import SizeGuideModal from '../components/ui/SizeGuideModal.jsx';
import { IconCheck, IconLock, IconPackage, IconVideo } from '../components/icons/Icons.jsx';
import Footer from '../components/layout/Footer.jsx';
import SEO from '../components/SEO.jsx';
import { pageMeta, productSchema, breadcrumbSchema, productAlt } from '../utils/seo.js';

// ── PRODUCT PAGE ──────────────────────────────────────────────────────────────
export default function ProductPage({mobile,product:productProp,setPage,setSelected,addToCart,toast,wishlist,onWishlist,L,products:productsProp}) {
  const { slug } = useParams();
  const ALL_PRODUCTS = productsProp || PRODUCTS;
  // Support both slug format "id-brand-name" and plain id
  const idFromSlug = slug ? parseInt(slug.split("-")[0], 10) : NaN;
  const p = productProp ?? (slug ? ALL_PRODUCTS.find(x => x.id === idFromSlug) ?? null : null);
  const [selectedSize,setSelectedSize]=useState(null);
  const [sizeError,setSizeError]=useState(false);
  const [activeImg,setActiveImg]=useState(0);
  const [showGuide,setShowGuide]=useState(false);
  const [addedFeedback,setAddedFeedback]=useState(false);
  const [openSections,setOpenSections]=useState({details:true,shipping:false});
  const [showDemoVideo,setShowDemoVideo]=useState(false);

  // Collapsible detail accordion
  const DetailAccordion=({title,defaultOpen,children})=>{
    const sKey=title.toLowerCase().replace(/\s/g,"");
    const isOpen=openSections[sKey]!==undefined?openSections[sKey]:(defaultOpen||false);
    const toggle=()=>setOpenSections(prev=>({...prev,[sKey]:!isOpen}));
    return(
      <div style={{borderBottom:`1px solid ${C.lgray}`,marginBottom:0}}>
        <button onClick={toggle} style={{width:"100%",display:"flex",alignItems:"center",justifyContent:"space-between",padding:"16px 0",background:"none",border:"none",cursor:"pointer",textAlign:"left"}}>
          <span style={{fontFamily:"'TT Interphases Pro',sans-serif",fontSize:13,fontWeight:600,color:C.black,letterSpacing:"0.06em",textTransform:"uppercase"}}>{title}</span>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={C.black} strokeWidth="2"
            style={{transition:"transform 0.25s ease",transform:isOpen?"rotate(180deg)":"rotate(0deg)",flexShrink:0}}>
            <path d="M6 9l6 6 6-6"/>
          </svg>
        </button>
        {isOpen&&<div style={{paddingBottom:16}}>{children}</div>}
      </div>
    );
  };


  // All hooks must run before early return
  const imgs=p?(p.images&&p.images.length>1?p.images:[p.img,BI.bag_stone,BI.packaging,BI.ribbon]):[];
  const effectivePrice=p?(p.sale||p.price):0;
  const totalPrice=effectivePrice;
  const related=p?ALL_PRODUCTS.filter(x=>x.section===p.section&&x.cat===p.cat&&x.id!==p.id).slice(0,4):[];

  // ── COMPLETE THE LOOK — smart outfit builder ──
  const outfit=(()=>{
    if(!p)return[];
    const pool=ALL_PRODUCTS.filter(x=>x.section===p.section&&x.id!==p.id);
    const catOrder={Bags:["Shoes","Clothing","Accessories","Watches"],Shoes:["Bags","Clothing","Accessories","Watches"],Clothing:["Bags","Shoes","Accessories","Watches"],Accessories:["Bags","Shoes","Clothing","Watches"],Watches:["Bags","Clothing","Shoes","Accessories"]};
    const prio=catOrder[p.cat]||["Bags","Shoes","Clothing","Accessories","Watches"];
    const picks=[];const used=new Set();
    for(const cat of prio){
      if(picks.length>=3)break;
      const c=pool.filter(x=>x.cat===cat&&!used.has(x.id));
      if(c.length>0){picks.push(c[p.id%c.length]);used.add(c[p.id%c.length].id);}
    }
    return picks;
  })();

  useEffect(()=>{setSelectedSize(null);setSizeError(false);setActiveImg(0);},[p?.id]);

  if (!p) return (
    <div style={{paddingTop:80,background:C.cream}}>
      <div style={{textAlign:"center",padding:"100px 20px",minHeight:"60vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
        <p style={{...T.displaySm,color:C.gray,marginBottom:24}}>{L.productNotFound}</p>
        <HoverBtn onClick={()=>setPage("catalog")} variant="primary">{L.backToCollection}</HoverBtn>
      </div>
      <Footer setPage={setPage} L={L} mobile={mobile}/>
    </div>
  );

  const handleAddToCart=()=>{
    if (p.sizes.length>1&&p.sizes[0]!=="One Size"&&!selectedSize){setSizeError(true);return;}
    setSizeError(false);
    addToCart(p, selectedSize||"One Size");
    setAddedFeedback(true);
    toast(L.addedToCart||"Added to bag","success");
    setTimeout(()=>setAddedFeedback(false),2000);
  };

  const wished=wishlist?.includes(p.id);
  const guideCategory=p.sub==="Shoes"?"Shoes":p.sub==="Bags"?"Bags":"Clothing";

  const seoMeta = pageMeta("product", { product: p });
  const seoSchema = [
    productSchema(p),
    breadcrumbSchema([
      { name: "Home", url: "/" },
      { name: p.section, url: "/catalog" },
      { name: p.cat, url: "/catalog" },
      { name: `${p.brand} ${p.name}` },
    ]),
  ];

  return (
    <div style={{paddingTop:80,background:C.cream}}>
      <SEO {...seoMeta} schema={seoSchema} />
      <div style={{maxWidth:1360,margin:"0 auto",padding:"20px 40px 0",display:"flex",gap:6,alignItems:"center",flexWrap:"wrap"}}>
        {[[L.home,"home"],[p.section,"catalog"],[L&&L.localNames&&L.localNames[p.name]||p.name,null]].map(([l,pg],i,arr)=>(
          <span key={i} style={{display:"flex",alignItems:"center",gap:6}}>
            {pg?<button onClick={()=>setPage(pg)} style={{background:"none",border:"none",...T.labelSm,color:C.gray}}>{l}</button>
              :<span style={{...T.labelSm,color:C.black,overflow:"hidden",textOverflow:"ellipsis",maxWidth:320,whiteSpace:"nowrap"}}>{l}</span>}
            {i<arr.length-1&&<span style={{color:C.lgray,flexShrink:0}}>→</span>}
          </span>
        ))}
      </div>

      <div style={{maxWidth:1360,margin:"0 auto",padding:mobile?"16px 16px 60px":"28px 40px 80px",display:"grid",gridTemplateColumns:mobile?"1fr":"1fr 1fr",gap:mobile?28:72,alignItems:"start"}}>
        <div style={{position:mobile?"relative":"sticky",top:mobile?"auto":96}}>
          <div style={{aspectRatio:"1/1",overflow:"hidden",marginBottom:3,position:"relative",background:"#ffffff"}}>
            <img src={imgs[activeImg]} alt={productAlt(p)} loading={activeImg===0?"eager":"lazy"} onError={e=>{e.target.style.opacity="0.3";}} style={{width:"100%",height:"100%",objectFit:"contain"}}/>
            {p.sale&&<div style={{position:"absolute",top:14,left:14,background:C.red,padding:"5px 12px"}}><span style={{...T.label,color:C.white}}>Sale</span></div>}
            <button onClick={()=>onWishlist&&onWishlist(p.id)}
              style={{position:"absolute",top:14,right:14,background:wished?"rgba(177,154,122,0.9)":"rgba(255,255,255,0.85)",border:"none",width:44,height:44,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",transition:"all 0.2s"}}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill={wished?C.white:"none"} stroke={wished?C.white:C.gray} strokeWidth="1.5">
                <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
              </svg>
            </button>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:3}}>
            {imgs.map((src,i)=>(
              <div key={i} onClick={()=>setActiveImg(i)} style={{aspectRatio:"1/1",overflow:"hidden",cursor:"pointer",border:`2px solid ${i===activeImg?C.tan:"transparent"}`,transition:"border-color 0.2s",background:"#ffffff"}}>
                <img src={src} alt={`${p.name} view ${i+1}`} loading="lazy" style={{width:"100%",height:"100%",objectFit:"contain"}}/>
              </div>
            ))}
          </div>
        </div>

        <div>
          <p style={{...T.labelSm,color:C.tan,marginBottom:6,letterSpacing:"0.2em"}}>{p.brand}</p>
          <h1 style={{fontFamily:"'Alido',serif",fontSize:mobile?30:38,fontWeight:300,color:C.black,lineHeight:1.15,marginBottom:6}}>{L&&L.localNames&&L.localNames[p.name]||p.name}</h1>
          <p style={{...T.bodySm,color:C.gray,marginBottom:20}}>{p.color} · {p.section}</p>

          <div style={{marginBottom:24,display:"flex",alignItems:"baseline",gap:12}}>
            <span style={{fontFamily:"'Alido',serif",fontSize:34,color:p.sale?C.red:C.black,lineHeight:1}}>GEL {effectivePrice}</span>
            {p.sale&&<span style={{fontFamily:"'Alido',serif",fontSize:22,color:C.gray,textDecoration:"line-through"}}>GEL {p.price}</span>}
          </div>

          <div style={{padding:"16px 18px",background:C.offwhite,marginBottom:20,borderLeft:`3px solid ${C.tan}`}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <span style={{...T.labelSm,color:C.gray}}>{L.totalPrice}</span>
              <span style={{fontFamily:"'Alido',serif",fontSize:20,color:C.black}}>GEL {totalPrice}</span>
            </div>
          </div>

          {p.sizes&&p.sizes.length>1&&p.sizes[0]!=="One Size"&&(
            <div style={{marginBottom:20}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
                <p style={{...T.label,color:sizeError?C.red:C.black}}>{sizeError?L.selectSizeWarn:L.selectSize}</p>
                <button onClick={()=>setShowGuide(true)} style={{background:"none",border:"none",...T.labelSm,color:C.tan,textDecoration:"underline"}}>{L.sizeGuide}</button>
              </div>
              <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                {p.sizes.map(sz=>(
                  <button key={sz} onClick={()=>{setSelectedSize(sz);setSizeError(false);}} style={{
                    padding:"9px 14px",border:`1px solid ${selectedSize===sz?C.black:C.lgray}`,
                    background:selectedSize===sz?C.black:"transparent",
                    color:selectedSize===sz?C.white:C.black,
                    ...T.labelSm,transition:"all 0.15s",
                  }}>{sz}</button>
                ))}
              </div>
            </div>
          )}

          {/* ── ADD TO BAG BUTTON ── */}
          <div style={{marginBottom:10}}>
            <HoverBtn onClick={handleAddToCart} variant="primary" style={{width:"100%",padding:"16px 20px",background:addedFeedback?"#2d6b45":undefined,borderColor:addedFeedback?"#2d6b45":undefined}}>
              {addedFeedback?(L.addedToBag||"Added to Bag ✓"):`${L.addToBag||"Add to Bag"} — GEL ${totalPrice}`}
            </HoverBtn>
          </div>
          <p style={{...T.labelSm,color:C.gray,textAlign:"center",marginBottom:24}}>{L.freeCancellation}</p>

          <SizeFitWidget product={p} onGuide={()=>setShowGuide(true)} L={L}/>

          <div style={{marginBottom:20,padding:"18px",border:`1.5px solid ${C.tan}`,background:`rgba(177,154,122,0.05)`,position:"relative",overflow:"hidden"}}>
            <div style={{position:"absolute",top:0,right:0,background:C.tan,padding:"3px 10px"}}>
              <span style={{...T.labelSm,color:C.white}}>{L.recommendedLabel}</span>
            </div>
            <div style={{display:"flex",gap:12,alignItems:"flex-start"}}>
              <div style={{width:36,height:36,borderRadius:"50%",background:C.black,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                <IconVideo size={16} color={C.white} stroke={1.8}/>
              </div>
              <div style={{flex:1}}>
                <p style={{...T.label,color:C.black,marginBottom:4}}>{L.seeBeforeShips}</p>
                <p style={{...T.bodySm,color:C.gray,lineHeight:1.7,marginBottom:6}}>{L.videoCallDesc}</p>
                <div style={{display:"flex",alignItems:"center",gap:16,flexWrap:"wrap"}}>
                  <span style={{...T.label,color:C.tan}}>+ GEL {VIDEO_VERIFICATION_GEL} at checkout</span>
                  <button onClick={()=>setShowDemoVideo(!showDemoVideo)} style={{background:"none",border:"none",...T.labelSm,color:C.gray,textDecoration:"underline",cursor:"pointer",fontSize:10,padding:0}}>
                    {showDemoVideo?"Hide sample":"Watch sample ▶"}
                  </button>
                </div>
              </div>
            </div>
            {/* Inline demo video */}
            {showDemoVideo&&(
              <div style={{marginTop:14,borderTop:`1px solid rgba(177,154,122,0.2)`,paddingTop:14}}>
                <div style={{aspectRatio:"9/16",maxHeight:280,maxWidth:160,margin:"0 auto",background:C.black,borderRadius:4,overflow:"hidden"}}>
                  <video src="https://cdn.shopify.com/videos/c/o/v/87c0928e89c34bdfb4e4fefc45f14cb2.mp4" autoPlay playsInline controls muted style={{width:"100%",height:"100%",objectFit:"cover"}}/>
                </div>
                <p style={{...T.labelSm,color:C.gray,fontSize:9,textAlign:"center",marginTop:8}}>Sample verification — sent via WhatsApp</p>
              </div>
            )}
          </div>

          {/* HOW IT WORKS */}
          <div style={{padding:"14px 16px",background:"rgba(177,154,122,0.06)",marginBottom:16}}>
            <p style={{...T.labelSm,color:C.tan,fontSize:8,marginBottom:10}}>{L.howItWorksLabel}</p>
            <div style={{display:"flex",gap:mobile?8:16}}>
              {[["1",L.prodStep1],["2",L.prodStep2],["3",L.prodStep3]].map(([n,t])=>(
                <div key={n} style={{display:"flex",alignItems:"center",gap:6,flex:1}}>
                  <span style={{width:20,height:20,borderRadius:"50%",background:C.black,color:C.white,display:"flex",alignItems:"center",justifyContent:"center",...T.labelSm,fontSize:8,flexShrink:0}}>{n}</span>
                  <span style={{...T.bodySm,color:C.brown,fontSize:mobile?9:11,lineHeight:1.3}}>{t}</span>
                </div>
              ))}
            </div>
          </div>

          {/* TRUST GUARANTEES */}
          <div style={{display:"flex",flexDirection:"column",gap:0,marginBottom:20}}>
            {[
              {Icon:IconCheck,text:L.qualityGuaranteed},
              {Icon:IconLock,text:L.securePayment},
              {Icon:IconPackage,text:`${L.estimatedDelivery} ${p.lead}`},
            ].map((g,i)=>(
              <div key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 0",borderBottom:i<2?`1px solid ${C.lgray}`:"none"}}>
                <g.Icon size={14} color={C.tan} style={{flexShrink:0}}/>
                <span style={{...T.bodySm,color:C.gray,fontSize:12}}>{g.text}</span>
              </div>
            ))}
          </div>

          {/* DELIVERY TIMELINE */}
          <div style={{marginBottom:24,padding:"16px",background:C.offwhite}}>
            <p style={{...T.labelSm,color:C.tan,fontSize:8,marginBottom:14}}>{L.deliveryTimeline}</p>
            <div style={{display:"flex",alignItems:"flex-start",gap:0}}>
              {[{l:L.stepReserve,d:L.stepToday},{l:L.stepSource,d:"2–3d"},{l:L.stepVerify,d:"1–2d"},{l:L.stepShip,d:"5–10d"},{l:L.stepReceive,d:p.lead}].map((step,i,arr)=>(
                <div key={i} style={{flex:1,textAlign:"center",position:"relative"}}>
                  <div style={{width:10,height:10,borderRadius:"50%",background:i===0?C.tan:C.lgray,margin:"0 auto 6px",position:"relative",zIndex:1}}/>
                  {i<arr.length-1&&<div style={{position:"absolute",top:4,left:"55%",width:"90%",height:1,background:C.lgray}}/>}
                  <p style={{...T.labelSm,fontSize:7,color:i===0?C.black:C.gray,lineHeight:1.2}}>{step.l}</p>
                  <p style={{...T.labelSm,fontSize:6,color:C.lgray,marginTop:2}}>{step.d}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ── DETAILS (collapsible, LuisaViaRoma-style) ── */}
          <DetailAccordion title={L.itemDetails||"Details"} defaultOpen>
            {p.details&&(
              <div style={{display:"flex",flexDirection:"column",gap:0}}>
                {/* Item Code & Color */}
                <div style={{display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:`1px solid rgba(200,200,190,0.3)`}}>
                  <span style={{...T.bodySm,color:C.gray,fontSize:12}}>{L.itemCode||"Item Code"}</span>
                  <span style={{...T.bodySm,color:C.black,fontSize:12,fontWeight:500}}>{p.details.code}</span>
                </div>
                <div style={{display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:`1px solid rgba(200,200,190,0.3)`}}>
                  <span style={{...T.bodySm,color:C.gray,fontSize:12}}>{L.itemColor||"Item Color"}</span>
                  <span style={{...T.bodySm,color:C.black,fontSize:12,fontWeight:500}}>{p.color}</span>
                </div>
                {/* Dimensions */}
                {p.details.dimensions&&(
                  <div style={{padding:"10px 0",borderBottom:`1px solid rgba(200,200,190,0.3)`}}>
                    <span style={{...T.bodySm,color:C.black,fontSize:12,fontWeight:500}}>{p.details.dimensions}</span>
                  </div>
                )}
                {/* Features */}
                <div style={{padding:"10px 0",borderBottom:`1px solid rgba(200,200,190,0.3)`}}>
                  {p.details.features.map((f,i)=>(
                    <p key={i} style={{...T.bodySm,color:C.black,fontSize:12,lineHeight:1.9}}>{f}</p>
                  ))}
                </div>
                {/* Made in */}
                <div style={{padding:"10px 0",borderBottom:`1px solid rgba(200,200,190,0.3)`}}>
                  <span style={{...T.bodySm,color:C.black,fontSize:12,fontWeight:500}}>{L.madeIn||"Made in"} {p.details.madeIn}</span>
                </div>
                {/* Composition */}
                <div style={{padding:"10px 0"}}>
                  <span style={{...T.bodySm,color:C.gray,fontSize:12}}>{L.composition||"Composition"}</span>
                  <p style={{...T.bodySm,color:C.black,fontSize:12,fontWeight:500,marginTop:2}}>{p.details.composition}</p>
                </div>
              </div>
            )}
            {!p.details&&(
              <p style={{...T.body,color:C.gray,lineHeight:1.85}}>{L&&L.localDescs&&L.localDescs[p.desc]||p.desc}</p>
            )}
          </DetailAccordion>

          {/* ── SHIPPING & DELIVERY (collapsible) ── */}
          <DetailAccordion title={L.shippingInfo||"Shipping & Delivery"}>
            <div style={{display:"flex",flexDirection:"column",gap:0}}>
              <div style={{display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:`1px solid rgba(200,200,190,0.3)`}}>
                <span style={{...T.bodySm,color:C.gray,fontSize:12}}>{L.leadTime||"Lead Time"}</span>
                <span style={{...T.bodySm,color:C.black,fontSize:12,fontWeight:500}}>{p.lead}</span>
              </div>
              <div style={{display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:`1px solid rgba(200,200,190,0.3)`}}>
                <span style={{...T.bodySm,color:C.gray,fontSize:12}}>{L.delivery||"Delivery"}</span>
                <span style={{...T.bodySm,color:C.black,fontSize:12,fontWeight:500}}>{L.deliveryVal||"Tbilisi, Georgia"}</span>
              </div>
              <div style={{padding:"10px 0",borderBottom:`1px solid rgba(200,200,190,0.3)`}}>
                <p style={{...T.bodySm,color:C.black,fontSize:12,lineHeight:1.8}}>{L.shippingDesc||"Items are sourced from our verified supplier network and shipped directly to Tbilisi, Georgia. All duties and taxes are included in the price."}</p>
              </div>
              <div style={{padding:"10px 0"}}>
                <p style={{...T.bodySm,color:C.gray,fontSize:11,lineHeight:1.6}}>{L.shippingNote||"Free cancellation before sourcing is confirmed. Contact us for any delivery questions."}</p>
              </div>
            </div>
          </DetailAccordion>
        </div>
      </div>

      {/* ── COMPLETE THE LOOK ── */}
      {outfit.length>0&&(
        <div style={{borderTop:`1px solid ${C.lgray}`,padding:mobile?"48px 0":"72px 0",background:C.cream}}>
          <div style={{maxWidth:1360,margin:"0 auto",padding:mobile?"0 16px":"0 40px"}}>
            <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:8}}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={C.tan} strokeWidth="1.5"><path d="M6.5 6.5h11v11h-11z"/><path d="M8.5 2v4.5"/><path d="M15.5 2v4.5"/><path d="M8.5 17.5V22"/><path d="M15.5 17.5V22"/><path d="M2 8.5h4.5"/><path d="M2 15.5h4.5"/><path d="M17.5 8.5H22"/><path d="M17.5 15.5H22"/></svg>
              <p style={{...T.labelSm,color:C.tan,fontSize:10,letterSpacing:"0.18em"}}>{L.completeLook||"COMPLETE THE LOOK"}</p>
            </div>
            <h2 style={{fontFamily:"'Alido',serif",fontSize:mobile?24:30,fontWeight:300,color:C.black,marginBottom:6}}>{L.completeLookTitle||"Style it your way"}</h2>
            <p style={{...T.body,color:C.gray,fontSize:13,marginBottom:mobile?24:36,maxWidth:480}}>{L.completeLookSub||"Pair this piece with these curated suggestions"}</p>

            <div style={{display:"grid",gridTemplateColumns:mobile?`repeat(${Math.min(outfit.length,2)},1fr)`:`repeat(${outfit.length},1fr)`,gap:mobile?12:20}}>
              {outfit.map((item,i)=>{
                const itemWished=wishlist?.includes(item.id);
                return(
                <div key={item.id} style={{position:"relative",transition:"transform 0.3s"}}>
                  <div style={{position:"relative",overflow:"hidden",marginBottom:12,background:"#ffffff",cursor:"pointer"}}
                    onClick={()=>{setPage("product",item);window.scrollTo({top:0,behavior:"smooth"});}}>
                    <img src={item.img} alt={item.name} loading="lazy" style={{width:"100%",aspectRatio:"1/1",objectFit:"contain",transition:"transform 0.4s"}}
                      onMouseEnter={e=>e.currentTarget.style.transform="scale(1.03)"}
                      onMouseLeave={e=>e.currentTarget.style.transform="scale(1)"}/>
                    <div style={{position:"absolute",top:10,left:10,background:"rgba(0,0,0,0.75)",padding:"4px 10px"}}>
                      <span style={{...T.labelSm,color:C.white,fontSize:7,letterSpacing:"0.1em"}}>{item.cat.toUpperCase()}</span>
                    </div>
                    {/* Wishlist button */}
                    <button onClick={e=>{e.stopPropagation();onWishlist&&onWishlist(item.id);}}
                      onMouseEnter={e=>e.currentTarget.style.transform="scale(1.1)"}
                      onMouseLeave={e=>e.currentTarget.style.transform="scale(1)"}
                      style={{position:"absolute",top:10,right:10,background:itemWished?"rgba(177,154,122,0.9)":"rgba(255,255,255,0.9)",border:"none",width:36,height:36,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",transition:"all 0.2s",backdropFilter:"blur(4px)"}}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill={itemWished?C.white:"none"} stroke={itemWished?C.white:C.gray} strokeWidth="1.5">
                        <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
                      </svg>
                    </button>
                    {i<outfit.length-1&&!mobile&&(
                      <div style={{position:"absolute",right:-14,top:"50%",transform:"translateY(-50%)",width:28,height:28,borderRadius:"50%",background:C.white,border:`1px solid ${C.lgray}`,display:"flex",alignItems:"center",justifyContent:"center",zIndex:2,boxShadow:"0 1px 4px rgba(0,0,0,0.08)"}}>
                        <span style={{color:C.tan,fontSize:16,fontWeight:300,lineHeight:1}}>+</span>
                      </div>
                    )}
                  </div>
                  <div style={{cursor:"pointer"}} onClick={()=>{setPage("product",item);window.scrollTo({top:0,behavior:"smooth"});}}>
                    <p style={{...T.labelSm,color:C.tan,fontSize:8,letterSpacing:"0.15em",marginBottom:3}}>{item.brand}</p>
                    <p style={{...T.bodySm,color:C.black,fontSize:mobile?12:13,marginBottom:4}}>{L&&L.localNames&&L.localNames[item.name]||item.name}</p>
                    <p style={{fontFamily:"'Alido',serif",fontSize:15,color:item.sale?C.red:C.black,marginBottom:10}}>
                      GEL {item.sale||item.price}
                      {item.sale&&<span style={{fontSize:12,color:C.gray,textDecoration:"line-through",marginLeft:6}}>GEL {item.price}</span>}
                    </p>
                  </div>
                  <button onClick={()=>{addToCart(item,item.sizes[0]==="One Size"||item.sizes.length===1?item.sizes[0]:null);toast(L.addedToCart||"Added to bag","success");}}
                    onMouseEnter={e=>{e.currentTarget.style.background=C.black;e.currentTarget.style.color=C.white;}}
                    onMouseLeave={e=>{e.currentTarget.style.background="transparent";e.currentTarget.style.color=C.black;}}
                    style={{width:"100%",padding:"10px",border:`1px solid ${C.black}`,background:"transparent",color:C.black,...T.labelSm,fontSize:9,letterSpacing:"0.1em",cursor:"pointer",transition:"all 0.25s ease"}}>
                    {L.addToBag||"Add to Bag"}
                  </button>
                </div>
              );})}
            </div>

            {/* Total outfit price */}
            <div style={{marginTop:mobile?24:32,padding:"16px 20px",background:C.offwhite,display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:12}}>
              <div style={{display:"flex",alignItems:"center",gap:8}}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.tan} strokeWidth="1.5"><path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>
                <span style={{...T.labelSm,color:C.gray,fontSize:9,letterSpacing:"0.1em"}}>{L.completeLookTotal||"COMPLETE LOOK TOTAL"}</span>
              </div>
              <span style={{fontFamily:"'Alido',serif",fontSize:22,color:C.black}}>
                GEL {effectivePrice + outfit.reduce((sum,it)=>(sum+(it.sale||it.price)),0)}
              </span>
            </div>
          </div>
        </div>
      )}

      {related.length>0&&(
        <div style={{borderTop:`1px solid ${C.lgray}`,padding:"64px 0",background:C.offwhite}}>
          <div style={{maxWidth:1360,margin:"0 auto",padding:"0 40px"}}>
            <p style={{...T.labelSm,color:C.tan,marginBottom:10}}>{L.fromSameCollection}</p>
            <div style={{display:"grid",gridTemplateColumns:mobile?"repeat(2,1fr)":"repeat(4,1fr)",gap:3}}>
              {related.map(item=><ProductCard key={item.id} product={item} wishlist={wishlist} onWishlist={onWishlist} L={L}
                onSelect={()=>{setPage("product",item);window.scrollTo({top:0,behavior:"smooth"});}}/>)}
            </div>
          </div>
        </div>
      )}

      <Footer setPage={setPage} L={L} mobile={mobile}/>

      {showGuide&&<SizeGuideModal onClose={()=>setShowGuide(false)} category={guideCategory} L={L}/>}
    </div>
  );
}
