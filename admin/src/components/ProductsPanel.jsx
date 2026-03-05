import { useState, useRef } from 'react';
import { C, T } from '../constants/theme.js';
import HoverBtn from './HoverBtn.jsx';
import { api } from '../api.js';

// ── Icons ──────────────────────────────────────────────────────────────────────
const IconCheck = ({ size = 16, color = C.tan }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5"><path d="M20 6L9 17l-5-5" /></svg>
);
const IconCross = ({ size = 16, color = C.gray }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5"><path d="M18 6L6 18M6 6l12 12" /></svg>
);

// ── Constants ──────────────────────────────────────────────────────────────────
const SECTIONS = ["Womenswear", "Menswear", "Kidswear"];
const CATEGORIES = ["Clothing", "Shoes", "Bags", "Accessories", "Watches", "Jewellery"];
const TAGS = ["", "New", "Sale", "Popular", "Limited"];
const CLOTHING_SIZES = ["XXS", "XS", "S", "M", "L", "XL", "XXL", "XXXL"];
const SHOE_SIZES = ["36", "37", "38", "39", "40", "41", "42", "43", "44", "45"];
const KIDS_CLOTHING_SIZES = ["80", "86", "92", "98", "104", "110", "116", "122", "128", "134", "140", "146", "152", "158", "164"];
const KIDS_SHOE_SIZES = ["20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30", "31", "32", "33", "34", "35"];
const FIT_OPTIONS = ["True to Size", "Runs Small", "Runs Large"];

const BRAND_LIST = [
  "Acne Studios","Ahlem","Alaïa","Alessandra Rich","Alexander McQueen",
  "Alexander Wang","AMI Paris","Amina Muaddi","Balenciaga","Baziszt",
  "Bernadette","Blumarine","Bottega Veneta","Brioni","Brunello Cucinelli",
  "Burberry","Cartier","Celine","Cesare Attolini","Chanel","Chloé",
  "Chrome Hearts","Christian Louboutin","Diesel","Dior","District Vision","Dita",
  "Dolce & Gabbana","Dries Van Noten","Dsquared2","Fendi","Ferragamo",
  "Givenchy","Golden Goose","Goyard","Gucci","Hermès",
  "Jacquemus","Jimmy Choo","Khaite","Kiton","Kuboraum",
  "Lardini","LBM","Loewe","Loro Piana","Louis Vuitton","Magda Butrym",
  "Maison Margiela","Manzoni 24","Max Mara","Miu Miu","Moncler",
  "Moschino","Off-White","Palm Angels","Phoebe Philo","Prada",
  "R13","Rick Owens","Rimowa","Rolex","Saint Laurent","Sato",
  "Seraphine","Simonetta Ravizza","Stone Island","T Henri","The Row",
  "Thom Browne","Tod's","Tom Ford","Valentino","Versace",
  "Vetements","Vivienne Westwood","Wardrobe NYC","Yohji Yamamoto","Zegna",
];

const COLOR_LIST = [
  { name: "Black", hex: "#000000" }, { name: "White", hex: "#FFFFFF" },
  { name: "Cream", hex: "#FFFDD0" }, { name: "Ivory", hex: "#FFFFF0" },
  { name: "Beige", hex: "#F5F5DC" }, { name: "Nude", hex: "#E3BC9A" },
  { name: "Camel", hex: "#C19A6B" }, { name: "Tan", hex: "#D2B48C" },
  { name: "Brown", hex: "#8B4513" }, { name: "Cognac", hex: "#9A463D" },
  { name: "Burgundy", hex: "#800020" }, { name: "Red", hex: "#CC0000" },
  { name: "Coral", hex: "#FF7F50" }, { name: "Orange", hex: "#FF8C00" },
  { name: "Yellow", hex: "#FFD700" }, { name: "Gold", hex: "#D4AF37" },
  { name: "Pink", hex: "#FFC0CB" }, { name: "Blush", hex: "#DE5D83" },
  { name: "Mauve", hex: "#E0B0FF" }, { name: "Lavender", hex: "#E6E6FA" },
  { name: "Purple", hex: "#800080" }, { name: "Navy", hex: "#000080" },
  { name: "Blue", hex: "#0000CD" }, { name: "Light Blue", hex: "#ADD8E6" },
  { name: "Teal", hex: "#008080" }, { name: "Green", hex: "#228B22" },
  { name: "Olive", hex: "#808000" }, { name: "Khaki", hex: "#C3B091" },
  { name: "Gray", hex: "#808080" }, { name: "Charcoal", hex: "#36454F" },
  { name: "Silver", hex: "#C0C0C0" }, { name: "Multi", hex: null },
];

const EMPTY_PRODUCT = {
  name: "", brand: "", section: "Womenswear", cat: "Clothing",
  color: "", price: "", sale: "", discountPercent: "", sizes: [], lead: "",
  tag: "", images: [], mainImgIndex: 0, fit: "True to Size", oneSize: false,
  inStock: true,
  // Template description fields
  itemCode: "", material: "", composition: "", dimensions: "", additionalNotes: "",
};

const DISCOUNT_PRESETS = [10, 15, 20, 25, 30, 40, 50];

