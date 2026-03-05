import { useState, useEffect, useCallback } from 'react';
import { C, T } from '../constants/theme.js';
import { PRODUCTS as IMPORTED_PRODUCTS } from '../constants/data.js';
import HoverBtn from '../components/ui/HoverBtn.jsx';
import ProductCard from '../components/ui/ProductCard.jsx';
import { api } from '../api.js';

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
  messages: "M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z",
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
export default function AccountPage({ mobile, user, setUser, setPage, orders, wishlist, onWishlist, onQuickView, toast, L, products: productsProp, onLogout }) {
  const [tab, setTab] = useState("overview");
  const getImg=(o)=>{
    if(o.img) return o.img;
    const p=(productsProp||[]).find(pr=>String(pr.id)===String(o.productId));
    return p?.img||"";
  };

  // Support external tab navigation (e.g. Nav wishlist button)
  useEffect(() => {
    if (window.__initAccountTab) {
      setTab(window.__initAccountTab);
      delete window.__initAccountTab;
    }
  }, []);
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

  // Change password
  const [pwModal, setPwModal] = useState(false);
  const [pwCurrent, setPwCurrent] = useState("");
  const [pwNew, setPwNew] = useState("");
  const [pwConfirm, setPwConfirm] = useState("");
  const [pwLoading, setPwLoading] = useState(false);

  // Return request
  const [returnModal, setReturnModal] = useState(false);
  const [retOrderId, setRetOrderId] = useState("");
  const [retReason, setRetReason] = useState("");
  const [retLoading, setRetLoading] = useState(false);
  const [myReturns, setMyReturns] = useState([]);

  // Messages
  const [messages, setMessages] = useState([]);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  // Account deletion
  const [deleteModal, setDeleteModal] = useState(false);
  const [delPassword, setDelPassword] = useState("");
  const [delLoading, setDelLoading] = useState(false);

  // Order cancellation
  const [cancelOrderId, setCancelOrderId] = useState(null);
  const [cancelLoading, setCancelLoading] = useState(false);

  // Local orders (for cancellation support without setOrders prop)
  const [localOrders, setLocalOrders] = useState(orders);
  useEffect(() => { setLocalOrders(orders); }, [orders]);

  // Note: __initAccountTab is handled by the useEffect above (no deps) which runs on every render
  useEffect(() => { if (!user) setPage("auth"); }, [user]);
  useEffect(() => { save(STORAGE.addr, addresses); }, [addresses]);
  useEffect(() => { save(STORAGE.pay, payments); }, [payments]);

  // Load messages & unread count
  useEffect(() => {
    if (user) {
      api.getUnreadCount().then(d => setUnreadCount(d.count || 0)).catch(() => {});
    }
  }, [user]);

  useEffect(() => {
    if (tab === "messages" && user) {
      setMessagesLoading(true);
      api.getMessages()
        .then(d => {
          setMessages(d.messages || []);
          // Mark all as read
          api.markAllMessagesRead().then(() => setUnreadCount(0)).catch(() => {});
        })
        .catch(() => {})
        .finally(() => setMessagesLoading(false));
    }
  }, [tab, user]);

  const resetAddrForm = useCallback(() => { setAName(""); setALine1(""); setALine2(""); setACity(""); setAPostal(""); setACountry("Georgia"); setAPhone(""); }, []);
  const resetPayForm = useCallback(() => { setCNumber(""); setCHolder(""); setCExpiry(""); setCType("visa"); }, []);

  if (!user) return null;

  const ALL_PRODUCTS = productsProp || IMPORTED_PRODUCTS;
  const wishlistItems = (wishlist || []).map(id => ALL_PRODUCTS.find(p => p.id === id)).filter(Boolean);

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
    api.updateProfile({ name: pName, email: pEmail, phone: pPhone }).then(data => {
      if (data?.user) setUser(data.user);
      else setUser({ ...user, name: pName, email: pEmail, phone: pPhone });
      setProfileEdit(false);
      toast(L.settingsSaved || "Profile updated.", "success");
    }).catch(err => toast(err?.message || "Failed to update profile", "error"));
  };

  // Change password handler
  const handleChangePassword = () => {
    if (!pwCurrent || !pwNew || !pwConfirm) { toast(L.allRequired || "Please fill all fields.", ""); return; }
    if (pwNew.length < 8) { toast(L.passwordMinLength || "Password must be at least 8 characters.", ""); return; }
    if (pwNew !== pwConfirm) { toast(L.passwordsDoNotMatch || "Passwords do not match.", ""); return; }
    setPwLoading(true);
    api.changePassword(pwCurrent, pwNew)
      .then(() => { toast(L.passwordChanged || "Password changed successfully.", "success"); setPwModal(false); setPwCurrent(""); setPwNew(""); setPwConfirm(""); })
      .catch(err => toast(err?.message || "Failed to change password", "error"))
      .finally(() => setPwLoading(false));
  };

  // Load user returns
  useEffect(() => {
    if (user) api.getReturns().then(data => setMyReturns(Array.isArray(data) ? data : [])).catch(() => {});
  }, [user]);

  // Submit return request
  const handleReturnRequest = () => {
    if (!retOrderId || !retReason) { toast(L.allRequired || "Please fill all fields.", ""); return; }
    setRetLoading(true);
    api.createReturn({ orderId: retOrderId, reason: retReason })
      .then(ret => { setMyReturns(prev => [ret, ...prev]); setReturnModal(false); setRetOrderId(""); setRetReason(""); toast(L.returnSubmitted || "Return request submitted.", "success"); })
      .catch(err => toast(err?.message || "Failed to submit return request", "error"))
      .finally(() => setRetLoading(false));
  };

  // Delete account handler
  const handleDeleteAccount = () => {
    if (!delPassword) { toast(L.allRequired || "Please enter your password.", ""); return; }
    setDelLoading(true);
    api.deleteAccount(delPassword)
      .then(() => { toast(L.accountDeleted || "Account deleted.", "success"); if(onLogout)onLogout(); else{setUser(null);setPage("home");} })
      .catch(err => toast(err?.message || "Failed to delete account", "error"))
      .finally(() => setDelLoading(false));
  };

  const handleCancelOrder = () => {
    if (!cancelOrderId) return;
    setCancelLoading(true);
    api.cancelOrder(cancelOrderId)
      .then(() => {
        setLocalOrders(prev => prev.map(o => o.orderId === cancelOrderId ? { ...o, status: "cancelled" } : o));
        toast(L.cancelSuccess || "Order cancelled. Refund will be processed.", "success");
        setCancelOrderId(null);
      })
      .catch(err => toast(err?.message || "Failed to cancel order", "error"))
      .finally(() => setCancelLoading(false));
  };

  // ── Sidebar sections ──
  const sidebarSections = [
    { key: "shopping", items: [
      { id: "overview", icon: icons.overview, label: L.overview || "Overview" },
      { id: "wishlist", icon: icons.wishlist, label: `${L.wishlist || "Wishlist"} (${wishlistItems.length})` },
      { id: "orders", icon: icons.orders, label: L.myOrders || "My Orders" },
      { id: "messages", icon: icons.messages, label: `${L.messages || "Messages"}${unreadCount > 0 ? ` (${unreadCount})` : ""}` },
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
    <div style={{ paddingTop: mobile ? 78 : 104, minHeight: "100vh", background: C.cream }}>
      {/* Header */}
      <div style={{ borderBottom: `1px solid ${C.lgray}`, padding: mobile ? "28px 0 20px" : "36px 0 24px" }}>
        <div style={{ maxWidth: 1360, margin: "0 auto", padding: mobile ? "0 20px" : "0 40px", display: "flex", justifyContent: "space-between", alignItems: mobile ? "flex-start" : "flex-end", flexDirection: mobile ? "column" : "row", gap: mobile ? 16 : 0 }}>
          <div>
            <p style={{ ...T.labelSm, color: C.tan, marginBottom: 8 }}>{L.myAccount || "My Account"}</p>
            <h1 style={{ ...T.displayMd, color: C.black }}>{L.welcome || "Welcome,"} {user.name ? user.name.split(" ")[0] : ""}</h1>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            {user.role==="admin" && <HoverBtn onClick={() => window.open(import.meta.env.VITE_ADMIN_URL||"http://localhost:5174","_blank")} variant="tan" style={{ padding: "10px 20px", fontSize: 10 }}>{L.adminPanel || "Admin Panel"}</HoverBtn>}
            <HoverBtn onClick={() => { if(onLogout)onLogout(); else{setUser(null);setPage("home");} toast(L.signedOut || "Signed out.", "success"); }} variant="secondary" style={{ padding: "10px 20px", fontSize: 10 }}>{L.signOut || "Sign Out"}</HoverBtn>
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
            <button onClick={() => { if(onLogout)onLogout(); else{setUser(null);setPage("home");} toast(L.signedOut || "Signed out.", "success"); }}
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

              {/* ── Reward Tier Card ── */}
              {(() => {
                const totalSpent = localOrders.reduce((s, o) => s + (o.depositPaid || o.price || 0), 0);
                const tiers = [
                  { name: L?.tierNewcomer || "Newcomer", min: 0, next: 500, color: C.lgray, icon: "★" },
                  { name: L?.tierBronze || "Bronze", min: 500, next: 2000, color: "#b08d57", icon: "★★" },
                  { name: L?.tierSilver || "Silver", min: 2000, next: 5000, color: "#8a8a8a", icon: "★★★" },
                  { name: L?.tierGold || "Gold", min: 5000, next: 15000, color: C.tan, icon: "★★★★" },
                  { name: L?.tierPlatinum || "Platinum", min: 15000, next: null, color: C.black, icon: "★★★★★" },
                ];
                const current = [...tiers].reverse().find(t => totalSpent >= t.min) || tiers[0];
                const nextTier = tiers[tiers.indexOf(current) + 1];
                const progress = nextTier ? Math.min(100, ((totalSpent - current.min) / (nextTier.min - current.min)) * 100) : 100;
                return (
                  <div style={{ background: C.white, padding: mobile ? "20px 18px" : "24px 28px", marginBottom: 2 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                      <div>
                        <p style={{ ...T.labelSm, color: current.color, fontSize: 10, letterSpacing: "0.15em", marginBottom: 4 }}>{L?.yourTier || "YOUR TIER"}</p>
                        <p style={{ fontFamily: "'Alido',serif", fontSize: mobile ? 22 : 26, fontWeight: 300, color: C.black }}>{current.name}</p>
                      </div>
                      <span style={{ fontSize: mobile ? 20 : 26, color: current.color, letterSpacing: "0.05em" }}>{current.icon}</span>
                    </div>
                    {nextTier ? (
                      <>
                        <div style={{ height: 4, background: C.lgray, borderRadius: 2, overflow: "hidden", marginBottom: 8 }}>
                          <div style={{ height: "100%", background: current.color, width: `${progress}%`, borderRadius: 2, transition: "width 0.6s ease" }} />
                        </div>
                        <p style={{ ...T.bodySm, color: C.gray, fontSize: 11 }}>
                          GEL {totalSpent.toLocaleString()} / {nextTier.min.toLocaleString()} — <span style={{ color: C.tan }}>{L?.tierNext || "Next"}: {nextTier.name}</span>
                        </p>
                      </>
                    ) : (
                      <p style={{ ...T.bodySm, color: C.tan, fontSize: 12 }}>{L?.tierMax || "You've reached the highest tier!"}</p>
                    )}
                  </div>
                );
              })()}

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
                    <div style={{ ...T.displaySm, color: C.black, fontSize: 32 }}>{localOrders.length}</div>
                  </div>
                  <p style={{ ...T.heading, color: C.black, fontSize: 15, marginBottom: 4 }}>{L.myOrders || "My Orders"}</p>
                  <p style={{ ...T.bodySm, color: C.gray, fontSize: 12 }}>{L.viewYourOrders || "Track and manage your orders"}</p>
                  <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 14 }}>
                    <span style={{ ...T.labelSm, fontSize: 9, color: C.tan }}>{L.viewAll || "View all →"}</span>
                  </div>
                </button>
              </div>

              {/* Recent orders */}
              {localOrders.length > 0 && (
                <div style={{ marginBottom: 24 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                    <p style={{ ...T.label, color: C.black, fontSize: 11 }}>{L.recentOrders || "Recent Orders"}</p>
                    <button onClick={() => setPage("orders")} style={{ background: "none", border: "none", ...T.labelSm, color: C.tan, fontSize: 9, textDecoration: "underline", textUnderlineOffset: 3, cursor: "pointer" }}>{L.viewAll || "View all →"}</button>
                  </div>
                  {localOrders.slice(0, 3).map(o => {
                    const first = o.items ? o.items[0] : o;
                    const itemCount = o.items ? o.items.length : 1;
                    return (
                    <div key={o.orderId} style={{ display: "flex", gap: 14, padding: 16, background: C.white, marginBottom: 2, cursor: "pointer", transition: "background 0.15s" }}
                      onClick={() => setPage("orders")}
                      onMouseEnter={e => e.currentTarget.style.background = C.offwhite}
                      onMouseLeave={e => e.currentTarget.style.background = C.white}>
                      {getImg(first)?<img src={getImg(first)} alt={first.name} loading="lazy" width="56" height="56" style={{ width: 56, height: 56, objectFit: "cover", flexShrink: 0 }} />:<div style={{width:56,height:56,background:C.lgray,flexShrink:0}}/>}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ ...T.heading, color: C.black, fontSize: 13, marginBottom: 4, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{itemCount > 1 ? `${itemCount} items` : first.name}</p>
                        <span style={{ ...T.labelSm, fontSize: 8, padding: "3px 10px", background: o.status === "cancelled" ? C.red : `${C.tan}15`, color: o.status === "cancelled" ? C.white : C.tan }}>
                          {o.status === "cancelled" ? (L.statusCancelled||"Cancelled") : (L.statusLabels?.[o.status] || o.status || L.processing || "Processing")}
                        </span>
                      </div>
                      <p style={{ ...T.heading, color: C.black, fontSize: 14, flexShrink: 0 }}>GEL {o.total || first.sale || first.price}</p>
                    </div>
                    );
                  })}
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
              <SectionHeader title={L.myOrders || "My Orders"} subtitle={`${localOrders.length} ${localOrders.length === 1 ? L.piece || "order" : L.pieces || "orders"}`} mobile={mobile} />
              {localOrders.length === 0 ? (
                <EmptyState icon={icons.orders} title={L.noOrdersYet || "No orders yet"} subtitle={L.startBrowsing || "When you place an order, it will appear here."} action={() => setPage("catalog")} actionLabel={L.exploreCollection || "Explore Collection"} />
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  {localOrders.map(o => {
                    const first = o.items ? o.items[0] : o;
                    const itemCount = o.items ? o.items.length : 1;
                    return (
                    <div key={o.orderId} style={{ display: "flex", gap: 16, padding: 20, background: C.white, cursor: "pointer", transition: "background 0.15s" }}
                      onClick={() => setPage("orders")}
                      onMouseEnter={e => e.currentTarget.style.background = C.offwhite}
                      onMouseLeave={e => e.currentTarget.style.background = C.white}>
                      {getImg(first)?<img src={getImg(first)} alt={first.name} loading="lazy" width="72" height="72" style={{ width: 72, height: 72, objectFit: "cover", flexShrink: 0 }} />:<div style={{width:72,height:72,background:C.lgray,flexShrink:0}}/>}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ ...T.heading, color: C.black, fontSize: 14, marginBottom: 4 }}>{itemCount > 1 ? `${itemCount} items` : first.name}</p>
                        <p style={{ ...T.labelSm, color: C.gray, fontSize: 8, marginBottom: 8 }}>{o.orderId}</p>
                        <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                          {(() => {
                            const statuses = ["reserved","sourcing","confirmed","shipped","delivered"];
                            const statusLabels = { reserved: L.statusReserved||"Reserved", sourcing: L.statusSourcing||"Sourcing", confirmed: L.statusConfirmed||"Confirmed", shipped: L.statusShipped||"Shipped", delivered: L.statusDelivered||"Delivered" };
                            const current = statuses.indexOf(o.status || "reserved");
                            const cancelled = o.status === "cancelled";
                            return (
                              <div style={{ display: "flex", gap: 2, alignItems: "center", flexWrap: "wrap" }}>
                                {cancelled ? (
                                  <span style={{ ...T.labelSm, fontSize: 8, padding: "3px 10px", background: C.red, color: C.white }}>{L.statusCancelled||"CANCELLED"}</span>
                                ) : statuses.map((s, si) => (
                                  <div key={s} style={{ display: "flex", alignItems: "center", gap: 2 }}>
                                    <div style={{ width: 6, height: 6, borderRadius: "50%", background: si <= current ? C.tan : C.lgray, transition: "background 0.3s" }} />
                                    {si < statuses.length - 1 && <div style={{ width: 12, height: 1, background: si < current ? C.tan : C.lgray }} />}
                                  </div>
                                ))}
                                {!cancelled && <span style={{ ...T.labelSm, fontSize: 8, color: C.tan, marginLeft: 4 }}>{statusLabels[o.status] || o.status}</span>}
                              </div>
                            );
                          })()}
                          {o.wantVideo && <span style={{ ...T.labelSm, fontSize: 8, color: C.green }}>VIDEO</span>}
                          {!["shipped","delivered","cancelled"].includes(o.status) && (
                            <button onClick={(e) => { e.stopPropagation(); setCancelOrderId(o.orderId); }}
                              style={{ ...T.labelSm, fontSize: 8, color: C.red, background: "none", border: `1px solid ${C.red}`, padding: "3px 10px", cursor: "pointer", marginLeft: 4 }}>
                              {L.cancelOrder || "Cancel"}
                            </button>
                          )}
                        </div>
                      </div>
                      <div style={{ textAlign: "right", flexShrink: 0 }}>
                        <p style={{ ...T.heading, color: C.black, fontSize: 15 }}>GEL {o.total || 0}</p>
                      </div>
                    </div>
                    );
                  })}
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
                    <ProductCard key={p.id} product={p} wishlist={wishlist} onWishlist={onWishlist} onQuickView={onQuickView} L={L}
                      onSelect={() => setPage("product", p)} mobile={mobile} />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ════════ PROFILE ════════ */}
          {tab === "profile" && (
            <div>
              <SectionHeader title={L.profileInfo || "Profile"} subtitle={L.profileInfoSub || "Manage your personal information"} mobile={mobile} />

              {profileEdit ? (
                <div style={{ maxWidth: 560 }}>
                  <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr" : "1fr 1fr", gap: mobile ? 0 : 16 }}>
                    <FormInput label={L.fullNameLabel || "Full Name"} value={pName} onChange={setPName} required />
                    <FormInput label={L.emailLabel || "Email"} value={pEmail} onChange={setPEmail} type="email" required />
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr" : "1fr 1fr", gap: mobile ? 0 : 16 }}>
                    <FormInput label={L.whatsappLabel || "WhatsApp Number"} value={pPhone} onChange={setPPhone} placeholder="+995 5XX XXX XXX" />
                    <FormInput label={L.dateOfBirth || "Date of Birth"} value={pDob} onChange={setPDob} type="date" />
                  </div>
                  <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
                    <HoverBtn onClick={saveProfile} variant="primary" style={{ padding: "12px 32px" }}>{L.saveChanges || "Save Changes"}</HoverBtn>
                    <HoverBtn onClick={() => { setProfileEdit(false); setPName(user.name); setPEmail(user.email); setPPhone(user.phone || ""); setPDob(user.dob || ""); }} variant="ghost">{L.cancel || "Cancel"}</HoverBtn>
                  </div>
                </div>
              ) : (
                <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr" : "1fr 1fr", gap: mobile ? 20 : 24, maxWidth: 700 }}>
                  {/* Personal Info Card */}
                  <div style={{ padding: mobile ? 20 : 28, borderLeft: `3px solid ${C.tan}`, background: C.white }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
                      <p style={{ ...T.labelSm, color: C.tan, fontSize: 9 }}>{L.personalInfo || "PERSONAL INFO"}</p>
                      <button onClick={() => setProfileEdit(true)} style={{ ...T.labelSm, fontSize: 8, color: C.tan, background: "none", border: "none", cursor: "pointer", textDecoration: "underline", textUnderlineOffset: 3 }}>
                        {L.editProfile || "EDIT"}
                      </button>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
                      <div style={{ width: 44, height: 44, borderRadius: "50%", background: C.black, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <span style={{ fontFamily: "'Alido',serif", color: C.white, fontSize: 18 }}>{(user.name || "U").charAt(0).toUpperCase()}</span>
                      </div>
                      <div>
                        <p style={{ ...T.heading, color: C.black, fontSize: 15, marginBottom: 1 }}>{user.name}</p>
                        <p style={{ ...T.bodySm, color: C.gray, fontSize: 11 }}>{L.memberSince || "Member since"} 2026</p>
                      </div>
                    </div>
                    {[
                      [L.emailLabel || "Email", user.email],
                      [L.whatsappLabel || "WhatsApp", user.phone || "—"],
                      [L.dateOfBirth || "Date of Birth", user.dob || "—"],
                    ].map(([label, val]) => (
                      <div key={label} style={{ padding: "10px 0", borderTop: `1px solid ${C.offwhite}` }}>
                        <p style={{ ...T.labelSm, color: C.gray, fontSize: 8, marginBottom: 3 }}>{label}</p>
                        <p style={{ ...T.bodySm, color: C.black, fontSize: 13 }}>{val}</p>
                      </div>
                    ))}
                  </div>

                  {/* Security Card */}
                  <div style={{ display: "flex", flexDirection: "column", gap: mobile ? 20 : 24 }}>
                    <div style={{ padding: mobile ? 20 : 28, background: C.white, borderLeft: `3px solid ${C.lgray}` }}>
                      <p style={{ ...T.labelSm, color: C.gray, fontSize: 9, marginBottom: 16 }}>{L.security || "SECURITY"}</p>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div>
                          <p style={{ ...T.bodySm, color: C.black, fontSize: 13 }}>{L.password || "Password"}</p>
                          <p style={{ ...T.bodySm, color: C.gray, fontSize: 11, marginTop: 2 }}>••••••••</p>
                        </div>
                        <button onClick={() => setPwModal(true)} style={{ ...T.labelSm, fontSize: 9, padding: "8px 20px", background: "none", border: `1px solid ${C.lgray}`, color: C.black, cursor: "pointer", transition: "all 0.2s" }}
                          onMouseEnter={e => { e.currentTarget.style.borderColor = C.tan; e.currentTarget.style.color = C.tan; }}
                          onMouseLeave={e => { e.currentTarget.style.borderColor = C.lgray; e.currentTarget.style.color = C.black; }}>
                          {L.changeBtn || "CHANGE"}
                        </button>
                      </div>
                    </div>

                    <div style={{ padding: mobile ? 20 : 28, background: C.white, borderLeft: `3px solid rgba(192,57,43,0.3)` }}>
                      <p style={{ ...T.labelSm, color: "rgba(192,57,43,0.6)", fontSize: 9, marginBottom: 16 }}>{L.dangerZone || "DANGER ZONE"}</p>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div>
                          <p style={{ ...T.bodySm, color: C.black, fontSize: 13 }}>{L.deleteAccount || "Delete Account"}</p>
                          <p style={{ ...T.bodySm, color: C.gray, fontSize: 11, marginTop: 2 }}>{L.deleteAccountDesc || "This action is irreversible"}</p>
                        </div>
                        <button onClick={() => setDeleteModal(true)} style={{ ...T.labelSm, fontSize: 9, padding: "8px 20px", background: "none", border: "1px solid rgba(192,57,43,0.25)", color: "#c0392b", cursor: "pointer", transition: "all 0.2s" }}
                          onMouseEnter={e => e.currentTarget.style.background = "rgba(192,57,43,0.05)"}
                          onMouseLeave={e => e.currentTarget.style.background = "none"}>
                          {L.deleteBtn || "DELETE"}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
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
          {tab === "messages" && (
            <div>
              <SectionHeader title={L.messages || "Messages"} subtitle={L.messagesSub || "Photos, videos and updates from your orders"} mobile={mobile} />

              {messagesLoading ? (
                <div style={{ padding: "48px 20px", textAlign: "center" }}>
                  <p style={{ ...T.bodySm, color: C.gray }}>{L.loading || "Loading..."}</p>
                </div>
              ) : messages.length === 0 ? (
                <div style={{ background: C.white, padding: mobile ? 40 : 60, textAlign: "center" }}>
                  <Icon d={icons.messages} size={40} color={C.lgray} />
                  <p style={{ ...T.heading, color: C.black, fontSize: 16, marginTop: 16, marginBottom: 8 }}>{L.noMessages || "No messages yet"}</p>
                  <p style={{ ...T.bodySm, color: C.gray }}>{L.noMessagesSub || "When we send photos or videos of your order, they'll appear here."}</p>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  {messages.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map(msg => {
                    const imgMedia = (msg.media || []).filter(m => m.type === "image");
                    const vidMedia = (msg.media || []).filter(m => m.type === "video");
                    const orderRef = orders.find(o => o.orderId === msg.orderId);
                    const prodImg = orderRef ? getImg(orderRef) : "";
                    return (
                      <div key={msg.id} style={{ background: C.white, padding: mobile ? 20 : 28 }}>
                        {/* Header */}
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16, flexWrap: "wrap", gap: 8 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                            {prodImg && <img src={prodImg} alt="" style={{ width: 40, height: 40, objectFit: "cover", borderRadius: 2 }} />}
                            <div>
                              <p style={{ ...T.labelSm, color: C.tan, fontSize: 9, marginBottom: 2 }}>{msg.orderId}</p>
                              <p style={{ ...T.heading, color: C.black, fontSize: 13 }}>{orderRef?.productName || orderRef?.name || L.orderUpdate || "Order Update"}</p>
                            </div>
                          </div>
                          <p style={{ ...T.labelSm, color: C.lgray, fontSize: 9 }}>
                            {msg.createdAt ? new Date(msg.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : ""}
                          </p>
                        </div>

                        {/* Message text */}
                        {msg.content && (
                          <p style={{ ...T.bodySm, color: C.gray, marginBottom: 16, lineHeight: 1.7 }}>{msg.content}</p>
                        )}

                        {/* Photos grid */}
                        {imgMedia.length > 0 && (
                          <div style={{ display: "grid", gridTemplateColumns: imgMedia.length === 1 ? "1fr" : mobile ? "1fr 1fr" : "1fr 1fr 1fr", gap: 8, marginBottom: vidMedia.length > 0 ? 12 : 0 }}>
                            {imgMedia.map((m, j) => (
                              <img key={j} src={m.data} alt={m.name || "Photo"} style={{ width: "100%", height: imgMedia.length === 1 ? "auto" : 200, objectFit: "cover", borderRadius: 2, cursor: "pointer" }}
                                onClick={() => window.open(m.data, "_blank")} />
                            ))}
                          </div>
                        )}

                        {/* Video links */}
                        {vidMedia.length > 0 && (
                          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                            {vidMedia.map((m, j) => (
                              <a key={j} href={m.url} target="_blank" rel="noopener noreferrer"
                                style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "10px 20px", background: C.black, color: C.white, textDecoration: "none", ...T.labelSm, fontSize: 10, letterSpacing: "0.05em", transition: "opacity 0.2s" }}
                                onMouseEnter={e => e.currentTarget.style.opacity = "0.85"}
                                onMouseLeave={e => e.currentTarget.style.opacity = "1"}>
                                <span style={{ fontSize: 14 }}>▶</span> {L.watchVideo || "Watch Video"}
                              </a>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

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

              {/* Submit return request */}
              <div style={{ marginBottom: 24, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <p style={{ ...T.label, color: C.black, fontSize: 10 }}>{L.activeReturns || "Active Returns"}</p>
                <HoverBtn onClick={() => setReturnModal(true)} variant="tan" style={{ padding: "8px 18px", fontSize: 9 }}>+ {L.requestReturn || "Request Return"}</HoverBtn>
              </div>

              {myReturns.length === 0 ? (
                <EmptyState icon={icons.returns} title={L.noReturns || "No active returns"} subtitle={L.noReturnsSub || "You haven't initiated any returns yet."} />
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 2, marginBottom: 24 }}>
                  {myReturns.map(r => (
                    <div key={r.id} style={{ background: C.white, padding: 20, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div>
                        <p style={{ ...T.heading, color: C.black, fontSize: 13, marginBottom: 4 }}>{L.order || "Order"}: {r.orderId}</p>
                        <p style={{ ...T.bodySm, color: C.gray, fontSize: 12, marginBottom: 6 }}>{r.reason}</p>
                        <p style={{ ...T.labelSm, color: C.gray, fontSize: 9 }}>{r.createdAt ? new Date(r.createdAt).toLocaleDateString() : ""}</p>
                      </div>
                      <span style={{ ...T.labelSm, fontSize: 9, padding: "4px 12px", background: r.status === "approved" ? "#1a6b3a" : r.status === "rejected" ? C.red : C.tan, color: C.white }}>{(r.status || "pending").toUpperCase()}</span>
                    </div>
                  ))}
                </div>
              )}

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

      {/* ── Change Password Modal ── */}
      <Modal open={pwModal} onClose={() => { setPwModal(false); setPwCurrent(""); setPwNew(""); setPwConfirm(""); }} title={L.changePassword || "Change Password"} mobile={mobile}>
        <FormInput label={L.currentPassword || "Current Password"} value={pwCurrent} onChange={setPwCurrent} type="password" required />
        <FormInput label={L.newPassword || "New Password"} value={pwNew} onChange={setPwNew} type="password" required />
        <FormInput label={L.confirmPassword || "Confirm New Password"} value={pwConfirm} onChange={setPwConfirm} type="password" required />
        <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
          <HoverBtn onClick={handleChangePassword} variant="primary" style={{ padding: "13px 36px", opacity: pwLoading ? 0.6 : 1 }}>{pwLoading ? "..." : (L.changePassword || "Change Password")}</HoverBtn>
          <HoverBtn onClick={() => { setPwModal(false); setPwCurrent(""); setPwNew(""); setPwConfirm(""); }} variant="ghost">{L.cancel || "Cancel"}</HoverBtn>
        </div>
      </Modal>

      {/* ── Return Request Modal ── */}
      <Modal open={returnModal} onClose={() => { setReturnModal(false); setRetOrderId(""); setRetReason(""); }} title={L.requestReturn || "Request Return"} mobile={mobile}>
        <FormInput label={L.orderId || "Order ID"} value={retOrderId} onChange={setRetOrderId} placeholder="e.g. ORD-12345" required />
        <div style={{ marginBottom: 16 }}>
          <label style={{ ...T.labelSm, color: C.black, fontSize: 9, display: "block", marginBottom: 6 }}>{L.returnReason || "Reason for return"} *</label>
          <textarea value={retReason} onChange={e => setRetReason(e.target.value)} rows={4} placeholder={L.returnReasonPlaceholder || "Please describe why you want to return this item..."}
            style={{ width: "100%", padding: 12, border: `1px solid ${C.lgray}`, background: C.offwhite, ...T.bodySm, fontSize: 13, color: C.black, resize: "vertical", outline: "none", boxSizing: "border-box" }} />
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <HoverBtn onClick={handleReturnRequest} variant="primary" style={{ padding: "13px 36px", opacity: retLoading ? 0.6 : 1 }}>{retLoading ? "..." : (L.submitReturn || "Submit Request")}</HoverBtn>
          <HoverBtn onClick={() => { setReturnModal(false); setRetOrderId(""); setRetReason(""); }} variant="ghost">{L.cancel || "Cancel"}</HoverBtn>
        </div>
      </Modal>

      {/* ── Delete Account Modal ── */}
      <Modal open={deleteModal} onClose={() => { setDeleteModal(false); setDelPassword(""); }} title={L.deleteAccount || "Delete Account"} mobile={mobile}>
        <p style={{ ...T.bodySm, color: C.gray, marginBottom: 20 }}>{L.deleteAccountWarn || "This action is permanent and cannot be undone. All your data, orders, and wishlist will be deleted."}</p>
        <FormInput label={L.passwordLabel || "Password"} value={delPassword} onChange={setDelPassword} type="password" required />
        <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
          <HoverBtn onClick={handleDeleteAccount} variant="primary" style={{ padding: "13px 36px", background: C.red, opacity: delLoading ? 0.6 : 1 }}>{delLoading ? "..." : (L.confirmDelete || "Delete My Account")}</HoverBtn>
          <HoverBtn onClick={() => { setDeleteModal(false); setDelPassword(""); }} variant="ghost">{L.cancel || "Cancel"}</HoverBtn>
        </div>
      </Modal>

      {/* ── Cancel Order Confirmation ── */}
      <Modal open={!!cancelOrderId} onClose={() => setCancelOrderId(null)} title={L.cancelOrderTitle || "Cancel Order"} mobile={mobile}>
        <p style={{ ...T.bodySm, color: C.gray, marginBottom: 20 }}>{L.cancelConfirm || "Cancel this order? Your payment will be fully refunded."}</p>
        <p style={{ ...T.labelSm, color: C.black, marginBottom: 20 }}>{L.orderId || "Order ID"}: {cancelOrderId}</p>
        <div style={{ display: "flex", gap: 10 }}>
          <HoverBtn onClick={handleCancelOrder} variant="primary" style={{ padding: "13px 36px", background: C.red, opacity: cancelLoading ? 0.6 : 1 }}>{cancelLoading ? "..." : (L.confirmCancel || "Yes, Cancel Order")}</HoverBtn>
          <HoverBtn onClick={() => setCancelOrderId(null)} variant="ghost">{L.cancel || "Cancel"}</HoverBtn>
        </div>
      </Modal>
    </div>
  );
}
