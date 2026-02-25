import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation, Routes, Route, Navigate } from 'react-router-dom';
import { STYLES } from './constants/theme.js';
import { LANG_DATA } from './constants/translations.js';
import { WHATSAPP_NUMBER } from './constants/config.js';
import useIsMobile from './hooks/useIsMobile.js';

import Nav from './components/layout/Nav.jsx';
import ToastContainer from './components/ui/ToastContainer.jsx';
import SearchOverlay from './components/overlays/SearchOverlay.jsx';
import CartDrawer from './components/overlays/CartDrawer.jsx';

import HomePage from './pages/HomePage.jsx';
import CatalogPage from './pages/CatalogPage.jsx';
import ProductPage from './pages/ProductPage.jsx';
import HowItWorksPage from './pages/HowItWorksPage.jsx';
import AboutPage from './pages/AboutPage.jsx';
import OrdersPage from './pages/OrdersPage.jsx';
import AuthPage from './pages/AuthPage.jsx';
import AccountPage from './pages/AccountPage.jsx';
import AdminPanel from './pages/AdminPanel.jsx';
import BrandsPage from './pages/BrandsPage.jsx';
import VideoVerificationPage from './pages/VideoVerificationPage.jsx';
import MembershipPage from './pages/MembershipPage.jsx';
import LegalPage from './pages/LegalPage.jsx';
import ContactPage from './pages/ContactPage.jsx';

const STORAGE_KEYS = { cart: "alternative_cart", wishlist: "alternative_wishlist", lang: "alternative_lang" };

function readStorage(key, fallback) {
  try {
    const raw = typeof window !== "undefined" && window.localStorage && window.localStorage.getItem(key);
    if (raw == null) return fallback;
    if (key === STORAGE_KEYS.lang) return ["en","ka","ru"].includes(raw) ? raw : fallback;
    return JSON.parse(raw);
  } catch (_) {
    return fallback;
  }
}

