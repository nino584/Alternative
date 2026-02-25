import { useState, useEffect, Fragment } from 'react';
import { C, T } from '../constants/theme.js';
import { ORDER_STATUSES } from '../constants/data.js';
import { VIDEO_VERIFICATION_GEL } from '../constants/config.js';
import { Logo } from '../components/layout/Logo.jsx';
import HoverBtn from '../components/ui/HoverBtn.jsx';
import { IconCheck, IconCross } from '../components/icons/Icons.jsx';

// ── STATUS COLORS ────────────────────────────────────────────────────────────
const STATUS_COLOR = {
  reserved: C.brown,
  sourcing: C.tan,
  confirmed: "#1a5c8b",
  shipped: C.green,
  delivered: C.gray,
};

// ── DROPDOWN OPTIONS ─────────────────────────────────────────────────────────
const SECTIONS = ["Womenswear", "Menswear", "Kidswear"];
const CATEGORIES = ["Clothing", "Shoes", "Bags", "Accessories", "Watches"];
const TAGS = ["", "New", "Sale", "Popular", "Limited"];

// ── EMPTY PRODUCT FORM ───────────────────────────────────────────────────────
const EMPTY_PRODUCT = {
  name: "", brand: "", section: "Womenswear", cat: "Clothing",
  color: "", price: "", sale: "", sizes: "", lead: "",
  tag: "", desc: "", img: "",
};

// ── DEMO ORDERS ──────────────────────────────────────────────────────────────
const DEMO_ORDERS = [
  { orderId: "ALT-2026-156", customer: "Nino G.", phone: "+995 599 123 456", item: "Structured lambskin tote", status: "reserved", amount: 320, date: "2026-02-24", wantVideo: true, size: "One Size", notes: "Gift wrapping requested" },
  { orderId: "ALT-2026-155", customer: "Tamara K.", phone: "+995 577 234 567", item: "Wool overcoat", status: "sourcing", amount: 520, date: "2026-02-23", wantVideo: false, size: "M", notes: "" },
  { orderId: "ALT-2026-154", customer: "Giorgi M.", phone: "+995 599 345 678", item: "Mesh dial watch", status: "shipped", amount: 480, date: "2026-02-22", wantVideo: false, size: "One Size", notes: "Express shipping" },
  { orderId: "ALT-2026-153", customer: "Ana B.", phone: "+995 555 456 789", item: "Silk scarf", status: "delivered", amount: 95, date: "2026-02-21", wantVideo: false, size: "One Size", notes: "" },
  { orderId: "ALT-2026-152", customer: "Davit R.", phone: "+995 598 567 890", item: "Horsebit loafer", status: "confirmed", amount: 180, date: "2026-02-20", wantVideo: true, size: "42", notes: "Black colour confirmed" },
  { orderId: "ALT-2026-151", customer: "Mariam S.", phone: "+995 571 678 901", item: "Mini Puzzle Bag", status: "sourcing", amount: 195, date: "2026-02-19", wantVideo: true, size: "One Size", notes: "" },
];

// ── STORE INFO ───────────────────────────────────────────────────────────────
const STORE_INFO = {
  name: "Alternative — Curated Luxury",
  email: "hello@alternative.ge",
  phone: "+995 555 999 555",
  address: "Tbilisi, Georgia",
};

