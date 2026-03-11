import { useState, useEffect } from 'react';
import { C, T } from '../../constants/theme.js';
import { LogoMark, Logo } from './Logo.jsx';
import LangSwitcher from './LangSwitcher.jsx';
import { IconCheck } from '../icons/Icons.jsx';
import HoverBtn from '../ui/HoverBtn.jsx';

// ── NAV ───────────────────────────────────────────────────────────────────────
export default function Nav({page,setPage,cartCount,user,setUser,onLogout,onSearch,onCart,wishlistCount,lang,setLang,L,mobile,topOffset=0}) {
  const [scrolled,setScrolled]=useState(false);
  const [megaOpen,setMegaOpen]=useState(false);
  const [mobileMenuOpen,setMobileMenuOpen]=useState(false);
  const [mobileTab,setMobileTab]=useState("Womenswear");

  useEffect(()=>{
    const fn=()=>setScrolled(window.scrollY>60);
    window.addEventListener("scroll",fn);
    return()=>window.removeEventListener("scroll",fn);
  },[]);

  useEffect(()=>{setMegaOpen(false);setMobileMenuOpen(false);},[page]);

  const onMegaLink=(section,engKey)=>{
    if(engKey==="Brands"){setPage("brands");}
    else{setPage("catalog",null,{initSection:section,initSub:engKey});}
    setMegaOpen(false);
    setMobileMenuOpen(false);
  };

  const megaCols = [
    {key:"Womenswear",label:L.womenswear,items:[{k:"New In",l:L.newIn},{k:"Clothing",l:L.clothing},{k:"Shoes",l:L.shoes},{k:"Bags",l:L.bags},{k:"Accessories",l:L.accessories},{k:"Jewellery",l:L.jewellery},{k:"Sale",l:L.sale}]},
    {key:"Menswear",label:L.menswear,items:[{k:"New In",l:L.newIn},{k:"Clothing",l:L.clothing},{k:"Shoes",l:L.shoes},{k:"Bags",l:L.bags},{k:"Accessories",l:L.accessories},{k:"Watches",l:L.watches},{k:"Sale",l:L.sale}]},
    {key:"Kidswear",label:L.kidswear,items:[{k:"New In",l:L.newIn},{k:"Clothing",l:L.clothing},{k:"Shoes",l:L.shoes},{k:"Accessories",l:L.accessories}]},
    {key:"Browse",label:L.browseBy,items:[{k:"New In",l:L.newIn},{k:"Brands",l:L.brands},{k:"Sale",l:L.sale}]},
  ];

  // ── MOBILE ──────────────────────────────────────────────────────────────────
  if (mobile) {
    return (
      <>
        <nav role="navigation" aria-label="Main navigation" style={{position:"fixed",top:topOffset,left:0,right:0,zIndex:200,background:"rgba(231,232,225,0.98)",backdropFilter:"blur(16px)",borderBottom:`1px solid ${C.lgray}`,transition:"top 0.3s ease"}}>
          <div style={{padding:"14px 18px",display:"flex",alignItems:"center",justifyContent:"space-between",minHeight:56}}>
            <button onClick={()=>{setMobileMenuOpen(!mobileMenuOpen);setMegaOpen(false);}} aria-label={mobileMenuOpen?"Close menu":"Open menu"} aria-expanded={mobileMenuOpen}
              className="icon-btn" style={{width:44,height:44}}>
              {mobileMenuOpen?(
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={C.black} strokeWidth="1.2" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
              ):(
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={C.black} strokeWidth="1.2" strokeLinecap="round"><path d="M4 12h16M4 6h16M4 18h16"/></svg>
              )}
            </button>
            <button onClick={()=>{setPage("home");setMobileMenuOpen(false);}} style={{background:"none",border:"none",padding:0,lineHeight:1,position:"absolute",left:"50%",transform:"translateX(-50%)",cursor:"pointer"}}>
              <Logo size={1.1}/>
            </button>
            <div style={{display:"flex",gap:0,alignItems:"center"}}>
              <button onClick={onSearch} aria-label={L.search||"Search"} className="icon-btn" style={{width:44,height:44}}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={C.black} strokeWidth="1.2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
              </button>
              <button onClick={()=>{setPage("account",null,{initAccountTab:"wishlist"});setMobileMenuOpen(false);}} aria-label={L.wishlist||"Wishlist"} className="icon-btn" style={{width:44,height:44,position:"relative"}}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={C.black} strokeWidth="1.2" strokeLinecap="round"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>
                {wishlistCount>0&&<span style={{position:"absolute",top:2,right:2,background:C.tan,color:"#fff",borderRadius:"50%",minWidth:16,height:16,padding:"0 3px",fontSize:9,fontWeight:600,display:"flex",alignItems:"center",justifyContent:"center"}}>{wishlistCount}</span>}
              </button>
              <button onClick={onCart} aria-label={L.shoppingBag||"Shopping Bag"} className="icon-btn" style={{width:44,height:44,position:"relative"}}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={C.black} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>
                {cartCount>0&&<span style={{position:"absolute",top:2,right:2,background:C.black,color:"#fff",borderRadius:"50%",minWidth:16,height:16,padding:"0 3px",fontSize:9,fontWeight:600,display:"flex",alignItems:"center",justifyContent:"center"}}>{cartCount}</span>}
              </button>
            </div>
          </div>
        </nav>
        {mobileMenuOpen&&(
          <div style={{position:"fixed",top:56+topOffset,left:0,right:0,bottom:0,zIndex:199,background:C.cream,overflow:"auto",WebkitOverflowScrolling:"touch",animation:"fadeIn 0.2s ease"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"16px 20px",borderBottom:`1px solid ${C.lgray}`}}>
              <LogoMark size={1.1}/>
              <button onClick={()=>setMobileMenuOpen(false)} className="icon-btn" style={{width:36,height:36}}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={C.black} strokeWidth="1.2" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
              </button>
            </div>

            <div style={{display:"flex",borderBottom:`1px solid ${C.lgray}`}}>
              {[{k:"Womenswear",l:L.womenswear},{k:"Menswear",l:L.menswear},{k:"Kidswear",l:L.kidswear}].map(tab=>(
                <button key={tab.k} onClick={()=>setMobileTab(tab.k)}
                  style={{flex:1,padding:"16px 8px",background:"none",border:"none",borderBottom:mobileTab===tab.k?`2px solid ${C.tan}`:"2px solid transparent",fontFamily:"'TT Interphases Pro',sans-serif",fontSize:11,fontWeight:500,letterSpacing:"0.1em",textTransform:"uppercase",color:mobileTab===tab.k?C.black:C.gray,transition:"all 0.2s",cursor:"pointer"}}>
                  {tab.l}
                </button>
              ))}
            </div>
            <div>
              {({
                Womenswear:[{k:"New In",l:L.newIn},{k:"Brands",l:L.brands},{k:"Clothing",l:L.clothing},{k:"Shoes",l:L.shoes},{k:"Bags",l:L.bags},{k:"Accessories",l:L.accessories},{k:"Jewellery",l:L.jewellery},{k:"Sale",l:L.sale}],
                Menswear:[{k:"New In",l:L.newIn},{k:"Brands",l:L.brands},{k:"Clothing",l:L.clothing},{k:"Shoes",l:L.shoes},{k:"Bags",l:L.bags},{k:"Accessories",l:L.accessories},{k:"Watches",l:L.watches},{k:"Sale",l:L.sale}],
                Kidswear:[{k:"New In",l:L.newIn},{k:"Clothing",l:L.clothing},{k:"Shoes",l:L.shoes},{k:"Accessories",l:L.accessories}],
              }[mobileTab]||[]).map((item,i)=>(
                <button key={i} onClick={()=>{
                    if(item.k==="Brands"){setPage("brands");}
                    else{setPage("catalog",null,{initSection:mobileTab,initSub:item.k});}
                    setMobileMenuOpen(false);
                  }}
                  style={{display:"flex",justifyContent:"space-between",alignItems:"center",width:"100%",padding:"16px 20px",background:"none",border:"none",borderBottom:`1px solid ${C.lgray}`,textAlign:"left",...T.body,color:item.k==="Sale"?C.tan:C.black,fontSize:15,fontWeight:300,transition:"padding-left 0.2s"}}
                  onMouseEnter={e=>e.currentTarget.style.paddingLeft="28px"}
                  onMouseLeave={e=>e.currentTarget.style.paddingLeft="20px"}>
                  <span>{item.l}</span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.gray} strokeWidth="1.2" strokeLinecap="round"><path d="M9 18l6-6-6-6"/></svg>
                </button>
              ))}
            </div>

            <div style={{borderTop:`6px solid ${C.offwhite}`,borderBottom:`6px solid ${C.offwhite}`}}>
              {[
                {label:L.howItWorks,pg:"how"},
                {label:L.about,pg:"about"},
              ].map(item=>(
                <button key={item.pg} onClick={()=>{setPage(item.pg);setMobileMenuOpen(false);}}
                  style={{display:"flex",justifyContent:"space-between",alignItems:"center",width:"100%",padding:"16px 20px",background:"none",border:"none",borderBottom:`1px solid ${C.lgray}`,textAlign:"left",...T.body,color:C.black,fontSize:15,fontWeight:300,transition:"padding-left 0.2s"}}
                  onMouseEnter={e=>e.currentTarget.style.paddingLeft="28px"}
                  onMouseLeave={e=>e.currentTarget.style.paddingLeft="20px"}>
                  <span>{item.label}</span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.gray} strokeWidth="1.2" strokeLinecap="round"><path d="M9 18l6-6-6-6"/></svg>
                </button>
              ))}
            </div>

            <div style={{padding:"28px 20px"}}>
              <h3 style={{...T.displaySm,color:C.black,marginBottom:20,fontSize:22,fontWeight:300}}>
                {user?(L.welcome||"Welcome,")+" "+(user.name?user.name.split(" ")[0]:""):(L.myAccount||"My Account")}
              </h3>
              {user?(
                <div style={{display:"flex",flexDirection:"column",gap:10}}>
                  <HoverBtn onClick={()=>{setPage("orders");setMobileMenuOpen(false);}} variant="shimmer" style={{width:"100%",padding:"14px"}}>{L.myOrders||"My Orders"}</HoverBtn>
                  <HoverBtn onClick={()=>{setPage("account");setMobileMenuOpen(false);}} variant="secondary" style={{width:"100%",padding:"14px"}}>{L.myAccount||"My Account"}</HoverBtn>
                  {/* Admin panel access removed — admin is a separate app */}
                  <button onClick={()=>{onLogout?onLogout():setUser(null);setMobileMenuOpen(false);}}
                    style={{background:"none",border:"none",...T.bodySm,color:C.gray,padding:"8px 0",textAlign:"left"}}>{L.signOut||"Sign Out"}</button>
                </div>
              ):(
                <div style={{display:"flex",flexDirection:"column",gap:10}}>
                  <HoverBtn onClick={()=>{setPage("auth");setMobileMenuOpen(false);}} variant="shimmer" style={{width:"100%",padding:"14px"}}>{L.signInBtn||"Sign In"}</HoverBtn>
                  <HoverBtn onClick={()=>{setPage("auth");setMobileMenuOpen(false);}} variant="secondary" style={{width:"100%",padding:"14px"}}>{L.createAccount||"Register"}</HoverBtn>
                </div>
              )}
            </div>

            <div style={{padding:"0 20px 32px"}}>
              <h3 style={{...T.displaySm,color:C.black,marginBottom:16,fontSize:18,fontWeight:300}}>
                {L.language}
              </h3>
              {[{code:"en",label:"English"},{code:"ka",label:"ქართული"},{code:"ru",label:"Русский"}].map(opt=>(
                <button key={opt.code} onClick={()=>setLang(opt.code)}
                  style={{display:"flex",alignItems:"center",width:"100%",padding:"14px 0",background:"none",border:"none",borderBottom:`1px solid ${C.lgray}`,textAlign:"left"}}>
                  <span style={{...T.body,color:lang===opt.code?C.black:C.gray,fontSize:15,fontWeight:lang===opt.code?400:300}}>{opt.label}</span>
                  {lang===opt.code&&<span style={{marginLeft:"auto",display:"flex",alignItems:"center"}}><IconCheck size={12} color={C.tan} stroke={2}/></span>}
                  {lang!==opt.code&&<svg style={{marginLeft:"auto"}} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.gray} strokeWidth="1.2" strokeLinecap="round"><path d="M9 18l6-6-6-6"/></svg>}
                </button>
              ))}
            </div>
          </div>
        )}
      </>
    );
  }

  // ── DESKTOP ─────────────────────────────────────────────────────────────────
  const solid = scrolled || megaOpen || page !== "home";

  return (
    <nav role="navigation" aria-label="Main navigation" style={{position:"fixed",top:topOffset,left:0,right:0,zIndex:200,background:solid?"rgba(231,232,225,0.98)":"transparent",backdropFilter:solid?"blur(16px)":"none",borderBottom:solid?`1px solid ${C.lgray}`:"none",boxShadow:solid?"0 1px 0 rgba(0,0,0,0.04)":"none",transition:"all 0.4s cubic-bezier(0.25,0.46,0.45,0.94)"}}>
      <div style={{maxWidth:1360,margin:"0 auto",padding:scrolled?"16px 40px":"24px 40px",display:"flex",alignItems:"center",justifyContent:"space-between",minHeight:72,transition:"padding 0.4s cubic-bezier(0.25,0.46,0.45,0.94)",position:"relative"}}>

        {/* LEFT — Logo */}
        <button onClick={()=>setPage("home")} style={{background:"none",border:"none",padding:0,lineHeight:1,flexShrink:0,cursor:"pointer",transition:"opacity 0.3s"}}
          onMouseEnter={e=>e.currentTarget.style.opacity="0.7"} onMouseLeave={e=>e.currentTarget.style.opacity="1"}>
          <Logo size={2.2}/>
        </button>

        {/* CENTER — Nav links */}
        <div style={{display:"flex",gap:44,alignItems:"center",position:"absolute",left:"50%",transform:"translateX(-50%)"}}>
          <button onClick={()=>setMegaOpen(!megaOpen)} className="luxury-link"
            style={{background:"none",border:"none",fontFamily:"'TT Interphases Pro',sans-serif",fontSize:12,fontWeight:500,letterSpacing:"0.1em",textTransform:"uppercase",color:page==="catalog"?C.tan:C.black,display:"flex",alignItems:"center",gap:6,cursor:"pointer",padding:"4px 0"}}>
            {L.collection} <span style={{fontSize:8,opacity:0.5,display:"inline-block",transform:megaOpen?"rotate(180deg)":"none",transition:"transform 0.3s cubic-bezier(0.25,0.46,0.45,0.94)"}}>▼</span>
          </button>
          <button onClick={()=>setPage("how")} className="luxury-link"
            style={{background:"none",border:"none",fontFamily:"'TT Interphases Pro',sans-serif",fontSize:12,fontWeight:500,letterSpacing:"0.1em",textTransform:"uppercase",color:page==="how"?C.tan:C.black,cursor:"pointer",padding:"4px 0"}}>{L.howItWorks}</button>
          <button onClick={()=>setPage("about")} className="luxury-link"
            style={{background:"none",border:"none",fontFamily:"'TT Interphases Pro',sans-serif",fontSize:12,fontWeight:500,letterSpacing:"0.1em",textTransform:"uppercase",color:page==="about"?C.tan:C.black,cursor:"pointer",padding:"4px 0"}}>{L.about}</button>
        </div>

        {/* RIGHT — Search bar + Lang + Icons */}
        <div style={{display:"flex",gap:2,alignItems:"center"}}>

          {/* Search — underline style */}
          <button onClick={onSearch} title={L.search}
            style={{display:"flex",alignItems:"center",height:36,padding:"0 2px",background:"none",border:"none",borderBottom:`1px solid ${C.black}`,borderRadius:0,cursor:"pointer",minWidth:140,transition:"border-color 0.3s ease"}}
            onMouseEnter={e=>{e.currentTarget.style.borderBottomColor=C.tan;}}
            onMouseLeave={e=>{e.currentTarget.style.borderBottomColor="rgba(25,25,25,0.25)";}}>
            <span style={{fontFamily:"'TT Interphases Pro',sans-serif",fontSize:11,fontWeight:400,letterSpacing:"0.1em",color:"#555",textTransform:"uppercase",whiteSpace:"nowrap"}}>{L.search||"Search"}</span>
          </button>

          <span style={{width:1,height:20,background:C.lgray,opacity:0.4,margin:"0 8px"}}/>

          <LangSwitcher lang={lang} setLang={setLang}/>

          <span style={{width:1,height:20,background:C.lgray,opacity:0.4,margin:"0 8px"}}/>

          {/* Profile */}
          <button onClick={()=>setPage(user?"account":"auth")} title={user?user.name:L.signIn} className="icon-btn" style={{width:42,height:42,position:"relative"}}>
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke={user?C.tan:C.black} strokeWidth="1.2" strokeLinecap="round">
              <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
            </svg>
            {user&&<span style={{position:"absolute",bottom:8,right:8,width:6,height:6,borderRadius:"50%",background:C.tan,border:`1.5px solid ${C.cream}`}}/>}
          </button>

          {/* Wishlist */}
          <button onClick={()=>{setPage("account",null,{initAccountTab:"wishlist"});}} title={L.wishlist||"Wishlist"} className="icon-btn" style={{width:42,height:42,position:"relative"}}>
            <svg width="19" height="19" viewBox="0 0 24 24" fill={wishlistCount>0?C.tan:"none"} stroke={wishlistCount>0?C.tan:C.black} strokeWidth="1.2" strokeLinecap="round">
              <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
            </svg>
            {wishlistCount>0&&(
              <span style={{position:"absolute",top:4,right:4,background:C.tan,color:"#fff",borderRadius:"50%",minWidth:16,height:16,padding:"0 3px",fontSize:9,fontWeight:600,display:"flex",alignItems:"center",justifyContent:"center"}}>{wishlistCount}</span>
            )}
          </button>

          {/* Cart / Bag */}
          <button onClick={onCart} title={L.shoppingBag||"Shopping Bag"} className="icon-btn" style={{width:42,height:42,position:"relative"}}>
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke={C.black} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 01-8 0"/>
            </svg>
            {cartCount>0&&(
              <span style={{position:"absolute",top:4,right:4,background:C.black,color:"#fff",borderRadius:"50%",minWidth:16,height:16,padding:"0 3px",fontSize:9,fontWeight:600,display:"flex",alignItems:"center",justifyContent:"center"}}>{cartCount}</span>
            )}
          </button>

        </div>
      </div>

      {/* MEGA MENU — refined with gold accents */}
      {megaOpen&&(
        <div style={{background:"rgba(231,232,225,0.99)",borderTop:`1px solid ${C.lgray}`,animation:"slideDown 0.25s cubic-bezier(0.25,0.46,0.45,0.94)",position:"relative",boxShadow:"0 8px 40px rgba(0,0,0,0.06)"}}>
          <div style={{maxWidth:1360,margin:"0 auto",padding:"44px 40px 52px",display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:40}}>
            {megaCols.map((col,i)=>(
              <div key={i}>
                <button onClick={()=>onMegaLink(col.key,"All")} style={{fontFamily:"'TT Interphases Pro',sans-serif",fontSize:11,fontWeight:500,letterSpacing:"0.14em",textTransform:"uppercase",color:C.tan,marginBottom:20,position:"relative",paddingBottom:10,background:"none",border:"none",cursor:"pointer",display:"block",textAlign:"left",padding:"0 0 10px 0",transition:"color 0.2s"}}
                  onMouseEnter={e=>e.currentTarget.style.color=C.black}
                  onMouseLeave={e=>e.currentTarget.style.color=C.tan}>
                  {col.label}
                  <span style={{position:"absolute",bottom:0,left:0,width:24,height:1,background:C.tan,opacity:0.4}}/>
                </button>
                {col.items.map((item,j)=>(
                  <button key={j} onClick={()=>onMegaLink(col.key,item.k)} className="luxury-link"
                    style={{display:"block",background:"none",border:"none",fontFamily:"'TT Interphases Pro',sans-serif",color:C.black,fontSize:15,marginBottom:12,padding:"2px 0",textAlign:"left",cursor:"pointer",fontWeight:300}}>
                    {item.l}
                  </button>
                ))}
              </div>
            ))}
          </div>
          <button onClick={()=>setMegaOpen(false)} className="icon-btn"
            style={{position:"absolute",top:16,right:36,width:36,height:36,color:C.gray}}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
          </button>
        </div>
      )}
    </nav>
  );
}
