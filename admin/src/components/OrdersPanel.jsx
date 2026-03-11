import { useState, Fragment, useRef, useEffect } from 'react';
import { C, T } from '../constants/theme.js';
import { VIDEO_VERIFICATION_GEL } from '../constants/config.js';
import HoverBtn from './HoverBtn.jsx';
import { api } from '../api.js';
import { csvSafe } from '../utils/csv.js';

const ORDER_STATUSES_BASE = [
  { key: "reserved", label: "Reserved", color: C.brown },
  { key: "sourcing", label: "Sourcing", color: "#8b6914" },
  { key: "confirmed", label: "Confirmed", color: "#1a5c8b" },
  { key: "shipped", label: "Shipped", color: C.green },
  { key: "delivered", label: "Delivered", color: C.gray },
  { key: "cancelled", label: "Cancelled", color: "#c62828" },
];

const STATUS_COLOR = Object.fromEntries(ORDER_STATUSES_BASE.map(s => [s.key, s.color]));

const IconCheck = ({ size = 16, color = C.tan, stroke = 1.5 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={stroke}><path d="M20 6L9 17l-5-5" /></svg>
);
const IconCross = ({ size = 16, color = C.gray, stroke = 1.5 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={stroke}><path d="M18 6L6 18M6 6l12 12" /></svg>
);
const IconCamera = ({ size = 16, color = C.tan }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.5}><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/><circle cx="12" cy="13" r="4"/></svg>
);
const IconPlay = ({ size = 16, color = C.tan }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.5}><polygon points="5 3 19 12 5 21 5 3"/></svg>
);
const IconSend = ({ size = 16, color = "#fff" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.5}><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
);

