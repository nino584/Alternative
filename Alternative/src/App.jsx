import { useState, useEffect, useCallback, lazy, Suspense } from 'react';
import { useNavigate, useLocation, Routes, Route, Navigate } from 'react-router-dom';
import { STYLES } from './constants/theme.js';
import { LANG_DATA } from './constants/translations.js';
import { PRODUCTS as FALLBACK_PRODUCTS } from './constants/data.js';
import { api } from './api.js';
import useIsMobile from './hooks/useIsMobile.js';
import { productUrl, organizationSchema, websiteSchema } from './utils/seo.js';
import SEO from './components/SEO.jsx';

import LoadingScreen from './components/ui/LoadingScreen.jsx';
import AppBanner from './components/ui/AppBanner.jsx';
import ErrorBoundary from './components/ErrorBoundary.jsx';
import Nav from './components/layout/Nav.jsx';
import ToastContainer from './components/ui/ToastContainer.jsx';
import CookieConsent, { initAnalyticsIfConsented } from './components/ui/CookieConsent.jsx';
import SearchOverlay from './components/overlays/SearchOverlay.jsx';
import CartDrawer from './components/overlays/CartDrawer.jsx';
import StylistChat from './components/ui/StylistChat.jsx';
const CheckoutPage = lazy(() => import('./pages/CheckoutPage.jsx'));

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
const NotFoundPage = lazy(() => import('./pages/NotFoundPage.jsx'));

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

  const [siteLoaded, setSiteLoaded] = useState(false);
  const [selected,setSelected]=useState(null);
  const [cart,setCart]=useState(()=>readStorage(STORAGE_KEYS.cart,[]));
  const [orders,setOrders]=useState(()=>readStorage(STORAGE_KEYS.orders,[]));
  const [user,setUser]=useState(null);
  const [wishlist,setWishlist]=useState(()=>readStorage(STORAGE_KEYS.wishlist,[]));
  const [products,setProducts]=useState(FALLBACK_PRODUCTS);
  const [showSearch,setShowSearch]=useState(false);
  const [bannerH,setBannerH]=useState(0);
  const [showCart,setShowCart]=useState(false);
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
      if (data?.user) {
        setUser(data.user);
        // Fetch user's orders from server
        api.getOrders().then(oData => {
          if (oData?.orders?.length) setOrders(oData.orders);
        }).catch(() => {});
        // Sync wishlist from server
        api.getWishlist().then(wData => {
          if (Array.isArray(wData?.items) && wData.items.length > 0) setWishlist(wData.items);
        }).catch(() => {});
      }
    }).catch(() => { /* not logged in */ });

    // Load products from API (fall back to hardcoded)
    api.getProducts().then(data => {
      if (data?.products?.length) setProducts(data.products);
    }).catch(() => { /* use fallback */ });

    // Load analytics if user previously consented
    initAnalyticsIfConsented();
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
    // Sync to server if logged in
    if (user) api.saveWishlist(wishlist).catch(() => {});
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

  const updateCartQty=useCallback((i,delta)=>{
    setCart(p=>p.map((item,idx)=>{
      if(idx!==i)return item;
      const newQty=Math.max(1,(item.qty||1)+delta);
      return{...item,qty:newQty};
    }));
  },[]);

  const placeOrder=useCallback(()=>{
    setCart([]);
    // Don't close checkout — step 3 "Thank You" page still shows
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

  const onLoadComplete = useCallback(() => { setSiteLoaded(true); try { sessionStorage.setItem('alt_loaded', '1'); } catch {} }, []);

  const commonProps={setPage,toast,user,setUser,L,onLogout:handleLogout};

  return (
    <>
    {!siteLoaded && <LoadingScreen onComplete={onLoadComplete} />}
    <ErrorBoundary>
      <SEO schema={[organizationSchema(), websiteSchema()]} lang={lang} />
      <style>{STYLES}{`
        .skip-link{position:absolute;top:-40px;left:0;background:#191919;color:#fff;padding:8px 16px;z-index:10000;font-size:14px;transition:top 0.2s}
        .skip-link:focus{top:0}
        *:focus-visible{outline:2px solid #b19a7a;outline-offset:2px}
      `}</style>
      <a href="#main-content" className="skip-link">Skip to content</a>
      {siteLoaded&&<AppBanner mobile={mobile} onHeightChange={setBannerH}/>}
      {page!=="checkout"&&<Nav page={page} setPage={setPage} cartCount={cart.length}
        user={user} setUser={setUser} onLogout={handleLogout}
        onSearch={()=>setShowSearch(true)} onCart={()=>setShowCart(true)}
        wishlistCount={wishlist.length}
        lang={lang} setLang={setLang} L={L} mobile={mobile} topOffset={bannerH}/>}
      <main id="main-content" role="main">
      <Suspense fallback={<div style={{minHeight:"100vh"}} role="status" aria-label="Loading page"/>}>
        <Routes>
          <Route path="/" element={<HomePage setPage={setPage} setSelected={setSelected} products={products} wishlist={wishlist} onWishlist={onWishlist} L={L} lang={lang} mobile={mobile}/>}/>
          <Route path="/catalog" element={<CatalogPage {...commonProps} setSelected={setSelected} products={products} wishlist={wishlist} onWishlist={onWishlist} mobile={mobile} topOffset={bannerH}/>}/>
          <Route path="/product/:slug" element={<ProductPage {...commonProps} setSelected={setSelected} products={products} addToCart={addToCart} wishlist={wishlist} onWishlist={onWishlist} mobile={mobile}/>}/>
          <Route path="/how" element={<HowItWorksPage setPage={setPage} L={L} mobile={mobile}/>}/>
          <Route path="/about" element={<AboutPage setPage={setPage} L={L} mobile={mobile}/>}/>
          <Route path="/orders" element={<OrdersPage orders={orders} products={products} setPage={setPage} toast={toast} L={L} mobile={mobile}/>}/>
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
          <Route path="/checkout" element={<CheckoutPage cart={cart} user={user} L={L} setPage={setPage} onComplete={placeOrder} toast={toast} mobile={mobile}/>}/>
          <Route path="*" element={<NotFoundPage setPage={setPage} L={L} mobile={mobile}/>}/>
        </Routes>
      </Suspense>
      </main>
      {showSearch&&<SearchOverlay onClose={()=>setShowSearch(false)} setPage={setPage} setSelected={setSelected} products={products} L={L} mobile={mobile}/>}
      {showCart&&<CartDrawer cart={cart} onClose={()=>setShowCart(false)} setPage={setPage} removeFromCart={removeFromCart} updateCartQty={updateCartQty} onCheckout={()=>{setShowCart(false);setPage("checkout");}} L={L} mobile={mobile}/>}
      <StylistChat mobile={mobile} lang={lang} setPage={setPage} L={L}/>
      <ToastContainer toasts={toasts} mobile={mobile} role="status" aria-live="polite"/>
      <CookieConsent L={L} mobile={mobile} setPage={setPage}/>
    </ErrorBoundary>
    </>
  );
}
