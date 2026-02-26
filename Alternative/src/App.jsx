import { useState, useEffect, useCallback, lazy, Suspense } from 'react';
import { useNavigate, useLocation, Routes, Route, Navigate } from 'react-router-dom';
import { STYLES } from './constants/theme.js';
import { LANG_DATA } from './constants/translations.js';
import { PRODUCTS as FALLBACK_PRODUCTS } from './constants/data.js';
import { api } from './api.js';
import useIsMobile from './hooks/useIsMobile.js';
import { productUrl, organizationSchema, websiteSchema } from './utils/seo.js';
import SEO from './components/SEO.jsx';

import Nav from './components/layout/Nav.jsx';
import ToastContainer from './components/ui/ToastContainer.jsx';
import SearchOverlay from './components/overlays/SearchOverlay.jsx';
import CartDrawer from './components/overlays/CartDrawer.jsx';
import StylistChat from './components/ui/StylistChat.jsx';
import CheckoutModal from './components/overlays/CheckoutModal.jsx';

import HomePage from './pages/HomePage.jsx';
import CatalogPage from './pages/CatalogPage.jsx';
import ProductPage from './pages/ProductPage.jsx';
const HowItWorksPage = lazy(() => import('./pages/HowItWorksPage.jsx'));
const AboutPage = lazy(() => import('./pages/AboutPage.jsx'));
const OrdersPage = lazy(() => import('./pages/OrdersPage.jsx'));
const AuthPage = lazy(() => import('./pages/AuthPage.jsx'));
const AccountPage = lazy(() => import('./pages/AccountPage.jsx'));
const BrandsPage = lazy(() => import('./pages/BrandsPage.jsx'));
const VideoVerificationPage = lazy(() => import('./pages/VideoVerificationPage.jsx'));
const MembershipPage = lazy(() => import('./pages/MembershipPage.jsx'));
const LegalPage = lazy(() => import('./pages/LegalPage.jsx'));
const ContactPage = lazy(() => import('./pages/ContactPage.jsx'));

