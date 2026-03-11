import { useState, useEffect, useCallback } from 'react';
import { C, T } from '../constants/theme.js';
import { api } from '../api.js';

import Sidebar from '../components/Sidebar.jsx';
import DashboardOverview from '../components/DashboardOverview.jsx';
import OrdersPanel from '../components/OrdersPanel.jsx';
import ProductsPanel from '../components/ProductsPanel.jsx';
import CustomersPanel from '../components/CustomersPanel.jsx';
import SubscribersPanel from '../components/SubscribersPanel.jsx';
import StatsPanel from '../components/StatsPanel.jsx';
import SettingsPanel from '../components/SettingsPanel.jsx';
import PromosPanel from '../components/PromosPanel.jsx';
import ReturnsPanel from '../components/ReturnsPanel.jsx';
import AffiliatesPanel from '../components/AffiliatesPanel.jsx';
import SuppliersPanel from '../components/SuppliersPanel.jsx';
import SupplierDashboard from '../components/SupplierDashboard.jsx';

// ── ADMIN DASHBOARD (Shell) ──────────────────────────────────────────────────
export default function AdminDashboard({ mobile, user, onLogout, L, lang, setLang }) {
  const [tab, setTab] = useState("dashboard");
  const [toasts, setToasts] = useState([]);

  const toast = useCallback((message, type = "info") => {
    const id = Date.now();
    setToasts(p => [...p, { id, message, type }]);
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 3200);
  }, []);

  // ── Data from API ──────────────────────────────────────────────────────────
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const refreshData = useCallback(() => {
    setLoading(true);
    Promise.all([
      api.getProducts().catch(err => { toast("Failed to load products", "error"); return { products: [] }; }),
      user?.role === 'admin'
        ? api.getOrders().catch(err => { toast("Failed to load orders", "error"); return { orders: [] }; })
        : Promise.resolve({ orders: [] }),
    ]).then(([pData, oData]) => {
      setProducts(pData.products || []);
      setOrders(oData.orders || []);
      setLoading(false);
    });
  }, [toast, user]);

  useEffect(() => { refreshData(); }, [refreshData]);

  // ── Render active panel ────────────────────────────────────────────────────
  const renderPanel = () => {
    switch (tab) {
      case "dashboard":
        return <DashboardOverview orders={orders} products={products} mobile={mobile} setTab={setTab} L={L} lang={lang} refreshData={refreshData} />;
      case "orders":
        return <OrdersPanel orders={orders} setOrders={setOrders} products={products} mobile={mobile} toast={toast} L={L} refreshData={refreshData} />;
      case "products":
        return <ProductsPanel products={products} setProducts={setProducts} mobile={mobile} toast={toast} L={L} />;
      case "customers":
        return <CustomersPanel orders={orders} mobile={mobile} toast={toast} L={L} />;
      case "subscribers":
        return <SubscribersPanel mobile={mobile} toast={toast} L={L} />;
      case "stats":
        return <StatsPanel orders={orders} mobile={mobile} L={L} />;
      case "promos":
        return <PromosPanel mobile={mobile} toast={toast} L={L} />;
      case "returns":
        return <ReturnsPanel mobile={mobile} toast={toast} L={L} />;
      case "affiliates":
        return <AffiliatesPanel mobile={mobile} toast={toast} L={L} />;
      case "suppliers":
        return <SuppliersPanel mobile={mobile} toast={toast} L={L} />;
      case "my-products":
      case "my-orders":
      case "earnings":
        return <SupplierDashboard tab={tab} mobile={mobile} toast={toast} L={L} user={user} />;
      case "settings":
        return <SettingsPanel mobile={mobile} toast={toast} L={L} />;
      default:
        if (user?.role === 'supplier') return <SupplierDashboard tab="dashboard" mobile={mobile} toast={toast} L={L} user={user} />;
        return <DashboardOverview orders={orders} products={products} mobile={mobile} setTab={setTab} L={L} lang={lang} />;
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: C.offwhite, display: "flex" }}>

      {/* Sidebar */}
      <Sidebar
        activeTab={tab}
        setTab={setTab}
        user={user}
        onLogout={onLogout}
        mobile={mobile}
        lang={lang}
        setLang={setLang}
        L={L}
      />

      {/* Main content */}
      <main style={{
        flex: 1,
        marginLeft: mobile ? 0 : 250,
        paddingTop: mobile ? 60 : 0,
        minHeight: "100vh",
      }}>
        {/* Top header bar */}
        {!mobile && (
          <div style={{
            padding: "16px 40px", borderBottom: `1px solid ${C.border}`, background: C.white,
            display: "flex", justifyContent: "space-between", alignItems: "center",
            position: "sticky", top: 0, zIndex: 50,
          }}>
            <p style={{ ...T.label, color: C.black, fontSize: 12 }}>
              {(L?.[{dashboard:"navDashboard",orders:"navOrders",products:"navProducts",customers:"navCustomers",subscribers:"navSubscribers",promos:"navPromos",returns:"navReturns",affiliates:"navAffiliates",suppliers:"navSuppliers",stats:"navStatistics",settings:"navSettings","my-products":"navMyProducts","my-orders":"navMyOrders",earnings:"navEarnings"}[tab]] || tab).toUpperCase()}
            </p>
          </div>
        )}

        {/* Toast display */}
        {toasts.length > 0 && (
          <div style={{ position: "fixed", top: mobile ? 66 : 20, right: 20, zIndex: 999, display: "flex", flexDirection: "column", gap: 8 }}>
            {toasts.map(t => (
              <div key={t.id} style={{
                padding: "10px 18px",
                background: t.type === "success" ? C.black : t.type === "error" ? "#6b1818" : C.brown,
                color: C.white, ...T.bodySm, fontSize: 12, borderRadius: 2,
                animation: "slideDown 0.2s ease", boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
              }}>
                {t.message}
              </div>
            ))}
          </div>
        )}

        <div style={{ maxWidth: 1200, margin: "0 auto", padding: mobile ? "24px 16px" : "32px 40px" }}>
          {renderPanel()}
        </div>
      </main>
    </div>
  );
}