// ── Product thumbnail with fallback placeholder ──────────────────────────────
function ProductThumb({ img, images, name, brand }) {
  const src = img || (images && images.length > 0 ? images[0] : null);
  const initial = (brand || name || "?").charAt(0).toUpperCase();
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div style={{
        width: 36, height: 36, borderRadius: 4,
        background: `linear-gradient(135deg, ${C.tan}, ${C.brown || "#8B4513"})`,
        display: "flex", alignItems: "center", justifyContent: "center",
        color: C.white, fontSize: 14, fontWeight: 600,
        fontFamily: "'Georgia', serif", letterSpacing: 0.5,
        flexShrink: 0,
      }}>
        {initial}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={name || "Product"}
      onError={() => setFailed(true)}
      style={{
        width: 36, height: 36, borderRadius: 4,
        objectFit: "cover", flexShrink: 0,
        border: `1px solid ${C.lgray}`,
      }}
    />
  );
}

export default function ProductsPanel({ products, setProducts, mobile, toast, L }) {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ ...EMPTY_PRODUCT });
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [brandSearch, setBrandSearch] = useState("");
  const [brandOpen, setBrandOpen] = useState(false);
  const [colorSearch, setColorSearch] = useState("");
  const [colorOpen, setColorOpen] = useState(false);
  const formRef = useRef(null);

  const inputStyle = { ...T.bodySm, width: "100%", padding: "10px 14px", border: `1px solid ${C.lgray}`, background: C.offwhite, color: C.black, outline: "none", fontSize: 13 };

  // ── Open / Close ────────────────────────────────────────────────────────────
  const openAdd = () => {
    setEditingId(null); setForm({ ...EMPTY_PRODUCT }); setShowForm(true);
    setTimeout(() => formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
  };
  const openEdit = (p) => {
    setEditingId(p.id);
    const isOneSize = !p.sizes || p.sizes.length === 0 || (p.sizes.length === 1 && p.sizes[0] === "One Size");
    const imgs = p.images?.length > 0 ? p.images : (p.img ? [p.img] : []);
    const mainIdx = p.img && imgs.length > 0 ? Math.max(0, imgs.indexOf(p.img)) : 0;
    // Calculate discount percent from price/sale
    let dp = "";
    if (p.price && p.sale && p.price > p.sale) {
      dp = String(Math.round((1 - p.sale / p.price) * 100));
    }
    setForm({
      name: p.name || "", brand: p.brand || "", section: p.section || "Womenswear", cat: p.cat || "Clothing",
      color: p.color || "", price: p.price ? String(p.price) : "", sale: p.sale ? String(p.sale) : "", discountPercent: dp,
      sizes: isOneSize ? [] : (p.sizes || []), lead: p.lead || "", tag: p.tag || "",
      images: imgs, mainImgIndex: mainIdx, fit: p.fit?.fit || "True to Size", oneSize: isOneSize,
      inStock: p.inStock !== false,
      // Template fields
      itemCode: p.details?.itemCode || "", material: p.details?.material || "",
      composition: p.details?.composition || "", dimensions: p.details?.dimensions || "",
      additionalNotes: p.details?.additionalNotes || "",
    });
    setShowForm(true);
    setTimeout(() => formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
  };
  const cancel = () => {
    setShowForm(false); setEditingId(null); setForm({ ...EMPTY_PRODUCT });
    setBrandSearch(""); setBrandOpen(false); setColorSearch(""); setColorOpen(false);
  };

  // ── Discount % ↔ Sale Price auto-sync ──────────────────────────────────────
  const setDiscount = (pct) => {
    if (pct === "") { setForm(f => ({ ...f, discountPercent: "", sale: "" })); return; }
    const price = Number(form.price);
    if (!price || isNaN(pct) || pct < 0 || pct > 99) {
      setForm(f => ({ ...f, discountPercent: String(pct), sale: "" }));
      return;
    }
    const salePrice = Math.round(price * (1 - Number(pct) / 100));
    setForm(f => ({ ...f, discountPercent: String(pct), sale: String(salePrice) }));
  };

  const setSalePrice = (val) => {
    const price = Number(form.price);
    const sale = Number(val);
    if (!val || !price || sale >= price) {
      setForm(f => ({ ...f, sale: val, discountPercent: "" }));
      return;
    }
    const dp = Math.round((1 - sale / price) * 100);
    setForm(f => ({ ...f, sale: val, discountPercent: String(dp) }));
  };

  const onPriceChange = (val) => {
    setForm(f => {
      const newF = { ...f, price: val };
      // Recalculate sale if discount is set
      if (f.discountPercent && Number(val) > 0) {
        newF.sale = String(Math.round(Number(val) * (1 - Number(f.discountPercent) / 100)));
      }
      return newF;
    });
  };

  // ── Save ────────────────────────────────────────────────────────────────────
  const save = () => {
    if (!form.name.trim() || !String(form.price).trim()) { toast("Name and price are required", "error"); return; }
    const finalSizes = form.oneSize ? ["One Size"] : (form.sizes.length > 0 ? form.sizes : ["One Size"]);
    const mainImg = form.images.length > 0 ? form.images[form.mainImgIndex] || form.images[0] : "";

    // Build description from template
    const descParts = [];
    if (form.material) descParts.push(form.material);
    if (form.composition) descParts.push(form.composition);
    if (form.dimensions) descParts.push(`Dimensions: ${form.dimensions}`);
    if (form.additionalNotes) descParts.push(form.additionalNotes);

    const productData = {
      name: form.name.trim(), brand: form.brand.trim(), section: form.section,
      cat: form.cat, sub: form.cat, color: form.color.trim(),
      price: Number(form.price) || 0,
      sale: form.sale ? Number(form.sale) : null,
      sizes: finalSizes, lead: form.lead.trim(), tag: form.tag,
      desc: descParts.join(". ") || "",
      img: mainImg, images: form.images,
      fit: { fit: form.fit, notes: "" },
      inStock: form.inStock,
      details: {
        itemCode: form.itemCode.trim(),
        material: form.material.trim(),
        composition: form.composition.trim(),
        dimensions: form.dimensions.trim(),
        additionalNotes: form.additionalNotes.trim(),
      },
    };

    if (editingId !== null) {
      api.updateProduct(editingId, productData)
        .then(res => { setProducts(prev => prev.map(p => p.id === editingId ? res.product : p)); toast("Product updated", "success"); cancel(); })
        .catch(err => toast(err?.details?.map(d => d.message).join(", ") || err?.message || "Failed to update", "error"));
    } else {
      api.createProduct(productData)
        .then(res => { setProducts(prev => [...prev, res.product]); toast("Product added", "success"); cancel(); })
        .catch(err => toast(err?.details?.map(d => d.message).join(", ") || err?.message || "Failed to add", "error"));
    }
  };

  // ── Image handling ──────────────────────────────────────────────────────────
  const compressImage = (file) => new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const MAX = 1200; let w = img.width, h = img.height;
      if (w > MAX || h > MAX) { if (w > h) { h = Math.round(h * MAX / w); w = MAX; } else { w = Math.round(w * MAX / h); h = MAX; } }
      const canvas = document.createElement("canvas"); canvas.width = w; canvas.height = h;
      canvas.getContext("2d").drawImage(img, 0, 0, w, h);
      resolve(canvas.toDataURL("image/jpeg", 0.8)); URL.revokeObjectURL(url);
    };
    img.onerror = () => { URL.revokeObjectURL(url); resolve(null); };
    img.src = url;
  });

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files || []).filter(f => f.type.startsWith("image/"));
    if (!files.length) { toast("Please select image files", "error"); return; }
    Promise.all(files.map(compressImage)).then(results => {
      const valid = results.filter(Boolean);
      if (valid.length > 0) { setForm(f => ({ ...f, images: [...f.images, ...valid] })); toast(`${valid.length} photo${valid.length > 1 ? "s" : ""} added`, "success"); }
    });
    e.target.value = "";
  };
  const addImageUrl = (url) => { if (url.trim()) setForm(f => ({ ...f, images: [...f.images, url.trim()] })); };
  const removeImage = (idx) => {
    setForm(f => {
      const newImgs = f.images.filter((_, i) => i !== idx);
      let nm = f.mainImgIndex;
      if (idx === f.mainImgIndex) nm = 0; else if (idx < f.mainImgIndex) nm = f.mainImgIndex - 1;
      return { ...f, images: newImgs, mainImgIndex: Math.min(nm, Math.max(0, newImgs.length - 1)) };
    });
  };

  const toggleSize = (sz) => { setForm(f => ({ ...f, sizes: f.sizes.includes(sz) ? f.sizes.filter(s => s !== sz) : [...f.sizes, sz] })); };
  const getAvailableSizes = () => {
    const isKids = form.section === "Kidswear";
    if (form.cat === "Shoes") return isKids ? KIDS_SHOE_SIZES : SHOE_SIZES;
    if (form.cat === "Clothing") return isKids ? KIDS_CLOTHING_SIZES : CLOTHING_SIZES;
    return null;
  };

  const deleteProduct = (id) => {
    api.deleteProduct(id)
      .then(() => { setProducts(prev => prev.filter(p => p.id !== id)); toast("Product deleted", "success"); })
      .catch(() => toast("Failed to delete product", "error"));
    setDeleteConfirmId(null);
  };

  return (
    <div style={{ background: C.cream, marginBottom: 40, animation: "fadeUp 0.3s ease" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 20px", borderBottom: `1px solid ${C.lgray}` }}>
        <p style={{ ...T.label, color: C.black, fontSize: 12 }}>{L?.adminProductCatalog||"Product Catalog"} ({products.length} {L?.adminItems||"items"})</p>
        <HoverBtn onClick={openAdd} variant="tan" style={{ padding: "8px 18px", fontSize: 14, fontWeight: "bold" }}>+</HoverBtn>
      </div>

      {/* ── Form ───────────────────────────────────────────────────────────────── */}
      {showForm && (
        <div ref={formRef} style={{ padding: 20, borderBottom: `1px solid ${C.lgray}`, background: C.offwhite, animation: "slideDown 0.2s ease" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <p style={{ ...T.label, color: C.black, fontSize: 11 }}>{editingId ? (L?.adminEditProduct||"Edit Product") : (L?.adminAddProduct||"Add Product")}</p>
            <button onClick={cancel} style={{ background: "none", border: "none", cursor: "pointer", padding: 4, lineHeight: 0 }}><IconCross size={16} /></button>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr" : "1fr 1fr 1fr", gap: 16 }}>
            {/* Name */}
            <div>
              <label style={{ ...T.labelSm, color: C.gray, display: "block", marginBottom: 6 }}>{L?.adminName||"NAME"} *</label>
              <input style={inputStyle} value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder={L?.adminProductName||"Product name"} />
            </div>
            {/* Brand */}
            <div style={{ position: "relative" }}>
              <label style={{ ...T.labelSm, color: C.gray, display: "block", marginBottom: 6 }}>{L?.adminBrand||"BRAND"}</label>
              <div style={{ display: "flex", gap: 4, flexWrap: "wrap", padding: "6px 10px", border: `1px solid ${C.lgray}`, background: C.white, minHeight: 38, alignItems: "center", cursor: "pointer" }}
                onClick={() => setBrandOpen(!brandOpen)}>
                {form.brand ? (
                  <span style={{ ...T.labelSm, fontSize: 9, background: C.tan, color: C.white, padding: "4px 10px", display: "flex", alignItems: "center", gap: 6 }}>
                    {form.brand}
                    <span onClick={e => { e.stopPropagation(); setForm(f => ({ ...f, brand: "" })); }} style={{ cursor: "pointer", fontWeight: "bold" }}>&times;</span>
                  </span>
                ) : <span style={{ ...T.bodySm, color: C.lgray, fontSize: 11 }}>{L?.adminSelectBrand||"Select brand..."}</span>}
              </div>
              {brandOpen && (
                <div style={{ position: "absolute", top: "100%", left: 0, right: 0, zIndex: 50, background: C.white, border: `1px solid ${C.lgray}`, maxHeight: 220, overflow: "auto", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
                  <input autoFocus style={{ ...inputStyle, border: "none", borderBottom: `1px solid ${C.lgray}`, width: "100%", margin: 0 }} value={brandSearch} onChange={e => setBrandSearch(e.target.value)} placeholder="Type to search or add new brand..." onClick={e => e.stopPropagation()} />
                  {brandSearch && !BRAND_LIST.some(b => b.toLowerCase() === brandSearch.toLowerCase()) && (
                    <div onClick={e => { e.stopPropagation(); setForm(f => ({ ...f, brand: brandSearch.trim() })); setBrandOpen(false); setBrandSearch(""); }}
                      style={{ padding: "8px 12px", cursor: "pointer", fontSize: 11, ...T.bodySm, color: C.white, background: C.tan }}>
                      + Add: "{brandSearch.trim()}"
                    </div>
                  )}
                  {BRAND_LIST.filter(b => b.toLowerCase().includes(brandSearch.toLowerCase())).map(b => (
                    <div key={b} onClick={e => { e.stopPropagation(); setForm(f => ({ ...f, brand: b })); setBrandOpen(false); setBrandSearch(""); }}
                      style={{ padding: "8px 12px", cursor: "pointer", fontSize: 11, ...T.bodySm, color: form.brand === b ? C.tan : C.black, background: form.brand === b ? C.offwhite : "transparent" }}
                      onMouseEnter={e => e.currentTarget.style.background = C.offwhite}
                      onMouseLeave={e => e.currentTarget.style.background = form.brand === b ? C.offwhite : "transparent"}>
                      {b}
                    </div>
                  ))}
                </div>
              )}
            </div>
            {/* Color */}
            <div style={{ position: "relative" }}>
              <label style={{ ...T.labelSm, color: C.gray, display: "block", marginBottom: 6 }}>{L?.adminColor||"COLOR"}</label>
              <div style={{ display: "flex", gap: 4, flexWrap: "wrap", padding: "6px 10px", border: `1px solid ${C.lgray}`, background: C.white, minHeight: 38, alignItems: "center", cursor: "pointer" }}
                onClick={() => setColorOpen(!colorOpen)}>
                {form.color ? (
                  <span style={{ ...T.labelSm, fontSize: 9, background: C.tan, color: C.white, padding: "4px 10px", display: "flex", alignItems: "center", gap: 6 }}>
                    {(() => { const c = COLOR_LIST.find(cl => cl.name === form.color); return c?.hex ? <span style={{ width: 10, height: 10, borderRadius: "50%", background: c.hex, border: "1px solid rgba(0,0,0,0.15)" }} /> : null; })()}
                    {form.color}
                    <span onClick={e => { e.stopPropagation(); setForm(f => ({ ...f, color: "" })); }} style={{ cursor: "pointer", fontWeight: "bold" }}>&times;</span>
                  </span>
                ) : <span style={{ ...T.bodySm, color: C.lgray, fontSize: 11 }}>{L?.adminSelectColor||"Select color..."}</span>}
              </div>
              {colorOpen && (
                <div style={{ position: "absolute", top: "100%", left: 0, right: 0, zIndex: 50, background: C.white, border: `1px solid ${C.lgray}`, maxHeight: 200, overflow: "auto", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
                  <input autoFocus style={{ ...inputStyle, border: "none", borderBottom: `1px solid ${C.lgray}`, width: "100%", margin: 0 }} value={colorSearch} onChange={e => setColorSearch(e.target.value)} placeholder="Search colors..." onClick={e => e.stopPropagation()} />
                  {COLOR_LIST.filter(c => c.name.toLowerCase().includes(colorSearch.toLowerCase())).map(c => (
                    <div key={c.name} onClick={e => { e.stopPropagation(); setForm(f => ({ ...f, color: c.name })); setColorOpen(false); setColorSearch(""); }}
                      style={{ padding: "8px 12px", cursor: "pointer", fontSize: 11, ...T.bodySm, color: form.color === c.name ? C.tan : C.black, display: "flex", alignItems: "center", gap: 8 }}
                      onMouseEnter={e => e.currentTarget.style.background = C.offwhite}
                      onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                      {c.hex ? <span style={{ width: 14, height: 14, borderRadius: "50%", background: c.hex, border: "1px solid rgba(0,0,0,0.15)" }} /> : <span style={{ width: 14, height: 14, borderRadius: "50%", background: "conic-gradient(red,yellow,green,cyan,blue,magenta,red)" }} />}
                      {c.name}
                    </div>
                  ))}
                  {colorSearch && !COLOR_LIST.some(c => c.name.toLowerCase() === colorSearch.toLowerCase()) && (
                    <div onClick={e => { e.stopPropagation(); setForm(f => ({ ...f, color: colorSearch.trim() })); setColorOpen(false); setColorSearch(""); }}
                      style={{ padding: "8px 12px", cursor: "pointer", fontSize: 11, ...T.bodySm, color: C.tan, borderTop: `1px solid ${C.lgray}` }}>
                      + Add "{colorSearch.trim()}"
                    </div>
                  )}
                </div>
              )}
            </div>
            {/* Section */}
            <div>
              <label style={{ ...T.labelSm, color: C.gray, display: "block", marginBottom: 6 }}>{L?.adminSection||"SECTION"}</label>
              <div style={{ display: "flex", gap: 4 }}>
                {SECTIONS.map(s => (
                  <button key={s} type="button" onClick={() => setForm(f => ({ ...f, section: s, sizes: [] }))}
                    style={{ ...T.labelSm, fontSize: 11, padding: "8px 12px", flex: 1, border: `1px solid ${form.section === s ? C.tan : C.lgray}`, background: form.section === s ? C.tan : "transparent", color: form.section === s ? C.white : C.gray, cursor: "pointer", transition: "all 0.2s" }}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
            {/* Category */}
            <div>
              <label style={{ ...T.labelSm, color: C.gray, display: "block", marginBottom: 6 }}>{L?.adminCategory||"CATEGORY"}</label>
              <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                {CATEGORIES.map(c => (
                  <button key={c} type="button" onClick={() => setForm(f => ({ ...f, cat: c, sizes: [], oneSize: (c !== "Clothing" && c !== "Shoes") }))}
                    style={{ ...T.labelSm, fontSize: 11, padding: "8px 10px", border: `1px solid ${form.cat === c ? C.tan : C.lgray}`, background: form.cat === c ? C.tan : "transparent", color: form.cat === c ? C.white : C.gray, cursor: "pointer", transition: "all 0.2s" }}>
                    {c}
                  </button>
                ))}
              </div>
            </div>
            {/* Tag */}
            <div>
              <label style={{ ...T.labelSm, color: C.gray, display: "block", marginBottom: 6 }}>{L?.adminTag||"TAG"}</label>
              <div style={{ display: "flex", gap: 4 }}>
                {TAGS.map(t => (
                  <button key={t || "none"} type="button" onClick={() => setForm(f => ({ ...f, tag: t }))}
                    style={{ ...T.labelSm, fontSize: 11, padding: "8px 10px", border: `1px solid ${form.tag === t ? (t === "Sale" ? C.red : C.tan) : C.lgray}`, background: form.tag === t ? (t === "Sale" ? C.red : C.tan) : "transparent", color: form.tag === t ? C.white : C.gray, cursor: "pointer", transition: "all 0.2s" }}>
                    {t || "None"}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* ── STOCK STATUS ────────────────────────────────────────────────────── */}
          <div style={{ marginTop: 16, display: "flex", alignItems: "center", gap: 12 }}>
            <label style={{ ...T.labelSm, color: C.gray, fontSize: 8 }}>{L?.adminStockStatus||"STOCK STATUS"}</label>
            <button type="button" onClick={() => setForm(f => ({ ...f, inStock: !f.inStock }))}
              style={{
                display: "flex", alignItems: "center", gap: 8, padding: "8px 16px",
                border: `1px solid ${form.inStock ? C.tan : C.red}`,
                background: form.inStock ? "rgba(177,154,122,0.08)" : "rgba(88,70,56,0.08)",
                cursor: "pointer", transition: "all 0.2s",
              }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: form.inStock ? C.tan : C.red }} />
              <span style={{ ...T.labelSm, fontSize: 10, color: form.inStock ? C.tan : C.red }}>
                {form.inStock ? (L?.adminInStock||"In Stock") : (L?.adminOutOfStock||"Out of Stock")}
              </span>
            </button>
          </div>

          {/* ── PRICING + DISCOUNT ─────────────────────────────────────────────── */}
          <div style={{ marginTop: 20, padding: 16, background: C.white, border: `1px solid ${C.lgray}` }}>
            <p style={{ ...T.label, color: C.black, fontSize: 10, marginBottom: 14 }}>{L?.adminPricingDiscount||"PRICING & DISCOUNT"}</p>
            <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr" : "1fr 1fr 1fr", gap: 16 }}>
              {/* Price */}
              <div>
                <label style={{ ...T.labelSm, color: C.gray, display: "block", marginBottom: 6 }}>{L?.adminOriginalPrice||"ORIGINAL PRICE (GEL)"} *</label>
                <input style={inputStyle} type="number" value={form.price} onChange={e => onPriceChange(e.target.value)} placeholder="0" />
              </div>
              {/* Discount % */}
              <div>
                <label style={{ ...T.labelSm, color: C.gray, display: "block", marginBottom: 6 }}>{L?.adminDiscountPercent||"DISCOUNT %"}</label>
                <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                  <input style={{ ...inputStyle, width: 80, flex: "none" }} type="number" min="0" max="99"
                    value={form.discountPercent} onChange={e => setDiscount(e.target.value)} placeholder="0" />
                  <span style={{ ...T.bodySm, color: C.gray, fontSize: 12 }}>%</span>
                </div>
                {/* Preset buttons */}
                <div style={{ display: "flex", gap: 4, marginTop: 8, flexWrap: "wrap" }}>
                  {DISCOUNT_PRESETS.map(p => (
                    <button key={p} type="button" onClick={() => setDiscount(p)}
                      style={{
                        ...T.labelSm, fontSize: 8, padding: "4px 8px",
                        border: `1px solid ${Number(form.discountPercent) === p ? C.red : C.lgray}`,
                        background: Number(form.discountPercent) === p ? C.red : "transparent",
                        color: Number(form.discountPercent) === p ? C.white : C.gray,
                        cursor: "pointer", transition: "all 0.15s",
                      }}>
                      {p}%
                    </button>
                  ))}
                  {form.discountPercent && (
                    <button type="button" onClick={() => setDiscount("")}
                      style={{ ...T.labelSm, fontSize: 8, padding: "4px 8px", border: `1px solid ${C.lgray}`, background: "transparent", color: C.gray, cursor: "pointer" }}>
                      {L?.adminClear||"Clear"}
                    </button>
                  )}
                </div>
              </div>
              {/* Sale Price (auto-calculated) */}
              <div>
                <label style={{ ...T.labelSm, color: C.gray, display: "block", marginBottom: 6 }}>{L?.adminSalePrice||"SALE PRICE (GEL)"}</label>
                <input style={{ ...inputStyle, color: form.sale ? C.red : C.black, fontWeight: form.sale ? 500 : 300 }} type="number"
                  value={form.sale} onChange={e => setSalePrice(e.target.value)} placeholder="Auto-calculated from discount" />
                {form.price && form.sale && (
                  <p style={{ ...T.bodySm, color: C.red, fontSize: 11, marginTop: 4 }}>
                    Save GEL {Number(form.price) - Number(form.sale)} ({form.discountPercent}% off)
                  </p>
                )}
              </div>
            </div>
            {/* Lead Time */}
            <div style={{ marginTop: 12 }}>
              <label style={{ ...T.labelSm, color: C.gray, display: "block", marginBottom: 6 }}>{L?.adminLeadTime||"LEAD TIME"}</label>
              <input style={{ ...inputStyle, maxWidth: 300 }} value={form.lead} onChange={e => setForm(f => ({ ...f, lead: e.target.value }))} placeholder={L?.adminLeadTimePlaceholder||"e.g. 10–14 days"} />
            </div>
          </div>

          {/* ── SIZES ──────────────────────────────────────────────────────────── */}
          <div style={{ marginTop: 16 }}>
            <label style={{ ...T.labelSm, color: C.gray, fontSize: 8, display: "block", marginBottom: 8 }}>{L?.adminSizes||"SIZES"}</label>
            {getAvailableSizes() ? (
              <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                {getAvailableSizes().map(sz => (
                  <button key={sz} type="button" onClick={() => toggleSize(sz)}
                    style={{ ...T.labelSm, fontSize: 10, padding: "8px 12px", minWidth: 40, border: `1px solid ${form.sizes.includes(sz) ? C.black : C.lgray}`, background: form.sizes.includes(sz) ? C.black : "transparent", color: form.sizes.includes(sz) ? C.white : C.gray, cursor: "pointer", transition: "all 0.15s" }}>
                    {sz}
                  </button>
                ))}
              </div>
            ) : (
              <p style={{ ...T.bodySm, color: C.gray, fontSize: 12, padding: "8px 0" }}>{L?.adminOneSize||"One Size"} ({L?.adminAutomaticFor||"automatic for"} {form.cat})</p>
            )}
          </div>

          {/* ── FIT ────────────────────────────────────────────────────────────── */}
          {(form.cat === "Clothing" || form.cat === "Shoes") && (
            <div style={{ marginTop: 16 }}>
              <label style={{ ...T.labelSm, color: C.gray, fontSize: 8, display: "block", marginBottom: 8 }}>{L?.adminFit||"FIT"}</label>
              <div style={{ display: "flex", gap: 4 }}>
                {FIT_OPTIONS.map(f => (
                  <button key={f} type="button" onClick={() => setForm(prev => ({ ...prev, fit: f }))}
                    style={{ ...T.labelSm, fontSize: 11, padding: "8px 14px", border: `1px solid ${form.fit === f ? C.tan : C.lgray}`, background: form.fit === f ? C.tan : "transparent", color: form.fit === f ? C.white : C.gray, cursor: "pointer", transition: "all 0.2s" }}>
                    {f}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ── IMAGES ─────────────────────────────────────────────────────────── */}
          <div style={{ marginTop: 16 }}>
            <label style={{ ...T.labelSm, color: C.gray, fontSize: 8, display: "block", marginBottom: 8 }}>{L?.adminProductImages||"PRODUCT IMAGES"} ({form.images.length} {L?.adminUploaded||"uploaded"})</label>
            {form.images.length > 0 && (
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 12 }}>
                {form.images.map((src, idx) => (
                  <div key={idx} style={{ position: "relative", border: `2px solid ${idx === form.mainImgIndex ? C.tan : C.lgray}` }}>
                    <img src={src} alt="" loading="lazy" width="100" height="100" style={{ width: 100, height: 100, objectFit: "contain", background: "#fff" }} onError={e => { e.target.style.display = "none"; }} />
                    {idx === form.mainImgIndex && <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: C.tan, padding: "2px 0", textAlign: "center" }}><span style={{ ...T.labelSm, color: C.white, fontSize: 7 }}>MAIN</span></div>}
                    {idx !== form.mainImgIndex && <button type="button" onClick={() => setForm(f => ({ ...f, mainImgIndex: idx }))} style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "rgba(0,0,0,0.55)", border: "none", padding: "3px 0", cursor: "pointer" }}><span style={{ ...T.labelSm, color: C.white, fontSize: 7 }}>SET MAIN</span></button>}
                    <button type="button" onClick={() => removeImage(idx)} style={{ position: "absolute", top: -6, right: -6, width: 18, height: 18, borderRadius: "50%", background: C.red, border: "none", color: "#fff", fontSize: 11, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>×</button>
                  </div>
                ))}
              </div>
            )}
            <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
              <label style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 16px", border: `1px dashed ${C.lgray}`, background: C.offwhite, cursor: "pointer" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.gray} strokeWidth="1.5"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>
                <span style={{ ...T.labelSm, color: C.gray, fontSize: 9 }}>{L?.adminUploadPhotos||"Upload Photos"}</span>
                <input type="file" accept="image/*" multiple onChange={handleImageUpload} style={{ display: "none" }} />
              </label>
              <div style={{ display: "flex", gap: 6, flex: 1, minWidth: 200 }}>
                <input id="urlInput" style={{ ...inputStyle, flex: 1 }} placeholder="or paste image URL and press Add" onKeyDown={e => { if (e.key === "Enter") { addImageUrl(e.target.value); e.target.value = ""; } }} />
                <button type="button" onClick={() => { const inp = document.getElementById("urlInput"); addImageUrl(inp.value); inp.value = ""; }}
                  style={{ ...T.labelSm, fontSize: 11, padding: "8px 14px", background: C.tan, color: C.white, border: "none", cursor: "pointer" }}>Add</button>
              </div>
            </div>
          </div>

          {/* ── TEMPLATE DESCRIPTION ───────────────────────────────────────────── */}
          <div style={{ marginTop: 20, padding: 16, background: C.white, border: `1px solid ${C.lgray}` }}>
            <p style={{ ...T.label, color: C.black, fontSize: 10, marginBottom: 14 }}>{L?.adminProductDetails||"PRODUCT DETAILS"}</p>
            <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr" : "1fr 1fr", gap: 14 }}>
              <div>
                <label style={{ ...T.labelSm, color: C.gray, display: "block", marginBottom: 6 }}>{L?.adminProductCode||"PRODUCT CODE / SKU"}</label>
                <input style={inputStyle} value={form.itemCode} onChange={e => setForm(f => ({ ...f, itemCode: e.target.value }))} placeholder="e.g. BV-ARCO-001" />
              </div>
              <div>
                <label style={{ ...T.labelSm, color: C.gray, display: "block", marginBottom: 6 }}>{L?.adminMaterial||"MATERIAL"}</label>
                <input style={inputStyle} value={form.material} onChange={e => setForm(f => ({ ...f, material: e.target.value }))} placeholder="e.g. 100% Lambskin Leather" />
              </div>
              <div>
                <label style={{ ...T.labelSm, color: C.gray, display: "block", marginBottom: 6 }}>{L?.adminComposition||"COMPOSITION"}</label>
                <input style={inputStyle} value={form.composition} onChange={e => setForm(f => ({ ...f, composition: e.target.value }))} placeholder="e.g. Exterior: Lambskin. Lining: Suede" />
              </div>
              <div>
                <label style={{ ...T.labelSm, color: C.gray, display: "block", marginBottom: 6 }}>{L?.adminDimensions||"DIMENSIONS"}</label>
                <input style={inputStyle} value={form.dimensions} onChange={e => setForm(f => ({ ...f, dimensions: e.target.value }))} placeholder="e.g. 34×25×12cm" />
              </div>
              <div style={{ gridColumn: mobile ? "1" : "1 / -1" }}>
                <label style={{ ...T.labelSm, color: C.gray, display: "block", marginBottom: 6 }}>{L?.adminAdditionalNotes||"ADDITIONAL NOTES"}</label>
                <textarea style={{ ...inputStyle, minHeight: 56, resize: "vertical" }} value={form.additionalNotes} onChange={e => setForm(f => ({ ...f, additionalNotes: e.target.value }))} placeholder="Any additional info about the product..." />
              </div>
            </div>
          </div>

          {/* Save / Cancel */}
          <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
            <HoverBtn onClick={save} variant="tan" style={{ padding: "10px 28px", fontSize: 9 }}>
              <IconCheck size={12} color={C.white} /> {L?.adminSaveProduct||"Save Product"}
            </HoverBtn>
            <HoverBtn onClick={cancel} variant="ghost" style={{ padding: "10px 20px", fontSize: 9 }}>{L?.adminCancel||"Cancel"}</HoverBtn>
          </div>
        </div>
      )}

      {/* ── Product Table ───────────────────────────────────────────────────── */}
      {products.length === 0 ? (
        <div style={{ padding: "48px 20px", textAlign: "center" }}>
          <p style={{ ...T.bodySm, color: C.gray, marginBottom: 16 }}>{L?.adminNoProducts||"No products yet"}</p>
          <HoverBtn onClick={openAdd} variant="tan" style={{ padding: "10px 24px", fontSize: 14, fontWeight: "bold" }}>+</HoverBtn>
        </div>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 800 }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${C.lgray}`, background: C.offwhite }}>
                {["", L?.adminName||"Name", L?.adminBrand||"Brand", L?.adminSection||"Section", L?.adminCategory||"Category", L?.adminPrice||"Price", L?.adminSale||"Sale", L?.adminDiscount||"Discount", L?.adminSizes||"Sizes", L?.adminTag||"Tag", L?.adminStock||"Stock", L?.adminActions||"Actions"].map(h => (
                  <th key={h} style={{ ...T.labelSm, color: C.gray, fontSize: 10, padding: "12px 14px", textAlign: "left", fontWeight: 600 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {products.map(p => {
                const discPct = p.price && p.sale ? Math.round((1 - p.sale / p.price) * 100) : null;
                return (
                  <tr key={p.id} style={{ borderBottom: `1px solid ${C.lgray}`, transition: "background 0.15s" }}
                    onMouseEnter={e => e.currentTarget.style.background = C.offwhite}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                    <td style={{ padding: "8px 12px" }}>
                      <ProductThumb img={p.img} images={p.images} name={p.name} brand={p.brand} />
                    </td>
                    <td style={{ ...T.bodySm, color: C.black, padding: "8px 12px", maxWidth: 160, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.name}</td>
                    <td style={{ ...T.bodySm, color: C.gray, padding: "8px 12px", fontSize: 12 }}>{p.brand || "—"}</td>
                    <td style={{ ...T.labelSm, color: C.tan, padding: "8px 12px", fontSize: 10 }}>{p.section}</td>
                    <td style={{ ...T.bodySm, color: C.gray, padding: "8px 12px" }}>{p.cat}</td>
                    <td style={{ ...T.bodySm, color: C.black, padding: "8px 12px" }}>GEL {p.price}</td>
                    <td style={{ ...T.bodySm, color: p.sale ? C.red : C.lgray, padding: "8px 12px" }}>{p.sale ? `GEL ${p.sale}` : "—"}</td>
                    <td style={{ padding: "8px 12px" }}>
                      {discPct ? <span style={{ ...T.labelSm, fontSize: 10, padding: "3px 8px", background: C.red, color: C.white }}>-{discPct}%</span> : <span style={{ color: C.lgray }}>—</span>}
                    </td>
                    <td style={{ ...T.bodySm, color: C.gray, padding: "8px 12px", fontSize: 11 }}>{(p.sizes || []).join(", ")}</td>
                    <td style={{ padding: "8px 12px" }}>
                      {p.tag && <span style={{ ...T.labelSm, fontSize: 9, padding: "3px 8px", background: p.tag === "Sale" ? C.red : p.tag === "New" ? C.black : p.tag === "Limited" ? "#1a5c8b" : C.tan, color: C.white }}>{p.tag}</span>}
                    </td>
                    <td style={{ padding: "8px 12px" }}>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                        <span style={{ width: 6, height: 6, borderRadius: "50%", background: p.inStock !== false ? C.tan : C.red }} />
                        <span style={{ ...T.labelSm, fontSize: 9, color: p.inStock !== false ? C.tan : C.red }}>{p.inStock !== false ? "In" : "Out"}</span>
                      </span>
                    </td>
                    <td style={{ padding: "8px 12px" }}>
                      <div style={{ display: "flex", gap: 6 }}>
                        <HoverBtn onClick={() => openEdit(p)} variant="ghost" style={{ padding: "5px 12px", fontSize: 10 }}>{L?.adminEdit||"Edit"}</HoverBtn>
                        {deleteConfirmId === p.id ? (
                          <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
                            <span style={{ ...T.labelSm, color: C.red, fontSize: 10, marginRight: 4 }}>{L?.adminSure||"Sure?"}</span>
                            <button onClick={() => deleteProduct(p.id)} style={{ background: "none", border: "none", cursor: "pointer", padding: 2, lineHeight: 0 }}><IconCheck size={14} color={C.green} /></button>
                            <button onClick={() => setDeleteConfirmId(null)} style={{ background: "none", border: "none", cursor: "pointer", padding: 2, lineHeight: 0 }}><IconCross size={14} color={C.red} /></button>
                          </div>
                        ) : (
                          <HoverBtn onClick={() => setDeleteConfirmId(p.id)} variant="danger" style={{ padding: "5px 12px", fontSize: 10 }}>{L?.adminDelete||"Delete"}</HoverBtn>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