const STORAGE_KEYS = { cart: "alternative_cart", orders: "alternative_orders", wishlist: "alternative_wishlist", lang: "alternative_lang" };

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
  const [orders,setOrders]=useState(()=>readStorage(STORAGE_KEYS.orders,[]));
  const [user,setUser]=useState(null);
  const [wishlist,setWishlist]=useState(()=>readStorage(STORAGE_KEYS.wishlist,[]));
  const [products,setProducts]=useState(FALLBACK_PRODUCTS);
  const [showSearch,setShowSearch]=useState(false);
  const [showCart,setShowCart]=useState(false);
  const [showCheckout,setShowCheckout]=useState(false);
  const [toasts,setToasts]=useState([]);
  const [lang,setLang]=useState(()=>readStorage(STORAGE_KEYS.lang,"en"));
  const mobile = useIsMobile();

  const setPage = useCallback((page, payload) => {
    if (page === "product" && payload) {
      // Support both full product objects and {id} refs
      const prod = payload.id != null ? (products.find(p=>p.id===payload.id) || payload) : payload;
      if (prod.brand && prod.name) navigate(productUrl(prod));
      else navigate("/product/" + (prod.id || payload.id));
    }
    else if (page === "home") navigate("/");
    else navigate("/" + page);
  }, [navigate, products]);

  const page = pageFromRoute;
  const L = LANG_DATA[lang] || LANG_DATA.en;

  useEffect(()=>{window.scrollTo({top:0,behavior:"smooth"});},[pathname]);

  // ── Restore session + load products from API on mount ──────────────────
  useEffect(() => {
    // Try to restore user session from cookie
    api.me().then(data => {
      if (data?.user) setUser(data.user);
    }).catch(() => { /* not logged in */ });

    // Load products from API (fall back to hardcoded)
    api.getProducts().then(data => {
      if (data?.products?.length) setProducts(data.products);
    }).catch(() => { /* use fallback */ });
  }, []);

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
        window.localStorage.setItem(STORAGE_KEYS.orders,JSON.stringify(orders));
      }
    } catch (_) {}
  },[orders]);
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

  const addToCart=useCallback((product, selectedSize, notes)=>{
    const item={id:product.id,name:product.name,img:product.img,color:product.color,price:product.price,sale:product.sale,brand:product.brand,section:product.section,lead:product.lead,selectedSize:selectedSize||"One Size",qty:1,addedAt:Date.now(),notes:notes||""};
    setCart(p=>[item,...p]);
  },[]);

  const removeFromCart=useCallback((i)=>{
    setCart(p=>p.filter((_,idx)=>idx!==i));
    toast(L.removedCart,"");
  },[L]);

  const placeOrder=useCallback((orderData)=>{
    setOrders(p=>[orderData,...p]);
    setCart([]);
    setShowCheckout(false);
  },[]);

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

  // Logout handler that clears server session
  const handleLogout = useCallback(async () => {
    try { await api.logout(); } catch (_) {}
    setUser(null);
    setPage("home");
  }, [setPage]);

  const commonProps={setPage,toast,user,setUser,L,onLogout:handleLogout};

  return (
    <>
      <SEO schema={[organizationSchema(), websiteSchema()]} lang={lang} />
      <style>{STYLES}</style>
      <Nav page={page} setPage={setPage} cartCount={cart.length}
        user={user} setUser={setUser} onLogout={handleLogout}
        onSearch={()=>setShowSearch(true)} onCart={()=>setShowCart(true)}
        wishlistCount={wishlist.length}
        lang={lang} setLang={setLang} L={L} mobile={mobile}/>
      <Suspense fallback={<div style={{minHeight:"100vh"}}/>}>
        <Routes>
          <Route path="/" element={<HomePage setPage={setPage} setSelected={setSelected} products={products} wishlist={wishlist} onWishlist={onWishlist} L={L} mobile={mobile}/>}/>
          <Route path="/catalog" element={<CatalogPage {...commonProps} setSelected={setSelected} products={products} wishlist={wishlist} onWishlist={onWishlist} mobile={mobile}/>}/>
          <Route path="/product/:slug" element={<ProductPage {...commonProps} setSelected={setSelected} products={products} addToCart={addToCart} wishlist={wishlist} onWishlist={onWishlist} mobile={mobile}/>}/>
          <Route path="/how" element={<HowItWorksPage setPage={setPage} L={L} mobile={mobile}/>}/>
          <Route path="/about" element={<AboutPage setPage={setPage} L={L} mobile={mobile}/>}/>
          <Route path="/orders" element={<OrdersPage orders={orders} setPage={setPage} toast={toast} L={L} mobile={mobile}/>}/>
          <Route path="/auth" element={<AuthPage setPage={setPage} setUser={setUser} toast={toast} L={L} mobile={mobile}/>}/>
          <Route path="/account" element={<AccountPage {...commonProps} orders={orders} products={products} wishlist={wishlist} onWishlist={onWishlist} mobile={mobile}/>}/>
          <Route path="/brands" element={<BrandsPage setPage={setPage} setSelected={setSelected} products={products} L={L} mobile={mobile}/>}/>
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
      </Suspense>
      {showSearch&&<SearchOverlay onClose={()=>setShowSearch(false)} setPage={setPage} setSelected={setSelected} products={products} L={L} mobile={mobile}/>}
      {showCart&&<CartDrawer cart={cart} onClose={()=>setShowCart(false)} setPage={setPage} removeFromCart={removeFromCart} onCheckout={()=>{setShowCart(false);setShowCheckout(true);}} L={L} mobile={mobile}/>}
      {showCheckout&&<CheckoutModal cart={cart} user={user} L={L} onClose={()=>setShowCheckout(false)} setPage={setPage} onComplete={placeOrder} toast={toast}/>}
      <StylistChat mobile={mobile} lang={lang} setPage={setPage} L={L}/>
      <ToastContainer toasts={toasts} mobile={mobile}/>
    </>
  );
}
