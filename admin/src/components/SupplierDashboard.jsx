import { useState, useEffect, useRef } from 'react';
import { C, T } from '../constants/theme.js';
import { api } from '../api.js';
import HoverBtn from './HoverBtn.jsx';

const SECTIONS = ["Womenswear", "Menswear", "Kidswear"];
const CATEGORIES = ["Clothing", "Shoes", "Bags", "Accessories", "Watches", "Jewellery"];
const TAGS = ["", "New", "Popular", "Limited"];
const CLOTHING_SIZES = ["XXS", "XS", "S", "M", "L", "XL", "XXL", "XXXL"];
const SHOE_SIZES = ["36", "37", "38", "39", "40", "41", "42", "43", "44", "45"];

const STATUS_COLORS = {
  pending: { bg: 'rgba(201,169,110,0.15)', color: '#b19a7a' },
  approved: { bg: 'rgba(46,125,50,0.12)', color: '#2e7d32' },
  rejected: { bg: 'rgba(198,40,40,0.12)', color: '#c62828' },
  draft: { bg: 'rgba(100,100,100,0.12)', color: '#666' },
};

const ORDER_COLORS = {
  reserved: { bg: 'rgba(88,70,56,0.12)', color: '#584638' },
  sourcing: { bg: 'rgba(201,169,110,0.15)', color: '#b19a7a' },
  confirmed: { bg: 'rgba(33,150,243,0.12)', color: '#1976d2' },
  shipped: { bg: 'rgba(46,125,50,0.12)', color: '#2e7d32' },
  delivered: { bg: 'rgba(100,100,100,0.12)', color: '#666' },
  cancelled: { bg: 'rgba(198,40,40,0.12)', color: '#c62828' },
};

const EMPTY_PRODUCT = {
  name: "", brand: "", section: "Womenswear", cat: "Clothing",
  color: "", price: "", sale: "", sizes: [], lead: "10-14 days",
  tag: "", images: [], mainImgIndex: 0, oneSize: false, inStock: true,
  desc: "", itemCode: "", material: "", composition: "", dimensions: "", additionalNotes: "",
};

const inputStyle = {
  width: "100%", padding: "10px 14px", border: `1px solid ${C.lgray}`,
  fontSize: 13, color: C.black, outline: "none", fontFamily: "'TT Interphases Pro',sans-serif", background: C.white,
};

export default function SupplierDashboard({ tab, mobile, toast, L, user }) {
  const [agreementAccepted, setAgreementAccepted] = useState(null);
  const [showAgreement, setShowAgreement] = useState(false);

  useEffect(() => {
    api.getSupplierProfile()
      .then(data => setAgreementAccepted(data?.supplier?.agreementAccepted || false))
      .catch(() => setAgreementAccepted(false));
  }, []);

  if (agreementAccepted === null) {
    return <p style={{ ...T.bodySm, color: C.gray, padding: 40 }}>Loading...</p>;
  }

  if (!agreementAccepted && (tab === 'my-products' || showAgreement)) {
    return <SellerAgreement mobile={mobile} toast={toast} L={L} onAccepted={() => { setAgreementAccepted(true); setShowAgreement(false); }} />;
  }

  switch (tab) {
    case 'my-products': return <MyProducts mobile={mobile} toast={toast} L={L} />;
    case 'my-orders': return <MyOrders mobile={mobile} toast={toast} L={L} />;
    case 'earnings': return <Earnings mobile={mobile} toast={toast} L={L} />;
    default: return (
      <>
        {!agreementAccepted && <AgreementBanner onView={() => setShowAgreement(true)} L={L} />}
        <Overview mobile={mobile} toast={toast} L={L} />
      </>
    );
  }
}