// ── ADMIN PANEL ──────────────────────────────────────────────────────────────
export default function AdminPanel({ mobile, user, setPage, orders, toast, L, products, setProducts }) {
  const [tab, setTab] = useState("orders");

  // ── Order state ──────────────────────────────────────────────────────────
  const [statusOverrides, setStatusOverrides] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [expandedOrder, setExpandedOrder] = useState(null);

  // ── Product state ────────────────────────────────────────────────────────
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({ ...EMPTY_PRODUCT });
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  // ── Auth guard ───────────────────────────────────────────────────────────
  useEffect(() => { if (!user?.isAdmin) setPage("home"); }, [user]);
  if (!user?.isAdmin) return null;

  // ── Build order list ─────────────────────────────────────────────────────
  const realOrders = (orders || []).map(o => ({
    orderId: o.orderId || "ALT-" + Date.now(),
    customer: o.customerName || "Customer",
    phone: o.phone || "\u2014",
    item: o.name,
    status: statusOverrides[o.orderId] || o.status || "reserved",
    amount: o.sale || o.price,
    date: new Date().toISOString().slice(0, 10),
    wantVideo: !!o.wantVideo,
    size: o.size || "\u2014",
    notes: o.notes || "",
  }));
  const orderList = [
    ...realOrders,
    ...DEMO_ORDERS.map(o => ({ ...o, status: statusOverrides[o.orderId] || o.status })),
  ];

  // ── Filter & search orders ───────────────────────────────────────────────
  const filteredOrders = orderList.filter(o => {
    if (statusFilter !== "all" && o.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        o.orderId.toLowerCase().includes(q) ||
        o.customer.toLowerCase().includes(q) ||
        o.item.toLowerCase().includes(q)
      );
    }
    return true;
  });

  // ── Order helpers ────────────────────────────────────────────────────────
  const updateStatus = (orderId, newStatus) => {
    setStatusOverrides(prev => ({ ...prev, [orderId]: newStatus }));
    toast(L && L.orderUpdated || `Order ${orderId} updated to "${newStatus}"`, "success");
  };

  const exportCSV = () => {
    const header = "Order ID,Customer,WhatsApp,Item,Status,Amount,Date,Video Verification\n";
    const rows = filteredOrders.map(o =>
      `${o.orderId},${o.customer},${o.phone},"${o.item}",${o.status},${o.amount},${o.date},${o.wantVideo ? "Yes" : "No"}`
    ).join("\n");
    navigator.clipboard.writeText(header + rows).then(() => {
      toast(L && L.exportCSV || "CSV copied to clipboard", "success");
    }).catch(() => {
      toast("Failed to copy CSV", "error");
    });
  };

  // ── Product list (from props, fallback to empty) ─────────────────────────
  const productList = products || [];

  // ── Product CRUD ─────────────────────────────────────────────────────────
  const openAddProduct = () => {
    setEditingProduct(null);
    setProductForm({ ...EMPTY_PRODUCT });
    setShowProductForm(true);
  };

  const openEditProduct = (p) => {
    setEditingProduct(p.id);
    setProductForm({
      name: p.name || "",
      brand: p.brand || "",
      section: p.section || "Womenswear",
      cat: p.cat || "Clothing",
      color: p.color || "",
      price: p.price ? String(p.price) : "",
      sale: p.sale ? String(p.sale) : "",
      sizes: (p.sizes || []).join(", "),
      lead: p.lead || "",
      tag: p.tag || "",
      desc: p.desc || "",
      img: p.img || "",
    });
    setShowProductForm(true);
  };

  const cancelProductForm = () => {
    setShowProductForm(false);
    setEditingProduct(null);
    setProductForm({ ...EMPTY_PRODUCT });
  };

  const saveProduct = () => {
    if (!productForm.name.trim() || !productForm.price.trim()) {
      toast("Name and price are required", "error");
      return;
    }
    const parsedSizes = productForm.sizes
      ? productForm.sizes.split(",").map(s => s.trim()).filter(Boolean)
      : ["One Size"];

    if (editingProduct !== null) {
      // Update existing
      const updated = productList.map(p =>
        p.id === editingProduct
          ? {
            ...p,
            name: productForm.name.trim(),
            brand: productForm.brand.trim(),
            section: productForm.section,
            cat: productForm.cat,
            color: productForm.color.trim(),
            price: Number(productForm.price) || 0,
            sale: productForm.sale ? Number(productForm.sale) : null,
            sizes: parsedSizes,
            lead: productForm.lead.trim(),
            tag: productForm.tag,
            desc: productForm.desc.trim(),
            img: productForm.img.trim(),
          }
          : p
      );
      setProducts(updated);
      toast(L && L.productUpdated || "Product updated", "success");
    } else {
      // Add new
      const newId = productList.length > 0 ? Math.max(...productList.map(p => p.id)) + 1 : 1;
      const newProduct = {
        id: newId,
        name: productForm.name.trim(),
        brand: productForm.brand.trim(),
        section: productForm.section,
        cat: productForm.cat,
        sub: productForm.cat,
        color: productForm.color.trim(),
        price: Number(productForm.price) || 0,
        sale: productForm.sale ? Number(productForm.sale) : null,
        sizes: parsedSizes,
        lead: productForm.lead.trim(),
        tag: productForm.tag,
        desc: productForm.desc.trim(),
        img: productForm.img.trim(),
        fit: { fit: "True to size", notes: "" },
      };
      setProducts([...productList, newProduct]);
      toast(L && L.productAdded || "Product added", "success");
    }
    cancelProductForm();
  };

  const deleteProduct = (id) => {
    setProducts(productList.filter(p => p.id !== id));
    setDeleteConfirmId(null);
    toast(L && L.productDeleted || "Product deleted", "success");
  };

  // ── Statistics computation ───────────────────────────────────────────────
  const totalRevenue = orderList.reduce((s, o) => s + o.amount, 0);
  const videoOrders = orderList.filter(o => o.wantVideo).length;
  const videoRate = orderList.length > 0 ? Math.round((videoOrders / orderList.length) * 100) : 0;

  const revenueByStatus = ORDER_STATUSES.map(s => ({
    label: s.label,
    key: s.key,
    value: orderList.filter(o => o.status === s.key).reduce((sum, o) => sum + o.amount, 0),
  }));
  const maxRevenue = Math.max(...revenueByStatus.map(r => r.value), 1);

  const categoryCount = {};
  orderList.forEach(o => {
    // Try to guess category from item name
    const item = o.item.toLowerCase();
    let cat = "Other";
    if (item.includes("bag") || item.includes("tote") || item.includes("duffle") || item.includes("puzzle")) cat = "Bags";
    else if (item.includes("watch")) cat = "Watches";
    else if (item.includes("coat") || item.includes("blazer") || item.includes("jacket") || item.includes("puffer")) cat = "Clothing";
    else if (item.includes("shoe") || item.includes("loafer") || item.includes("mule") || item.includes("sneaker")) cat = "Shoes";
    else if (item.includes("scarf") || item.includes("belt") || item.includes("cashmere")) cat = "Accessories";
    categoryCount[cat] = (categoryCount[cat] || 0) + 1;
  });
  const bestCategories = Object.entries(categoryCount).sort((a, b) => b[1] - a[1]);
  const maxCatCount = bestCategories.length > 0 ? bestCategories[0][1] : 1;

  const ordersByStatus = ORDER_STATUSES.map(s => ({
    label: s.label,
    key: s.key,
    count: orderList.filter(o => o.status === s.key).length,
  }));
  const maxStatusCount = Math.max(...ordersByStatus.map(s => s.count), 1);

  const stats = [
    { label: L && L.totalOrders || "Total Orders", value: orderList.length },
    { label: L && L.revenue || "Revenue (GEL)", value: totalRevenue.toLocaleString() },
    { label: L && L.pending || "Pending", value: orderList.filter(o => ["reserved", "sourcing"].includes(o.status)).length },
    { label: L && L.videoOrders || "Video Orders", value: videoOrders },
  ];

  // ── Shared styles ────────────────────────────────────────────────────────
  const inputStyle = {
    ...T.bodySm,
    width: "100%",
    padding: "10px 14px",
    border: `1px solid ${C.lgray}`,
    background: C.offwhite,
    color: C.black,
    outline: "none",
    transition: "border-color 0.2s",
    fontSize: 13,
  };

  const selectStyle = {
    ...inputStyle,
    cursor: "pointer",
    appearance: "none",
    WebkitAppearance: "none",
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='%23a8a296'/%3E%3C/svg%3E")`,
    backgroundRepeat: "no-repeat",
    backgroundPosition: "right 12px center",
    paddingRight: 32,
  };

  const thStyle = {
    ...T.labelSm,
    color: C.gray,
    fontSize: 8,
    padding: "10px 14px",
    textAlign: "left",
    fontWeight: 500,
  };

  const sectionHeader = (title, rightContent) => (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 20px", borderBottom: `1px solid ${C.lgray}` }}>
      <p style={{ ...T.label, color: C.black, fontSize: 11 }}>{title}</p>
      {rightContent}
    </div>
  );

  // ── Tab definitions ──────────────────────────────────────────────────────
  const tabs = [
    ["orders", L && L.ordersTab || "Orders"],
    ["products", L && L.productsTab || "Products"],
    ["stats", L && L.statsTab || "Statistics"],
    ["settings", L && L.settingsTab || "Settings"],
  ];

  // ── RENDER ───────────────────────────────────────────────────────────────
  return (
    <div style={{ paddingTop: 80, minHeight: "100vh", background: C.offwhite }}>

      {/* ── HEADER ──────────────────────────────────────────────────────── */}
      <div style={{ borderBottom: `1px solid ${C.lgray}`, padding: "20px 0", background: C.cream }}>
        <div style={{ maxWidth: 1360, margin: "0 auto", padding: "0 40px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <Logo color={C.black} size={0.7} />
            <span style={{ width: 1, height: 18, background: C.lgray }} />
            <p style={{ ...T.label, color: C.black, fontSize: 10 }}>{L && L.adminPanelTitle || "Admin Panel"}</p>
          </div>
          <HoverBtn onClick={() => setPage("home")} variant="secondary" style={{ padding: "9px 20px", fontSize: 10 }}>
            {L && L.backToSite || "\u2190 Back to Site"}
          </HoverBtn>
        </div>
      </div>

      <div style={{ maxWidth: 1360, margin: "0 auto", padding: mobile ? "0 16px" : "0 40px" }}>

        {/* ── STAT CARDS ────────────────────────────────────────────────── */}
        <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr 1fr" : "repeat(4,1fr)", gap: 3, margin: "28px 0" }}>
          {stats.map((s, i) => (
            <div key={i} style={{ padding: "22px", background: C.cream, borderBottom: `3px solid ${i === 0 ? C.tan : i === 2 ? C.red : i === 3 ? "#1a5c8b" : C.lgray}` }}>
              <p style={{ fontFamily: "'Alido',serif", fontSize: 34, fontWeight: 300, color: C.black, marginBottom: 3, lineHeight: 1 }}>{s.value}</p>
              <p style={{ ...T.labelSm, color: C.gray, fontSize: 9 }}>{s.label}</p>
            </div>
          ))}
        </div>

        {/* ── TAB BAR ───────────────────────────────────────────────────── */}
        <div style={{ display: "flex", borderBottom: `1px solid ${C.lgray}`, marginBottom: 28, background: C.cream, overflowX: "auto" }}>
          {tabs.map(([k, l]) => (
            <button key={k} onClick={() => setTab(k)} style={{
              ...T.label, fontSize: 10, padding: "14px 22px", background: "none", border: "none",
              color: tab === k ? C.black : C.gray,
              borderBottom: tab === k ? `2px solid ${C.tan}` : "2px solid transparent",
              transition: "all 0.2s", whiteSpace: "nowrap", cursor: "pointer",
            }}>
              {l}
            </button>
          ))}
        </div>

        {/* ================================================================ */}
        {/* ── ORDERS TAB ────────────────────────────────────────────────── */}
        {/* ================================================================ */}
        {tab === "orders" && (
          <div style={{ background: C.cream, marginBottom: 40 }}>

            {/* Header */}
            {sectionHeader(
              L && L.allOrders || "All Orders",
              <p style={{ ...T.labelSm, color: C.gray, fontSize: 9 }}>
                {filteredOrders.length} {L && L.ordersTotal || "orders total"}
              </p>
            )}

            {/* Search + Filter Bar */}
            <div style={{ padding: "16px 20px", borderBottom: `1px solid ${C.lgray}`, display: "flex", flexWrap: "wrap", gap: 12, alignItems: "center" }}>

              {/* Search */}
              <div style={{ flex: "1 1 240px", maxWidth: 360, position: "relative" }}>
                <input
                  type="text"
                  placeholder={L && L.searchOrders || "Search orders..."}
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  style={{ ...inputStyle, paddingLeft: 14, fontSize: 12 }}
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", padding: 2, lineHeight: 0 }}
                  >
                    <IconCross size={12} color={C.gray} />
                  </button>
                )}
              </div>

              {/* Status filter pills */}
              <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                {[{ key: "all", label: L && L.allStatuses || "All" }, ...ORDER_STATUSES].map(s => (
                  <button
                    key={s.key}
                    onClick={() => setStatusFilter(s.key)}
                    style={{
                      ...T.labelSm, fontSize: 8, padding: "5px 12px",
                      border: `1px solid ${statusFilter === s.key ? C.tan : C.lgray}`,
                      background: statusFilter === s.key ? C.tan : "transparent",
                      color: statusFilter === s.key ? C.white : C.gray,
                      cursor: "pointer", transition: "all 0.2s",
                    }}
                  >
                    {s.label}
                  </button>
                ))}
              </div>

              {/* Export CSV */}
              <HoverBtn onClick={exportCSV} variant="ghost" style={{ padding: "6px 14px", fontSize: 9, marginLeft: "auto" }}>
                {L && L.exportCSV || "Export CSV"}
              </HoverBtn>
            </div>

            {/* Orders Table */}
            {filteredOrders.length === 0 ? (
              <div style={{ padding: "48px 20px", textAlign: "center" }}>
                <p style={{ ...T.bodySm, color: C.gray }}>{L && L.noOrdersFound || "No orders found"}</p>
              </div>
            ) : (
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 900 }}>
                  <thead>
                    <tr style={{ borderBottom: `1px solid ${C.lgray}`, background: C.offwhite }}>
                      {[
                        L && L.orderID || "Order ID",
                        L && L.customer || "Customer",
                        L && L.whatsappCol || "WhatsApp",
                        L && L.itemCol || "Item",
                        L && L.statusCol || "Status",
                        L && L.updateStatus || "Update Status",
                        L && L.amountCol || "Amount",
                        L && L.dateCol || "Date",
                      ].map(h => (
                        <th key={h} style={thStyle}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.map((o, i) => (
                      <Fragment key={o.orderId + "-" + i}>
                        <tr
                          style={{ borderBottom: `1px solid ${C.lgray}`, cursor: "pointer", transition: "background 0.15s" }}
                          onMouseEnter={e => e.currentTarget.style.background = C.offwhite}
                          onMouseLeave={e => e.currentTarget.style.background = expandedOrder === o.orderId ? C.offwhite : "transparent"}
                          onClick={() => setExpandedOrder(expandedOrder === o.orderId ? null : o.orderId)}
                        >
                          <td style={{ ...T.labelSm, color: C.tan, padding: "12px 14px", fontSize: 9 }}>
                            {o.orderId}
                            {o.wantVideo && (
                              <span style={{ marginLeft: 6, ...T.labelSm, fontSize: 7, color: C.tan, padding: "1px 5px", border: `1px solid ${C.tan}` }}>VID</span>
                            )}
                          </td>
                          <td style={{ ...T.bodySm, color: C.black, padding: "12px 14px" }}>{o.customer}</td>
                          <td style={{ ...T.bodySm, color: C.gray, padding: "12px 14px", fontSize: 12 }}>{o.phone}</td>
                          <td style={{ ...T.bodySm, color: C.black, padding: "12px 14px", maxWidth: 160, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{o.item}</td>
                          <td style={{ padding: "12px 14px" }}>
                            <span style={{ ...T.labelSm, fontSize: 8, padding: "3px 8px", background: STATUS_COLOR[o.status] || C.gray, color: C.white }}>
                              {o.status}
                            </span>
                          </td>
                          <td style={{ padding: "12px 14px" }} onClick={e => e.stopPropagation()}>
                            <select
                              value={o.status}
                              onChange={e => updateStatus(o.orderId, e.target.value)}
                              style={{ ...T.labelSm, fontSize: 8, padding: "5px 8px", border: `1px solid ${C.lgray}`, background: C.cream, color: C.black, cursor: "pointer", outline: "none" }}
                            >
                              {ORDER_STATUSES.map(s => <option key={s.key} value={s.key}>{s.label}</option>)}
                            </select>
                          </td>
                          <td style={{ ...T.bodySm, color: C.black, padding: "12px 14px" }}>GEL {o.amount}</td>
                          <td style={{ ...T.labelSm, color: C.gray, padding: "12px 14px", fontSize: 8 }}>{o.date}</td>
                        </tr>

                        {/* Expanded detail row */}
                        {expandedOrder === o.orderId && (
                          <tr style={{ background: C.offwhite }}>
                            <td colSpan={8} style={{ padding: "16px 20px", borderBottom: `1px solid ${C.lgray}` }}>
                              <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr" : "1fr 1fr 1fr", gap: 20 }}>
                                <div>
                                  <p style={{ ...T.labelSm, color: C.gray, fontSize: 8, marginBottom: 4 }}>{L && L.orderDetails || "ORDER DETAILS"}</p>
                                  <p style={{ ...T.bodySm, color: C.black, marginBottom: 4 }}>{o.item}</p>
                                  <p style={{ ...T.bodySm, color: C.gray, fontSize: 12 }}>Size: {o.size || "\u2014"}</p>
                                </div>
                                <div>
                                  <p style={{ ...T.labelSm, color: C.gray, fontSize: 8, marginBottom: 4 }}>VIDEO VERIFICATION</p>
                                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                    {o.wantVideo
                                      ? <><IconCheck size={14} color={C.green} /><span style={{ ...T.bodySm, color: C.green }}>Requested (+{VIDEO_VERIFICATION_GEL} GEL)</span></>
                                      : <><IconCross size={14} color={C.gray} /><span style={{ ...T.bodySm, color: C.gray }}>Not requested</span></>
                                    }
                                  </div>
                                </div>
                                <div>
                                  <p style={{ ...T.labelSm, color: C.gray, fontSize: 8, marginBottom: 4 }}>NOTES</p>
                                  <p style={{ ...T.bodySm, color: o.notes ? C.black : C.gray }}>{o.notes || "No notes"}</p>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ================================================================ */}
        {/* ── PRODUCTS TAB ──────────────────────────────────────────────── */}
        {/* ================================================================ */}
        {tab === "products" && (
          <div style={{ background: C.cream, marginBottom: 40 }}>

            {/* Header */}
            {sectionHeader(
              `${L && L.productCatalog || "Product Catalog"} (${productList.length} items)`,
              <HoverBtn onClick={openAddProduct} variant="tan" style={{ padding: "8px 18px", fontSize: 9 }}>
                + {L && L.addProduct || "Add Product"}
              </HoverBtn>
            )}

            {/* ── Add / Edit Form ───────────────────────────────────────── */}
            {showProductForm && (
              <div style={{ padding: 20, borderBottom: `1px solid ${C.lgray}`, background: C.offwhite, animation: "slideDown 0.2s ease" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                  <p style={{ ...T.label, color: C.black, fontSize: 11 }}>
                    {editingProduct !== null ? (L && L.editProduct || "Edit Product") : (L && L.addProduct || "Add Product")}
                  </p>
                  <button onClick={cancelProductForm} style={{ background: "none", border: "none", cursor: "pointer", padding: 4, lineHeight: 0 }}>
                    <IconCross size={16} color={C.gray} />
                  </button>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr" : "1fr 1fr 1fr", gap: 16 }}>
                  {/* Name */}
                  <div>
                    <label style={{ ...T.labelSm, color: C.gray, fontSize: 8, display: "block", marginBottom: 6 }}>{L && L.nameField || "NAME"} *</label>
                    <input style={inputStyle} value={productForm.name} onChange={e => setProductForm(f => ({ ...f, name: e.target.value }))} placeholder="Product name" />
                  </div>
                  {/* Brand */}
                  <div>
                    <label style={{ ...T.labelSm, color: C.gray, fontSize: 8, display: "block", marginBottom: 6 }}>{L && L.brandField || "BRAND"}</label>
                    <input style={inputStyle} value={productForm.brand} onChange={e => setProductForm(f => ({ ...f, brand: e.target.value }))} placeholder="Brand" />
                  </div>
                  {/* Section */}
                  <div>
                    <label style={{ ...T.labelSm, color: C.gray, fontSize: 8, display: "block", marginBottom: 6 }}>{L && L.sectionField || "SECTION"}</label>
                    <select style={selectStyle} value={productForm.section} onChange={e => setProductForm(f => ({ ...f, section: e.target.value }))}>
                      {SECTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  {/* Category */}
                  <div>
                    <label style={{ ...T.labelSm, color: C.gray, fontSize: 8, display: "block", marginBottom: 6 }}>{L && L.categoryField || "CATEGORY"}</label>
                    <select style={selectStyle} value={productForm.cat} onChange={e => setProductForm(f => ({ ...f, cat: e.target.value }))}>
                      {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  {/* Color */}
                  <div>
                    <label style={{ ...T.labelSm, color: C.gray, fontSize: 8, display: "block", marginBottom: 6 }}>{L && L.colorField || "COLOR"}</label>
                    <input style={inputStyle} value={productForm.color} onChange={e => setProductForm(f => ({ ...f, color: e.target.value }))} placeholder="e.g. Black" />
                  </div>
                  {/* Price */}
                  <div>
                    <label style={{ ...T.labelSm, color: C.gray, fontSize: 8, display: "block", marginBottom: 6 }}>{L && L.priceField || "PRICE (GEL)"} *</label>
                    <input style={inputStyle} type="number" value={productForm.price} onChange={e => setProductForm(f => ({ ...f, price: e.target.value }))} placeholder="0" />
                  </div>
                  {/* Sale Price */}
                  <div>
                    <label style={{ ...T.labelSm, color: C.gray, fontSize: 8, display: "block", marginBottom: 6 }}>{L && L.salePriceField || "SALE PRICE (GEL)"}</label>
                    <input style={inputStyle} type="number" value={productForm.sale} onChange={e => setProductForm(f => ({ ...f, sale: e.target.value }))} placeholder="Leave empty if no sale" />
                  </div>
                  {/* Sizes */}
                  <div>
                    <label style={{ ...T.labelSm, color: C.gray, fontSize: 8, display: "block", marginBottom: 6 }}>{L && L.sizesField || "SIZES (COMMA-SEPARATED)"}</label>
                    <input style={inputStyle} value={productForm.sizes} onChange={e => setProductForm(f => ({ ...f, sizes: e.target.value }))} placeholder="S, M, L, XL" />
                  </div>
                  {/* Lead Time */}
                  <div>
                    <label style={{ ...T.labelSm, color: C.gray, fontSize: 8, display: "block", marginBottom: 6 }}>{L && L.leadTimeField || "LEAD TIME"}</label>
                    <input style={inputStyle} value={productForm.lead} onChange={e => setProductForm(f => ({ ...f, lead: e.target.value }))} placeholder="e.g. 10\u201314 days" />
                  </div>
                  {/* Tag */}
                  <div>
                    <label style={{ ...T.labelSm, color: C.gray, fontSize: 8, display: "block", marginBottom: 6 }}>{L && L.tagField || "TAG"}</label>
                    <select style={selectStyle} value={productForm.tag} onChange={e => setProductForm(f => ({ ...f, tag: e.target.value }))}>
                      {TAGS.map(t => <option key={t} value={t}>{t || "None"}</option>)}
                    </select>
                  </div>
                  {/* Image URL */}
                  <div>
                    <label style={{ ...T.labelSm, color: C.gray, fontSize: 8, display: "block", marginBottom: 6 }}>{L && L.imageUrlField || "IMAGE URL"}</label>
                    <input style={inputStyle} value={productForm.img} onChange={e => setProductForm(f => ({ ...f, img: e.target.value }))} placeholder="https://..." />
                  </div>
                  {/* Image preview */}
                  <div style={{ display: "flex", alignItems: "flex-end" }}>
                    {productForm.img && (
                      <img
                        src={productForm.img}
                        alt="Preview"
                        style={{ width: 60, height: 60, objectFit: "cover", border: `1px solid ${C.lgray}` }}
                        onError={e => { e.target.style.display = "none"; }}
                      />
                    )}
                  </div>
                </div>

                {/* Description */}
                <div style={{ marginTop: 16 }}>
                  <label style={{ ...T.labelSm, color: C.gray, fontSize: 8, display: "block", marginBottom: 6 }}>{L && L.descField || "DESCRIPTION"}</label>
                  <textarea
                    style={{ ...inputStyle, minHeight: 72, resize: "vertical" }}
                    value={productForm.desc}
                    onChange={e => setProductForm(f => ({ ...f, desc: e.target.value }))}
                    placeholder="Product description..."
                  />
                </div>

                {/* Buttons */}
                <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
                  <HoverBtn onClick={saveProduct} variant="tan" style={{ padding: "10px 28px", fontSize: 9 }}>
                    <IconCheck size={12} color={C.white} style={{ marginRight: 6 }} />
                    {L && L.saveProduct || "Save Product"}
                  </HoverBtn>
                  <HoverBtn onClick={cancelProductForm} variant="ghost" style={{ padding: "10px 20px", fontSize: 9 }}>
                    {L && L.cancelBtn || "Cancel"}
                  </HoverBtn>
                </div>
              </div>
            )}

            {/* ── Product Table ──────────────────────────────────────────── */}
            {productList.length === 0 ? (
              <div style={{ padding: "48px 20px", textAlign: "center" }}>
                <p style={{ ...T.bodySm, color: C.gray, marginBottom: 16 }}>No products yet</p>
                <HoverBtn onClick={openAddProduct} variant="tan" style={{ padding: "10px 24px", fontSize: 9 }}>
                  + {L && L.addProduct || "Add Product"}
                </HoverBtn>
              </div>
            ) : (
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 800 }}>
                  <thead>
                    <tr style={{ borderBottom: `1px solid ${C.lgray}`, background: C.offwhite }}>
                      {["", "Name", "Brand", "Section", "Category", "Price", "Sale", "Sizes", "Tag", "Actions"].map(h => (
                        <th key={h} style={{ ...thStyle, fontSize: 8 }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {productList.map(p => (
                      <tr
                        key={p.id}
                        style={{ borderBottom: `1px solid ${C.lgray}`, transition: "background 0.15s" }}
                        onMouseEnter={e => e.currentTarget.style.background = C.offwhite}
                        onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                      >
                        <td style={{ padding: "8px 12px" }}>
                          {p.img
                            ? <img src={p.img} alt={p.name} style={{ width: 36, height: 36, objectFit: "cover" }} />
                            : <div style={{ width: 36, height: 36, background: C.lgray }} />
                          }
                        </td>
                        <td style={{ ...T.bodySm, color: C.black, padding: "8px 12px", maxWidth: 160, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.name}</td>
                        <td style={{ ...T.bodySm, color: C.gray, padding: "8px 12px", fontSize: 12 }}>{p.brand || "\u2014"}</td>
                        <td style={{ ...T.labelSm, color: C.tan, padding: "8px 12px", fontSize: 8 }}>{p.section}</td>
                        <td style={{ ...T.bodySm, color: C.gray, padding: "8px 12px" }}>{p.cat}</td>
                        <td style={{ ...T.bodySm, color: C.black, padding: "8px 12px" }}>GEL {p.price}</td>
                        <td style={{ ...T.bodySm, color: p.sale ? C.red : C.lgray, padding: "8px 12px" }}>{p.sale ? `GEL ${p.sale}` : "\u2014"}</td>
                        <td style={{ ...T.bodySm, color: C.gray, padding: "8px 12px", fontSize: 11 }}>{(p.sizes || []).join(", ")}</td>
                        <td style={{ padding: "8px 12px" }}>
                          {p.tag && (
                            <span style={{ ...T.labelSm, fontSize: 7, padding: "2px 7px", background: p.tag === "Sale" ? C.red : p.tag === "New" ? C.black : p.tag === "Limited" ? "#1a5c8b" : C.tan, color: C.white }}>
                              {p.tag}
                            </span>
                          )}
                        </td>
                        <td style={{ padding: "8px 12px" }}>
                          <div style={{ display: "flex", gap: 6 }}>
                            <HoverBtn onClick={() => openEditProduct(p)} variant="ghost" style={{ padding: "4px 10px", fontSize: 8 }}>
                              {L && L.editProduct || "Edit"}
                            </HoverBtn>
                            {deleteConfirmId === p.id ? (
                              <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
                                <span style={{ ...T.labelSm, color: C.red, fontSize: 8, marginRight: 4 }}>
                                  {L && L.confirmDeleteProduct || "Sure?"}
                                </span>
                                <button
                                  onClick={() => deleteProduct(p.id)}
                                  style={{ background: "none", border: "none", cursor: "pointer", padding: 2, lineHeight: 0 }}
                                >
                                  <IconCheck size={14} color={C.green} />
                                </button>
                                <button
                                  onClick={() => setDeleteConfirmId(null)}
                                  style={{ background: "none", border: "none", cursor: "pointer", padding: 2, lineHeight: 0 }}
                                >
                                  <IconCross size={14} color={C.red} />
                                </button>
                              </div>
                            ) : (
                              <HoverBtn onClick={() => setDeleteConfirmId(p.id)} variant="danger" style={{ padding: "4px 10px", fontSize: 8 }}>
                                {L && L.deleteProduct || "Delete"}
                              </HoverBtn>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ================================================================ */}
        {/* ── STATISTICS TAB ────────────────────────────────────────────── */}
        {/* ================================================================ */}
        {tab === "stats" && (
          <div style={{ marginBottom: 40 }}>

            {/* Row 1: Revenue by Status + Video Verification */}
            <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr" : "2fr 1fr", gap: 3, marginBottom: 3 }}>

              {/* Revenue by Status */}
              <div style={{ background: C.cream, padding: 24 }}>
                <p style={{ ...T.label, color: C.black, fontSize: 11, marginBottom: 20 }}>
                  {L && L.revenueByStatus || "Revenue by Status"}
                </p>
                {revenueByStatus.map(r => (
                  <div key={r.key} style={{ marginBottom: 14 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5, alignItems: "baseline" }}>
                      <span style={{ ...T.bodySm, color: C.black }}>{r.label}</span>
                      <span style={{ ...T.label, color: C.tan, fontSize: 10 }}>GEL {r.value.toLocaleString()}</span>
                    </div>
                    <div style={{ width: "100%", height: 6, background: C.lgray, position: "relative" }}>
                      <div style={{
                        width: `${(r.value / maxRevenue) * 100}%`,
                        height: "100%",
                        background: STATUS_COLOR[r.key] || C.gray,
                        transition: "width 0.6s ease",
                      }} />
                    </div>
                  </div>
                ))}
                <div style={{ marginTop: 18, paddingTop: 14, borderTop: `1px solid ${C.lgray}`, display: "flex", justifyContent: "space-between" }}>
                  <span style={{ ...T.label, color: C.black, fontSize: 10 }}>TOTAL</span>
                  <span style={{ fontFamily: "'Alido',serif", fontSize: 22, fontWeight: 300, color: C.black }}>GEL {totalRevenue.toLocaleString()}</span>
                </div>
              </div>

              {/* Video Verification Rate */}
              <div style={{ background: C.cream, padding: 24, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                <div>
                  <p style={{ ...T.label, color: C.black, fontSize: 11, marginBottom: 20 }}>
                    {L && L.videoRate || "Video Verification Rate"}
                  </p>
                  <div style={{ textAlign: "center", padding: "20px 0" }}>
                    <p style={{ fontFamily: "'Alido',serif", fontSize: 52, fontWeight: 300, color: C.tan, lineHeight: 1 }}>{videoRate}%</p>
                    <p style={{ ...T.labelSm, color: C.gray, fontSize: 9, marginTop: 8 }}>
                      {videoOrders} of {orderList.length} orders
                    </p>
                  </div>
                </div>
                <div style={{ background: C.offwhite, padding: 14 }}>
                  <p style={{ ...T.bodySm, color: C.gray, fontSize: 11 }}>
                    Add-on price: <span style={{ color: C.black, fontWeight: 500 }}>{VIDEO_VERIFICATION_GEL} GEL</span>
                  </p>
                  <p style={{ ...T.bodySm, color: C.gray, fontSize: 11, marginTop: 4 }}>
                    Estimated add-on revenue: <span style={{ color: C.tan, fontWeight: 500 }}>{(videoOrders * VIDEO_VERIFICATION_GEL).toLocaleString()} GEL</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Row 2: Best Selling Categories + Orders by Status */}
            <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr" : "1fr 1fr", gap: 3 }}>

              {/* Best Selling Categories */}
              <div style={{ background: C.cream, padding: 24 }}>
                <p style={{ ...T.label, color: C.black, fontSize: 11, marginBottom: 20 }}>
                  {L && L.bestSellers || "Best Selling Categories"}
                </p>
                {bestCategories.length === 0 ? (
                  <p style={{ ...T.bodySm, color: C.gray }}>No data yet</p>
                ) : (
                  bestCategories.map(([cat, count]) => (
                    <div key={cat} style={{ marginBottom: 12 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5, alignItems: "baseline" }}>
                        <span style={{ ...T.bodySm, color: C.black }}>{cat}</span>
                        <span style={{ ...T.labelSm, color: C.gray, fontSize: 9 }}>{count} orders</span>
                      </div>
                      <div style={{ width: "100%", height: 6, background: C.lgray, position: "relative" }}>
                        <div style={{
                          width: `${(count / maxCatCount) * 100}%`,
                          height: "100%",
                          background: C.tan,
                          transition: "width 0.6s ease",
                        }} />
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Orders by Status */}
              <div style={{ background: C.cream, padding: 24 }}>
                <p style={{ ...T.label, color: C.black, fontSize: 11, marginBottom: 20 }}>
                  {L && L.ordersByStatus || "Orders by Status"}
                </p>
                {ordersByStatus.map(s => (
                  <div key={s.key} style={{ marginBottom: 12 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5, alignItems: "baseline" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ width: 8, height: 8, background: STATUS_COLOR[s.key], display: "inline-block" }} />
                        <span style={{ ...T.bodySm, color: C.black }}>{s.label}</span>
                      </div>
                      <span style={{ ...T.labelSm, color: C.gray, fontSize: 9 }}>{s.count} orders</span>
                    </div>
                    <div style={{ width: "100%", height: 6, background: C.lgray, position: "relative" }}>
                      <div style={{
                        width: `${maxStatusCount > 0 ? (s.count / maxStatusCount) * 100 : 0}%`,
                        height: "100%",
                        background: STATUS_COLOR[s.key],
                        transition: "width 0.6s ease",
                      }} />
                    </div>
                  </div>
                ))}
                <div style={{ marginTop: 18, paddingTop: 14, borderTop: `1px solid ${C.lgray}`, display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <span style={{ ...T.label, color: C.black, fontSize: 10 }}>TOTAL</span>
                  <span style={{ fontFamily: "'Alido',serif", fontSize: 22, fontWeight: 300, color: C.black }}>{orderList.length}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================================================================ */}
        {/* ── SETTINGS TAB ──────────────────────────────────────────────── */}
        {/* ================================================================ */}
        {tab === "settings" && (
          <div style={{ marginBottom: 40 }}>

            {/* Store Info */}
            <div style={{ background: C.cream, marginBottom: 3 }}>
              {sectionHeader(L && L.storeSettings || "Store Settings", null)}
              <div style={{ padding: 24 }}>
                <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr" : "1fr 1fr", gap: 20 }}>
                  {[
                    { label: "Store Name", value: STORE_INFO.name },
                    { label: "Email", value: STORE_INFO.email },
                    { label: "Phone", value: STORE_INFO.phone },
                    { label: "Address", value: STORE_INFO.address },
                  ].map(item => (
                    <div key={item.label}>
                      <p style={{ ...T.labelSm, color: C.gray, fontSize: 8, marginBottom: 6 }}>{item.label}</p>
                      <p style={{ ...T.bodySm, color: C.black, padding: "10px 14px", background: C.offwhite, border: `1px solid ${C.lgray}` }}>{item.value}</p>
                    </div>
                  ))}
                </div>

                <div style={{ marginTop: 20, padding: 16, background: C.offwhite, border: `1px solid ${C.lgray}` }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                    <span style={{ width: 8, height: 8, background: C.green, display: "inline-block", borderRadius: "50%" }} />
                    <p style={{ ...T.bodySm, color: C.green, fontWeight: 500 }}>Store is live</p>
                  </div>
                  <p style={{ ...T.bodySm, color: C.gray, fontSize: 12 }}>
                    Video verification add-on: {VIDEO_VERIFICATION_GEL} GEL per order
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div style={{ background: C.cream }}>
              {sectionHeader(L && L.quickLinks || "Quick Links", null)}
              <div style={{ padding: 24 }}>
                <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr" : "repeat(4, 1fr)", gap: 12 }}>
                  {[
                    { label: "Privacy Policy", page: "privacy" },
                    { label: "Terms of Service", page: "terms" },
                    { label: "Return Policy", page: "returns" },
                    { label: "Shipping Info", page: "shipping" },
                  ].map(link => (
                    <button
                      key={link.page}
                      onClick={() => setPage(link.page)}
                      style={{
                        ...T.label, fontSize: 10, padding: "16px 20px",
                        background: C.offwhite, border: `1px solid ${C.lgray}`,
                        color: C.black, cursor: "pointer",
                        textAlign: "left", transition: "all 0.2s",
                      }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = C.tan; e.currentTarget.style.color = C.tan; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = C.lgray; e.currentTarget.style.color = C.black; }}
                    >
                      {link.label}
                      <span style={{ float: "right", fontWeight: 300 }}>{"\u2192"}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
