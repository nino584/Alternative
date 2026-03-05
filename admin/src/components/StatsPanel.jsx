import { C, T } from '../constants/theme.js';
import { VIDEO_VERIFICATION_GEL } from '../constants/config.js';

const ORDER_STATUSES_BASE = [
  { key: "reserved", label: "Reserved", color: C.brown },
  { key: "confirmed", label: "Confirmed", color: "#1a5c8b" },
  { key: "shipped", label: "Shipped", color: C.green },
  { key: "delivered", label: "Delivered", color: C.gray },
];
const STATUS_COLOR = Object.fromEntries(ORDER_STATUSES_BASE.map(s => [s.key, s.color]));

export default function StatsPanel({ orders, mobile, L }) {
  const ORDER_STATUSES = ORDER_STATUSES_BASE.map(s => ({
    ...s,
    label: L?.[`adminStatus_${s.key}`] || s.label,
  }));
  const orderList = orders.map(o => ({
    item: o.productName || o.name || "—",
    status: o.status || "reserved",
    amount: o.depositPaid ?? o.price ?? 0,
    wantVideo: !!o.wantVideo,
  }));

  const totalRevenue = orderList.reduce((s, o) => s + o.amount, 0);
  const videoOrders = orderList.filter(o => o.wantVideo).length;
  const videoRate = orderList.length > 0 ? Math.round((videoOrders / orderList.length) * 100) : 0;

  const revenueByStatus = ORDER_STATUSES.map(s => ({
    label: s.label, key: s.key,
    value: orderList.filter(o => o.status === s.key).reduce((sum, o) => sum + o.amount, 0),
  }));
  const maxRevenue = Math.max(...revenueByStatus.map(r => r.value), 1);

  const categoryCount = {};
  orderList.forEach(o => {
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
    label: s.label, key: s.key,
    count: orderList.filter(o => o.status === s.key).length,
  }));
  const maxStatusCount = Math.max(...ordersByStatus.map(s => s.count), 1);

  return (
    <div style={{ marginBottom: 40, animation: "fadeUp 0.3s ease" }}>

      {/* Row 1: Revenue by Status + Video Rate */}
      <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr" : "2fr 1fr", gap: 3, marginBottom: 3 }}>
        <div style={{ background: C.cream, padding: 24 }}>
          <p style={{ ...T.label, color: C.black, fontSize: 12, marginBottom: 20 }}>{L?.adminRevenueByStatus||"Revenue by Status"}</p>
          {revenueByStatus.map(r => (
            <div key={r.key} style={{ marginBottom: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                <span style={{ ...T.bodySm, color: C.black }}>{r.label}</span>
                <span style={{ ...T.label, color: C.tan, fontSize: 11 }}>GEL {r.value.toLocaleString()}</span>
              </div>
              <div style={{ width: "100%", height: 6, background: C.lgray }}>
                <div style={{ width: `${(r.value / maxRevenue) * 100}%`, height: "100%", background: STATUS_COLOR[r.key], transition: "width 0.6s ease" }} />
              </div>
            </div>
          ))}
          <div style={{ marginTop: 18, paddingTop: 14, borderTop: `1px solid ${C.lgray}`, display: "flex", justifyContent: "space-between" }}>
            <span style={{ ...T.label, color: C.black, fontSize: 11 }}>TOTAL</span>
            <span style={{ fontFamily: "'Alido',serif", fontSize: 24, fontWeight: 300, color: C.black }}>GEL {totalRevenue.toLocaleString()}</span>
          </div>
        </div>

        <div style={{ background: C.cream, padding: 24, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div>
            <p style={{ ...T.label, color: C.black, fontSize: 12, marginBottom: 20 }}>{L?.adminVideoVerifRate||"Video Verification Rate"}</p>
            <div style={{ textAlign: "center", padding: "20px 0" }}>
              <p style={{ fontFamily: "'Alido',serif", fontSize: 52, fontWeight: 300, color: C.tan, lineHeight: 1 }}>{videoRate}%</p>
              <p style={{ ...T.labelSm, color: C.gray, fontSize: 11, marginTop: 8 }}>{videoOrders} {L?.adminOf||"of"} {orderList.length} {L?.adminOrders||"orders"}</p>
            </div>
          </div>
          <div style={{ background: C.offwhite, padding: 14 }}>
            <p style={{ ...T.bodySm, color: C.gray, fontSize: 11 }}>{L?.adminAddonPrice||"Add-on price"}: <span style={{ color: C.black, fontWeight: 500 }}>{VIDEO_VERIFICATION_GEL} GEL</span></p>
            <p style={{ ...T.bodySm, color: C.gray, fontSize: 11, marginTop: 4 }}>{L?.adminEstAddonRevenue||"Estimated add-on revenue"}: <span style={{ color: C.tan, fontWeight: 500 }}>{(videoOrders * VIDEO_VERIFICATION_GEL).toLocaleString()} GEL</span></p>
          </div>
        </div>
      </div>

      {/* Row 2: Best Selling Categories + Orders by Status */}
      <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr" : "1fr 1fr", gap: 3 }}>
        <div style={{ background: C.cream, padding: 24 }}>
          <p style={{ ...T.label, color: C.black, fontSize: 12, marginBottom: 20 }}>{L?.adminBestCategories||"Best Selling Categories"}</p>
          {bestCategories.length === 0 ? (
            <p style={{ ...T.bodySm, color: C.gray }}>{L?.adminNoData||"No data yet"}</p>
          ) : bestCategories.map(([cat, count]) => (
            <div key={cat} style={{ marginBottom: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                <span style={{ ...T.bodySm, color: C.black }}>{cat}</span>
                <span style={{ ...T.labelSm, color: C.gray, fontSize: 11 }}>{count} {L?.adminOrders||"orders"}</span>
              </div>
              <div style={{ width: "100%", height: 6, background: C.lgray }}>
                <div style={{ width: `${(count / maxCatCount) * 100}%`, height: "100%", background: C.tan, transition: "width 0.6s ease" }} />
              </div>
            </div>
          ))}
        </div>

        <div style={{ background: C.cream, padding: 24 }}>
          <p style={{ ...T.label, color: C.black, fontSize: 12, marginBottom: 20 }}>{L?.adminOrdersByStatus||"Orders by Status"}</p>
          {ordersByStatus.map(s => (
            <div key={s.key} style={{ marginBottom: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ width: 8, height: 8, background: STATUS_COLOR[s.key], display: "inline-block" }} />
                  <span style={{ ...T.bodySm, color: C.black }}>{s.label}</span>
                </div>
                <span style={{ ...T.labelSm, color: C.gray, fontSize: 11 }}>{s.count} {L?.adminOrders||"orders"}</span>
              </div>
              <div style={{ width: "100%", height: 6, background: C.lgray }}>
                <div style={{ width: `${maxStatusCount > 0 ? (s.count / maxStatusCount) * 100 : 0}%`, height: "100%", background: STATUS_COLOR[s.key], transition: "width 0.6s ease" }} />
              </div>
            </div>
          ))}
          <div style={{ marginTop: 18, paddingTop: 14, borderTop: `1px solid ${C.lgray}`, display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
            <span style={{ ...T.label, color: C.black, fontSize: 11 }}>TOTAL</span>
            <span style={{ fontFamily: "'Alido',serif", fontSize: 24, fontWeight: 300, color: C.black }}>{orderList.length}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