// ── APP ROOT ──────────────────────────────────────────────────────────────────
export default function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const pathname = location.pathname || "/";
  const pageFromRoute = pathname === "/" ? "home" : pathname.slice(1).split("/")[0];

  const [selected,setSelected]=useState(null);
  const [cart,setCart]=useState(()=>readStorage(STORAGE_KEYS.cart,[]));
  const [user,setUser]=useState(null);
  const [wishlist,setWishlist]=useState(()=>readStorage(STORAGE_KEYS.wishlist,[]));
  const [showSearch,setShowSearch]=useState(false);
  const [showCart,setShowCart]=useState(false);
  const [toasts,setToasts]=useState([]);
  const [lang,setLang]=useState(()=>readStorage(STORAGE_KEYS.lang,"en"));
  const mobile = useIsMobile();

  const setPage = useCallback((page, payload) => {
    if (page === "product" && payload?.id != null) navigate("/product/" + payload.id);
    else if (page === "home") navigate("/");
    else navigate("/" + page);
  }, [navigate]);

  const page = pageFromRoute;

  // Active translation object
  const L = LANG_DATA[lang] || LANG_DATA.en;

  useEffect(()=>{window.scrollTo({top:0,behavior:"smooth"});},[pathname]);

  // Persist cart, wishlist, lang to localStorage
  useEffect(()=>{
    try {
      if (typeof window!=="undefined"&&window.localStorage) {
        window.localStorage.setItem(STORAGE_KEYS.cart,JSON.stringify(cart));
      }
    } catch (_) {}
  },[cart]);
  useEffect(()=>{
    try {
      if (typeof window!=="undefined"&&window.localStorage) {
        window.localStorage.setItem(STORAGE_KEYS.wishlist,JSON.stringify(wishlist));
      }
    } catch (_) {}
  },[wishlist]);
  useEffect(()=>{
    try {
      if (typeof window!=="undefined"&&window.localStorage) {
        window.localStorage.setItem(STORAGE_KEYS.lang,lang);
      }
    } catch (_) {}
  },[lang]);

  const toast=useCallback((message,type="info")=>{
    const id=Date.now();
    setToasts(p=>[...p,{id,message,type}]);
    setTimeout(()=>setToasts(p=>p.filter(t=>t.id!==id)),3200);
  },[]);

  const addToCart=useCallback((item)=>{
    setCart(p=>[item,...p]);
  },[]);

  const removeFromCart=useCallback((i)=>{
    setCart(p=>p.filter((_,idx)=>idx!==i));
    toast(L.removedCart,"");
  },[L]);

  const onWishlist=useCallback((id)=>{
    setWishlist(prev=>{
      if (prev.includes(id)){
        toast(L.removedWishlist,"");
        return prev.filter(x=>x!==id);
      }
      toast(L.addedWishlist,"success");
      return [...prev,id];
    });
  },[L]);

  const commonProps={setPage,toast,user,setUser,L};

  return (
    <>
      <style>{STYLES}</style>
      <Nav page={page} setPage={setPage} cartCount={cart.length}
        user={user} setUser={setUser}
        onSearch={()=>setShowSearch(true)} onCart={()=>setShowCart(true)}
        wishlistCount={wishlist.length}
        lang={lang} setLang={setLang} L={L} mobile={mobile}/>
      <Routes>
        <Route path="/" element={<HomePage setPage={setPage} setSelected={setSelected} L={L} mobile={mobile}/>}/>
        <Route path="/catalog" element={<CatalogPage {...commonProps} setSelected={setSelected} wishlist={wishlist} onWishlist={onWishlist} mobile={mobile}/>}/>
        <Route path="/product/:id" element={<ProductPage {...commonProps} setSelected={setSelected} addToCart={addToCart} wishlist={wishlist} onWishlist={onWishlist} mobile={mobile}/>}/>
        <Route path="/how" element={<HowItWorksPage setPage={setPage} L={L} mobile={mobile}/>}/>
        <Route path="/about" element={<AboutPage setPage={setPage} L={L} mobile={mobile}/>}/>
        <Route path="/orders" element={<OrdersPage orders={cart} setPage={setPage} toast={toast} L={L} mobile={mobile}/>}/>
        <Route path="/auth" element={<AuthPage setPage={setPage} setUser={setUser} toast={toast} L={L} mobile={mobile}/>}/>
        <Route path="/account" element={<AccountPage {...commonProps} orders={cart} wishlist={wishlist} onWishlist={onWishlist} mobile={mobile}/>}/>
        <Route path="/admin" element={<AdminPanel {...commonProps} orders={cart} mobile={mobile}/>}/>
        <Route path="/brands" element={<BrandsPage setPage={setPage} setSelected={setSelected} L={L} mobile={mobile}/>}/>
        <Route path="/video-verification" element={<VideoVerificationPage setPage={setPage} L={L} mobile={mobile}/>}/>
        <Route path="/membership" element={<MembershipPage setPage={setPage} L={L} mobile={mobile}/>}/>
        <Route path="/privacy" element={<LegalPage type="privacy" setPage={setPage} L={L} mobile={mobile}/>}/>
        <Route path="/terms" element={<LegalPage type="terms" setPage={setPage} L={L} mobile={mobile}/>}/>
        <Route path="/returns" element={<LegalPage type="returns" setPage={setPage} L={L} mobile={mobile}/>}/>
        <Route path="/shipping" element={<LegalPage type="shipping" setPage={setPage} L={L} mobile={mobile}/>}/>
        <Route path="/accessibility" element={<LegalPage type="accessibility" setPage={setPage} L={L} mobile={mobile}/>}/>
        <Route path="/contact" element={<ContactPage setPage={setPage} L={L} mobile={mobile}/>}/>
        <Route path="*" element={<Navigate to="/" replace/>}/>
      </Routes>
      {showSearch&&<SearchOverlay onClose={()=>setShowSearch(false)} setPage={setPage} setSelected={setSelected} L={L} mobile={mobile}/>}
      {showCart&&<CartDrawer cart={cart} onClose={()=>setShowCart(false)} setPage={setPage} removeFromCart={removeFromCart} L={L} mobile={mobile}/>}
      {/* FLOATING WHATSAPP */}
      {page!=="admin"&&(
        <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer"
          style={{position:"fixed",bottom:mobile?72:32,right:mobile?16:32,zIndex:999,width:56,height:56,borderRadius:"50%",background:"#25D366",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 4px 16px rgba(37,211,102,0.4)",textDecoration:"none",transition:"transform 0.2s"}}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
        </a>
      )}

      <ToastContainer toasts={toasts} mobile={mobile}/>
    </>
  );
}
