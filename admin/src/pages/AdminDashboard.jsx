import { useState, useEffect, useCallback, Fragment } from 'react';
import { C, T } from '../constants/theme.js';
import { VIDEO_VERIFICATION_GEL } from '../constants/config.js';
import { Logo } from '../components/Logo.jsx';
import HoverBtn from '../components/HoverBtn.jsx';
import { api } from '../api.js';

// Inline icon components (no separate icons file needed)
const IconCheck = ({size=16,color=C.tan,stroke=1.5}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={stroke}><path d="M20 6L9 17l-5-5"/></svg>
);
const IconCross = ({size=16,color=C.gray,stroke=1.5}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={stroke}><path d="M18 6L6 18M6 6l12 12"/></svg>
);

const ORDER_STATUSES = [
  {key:"reserved",label:"Reserved",desc:"Reservation confirmed.",color:C.brown},
  {key:"sourcing",label:"Sourcing",desc:"Being sourced from suppliers.",color:C.tan},
  {key:"confirmed",label:"Confirmed",desc:"In stock, being packaged.",color:"#1a5c8b"},
  {key:"shipped",label:"Shipped",desc:"In transit. 3–5 days.",color:C.green},
  {key:"delivered",label:"Delivered",desc:"Delivered.",color:C.gray},
];

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

// ── SIZE PRESETS ──────────────────────────────────────────────────────────────
const CLOTHING_SIZES = ["XXS","XS","S","M","L","XL","XXL","XXXL"];
const SHOE_SIZES = ["36","37","38","39","40","41","42","43","44","45"];
const KIDS_CLOTHING_SIZES = ["80","86","92","98","104","110","116","122","128","134","140","146","152","158","164"];
const KIDS_SHOE_SIZES = ["20","21","22","23","24","25","26","27","28","29","30","31","32","33","34","35"];
const FIT_OPTIONS = ["True to Size","Runs Small","Runs Large"];

// ── BRAND LIST ───────────────────────────────────────────────────────────────
const BRAND_LIST = [
  "Acne Studios","Ahlem","Alaia","Alessandra Rich","Alexander McQueen",
  "Alexander Wang","Ami Paris","Amina Muaddi","Balenciaga","Baziszt",
  "Bernadette","Blumarine","Bottega Veneta","Brioni","Brunello Cucinelli",
  "Burberry","Cartier","Celine","Cesare Attolini","Chloé",
  "Christian Louboutin","Diesel","Dior","District Vision","Dita",
  "Dolce & Gabbana","Dries Van Noten","Dsquared2","Fendi","Givenchy",
  "Golden Goose","Gucci","Jacquemus","Jimmy Choo","Kuboraum",
  "Lardini","LBM","Loewe","Loro Piana","Magda Butrym",
  "Maison Margiela","Manzoni 24","Max Mara","Miu Miu","Moncler",
  "Moschino","Off-White","Palm Angels","Phoebe Philo","Prada",
  "R13","Rick Owens","Saint Laurent","Salvatore Ferragamo","Sato",
  "Seraphine","Simonetta Ravizza","Stone Island","T Henri","The Row",
  "Thom Browne","Tod's","Tom Ford","Valentino","Versace",
  "Vetements","Wardrobe NYC","Zegna",
];

// ── COLOR LIST ───────────────────────────────────────────────────────────────
const COLOR_LIST = [
  { name: "Black", hex: "#000000" },
  { name: "White", hex: "#FFFFFF" },
  { name: "Cream", hex: "#FFFDD0" },
  { name: "Ivory", hex: "#FFFFF0" },
  { name: "Beige", hex: "#F5F5DC" },
  { name: "Nude", hex: "#E3BC9A" },
  { name: "Camel", hex: "#C19A6B" },
  { name: "Tan", hex: "#D2B48C" },
  { name: "Brown", hex: "#8B4513" },
  { name: "Cognac", hex: "#9A463D" },
  { name: "Burgundy", hex: "#800020" },
  { name: "Red", hex: "#CC0000" },
  { name: "Coral", hex: "#FF7F50" },
  { name: "Orange", hex: "#FF8C00" },
  { name: "Yellow", hex: "#FFD700" },
  { name: "Gold", hex: "#D4AF37" },
  { name: "Pink", hex: "#FFC0CB" },
  { name: "Blush", hex: "#DE5D83" },
  { name: "Mauve", hex: "#E0B0FF" },
  { name: "Lavender", hex: "#E6E6FA" },
  { name: "Purple", hex: "#800080" },
  { name: "Navy", hex: "#000080" },
  { name: "Blue", hex: "#0000CD" },
  { name: "Light Blue", hex: "#ADD8E6" },
  { name: "Teal", hex: "#008080" },
  { name: "Green", hex: "#228B22" },
  { name: "Olive", hex: "#808000" },
  { name: "Khaki", hex: "#C3B091" },
  { name: "Gray", hex: "#808080" },
  { name: "Charcoal", hex: "#36454F" },
  { name: "Silver", hex: "#C0C0C0" },
  { name: "Multi", hex: null },
];

