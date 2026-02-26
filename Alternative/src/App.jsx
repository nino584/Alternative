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
import StylistChat from './components/ui/StylistChat.jsx';

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
      {/* AI STYLIST CHAT */}
      {page!=="admin"&&<StylistChat mobile={mobile} lang={lang} setPage={setPage} L={L}/>}

      <ToastContainer toasts={toasts} mobile={mobile}/>
    </>
  );
}