// ── Send Media Modal ────────────────────────────────────────────────────────
function SendMediaModal({ orderId, orderItem, onClose, toast, L }) {
  const [images, setImages] = useState([]); // { data: base64, name: string }
  const [videoUrl, setVideoUrl] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [sentMessages, setSentMessages] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const fileRef = useRef(null);

  useEffect(() => {
    api.getMessages(orderId)
      .then(data => setSentMessages(data.messages || []))
      .catch(() => {})
      .finally(() => setLoadingHistory(false));
  }, [orderId]);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || []);
    files.forEach(file => {
      if (!file.type.startsWith('image/')) return;
      if (file.size > 5 * 1024 * 1024) { toast?.('Image too large (max 5MB)', 'error'); return; }
      const reader = new FileReader();
      reader.onload = () => setImages(prev => [...prev, { data: reader.result, name: file.name }]);
      reader.readAsDataURL(file);
    });
    if (fileRef.current) fileRef.current.value = '';
  };

  const removeImage = (idx) => setImages(prev => prev.filter((_, i) => i !== idx));

  const handleSend = async () => {
    const media = [];
    images.forEach(img => media.push({ type: 'image', data: img.data, name: img.name }));
    if (videoUrl.trim()) media.push({ type: 'video', url: videoUrl.trim(), name: 'Video' });

    if (media.length === 0) { toast?.('Add at least one photo or video link', 'error'); return; }

    setSending(true);
    try {
      const msg = await api.sendMessage(orderId, message, media);
      toast?.('Media sent successfully! Customer will be notified.', 'success');
      setSentMessages(prev => [...prev, msg]);
      setImages([]);
      setVideoUrl('');
      setMessage('');
    } catch (err) {
      toast?.(err.message || 'Failed to send media', 'error');
    } finally {
      setSending(false);
    }
  };

  const overlayStyle = {
    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 9999,
    display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
  };
  const modalStyle = {
    background: C.cream, maxWidth: 580, width: '100%', maxHeight: '90vh', overflowY: 'auto',
    boxShadow: '0 20px 60px rgba(0,0,0,0.2)', position: 'relative',
  };
  const inputStyle = {
    ...T.bodySm, width: '100%', padding: '10px 14px', border: `1px solid ${C.lgray}`,
    background: C.offwhite, color: C.black, outline: 'none', fontSize: 13, boxSizing: 'border-box',
  };

  return (
    <div style={overlayStyle} onClick={onClose}>
      <div style={modalStyle} onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div style={{ padding: '20px 24px', borderBottom: `1px solid ${C.lgray}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <p style={{ ...T.label, color: C.black, fontSize: 13, margin: 0 }}>{L?.adminSendMedia || "Send Media"}</p>
            <p style={{ ...T.bodySm, color: C.gray, fontSize: 11, margin: '2px 0 0' }}>{orderId} — {orderItem}</p>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, lineHeight: 0 }}>
            <IconCross size={18} color={C.gray} />
          </button>
        </div>

        {/* Upload Section */}
        <div style={{ padding: '20px 24px' }}>
          {/* Photos */}
          <div style={{ marginBottom: 20 }}>
            <p style={{ ...T.labelSm, color: C.gray, fontSize: 10, marginBottom: 8 }}>
              <IconCamera size={13} color={C.tan} /> {L?.adminPhotos || "PHOTOS"}
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 10 }}>
              {images.map((img, i) => (
                <div key={i} style={{ position: 'relative', width: 80, height: 80 }}>
                  <img src={img.data} alt={img.name} style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 2, border: `1px solid ${C.lgray}` }} />
                  <button onClick={() => removeImage(i)}
                    style={{ position: 'absolute', top: -6, right: -6, width: 20, height: 20, borderRadius: '50%', background: C.black, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0, lineHeight: 0 }}>
                    <IconCross size={10} color="#fff" />
                  </button>
                </div>
              ))}
              <button onClick={() => fileRef.current?.click()}
                style={{ width: 80, height: 80, border: `2px dashed ${C.lgray}`, background: 'transparent', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4, borderRadius: 2 }}>
                <span style={{ fontSize: 20, color: C.tan, lineHeight: 1 }}>+</span>
                <span style={{ ...T.labelSm, fontSize: 8, color: C.gray }}>ADD</span>
              </button>
            </div>
            <input ref={fileRef} type="file" accept="image/*" multiple onChange={handleFileChange} style={{ display: 'none' }} />
          </div>

          {/* Video URL */}
          <div style={{ marginBottom: 20 }}>
            <p style={{ ...T.labelSm, color: C.gray, fontSize: 10, marginBottom: 8 }}>
              <IconPlay size={13} color={C.tan} /> {L?.adminVideoLink || "VIDEO LINK"} <span style={{ fontWeight: 400, color: C.lgray }}>(YouTube, Google Drive, etc.)</span>
            </p>
            <input type="url" placeholder="https://..." value={videoUrl} onChange={e => setVideoUrl(e.target.value)}
              style={inputStyle} />
          </div>

          {/* Message */}
          <div style={{ marginBottom: 24 }}>
            <p style={{ ...T.labelSm, color: C.gray, fontSize: 10, marginBottom: 8 }}>{L?.adminMessage || "MESSAGE"} <span style={{ fontWeight: 400, color: C.lgray }}>(optional)</span></p>
            <textarea value={message} onChange={e => setMessage(e.target.value)} rows={3} placeholder={L?.adminMediaMessagePlaceholder || "e.g. Here are the verification photos for your order..."}
              style={{ ...inputStyle, resize: 'vertical', fontFamily: 'inherit' }} />
          </div>

          {/* Send Button */}
          <HoverBtn onClick={handleSend} disabled={sending} style={{ width: '100%', padding: '14px 24px', fontSize: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, opacity: sending ? 0.6 : 1 }}>
            <IconSend size={14} /> {sending ? (L?.adminSending || "Sending...") : (L?.adminSendToCustomer || "Send to Customer")}
          </HoverBtn>
          <p style={{ ...T.bodySm, color: C.lgray, fontSize: 10, textAlign: 'center', marginTop: 8 }}>
            {L?.adminMediaEmailNote || "Customer will also receive an email notification."}
          </p>
        </div>

        {/* Sent History */}
        {sentMessages.length > 0 && (
          <div style={{ borderTop: `1px solid ${C.lgray}`, padding: '16px 24px' }}>
            <p style={{ ...T.labelSm, color: C.gray, fontSize: 10, marginBottom: 12 }}>{L?.adminSentHistory || "SENT HISTORY"}</p>
            {sentMessages.map((msg, i) => (
              <div key={msg.id || i} style={{ marginBottom: 12, padding: '12px 14px', background: C.offwhite, borderRadius: 2 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ ...T.labelSm, fontSize: 9, color: C.tan }}>
                    {(msg.media || []).filter(m => m.type === 'image').length} photo(s), {(msg.media || []).filter(m => m.type === 'video').length} video(s)
                  </span>
                  <span style={{ ...T.labelSm, fontSize: 9, color: C.lgray }}>
                    {msg.createdAt ? new Date(msg.createdAt).toLocaleString() : ''}
                  </span>
                </div>
                {msg.content && <p style={{ ...T.bodySm, fontSize: 12, color: C.black, margin: 0 }}>{msg.content}</p>}
                <div style={{ display: 'flex', gap: 6, marginTop: 6, flexWrap: 'wrap' }}>
                  {(msg.media || []).filter(m => m.type === 'image').map((m, j) => (
                    <img key={j} src={m.data} alt="" style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 2, border: `1px solid ${C.lgray}` }} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
        {loadingHistory && (
          <div style={{ padding: '16px 24px', textAlign: 'center' }}>
            <p style={{ ...T.bodySm, color: C.lgray, fontSize: 11 }}>Loading history...</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Main Orders Panel ───────────────────────────────────────────────────────
export default function OrdersPanel({ orders, setOrders, products, mobile, toast, L, refreshData }) {
  const productMap = Object.fromEntries((products || []).map(p => [p.id, p]));
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [mediaModal, setMediaModal] = useState(null); // { orderId, item }

  const ORDER_STATUSES = ORDER_STATUSES_BASE.map(s => ({
    ...s,
    label: L?.[`adminStatus_${s.key}`] || s.label,
  }));

  const orderList = orders.map(o => {
    const prod = productMap[Number(o.productId)] || productMap[String(o.productId)];
    const img = o.img || prod?.img || "";
    return {
      orderId: o.orderId || "ALT-?",
      customer: o.customerName || "Customer",
      phone: o.phone || "—",
      item: o.productName || o.name || "—",
      brand: o.brand || prod?.brand || "",
      color: o.color || prod?.color || "",
      img,
      status: o.status || "reserved",
      amount: o.depositPaid ?? o.price ?? 0,
      date: o.createdAt ? o.createdAt.slice(0, 10) : "—",
      wantVideo: !!o.wantVideo,
      size: o.selectedSize || "—",
      notes: o.notes || "",
    };
  });

  const filtered = orderList.filter(o => {
    if (statusFilter !== "all" && o.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return o.orderId.toLowerCase().includes(q) || o.customer.toLowerCase().includes(q) || o.item.toLowerCase().includes(q);
    }
    return true;
  });

  const updateStatus = (orderId, newStatus) => {
    if (newStatus === "cancelled") {
      if (!window.confirm(`Are you sure you want to cancel order ${orderId}? This action cannot be undone.`)) return;
    }
    api.updateOrderStatus(orderId, newStatus)
      .then(() => {
        setOrders(prev => prev.map(o => o.orderId === orderId ? { ...o, status: newStatus } : o));
        toast(`Order ${orderId} → ${newStatus}`, "success");
      })
      .catch(() => toast(`Failed to update ${orderId}`, "error"));
  };

  const exportCSV = () => {
    const headers = ["Order ID","Customer","WhatsApp","Item","Size","Status","Amount","Date","Video Verification","Notes"];
    const rows = filtered.map(o => [csvSafe(o.orderId), csvSafe(o.customer), csvSafe(o.phone), csvSafe(o.item), csvSafe(o.size), csvSafe(o.status), csvSafe(o.amount), csvSafe(o.date), csvSafe(o.wantVideo ? "Yes" : "No"), csvSafe(o.notes)]);
    const csv = [headers, ...rows].map(r => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "orders.csv"; a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    toast("Orders exported", "success");
  };

  const inputStyle = { ...T.bodySm, width: "100%", padding: "10px 14px", border: `1px solid ${C.lgray}`, background: C.offwhite, color: C.black, outline: "none", fontSize: 13 };
  const thStyle = { ...T.labelSm, color: C.gray, fontSize: 10, padding: "12px 14px", textAlign: "left", fontWeight: 600 };

  return (
    <div style={{ background: C.cream, marginBottom: 40, animation: "fadeUp 0.3s ease" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 20px", borderBottom: `1px solid ${C.lgray}` }}>
        <p style={{ ...T.label, color: C.black, fontSize: 12 }}>{L?.allOrders||"All Orders"}</p>
        <p style={{ ...T.labelSm, color: C.gray, fontSize: 10 }}>{filtered.length} {L?.ordersTotal||"orders total"}</p>
      </div>

      {/* Search + Filter */}
      <div style={{ padding: "16px 20px", borderBottom: `1px solid ${C.lgray}`, display: "flex", flexWrap: "wrap", gap: 12, alignItems: "center" }}>
        <div style={{ flex: "1 1 240px", maxWidth: 360, position: "relative" }}>
          <input type="text" placeholder={L?.searchOrders||"Search orders..."} value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
            style={{ ...inputStyle, paddingLeft: 14, fontSize: 12 }} />
          {searchQuery && (
            <button onClick={() => setSearchQuery("")}
              style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", padding: 2, lineHeight: 0 }}>
              <IconCross size={12} />
            </button>
          )}
        </div>
        <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
          {[{ key: "all", label: L?.filterAll||"All" }, ...ORDER_STATUSES].map(s => (
            <button key={s.key} onClick={() => setStatusFilter(s.key)}
              style={{
                ...T.labelSm, fontSize: 11, padding: "7px 14px",
                border: `1px solid ${statusFilter === s.key ? C.tan : C.lgray}`,
                background: statusFilter === s.key ? C.tan : "transparent",
                color: statusFilter === s.key ? C.white : C.gray,
                cursor: "pointer", transition: "all 0.2s",
              }}>
              {s.label}
            </button>
          ))}
        </div>
        {refreshData && (
          <HoverBtn onClick={refreshData} variant="ghost" style={{ padding: "7px 14px", fontSize: 10 }}>
            {L?.adminRefresh||"Refresh"}
          </HoverBtn>
        )}
        <HoverBtn onClick={exportCSV} variant="ghost" style={{ padding: "7px 14px", fontSize: 10, marginLeft: "auto" }}>
          {L?.adminExportCSV||"Export CSV"}
        </HoverBtn>
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div style={{ padding: "48px 20px", textAlign: "center" }}>
          <p style={{ ...T.bodySm, color: C.gray }}>{L?.adminNoOrdersFound||"No orders found"}</p>
        </div>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 900 }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${C.lgray}`, background: C.offwhite }}>
                {[L?.adminOrderId||"Order ID", L?.adminCustomer||"Customer", L?.adminWhatsApp||"WhatsApp", L?.adminItem||"Item", L?.adminStatus||"Status", L?.adminUpdateStatus||"Update Status", L?.adminAmount||"Amount", L?.adminDate||"Date"].map(h => (
                  <th key={h} style={thStyle}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((o, i) => (
                <Fragment key={o.orderId + "-" + i}>
                  <tr
                    style={{ borderBottom: `1px solid ${C.lgray}`, cursor: "pointer", transition: "background 0.15s" }}
                    onMouseEnter={e => e.currentTarget.style.background = C.offwhite}
                    onMouseLeave={e => e.currentTarget.style.background = expandedOrder === o.orderId ? C.offwhite : "transparent"}
                    onClick={() => setExpandedOrder(expandedOrder === o.orderId ? null : o.orderId)}
                  >
                    <td style={{ ...T.labelSm, color: C.tan, padding: "12px 14px", fontSize: 11 }}>
                      {o.orderId}
                      {o.wantVideo && <span style={{ marginLeft: 6, ...T.labelSm, fontSize: 9, color: C.tan, padding: "2px 6px", border: `1px solid ${C.tan}` }}>VID</span>}
                    </td>
                    <td style={{ ...T.bodySm, color: C.black, padding: "12px 14px" }}>{o.customer}</td>
                    <td style={{ ...T.bodySm, color: C.gray, padding: "12px 14px", fontSize: 12 }}>{o.phone}</td>
                    <td style={{ ...T.bodySm, color: C.black, padding: "12px 14px", maxWidth: 220 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        {o.img ? (
                          <img src={o.img} alt={o.item} style={{ width: 40, height: 40, objectFit: "cover", flexShrink: 0, background: "#f5f5f3", borderRadius: 2 }} />
                        ) : (
                          <div style={{ width: 40, height: 40, flexShrink: 0, background: "#f0ede8", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 2 }}>
                            <span style={{ fontSize: 14, color: C.lgray, fontFamily: "'Alido',serif" }}>{(o.brand || o.item || "A").charAt(0)}</span>
                          </div>
                        )}
                        <div style={{ overflow: "hidden" }}>
                          <p style={{ ...T.labelSm, fontSize: 9, color: C.tan, marginBottom: 1 }}>{o.brand}</p>
                          <p style={{ ...T.bodySm, fontSize: 12, color: C.black, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{o.item}</p>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: "12px 14px" }}>
                      <span style={{ ...T.labelSm, fontSize: 10, padding: "4px 10px", background: STATUS_COLOR[o.status] || C.gray, color: C.white }}>{o.status}</span>
                    </td>
                    <td style={{ padding: "12px 14px" }} onClick={e => e.stopPropagation()}>
                      <select value={o.status} onChange={e => updateStatus(o.orderId, e.target.value)}
                        style={{ ...T.labelSm, fontSize: 10, padding: "6px 10px", border: `1px solid ${C.lgray}`, background: C.cream, color: C.black, cursor: "pointer", outline: "none" }}>
                        {ORDER_STATUSES.map(s => <option key={s.key} value={s.key}>{s.label}</option>)}
                      </select>
                    </td>
                    <td style={{ ...T.bodySm, color: C.black, padding: "12px 14px" }}>GEL {o.amount}</td>
                    <td style={{ ...T.labelSm, color: C.gray, padding: "12px 14px", fontSize: 10 }}>{o.date}</td>
                  </tr>
                  {expandedOrder === o.orderId && (
                    <tr style={{ background: C.offwhite }}>
                      <td colSpan={8} style={{ padding: "16px 20px", borderBottom: `1px solid ${C.lgray}` }}>
                        <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr" : "auto 1fr 1fr 1fr", gap: 20, alignItems: "start" }}>
                          {o.img && (
                            <img src={o.img} alt={o.item} style={{ width: 72, height: 90, objectFit: "cover", background: "#f5f5f3", borderRadius: 2 }} />
                          )}
                          <div>
                            <p style={{ ...T.labelSm, color: C.gray, fontSize: 10, marginBottom: 4 }}>{L?.adminOrderDetails||"ORDER DETAILS"}</p>
                            {o.brand && <p style={{ ...T.labelSm, fontSize: 10, color: C.tan, marginBottom: 2 }}>{o.brand}</p>}
                            <p style={{ ...T.bodySm, color: C.black, marginBottom: 4 }}>{o.item}</p>
                            {o.color && <p style={{ ...T.bodySm, color: C.gray, fontSize: 12, marginBottom: 2 }}>{L?.adminColor||"Color"}: {o.color}</p>}
                            <p style={{ ...T.bodySm, color: C.gray, fontSize: 12 }}>{L?.adminSize||"Size"}: {o.size}</p>
                          </div>
                          <div>
                            <p style={{ ...T.labelSm, color: C.gray, fontSize: 10, marginBottom: 4 }}>{L?.adminVideoVerification||"VIDEO VERIFICATION"}</p>
                            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                              {o.wantVideo
                                ? <><IconCheck size={14} color={C.green} /><span style={{ ...T.bodySm, color: C.green }}>{L?.adminVideoRequested||"Requested"} (+{VIDEO_VERIFICATION_GEL} GEL)</span></>
                                : <><IconCross size={14} color={C.gray} /><span style={{ ...T.bodySm, color: C.gray }}>{L?.adminVideoNotRequested||"Not requested"}</span></>
                              }
                            </div>
                          </div>
                          <div>
                            <p style={{ ...T.labelSm, color: C.gray, fontSize: 10, marginBottom: 4 }}>{L?.adminNotes||"NOTES"}</p>
                            <p style={{ ...T.bodySm, color: o.notes ? C.black : C.gray, marginBottom: 12 }}>{o.notes || (L?.adminNoNotes||"No notes")}</p>
                            {/* Send Media Button */}
                            <button
                              onClick={(e) => { e.stopPropagation(); setMediaModal({ orderId: o.orderId, item: o.item }); }}
                              style={{
                                ...T.labelSm, fontSize: 10, padding: "8px 16px",
                                background: C.tan, color: C.white, border: "none", cursor: "pointer",
                                display: "flex", alignItems: "center", gap: 6, transition: "opacity 0.2s",
                              }}
                              onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
                              onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                            >
                              <IconCamera size={13} color="#fff" /> {L?.adminSendMedia || "SEND MEDIA"}
                            </button>
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

      {/* Send Media Modal */}
      {mediaModal && (
        <SendMediaModal
          orderId={mediaModal.orderId}
          orderItem={mediaModal.item}
          onClose={() => setMediaModal(null)}
          toast={toast}
          L={L}
        />
      )}
    </div>
  );
}
