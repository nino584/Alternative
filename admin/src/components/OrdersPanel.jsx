import { useState, Fragment } from 'react';
import { C, T } from '../constants/theme.js';
import { VIDEO_VERIFICATION_GEL } from '../constants/config.js';
import HoverBtn from './HoverBtn.jsx';
import { api } from '../api.js';

const ORDER_STATUSES = [
  { key: "reserved", label: "Reserved", color: C.brown },
  { key: "sourcing", label: "Sourcing", color: C.tan },
  { key: "confirmed", label: "Confirmed", color: "#1a5c8b" },
  { key: "shipped", label: "Shipped", color: C.green },
  { key: "delivered", label: "Delivered", color: C.gray },
];

const STATUS_COLOR = Object.fromEntries(ORDER_STATUSES.map(s => [s.key, s.color]));

const IconCheck = ({ size = 16, color = C.tan, stroke = 1.5 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={stroke}><path d="M20 6L9 17l-5-5" /></svg>
);
const IconCross = ({ size = 16, color = C.gray, stroke = 1.5 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={stroke}><path d="M18 6L6 18M6 6l12 12" /></svg>
);

export default function OrdersPanel({ orders, setOrders, mobile, toast, L }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [expandedOrder, setExpandedOrder] = useState(null);

  const orderList = orders.map(o => ({
    orderId: o.orderId || "ALT-?",
    customer: o.customerName || "Customer",
    phone: o.phone || "—",
    item: o.productName || o.name || "—",
    status: o.status || "reserved",
    amount: o.depositPaid || o.price || 0,
    date: o.createdAt ? o.createdAt.slice(0, 10) : "—",
    wantVideo: !!o.wantVideo,
    size: o.selectedSize || "—",
    notes: o.notes || "",
  }));

  const filtered = orderList.filter(o => {
    if (statusFilter !== "all" && o.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return o.orderId.toLowerCase().includes(q) || o.customer.toLowerCase().includes(q) || o.item.toLowerCase().includes(q);
    }
    return true;
  });

  const updateStatus = (orderId, newStatus) => {
    api.updateOrderStatus(orderId, newStatus)
      .then(() => {
        setOrders(prev => prev.map(o => o.orderId === orderId ? { ...o, status: newStatus } : o));
        toast(`Order ${orderId} → ${newStatus}`, "success");
      })
      .catch(() => toast(`Failed to update ${orderId}`, "error"));
  };

  const exportCSV = () => {
    const headers = ["Order ID","Customer","WhatsApp","Item","Size","Status","Amount","Date","Video Verification","Notes"];
    const rows = filtered.map(o => [o.orderId, o.customer, o.phone, `"${o.item}"`, o.size, o.status, o.amount, o.date, o.wantVideo ? "Yes" : "No", `"${(o.notes||"").replace(/"/g,'""')}"`]);
    const csv = [headers, ...rows].map(r => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "orders.csv"; a.click();
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
        <HoverBtn onClick={exportCSV} variant="ghost" style={{ padding: "7px 14px", fontSize: 10, marginLeft: "auto" }}>
          Export CSV
        </HoverBtn>
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div style={{ padding: "48px 20px", textAlign: "center" }}>
          <p style={{ ...T.bodySm, color: C.gray }}>No orders found</p>
        </div>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 900 }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${C.lgray}`, background: C.offwhite }}>
                {["Order ID", "Customer", "WhatsApp", "Item", "Status", "Update Status", "Amount", "Date"].map(h => (
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
                    <td style={{ ...T.bodySm, color: C.black, padding: "12px 14px", maxWidth: 160, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{o.item}</td>
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
                        <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr" : "1fr 1fr 1fr", gap: 20 }}>
                          <div>
                            <p style={{ ...T.labelSm, color: C.gray, fontSize: 10, marginBottom: 4 }}>ORDER DETAILS</p>
                            <p style={{ ...T.bodySm, color: C.black, marginBottom: 4 }}>{o.item}</p>
                            <p style={{ ...T.bodySm, color: C.gray, fontSize: 12 }}>Size: {o.size}</p>
                          </div>
                          <div>
                            <p style={{ ...T.labelSm, color: C.gray, fontSize: 10, marginBottom: 4 }}>VIDEO VERIFICATION</p>
                            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                              {o.wantVideo
                                ? <><IconCheck size={14} color={C.green} /><span style={{ ...T.bodySm, color: C.green }}>Requested (+{VIDEO_VERIFICATION_GEL} GEL)</span></>
                                : <><IconCross size={14} color={C.gray} /><span style={{ ...T.bodySm, color: C.gray }}>Not requested</span></>
                              }
                            </div>
                          </div>
                          <div>
                            <p style={{ ...T.labelSm, color: C.gray, fontSize: 10, marginBottom: 4 }}>NOTES</p>
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
  );
}
