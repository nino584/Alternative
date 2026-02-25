import { useState, useEffect, useCallback } from 'react';
import { C, T } from '../constants/theme.js';
import { PRODUCTS } from '../constants/data.js';
import HoverBtn from '../components/ui/HoverBtn.jsx';
import ProductCard from '../components/ui/ProductCard.jsx';

const STORAGE = { addr: "alternative_addresses", pay: "alternative_payments" };
function load(key, fb) { try { const r = localStorage.getItem(key); return r ? JSON.parse(r) : fb; } catch { return fb; } }
function save(key, val) { try { localStorage.setItem(key, JSON.stringify(val)); } catch {} }

// ── ICONS ────────────────────────────────────────────────────────────────────
const Icon = ({ d, size = 20, color = C.gray, stroke = true }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={stroke ? "none" : color} stroke={stroke ? color : "none"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">{typeof d === "string" ? <path d={d}/> : d}</svg>
);

const icons = {
  overview: "M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z M9 22V12h6v10",
  orders: "M16 11V3H8v8M3 15h18M5 15v6a1 1 0 001 1h12a1 1 0 001-1v-6M12 3v12",
  wishlist: "M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z",
  profile: "M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2 M12 11a4 4 0 100-8 4 4 0 000 8",
  address: "M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z M12 13a3 3 0 100-6 3 3 0 000 6",
  payment: "M1 4h22v16H1z M1 10h22",
  returns: "M1 4v6h6 M3.51 15a9 9 0 102.13-9.36L1 10",
  signout: "M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4 M16 17l5-5-5-5 M21 12H9",
  edit: "M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7 M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z",
  trash: "M3 6h18 M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2",
  plus: "M12 5v14M5 12h14",
  check: "M20 6L9 17l-5-5",
  star: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
  chevron: "M9 18l6-6-6-6",
  x: "M18 6L6 18M6 6l12 12",
  card: <><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></>,
};

// ── FORM INPUT ───────────────────────────────────────────────────────────────
function FormInput({ label, value, onChange, type = "text", placeholder = "", required = false, disabled = false }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ ...T.labelSm, color: C.gray, fontSize: 9, display: "block", marginBottom: 6 }}>
        {label}{required && " *"}
      </label>
      <input
        type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} disabled={disabled}
        style={{ width: "100%", padding: "12px 14px", border: `1px solid ${C.lgray}`, background: disabled ? C.offwhite : C.white, fontSize: 14, color: C.black, outline: "none", fontFamily: "'TT Interphases Pro',sans-serif", fontWeight: 300, transition: "border 0.2s" }}
        onFocus={e => { e.target.style.borderColor = C.tan; }}
        onBlur={e => { e.target.style.borderColor = C.lgray; }}
      />
    </div>
  );
}

// ── SECTION HEADER ───────────────────────────────────────────────────────────
function SectionHeader({ title, subtitle, action, actionLabel, mobile }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: mobile ? "flex-start" : "center", flexDirection: mobile ? "column" : "row", gap: mobile ? 12 : 0, marginBottom: 28 }}>
      <div>
        <h2 style={{ ...T.displaySm, color: C.black, fontSize: "clamp(22px,2.5vw,28px)", marginBottom: subtitle ? 6 : 0 }}>{title}</h2>
        {subtitle && <p style={{ ...T.bodySm, color: C.gray }}>{subtitle}</p>}
      </div>
      {action && <HoverBtn onClick={action} variant="secondary" style={{ padding: "10px 24px", fontSize: 10 }}>{actionLabel}</HoverBtn>}
    </div>
  );
}

// ── ADDRESS CARD ─────────────────────────────────────────────────────────────
function AddressCard({ addr, isDefault, onEdit, onDelete, onSetDefault, L }) {
  const [hover, setHover] = useState(false);
  return (
    <div
      style={{ padding: 24, border: `1px solid ${isDefault ? C.tan : C.lgray}`, background: hover ? C.offwhite : C.white, transition: "all 0.2s", position: "relative" }}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
    >
      {isDefault && (
        <div style={{ ...T.labelSm, fontSize: 8, color: C.tan, background: `${C.tan}15`, padding: "3px 10px", display: "inline-block", marginBottom: 12 }}>
          {L.defaultAddress || "DEFAULT"}
        </div>
      )}
      <p style={{ ...T.heading, color: C.black, fontSize: 14, marginBottom: 6 }}>{addr.name}</p>
      <p style={{ ...T.bodySm, color: C.gray, lineHeight: 1.8 }}>
        {addr.line1}<br />
        {addr.line2 && <>{addr.line2}<br /></>}
        {addr.city}{addr.postal ? `, ${addr.postal}` : ""}<br />
        {addr.country}<br />
        {addr.phone && <span style={{ color: C.black }}>{addr.phone}</span>}
      </p>
      <div style={{ display: "flex", gap: 12, marginTop: 16, alignItems: "center" }}>
        <button onClick={onEdit} style={{ ...T.labelSm, fontSize: 8, color: C.black, background: "none", border: "none", textDecoration: "underline", textUnderlineOffset: 3 }}>{L.edit || "EDIT"}</button>
        <button onClick={onDelete} style={{ ...T.labelSm, fontSize: 8, color: C.red, background: "none", border: "none", textDecoration: "underline", textUnderlineOffset: 3 }}>{L.remove || "REMOVE"}</button>
        {!isDefault && (
          <button onClick={onSetDefault} style={{ ...T.labelSm, fontSize: 8, color: C.tan, background: "none", border: "none", textDecoration: "underline", textUnderlineOffset: 3 }}>{L.setAsDefault || "SET AS DEFAULT"}</button>
        )}
      </div>
    </div>
  );
}

