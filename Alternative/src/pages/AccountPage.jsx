import { useState, useEffect } from 'react';
import { C, T } from '../constants/theme.js';
import { PRODUCTS } from '../constants/data.js';
import HoverBtn from '../components/ui/HoverBtn.jsx';
import ProductCard from '../components/ui/ProductCard.jsx';

// ── ACCOUNT PAGE ──────────────────────────────────────────────────────────────
export default function AccountPage({mobile,user,setUser,setPage,orders,wishlist,onWishlist,toast,L}) {
  const [tab,setTab]=useState("orders"); // orders | wishlist | settings

  useEffect(()=>{if(window.__initAccountTab){setTab(window.__initAccountTab);delete window.__initAccountTab;}},[]);
  useEffect(()=>{if(!user)setPage("auth");},[user]);
  if (!user) return null;

  const wishlistItems = (wishlist||[]).map(id=>PRODUCTS.find(p=>p.id===id)).filter(Boolean);

  return (
    <div style={{paddingTop:mobile?52:80,minHeight:"100vh",background:C.cream}}>
      <div style={{borderBottom:`1px solid ${C.lgray}`,padding:"36px 0 24px"}}>
        <div style={{maxWidth:1360,margin:"0 auto",padding:"0 40px",display:"flex",justifyContent:"space-between",alignItems:"flex-end"}}>
          <div>
            <p style={{...T.labelSm,color:C.tan,marginBottom:8}}>{L&&L.myAccount||"My Account"}</p>
            <h1 style={{...T.displayMd,color:C.black}}>{L&&L.welcome||"Welcome,"} {user.name?user.name.split(" ")[0]:""}</h1>
          </div>
          <div style={{display:"flex",gap:10}}>
            {user.isAdmin&&<HoverBtn onClick={()=>setPage("admin")} variant="tan" style={{padding:"10px 20px",fontSize:10}}>{L&&L.adminPanel||"Admin Panel"}</HoverBtn>}
            <HoverBtn onClick={()=>{setUser(null);toast(L&&L.signedOut||"Signed out successfully.","success");setPage("home");}} variant="secondary" style={{padding:"10px 20px",fontSize:10}}>{L&&L.signOut||"Sign Out"}</HoverBtn>
          </div>
        </div>
      </div>

      <div style={{maxWidth:1360,margin:"0 auto",padding:"36px 40px",display:"grid",gridTemplateColumns:mobile?"1fr":"220px 1fr",gap:mobile?20:48}}>
        <div>
          <div style={{padding:"18px",background:C.offwhite,marginBottom:20,borderLeft:`3px solid ${C.tan}`}}>
            <p style={{...T.label,color:C.black,fontSize:12,marginBottom:3}}>{user.name}</p>
            <p style={{...T.bodySm,color:C.gray}}>{user.email}</p>
          </div>
          {[["orders",L&&L.myOrders||"My Orders"],["wishlist",`${L&&L.wishlist||"Wishlist"} (${wishlistItems.length})`],["settings",L&&L.settings||"Settings"]].map(([k,l])=>(
            <button key={k} onClick={()=>setTab(k)} style={{display:"block",width:"100%",textAlign:"left",padding:"12px 0",background:"none",border:"none",borderBottom:`1px solid ${C.lgray}`,...T.bodySm,color:tab===k?C.black:C.gray,fontWeight:tab===k?500:300}}>
              {l}
            </button>
          ))}
        </div>

        <div>
          {tab==="orders"&&(
            <>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
                <p style={{...T.label,color:C.black,fontSize:12}}>Recent Orders</p>
                <button onClick={()=>setPage("orders")} style={{background:"none",border:"none",...T.labelSm,color:C.tan,fontSize:9,textDecoration:"underline"}}>{L.viewAll}</button>
              </div>
              {orders.length===0?(
                <div style={{padding:"48px 32px",textAlign:"center",background:C.offwhite}}>
                  <p style={{...T.body,color:C.gray,marginBottom:20}}>No orders yet. Start browsing.</p>
                  <HoverBtn onClick={()=>setPage("catalog")} variant="primary">Explore Collection</HoverBtn>
                </div>
              ):orders.map(o=>(
                <div key={o.orderId} style={{display:"flex",gap:14,padding:"14px",background:C.offwhite,marginBottom:2,cursor:"pointer",transition:"background 0.15s"}}
                  onClick={()=>setPage("orders")}
                  onMouseEnter={e=>e.currentTarget.style.background=C.lgray}
                  onMouseLeave={e=>e.currentTarget.style.background=C.offwhite}>
                  <img src={o.img} alt={o.name} style={{width:60,height:60,objectFit:"cover",flexShrink:0}}/>
                  <div style={{flex:1,minWidth:0}}>
                    <p style={{...T.heading,color:C.black,fontSize:12,marginBottom:3,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{o.name}</p>
                    <p style={{...T.labelSm,color:C.gray,fontSize:8,marginBottom:5}}>{o.orderId}</p>
                    <div style={{display:"flex",gap:6,alignItems:"center"}}>
                      <div style={{width:5,height:5,borderRadius:"50%",background:C.tan}}/>
                      <span style={{...T.labelSm,fontSize:8,color:C.tan}}>Processing</span>
                    </div>
                  </div>
                  <p style={{...T.bodySm,color:C.black,flexShrink:0}}>GEL {o.sale||o.price}</p>
                </div>
              ))}
            </>
          )}

          {tab==="wishlist"&&(
            <>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
                <p style={{...T.label,color:C.black,fontSize:12}}>{L&&L.wishlist||"Wishlist"} ({wishlistItems.length})</p>
              </div>
              {wishlistItems.length===0?(
                <div style={{padding:"48px 32px",textAlign:"center",background:C.offwhite}}>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={C.lgray} strokeWidth="1.5" style={{marginBottom:16}}>
                    <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
                  </svg>
                  <p style={{...T.body,color:C.gray,marginBottom:8}}>Your wishlist is empty.</p>
                  <p style={{...T.bodySm,color:C.gray,marginBottom:20}}>Browse the collection and tap the heart icon to save items you love.</p>
                  <HoverBtn onClick={()=>setPage("catalog")} variant="primary">Explore Collection</HoverBtn>
                </div>
              ):(
                <div style={{display:"grid",gridTemplateColumns:mobile?"1fr 1fr":"repeat(3,1fr)",gap:3}}>
                  {wishlistItems.map(p=>(
                    <ProductCard key={p.id} product={p} wishlist={wishlist} onWishlist={onWishlist} L={L}
                      onSelect={()=>setPage("product",p)} mobile={mobile}/>
                  ))}
                </div>
              )}
            </>
          )}

          {tab==="settings"&&(
            <div style={{maxWidth:480}}>
              <p style={{...T.label,color:C.black,fontSize:12,marginBottom:20}}>Account Settings</p>
              {[["Full Name",user.name],["Email",user.email],["WhatsApp","Not set"]].map(([label,val])=>(
                <div key={label} style={{marginBottom:14}}>
                  <label style={{...T.labelSm,color:C.gray,fontSize:9,display:"block",marginBottom:6}}>{label}</label>
                  <div style={{display:"flex",gap:10}}>
                    <input defaultValue={val} style={{flex:1,padding:"11px 14px",border:`1px solid ${C.lgray}`,background:C.white,fontSize:14,color:C.black,outline:"none"}}/>
                    <HoverBtn variant="ghost" style={{padding:"11px 18px",fontSize:9}}>Edit</HoverBtn>
                  </div>
                </div>
              ))}
              <HoverBtn onClick={()=>toast("Settings saved.","success")} variant="primary" style={{marginTop:8,padding:"13px 32px"}}>Save Changes</HoverBtn>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