// ── EMPTY PRODUCT FORM ───────────────────────────────────────────────────────
const EMPTY_PRODUCT = {
  name: "", brand: "", section: "Womenswear", cat: "Clothing",
  color: "", price: "", sale: "", sizes: [], lead: "",
  tag: "", desc: "", images: [], mainImgIndex: 0, fit: "True to Size", oneSize: false,
};

// ── STORE INFO ───────────────────────────────────────────────────────────────
const STORE_INFO = {
  name: "Alternative — Curated Luxury",
  email: "hello@alternative.ge",
  phone: "+995 555 999 555",
  address: "Tbilisi, Georgia",
};

// ── ADMIN DASHBOARD ──────────────────────────────────────────────────────────
export default function AdminDashboard({ mobile, user, onLogout, L, lang, setLang }) {
  const [tab, setTab] = useState("orders");
  const [toasts, setToasts] = useState([]);

  // Simple toast
  const toast = useCallback((message, type = "info") => {
    const id = Date.now();
    setToasts(p => [...p, { id, message, type }]);
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 3200);
  }, []);

  // ── Data from API ──────────────────────────────────────────────────────
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  useEffect(() => {
    Promise.all([
      api.getProducts().catch(() => ({ products: [] })),
      api.getOrders().catch(() => ({ orders: [] })),
    ]).then(([pData, oData]) => {
      setProducts(pData.products || []);
      setOrders(oData.orders || []);
    });
  }, []);

  // ── Order state ──────────────────────────────────────────────────────────
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [expandedOrder, setExpandedOrder] = useState(null);

  // ── Product state ────────────────────────────────────────────────────────
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({ ...EMPTY_PRODUCT });
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [brandSearch, setBrandSearch] = useState("");
  const [brandDropdownOpen, setBrandDropdownOpen] = useState(false);
  const [colorSearch, setColorSearch] = useState("");
  const [colorDropdownOpen, setColorDropdownOpen] = useState(false);

  // ── Build order list from API data ─────────────────────────────────────
  const orderList = orders.map(o => ({
    orderId: o.orderId || "ALT-?",
    customer: o.customerName || "Customer",
    phone: o.phone || "\u2014",
    item: o.productName || o.name || "\u2014",
    status: o.status || "reserved",
    amount: o.depositPaid || o.price || 0,
    date: o.createdAt ? o.createdAt.slice(0, 10) : "\u2014",
    wantVideo: !!o.wantVideo,
    size: o.selectedSize || "\u2014",
    notes: o.notes || "",
  }));

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
    api.updateOrderStatus(orderId, newStatus)
      .then(() => setOrders(prev => prev.map(o => o.orderId === orderId ? { ...o, status: newStatus } : o)))
      .catch(() => {});
    toast(`Order ${orderId} → ${newStatus}`, "success");
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
    const isOneSize = !p.sizes || p.sizes.length === 0 || (p.sizes.length === 1 && p.sizes[0] === "One Size");
    const existingImages = p.images && p.images.length > 0 ? p.images : (p.img ? [p.img] : []);
    const mainIdx = p.img && existingImages.length > 0 ? Math.max(0, existingImages.indexOf(p.img)) : 0;
    setProductForm({
      name: p.name || "",
      brand: p.brand || "",
      section: p.section || "Womenswear",
      cat: p.cat || "Clothing",
      color: p.color || "",
      price: p.price ? String(p.price) : "",
      sale: p.sale ? String(p.sale) : "",
      sizes: isOneSize ? [] : (p.sizes || []),
      lead: p.lead || "",
      tag: p.tag || "",
      desc: p.desc || "",
      images: existingImages,
      mainImgIndex: mainIdx,
      fit: p.fit?.fit || "True to Size",
      oneSize: isOneSize,
    });
    setShowProductForm(true);
  };

  const cancelProductForm = () => {
    setShowProductForm(false);
    setEditingProduct(null);
    setProductForm({ ...EMPTY_PRODUCT });
    setBrandSearch("");
    setBrandDropdownOpen(false);
    setColorSearch("");
    setColorDropdownOpen(false);
  };

  const saveProduct = () => {
    if (!productForm.name.trim() || !String(productForm.price).trim()) {
      toast("Name and price are required", "error");
      return;
    }
    const finalSizes = productForm.oneSize ? ["One Size"] : (productForm.sizes.length > 0 ? productForm.sizes : ["One Size"]);

    const mainImg = productForm.images.length > 0 ? productForm.images[productForm.mainImgIndex] || productForm.images[0] : "";
    const productData = {
      name: productForm.name.trim(),
      brand: productForm.brand.trim(),
      section: productForm.section,
      cat: productForm.cat,
      sub: productForm.cat,
      color: productForm.color.trim(),
      price: Number(productForm.price) || 0,
      sale: productForm.sale ? Number(productForm.sale) : null,
      sizes: finalSizes,
      lead: productForm.lead.trim(),
      tag: productForm.tag,
      desc: productForm.desc.trim(),
      img: mainImg,
      images: productForm.images,
      fit: { fit: productForm.fit, notes: "" },
    };

    if (editingProduct !== null) {
      api.updateProduct(editingProduct, productData)
        .then(res => {
          setProducts(prev => prev.map(p => p.id === editingProduct ? res.product : p));
          toast("Product updated", "success");
          cancelProductForm();
        })
        .catch(err => {
          const msg = err?.details?.map(d => d.message).join(", ") || err?.message || "Failed to update product";
          toast(msg, "error");
        });
    } else {
      api.createProduct(productData)
        .then(res => {
          setProducts(prev => [...prev, res.product]);
          toast("Product added", "success");
          cancelProductForm();
        })
        .catch(err => {
          const msg = err?.details?.map(d => d.message).join(", ") || err?.message || "Failed to add product";
          toast(msg, "error");
        });
    }
  };

  // ── Compress image to max 1200px and JPEG quality 0.8 ───────────────
  const compressImage = (file) => new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const MAX = 1200;
      let w = img.width, h = img.height;
      if (w > MAX || h > MAX) {
        if (w > h) { h = Math.round(h * MAX / w); w = MAX; }
        else { w = Math.round(w * MAX / h); h = MAX; }
      }
      const canvas = document.createElement("canvas");
      canvas.width = w; canvas.height = h;
      canvas.getContext("2d").drawImage(img, 0, 0, w, h);
      resolve(canvas.toDataURL("image/jpeg", 0.8));
      URL.revokeObjectURL(url);
    };
    img.onerror = () => { URL.revokeObjectURL(url); resolve(null); };
    img.src = url;
  });

  // ── Image upload handler (multiple) ─────────────────────────────────
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    const imageFiles = files.filter(f => f.type.startsWith("image/"));
    if (imageFiles.length === 0) { toast("Please select image files", "error"); return; }
    Promise.all(imageFiles.map(file => compressImage(file))).then(results => {
      const valid = results.filter(Boolean);
      if (valid.length > 0) {
        setProductForm(f => ({ ...f, images: [...f.images, ...valid] }));
        toast(`${valid.length} photo${valid.length > 1 ? "s" : ""} added`, "success");
      }
    });
    e.target.value = "";
  };

  const addImageUrl = (url) => {
    if (!url.trim()) return;
    setProductForm(f => ({ ...f, images: [...f.images, url.trim()] }));
  };

  const removeImage = (idx) => {
    setProductForm(f => {
      const newImages = f.images.filter((_, i) => i !== idx);
      let newMain = f.mainImgIndex;
      if (idx === f.mainImgIndex) newMain = 0;
      else if (idx < f.mainImgIndex) newMain = f.mainImgIndex - 1;
      return { ...f, images: newImages, mainImgIndex: Math.min(newMain, Math.max(0, newImages.length - 1)) };
    });
  };

  const setMainImage = (idx) => {
    setProductForm(f => ({ ...f, mainImgIndex: idx }));
  };

  // ── Toggle size in array ───────────────────────────────────────────────
  const toggleSize = (sz) => {
    setProductForm(f => ({
      ...f,
      sizes: f.sizes.includes(sz) ? f.sizes.filter(s => s !== sz) : [...f.sizes, sz],
    }));
  };

  // ── Get available sizes based on section + category ─────────────────
  const getAvailableSizes = () => {
    const isKids = productForm.section === "Kidswear";
    if (productForm.cat === "Shoes") return isKids ? KIDS_SHOE_SIZES : SHOE_SIZES;
    if (productForm.cat === "Clothing") return isKids ? KIDS_CLOTHING_SIZES : CLOTHING_SIZES;
    return null; // Bags, Accessories, Watches → One Size
  };

  const deleteProduct = (id) => {
    api.deleteProduct(id)
      .then(() => {
        setProducts(prev => prev.filter(p => p.id !== id));
        toast("Product deleted", "success");
      })
      .catch(() => toast("Failed to delete product", "error"));
    setDeleteConfirmId(null);
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
    <div style={{ minHeight: "100vh", background: C.offwhite }}>

      {/* ── HEADER ──────────────────────────────────────────────────────── */}
      <div style={{ borderBottom: `1px solid ${C.lgray}`, padding: "16px 0", background: C.cream, position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ maxWidth: 1360, margin: "0 auto", padding: "0 40px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <Logo size={0.8} />
            <span style={{ width: 1, height: 18, background: C.lgray }} />
            <div style={{ padding: "5px 12px", background: C.black }}><span style={{ ...T.labelSm, color: C.white, fontSize: 8 }}>ADMIN</span></div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ display: "flex", gap: 4 }}>
              {["en","ka","ru"].map(code=>(
                <button key={code} onClick={()=>setLang(code)}
                  style={{background:"none",border:"none",...T.bodySm,color:lang===code?C.tan:C.gray,fontSize:10,cursor:"pointer",fontWeight:lang===code?500:300,padding:"4px 6px"}}>
                  {code.toUpperCase()}
                </button>
              ))}
            </div>
            <span style={{ width: 1, height: 18, background: C.lgray }} />
            <span style={{...T.bodySm, color:C.gray, fontSize:11}}>{user.name}</span>
            <HoverBtn onClick={onLogout} variant="ghost" style={{ padding: "7px 16px", fontSize: 9 }}>
              Sign Out
            </HoverBtn>
          </div>
        </div>
      </div>

      {/* Toast display */}
      {toasts.length > 0 && (
        <div style={{position:"fixed",top:70,right:20,zIndex:999,display:"flex",flexDirection:"column",gap:8}}>
          {toasts.map(t=>(
            <div key={t.id} style={{padding:"10px 18px",background:t.type==="success"?C.black:t.type==="error"?"#6b1818":C.brown,color:C.white,...T.bodySm,fontSize:12,borderRadius:2,animation:"slideRight 0.2s ease",boxShadow:"0 4px 12px rgba(0,0,0,0.15)"}}>
              {t.message}
            </div>
          ))}
        </div>
      )}

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
              <HoverBtn onClick={openAddProduct} variant="tan" style={{ padding: "8px 18px", fontSize: 14, fontWeight: "bold" }}>
                +
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
                    <label style={{ ...T.labelSm, color: C.gray, fontSize: 8, display: "block", marginBottom: 6 }}>NAME *</label>
                    <input style={inputStyle} value={productForm.name} onChange={e => setProductForm(f => ({ ...f, name: e.target.value }))} placeholder="Product name" />
                  </div>
                  {/* Brand */}
                  <div style={{ position: "relative" }}>
                    <label style={{ ...T.labelSm, color: C.gray, fontSize: 8, display: "block", marginBottom: 6 }}>BRAND</label>
                    <div style={{ display: "flex", gap: 4, flexWrap: "wrap", padding: "6px 10px", border: `1px solid ${C.lgray}`, background: C.white, minHeight: 38, alignItems: "center", cursor: "pointer" }}
                      onClick={() => setBrandDropdownOpen(!brandDropdownOpen)}>
                      {productForm.brand ? (
                        <span style={{ ...T.labelSm, fontSize: 9, background: C.tan, color: C.white, padding: "4px 10px", display: "flex", alignItems: "center", gap: 6 }}>
                          {productForm.brand}
                          <span onClick={e => { e.stopPropagation(); setProductForm(f => ({ ...f, brand: "" })); }} style={{ cursor: "pointer", fontWeight: "bold" }}>&times;</span>
                        </span>
                      ) : (
                        <span style={{ ...T.bodySm, color: C.lgray, fontSize: 11 }}>Select brand...</span>
                      )}
                    </div>
                    {brandDropdownOpen && (
                      <div style={{ position: "absolute", top: "100%", left: 0, right: 0, zIndex: 50, background: C.white, border: `1px solid ${C.lgray}`, maxHeight: 220, overflow: "auto", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
                        <input
                          autoFocus
                          style={{ ...inputStyle, border: "none", borderBottom: `1px solid ${C.lgray}`, width: "100%", margin: 0 }}
                          value={brandSearch}
                          onChange={e => setBrandSearch(e.target.value)}
                          placeholder="Type to search or add new brand..."
                          onClick={e => e.stopPropagation()}
                        />
                        {brandSearch && !BRAND_LIST.some(b => b.toLowerCase() === brandSearch.toLowerCase()) && (
                          <div onClick={e => { e.stopPropagation(); setProductForm(f => ({ ...f, brand: brandSearch.trim() })); setBrandDropdownOpen(false); setBrandSearch(""); }}
                            style={{ padding: "8px 12px", cursor: "pointer", fontSize: 11, ...T.bodySm, color: C.white, background: C.tan, display: "flex", alignItems: "center", gap: 6, borderBottom: `1px solid ${C.lgray}` }}>
                            + Add new brand: "{brandSearch.trim()}"
                          </div>
                        )}
                        {BRAND_LIST.filter(b => b.toLowerCase().includes(brandSearch.toLowerCase())).map(b => (
                          <div key={b} onClick={e => { e.stopPropagation(); setProductForm(f => ({ ...f, brand: b })); setBrandDropdownOpen(false); setBrandSearch(""); }}
                            style={{ padding: "8px 12px", cursor: "pointer", fontSize: 11, ...T.bodySm, color: productForm.brand === b ? C.tan : C.black, background: productForm.brand === b ? C.offwhite : "transparent" }}
                            onMouseEnter={e => e.currentTarget.style.background = C.offwhite}
                            onMouseLeave={e => e.currentTarget.style.background = productForm.brand === b ? C.offwhite : "transparent"}>
                            {b}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  {/* Color */}
                  <div style={{ position: "relative" }}>
                    <label style={{ ...T.labelSm, color: C.gray, fontSize: 8, display: "block", marginBottom: 6 }}>COLOR</label>
                    <div style={{ display: "flex", gap: 4, flexWrap: "wrap", padding: "6px 10px", border: `1px solid ${C.lgray}`, background: C.white, minHeight: 38, alignItems: "center", cursor: "pointer" }}
                      onClick={() => setColorDropdownOpen(!colorDropdownOpen)}>
                      {productForm.color ? (
                        <span style={{ ...T.labelSm, fontSize: 9, background: C.tan, color: C.white, padding: "4px 10px", display: "flex", alignItems: "center", gap: 6 }}>
                          {(() => { const c = COLOR_LIST.find(cl => cl.name === productForm.color); return c && c.hex ? <span style={{ width: 10, height: 10, borderRadius: "50%", background: c.hex, border: "1px solid rgba(0,0,0,0.15)", flexShrink: 0 }} /> : null; })()}
                          {productForm.color}
                          <span onClick={e => { e.stopPropagation(); setProductForm(f => ({ ...f, color: "" })); }} style={{ cursor: "pointer", fontWeight: "bold" }}>&times;</span>
                        </span>
                      ) : (
                        <span style={{ ...T.bodySm, color: C.lgray, fontSize: 11 }}>Select color...</span>
                      )}
                    </div>
                    {colorDropdownOpen && (
                      <div style={{ position: "absolute", top: "100%", left: 0, right: 0, zIndex: 50, background: C.white, border: `1px solid ${C.lgray}`, maxHeight: 200, overflow: "auto", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
                        <input
                          autoFocus
                          style={{ ...inputStyle, border: "none", borderBottom: `1px solid ${C.lgray}`, width: "100%", margin: 0 }}
                          value={colorSearch}
                          onChange={e => setColorSearch(e.target.value)}
                          placeholder="Search colors..."
                          onClick={e => e.stopPropagation()}
                        />
                        {COLOR_LIST.filter(c => c.name.toLowerCase().includes(colorSearch.toLowerCase())).map(c => (
                          <div key={c.name} onClick={e => { e.stopPropagation(); setProductForm(f => ({ ...f, color: c.name })); setColorDropdownOpen(false); setColorSearch(""); }}
                            style={{ padding: "8px 12px", cursor: "pointer", fontSize: 11, ...T.bodySm, color: productForm.color === c.name ? C.tan : C.black, background: productForm.color === c.name ? C.offwhite : "transparent", display: "flex", alignItems: "center", gap: 8 }}
                            onMouseEnter={e => e.currentTarget.style.background = C.offwhite}
                            onMouseLeave={e => e.currentTarget.style.background = productForm.color === c.name ? C.offwhite : "transparent"}>
                            {c.hex ? <span style={{ width: 14, height: 14, borderRadius: "50%", background: c.hex, border: "1px solid rgba(0,0,0,0.15)", flexShrink: 0 }} /> : <span style={{ width: 14, height: 14, borderRadius: "50%", background: "conic-gradient(red,yellow,green,cyan,blue,magenta,red)", flexShrink: 0 }} />}
                            {c.name}
                          </div>
                        ))}
                        {colorSearch && !COLOR_LIST.some(c => c.name.toLowerCase() === colorSearch.toLowerCase()) && (
                          <div onClick={e => { e.stopPropagation(); setProductForm(f => ({ ...f, color: colorSearch.trim() })); setColorDropdownOpen(false); setColorSearch(""); }}
                            style={{ padding: "8px 12px", cursor: "pointer", fontSize: 11, ...T.bodySm, color: C.tan, borderTop: `1px solid ${C.lgray}` }}>
                            + Add "{colorSearch.trim()}"
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  {/* Section */}
                  <div>
                    <label style={{ ...T.labelSm, color: C.gray, fontSize: 8, display: "block", marginBottom: 6 }}>SECTION</label>
                    <div style={{ display: "flex", gap: 4 }}>
                      {SECTIONS.map(s => (
                        <button key={s} type="button" onClick={() => setProductForm(f => ({ ...f, section: s, sizes: [] }))}
                          style={{ ...T.labelSm, fontSize: 9, padding: "8px 12px", flex: 1, border: `1px solid ${productForm.section === s ? C.tan : C.lgray}`, background: productForm.section === s ? C.tan : "transparent", color: productForm.section === s ? C.white : C.gray, cursor: "pointer", transition: "all 0.2s" }}>
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                  {/* Category */}
                  <div>
                    <label style={{ ...T.labelSm, color: C.gray, fontSize: 8, display: "block", marginBottom: 6 }}>CATEGORY</label>
                    <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                      {CATEGORIES.map(c => (
                        <button key={c} type="button" onClick={() => setProductForm(f => ({ ...f, cat: c, sizes: [], oneSize: (c !== "Clothing" && c !== "Shoes") }))}
                          style={{ ...T.labelSm, fontSize: 9, padding: "8px 10px", border: `1px solid ${productForm.cat === c ? C.tan : C.lgray}`, background: productForm.cat === c ? C.tan : "transparent", color: productForm.cat === c ? C.white : C.gray, cursor: "pointer", transition: "all 0.2s" }}>
                          {c}
                        </button>
                      ))}
                    </div>
                  </div>
                  {/* Tag */}
                  <div>
                    <label style={{ ...T.labelSm, color: C.gray, fontSize: 8, display: "block", marginBottom: 6 }}>TAG</label>
                    <div style={{ display: "flex", gap: 4 }}>
                      {TAGS.map(t => (
                        <button key={t || "none"} type="button" onClick={() => setProductForm(f => ({ ...f, tag: t }))}
                          style={{ ...T.labelSm, fontSize: 9, padding: "8px 10px", border: `1px solid ${productForm.tag === t ? (t === "Sale" ? C.red : C.tan) : C.lgray}`, background: productForm.tag === t ? (t === "Sale" ? C.red : C.tan) : "transparent", color: productForm.tag === t ? C.white : C.gray, cursor: "pointer", transition: "all 0.2s" }}>
                          {t || "None"}
                        </button>
                      ))}
                    </div>
                  </div>
                  {/* Price */}
                  <div>
                    <label style={{ ...T.labelSm, color: C.gray, fontSize: 8, display: "block", marginBottom: 6 }}>PRICE (GEL) *</label>
                    <input style={inputStyle} type="number" value={productForm.price} onChange={e => setProductForm(f => ({ ...f, price: e.target.value }))} placeholder="0" />
                  </div>
                  {/* Sale Price */}
                  <div>
                    <label style={{ ...T.labelSm, color: C.gray, fontSize: 8, display: "block", marginBottom: 6 }}>SALE PRICE (GEL)</label>
                    <input style={inputStyle} type="number" value={productForm.sale} onChange={e => setProductForm(f => ({ ...f, sale: e.target.value }))} placeholder="Leave empty if no sale" />
                  </div>
                  {/* Lead Time */}
                  <div>
                    <label style={{ ...T.labelSm, color: C.gray, fontSize: 8, display: "block", marginBottom: 6 }}>LEAD TIME</label>
                    <input style={inputStyle} value={productForm.lead} onChange={e => setProductForm(f => ({ ...f, lead: e.target.value }))} placeholder="e.g. 10–14 days" />
                  </div>
                </div>

                {/* ── SIZES ─────────────────────────────────────────────────── */}
                <div style={{ marginTop: 16 }}>
                  <label style={{ ...T.labelSm, color: C.gray, fontSize: 8, display: "block", marginBottom: 8 }}>
                    {productForm.section === "Kidswear" && productForm.cat === "Clothing" ? "SIZES (CM)" : productForm.section === "Kidswear" && productForm.cat === "Shoes" ? "SHOE SIZES (EU KIDS)" : "SIZES"}
                  </label>
                  {getAvailableSizes() ? (
                    <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                      {getAvailableSizes().map(sz => (
                        <button key={sz} type="button" onClick={() => toggleSize(sz)}
                          style={{ ...T.labelSm, fontSize: 10, padding: "8px 12px", minWidth: 40, border: `1px solid ${productForm.sizes.includes(sz) ? C.black : C.lgray}`, background: productForm.sizes.includes(sz) ? C.black : "transparent", color: productForm.sizes.includes(sz) ? C.white : C.gray, cursor: "pointer", transition: "all 0.15s" }}>
                          {sz}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <p style={{ ...T.bodySm, color: C.gray, fontSize: 12, padding: "8px 0" }}>One Size (automatic for {productForm.cat})</p>
                  )}
                </div>

                {/* ── FIT ────────────────────────────────────────────────────── */}
                {(productForm.cat === "Clothing" || productForm.cat === "Shoes") && (
                  <div style={{ marginTop: 16 }}>
                    <label style={{ ...T.labelSm, color: C.gray, fontSize: 8, display: "block", marginBottom: 8 }}>FIT</label>
                    <div style={{ display: "flex", gap: 4 }}>
                      {FIT_OPTIONS.map(f => (
                        <button key={f} type="button" onClick={() => setProductForm(prev => ({ ...prev, fit: f }))}
                          style={{ ...T.labelSm, fontSize: 9, padding: "8px 14px", border: `1px solid ${productForm.fit === f ? C.tan : C.lgray}`, background: productForm.fit === f ? C.tan : "transparent", color: productForm.fit === f ? C.white : C.gray, cursor: "pointer", transition: "all 0.2s" }}>
                          {f}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* ── IMAGES (MULTIPLE) ──────────────────────────────────────── */}
                <div style={{ marginTop: 16 }}>
                  <label style={{ ...T.labelSm, color: C.gray, fontSize: 8, display: "block", marginBottom: 8 }}>
                    PRODUCT IMAGES ({productForm.images.length} uploaded)
                  </label>

                  {/* Uploaded images grid */}
                  {productForm.images.length > 0 && (
                    <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 12 }}>
                      {productForm.images.map((src, idx) => (
                        <div key={idx} style={{ position: "relative", border: `2px solid ${idx === productForm.mainImgIndex ? C.tan : C.lgray}`, transition: "border-color 0.2s" }}>
                          <img src={src} alt={`Photo ${idx + 1}`} style={{ width: 100, height: 100, objectFit: "contain", background: "#fff", display: "block" }} onError={e => { e.target.style.display = "none"; }} />
                          {/* Main badge */}
                          {idx === productForm.mainImgIndex && (
                            <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: C.tan, padding: "2px 0", textAlign: "center" }}>
                              <span style={{ ...T.labelSm, color: C.white, fontSize: 7 }}>MAIN</span>
                            </div>
                          )}
                          {/* Set as main button */}
                          {idx !== productForm.mainImgIndex && (
                            <button type="button" onClick={() => setMainImage(idx)}
                              style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "rgba(0,0,0,0.55)", border: "none", padding: "3px 0", cursor: "pointer" }}>
                              <span style={{ ...T.labelSm, color: C.white, fontSize: 7 }}>SET MAIN</span>
                            </button>
                          )}
                          {/* Remove button */}
                          <button type="button" onClick={() => removeImage(idx)}
                            style={{ position: "absolute", top: -6, right: -6, width: 18, height: 18, borderRadius: "50%", background: C.red, border: "none", color: "#fff", fontSize: 11, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", lineHeight: 1 }}>×</button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Upload + URL row */}
                  <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
                    <label style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 16px", border: `1px dashed ${C.lgray}`, background: C.offwhite, cursor: "pointer", transition: "border-color 0.2s" }}
                      onMouseEnter={e => e.currentTarget.style.borderColor = C.tan}
                      onMouseLeave={e => e.currentTarget.style.borderColor = C.lgray}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.gray} strokeWidth="1.5"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                      <span style={{ ...T.labelSm, color: C.gray, fontSize: 9 }}>Upload Photos</span>
                      <input type="file" accept="image/*" multiple onChange={handleImageUpload} style={{ display: "none" }} />
                    </label>
                    <div style={{ display: "flex", gap: 6, flex: 1, minWidth: 200 }}>
                      <input id="urlInput" style={{ ...inputStyle, flex: 1 }} placeholder="or paste image URL and press Add" onKeyDown={e => { if (e.key === "Enter") { addImageUrl(e.target.value); e.target.value = ""; } }} />
                      <button type="button" onClick={() => { const inp = document.getElementById("urlInput"); addImageUrl(inp.value); inp.value = ""; }}
                        style={{ ...T.labelSm, fontSize: 9, padding: "8px 14px", background: C.tan, color: C.white, border: "none", cursor: "pointer" }}>Add</button>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div style={{ marginTop: 16 }}>
                  <label style={{ ...T.labelSm, color: C.gray, fontSize: 8, display: "block", marginBottom: 6 }}>DESCRIPTION</label>
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
                <HoverBtn onClick={openAddProduct} variant="tan" style={{ padding: "10px 24px", fontSize: 14, fontWeight: "bold" }}>
                  +
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
                    { label: "Privacy Policy", hash: "#/privacy" },
                    { label: "Terms of Service", hash: "#/terms" },
                    { label: "Return Policy", hash: "#/returns" },
                    { label: "Shipping Info", hash: "#/shipping" },
                  ].map(link => (
                    <a
                      key={link.hash}
                      href={`http://localhost:5173/${link.hash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        ...T.label, fontSize: 10, padding: "16px 20px",
                        background: C.offwhite, border: `1px solid ${C.lgray}`,
                        color: C.black, cursor: "pointer", textDecoration: "none",
                        textAlign: "left", transition: "all 0.2s",
                      }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = C.tan; e.currentTarget.style.color = C.tan; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = C.lgray; e.currentTarget.style.color = C.black; }}
                    >
                      {link.label}
                      <span style={{ float: "right", fontWeight: 300 }}>{"\u2192"}</span>
                    </a>
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
