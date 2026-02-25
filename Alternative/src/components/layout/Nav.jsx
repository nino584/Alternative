import { useState, useEffect } from 'react';
import { C, T } from '../../constants/theme.js';
import { LogoMark, Logo } from './Logo.jsx';
import LangSwitcher from './LangSwitcher.jsx';
import { IconCheck } from '../icons/Icons.jsx';
import HoverBtn from '../ui/HoverBtn.jsx';

// ── NAV ───────────────────────────────────────────────────────────────────────
export default function Nav({page,setPage,cartCount,user,setUser,onSearch,onCart,wishlistCount,lang,setLang,L,mobile}) {
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

  const onMegaLink=(section,sub)=>{
    if(sub===L.brands||sub==="Brands"){setPage("brands");}
    else{setPage("catalog");window.__initSection=section;window.__initSub=sub;}
    setMegaOpen(false);
    setMobileMenuOpen(false);
  };

  const megaCols = [
    {key:"Womenswear",label:L.womenswear,items:[L.newIn,L.clothing,L.shoes,L.bags,L.accessories,L.jewellery,L.sale]},
    {key:"Menswear",label:L.menswear,items:[L.newIn,L.clothing,L.shoes,L.bags,L.accessories,L.watches,L.sale]},
    {key:"Kidswear",label:L.kidswear,items:[L.newIn,L.clothing,L.shoes,L.accessories]},
    {key:"Browse",label:L.browseBy,items:[L.newIn,L.brands,L.sale]},
  ];

  if (mobile) {
    return (
      <>
        <nav style={{position:"fixed",top:0,left:0,right:0,zIndex:200,background:"rgba(231,232,225,0.98)",backdropFilter:"blur(16px)",borderBottom:`1px solid ${C.lgray}`}}>
          <div style={{padding:"14px 18px",display:"flex",alignItems:"center",justifyContent:"space-between",minHeight:56}}>
            <button onClick={()=>{setMobileMenuOpen(!mobileMenuOpen);setMegaOpen(false);}} style={{background:"none",border:"none",padding:6,lineHeight:1,cursor:"pointer"}}>
              {mobileMenuOpen?(
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={C.black} strokeWidth="1.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
              ):(
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={C.black} strokeWidth="1.5"><path d="M3 12h18M3 6h18M3 18h18"/></svg>
              )}
            </button>
            <button onClick={()=>{setPage("home");setMobileMenuOpen(false);}} style={{background:"none",border:"none",padding:0,lineHeight:1,position:"absolute",left:"50%",transform:"translateX(-50%)",cursor:"pointer"}}>
              <Logo color={C.black} size={0.82}/>
            </button>
            <div style={{display:"flex",gap:4,alignItems:"center"}}>
              <button onClick={onSearch} style={{background:"none",border:"none",width:40,height:40,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"}}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={C.black} strokeWidth="1.5"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
              </button>
              <button onClick={()=>{window.__initAccountTab="wishlist";setPage("account");setMobileMenuOpen(false);}} style={{background:"none",border:"none",width:40,height:40,display:"flex",alignItems:"center",justifyContent:"center",position:"relative",cursor:"pointer"}}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={C.black} strokeWidth="1.5"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>
                {wishlistCount>0&&<span style={{position:"absolute",top:4,right:4,background:C.black,color:C.white,borderRadius:"50%",minWidth:18,height:18,padding:"0 4px",fontSize:10,fontWeight:600,display:"flex",alignItems:"center",justifyContent:"center"}}>{wishlistCount}</span>}
              </button>
              <button onClick={onCart} style={{background:"none",border:"none",width:40,height:40,display:"flex",alignItems:"center",justifyContent:"center",position:"relative",cursor:"pointer"}}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={C.black} strokeWidth="1.5"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>
                {cartCount>0&&<span style={{position:"absolute",top:4,right:4,background:C.black,color:C.white,borderRadius:"50%",minWidth:18,height:18,padding:"0 4px",fontSize:10,fontWeight:600,display:"flex",alignItems:"center",justifyContent:"center"}}>{cartCount}</span>}
              </button>
            </div>
          </div>
        </nav>
        {mobileMenuOpen&&(
          <div style={{position:"fixed",top:56,left:0,right:0,bottom:0,zIndex:199,background:C.cream,overflow:"auto",WebkitOverflowScrolling:"touch"}}>
            {/* Top bar: Logo + Close */}
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"16px 20px",borderBottom:`1px solid ${C.lgray}`}}>
              <LogoMark color={C.black} size={1.1}/>
              <button onClick={()=>setMobileMenuOpen(false)} style={{background:"none",border:"none",padding:4}}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={C.black} strokeWidth="1.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
              </button>
            </div>

            {/* Section tabs: WOMENSWEAR | MENSWEAR | KIDSWEAR */}
            <div style={{display:"flex",borderBottom:`1px solid ${C.lgray}`}}>
              {[{k:"Womenswear",l:L.womenswear},{k:"Menswear",l:L.menswear},{k:"Kidswear",l:L.kidswear}].map(tab=>(
                <button key={tab.k} onClick={()=>setMobileTab(tab.k)}
                  style={{flex:1,padding:"16px 8px",background:"none",border:"none",borderBottom:mobileTab===tab.k?`2px solid ${C.black}`:"2px solid transparent",fontFamily:"'TT Interphases Pro',sans-serif",fontSize:11,fontWeight:500,letterSpacing:"0.1em",textTransform:"uppercase",color:mobileTab===tab.k?C.black:C.gray,transition:"all 0.2s",cursor:"pointer"}}>
                  {tab.l}
                </button>
              ))}
            </div>
            <div>
              {({
                Womenswear:[L.newIn,L.brands,L.clothing,L.shoes,L.bags,L.accessories,L.jewellery,L.sale],
                Menswear:[L.newIn,L.brands,L.clothing,L.shoes,L.bags,L.accessories,L.watches,L.sale],
                Kidswear:[L.newIn,L.clothing,L.shoes,L.accessories],
              }[mobileTab]||[]).map((item,i)=>(
                <button key={i} onClick={()=>{
                    if(item===L.brands||item==="Brands"){setPage("brands");}
                    else{setPage("catalog");window.__initSection=mobileTab;window.__initSub=item;}
                    setMobileMenuOpen(false);
                  }}
                  style={{display:"flex",justifyContent:"space-between",alignItems:"center",width:"100%",padding:"16px 20px",background:"none",border:"none",borderBottom:`1px solid ${C.lgray}`,textAlign:"left",...T.body,color:item===L.sale?C.red:C.black,fontSize:15,fontWeight:300}}>
                  <span>{item}</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.gray} strokeWidth="1.5"><path d="M9 18l6-6-6-6"/></svg>
                </button>
              ))}
            </div>

            {/* How It Works + About links */}
            <div style={{borderTop:`6px solid ${C.offwhite}`,borderBottom:`6px solid ${C.offwhite}`}}>
              {[
                {label:L.howItWorks,pg:"how"},
                {label:L.about,pg:"about"},
              ].map(item=>(
                <button key={item.pg} onClick={()=>{setPage(item.pg);setMobileMenuOpen(false);}}
                  style={{display:"flex",justifyContent:"space-between",alignItems:"center",width:"100%",padding:"16px 20px",background:"none",border:"none",borderBottom:`1px solid ${C.lgray}`,textAlign:"left",...T.body,color:C.black,fontSize:15,fontWeight:300}}>
                  <span>{item.label}</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.gray} strokeWidth="1.5"><path d="M9 18l6-6-6-6"/></svg>
                </button>
              ))}
            </div>

            {/* My Account section */}
            <div style={{padding:"28px 20px"}}>
              <h3 style={{...T.displaySm,color:C.black,marginBottom:20,fontSize:22,fontWeight:300}}>
                {user?(L.welcome||"Welcome,")+" "+(user.name?user.name.split(" ")[0]:""):(L.myAccount||"My Account")}
              </h3>
              {user?(
                <div style={{display:"flex",flexDirection:"column",gap:10}}>
                  <HoverBtn onClick={()=>{setPage("orders");setMobileMenuOpen(false);}} variant="primary" style={{width:"100%",padding:"14px"}}>{L.myOrders||"My Orders"}</HoverBtn>
                  <HoverBtn onClick={()=>{setPage("account");setMobileMenuOpen(false);}} variant="secondary" style={{width:"100%",padding:"14px"}}>{L.myAccount||"My Account"}</HoverBtn>
                  {user.isAdmin&&<HoverBtn onClick={()=>{setPage("admin");setMobileMenuOpen(false);}} variant="tan" style={{width:"100%",padding:"14px"}}>{L.adminPanel||"Admin Panel"}</HoverBtn>}
                  <button onClick={()=>{setUser(null);setPage("home");setMobileMenuOpen(false);}}
                    style={{background:"none",border:"none",...T.bodySm,color:C.gray,padding:"8px 0",textAlign:"left"}}>{L.signOut||"Sign Out"}</button>
                </div>
              ):(
                <div style={{display:"flex",flexDirection:"column",gap:10}}>
                  <HoverBtn onClick={()=>{setPage("auth");setMobileMenuOpen(false);}} variant="primary" style={{width:"100%",padding:"14px"}}>{L.signInBtn||"Sign In"}</HoverBtn>
                  <HoverBtn onClick={()=>{setPage("auth");setMobileMenuOpen(false);}} variant="secondary" style={{width:"100%",padding:"14px"}}>{L.createAccount||"Register"}</HoverBtn>
                </div>
              )}
            </div>

            {/* Language section */}
            <div style={{padding:"0 20px 32px"}}>
              <h3 style={{...T.displaySm,color:C.black,marginBottom:16,fontSize:18,fontWeight:300}}>
                {L.language}
              </h3>
              {[{code:"en",label:"English"},{code:"ka",label:"ქართული"},{code:"ru",label:"Русский"}].map(opt=>(
                <button key={opt.code} onClick={()=>setLang(opt.code)}
                  style={{display:"flex",alignItems:"center",width:"100%",padding:"14px 0",background:"none",border:"none",borderBottom:`1px solid ${C.lgray}`,textAlign:"left"}}>
                  <span style={{...T.body,color:lang===opt.code?C.black:C.gray,fontSize:15,fontWeight:lang===opt.code?400:300}}>{opt.label}</span>
                  {lang===opt.code&&<span style={{marginLeft:"auto",display:"flex",alignItems:"center"}}><IconCheck size={12} color={C.tan} stroke={2}/></span>}
                  {lang!==opt.code&&<svg style={{marginLeft:"auto"}} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.gray} strokeWidth="1.5"><path d="M9 18l6-6-6-6"/></svg>}
                </button>
              ))}
            </div>
          </div>
        )}
      </>
    );
  }

  return (
    <nav style={{position:"fixed",top:0,left:0,right:0,zIndex:200,background:scrolled||megaOpen?"rgba(231,232,225,0.98)":"transparent",backdropFilter:scrolled||megaOpen?"blur(16px)":"none",borderBottom:scrolled||megaOpen?`1px solid ${C.lgray}`:"none",boxShadow:scrolled||megaOpen?"0 1px 0 rgba(0,0,0,0.04)":"none",transition:"all 0.3s ease"}}>
      <div style={{maxWidth:1360,margin:"0 auto",padding:scrolled?"16px 40px":"24px 40px",display:"flex",alignItems:"center",justifyContent:"space-between",minHeight:72,transition:"padding 0.3s ease"}}>

        {/* LEFT — Logo */}
        <button onClick={()=>setPage("home")} style={{background:"none",border:"none",padding:0,lineHeight:1,flexShrink:0,cursor:"pointer"}}>
          <Logo color={C.black} size={1}/>
        </button>

        {/* CENTER — Nav links */}
        <div style={{display:"flex",gap:44,alignItems:"center"}}>
          <button onClick={()=>setMegaOpen(!megaOpen)} style={{background:"none",border:"none",fontFamily:"'TT Interphases Pro',sans-serif",fontSize:12,fontWeight:500,letterSpacing:"0.1em",textTransform:"uppercase",color:page==="catalog"?C.tan:C.black,transition:"color 0.2s",display:"flex",alignItems:"center",gap:6,cursor:"pointer"}}>
            {L.collection} <span style={{fontSize:9,opacity:0.6,display:"inline-block",transform:megaOpen?"rotate(180deg)":"none",transition:"transform 0.2s"}}>▼</span>
          </button>
          <button onClick={()=>setPage("how")} style={{background:"none",border:"none",fontFamily:"'TT Interphases Pro',sans-serif",fontSize:12,fontWeight:500,letterSpacing:"0.1em",textTransform:"uppercase",color:page==="how"?C.tan:C.black,transition:"color 0.2s",cursor:"pointer"}}>{L.howItWorks}</button>
          <button onClick={()=>setPage("about")} style={{background:"none",border:"none",fontFamily:"'TT Interphases Pro',sans-serif",fontSize:12,fontWeight:500,letterSpacing:"0.1em",textTransform:"uppercase",color:page==="about"?C.tan:C.black,transition:"color 0.2s",cursor:"pointer"}}>{L.about}</button>
        </div>

        {/* RIGHT — Lang + 4 icons */}
        <div style={{display:"flex",gap:4,alignItems:"center"}}>

          {/* Language switcher */}
          <LangSwitcher lang={lang} setLang={setLang}/>

          <span style={{width:1,height:22,background:C.lgray,opacity:0.6,margin:"0 8px"}}/>

          {/* Search icon */}
          <button onClick={onSearch} title={L.search}
            style={{background:"none",border:"none",width:42,height:42,display:"flex",alignItems:"center",justifyContent:"center",borderRadius:6,transition:"opacity 0.2s, background 0.2s",cursor:"pointer"}}
            onMouseEnter={e=>{e.currentTarget.style.opacity="0.7";e.currentTarget.style.background="rgba(0,0,0,0.04)";}} onMouseLeave={e=>{e.currentTarget.style.opacity="1";e.currentTarget.style.background="transparent";}}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={C.black} strokeWidth="1.5">
              <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
            </svg>
          </button>

          {/* Profile icon */}
          <button onClick={()=>setPage(user?"account":"auth")} title={user?user.name:L.signIn}
            style={{background:"none",border:"none",width:42,height:42,display:"flex",alignItems:"center",justifyContent:"center",position:"relative",borderRadius:6,transition:"opacity 0.2s, background 0.2s",cursor:"pointer"}}
            onMouseEnter={e=>{e.currentTarget.style.opacity="0.7";e.currentTarget.style.background="rgba(0,0,0,0.04)";}} onMouseLeave={e=>{e.currentTarget.style.opacity="1";e.currentTarget.style.background="transparent";}}>
            <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke={user?C.tan:C.black} strokeWidth="1.5">
              <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
            </svg>
            {user&&<span style={{position:"absolute",bottom:6,right:6,width:8,height:8,borderRadius:"50%",background:C.tan,border:`2px solid ${C.cream}`}}/>}
          </button>

          {/* Wishlist / Heart icon */}
          <button onClick={()=>{window.__initAccountTab="wishlist";setPage("account");}} title={L.wishlist||"Wishlist"}
            style={{background:"none",border:"none",width:42,height:42,display:"flex",alignItems:"center",justifyContent:"center",position:"relative",borderRadius:6,transition:"opacity 0.2s, background 0.2s",cursor:"pointer"}}
            onMouseEnter={e=>{e.currentTarget.style.opacity="0.7";e.currentTarget.style.background="rgba(0,0,0,0.04)";}} onMouseLeave={e=>{e.currentTarget.style.opacity="1";e.currentTarget.style.background="transparent";}}>
            <svg width="21" height="21" viewBox="0 0 24 24" fill={wishlistCount>0?C.tan:"none"} stroke={wishlistCount>0?C.tan:C.black} strokeWidth="1.5">
              <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
            </svg>
            {wishlistCount>0&&(
              <span style={{position:"absolute",top:4,right:4,background:C.tan,color:C.white,borderRadius:"50%",minWidth:18,height:18,padding:"0 4px",fontSize:9,fontWeight:600,display:"flex",alignItems:"center",justifyContent:"center",border:`2px solid ${C.cream}`}}>{wishlistCount}</span>
            )}
          </button>

          {/* Cart / Bag icon */}
          <button onClick={onCart} title={L.orders}
            style={{background:"none",border:"none",width:42,height:42,display:"flex",alignItems:"center",justifyContent:"center",position:"relative",borderRadius:6,transition:"opacity 0.2s, background 0.2s",cursor:"pointer"}}
            onMouseEnter={e=>{e.currentTarget.style.opacity="0.7";e.currentTarget.style.background="rgba(0,0,0,0.04)";}} onMouseLeave={e=>{e.currentTarget.style.opacity="1";e.currentTarget.style.background="transparent";}}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={C.black} strokeWidth="1.5">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 01-8 0"/>
            </svg>
            {cartCount>0&&(
              <span style={{position:"absolute",top:4,right:4,background:C.black,color:C.white,borderRadius:"50%",minWidth:18,height:18,padding:"0 4px",fontSize:9,fontWeight:600,display:"flex",alignItems:"center",justifyContent:"center",border:`2px solid ${C.cream}`}}>{cartCount}</span>
            )}
          </button>

        </div>
      </div>

      {/* MEGA MENU */}
      {megaOpen&&(
        <div style={{background:"rgba(231,232,225,0.99)",borderTop:`1px solid ${C.lgray}`,animation:"slideDown 0.2s ease",position:"relative",boxShadow:"0 4px 20px rgba(0,0,0,0.06)"}}>
          <div style={{maxWidth:1360,margin:"0 auto",padding:"40px 40px 48px",display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:40}}>
            {megaCols.map((col,i)=>(
              <div key={i}>
                <p style={{fontFamily:"'TT Interphases Pro',sans-serif",fontSize:11,fontWeight:500,letterSpacing:"0.12em",textTransform:"uppercase",color:C.tan,marginBottom:16}}>{col.label}</p>
                {col.items.map((item,j)=>(
                  <button key={j} onClick={()=>onMegaLink(col.key,item)}
                    style={{display:"block",background:"none",border:"none",fontFamily:"'TT Interphases Pro',sans-serif",color:C.black,fontSize:15,marginBottom:11,padding:0,textAlign:"left",transition:"color 0.2s",cursor:"pointer",fontWeight:300}}
                    onMouseEnter={e=>e.target.style.color=C.tan}
                    onMouseLeave={e=>e.target.style.color=C.black}>
                    {item}
                  </button>
                ))}
              </div>
            ))}
          </div>
          <button onClick={()=>setMegaOpen(false)} style={{position:"absolute",top:20,right:40,background:"none",border:"none",color:C.gray,fontSize:24,width:36,height:36,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",transition:"color 0.2s"}} onMouseEnter={e=>e.currentTarget.style.color=C.black} onMouseLeave={e=>e.currentTarget.style.color=C.gray}>×</button>
        </div>
      )}
    </nav>
  );
}