// ══════════════════════════════════════════════════════════════════════════════
// AGREEMENT BANNER
// ══════════════════════════════════════════════════════════════════════════════
function AgreementBanner({ onView, L }) {
  return (
    <div style={{ background: 'rgba(201,169,110,0.12)', padding: '16px 20px', marginBottom: 24, borderLeft: `3px solid ${C.tan}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
      <div>
        <p style={{ ...T.label, fontSize: 13, color: C.black, marginBottom: 4 }}>
          {L?.agreementRequired || 'Seller Agreement Required'}
        </p>
        <p style={{ ...T.bodySm, fontSize: 12, color: C.gray }}>
          {L?.agreementRequiredDesc || 'You must accept the Seller Agreement before listing products.'}
        </p>
      </div>
      <HoverBtn onClick={onView} variant="primary" style={{ padding: '10px 20px', whiteSpace: 'nowrap' }}>
        {L?.viewAgreement || 'View Agreement'}
      </HoverBtn>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// SELLER AGREEMENT
// ══════════════════════════════════════════════════════════════════════════════
function SellerAgreement({ mobile, toast, L, onAccepted }) {
  const [confirmConditions, setConfirmConditions] = useState(false);
  const [confirmTosIp, setConfirmTosIp] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleAccept = async () => {
    if (!confirmConditions || !confirmTosIp) {
      toast?.('Please check both checkboxes', 'error');
      return;
    }
    setSubmitting(true);
    try {
      await api.acceptAgreement({ confirmConditions: true, confirmTosAndIp: true });
      toast?.('Agreement accepted successfully', 'success');
      onAccepted();
    } catch (err) {
      toast?.(err.message || 'Failed to accept agreement', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const articles = [
    {
      title: L?.art1Title || 'მუხლი 1 — პლატფორმის სტატუსი',
      body: L?.art1Body || 'ALTERNATIVE ("პლატფორმა") არის ტექნოლოგიური შუამავალი, რომელიც გამყიდველებს საშუალებას აძლევს განათავსონ პროდუქცია და მყიდველებს — შეიძინონ იგი. პლატფორმა არ არის გამყიდველი, მწარმოებელი ან სავაჭრო ბრენდის წარმომადგენელი. ALTERNATIVE მოქმედებს „ელექტრონული კომერციის შესახებ" საქართველოს კანონის (2023 წ.) მე-8 და მე-9 მუხლების შესაბამისად.',
    },
    {
      title: L?.art2Title || 'მუხლი 2 — გამყიდველთა ვალდებულებები',
      body: L?.art2Body || 'გამყიდველი ვალდებულია: ა) განათავსოს მხოლოდ ორიგინალური, ავთენტური პროდუქცია; ბ) ლუქსური ბრენდის პროდუქტის შემთხვევაში წარმოადგინოს შესყიდვის ან ავთენტურობის დამადასტურებელი დოკუმენტი; გ) დაიცვას მინიმალური ფასი ₾100 GEL; დ) პასუხი აგოს მომხმარებელთა ყველა ჩივილზე 48 საათის განმავლობაში; ე) ნებისმიერი ბრენდის სახელის, ლოგოს ან სასაქონლო ნიშნის გამოყენება მის ლისტინგში ნიშნავს, რომ გამყიდველი იღებს სრულ იურიდიულ პასუხისმგებლობას.',
    },
    {
      title: L?.art3Title || 'მუხლი 3 — პლატფორმის პასუხისმგებლობის შეზღუდვა',
      body: L?.art3Body || 'ALTERNATIVE არ აგებს პასუხს გამყიდველთა მიერ განთავსებული პროდუქციის ავთენტურობაზე, ხარისხზე ან კანონიერებაზე. პლატფორმა განთავისუფლებულია პასუხისმგებლობისგან „ელექტრონული კომერციის შესახებ" კანონის შესაბამისად, იმ პირობით, რომ: ა) პლატფორმამ არ განახორციელა ჩარევა გამყიდველის კონტენტის შინაარსში; ბ) პლატფორმამ შეტყობინებისთანავე — 48 საათის განმავლობაში — მოახდინა სათანადო რეაქცია. ALTERNATIVE-ს მაქსიმალური პასუხისმგებლობა ნებისმიერ საქმეში შეზღუდულია კონკრეტული ტრანზაქციის საფასურით.',
    },
    {
      title: L?.art4Title || 'მუხლი 4 — ანგარიშის შეჩერება',
      body: L?.art4Body || 'ALTERNATIVE-ს უფლება აქვს დაუყოვნებლივ და შეტყობინების გარეშე შეაჩეროს ან გააუქმოს ნებისმიერი გამყიდველის ანგარიში, თუ: ა) გამოვლინდა ყალბი ან არაორიგინალური პროდუქციის განთავსება; ბ) IP დარღვევის notice მიღებულ იქნა ბრენდისგან ან უფლებამოსილი მხარისგან; გ) ფასი განთავსდა ₾100-ზე ქვემოთ სისტემის გვერდის ავლით; დ) მომხმარებელთა 3 ან მეტი დადასტურებული ჩივილი ავთენტურობასთან დაკავშირებით.',
    },
    {
      title: L?.sellerRulesTitle || 'გამყიდველის წესები',
      body: L?.sellerRulesBody || 'მე ვადასტურებ: 1) ჩემ მიერ განთავსებული ყველა პროდუქტი არის ორიგინალური და ავთენტური; 2) მე ვფლობ სათანადო უფლებამოსილებას ბრენდის სახელის გამოსაყენებლად; 3) IP დარღვევის შემთხვევაში ვიღებ სრულ პასუხისმგებლობას; 4) ვეთანხმები ₾100 მინიმალურ ფასს; 5) ALTERNATIVE-ს უფლება აქვს ლისტინგი წაშალოს ან ანგარიში შეაჩეროს; 6) ვარ სრულწლოვანი და მაქვს ბიზნეს ოპერაციების სამართლებრივი უფლება.',
    },
    {
      title: L?.electronicAcceptanceTitle || 'ელექტრონული დადასტურება',
      body: L?.electronicAcceptanceBody || 'საქართველოს სამოქალაქო კოდექსის 327-ე მუხლის მიხედვით, ელექტრონული დადასტურება ("I Agree" click) სრულფასოვანი ხელშეკრულების ფორმაა. თქვენი დადასტურება ჩაიწერება: seller ID, timestamp (UTC), IP მისამართი და ხელშეკრულების ვერსია.',
    },
  ];

  return (
    <div style={{ maxWidth: 800, margin: '0 auto' }}>
      <h2 style={{ ...T.heading, color: C.black, fontSize: 20, marginBottom: 8 }}>
        {L?.sellerAgreementTitle || 'გამყიდველის ხელშეკრულება'}
      </h2>
      <p style={{ ...T.bodySm, color: C.gray, marginBottom: 24, lineHeight: 1.6 }}>
        {L?.sellerAgreementSub || 'გთხოვთ ყურადღებით წაიკითხოთ შემდეგი ხელშეკრულება. პროდუქციის განსათავსებლად მისი მიღება სავალდებულოა.'}
      </p>

      <div style={{ background: C.white, padding: mobile ? 20 : 32, marginBottom: 24, maxHeight: 500, overflowY: 'auto', border: `1px solid ${C.lgray}` }}>
        {articles.map((a, i) => (
          <div key={i} style={{ marginBottom: i < articles.length - 1 ? 24 : 0 }}>
            <h3 style={{ ...T.label, fontSize: 14, color: C.black, marginBottom: 8 }}>{a.title}</h3>
            <p style={{ ...T.bodySm, color: C.gray, lineHeight: 1.8, fontSize: 13 }}>{a.body}</p>
          </div>
        ))}
      </div>

      <div style={{ marginBottom: 20 }}>
        <label style={{ display: 'flex', alignItems: 'flex-start', gap: 10, cursor: 'pointer', marginBottom: 14 }}>
          <input type="checkbox" checked={confirmConditions} onChange={e => setConfirmConditions(e.target.checked)} style={{ marginTop: 3, flexShrink: 0 }} />
          <span style={{ ...T.bodySm, color: C.black, fontSize: 13, lineHeight: 1.5 }}>
            {L?.confirmConditions || 'ვადასტურებ ზემოაღნიშნულ ყველა პირობას'}
          </span>
        </label>
        <label style={{ display: 'flex', alignItems: 'flex-start', gap: 10, cursor: 'pointer' }}>
          <input type="checkbox" checked={confirmTosIp} onChange={e => setConfirmTosIp(e.target.checked)} style={{ marginTop: 3, flexShrink: 0 }} />
          <span style={{ ...T.bodySm, color: C.black, fontSize: 13, lineHeight: 1.5 }}>
            {L?.confirmTosIp || 'გავეცანი ALTERNATIVE-ის Terms of Service და IP Policy-ს'}
          </span>
        </label>
      </div>

      <HoverBtn onClick={handleAccept} variant="primary" style={{ padding: '14px 32px' }} disabled={submitting || !confirmConditions || !confirmTosIp}>
        {submitting ? '...' : (L?.agreeBtn || 'ვეთანხმები — I Agree')}
      </HoverBtn>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// OVERVIEW
// ══════════════════════════════════════════════════════════════════════════════
function Overview({ mobile, toast, L }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getMyStats()
      .then(data => setStats(data))
      .catch(() => toast?.('Failed to load stats', 'error'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p style={{ ...T.bodySm, color: C.gray, padding: 40 }}>Loading dashboard...</p>;
  if (!stats) return <p style={{ ...T.bodySm, color: C.gray, padding: 40 }}>Could not load dashboard</p>;

  const cards = [
    { label: L?.totalProducts || 'Total Products', value: stats.totalProducts, sub: `${stats.approvedProducts} approved, ${stats.pendingProducts} pending` },
    { label: L?.activeOrders || 'Active Orders', value: stats.activeOrders, sub: `${stats.totalOrders} total` },
    { label: L?.pendingEarnings || 'Pending Earnings', value: `GEL ${stats.pendingEarnings}`, sub: `Commission: ${100 - stats.commissionRate}% yours` },
    { label: L?.totalEarned || 'Total Earned', value: `GEL ${stats.paidEarnings}`, sub: `${stats.totalSales} sales` },
  ];

  return (
    <div>
      <h2 style={{ ...T.heading, color: C.black, fontSize: 18, marginBottom: 24 }}>{L?.supplierDashboard || 'Supplier Dashboard'}</h2>
      <div style={{ display: 'grid', gridTemplateColumns: mobile ? '1fr 1fr' : '1fr 1fr 1fr 1fr', gap: 16, marginBottom: 32 }}>
        {cards.map((c, i) => (
          <div key={i} style={{ background: C.white, padding: 20, borderLeft: `3px solid ${C.tan}` }}>
            <p style={{ ...T.labelSm, fontSize: 9, color: C.gray, marginBottom: 8 }}>{c.label}</p>
            <p style={{ ...T.heading, fontSize: 22, color: C.black }}>{c.value}</p>
            <p style={{ ...T.bodySm, fontSize: 11, color: C.muted, marginTop: 4 }}>{c.sub}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// MY PRODUCTS
// ══════════════════════════════════════════════════════════════════════════════
function MyProducts({ mobile, toast, L }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ ...EMPTY_PRODUCT });
  const [saving, setSaving] = useState(false);
  const fileRef = useRef(null);

  const loadProducts = () => {
    api.getMyProducts()
      .then(data => setProducts(data?.products || []))
      .catch(() => toast?.('Failed to load products', 'error'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadProducts(); }, []);

  const badge = (status) => {
    const s = STATUS_COLORS[status] || STATUS_COLORS.pending;
    return (
      <span style={{ ...T.labelSm, fontSize: 9, padding: '4px 10px', background: s.bg, color: s.color, letterSpacing: '0.08em' }}>
        {(status || 'pending').toUpperCase()}
      </span>
    );
  };

  const openCreate = () => {
    setEditing(null);
    setForm({ ...EMPTY_PRODUCT });
    setShowForm(true);
  };

  const openEdit = (p) => {
    setEditing(p.id);
    setForm({
      name: p.name || '', brand: p.brand || '', section: p.section || 'Womenswear', cat: p.cat || 'Clothing',
      color: p.color || '', price: p.price || '', sale: p.sale || '', sizes: p.sizes || [],
      lead: p.lead || '', tag: p.tag || '', images: p.images || [], mainImgIndex: 0,
      oneSize: (p.sizes || []).includes('One Size'), inStock: p.inStock !== false, desc: p.desc || '',
      itemCode: p.details?.itemCode || '', material: p.details?.material || '',
      composition: p.details?.composition || '', dimensions: p.details?.dimensions || '',
      additionalNotes: p.details?.additionalNotes || '',
    });
    setShowForm(true);
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files || []);
    files.forEach(file => {
      if (!file.type.startsWith('image/')) { toast?.('Only image files allowed', 'error'); return; }
      if (file.size > 500000) { toast?.('Image too large (max 500KB)', 'error'); return; }
      const reader = new FileReader();
      reader.onload = () => setForm(prev => ({ ...prev, images: [...prev.images, reader.result] }));
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (idx) => setForm(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== idx) }));

  const getSizes = () => {
    if (form.oneSize) return ['One Size'];
    return form.cat === 'Shoes' ? SHOE_SIZES : CLOTHING_SIZES;
  };

  const toggleSize = (size) => {
    setForm(prev => ({
      ...prev,
      sizes: prev.sizes.includes(size) ? prev.sizes.filter(s => s !== size) : [...prev.sizes, size],
    }));
  };

  const handleSubmit = async () => {
    if (!form.name || !form.price) { toast?.('Name and price are required', 'error'); return; }
    const priceNum = Number(form.price);
    if (!priceNum || isNaN(priceNum) || priceNum < 100) { toast?.(L?.minPriceError || 'Minimum price is 100 GEL', 'error'); return; }
    if (form.sale && Number(form.sale) < 100) { toast?.(L?.minSalePriceError || 'Minimum sale price is 100 GEL', 'error'); return; }
    if (form.sale && Number(form.sale) >= Number(form.price)) { toast?.('Sale price must be less than original price', 'error'); return; }

    const sizes = form.oneSize ? ['One Size'] : form.sizes;
    if (sizes.length === 0) { toast?.('Select at least one size', 'error'); return; }

    setSaving(true);
    const payload = {
      name: form.name, brand: form.brand, section: form.section, cat: form.cat,
      color: form.color, price: Number(form.price), sale: form.sale ? Number(form.sale) : null,
      lead: form.lead, tag: form.tag, img: form.images[form.mainImgIndex] || form.images[0] || '',
      images: form.images, sizes, inStock: form.inStock, desc: form.desc,
      details: {
        itemCode: form.itemCode, material: form.material,
        composition: form.composition, dimensions: form.dimensions,
        additionalNotes: form.additionalNotes,
      },
    };

    try {
      if (editing) {
        await api.updateMyProduct(editing, payload);
        toast?.('Product updated. Pending admin review.', 'success');
      } else {
        await api.createMyProduct(payload);
        toast?.('Product submitted for review', 'success');
      }
      setShowForm(false);
      setEditing(null);
      loadProducts();
    } catch (err) {
      toast?.(err.message || 'Failed to save product', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await api.deleteMyProduct(id);
      setProducts(prev => prev.filter(p => p.id !== id));
      toast?.('Product deleted', 'success');
    } catch {
      toast?.('Failed to delete', 'error');
    }
  };

  if (loading) return <p style={{ ...T.bodySm, color: C.gray, padding: 40 }}>Loading products...</p>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <h2 style={{ ...T.heading, color: C.black, fontSize: 18 }}>{L?.myProducts || 'My Products'} ({products.length})</h2>
        <HoverBtn onClick={openCreate} variant="primary" style={{ padding: '10px 24px' }}>+ Add Product</HoverBtn>
      </div>

      {/* Product form */}
      {showForm && (
        <div style={{ background: C.white, padding: mobile ? 20 : 32, marginBottom: 24, borderLeft: `3px solid ${C.tan}` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <h3 style={{ ...T.label, fontSize: 14, color: C.black }}>{editing ? 'Edit Product' : 'New Product'}</h3>
            <button onClick={() => setShowForm(false)} style={{ background: 'none', border: 'none', color: C.gray, cursor: 'pointer', fontSize: 18 }}>×</button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: mobile ? '1fr' : '1fr 1fr', gap: 16, marginBottom: 16 }}>
            <div>
              <label style={{ ...T.labelSm, fontSize: 9, color: C.gray, display: 'block', marginBottom: 6 }}>NAME *</label>
              <input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} style={inputStyle} />
            </div>
            <div>
              <label style={{ ...T.labelSm, fontSize: 9, color: C.gray, display: 'block', marginBottom: 6 }}>BRAND</label>
              <input value={form.brand} onChange={e => setForm(p => ({ ...p, brand: e.target.value }))} style={inputStyle} />
            </div>
            <div>
              <label style={{ ...T.labelSm, fontSize: 9, color: C.gray, display: 'block', marginBottom: 6 }}>SECTION</label>
              <select value={form.section} onChange={e => setForm(p => ({ ...p, section: e.target.value }))} style={inputStyle}>
                {SECTIONS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label style={{ ...T.labelSm, fontSize: 9, color: C.gray, display: 'block', marginBottom: 6 }}>CATEGORY</label>
              <select value={form.cat} onChange={e => setForm(p => ({ ...p, cat: e.target.value }))} style={inputStyle}>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label style={{ ...T.labelSm, fontSize: 9, color: C.gray, display: 'block', marginBottom: 6 }}>PRICE (GEL) * <span style={{ fontSize: 9, color: C.muted, fontWeight: 400 }}>min 100</span></label>
              <input type="number" min="100" value={form.price} onChange={e => setForm(p => ({ ...p, price: e.target.value }))} style={inputStyle} />
            </div>
            <div>
              <label style={{ ...T.labelSm, fontSize: 9, color: C.gray, display: 'block', marginBottom: 6 }}>SALE PRICE (GEL) <span style={{ fontSize: 9, color: C.muted, fontWeight: 400 }}>min 100</span></label>
              <input type="number" min="100" value={form.sale} onChange={e => setForm(p => ({ ...p, sale: e.target.value }))} style={inputStyle} />
            </div>
            <div>
              <label style={{ ...T.labelSm, fontSize: 9, color: C.gray, display: 'block', marginBottom: 6 }}>COLOR</label>
              <input value={form.color} onChange={e => setForm(p => ({ ...p, color: e.target.value }))} style={inputStyle} />
            </div>
            <div>
              <label style={{ ...T.labelSm, fontSize: 9, color: C.gray, display: 'block', marginBottom: 6 }}>LEAD TIME</label>
              <input value={form.lead} onChange={e => setForm(p => ({ ...p, lead: e.target.value }))} style={inputStyle} placeholder="e.g. 10-14 days" />
            </div>
            <div>
              <label style={{ ...T.labelSm, fontSize: 9, color: C.gray, display: 'block', marginBottom: 6 }}>TAG</label>
              <select value={form.tag} onChange={e => setForm(p => ({ ...p, tag: e.target.value }))} style={inputStyle}>
                {TAGS.map(t => <option key={t} value={t}>{t || '— None —'}</option>)}
              </select>
            </div>
          </div>

          {/* Description */}
          <div style={{ marginBottom: 16 }}>
            <label style={{ ...T.labelSm, fontSize: 9, color: C.gray, display: 'block', marginBottom: 6 }}>DESCRIPTION</label>
            <textarea value={form.desc} onChange={e => setForm(p => ({ ...p, desc: e.target.value }))}
              style={{ ...inputStyle, minHeight: 80, resize: 'vertical' }} />
          </div>

          {/* Details */}
          <div style={{ display: 'grid', gridTemplateColumns: mobile ? '1fr' : '1fr 1fr', gap: 16, marginBottom: 16 }}>
            <div>
              <label style={{ ...T.labelSm, fontSize: 9, color: C.gray, display: 'block', marginBottom: 6 }}>MATERIAL</label>
              <input value={form.material} onChange={e => setForm(p => ({ ...p, material: e.target.value }))} style={inputStyle} />
            </div>
            <div>
              <label style={{ ...T.labelSm, fontSize: 9, color: C.gray, display: 'block', marginBottom: 6 }}>COMPOSITION</label>
              <input value={form.composition} onChange={e => setForm(p => ({ ...p, composition: e.target.value }))} style={inputStyle} />
            </div>
          </div>

          {/* Sizes */}
          <div style={{ marginBottom: 16 }}>
            <label style={{ ...T.labelSm, fontSize: 9, color: C.gray, display: 'block', marginBottom: 6 }}>SIZES</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', fontSize: 13, color: C.gray }}>
                <input type="checkbox" checked={form.oneSize} onChange={e => setForm(p => ({ ...p, oneSize: e.target.checked, sizes: e.target.checked ? ['One Size'] : [] }))} />
                One Size
              </label>
            </div>
            {!form.oneSize && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {getSizes().map(s => (
                  <button key={s} onClick={() => toggleSize(s)}
                    style={{
                      padding: '6px 14px', border: `1px solid ${form.sizes.includes(s) ? C.tan : C.lgray}`,
                      background: form.sizes.includes(s) ? C.tan : 'transparent', color: form.sizes.includes(s) ? C.white : C.gray,
                      cursor: 'pointer', fontSize: 12, fontFamily: "'TT Interphases Pro',sans-serif",
                    }}>
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Images */}
          <div style={{ marginBottom: 20 }}>
            <label style={{ ...T.labelSm, fontSize: 9, color: C.gray, display: 'block', marginBottom: 6 }}>IMAGES</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 10 }}>
              {form.images.map((img, i) => (
                <div key={i} style={{ position: 'relative', width: 70, height: 70 }}>
                  <img src={img} alt="" style={{ width: 70, height: 70, objectFit: 'cover', border: `2px solid ${i === form.mainImgIndex ? C.tan : C.lgray}` }}
                    onClick={() => setForm(p => ({ ...p, mainImgIndex: i }))} />
                  <button onClick={() => removeImage(i)}
                    style={{ position: 'absolute', top: -6, right: -6, width: 18, height: 18, borderRadius: '50%', background: C.red, color: C.white, border: 'none', cursor: 'pointer', fontSize: 11, lineHeight: '16px' }}>×</button>
                </div>
              ))}
              <button onClick={() => fileRef.current?.click()}
                style={{ width: 70, height: 70, border: `1px dashed ${C.lgray}`, background: 'transparent', cursor: 'pointer', color: C.gray, fontSize: 24 }}>+</button>
            </div>
            <input ref={fileRef} type="file" accept="image/*" multiple onChange={handleImageUpload} style={{ display: 'none' }} />
            <p style={{ ...T.bodySm, fontSize: 10, color: C.muted }}>Max 500KB per image. Click image to set as main.</p>
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
            <HoverBtn onClick={handleSubmit} variant="primary" style={{ padding: '12px 32px' }} disabled={saving}>
              {saving ? 'Saving...' : editing ? 'Update & Submit for Review' : 'Submit for Review'}
            </HoverBtn>
            <HoverBtn onClick={() => setShowForm(false)} variant="secondary" style={{ padding: '12px 24px' }}>Cancel</HoverBtn>
          </div>
        </div>
      )}

      {/* Product list */}
      {products.length === 0 ? (
        <p style={{ ...T.bodySm, color: C.gray, padding: '40px 0', textAlign: 'center' }}>No products yet. Click "Add Product" to create your first listing.</p>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, fontFamily: "'TT Interphases Pro',sans-serif" }}>
            <thead>
              <tr style={{ borderBottom: `2px solid ${C.lgray}` }}>
                {['', 'Name', 'Category', 'Price', 'Status', 'Actions'].map(h => (
                  <th key={h} style={{ textAlign: h === 'Actions' ? 'right' : 'left', padding: '10px 12px', ...T.labelSm, fontSize: 9, color: C.gray }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {products.map(p => (
                <tr key={p.id} style={{ borderBottom: `1px solid ${C.lgray}` }}>
                  <td style={{ padding: '8px 12px', width: 50 }}>
                    {(p.img || (p.images && p.images[0])) ? (
                      <img src={p.img || p.images[0]} alt="" style={{ width: 40, height: 40, objectFit: 'cover' }} />
                    ) : (
                      <div style={{ width: 40, height: 40, background: C.cream, display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.tan, fontSize: 16, fontWeight: 600 }}>
                        {(p.brand || p.name || '?')[0]}
                      </div>
                    )}
                  </td>
                  <td style={{ padding: '12px', color: C.black, fontWeight: 500 }}>
                    <div>{p.name}</div>
                    {p.brand && <div style={{ fontSize: 11, color: C.gray }}>{p.brand}</div>}
                  </td>
                  <td style={{ padding: '12px', color: C.gray, fontSize: 12 }}>{p.section} / {p.cat}</td>
                  <td style={{ padding: '12px', color: C.black, fontWeight: 500 }}>
                    {p.sale ? <><span style={{ textDecoration: 'line-through', color: C.muted, fontSize: 11 }}>GEL {p.price}</span> GEL {p.sale}</> : `GEL ${p.price}`}
                  </td>
                  <td style={{ padding: '12px' }}>{badge(p.productStatus || 'pending')}</td>
                  <td style={{ padding: '12px', textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                      <button onClick={() => openEdit(p)}
                        style={{ ...T.labelSm, fontSize: 9, padding: '6px 12px', background: C.offwhite, color: C.black, border: 'none', cursor: 'pointer' }}>
                        EDIT
                      </button>
                      <button onClick={() => handleDelete(p.id)}
                        style={{ ...T.labelSm, fontSize: 9, padding: '6px 12px', background: 'rgba(198,40,40,0.08)', color: '#c62828', border: 'none', cursor: 'pointer' }}>
                        DELETE
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// MY ORDERS
// ══════════════════════════════════════════════════════════════════════════════
function MyOrders({ mobile, toast, L }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getMyOrders()
      .then(data => setOrders(data?.orders || []))
      .catch(() => toast?.('Failed to load orders', 'error'))
      .finally(() => setLoading(false));
  }, []);

  const badge = (status) => {
    const s = ORDER_COLORS[status] || ORDER_COLORS.reserved;
    return (
      <span style={{ ...T.labelSm, fontSize: 9, padding: '4px 10px', background: s.bg, color: s.color, letterSpacing: '0.08em' }}>
        {(status || 'reserved').toUpperCase()}
      </span>
    );
  };

  if (loading) return <p style={{ ...T.bodySm, color: C.gray, padding: 40 }}>Loading orders...</p>;

  return (
    <div>
      <h2 style={{ ...T.heading, color: C.black, fontSize: 18, marginBottom: 24 }}>{L?.myOrders || 'My Orders'} ({orders.length})</h2>

      {orders.length === 0 ? (
        <p style={{ ...T.bodySm, color: C.gray, padding: '40px 0', textAlign: 'center' }}>No orders yet for your products.</p>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, fontFamily: "'TT Interphases Pro',sans-serif" }}>
            <thead>
              <tr style={{ borderBottom: `2px solid ${C.lgray}` }}>
                {['Order ID', 'Product', 'Customer', 'Size', 'Price', 'Status', 'Date'].map(h => (
                  <th key={h} style={{ textAlign: 'left', padding: '10px 12px', ...T.labelSm, fontSize: 9, color: C.gray }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {orders.map(o => (
                <tr key={o.orderId} style={{ borderBottom: `1px solid ${C.lgray}` }}>
                  <td style={{ padding: '12px', color: C.tan, fontWeight: 600, fontSize: 12 }}>{o.orderId}</td>
                  <td style={{ padding: '12px', color: C.black, fontWeight: 500 }}>{o.productName}</td>
                  <td style={{ padding: '12px', color: C.gray, fontSize: 12 }}>{o.customerName}</td>
                  <td style={{ padding: '12px', color: C.gray }}>{o.selectedSize}</td>
                  <td style={{ padding: '12px', color: C.black, fontWeight: 500 }}>GEL {o.price}</td>
                  <td style={{ padding: '12px' }}>{badge(o.status)}</td>
                  <td style={{ padding: '12px', color: C.gray, fontSize: 12 }}>{new Date(o.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// EARNINGS
// ══════════════════════════════════════════════════════════════════════════════
function Earnings({ mobile, toast, L }) {
  const [stats, setStats] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.getMyStats().catch(() => null),
      api.getSupplierProfile().catch(() => null),
    ]).then(([s, p]) => {
      setStats(s);
      setProfile(p?.supplier);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return <p style={{ ...T.bodySm, color: C.gray, padding: 40 }}>Loading earnings...</p>;
  if (!stats) return <p style={{ ...T.bodySm, color: C.gray, padding: 40 }}>Could not load earnings data</p>;

  return (
    <div>
      <h2 style={{ ...T.heading, color: C.black, fontSize: 18, marginBottom: 24 }}>{L?.earnings || 'Earnings'}</h2>

      <div style={{ display: 'grid', gridTemplateColumns: mobile ? '1fr' : '1fr 1fr 1fr', gap: 20, marginBottom: 32 }}>
        <div style={{ background: C.white, padding: 28, borderLeft: `3px solid ${C.tan}` }}>
          <p style={{ ...T.labelSm, fontSize: 9, color: C.gray, marginBottom: 8 }}>PENDING EARNINGS</p>
          <p style={{ ...T.heading, fontSize: 28, color: C.tan }}>GEL {stats.pendingEarnings}</p>
          <p style={{ ...T.bodySm, fontSize: 11, color: C.muted, marginTop: 6 }}>Awaiting payout</p>
        </div>
        <div style={{ background: C.white, padding: 28, borderLeft: `3px solid ${C.green}` }}>
          <p style={{ ...T.labelSm, fontSize: 9, color: C.gray, marginBottom: 8 }}>TOTAL PAID</p>
          <p style={{ ...T.heading, fontSize: 28, color: C.green }}>GEL {stats.paidEarnings}</p>
          <p style={{ ...T.bodySm, fontSize: 11, color: C.muted, marginTop: 6 }}>{stats.totalSales} total sales</p>
        </div>
        <div style={{ background: C.white, padding: 28, borderLeft: `3px solid ${C.black}` }}>
          <p style={{ ...T.labelSm, fontSize: 9, color: C.gray, marginBottom: 8 }}>YOUR SHARE</p>
          <p style={{ ...T.heading, fontSize: 28, color: C.black }}>{100 - stats.commissionRate}%</p>
          <p style={{ ...T.bodySm, fontSize: 11, color: C.muted, marginTop: 6 }}>Alternative keeps {stats.commissionRate}%</p>
        </div>
      </div>

      <div style={{ background: C.white, padding: 24 }}>
        <h3 style={{ ...T.label, fontSize: 13, color: C.black, marginBottom: 16 }}>How Payouts Work</h3>
        <div style={{ ...T.bodySm, color: C.gray, lineHeight: 1.8, fontSize: 13 }}>
          <p>• Earnings are accumulated from completed orders for your products</p>
          <p>• Alternative retains {stats.commissionRate}% platform commission</p>
          <p>• You receive {100 - stats.commissionRate}% of the product price</p>
          <p>• Payouts are processed by the Alternative team</p>
          <p>• Contact us if you have questions about your earnings</p>
        </div>
      </div>
    </div>
  );
}