// ── PAYMENT CARD ─────────────────────────────────────────────────────────────
function PaymentCard({ card, isDefault, onDelete, onSetDefault, L }) {
  const [hover, setHover] = useState(false);
  const typeIcon = { visa: "VISA", mastercard: "MC", amex: "AMEX" };
  return (
    <div
      style={{ padding: 24, border: `1px solid ${isDefault ? C.tan : C.lgray}`, background: hover ? C.offwhite : C.white, transition: "all 0.2s", display: "flex", alignItems: "center", gap: 20 }}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
    >
      <div style={{ width: 56, height: 36, background: C.black, borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <span style={{ ...T.labelSm, color: C.white, fontSize: 8, letterSpacing: "0.1em" }}>{typeIcon[card.type] || "CARD"}</span>
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <p style={{ ...T.heading, color: C.black, fontSize: 14 }}>•••• •••• •••• {card.last4}</p>
          {isDefault && <span style={{ ...T.labelSm, fontSize: 7, color: C.tan, background: `${C.tan}15`, padding: "2px 8px" }}>{L.defaultLabel || "DEFAULT"}</span>}
        </div>
        <p style={{ ...T.bodySm, color: C.gray, fontSize: 12, marginTop: 4 }}>{card.holder} · {L.expires || "Expires"} {card.expiry}</p>
      </div>
      <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
        {!isDefault && (
          <button onClick={onSetDefault} title={L.setAsDefault || "Set as default"} style={{ background: "none", border: `1px solid ${C.lgray}`, padding: 6, cursor: "pointer", transition: "border 0.2s" }}
            onMouseEnter={e => e.currentTarget.style.borderColor = C.tan} onMouseLeave={e => e.currentTarget.style.borderColor = C.lgray}>
            <Icon d={icons.star} size={14} color={C.gray} />
          </button>
        )}
        <button onClick={onDelete} title={L.remove || "Remove"} style={{ background: "none", border: `1px solid ${C.lgray}`, padding: 6, cursor: "pointer", transition: "border 0.2s" }}
          onMouseEnter={e => e.currentTarget.style.borderColor = C.red} onMouseLeave={e => e.currentTarget.style.borderColor = C.lgray}>
          <Icon d={icons.trash} size={14} color={C.gray} />
        </button>
      </div>
    </div>
  );
}

// ── MODAL ────────────────────────────────────────────────────────────────────
function Modal({ open, onClose, title, children, mobile }) {
  if (!open) return null;
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.4)", animation: "fadeIn 0.2s" }} onClick={onClose}>
      <div style={{ background: C.white, width: mobile ? "94%" : 520, maxHeight: "85vh", overflow: "auto", padding: mobile ? 24 : 36, position: "relative", animation: "fadeUp 0.3s" }} onClick={e => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
          <h3 style={{ ...T.heading, color: C.black, fontSize: 16 }}>{title}</h3>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}>
            <Icon d={icons.x} size={18} color={C.gray} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

// ── EMPTY STATE ──────────────────────────────────────────────────────────────
function EmptyState({ icon, title, subtitle, action, actionLabel }) {
  return (
    <div style={{ padding: "56px 32px", textAlign: "center", background: C.offwhite }}>
      <div style={{ marginBottom: 20, opacity: 0.4 }}><Icon d={icon} size={36} color={C.gray} /></div>
      <p style={{ ...T.body, color: C.gray, marginBottom: 6 }}>{title}</p>
      {subtitle && <p style={{ ...T.bodySm, color: C.gray, marginBottom: 20 }}>{subtitle}</p>}
      {action && <HoverBtn onClick={action} variant="primary" style={{ padding: "12px 32px" }}>{actionLabel}</HoverBtn>}
    </div>
  );
}

// ── ACCOUNT PAGE ─────────────────────────────────────────────────────────────
export default function AccountPage({ mobile, user, setUser, setPage, orders, wishlist, onWishlist, toast, L }) {
  const [tab, setTab] = useState("overview");
  const [addresses, setAddresses] = useState(() => load(STORAGE.addr, []));
  const [payments, setPayments] = useState(() => load(STORAGE.pay, []));
  const [addrModal, setAddrModal] = useState(null); // null | "new" | index
  const [payModal, setPayModal] = useState(false);
  const [profileEdit, setProfileEdit] = useState(false);

  // Profile form
  const [pName, setPName] = useState(user?.name || "");
  const [pEmail, setPEmail] = useState(user?.email || "");
  const [pPhone, setPPhone] = useState(user?.phone || "");
  const [pDob, setPDob] = useState(user?.dob || "");

  // Address form
  const [aName, setAName] = useState("");
  const [aLine1, setALine1] = useState("");
  const [aLine2, setALine2] = useState("");
  const [aCity, setACity] = useState("");
  const [aPostal, setAPostal] = useState("");
  const [aCountry, setACountry] = useState("Georgia");
  const [aPhone, setAPhone] = useState("");

  // Payment form
  const [cNumber, setCNumber] = useState("");
  const [cHolder, setCHolder] = useState("");
  const [cExpiry, setCExpiry] = useState("");
  const [cType, setCType] = useState("visa");

  useEffect(() => { if (window.__initAccountTab) { setTab(window.__initAccountTab); delete window.__initAccountTab; } }, []);
  useEffect(() => { if (!user) setPage("auth"); }, [user]);
  useEffect(() => { save(STORAGE.addr, addresses); }, [addresses]);
  useEffect(() => { save(STORAGE.pay, payments); }, [payments]);

  const resetAddrForm = useCallback(() => { setAName(""); setALine1(""); setALine2(""); setACity(""); setAPostal(""); setACountry("Georgia"); setAPhone(""); }, []);
  const resetPayForm = useCallback(() => { setCNumber(""); setCHolder(""); setCExpiry(""); setCType("visa"); }, []);

  if (!user) return null;

  const wishlistItems = (wishlist || []).map(id => PRODUCTS.find(p => p.id === id)).filter(Boolean);

  // ── Handlers ──
  const saveAddress = () => {
    if (!aName || !aLine1 || !aCity) { toast(L.allRequired || "Please fill all required fields.", ""); return; }
    const addr = { id: Date.now(), name: aName, line1: aLine1, line2: aLine2, city: aCity, postal: aPostal, country: aCountry, phone: aPhone, isDefault: addresses.length === 0 };
    if (typeof addrModal === "number") {
      setAddresses(prev => prev.map((a, i) => i === addrModal ? { ...addr, id: a.id, isDefault: a.isDefault } : a));
    } else {
      setAddresses(prev => [...prev, addr]);
    }
    setAddrModal(null);
    resetAddrForm();
    toast(L.addressSaved || "Address saved.", "success");
  };

  const deleteAddress = (idx) => {
    setAddresses(prev => {
      const next = prev.filter((_, i) => i !== idx);
      if (next.length > 0 && !next.some(a => a.isDefault)) next[0].isDefault = true;
      return next;
    });
    toast(L.addressRemoved || "Address removed.", "");
  };

  const setDefaultAddress = (idx) => {
    setAddresses(prev => prev.map((a, i) => ({ ...a, isDefault: i === idx })));
  };

  const editAddress = (idx) => {
    const a = addresses[idx];
    setAName(a.name); setALine1(a.line1); setALine2(a.line2 || ""); setACity(a.city); setAPostal(a.postal || ""); setACountry(a.country || "Georgia"); setAPhone(a.phone || "");
    setAddrModal(idx);
  };

  const savePayment = () => {
    const digits = cNumber.replace(/\s/g, "");
    if (!digits || digits.length < 13 || !cHolder || !cExpiry) { toast(L.allRequired || "Please fill all required fields.", ""); return; }
    const card = { id: Date.now(), last4: digits.slice(-4), holder: cHolder, expiry: cExpiry, type: cType, isDefault: payments.length === 0 };
    setPayments(prev => [...prev, card]);
    setPayModal(false);
    resetPayForm();
    toast(L.cardSaved || "Card saved.", "success");
  };

  const deletePayment = (idx) => {
    setPayments(prev => {
      const next = prev.filter((_, i) => i !== idx);
      if (next.length > 0 && !next.some(c => c.isDefault)) next[0].isDefault = true;
      return next;
    });
    toast(L.cardRemoved || "Card removed.", "");
  };

  const setDefaultPayment = (idx) => {
    setPayments(prev => prev.map((c, i) => ({ ...c, isDefault: i === idx })));
  };

  const saveProfile = () => {
    if (!pName || !pEmail) { toast(L.allRequired || "Please fill all required fields.", ""); return; }
    setUser({ ...user, name: pName, email: pEmail, phone: pPhone, dob: pDob });
    setProfileEdit(false);
    toast(L.settingsSaved || "Profile updated.", "success");
  };

  // ── Sidebar sections ──
  const sidebarSections = [
    { key: "shopping", items: [
      { id: "overview", icon: icons.overview, label: L.overview || "Overview" },
      { id: "wishlist", icon: icons.wishlist, label: `${L.wishlist || "Wishlist"} (${wishlistItems.length})` },
      { id: "orders", icon: icons.orders, label: L.myOrders || "My Orders" },
    ]},
    { key: "details", label: L.myDetails || "MY DETAILS", items: [
      { id: "profile", icon: icons.profile, label: L.profileInfo || "Profile" },
      { id: "addresses", icon: icons.address, label: L.addressBook || "Address Book" },
      { id: "payments", icon: icons.payment, label: L.paymentMethods || "Payment Methods" },
      { id: "returns", icon: icons.returns, label: L.returnsRefunds || "Returns & Refunds" },
    ]},
  ];

  // ── RENDER ──
  return (
    <div style={{ paddingTop: mobile ? 52 : 80, minHeight: "100vh", background: C.cream }}>
      {/* Header */}
      <div style={{ borderBottom: `1px solid ${C.lgray}`, padding: mobile ? "28px 0 20px" : "36px 0 24px" }}>
        <div style={{ maxWidth: 1360, margin: "0 auto", padding: mobile ? "0 20px" : "0 40px", display: "flex", justifyContent: "space-between", alignItems: mobile ? "flex-start" : "flex-end", flexDirection: mobile ? "column" : "row", gap: mobile ? 16 : 0 }}>
          <div>
            <p style={{ ...T.labelSm, color: C.tan, marginBottom: 8 }}>{L.myAccount || "My Account"}</p>
            <h1 style={{ ...T.displayMd, color: C.black }}>{L.welcome || "Welcome,"} {user.name ? user.name.split(" ")[0] : ""}</h1>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            {user.isAdmin && <HoverBtn onClick={() => setPage("admin")} variant="tan" style={{ padding: "10px 20px", fontSize: 10 }}>{L.adminPanel || "Admin Panel"}</HoverBtn>}
            <HoverBtn onClick={() => { setUser(null); toast(L.signedOut || "Signed out.", "success"); setPage("home"); }} variant="secondary" style={{ padding: "10px 20px", fontSize: 10 }}>{L.signOut || "Sign Out"}</HoverBtn>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div style={{ maxWidth: 1360, margin: "0 auto", padding: mobile ? "24px 20px" : "36px 40px", display: "grid", gridTemplateColumns: mobile ? "1fr" : "240px 1fr", gap: mobile ? 24 : 48 }}>

        {/* ── SIDEBAR ── */}
        <div>
          {/* User card */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "0 14px", marginBottom: 20 }}>
            <div style={{ width: 36, height: 36, borderRadius: "50%", background: C.tan, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <span style={{ ...T.label, color: C.white, fontSize: 13, letterSpacing: 0 }}>{(user.name || "U").charAt(0).toUpperCase()}</span>
            </div>
            <div style={{ minWidth: 0 }}>
              <p style={{ ...T.heading, color: C.black, fontSize: 13, marginBottom: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user.name}</p>
              <p style={{ ...T.bodySm, color: C.gray, fontSize: 11, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user.email}</p>
            </div>
          </div>

          {/* Nav items */}
          {sidebarSections.map((section) => (
            <div key={section.key} style={{ marginBottom: 8 }}>
              {section.label && <p style={{ ...T.labelSm, color: C.gray, fontSize: 8, padding: "16px 0 8px", marginTop: 8 }}>{section.label}</p>}
              {section.items.map(({ id, icon, label }) => {
                const active = tab === id;
                return (
                  <button key={id} onClick={() => setTab(id)}
                    style={{
                      display: "flex", alignItems: "center", gap: 12, width: "100%", textAlign: "left",
                      padding: "11px 14px", background: active ? C.offwhite : "none", border: "none",
                      borderLeft: active ? `2px solid ${C.tan}` : "2px solid transparent",
                      ...T.bodySm, color: active ? C.black : C.gray, fontWeight: active ? 500 : 300,
                      transition: "all 0.15s", cursor: "pointer",
                    }}
                  >
                    <Icon d={icon} size={16} color={active ? C.tan : C.gray} />
                    {label}
                  </button>
                );
              })}
            </div>
          ))}

          {/* Sign out (mobile) */}
          {mobile && (
            <button onClick={() => { setUser(null); toast(L.signedOut || "Signed out.", "success"); setPage("home"); }}
              style={{ display: "flex", alignItems: "center", gap: 12, width: "100%", textAlign: "left", padding: "11px 14px", background: "none", border: "none", ...T.bodySm, color: C.red, fontWeight: 300, marginTop: 8, cursor: "pointer" }}>
              <Icon d={icons.signout} size={16} color={C.red} />
              {L.signOut || "Sign Out"}
            </button>
          )}
        </div>

        {/* ── CONTENT ── */}
        <div style={{ minWidth: 0 }}>

          {/* ════════ OVERVIEW ════════ */}
          {tab === "overview" && (
            <div>
              <SectionHeader title={L.overview || "Overview"} subtitle={L.overviewSub || "Your account at a glance"} mobile={mobile} />

              {/* Wishlist & My Orders — main navigation cards */}
              <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr" : "1fr 1fr", gap: 2, marginBottom: 24 }}>
                {/* Wishlist card */}
                <button onClick={() => setTab("wishlist")}
                  style={{ padding: mobile ? 24 : 32, background: C.white, border: "none", textAlign: "left", cursor: "pointer", transition: "background 0.15s", width: "100%" }}
                  onMouseEnter={e => e.currentTarget.style.background = C.offwhite}
                  onMouseLeave={e => e.currentTarget.style.background = C.white}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                    <Icon d={icons.wishlist} size={26} color={C.tan} />
                    <div style={{ ...T.displaySm, color: C.black, fontSize: 32 }}>{wishlistItems.length}</div>
                  </div>
                  <p style={{ ...T.heading, color: C.black, fontSize: 15, marginBottom: 4 }}>{L.wishlist || "Wishlist"}</p>
                  <p style={{ ...T.bodySm, color: C.gray, fontSize: 12 }}>{L.viewSavedItems || "View your saved items"}</p>
                  <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 14 }}>
                    <span style={{ ...T.labelSm, fontSize: 9, color: C.tan }}>{L.viewAll || "View all →"}</span>
                  </div>
                </button>

                {/* My Orders card */}
                <button onClick={() => setPage("orders")}
                  style={{ padding: mobile ? 24 : 32, background: C.white, border: "none", textAlign: "left", cursor: "pointer", transition: "background 0.15s", width: "100%" }}
                  onMouseEnter={e => e.currentTarget.style.background = C.offwhite}
                  onMouseLeave={e => e.currentTarget.style.background = C.white}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                    <Icon d={icons.orders} size={26} color={C.tan} />
                    <div style={{ ...T.displaySm, color: C.black, fontSize: 32 }}>{orders.length}</div>
                  </div>
                  <p style={{ ...T.heading, color: C.black, fontSize: 15, marginBottom: 4 }}>{L.myOrders || "My Orders"}</p>
                  <p style={{ ...T.bodySm, color: C.gray, fontSize: 12 }}>{L.viewYourOrders || "Track and manage your orders"}</p>
                  <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 14 }}>
                    <span style={{ ...T.labelSm, fontSize: 9, color: C.tan }}>{L.viewAll || "View all →"}</span>
                  </div>
                </button>
              </div>

              {/* Recent orders */}
              {orders.length > 0 && (
                <div style={{ marginBottom: 24 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                    <p style={{ ...T.label, color: C.black, fontSize: 11 }}>{L.recentOrders || "Recent Orders"}</p>
                    <button onClick={() => setPage("orders")} style={{ background: "none", border: "none", ...T.labelSm, color: C.tan, fontSize: 9, textDecoration: "underline", textUnderlineOffset: 3, cursor: "pointer" }}>{L.viewAll || "View all →"}</button>
                  </div>
                  {orders.slice(0, 3).map(o => (
                    <div key={o.orderId} style={{ display: "flex", gap: 14, padding: 16, background: C.white, marginBottom: 2, cursor: "pointer", transition: "background 0.15s" }}
                      onClick={() => setPage("orders")}
                      onMouseEnter={e => e.currentTarget.style.background = C.offwhite}
                      onMouseLeave={e => e.currentTarget.style.background = C.white}>
                      <img src={o.img} alt={o.name} style={{ width: 56, height: 56, objectFit: "cover", flexShrink: 0 }} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ ...T.heading, color: C.black, fontSize: 13, marginBottom: 4, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{o.name}</p>
                        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                          <div style={{ width: 5, height: 5, borderRadius: "50%", background: C.tan }} />
                          <span style={{ ...T.labelSm, fontSize: 8, color: C.tan }}>{L.processing || "Processing"}</span>
                        </div>
                      </div>
                      <p style={{ ...T.heading, color: C.black, fontSize: 14, flexShrink: 0 }}>GEL {o.sale || o.price}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Quick links */}
              <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr" : "1fr 1fr", gap: 2 }}>
                {[
                  { id: "profile", icon: icons.profile, t: L.profileInfo || "Profile", s: L.profileSub || "Manage your personal details" },
                  { id: "addresses", icon: icons.address, t: L.addressBook || "Address Book", s: L.addressSub || "Manage your shipping addresses" },
                  { id: "payments", icon: icons.payment, t: L.paymentMethods || "Payment Methods", s: L.paymentSub || "Manage your saved cards" },
                  { id: "returns", icon: icons.returns, t: L.returnsRefunds || "Returns & Refunds", s: L.returnsSub || "View your return requests" },
                ].map(({ id, icon, t, s }) => (
                  <button key={id} onClick={() => setTab(id)}
                    style={{ display: "flex", alignItems: "center", gap: 16, padding: 24, background: C.white, border: "none", textAlign: "left", cursor: "pointer", transition: "background 0.15s", width: "100%" }}
                    onMouseEnter={e => e.currentTarget.style.background = C.offwhite}
                    onMouseLeave={e => e.currentTarget.style.background = C.white}>
                    <Icon d={icon} size={22} color={C.tan} />
                    <div>
                      <p style={{ ...T.heading, color: C.black, fontSize: 13, marginBottom: 3 }}>{t}</p>
                      <p style={{ ...T.bodySm, color: C.gray, fontSize: 12 }}>{s}</p>
                    </div>
                    <div style={{ marginLeft: "auto", flexShrink: 0 }}><Icon d={icons.chevron} size={16} color={C.lgray} /></div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ════════ ORDERS ════════ */}
          {tab === "orders" && (
            <div>
              <SectionHeader title={L.myOrders || "My Orders"} subtitle={`${orders.length} ${orders.length === 1 ? L.piece || "order" : L.pieces || "orders"}`} mobile={mobile} />
              {orders.length === 0 ? (
                <EmptyState icon={icons.orders} title={L.noOrdersYet || "No orders yet"} subtitle={L.startBrowsing || "When you place an order, it will appear here."} action={() => setPage("catalog")} actionLabel={L.exploreCollection || "Explore Collection"} />
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  {orders.map(o => (
                    <div key={o.orderId} style={{ display: "flex", gap: 16, padding: 20, background: C.white, cursor: "pointer", transition: "background 0.15s" }}
                      onClick={() => setPage("orders")}
                      onMouseEnter={e => e.currentTarget.style.background = C.offwhite}
                      onMouseLeave={e => e.currentTarget.style.background = C.white}>
                      <img src={o.img} alt={o.name} style={{ width: 72, height: 72, objectFit: "cover", flexShrink: 0 }} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ ...T.heading, color: C.black, fontSize: 14, marginBottom: 4 }}>{o.name}</p>
                        <p style={{ ...T.labelSm, color: C.gray, fontSize: 8, marginBottom: 8 }}>{o.orderId}</p>
                        <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                          <div style={{ display: "flex", gap: 5, alignItems: "center", background: `${C.tan}15`, padding: "3px 10px" }}>
                            <div style={{ width: 5, height: 5, borderRadius: "50%", background: C.tan }} />
                            <span style={{ ...T.labelSm, fontSize: 8, color: C.tan }}>{L.processing || "Processing"}</span>
                          </div>
                          {o.selectedSize && <span style={{ ...T.labelSm, fontSize: 8, color: C.gray }}>{L.size || "Size"}: {o.selectedSize}</span>}
                          {o.wantVideo && <span style={{ ...T.labelSm, fontSize: 8, color: C.green }}>VIDEO</span>}
                        </div>
                      </div>
                      <div style={{ textAlign: "right", flexShrink: 0 }}>
                        <p style={{ ...T.heading, color: C.black, fontSize: 15 }}>GEL {o.sale || o.price}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ════════ WISHLIST ════════ */}
          {tab === "wishlist" && (
            <div>
              <SectionHeader title={`${L.wishlist || "Wishlist"} (${wishlistItems.length})`} mobile={mobile} />
              {wishlistItems.length === 0 ? (
                <EmptyState icon={icons.wishlist} title={L.emptyWishlist || "Your wishlist is empty"} subtitle={L.emptyWishlistSub || "Browse the collection and tap the heart icon to save items."} action={() => setPage("catalog")} actionLabel={L.exploreCollection || "Explore Collection"} />
              ) : (
                <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr 1fr" : "repeat(3, 1fr)", gap: 3 }}>
                  {wishlistItems.map(p => (
                    <ProductCard key={p.id} product={p} wishlist={wishlist} onWishlist={onWishlist} L={L}
                      onSelect={() => setPage("product", p)} mobile={mobile} />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ════════ PROFILE ════════ */}
          {tab === "profile" && (
            <div>
              <SectionHeader title={L.profileInfo || "Profile"} subtitle={L.profileInfoSub || "Manage your personal information"} action={profileEdit ? undefined : () => setProfileEdit(true)} actionLabel={L.editProfile || "Edit Profile"} mobile={mobile} />

              <div style={{ maxWidth: 520, background: C.white, padding: mobile ? 24 : 36 }}>
                {/* Avatar */}
                <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 32, paddingBottom: 24, borderBottom: `1px solid ${C.offwhite}` }}>
                  <div style={{ width: 64, height: 64, borderRadius: "50%", background: C.tan, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <span style={{ ...T.displaySm, color: C.white, fontSize: 26 }}>{(user.name || "U").charAt(0).toUpperCase()}</span>
                  </div>
                  <div>
                    <p style={{ ...T.heading, color: C.black, fontSize: 16, marginBottom: 2 }}>{user.name}</p>
                    <p style={{ ...T.bodySm, color: C.gray }}>{L.memberSince || "Member since"} 2026</p>
                  </div>
                </div>

                {profileEdit ? (
                  <>
                    <FormInput label={L.fullNameLabel || "Full Name"} value={pName} onChange={setPName} required />
                    <FormInput label={L.emailLabel || "Email"} value={pEmail} onChange={setPEmail} type="email" required />
                    <FormInput label={L.whatsappLabel || "WhatsApp Number"} value={pPhone} onChange={setPPhone} placeholder="+995 5XX XXX XXX" />
                    <FormInput label={L.dateOfBirth || "Date of Birth"} value={pDob} onChange={setPDob} type="date" />

                    <div style={{ display: "flex", gap: 10, marginTop: 24 }}>
                      <HoverBtn onClick={saveProfile} variant="primary" style={{ padding: "12px 32px" }}>{L.saveChanges || "Save Changes"}</HoverBtn>
                      <HoverBtn onClick={() => { setProfileEdit(false); setPName(user.name); setPEmail(user.email); setPPhone(user.phone || ""); setPDob(user.dob || ""); }} variant="ghost">{L.cancel || "Cancel"}</HoverBtn>
                    </div>
                  </>
                ) : (
                  <div>
                    {[
                      [L.fullNameLabel || "Full Name", user.name],
                      [L.emailLabel || "Email", user.email],
                      [L.whatsappLabel || "WhatsApp", user.phone || "—"],
                      [L.dateOfBirth || "Date of Birth", user.dob || "—"],
                    ].map(([label, val]) => (
                      <div key={label} style={{ display: "flex", justifyContent: "space-between", padding: "14px 0", borderBottom: `1px solid ${C.offwhite}` }}>
                        <span style={{ ...T.bodySm, color: C.gray }}>{label}</span>
                        <span style={{ ...T.bodySm, color: C.black, fontWeight: 400 }}>{val}</span>
                      </div>
                    ))}

                    <div style={{ marginTop: 28 }}>
                      <p style={{ ...T.label, color: C.black, fontSize: 10, marginBottom: 14 }}>{L.changePassword || "Change Password"}</p>
                      <div style={{ padding: 20, background: C.offwhite, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div>
                          <p style={{ ...T.bodySm, color: C.gray, fontSize: 13 }}>••••••••</p>
                          <p style={{ ...T.labelSm, color: C.gray, fontSize: 8, marginTop: 4 }}>{L.lastChanged || "Set during registration"}</p>
                        </div>
                        <HoverBtn onClick={() => toast(L.passwordResetSent || "Password reset link sent to your email.", "success")} variant="ghost" style={{ padding: "8px 18px", fontSize: 9 }}>{L.changeBtn || "Change"}</HoverBtn>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ════════ ADDRESSES ════════ */}
          {tab === "addresses" && (
            <div>
              <SectionHeader title={L.addressBook || "Address Book"} subtitle={`${addresses.length} ${L.savedAddresses || "saved addresses"}`} action={() => { resetAddrForm(); setAddrModal("new"); }} actionLabel={`+ ${L.addAddress || "Add Address"}`} mobile={mobile} />

              {addresses.length === 0 ? (
                <EmptyState icon={icons.address} title={L.noAddresses || "No saved addresses"} subtitle={L.noAddressesSub || "Add a shipping address to speed up checkout."} action={() => { resetAddrForm(); setAddrModal("new"); }} actionLabel={`+ ${L.addAddress || "Add Address"}`} />
              ) : (
                <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr" : "1fr 1fr", gap: 2 }}>
                  {addresses.map((addr, i) => (
                    <AddressCard key={addr.id} addr={addr} isDefault={addr.isDefault} onEdit={() => editAddress(i)} onDelete={() => deleteAddress(i)} onSetDefault={() => setDefaultAddress(i)} L={L} />
                  ))}
                </div>
              )}

              {/* Address Modal */}
              <Modal open={addrModal !== null} onClose={() => { setAddrModal(null); resetAddrForm(); }} title={typeof addrModal === "number" ? (L.editAddress || "Edit Address") : (L.addAddress || "Add New Address")} mobile={mobile}>
                <FormInput label={L.fullNameLabel || "Full Name"} value={aName} onChange={setAName} required />
                <FormInput label={L.addressLine1 || "Address Line 1"} value={aLine1} onChange={setALine1} placeholder={L.addressLine1Hint || "Street, building, apartment"} required />
                <FormInput label={L.addressLine2 || "Address Line 2"} value={aLine2} onChange={setALine2} placeholder={L.addressLine2Hint || "Floor, entrance (optional)"} />
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <FormInput label={L.city || "City"} value={aCity} onChange={setACity} required />
                  <FormInput label={L.postalCode || "Postal Code"} value={aPostal} onChange={setAPostal} />
                </div>
                <FormInput label={L.country || "Country"} value={aCountry} onChange={setACountry} />
                <FormInput label={L.phoneNumber || "Phone Number"} value={aPhone} onChange={setAPhone} placeholder="+995 5XX XXX XXX" />
                <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
                  <HoverBtn onClick={saveAddress} variant="primary" style={{ padding: "13px 36px" }}>{L.saveAddress || "Save Address"}</HoverBtn>
                  <HoverBtn onClick={() => { setAddrModal(null); resetAddrForm(); }} variant="ghost">{L.cancel || "Cancel"}</HoverBtn>
                </div>
              </Modal>
            </div>
          )}

          {/* ════════ PAYMENTS ════════ */}
          {tab === "payments" && (
            <div>
              <SectionHeader title={L.paymentMethods || "Payment Methods"} mobile={mobile} />

              {/* Bank cards */}
              <div style={{ background: C.white, padding: mobile ? 24 : 32, marginBottom: 2 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
                  <Icon d={icons.payment} size={20} color={C.tan} />
                  <p style={{ ...T.heading, color: C.black, fontSize: 14 }}>{L.bankCards || "Bank Cards"}</p>
                </div>
                <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 16 }}>
                  {["VISA", "MC", "BOG", "TBC"].map(m => (
                    <div key={m} style={{ padding: "8px 18px", background: C.offwhite, border: `1px solid ${C.lgray}` }}>
                      <span style={{ ...T.labelSm, fontSize: 9, color: C.black }}>{m}</span>
                    </div>
                  ))}
                </div>
                <p style={{ ...T.bodySm, color: C.gray, fontSize: 12 }}>{L.bankCardDesc || "Pay securely with Visa, Mastercard, or Georgian bank cards (BOG, TBC). Card details are entered at checkout — we never store card data."}</p>
              </div>

              {/* Crypto */}
              <div style={{ background: C.white, padding: mobile ? 24 : 32, marginBottom: 2 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={C.tan} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" /><path d="M9.5 8h5a2 2 0 010 4h-5m0-4v8m0-8H8m1.5 4h4.5a2 2 0 010 4H9.5m0 0H8" />
                  </svg>
                  <p style={{ ...T.heading, color: C.black, fontSize: 14 }}>{L.cryptoPayments || "Cryptocurrency"}</p>
                </div>
                <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 16 }}>
                  {["BTC", "ETH", "USDT", "USDC"].map(m => (
                    <div key={m} style={{ padding: "8px 18px", background: C.offwhite, border: `1px solid ${C.lgray}` }}>
                      <span style={{ ...T.labelSm, fontSize: 9, color: C.black }}>{m}</span>
                    </div>
                  ))}
                </div>
                <p style={{ ...T.bodySm, color: C.gray, fontSize: 12 }}>{L.cryptoDesc || "We accept Bitcoin, Ethereum, USDT, and USDC. Select crypto at checkout and receive wallet details via WhatsApp. Confirmation within minutes."}</p>
              </div>

              {/* Bank transfer */}
              <div style={{ background: C.white, padding: mobile ? 24 : 32 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={C.tan} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 21h18M3 10h18M5 6l7-3 7 3M4 10v11M20 10v11M8 14v3M12 14v3M16 14v3" />
                  </svg>
                  <p style={{ ...T.heading, color: C.black, fontSize: 14 }}>{L.bankTransfer || "Bank Transfer"}</p>
                </div>
                <p style={{ ...T.bodySm, color: C.gray, fontSize: 12 }}>{L.bankTransferDesc || "Direct transfer to our BOG or TBC account. We'll send you the details on WhatsApp after order confirmation."}</p>
              </div>

              {/* Security note */}
              <div style={{ marginTop: 24, padding: 20, background: C.offwhite, display: "flex", gap: 12, alignItems: "flex-start" }}>
                <Icon d={icons.check} size={16} color={C.green} />
                <p style={{ ...T.bodySm, color: C.gray, fontSize: 12 }}>{L.paymentSecure || "All payments are processed securely. We never store your card information."}</p>
              </div>
            </div>
          )}

          {/* ════════ RETURNS ════════ */}
          {tab === "returns" && (
            <div>
              <SectionHeader title={L.returnsRefunds || "Returns & Refunds"} mobile={mobile} />

              {/* Cancellation policy */}
              <div style={{ background: C.white, padding: mobile ? 24 : 32, marginBottom: 2 }}>
                <p style={{ ...T.label, color: C.black, fontSize: 10, marginBottom: 16 }}>{L.cancellationPolicy || "Cancellation Policy"}</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                    <Icon d={icons.check} size={16} color={C.green} />
                    <p style={{ ...T.bodySm, color: C.gray }}>{L.returnPolicy1 || "Free cancellation within 24 hours of placing your order — full refund guaranteed"}</p>
                  </div>
                  <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                    <Icon d={icons.check} size={16} color={C.green} />
                    <p style={{ ...T.bodySm, color: C.gray }}>{L.returnPolicy1b || "Orders can be cancelled free of charge before shipping"}</p>
                  </div>
                </div>
              </div>

              {/* Return policy for delivered items */}
              <div style={{ background: C.white, padding: mobile ? 24 : 32, marginBottom: 2 }}>
                <p style={{ ...T.label, color: C.black, fontSize: 10, marginBottom: 16 }}>{L.returnPolicyDelivered || "Returns After Delivery"}</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                    <Icon d={icons.check} size={16} color={C.green} />
                    <p style={{ ...T.bodySm, color: C.gray }}>{L.returnPolicy2 || "If the item arrives damaged, defective, or not as described — return within 24 hours of delivery for a full refund"}</p>
                  </div>
                  <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                    <Icon d={icons.check} size={16} color={C.green} />
                    <p style={{ ...T.bodySm, color: C.gray }}>{L.returnPolicy3 || "Items must be in original packaging with all tags attached"}</p>
                  </div>
                  <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                    <Icon d={icons.check} size={16} color={C.green} />
                    <p style={{ ...T.bodySm, color: C.gray }}>{L.returnPolicy4 || "Refunds processed within 3–5 business days after return is approved"}</p>
                  </div>
                </div>
              </div>

              {/* How to return */}
              <div style={{ background: C.white, padding: mobile ? 24 : 32, marginBottom: 24 }}>
                <p style={{ ...T.label, color: C.black, fontSize: 10, marginBottom: 16 }}>{L.howToReturn || "How to Return"}</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                    <span style={{ ...T.labelSm, color: C.tan, fontSize: 10, width: 20, flexShrink: 0 }}>1.</span>
                    <p style={{ ...T.bodySm, color: C.gray }}>{L.returnStep1 || "Contact us on WhatsApp within 24 hours of delivery"}</p>
                  </div>
                  <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                    <span style={{ ...T.labelSm, color: C.tan, fontSize: 10, width: 20, flexShrink: 0 }}>2.</span>
                    <p style={{ ...T.bodySm, color: C.gray }}>{L.returnStep2 || "Send photos of the item and packaging"}</p>
                  </div>
                  <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                    <span style={{ ...T.labelSm, color: C.tan, fontSize: 10, width: 20, flexShrink: 0 }}>3.</span>
                    <p style={{ ...T.bodySm, color: C.gray }}>{L.returnStep3 || "We'll arrange pickup and process your refund"}</p>
                  </div>
                </div>
              </div>

              {/* Active returns - always empty in demo */}
              <div style={{ marginBottom: 24 }}>
                <p style={{ ...T.label, color: C.black, fontSize: 10, marginBottom: 14 }}>{L.activeReturns || "Active Returns"}</p>
                <EmptyState icon={icons.returns} title={L.noReturns || "No active returns"} subtitle={L.noReturnsSub || "You haven't initiated any returns yet."} />
              </div>

              {/* Need help */}
              <div style={{ background: C.white, padding: 24, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
                <div>
                  <p style={{ ...T.heading, color: C.black, fontSize: 14, marginBottom: 4 }}>{L.needHelp || "Need help with a return?"}</p>
                  <p style={{ ...T.bodySm, color: C.gray }}>{L.needHelpSub || "Our team is available on WhatsApp to assist you."}</p>
                </div>
                <HoverBtn onClick={() => setPage("contact")} variant="tan" style={{ padding: "10px 24px", fontSize: 10 }}>{L.contactUs || "Contact Us"}</HoverBtn>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
