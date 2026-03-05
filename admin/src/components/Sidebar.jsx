import { useState } from 'react';
import { C, T } from '../constants/theme.js';
import { Logo } from './Logo.jsx';

// ── SVG Icons ─────────────────────────────────────────────────────────────────
const icons = {
  dashboard: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>,
  orders: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="1"/><path d="M9 14l2 2 4-4"/></svg>,
  products: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>,
  customers: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>,
  subscribers: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>,
  promos: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 5H3v14h18V5z"/><path d="M12 5v14"/><circle cx="7" cy="10" r="1" fill="currentColor"/><circle cx="17" cy="14" r="1" fill="currentColor"/></svg>,
  returns: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M1 4v6h6"/><path d="M3.51 15a9 9 0 102.13-9.36L1 10"/></svg>,
  stats: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
  affiliates: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></svg>,
  suppliers: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  earnings: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>,
  settings: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>,
  logout: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
  menu: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>,
  close: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
};

const NAV_KEYS = [
  { key: "dashboard", tKey: "navDashboard", fallback: "Dashboard", icon: "dashboard", roles: ["admin", "supplier"] },
  { key: "orders", tKey: "navOrders", fallback: "Orders", icon: "orders", roles: ["admin"] },
  { key: "products", tKey: "navProducts", fallback: "Products", icon: "products", roles: ["admin"] },
  { key: "customers", tKey: "navCustomers", fallback: "Customers", icon: "customers", roles: ["admin"] },
  { key: "subscribers", tKey: "navSubscribers", fallback: "Subscribers", icon: "subscribers", roles: ["admin"] },
  { key: "promos", tKey: "navPromos", fallback: "Promo Codes", icon: "promos", roles: ["admin"] },
  { key: "returns", tKey: "navReturns", fallback: "Returns", icon: "returns", roles: ["admin"] },
  { key: "affiliates", tKey: "navAffiliates", fallback: "Affiliates", icon: "affiliates", roles: ["admin"] },
  { key: "suppliers", tKey: "navSuppliers", fallback: "Suppliers", icon: "suppliers", roles: ["admin"] },
  { key: "my-products", tKey: "navMyProducts", fallback: "My Products", icon: "products", roles: ["supplier"] },
  { key: "my-orders", tKey: "navMyOrders", fallback: "My Orders", icon: "orders", roles: ["supplier"] },
  { key: "earnings", tKey: "navEarnings", fallback: "Earnings", icon: "earnings", roles: ["supplier"] },
  { key: "stats", tKey: "navStatistics", fallback: "Statistics", icon: "stats", roles: ["admin"] },
  { key: "settings", tKey: "navSettings", fallback: "Settings", icon: "settings", roles: ["admin", "supplier"] },
];

export default function Sidebar({ activeTab, setTab, user, onLogout, mobile, lang, setLang, L }) {
  const [open, setOpen] = useState(false);

  const navContent = (
    <>
      {/* Logo */}
      <div style={{ padding: "24px 20px 20px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", gap: 12 }}>
        <Logo size={0.65} />
        <div style={{ padding: "4px 10px", background: C.black }}>
          <span style={{ ...T.labelSm, color: C.white, fontSize: 9, fontWeight: 700 }}>MASTER</span>
        </div>
        {mobile && (
          <button onClick={() => setOpen(false)} style={{ marginLeft: "auto", background: "none", border: "none", color: C.black, cursor: "pointer" }}>
            {icons.close}
          </button>
        )}
      </div>

      {/* Nav items */}
      <nav style={{ padding: "14px 10px", flex: 1 }}>
        {NAV_KEYS.filter(item => !item.roles || item.roles.includes(user?.role || 'admin')).map(item => {
          const isActive = activeTab === item.key;
          return (
            <button
              key={item.key}
              onClick={() => { setTab(item.key); if (mobile) setOpen(false); }}
              style={{
                display: "flex", alignItems: "center", gap: 12,
                width: "100%", padding: "12px 16px", marginBottom: 2,
                background: isActive ? C.offwhite : "transparent",
                border: "none", borderLeft: isActive ? `3px solid ${C.tan}` : "3px solid transparent",
                color: isActive ? C.black : C.muted,
                fontFamily: "'TT Interphases Pro',sans-serif", fontSize: 14, fontWeight: isActive ? 500 : 400,
                cursor: "pointer", transition: "all 0.15s", textAlign: "left",
              }}
              onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = C.offwhite; }}
              onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = "transparent"; }}
            >
              <span style={{ color: isActive ? C.tan : C.muted, transition: "color 0.15s", display: "flex" }}>{icons[item.icon]}</span>
              {L?.[item.tKey] || item.fallback}
            </button>
          );
        })}
      </nav>

      {/* Bottom: lang + user + logout */}
      <div style={{ borderTop: `1px solid ${C.border}`, padding: "16px 20px" }}>
        <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
          {["en","ka","ru"].map(code => (
            <button key={code} onClick={() => setLang(code)}
              style={{ background: "none", border: "none", fontFamily: "'TT Interphases Pro',sans-serif", color: lang === code ? C.tan : C.muted, fontSize: 12, cursor: "pointer", fontWeight: lang === code ? 600 : 400, padding: "3px 5px" }}>
              {code.toUpperCase()}
            </button>
          ))}
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <p style={{ fontFamily: "'TT Interphases Pro',sans-serif", color: C.black, fontSize: 14, fontWeight: 500 }}>{user?.name || "Admin"}</p>
            <p style={{ ...T.labelSm, color: C.muted, fontSize: 10 }}>{user?.role?.toUpperCase() || "ADMIN"}</p>
          </div>
          <button onClick={onLogout} style={{ background: "none", border: "none", color: C.muted, cursor: "pointer", padding: 6, display: "flex", transition: "color 0.2s" }}
            onMouseEnter={e => e.currentTarget.style.color = C.red}
            onMouseLeave={e => e.currentTarget.style.color = C.muted}
            title="Sign Out">
            {icons.logout}
          </button>
        </div>
      </div>
    </>
  );

  if (!mobile) {
    return (
      <aside style={{
        width: 250, minHeight: "100vh", background: C.white,
        borderRight: `1px solid ${C.border}`, display: "flex", flexDirection: "column",
        position: "fixed", top: 0, left: 0, zIndex: 100,
      }}>
        {navContent}
      </aside>
    );
  }

  return (
    <>
      <div style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        background: C.white, borderBottom: `1px solid ${C.border}`,
        padding: "12px 16px", display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <button onClick={() => setOpen(true)} style={{ background: "none", border: "none", color: C.black, cursor: "pointer", display: "flex" }}>
          {icons.menu}
        </button>
        <Logo size={0.55} />
        <div style={{ padding: "4px 10px", background: C.black }}>
          <span style={{ ...T.labelSm, color: C.white, fontSize: 9, fontWeight: 700 }}>MASTER</span>
        </div>
      </div>

      {open && (
        <div onClick={() => setOpen(false)}
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 200, animation: "fadeIn 0.2s ease" }} />
      )}

      <aside style={{
        position: "fixed", top: 0, left: 0, bottom: 0, width: 270,
        background: C.white, zIndex: 300, display: "flex", flexDirection: "column",
        transform: open ? "translateX(0)" : "translateX(-100%)",
        transition: "transform 0.25s ease",
      }}>
        {navContent}
      </aside>
    </>
  );
}
